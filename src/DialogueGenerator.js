/**
 * Political Debate Generator
 *
 * This module creates debate conversations for political topics
 * with 3 rounds and 5 responses per round, using AI to create natural responses.
 */

const Cerebras = require("@cerebras/cerebras_cloud_sdk");

// System prompt - simple and clear for natural responses
const SYSTEM_PROMPT = `
You are a skilled political commentator engaging in thoughtful debate. 
Present well-reasoned arguments while maintaining a respectful tone. 
Respond naturally to what your opponent says, and make each response unique and authentic.  
Use clear, everyday language that educated adults can easily understand. Avoid jargon, overly complex words, or academic terminology.
Use analogies, compelling arguments, and references to make your points relatable and understandable to a general audience. 
Focus on simple but powerful words and phrases that convey your message effectively.
Ensure each response relates to the previous speaker's points, creating a natural flow of conversation. 
At the end of each dialogue, pose a question challenging the other side's validity.
`;

// User prompt template from the attachment
const USER_PROMPT_TEMPLATE = `
Debate the following political issue: [TOPIC]. 
You will be assigned a side, either for or against the issue.
`;

// Debate structure: 3 rounds with 10 subrounds each (5 per debater)
// Only 3 types of responses: opening, counter, closing
const DEBATE_STRUCTURE = [
  {
    roundNumber: 1,
    title: "Round 1",
    subrounds: [
      { side: "A", type: "opening", description: "Side A Opening Statement" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "counter", description: "Side A Counter Response" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "counter", description: "Side A Counter Response" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "counter", description: "Side A Counter Response" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "closing", description: "Side A Round 1 Closing" },
      { side: "B", type: "closing", description: "Side B Round 1 Closing" },
    ],
  },
  {
    roundNumber: 2,
    title: "Round 2",
    subrounds: [
      { side: "A", type: "opening", description: "Side A Opening Statement" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "counter", description: "Side A Counter Response" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "counter", description: "Side A Counter Response" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "counter", description: "Side A Counter Response" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "closing", description: "Side A Round 2 Closing" },
      { side: "B", type: "closing", description: "Side B Round 2 Closing" },
    ],
  },
  {
    roundNumber: 3,
    title: "Round 3",
    subrounds: [
      { side: "A", type: "opening", description: "Side A Opening Statement" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "counter", description: "Side A Counter Response" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "counter", description: "Side A Counter Response" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "counter", description: "Side A Counter Response" },
      { side: "B", type: "counter", description: "Side B Counter Response" },
      { side: "A", type: "closing", description: "Side A Final Closing" },
      { side: "B", type: "closing", description: "Side B Final Closing" },
    ],
  },
];

/**
 * Generates contextual political commentary based on debate flow using AI
 */
class DialogueGenerator {
  constructor(apiConfig = {}) {
    this.debateHistory = [];
    this.apiConfig = {
      apiKey: apiConfig.apiKey || process.env.CEREBRAS_API_KEY,
      model: apiConfig.model || "qwen-3-235b-a22b-instruct-2507",
      maxTokens: apiConfig.maxTokens || 300, // Limit for ~150 words
      temperature: apiConfig.temperature || 0.6,
      topP: apiConfig.topP || 0.8,
      stream: apiConfig.stream !== undefined ? apiConfig.stream : true,
      ...apiConfig,
    };

    // Initialize Cerebras client
    this.cerebras = new Cerebras({
      apiKey: this.apiConfig.apiKey,
    });
  }

  /**
   * Call Cerebras LLM API to generate dialogue response
   */
  async callLLM(prompt, context = {}) {
    if (!this.apiConfig.apiKey) {
      console.warn("No Cerebras API key provided, using fallback response");
      return this.generateFallbackResponse(context);
    }

    try {
      return await this.callCerebrasAPI(prompt, context);
    } catch (error) {
      console.error("Cerebras API Error:", error.message);

      // Provide specific error context
      if (error.message.includes("Rate limit")) {
        console.error(
          "Consider implementing retry logic or reducing request frequency"
        );
      } else if (error.message.includes("API key")) {
        console.error("Set your CEREBRAS_API_KEY environment variable");
      }

      // Fallback to a basic response if API fails
      return this.generateFallbackResponse(context);
    }
  }

  /**
   * Call Cerebras API with streaming support
   */
  async callCerebrasAPI(prompt, context = {}) {
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    try {
      if (this.apiConfig.stream) {
        // Use streaming response
        const stream = await this.cerebras.chat.completions.create({
          messages: messages,
          model: this.apiConfig.model,
          stream: true,
          max_completion_tokens: this.apiConfig.maxTokens,
          temperature: this.apiConfig.temperature,
          top_p: this.apiConfig.topP,
        });

        let fullResponse = "";
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          fullResponse += content;
        }

        return fullResponse;
      } else {
        // Use non-streaming response
        const response = await this.cerebras.chat.completions.create({
          messages: messages,
          model: this.apiConfig.model,
          stream: false,
          max_completion_tokens: this.apiConfig.maxTokens,
          temperature: this.apiConfig.temperature,
          top_p: this.apiConfig.topP,
        });

        return response.choices[0]?.message?.content || "";
      }
    } catch (error) {
      if (error.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else if (error.status === 401 || error.status === 403) {
        throw new Error("Invalid API key or insufficient permissions.");
      } else if (error.status === 400) {
        throw new Error(`Invalid request: ${error.message}`);
      } else {
        throw new Error(`Cerebras API request failed: ${error.message}`);
      }
    }
  }

  /**
   * Generate a simple fallback response without AI
   */
  generateFallbackResponse(context = {}) {
    const { stance = "support", topic = "this issue" } = context;

    // Simple fallback response
    return `I ${stance} this position on ${topic}. This is an important issue that needs careful thought and respectful discussion between all people involved.`;
  }

  /**
   * Generate a dialogue response for a specific subround using AI
   */
  async generateDialogue({
    topic,
    side,
    subroundType,
    previousArguments = [],
    sideAName = "Supporting",
    sideBName = "Opposing",
  }) {
    const isProponent = side === "A";
    const speakerName = isProponent ? sideAName : sideBName;
    const opponentName = isProponent ? sideBName : sideAName;
    const stance = isProponent ? "support" : "oppose";
    const position = isProponent ? "in favor of" : "against";

    // Get the most recent opponent argument for direct response
    const lastOpponentArgument = this.getLastOpponentArgument(
      previousArguments,
      side
    );

    // Build context for the prompt
    const context = this.buildPromptContext({
      topic,
      stance,
      position,
      speakerName,
      opponentName,
      subroundType,
      lastOpponentArgument,
      previousArguments,
      sideAName,
      sideBName,
    });

    // Generate the dialogue using AI
    const content = await this.callLLM(context.prompt, context);

    return content;
  }

  /**
   * Build comprehensive prompt context for AI generation
   */
  buildPromptContext({
    topic,
    stance,
    position,
    speakerName,
    opponentName,
    subroundType,
    lastOpponentArgument,
    previousArguments,
    sideAName,
    sideBName,
  }) {
    // Build debate history
    let debateHistoryText = "";
    if (previousArguments.length > 0) {
      const recentArgs = previousArguments.slice(-2);
      debateHistoryText = "\n\nRecent discussion:\n";
      recentArgs.forEach((arg) => {
        const speaker = arg.side === "A" ? sideAName : sideBName;
        debateHistoryText += `${speaker}: ${arg.content.substring(
          0,
          150
        )}...\n`;
      });
    }

    // Build context about current position
    let responseContext = "";
    if (lastOpponentArgument) {
      responseContext = `\n\nResponding to ${stance} the topic: "${lastOpponentArgument.substring(
        0,
        200
      )}..."`;
    }

    // Define the specific task for this subround type
    const taskInstructions = this.getTaskInstructions(subroundType);

    // Build the complete prompt
    const prompt = `${USER_PROMPT_TEMPLATE.replace("[TOPIC]", topic)}

You are ${stance} the position on ${topic}. You are ${position} this issue.

Context: ${taskInstructions}

${debateHistoryText}${responseContext}

Generate a thoughtful, well-reasoned response that:
1. Stays true to your assigned position (${stance})
2. Addresses the specific task for this subround type
3. Responds appropriately to previous arguments
4. Maintains a respectful but firm debate tone
5. Uses clear, accessible language that avoids complex jargon or overly academic terms
6. Includes specific examples or analogies when helpful
7. Ends with a challenging question for your opponent (except in final closing statements)
8. Is concise and under 150 words
9. Speaks in a way that educated adults can easily follow and understand

Your response:`;

    return {
      prompt,
      topic,
      stance,
      speakerName,
      opponentName,
      subroundType,
    };
  }

  /**
   * Get context-aware guidance for the subround type
   * Only handles 3 types: opening, counter, closing
   */
  getTaskInstructions(subroundType) {
    switch (subroundType) {
      case "opening":
        return "This is your opening statement in the debate. Present your main arguments and set the foundation for your position.";
      case "counter":
        return "Respond to your opponent's perspective. Challenge their arguments, present evidence that contradicts their position, or offer alternative viewpoints.";
      case "closing":
        return "This is a concluding moment in the debate. Summarize your key points and make your final appeal.";
      default:
        // Fallback for any unexpected types
        return "Continue the debate naturally";
    }
  }
  getLastOpponentArgument(previousArguments, currentSide) {
    for (let i = previousArguments.length - 1; i >= 0; i--) {
      const arg = previousArguments[i];
      if (arg.side !== currentSide) {
        return arg.content;
      }
    }
    return null;
  }

  /**
   * Create an empty debate structure
   */
  static createEmptyDebate({
    topic,
    roundTopic1,
    roundTopic2,
    roundTopic3,
    sideAName = "Supporting",
    sideBName = "Opposing",
  } = {}) {
    const rounds = DEBATE_STRUCTURE.map((roundStructure, index) => {
      const roundTopics = [roundTopic1, roundTopic2, roundTopic3];
      const specificTopic =
        roundTopics[index] && roundTopics[index].trim()
          ? roundTopics[index]
          : `${topic} - ${roundStructure.title}`;

      // Use the specific round topic as the title if provided, otherwise use the default
      const roundTitle =
        roundTopics[index] && roundTopics[index].trim()
          ? roundTopics[index]
          : roundStructure.title;

      return {
        roundNumber: roundStructure.roundNumber,
        title: roundTitle,
        topic: specificTopic,
        subrounds: roundStructure.subrounds.map(
          (subroundStructure, subIndex) => ({
            subroundNumber: subIndex + 1,
            type: subroundStructure.type,
            description: subroundStructure.description,
            assignedSide: subroundStructure.side,
            sides: {
              A: {
                speakerLabel: sideAName,
                position: `${sideAName} (FOR)`,
                text: "",
                audioUrl: null,
                isAssigned: subroundStructure.side === "A",
              },
              B: {
                speakerLabel: sideBName,
                position: `${sideBName} (AGAINST)`,
                text: "",
                audioUrl: null,
                isAssigned: subroundStructure.side === "B",
              },
            },
          })
        ),
      };
    });

    return {
      debateId: `debate_${Date.now()}`,
      topic,
      roundTopic1,
      roundTopic2,
      roundTopic3,
      sideAName,
      sideBName,
      rounds,
    };
  }
}

module.exports = {
  DialogueGenerator,
  DEBATE_STRUCTURE,
  SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE,
};

// Also export for ES6 compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports.default = DialogueGenerator;
}

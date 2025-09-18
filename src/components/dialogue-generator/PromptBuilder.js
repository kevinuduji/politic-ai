/**
 * Prompt Builder for Political Debates
 *
 * This module handles the creation and formatting of prompts for AI-generated
 * political debate responses, including system prompts and contextual user prompts.
 */

const { getTaskInstructions } = require("./DebateStructure");

// System prompt - simple and clear for natural responses
const SYSTEM_PROMPT = `
You are a skilled political commentator engaging in thoughtful debate. 
Present well-reasoned arguments while maintaining a respectful tone. 
Respond naturally to what your opponent says, and make each response unique and authentic.  
Use clear, everyday language that educated adults can easily understand. Avoid jargon, overly complex words, or academic terminology.
Use analogies, compelling arguments, and references to make your points relatable and understandable to a general audience. 
Focus on simple but powerful words and phrases that convey your message effectively.
Ensure each response relates to the previous speaker's points, creating a natural flow of conversation.

IMPORTANT RESPONSE GUIDELINES:
- NEVER use em dashes in your responses.
- NEVER blatantly agree with your opponent. Instead of direct agreement, use nuanced acknowledgments like:
  "Your argument about [specific point] was compelling, however..."
  "I understand how you could think [specific viewpoint], but there's more to consider..."
  "There's merit to what you said about [specific aspect], though I believe..."
  "That's an interesting perspective on [specific topic], yet..."
  "I see why [specific reasoning] might seem logical, but..."
- You can acknowledge strong points while maintaining your position
- Always transition smoothly from acknowledgment to your counter-argument
- Sometimes jump straight into your counter-argument without acknowledgment if it flows better

At the end of each dialogue, pose a question challenging the other side's validity.
`;

// User prompt template from the attachment
const USER_PROMPT_TEMPLATE = `
You will be debating the following question: [TOPIC]. 
You will be assigned a side, either for or against the position implied by the question.
`;

/**
 * PromptBuilder class handles the creation of AI prompts for debate responses
 */
class PromptBuilder {
  /**
   * Build comprehensive prompt context for AI generation
   */
  static buildPromptContext({
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
      responseContext = `\n\nResponding to ${stance} the question and argument: "${lastOpponentArgument.substring(
        0,
        200
      )}..."`;
    }

    // Define the specific task for this subround type
    const taskInstructions = getTaskInstructions(subroundType);

    // Special handling for reflection subrounds
    if (subroundType === "reflection") {
      const prompt = `${USER_PROMPT_TEMPLATE.replace("[TOPIC]", topic)}

You have just completed a debate on: ${topic}, where you argued ${position} the position implied by this question.

Context: ${taskInstructions}

${debateHistoryText}

Now, step back and reflect on the arguments you found most difficult to debate against. Generate a thoughtful reflection that:
1. Identifies specific arguments your opponent made that you found challenging to counter
2. Explains why these particular arguments were difficult for you to address effectively
3. References actual quotes or specific points from your opponent's statements during the debate
4. Analyzes what made these opposing arguments compelling or hard to refute
5. Discusses any weaknesses in your own position that became apparent through these challenges
6. Maintains intellectual honesty about the difficulty you faced with certain counterpoints
7. Uses clear, accessible language and maintains a respectful tone
8. Stays true to your overall position while acknowledging the strength of specific opposing arguments
9. Is concise and no more than 200 words
10. Does not change your overall position, but shows you understand the merit in some opposing points
11. Never uses em dashes.
Focus on being specific about which opponent arguments gave you the most trouble and why they were effective against your position.

Your reflection:`;

      return {
        prompt,
        topic,
        stance,
        speakerName,
        opponentName,
        subroundType,
      };
    }

    // Special handling for post-debate subrounds
    if (subroundType === "post-debate") {
      const prompt = `${USER_PROMPT_TEMPLATE.replace("[TOPIC]", topic)}

You have just completed an entire debate on: ${topic}, where you argued ${position} the position implied by this question.

Context: ${taskInstructions}

${debateHistoryText}

Now that the formal debate has concluded, this is your opportunity to share any additional information or arguments you wish you had included during the debate. Generate your final remarks that:

1. Begin by explicitly stating what you wish you had mentioned or forgot to include during the debate (e.g., "I wish I had emphasized..." or "I forgot to mention..." or "I should have brought up...")
2. Elaborate on those additional points with specific details, evidence, or examples
3. Explain why these points would have strengthened your position
4. Present any compelling arguments or data that you didn't have time to fully develop during the formal rounds
5. Address any missed opportunities to counter your opponent's strongest points
6. Maintain the same respectful tone you've used throughout the debate
7. Stay true to your overall position while adding substantive new information
8. Use clear, accessible language that educated adults can easily understand
9. Is approximately 200 words
10. Does not simply repeat what you've already said, but adds genuinely new content
11. Never uses em dashes.

Focus on presenting the most compelling additional arguments or information that you believe would have made your case even stronger.

Your final remarks:`;

      return {
        prompt,
        topic,
        stance,
        speakerName,
        opponentName,
        subroundType,
      };
    }

    // Build the complete prompt for non-reflection subrounds
    const prompt = `${USER_PROMPT_TEMPLATE.replace("[TOPIC]", topic)}

You are ${stance} the position implied by: ${topic}. You are ${position} this position.

Context: ${taskInstructions}

${debateHistoryText}${responseContext}

Generate a thoughtful, well-reasoned response that:
1. Stays true to your assigned position (${stance})
2. Addresses the specific task for this subround type
3. Responds appropriately to previous arguments without blatant agreement
4. Uses nuanced acknowledgments if referencing opponent points (e.g., "Your argument about X was compelling, however..." or "I understand how you could think Y, but...")
5. Never uses em dashes.
6. Maintains a respectful but firm debate tone
7. Uses clear, accessible language that avoids complex jargon or overly academic terms
8. Includes specific examples or analogies when helpful
9. Ends with a challenging question for your opponent (except in final closing statements)
10. Is concise and under 150 words
11. Speaks in a way that educated adults can easily follow and understand

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
   * Get the system prompt for AI interactions
   */
  static getSystemPrompt() {
    return SYSTEM_PROMPT;
  }

  /**
   * Get the user prompt template
   */
  static getUserPromptTemplate() {
    return USER_PROMPT_TEMPLATE;
  }
}

module.exports = {
  PromptBuilder,
  SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATE,
};

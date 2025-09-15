/**
 * Prompt Builder for Political Debates
 *
 * This module handles the creation and formatting of prompts for AI-generated
 * political debate responses, including system prompts and contextual user prompts.
 */

const { getTaskInstructions } = require('./DebateStructure');

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
      responseContext = `\n\nResponding to ${stance} the topic: "${lastOpponentArgument.substring(
        0,
        200
      )}..."`;
    }

    // Define the specific task for this subround type
    const taskInstructions = getTaskInstructions(subroundType);

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
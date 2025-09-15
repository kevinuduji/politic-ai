/**
 * Political Debate Generator
 *
 * This module creates debate conversations for political topics
 * with 3 rounds and 5 responses per round, using AI to create natural responses.
 */

const { CerebrasClient } = require("./CerebrasClient");
const { PromptBuilder } = require("./PromptBuilder");
const { DebateFactory } = require("./DebateFactory");
const { getLastOpponentArgument } = require("./DebateStructure");

/**
 * Generates contextual political commentary based on debate flow using AI
 */
class DialogueGenerator {
  constructor(apiConfig = {}) {
    this.debateHistory = [];
    this.cerebrasClient = new CerebrasClient(apiConfig);
  }

  /**
   * Call Cerebras LLM API to generate dialogue response
   */
  async callLLM(prompt, context = {}) {
    return await this.cerebrasClient.callLLM(prompt, context);
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
    const lastOpponentArgument = getLastOpponentArgument(
      previousArguments,
      side
    );

    // Build context for the prompt
    const context = PromptBuilder.buildPromptContext({
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
   * Create an empty debate structure
   */
  static createEmptyDebate(config) {
    return DebateFactory.createEmptyDebate(config);
  }
}

// Import the needed constants for backward compatibility
const { DEBATE_STRUCTURE } = require("./DebateStructure");
const { SYSTEM_PROMPT, USER_PROMPT_TEMPLATE } = require("./PromptBuilder");

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

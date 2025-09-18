/**
 * Debate Factory
 *
 * This module handles the creation and initialization of debate structures,
 * including the setup of rounds, subrounds, and side assignments.
 */

const { DEBATE_STRUCTURE } = require("./DebateStructure");

/**
 * DebateFactory creates and configures debate structures
 */
class DebateFactory {
  /**
   * Create an empty debate structure with all required components
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
      // Handle topic mapping: Round 1 -> roundTopic1, Intermission -> topic, Round 2 -> roundTopic2, Round 3 -> roundTopic3, Post-Debate -> topic
      let specificTopic, roundTitle;

      if (roundStructure.title === "Intermission") {
        // Intermission uses the general topic
        specificTopic = topic;
        roundTitle = "Intermission";
      } else if (roundStructure.title === "Post-Debate") {
        // Post-Debate uses the general topic
        specificTopic = topic;
        roundTitle = "Post-Debate";
      } else {
        // Map Round 1 -> roundTopic1, Round 2 -> roundTopic2, Round 3 -> roundTopic3
        const roundTopics = [roundTopic1, roundTopic2, roundTopic3];
        const roundIndex =
          roundStructure.title === "Round 1"
            ? 0
            : roundStructure.title === "Round 2"
            ? 1
            : 2;

        specificTopic =
          roundTopics[roundIndex] && roundTopics[roundIndex].trim()
            ? roundTopics[roundIndex]
            : `${topic} - ${roundStructure.title}`;

        // Use the specific round topic as the title if provided, otherwise use the default
        roundTitle =
          roundTopics[roundIndex] && roundTopics[roundIndex].trim()
            ? roundTopics[roundIndex]
            : roundStructure.title;
      }

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

  /**
   * Validate debate configuration parameters
   */
  static validateDebateConfig(config) {
    const { topic, sideAName, sideBName } = config;

    if (!topic || typeof topic !== "string" || topic.trim() === "") {
      throw new Error("Topic is required and must be a non-empty string");
    }

    if (sideAName && typeof sideAName !== "string") {
      throw new Error("sideAName must be a string");
    }

    if (sideBName && typeof sideBName !== "string") {
      throw new Error("sideBName must be a string");
    }

    return true;
  }

  /**
   * Create a debate with validation
   */
  static createValidatedDebate(config) {
    this.validateDebateConfig(config);
    return this.createEmptyDebate(config);
  }
}

module.exports = {
  DebateFactory,
};

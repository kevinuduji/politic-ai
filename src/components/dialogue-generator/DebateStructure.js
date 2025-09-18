/**
 * Debate Structure Configuration
 *
 * This module defines the standard debate structure with rounds and subrounds.
 * Handles the configuration for 3 rounds with specific response types.
 */

// Debate structure: 3 rounds with intermission after Round 1
// Only 4 types of responses: opening, counter, closing, reflection
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
    title: "Intermission",
    subrounds: [
      {
        side: "A",
        type: "reflection",
        description: "Side A Reflection on Opponent's Strongest Points",
      },
      {
        side: "B",
        type: "reflection",
        description: "Side B Reflection on Opponent's Strongest Points",
      },
    ],
  },
  {
    roundNumber: 3,
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
    roundNumber: 4,
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
  {
    roundNumber: 5,
    title: "Post-Debate",
    subrounds: [
      {
        side: "A",
        type: "post-debate",
        description: "Side A Final Remarks - Additional Points",
      },
      {
        side: "B",
        type: "post-debate",
        description: "Side B Final Remarks - Additional Points",
      },
    ],
  },
];

/**
 * Get context-aware guidance for the subround type
 * Only handles 5 types: opening, counter, closing, reflection, post-debate
 */
function getTaskInstructions(subroundType) {
  switch (subroundType) {
    case "opening":
      return "This is your opening statement in the debate. Present your main arguments and set the foundation for your position.";
    case "counter":
      return "Respond to your opponent's perspective. Challenge their arguments, present evidence that contradicts their position, or offer alternative viewpoints.";
    case "closing":
      return "This is a concluding moment in the debate. Summarize your key points and make your final appeal.";
    case "reflection":
      return "Reflect thoughtfully on your opponent's strongest arguments during this debate. Acknowledge the points that challenged your position most effectively and discuss what made them difficult to counter. Maintain a respectful tone while sharing your honest assessment.";
    case "post-debate":
      return "Now that the formal debate has concluded, share any additional information or arguments you wish you had included during the debate. Begin by explicitly stating what you wish you had mentioned or forgot to include, then elaborate on those points.";
    default:
      // Fallback for any unexpected types
      return "Continue the debate naturally";
  }
}

/**
 * Get the last opponent argument from the debate history
 */
function getLastOpponentArgument(previousArguments, currentSide) {
  for (let i = previousArguments.length - 1; i >= 0; i--) {
    const arg = previousArguments[i];
    if (arg.side !== currentSide) {
      return arg.content;
    }
  }
  return null;
}

module.exports = {
  DEBATE_STRUCTURE,
  getTaskInstructions,
  getLastOpponentArgument,
};

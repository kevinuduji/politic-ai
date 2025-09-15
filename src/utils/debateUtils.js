import JSZip from "jszip";

// Lazy load DialogueGenerator to avoid initialization issues
let dialogueGenerator = null;

async function getDialogueGenerator() {
  if (!dialogueGenerator) {
    try {
      const { DialogueGenerator } = await import(
        "../components/dialogue-generator/DialogueGenerator"
      );
      dialogueGenerator = new DialogueGenerator({
        // For React apps, use REACT_APP_ prefixed environment variables
        apiKey:
          process.env.REACT_APP_CEREBRAS_API_KEY ||
          process.env.CEREBRAS_API_KEY,
      });
      console.log("DialogueGenerator initialized successfully");
    } catch (error) {
      console.error("Error initializing DialogueGenerator:", error);
      // Don't create fallback - let DialogueGenerator handle its own fallbacks
      throw error;
    }
  }
  return dialogueGenerator;
}

/**
 * Clean dialogue generation using DialogueGenerator
 * Passes parameters directly without interference
 */
export async function generateProfessionalDialogue({
  topic,
  side,
  roundTopic,
  subroundType,
  previousArguments = [],
  sideAName,
  sideBName,
}) {
  try {
    const generator = await getDialogueGenerator();

    // Pass parameters directly to DialogueGenerator without modification
    return await generator.generateDialogue({
      topic: roundTopic || topic,
      side,
      subroundType,
      previousArguments, // Pass arguments as-is - DialogueGenerator handles the format
      sideAName: sideAName || "Supporting",
      sideBName: sideBName || "Opposing",
    });
  } catch (error) {
    console.error("Error generating dialogue:", error);
    // Re-throw to let DialogueGenerator handle its own fallbacks
    throw error;
  }
}

export async function makeEmptyDebate({
  topic,
  roundTopic1,
  roundTopic2,
  roundTopic3,
  sideAName,
  sideBName,
} = {}) {
  try {
    // Import DialogueGenerator dynamically to get the createEmptyDebate method
    const { DialogueGenerator } = await import(
      "../components/dialogue-generator/DialogueGenerator"
    );
    return DialogueGenerator.createEmptyDebate({
      topic,
      roundTopic1,
      roundTopic2,
      roundTopic3,
      sideAName,
      sideBName,
    });
  } catch (error) {
    console.error("Error creating empty debate:", error);
    // Return a basic fallback structure
    return {
      debateId: `debate_${Date.now()}`,
      topic: topic || "Political Debate Topic",
      roundTopic1: roundTopic1 || "Round 1 Topic",
      roundTopic2: roundTopic2 || "Round 2 Topic",
      roundTopic3: roundTopic3 || "Round 3 Topic",
      sideAName: sideAName || "Supporting",
      sideBName: sideBName || "Opposing",
      rounds: [],
    };
  }
}

export function exportDebateToJSON(debate) {
  // Create separate data structures for Side A and Side B
  const sideAData = {
    debateId: debate.debateId,
    topic: debate.topic,
    sideName: debate.sideAName,
    position: "FOR",
    rounds: [],
  };

  const sideBData = {
    debateId: debate.debateId,
    topic: debate.topic,
    sideName: debate.sideBName,
    position: "AGAINST",
    rounds: [],
  };

  // Process each round and subround
  debate.rounds.forEach((round) => {
    const sideARound = {
      roundNumber: round.roundNumber,
      roundTopic: round.topic,
      subrounds: [],
    };

    const sideBRound = {
      roundNumber: round.roundNumber,
      roundTopic: round.topic,
      subrounds: [],
    };

    round.subrounds.forEach((subround) => {
      // Add Side A subround if it has text
      if (subround.sides.A.text) {
        sideARound.subrounds.push({
          subroundNumber: subround.subroundNumber,
          description: subround.description,
          type: subround.type,
          response: subround.sides.A.text,
          speakerLabel: subround.sides.A.speakerLabel,
        });
      }

      // Add Side B subround if it has text
      if (subround.sides.B.text) {
        sideBRound.subrounds.push({
          subroundNumber: subround.subroundNumber,
          description: subround.description,
          type: subround.type,
          response: subround.sides.B.text,
          speakerLabel: subround.sides.B.speakerLabel,
        });
      }
    });

    // Only add rounds that have subrounds with responses
    if (sideARound.subrounds.length > 0) {
      sideAData.rounds.push(sideARound);
    }
    if (sideBRound.subrounds.length > 0) {
      sideBData.rounds.push(sideBRound);
    }
  });

  // Create ZIP file
  const zip = new JSZip();

  // Add JSON files to ZIP with new naming scheme
  zip.file("supporting.json", JSON.stringify(sideAData, null, 2));
  zip.file("opposing.json", JSON.stringify(sideBData, null, 2));

  // Create a clean filename from the topic
  const cleanTopic = debate.topic
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .toLowerCase() // Convert to lowercase
    .substring(0, 50); // Limit length to 50 characters

  // Generate and download ZIP with topic-based filename
  zip.generateAsync({ type: "blob" }).then(function (content) {
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cleanTopic}_debate.zip`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

export function initializeDebateFromStorage() {
  const stored = localStorage.getItem("debate_demo");
  let storedDebate = null;

  if (stored) {
    try {
      storedDebate = JSON.parse(stored);
      // Check if the stored debate has the old structure (5 subrounds instead of 10)
      if (
        storedDebate.rounds &&
        storedDebate.rounds[0] &&
        storedDebate.rounds[0].subrounds.length !== 10
      ) {
        // Clear old structure and create new one
        localStorage.removeItem("debate_demo");
        storedDebate = null;
      }
    } catch (error) {
      console.error("Error parsing stored debate:", error);
      // If parsing fails, clear the stored data
      localStorage.removeItem("debate_demo");
      storedDebate = null;
    }
  }

  // Return stored debate or a simple fallback
  const fallback = {
    debateId: `debate_${Date.now()}`,
    topic: "Political Debate Topic",
    roundTopic1: "Round 1 Topic",
    roundTopic2: "Round 2 Topic",
    roundTopic3: "Round 3 Topic",
    sideAName: "Supporting",
    sideBName: "Opposing",
    rounds: [], // Empty rounds array - will trigger configuration
  };

  return storedDebate || fallback;
}

export function saveDebateToStorage(debate) {
  localStorage.setItem("debate_demo", JSON.stringify(debate));
}

export function clearDebateFromStorage() {
  localStorage.removeItem("debate_demo");
}

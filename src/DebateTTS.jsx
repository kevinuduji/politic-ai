import React, { useState, useEffect } from "react";
import "./DebateTTS.css";
import JSZip from "jszip";

// Lazy load DialogueGenerator to avoid initialization issues
let dialogueGenerator = null;

async function getDialogueGenerator() {
  if (!dialogueGenerator) {
    try {
      const { DialogueGenerator } = await import("./DialogueGenerator");
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
async function generateProfessionalDialogue({
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

async function makeEmptyDebate({
  topic,
  roundTopic1,
  roundTopic2,
  roundTopic3,
  sideAName,
  sideBName,
} = {}) {
  try {
    // Import DialogueGenerator dynamically to get the createEmptyDebate method
    const { DialogueGenerator } = await import("./DialogueGenerator");
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

export default function DebateTTS() {
  console.log("DebateTTS component rendering...");

  // Initialize with a simple fallback structure
  const [debate, setDebate] = useState(() => {
    console.log("Initializing debate state...");
    const stored = localStorage.getItem("debate_demo");
    let storedDebate = null;

    if (stored) {
      try {
        storedDebate = JSON.parse(stored);
        console.log("Loaded stored debate:", storedDebate?.topic);
        // Check if the stored debate has the old structure (5 subrounds instead of 10)
        if (
          storedDebate.rounds &&
          storedDebate.rounds[0] &&
          storedDebate.rounds[0].subrounds.length !== 10
        ) {
          // Clear old structure and create new one
          localStorage.removeItem("debate_demo");
          storedDebate = null;
          console.log("Cleared old debate structure");
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
      rounds: [],
    };

    console.log("Using debate:", storedDebate?.topic || fallback.topic);
    return storedDebate || fallback;
  });

  const [isConfiguring, setIsConfiguring] = useState(true);
  const [config, setConfig] = useState({
    topic: "",
    roundTopic1: "",
    roundTopic2: "",
    roundTopic3: "",
    sideAName: "",
    sideBName: "",
  });

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingInfo, setGeneratingInfo] = useState("");

  useEffect(() => {
    localStorage.setItem("debate_demo", JSON.stringify(debate));
  }, [debate]);

  async function handleConfigSubmit() {
    // Validate required fields
    if (!config.topic.trim()) {
      alert("Please enter a main topic");
      return;
    }
    if (!config.roundTopic1.trim()) {
      alert("Please enter a topic for Round 1");
      return;
    }
    if (!config.roundTopic2.trim()) {
      alert("Please enter a topic for Round 2");
      return;
    }
    if (!config.roundTopic3.trim()) {
      alert("Please enter a topic for Round 3");
      return;
    }
    if (!config.sideAName.trim()) {
      alert("Please enter a name for Side A");
      return;
    }
    if (!config.sideBName.trim()) {
      alert("Please enter a name for Side B");
      return;
    }

    const newDebate = await makeEmptyDebate(config);
    setDebate(newDebate);
    setIsConfiguring(false);
  }

  async function handleGenerate(roundIdx, subIdx, side) {
    const copy = structuredClone(debate);
    const round = copy.rounds[roundIdx];
    const subround = round.subrounds[subIdx];

    // Set loading state
    setIsGenerating(true);
    setGeneratingInfo(
      `Generating ${
        side === "A" ? copy.sideAName : copy.sideBName
      }'s response for ${round.title}...`
    );

    // Get previous arguments for context - convert to correct format for DialogueGenerator
    const previousArgs = [];
    for (let r = 0; r <= roundIdx; r++) {
      for (
        let s = 0;
        s < (r === roundIdx ? subIdx : copy.rounds[r].subrounds.length);
        s++
      ) {
        const prevSub = copy.rounds[r].subrounds[s];
        if (prevSub.sides.A.text) {
          previousArgs.push({ side: "A", content: prevSub.sides.A.text });
        }
        if (prevSub.sides.B.text) {
          previousArgs.push({ side: "B", content: prevSub.sides.B.text });
        }
      }
    }

    // Generate dialogue using AI
    setIsGenerating(true);
    setGeneratingInfo(`Generating ${subround.description}...`);

    try {
      const generatedText = await generateProfessionalDialogue({
        topic: copy.topic,
        roundNumber: round.roundNumber,
        subroundNumber: subround.subroundNumber,
        side,
        roundTopic: round.topic,
        subroundType: subround.type,
        previousArguments: previousArgs,
        sideAName: copy.sideAName,
        sideBName: copy.sideBName,
      });

      copy.rounds[roundIdx].subrounds[subIdx].sides[side].text = generatedText;
      setDebate(copy);
    } catch (error) {
      console.error("Error generating dialogue:", error);
      // Let DialogueGenerator handle its own fallbacks - only use minimal fallback if everything fails
      copy.rounds[roundIdx].subrounds[subIdx].sides[
        side
      ].text = `[Generation failed - please try again]`;
      setDebate(copy);
    } finally {
      setIsGenerating(false);
      setGeneratingInfo("");
    }
  }

  function exportJSON() {
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

    // Add JSON files to ZIP
    zip.file(
      `${debate.debateId}_SideA_${debate.sideAName}.json`,
      JSON.stringify(sideAData, null, 2)
    );
    zip.file(
      `${debate.debateId}_SideB_${debate.sideBName}.json`,
      JSON.stringify(sideBData, null, 2)
    );

    // Generate and download ZIP
    zip.generateAsync({ type: "blob" }).then(function (content) {
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${debate.debateId}_debate_responses.zip`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  async function clearCacheAndReset() {
    localStorage.removeItem("debate_demo");
    const newDebate = await makeEmptyDebate({
      topic: "",
      roundTopic1: "",
      roundTopic2: "",
      roundTopic3: "",
      sideAName: "",
      sideBName: "",
    });
    setDebate(newDebate);
  }

  // Manual generation functions
  async function generateNextSequential() {
    if (isGenerating) {
      console.log("Already generating, skipping...");
      return "Already generating...";
    }

    // Find the next ungenerated subround in sequence
    let nextSubround = null;
    for (let roundIdx = 0; roundIdx < debate.rounds.length; roundIdx++) {
      const round = debate.rounds[roundIdx];
      for (let subIdx = 0; subIdx < round.subrounds.length; subIdx++) {
        const subround = round.subrounds[subIdx];
        const assignedSide = subround.assignedSide;

        // Check if this subround needs generation
        if (!subround.sides[assignedSide].text) {
          nextSubround = {
            roundIdx,
            subIdx,
            side: assignedSide,
            round,
            subround,
          };
          break;
        }
      }
      if (nextSubround) break;
    }

    if (!nextSubround) {
      console.log("All subrounds completed");
      return "All subrounds have been generated!";
    }

    const { roundIdx, subIdx, side, round, subround } = nextSubround;
    console.log(
      `Generating subround ${roundIdx + 1}.${subIdx + 1} for side ${side} (${
        side === "A" ? debate.sideAName : debate.sideBName
      })`
    );

    // Set loading state
    setIsGenerating(true);
    setGeneratingInfo(
      `Generating ${
        side === "A" ? debate.sideAName : debate.sideBName
      }'s response for ${subround.description}...`
    );

    // Get previous arguments for context - convert to correct format for DialogueGenerator
    const previousArgs = [];
    for (let r = 0; r <= roundIdx; r++) {
      for (
        let s = 0;
        s < (r === roundIdx ? subIdx : debate.rounds[r].subrounds.length);
        s++
      ) {
        const prevSub = debate.rounds[r].subrounds[s];
        if (prevSub.sides.A.text) {
          previousArgs.push({ side: "A", content: prevSub.sides.A.text });
        }
        if (prevSub.sides.B.text) {
          previousArgs.push({ side: "B", content: prevSub.sides.B.text });
        }
      }
    }

    // Generate dialogue using AI
    try {
      const copy = structuredClone(debate);
      const generatedText = await generateProfessionalDialogue({
        topic: copy.topic,
        roundNumber: round.roundNumber,
        subroundNumber: subround.subroundNumber,
        side,
        roundTopic: round.topic,
        subroundType: subround.type,
        previousArguments: previousArgs,
        sideAName: copy.sideAName,
        sideBName: copy.sideBName,
      });

      copy.rounds[roundIdx].subrounds[subIdx].sides[side].text = generatedText;
      setDebate(copy);
      console.log(`Successfully generated response for side ${side}`);
    } catch (error) {
      console.error("Error generating dialogue:", error);
      // Let DialogueGenerator handle its own fallbacks - only use minimal fallback if everything fails
      const copy = structuredClone(debate);
      copy.rounds[roundIdx].subrounds[subIdx].sides[
        side
      ].text = `[Generation failed - please try again]`;
      setDebate(copy);
    } finally {
      setIsGenerating(false);
      setGeneratingInfo("");
    }

    return `Generated ${
      side === "A" ? debate.sideAName : debate.sideBName
    }'s response`;
  }

  function handleEdit(roundIdx, subIdx, side, newText) {
    const copy = structuredClone(debate);
    copy.rounds[roundIdx].subrounds[subIdx].sides[side].text = newText;
    setDebate(copy);
  }

  // Configuration Panel Component
  if (isConfiguring) {
    return (
      <div className="debate-container">
        <div className="config-panel">
          <h2>Configure Debate Parameters</h2>

          <div className="form-group">
            <label>Main Topic: *</label>
            <input
              type="text"
              value={config.topic}
              onChange={(e) => setConfig({ ...config, topic: e.target.value })}
              placeholder="e.g., Should AI be regulated by government? or Universal healthcare is necessary"
              required
            />
            <small className="form-help">
              Frame as a question or statement that can be argued FOR or AGAINST
            </small>
          </div>

          <div className="form-group">
            <label>Round 1 Topic: *</label>
            <input
              type="text"
              value={config.roundTopic1}
              onChange={(e) =>
                setConfig({ ...config, roundTopic1: e.target.value })
              }
              placeholder="Initial stance and foundational claims topic"
              required
            />
          </div>

          <div className="form-group">
            <label>Round 2 Topic: *</label>
            <input
              type="text"
              value={config.roundTopic2}
              onChange={(e) =>
                setConfig({ ...config, roundTopic2: e.target.value })
              }
              placeholder="Direct rebuttals and foundational defense topic"
              required
            />
          </div>

          <div className="form-group">
            <label>Round 3 Topic: *</label>
            <input
              type="text"
              value={config.roundTopic3}
              onChange={(e) =>
                setConfig({ ...config, roundTopic3: e.target.value })
              }
              placeholder="Deeper analysis and specific case challenges topic"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Side A Name (FOR): *</label>
              <input
                type="text"
                value={config.sideAName}
                onChange={(e) =>
                  setConfig({ ...config, sideAName: e.target.value })
                }
                placeholder="e.g., Pro-Topic"
                required
              />
              <small className="form-help">
                Side A will always argue FOR the topic/question
              </small>
            </div>
            <div className="form-group">
              <label>Side B Name (AGAINST): *</label>
              <input
                type="text"
                value={config.sideBName}
                onChange={(e) =>
                  setConfig({ ...config, sideBName: e.target.value })
                }
                placeholder="e.g., Anti-Topic"
                required
              />
              <small className="form-help">
                Side B will always argue AGAINST the topic/question
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button onClick={handleConfigSubmit} className="btn-primary">
              Create Debate
            </button>
            <button
              onClick={() => setIsConfiguring(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="debate-container">
      <div className="debate-header">
        <h1>Professional Debate Generator</h1>
        <p className="format-info">
          3 Rounds • 10 Subrounds Each • 30 Total Arguments
        </p>
        <div className="topic-section">
          <h2>{debate.topic}</h2>
          <div className="industries">
            <span className="industry-badge industry-a">
              {debate.sideAName || "Advocate"} (FOR)
            </span>
            <span className="vs">VS</span>
            <span className="industry-badge industry-b">
              {debate.sideBName || "Critic"} (AGAINST)
            </span>
          </div>
        </div>

        <div className="controls">
          <button
            onClick={() => {
              setConfig({
                topic: "",
                roundTopic1: "",
                roundTopic2: "",
                roundTopic3: "",
                sideAName: "Advocate",
                sideBName: "Critic",
                useExtended: false,
              });
              setIsConfiguring(true);
            }}
            className="btn-secondary"
            disabled={isGenerating}
          >
            New Debate
          </button>

          {/* Manual Controls */}
          <div className="manual-controls">
            <button
              onClick={async () => {
                const result = await generateNextSequential();
                console.log(result);
              }}
              className="btn-secondary"
              disabled={isGenerating}
            >
              ➡️ Generate Next Response
            </button>
          </div>

          <button
            onClick={exportJSON}
            className="btn-secondary"
            disabled={isGenerating}
          >
            💾 Export JSON
          </button>

          <button
            onClick={clearCacheAndReset}
            className="btn-secondary"
            disabled={isGenerating}
          >
            🗑️ Clear Cache & Reset
          </button>
        </div>

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p className="loading-text">{generatingInfo}</p>
          </div>
        )}
      </div>

      <div className="rounds-container">
        {debate.rounds.map((round, roundIdx) => (
          <details key={roundIdx} className="round-details">
            <summary className="round-summary">
              <h3>{round.title}</h3>
              <span className="round-info">
                {
                  round.subrounds.filter((sr) => sr.sides[sr.assignedSide].text)
                    .length
                }{" "}
                / 10 subrounds completed
              </span>
            </summary>

            <div className="round-content">
              {round.subrounds.map((subround, subIdx) => (
                <details key={subIdx} className="subround-details">
                  <summary className="subround-summary">
                    <div className="subround-info">
                      <strong>{subround.description}</strong>
                      <span className="assigned-speaker">
                        (
                        {subround.assignedSide === "A"
                          ? debate.sideAName
                          : debate.sideBName}{" "}
                        speaks)
                      </span>
                    </div>
                    <span className="completion-indicator">
                      {subround.sides[subround.assignedSide].text
                        ? "✓ Complete"
                        : "○ Empty"}
                    </span>
                  </summary>

                  <div className="subround-content">
                    <div
                      className={`side-panel side-${subround.assignedSide.toLowerCase()}`}
                    >
                      <div className="speaker-header">
                        <h4>
                          {subround.sides[subround.assignedSide].speakerLabel}
                        </h4>
                        <div className="speaker-controls">
                          <button
                            onClick={() =>
                              handleGenerate(
                                roundIdx,
                                subIdx,
                                subround.assignedSide
                              )
                            }
                            className="btn-generate"
                            title="Generate professional dialogue"
                          >
                            Generate
                          </button>
                        </div>
                      </div>

                      <textarea
                        value={subround.sides[subround.assignedSide].text}
                        onChange={(e) =>
                          handleEdit(
                            roundIdx,
                            subIdx,
                            subround.assignedSide,
                            e.target.value
                          )
                        }
                        className="dialogue-textarea"
                        placeholder="Professional dialogue will appear here... Click Generate to create contextual, high-quality response."
                        rows={10}
                      />

                      {subround.sides[subround.assignedSide].text && (
                        <div className="dialogue-stats">
                          Words:{" "}
                          {
                            subround.sides[subround.assignedSide].text.split(
                              " "
                            ).length
                          }{" "}
                          | Est. Duration:{" "}
                          {Math.round(
                            subround.sides[subround.assignedSide].text.split(
                              " "
                            ).length / 2.5
                          )}
                          s
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

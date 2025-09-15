import React, { useState, useEffect } from "react";
import "./DebateTTS.css";
import ConfigPanel from "./ConfigPanel";
import DebateHeader from "./DebateHeader";
import Round from "./Round";
import {
  generateProfessionalDialogue,
  makeEmptyDebate,
  exportDebateToJSON,
  initializeDebateFromStorage,
  saveDebateToStorage,
  clearDebateFromStorage,
} from "../../utils/debateUtils";

export default function DebateTTS() {
  // Initialize with a simple fallback structure
  const [debate, setDebate] = useState(() => {
    const stored = initializeDebateFromStorage();
    return stored;
  });

  const [isConfiguring, setIsConfiguring] = useState(() => {
    // Check if we have a valid debate with rounds - if not, show config
    const stored = initializeDebateFromStorage();
    const hasValidRounds = stored && stored.rounds && stored.rounds.length > 0;
    return !hasValidRounds;
  });
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
    saveDebateToStorage(debate);
  }, [debate]);

  async function handleConfigSubmit() {
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
    exportDebateToJSON(debate);
  }

  async function clearCacheAndReset() {
    clearDebateFromStorage();
    const newDebate = await makeEmptyDebate({
      topic: "Sample Debate Topic",
      roundTopic1: "Opening Arguments",
      roundTopic2: "Rebuttals",
      roundTopic3: "Closing Statements",
      sideAName: "Pro",
      sideBName: "Con",
    });
    setDebate(newDebate);
    setIsConfiguring(false); // Skip config and go straight to debate view
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
      <ConfigPanel
        config={config}
        setConfig={setConfig}
        onSubmit={handleConfigSubmit}
        onCancel={() => setIsConfiguring(false)}
      />
    );
  }

  return (
    <div className="debate-container">
      <DebateHeader
        debate={debate}
        isGenerating={isGenerating}
        generatingInfo={generatingInfo}
        onNewDebate={() => {
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
        onGenerateNext={async () => {
          const result = await generateNextSequential();
          console.log(result);
        }}
        onExport={exportJSON}
        onClearCache={clearCacheAndReset}
      />

      <div className="rounds-container">
        {debate.rounds && debate.rounds.length > 0 ? (
          debate.rounds.map((round, roundIdx) => (
            <Round
              key={roundIdx}
              round={round}
              roundIdx={roundIdx}
              debate={debate}
              onGenerate={handleGenerate}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#666",
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
            }}
          >
            No rounds configured. Click "Clear Cache & Reset" to create a sample
            debate, or "New Debate" to configure your own.
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import LoadingIndicator from "./LoadingIndicator";

export default function DebateHeader({
  debate,
  isGenerating,
  generatingInfo,
  onNewDebate,
  onGenerateNext,
  onExport,
  onClearCache,
}) {
  return (
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
          onClick={onNewDebate}
          className="btn-secondary"
          disabled={isGenerating}
        >
          New Debate
        </button>

        {/* Manual Controls */}
        <div className="manual-controls">
          <button
            onClick={onGenerateNext}
            className="btn-secondary"
            disabled={isGenerating}
          >
            ➡️ Generate Next Response
          </button>
        </div>

        <button
          onClick={onExport}
          className="btn-secondary"
          disabled={isGenerating}
        >
          💾 Export JSON
        </button>

        <button
          onClick={onClearCache}
          className="btn-secondary"
          disabled={isGenerating}
        >
          🗑️ Clear Cache & Reset
        </button>
      </div>

      <LoadingIndicator
        isGenerating={isGenerating}
        generatingInfo={generatingInfo}
      />
    </div>
  );
}

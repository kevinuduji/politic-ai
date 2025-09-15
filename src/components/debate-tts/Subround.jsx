import React from "react";

export default function Subround({
  subround,
  subIdx,
  roundIdx,
  debate,
  onGenerate,
  onEdit,
}) {
  return (
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
            <h4>{subround.sides[subround.assignedSide].speakerLabel}</h4>
            <div className="speaker-controls">
              <button
                onClick={() =>
                  onGenerate(roundIdx, subIdx, subround.assignedSide)
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
              onEdit(roundIdx, subIdx, subround.assignedSide, e.target.value)
            }
            className="dialogue-textarea"
            placeholder="Professional dialogue will appear here... Click Generate to create contextual, high-quality response."
            rows={10}
          />

          {subround.sides[subround.assignedSide].text && (
            <div className="dialogue-stats">
              Words:{" "}
              {subround.sides[subround.assignedSide].text.split(" ").length} |
              Est. Duration:{" "}
              {Math.round(
                subround.sides[subround.assignedSide].text.split(" ").length /
                  2.5
              )}
              s
            </div>
          )}
        </div>
      </div>
    </details>
  );
}

import React from "react";
import Subround from "./Subround";

export default function Round({ round, roundIdx, debate, onGenerate, onEdit }) {
  return (
    <details key={roundIdx} className="round-details">
      <summary className="round-summary">
        <h3>{round.title}</h3>
        <span className="round-info">
          {
            round.subrounds.filter((sr) => sr.sides[sr.assignedSide].text)
              .length
          }{" "}
          / {round.subrounds.length} subrounds completed
        </span>
      </summary>

      <div className="round-content">
        {round.subrounds.map((subround, subIdx) => (
          <Subround
            key={subIdx}
            subround={subround}
            subIdx={subIdx}
            roundIdx={roundIdx}
            debate={debate}
            onGenerate={onGenerate}
            onEdit={onEdit}
          />
        ))}
      </div>
    </details>
  );
}

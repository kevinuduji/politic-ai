import React from "react";

export default function LoadingIndicator({ isGenerating, generatingInfo }) {
  if (!isGenerating) return null;

  return (
    <div className="loading-indicator">
      <div className="spinner"></div>
      <p className="loading-text">{generatingInfo}</p>
    </div>
  );
}

import React from "react";

export default function ConfigPanel({ config, setConfig, onSubmit, onCancel }) {
  const handleSubmit = () => {
    // Validate required fields
    if (!config.topic.trim()) {
      alert("Please enter a main topic and question");
      return;
    }
    if (!config.roundTopic1.trim()) {
      alert("Please enter a QUESTION for Round 1");
      return;
    }
    if (!config.roundTopic2.trim()) {
      alert("Please enter a QUESTION for Round 2");
      return;
    }
    if (!config.roundTopic3.trim()) {
      alert("Please enter a QUESTION for Round 3");
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

    onSubmit();
  };

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
          <button onClick={handleSubmit} className="btn-primary">
            Create Debate
          </button>
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

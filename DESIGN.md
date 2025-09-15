# 🏛️ Politic-AI Design Document

> **AI-Powered Political Debate Platform**  
> Technical overview for understanding and extending the Politic-AI system.

## 📋 Table of Contents

1. [System Overview](#-system-overview)
2. [Architecture](#-architecture)
3. [Key Components](#-key-components)
4. [Data Structure](#-data-structure)
5. [File Organization](#-file-organization)
6. [Quick Reference](#-quick-reference)

## 🎯 System Overview

**Politic-AI** generates structured political debates using AI. Users input a topic, and the system creates realistic conversations between two opposing sides.

### Tech Stack

- **Frontend**: React 18.2.0
- **AI**: Cerebras Cloud SDK
- **Storage**: localStorage
- **Build**: Create React App

### Core Features

- AI-generated debate content
- 3-round structured format
- Real-time generation
- JSON export functionality

## 🏗️ Architecture

### System Flow

```
User Input → Config → AI Generation → Display → Export
```

### Component Hierarchy

```
App
├── ErrorBoundary
    └── DebateTTS (Main)
        ├── ConfigPanel (Setup)
        ├── DebateHeader (Controls)
        └── Round[] (Display)
            └── Subround[]
```

### AI Generation System

```
DialogueGenerator → PromptBuilder → CerebrasClient → AI API
```

## 🧩 Key Components

### UI Components

- **`DebateTTS.jsx`** - Main container, manages state and AI generation
- **`ConfigPanel.jsx`** - Setup form for debate parameters
- **`DebateHeader.jsx`** - Controls and export functionality
- **`Round.jsx`** - Displays debate rounds
- **`Subround.jsx`** - Individual argument display with generate buttons

### AI System

- **`DialogueGenerator.js`** - Main AI orchestrator class
- **`CerebrasClient.js`** - API communication with Cerebras
- **`PromptBuilder.js`** - Creates AI prompts and context
- **`DebateStructure.js`** - Defines 3-round debate format

### Utilities

- **`debateUtils.js`** - Helper functions for debate management
- **`ErrorBoundary.js`** - Error handling component

## 📊 Data Structure

### Main Debate Object

```json
{
  "debateId": "unique_id",
  "topic": "debate_topic",
  "industryA": "side_a_name",
  "industryB": "side_b_name",
  "rounds": [
    {
      "roundNumber": 1,
      "title": "Round 1: Opening",
      "subrounds": [
        {
          "side": "A",
          "speakerLabel": "Speaker A",
          "text": "Generated argument text",
          "wordCount": 120
        }
      ]
    }
  ]
}
```

### Configuration

```javascript
{
  topic: "Main debate topic",
  roundTopic1: "Round 1 focus",
  roundTopic2: "Round 2 focus",
  roundTopic3: "Round 3 focus",
  sideAName: "Side A participant",
  sideBName: "Side B participant"
}
```

## � File Organization

### Project Structure

```
src/
├── App.js                  # Main app component
├── components/
│   ├── debate-tts/         # UI components
│   │   ├── DebateTTS.jsx   # Main container
│   │   ├── ConfigPanel.jsx # Setup form
│   │   ├── DebateHeader.jsx# Controls
│   │   ├── Round.jsx       # Round display
│   │   └── Subround.jsx    # Argument display
│   └── dialogue-generator/ # AI system
│       ├── DialogueGenerator.js # Main orchestrator
│       ├── CerebrasClient.js    # API client
│       ├── PromptBuilder.js     # Prompt creation
│       └── DebateStructure.js   # Configuration
└── utils/
    └── debateUtils.js      # Helper functions
```

### Key Files Quick Reference

| File                   | Purpose                      |
| ---------------------- | ---------------------------- |
| `DebateTTS.jsx`        | Main UI and state management |
| `DialogueGenerator.js` | AI generation orchestrator   |
| `CerebrasClient.js`    | API communication            |
| `debateUtils.js`       | Utility functions            |
| `DataModel.json`       | Data structure reference     |

## 📚 Quick Reference

### Setup & Development

```bash
# Install and run
npm install
npm start

# Build for production
npm run build

# Environment setup
echo "REACT_APP_CEREBRAS_API_KEY=your_key" > .env
```

### Common Tasks

| Task                    | File to Edit                                           |
| ----------------------- | ------------------------------------------------------ |
| Change UI layout        | `src/components/debate-tts/DebateTTS.jsx`              |
| Modify AI prompts       | `src/components/dialogue-generator/PromptBuilder.js`   |
| Update debate structure | `src/components/dialogue-generator/DebateStructure.js` |
| Add utilities           | `src/utils/debateUtils.js`                             |

### Debugging Tips

- **API Issues**: Check `.env` file and browser network tab
- **State Issues**: Use React DevTools to inspect component state
- **Generation Problems**: Review AI prompts in `PromptBuilder.js`
- **UI Problems**: Check component props and CSS files

### Extension Points

- **New AI Models**: Modify `CerebrasClient.js`
- **Different Formats**: Update `DebateStructure.js`
- **Enhanced Export**: Extend `debateUtils.js`
- **UI Improvements**: Add components to `debate-tts/`

---

_Design document for Politic-AI v1.0 - Keep updated with code changes_

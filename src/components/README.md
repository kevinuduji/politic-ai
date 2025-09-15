### Main Components

#### 1. **DialogueGenerator.js** (Main Class)

- **Location**: `/src/components/dialogue-generator/DialogueGenerator.js`
- **Purpose**: Main orchestrator class that coordinates debate generation
- **Key Methods**:
  - `generateDialogue()` - Generate AI responses for debate subrounds
  - `callLLM()` - Interface to AI API calls
  - `createEmptyDebate()` - Static method for creating debate structures

#### 2. **DebateStructure.js**

- **Location**: `/src/components/DebateStructure.js`
- **Purpose**: Defines debate structure constants and utilities
- **Exports**:
  - `DEBATE_STRUCTURE` - 3-round debate configuration
  - `getTaskInstructions()` - Context for subround types
  - `getLastOpponentArgument()` - Helper for debate flow

#### 3. **PromptBuilder.js**

- **Location**: `/src/components/PromptBuilder.js`
- **Purpose**: Handles AI prompt creation and formatting
- **Exports**:
  - `PromptBuilder` class with static methods
  - `SYSTEM_PROMPT` - AI system instructions
  - `USER_PROMPT_TEMPLATE` - User prompt template
  - `buildPromptContext()` - Creates comprehensive prompts

#### 4. **CerebrasClient.js**

- **Location**: `/src/components/CerebrasClient.js`
- **Purpose**: Manages all Cerebras API interactions
- **Features**:
  - Streaming and non-streaming API calls
  - Error handling and fallback responses
  - Configurable API parameters

#### 5. **DebateFactory.js**

- **Location**: `/src/components/DebateFactory.js`
- **Purpose**: Creates and validates debate structures
- **Features**:
  - `createEmptyDebate()` - Generate debate structures
  - `validateDebateConfig()` - Input validation
  - `createValidatedDebate()` - Safe debate creation

## Backward Compatibility

The refactoring maintains full backward compatibility:

- All original exports are preserved
- Existing API remains unchanged
- No breaking changes to consuming code

## Usage

```javascript
const {
  DialogueGenerator,
} = require("./src/components/dialogue-generator/DialogueGenerator.js");

// Usage unchanged
const generator = new DialogueGenerator(apiConfig);
const debate = DialogueGenerator.createEmptyDebate({
  topic: "Climate Policy",
  sideAName: "Environmental",
  sideBName: "Economic",
});
```

## Component Dependencies

```
DialogueGenerator (main)
├── CerebrasClient (API calls)
├── PromptBuilder (AI prompts)
│   └── DebateStructure (task instructions)
├── DebateFactory (debate creation)
│   └── DebateStructure (structure definition)
└── DebateStructure (helper utilities)
```

This modular structure makes the codebase more professional, maintainable, and easier to extend while preserving all existing functionality.

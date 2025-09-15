# 🏛️ Politic-AI

An AI-powered political debate platform that generates intelligent, structured debates on controversial topics using advanced language models. Built with React and powered by Cerebras Cloud SDK for lightning-fast AI responses.

## ✨ Features

- **🤖 AI-Generated Debates**: Create realistic political debates between two opposing sides with intelligent arguments
- **📝 Custom Topics**: Input any controversial topic and generate balanced, nuanced arguments
- **👥 Multiple Perspectives**: Generate supporting and opposing viewpoints with named debaters and distinct personalities
- **🏆 Structured Arguments**: Professional debate format with organized rounds and sub-rounds
- **💬 Interactive Debates**: Dynamic conversation flow with contextual responses and follow-up arguments
- **⚡ Real-time Generation**: Powered by Cerebras Cloud SDK for ultra-fast AI responses
- **📄 Export Functionality**: Save and export debate transcripts for later reference
- **🎛️ Configurable Settings**: Customize debate parameters, debater personalities, and topic focus

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** package manager
- **Cerebras API key** (sign up at [Cerebras Cloud](https://cloud.cerebras.ai/))

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kevinuduji/politic-ai.git
   cd politic-ai
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```bash
   touch .env
   ```

   Add your Cerebras API key to the `.env` file:

   ```env
   REACT_APP_CEREBRAS_API_KEY=your_api_key_here
   ```

   > **Note**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

4. **Start the development server:**

   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with modern hooks and functional components
- **AI Engine**: Cerebras Cloud SDK for ultra-fast language model inference
- **Styling**: CSS3 with custom components and responsive design
- **Build Tool**: Create React App with webpack bundling
- **Error Handling**: Custom Error Boundary components for graceful failure handling
- **State Management**: React hooks and context for component state
- **File Processing**: JSZip for debate export functionality

## 📖 Usage

1. **🎯 Enter a Topic**: Input any controversial political topic in the main interface
2. **⚙️ Configure Settings**: Use the configuration panel to customize:
   - Debater names and personalities
   - Debate focus and scope
   - Number of rounds and arguments per round
3. **🚀 Generate Debate**: Click the generate button to start the AI-powered debate creation
4. **👀 Watch the Debate Unfold**: View structured arguments from both perspectives in real-time
5. **🔄 Continue Discussion**: Generate follow-up rounds for deeper discourse and rebuttals
6. **💾 Export Results**: Save your debate transcripts as downloadable files for later reference

### Example Topics

- Climate change policy and economic impact
- Universal healthcare vs. private healthcare systems
- Immigration policy and border security
- Technology regulation and privacy rights
- Economic inequality and wealth distribution

## 🏗️ Project Structure

```
politic-ai/
├── public/
│   └── index.html              # Main HTML template
├── src/
│   ├── App.js                  # Main application component
│   ├── App.css                 # Global application styles
│   ├── index.js                # Application entry point
│   ├── index.css               # Base CSS styles
│   ├── ErrorBoundary.js        # Error handling component
│   ├── testCerebras.js         # API testing utilities
│   ├── components/
│   │   ├── debate-tts/         # Debate interface components
│   │   │   ├── DebateTTS.jsx   # Main debate interface
│   │   │   ├── DebateTTS.css   # Debate styling
│   │   │   ├── ConfigPanel.jsx # Settings configuration
│   │   │   ├── DebateHeader.jsx# Debate title and controls
│   │   │   ├── LoadingIndicator.jsx # Loading states
│   │   │   ├── Round.jsx       # Individual debate rounds
│   │   │   └── Subround.jsx    # Sub-arguments within rounds
│   │   └── dialogue-generator/ # AI logic components
│   │       ├── DialogueGenerator.js # Main generation controller
│   │       ├── CerebrasClient.js    # API client wrapper
│   │       ├── DebateFactory.js     # Debate creation logic
│   │       ├── DebateStructure.js   # Data structure definitions
│   │       └── PromptBuilder.js     # AI prompt construction
│   └── utils/
│       └── debateUtils.js      # Utility functions
├── build/                      # Production build output
├── package.json               # Dependencies and scripts
├── DataModel.json             # Application configuration
└── README.md                  # This file
```

## 🔧 Configuration

The application uses environment variables and configuration files:

### Environment Variables

- `REACT_APP_CEREBRAS_API_KEY`: Your Cerebras API key for AI generation (required)

### Configuration Files

- `DataModel.json`: Application settings and debate parameters
- Package configuration in `package.json` for dependencies and build scripts

### Customization

You can customize the debate generation by modifying:

- **Prompt templates** in `PromptBuilder.js`
- **Debate structure** in `DebateStructure.js`
- **AI parameters** in `CerebrasClient.js`
- **UI settings** in the various component files

## 🚦 Available Scripts

In the project directory, you can run:

- **`npm start`** - Starts the development server on `http://localhost:3000`
- **`npm build`** - Builds the app for production to the `build` folder
- **`npm test`** - Launches the test runner in interactive watch mode
- **`npm run eject`** - Ejects from Create React App (⚠️ irreversible operation)

### Development

For development with hot reloading:

```bash
npm start
```

The app will automatically reload when you make changes to the source code.

## 🤝 Contributing

We welcome contributions to Politic-AI! Here's how you can help:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/politic-ai.git
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes** and test thoroughly
5. **Commit your changes**:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** with a clear description of your changes

### Development Guidelines

- Follow React best practices and hooks patterns
- Maintain consistent code formatting
- Add comments for complex logic
- Test your changes thoroughly before submitting
- Update documentation if you're changing functionality

### Areas for Contribution

- 🐛 Bug fixes and performance improvements
- ✨ New features and debate formats
- 🎨 UI/UX enhancements
- 📚 Documentation improvements
- 🧪 Test coverage expansion

## ⚠️ Disclaimer

This tool generates AI-based political debates for **educational and entertainment purposes only**. Please note:

- Generated content does not represent the views or opinions of the developers
- Debates are created by AI and may not reflect real-world political positions accurately
- Content should not be used as a primary source for political decision-making or research
- AI-generated arguments may contain biases present in training data
- Users should critically evaluate all generated content and seek multiple sources for important topics

## � Privacy & Security

- API keys are stored locally and never transmitted except to authorized Cerebras endpoints
- No debate content is stored on external servers unless explicitly exported by the user
- The application runs entirely in your browser with no data collection

## 📝 License

This project is private and proprietary. All rights reserved.

## 📞 Support & Contact

- **Issues**: Open an issue on the [GitHub repository](https://github.com/kevinuduji/politic-ai/issues)
- **Feature Requests**: Submit via GitHub issues with the "enhancement" label
- **Questions**: Check existing issues or create a new discussion

For urgent matters, please contact the repository maintainers directly.

---

**Made with ❤️ by [Kevin Uduji](https://github.com/kevinuduji)**

_Empowering political discourse through AI technology_

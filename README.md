# 🏛️ Politic-AI

An AI-powered political debate platform that generates intelligent, structured debates on controversial topics using advanced language models.

## ✨ Features

- **🤖 AI-Generated Debates**: Create realistic political debates between two opposing sides
- **🎯 Custom Topics**: Input any controversial topic and generate balanced arguments
- **🗣️ Multiple Perspectives**: Generate supporting and opposing viewpoints with named debaters
- **📝 Structured Arguments**: Professional debate format with rounds and sub-rounds
- **🔄 Interactive Debates**: Dynamic conversation flow with contextual responses
- **⚡ Real-time Generation**: Powered by Cerebras Cloud SDK for fast AI responses

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Cerebras API key

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

   ```bash
   cp .env.example .env
   ```

   Add your Cerebras API key to the `.env` file:

   ```
   REACT_APP_CEREBRAS_API_KEY=your_api_key_here
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🛠️ Technology Stack

- **Frontend**: React 18
- **AI Engine**: Cerebras Cloud SDK
- **Styling**: CSS3 with custom components
- **Build Tool**: Create React App
- **Error Handling**: Custom Error Boundary components

## 📖 Usage

1. **Enter a Topic**: Input any controversial political topic
2. **Customize Debaters**: Optionally name the debating sides
3. **Generate Debate**: Click to start the AI-powered debate generation
4. **Watch the Debate**: View structured arguments from both perspectives
5. **Continue Discussion**: Generate follow-up rounds for deeper discourse

## 🏗️ Project Structure

```
src/
├── App.js              # Main application component
├── DebateTTS.jsx       # Core debate generation interface
├── DialogueGenerator.js # AI dialogue generation logic
├── ErrorBoundary.js    # Error handling component
├── App.css            # Main application styles
├── DebateTTS.css      # Debate interface styles
└── index.js           # Application entry point
```

## 🔧 Configuration

The application uses environment variables for configuration:

- `REACT_APP_CEREBRAS_API_KEY`: Your Cerebras API key for AI generation
- Additional configuration can be found in `DataModel.json`

## 🚦 Available Scripts

- `npm start` - Start the development server
- `npm build` - Build the app for production
- `npm test` - Run the test suite
- `npm eject` - Eject from Create React App (irreversible)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## ⚠️ Disclaimer

This tool generates AI-based political debates for educational and entertainment purposes. The generated content does not represent the views of the developers and should not be used as a source for political decision-making.

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

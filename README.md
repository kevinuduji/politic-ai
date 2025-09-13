# 🗣️ PoliticAI

A generative AI wrapper that creates structured debates on controversial topics using OpenAI's language models.

## 🚀 Features

- **AI-Powered Debates**: Generate multi-round debates with balanced perspectives
- **Interactive CLI**: User-friendly command-line interface with interactive prompts
- **Customizable Arguments**: Configure debate rounds, perspective labels, and topics
- **Topic Suggestions**: Built-in controversial topics to choose from
- **Structured Output**: Well-formatted debate presentation with clear rounds and summary

## 📋 Prerequisites

- Node.js 14+ 
- OpenAI API key

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/kevinuduji/politic-ai.git
cd politic-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up your OpenAI API key:
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

Or export it directly:
```bash
export OPENAI_API_KEY=your_api_key_here
```

## 🎯 Usage

### Interactive Mode
Start the interactive debate generator:
```bash
npm start
```

### Command Line Arguments
Generate a debate directly:
```bash
# Basic usage
npm start -- debate "Universal Basic Income"

# With custom options
npm start -- debate "Climate Change Policy" --rounds 5 --pro "Supporters" --con "Critics"
```

### List Available Topics
```bash
npm start -- topics
```

### Get Help
```bash
npm start -- --help
```

## 📖 Examples

### Example 1: Basic Debate
```bash
npm start -- debate "Social Media Regulation"
```

### Example 2: Custom Configuration
```bash
npm start -- debate "Artificial Intelligence Ethics" --rounds 4 --pro "Tech Advocates" --con "Privacy Advocates"
```

## 🎨 Sample Output

```
================================================================================
🏛️  DEBATE: UNIVERSAL BASIC INCOME
================================================================================

📍 ROUND 1
----------------------------------------
Pro Perspective:
Universal Basic Income represents a revolutionary approach to economic security...

Con Perspective:
While the intentions behind UBI are admirable, the implementation faces...

📋 SUMMARY
----------------------------------------
The debate highlighted key tensions between economic innovation and fiscal responsibility...
```

## 🔧 Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `--rounds, -r` | Number of debate rounds | 3 |
| `--pro` | Label for supporting perspective | "Pro" |
| `--con` | Label for opposing perspective | "Con" |

## 📝 API Reference

### DebateGenerator Class

#### `generateDebate(topic, options)`
Generates a structured debate on the given topic.

**Parameters:**
- `topic` (string): The controversial topic to debate
- `options` (object): Configuration options
  - `rounds` (number): Number of debate rounds (default: 3)
  - `perspective1` (string): Label for supporting side (default: "Pro")
  - `perspective2` (string): Label for opposing side (default: "Con")
  - `model` (string): OpenAI model to use (default: "gpt-3.5-turbo")

**Returns:** Promise resolving to a debate object with rounds, summary, and metadata.

#### `getTopicSuggestions()`
Returns an array of suggested controversial topics.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is designed for educational and research purposes. The debates generated are AI-created content and should not be considered as factual statements or professional advice. Users should verify information and use critical thinking when interpreting the generated debates.

## 🙋‍♂️ Support

If you encounter any issues or have questions, please open an issue on GitHub.

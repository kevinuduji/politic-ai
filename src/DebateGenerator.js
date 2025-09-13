const OpenAI = require('openai');

class DebateGenerator {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required. Set OPENAI_API_KEY environment variable.');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  /**
   * Generate a debate between two perspectives on a controversial topic
   * @param {string} topic - The controversial topic to debate
   * @param {object} options - Configuration options
   * @returns {Promise<object>} - The generated debate
   */
  async generateDebate(topic, options = {}) {
    const {
      rounds = 3,
      perspective1 = 'Pro',
      perspective2 = 'Con',
      model = 'gpt-3.5-turbo'
    } = options;

    try {
      // Generate the initial prompt for the debate
      const systemPrompt = this.createSystemPrompt(topic, perspective1, perspective2, rounds);
      
      const completion = await this.openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Generate a ${rounds}-round debate on: "${topic}"`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      const rawResponse = completion.choices[0].message.content;
      return this.parseDebateResponse(rawResponse, topic, perspective1, perspective2);
      
    } catch (error) {
      throw new Error(`Failed to generate debate: ${error.message}`);
    }
  }

  /**
   * Create the system prompt for debate generation
   */
  createSystemPrompt(topic, perspective1, perspective2, rounds) {
    return `You are an expert debate facilitator. Generate a structured, fair, and balanced debate on controversial topics.

Your task is to create a ${rounds}-round debate on the topic "${topic}" with two perspectives:
- ${perspective1}: Supporting or defending the topic
- ${perspective2}: Opposing or criticizing the topic

Requirements:
1. Each perspective should present strong, well-reasoned arguments
2. Arguments should be factual, logical, and respectful
3. Avoid extreme positions or hate speech
4. Include relevant examples and evidence when possible
5. Maintain a professional, academic tone

Format your response as:
**Topic:** ${topic}
**${perspective1} Perspective - Round 1:**
[Argument]

**${perspective2} Perspective - Round 1:**
[Counter-argument]

[Continue for all rounds...]

**Summary:**
[Brief summary of key points from both sides]`;
  }

  /**
   * Parse the raw AI response into structured debate format
   */
  parseDebateResponse(rawResponse, topic, perspective1, perspective2) {
    const lines = rawResponse.split('\n').filter(line => line.trim());
    
    const debate = {
      topic: topic,
      perspective1: perspective1,
      perspective2: perspective2,
      rounds: [],
      summary: '',
      timestamp: new Date().toISOString()
    };

    let currentSection = null;
    let currentRound = 0;
    let currentContent = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('**Topic:**')) {
        continue;
      } else if (trimmed.includes(`**${perspective1} Perspective - Round`)) {
        if (currentSection) {
          this.addToDebate(debate, currentSection, currentRound, currentContent.join(' '));
        }
        currentSection = 'perspective1';
        currentRound = this.extractRoundNumber(trimmed);
        currentContent = [];
      } else if (trimmed.includes(`**${perspective2} Perspective - Round`)) {
        if (currentSection) {
          this.addToDebate(debate, currentSection, currentRound, currentContent.join(' '));
        }
        currentSection = 'perspective2';
        currentRound = this.extractRoundNumber(trimmed);
        currentContent = [];
      } else if (trimmed.startsWith('**Summary:**')) {
        if (currentSection) {
          this.addToDebate(debate, currentSection, currentRound, currentContent.join(' '));
        }
        currentSection = 'summary';
        currentContent = [];
      } else if (trimmed && !trimmed.startsWith('**')) {
        currentContent.push(trimmed);
      }
    }

    // Add the last section
    if (currentSection === 'summary') {
      debate.summary = currentContent.join(' ');
    } else if (currentSection) {
      this.addToDebate(debate, currentSection, currentRound, currentContent.join(' '));
    }

    return debate;
  }

  addToDebate(debate, section, round, content) {
    if (!content.trim()) return;

    // Ensure round exists
    while (debate.rounds.length < round) {
      debate.rounds.push({
        round: debate.rounds.length + 1,
        perspective1: '',
        perspective2: ''
      });
    }

    if (section === 'perspective1') {
      debate.rounds[round - 1].perspective1 = content.trim();
    } else if (section === 'perspective2') {
      debate.rounds[round - 1].perspective2 = content.trim();
    }
  }

  extractRoundNumber(text) {
    const match = text.match(/Round (\d+)/);
    return match ? parseInt(match[1]) : 1;
  }

  /**
   * Get available controversial topics suggestions
   */
  getTopicSuggestions() {
    return [
      'Universal Basic Income',
      'Climate Change Policy',
      'Social Media Regulation',
      'Artificial Intelligence Ethics',
      'Healthcare System Reform',
      'Education Technology',
      'Remote Work vs Office Work',
      'Cryptocurrency Regulation',
      'Immigration Policy',
      'Privacy vs Security'
    ];
  }
}

module.exports = DebateGenerator;
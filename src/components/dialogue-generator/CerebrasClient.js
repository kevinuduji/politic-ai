/**
 * Cerebras API Client Wrapper
 *
 * This module handles all interactions with the Cerebras Cloud SDK,
 * including streaming and non-streaming API calls, error handling, and fallback responses.
 */

const Cerebras = require("@cerebras/cerebras_cloud_sdk");
const { PromptBuilder } = require("./PromptBuilder");

/**
 * CerebrasClient handles all AI API interactions for debate generation
 */
class CerebrasClient {
  constructor(apiConfig = {}) {
    this.apiConfig = {
      apiKey: apiConfig.apiKey || process.env.CEREBRAS_API_KEY,
      model: apiConfig.model || "qwen-3-235b-a22b-instruct-2507",
      maxTokens: apiConfig.maxTokens || 300, // Limit for ~150 words
      temperature: apiConfig.temperature || 0.6,
      topP: apiConfig.topP || 0.8,
      stream: apiConfig.stream !== undefined ? apiConfig.stream : true,
      ...apiConfig,
    };

    // Initialize Cerebras client
    this.cerebras = new Cerebras({
      apiKey: this.apiConfig.apiKey,
    });
  }

  /**
   * Call Cerebras LLM API to generate dialogue response
   */
  async callLLM(prompt, context = {}) {
    if (!this.apiConfig.apiKey) {
      console.warn("No Cerebras API key provided, using fallback response");
      return this.generateFallbackResponse(context);
    }

    try {
      return await this.callCerebrasAPI(prompt, context);
    } catch (error) {
      console.error("Cerebras API Error:", error.message);

      // Provide specific error context
      if (error.message.includes("Rate limit")) {
        console.error(
          "Consider implementing retry logic or reducing request frequency"
        );
      } else if (error.message.includes("API key")) {
        console.error("Set your CEREBRAS_API_KEY environment variable");
      }

      // Fallback to a basic response if API fails
      return this.generateFallbackResponse(context);
    }
  }

  /**
   * Call Cerebras API with streaming support
   */
  async callCerebrasAPI(prompt, context = {}) {
    const messages = [
      {
        role: "system",
        content: PromptBuilder.getSystemPrompt(),
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    try {
      if (this.apiConfig.stream) {
        // Use streaming response
        const stream = await this.cerebras.chat.completions.create({
          messages: messages,
          model: this.apiConfig.model,
          stream: true,
          max_completion_tokens: this.apiConfig.maxTokens,
          temperature: this.apiConfig.temperature,
          top_p: this.apiConfig.topP,
        });

        let fullResponse = "";
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          fullResponse += content;
        }

        return fullResponse;
      } else {
        // Use non-streaming response
        const response = await this.cerebras.chat.completions.create({
          messages: messages,
          model: this.apiConfig.model,
          stream: false,
          max_completion_tokens: this.apiConfig.maxTokens,
          temperature: this.apiConfig.temperature,
          top_p: this.apiConfig.topP,
        });

        return response.choices[0]?.message?.content || "";
      }
    } catch (error) {
      if (error.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else if (error.status === 401 || error.status === 403) {
        throw new Error("Invalid API key or insufficient permissions.");
      } else if (error.status === 400) {
        throw new Error(`Invalid request: ${error.message}`);
      } else {
        throw new Error(`Cerebras API request failed: ${error.message}`);
      }
    }
  }

  /**
   * Generate a simple fallback response without AI
   */
  generateFallbackResponse(context = {}) {
    const { stance = "support", topic = "this issue" } = context;

    // Simple fallback response
    return `I ${stance} this position on ${topic}. This is an important issue that needs careful thought and respectful discussion between all people involved.`;
  }
}

module.exports = {
  CerebrasClient,
};

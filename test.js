#!/usr/bin/env node

/**
 * Simple test script for PoliticAI functionality
 */

const DebateGenerator = require('./src/DebateGenerator');

function testBasicFunctionality() {
  console.log('🧪 Running basic functionality tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  function test(description, fn) {
    try {
      fn();
      console.log(`✅ ${description}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${description}: ${error.message}`);
      failed++;
    }
  }
  
  // Test 1: Constructor should require API key
  test('Constructor requires API key', () => {
    try {
      new DebateGenerator();
      throw new Error('Should have thrown an error');
    } catch (error) {
      if (error.message.includes('API key is required')) {
        return; // Expected error
      }
      throw error;
    }
  });
  
  // Test 2: Constructor with API key should work
  test('Constructor with API key works', () => {
    new DebateGenerator('test-key');
  });
  
  // Test 3: Topic suggestions should be available
  test('Topic suggestions are available', () => {
    const generator = new DebateGenerator('test-key');
    const topics = generator.getTopicSuggestions();
    if (!Array.isArray(topics) || topics.length === 0) {
      throw new Error('Topics should be a non-empty array');
    }
    if (!topics.includes('Universal Basic Income')) {
      throw new Error('Should include expected topic');
    }
  });
  
  // Test 4: System prompt generation
  test('System prompt generation works', () => {
    const generator = new DebateGenerator('test-key');
    const prompt = generator.createSystemPrompt('Test Topic', 'Pro', 'Con', 3);
    if (typeof prompt !== 'string' || prompt.length === 0) {
      throw new Error('Prompt should be a non-empty string');
    }
    if (!prompt.includes('Test Topic')) {
      throw new Error('Prompt should include the topic');
    }
  });
  
  // Test 5: Round number extraction
  test('Round number extraction works', () => {
    const generator = new DebateGenerator('test-key');
    const roundNumber = generator.extractRoundNumber('**Pro Perspective - Round 3:**');
    if (roundNumber !== 3) {
      throw new Error(`Expected 3, got ${roundNumber}`);
    }
  });
  
  // Test 6: Text wrapping utility
  test('Text wrapping works', () => {
    const { PoliticAI } = require('./src/index');
    const app = new (require('./src/index'))();
    const wrapped = app.wrapText('This is a very long line that should be wrapped at a certain width for better readability', 20);
    const lines = wrapped.split('\n');
    if (lines.length < 2) {
      throw new Error('Text should be wrapped into multiple lines');
    }
  });
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('💥 Some tests failed!');
    process.exit(1);
  }
}

if (require.main === module) {
  testBasicFunctionality();
}
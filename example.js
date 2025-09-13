#!/usr/bin/env node

/**
 * Example usage of PoliticAI DebateGenerator
 * This demonstrates how to use the library programmatically
 */

const DebateGenerator = require('./src/DebateGenerator');

async function exampleUsage() {
  // Note: In real usage, get API key from environment variable
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log('This is a usage example. To run it, set OPENAI_API_KEY environment variable.');
    console.log('Example usage:');
    console.log('');
    console.log('const DebateGenerator = require("./src/DebateGenerator");');
    console.log('');
    console.log('async function generateDebate() {');
    console.log('  const generator = new DebateGenerator(process.env.OPENAI_API_KEY);');
    console.log('  ');
    console.log('  const debate = await generator.generateDebate("Universal Basic Income", {');
    console.log('    rounds: 3,');
    console.log('    perspective1: "Supporters",');
    console.log('    perspective2: "Critics"');
    console.log('  });');
    console.log('  ');
    console.log('  console.log(JSON.stringify(debate, null, 2));');
    console.log('}');
    console.log('');
    console.log('generateDebate().catch(console.error);');
    return;
  }

  try {
    console.log('🤖 Initializing PoliticAI...');
    const generator = new DebateGenerator(apiKey);
    
    console.log('📝 Generating example debate...');
    const debate = await generator.generateDebate('Universal Basic Income', {
      rounds: 2,
      perspective1: 'Supporters',
      perspective2: 'Critics'
    });
    
    console.log('✅ Debate generated successfully!');
    console.log(JSON.stringify(debate, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  exampleUsage();
}
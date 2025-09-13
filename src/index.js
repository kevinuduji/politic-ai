#!/usr/bin/env node

const yargs = require('yargs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const DebateGenerator = require('./DebateGenerator');

class PoliticAI {
  constructor() {
    this.debateGenerator = null;
  }

  async initialize() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.log(chalk.red('Error: OPENAI_API_KEY environment variable is required.'));
      console.log(chalk.yellow('Please set your OpenAI API key:'));
      console.log(chalk.cyan('export OPENAI_API_KEY=your_api_key_here'));
      process.exit(1);
    }

    try {
      this.debateGenerator = new DebateGenerator(apiKey);
      console.log(chalk.green('✓ PoliticAI initialized successfully!'));
    } catch (error) {
      console.error(chalk.red(`Initialization failed: ${error.message}`));
      process.exit(1);
    }
  }

  async interactiveMode() {
    console.log(chalk.bold.blue('\n🗣️  Welcome to PoliticAI - AI Debate Generator\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'How would you like to proceed?',
        choices: [
          'Enter a custom topic',
          'Choose from suggested topics',
          'Exit'
        ]
      }
    ]);

    if (answers.mode === 'Exit') {
      console.log(chalk.yellow('Goodbye!'));
      return;
    }

    let topic;
    
    if (answers.mode === 'Choose from suggested topics') {
      const suggestions = this.debateGenerator.getTopicSuggestions();
      const topicAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'topic',
          message: 'Select a controversial topic:',
          choices: suggestions
        }
      ]);
      topic = topicAnswer.topic;
    } else {
      const topicAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'topic',
          message: 'Enter a controversial topic for debate:',
          validate: (input) => input.trim().length > 0 || 'Please enter a valid topic'
        }
      ]);
      topic = topicAnswer.topic;
    }

    const options = await inquirer.prompt([
      {
        type: 'number',
        name: 'rounds',
        message: 'Number of debate rounds:',
        default: 3,
        validate: (input) => input > 0 && input <= 10 || 'Please enter a number between 1 and 10'
      },
      {
        type: 'input',
        name: 'perspective1',
        message: 'Label for supporting side:',
        default: 'Pro'
      },
      {
        type: 'input',
        name: 'perspective2',
        message: 'Label for opposing side:',
        default: 'Con'
      }
    ]);

    await this.generateAndDisplayDebate(topic, options);
  }

  async generateAndDisplayDebate(topic, options = {}) {
    console.log(chalk.yellow(`\n⏳ Generating debate on: "${topic}"...\n`));
    
    try {
      const debate = await this.debateGenerator.generateDebate(topic, options);
      this.displayDebate(debate);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
    }
  }

  displayDebate(debate) {
    console.log(chalk.bold.magenta('=' .repeat(80)));
    console.log(chalk.bold.cyan(`🏛️  DEBATE: ${debate.topic.toUpperCase()}`));
    console.log(chalk.bold.magenta('=' .repeat(80)));
    console.log();

    debate.rounds.forEach((round, index) => {
      console.log(chalk.bold.yellow(`📍 ROUND ${round.round}`));
      console.log(chalk.green('-' .repeat(40)));
      
      if (round.perspective1) {
        console.log(chalk.bold.green(`${debate.perspective1} Perspective:`));
        console.log(chalk.white(this.wrapText(round.perspective1, 75)));
        console.log();
      }
      
      if (round.perspective2) {
        console.log(chalk.bold.red(`${debate.perspective2} Perspective:`));
        console.log(chalk.white(this.wrapText(round.perspective2, 75)));
        console.log();
      }
      
      if (index < debate.rounds.length - 1) {
        console.log(chalk.gray('~' .repeat(40)));
        console.log();
      }
    });

    if (debate.summary) {
      console.log(chalk.bold.blue('📋 SUMMARY'));
      console.log(chalk.cyan('-' .repeat(40)));
      console.log(chalk.white(this.wrapText(debate.summary, 75)));
      console.log();
    }

    console.log(chalk.bold.magenta('=' .repeat(80)));
    console.log(chalk.dim(`Generated on: ${new Date(debate.timestamp).toLocaleString()}`));
    console.log(chalk.bold.magenta('=' .repeat(80)));
  }

  wrapText(text, width) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length <= width) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines.join('\n');
  }
}

// CLI Setup
const cli = yargs
  .scriptName('politic-ai')
  .usage('$0 <cmd> [args]')
  .command(
    'debate [topic]',
    'Generate a debate on a controversial topic',
    (yargs) => {
      yargs
        .positional('topic', {
          type: 'string',
          describe: 'The controversial topic to debate'
        })
        .option('rounds', {
          alias: 'r',
          type: 'number',
          default: 3,
          describe: 'Number of debate rounds'
        })
        .option('pro', {
          type: 'string',
          default: 'Pro',
          describe: 'Label for the supporting perspective'
        })
        .option('con', {
          type: 'string',
          default: 'Con',
          describe: 'Label for the opposing perspective'
        });
    },
    async (argv) => {
      const app = new PoliticAI();
      await app.initialize();
      
      if (argv.topic) {
        await app.generateAndDisplayDebate(argv.topic, {
          rounds: argv.rounds,
          perspective1: argv.pro,
          perspective2: argv.con
        });
      } else {
        await app.interactiveMode();
      }
    }
  )
  .command(
    'interactive',
    'Start interactive debate generator',
    {},
    async () => {
      const app = new PoliticAI();
      await app.initialize();
      await app.interactiveMode();
    }
  )
  .command(
    'topics',
    'List suggested controversial topics',
    {},
    () => {
      const generator = new DebateGenerator('dummy'); // Don't need real API key for suggestions
      const topics = generator.getTopicSuggestions();
      
      console.log(chalk.bold.blue('\n📝 Suggested Controversial Topics:\n'));
      topics.forEach((topic, index) => {
        console.log(chalk.cyan(`${index + 1}. ${topic}`));
      });
      console.log();
    }
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .alias('help', 'h')
  .alias('version', 'v');

// Main execution
if (require.main === module) {
  cli.argv;
}

module.exports = PoliticAI;
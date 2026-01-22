import OpenAI from 'openai';
import 'dotenv/config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = 'asst_YSFli0c1XCmqLuID4hWuYt3e';

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not set');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function checkAssistant() {
  try {
    console.log(`\n🔍 Retrieving assistant: ${ASSISTANT_ID}\n`);
    const assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID);
    
    console.log('📋 Assistant Details:');
    console.log(`   ID: ${assistant.id}`);
    console.log(`   Name: ${assistant.name || '(no name)'}`);
    console.log(`   Model: ${assistant.model}`);
    console.log(`   Has Instructions: ${!!assistant.instructions}`);
    console.log(`   Instructions Length: ${assistant.instructions?.length || 0} characters\n`);
    
    if (assistant.instructions) {
      console.log('📝 Full System Prompt:');
      console.log('─'.repeat(80));
      console.log(assistant.instructions);
      console.log('─'.repeat(80));
      console.log();
      
      // Check for key phrases
      const hasOpeningGreeting = assistant.instructions.includes('opening_greeting');
      const hasAffynixGreeting = assistant.instructions.includes('Hello, thank you for contacting Affynix');
      const hasHowCanIAssist = assistant.instructions.includes('How can I assist');
      const hasHowMayIHelp = assistant.instructions.includes('How may I help');
      
      console.log('🔎 Key Phrase Checks:');
      console.log(`   Contains <opening_greeting>: ${hasOpeningGreeting ? '✅' : '❌'}`);
      console.log(`   Contains "Hello, thank you for contacting Affynix": ${hasAffynixGreeting ? '✅' : '❌'}`);
      console.log(`   Contains "How can I assist": ${hasHowCanIAssist ? '⚠️  (generic)' : '✅'}`);
      console.log(`   Contains "How may I help": ${hasHowMayIHelp ? '✅' : '❌'}`);
      console.log();
      
      if (!hasAffynixGreeting || hasHowCanIAssist) {
        console.log('⚠️  WARNING: The assistant\'s system prompt may not contain the correct greeting!');
        console.log('   Expected: "Hello, thank you for contacting Affynix. How may I help you?"');
        console.log('   But assistant is sending: "Hello! How can I assist you today?"\n');
      }
    } else {
      console.log('❌ ERROR: Assistant has no instructions!');
    }
  } catch (error) {
    console.error('❌ Error retrieving assistant:', error.message);
    process.exit(1);
  }
}

checkAssistant();


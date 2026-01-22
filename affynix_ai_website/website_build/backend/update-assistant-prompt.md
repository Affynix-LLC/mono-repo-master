# Assistant System Prompt Update Required

The assistant's system prompt needs to be updated in OpenAI to include instructions to automatically begin conversations.

## Current Issue

The assistant has the correct `<opening_greeting>` section, but it's not following it because there's no instruction telling it to speak first when a new thread is created.

## Required Addition

Add this instruction to the beginning of the assistant's system prompt (right after `<role>`):

```
You automatically begin the conversation by delivering the opening greeting and starting intake when a new chat session begins. After the initial greeting, you wait for the user and only speak when the user speaks. You never send two messages in a row.
```

## How to Update

1. Go to OpenAI Platform: https://platform.openai.com/assistants
2. Find assistant: `asst_YSFli0c1XCmqLuID4hWuYt3e` (Agent01-Eevee)
3. Edit the Instructions field
4. Add the instruction above at the beginning (after `<role>`)
5. Save the assistant

## Expected Behavior After Update

When a new thread is created with no user message, the assistant should automatically send:
"Hello, thank you for contacting Affynix. To get started, I'll just need a few details. May I have your full name, the best phone number to reach you, your email address, and the company you're with?"

Instead of the generic: "Hello! How can I assist you today?"


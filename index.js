import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import rl from "readline/promises"

dotenv.config();

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})

const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY
});

let message = [];

while (true) {
    const userInput = await readline.question("Enter your input: ");

    message.push({
        role: 'user',
        content: userInput
    })

    const stream = await model.stream(message);

    let aiMessage = "";

    for await (const chunk of stream) {
        // The response arrives in small chunks. Add each chunk to aiMessage
        // so we can save the complete assistant response in the conversation.
        aiMessage += chunk.content;

        // Write each chunk immediately so the response appears as it streams.
        process.stdout.write(chunk.content);
    }

    message.push({
        role: 'assistant',
        content: aiMessage
    })

    // End the response with a real newline. Without it, the next readline
    // prompt appears on the same line and can look like it is overwriting
    // the response.
    process.stdout.write("\n");
}
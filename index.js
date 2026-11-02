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

while (true) {
    const userInput = await readline.question("Enter your input: ");

    const stream = await model.stream([
        {
            role: 'user',
            content: userInput
        }
    ]);

    for await (const chunk of stream) {
        //console.log(chunk.content); // ise har token alag line me aa rahe hote hai is liye hm 

        // iska use karte hain
        process.stdout.write(chunk.content);

        // yek problem yahan e hai ki stdout nextline nhi le raha hota to is wajh se single line response me next line na lene ki wajh se
        // readline usi line ko use karne lagt ahai jis wajh se response override ho jata hai or usi line me input lene lag jata hai
    }

    // to is wajh se ham ye likhte hain
    process.stdout.write("/n")
}
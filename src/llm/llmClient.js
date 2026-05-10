import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ quiet: true });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    systemInstruction: `You are an AI Desktop Agent capable of executing tasks on the user's computer. 
    You have access to tools that control the OS.
    Rules:
    - Be concise in your responses.
    - When asked to open an app, use the exact executable name if possible.`
});

export async function generateResponse(contents, tools = []) {
    try {
        const result = await model.generateContent({
            contents,
            tools: [
                {
                    functionDeclarations: tools
                }
            ]
        });

        return result.response;
    } catch (error) {
        console.error("Gemini Error:", error);

        return "Something went wrong.";
    }
}
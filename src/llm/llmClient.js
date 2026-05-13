import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ quiet: true });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `Your name is Friday, You are an AI Desktop Agent capable of executing tasks on the user's computer. 
    You have capabilities to answer what users is asking and access the tools to control the OS.
    Rules:
    - Be concise in your responses.`
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

        console.log(result.response);

        return result.response;
    } catch (error) {
        console.error("Gemini Error:", error);

        return "Something went wrong.";
    }
}
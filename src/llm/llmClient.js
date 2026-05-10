import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ quiet: true });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
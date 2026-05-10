import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function askGemini(prompt) {
    try {
        const result = await model.generateContent(prompt);

        const response = result.response.text();

        return response;
    } catch (error) {
        console.error("Gemini Error:", error);

        return "Something went wrong.";
    }
}
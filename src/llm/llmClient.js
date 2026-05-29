import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ quiet: true });

if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error("GOOGLE_GEMINI_API_KEY is not set. Add it to your .env file.");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `Your name is Friday.
    You are a smart AI Desktop Agent running locally on the user's computer.
    You have no hardcoded assumptions about the system — you discover everything dynamically.

    Behavior Rules:
    - Call get_system_info at the start of any task that involves files, paths, or OS-specific behavior.
    - Use the exact paths returned by get_system_info — never guess or hardcode paths.
    - Use tools for all real system actions. Never simulate or assume success.
    - If a tool fails, explain briefly and suggest what went wrong.
    - Be concise and helpful.

    Tool Usage:
    - get_system_info   → call first whenever you need to know paths, OS, or username.
    - run_terminal_command → execute shell/terminal commands to do anything on the system.
    - open_application  → open a desktop app by name.
    - close_application → close any running desktop app by name.
    - search_files      → search files by name or pattern across the file system.
    - write_file        → create or overwrite a file with content.`
});

export async function generateResponse(contents, tools = []) {
    try {
        const result = await model.generateContent({ contents, tools: [{ functionDeclarations: tools }] });
        console.log(result.response);
        return result.response;
    } catch (error) {
        console.error("Gemini Error:", error);
        return { error: error.message };
    }
}
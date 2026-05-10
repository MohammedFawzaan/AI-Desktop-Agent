import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { runAgent } from "./src/agent/agentLoop.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startChat() {
    const response = await runAgent(
        "You MUST call dummy_tool with message 'hello from agent'."
    );

    console.log("\nFinal Response:\n");
    console.log(response);
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile("index.html");
};

app.whenReady().then(async () => {
    try {
        createWindow();
        await startChat();

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });

    } catch (error) {
        console.error("Error:", error);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
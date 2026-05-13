import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import { runAgent } from "./src/agent/agentLoop.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // In dev mode load from Vite dev server, in prod load the built file
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile('dist/index.html');
    }
};

app.whenReady().then(async () => {
    try {
        createWindow();

        ipcMain.on('user-message', async (event, text) => {
            try {
                const response = await runAgent(text);

                console.log("\nFinal Response:\n");
                console.log(response);

                // Send the LLM's response back to the React UI
                event.reply('agent-response', response);
            } catch (error) {
                console.error(error);
                event.reply('agent-response', "Sorry I encountered an error.");
            }
        });

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
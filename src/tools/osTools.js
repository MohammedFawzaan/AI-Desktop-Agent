import { runCommand } from "./terminalTools.js";
import { getSystemInfo } from "./systemTools.js";

export async function openApplication(appName) {
    const { platform } = getSystemInfo().result;
    let command = "";
    // WINDOWS
    if (platform === "win32")
        command = `powershell -Command "$app = Get-StartApps | Where-Object { $_.Name -replace '[\\s-]', '' -like '*${appName.replace(/[\s-]/g, '')}*' } | Select-Object -First 1; if ($app) { Start-Process explorer.exe shell:AppsFolder\\$($app.AppID) } else { Start-Process '${appName}' }"`;
    // MACOS
    else if (platform === "darwin")
        command = `open -a "${appName}"`;
    // LINUX
    else
        command = `"${appName}" &`;
    return await runCommand(command);
}

export async function closeApplication(appName) {
    const { platform } = getSystemInfo().result;
    let command = "";
    // WINDOWS
    if (platform === "win32")
        command = `taskkill /F /IM "${appName}"`;
    // MACOS
    else if (platform === "darwin")
        command = `killall "${appName}"`;
    // LINUX
    else
        command = `killall "${appName}"`;
    return await runCommand(command);
}
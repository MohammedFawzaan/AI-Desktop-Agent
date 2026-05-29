import os from "os";
import path from "path";
import { execSync } from "child_process";

let _cache = null;

export function getSystemInfo() {
    if (_cache) return _cache;

    const home     = os.homedir();
    const platform = os.platform();

    const paths = {
        home,
        desktop:   path.join(home, "Desktop"),
        documents: path.join(home, "Documents"),
        downloads: path.join(home, "Downloads"),
        pictures:  path.join(home, "Pictures"),
        videos:    path.join(home, "Videos"),
        music:     path.join(home, "Music"),
        temp:      os.tmpdir(),
    };

    if (platform === "win32") {
        paths.appData         = process.env.APPDATA              || path.join(home, "AppData", "Roaming");
        paths.localAppData    = process.env.LOCALAPPDATA         || path.join(home, "AppData", "Local");
        paths.programFiles    = process.env.ProgramFiles         || "C:\\Program Files";
        paths.programFilesX86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
        paths.systemRoot      = process.env.SystemRoot           || "C:\\Windows";
    }

    let localIP = "unknown";
    for (const ifaces of Object.values(os.networkInterfaces())) {
        for (const iface of ifaces || []) {
            if (iface.family === "IPv4" && !iface.internal) {
                localIP = iface.address;
                break;
            }
        }
        if (localIP !== "unknown") break;
    }

    function checkCommand(command) {
        try {
            const checker = platform === "win32" ? `where ${command}` : `which ${command}`;
            return execSync(checker, { encoding: "utf8" }).trim();
        } catch {
            return null;
        }
    }

    _cache = {
        success: true,
        result: {
            system: {
                platform,
                os:           os.type(),
                osVersion:    os.release(),
                architecture: os.arch(),
                hostname:     os.hostname(),
                uptimeHours:  (os.uptime() / 3600).toFixed(1),
            },
            user: {
                username: os.userInfo().username,
                homeDir:  home,
                shell:    process.env.SHELL || process.env.ComSpec || "unknown",
            },
            paths,
            network: {
                localIP,
                hostname: os.hostname(),
            },
            hardware: {
                cpuModel:      os.cpus()[0]?.model || "unknown",
                cpuCores:      os.cpus().length,
                totalMemoryGB: (os.totalmem() / 1024 ** 3).toFixed(1),
                freeMemoryGB:  (os.freemem()  / 1024 ** 3).toFixed(1),
            },
            runtime: {
                nodeVersion: process.version,
            },
            commands: {
                java:   checkCommand("java"),
                javac:  checkCommand("javac"),
                node:   checkCommand("node"),
                npm:    checkCommand("npm"),
                git:    checkCommand("git"),
                code:   checkCommand("code"),
                python: checkCommand("python"),
                chrome: checkCommand("chrome") || checkCommand("chrome.exe"),
            },
        }
    };

    return _cache;
}

export function getRunningProcesses() {
    const platform = os.platform();
    try {
        const output = execSync(
            platform === "win32" ? "tasklist" : "ps -A",
            { encoding: "utf8" }
        ).trim();
        return { success: true, result: output };
    } catch (error) {
        return { success: false, result: error.message };
    }
}

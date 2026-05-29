import { glob } from "glob";
import path from "path";
import fs from "fs/promises";
import { getSystemInfo } from "./systemTools.js";

function resolveDirectory(directory) {
    const { paths } = getSystemInfo().result;

    if (!directory) return paths.home;
    if (path.isAbsolute(directory)) return directory;

    const normalized = directory.replace(/\\/g, "/");
    const parts = normalized.split("/");
    const key = parts[0].toLowerCase().trim();

    if (paths[key]) {
        return parts.length > 1
            ? path.join(paths[key], ...parts.slice(1))
            : paths[key];
    }

    return path.join(paths.home, directory);
}

export async function searchFiles(pattern, directory) {
    try {
        const resolvedDir = resolveDirectory(directory);

        const files = await glob(pattern, {
            cwd: resolvedDir,
            absolute: true,
        });

        return {
            success: true,
            result: files.length > 0
                ? `Found ${files.length} file(s) in ${resolvedDir}:\n${files.join("\n")}${files.length > 20 ? `\n...and ${files.length - 20} more` : ""}`
                : `No files matching "${pattern}" found in ${resolvedDir}`,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            result: error.message,
        };
    }
}

export async function writeFile(filePath, content) {
    try {
        const dir = path.dirname(filePath);
        const fileName = path.basename(filePath);
        const resolvedDir = resolveDirectory(dir);
        const resolvedPath = path.join(resolvedDir, fileName);

        await fs.mkdir(resolvedDir, { recursive: true });
        await fs.writeFile(resolvedPath, content, "utf8");

        return {
            success: true,
            result: `File written successfully at ${resolvedPath}`
        };

    } catch (error) {
        return {
            success: false,
            result: error.message
        };
    }
}

const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { REGISTER_1, REGISTER_2 } = require("./constants");

const executeQuery = async (strQuery) => {
    try {
        const { stdout } = await exec(`reg query ${strQuery} /s`);

        return stdout
            .split("\n")
            .map((line) => line.trim())
            .filter((item) => Boolean(item));
    } catch (error) {
        console.error("Error getting installed software: \n", error);
        return [];
    }
};

const processRegister = (softwareList, registerLines) => {
    const app = {};

    for (const line of registerLines) {
        const displayNameMatch = line.match(/DisplayName\s+REG_SZ\s+(.*)/);
        const displayIconMatch = line.match(/DisplayIcon\s+REG_SZ\s+(.*)/);
        const displayVersionMatch = line.match(/DisplayVersion\s+REG_SZ\s+(.*)/);

        if (displayNameMatch) {
            app.displayName = displayNameMatch[1].trim();
        }
        if (displayIconMatch) {
            app.displayIcon = displayIconMatch[1].trim();
        }
        if (displayVersionMatch) {
            app.displayVersion = displayVersionMatch[1].trim();
        }
    }

    if (app.displayName && app.displayIcon) {
        softwareList.push({
            name: app.displayName,
            installLocation: app.displayIcon.replace(/,.*$/, ""),
            version: app.displayVersion,
        });
    }
};

const getInstalledSoftware = async () => {
    const [registersLinesPart1, registersLinesPart2] = await Promise.all([
        executeQuery(REGISTER_1),
        executeQuery(REGISTER_2),
    ]);
    const allRegistersLines = [...registersLinesPart1, ...registersLinesPart2];

    const softwareList = [];
    let currentRegisterLines = [];

    for (const line of allRegistersLines) {
        // If a new register is started, we add the current already recorded application to the list
        if (line.startsWith("HKEY_LOCAL_MACHINE")) {
            processRegister(softwareList, currentRegisterLines);
            currentRegisterLines = [];
        }
        currentRegisterLines.push(line);
    }
    // Checking if the last recorded register contained the required data and its recording
    processRegister(softwareList, currentRegisterLines);

    return softwareList.sort((a, b) => a.name.localeCompare(b.name));
};

module.exports = {
    getInstalledSoftware,
};

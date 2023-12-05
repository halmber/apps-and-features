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

const getInstalledSoftware = async () => {
    const [registersLinesPart1, registersLinesPart2] = await Promise.all([
        executeQuery(REGISTER_1),
        executeQuery(REGISTER_2),
    ]);
    const allRegistersLines = [...registersLinesPart1, ...registersLinesPart2];

    const softwareList = [];
    let currentSoftware = {};

    for (const line of allRegistersLines) {
        const displayNameMatch = line.match(/DisplayName\s+REG_SZ\s+(.*)/);
        const displayIconMatch = line.match(/DisplayIcon\s+REG_SZ\s+(.*)/);

        // If a new register is started, we add the current already recorded application to the list
        if (line.startsWith("HKEY_LOCAL_MACHINE")) {
            if (currentSoftware.DisplayName && currentSoftware.DisplayIcon) {
                softwareList.push({
                    name: currentSoftware.DisplayName,
                    installLocation: currentSoftware.DisplayIcon.replace(/,.*$/, ""),
                });

                currentSoftware = {};
            }
        }

        if (displayNameMatch) {
            currentSoftware.DisplayName = displayNameMatch[1].trim();
        }

        if (displayIconMatch) {
            currentSoftware.DisplayIcon = displayIconMatch[1].trim();
        }
    }
    if (currentSoftware.DisplayName && currentSoftware.DisplayIcon) {
        softwareList.push({
            name: currentSoftware.DisplayName,
            installLocation: currentSoftware.DisplayIcon.replace(/,.*$/, ""),
        });
    }

    return softwareList.sort((a, b) => a.name.localeCompare(b.name));
};

module.exports = {
    getInstalledSoftware,
};

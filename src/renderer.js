const api = window.api;

const softwareListElement = document.getElementById("software-list");
const loader = document.getElementById("loader");
const header = document.getElementById("header");

loader.classList.add("loading");

const softwareList = await api.getInstalledSoftware();

loader.classList.remove("loading");

const createAppInfoElements = (name, version) => {
    const nameElement = document.createElement("span");
    nameElement.textContent = name;

    const versionElement = document.createElement("span");
    versionElement.textContent = version;

    return [nameElement, versionElement];
};

if (softwareList.length > 0) {
    header.style.display = "flex";
}

softwareList.forEach((app) => {
    const listItem = document.createElement("li");

    const [appNameElement, appVersionElement] = createAppInfoElements(app.name, app.version);

    listItem.appendChild(appNameElement);
    listItem.appendChild(appVersionElement);
    listItem.addEventListener("dblclick", () => {
        console.log(app.installLocation);
        api.shell.openPath(app.installLocation);
    });

    softwareListElement.appendChild(listItem);
});

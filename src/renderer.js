const api = window.api;

const softwareListElement = document.getElementById("software-list");
const loader = document.getElementById("loader");

loader.classList.add("loading");

const softwareList = await api.getInstalledSoftware();

loader.classList.remove("loading");

softwareList.forEach((app) => {
    const listItem = document.createElement("li");

    listItem.textContent = app.name;
    listItem.addEventListener("dblclick", () => {
        console.log(app.installLocation);
        api.shell.openPath(app.installLocation);
    });

    softwareListElement.appendChild(listItem);
});

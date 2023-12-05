const api = window.api;

const softwareListElement = document.getElementById("software-list");

const softwareList = await api.getInstalledSoftware();

softwareList.forEach((app) => {
    const listItem = document.createElement("li");

    listItem.textContent = app.name;
    listItem.addEventListener("dblclick", () => {
        console.log(app.installLocation);
        api.shell.openPath(app.installLocation);
    });

    softwareListElement.appendChild(listItem);
});

const apiInterface = (typeof browser !== "undefined") ? browser : chrome;
const textarea = document.getElementById("params");
const messageEl = document.getElementById("message");

async function loadPopup() {
    const result = await apiInterface.storage.local.get("params");
    textarea.value = result.params && result.params.length > 0
        ? result.params.join("\n")
        : DEFAULT_PARAMS.join("\n");
}

async function savePopup() {
    const params = textarea.value
        .split("\n")
        .map(v => v.trim())
        .filter(v => v.length > 0);

    await apiInterface.storage.local.set({ params });

    messageEl.textContent = "Params were saved";
    messageEl.style.display = "inline";
    setTimeout(() => {
        messageEl.style.display = "none";
    }, 1500);
}

document.getElementById("save").addEventListener("click", savePopup);

loadPopup();
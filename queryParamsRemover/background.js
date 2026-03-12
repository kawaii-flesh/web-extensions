"use strict";

const apiInterface = (typeof browser !== "undefined") ? browser : chrome;

let targetQueryParams = [];

async function loadSettings() {
    const result = await apiInterface.storage.local.get("params");
    targetQueryParams = result.params && result.params.length > 0 ? result.params : DEFAULT_PARAMS;
}

function stripBadQueryParams(request) {
    const requestedUrl = new URL(request.url);
    let match = false;

    for (const paramName of targetQueryParams) {
        if (requestedUrl.searchParams.has(paramName)) {
            requestedUrl.searchParams.delete(paramName);
            match = true;
        }
    }

    return match ? { redirectUrl: requestedUrl.href } : { cancel: false };
}

loadSettings();

apiInterface.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.params) {
        targetQueryParams = changes.params.newValue.length > 0 ? changes.params.newValue : DEFAULT_PARAMS;
    }
});

apiInterface.webRequest.onBeforeRequest.addListener(
    stripBadQueryParams,
    {
        urls: ["http://*/*", "https://*/*"],
        types: ["main_frame", "sub_frame", "ping"]
    },
    ["blocking"]
);
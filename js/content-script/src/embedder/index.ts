// Initialize the on-site process
const script = document.createElement('script');
script.src = chrome.runtime.getURL('js/content-script/dist/controller.js');
(document.head || document.documentElement).appendChild(script);

const styles = document.createElement('link');
styles.rel = "stylesheet";
styles.href = chrome.runtime.getURL('js/content-script/styles/toast.css');
(document.head || document.documentElement).prepend(styles);

import { SettingsManager } from "@killswitch/common";
import { FromIsolate, FromPage } from "../ipc/schema";

const postMessage = window.postMessage.bind(window) as (message: FromIsolate, target: string) => void;

const defaultSettings = new SettingsManager();
const settings = new SettingsManager(window.origin, defaultSettings);

const updateClient = () => {
    postMessage({ _ksFromIsolate: true, kind: "settings", data: settings.getObject(), defaults: defaultSettings.getObject() }, "*");
};
settings.on("change", updateClient);
defaultSettings.fromChrome();
defaultSettings.trackChrome();
settings.fromChrome();
settings.trackChrome();

// Pull down the settings
window.addEventListener("message", (ev) => {
    if (!ev.data._ksFromPage) {
        return;
    }

    const msg = ev.data as FromPage;
    console.log(msg);
    switch (msg.kind) {
        case "loaded": {
            updateClient();
            break
        }
    }
});

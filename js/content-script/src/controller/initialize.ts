import { Feature, features, Option, SettingsManager } from "@killswitch/common";
import { FromIsolate, FromPage } from "../ipc/schema";
import { featureConfirm } from "./prompt";
import { toast } from "./toast";
import { WrapAccess, WrapGlobal, WrapProto } from "./wrappers";

declare global {
    export const accessKSFeature: (f: Feature) => boolean;
}

const postMessage = window.postMessage.bind(window) as (data: FromPage, target: string) => void;

const defaultSettings = new SettingsManager();
const currentSettings = new SettingsManager(window.origin, defaultSettings);

defaultSettings.fromObject(JSON.parse(localStorage.getItem("__ks_default") ?? '{}'))
currentSettings.fromObject(JSON.parse(localStorage.getItem("__ks_current") ?? '{}'))

currentSettings.on("change", () => {
    localStorage.setItem("__ks_default", JSON.stringify(defaultSettings.getObject()));
    localStorage.setItem("__ks_current", JSON.stringify(currentSettings.getObject()));
});

window.addEventListener("message", (ev) => {
    if (!ev.data._ksFromIsolate) {
        return;
    }

    const msg: FromIsolate = ev.data;
    console.log(msg);
    defaultSettings.fromObject(msg.defaults);
    currentSettings.fromObject(msg.data);
});

postMessage({ _ksFromPage: true, kind: "loaded" }, "*");

(window as any).accessKSFeature = (f: Feature) => {
    const value = currentSettings.get(f);
    if (value === Option.Notify) {
        toast(f);
    }
    if (value === Option.Prompt) {
        return featureConfirm(f);
    }

    return value === Option.On || value === Option.Notify
}

type Initializers = { [F in Feature]: () => void };

const initializers: Initializers = {
    [Feature.Crypto]: () => {
        WrapAccess(crypto, "subtle", Feature.Crypto);
    },
    [Feature.ServiceWorker]: () => {
        WrapAccess(navigator.serviceWorker, "register", Feature.ServiceWorker);
        WrapAccess(navigator, "serviceWorker", Feature.ServiceWorker);
    },
    [Feature.WebGL]: () => {
        WrapProto(HTMLCanvasElement, "getContext", Feature.WebGL);
    },
    [Feature.UserMedia]: () => {
        WrapProto(MediaDevices, "getUserMedia", Feature.UserMedia);
    },
    [Feature.Clipboard]: () => {
        WrapAccess(navigator.clipboard, "readText", Feature.Clipboard);
        WrapAccess(document, "execCommand", Feature.Clipboard);
    },
    [Feature.Orientation]: () => {
        WrapGlobal("AbsoluteOrientationSensor", Feature.Orientation);
        WrapGlobal("Accelerometer", Feature.Orientation);
        WrapGlobal("GravitySensor", Feature.Orientation);
        WrapGlobal("LinearAccelerationSensor", Feature.Orientation);
        WrapGlobal("Magnetometer", Feature.Orientation);
        WrapGlobal("RelativeOrientationSensor", Feature.Orientation);
    },
    [Feature.Location]: () => {
        WrapAccess(navigator, "geolocation", Feature.Location);
        WrapGlobal("Geolocation", Feature.Location);
    },
    [Feature.AmbientLight]: () => {
        WrapGlobal("AmbientLightSensor", Feature.AmbientLight);
    },
    [Feature.PaymentRequest]: () => {
        WrapGlobal("PaymentRequest", Feature.PaymentRequest);
    }
};

for (const feature of features) {
    initializers[feature]();
}
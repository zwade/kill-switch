export enum Feature {
    Crypto = 1,
    ServiceWorker = 2,
    WebGL = 3,
    UserMedia = 4,
    Clipboard = 5,
    Orientation = 6,
    Location = 7,
    AmbientLight = 8,
    PaymentRequest = 9,
};

export enum Option {
    On = 1,
    Off = 2,
    Prompt = 3,
    Notify = 4,
}

export type FeatureDescription = {
    [F in Feature]: {
        name: string;
        description: string;
        options?: Option[]; // Default to all are allowed
        default?: Option; // If unspecified, defaults to On
    };
};

export const FeatureDescription: FeatureDescription = {
    [Feature.Crypto]: {
        name: "Cryptography",
        description: "Allows your browser to compute cryptographic values such as hashes. Could potentially serve as a vector for crypto-jacking.",
    },
    [Feature.ServiceWorker]: {
        name: "Service Workers",
        description: "Service Workers are a class of web-worker that have certain privileges over standard execution, including the ability to register a cache and intercept web requests."
    },
    [Feature.WebGL]: {
        name: "WebGL",
        description: "WebGL grants the client access to a lower-level API for accessing the GPU. This allows the browser to use GPU resources. It has also been abused in the past as a unique fingerprint."
    },
    [Feature.UserMedia]: {
        name: "User Media",
        default: Option.Notify,
        description: "User Media APIs allow an application access to the microphone and camera."
    },
    [Feature.Clipboard]: {
        name: "Clipboard",
        default: Option.Notify,
        description: "The Clipboard API can allow applications the ability to change or read the current value of the clipboard."
    },
    [Feature.Orientation]: {
        name: "Device Orientation",
        default: Option.On,
        description: "Browsers have several sensors that can be used to determine device orientation. This includes the accelerometer, the gyroscope, and the magnetometer.",
    },
    [Feature.Location]: {
        name: "Device Location",
        default: Option.Notify,
        description: "The location API can use a number of techniques to approximate location, even when the device does not have a GPS.",
    },
    [Feature.AmbientLight]: {
        name: "Ambient Light Sensor",
        default: Option.Notify,
        description: "While coarse, the ambient light sensor can provide webpages with an approximation of how much light is in the environment. Notably, this could also include light produced by the device itself."
    },
    [Feature.PaymentRequest]: {
        name: "Payment Request",
        default: Option.Notify,
        description: "Provides browsers with a more efficient way of querying the payment preferences of users."
    }
}

export const features: Feature[] = [
    Feature.AmbientLight,
    Feature.Clipboard,
    Feature.Crypto,
    Feature.Location,
    Feature.Orientation,
    Feature.PaymentRequest,
    Feature.ServiceWorker,
    Feature.UserMedia,
    Feature.WebGL,
];
import { Feature, FeatureDescription } from "@killswitch/common";

type ActiveToast = {
    mentionedFeatures: Feature[];
    timeout: NodeJS.Timeout;
}

let notificationDiv: HTMLDivElement | undefined = undefined;
let activeToast: ActiveToast | null = null;

const alreadyShown = new Set<Feature>();
const delay = 4000;

export const toast = (feature: Feature) => {
    if (notificationDiv === undefined) {
        notificationDiv = document.createElement("div");
        notificationDiv.className = "_ks_toast";
        if (document.body) {
            document.body.prepend(notificationDiv);
        } else {
            window.addEventListener("load", () => document.body.append(notificationDiv!));
        }
    }

    if (alreadyShown.has(feature)) {
        return;
    }

    alreadyShown.add(feature);

    const clear = () => {
        notificationDiv!.className = "_ks_toast";
        activeToast = null;
    };

    if (activeToast === null) {
        notificationDiv.innerText = `This page is using the resource: ${FeatureDescription[feature].name}`;
        notificationDiv.className = "_ks_toast active";

        activeToast = {
            mentionedFeatures: [feature],
            timeout: setTimeout(clear, delay),
        };
    } else {
        clearTimeout(activeToast.timeout);
        activeToast.mentionedFeatures.push(feature);

        notificationDiv.innerText = `This page is using the resources: ${
            activeToast.mentionedFeatures
                .map((f) => FeatureDescription[f].name)
                .join(", ")
        }`;

        activeToast.timeout = setTimeout(clear, delay);
    }
}
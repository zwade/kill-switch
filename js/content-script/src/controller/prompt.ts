import { Feature, FeatureDescription, Option } from "@killswitch/common";

const sessionCache = new Map<Feature, boolean>();

export const featureConfirm = (feature: Feature) => {
    const previous = sessionCache.get(feature);
    if (previous !== undefined) return previous;

    const result = confirm(`Allow this page access to ${FeatureDescription[feature].name}?`);
    sessionCache.set(feature, result);
    return result;
}
import { Feature, Option } from "@killswitch/common";

export type FromPage = (
    | { kind: "loaded" }
) & { _ksFromPage: true };

export type FromIsolate = (
    | { kind: "settings", data: Record<Feature, Option>, defaults: Record<Feature, Option> }
) & { _ksFromIsolate: true };
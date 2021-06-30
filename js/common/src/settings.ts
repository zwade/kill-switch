import { Feature, FeatureDescription, features, Option } from "./features";
import { keys } from "./utils";

export class SettingsManager {
    private origin;
    private preferences;
    private defaults;
    private isTrackingChrome;
    private callbacks: Set<() => void>;

    constructor(origin?: string, fallback?: SettingsManager) {
        this.origin = origin ?? "__global_defaults";
        this.preferences = new Map<Feature, Option>();
        this.callbacks = new Set();
        this.isTrackingChrome = false;

        this.defaults = {} as Record<Feature, Option>;
        const setupDefaults = () => {
            for (const feature of features)
                this.defaults[feature] =
                    fallback?.get(feature)
                    ?? FeatureDescription[feature].default
                    ?? Option.On;
        }
        setupDefaults();

        fallback?.on("change", () => {
            setupDefaults();
            this.trigger("change");
        });

        this.applyChanges = this.applyChanges.bind(this);
    }

    private trigger(evt: "change") {
        for (const cb of this.callbacks) {
            cb();
        }
    }

    private applyChanges(changes: { [key: string]: chrome.storage.StorageChange; }, areaName: string) {
        if (changes[this.origin]?.newValue === undefined || areaName !== "sync") return;
        this.fromObject(changes[this.origin].newValue);
    }

    public getObject() {
        return [...this.preferences.entries()]
            .reduce((agg, [key, value]) => (agg[key] = value, agg), { } as Record<Feature, Option>);
    }

    public mergeObject(options: Record<Feature, Option | undefined>) {
        for (const key of keys(options)) {
            const value = options[key];
            if (value === undefined) {
                this.preferences.delete(parseInt(key));
            } else {
                this.preferences.set(parseInt(key) as Feature, value);
            }
        }
        this.trigger("change");
    }

    public fromObject(options: Record<Feature, Option>) {
        this.preferences.clear();
        this.mergeObject(options);
    }

    public mergeMap(options: Map<Feature, Option | undefined>) {
        for (const [key, value] of options) {
            if (value === undefined) {
                this.preferences.delete(key);
            } else {
                this.preferences.set(key, value);
            }
        }
        this.trigger("change");
    }

    public fromMap(options: Map<Feature, Option>) {
        this.preferences.clear();
        this.mergeMap(options);
    }

    public fromChrome() {
        chrome.storage.sync.get({ [this.origin]: {} }, (r) => {
            const results = r as { [origin: string]: Record<Feature, Option> };
            this.fromObject(results[this.origin]);
        });
    }

    public trackChrome() {
        if (this.isTrackingChrome) return;
        this.isTrackingChrome = true;

        chrome.storage.onChanged.addListener(this.applyChanges);
    }

    public untrackChrome() {
        if (!this.isTrackingChrome) return;
        this.isTrackingChrome = false;

        chrome.storage.onChanged.removeListener(this.applyChanges);
    }

    public saveToChrome() {
        chrome.storage.sync.set({ [this.origin]: this.getObject() });
    }

    public get(f: Feature) {
        return this.preferences.get(f) ?? this.defaults[f];
    }

    public getExplicit(f: Feature) {
        return this.preferences.get(f);
    }

    public getDefault(f: Feature) {
        return this.defaults[f];
    }

    public on(evt: "change", cb: () => void) {
        console.log("Adding binding element", this, this.callbacks, cb)
        this.callbacks.add(cb);
    }

    public off(evt: "change", cb: () => void) {
        console.log("Removing binding element", this, this.callbacks.has(cb));
        return this.callbacks.delete(cb);
    }
}
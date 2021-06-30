import * as React from "react";
import { Feature, FeatureDescription, features, Option } from "@killswitch/common";
import { Map as IMap } from "immutable";

import { FeatureToggle } from "./feature-toggle";
import { SettingsContext, SettingsProvider } from "../../providers/settings";
import { Button } from "../button";
import { TabContext } from "../../providers/tab";
import { TextInput } from "../text-input";
import { Checkbox } from "../checkbox";

import "./index.scss";
import { useLocalStorage } from "../../hooks";

export interface Props {
}

const _Settings = (props: Props) => {
    const { settings } = React.useContext(SettingsContext);
    const [updates, setUpdates] = React.useState(IMap<Feature, Option | undefined>())
    const [keywords, setKeywords] = React.useState<string>("");
    const [hideDescriptions, setHideDescriptions] = useLocalStorage(false, "hide-descriptions");

    if (settings === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div className={"settings"}>
            <div className="search">
                <TextInput value={keywords} onChange={setKeywords} placeholder={"Search for feature"}/>
                <Checkbox onChange={setHideDescriptions} value={hideDescriptions} label={"Hide descriptions"}/>
            </div>
            <div className="feature-list">
            {
                features
                    .filter((f) => {
                        if (keywords === "") return true;
                        const words = keywords
                            .toLowerCase()
                            .split(/\s+/g)
                            .filter((w) => w.length > 0);
                        const desc = FeatureDescription[f];
                        return words.some(
                            (word) =>
                                desc.name.toLowerCase().includes(word)
                                || (!hideDescriptions && desc.description.toLowerCase().includes(word))
                        );
                    })
                    .map((f) =>
                        <FeatureToggle
                            key={f}
                            feature={f}
                            default={settings.getDefault(f)}
                            currentOption={updates.has(f) ? updates.get(f) : settings.getExplicit(f)}
                            dirty={updates.has(f)}
                            hideDescription={hideDescriptions}
                            onChange={(option) => {
                                if (option !== settings.getExplicit(f)) {
                                    setUpdates(updates.set(f, option));
                                } else {
                                    setUpdates(updates.remove(f));
                                }
                            }}
                        />
                    )
            }
            </div>
            <Button
                className="save"
                label="Save"
                disabled={updates.size === 0}
                onClick={() => {
                    settings.mergeMap(new Map(updates.entries()));
                    settings.saveToChrome();
                    setUpdates(IMap());
                }}
            />
        </div>
    );
};

export const Settings = () => {
    const { origin } = React.useContext(TabContext);
    const { settings } = React.useContext(SettingsContext);
    const [useLocal, setUseLocal] = React.useState<"true" | "false">("true");

    if (origin === undefined || settings === undefined) {
        return (
            <div className="loading">
                Loading...
            </div>
        );
    }

    const selector = (
        <select className="editor-select" value={useLocal} onChange={(e) => setUseLocal(e.target.value as "true" | "false")}>
            <option value={"false"}>Editing: Defaults</option>
            <option value={"true"}>Editing: { origin }</option>
        </select>
    );

    if (useLocal === "true") {
        return (
            <>
                { selector }
                <SettingsProvider origin={origin}>
                    <_Settings/>
                </SettingsProvider>
            </>
        );
    } else {
        return (
            <>
                { selector }
                <_Settings/>
            </>
        );
    }
};

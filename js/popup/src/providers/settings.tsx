import * as React from "react";
import { SettingsManager, TheGreatLie } from "../../../common/dist";

type SettingsData = {
    settings?: SettingsManager
};


export const SettingsContext = React.createContext<SettingsData>({ settings: undefined });

export interface Props {
    origin?: string;
    children: React.ReactNode;
}

export const SettingsProvider = (props: Props) => {
    const parentSettings = React.useContext(SettingsContext);
    const [settings, setSettings] = React.useState<SettingsManager | undefined>(undefined);
    const [_, tick] = React.useState({});

    React.useEffect(() => {
        console.log("Mounting", props.origin);
        const newSettings = new SettingsManager(props.origin, parentSettings.settings);
        const ticker = () => tick({});

        newSettings.on("change", ticker);
        newSettings.fromChrome();
        newSettings.trackChrome();
        setSettings(newSettings);

        return () => {
            console.log("Calling cleanup", props.origin)
            newSettings.off("change", ticker);
            newSettings.untrackChrome();
        };
    }, [props.origin, parentSettings.settings]);
    console.log("Rerendering", props.origin, settings);

    return (
        <SettingsContext.Provider value={{ settings }}>
            { props.children }
        </SettingsContext.Provider>
    );
}


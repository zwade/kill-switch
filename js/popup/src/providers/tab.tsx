import * as React from "react";

export type ContextData = {
    origin?: string;
}

export const TabContext = React.createContext<ContextData>({ origin: undefined });

export const TabProvider = (props: { children: React.ReactNode }) => {
    const [origin, setOrigin] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
            if (!tabs[0]?.url) return;
            const url = new URL(tabs[0].url!);
            setOrigin(url.origin);
        });
    }, []);

    return (
        <TabContext.Provider value={{ origin }}>
            { props.children }
        </TabContext.Provider>
    )
};
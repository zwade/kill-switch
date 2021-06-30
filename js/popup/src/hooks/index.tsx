import * as React from "react";

export const useLocalStorage = <T extends any>(def: T, name: string) => {
    const [data, rawSetData] = React.useState(localStorage.getItem(name) !== undefined ? JSON.parse(localStorage.getItem(name)!) : def);

    const setData = (updated: T) => {
        localStorage.setItem(name, JSON.stringify(updated));
        rawSetData(updated);
    }

    return [data, setData] as const;
}
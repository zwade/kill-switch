import * as React from "react";

import { Settings } from "./settings";
import { SettingsProvider } from "../providers/settings";
import { TabProvider } from "../providers/tab";
import { Header } from "./header";

import "./app.scss";

export interface Props {

}

export const App = (props: Props) => {
    return (
        <TabProvider>
            <SettingsProvider>
                <Header/>
                <Settings/>
            </SettingsProvider>
        </TabProvider>
    );
}
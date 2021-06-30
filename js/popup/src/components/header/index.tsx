import * as React from "react";
import icon from "../../../../../images/icon-thin-x4.png";

import "./index.scss";

export interface Props {

}

export const Header = (props: Props) => {
    return (
        <div className="header">
            <span>kill</span>
            <img className="icon" src={icon}/>
            <span>switch</span>
        </div>
    )
}
import * as React from "react";

import "./index.scss";

export interface Props {
    value: boolean;
    onChange: (data: boolean) => void;
    label?: string;
    className?: string;
}

export const Checkbox = (props: Props) => {
    return (
        <div
            className={`ks-checkbox ${props.className ?? ""}`}
            onClick={() => props.onChange(!props.value)}
        >
            <input type="checkbox" checked={props.value}/>
            <div className="label">{ props.label }</div>
        </div>
    )
}
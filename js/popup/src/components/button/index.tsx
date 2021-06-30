import * as React from "react";

import "./index.scss";

export interface Props {
    label?: string
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export const Button = (props: Props) => {
    return (
        <button
            className={`button ${props.className ?? ""} ${props.disabled ? "disabled" : ""}`}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            { props.label }
        </button>
    );
};
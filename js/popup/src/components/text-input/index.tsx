import * as React from "react";

import "./index.scss";

export interface Props {
    value: string;
    onChange?: (data: string) => void;
    onClear?: () => void;
    onSubmit?: () => void;
    className?: string;
    placeholder?: string;
}

export const TextInput = (props: Props) => {
    return (
        <input
            type="text"
            className={`ks-text-input ${props.className ?? ""}`}
            value={props.value}
            onChange={(el) => props.onChange?.(el.target.value)}
            onKeyPress={(ev) => ev.key === "Enter" ? props.onSubmit?.() : null}
            placeholder={props.placeholder}
        />
    );
}
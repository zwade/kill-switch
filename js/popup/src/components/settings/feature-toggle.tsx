import * as React from "react";
import { Feature, FeatureDescription, Option } from "../../../../common/dist";

export interface Props {
    feature: Feature;
    default: Option;
    currentOption?: Option;
    onChange?: (option?: Option) => void;
    dirty?: boolean;
    hideDescription?: boolean;
}

const DEFAULT = "_default"

export const FeatureToggle = (props: Props) => {
    const desc = FeatureDescription[props.feature];

    const options = [
        { name: "Always Allow", value: Option.On },
        { name: "Always Deny", value: Option.Off },
        { name: "Prompt On Use", value: Option.Prompt },
        { name: "Notify On Use", value: Option.Notify },
        { name: `Default (${Option[props.default]})`, value: undefined }
    ];

    return (
        <div className={`feature-toggle ${props.hideDescription ? "hide-description" : ""}`}>
            <div className={`name ${props.dirty ? "dirty" : ""}`}>{ desc.name }</div>
            <div className="description">{ desc.description }</div>
            <div className="toggle">
                <select
                    className={props.currentOption !== undefined ? "modified" : ""}
                    value={props.currentOption ?? DEFAULT}
                    onChange={(e) => props.onChange?.(e.target.value === DEFAULT ? undefined : parseInt(e.target.value) as Option)}
                >
                    {
                        options.map(({ name, value }) => (
                            <option key={name} value={value ?? DEFAULT}>{ name }</option>
                        ))
                    }
                </select>
            </div>
        </div>
    );
};
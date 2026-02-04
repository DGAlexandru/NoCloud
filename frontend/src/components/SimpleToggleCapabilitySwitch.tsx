import React from "react";
import { Capability } from "../api/types";
import { useSimpleToggleQuery, useSimpleToggleMutation } from "../api";
import { ToggleSwitchListMenuItem } from "./list_menu/ToggleSwitchListMenuItem";

interface SimpleToggleCapabilitySwitchProps {
    capability: Capability;
    primaryLabel: string;
    secondaryLabel: string;
    icon: React.ReactElement;
}

export const SimpleToggleCapabilitySwitch: React.FC<SimpleToggleCapabilitySwitchProps> = ({
    capability,
    primaryLabel,
    secondaryLabel,
    icon
}) => {
    const { data, isFetching, isError } = useSimpleToggleQuery(capability);
    const { mutate, isPending } = useSimpleToggleMutation(capability);

    const loading = isFetching || isPending;
    const disabled = loading || isError;

    return (
        <ToggleSwitchListMenuItem
            value={data?.enabled ?? false}
            setValue={(value) => { mutate(value); }}
            disabled={disabled}
            loadError={isError}
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
            icon={icon}
        />
    );
};

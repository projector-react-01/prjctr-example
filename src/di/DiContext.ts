import React, { useContext } from "react";
import { AwilixContainer } from "awilix";

export const DiContext = React.createContext<AwilixContainer | undefined>(undefined);
export const useDiContainer = () => {
    const container = useContext(DiContext);

    if (!container) {
        throw new Error("Create and provide container");
    }

    return container;
};

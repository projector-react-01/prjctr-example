import React, { createContext, useState } from "react";
import { createContainer } from "awilix";

import { registerDependencies } from "./composition-root";

const container = createContainer({
    injectionMode: "CLASSIC"
});

registerDependencies(container);

const ContainerContext = createContext(container);

export const App: React.FC = () => {
    const [name, setName] = useState("worlddd");
    return (
        <ContainerContext.Provider value={container}>
            <input value={name} onChange={e => setName(e.target.value)} />
            <h1>Hello, {name}!</h1>
        </ContainerContext.Provider>
    );
};

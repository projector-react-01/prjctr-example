import React from "react";

import { registerDependencies } from "./composition-root";
import { container } from "./di/container";
import { Router } from "./routing/Router";
import { DiContext } from "./di/DiContext";
import { MountEffects } from "./effects/MountEffects";

registerDependencies(container);

export const App: React.FC = () => (
    <DiContext.Provider value={container}>
        <MountEffects />
        <Router />
    </DiContext.Provider>
);

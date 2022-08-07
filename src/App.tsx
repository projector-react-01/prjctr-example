import React from "react";

import { CssBaseline } from "@mui/material";
import { registerDependencies } from "./composition-root";
import { container } from "./di/container";
import { Router } from "./routing/Router";
import { DiContext } from "./di/DiContext";
import { MountEffects } from "./effects/MountEffects";

registerDependencies(container);

export const App: React.FC = () => (
    <DiContext.Provider value={container}>
        <CssBaseline />
        <MountEffects />
        <Router />
    </DiContext.Provider>
);

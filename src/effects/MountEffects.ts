import React, { useEffect, useState } from "react";
import { merge } from "rxjs";
import { useDiContainer } from "../di/DiContext";
import { Effect } from "./types";

export const MountEffects: React.FC = () => {
    const container = useDiContainer();
    const [effects] = useState(() => container.resolve("Effects") as readonly Effect[]);

    useEffect(() => {
        const subscription = merge(...effects.map(({ effect }) => effect())).subscribe();

        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

import React from "react";
import { HomePage } from "../pages/home/HomePage";
import { Route } from "./types";
import { assertNever } from "../ts-utils";

export type ViewProps = {
    readonly route: Route | undefined;
};

function getHomePage(route: Route) {
    switch (route) {
        case Route.Home:
            return <HomePage />;
        case Route.Video:
        case Route.Profile:
            return null;
        default:
            return assertNever(route);
    }
}

export const RouterView: React.FC<ViewProps> = ({ route }) => {
    if (!route) return null;

    return getHomePage(route);
};
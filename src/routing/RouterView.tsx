import React from "react";
import { HomePage } from "../pages/home/HomePage";
import { Route } from "./types";
import { assertNever } from "../ts-utils";
import { SignUpPageView } from "../pages/sign-up/SignUpPageView";
import { SignUpSuccessPageView } from "../pages/sign-up/SignUpSuccessPageView";
import { SignInPageView } from "../pages/sign-in/SignInPageView";

export type ViewProps = {
    readonly route: Route | undefined;
};

function getHomePage(route: Route) {
    switch (route) {
        case Route.Home:
            return <HomePage />;
        case Route.SignUp:
            return <SignUpPageView />;
        case Route.SignUpSuccess:
            return <SignUpSuccessPageView />;
        case Route.SignIn:
            return <SignInPageView />;
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

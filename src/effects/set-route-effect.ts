import { Observable, takeUntil } from "rxjs";
import { createEffect } from "./types";
import { Route } from "../routing/types";

function locationToRoute(location: string): Route {
    switch (true) {
        case location === "/":
            return Route.Home;
        default:
            return Route.Home;
    }
}

export function createSetRouteEffect(
    navigateTo: (route: Route) => void,
    dispose$: Observable<void>
) {
    return createEffect(() => {
        function handler() {
            const initValue = window.location.pathname;

            navigateTo(locationToRoute(initValue));
        }

        handler();

        return new Observable<void>(() => {
            console.log("start effect");
            window.addEventListener("popstate", handler);

            return () => window.removeEventListener("popstate", handler);
        }).pipe(takeUntil(dispose$));
    });
}

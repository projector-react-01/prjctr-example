import { Observable, takeUntil } from "rxjs";
import { createEffect } from "../effects/types";
import { pathnameRouteMap, Route } from "./types";

function locationToRoute(location: string): Route {
    return pathnameRouteMap[location] ?? Route.Home;
}

export function createMapHistoryToRouteEffect(
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
            window.addEventListener("popstate", handler);

            return () => window.removeEventListener("popstate", handler);
        }).pipe(takeUntil(dispose$));
    });
}

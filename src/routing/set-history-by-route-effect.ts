import { filter, map, Observable, takeUntil, tap } from "rxjs";
import { createEffect } from "../effects/types";
import { Route, routePathnameMap } from "./types";

function routeToLocation(route: Route): string {
    return routePathnameMap[route] ?? routePathnameMap[Route.Home];
}

export function createRouteToHistoryEffect(route$: Observable<Route>, dispose$: Observable<void>) {
    return createEffect(() =>
        route$.pipe(
            map(routeToLocation),
            filter(pathname => window.location.pathname !== pathname),
            tap(location => {
                window.history.pushState({}, "", location);
            }),
            takeUntil(dispose$)
        )
    );
}

import { map, Observable, Subject, withLatestFrom } from "rxjs";
import { isPrivateRoute, Route } from "./types";
import { connectAndReplay } from "../rxjs/connectAndReplay";

export type RouteService = {
    readonly route$: Observable<Route>;
    readonly navigateTo: (route: Route) => void;
};

export function createRouterService(
    isLoggedIn$: Observable<boolean>,
    dispose$: Observable<void>
): RouteService {
    const onNavigate$ = new Subject<Route>();

    const route$ = onNavigate$.pipe(
        withLatestFrom(isLoggedIn$),
        map(([route, isLoggedIn]) => (isPrivateRoute(route) && !isLoggedIn ? Route.SignIn : route)),
        connectAndReplay(dispose$)
    );

    return {
        route$,
        navigateTo: route => {
            onNavigate$.next(route);
        }
    };
}

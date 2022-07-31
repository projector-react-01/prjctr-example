import { connectable, Observable, ReplaySubject, Subject } from "rxjs";
import { Route } from "./types";

export type RouteService = {
    readonly route$: Observable<Route>;
    readonly navigateTo: (route: Route) => void;
};

export function createRouterService(): RouteService {
    const onNavigate$ = new Subject<Route>();

    const route$ = connectable(onNavigate$, {
        connector: () => new ReplaySubject(1)
    });

    route$.connect();

    return {
        route$,
        navigateTo: route => {
            onNavigate$.next(route);
        }
    };
}

import { Observable, Subject } from "rxjs";
import { Route } from "./types";
import { connectAndReplay } from "../rxjs/connectAndReplay";

export type RouteService = {
    readonly route$: Observable<Route>;
    readonly navigateTo: (route: Route) => void;
};

export function createRouterService(dispose$: Observable<void>): RouteService {
    const onNavigate$ = new Subject<Route>();

    const route$ = onNavigate$.asObservable().pipe(connectAndReplay(dispose$));

    return {
        route$,
        navigateTo: route => {
            onNavigate$.next(route);
        }
    };
}

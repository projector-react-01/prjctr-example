import { Observable } from "rxjs";
import { ComposeFunction, connect } from "../connect";
import { RouterView, ViewProps } from "./RouterView";
import { Route } from "./types";

export function createRouterStreams(route$: Observable<Route>): ComposeFunction<{}, ViewProps> {
    return () => ({
        props: {
            route: [route$, undefined]
        },
        effects: []
    });
}

export const Router = connect(RouterView, "Router");

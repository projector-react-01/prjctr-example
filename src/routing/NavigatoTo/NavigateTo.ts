import { map, Subject, tap, withLatestFrom } from "rxjs";
import { PropsWithChildren } from "react";
import { Route, routePathnameMap } from "../types";
import { ComposeFunction, connect } from "../../connect";
import { NavigateToView, ViewProps } from "./NavigateToView";

type Props = PropsWithChildren<{
    readonly route: Route;
}>;

export function createNavigateToStream(
    navigateTo: (route: Route) => void
): ComposeFunction<Props, ViewProps> {
    return props$ => {
        const onClick$ = new Subject<void>();
        const route$ = props$.pipe(map(({ route }) => route));
        const href$ = route$.pipe(map(route => routePathnameMap[route]));

        const navigateToEffect$ = onClick$.pipe(
            withLatestFrom(route$),
            tap(([, route]) => navigateTo(route))
        );

        return {
            props: {
                onClick: () => onClick$.next(),
                href: [href$, ""]
            },
            effects: [navigateToEffect$]
        };
    };
}

export type NavigateToTypeDef = {
    NavigateTo: ComposeFunction<Props, ViewProps>;
};

export const NavigateTo = connect<Props, ViewProps, NavigateToTypeDef>(
    NavigateToView,
    "NavigateTo"
);

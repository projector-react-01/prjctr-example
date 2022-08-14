import { Subject, tap } from "rxjs";
import { PropsWithChildren } from "react";
import { ComposeFunction, connect } from "../../../../connect";
import { LogoutItemView, ViewProps } from "./LogoutItemView";

type OnLogout = () => void;

type Props = PropsWithChildren<{}>;

export function composeLogoutItem(
    onLogout: OnLogout,
    navigateToHome: () => void
): ComposeFunction<Props, ViewProps> {
    return () => {
        const onClick$ = new Subject<void>();

        const logoutEffect$ = onClick$.pipe(tap(onLogout), tap(navigateToHome));

        return {
            props: {
                onClick: () => onClick$.next()
            },
            effects: [logoutEffect$]
        };
    };
}

export type LogoutTypeDEf = {
    LogoutItem: ComposeFunction<Props, ViewProps>;
};

export const LogoutItem = connect<Props, ViewProps, LogoutTypeDEf>(LogoutItemView, "LogoutItem");

import { map, Observable } from "rxjs";
import { ComposeFunction, connect } from "../../../connect";
import { HeaderView, ViewProps } from "./HeaderView";
import { MenuItemType } from "./types";

export type AuthService = {
    readonly isLoggedIn$: Observable<boolean>;
};

const LeftMenu = [MenuItemType.Home, MenuItemType.Profile];
const AuthorizedRightMenu = [MenuItemType.Logout];
const UnAuthorizedRightMenu = [MenuItemType.SignIn, MenuItemType.SignUp];

export function composeHeaderStreams(authService: AuthService): ComposeFunction<{}, ViewProps> {
    return () => {
        const rightMenu$ = authService.isLoggedIn$.pipe(
            map((isLoggedIn: boolean) => (isLoggedIn ? AuthorizedRightMenu : UnAuthorizedRightMenu))
        );

        return {
            props: {
                leftMenu: LeftMenu,
                rightMenu: [rightMenu$, UnAuthorizedRightMenu]
            },
            effects: []
        };
    };
}

export type HeaderTypeDef = {
    Header: ComposeFunction<{}, ViewProps>;
};

export const Header = connect<{}, ViewProps, HeaderTypeDef>(HeaderView, "Header");

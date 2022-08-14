import { Route } from "../../../routing/types";

export const enum MenuItemType {
    Home = "Home",
    Profile = "Profile",
    SignIn = "SignIn",
    SignUp = "SignUp",
    Logout = "Logout"
}

type NavigationMenuItemType = Exclude<MenuItemType, MenuItemType.Logout>;

export const NavigationMenuItemTypeToRoute: Record<NavigationMenuItemType, Route> = {
    [MenuItemType.Home]: Route.Home,
    [MenuItemType.Profile]: Route.Profile,
    [MenuItemType.SignIn]: Route.SignIn,
    [MenuItemType.SignUp]: Route.SignUp
};

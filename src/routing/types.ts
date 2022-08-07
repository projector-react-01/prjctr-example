export enum Route {
    Home = "Home",
    Profile = "Profile",
    SignIn = "SignIn",
    SignUp = "SignUp",
    SignUpSuccess = "SignUpSuccess"
}

export const routePathnameMap: Record<Route, string> = {
    [Route.Home]: "/",
    [Route.Profile]: "/profile",
    [Route.SignIn]: "/sign-in",
    [Route.SignUp]: "/sign-up",
    [Route.SignUpSuccess]: "/sign-up/success"
} as const;

export const pathnameRouteMap: Record<string, Route> = Object.entries(routePathnameMap).reduce(
    (acc, [route, path]) => ({
        ...acc,
        [path]: route
    }),
    {}
);

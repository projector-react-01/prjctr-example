import { asFunction, AwilixContainer } from "awilix";

import { Observable, Subject } from "rxjs";
import { createRequestService } from "./api/request-service";
import { ApiService, createApiService } from "./api/api-service";
import { AuthService, createAuthService } from "./auth/auth-service";
import { createRouterStreams, RouterTypeDef } from "./routing/Router";
import { createRouterService, RouteService } from "./routing/route-service";
import { composeHomePageStreams } from "./pages/home/HomePage";
import { createMapHistoryToRouteEffect } from "./routing/set-route-by-history-effect";
import { createNavigateToStream, NavigateToTypeDef } from "./routing/NavigatoTo/NavigateTo";
import { createRouteToHistoryEffect } from "./routing/set-history-by-route-effect";
import {
    createRegisterFormStreams,
    RegisterFormTypeDef
} from "./pages/sign-up/RegisterForm/RegisterForm";
import { Route } from "./routing/types";
import { createLoginFormStreams, LoginFormTypeDef } from "./pages/sign-in/LoginForm/LoginForm";
import { composeHeaderStreams, HeaderTypeDef } from "./components/Layout/Header/Header";
import { composeLogoutItem } from "./components/Layout/Header/LogoutItem/LogoutItem";

type DisposeDefinition = {
    readonly dispose$: Observable<void>;
};

type RouteDefinition = {
    readonly routeService: RouteService;
};

type ApiServiceDefinition = {
    readonly apiService: ApiService;
};

type AuthServiceDefinition = {
    readonly authService: AuthService;
};

type NavigateToDefinition = {
    readonly navigateToHome: () => void;
};

type ContainerDefinition = DisposeDefinition &
    RouteDefinition &
    RouterTypeDef &
    NavigateToDefinition &
    NavigateToTypeDef &
    RegisterFormTypeDef &
    ApiServiceDefinition &
    LoginFormTypeDef &
    AuthServiceDefinition &
    HeaderTypeDef;

function registerLayoutModule(container: AwilixContainer<ContainerDefinition>) {
    container.register(
        "Header",
        asFunction(() => composeHeaderStreams(container.resolve("authService")))
    );

    container.register(
        "LogoutItem",
        asFunction(() =>
            composeLogoutItem(
                container.resolve("authService").logout,
                container.resolve("navigateToHome")
            )
        )
    );
}

function registerAuthModule(container: AwilixContainer<ContainerDefinition>) {
    container.register(
        "RegisterForm",
        asFunction(() =>
            createRegisterFormStreams(
                {
                    signUp: container.resolve("apiService").login
                },
                () => container.resolve("routeService").navigateTo(Route.SignUpSuccess)
            )
        ).singleton()
    );

    container.register(
        "LoginForm",
        asFunction(() =>
            createLoginFormStreams(
                {
                    signIn: container.resolve("apiService").login
                },
                container.resolve("authService").fetchAccount,
                () => container.resolve("routeService").navigateTo(Route.Home)
            )
        ).singleton()
    );
}

function registerRouterModule(container: AwilixContainer<ContainerDefinition>) {
    container.register(
        "routeService",
        asFunction(() => createRouterService(container.resolve("dispose$"))).singleton()
    );

    container.register(
        "Router",
        asFunction(() => createRouterStreams(container.resolve("routeService").route$)).singleton()
    );

    container.register(
        "NavigateTo",
        asFunction(() => createNavigateToStream(container.resolve("routeService").navigateTo))
    );

    container.register(
        "navigateToHome",
        asFunction(() => () => container.resolve("routeService").navigateTo(Route.Home))
    );
}

function registerEffects(container: AwilixContainer<ContainerDefinition>) {
    container.register(
        "setRouteEffect",
        asFunction(({ routeService, dispose$ }) =>
            createMapHistoryToRouteEffect(routeService.navigateTo, dispose$)
        ).singleton()
    );

    container.register(
        "setHistoryEffect",
        asFunction(() =>
            createRouteToHistoryEffect(
                container.resolve("routeService").route$,
                container.resolve("dispose$")
            )
        ).singleton()
    );

    container.register(
        "Effects",
        asFunction(() => [
            container.resolve("setRouteEffect"),
            container.resolve("setHistoryEffect")
        ]).singleton()
    );
}

export function registerDependencies(container: AwilixContainer<ContainerDefinition>) {
    // eslint-disable-next-line no-underscore-dangle
    const _dispose$ = new Subject<void>();

    container.register(
        "dispose$",
        asFunction(() => _dispose$)
            .disposer(() => _dispose$.next())
            .singleton()
    );

    container.register("requestService", asFunction(() => createRequestService()).singleton());
    container.register(
        "apiService",
        asFunction(({ requestService }) => createApiService(requestService)).singleton()
    );
    container.register(
        "authService",
        asFunction(({ apiService, dispose$ }) =>
            createAuthService(apiService, dispose$)
        ).singleton()
    );

    container.register("HomePage", asFunction(() => composeHomePageStreams()).singleton());

    registerRouterModule(container);
    registerEffects(container);
    registerAuthModule(container);
    registerLayoutModule(container);
}

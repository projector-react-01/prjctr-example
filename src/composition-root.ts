import { AwilixContainer, asFunction } from "awilix";

import { Observable, Subject } from "rxjs";
import { createRequestService } from "./api/request-service";
import { ApiService, createApiService } from "./api/api-service";
import { createAuthService } from "./auth/auth-service";
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

type DisposeDefinition = {
    readonly dispose$: Observable<void>;
};

type RouteDefinition = {
    readonly routeService: RouteService;
};

type ApiServiceDefinition = {
    readonly apiService: ApiService;
};

type ContainerDefinition = DisposeDefinition &
    RouteDefinition &
    RouterTypeDef &
    NavigateToTypeDef &
    RegisterFormTypeDef &
    ApiServiceDefinition;

function registerRegisterModule(container: AwilixContainer<ContainerDefinition>) {
    container.register(
        "NavigateTo",
        asFunction(() => createNavigateToStream(container.resolve("routeService").navigateTo))
    );

    container.register(
        "RegisterForm",
        asFunction(() =>
            createRegisterFormStreams(
                {
                    signUp: container.resolve("apiService").register
                },
                () => container.resolve("routeService").navigateTo(Route.Home)
            )
        ).singleton()
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

    container.register(
        "routeService",
        asFunction(() => createRouterService(container.resolve("dispose$"))).singleton()
    );

    container.register(
        "Router",
        asFunction(() => createRouterStreams(container.resolve("routeService").route$)).singleton()
    );

    container.register("HomePage", asFunction(() => composeHomePageStreams()).singleton());

    registerEffects(container);

    container.register(
        "Effects",
        asFunction(() => [
            container.resolve("setRouteEffect"),
            container.resolve("setHistoryEffect")
        ]).singleton()
    );

    registerRegisterModule(container);
}

import { AwilixContainer, asFunction } from "awilix";

import { Observable, Subject } from "rxjs";
import { createRequestService } from "./api/request-service";
import { createApiService } from "./api/api-service";
import { createAuthService } from "./auth/auth-service";
import { createRouterStreams, RouterTypeDef } from "./routing/Router";
import { createRouterService, RouteService } from "./routing/route-service";
import { composeHomePageStreams } from "./pages/home/HomePage";
import { createSetRouteEffect } from "./effects/set-route-effect";

type DisposeDefinition = {
    readonly dispose$: Observable<void>;
};

type RouteDefinition = {
    readonly routeService: RouteService;
};

type ContainerDefinition = DisposeDefinition & RouteDefinition & RouterTypeDef;

function registerEffects(container: AwilixContainer) {
    container.register(
        "setRouteEffect",
        asFunction(({ routeService, dispose$ }) =>
            createSetRouteEffect(routeService.navigateTo, dispose$)
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

    container.register("Effects", asFunction(deps => [deps.setRouteEffect]).singleton());
}

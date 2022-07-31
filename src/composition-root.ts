import { AwilixContainer, asFunction } from "awilix";

import { createRequestService } from "./api/request-service";
import { createApiService } from "./api/api-service";
import { createAuthService } from "./auth/auth-service";
import { createRouterStreams } from "./routing/Router";
import { createRouterService } from "./routing/route-service";
import { composeHomePageStreams } from "./pages/home/HomePage";
import { createSetRouteEffect } from "./effects/set-route-effect";

function registerEffects(container: AwilixContainer) {
    container.register(
        "setRouteEffect",
        asFunction(({ routeService }) => createSetRouteEffect(routeService.navigateTo)).singleton()
    );
}

export function registerDependencies(container: AwilixContainer) {
    container.register("requestService", asFunction(() => createRequestService()).singleton());
    container.register(
        "apiService",
        asFunction(({ requestService }) => createApiService(requestService)).singleton()
    );
    container.register(
        "authService",
        asFunction(({ apiService }) => createAuthService(apiService)).singleton()
    );

    container.register("routeService", asFunction(() => createRouterService()).singleton());

    container.register(
        "Router",
        asFunction(({ routeService }) => createRouterStreams(routeService.route$)).singleton()
    );

    container.register("HomePage", asFunction(() => composeHomePageStreams()).singleton());

    registerEffects(container);

    container.register("Effects", asFunction(deps => [deps.setRouteEffect]).singleton());
}

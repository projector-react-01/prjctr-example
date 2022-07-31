import { AwilixContainer, asFunction } from "awilix";

import { createRequestService } from "./api/request-service";
import { createApiService } from "./api/api-service";
import { createAuthService } from "./auth/auth-service";

export function registerDependencies(container: AwilixContainer) {
    container.register(
        "requestService",
        asFunction(() => createRequestService())
    );
    container.register(
        "apiService",
        asFunction(({ requestService }) => createApiService(requestService))
    );
    container.register(
        "authService",
        asFunction(({ apiService }) => createAuthService(apiService))
    );
}

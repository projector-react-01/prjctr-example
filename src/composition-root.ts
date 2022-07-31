import { createRequestService } from "./api/request-service";
import { createApiService } from "./api/api-service";
import { createAuthService } from "./auth/auth-service";

const requestService = createRequestService();
const apiService = createApiService(requestService);
const authService = createAuthService(apiService);

authService.login("roman", "123");

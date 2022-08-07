import { AxiosError } from "axios";
import { assert } from "../ts-utils";

type FailedOperationResponse = {
    readonly isSuccess: false;
    readonly error: string;
};

type SuccessOperationResponse = {
    readonly isSuccess: true;
};

type Response = FailedOperationResponse | SuccessOperationResponse;

export type ApiService = {
    readonly register: (username: string, password: string) => Promise<Response>;
    readonly login: (username: string, password: string) => Promise<void>;
    readonly logout: () => Promise<void>;
};

type RequestService = {
    readonly request: <K, T extends {}>(
        endpoint: string,
        method: string,
        payload?: T
    ) => Promise<K>;
};

type AxiosDetailResponse = {
    readonly detail: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isAxiosError(_e: unknown): _e is AxiosError<AxiosDetailResponse> {
    return true;
}

export function createApiService(requestService: RequestService): ApiService {
    let jwt: string | undefined;
    return {
        register: async (username, password) => {
            try {
                await requestService.request("/api/auth/register", "post", {
                    username,
                    password
                });

                return {
                    isSuccess: true
                };
            } catch (e) {
                assert(isAxiosError(e));

                return {
                    isSuccess: false,
                    error: e.response?.data.detail ?? "Something wend wrong"
                };
            }
        },
        login: async (username, password) => {
            jwt = await requestService.request("/api/auth/login", "post", {
                username,
                password
            });

            console.log(jwt);
        },
        logout: () => requestService.request("/logout", "post")
    };
}

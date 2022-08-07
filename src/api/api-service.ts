import { AxiosError } from "axios";
import { assert } from "../ts-utils";
import { Response } from "../common/network/response";

export type ApiService = {
    readonly register: (username: string, password: string) => Promise<Response>;
    readonly login: (username: string, password: string) => Promise<Response>;
    readonly logout: () => Promise<void>;

    readonly fetchAccount: () => Promise<Response<{ readonly username: string }>>;
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
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { data } = await requestService.request("/api/auth/login", "post", {
                    username,
                    password
                });

                jwt = data;

                console.log(jwt);

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

        fetchAccount: async () => {
            try {
                const { data } = await requestService.request("/me", "get");

                return {
                    isSuccess: true,
                    response: {
                        username: data.user
                    }
                };
            } catch (e) {
                assert(isAxiosError(e));

                return {
                    isSuccess: false,
                    error: e.response?.data.detail ?? "Something wend wrong"
                };
            }
        },

        logout: () => requestService.request("/logout", "post")
    };
}

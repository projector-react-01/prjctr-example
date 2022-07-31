export type ApiService = {
    readonly register: (username: string, password: string) => Promise<void>;
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

export function createApiService(requestService: RequestService): ApiService {
    let jwt: string | undefined;
    return {
        register: async (username, password) => {
            await requestService.request("/api/auth/register", "post", {
                username,
                password
            });
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

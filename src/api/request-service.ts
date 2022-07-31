import axios from "axios";

export type RequestService = {
    readonly request: <K, T extends {}>(
        endpoint: string,
        method: string,
        payload?: T
    ) => Promise<K>;
};

export function createRequestService(): RequestService {
    return {
        request: (endpoint, method, payload) =>
            axios.request({
                method,
                data: payload,
                baseURL: "http://localhost:8000",
                responseType: "json",
                url: endpoint
            })
    };
}

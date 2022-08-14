import { filter, map, merge, Observable, scan, Subject, switchMap } from "rxjs";
import { assertNever } from "../ts-utils";
import { connectAndReplay } from "../rxjs/connectAndReplay";
import { isSuccessOperationResult, Response } from "../common/network/response";

export type AuthState =
    | {
          readonly isLoggedIn: true;
          readonly username: string;
      }
    | {
          readonly isLoggedIn: false;
          readonly isLogging: boolean;
      };

export type AuthService = {
    readonly state$: Observable<AuthState>;
    readonly isLoggedIn$: Observable<boolean>;
    readonly fetchAccount: () => void;
    readonly logout: () => void;
};

const enum ActionType {
    Loading = "Loading",
    Logout = "Logout",
    AccountWasFetched = "AccountWasFetched"
}

const Actions = {
    accountWasFetched: ({ username }: { readonly username: string }) =>
        ({
            type: ActionType.AccountWasFetched,
            payload: { username }
        } as const),

    logout: () =>
        ({
            type: ActionType.Logout
        } as const),

    fetchAccount: () =>
        ({
            type: ActionType.Loading
        } as const)
};

const initialState: AuthState = {
    isLoggedIn: false,
    isLogging: false
};

type ApiService = {
    readonly fetchAccount: () => Promise<Response<{ readonly username: string }>>;
    readonly logout: () => Promise<void>;
};

export function createAuthService(apiService: ApiService, dispose$: Observable<void>): AuthService {
    const onFetchAccount = new Subject<void>();
    const onLogout$ = new Subject<void>();

    const loginResult$ = onFetchAccount.pipe(
        switchMap(() => apiService.fetchAccount()),
        filter(isSuccessOperationResult),
        map(({ response }) => response)
    );

    const state$ = merge(
        onFetchAccount.pipe(map(() => Actions.fetchAccount())),
        onLogout$.pipe(map(() => Actions.logout())),
        loginResult$.pipe(map(Actions.accountWasFetched))
    ).pipe(
        scan((_: AuthState, event): AuthState => {
            switch (event.type) {
                case ActionType.Loading:
                    return {
                        isLoggedIn: false,
                        isLogging: true
                    };
                case ActionType.Logout:
                    return initialState;
                case ActionType.AccountWasFetched:
                    return {
                        isLoggedIn: true,
                        username: event.payload.username
                    };
                default:
                    return assertNever(event);
            }
        }, initialState),
        connectAndReplay(dispose$)
    );

    return {
        state$,
        isLoggedIn$: state$.pipe(map(({ isLoggedIn }) => isLoggedIn)),
        fetchAccount: () => onFetchAccount.next(),
        logout: () => onLogout$.next()
    };
}

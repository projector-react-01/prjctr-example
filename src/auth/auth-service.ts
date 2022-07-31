import { connectable, map, merge, Observable, scan, Subject, switchMap } from "rxjs";
import { assertNever } from "../ts-utils";

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
    readonly login: (username: string, password: string) => void;
    readonly logout: () => void;
};

const enum ActionType {
    Login = "Login",
    Logout = "Logout",
    LoggedIn = "LoggedIn"
}

const Actions = {
    loggedIn: (username: string) =>
        ({
            type: ActionType.LoggedIn,
            payload: { username }
        } as const),

    logout: () =>
        ({
            type: ActionType.Logout
        } as const),

    login: () =>
        ({
            type: ActionType.Login
        } as const)
};

const initialState: AuthState = {
    isLoggedIn: false,
    isLogging: false
};

type ApiService = {
    readonly login: (username: string, password: string) => Promise<void>;
    readonly logout: () => Promise<void>;
};

export function createAuthService(apiService: ApiService): AuthService {
    const onLogin$ = new Subject<readonly [username: string, password: string]>();
    const onLogout$ = new Subject<void>();

    const loginResult$ = onLogin$.pipe(
        switchMap(([username, password]) =>
            apiService.login(username, password).then(() => username)
        )
    );

    const state$ = connectable(
        merge(
            onLogin$.pipe(map(() => Actions.login())),
            onLogout$.pipe(map(() => Actions.logout())),
            loginResult$.pipe(map(Actions.loggedIn))
        ).pipe(
            scan((_: AuthState, event): AuthState => {
                switch (event.type) {
                    case ActionType.Login:
                        return {
                            isLoggedIn: false,
                            isLogging: true
                        };
                    case ActionType.Logout:
                        return initialState;
                    case ActionType.LoggedIn:
                        return {
                            isLoggedIn: true,
                            username: event.payload.username
                        };
                    default:
                        return assertNever(event);
                }
            }, initialState)
        )
    );

    state$.connect();

    return {
        state$,
        login: (username, password) => onLogin$.next([username, password]),
        logout: () => onLogout$.next()
    };
}

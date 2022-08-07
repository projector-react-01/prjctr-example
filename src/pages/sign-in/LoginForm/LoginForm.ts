import { catchError, filter, map, of, share, Subject, switchMap, tap, withLatestFrom } from "rxjs";
import { ComposeFunction, connect } from "../../../connect";
import { LoginFormView, ViewProps } from "./LoginFormView";
import { isFailedOperationResult, Response } from "../../../common/network/response";

type SignInService = {
    readonly signIn: (username: string, password: string) => Promise<Response>;
};

export function createLoginFormStreams(
    signInService: SignInService,
    fetchAccount: () => void,
    navigateOnSuccess: () => void
): ComposeFunction<{}, ViewProps> {
    const onUserNameChange$ = new Subject<string>();
    const onPasswordChange$ = new Subject<string>();
    const onSubmit$ = new Subject<void>();

    const onSubmitResult$ = onSubmit$.pipe(
        withLatestFrom(onUserNameChange$, onPasswordChange$),
        switchMap(([, username, password]) => signInService.signIn(username, password)),
        catchError(() =>
            of<Response>({
                isSuccess: false,
                error: "Something went wrong"
            })
        ),
        share()
    );

    const navigateEffect$ = onSubmitResult$.pipe(
        filter(result => result.isSuccess === true),
        tap(() => fetchAccount()),
        tap(() => navigateOnSuccess()),
        share()
    );

    const error$ = onSubmitResult$.pipe(
        filter(isFailedOperationResult),
        map(({ error }) => error)
    );

    return () => ({
        props: {
            error: [error$, undefined],
            username: [onUserNameChange$, ""],
            password: [onPasswordChange$, ""],
            onUsernameUpdate: username => {
                onUserNameChange$.next(username);
            },
            onPasswordUpdate: password => onPasswordChange$.next(password),
            onSubmit: () => onSubmit$.next()
        },
        effects: [navigateEffect$]
    });
}

export type LoginFormTypeDef = {
    LoginForm: ComposeFunction<{}, ViewProps>;
};

export const LoginForm = connect<{}, ViewProps, LoginFormTypeDef>(LoginFormView, "LoginForm");

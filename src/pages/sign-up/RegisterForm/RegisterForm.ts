import { catchError, filter, map, of, share, Subject, switchMap, tap, withLatestFrom } from "rxjs";
import { ComposeFunction, connect } from "../../../connect";
import { RegisterFormView, ViewProps } from "./RegisterFormView";

type SignupResultSuccess = {
    readonly isSuccess: true;
};

type SignupResultFailed = {
    readonly isSuccess: false;
    readonly error: string;
};

type SignupResult = SignupResultSuccess | SignupResultFailed;

function isFailedSuccessResult(result: SignupResult): result is SignupResultFailed {
    return !result.isSuccess;
}

type SignUpService = {
    readonly signUp: (username: string, password: string) => Promise<SignupResult>;
};

export function createRegisterFormStreams(
    signupService: SignUpService,
    navigateOnSuccess: () => void
): ComposeFunction<{}, ViewProps> {
    return () => {
        const onUserNameChange$ = new Subject<string>();
        const onPasswordChange$ = new Subject<string>();
        const onSubmit$ = new Subject<void>();

        const onSubmitResult$ = onSubmit$.pipe(
            withLatestFrom(onUserNameChange$, onPasswordChange$),
            switchMap(([, username, password]) => signupService.signUp(username, password)),
            catchError(() =>
                of<SignupResult>({
                    isSuccess: false,
                    error: "Something went wrong"
                })
            ),
            share()
        );

        const navigateEffect$ = onSubmitResult$.pipe(
            filter(result => result.isSuccess === true),
            tap(() => navigateOnSuccess()),
            share()
        );

        const error$ = onSubmitResult$.pipe(
            filter(isFailedSuccessResult),
            map(({ error }) => error)
        );

        return {
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
        };
    };
}

export type RegisterFormTypeDef = {
    RegisterForm: ComposeFunction<{}, ViewProps>;
};

export const RegisterForm = connect<{}, ViewProps, RegisterFormTypeDef>(
    RegisterFormView,
    "RegisterForm"
);

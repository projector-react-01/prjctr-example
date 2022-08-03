import {
    connectable,
    MonoTypeOperatorFunction,
    Observable,
    ReplaySubject,
    take,
    takeUntil
} from "rxjs";

export function connectAndReplay<T>(dispose$: Observable<void>): MonoTypeOperatorFunction<T> {
    return source => {
        const connected$ = connectable(source, {
            connector: () => new ReplaySubject(1)
        });

        const subscription = connected$.connect();

        dispose$.pipe(take(1)).subscribe(() => subscription.unsubscribe());

        return connected$.pipe(takeUntil(dispose$));
    };
}

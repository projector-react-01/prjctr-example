import React, { useEffect, useState } from 'react';
import { combineLatest, map, Observable, Subject } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ComposeFunctionOutput<VP extends {}, K extends keyof VP = keyof VP> = {
    readonly props: Record<
        string,
        VP[K] | readonly [observable: Observable<VP[K]>, defaultValue: VP[K]]
    >;
    readonly effects: readonly Observable<unknown>[];
};

export type ComposeFunction<P extends {}, VP extends {}> = (
    // eslint-disable-next-line no-unused-vars
    props$: Observable<P>
) => ComposeFunctionOutput<VP>;

export function connect<P extends {}, VP extends {}>(
    view: React.FC<VP>,
    composeFunction: ComposeFunction<P, VP>
): React.FC<P> {
    return props => {
        const [props$] = useState(() => new Subject<P>());

        const [out] = useState(() => composeFunction(props$));
        const [viewProps, setViewProps] = useState<VP>(
            Object.keys(out.props).reduce((vp, key) => {
                const value = out.props[key];
                const isObservableValue = Array.isArray(value) && value[0] instanceof Observable;

                if (!isObservableValue) {
                    return {
                        ...vp,
                        [key]: value
                    };
                }

                const [, defaultValue] = value;

                return {
                    ...vp,
                    [key]: defaultValue
                };
            }, {} as Partial<VP>) as VP
        );

        useEffect(() => {
            const outStreams: readonly Observable<[string, unknown]>[] = Object.keys(
                out.props
            ).reduce((vp, key) => {
                const value = out.props[key];
                const isObservableValue = Array.isArray(value) && value[0] instanceof Observable;

                if (isObservableValue) {
                    return [...vp, value[0].pipe(map(nextStreamValue => [key, nextStreamValue]))];
                }

                return vp;
            }, [] as readonly Observable<[string, unknown]>[]);

            const outStream$ = combineLatest(outStreams).pipe(
                map(values =>
                    values.reduce(
                        (vp, [key, value]) => ({
                            ...vp,
                            [key]: value
                        }),
                        {} as Partial<VP>
                    )
                )
            );

            const subscription = outStream$.subscribe({
                next: partialProps => {
                    setViewProps({ ...viewProps, ...partialProps });
                }
            });

            return () => {
                subscription.unsubscribe();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useEffect(() => {
            props$.next(props);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [...Object.values(props)]);

        useEffect(() => {
            const subscription = combineLatest(out.effects).subscribe();

            return () => subscription.unsubscribe();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return view(viewProps);
    };
}

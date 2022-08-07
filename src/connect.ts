import React, { useEffect, useState } from "react";
import { combineLatest, map, Observable, Subject } from "rxjs";
import { AwilixContainer } from "awilix";
import { useDiContainer } from "./di/DiContext";

type PropsOutput<VP> = {
    [K in keyof VP]: VP[K] | readonly [observable: Observable<VP[K]>, defaultValue: VP[K]];
};

export type ComposeFunctionOutput<VP extends {}> = {
    readonly props: PropsOutput<VP>;
    readonly effects: readonly Observable<unknown>[];
};

export type ComposeFunction<P extends {}, VP extends {}> = (
    props$: Observable<P>
) => ComposeFunctionOutput<VP>;

export function connect<
    P extends {},
    VP extends {},
    TypeDef extends Record<string, ComposeFunction<P, VP>>,
    K extends keyof TypeDef = keyof TypeDef
>(view: React.FC<VP>, controllerName: K): React.FC<P> {
    return props => {
        const [props$] = useState(() => new Subject<P>());
        const container = useDiContainer();

        const [composeController] = useState(() =>
            (container as AwilixContainer<TypeDef>).resolve(controllerName)
        );

        const [out] = useState(() => composeController(props$));

        const [viewProps, setViewProps] = useState<VP>(() => {
            const keys = Object.keys(out.props) as (keyof VP)[];

            return keys.reduce<Partial<VP>>((vp, key) => {
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
            }, {} as Partial<VP>) as VP;
        });

        useEffect(() => {
            const keys = Object.keys(out.props) as (keyof VP)[];
            const outStreams: readonly Observable<[string, unknown]>[] = keys.reduce((vp, key) => {
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

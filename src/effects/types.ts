import { Observable } from "rxjs";

const effectType = Symbol("Effect");

export type Effect = {
    readonly type: typeof effectType;
    readonly effect: () => Observable<any>;
};

export function createEffect(effectFactory: () => Observable<any>): Effect {
    return {
        type: effectType,
        effect: effectFactory
    };
}

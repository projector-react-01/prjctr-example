export function assertNever(x: never): never {
    throw new Error(`Invalid value. Should be never, got ${x}`);
}

export function assert(condition: boolean): asserts condition {
    if (condition === false) {
        throw new Error("value must be defined");
    }
}

export type UnionOfArrayTypes<T> = T extends (infer K)[] ? K : never;

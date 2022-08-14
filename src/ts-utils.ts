export function assertNever(x: never): never {
    throw new Error(`Invalid value. Should be never, got ${x}`);
}

export function assert(condition: boolean): asserts condition {
    if (condition === false) {
        throw new Error("value must be defined");
    }
}

export function isUndefined<T>(value: T | undefined): value is undefined {
    return value === undefined;
}

export function isNotUndefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

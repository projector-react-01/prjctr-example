export function assertNever(x: never): never {
    throw new Error(`Invalid value. Should be never, got ${x}`);
}

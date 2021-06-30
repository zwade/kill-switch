
type FilterKeys<T extends string | number | symbol> =
    T extends string ? T :
    T extends number ? `${T}` :
    never;

type Keys<T> = FilterKeys<keyof T>[]

export const keys = <T>(obj: T) => {
    return Object.keys(obj) as Keys<T>;
}

export const TheGreatLie = <T extends {}>(): T => { // eslint-disable-line
    return new Proxy({} as T, {
        get: (_target, key) => {
            throw new Error(`Attempted to use value from unitialized context: ${String(key)}`);
        }
    });
};

import { Feature } from "@killswitch/common";

export const WrapProto = <FnName extends string, Cls extends { prototype: { [Name in FnName]: (...args: any) => any }}>(cls: Cls, fn: FnName, feature: Feature) => {
    const original = cls.prototype[fn];
    cls.prototype[fn] = function (...args) {
        if (accessKSFeature(feature)) {
            const result = (original as any).bind(this, ...args)();
            return result;
        }
    };
}

export const WrapAccess = <Name extends string, Obj extends { [N in Name]: unknown }>(obj: Obj, name: Name, feature: Feature) => {
    const original = obj[name];
    delete obj[name];
    Object.defineProperty(obj, name, {
        "get": () => {
            if (accessKSFeature(feature)) {
                if (original instanceof Function) {
                    return original.bind(obj);
                } else {
                    return original;
                }
            } else {
                return undefined;
            }
        },
    });
}

export const WrapGlobal = <Name extends string>(name: Name, feature: Feature) => {
    const original = (window as any)[name];
    if (typeof original !== "function") {
        console.error("Trying to wrap non-constructor:", original);
        return;
    }

    (window as any)[name] = function (...args: any[]) {
        if (accessKSFeature(feature)) {
            return new (original as unknown as { new(...args: any): unknown })(...args);
        } else {
            return Object.create(null);
        }
    } as any;
};

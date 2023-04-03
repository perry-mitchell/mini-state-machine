const _getClassOf = Function.prototype.call.bind(Object.prototype.toString);

export function cloneArray<T extends Array<any>>(arr: T): T {
    return arr.map(value =>
        Array.isArray(value) ? cloneArray(value) : isCloneable(value) ? cloneObject(value) : value
    ) as T;
}

export function cloneObject<T extends { [key: string]: any }>(object: T): T {
    const copy = Object.assign({}, object);
    for (const prop in copy) {
        if (!copy.hasOwnProperty(prop)) continue;
        if (Array.isArray(copy[prop])) {
            copy[prop] = cloneArray(copy[prop]);
        } else if (isCloneable(copy[prop])) {
            copy[prop] = cloneObject(copy[prop]);
        }
    }
    return copy;
}

function getClassOf(object: { [key: string]: any }): any {
    const internal = _getClassOf(object);
    if (internal !== "[object Object]") return internal;
    return `[object ${Object.getPrototypeOf(object).constructor.name}]`;
}

function isCloneable(value: any): boolean {
    return !!value && typeof value === "object" && isPlainObject(value);
}

function isPlainObject(object: any): boolean {
    return getClassOf(object) === "[object Object]";
}

interface FindOptions {
    index?: boolean;
}

export function find<T>(arr: Array<T>, cb: (item: T, index: number) => boolean): T;
export function find<T>(
    arr: Array<T>,
    cb: (item: T, index: number) => boolean,
    options: { index: false }
): T;
export function find<T>(
    arr: Array<T>,
    cb: (item: T, index: number) => boolean,
    options: { index: true }
): number;
export function find<T>(
    arr: Array<T>,
    cb: (item: T, index: number) => boolean,
    options: FindOptions = {}
): T | number {
    const { index = false } = options;
    for (let i = 0; i < arr.length; i += 1) {
        if (cb(arr[i], i)) {
            return index ? i : arr[i];
        }
    }
    return index ? -1 : undefined;
}

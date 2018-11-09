function find(arr, cb, { index = false } = {}) {
    for (let i = 0; i < arr.length; i += 1) {
        if (cb(arr[i], i)) {
            return index ? i : arr[i];
        }
    }
    return index ? -1 : undefined;
}

module.exports = {
    find
};

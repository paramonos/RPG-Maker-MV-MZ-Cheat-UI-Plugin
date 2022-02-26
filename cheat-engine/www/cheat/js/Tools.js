export function cloneObject(obj) {
    const clone = {};
    for (const key in obj) {
        if (typeof obj[key] == "object" && obj[key] !== null) {
            clone[key] = cloneObject(obj[key]);
        } else {
            clone[key] = obj[key];
        }
    }

    return clone;
}

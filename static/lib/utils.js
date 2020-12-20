export function isPlainObject(value) {
    return typeof value === 'object'
        && value !== null
        && value.constructor === Object
        && Object.prototype.toString.call(value) === '[object Object]';
}
export function isArray(value) {
    return Array.isArray(value);
}
export function isArrayOrObject(value) {
    return isPlainObject(value) || isArray(value);
}
export function getKey(key, parentKey) {
    return parentKey ? `${parentKey}[${key}]` : key;
}
export function getParams(data, parentKey) {
    const result = [];
    Object.entries(data).forEach((entry) => {
        const [key, value] = entry;
        if (isArrayOrObject(value)) {
            result.push(...getParams(value, getKey(key, parentKey)));
        }
        else {
            result.push([getKey(key, parentKey), encodeURIComponent(String(value))]);
        }
    });
    return result;
}
export function queryStringify(data) {
    if (!isPlainObject(data)) {
        throw new Error('input must be an object');
    }
    return getParams(data).map((arr) => arr.join('=')).join('&');
}
export function isEqual(lhs, rhs) {
    if (Object.keys(lhs).length !== Object.keys(rhs).length) {
        return false;
    }
    for (const [key, value] of Object.entries(lhs)) {
        const rightValue = rhs[key];
        if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
            return isEqual(value, rightValue);
        }
        if (value !== rightValue) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=utils.js.map
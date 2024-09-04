export function toCamelCase(str) {
    if (!str?.includes('_')) {
        return str;
    }
    return str?.replace(/_([a-z])/g, function(match, letter) {
        return letter.toUpperCase();
    });
}

export function safeArrElAccess (arr, index) {
    const normalizedIndex = index < 0 ? arr.length + index : index;
    const value = (Array.isArray(arr) && normalizedIndex >= 0 && normalizedIndex < arr.length) ? arr[normalizedIndex] : undefined
    process.env.NODE_ENV !== 'production' && console.log(value);
    return value;
}
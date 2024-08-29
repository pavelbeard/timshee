export function toCamelCase(str) {
    if (!str?.includes('_')) {
        return str;
    }
    return str?.replace(/_([a-z])/g, function(match, letter) {
        return letter.toUpperCase();
    });
}
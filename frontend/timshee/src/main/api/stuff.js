export function toCamelCase(str) {
    if (!str.includes('_')) {
        return str;
    }

    return str.replace(/_([a-z])/g, function(match, letter) {
        return letter.toUpperCase();
    });
}

const uniqs = new Set();
export const uniqueData = (data, key) => {
    return data.filter(item => {
        if (!uniqs.has(item[key])) {
            uniqs.add(item[key]);
            return true;
        }
        return false;
    })
};
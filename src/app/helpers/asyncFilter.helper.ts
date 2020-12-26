export async function asyncFilter(arr, predicate) {
    // https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
    return arr.reduce(async (memo, e) => await predicate(e) ? [...await memo, e] : memo, []);
};
export async function asyncFilter(arr: any[], predicate: any) {
    // https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
    return arr.reduce(async (memo: any, e:any) => await predicate(e) ? [...await memo, e] : memo, []);
};

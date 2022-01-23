export async function asyncReplace(str: string, regex: RegExp, asyncFn: Function) {
    const promises: Promise<any>[] = [];
    str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, ...args);
        promises.push(promise);
        return match;
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}

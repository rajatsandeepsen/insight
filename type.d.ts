// type AnyFunc = (...args: any[]) => any;
type AnyFunc<T = any[]> = (...args: T) => any;
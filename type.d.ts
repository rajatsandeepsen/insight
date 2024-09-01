// type AnyFunc = (...args: any[]) => any;
type AnyFunc<T = any[]> = (...args: T) => any;
type AsyncAnyFunc<T = any[]> = (...args: T) => Promise<any>;
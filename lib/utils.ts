export const trys = <T>(func: () => T) => {
    try {
        const data = func() as T
        return { error: null, data, isSuccess: true }
    }
    catch (e) {
        return { error: e as Error, data: null, isSuccess: false }
    }
}

export const tryAsync = async <T>(func: () => Promise<T>) => {
    try {
        const data = (await func()) as T
        return { error: null, data, isSuccess: true }
    }
    catch (e) {
        return { error: e as Error, data: null, isSuccess: false }
    }
}

export const experimental_tryAsync = async <
    F extends (...args: any) => any,
    P extends Parameters<F>,
    T extends Awaited<ReturnType<F>>
>(func: F, ...arg: P) => {
    try {
        const data = (await func(...arg)) as T
        return { error: null, data, isSuccess: true }
    }
    catch (e) {
        return { error: e as Error, data: null, isSuccess: false }
    }
}
import React , {useRef} from "react";
import { useEffect } from "react"

export const useComponentDidMount = (callback) => {
    useEffect(callback, []);
}

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
            ref.current = value;
    });
    return ref.current;
}

export function useComponentDidUpdate(callback, deps) {
    const hasMount = useRef(false)

    useEffect(() => {
            if (hasMount.current) {
                    callback()
            }
            else {
                    hasMount.current = true
            }
    }, deps)
}


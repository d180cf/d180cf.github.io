﻿/// <reference path="types.ts" />

module tsumego {
    'use strict';

    export const infty = 777;

    /** 0 -> `a`, 3 -> `d` */
    export const n2s = (n: number) => String.fromCharCode(n + 0x61);

    /** `d` -> 43 `a` -> 0 */
    export const s2n = (s: string, i: number = 0) => s.charCodeAt(i) - 0x61;

    export const min = (a, b: number) => a < b ? a : b;
    export const max = (a, b: number) => a > b ? a : b;
    export const abs = (a: number) => a < 0 ? -a : a;

    /** Simulates yield* which can't be called in a regular function.
        The point is to get the value that a generator returns at the end. */
    export function result<T>(g: IterableIterator<T>) {
        let r = g.next();
        while (!r.done)
            r = g.next();
        return r.value;
    }
}

var testbench;
(function (testbench) {
    'use strict';
    class Subscription {
        constructor(dispose) {
            this.dispose = dispose;
        }
    }
    testbench.Subscription = Subscription;
    var keyboard;
    (function (keyboard) {
        (function (Key) {
            Key[Key["Esc"] = 27] = "Esc";
            Key[Key["F10"] = 121] = "F10";
            Key[Key["F11"] = 122] = "F11";
        })(keyboard.Key || (keyboard.Key = {}));
        var Key = keyboard.Key;
        /**
         *  hook(122, event => {
         *      // ...
         *  });
         */
        function hook(key, handler) {
            const listener = (event) => {
                if (event.which != key)
                    return;
                handler(event);
            };
            document.addEventListener('keydown', listener);
            return new Subscription(() => document.removeEventListener('keydown', listener));
        }
        keyboard.hook = hook;
    })(keyboard = testbench.keyboard || (testbench.keyboard = {}));
})(testbench || (testbench = {}));
function send(method, url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest;
        xhr.open(method, url, true);
        xhr.send();
        xhr.onreadystatechange = (event) => {
            if (xhr.readyState == xhr.DONE) {
                if (xhr.status >= 200 && xhr.status < 300)
                    resolve(xhr.responseText);
                else
                    reject(Error(method + ' ' + url + ' => ' + xhr.status));
            }
        };
    });
}
var testbench;
(function (testbench) {
    const name = 'tsumego.js';
    const storage = localStorage;
    testbench.ls = {
        /** A callback that's invoked once an entry is removed. */
        removed: [],
        /** A callback that's invoked once an entry is added. */
        added: [],
        get data() {
            return JSON.parse(storage.getItem(name)) || {};
        },
        set data(json) {
            storage.setItem(name, JSON.stringify(json));
        },
        set(path, sgf) {
            const json = testbench.ls.data;
            const wasthere = !!json[path];
            json[path] = sgf || undefined;
            testbench.ls.data = json;
            if (wasthere && !sgf)
                for (const fn of this.removed)
                    fn(path);
            if (!wasthere && sgf)
                for (const fn of this.added)
                    fn(path, sgf);
        }
    };
})(testbench || (testbench = {}));
var tsumego;
(function (tsumego) {
    tsumego.version = '0.1.0';
    tsumego.min = (a, b) => a < b ? a : b;
    tsumego.max = (a, b) => a > b ? a : b;
    tsumego.abs = (a) => a < 0 ? -a : a;
    tsumego.nesw = [[-1, 0], [+1, 0], [0, -1], [0, +1]];
    function* region(root, belongs, neighbors = tsumego.stone.neighbors) {
        const body = [];
        const edge = [root];
        while (edge.length > 0) {
            const xy = edge.pop();
            yield xy;
            body.push(xy);
            for (const nxy of neighbors(xy))
                if (belongs(nxy, xy) && body.indexOf(nxy) < 0 && edge.indexOf(nxy) < 0)
                    edge.push(nxy);
        }
    }
    tsumego.region = region;
    class SortedArray {
        /**
         * The items will be sorted in such a way that
         * compare(flags[i], flags[i + 1]) <= 0 for every i:
         * To sort items in a specific order:
         *
         *      ascending:  (a, b) => a - b
         *      descending: (a, b) => b - a
         *
         * To sort first by one field in the ascneding order
         * and then by another field in the descending order:
         *
         *      (a, b) =>
         *          a[0] - b[0] ||
         *          a[1] - b[1];
         *
         * This is exactly how Array::sort works.
         */
        constructor(compare) {
            this.compare = compare;
        }
        reset() {
            this.flags = [];
            this.items = [];
            return this.items;
        }
        /**
         * Inserts a new item in a "stable" way, i.e.
         * if items are taken from one array which is
         * sorted according to some criteria #A and inserted
         * into this array, not only the items will be
         * sorted here by the new criteria #B, but also items
         * for which #B doesn't define a specific order
         * (returns zero in other words), will be correctly
         * ordered according to #A. More strictly, for any i < j:
         *
         *      1. B(sa[i], sa[j]) <= 0
         *      2. if B(sa[i], sa[j]) = 0 then A(sa[i], sa[j]) <= 0
         *
         * This property allows to compose a few sorted arrays.
         */
        insert(item, flag) {
            const { items, flags, compare } = this;
            let i = items.length;
            while (i > 0 && compare(flags[i - 1], flag) > 0)
                i--;
            // using .push when i == n and .unshift when i == 0
            // won't make the solver run faster
            items.splice(i, 0, item);
            flags.splice(i, 0, flag);
            return i;
        }
    }
    tsumego.SortedArray = SortedArray;
    tsumego.b4 = (b0, b1, b2, b3) => b0 | b1 << 8 | b2 << 16 | b3 << 24;
    tsumego.b0 = (b) => b & 255;
    tsumego.b1 = (b) => b >> 8 & 255;
    tsumego.b2 = (b) => b >> 16 & 255;
    tsumego.b3 = (b) => b >> 24 & 255;
    tsumego.b_ = (b) => [tsumego.b0(b), tsumego.b1(b), tsumego.b2(b), tsumego.b3(b)];
    function sequence(n, f) {
        const x = [];
        while (n-- > 0)
            x.push(f());
        return x;
    }
    tsumego.sequence = sequence;
    tsumego.hex = (x) => (0x100000000 + x).toString(16).slice(-8);
    tsumego.rcl = (x, n) => x << n | x >>> (32 - n);
    function memoized(fn, hashArgs) {
        const cache = {};
        return fn && function (x) {
            const h = hashArgs(x);
            return h in cache ? cache[h] : cache[h] = fn(x);
        };
    }
    tsumego.memoized = memoized;
    /** e.g. @enumerable(false) */
    function enumerable(isEnumerable) {
        return (p, m, d) => void (d.enumerable = isEnumerable);
    }
    tsumego.enumerable = enumerable;
    function assert(condition) {
        if (!condition)
            debugger;
    }
    tsumego.assert = assert;
    tsumego.n32b = (d) => ({
        parse(x) {
            const r = {};
            for (let name in d) {
                const { offset, length, signed = false } = d[name];
                const value = x << 32 - offset - length >> 32 - length;
                r[name] = signed ? value : value & (1 << length) - 1;
            }
            return r;
        }
    });
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    const kCoord = 0x20000000;
    const kColor = 0x40000000;
    const kWhite = 0x80000000;
    function stone(x, y, color) {
        return x | y << 4 | kCoord | (color && kColor) | color & kWhite;
    }
    tsumego.stone = stone;
    var stone;
    (function (stone) {
        stone.nocoords = (color) => kColor | color & kWhite;
        stone.color = (m) => (m & kColor) && (m & kWhite ? -1 : +1);
        stone.setcolor = (m, c) => m & ~kColor & ~kWhite | (c && kColor) | c & kWhite;
        stone.hascoords = (m) => !!(m & kCoord);
        stone.x = (m) => m & 15;
        stone.y = (m) => m >> 4 & 15;
        stone.coords = (m) => [stone.x(m), stone.y(m)];
        stone.same = (a, b) => !((a ^ b) & 0xFFFF);
        stone.dist = (a, b) => Math.abs(stone.x(a) - stone.x(b)) + Math.abs(stone.y(a) - stone.y(b));
        stone.neighbors = (m) => {
            const [x, y] = stone.coords(m);
            const c = stone.color(m);
            return [
                x <= 0x0 ? 0 : stone(x - 1, y, c),
                x >= 0xF ? 0 : stone(x + 1, y, c),
                y <= 0x0 ? 0 : stone(x, y - 1, c),
                y >= 0xF ? 0 : stone(x, y + 1, c)];
        };
        stone.diagonals = (m) => {
            const [x, y] = stone.coords(m);
            const c = stone.color(m);
            return [
                x <= 0x0 || y <= 0x0 ? 0 : stone(x - 1, y - 1, c),
                x >= 0xF || y <= 0x0 ? 0 : stone(x + 1, y - 1, c),
                x <= 0x0 || y >= 0xF ? 0 : stone(x - 1, y + 1, c),
                x >= 0xF || y >= 0xF ? 0 : stone(x + 1, y + 1, c)];
        };
        class SmallSet {
            constructor(test = stone.same) {
                this.test = test;
                this.stones = [];
            }
            toString() {
                return '[' + this.stones.sort((a, b) => a - b).map(stone.toString).join(',') + ']';
            }
            has(s) {
                for (const x of this.stones)
                    if (this.test(x, s))
                        return true;
                return false;
            }
            add(s) {
                if (!this.has(s))
                    this.stones.push(s);
            }
            remove(p) {
                for (let i = this.stones.length - 1; i >= 0; i--) {
                    const q = this.stones[i];
                    if (typeof p === 'function' ? p(q) : stone.same(p, q))
                        this.stones.splice(i, 1);
                }
            }
            /** Adds the item if it wasn't there or removes it otherwise. */
            xor(s) {
                if (this.has(s))
                    this.remove(s);
                else
                    this.add(s);
            }
            empty() {
                this.stones = [];
            }
            *[Symbol.iterator]() {
                for (const s of this.stones)
                    yield s;
            }
        }
        stone.SmallSet = SmallSet;
    })(stone = tsumego.stone || (tsumego.stone = {}));
    var stone;
    (function (stone) {
        const n2s = (n) => String.fromCharCode(n + 0x61); // 0 -> `a`, 3 -> `d`
        const s2n = (s) => s.charCodeAt(0) - 0x61; // `d` -> 43 `a` -> 0
        function toString(m) {
            const c = stone.color(m);
            const [x, y] = stone.coords(m);
            const s = !stone.hascoords(m) ? null : n2s(x) + n2s(y);
            const t = c > 0 ? 'B' : 'W';
            return !c ? s : !s ? t : t + '[' + s + ']';
        }
        stone.toString = toString;
        function fromString(s) {
            if (!/^[BW]\[[a-z]{2}\]|[a-z]{2}$/.test(s))
                throw SyntaxError('Invalid move: ' + s);
            const c = { B: +1, W: -1 }[s[0]] || 0;
            if (c)
                s = s.slice(2);
            const x = s2n(s[0]);
            const y = s2n(s[1]);
            return stone(x, y, c);
        }
        stone.fromString = fromString;
        var list;
        (function (list) {
            list.toString = (x) => '[' + x.map(stone.toString).join(',') + ']';
        })(list = stone.list || (stone.list = {}));
    })(stone = tsumego.stone || (tsumego.stone = {}));
    var stone;
    (function (stone) {
        var cc;
        (function (cc) {
            /** 0x25 -> "E2" */
            function toString(s) {
                const x = stone.x(s);
                const y = stone.y(s);
                const xs = String.fromCharCode('A'.charCodeAt(0) + (x < 8 ? x : x - 1)); // skip the I letter
                const ys = (y + 1) + '';
                return xs + y;
            }
            cc.toString = toString;
        })(cc = stone.cc || (stone.cc = {}));
    })(stone = tsumego.stone || (tsumego.stone = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    // en.wikipedia.org/wiki/Mersenne_Twister
    // oeis.org/A221557
    var s, m;
    /** Returns a random 32 bit number. MT 19937. */
    function rand() {
        if (s >= 624) {
            for (let i = 0; i < 624; i++) {
                let y = m[i] & 0x80000000 | m[(i + 1) % 624] & 0x7fffffff;
                m[i] = m[(i + 397) % 624] ^ y >> 1;
                if (y & 1)
                    m[i] = m[i] ^ 0x9908b0df;
            }
            s = 0;
        }
        let y = m[s++];
        y ^= y >>> 11;
        y ^= y << 7 & 2636928640;
        y ^= y << 15 & 4022730752;
        y ^= y >>> 18;
        return y;
    }
    tsumego.rand = rand;
    var rand;
    (function (rand) {
        /**
         * By default it's initialized to Date.now(), but
         * can be changed to something else before using
         * the solver.
         */
        function seed(value) {
            s = 624;
            m = [value];
            for (let i = 1; i < 624; i++)
                m[i] = (m[i - 1] ^ m[i - 1] >> 30) + i | 0;
        }
        rand.seed = seed;
        seed(Date.now() | 0);
    })(rand = tsumego.rand || (tsumego.rand = {}));
    /** Returns a random number in the 0..1 range. */
    tsumego.random = () => Math.abs(rand() / 0x80000000);
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var profile;
    (function (profile) {
        profile.enabled = true;
        profile.now = typeof performance === 'undefined' ?
                () => Date.now() :
                () => performance.now();
        const timers = {};
        const counters = {};
        const distributions = {};
        function reset() {
            for (let name in timers)
                timers[name] = 0;
            profile.started = profile.now();
        }
        profile.reset = reset;
        function log() {
            if (profile.started >= 0) {
                const total = profile.now() - profile.started;
                console.log(`Total: ${(total / 1000).toFixed(2)}s`);
                for (let name in timers)
                    console.log(`${name}: ${(timers[name] / total) * 100 | 0}%`);
            }
            if (Object.keys(counters).length > 0) {
                console.log('counters:');
                for (let name in counters)
                    console.log(`  ${name}: ${counters[name]}`);
            }
            if (Object.keys(distributions).length > 0) {
                console.log('distributions:');
                for (let name in distributions) {
                    const d = distributions[name];
                    const n = d.length;
                    let lb, rb, min, max, sum = 0;
                    for (let i = 0; i < n; i++) {
                        if (d[i] === undefined)
                            continue;
                        rb = i;
                        if (lb === undefined)
                            lb = i;
                        if (min === undefined || d[i] < min)
                            min = d[i];
                        if (max === undefined || d[i] > max)
                            max = d[i];
                        sum += d[i];
                    }
                    console.log(`  ${name}:`);
                    for (let i = lb; i <= rb; i++)
                        if (d[i] !== undefined)
                            console.log(`    ${i}: ${d[i]} = ${d[i] / sum * 100 | 0}%`);
                }
            }
        }
        profile.log = log;
        function _time(name, fn) {
            if (!profile.enabled)
                return fn;
            timers[name] = 0;
            return function (...args) {
                const started = profile.now();
                try {
                    return fn.apply(this, args);
                }
                finally {
                    timers[name] += profile.now() - started;
                }
            };
        }
        profile._time = _time;
        /** Measures time taken by all invocations of the method. */
        function time(prototype, method, d) {
            d.value = _time(prototype.constructor.name + '::' + method, d.value);
        }
        profile.time = time;
        class Counter {
            constructor(name) {
                this.name = name;
                counters[name] = 0;
            }
            inc(n = 1) {
                counters[this.name] += n;
            }
        }
        profile.Counter = Counter;
        class Distribution {
            constructor(name) {
                this.d = distributions[name] = [];
            }
            inc(value, n = 1) {
                this.d[value] = (this.d[value] | 0) + n;
            }
        }
        profile.Distribution = Distribution;
    })(profile = tsumego.profile || (tsumego.profile = {}));
})(tsumego || (tsumego = {}));
/**
 * LL(*) recursive descent parser.
 *
 * en.wikipedia.org/wiki/Recursive_descent_parser
 */
var tsumego;
(function (tsumego) {
    var LL;
    (function (LL) {
        class Pattern {
            constructor(_exec) {
                this._exec = _exec;
            }
            exec(str, pos) {
                const r = this._exec(str, pos || 0);
                if (typeof pos === 'number')
                    return r;
                if (r && r[1] == str.length)
                    return r[0];
                return null;
            }
            map(fn) {
                return new Pattern((str, pos) => {
                    const r = this.exec(str, pos);
                    return r ? [fn(r[0]), r[1]] : null;
                });
            }
            take(i) {
                return this.map(r => r[i]);
            }
            slice(from, to) {
                return this.map((r) => r.slice(from, to));
            }
            /** [["A", 1], ["B", 2]] -> { A: 1, B: 2 } */
            fold(keyName, valName, merge = (a, b) => b) {
                return this.map((r) => {
                    const m = {};
                    for (const p of r) {
                        const k = p[keyName];
                        const v = p[valName];
                        m[k] = merge(m[k], v);
                    }
                    return m;
                });
            }
            rep(min = 0) {
                return new Pattern((str, pos) => {
                    const res = [];
                    let r;
                    while (r = this.exec(str, pos)) {
                        res.push(r[0]);
                        pos = r[1];
                    }
                    return res.length >= min ? [res, pos] : null;
                });
            }
        }
        LL.Pattern = Pattern;
        LL.rgx = (r) => new Pattern((str, pos) => {
            const m = r.exec(str.slice(pos));
            return m && m.index == 0 ? [m[0], pos + m[0].length] : null;
        });
        LL.txt = (s) => new Pattern((str, pos) => {
            return str.slice(pos, pos + s.length) == s ? [s, pos + s.length] : null;
        });
        function seq(...ps) {
            return new Pattern((str, pos) => {
                const res = [];
                for (const p of ps) {
                    const r = p.exec(str, pos);
                    if (!r)
                        return null;
                    res.push(r[0]);
                    pos = r[1];
                }
                return [res, pos];
            });
        }
        LL.seq = seq;
    })(LL = tsumego.LL || (tsumego.LL = {}));
})(tsumego || (tsumego = {}));
/// <reference path="llrdp.ts" />
/**
 * SGF parser.
 *
 * www.red-bean.com/sgf
 */
var tsumego;
(function (tsumego) {
    var SGF;
    (function (SGF) {
        const { txt, rgx, seq } = tsumego.LL;
        var Pattern = tsumego.LL.Pattern;
        /**
         * EBNF rules:
         *
         *      val     = "[" ... "]"
         *      tag     = 1*("A".."Z") 0*val
         *      step    = ";" 0*tag
         *      sgf     = "(" 0*stp 0*sgf ")"
         */
        const pattern = (() => {
            var val = rgx(/\s*\[[^\]]*?\]/).map(s => s.trim().slice(+1, -1));
            var tag = seq(rgx(/\s*\w+/).map(s => s.trim()), val.rep());
            var step = seq(rgx(/\s*;/), tag.rep()).take(1).fold(0, 1, (a, b) => (a || []).concat(b));
            var sgf_fwd = new Pattern((s, i) => sgf.exec(s, i));
            var sgf = seq(rgx(/\s*\(\s*/), step.rep(), sgf_fwd.rep(), rgx(/\s*\)\s*/)).map(r => new Node(r[1], r[2]));
            return sgf;
        })();
        class Node {
            constructor(steps, vars) {
                this.steps = steps;
                this.vars = vars;
            }
            get(tag) {
                return this.steps[0][tag];
            }
        }
        SGF.Node = Node;
        // decorators break the source-map-support tool
        Object.defineProperty(Node.prototype, 'get', {
            enumerable: false
        });
        SGF.parse = (source) => pattern.exec(source);
    })(SGF = tsumego.SGF || (tsumego.SGF = {}));
})(tsumego || (tsumego = {}));
/// <reference path="utils.ts" />
/// <reference path="move.ts" />
/// <reference path="rand.ts" />
/// <reference path="prof.ts" />
/// <reference path="sgf.ts" />
var tsumego;
(function (tsumego) {
    function block(xmin, xmax, ymin, ymax, libs, size, color) {
        return xmin | xmax << 4 | ymin << 8 | ymax << 12 | libs << 16 | size << 24 | color & 0x80000000;
    }
    tsumego.block = block;
    var block;
    (function (block) {
        block.xmin = (b) => b & 15;
        block.xmax = (b) => b >> 4 & 15;
        block.ymin = (b) => b >> 8 & 15;
        block.ymax = (b) => b >> 12 & 15;
        block.dims = (b) => [block.xmin(b), block.xmax(b), block.ymin(b), block.ymax(b)];
        block.libs = (b) => b >> 16 & 255;
        block.size = (b) => b >> 24 & 127;
        block.join = (b1, b2) => block(tsumego.min(block.xmin(b1), block.xmin(b2)), tsumego.max(block.xmax(b1), block.xmax(b2)), tsumego.min(block.ymin(b1), block.ymin(b2)), tsumego.max(block.ymax(b1), block.ymax(b2)), 0, 0, 0);
        /** A pseudo block descriptor with 1 liberty. */
        block.lib1 = block(0, 0, 0, 0, 1, 0, 0);
        /** Useful when debugging. */
        block.toString = (b) => !b ? null : (b > 0 ? '+' : '-') +
            '[' + block.xmin(b) + ', ' + block.xmax(b) + ']x' +
            '[' + block.ymin(b) + ', ' + block.ymax(b) + '] ' +
            'libs=' + block.libs(b) + ' ' + 'size=' + block.size(b);
    })(block = tsumego.block || (tsumego.block = {}));
    /**
     * A square board with size up to 16x16.
     *
     * The board's internal representation supports
     * very fast play(x, y, color) and undo() operations.
     */
    class Board {
        constructor(size, setup) {
            /**
             * The 32 bit hash of the board. It's efficiently
             * recomputed after each move.
             */
            this.hash = 0;
            /**
             * blocks[id] = a block descriptor with this block.id
             *
             * When block #1 is merged with block #2, its size is
             * reset to 0 and its libs is set to #2's id: this trick
             * allows to not modify the board table too often.
             *
             * This means that to get the block libs and other data
             * it's necessary to walk up the chain of merged blocks.
             * This operation is called "lifting" of the block id.
             *
             * When a block is captured, blocks[id] is reset to 0,
             * but the corresponding elements in the board table
             * aren't changed.
             *
             * Elements in this array are never removed. During the
             * lifetime of a block, its descriptor is changed and when
             * the block is captured, its descriptor is nulled, but is
             * never removed from the array.
             */
            this.blocks = [0];
            /**
             * A random 32 bit number for each intersection in the 16x16 board.
             * The hash of the board is then computed as H(B) = XOR Q(i, j) where
             *
             *      Q(i, j) = hashtb[i, j] if B(i, j) is a B stone
             *      Q(i, j) = hashtw[i, j] if B(i, j) is a W stone
             *
             * This is also known as Zobrist hashing.
             */
            this.hashtb = tsumego.sequence(256, tsumego.rand).map(x => x & 0x0000FFFF);
            this.hashtw = tsumego.sequence(256, tsumego.rand).map(x => x & 0xFFFF0000);
            if (typeof size === 'string' || typeof size === 'object')
                this.initFromSGF(size, setup);
            else if (typeof size === 'number') {
                this.init(size);
                if (setup instanceof Array)
                    this.initFromTXT(setup);
            }
            this.drop();
        }
        init(size) {
            if (size > 16)
                throw Error(`Board ${size}x${size} is too big. Up to 16x16 boards are supported.`);
            this.size = size;
            this.table = new Array(size * size);
            this.drop();
            for (let i = 0; i < size * size; i++)
                this.table[i] = 0;
        }
        initFromTXT(rows) {
            rows.map((row, y) => {
                row.replace(/\s/g, '').split('').map((chr, x) => {
                    let c = chr == 'X' ? +1 : chr == 'O' ? -1 : 0;
                    if (c && !this.play(tsumego.stone(x, y, c)))
                        throw new Error('Invalid setup.');
                });
            });
        }
        initFromSGF(source, nvar) {
            const sgf = typeof source === 'string' ? tsumego.SGF.parse(source) : source;
            if (!sgf)
                throw new SyntaxError('Invalid SGF: ' + source);
            const setup = sgf.steps[0]; // ;FF[4]SZ[19]...
            const size = +setup['SZ'];
            if (!size)
                throw SyntaxError('SZ[n] tag must specify the size of the board.');
            this.init(size);
            const place = (stones, tag) => {
                if (!stones)
                    return;
                for (const xy of stones) {
                    const s = tag + '[' + xy + ']';
                    if (!this.play(tsumego.stone.fromString(s)))
                        throw new Error(s + ' cannot be added.');
                }
            };
            function placevar(node) {
                place(node.steps[0]['AW'], 'W');
                place(node.steps[0]['AB'], 'B');
            }
            placevar(sgf);
            if (nvar)
                placevar(sgf.vars[nvar - 1]);
        }
        /**
         * Drops all the history.
         */
        drop() {
            this.history = { added: [], hashes: [], changed: [] };
        }
        /**
         * Clones the board and without the history of moves.
         * It essentially creates a shallow copy of the board.
         */
        fork() {
            const b = new Board(0);
            b.size = this.size;
            b.hash = this.hash;
            b.table = this.table.slice(0);
            b.blocks = this.blocks.slice(0);
            return b;
        }
        get(x, y) {
            if (y === void 0) {
                if (!tsumego.stone.hascoords(x))
                    return 0;
                [x, y] = tsumego.stone.coords(x);
            }
            return this.blocks[this.getBlockId(x, y)];
        }
        lift(id) {
            let bd;
            while (id && !block.size(bd = this.blocks[id]))
                id = block.libs(bd);
            return id;
        }
        /**
         * Returns block id or zero.
         * The block data can be read from blocks[id].
         */
        getBlockId(x, y) {
            return this.isInBounds(x, y) ?
                this.lift(this.table[y * this.size + x]) :
                0;
        }
        /**
         * Returns the four neighbors of the stone
         * in the [L, R, T, B] format.
         */
        getNbBlockIds(x, y) {
            return [
                this.getBlockId(x - 1, y),
                this.getBlockId(x + 1, y),
                this.getBlockId(x, y - 1),
                this.getBlockId(x, y + 1)
            ];
        }
        /**
         * Adjusts libs of the four neighboring blocks
         * of the given color by the given quantity.
         */
        adjust(x, y, color, quantity) {
            const neighbors = this.getNbBlockIds(x, y);
            next: for (let i = 0; i < 4; i++) {
                const id = neighbors[i];
                const bd = this.blocks[id];
                if (bd * color <= 0)
                    continue;
                for (let j = 0; j < i; j++)
                    if (neighbors[j] == id)
                        continue next;
                this.change(id, bd + quantity * block.lib1);
            }
        }
        /**
         * emoves ablock from the board and adjusts
         * the number of liberties of affected blocks.
         */
        remove(id) {
            const bd = this.blocks[id];
            const hasht = bd > 0 ? this.hashtb : this.hashtw;
            const [xmin, xmax, ymin, ymax] = block.dims(bd);
            for (let y = ymin; y <= ymax; y++)
                for (let x = xmin; x <= xmax; x++)
                    if (this.getBlockId(x, y) == id)
                        this.hash ^= hasht[y * this.size + x],
                            this.adjust(x, y, -bd, +1);
            this.change(id, 0);
        }
        /**
         * Changes the block descriptor and makes
         * an appropriate record in the history.
         */
        change(id, bd) {
            // adding a new block corresponds to a change from
            // blocks[blocks.length - 1] -> b
            this.history.changed.push(id, this.blocks[id] | 0);
            this.blocks[id] = bd;
        }
        inBounds(x, y) {
            if (y === void 0) {
                if (!tsumego.stone.hascoords(x))
                    return false;
                [x, y] = tsumego.stone.coords(x);
            }
            return this.isInBounds(x, y);
        }
        isInBounds(x, y) {
            const n = this.size;
            return x >= 0 && x < n && y >= 0 && y < n;
        }
        /**
         * Returns the number of captured stones + 1.
         * If the move cannot be played, returns 0.
         * The move can be undone by undo().
         *
         * This method only sets table[y * size + x] to
         * to an appropriate block id and changes block
         * descriptors in the array of blocks. It doesn't
         * allocate temporary objects and thus is pretty fast.
         */
        play(move) {
            const color = tsumego.stone.color(move);
            const x = tsumego.stone.x(move);
            const y = tsumego.stone.y(move);
            if (!color || !tsumego.stone.hascoords(move) || this.getBlockId(x, y))
                return 0;
            const size = this.size;
            const hash = this.hash;
            const n_changed = this.history.changed.length / 2; // id1, bd1, id2, bd2, ...
            const ids = this.getNbBlockIds(x, y);
            const nbs = [0, 0, 0, 0];
            const lib = [0, 0, 0, 0];
            for (let i = 0; i < 4; i++)
                nbs[i] = this.blocks[ids[i]],
                    lib[i] = block.libs(nbs[i]);
            // remove captured blocks            
            let result = 0;
            fstr: for (let i = 0; i < 4; i++) {
                for (let j = 0; j < i; j++)
                    // check if that block is already removed
                    if (ids[j] == ids[i])
                        continue fstr;
                if (lib[i] == 1 && color * nbs[i] < 0) {
                    this.remove(ids[i]);
                    result += block.size(nbs[i]);
                    // the removed block may have occupied
                    // several liberties of the stone
                    for (let j = 0; j < 4; j++)
                        if (ids[j] == ids[i])
                            lib[j] = nbs[j] = 0;
                }
            }
            // if nothing has been captured...
            if (result == 0) {
                const isll = 
                /* L */ (nbs[0] * color < 0 || lib[0] == 1 || x == 0) &&
                    /* R */ (nbs[1] * color < 0 || lib[1] == 1 || x == size - 1) &&
                    /* T */ (nbs[2] * color < 0 || lib[2] == 1 || y == 0) &&
                    /* B */ (nbs[3] * color < 0 || lib[3] == 1 || y == size - 1);
                // suicide is not allowed
                if (isll)
                    return 0;
            }
            // take away a lib of every neighboring enemy group
            this.adjust(x, y, -color, -1);
            // new group id = min of neighboring group ids
            let id_new = this.blocks.length;
            let is_new = true;
            for (let i = 0; i < 4; i++)
                if (nbs[i] * color > 0 && ids[i] < id_new)
                    id_new = ids[i],
                        is_new = false;
            const id_old = this.table[y * size + x];
            this.table[y * size + x] = id_new;
            this.hash ^= (color > 0 ? this.hashtb : this.hashtw)[y * size + x];
            if (is_new) {
                // create a new block if the new stone has no neighbors
                const n = 
                /* L */ +(!nbs[0] && x > 0) +
                    /* R */ +(!nbs[1] && x < size - 1) +
                    /* T */ +(!nbs[2] && y > 0) +
                    /* B */ +(!nbs[3] && y < size - 1);
                this.change(id_new, block(x, x, y, y, n, 1, color));
            }
            else {
                // merge neighbors into one block
                const fids = [id_new];
                for (let i = 0; i < 4; i++)
                    if (nbs[i] * color > 0 && ids[i] != id_new)
                        fids.push(ids[i]);
                let size_new = 1;
                let xmin_new = x;
                let xmax_new = x;
                let ymin_new = y;
                let ymax_new = y;
                for (let i = 0; i < fids.length; i++) {
                    const id = fids[i];
                    const bd = this.blocks[id];
                    size_new += block.size(bd);
                    const [xmin, xmax, ymin, ymax] = block.dims(bd);
                    xmin_new = tsumego.min(xmin_new, xmin);
                    ymin_new = tsumego.min(ymin_new, ymin);
                    xmax_new = tsumego.max(xmax_new, xmax);
                    ymax_new = tsumego.max(ymax_new, ymax);
                    // make the merged block point to the new block
                    if (id != id_new)
                        this.change(id, block(0, 0, 0, 0, id_new, 0, 0));
                }
                // libs need to be counted in the rectangle extended by 1 intersection
                let libs_new = 0;
                for (let y = tsumego.max(ymin_new - 1, 0); y <= tsumego.min(ymax_new + 1, this.size - 1); y++) {
                    for (let x = tsumego.max(xmin_new - 1, 0); x <= tsumego.min(xmax_new + 1, this.size - 1); x++) {
                        if (this.getBlockId(x, y))
                            continue;
                        const is_lib = this.getBlockId(x - 1, y) == id_new ||
                            this.getBlockId(x + 1, y) == id_new ||
                            this.getBlockId(x, y - 1) == id_new ||
                            this.getBlockId(x, y + 1) == id_new;
                        if (is_lib)
                            libs_new++;
                    }
                }
                this.change(id_new, block(xmin_new, xmax_new, ymin_new, ymax_new, libs_new, size_new, color));
            }
            this.history.added.push(x | y << 4
                | this.history.changed.length / 2 - n_changed << 8
                | id_old << 16
                | color & 0x80000000);
            this.history.hashes.push(hash);
            return result + 1;
        }
        /**
         * Reverts the last move by restoring the original
         * block id in table[y * size + x] and by reverting
         * original values of block descriptors.
         *
         * Returns the restored move or zero. The returned
         * move can be given to .play to redo the position.
         */
        undo() {
            const move = this.history.added.pop();
            if (!move)
                return 0;
            const x = move & 15;
            const y = move >> 4 & 15;
            const c = move & 0x80000000;
            const n = move >> 8 & 255;
            const b = move >> 16 & 255;
            this.table[y * this.size + x] = b;
            this.hash = this.history.hashes.pop();
            for (let i = 0; i < n; i++) {
                const bd = this.history.changed.pop();
                const id = this.history.changed.pop();
                // when a new block is added, the corresponding
                // record in the history looks like changing
                // the last block from 0 to something;; to undo
                // this properly, the last element in the array
                // needs to be removed as well
                if (id == this.blocks.length - 1 && !bd)
                    this.blocks.pop();
                else
                    this.blocks[id] = bd;
            }
            return tsumego.stone(x, y, c || +1);
        }
        toStringCompact() {
            const n = this.size;
            let h = '', len = 0;
            for (let y = 0; y < n; y++) {
                let rx = h.length;
                for (let x = 0; x < n; x++) {
                    const b = this.get(x, y);
                    h += b > 0 ? 'X' : b < 0 ? 'O' : '-';
                    if (b)
                        len = rx = h.length;
                }
                h = h.slice(0, rx) + ';';
            }
            return n + 'x' + n + '(' + h.slice(0, len) + ')';
        }
        toStringSGF(indent = '') {
            const take = (pf, fn) => {
                let list = '';
                for (let y = 0; y < this.size; y++)
                    for (let x = 0; x < this.size; x++)
                        if (fn(this.get(x, y)))
                            list += tsumego.stone.toString(tsumego.stone(x, y, +1)).slice(1);
                return list && indent + pf + list;
            };
            return '(;FF[4]SZ[' + this.size + ']'
                + take('AB', c => c > 0)
                + take('AW', c => c < 0) + ')';
        }
        toStringTXT(mode = '') {
            const hideLabels = /L-/.test(mode);
            const showLibsNum = /R/.test(mode);
            let xmax = 0, ymax = 0, s = '';
            for (let x = 0; x < this.size; x++)
                for (let y = 0; y < this.size; y++)
                    if (this.get(x, y))
                        xmax = tsumego.max(x, xmax),
                            ymax = tsumego.max(y, ymax);
            if (!hideLabels) {
                s += '  ';
                for (let x = 0; x <= xmax; x++)
                    s += ' ' + String.fromCharCode(0x41 + (x < 8 ? x : x + 1)); // skip I
            }
            for (let y = 0; y <= ymax; y++) {
                if (s)
                    s += '\n';
                if (!hideLabels) {
                    const n = (this.size - y) + '';
                    s += n.length < 2 ? ' ' + n : n;
                    ;
                }
                for (let x = 0; x <= xmax; x++) {
                    const b = this.get(x, y);
                    s += ' ';
                    s += showLibsNum ? block.libs(b) :
                        b > 0 ? 'X' :
                            b < 0 ? 'O' :
                                '-';
                }
            }
            return s;
        }
        toString(mode) {
            return mode == 'SGF' ?
                this.toStringSGF() :
                this.toStringTXT(mode);
        }
        *stones() {
            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.size; y++) {
                    const s = this.get(x, y);
                    if (s)
                        yield tsumego.stone(x, y, s);
                }
            }
        }
        diff(from, to) {
            const hash = from ^ to;
            if (!hash)
                return 0;
            for (let y = 0; y < this.size; y++) {
                for (let x = 0; x < this.size; x++) {
                    const i = y * this.size + x;
                    if (this.hashtb[i] == (hash & 0x0000FFFF))
                        return tsumego.stone(x, y, +1);
                    if (this.hashtw[i] == (hash & 0xFFFF0000))
                        return tsumego.stone(x, y, -1);
                }
            }
            return null;
        }
        /**
         * for (const [x, y] of board.libs(block))
         *      console.log("a liberty of the block", x, y);
         */
        *libs(b) {
            for (const [x, y] of this.edge(b))
                if (!this.get(x, y))
                    yield [x, y];
        }
        /** All cells adjacent to the block: empty and occupied by the opponent. */
        *edge(b) {
            if (!b)
                return;
            let [xmin, xmax, ymin, ymax] = block.dims(b);
            if (xmin > 0)
                xmin--;
            if (ymin > 0)
                ymin--;
            if (xmax < this.size - 1)
                xmax++;
            if (ymax < this.size - 1)
                ymax++;
            for (let x = xmin; x <= xmax; x++) {
                for (let y = ymin; y <= ymax; y++) {
                    if (this.get(x, y) * b > 0)
                        continue;
                    const isLib = this.inBounds(x - 1, y) && this.get(x - 1, y) == b ||
                        this.inBounds(x, y - 1) && this.get(x, y - 1) == b ||
                        this.inBounds(x + 1, y) && this.get(x + 1, y) == b ||
                        this.inBounds(x, y + 1) && this.get(x, y + 1) == b;
                    if (isLib)
                        yield [x, y];
                }
            }
        }
        /**
         * for (const [x, y] of board.list(block))
         *      console.log("a stone of the block", x, y);
         */
        *list(b) {
            if (!b)
                return;
            let [xmin, xmax, ymin, ymax] = block.dims(b);
            for (let x = xmin; x <= xmax; x++)
                for (let y = ymin; y <= ymax; y++)
                    if (this.get(x, y) == b)
                        yield [x, y];
        }
        neighbors(x, y) {
            const nbs = [];
            if (this.inBounds(x - 1, y))
                nbs.push([x - 1, y]);
            if (this.inBounds(x + 1, y))
                nbs.push([x + 1, y]);
            if (this.inBounds(x, y - 1))
                nbs.push([x, y - 1]);
            if (this.inBounds(x, y + 1))
                nbs.push([x, y + 1]);
            return nbs;
        }
        path() {
            const moves = [];
            const path = [];
            let move;
            while (move = this.undo())
                moves.unshift(move);
            for (move of moves) {
                path.push(this.fork());
                this.play(move);
            }
        }
    }
    tsumego.Board = Board;
})(tsumego || (tsumego = {}));
/// <reference path="rand.ts" />
var tsumego;
(function (tsumego) {
    var linalg;
    (function (linalg) {
        const from = (n, f) => {
            const a = new Array(n);
            for (let i = 0; i < n; i++)
                a[i] = f(i);
            return a;
        };
        var vector;
        (function (vector) {
            vector.zero = (n) => from(n, () => 0);
            vector.make = (n, f) => from(n, f);
            vector.dot = (u, v) => {
                let s = 0;
                for (let i = 0; i < u.length; i++)
                    s += u[i] * v[i];
                return s;
            };
            /** m[i][j] = u[i] * v[j] */
            vector.dyad = (u, v) => from(u.length, i => from(v.length, j => u[i] * v[j]));
            /** w[i] = u[i] * v[i] */
            vector.dot2 = (u, v) => from(u.length, i => u[i] * v[i]);
            /** u + k * v */
            vector.sum = (u, v, k = 1) => from(u.length, i => u[i] + k * v[i]);
        })(vector = linalg.vector || (linalg.vector = {}));
        var matrix;
        (function (matrix) {
            matrix.zero = (rows, cols) => from(rows, () => vector.zero(cols));
            matrix.make = (rows, cols, f) => from(rows, r => vector.make(cols, c => f(r, c)));
            /** m * v */
            matrix.mulv = (m, v) => from(m.length, i => vector.dot(m[i], v));
            /** a + k * b */
            matrix.sum = (a, b, k = 1) => from(a.length, i => vector.sum(a[i], b[i], k));
            matrix.transpose = (m) => from(m[0].length, i => from(m.length, j => m[j][i]));
        })(matrix = linalg.matrix || (linalg.matrix = {}));
        class BitMatrix {
            constructor(rows, cols, init) {
                this.rows = rows;
                this.cols = cols;
                this.bits = 0;
                if (typeof init === 'number') {
                    this.bits = init;
                }
                else if (typeof init === 'function') {
                    for (let i = 0; i < rows; i++)
                        for (let j = 0; j < cols; j++)
                            this.set(i, j, init(i, j));
                }
            }
            toString() {
                let s = '';
                for (let i = 0; i < this.rows; i++, s += '|')
                    for (let j = 0; j < this.cols; j++)
                        s += this.get(i, j) ? '#' : '-';
                return s.slice(0, -1);
            }
            get(row, col) {
                const mask = this.mask(row, col);
                return !!(this.bits & mask);
            }
            set(row, col, bit) {
                const mask = this.mask(row, col);
                if (bit)
                    this.bits |= mask;
                else
                    this.bits &= ~mask;
            }
            /** transposition */
            get t() {
                return new BitMatrix(this.cols, this.rows, (i, j) => this.get(j, i));
            }
            /** counter clock wise rotation by 90 degrees */
            get r() {
                return new BitMatrix(this.cols, this.rows, (i, j) => this.get(j, this.cols - i - 1));
            }
            /** horizontal reflection */
            get h() {
                return this.r.t;
            }
            /** vertical reflection */
            get v() {
                return this.t.r;
            }
            mask(row, col) {
                return 1 << (row * this.cols + col);
            }
        }
        linalg.BitMatrix = BitMatrix;
    })(linalg = tsumego.linalg || (tsumego.linalg = {}));
})(tsumego || (tsumego = {}));
/// <reference path="board.ts" />
/// <reference path="linalg.ts" />
var tsumego;
(function (tsumego) {
    var BitMatrix = tsumego.linalg.BitMatrix;
    var Tags;
    (function (Tags) {
        Tags[Tags['X'] = 0] = 'X';
        Tags[Tags['O'] = 1] = 'O';
        Tags[Tags['-'] = 2] = '-';
        Tags[Tags['.'] = 3] = '.';
    })(Tags || (Tags = {}));
    const same = (m, b) => (m.bits & b) === m.bits;
    /**
     * An example of a pattern:
     *
     *      X X ?
     *      O . X
     *      - - -
     *
     *  `X` = a stone of the same color
     *  `O` = a stone of the opposite color
     *  `.` = an empty intersection
     *  `-` = a neutral stone (the wall)
     *  `?` = anything (doesn't matter what's on that intersection)
     */
    class Pattern {
        // the constructor can be very slow as every pattern
        // is constructed only once before the solver starts
        constructor(data) {
            this.masks = [new Array()]; // 8 elements
            // m[0] = bits for X
            // m[1] = bits for O
            // m[2] = bits for -
            // m[3] = bits for .
            const m = this.masks;
            for (let i = 0; i < 4; i++)
                m[0].push(new BitMatrix(3, 3));
            for (let row = 0; row < data.length; row++) {
                for (let col = 0; col < data[row].length; col++) {
                    const tag = data[row].charAt(col).toUpperCase();
                    const mask = m[0][Tags[tag]];
                    if (mask)
                        mask.set(row, col, true);
                }
            }
            // Now we need to come up with all sane transformations
            // of the given pattern: reflections, rotations and so on.
            // There are four such transformations:
            //
            //  T = transposition
            //  R = rotation by 90 degress counter clock wise
            //  H = horizontal reflection
            //  V = vertical reflection
            //
            // It can be noted that V = TR and H = RT which means that
            // T and R are enough to construct all the transformations.
            // Since RRRR = 1 (rotation by 360 degrees), the first four
            // patterns form a ring: m, Rm, RRm, RRRm. Applying T gives
            // the second ring: TRm, TRRm, TRRRm. Since TT = 1, it can
            // be easily proven that these 8 patterns form a closed group
            // over T and R operators.
            for (let i = 0; i < 3; i++)
                m.push(m[i].map(m => m.r));
            for (let i = 0; i < 4; i++)
                m.push(m[i].map(m => m.t));
        }
        static take(board, x0, y0, color) {
            // constructing and disposing an array at every call
            // might look very inefficient, but getting rid of it
            // by declaring this array as a variable outside the
            // method doesn't improve performance at all in V8
            const m = [0, 0, 0, 0];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const x = x0 + j - 1;
                    const y = y0 + i - 1;
                    const c = board.get(x, y);
                    const b = 1 << (3 * i + j);
                    if (c * color > 0)
                        m[0] |= b; // a stone of the same color
                    else if (c * color < 0)
                        m[1] |= b; // a stone of the opposite color
                    else if (!board.inBounds(x, y))
                        m[2] |= b; // a neutral stone (the wall)
                    else
                        m[3] |= b; // a vacant intersection
                }
            }
            return m;
        }
        test(m) {
            search: for (let i = 0; i < 8; i++) {
                const w = this.masks[i];
                for (let j = 0; j < 4; j++)
                    if (!same(w[j], m[j]))
                        continue search;
                return true;
            }
            return false;
        }
        static isEye(board, x, y, color) {
            const snapshot = Pattern.take(board, x, y, color);
            const patterns = Pattern.uceyes;
            // for..of would create an iterator and make
            // the function about 2x slower overall
            for (let i = 0; i < patterns.length; i++)
                if (patterns[i].test(snapshot))
                    return true;
            return false;
        }
    }
    Pattern.uceyes = [
        new Pattern([
            'XXX',
            'X.X',
            'XXX'
        ]),
        new Pattern([
            'XX?',
            'X.X',
            'XXX'
        ]),
        new Pattern([
            'XXX',
            'X.X',
            '---'
        ]),
        new Pattern([
            'XX-',
            'X.-',
            '---'
        ])
    ];
    tsumego.Pattern = Pattern;
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var mgen;
    (function (mgen) {
        function sumlibs(board, color) {
            let n = 0;
            for (const b of board.blocks)
                if (b * color > 0)
                    n += tsumego.block.libs(b);
            return n;
        }
        mgen.sumlibs = sumlibs;
        function ninatari(board, color) {
            let n = 0;
            for (let i = 1; i < board.blocks.length; i++) {
                const b = board.blocks[i];
                if (tsumego.block.size(b) > 0 && b * color > 0 && tsumego.block.libs(b) == 1)
                    n++;
            }
            return n;
        }
        mgen.ninatari = ninatari;
        function eulern(board, color, q = 2) {
            let n1 = 0, n2 = 0, n3 = 0;
            for (let x = -1; x <= board.size; x++) {
                for (let y = -1; y <= board.size; y++) {
                    const a = +((board.get(x, y) * color) > 0);
                    const b = +((board.get(x + 1, y) * color) > 0);
                    const c = +((board.get(x + 1, y + 1) * color) > 0);
                    const d = +((board.get(x, y + 1) * color) > 0);
                    switch (a + b + c + d) {
                        case 1:
                            n1++;
                            break;
                        case 2:
                            if (a == c)
                                n2++;
                            break;
                        case 3:
                            n3++;
                            break;
                    }
                }
            }
            return (n1 - n3 + q * n2) / 4;
        }
        mgen.eulern = eulern;
    })(mgen = tsumego.mgen || (tsumego.mgen = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var mgen;
    (function (mgen) {
        class MvsOrd {
            constructor(board) {
                this.board = board;
                /** Defines the order in which the solver considers moves. */
                this.sa = new tsumego.SortedArray((a, b) => b.r - a.r ||
                    a.u - b.u ||
                    b.p - a.p ||
                    b.v - a.v ||
                    a.q - b.q ||
                    tsumego.random() - 0.5);
            }
            reset() {
                return this.sa.reset();
            }
            insert(x, y, color) {
                const board = this.board;
                if (tsumego.Pattern.isEye(board, x, y, color))
                    return false;
                const s = tsumego.stone(x, y, color);
                const r = board.play(s);
                if (!r)
                    return false;
                this.sa.insert(s, {
                    r: r,
                    p: mgen.sumlibs(board, +color),
                    q: mgen.sumlibs(board, -color),
                    u: mgen.ninatari(board, +color),
                    v: mgen.ninatari(board, -color),
                });
                board.undo();
                return true;
            }
        }
        mgen.MvsOrd = MvsOrd;
    })(mgen = tsumego.mgen || (tsumego.mgen = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var mgen;
    (function (mgen) {
        /** Basic moves generator. Tries to maximize libs. */
        function fixed(board, target, maxsize = 25) {
            const sa = new mgen.MvsOrd(board);
            const ts = board.get(target);
            const rzone = new tsumego.stone.SmallSet;
            const same = (u, v) => board.inBounds(u) && board.inBounds(v) && board.get(u) * ts >= 0 && board.get(v) * ts >= 0;
            const neighbors = x => [...tsumego.stone.diagonals(x), ...tsumego.stone.neighbors(x)];
            //console.log('#0', stone.toString(target));
            for (const rs of tsumego.region(target, same, neighbors))
                rs && rzone.add(rs);
            //console.log('#1', rzone + '');
            // blocks adjacent to rzone
            const adjacent = [];
            for (const rs of rzone.stones) {
                for (const ns of tsumego.stone.neighbors(rs)) {
                    const b = board.get(ns);
                    if (b * ts < 0 && adjacent.indexOf(b) < 0)
                        adjacent.push(b);
                }
            }
            //console.log('#2', adjacent.map(block.toString));
            // blocks with all the libs in rzone
            const inner = [];
            test: for (const b of adjacent) {
                for (const [x, y] of board.libs(b))
                    if (!rzone.has(tsumego.stone(x, y, 0)))
                        continue test;
                inner.push(b);
            }
            //console.log('#3', inner.map(block.toString));
            for (const b of inner)
                for (const [x, y] of board.list(b))
                    rzone.add(tsumego.stone(x, y, 0));
            //console.log('#4', rzone + '');
            rzone.remove(s => board.get(s) == ts);
            //console.log('#5', rzone + '');
            if (rzone.stones.length > maxsize)
                throw new Error(`The number of possible moves ${rzone.stones.length} is more than ${maxsize}`);
            return (color) => {
                const moves = sa.reset();
                for (const move of rzone.stones)
                    sa.insert(tsumego.stone.x(move), tsumego.stone.y(move), color);
                return moves;
            };
        }
        mgen.fixed = fixed;
    })(mgen = tsumego.mgen || (tsumego.mgen = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var mgen;
    (function (mgen) {
        class DistMap {
            constructor() {
                this.dist = [];
                this.xmin = +Infinity;
                this.xmax = -Infinity;
                this.ymin = +Infinity;
                this.ymax = -Infinity;
            }
            get(x, y) {
                const d = this.dist[x | y << 4];
                return d || Infinity;
            }
            set(x, y, d) {
                if (d >= this.dist[x | y << 4])
                    return;
                this.dist[x | y << 4] = d;
                if (x < this.xmin)
                    this.xmin = x;
                if (x > this.xmax)
                    this.xmax = x;
                if (y < this.ymin)
                    this.ymin = y;
                if (y > this.ymax)
                    this.ymax = y;
            }
        }
        /**
         * Distance-based moves generator.
         *
         * Generates moves that can be reached from the target
         * either by a solid connection or by capturing a block.
         */
        function dist(board, target, maxdist = 3) {
            ;
            // moves are same for both sides and determined by where the target can play
            const cache = {};
            const reach = {};
            const state = {};
            function getmoves(color) {
                const nocolor = cache[board.hash];
                if (!color)
                    return nocolor;
                const ord = new mgen.MvsOrd(board);
                const moves = ord.reset();
                for (const s of nocolor)
                    ord.insert(tsumego.stone.x(s), tsumego.stone.y(s), color);
                return moves;
            }
            return function generate(color, goal = 2 /* Checked */) {
                ///console.log('generate', color, goal, '\n' + board);
                if (state[board.hash] >= goal)
                    return getmoves(color);
                const tblock = board.get(target);
                const dmap = new DistMap;
                ///console.log('target at', stone.toString(target), block.toString(tblock));
                if (!tblock)
                    return [];
                if (!cache[board.hash]) {
                    let [xmin, xmax, ymin, ymax] = tsumego.block.dims(tblock);
                    for (let d = 1; d <= maxdist; d++) {
                        for (let x = xmin; x <= xmax; x++) {
                            for (let y = ymin; y <= ymax; y++) {
                                const cblock = board.get(x, y);
                                const cdist = cblock == tblock ? 0 : dmap.get(x, y); // dist(target) = 0
                                // this iteration is supposed to make an extension from (d - 1) to d
                                if (d != cdist + 1)
                                    continue;
                                // now find empty cells and enemy blocks adjacent to (x, y):
                                // empty cells get dist = d, enemy blocks with few libs are
                                // surrounded with dist = d + libs - 1
                                for (const [nx, ny] of board.neighbors(x, y)) {
                                    const nb = board.get(nx, ny);
                                    if (!nb) {
                                        // it's an empty cell
                                        dmap.set(nx, ny, d);
                                        // however if this cell is adjacent to a friendly block,
                                        // that block gets dist = d as well
                                        for (const [nnx, nny] of board.neighbors(nx, ny)) {
                                            if (nnx == nx && nny == ny)
                                                continue;
                                            const nnb = board.get(nnx, nny);
                                            if (nnb == tblock || nnb * tblock <= 0 || dmap.get(nnx, nny) <= d)
                                                continue;
                                            for (const [x, y] of board.list(nnb))
                                                dmap.set(x, y, d);
                                        }
                                    }
                                    else if (nb * tblock < 0) {
                                        // it's an adjacent enemy block: check if it can be captured
                                        const rd = d + tsumego.block.libs(nb) - (cblock ? 1 : 0);
                                        if (rd <= maxdist) {
                                            ///console.log('enemy at', nx, ny, rd, '\n' + board);
                                            // it can be captured: now every lib
                                            // of the block is considered to be
                                            // rd moves away from target block
                                            for (const [x, y] of board.edge(nb)) {
                                                const fb = board.get(x, y);
                                                // the target has d=0, no need to mark it with d=rd
                                                if (fb == tblock)
                                                    continue;
                                                dmap.set(x, y, rd);
                                                // if the block being captured has other adjacent blocks,
                                                // those become reachable within rd steps as well                                            
                                                for (const [x1, y1] of board.list(fb))
                                                    dmap.set(x1, y1, rd);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        // this is suboptimal: the intent
                        // here is to get bounds of all cells
                        // with dist value not greater than d
                        xmin = dmap.xmin;
                        xmax = dmap.xmax;
                        ymin = dmap.ymin;
                        ymax = dmap.ymax;
                    }
                    const moves = [];
                    const rzone = [];
                    // now get all the moves with d <= maxdist that can be actually played
                    for (let x = xmin; x <= xmax; x++) {
                        for (let y = ymin; y <= ymax; y++) {
                            if (dmap.get(x, y) > maxdist)
                                continue;
                            // this is either a defender's stone or an empty cell
                            rzone.push(tsumego.stone(x, y, 0));
                            if (board.play(tsumego.stone(x, y, +1)) || board.play(tsumego.stone(x, y, -1))) {
                                moves.push(tsumego.stone(x, y, 0));
                                board.undo();
                            }
                        }
                    }
                    ///console.log('draft=' + stone.list.toString(moves), 'rzone=' + stone.list.toString(rzone), '\n' + board);
                    cache[board.hash] = moves;
                    reach[board.hash] = rzone;
                    state[board.hash] = 1 /* Draft */;
                }
                if (goal == 2 /* Checked */) {
                    const checked = [];
                    // now play out every found move, generate moves for the opponent
                    // and check if the move still appears in that generated set; if
                    // it doesn't appear there, this means that the opponent can block
                    // the move and make it an overplay
                    for (const move of cache[board.hash]) {
                        ///console.log('checking', stone.toString(move));
                        const nr = board.play(tsumego.stone.setcolor(move, tblock));
                        // if the defender cannot play there, then the attacker can;
                        // also, capturing/defending a group always makes sense
                        if (nr != 1) {
                            if (nr > 0)
                                board.undo();
                            checked.push(move);
                            continue;
                        }
                        // the option to play on a liberty shouldn't be discarded
                        if (board.get(target) == board.get(move)) {
                            ///console.log('extension:', stone.toString(move));
                            board.undo();
                            checked.push(move);
                            continue;
                        }
                        // this move doesn't capture anything and doesn't extend the target block,
                        // so it's a distant move, i.e. d > 1; see if the defender can block it, i.e.
                        // respond in such a way that this move won't be reachable
                        let overplay = false;
                        // see how the opponent can respond to this move
                        for (const resp of generate(0, 1 /* Draft */)) {
                            ///console.log('blocking with', stone.toString(resp));
                            if (!board.play(tsumego.stone.setcolor(resp, -tblock))) {
                                ///console.log('the opponent cannot play', stone.toString(resp));
                                continue;
                            }
                            generate(0, 1 /* Draft */);
                            const reachable = reach[board.hash] || [];
                            board.undo();
                            // if now the move is not reachable, then the opponent has a way to block it
                            if (reachable.indexOf(move) < 0) {
                                overplay = true;
                                ///console.log(stone.toString(move), 'blocked by', stone.toString(resp), '\n' + board);
                                break;
                            }
                        }
                        board.undo();
                        if (!overplay)
                            checked.push(move);
                    }
                    ///console.log('checked=' + stone.list.toString(checked), '\n' + board);
                    cache[board.hash] = checked;
                    state[board.hash] = 2 /* Checked */;
                }
                return getmoves(color);
            };
        }
        mgen.dist = dist;
    })(mgen = tsumego.mgen || (tsumego.mgen = {}));
})(tsumego || (tsumego = {}));
/// <reference path="mgen/util.ts" />
/// <reference path="mgen/ord.ts" />
/// <reference path="mgen/fixed.ts" />
/// <reference path="mgen/dist.ts" />
var tsumego;
(function (tsumego) {
    function entry(x, y, b, w, m) {
        return x | y << 4 | (b & 7) << 8 | (w & 7) << 11 | (m ? 0x8000 : 0);
    }
    var entry;
    (function (entry) {
        entry.get = (s, color) => (color > 0 ? s : s >> 16) & 0xFFFF;
        entry.set = (s, color, e) => color > 0 ? s & ~0xFFFF | e : s & 0xFFFF | e << 16;
        entry.x = (e) => e & 15;
        entry.y = (e) => e >> 4 & 15;
        entry.b = (e) => (e >> 8 & 7) << 29 >> 29;
        entry.w = (e) => (e >> 11 & 7) << 29 >> 29;
        entry.m = (e) => !!(e & 0x8000);
    })(entry || (entry = {}));
    var entry;
    (function (entry) {
        const e = entry(0, 0, +3, -3, false);
        entry.base = e | e << 16;
    })(entry || (entry = {}));
    /** Transposition Table */
    class TT {
        constructor() {
            this.size = 0;
            this.move = {};
            this.data = {};
        }
        get(hash, color, nkt) {
            const s = this.data[hash];
            if (!s)
                return 0;
            const e = entry.get(s, color);
            const winner = nkt >= entry.b(e) ? +1 :
                nkt <= entry.w(s) ? -1 :
                    0; // not solved for this number of ko treats
            if (!winner)
                return 0;
            // the move must be dropped if the outcome is a loss
            return winner * color > 0 && entry.m(e) ?
                tsumego.stone(entry.x(e), entry.y(e), winner) :
                tsumego.stone.nocoords(winner);
        }
        /**
         * @param color Who plays first.
         * @param move The outcome. Must have a color and may have coordinates.
         * @param nkt Must be within -2..+2 range.
         */
        set(hash, color, move, nkt) {
            if (nkt < -2 || nkt > +2 || !tsumego.stone.color(move))
                throw Error('Invalid TT entry.');
            const s = this.data[hash] || ++this.size && entry.base;
            let e = entry.get(s, color);
            const hc = tsumego.stone.hascoords(move);
            const x = tsumego.stone.x(move);
            const y = tsumego.stone.y(move);
            const b = entry.b(e);
            const w = entry.w(e);
            if (move > 0 && nkt < b)
                e = entry(x, y, nkt, w, hc);
            else if (move < 0 && nkt > w)
                e = entry(x, y, b, nkt, hc);
            else
                return; // nothing to change in tt
            this.data[hash] = entry.set(s, color, e);
        }
    }
    tsumego.TT = TT;
})(tsumego || (tsumego = {}));
/**
 * Implements the Benson's algorithm.
 *
 * Benson's Definition of Unconditional Life
 * senseis.xmp.net/?BensonsAlgorithm
 *
 * David B. Benson. "Life in the Game of Go"
 * webdocs.cs.ualberta.ca/~games/go/seminar/2002/020717/benson.pdf
 */
var tsumego;
(function (tsumego) {
    var benson;
    (function (benson) {
        /**
         * A chain of stones is said to be pass-alive or unconditionally alive
         * if the opponent cannot capture the chain even if the chain is not defended.
         *
         * In this implementation a chain is considered to be pass-alive if it has two eyes.
         * An eye is an adjacent region of either empty intersections or the opponent's
         * stones in which:
         *
         *  1. All empty intersections are adjacent to the chain.
         *  2. All chains adjacent to the region are also pass-alive.
         *
         * If the two requirements are met, the opponent cannot approach the chain from inside
         * the region and thus cannot capture the chain since there are two such regions.
         */
        function alive(b, root, path = []) {
            const chainId = b.get(root);
            const sameColor = (s) => b.get(s) * chainId > 0;
            const visited = [];
            let nEyes = 0;
            // enumerate all liberties of the chain to find two eyes among those liberties
            search: for (const lib of tsumego.region(root, (t, s) => sameColor(s) && b.inBounds(t))) {
                // the region(...) above enumerates stones in the chain and the liberties
                if (b.get(lib))
                    continue;
                // chains adjacent to the region
                const adjacent = [];
                const adjacentXY = [];
                for (const p of tsumego.region(lib, (t, s) => !sameColor(t) && b.inBounds(t))) {
                    // has this region been already marked as non vital to this chain?
                    if (visited[p])
                        continue search;
                    visited[p] = true;
                    let isAdjacent = false;
                    for (const q of tsumego.stone.neighbors(p)) {
                        const ch = b.get(q);
                        if (ch == chainId) {
                            isAdjacent = true;
                        }
                        else if (ch * chainId > 0 && adjacent.indexOf(ch) < 0) {
                            adjacent.push(ch);
                            adjacentXY.push(q);
                        }
                    }
                    // is it an empty intersection that is not adjacent to the chain?
                    if (!b.get(p) && !isAdjacent)
                        continue search;
                }
                // check that all adjacent chains are also alive
                for (let i = 0; i < adjacent.length; i++) {
                    const ch = adjacent[i];
                    // if a sequence of chains form a loop, they are all alive
                    if (path.indexOf(ch) < 0 && !alive(b, adjacentXY[i], [...path, ch]))
                        continue search;
                }
                if (++nEyes > 1)
                    return true;
            }
            return false;
        }
        benson.alive = alive;
    })(benson = tsumego.benson || (tsumego.benson = {}));
})(tsumego || (tsumego = {}));
/// <reference path="linalg.ts" />
var tsumego;
(function (tsumego) {
    var vector = tsumego.linalg.vector;
    var matrix = tsumego.linalg.matrix;
    const sigmoid0 = (x) => 1 / (1 + Math.exp(-x)); // S(x) = 1/(1 + 1/e**x)
    const sigmoid1 = (s) => s * (1 - s); // d/dx S(x) = S(x) * (1 - S(x))
    /**
     * The simplest layered DCNN.
     *
     * A layer v[i] is just a vector of numbers (called neurons) in 0..1 range.
     * The first layer v[0] is the input of the net.
     * The last layer v[n] is the output of the net.
     * Matrix w[i] (called neuron connections) connects v[i] and v[i + 1]
     * via the following equation: v[i + 1] = g(v[i] * w[i]), where g is the
     * so called activation function and is meant to keep all numbers in 0..1 range.
     * In other words, v[n] = F(w)(v[0]) where F(w) is the net function.
     * Training of the net is the process of computing F(w) for
     * different inputs and adjusting w to get closer to desired outputs.
     *
     * en.wikipedia.org/wiki/Backpropagation
     */
    class DCNN {
        constructor(size) {
            this.weights = [];
            this.outputs = [vector.zero(size)];
        }
        /**
         * Adds a new layer and sets all connections as a matrix
         * with the latest layer. The size of the last layer must
         * match the number of columns in the matrix ad the size of
         * the new layer matches the number of rows.
         */
        add(layer, rand = () => Math.random()) {
            const v = this.outputs[this.outputs.length - 1];
            if (typeof layer === 'number') {
                this.add(matrix.make(layer, v.length, () => rand() / layer * 2));
            }
            else {
                this.weights.push(layer);
                this.outputs.push(vector.zero(layer.length));
            }
        }
        /**
         * Values are propagated by a simple rule:
         *
         *      v[i + 1] = w[i] * v[i] | f where
         *
         *          [x1, x2, ...] | f = [f(x1), f(x2), ...]
         *          f(x) = 1/(1 + exp(-x))
         *          f' = f * (1 - f)
         *
         * f(x) is choosen to keep values in 0..1 range.
         */
        apply(input) {
            const vs = this.outputs;
            const ws = this.weights;
            const n = ws.length;
            vs[0] = input;
            for (let i = 0; i < n; i++)
                vs[i + 1] = matrix.mulv(ws[i], vs[i]).map(sigmoid0); // vs[i+1] = ws[i]*vs[i] | f'
            return vs[n];
        }
        /**
         * This is the backpropagation algorithm which is quite simple.
         * If t is the desired output from v0, while the actual output is v[n],
         * we can adjust every w[i] by dw[i] to minimize E = (v[n] - t)^2/2. Since
         * gradient dE/dw points to the direction in which E increases, the opposite
         * direction reduces E, so we just need to find that gradient. The derivation
         * is quite simple and can be found in wikipedia. The final formulas are:
         *
         *      d[n] = (v[n] - t) : (v[n] | f') - this is d[n] for the last layer
         *      d[i] = (T(w[i]) * d[i + 1]) : (v[i] | f') - this is d[i] for the next layer
         *      dw[i] = -k * dE/dw = -k * dyad(d[i + 1], v[i]) - this is the adjustment
         *
         *      [x1, x2, ...] : [y1, y2, ...] = [x1*y1, x2*y2, ...]
         *      T(m) = transposition of m
         *      f' = f * (1 - f) which is true for f(x) = 1/(1 + exp(-x))
         *
         * So this algorithm starts with computing vector d[n] and then it goes back
         * one layer at a time to adjust w[i] and compute the next d[i].
         */
        adjust(target, k = 1.0) {
            const vs = this.outputs;
            const ws = this.weights;
            const v0 = vs[vs.length - 1];
            // d[n] = (vs[n] - t) : (vs[n] | f')
            let d = vector.dot2(vector.sum(v0, target, -1), v0.map(sigmoid1));
            for (let i = ws.length - 1; i >= 0; i--) {
                const w = ws[i];
                const v = vs[i];
                // dw[i] = -k * dyad(d[i + 1], v[i])
                ws[i] = matrix.sum(w, vector.dyad(d, v), -k);
                // d[i] = (w[i]^T * d[i + 1]) : (v[i] | f')
                d = vector.dot2(matrix.mulv(matrix.transpose(w), d), v.map(sigmoid1));
            }
        }
    }
    tsumego.DCNN = DCNN;
})(tsumego || (tsumego = {}));
/**
 * The galois finite field GF(2**8) over 2**8 + 0x1b.
 *
 * en.wikipedia.org/wiki/Finite_field_arithmetic
 * www.cs.utsa.edu/~wagner/laws/FFM.html
 */
var tsumego;
(function (tsumego) {
    var gf8;
    (function (gf8) {
        const mul3 = (x) => x ^ (x & 0x80 ? x << 1 ^ 0x11b : x << 1); // x * 3
        const exp3 = new Array(256); // exp3[x] = 3**x
        const log3 = new Array(256); // y = exp3[x], x = log3[y]
        for (let x = 0, y = 1; x < 256; x++, y = mul3(y))
            log3[exp3[x] = y] = x;
        log3[1] = 0;
        const invt = log3.map(x => exp3[255 - x]); // x * inv1[x] = 1
        const cut = (x) => x > 255 ? x - 255 : x;
        gf8.mul = (a, b) => a && b && exp3[cut(log3[a] + log3[b])];
        gf8.inv = (a) => invt[a];
    })(gf8 = tsumego.gf8 || (tsumego.gf8 = {}));
})(tsumego || (tsumego = {}));
/**
 * The galois finite field GF(2**32) over 2**32 + 0x8d.
 * This implementation isn't fast, but simple.
 *
 * en.wikipedia.org/wiki/Primitive_root_modulo_n
 * en.wikibooks.org/wiki/Algorithm_Implementation/Mathematics/Extended_Euclidean_algorithm
 * search.cpan.org/~dmalone/Math-FastGF2-0.04/lib/Math/FastGF2.pm
 */
var tsumego;
(function (tsumego) {
    var gf32;
    (function (gf32) {
        const shl = x => x = x << 1 ^ (x < 0 ? 0x8d : 0); // x * 2 + 2**32 + 0x8d
        gf32.mul = (a, b) => b && ((b & 1 ? a : 0) ^ shl(gf32.mul(a, b >>> 1)));
        const sqr = x => gf32.mul(x, x);
        gf32.pow = (a, b) => !b ? 1 : gf32.mul(b & 1 ? a : 1, sqr(gf32.pow(a, b >>> 1))); // simpler than EGCD
        gf32.inv = (x) => gf32.pow(x, -2); // x**q = x (the little Fermat's theorem)
    })(gf32 = tsumego.gf32 || (tsumego.gf32 = {}));
})(tsumego || (tsumego = {}));
/// <reference path="pattern.ts" />
/// <reference path="movegen.ts" />
/// <reference path="tt.ts" />
/// <reference path="benson.ts" />
/// <reference path="dcnn.ts" />
/// <reference path="gf2.ts" />
var tsumego;
(function (tsumego) {
    const infdepth = 255;
    var repd;
    (function (repd_1) {
        repd_1.get = move => move >> 8 & 255;
        repd_1.set = (move, repd) => move & ~0xFF00 | repd << 8;
    })(repd || (repd = {}));
    function solve(args) {
        const g = solve.start(args);
        let s = g.next();
        while (!s.done)
            s = g.next();
        return s.value;
    }
    tsumego.solve = solve;
    var solve;
    (function (solve_1) {
        function parse(data) {
            const sgf = tsumego.SGF.parse(data);
            if (!sgf)
                throw SyntaxError('Invalid SGF.');
            const errors = [];
            const exec = (fn, em) => {
                try {
                    return fn();
                }
                catch (e) {
                    errors.push(em || e && e.message);
                }
            };
            const board = exec(() => new tsumego.Board(sgf));
            const color = exec(() => sgf.get('PL')[0] == 'W' ? -1 : +1, 'PL[W] or PL[B] must tell who plays first.');
            const target = exec(() => tsumego.stone.fromString(sgf.get('MA')[0]), 'MA[xy] must specify the target white stone.');
            const komaster = exec(() => sgf.get('KM') + '' == 'W' ? -2 : +2, 'KM[W] or KM[B] must tell who is the ko master. This tag is optional.');
            if (errors.length)
                throw SyntaxError('The SGF does not correctly describe a tsumego:\n\t' + errors.join('\n\t'));
            const tb = board.get(target);
            return {
                root: board,
                color: color,
                nkt: komaster,
                expand: tsumego.mgen.fixed(board, target),
                status: (b) => b.get(target) ? tb : -tb,
                alive: (b) => tsumego.benson.alive(b, target)
            };
        }
        function* start(args) {
            let { root: board, color, nkt = 0, tt = new tsumego.TT, log, expand, status, alive, stats, unodes, debug } = typeof args === 'string' ? parse(args) : args;
            if (log) {
                const test = alive;
                alive = node => {
                    const res = test(node);
                    log && log.write({
                        board: node.hash,
                        benson: res
                    });
                    return res;
                };
            }
            // cache results from static analysis as it's quite slow
            alive = tsumego.memoized(alive, board => board.hash);
            // tells who is being captured
            const target = status(board);
            /** Moves that require a ko treat are considered last.
                That's not just perf optimization: the search depends on this. */
            const sa = new tsumego.SortedArray((a, b) => b.d - a.d ||
                b.w - a.w); // first consider moves that lead to a winning position
            const path = []; // path[i] = hash of the i-th position
            const tags = []; // tags[i] = hash of the path to the i-th position
            function* solve(color, nkt) {
                const depth = path.length;
                const prevb = depth < 1 ? 0 : path[depth - 1];
                const hashb = board.hash;
                const ttres = tt.get(hashb, color, nkt);
                stats && (stats.depth = depth, yield);
                if (ttres) {
                    debug && (yield 'reusing cached solution: ' + tsumego.stone.toString(ttres));
                    return repd.set(ttres, infdepth);
                }
                if (unodes) {
                    unodes.total++;
                    if (!unodes[hashb]) {
                        unodes[hashb] = true;
                        unodes.unique++;
                    }
                }
                const guess = tt.move[hashb ^ color] || 0;
                let result;
                let mindepth = infdepth;
                const nodes = sa.reset();
                for (const move of expand(color)) {
                    board.play(move);
                    const hash = board.hash;
                    board.undo();
                    let d = depth - 1;
                    while (d >= 0 && path[d] != hash)
                        d = d > 0 && path[d] == path[d - 1] ? -1 : d - 1;
                    d++;
                    if (!d)
                        d = infdepth;
                    if (d < mindepth)
                        mindepth = d;
                    // there are no ko treats to play this move,
                    // so play a random move elsewhere and yield
                    // the turn to the opponent; this is needed
                    // if the opponent is playing useless ko-like
                    // moves that do not help even if all these
                    // ko fights are won
                    if (d <= depth && nkt * color <= 0)
                        continue;
                    sa.insert(repd.set(move, d), {
                        d: d,
                        // use previously found solution as a hint
                        w: tsumego.stone.color(tt.move[hash ^ -color] || 0) * color
                    });
                }
                // Consider making a pass as well. Passing locally is like
                // playing a move elsewhere and yielding the turn to the 
                // opponent locally: it doesn't affect the local position,
                // but resets the local history of moves. This is why passing
                // may be useful: a position may be unsolvable with the given
                // history of moves, but once it's reset, the position can be
                // solved despite the move is yilded to the opponent.
                sa.insert(0, {
                    d: infdepth,
                    w: 0
                });
                let trials = 0;
                for (const move of nodes) {
                    trials++;
                    const d = !move ? infdepth : repd.get(move);
                    let s;
                    // this is a hash of the path: reordering moves must change the hash;
                    // 0x87654321 is meant to be a generator of the field, but I didn't
                    // know how to find such a generator, so I just checked that first
                    // million powers of this element are unique
                    const h = tsumego.gf32.mul(prevb != hashb ? prevb : 0, 0x87654321) ^ hashb;
                    tags.push(h & ~15 | (nkt & 7) << 1 | (color < 0 ? 1 : 0));
                    path.push(hashb);
                    stats && stats.nodes++;
                    if (!move) {
                        debug && (yield 'yielding the turn to the opponent');
                        const i = tags.lastIndexOf(tags[depth], -2);
                        if (i >= 0) {
                            // yielding the turn again means that both sides agreed on
                            // the group's status; check the target's status and quit
                            s = repd.set(tsumego.stone.nocoords(status(board)), i + 1);
                        }
                        else {
                            // play a random move elsewhere and yield
                            // the turn to the opponent; playing a move
                            // elsewhere resets the local history of moves
                            s = yield* solve(-color, nkt);
                        }
                    }
                    else {
                        board.play(move);
                        debug && (yield);
                        s = status(board) * target < 0 ? repd.set(tsumego.stone.nocoords(-target), infdepth) :
                            // white has secured the group: black cannot
                            // capture it no matter how well it plays
                            color * target > 0 && alive && alive(board) ? repd.set(tsumego.stone.nocoords(target), infdepth) :
                                // let the opponent play the best move
                                d > depth ? yield* solve(-color, nkt) :
                                    // this move repeat a previously played position:
                                    // spend a ko treat and yield the turn to the opponent
                                    (debug && (yield 'spending a ko treat'), yield* solve(-color, nkt - color));
                        board.undo();
                    }
                    debug && (yield 'the outcome of this move: ' + tsumego.stone.toString(s));
                    path.pop();
                    tags.pop();
                    // the min value of repd is counted only for the case
                    // if all moves result in a loss; if this happens, then
                    // the current player can say that the loss was caused
                    // by the absence of ko treats and point to the earliest
                    // repetition in the path
                    if (s * color < 0 && move)
                        mindepth = tsumego.min(mindepth, d > depth ? repd.get(s) : d);
                    // the winning move may depend on a repetition, while
                    // there can be another move that gives the same result
                    // uncondtiionally, so it might make sense to continue
                    // searching in such cases
                    if (s * color > 0) {
                        // if the board b was reached via path p has a winning
                        // move m that required to spend a ko treat and now b
                        // is reached via path q with at least one ko treat left,
                        // that ko treat can be spent to play m if it appears in q
                        // and then win the position again; this is why such moves
                        // are stored as unconditional (repd = infty)
                        result = repd.set(move || tsumego.stone.nocoords(color), d > depth && move ?
                            repd.get(s) :
                            d);
                        break;
                    }
                }
                // if there is no winning move, record a loss
                if (!result)
                    result = repd.set(tsumego.stone.nocoords(-color), mindepth);
                // if the solution doesn't depend on a ko above the current node,
                // it can be stored and later used unconditionally as it doesn't
                // depend on a path that leads to the node; this stands true if all
                // such solutions are stored and never removed from the table; this
                // can be proved by trying to construct a path from a node in the
                // proof tree to the root node
                if (repd.get(result) > depth + 1)
                    tt.set(hashb, color, result, nkt);
                if (guess) {
                    log && log.write({
                        board: hashb,
                        color: color,
                        guess: guess,
                        result: result
                    });
                }
                tt.move[hashb ^ color] = result;
                log && log.write({
                    result: color * tsumego.stone.color(result),
                    trials: trials
                });
                return result;
            }
            const moves = [];
            let move;
            while (move = board.undo())
                moves.unshift(move);
            for (move of moves) {
                path.push(board.hash);
                board.play(move);
            }
            move = yield* solve(color, nkt);
            return typeof args === 'string' ?
                tsumego.stone.toString(move) :
                move;
        }
        solve_1.start = start;
    })(solve = tsumego.solve || (tsumego.solve = {}));
})(tsumego || (tsumego = {}));
var testbench;
(function (testbench) {
    class Marks {
        constructor(svg, def) {
            this.svg = svg;
            this.def = def;
            try {
                this.tag = /\bid="(\w+)"/.exec(def)[1];
            }
            catch (err) {
                throw SyntaxError('The shape def doesnt have an id="...": ' + def);
            }
            const defs = svg.querySelector('defs');
            defs.innerHTML += def;
        }
        *nodes() {
            const refs = this.svg.querySelectorAll(`use`);
            for (let i = 0; i < refs.length; i++)
                if (refs[i].getAttribute('xlink:href') == '#' + this.tag)
                    yield refs[i];
        }
        get(x, y) {
            for (const ref of this.nodes())
                if (+ref.getAttribute('x') == x && +ref.getAttribute('y') == y)
                    return ref;
            return null;
        }
        add(x, y) {
            const ref = this.get(x, y);
            if (ref)
                return ref;
            this.svg.innerHTML += `<use x="${x}" y="${y}" xlink:href="#${this.tag}"/>`;
            this.svg.onupdated(x, y);
            return this.get(x, y);
        }
        remove(x, y) {
            const ref = this.get(x, y);
            if (!ref)
                return;
            this.svg.removeChild(ref);
            this.svg.onupdated(x, y);
        }
    }
    var GobanElement;
    (function (GobanElement) {
        function create(board) {
            const n = board.size;
            const div = document.createElement('div');
            div.innerHTML = `
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink"
                 width="100%"
                 viewBox="-0.5 -0.5 ${n} ${n}">
              <style>
                * { stroke-width: 0.05 }
              </style>
              <defs>
                <pattern id="grid" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">
                  <path d="M 1 0 L 0 0 0 1" fill="none" stroke="black"></path>
                </pattern>
              </defs>

              <rect x="0" y="0" width="${n - 1}" height="${n - 1}" fill="url(#grid)" stroke="black" stroke-width="0.1"></rect>
            </svg>`;
            const svg = div.querySelector('svg');
            Object.assign(svg, {
                AB: new Marks(svg, '<circle id="AB" r="0.475" fill="black" stroke="black"></circle>'),
                AW: new Marks(svg, '<circle id="AW" r="0.475" fill="white" stroke="black"></circle>'),
                CR: new Marks(svg, '<circle id="CR" r="0.25" fill="none"></circle>'),
                TR: new Marks(svg, '<path id="TR" d="M 0 -0.25 L -0.217 0.125 L 0.217 0.125 Z" fill="none"></path>'),
                MA: new Marks(svg, '<path id="MA" d="M -0.25 -0.25 L 0.25 0.25 M 0.25 -0.25 L -0.25 0.25" fill="none"></path>'),
                SQ: new Marks(svg, '<path id="SQ" d="M -0.25 -0.25 L 0.25 -0.25 L 0.25 0.25 L -0.25 0.25 Z" fill="none"></path>'),
                SL: new Marks(svg, '<rect id="SL" x="-0.5" y="-0.5" width="1" height="1" fill-opacity="0.5" stroke="none"></path>'),
                // invoked after a marker has been added or removed
                onupdated(x, y) {
                    const color = svg.AB.get(x, y) ? 'white' : 'black';
                    for (const mark in svg) {
                        if (/^[A-Z]{2}$/.test(mark) && mark != 'AB' && mark != 'AW') {
                            try {
                                const item = svg[mark].get(x, y);
                                if (item)
                                    item.setAttribute('stroke', color);
                            }
                            catch (err) {
                                console.log(mark, x, y, err);
                            }
                        }
                    }
                },
                getStoneCoords(event) {
                    // Chrome had a bug which made offsetX/offsetY coords wrong
                    // this workaround computes the offset using client coords
                    const r = svg.getBoundingClientRect();
                    const offsetX = event.clientX - r.left;
                    const offsetY = event.clientY - r.top;
                    const x = offsetX / svg.clientWidth;
                    const y = offsetY / svg.clientHeight;
                    return [
                        Math.round(x * n - 0.5),
                        Math.round(y * n - 0.5)
                    ];
                }
            });
            for (let x = 0; x < n; x++) {
                for (let y = 0; y < n; y++) {
                    const c = board.get(x, y);
                    if (c > 0)
                        svg.AB.add(x, y);
                    if (c < 0)
                        svg.AW.add(x, y);
                }
            }
            return svg;
        }
        GobanElement.create = create;
    })(GobanElement = testbench.GobanElement || (testbench.GobanElement = {}));
})(testbench || (testbench = {}));
/// <reference path="goban.ts" />
var testbench;
(function (testbench) {
    var Board = tsumego.Board;
    var GobanEditor;
    (function (GobanEditor) {
        function create(board) {
            const goban = testbench.GobanElement.create(board);
            const container = document.createElement('table');
            container.classList.add('goban-editor');
            container.innerHTML = '<tr><td class="toolbox"><td class="goban">';
            const toolbox = container.querySelector('.toolbox');
            container.querySelector('.goban').appendChild(goban);
            function addTool(tag) {
                const g = testbench.GobanElement.create(new Board(1));
                toolbox.appendChild(g);
                g[tag].add(0, 0);
                g.classList.add('tool');
                g.setAttribute('tool', tag);
                return g;
            }
            addTool('AB');
            addTool('AW');
            addTool('TR');
            addTool('MA');
            addTool('CR');
            addTool('SQ');
            return container;
        }
        GobanEditor.create = create;
    })(GobanEditor = testbench.GobanEditor || (testbench.GobanEditor = {}));
})(testbench || (testbench = {}));
var testbench;
(function (testbench) {
    function hookToolToKey(tool, key) {
        document.addEventListener('keydown', event => {
            if (event.key.toUpperCase() == key.toUpperCase())
                testbench.vm.tool = tool;
        });
        document.addEventListener('keyup', event => {
            if (event.key.toUpperCase() == key.toUpperCase())
                testbench.vm.tool = '';
        });
    }
    hookToolToKey('MA', 'T'); // T = target
    hookToolToKey('AB', 'B'); // B = black
    hookToolToKey('AW', 'W'); // W = white
    testbench.vm = {
        /** The currently selected editor tool: MA, AB, AW, etc. */
        get tool() {
            const rb = document.querySelector('input[name="tool"]:checked');
            return rb && rb.value;
        },
        set tool(value) {
            const rbs = document.querySelectorAll('input[name="tool"]');
            for (const rb of rbs) {
                if (rb.getAttribute('value') == value)
                    rb.setAttribute('checked', '');
                else
                    rb.removeAttribute('checked');
            }
        },
        /** The color for which the problem needs to be solved: +1 or -1. */
        get solveFor() {
            const rb = document.querySelector('input[name="solve-for"]:checked');
            return { B: +1, W: -1 }[rb && rb.value] || 0;
        },
        /** Tells to invoke the solver in the step-by-step mode. */
        get debugSolver() {
            return !!document.querySelector('input[name="debug"]:checked');
        },
        /** The balance of ext ko treats. */
        get nkt() {
            const input = document.querySelector('input[name="nkt"]');
            return input && +input.value || 0;
        }
    };
})(testbench || (testbench = {}));
/// <reference path="kb.ts" />
/// <reference path="xhr.ts" />
/// <reference path="ls.ts" />
/// <reference path="../src/search.ts" />
/// <reference path="editor.ts" />
/// <reference path="vm.ts" />
window['board'] = null;
var testbench;
(function (testbench) {
    var stone = tsumego.stone;
    var Board = tsumego.Board;
    var profile = tsumego.profile;
    /** In SGF a B stone at x = 8, y = 2
        is written as B[ic] on a 9x9 goban
        it corresponds to J7 - the I letter
        is skipped and the y coordinate is
        counted from the bottom starting from 1. */
    const xy2s = (m) => !stone.hascoords(m) ? null :
        String.fromCharCode(0x41 + (stone.x(m) > 7 ? stone.x(m) - 1 : stone.x(m))) +
            (board.size - stone.y(m));
    const c2s = (c) => c > 0 ? 'B' : 'W';
    const s2c = (s) => s == 'B' ? +1 : s == 'W' ? -1 : 0;
    const cm2s = (c, m) => c2s(c) + (Number.isFinite(m) ? ' plays at ' + xy2s(m) : ' passes');
    const cw2s = (c, m) => c2s(c) + ' wins by ' + (Number.isFinite(m) ? xy2s(m) : 'passing');
    function s2s(c, s) {
        let isDraw = stone.color(s) == 0;
        let isLoss = s * c < 0;
        return c2s(c) + ' ' + (isLoss ? 'loses' : (isDraw ? 'draws' : 'wins') + ' with ' + xy2s(s));
    }
    /** shared transposition table for black and white */
    testbench.tt = new tsumego.TT;
    function solve(board, color, nkotreats = 0, log = false) {
        profile.reset();
        const rs = tsumego.solve({
            root: board,
            color: color,
            nkt: nkotreats,
            tt: testbench.tt,
            expand: tsumego.mgen.fixed(board, aim),
            status: status
        });
        if (log) {
            profile.log();
            console.log(s2s(color, rs));
        }
        return rs;
    }
    class CancellationToken {
        constructor() {
            this.cancelled = false;
        }
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function dbgsolve(board, color, nkotreats = 0) {
        const solver = tsumego.solve.start({
            debug: true,
            root: board,
            color: color,
            nkt: nkotreats,
            tt: testbench.tt,
            expand: tsumego.mgen.fixed(board, aim),
            status: status,
            alive: (b) => tsumego.benson.alive(b, aim)
        });
        window['solver'] = solver;
        let tick = 0;
        const next = (render = true) => {
            const { done, value } = solver.next();
            const comment = value;
            !done && tick++;
            if (render) {
                location.hash = '#hash=' + (0x100000000 + board.hash).toString(16).slice(-8) + '&step=' + tick;
                renderBoard(comment);
            }
        };
        const stepOver = (ct) => {
            const hash = board.hash;
            do {
                next(false);
            } while (board.hash != hash && !ct.cancelled);
            next();
        };
        const stepOut = () => {
            /*
            log = false;
            const n = solver.depth;
            while (solver.depth >= n)
                next();
            log = true;
            renderSGF(solver.current.node.toString('SGF'));
            */
        };
        testbench.keyboard.hook(testbench.keyboard.Key.F10, event => {
            event.preventDefault();
            const ct = new CancellationToken;
            const hook = testbench.keyboard.hook(testbench.keyboard.Key.Esc, event => {
                event.preventDefault();
                console.log('cancelling...');
                ct.cancelled = true;
            });
            stepOver(ct);
        });
        testbench.keyboard.hook(testbench.keyboard.Key.F11, event => {
            if (!event.shiftKey) {
                event.preventDefault();
                if (event.ctrlKey)
                    debugger;
                next();
            }
            else {
                // Shift+F11
                event.preventDefault();
                stepOut();
            }
        });
        console.log(c2s(color), 'to play with', nkotreats, 'external ko treats\n', 'F11 - step into\n', 'Ctrl+F11 - step into and debug\n', 'F10 - step over\n', 'Shift+F11 - step out\n', 'G - go to a certain step\n');
        testbench.keyboard.hook('G'.charCodeAt(0), event => {
            event.preventDefault();
            const stopat = +prompt('Step #:');
            if (!stopat)
                return;
            console.log('skipping first', stopat, 'steps...');
            while (tick < stopat)
                next();
            renderBoard();
        });
    }
    function status(b) {
        return b.get(stone.x(aim), stone.y(aim)) < 0 ? -1 : +1;
    }
    var aim = 0, lspath = '', selectedCells = new stone.SmallSet;
    window.addEventListener('load', () => {
        Promise.resolve().then(() => {
            const directory = document.querySelector('.directory');
            function addDirEntry(path) {
                const entry = document.createElement('a');
                entry.className = 'entry';
                entry.textContent = path;
                entry.href = '#' + path;
                directory.appendChild(entry);
                return entry;
            }
            window.addEventListener('hashchange', () => {
                const path = location.hash.slice(1); // #abc -> abc
                if (path.length > 0) {
                    loadProblem(path).catch(e => {
                        console.log(e.stack);
                        document.querySelector('.tsumego').textContent = e;
                    });
                }
            });
            if (!testbench.ls.data['blank'])
                testbench.ls.set('blank', new Board(9).toStringSGF());
            if (!location.hash)
                location.hash = '#blank';
            else {
                const path = location.hash.slice(1); // #abc -> abc
                loadProblem(path).catch(e => {
                    console.log('cannot load', path, e.stack);
                    location.hash = '#blank';
                });
            }
            testbench.ls.added.push(path => {
                for (const e of directory.querySelectorAll('.entry')) {
                    const a = e;
                    if (a.hash == '#' + path)
                        return;
                }
                addDirEntry(path);
            });
            testbench.ls.removed.push(path => {
                for (const e of directory.querySelectorAll('.entry')) {
                    const a = e;
                    if (a.hash == '#' + path) {
                        a.parentNode.removeChild(a);
                        break;
                    }
                }
            });
            const lsdata = testbench.ls.data;
            for (let path in lsdata)
                addDirEntry(path);
            send('GET', '/problems/manifest.json').then(data => {
                const manifest = JSON.parse(data);
                for (const dir of manifest.dirs) {
                    for (const path of dir.problems) {
                        send('GET', '/problems/' + path).then(sgf => {
                            const root = tsumego.SGF.parse(sgf);
                            if (!root)
                                throw SyntaxError('Invalid SGF from ' + path);
                            for (let nvar = 0; nvar <= root.vars.length; nvar++) {
                                const name = path.replace('.sgf', '') + (nvar ? ':' + nvar : '');
                                if (!lsdata[name])
                                    addDirEntry(name);
                            }
                        }).catch(err => {
                            console.log(err.stack);
                        });
                    }
                }
            }).catch(err => {
                console.log(err.stack);
            });
            document.querySelector('#delete').addEventListener('click', e => {
                if (lspath && lspath != 'blank' && confirm('Delete problem ' + lspath + '?')) {
                    testbench.ls.set(lspath, null);
                    location.hash = '#blank';
                }
            });
            document.querySelector('#rename').addEventListener('click', e => {
                if (!lspath)
                    return;
                const path2 = prompt('New name for ' + lspath);
                if (!path2)
                    return;
                if (testbench.ls.data[path2])
                    alert(path2 + ' already exists');
                if (lspath != 'blank')
                    testbench.ls.set(lspath, null);
                lspath = path2;
                renderBoard(); // it saves the sgf at the new location
                location.hash = '#' + lspath;
            });
            document.querySelector('#solve').addEventListener('click', e => {
                lspath = null;
                if (testbench.vm.debugSolver)
                    dbgsolve(board, testbench.vm.solveFor, testbench.vm.nkt);
                else
                    solveAndRender(testbench.vm.solveFor, testbench.vm.nkt);
            });
            document.querySelector('#flipc').addEventListener('click', e => {
                const b = new Board(board.size);
                for (const s of board.stones()) {
                    const x = stone.x(s);
                    const y = stone.y(s);
                    const c = stone.color(s);
                    b.play(stone(x, y, -c));
                }
                board = b.fork();
                renderBoard();
            });
            document.querySelector('#download').addEventListener('click', e => {
                const a = document.createElement('a');
                const blob = new Blob([getProblemSGF()], { type: 'application/x-go-sgf' });
                a.href = URL.createObjectURL(blob);
                a['download'] = /[^\/]+$/.exec(lspath)[0] + '.sgf';
                a.click();
            });
            document.querySelector('#getsvg').addEventListener('click', e => {
                const div = document.querySelector('.tsumego');
                const a = document.createElement('a');
                const blob = new Blob([div.innerHTML], { type: 'image/svg+xml' });
                a.href = URL.createObjectURL(blob);
                a['download'] = /[^\/]+$/.exec(lspath)[0] + '.svg';
                a.click();
            });
            const sgfinput = document.querySelector('#sgf');
            sgfinput.addEventListener('input', e => {
                try {
                    updateSGF(sgfinput.value);
                }
                catch (err) {
                    // partial input is not valid SGF
                    if (err instanceof SyntaxError)
                        return;
                    throw err;
                }
            });
        }).catch(err => {
            console.error(err.stack);
            alert(err);
        });
    });
    function loadProblem(path) {
        return Promise.resolve().then(() => {
            console.log('loading problem', path);
            const [source, nvar] = path.split(':');
            document.title = source;
            lspath = source;
            return Promise.resolve().then(() => {
                return testbench.ls.data[source] || send('GET', '/problems/' + source + '.sgf');
            }).then(sgfdata => {
                updateSGF(sgfdata, nvar && +nvar);
                console.log(sgfdata);
                console.log(board + '');
                console.log(board.toStringSGF());
                for (const e of document.querySelectorAll('.directory .entry')) {
                    const a = e;
                    if (a.hash == '#' + path)
                        a.classList.add('selected');
                    else
                        a.classList.remove('selected');
                }
            });
        });
    }
    function updateSGF(sgfdata, nvar = 0) {
        const sgf = tsumego.SGF.parse(sgfdata);
        const setup = sgf.steps[0];
        board = new Board(sgfdata, nvar);
        aim = stone.fromString((setup['MA'] || ['aa'])[0]);
        selectedCells = new stone.SmallSet;
        board = board.fork(); // drop the history of moves
        renderBoard();
    }
    function removeStone(x, y) {
        const b = new Board(board.size);
        for (const s of board.stones()) {
            const [sx, sy] = stone.coords(s);
            const c = stone.color(s);
            if (sx != x || sy != y)
                b.play(stone(sx, sy, c));
        }
        board = b.fork(); // drop history
    }
    document.addEventListener('keyup', event => {
        if (event.keyCode == 46) {
            for (const s of selectedCells)
                removeStone(stone.x(s), stone.y(s));
            selectedCells.empty();
            renderBoard();
        }
    });
    function renderBoard(comment = '') {
        const move = board.undo();
        board.play(move);
        const ui = testbench.GobanElement.create(board);
        if (stone.hascoords(move))
            ui.TR.add(stone.x(move), stone.y(move));
        if (stone.hascoords(aim))
            ui.MA.add(stone.x(aim), stone.y(aim));
        for (const s of selectedCells)
            ui.SL.add(stone.x(s), stone.y(s));
        // this is where selection started
        let sel0x;
        let sel0y;
        ui.addEventListener('mousedown', event => {
            if (event.ctrlKey)
                [sel0x, sel0y] = ui.getStoneCoords(event);
        });
        ui.addEventListener('mouseup', event => {
            if (event.ctrlKey && sel0x >= 0 && sel0y >= 0) {
                const [sel1x, sel1y] = ui.getStoneCoords(event);
                for (let x = Math.min(sel0x, sel1x); x <= Math.max(sel0x, sel1x); x++)
                    for (let y = Math.min(sel0y, sel1y); y <= Math.max(sel0y, sel1y); y++)
                        selectedCells.add(stone(x, y, 0));
                sel0x = undefined;
                sel0y = undefined;
                renderBoard();
            }
        });
        ui.addEventListener('mousemove', event => {
            const [x, y] = ui.getStoneCoords(event);
            const s = stone(x, y, 0);
            document.title = document.title.replace(/^(.+?)( - [a-z][a-z] - [A-Z]\d+)?$/, `$1 - ${stone.toString(s)} - ${stone.cc.toString(s)}`);
        });
        ui.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const [x, y] = ui.getStoneCoords(event);
            const c = board.get(x, y);
            if (!lspath) {
                const s = stone(x, y, -testbench.vm.solveFor);
                const r = board.play(s);
                if (!r)
                    console.log(stone.toString(s) + ' cannot be played on this board:\n' + board);
            }
            else
                switch (testbench.vm.tool) {
                    case 'MA':
                        // mark the target                    
                        aim = stone(x, y, 0);
                        break;
                    case 'AB':
                        // add a black stone
                        if (c)
                            removeStone(x, y);
                        board.play(stone(x, y, +1));
                        break;
                    case 'AW':
                        // add a white stone
                        if (c)
                            removeStone(x, y);
                        board.play(stone(x, y, -1));
                        break;
                    default:
                        // clicking anywhere clears the selection
                        selectedCells = new stone.SmallSet;
                }
            renderBoard();
        });
        const wrapper = document.querySelector('.tsumego');
        wrapper.innerHTML = '';
        wrapper.appendChild(ui);
        const editor = document.querySelector('.tsumego-sgf');
        const sgf = getProblemSGF();
        editor.textContent = sgf;
        setComment(comment);
        if (lspath)
            testbench.ls.set(lspath, sgf);
    }
    function getProblemSGF() {
        return board.toStringSGF('\n  ').replace(/\)$/, (stone.hascoords(aim) ? '\n  MA[' + stone.toString(aim) + ']' : '') +
            ')');
    }
    function setComment(comment) {
        document.querySelector('#comment').textContent = comment;
    }
    function parse(si, size) {
        const x = si.charCodeAt(0) - 65;
        const y = size - +/\d+/.exec(si)[0];
        return stone(x, y, 0);
    }
    function solveAndRender(color, nkt = 0) {
        setComment('Solving...');
        setTimeout(() => {
            const move = solve(board, color, nkt, true);
            if (!stone.hascoords(move) || move * color < 0) {
                setComment(c2s(color) + ' passes');
            }
            else {
                board.play(move);
                console.log(board + '');
                renderBoard();
            }
        });
    }
    window['$'] = data => {
        const cmd = data.toString().trim().split(' ');
        const col = cmd[0].toLowerCase();
        switch (col) {
            case 'x':
            case 'o':
                const xy = cmd[1] && cmd[1].toUpperCase();
                const c = cmd[0].toUpperCase() == 'O' ? -1 : +1;
                if (/^[a-z]\d+$/i.test(xy)) {
                    const p = parse(xy, board.size);
                    if (!board.play(stone(stone.x(p), stone.y(p), c))) {
                        console.log(col, 'cannot play at', xy);
                    }
                    else {
                        console.log(board + '');
                        renderBoard();
                    }
                }
                else {
                    solveAndRender(c, !xy ? 0 : +xy);
                }
                break;
            case 'undo':
                let n = +(cmd[1] || 1);
                while (n-- > 0) {
                    const move = board.undo();
                    if (move) {
                        console.log('undo ' + stone.toString(move));
                    }
                    else {
                        console.log('nothing to undo');
                        break;
                    }
                }
                console.log(board + '');
                break;
            case 'path':
                let move, moves = [];
                while (move = board.undo())
                    moves.unshift(move);
                for (move of moves) {
                    console.log(board + '');
                    board.play(move);
                }
                console.log(board + '');
                break;
            default:
                console.log('unknown command');
        }
    };
})(testbench || (testbench = {}));
//# sourceMappingURL=app.js.map
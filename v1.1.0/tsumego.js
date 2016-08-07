var tsumego;
(function (tsumego) {
    var stat;
    (function (stat) {
        stat.logv = [];
        stat.summarizxe = () => stat.logv.map(f => f());
    })(stat = tsumego.stat || (tsumego.stat = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    (function (color) {
        color[color["black"] = 1] = "black";
        color[color["white"] = -1] = "white";
    })(tsumego.color || (tsumego.color = {}));
    var color = tsumego.color;
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
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
        constructor() {
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
            const { items, flags } = this;
            let i = items.length;
            // it sounds crazy, but passing around this single number
            // inside a one element array is way faster than passing
            // this number alone: 10s vs 14s (!)
            while (i > 0 && flags[i - 1][0] < flag[0])
                i--;
            // using .push when i == n and .unshift when i == 0
            // won't make the solver run faster
            items.splice(i, 0, item);
            flags.splice(i, 0, flag);
            return i;
        }
    }
    tsumego.SortedArray = SortedArray;
})(tsumego || (tsumego = {}));
/// <reference path="sorted.ts" />
var tsumego;
(function (tsumego) {
    tsumego.version = '0.1.0';
    tsumego.min = (a, b) => a < b ? a : b;
    tsumego.max = (a, b) => a > b ? a : b;
    tsumego.abs = (a) => a < 0 ? -a : a;
    tsumego.sign = (x) => x < 0 ? -1 : x > 0 ? +1 : 0;
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
    /**
     * 0               1               2               3
     *  0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     * |   x   |   y   |              data             |         |h|c|w|
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     *
     *  x - the x coord (valid only if h = 1)
     *  y - the y coord (valid only if h = 1)
     *  h - whether the stone has coordinates
     *  c - whether the stone has a color
     *  w - whether the stone is white (valid if c = 1)
     *
     * The 2-nd and the 3-rd bytes can be used to store arbitrary data.
     * The remaining 5 bits of the 4-th byte are reserved for future use.
     *
     */
    (function (stone) {
    })(tsumego.stone || (tsumego.stone = {}));
    var stone = tsumego.stone;
    var stone;
    (function (stone) {
        function make(x, y, color) {
            return x | y << 4 | kCoord | (color && kColor) | color & kWhite;
        }
        stone.make = make;
    })(stone = tsumego.stone || (tsumego.stone = {}));
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
                x <= 0x0 ? 0 : stone.make(x - 1, y, c),
                x >= 0xF ? 0 : stone.make(x + 1, y, c),
                y <= 0x0 ? 0 : stone.make(x, y - 1, c),
                y >= 0xF ? 0 : stone.make(x, y + 1, c)];
        };
        stone.diagonals = (m) => {
            const [x, y] = stone.coords(m);
            const c = stone.color(m);
            return [
                x <= 0x0 || y <= 0x0 ? 0 : stone.make(x - 1, y - 1, c),
                x >= 0xF || y <= 0x0 ? 0 : stone.make(x + 1, y - 1, c),
                x <= 0x0 || y >= 0xF ? 0 : stone.make(x - 1, y + 1, c),
                x >= 0xF || y >= 0xF ? 0 : stone.make(x + 1, y + 1, c)];
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
            get size() {
                return this.stones.length;
            }
            *[Symbol.iterator]() {
                for (const s of this.stones)
                    yield s;
            }
        }
        stone.SmallSet = SmallSet;
    })(stone = tsumego.stone || (tsumego.stone = {}));
    tsumego.infdepth = 255; // only 8 bits available for storing the depth
    /**
     * If b(1), b(2), ... is the sequence of positions leading
     * to the current position and the sub tree (sub graph, actually)
     * of positions that proves the solution contains any of
     * b(i), then repd.get(solution) = i.
     */
    var repd;
    (function (repd_1) {
        repd_1.get = move => move >> 8 & 255;
        repd_1.set = (move, repd) => move & ~0xFF00 | repd << 8;
    })(repd = tsumego.repd || (tsumego.repd = {}));
    var stone;
    (function (stone) {
        var label;
        (function (label_1) {
            /** W -> -1, B -> +1 */
            function color(label) {
                if (label == 'B')
                    return +1;
                if (label == 'W')
                    return -1;
                return 0;
            }
            label_1.color = color;
            /** -1 -> W, +1 -> B */
            function string(color) {
                if (color > 0)
                    return 'B';
                if (color < 0)
                    return 'W';
            }
            label_1.string = string;
        })(label = stone.label || (stone.label = {}));
    })(stone = tsumego.stone || (tsumego.stone = {}));
    var stone;
    (function (stone) {
        const n2s = (n) => String.fromCharCode(n + 0x61); // 0 -> `a`, 3 -> `d`
        const s2n = (s) => s.charCodeAt(0) - 0x61; // `d` -> 43 `a` -> 0
        /** e.g. W[ab], [ab], W[] */
        function toString(m) {
            const c = stone.color(m);
            const [x, y] = stone.coords(m);
            const s = !stone.hascoords(m) ? '' : n2s(x) + n2s(y);
            const t = stone.label.string(c) || '';
            const _nr = repd.get(m);
            return t + '[' + s + ']'
                + (_nr ? ' depth=' + _nr : '');
        }
        stone.toString = toString;
        function fromString(s) {
            if (s == 'B' || s == 'B[]')
                return stone.nocoords(+1);
            if (s == 'W' || s == 'W[]')
                return stone.nocoords(-1);
            if (!/^[BW]\[[a-z]{2}\]|[a-z]{2}$/.test(s))
                return 0;
            const c = { B: +1, W: -1 }[s[0]] || 0;
            if (c)
                s = s.slice(2);
            const x = s2n(s[0]);
            const y = s2n(s[1]);
            return stone.make(x, y, c);
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
            function toString(s, boardSize) {
                const x = stone.x(s);
                const y = stone.y(s);
                const xs = String.fromCharCode('A'.charCodeAt(0) + (x < 8 ? x : x + 1)); // skip the I letter
                const ys = (boardSize - y) + '';
                return xs + ys;
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
        seed(0);
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
/// <reference path="stone.ts" />
/// <reference path="rand.ts" />
/// <reference path="prof.ts" />
/// <reference path="sgf.ts" />
var tsumego;
(function (tsumego) {
    tsumego._n_play = 0;
    tsumego._n_redo = 0;
    /**
     * A block descriptor is represented by a 32 bit signed integer:
     *
     * 0               1               2               3
     *  0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     * | xmin  | xmax  | ymin  | ymax  |     libs      |    size     |c|
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     *
     * The first 2 bytes describe the rectangular boundaries of the block.
     * This implies that blocks must fit in 16x16 board.
     *
     * Next byte contains the number of liberties. Most of the blocks
     * hardly have 20 libs, so 8 bits should be more than enough.
     *
     * The first 7 bits of the last byte contain the number of stones
     * in the block, which gives up to 128 stones. Most of the blocks have
     * less than 15 stones.
     *
     * The last bit is the sign bit of the number and it tells the color
     * of the block: 0 = black, 1 = white. This implies that black blocks
     * are positive and white blocks are negative.
     *
     * Since a block a removed when it loses its last liberty, blocks with
     * libs = 0 or size = 0 do not represent any real entity on the board.
     */
    (function (block) {
    })(tsumego.block || (tsumego.block = {}));
    var block = tsumego.block;
    var block;
    (function (block) {
        function make(xmin, xmax, ymin, ymax, libs, size, color) {
            return xmin | xmax << 4 | ymin << 8 | ymax << 12 | libs << 16 | size << 24 | color & 0x80000000;
        }
        block.make = make;
        block.xmin = (b) => b & 15;
        block.xmax = (b) => b >> 4 & 15;
        block.ymin = (b) => b >> 8 & 15;
        block.ymax = (b) => b >> 12 & 15;
        block.dims = (b) => [block.xmin(b), block.xmax(b), block.ymin(b), block.ymax(b)];
        block.libs = (b) => b >> 16 & 255;
        block.size = (b) => b >> 24 & 127;
        block.join = (b1, b2) => block.make(tsumego.min(block.xmin(b1), block.xmin(b2)), tsumego.max(block.xmax(b1), block.xmax(b2)), tsumego.min(block.ymin(b1), block.ymin(b2)), tsumego.max(block.ymax(b1), block.ymax(b2)), 0, 0, 0);
        /** A pseudo block descriptor with 1 liberty. */
        block.lib1 = block.make(0, 0, 0, 0, 1, 0, 0);
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
            this.hash_b = 0; // low 32 bits of the 64 bit hash
            this.hash_w = 0; //  hi 32 bits of the 64 bit hash
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
            this._redo_hist = 0; // tells when the cache is valid
            /**
             * A random 32 bit number for each intersection in the 16x16 board.
             * The hash of the board is then computed as H(B) = XOR Q(i, j) where
             *
             *      Q(i, j) = hashtb[i, j] if B(i, j) is a B stone
             *      Q(i, j) = hashtw[i, j] if B(i, j) is a W stone
             *
             * This is also known as Zobrist hashing.
             */
            this.hasht_b = tsumego.sequence(256, tsumego.rand);
            this.hasht_w = tsumego.sequence(256, tsumego.rand);
            if (typeof size === 'string' || typeof size === 'object')
                this.initFromSGF(size, setup);
            else if (typeof size === 'number') {
                this.init(size);
                if (setup instanceof Array)
                    this.initFromTXT(setup);
            }
        }
        /**
         * The 32 bit hash of the board. It's efficiently
         * recomputed after each move.
         */
        get hash() {
            return this.hash_b & 0x0000FFFF | this.hash_w & 0xFFFF0000;
        }
        get sgf() {
            return this.toStringSGF();
        }
        set sgf(value) {
            this.initFromSGF(value);
        }
        get text() {
            return this.toStringTXT();
        }
        set text(value) {
            this.initFromTXT(value.split(/\r?\n/));
        }
        init(size) {
            if (size > 16)
                throw Error(`Board ${size}x${size} is too big. Up to 16x16 boards are supported.`);
            this.size = size;
            this.table = tsumego.sequence(256, () => 0);
            this.drop();
        }
        initFromTXT(rows) {
            rows.map((row, y) => {
                row.replace(/\s/g, '').split('').map((chr, x) => {
                    let c = chr == 'X' ? +1 : chr == 'O' ? -1 : 0;
                    if (c && !this.play(tsumego.stone.make(x, y, c)))
                        throw new Error('Invalid setup.');
                });
            });
            this.drop();
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
            this.drop();
        }
        /**
         * Drops all the history.
         */
        drop() {
            this.history = { added: [], hashes: [], changed: [] };
            for (let i = 0; i < 256; i++)
                this.table[i] = this.lift(this.table[i]);
            this._redo_data = null;
            this._redo_hist = 0;
        }
        /**
         * Clones the board and without the history of moves.
         * It essentially creates a shallow copy of the board.
         */
        fork() {
            const b = new Board(0);
            b.size = this.size;
            b.hash_b = this.hash_b;
            b.hash_w = this.hash_w;
            b.blocks = this.blocks.slice(0);
            for (let i = 0; i < 256; i++)
                b.table[i] = this.table[i];
            b.drop();
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
            return this._inBounds(x, y) ? this.lift(this.table[y << 4 | x]) : 0;
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
            const [xmin, xmax, ymin, ymax] = block.dims(bd);
            for (let y = ymin; y <= ymax; y++) {
                for (let x = xmin; x <= xmax; x++) {
                    if (this.getBlockId(x, y) == id) {
                        if (bd > 0)
                            this.hash_b ^= this.hasht_b[y << 4 | x];
                        else
                            this.hash_w ^= this.hasht_w[y << 4 | x];
                        this.adjust(x, y, -bd, +1);
                    }
                }
            }
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
            return this._inBounds(x, y);
        }
        _inBounds(x, y) {
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
            if (this._redo_data && this._redo_hist == this.history.added.length) {
                const nres = this.redo(move);
                if (nres)
                    return nres;
            }
            else {
                this._redo_data = null;
            }
            const color = tsumego.stone.color(move);
            const x = tsumego.stone.x(move);
            const y = tsumego.stone.y(move);
            if (!color || !tsumego.stone.hascoords(move) || !this._inBounds(x, y) || this.getBlockId(x, y))
                return 0;
            tsumego._n_play++;
            const size = this.size;
            const hash_b = this.hash_b;
            const hash_w = this.hash_w;
            const n_changed = this.history.changed.length / 2; // id1, bd1, id2, bd2, ...
            const ids = this.getNbBlockIds(x, y);
            const nbs = [0, 0, 0, 0];
            const lib = [0, 0, 0, 0];
            for (let i = 0; i < 4; i++) {
                nbs[i] = this.blocks[ids[i]];
                lib[i] = block.libs(nbs[i]);
            }
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
            for (let i = 0; i < 4; i++) {
                if (nbs[i] * color > 0 && ids[i] < id_new) {
                    id_new = ids[i];
                    is_new = false;
                }
            }
            const id_old = this.table[y << 4 | x];
            this.table[y << 4 | x] = id_new;
            if (color > 0)
                this.hash_b ^= this.hasht_b[y << 4 | x];
            else
                this.hash_w ^= this.hasht_w[y << 4 | x];
            if (is_new) {
                // create a new block if the new stone has no neighbors
                if (id_new > 255)
                    throw Error('Too many blocks: ' + id_new);
                const n = 
                /* L */ (0 == nbs[0] && x > 0 ? 1 : 0) +
                    /* R */ (0 == nbs[1] && x < size - 1 ? 1 : 0) +
                    /* T */ (0 == nbs[2] && y > 0 ? 1 : 0) +
                    /* B */ (0 == nbs[3] && y < size - 1 ? 1 : 0);
                this.change(id_new, block.make(x, x, y, y, n, 1, color));
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
                        this.change(id, block.make(0, 0, 0, 0, id_new, 0, 0));
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
                this.change(id_new, block.make(xmin_new, xmax_new, ymin_new, ymax_new, libs_new, size_new, color));
            }
            this.history.added.push(x | y << 4
                | this.history.changed.length / 2 - n_changed << 8
                | id_old << 16
                | color & 0x80000000);
            this.history.hashes.push(hash_b, hash_w);
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
            const k = y << 4 | x;
            const c = move & 0x80000000 ? -1 : +1;
            const n = move >> 8 & 255;
            const b = move >> 16 & 255;
            const next = {
                hash_b: this.hash_b,
                hash_w: this.hash_w,
                cell: this.table[k],
                list: [],
            };
            this.table[k] = b;
            this.hash_w = this.history.hashes.pop();
            this.hash_b = this.history.hashes.pop();
            for (let i = 0; i < n; i++) {
                const bd = this.history.changed.pop();
                const id = this.history.changed.pop();
                next.list.push(id, this.blocks[id]);
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
            const rh = this.history.added.length;
            if (!this._redo_data || this._redo_hist != rh) {
                this._redo_data = [];
                this._redo_hist = rh;
            }
            this._redo_data[x | y << 4 | c & 256] = next;
            return tsumego.stone.make(x, y, c);
        }
        /**
         * Quickly replays a move if it has been played and undone.
         * About 47% of calls to play(...) are handled here, however
         * this makes the solver only 1.18x faster, perhaps due to
         * the need to support the redo cache. The redo(...) itself
         * spends only 9% of the time, while play(...) spends 44%.
         */
        redo(move) {
            const [x, y] = tsumego.stone.coords(move);
            const k = y << 4 | x;
            const c = move > 0 ? +1 : -1;
            const next = this._redo_data[x | y << 4 | c & 256];
            if (!next)
                return 0;
            tsumego._n_redo++;
            this.history.hashes.push(this.hash_b, this.hash_w);
            this.history.added.push(x | y << 4
                | next.list.length / 2 << 8
                | this.table[k] << 16
                | c & 0x80000000);
            this.hash_b = next.hash_b;
            this.hash_w = next.hash_w;
            this.table[k] = next.cell;
            let nres = 0;
            for (let i = next.list.length - 2; i >= 0; i -= 2) {
                const id = next.list[i];
                const bd = next.list[i + 1];
                if (!bd)
                    nres += block.size(this.blocks[id]);
                this.history.changed.push(id, this.blocks[id]);
                this.blocks[id] = bd;
            }
            return nres + 1;
        }
        *range(color = 0) {
            for (let y = 0; y < this.size; y++)
                for (let x = 0; x < this.size; x++)
                    yield tsumego.stone.make(x, y, color);
        }
        toStringSGF(indent = '') {
            const take = (pf, fn) => {
                let list = '';
                for (let y = 0; y < this.size; y++)
                    for (let x = 0; x < this.size; x++)
                        if (fn(this.get(x, y)))
                            list += tsumego.stone.toString(tsumego.stone.make(x, y, +1)).slice(1);
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
                s += ' ';
                for (let x = 0; x <= xmax; x++)
                    s += ' ' + tsumego.stone.toString(tsumego.stone.make(x, 0, 0))[1];
            }
            for (let y = 0; y <= ymax; y++) {
                if (s)
                    s += '\n';
                if (!hideLabels)
                    s += tsumego.stone.toString(tsumego.stone.make(0, y, 0))[2];
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
        /**
         * stones() lists all the stones on the board
         * stones(b) lists only stones that belong to block b
         * stones(0) returns an ampty list
         */
        *stones(b) {
            const all = b === undefined;
            if (!all && !b)
                return;
            const [xmin, xmax, ymin, ymax] = !all ? block.dims(b) : [0, this.size - 1, 0, this.size - 1];
            for (let x = xmin; x <= xmax; x++) {
                for (let y = ymin; y <= ymax; y++) {
                    const c = this.get(x, y);
                    if (!all ? c == b : c)
                        yield tsumego.stone.make(x, y, c);
                }
            }
        }
        /** Checks if (x, y) is a liberty of block b. */
        isLibertyOf(x, y, b) {
            return this.get(x - 1, y) == b || this.get(x + 1, y) == b || this.get(x, y - 1) == b || this.get(x, y + 1) == b;
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
        nblocks(color) {
            let n = 0;
            for (let i = 0; i < this.blocks.length; i++) {
                const b = this.blocks[i];
                if (b * color > 0 && block.size(b) > 0)
                    n++;
            }
            return n;
        }
        nstones(color) {
            let n = 0;
            for (let i = 0; i < this.blocks.length; i++) {
                const b = this.blocks[i];
                if (b * color > 0)
                    n += block.size(b);
            }
            return n;
        }
        sumlibs(color) {
            let n = 0;
            for (let i = 0; i < this.blocks.length; i++) {
                const b = this.blocks[i];
                if (b * color > 0 && block.size(b) > 0)
                    n += block.libs(b);
            }
            return n;
        }
        natari(color) {
            let n = 0;
            for (let i = 0; i < this.blocks.length; i++) {
                const b = this.blocks[i];
                if (b * color > 0 && block.size(b) > 0 && block.libs(b) == 1)
                    n++;
            }
            return n;
        }
        /** the sequence of moves that was given to .play(...) to get this position */
        get moves() {
            return this.history.added.map(x => tsumego.stone.make(x & 15, x >> 4 & 15, x));
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
    var tags;
    (function (tags) {
        tags[tags['x'] = 0] = 'x';
        tags[tags['o'] = 1] = 'o';
        tags[tags['#'] = 2] = '#';
        tags[tags['-'] = 3] = '-';
        tags[tags['X'] = 4] = 'X';
        tags[tags['O'] = 5] = 'O';
        tags[tags["max"] = 6] = "max";
    })(tags || (tags = {}));
    const same = (m, b) => (m.bits & b) === m.bits;
    /**
     * An example of a pattern:
     *
     *      x x ?
     *      o - x
     *      # # #
     *
     * The current implementation uses bitmasks and the fact that patterns
     * are only 3x3 with the middle point empty at the moment. A probably
     * better and more scalable approach would be a DFA matcher:
     * www.gnu.org/software/gnugo/gnugo_10.html
     * www.delorie.com/gnu/docs/gnugo/gnugo_160.html
     */
    class Pattern {
        // the constructor can be very slow as every pattern
        // is constructed only once before the solver starts
        constructor(data) {
            this.masks = [new Array()]; // 8 elements
            // m[0][t] = bitmask for tags[t]
            // m[t] = the t-th transform of m[0]
            const m = this.masks;
            for (let i = 0; i < tags.max; i++)
                m[0].push(new BitMatrix(3, 3));
            for (let row = 0; row < data.length; row++) {
                const line = data[row].replace(/\s/g, '');
                for (let col = 0; col < line.length; col++) {
                    const chr = line[col];
                    if (chr == '?')
                        continue;
                    const tag = tags[chr];
                    if (tag === undefined)
                        throw SyntaxError(`Invalid char ${chr} at ${row}:${col} in [${data.join(' | ')}]`);
                    const mask = m[0][tag];
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
        static take(board, x0, y0, color, safe) {
            // constructing and disposing an array at every call
            // might look very inefficient, but getting rid of it
            // by declaring this array as a variable outside the
            // method doesn't improve performance at all in V8
            const m = [];
            for (let i = 0; i < tags.max; i++)
                m.push(0);
            for (let dy = 0; dy < 3; dy++) {
                for (let dx = 0; dx < 3; dx++) {
                    const x = x0 + dx - 1;
                    const y = y0 + dy - 1;
                    const c = board.get(x, y);
                    const s = tsumego.stone.make(x, y, c);
                    const b = 1 << (3 * dy + dx);
                    if (c * color > 0) {
                        // a stone of the same color
                        m[0] |= b;
                        // a safe stone of the same color
                        if (safe && safe(s))
                            m[4] |= b;
                    }
                    else if (c * color < 0) {
                        // a stone of the opposite color
                        m[1] |= b;
                        // a safe stone of the same color
                        if (safe && safe(s))
                            m[5] |= b;
                    }
                    else if (!board.inBounds(x, y)) {
                        // a neutral stone (the wall)
                        m[2] |= b;
                    }
                    else {
                        // a vacant intersection
                        m[3] |= b;
                    }
                }
            }
            return m;
        }
        test(m) {
            // for .. of here makes the entires solver 1.12x slower
            search: for (let i = 0; i < 8; i++) {
                const w = this.masks[i];
                for (let j = 0; j < tags.max; j++)
                    if (!same(w[j], m[j]))
                        continue search;
                return true;
            }
            return false;
        }
    }
    tsumego.Pattern = Pattern;
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    const patterns = [
        // a sure eye
        new tsumego.Pattern([
            ' x x x ',
            ' x - x ',
            ' x x x '
        ]),
        // a sure eye
        new tsumego.Pattern([
            ' x x ? ',
            ' x - x ',
            ' x x x '
        ]),
        // a sure eye
        new tsumego.Pattern([
            ' x x x ',
            ' x - x ',
            ' # # # '
        ]),
        // a sure eye
        new tsumego.Pattern([
            ' x x # ',
            ' x - # ',
            ' # # # '
        ]),
        // giving up a liberty
        new tsumego.Pattern([
            ' O O O ',
            ' ? - - ',
            ' x x x '
        ]),
        // giving up a liberty
        new tsumego.Pattern([
            ' O O O ',
            ' O - - ',
            ' ? x x '
        ]),
        // giving up a liberty
        new tsumego.Pattern([
            ' ? O O ',
            ' x - - ',
            ' x x x '
        ]),
        // giving up a liberty
        new tsumego.Pattern([
            ' # O O ',
            ' # - - ',
            ' # x x '
        ]),
        // giving up a liberty
        new tsumego.Pattern([
            ' # # # ',
            ' # - x ',
            ' # O ? '
        ]),
        // giving up a liberty
        new tsumego.Pattern([
            ' # # # ',
            ' ? - O ',
            ' O O O '
        ]),
    ];
    /**
     * Recognizes dumb moves that cannot possibly help.
     * For instance, filling in an own sure eye is a dumb move.
     */
    function isDumb(board, x, y, color, safe) {
        const snapshot = tsumego.Pattern.take(board, x, y, color, safe);
        for (const p of patterns)
            if (p.test(snapshot))
                return true;
        return false;
    }
    tsumego.isDumb = isDumb;
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var mgen;
    (function (mgen) {
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
    var stat;
    (function (stat) {
        stat.nodes = 0;
        stat.logv.push(() => `evaluated nodes = ${stat.nodes}`);
    })(stat = tsumego.stat || (tsumego.stat = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    // this is something like the sigmoid function
    // to map values to [-1, +1] range, but it's
    // considerably faster; it's derivative is
    // dS / dx = (S / x)**2
    const sigmoid = x => x / (1 + tsumego.sign(x) * x);
    /**
     * Evaluates chances to win for the current player.
     *
     * Returns a number in the [-1, +1] range:
     * +1 = the current player surely wins,
     * -1 = the current player surely loses.
     *
     */
    function evaluate(board, target) {
        const values = new tsumego.HashMap();
        // evaluates the node = (board, color) where color
        // tells who is about to play on this board
        return function _eval(color) {
            const t = board.get(target);
            const n = tsumego.block.libs(t);
            if (!t)
                return -tsumego.sign(t) * color;
            if (t * color < 0 && n < 2)
                return +1;
            const hash_b = board.hash_b ^ color;
            const hash_w = board.hash_w ^ color;
            // it's surprising, that with this dumb moves ordering
            // and with the cached tt results, the 1-st move appears
            // correct in 98 % cases
            const v = values.get(hash_b, hash_w) || ++tsumego.stat.nodes &&
                // maximize the number of captured stones first
                +1e-0 * sigmoid(board.nstones(color) - board.nstones(-color))
                    + 1e-1 * sigmoid(board.natari(-color))
                    + 1e-2 * sigmoid(n * color * tsumego.sign(t))
                    - 1e-3 * sigmoid(board.sumlibs(-color))
                    - 1e-4 * sigmoid(board.natari(color))
                    + 1e-5 * sigmoid(board.sumlibs(color))
                    + 1e-6 * sigmoid(tsumego.random() - 0.5);
            values.set(hash_b, hash_w, v);
            return v / 2; // abs(v) < 1 + 1/10
        };
    }
    tsumego.evaluate = evaluate;
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var mgen;
    (function (mgen) {
        /** Basic moves generator. Tries to maximize libs. */
        function fixed(board, target) {
            const ts = board.get(target);
            const rzone = new tsumego.stone.SmallSet;
            const same = (u, v) => board.inBounds(u) && board.inBounds(v) && board.get(u) * ts >= 0 && board.get(v) * ts >= 0;
            const neighbors = x => [...tsumego.stone.diagonals(x), ...tsumego.stone.neighbors(x)];
            // get stones reachable with the 8 moves: direct + diagonal
            for (const rs of tsumego.region(target, same, neighbors))
                rs && rzone.add(rs);
            // find blocks of the same color adjacent to rzone
            const adjacent = [];
            for (const rs of rzone) {
                for (const ns of tsumego.stone.neighbors(rs)) {
                    const b = board.get(ns);
                    if (b * ts < 0 && adjacent.indexOf(b) < 0)
                        adjacent.push(b);
                }
            }
            // find blocks with all the libs in rzone
            const inner = [];
            const safeb = [];
            test: for (const b of adjacent) {
                let n = 0;
                for (const [x, y] of board.libs(b)) {
                    if (!rzone.has(tsumego.stone.make(x, y, 0))) {
                        n++;
                        if (n > 1) {
                            // this block has libs outside the r-zone,
                            // so it won't be captured
                            for (const s of board.stones(b)) {
                                safeb.push(s);
                                break;
                            }
                            continue test;
                        }
                    }
                }
                inner.push(b);
            }
            // and add those blocks to the rzone as they may be captured
            for (const b of inner) {
                for (const s of board.stones(b))
                    rzone.add(tsumego.stone.make(tsumego.stone.x(s), tsumego.stone.y(s), 0));
                for (const [x, y] of board.libs(b))
                    rzone.add(tsumego.stone.make(x, y, 0));
            }
            // remove the target block from the rzone
            rzone.remove(s => board.get(s) == ts);
            function safe(s) {
                for (let i = 0; i < safeb.length; i++)
                    if (safeb[i] * s > 0 && board.get(safeb[i]) == board.get(s))
                        return true;
                return false;
            }
            const moves_b = [];
            const moves_w = [];
            for (const s of rzone) {
                const x = tsumego.stone.x(s);
                const y = tsumego.stone.y(s);
                moves_b.push(tsumego.stone.make(x, y, +1));
                moves_w.push(tsumego.stone.make(x, y, -1));
            }
            return function expand(color) {
                return color > 0 ? moves_b : moves_w;
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
                const moves = [];
                for (const s of nocolor) {
                    const x = tsumego.stone.x(s);
                    const y = tsumego.stone.y(s);
                    moves.push(tsumego.stone.make(x, y, color));
                }
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
                                            for (const s of board.stones(nnb))
                                                dmap.set(tsumego.stone.x(s), tsumego.stone.y(s), d);
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
                                                for (const s1 of board.stones(fb))
                                                    dmap.set(tsumego.stone.x(s1), tsumego.stone.y(s1), rd);
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
                            rzone.push(tsumego.stone.make(x, y, 0));
                            if (board.play(tsumego.stone.make(x, y, +1)) || board.play(tsumego.stone.make(x, y, -1))) {
                                moves.push(tsumego.stone.make(x, y, 0));
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
/// <reference path="mgen/eval.ts" />
/// <reference path="mgen/fixed.ts" />
/// <reference path="mgen/dist.ts" />
var tsumego;
(function (tsumego) {
    // The expected number of collisions in a hash table is
    //
    //  E = n - m + m*(1 - 1/m)**n) ~ n**2/2m
    //
    // where
    //
    //  n = the number of entires; usually ~1e6 in a typical tsumego
    //  m = the size of the hash table; usually 2**32 or 2**64
    //
    // This gives 125 collisions if n = 2**20 and m = 2**32.
    // If a 64 bit key is used, then a collision will appear
    // only once in 2**25 tsumegos. 53 bits give one collision
    // per 2**14 tsumegos, correspondingly.
    class HashMap {
        constructor() {
            this.data = []; // 16 x 2**30 x 2**30
            // this is a bit faster than a plain [] or {},
            // probably because negative keys are stringified
            for (let i = 0; i < 16; i++)
                this.data[i] = [];
        }
        get(key_hi, key_lo) {
            const a = key_hi & 3 | key_lo << 2 & 12;
            const b = key_hi >>> 2;
            const c = key_lo >>> 2;
            const t = this.data[a][b];
            // (t && t[c] || 0) would be much slower
            if (!t)
                return 0;
            const value = t[c];
            if (!value)
                return 0;
            return value;
        }
        set(key_hi, key_lo, value) {
            const a = key_hi & 3 | key_lo << 2 & 12;
            const b = key_hi >>> 2;
            const c = key_lo >>> 2;
            const q = this.data[a];
            if (!q[b])
                q[b] = [];
            q[b][c] = value;
        }
    }
    tsumego.HashMap = HashMap;
})(tsumego || (tsumego = {}));
/// <reference path="hashmap.ts" />
var tsumego;
(function (tsumego) {
    var stat;
    (function (stat) {
        stat.ttread = 0;
        stat.ttwrite = 0;
        stat.ttmiss = 0;
        stat.logv.push(() => `tt reads = ${stat.ttread}`);
        stat.logv.push(() => `tt misses = ${stat.ttmiss} = ${stat.ttmiss / stat.ttread * 100 | 0} %`);
        stat.logv.push(() => `tt writes = ${stat.ttwrite} = ${stat.ttwrite / stat.ttread * 100 | 0} %`);
    })(stat = tsumego.stat || (tsumego.stat = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    /**
     * 0               1               2               3
     *  0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     * |   x   |   y   |  b  |  w  |u|m|                               |
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     *
     * The first 2 bytes tell the outcome if black can play first:
     *
     *      b - if km >= b, then black wins; b = -3..+3
     *      w - if km <= w, then white wins; w = -3..+3
     *      m - if km >= b, m tells if black needs to play at (x, y) to win
     *      u - this bit isn't used at the moment
     *
     * where km = +1 means that W is the ko master, km = -1 means
     * that B is the ko master and km = 0 means neither B nor W has
     * external ko treats.
     *
     * Obviously, w < b, as otherwise the status would be ambiguous.
     * This implies that the zero entry is not valid.
     */
    var entry;
    (function (entry) {
    })(entry || (entry = {}));
    var entry;
    (function (entry) {
        function make(x, y, b, w, m) {
            return x | y << 4 | (b & 7) << 8 | (w & 7) << 11 | (m ? 0x8000 : 0);
        }
        entry.make = make;
    })(entry || (entry = {}));
    var entry;
    (function (entry) {
        entry.x = (e) => e & 15;
        entry.y = (e) => e >> 4 & 15;
        entry.b = (e) => (e >> 8 & 7) << 29 >> 29;
        entry.w = (e) => (e >> 11 & 7) << 29 >> 29;
        entry.m = (e) => !!(e & 0x8000);
        entry.base = entry.make(0, 0, +3, -3, false);
    })(entry || (entry = {}));
    /** Transposition Table */
    class TT {
        constructor() {
            this.size = 0;
            // this is a cache of found solutions
            // and is used only for move ordering;
            // it makes a huge impact on the perf:
            // reducing the number of entries to 1M
            // for example will make the solver 3-4x
            // slower
            this.move = new tsumego.HashMap(); // node -> stone
            this.data = [
                new tsumego.HashMap(),
                null,
                new tsumego.HashMap(),
            ];
        }
        get(hash_0, hash_1, color, km) {
            const e = this.data[color & 2].get(hash_0, hash_1);
            tsumego.stat.ttread++;
            if (!e)
                return 0;
            tsumego.stat.ttmiss++;
            const winner = km >= entry.b(e) ? +1 :
                km <= entry.w(e) ? -1 :
                    0; // not solved for this number of ko treats
            if (!winner)
                return 0;
            // the move must be dropped if the outcome is a loss
            return winner * color > 0 && entry.m(e) ?
                tsumego.stone.make(entry.x(e), entry.y(e), winner) :
                tsumego.stone.nocoords(winner);
        }
        /**
         * @param color Who plays first.
         * @param move The outcome. Must have a color and may have coordinates.
         * @param km Must be either-1, +1 or 0.
         */
        set(hash_0, hash_1, color, move, km) {
            const e = this.data[color & 2].get(hash_0, hash_1) || ++this.size && entry.base;
            tsumego.stat.ttwrite++;
            // The idea here is to not override the winning move.
            // A typical case is the bent 4 shape: B wins if there are
            // no ko treats and loses if W has ko treats. If the first
            // solution is written first, then the second solution shouldn't
            // override the winning move.
            const [x, y, hc] = move * color > 0 ?
                [tsumego.stone.x(move), tsumego.stone.y(move), tsumego.stone.hascoords(move)] :
                [entry.x(e), entry.y(e), entry.m(e)];
            const b = entry.b(e);
            const w = entry.w(e);
            const e2 = move > 0 && km < b ? entry.make(x, y, km, w, hc) :
                move < 0 && km > w ? entry.make(x, y, b, km, hc) :
                    e;
            this.data[color & 2].set(hash_0, hash_1, e2);
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
         *
         * This implementation is not incremental: it evaluates every position
         * from sctratch, even if the position differs from the previously evaluated
         * one by just one move. Since only about 10% of positions pass the test,
         * this makes this implementation unacceptably slow: when it's enabled,
         * it makes the search 1.5x slower.
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
/// <reference path="stat.ts" />
/// <reference path="color.ts" />
/// <reference path="pattern.ts" />
/// <reference path="dumb.ts" />
/// <reference path="movegen.ts" />
/// <reference path="tt.ts" />
/// <reference path="benson.ts" />
/// <reference path="dcnn.ts" />
/// <reference path="gf2.ts" />
var tsumego;
(function (tsumego) {
    var stat;
    (function (stat) {
        stat.ttinvalid = 0;
        stat.logv.push(() => `wrong tt entires = ${stat.ttinvalid}`);
        stat.calls = 0;
        stat.logv.push(() => `calls to solve = ${stat.calls}`);
        stat.expand = 0;
        stat.logv.push(() => `calls to expand = ${stat.expand} = ${stat.expand / stat.calls * 100 | 0} %`);
        stat.first = 0;
        stat.logv.push(() => `the 1-st move is correct = ${stat.first / stat.expand * 100 | 0} %`);
    })(stat = tsumego.stat || (tsumego.stat = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
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
        function* start(args) {
            const { board, color, km, tt, log, expand, debug, time } = args;
            let { target, alive } = args;
            if (log && alive) {
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
            let started = Date.now(), yieldin = 100, remaining = yieldin;
            if (!tsumego.stone.hascoords(target))
                throw Error('The target stone is not set');
            // tells who is being captured: coords + color
            target = tsumego.stone.make(tsumego.stone.x(target), tsumego.stone.y(target), tsumego.sign(board.get(target)));
            if (!tsumego.stone.color(target))
                throw Error('The target points to an empty point: ' + tsumego.stone.toString(target));
            const sa = new tsumego.SortedArray();
            const evalnode = tsumego.evaluate(board, target);
            const path = []; // path[i] = hash of the i-th position
            const tags = []; // this is to detect long loops, e.g. the 10,000 year ko
            const hist = []; // the sequence of moves that leads to the current position
            function* solve(color, km) {
                remaining--;
                tsumego.stat.calls++;
                if (time && !remaining) {
                    yield;
                    const current = Date.now();
                    const speed = yieldin / (current - started);
                    started = current;
                    yieldin = tsumego.max(speed * time | 0, 1);
                    remaining = yieldin;
                }
                const depth = path.length;
                const prevb = depth < 1 ? 0 : path[depth - 1];
                const hash32 = board.hash;
                const hash_b = board.hash_b;
                const hash_w = board.hash_w;
                const ttres = tt.get(hash_b, hash_w, color, km);
                debug && (debug.color = color);
                debug && (debug.depth = depth);
                debug && (debug.moves = hist);
                debug && (debug.path = path);
                debug && (debug.km = km);
                if (ttres) {
                    // due to collisions, tt may give a result for a different position;
                    // however with 64 bit hashes, there expected to be just one collision
                    // per sqrt(2 * 2**64) = 6 billions positions = 12 billion w/b nodes
                    if (!board.get(ttres))
                        return tsumego.repd.set(ttres, tsumego.infdepth);
                    tsumego.stat.ttinvalid++;
                }
                if (depth > tsumego.infdepth / 2)
                    return tsumego.repd.set(tsumego.stone.nocoords(-color), 0);
                const guess = tt.move.get(color > 0 ? 1 : 0, hash32);
                let result;
                let mindepth = tsumego.infdepth;
                const nodes = sa.reset();
                tsumego.stat.expand++;
                // 75% of the time the solver spends in this loop;
                // also, it's funny that in pretty much all cases
                // a for-of is slower than the plain for loop, but
                // in this case it's the opposite: for-of is way
                // faster for some mysterious reason; also v8 jit
                // doesn't optimize functions with yield, so it's
                // profitable to move out this chunk of code into
                // a plain function without yield/yield* stuff, but
                // this gives only a marginal profit
                for (const move of expand(color)) {
                    if (!board.play(move))
                        continue;
                    const value = -evalnode(-color);
                    const hash_b = board.hash_b;
                    const hash_w = board.hash_w;
                    const hash32 = board.hash;
                    board.undo();
                    // -1 indicates a sure loss
                    if (value <= -1)
                        continue;
                    // skip moves that are known to be losing
                    if (tt.get(hash_b, hash_w, -color, km) * color < 0)
                        continue;
                    let d = depth - 1;
                    while (d >= 0 && path[d] != hash32)
                        d = d > 0 && path[d] == path[d - 1] ? -1 : d - 1;
                    d++;
                    if (!d)
                        d = tsumego.infdepth;
                    if (d < mindepth)
                        mindepth = d;
                    // there are no ko treats to play this move,
                    // so play a random move elsewhere and yield
                    // the turn to the opponent; this is needed
                    // if the opponent is playing useless ko-like
                    // moves that do not help even if all these
                    // ko fights are won
                    if (d <= depth && km * color <= 0)
                        continue;
                    sa.insert(tsumego.repd.set(move, d), [
                        // moves that require a ko treat are considered last
                        // that's not just perf optimization: the search depends on this
                        +1e-0 * d
                            + 1e-1 * tsumego.sign(guess * color)
                            + 1e-2 * tsumego.sign(tt.move.get(color < 0 ? 1 : 0, hash32) * color)
                            + 1e-3 * value
                    ]);
                }
                // Consider making a pass as well. Passing locally is like
                // playing a move elsewhere and yielding the turn to the 
                // opponent locally: it doesn't affect the local position,
                // but resets the local history of moves. This is why passing
                // may be useful: a position may be unsolvable with the given
                // history of moves, but once it's reset, the position can be
                // solved despite the move is yilded to the opponent.
                // Also, there is no point to pass if the target is in atari.
                if (tsumego.block.libs(board.get(target)) > 1)
                    nodes.push(0);
                let trials = 0;
                while (trials < nodes.length) {
                    const move = nodes[trials++];
                    const d = !move ? tsumego.infdepth : tsumego.repd.get(move);
                    let s;
                    path.push(hash32);
                    hist.push(move || tsumego.stone.nocoords(color));
                    move && board.play(move);
                    debug && (yield tsumego.stone.toString(move || tsumego.stone.nocoords(color)));
                    if (!move) {
                        const nextkm = prevb == hash32 && color * km < 0 ? 0 : km;
                        const tag = hash32 & ~15 | (-color & 3) << 2 | nextkm & 3; // tells which position, who plays and who is the km
                        const isloop = tags.lastIndexOf(tag) >= 0;
                        if (isloop) {
                            // yielding the turn again means that both sides agreed on
                            // the group's status; check the target's status and quit
                            s = tsumego.repd.set(tsumego.stone.nocoords(target), depth - 1);
                        }
                        else {
                            // play a random move elsewhere and yield
                            // the turn to the opponent; playing a move
                            // elsewhere resets the local history of moves;
                            //
                            // There is a tricky side effect related to ko.
                            // Consider two positions below:
                            //
                            //  ============|      =============  
                            //  X O - O O O |      X O - X X X |
                            //  X X O O - O |      X O O O O - |
                            //  - X X O O O |      X X X X O O |
                            //  - - X X X X |            X X X |
                            //
                            // In both cases if O has infinitely many ko treats
                            // (this is the case when there is a large double ko
                            // elsewhere on the board), then O lives. However if
                            // O has finitely many ko treats, X can first remove
                            // them all (locally, removing an external ko treat
                            // means passing), recapture the stone and since O
                            // doesn't have ko treats anymore, it dies.
                            //
                            // Modeling this is simple. If X passes and then O passes,
                            // X can assume that it can repeat this as many times as
                            // needed to remove all ko treats and then yield the turn
                            // to O now in assumption that O has no ko treats. This is
                            // what the (prevb == hashb) check below does: it checks
                            // that if the two last moves were passes, the ko treats
                            // can be voided and the search can be resumed without them.
                            tags.push(tag);
                            s = yield* solve(-color, nextkm);
                            tags.pop();
                        }
                    }
                    else {
                        if (!board.get(target))
                            s = tsumego.repd.set(tsumego.stone.nocoords(-target), tsumego.infdepth);
                        else if (color * target > 0 && alive && alive(board))
                            s = tsumego.repd.set(tsumego.stone.nocoords(target), tsumego.infdepth);
                        else
                            s = yield* solve(-color, move && km);
                    }
                    path.pop();
                    hist.pop();
                    move && board.undo();
                    debug && (yield tsumego.stone.toString(tsumego.repd.set(move, 0) || tsumego.stone.nocoords(color)) + ' \u27f6 ' + tsumego.stone.toString(s));
                    // the min value of repd is counted only for the case
                    // if all moves result in a loss; if this happens, then
                    // the current player can say that the loss was caused
                    // by the absence of ko treats and point to the earliest
                    // repetition in the path
                    if (s * color < 0 && move)
                        mindepth = tsumego.min(mindepth, d > depth ? tsumego.repd.get(s) : d);
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
                        result = tsumego.repd.set(move || tsumego.stone.nocoords(color), d > depth && move ?
                            tsumego.repd.get(s) :
                            d);
                        if (trials == 1 && nodes.length > 2)
                            tsumego.stat.first++;
                        break;
                    }
                }
                // if there is no winning move, record a loss
                if (!result)
                    result = tsumego.repd.set(tsumego.stone.nocoords(-color), mindepth);
                // if the solution doesn't depend on a ko above the current node,
                // it can be stored and later used unconditionally as it doesn't
                // depend on a path that leads to the node; this stands true if all
                // such solutions are stored and never removed from the table; this
                // can be proved by trying to construct a path from a node in the
                // proof tree to the root node
                if (tsumego.repd.get(result) > depth + 1)
                    tt.set(hash_b, hash_w, color, result, km);
                tt.move.set(color > 0 ? 1 : 0, hash32, result);
                log && log.write({
                    color: color,
                    result: result,
                    target: target,
                    trials: trials,
                    guess: guess,
                    board: board.hash,
                    sgf: log.sgf && board.toStringSGF(),
                });
                return result;
            }
            // restore the path from the history of moves
            {
                const moves = [];
                let move;
                while (move = board.undo())
                    moves.unshift(move);
                for (move of moves) {
                    path.push(board.hash);
                    board.play(move);
                }
            }
            let move = yield* solve(color, km || 0);
            if (!Number.isFinite(km)) {
                // if it's a loss, see what happens if there are ko treats;
                // if it's a win, try to find a stronger move, when the opponent has ko treats
                const move2 = yield* solve(color, move * color > 0 ? -color : color);
                if (move2 * color > 0 && tsumego.stone.hascoords(move2))
                    move = move2;
            }
            move = tsumego.repd.set(move, 0);
            return typeof args === 'string' ?
                tsumego.stone.toString(move) :
                move;
        }
        solve_1.start = start;
    })(solve = tsumego.solve || (tsumego.solve = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    /**
     * Represets a tsumego: the board + the internal state,
     * such as the sequence of played moves and the cache
     * of solved positions.
     *
     * @example
     *
     *  problem = new Solver('(;FF[4]SZ[9]'
     *      + 'MA[ch]' // the target
     *      + 'AB[ae][be][ce][de][ee][ef][cg][eg][fg][fh][gh][hh][ai][ei][hi]'
     *      + 'AW[dg][ah][bh][ch][eh][di]');
     *
     *  move = problem.solve('W'); // W[bf] - W kills the group with [bf]
     *  problem.play(move); // true
     *  problem.solve('B'); // null, B cannot save the group
     *  problem.treats('B'); // B[cd], B[ef], etc. - moves that need a response from W
     *  problem.solve('W'); // W[] - W can pass and still take the group
     */
    class Solver {
        constructor(args) {
            if (typeof args === 'string') {
                const sgf = tsumego.SGF.parse(args);
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
                const target = exec(() => tsumego.stone.fromString(sgf.get('MA')[0]), 'MA[xy] must specify the target white stone.');
                if (errors.length)
                    throw SyntaxError('The SGF does not correctly describe a tsumego:\n\t' + errors.join('\n\t'));
                const tb = board.get(target);
                args = {
                    color: null,
                    board: board,
                    tt: new tsumego.TT,
                    expand: tsumego.mgen.fixed(board, target),
                    target: target,
                };
            }
            this.args = args;
        }
        get board() {
            return this.args.board;
        }
        toString() {
            return this.args.board.toString();
        }
        /**
         * Adds a stone if it doesn't violate the rules.
         *
         * This method allows to repeat previous positions,
         * and in particular it allows to immediately recapture
         * a stone (aka "ko").
         *
         * @example
         *
         *  play('W[ea]') == true; // the move has been added
         *  play('B[cd]') == false; // this move cannot be played
         */
        play(move) {
            if (typeof move === 'string') {
                move = tsumego.stone.fromString(move);
                if (!move)
                    throw Error('Invalid move format. Consider W[ea] or B[cd].');
            }
            return this.args.board.play(move) > 0;
        }
        /**
         * Reverts the last move and returns it.
         *
         * @example
         *
         *  play("W[ea]");
         *  undo() == "W[ea]";
         *  undo() == null; // nothing to undo
         */
        undo() {
            const move = this.args.board.undo();
            return tsumego.stone.toString(move);
        }
        /**
         * Finds the best move for the specified player.
         * This method takes external ko treats into
         * account: if there is a solution that needs
         * external ko treats and another solution that
         * doesn't need them, the latter will be chosen.
         *
         * @example
         *
         *  solve("B") == "B[ea]"; // the best move for black
         *  solve("W") == null; // there is no good move for white
         */
        solve(color) {
            if (typeof color === 'string') {
                color = tsumego.stone.label.color(color);
                if (!color)
                    throw Error('Invalid color value. Consider W or B.');
            }
            const _args = Object.assign({}, this.args);
            _args.color = color;
            const move = tsumego.solve(_args);
            return move * color > 0 ? tsumego.stone.toString(move) : '';
        }
        g_solve(color, args) {
            if (typeof color === 'string') {
                color = tsumego.stone.label.color(color);
                if (!color)
                    throw Error('Invalid color value. Consider W or B.');
            }
            const _args = Object.assign({}, this.args, args);
            _args.color = color;
            if (_args.benson)
                _args.alive = (b) => tsumego.benson.alive(b, _args.target);
            return tsumego.solve.start(_args);
        }
        /**
         * Finds all possible threats for the specified player.
         * A threat is a move that doesn't work by itself, but
         * if the opponent ignores it, the next move does work.
         *
         * If solve(...) finds that there is no solution, this
         * method can tell what are the strongest, but not working,
         * moves for that player.
         *
         * @example
         *
         *  for (const move of threats("W")) {
         *    move; // "W[ea]"
         *  }
         */
        *threats(color) {
            if (typeof color === 'string') {
                color = tsumego.stone.label.color(color);
                if (!color)
                    throw Error('Invalid color value. Consider W or B.');
            }
            for (const move of this.args.expand(color)) {
                if (this.args.board.play(move)) {
                    const resp = this.solve(color);
                    this.args.board.undo();
                    if (tsumego.stone.fromString(resp) * color > 0)
                        yield tsumego.stone.toString(move);
                }
            }
        }
        /**
         * Constructs a proof tree:
         *
         *  - for every wrong move the tree has a disproof
         *  - for every correct move the tree has a strongest response
         *
         * Returns the tree of moves in the SGF format.
         *
         * @example
         *
         *  tree('W', 2) == `
         *      (;W[ea];B[cb]
         *          (;W[gg];B[aa])
         *          (;W[ge];B[ad]))
         *      (;W[fc];B[dd]
         *          (;W[gc];B[ac])))
         *      (;W[ae];B[gh])
         *  `;
         */
        *tree(color, depth) {
            if (typeof color === 'string') {
                color = tsumego.stone.label.color(color);
                if (!color)
                    throw Error('Invalid color value. Consider W or B.');
            }
            const self = this;
            const cache = {}; // contuations chosen by the user
            const board = this.args.board;
            const target = this.args.target;
            const expand = this.args.expand;
            const correct = new WeakMap();
            const terminal = new WeakMap();
            // adds a disproof for every wrong move and
            // a strongest response for every correct move
            function* deepen(tree, color) {
                const sgf = board.sgf;
                for (const move of expand(color)) {
                    if (board.play(move)) {
                        const subtree = tree[tsumego.stone.toString(move)] = {};
                        const dead = !board.get(target);
                        const resp = dead ? '' : self.solve(-color);
                        if (!resp) {
                            // this is a correct move: add strongest responses                            
                            correct.set(subtree, true);
                            if (!dead) {
                                let hasThreats = false;
                                // check if there are any threats before
                                // bothering the user to pick one
                                for (const threat of self.threats(-color)) {
                                    hasThreats = true;
                                    break;
                                }
                                if (hasThreats) {
                                    // ask the UI to give the best response;
                                    // another option would be to somehow rank
                                    // moves returned by threats(-color) and
                                    // pick the stongest one
                                    const threat = board.hash in cache ?
                                        cache[board.hash] :
                                        yield tsumego.stone.label.string(-color);
                                    cache[board.hash] = threat;
                                    // the UI gives null if the variation needs to end here
                                    if (threat)
                                        subtree[threat] = {};
                                }
                            }
                            // now this player can ignore any next move:
                            // no need to deepen further this branch
                            if (leaf(subtree))
                                terminal.set(subtree, true);
                        }
                        else if (resp.indexOf('[]') >= 0) {
                            // hmm.. the opponent needs to pass; this usually happens
                            // when the result is seki, but also might happen when the
                            // opponent needs to drop external ko treats and recapture
                            terminal.set(subtree, true);
                        }
                        else {
                            // this is wrong move: add the found disproof;
                            // but before that check if the opponent even
                            // needed a response: maybe this move is so wrong
                            // that doesn't do anything at all
                            const pass = self.solve(color);
                            if (tsumego.stone.fromString(pass) * color > 0) {
                                subtree[resp] = {};
                                board.play(tsumego.stone.fromString(resp));
                                // detect a basic ko and stop the variation
                                if (sgf == board.sgf)
                                    terminal.set(subtree[resp], true);
                                board.undo();
                            }
                            else {
                                // the move is dumb and can be ignored
                                terminal.set(subtree, true);
                            }
                        }
                        board.undo();
                    }
                }
            }
            function* leaves(tree) {
                for (const move in tree) {
                    if (board.play(tsumego.stone.fromString(move))) {
                        yield* leaves(tree[move]);
                        board.undo();
                    }
                    else {
                        debugger;
                    }
                }
                // danger: this should be at the end,
                // as otherwise the caller may insert
                // subnodes and for-in above will happily
                // list them as well
                if (leaf(tree))
                    yield tree;
            }
            const root = {};
            for (let d = 0; d < depth; d++) {
                console.log('working on level ' + d);
                let changed = false;
                for (const leaf of leaves(root)) {
                    if (terminal.get(leaf))
                        continue;
                    const n = width(leaf);
                    yield* deepen(leaf, color);
                    if (width(leaf) > n)
                        changed = true;
                }
                // nothing has been added: no need to proceed;
                // usually, variations end at depth 14-15, if
                // no static analysis is applied
                if (!changed) {
                    console.log('variations ended here');
                    break;
                }
            }
            function width(tree) {
                return Object.keys(tree).length;
            }
            function leaf(tree) {
                return width(tree) < 1;
            }
            // the idea is to detect branches like (;B[ef]C[RIGHT];W[fg])
            // the W[fg] move is really not needed there
            function final(tree) {
                for (const move in tree)
                    if (!leaf(tree[move]))
                        return false;
                return true;
            }
            return (function stringify(tree, d = 0) {
                const vars = [];
                for (const move in tree) {
                    const subtree = tree[move];
                    // there is no point to explicitly list wrong moves, e.g. ;B[ef];W[cc];B[df]C[WRONG]
                    if (tsumego.stone.fromString(move) * color > 0 && !correct.has(subtree) && leaf(subtree))
                        continue;
                    let line = ';' + move;
                    if (correct.get(subtree)) {
                        line += 'ZZ[+]'; // simplifies debugging
                        if (leaf(subtree) || final(subtree))
                            line += 'C[RIGHT]';
                    }
                    // a correct line should end with a correct move;
                    // a wrong line should end with a disproving move
                    if (!correct.has(subtree) || !final(subtree))
                        line += stringify(subtree, d + 1);
                    vars.push(line);
                }
                if (vars.length < 2)
                    return vars.join('');
                return vars.map(s => '\n' + '  '.repeat(d) + '(' + s + ')').join('');
            })(root);
        }
    }
    tsumego.Solver = Solver;
})(tsumego || (tsumego = {}));
/// <reference path="search.ts" />
/// <reference path="solver.ts" />
var tsumego;
(function (tsumego) {
    try {
        module.exports = tsumego; // node.js
    }
    catch (_) {
        try {
            define(tsumego); // AMD
        }
        catch (_) {
            window.tsumego = tsumego;
        }
    }
})(tsumego || (tsumego = {}));
//# sourceMappingURL=tsumego.js.map
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tsumego;
(function (tsumego) {
    var stat;
    (function (stat) {
        stat.logv = [];
        stat.summarizxe = function () {
            return stat.logv.map(function (f) {
                return f();
            });
        };
    })(stat = tsumego.stat || (tsumego.stat = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var color = undefined;
    (function (color) {
        color[color["black"] = 1] = "black";
        color[color["white"] = -1] = "white";
    })(color = tsumego.color || (tsumego.color = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var SortedArray = (function () {
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

        function SortedArray() {
            _classCallCheck(this, SortedArray);
        }

        SortedArray.prototype.reset = function reset() {
            this.flags = [];
            this.items = [];
            return this.items;
        };

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

        SortedArray.prototype.insert = function insert(item, flag) {
            var items = this.items;
            var flags = this.flags;

            var i = items.length;
            // it sounds crazy, but passing around this single number
            // inside a one element array is way faster than passing
            // this number alone: 10s vs 14s (!)
            while (i > 0 && flags[i - 1][0] < flag[0]) i--;
            // using .push when i == n and .unshift when i == 0
            // won't make the solver run faster
            items.splice(i, 0, item);
            flags.splice(i, 0, flag);
            return i;
        };

        return SortedArray;
    })();

    tsumego.SortedArray = SortedArray;
})(tsumego || (tsumego = {}));
/// <reference path="sorted.ts" />
var tsumego;
(function (tsumego) {
    tsumego.min = function (a, b) {
        return a < b ? a : b;
    };
    tsumego.max = function (a, b) {
        return a > b ? a : b;
    };
    tsumego.abs = function (a) {
        return a < 0 ? -a : a;
    };
    tsumego.sign = function (x) {
        return x < 0 ? -1 : x > 0 ? +1 : 0;
    };
    tsumego.nesw = [[-1, 0], [+1, 0], [0, -1], [0, +1]];
    function* region(root, belongs) {
        var neighbors = arguments.length <= 2 || arguments[2] === undefined ? tsumego.stone.neighbors : arguments[2];

        var body = [];
        var edge = [root];
        while (edge.length > 0) {
            var xy = edge.pop();
            yield xy;
            body.push(xy);
            for (var _iterator = neighbors(xy), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref = _i.value;
                }

                var nxy = _ref;

                if (belongs(nxy, xy) && body.indexOf(nxy) < 0 && edge.indexOf(nxy) < 0) edge.push(nxy);
            }
        }
    }
    tsumego.region = region;
    tsumego.b4 = function (b0, b1, b2, b3) {
        return b0 | b1 << 8 | b2 << 16 | b3 << 24;
    };
    tsumego.b0 = function (b) {
        return b & 255;
    };
    tsumego.b1 = function (b) {
        return b >> 8 & 255;
    };
    tsumego.b2 = function (b) {
        return b >> 16 & 255;
    };
    tsumego.b3 = function (b) {
        return b >> 24 & 255;
    };
    tsumego.b_ = function (b) {
        return [tsumego.b0(b), tsumego.b1(b), tsumego.b2(b), tsumego.b3(b)];
    };
    function sequence(length, item) {
        var items = [];
        for (var i = 0; i < length; i++) {
            items[i] = item instanceof Function ? item(i) : item;
        }return items;
    }
    tsumego.sequence = sequence;
    tsumego.hex = function (x) {
        return (0x100000000 + x).toString(16).slice(-8);
    };
    tsumego.rcl = function (x, n) {
        return x << n | x >>> 32 - n;
    };
    function memoized(fn, hashArgs) {
        var cache = {};
        return fn && function (x) {
            var h = hashArgs(x);
            return h in cache ? cache[h] : cache[h] = fn(x);
        };
    }
    tsumego.memoized = memoized;
    /** e.g. @enumerable(false) */
    function enumerable(isEnumerable) {
        return function (p, m, d) {
            return void (d.enumerable = isEnumerable);
        };
    }
    tsumego.enumerable = enumerable;
    function assert(condition) {
        if (!condition) debugger;
    }
    tsumego.assert = assert;
    tsumego.n32b = function (d) {
        return {
            parse: function parse(x) {
                var r = {};
                for (var _name in d) {
                    var _d$_name = d[_name];
                    var offset = _d$_name.offset;
                    var _length = _d$_name.length;
                    var _d$_name$signed = _d$_name.signed;
                    var signed = _d$_name$signed === undefined ? false : _d$_name$signed;

                    var value = x << 32 - offset - _length >> 32 - _length;
                    r[_name] = signed ? value : value & (1 << _length) - 1;
                }
                return r;
            }
        };
    };
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var kCoord = 0x20000000;
    var kColor = 0x40000000;
    var kWhite = 0x80000000;
    /**
     * 0               1               2               3
     *  0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     * |   x   |   y   |        r       |                    | k |h|c|w|
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     *
     *  x - the x coord (valid only if h = 1)
     *  y - the y coord (valid only if h = 1)
     *  h - whether the stone has coordinates
     *  c - whether the stone has a color
     *  w - whether the stone is white (valid if c = 1)
     *  r - depth at which repetition occurs
     *  k - who is the ko master: +1, 0, -1
     */
    var stone = undefined;
    (function (stone) {})(stone = tsumego.stone || (tsumego.stone = {}));
    (function (stone) {
        function make(x, y, color) {
            return x | y << 4 | kCoord | (color && kColor) | color & kWhite;
        }
        stone.make = make;
    })(stone = tsumego.stone || (tsumego.stone = {}));
    (function (stone) {
        stone.nocoords = function (color) {
            return kColor | color & kWhite;
        };
        stone.color = function (m) {
            return m & kColor && (m & kWhite ? -1 : +1);
        };
        stone.setcolor = function (m, c) {
            return m & ~kColor & ~kWhite | (c && kColor) | c & kWhite;
        };
        stone.hascoords = function (m) {
            return !!(m & kCoord);
        };
        stone.x = function (m) {
            return m & 15;
        };
        stone.y = function (m) {
            return m >> 4 & 15;
        };
        stone.coords = function (m) {
            return [stone.x(m), stone.y(m)];
        };
        stone.same = function (a, b) {
            return !((a ^ b) & 255);
        };
        stone.dist = function (a, b) {
            return Math.abs(stone.x(a) - stone.x(b)) + Math.abs(stone.y(a) - stone.y(b));
        };
        stone.move = function (s, dx, dy) {
            return stone.x(s) + dx & 15 | (stone.y(s) + dy & 15) << 4 | s & ~255;
        };
        stone.neighbors = function (m) {
            var _stone$coords = stone.coords(m);

            var x = _stone$coords[0];
            var y = _stone$coords[1];

            var c = stone.color(m);
            return [x <= 0x0 ? 0 : stone.make(x - 1, y, c), x >= 0xF ? 0 : stone.make(x + 1, y, c), y <= 0x0 ? 0 : stone.make(x, y - 1, c), y >= 0xF ? 0 : stone.make(x, y + 1, c)];
        };
        stone.diagonals = function (m) {
            var _stone$coords2 = stone.coords(m);

            var x = _stone$coords2[0];
            var y = _stone$coords2[1];

            var c = stone.color(m);
            return [x <= 0x0 || y <= 0x0 ? 0 : stone.make(x - 1, y - 1, c), x >= 0xF || y <= 0x0 ? 0 : stone.make(x + 1, y - 1, c), x <= 0x0 || y >= 0xF ? 0 : stone.make(x - 1, y + 1, c), x >= 0xF || y >= 0xF ? 0 : stone.make(x + 1, y + 1, c)];
        };

        var Set = (function () {
            function Set(items) {
                _classCallCheck(this, Set);

                this.stones = [];
                if (items) for (var _iterator2 = items, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                        var _ref2;

                        if (_isArray2) {
                            if (_i2 >= _iterator2.length) break;
                            _ref2 = _iterator2[_i2++];
                        } else {
                            _i2 = _iterator2.next();
                            if (_i2.done) break;
                            _ref2 = _i2.value;
                        }

                        var s = _ref2;

                        this.stones.push(s);
                    }
            }

            Set.prototype.toString = function toString() {
                return this.stones.sort(function (a, b) {
                    return a - b;
                }).map(stone.toString).join('');
            };

            Set.prototype.has = function has(s) {
                for (var _iterator3 = this.stones, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                    var _ref3;

                    if (_isArray3) {
                        if (_i3 >= _iterator3.length) break;
                        _ref3 = _iterator3[_i3++];
                    } else {
                        _i3 = _iterator3.next();
                        if (_i3.done) break;
                        _ref3 = _i3.value;
                    }

                    var x = _ref3;

                    if (stone.same(x, s)) return true;
                }return false;
            };

            Set.prototype.add = function add() {
                for (var _len = arguments.length, stones = Array(_len), _key = 0; _key < _len; _key++) {
                    stones[_key] = arguments[_key];
                }

                for (var _iterator4 = stones, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
                    var _ref4;

                    if (_isArray4) {
                        if (_i4 >= _iterator4.length) break;
                        _ref4 = _iterator4[_i4++];
                    } else {
                        _i4 = _iterator4.next();
                        if (_i4.done) break;
                        _ref4 = _i4.value;
                    }

                    var s = _ref4;

                    if (!this.has(s)) this.stones.push(s);
                }
            };

            Set.prototype.remove = function remove(p) {
                for (var i = this.stones.length - 1; i >= 0; i--) {
                    var q = this.stones[i];
                    if (typeof p === 'function' ? p(q) : stone.same(p, q)) this.stones.splice(i, 1);
                }
            };

            Set.prototype.map = function map(mapping) {
                var mapped = new Set();
                for (var _iterator5 = this, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
                    var _ref5;

                    if (_isArray5) {
                        if (_i5 >= _iterator5.length) break;
                        _ref5 = _iterator5[_i5++];
                    } else {
                        _i5 = _iterator5.next();
                        if (_i5.done) break;
                        _ref5 = _i5.value;
                    }

                    var s = _ref5;

                    var q = mapping(s);
                    if (!q) return null;
                    mapped.add(q);
                }
                return mapped;
            };

            /** Adds the item if it wasn't there or removes it otherwise. */

            Set.prototype.xor = function xor(s) {
                if (this.has(s)) this.remove(s);else this.add(s);
            };

            Set.prototype.empty = function empty() {
                this.stones = [];
            };

            Set.prototype[Symbol.iterator] = function* () {
                for (var _iterator6 = this.stones, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
                    var _ref6;

                    if (_isArray6) {
                        if (_i6 >= _iterator6.length) break;
                        _ref6 = _iterator6[_i6++];
                    } else {
                        _i6 = _iterator6.next();
                        if (_i6.done) break;
                        _ref6 = _i6.value;
                    }

                    var s = _ref6;

                    yield s;
                }
            };

            _createClass(Set, [{
                key: "rect",
                get: function get() {
                    var r = 0;
                    for (var _iterator7 = this, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
                        var _ref7;

                        if (_isArray7) {
                            if (_i7 >= _iterator7.length) break;
                            _ref7 = _iterator7[_i7++];
                        } else {
                            _i7 = _iterator7.next();
                            if (_i7.done) break;
                            _ref7 = _i7.value;
                        }

                        var s = _ref7;

                        r = tsumego.block.join(r, tsumego.block.just(s));
                    }return r;
                }
            }, {
                key: "size",
                get: function get() {
                    return this.stones.length;
                }
            }]);

            return Set;
        })();

        stone.Set = Set;
    })(stone = tsumego.stone || (tsumego.stone = {}));
    tsumego.infdepth = 255; // only 8 bits available for storing the depth
    /**
     * If b(1), b(2), ... is the sequence of positions leading
     * to the current position and the sub tree (sub graph, actually)
     * of positions that proves the solution contains any of
     * b(i), then repd.get(solution) = i.
     */
    var repd = undefined;
    (function (repd_1) {
        repd_1.get = function (move) {
            return move >> 8 & 255;
        };
        repd_1.set = function (move, repd) {
            return move & ~0xFF00 | repd << 8;
        };
    })(repd = tsumego.repd || (tsumego.repd = {}));
    (function (stone) {
        var km = undefined;
        (function (km_1) {
            km_1.get = function (s) {
                return s << 3 >> 30;
            }; // the signed shift
            km_1.set = function (s, km) {
                return s & ~0x18000000 | (km & 3) << 27;
            };
        })(km = stone.km || (stone.km = {}));
    })(stone = tsumego.stone || (tsumego.stone = {}));
    (function (stone) {
        var label = undefined;
        (function (label_1) {
            /** W -> -1, B -> +1 */
            function color(label) {
                if (label == 'B') return +1;
                if (label == 'W') return -1;
                return 0;
            }
            label_1.color = color;
            /** -1 -> W, +1 -> B */
            function string(color) {
                if (color > 0) return 'B';
                if (color < 0) return 'W';
            }
            label_1.string = string;
        })(label = stone.label || (stone.label = {}));
    })(stone = tsumego.stone || (tsumego.stone = {}));
    (function (stone) {
        var n2s = function n2s(n) {
            return String.fromCharCode(n + 0x61);
        }; // 0 -> `a`, 3 -> `d`
        var s2n = function s2n(s) {
            return s.charCodeAt(0) - 0x61;
        }; // `d` -> 43 `a` -> 0
        /** e.g. W[ab], [ab], W[] */
        function toString(m) {
            var c = stone.color(m);

            var _stone$coords3 = stone.coords(m);

            var x = _stone$coords3[0];
            var y = _stone$coords3[1];

            var s = !stone.hascoords(m) ? '' : n2s(x) + n2s(y);
            var t = stone.label.string(c) || '';
            var _nr = repd.get(m);
            return t + '[' + s + ']' + (_nr ? ' depth=' + _nr : '');
        }
        stone.toString = toString;
        function fromString(s) {
            if (s == 'B' || s == 'B[]') return stone.nocoords(+1);
            if (s == 'W' || s == 'W[]') return stone.nocoords(-1);
            if (!/^[BW]\[[a-z]{2}\]|[a-z]{2}$/.test(s)) return 0;
            var c = ({ B: +1, W: -1 })[s[0]] || 0;
            if (c) s = s.slice(2);
            var x = s2n(s[0]);
            var y = s2n(s[1]);
            return stone.make(x, y, c);
        }
        stone.fromString = fromString;
        var list = undefined;
        (function (list) {
            list.toString = function (x) {
                return '[' + x.map(stone.toString).join(',') + ']';
            };
        })(list = stone.list || (stone.list = {}));
    })(stone = tsumego.stone || (tsumego.stone = {}));
    (function (stone) {
        var cc = undefined;
        (function (cc) {
            /** 0x25 -> "E2" */
            function toString(s, boardSize) {
                var x = stone.x(s);
                var y = stone.y(s);
                var xs = String.fromCharCode('A'.charCodeAt(0) + (x < 8 ? x : x + 1)); // skip the I letter
                var ys = boardSize - y + '';
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
            for (var i = 0; i < 624; i++) {
                var _y = m[i] & 0x80000000 | m[(i + 1) % 624] & 0x7fffffff;
                m[i] = m[(i + 397) % 624] ^ _y >> 1;
                if (_y & 1) m[i] = m[i] ^ 0x9908b0df;
            }
            s = 0;
        }
        var y = m[s++];
        y ^= y >>> 11;
        y ^= y << 7 & 2636928640;
        y ^= y << 15 & 4022730752;
        y ^= y >>> 18;
        return y;
    }
    tsumego.rand = rand;
    (function (rand) {
        /**
         * By default it's initialized to Date.now(), but
         * can be changed to something else before using
         * the solver.
         */
        function seed(value) {
            s = 624;
            m = [value];
            for (var i = 1; i < 624; i++) {
                m[i] = (m[i - 1] ^ m[i - 1] >> 30) + i | 0;
            }
        }
        rand.seed = seed;
        seed(0);
    })(rand = tsumego.rand || (tsumego.rand = {}));
    /** Returns a random number in the 0..1 range. */
    tsumego.random = function () {
        return Math.abs(rand() / 0x80000000);
    };
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var profile;
    (function (profile) {
        profile.enabled = true;
        profile.now = typeof performance === 'undefined' ? function () {
            return Date.now();
        } : function () {
            return performance.now();
        };
        var timers = {};
        var counters = {};
        var distributions = {};
        function reset() {
            for (var _name2 in timers) {
                timers[_name2] = 0;
            }profile.started = profile.now();
        }
        profile.reset = reset;
        function log() {
            if (profile.started >= 0) {
                var total = profile.now() - profile.started;
                console.log("Total: " + (total / 1000).toFixed(2) + "s");
                for (var _name3 in timers) {
                    console.log(_name3 + ": " + (timers[_name3] / total * 100 | 0) + "%");
                }
            }
            if (Object.keys(counters).length > 0) {
                console.log('counters:');
                for (var _name4 in counters) {
                    console.log("  " + _name4 + ": " + counters[_name4]);
                }
            }
            if (Object.keys(distributions).length > 0) {
                console.log('distributions:');
                for (var _name5 in distributions) {
                    var d = distributions[_name5];
                    var n = d.length;
                    var lb = undefined,
                        rb = undefined,
                        min = undefined,
                        max = undefined,
                        sum = 0;
                    for (var i = 0; i < n; i++) {
                        if (d[i] === undefined) continue;
                        rb = i;
                        if (lb === undefined) lb = i;
                        if (min === undefined || d[i] < min) min = d[i];
                        if (max === undefined || d[i] > max) max = d[i];
                        sum += d[i];
                    }
                    console.log("  " + _name5 + ":");
                    for (var i = lb; i <= rb; i++) {
                        if (d[i] !== undefined) console.log("    " + i + ": " + d[i] + " = " + (d[i] / sum * 100 | 0) + "%");
                    }
                }
            }
        }
        profile.log = log;
        function _time(name, fn) {
            if (!profile.enabled) return fn;
            timers[name] = 0;
            return function () {
                var started = profile.now();
                try {
                    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        args[_key2] = arguments[_key2];
                    }

                    return fn.apply(this, args);
                } finally {
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

        var Counter = (function () {
            function Counter(name) {
                _classCallCheck(this, Counter);

                this.name = name;
                counters[name] = 0;
            }

            Counter.prototype.inc = function inc() {
                var n = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

                counters[this.name] += n;
            };

            return Counter;
        })();

        profile.Counter = Counter;

        var Distribution = (function () {
            function Distribution(name) {
                _classCallCheck(this, Distribution);

                this.d = distributions[name] = [];
            }

            Distribution.prototype.inc = function inc(value) {
                var n = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

                this.d[value] = (this.d[value] | 0) + n;
            };

            return Distribution;
        })();

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
        var Pattern = (function () {
            function Pattern(_exec) {
                _classCallCheck(this, Pattern);

                this._exec = _exec;
            }

            Pattern.prototype.exec = function exec(str, pos) {
                var r = this._exec(str, pos || 0);
                if (typeof pos === 'number') return r;
                if (r && r[1] == str.length) return r[0];
                return null;
            };

            Pattern.prototype.map = function map(fn) {
                var _this = this;

                return new Pattern(function (str, pos) {
                    var r = _this.exec(str, pos);
                    return r ? [fn(r[0]), r[1]] : null;
                });
            };

            Pattern.prototype.take = function take(i) {
                return this.map(function (r) {
                    return r[i];
                });
            };

            Pattern.prototype.slice = function slice(from, to) {
                return this.map(function (r) {
                    return r.slice(from, to);
                });
            };

            /** [["A", 1], ["B", 2]] -> { A: 1, B: 2 } */

            Pattern.prototype.fold = function fold(keyName, valName) {
                var merge = arguments.length <= 2 || arguments[2] === undefined ? function (a, b) {
                    return b;
                } : arguments[2];

                return this.map(function (r) {
                    var m = {};
                    for (var _iterator8 = r, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
                        var _ref8;

                        if (_isArray8) {
                            if (_i8 >= _iterator8.length) break;
                            _ref8 = _iterator8[_i8++];
                        } else {
                            _i8 = _iterator8.next();
                            if (_i8.done) break;
                            _ref8 = _i8.value;
                        }

                        var p = _ref8;

                        var k = p[keyName];
                        var v = p[valName];
                        m[k] = merge(m[k], v);
                    }
                    return m;
                });
            };

            Pattern.prototype.rep = function rep() {
                var _this2 = this;

                var min = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                return new Pattern(function (str, pos) {
                    var res = [];
                    var r = undefined;
                    while (r = _this2.exec(str, pos)) {
                        res.push(r[0]);
                        pos = r[1];
                    }
                    return res.length >= min ? [res, pos] : null;
                });
            };

            return Pattern;
        })();

        LL.Pattern = Pattern;
        LL.rgx = function (r) {
            return new Pattern(function (str, pos) {
                var m = r.exec(str.slice(pos));
                return m && m.index == 0 ? [m[0], pos + m[0].length] : null;
            });
        };
        LL.txt = function (s) {
            return new Pattern(function (str, pos) {
                return str.slice(pos, pos + s.length) == s ? [s, pos + s.length] : null;
            });
        };
        function seq() {
            for (var _len3 = arguments.length, ps = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                ps[_key3] = arguments[_key3];
            }

            return new Pattern(function (str, pos) {
                var res = [];
                for (var _iterator9 = ps, _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
                    var _ref9;

                    if (_isArray9) {
                        if (_i9 >= _iterator9.length) break;
                        _ref9 = _iterator9[_i9++];
                    } else {
                        _i9 = _iterator9.next();
                        if (_i9.done) break;
                        _ref9 = _i9.value;
                    }

                    var p = _ref9;

                    var r = p.exec(str, pos);
                    if (!r) return null;
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
        var _tsumego$LL = tsumego.LL;
        var txt = _tsumego$LL.txt;
        var rgx = _tsumego$LL.rgx;
        var seq = _tsumego$LL.seq;

        var Pattern = tsumego.LL.Pattern;
        /**
         * EBNF rules:
         *
         *      val     = "[" ... "]"
         *      tag     = 1*("A".."Z") 0*val
         *      step    = ";" 0*tag
         *      sgf     = "(" 0*stp 0*sgf ")"
         */
        var pattern = (function () {
            var val = rgx(/\s*\[[^\]]*?\]/).map(function (s) {
                return s.trim().slice(+1, -1);
            });
            var tag = seq(rgx(/\s*\w+/).map(function (s) {
                return s.trim();
            }), val.rep());
            var step = seq(rgx(/\s*;/), tag.rep()).take(1).fold(0, 1, function (a, b) {
                return (a || []).concat(b);
            });
            var sgf_fwd = new Pattern(function (s, i) {
                return sgf.exec(s, i);
            });
            var sgf = seq(rgx(/\s*\(\s*/), step.rep(), sgf_fwd.rep(), rgx(/\s*\)\s*/)).map(function (r) {
                return new Node(r[1], r[2]);
            });
            return sgf;
        })();

        var Node = (function () {
            function Node(steps, vars) {
                _classCallCheck(this, Node);

                this.steps = steps;
                this.vars = vars;
            }

            Node.prototype.get = function get(tag) {
                return this.steps[0][tag];
            };

            return Node;
        })();

        SGF.Node = Node;
        // decorators break the source-map-support tool
        Object.defineProperty(Node.prototype, 'get', {
            enumerable: false
        });
        SGF.parse = function (source) {
            return pattern.exec(source);
        };
    })(SGF = tsumego.SGF || (tsumego.SGF = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var Stack = (function () {
        function Stack() {
            _classCallCheck(this, Stack);

            this.items = [];
            this.length = 0;
        }

        Stack.prototype.push = function push(item) {
            this.items[this.length++] = item;
        };

        Stack.prototype.pop = function pop() {
            return this.length > 0 ? this.items[--this.length] : null;
        };

        Stack.prototype[Symbol.iterator] = function* () {
            for (var i = 0; i < this.length; i++) {
                yield this.items[i];
            }
        };

        return Stack;
    })();

    tsumego.Stack = Stack;
})(tsumego || (tsumego = {}));
/// <reference path="utils.ts" />
/// <reference path="stone.ts" />
/// <reference path="rand.ts" />
/// <reference path="prof.ts" />
/// <reference path="sgf.ts" />
/// <reference path="stack.ts" />
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
    var block = undefined;
    (function (block) {})(block = tsumego.block || (tsumego.block = {}));
    (function (block) {
        function make(xmin, xmax, ymin, ymax, libs, size, color) {
            return xmin | xmax << 4 | ymin << 8 | ymax << 12 | libs << 16 | size << 24 | color & 0x80000000;
        }
        block.make = make;
        block.xmin = function (b) {
            return b & 15;
        };
        block.xmax = function (b) {
            return b >> 4 & 15;
        };
        block.ymin = function (b) {
            return b >> 8 & 15;
        };
        block.ymax = function (b) {
            return b >> 12 & 15;
        };
        block.dims = function (b) {
            return [block.xmin(b), block.xmax(b), block.ymin(b), block.ymax(b)];
        };
        block.libs = function (b) {
            return b >> 16 & 255;
        };
        block.size = function (b) {
            return b >> 24 & 127;
        };
        /** block.join(0, r) returns r */
        block.join = function (b1, b2) {
            return !b1 ? b2 : block.make(tsumego.min(block.xmin(b1), block.xmin(b2)), tsumego.max(block.xmax(b1), block.xmax(b2)), tsumego.min(block.ymin(b1), block.ymin(b2)), tsumego.max(block.ymax(b1), block.ymax(b2)), 0, 0, 0);
        };
        /** returns a 1 x 1 block */
        block.just = function (s) {
            var x = tsumego.stone.x(s);
            var y = tsumego.stone.y(s);
            return block.make(x, x, y, y, 0, 0, s);
        };
        /** A pseudo block descriptor with 1 liberty. */
        block.lib1 = block.make(0, 0, 0, 0, 1, 0, 0);
        /** Useful when debugging. */
        block.toString = function (b) {
            return !b ? null : (b > 0 ? '+' : '-') + '[' + block.xmin(b) + ', ' + block.xmax(b) + ']x' + '[' + block.ymin(b) + ', ' + block.ymax(b) + '] ' + 'libs=' + block.libs(b) + ' ' + 'size=' + block.size(b);
        };
    })(block = tsumego.block || (tsumego.block = {}));
    /**
     * A square board with size up to 16x16.
     *
     * The board's internal representation supports
     * very fast play(x, y, color) and undo() operations.
     */

    var Board = (function () {
        function Board(size, setup) {
            _classCallCheck(this, Board);

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
            this._area = tsumego.sequence(256, function () {
                return 0;
            });
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
            if (typeof size === 'string' || typeof size === 'object') this.initFromSGF(size, setup);else if (typeof size === 'number') {
                this.init(size);
                if (setup instanceof Array) this.initFromTXT(setup);
            }
        }

        /**
         * The 32 bit hash of the board. It's efficiently
         * recomputed after each move.
         */

        Board.prototype.init = function init(size) {
            if (size > 16) throw Error("Board " + size + "x" + size + " is too big. Up to 16x16 boards are supported.");
            this.size = size;
            this.table = tsumego.sequence(256, function () {
                return 0;
            });
            this.drop();
        };

        Board.prototype.initFromTXT = function initFromTXT(rows) {
            var _this3 = this;

            rows.map(function (row, y) {
                row.replace(/\s/g, '').split('').map(function (chr, x) {
                    var c = chr == 'X' ? +1 : chr == 'O' ? -1 : 0;
                    if (c && !_this3.play(tsumego.stone.make(x, y, c))) throw new Error('Invalid setup.');
                });
            });
            this.drop();
        };

        Board.prototype.initFromSGF = function initFromSGF(source, nvar) {
            var _this4 = this;

            var sgf = typeof source === 'string' ? tsumego.SGF.parse(source) : source;
            if (!sgf) throw new SyntaxError('Invalid SGF: ' + source);
            var setup = sgf.steps[0]; // ;FF[4]SZ[19]...
            var size = +setup['SZ'];
            if (!size) throw SyntaxError('SZ[n] tag must specify the size of the board.');
            this.init(size);
            var place = function place(stones, tag) {
                if (!stones) return;
                for (var _iterator10 = stones, _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
                    var _ref10;

                    if (_isArray10) {
                        if (_i10 >= _iterator10.length) break;
                        _ref10 = _iterator10[_i10++];
                    } else {
                        _i10 = _iterator10.next();
                        if (_i10.done) break;
                        _ref10 = _i10.value;
                    }

                    var xy = _ref10;

                    var s = tag + '[' + xy + ']';
                    if (!_this4.play(tsumego.stone.fromString(s))) throw new Error(s + ' cannot be added.');
                }
            };
            function placevar(node) {
                place(node.steps[0]['AW'], 'W');
                place(node.steps[0]['AB'], 'B');
            }
            placevar(sgf);
            if (nvar) placevar(sgf.vars[nvar - 1]);
            this.drop();
        };

        /** Drops the history of moves. */

        Board.prototype.drop = function drop() {
            this.history = {
                added: new tsumego.Stack(),
                hashes: new tsumego.Stack(),
                changed: new tsumego.Stack()
            };
            for (var i = 0; i < 256; i++) {
                this.table[i] = this.lift(this.table[i]);
            }this._redo_data = null;
            this._redo_hist = 0;
        };

        /**
         * Clones the board and without the history of moves.
         * It essentially creates a shallow copy of the board.
         */

        Board.prototype.fork = function fork() {
            var b = new Board(0);
            b.size = this.size;
            b.hash_b = this.hash_b;
            b.hash_w = this.hash_w;
            b.blocks = this.blocks.slice(0);
            for (var i = 0; i < 256; i++) {
                b.table[i] = this.table[i];
            }b.drop();
            return b;
        };

        Board.prototype.get = function get(x, y) {
            if (y === void 0) {
                if (!tsumego.stone.hascoords(x)) return 0;

                var _tsumego$stone$coords = tsumego.stone.coords(x);

                x = _tsumego$stone$coords[0];
                y = _tsumego$stone$coords[1];
            }
            return this.blocks[this.getBlockId(x, y)];
        };

        Board.prototype.lift = function lift(id) {
            var bd = undefined;
            while (id && !block.size(bd = this.blocks[id])) id = block.libs(bd);
            return id;
        };

        /**
         * Returns block id or zero.
         * The block data can be read from blocks[id].
         */

        Board.prototype.getBlockId = function getBlockId(x, y) {
            if (!this._inBounds(x, y)) return 0;
            return this.lift(this.table[y << 4 | x]);
        };

        /**
         * Returns the four neighbors of the stone
         * in the [L, R, T, B] format.
         */

        Board.prototype.getNbBlockIds = function getNbBlockIds(x, y) {
            return [this.getBlockId(x - 1, y), this.getBlockId(x + 1, y), this.getBlockId(x, y - 1), this.getBlockId(x, y + 1)];
        };

        /**
         * Adjusts libs of the four neighboring blocks
         * of the given color by the given quantity.
         */

        Board.prototype.adjust = function adjust(x, y, color, quantity) {
            var neighbors = this.getNbBlockIds(x, y);
            next: for (var i = 0; i < 4; i++) {
                var id = neighbors[i];
                var bd = this.blocks[id];
                if (bd * color <= 0) continue;
                for (var j = 0; j < i; j++) {
                    if (neighbors[j] == id) continue next;
                }this.change(id, bd + quantity * block.lib1);
            }
        };

        /**
         * emoves ablock from the board and adjusts
         * the number of liberties of affected blocks.
         */

        Board.prototype.remove = function remove(id) {
            var bd = this.blocks[id];

            var _block$dims = block.dims(bd);

            var xmin = _block$dims[0];
            var xmax = _block$dims[1];
            var ymin = _block$dims[2];
            var ymax = _block$dims[3];

            for (var y = ymin; y <= ymax; y++) {
                for (var x = xmin; x <= xmax; x++) {
                    if (this.getBlockId(x, y) == id) {
                        if (bd > 0) this.hash_b ^= this.hasht_b[y << 4 | x];else this.hash_w ^= this.hasht_w[y << 4 | x];
                        this.adjust(x, y, -bd, +1);
                    }
                }
            }
            this.change(id, 0);
        };

        /**
         * Changes the block descriptor and makes
         * an appropriate record in the history.
         */

        Board.prototype.change = function change(id, bd) {
            // adding a new block corresponds to a change from
            // blocks[blocks.length - 1] -> b
            this.history.changed.push(id);
            this.history.changed.push(id < this.blocks.length ? this.blocks[id] : 0);
            this.blocks[id] = bd;
        };

        Board.prototype.inBounds = function inBounds(x, y) {
            if (y === void 0) {
                if (!tsumego.stone.hascoords(x)) return false;

                var _tsumego$stone$coords2 = tsumego.stone.coords(x);

                x = _tsumego$stone$coords2[0];
                y = _tsumego$stone$coords2[1];
            }
            return this._inBounds(x, y);
        };

        Board.prototype._inBounds = function _inBounds(x, y) {
            var n = this.size;
            return x >= 0 && x < n && y >= 0 && y < n;
        };

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

        Board.prototype.play = function play(move) {
            if (this._redo_data && this._redo_hist == this.history.added.length) {
                var nres = this.redo(move);
                if (nres) return nres;
            } else {
                this._redo_data = null;
            }
            var color = tsumego.stone.color(move);
            var x = tsumego.stone.x(move);
            var y = tsumego.stone.y(move);
            if (!color || !tsumego.stone.hascoords(move) || !this._inBounds(x, y) || this.getBlockId(x, y)) return 0;
            tsumego._n_play++;
            var size = this.size;
            var hash_b = this.hash_b;
            var hash_w = this.hash_w;
            var n_changed = this.history.changed.length / 2; // id1, bd1, id2, bd2, ...
            var ids = this.getNbBlockIds(x, y);
            var nbs = [0, 0, 0, 0];
            var lib = [0, 0, 0, 0];
            for (var i = 0; i < 4; i++) {
                nbs[i] = this.blocks[ids[i]];
                lib[i] = block.libs(nbs[i]);
            }
            // remove captured blocks           
            var result = 0;
            fstr: for (var i = 0; i < 4; i++) {
                for (var j = 0; j < i; j++) {
                    // check if that block is already removed
                    if (ids[j] == ids[i]) continue fstr;
                }if (lib[i] == 1 && color * nbs[i] < 0) {
                    this.remove(ids[i]);
                    result += block.size(nbs[i]);
                    // the removed block may have occupied
                    // several liberties of the stone
                    for (var j = 0; j < 4; j++) {
                        if (ids[j] == ids[i]) lib[j] = nbs[j] = 0;
                    }
                }
            }
            // if nothing has been captured...
            if (result == 0) {
                var isll =
                /* L */(nbs[0] * color < 0 || lib[0] == 1 || x == 0) && (
                /* R */nbs[1] * color < 0 || lib[1] == 1 || x == size - 1) && (
                /* T */nbs[2] * color < 0 || lib[2] == 1 || y == 0) && (
                /* B */nbs[3] * color < 0 || lib[3] == 1 || y == size - 1);
                // suicide is not allowed
                if (isll) return 0;
            }
            // take away a lib of every neighboring enemy group
            this.adjust(x, y, -color, -1);
            // new group id = min of neighboring group ids
            var id_new = this.blocks.length;
            var is_new = true;
            for (var i = 0; i < 4; i++) {
                if (nbs[i] * color > 0 && ids[i] < id_new) {
                    id_new = ids[i];
                    is_new = false;
                }
            }
            var id_old = this.table[y << 4 | x];
            this.table[y << 4 | x] = id_new;
            if (color > 0) this.hash_b ^= this.hasht_b[y << 4 | x];else this.hash_w ^= this.hasht_w[y << 4 | x];
            if (is_new) {
                // create a new block if the new stone has no neighbors
                if (id_new > 255) throw Error('Too many blocks: ' + id_new);
                var n =
                /* L */(0 == nbs[0] && x > 0 ? 1 : 0) + (
                /* R */0 == nbs[1] && x < size - 1 ? 1 : 0) + (
                /* T */0 == nbs[2] && y > 0 ? 1 : 0) + (
                /* B */0 == nbs[3] && y < size - 1 ? 1 : 0);
                this.change(id_new, block.make(x, x, y, y, n, 1, color));
            } else {
                // merge neighbors into one block
                var fids = [id_new];
                for (var i = 0; i < 4; i++) {
                    if (nbs[i] * color > 0 && ids[i] != id_new) fids.push(ids[i]);
                }var size_new = 1;
                var xmin_new = x;
                var xmax_new = x;
                var ymin_new = y;
                var ymax_new = y;
                for (var i = 0; i < fids.length; i++) {
                    var id = fids[i];
                    var bd = this.blocks[id];
                    size_new += block.size(bd);
                    var xmin = block.xmin(bd);
                    var xmax = block.xmax(bd);
                    var ymin = block.ymin(bd);
                    var ymax = block.ymax(bd);
                    xmin_new = tsumego.min(xmin_new, xmin);
                    ymin_new = tsumego.min(ymin_new, ymin);
                    xmax_new = tsumego.max(xmax_new, xmax);
                    ymax_new = tsumego.max(ymax_new, ymax);
                    // make the merged block point to the new block
                    if (id != id_new) this.change(id, block.make(0, 0, 0, 0, id_new, 0, 0));
                }
                // libs need to be counted in the rectangle extended by 1 intersection
                var libs_new = 0;
                var xmin_1 = tsumego.max(xmin_new - 1, 0);
                var ymin_1 = tsumego.max(ymin_new - 1, 0);
                var xmax_1 = tsumego.min(xmax_new + 1, size - 1);
                var ymax_1 = tsumego.min(ymax_new + 1, size - 1);
                var area = this._area;
                for (var _y2 = ymin_1; _y2 <= ymax_1; _y2++) {
                    for (var _x6 = xmin_1; _x6 <= xmax_1; _x6++) {
                        area[_x6 | _y2 << 4] = this.lift(this.table[_x6 | _y2 << 4]);
                    }
                }for (var _y3 = ymin_1; _y3 <= ymax_1; _y3++) {
                    for (var _x7 = xmin_1; _x7 <= xmax_1; _x7++) {
                        if (area[_x7 | _y3 << 4]) continue;
                        var is_lib = _x7 > xmin_1 && area[_x7 - 1 | _y3 << 4] == id_new || _y3 > ymin_1 && area[_x7 | _y3 - 1 << 4] == id_new || _x7 < xmax_1 && area[_x7 + 1 | _y3 << 4] == id_new || _y3 < ymax_1 && area[_x7 | _y3 + 1 << 4] == id_new;
                        if (is_lib) libs_new++;
                    }
                }
                this.change(id_new, block.make(xmin_new, xmax_new, ymin_new, ymax_new, libs_new, size_new, color));
            }
            this.history.added.push(x | y << 4 | this.history.changed.length / 2 - n_changed << 8 | id_old << 16 | color & 0x80000000);
            this.history.hashes.push(hash_b);
            this.history.hashes.push(hash_w);
            return result + 1;
        };

        /**
         * Reverts the last move by restoring the original
         * block id in table[y * size + x] and by reverting
         * original values of block descriptors.
         *
         * Returns the restored move or zero. The returned
         * move can be given to .play to redo the position.
         */

        Board.prototype.undo = function undo() {
            var move = this.history.added.pop();
            if (!move) return 0;
            var x = move & 15;
            var y = move >> 4 & 15;
            var k = y << 4 | x;
            var c = move & 0x80000000 ? -1 : +1;
            var n = move >> 8 & 255;
            var b = move >> 16 & 255;
            var next = {
                hash_b: this.hash_b,
                hash_w: this.hash_w,
                cell: this.table[k],
                list: []
            };
            this.table[k] = b;
            this.hash_w = this.history.hashes.pop();
            this.hash_b = this.history.hashes.pop();
            for (var i = 0; i < n; i++) {
                var bd = this.history.changed.pop();
                var id = this.history.changed.pop();
                next.list.push(id, this.blocks[id]);
                // when a new block is added, the corresponding
                // record in the history looks like changing
                // the last block from 0 to something;; to undo
                // this properly, the last element in the array
                // needs to be removed as well
                if (id == this.blocks.length - 1 && !bd) this.blocks.pop();else this.blocks[id] = bd;
            }
            var rh = this.history.added.length;
            if (!this._redo_data || this._redo_hist != rh) {
                this._redo_data = [];
                this._redo_hist = rh;
            }
            this._redo_data[x | y << 4 | c & 256] = next;
            return tsumego.stone.make(x, y, c);
        };

        /**
         * Quickly replays a move if it has been played and undone.
         * About 47% of calls to play(...) are handled here, however
         * this makes the solver only 1.18x faster, perhaps due to
         * the need to support the redo cache. The redo(...) itself
         * spends only 9% of the time, while play(...) spends 44%.
         */

        Board.prototype.redo = function redo(move) {
            var _tsumego$stone$coords3 = tsumego.stone.coords(move);

            var x = _tsumego$stone$coords3[0];
            var y = _tsumego$stone$coords3[1];

            var k = y << 4 | x;
            var c = move > 0 ? +1 : -1;
            var next = this._redo_data[x | y << 4 | c & 256];
            if (!next) return 0;
            tsumego._n_redo++;
            this.history.hashes.push(this.hash_b);
            this.history.hashes.push(this.hash_w);
            this.history.added.push(x | y << 4 | next.list.length / 2 << 8 | this.table[k] << 16 | c & 0x80000000);
            this.hash_b = next.hash_b;
            this.hash_w = next.hash_w;
            this.table[k] = next.cell;
            var nres = 0;
            for (var i = next.list.length - 2; i >= 0; i -= 2) {
                var id = next.list[i];
                var bd = next.list[i + 1];
                if (!bd) nres += block.size(this.blocks[id]);
                this.history.changed.push(id);
                this.history.changed.push(this.blocks[id]);
                this.blocks[id] = bd;
            }
            return nres + 1;
        };

        Board.prototype.rect = function rect(color) {
            var rect = 0;
            for (var i = 0; i < this.blocks.length; i++) {
                var b = this.blocks[i];
                if (!block.size(b)) continue;
                if (b * color >= 0) rect = block.join(rect, b);
            }
            return rect;
        };

        Board.prototype.getRemovedBlocks = function getRemovedBlocks() {
            var moves = this.history.added;
            var blocks = this.history.changed;
            var move = moves[moves.length - 1];
            var n = move >> 8 & 255;
            var removed = [];
            for (var i = 0; i < n; i++) {
                var id = blocks[blocks.length - i * 2];
                var bd = blocks[blocks.length - i * 2 + 1];
                if (bd && !this.blocks[id]) removed.push(bd);
            }
            return removed;
        };

        Board.prototype.range = function range() {
            var color = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            var stones = [];
            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    stones.push(tsumego.stone.make(x, y, color));
                }
            }return stones;
        };

        Board.prototype.toStringSGF = function toStringSGF() {
            var _this5 = this;

            var indent = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

            var take = function take(pf, fn) {
                var list = '';
                for (var y = 0; y < _this5.size; y++) {
                    for (var x = 0; x < _this5.size; x++) {
                        if (fn(_this5.get(x, y))) list += tsumego.stone.toString(tsumego.stone.make(x, y, +1)).slice(1);
                    }
                }return list && indent + pf + list;
            };
            return '(;FF[4]SZ[' + this.size + ']' + take('AB', function (c) {
                return c > 0;
            }) + take('AW', function (c) {
                return c < 0;
            }) + ')';
        };

        Board.prototype.toStringTXT = function toStringTXT() {
            var mode = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

            var hideLabels = /L-/.test(mode);
            var showLibsNum = /R/.test(mode);
            var xmax = 0,
                ymax = 0,
                s = '';
            for (var x = 0; x < this.size; x++) {
                for (var y = 0; y < this.size; y++) {
                    if (this.get(x, y)) xmax = tsumego.max(x, xmax), ymax = tsumego.max(y, ymax);
                }
            }if (!hideLabels) {
                s += ' ';
                for (var x = 0; x <= xmax; x++) {
                    s += ' ' + tsumego.stone.toString(tsumego.stone.make(x, 0, 0))[1];
                }
            }
            for (var y = 0; y <= ymax; y++) {
                if (s) s += '\n';
                if (!hideLabels) s += tsumego.stone.toString(tsumego.stone.make(0, y, 0))[2];
                for (var x = 0; x <= xmax; x++) {
                    var b = this.get(x, y);
                    s += ' ';
                    s += showLibsNum ? block.libs(b) : b > 0 ? 'X' : b < 0 ? 'O' : '-';
                }
            }
            return s;
        };

        Board.prototype.toString = function toString(mode) {
            return mode == 'SGF' ? this.toStringSGF() : this.toStringTXT(mode);
        };

        /**
         * stones() lists all the stones on the board
         * stones(b) lists only stones that belong to block b
         * stones(0) returns an ampty list
         * stones(+1) returns all black stones
         * stones(-1) returns all white stones
         */

        Board.prototype.stones = function* stones(t) {
            var all = t === undefined;
            if (!all && !t) return;

            var _ref44 = all || t == tsumego.color.black || t == tsumego.color.white ? [0, this.size - 1, 0, this.size - 1] : block.dims(t);

            var xmin = _ref44[0];
            var xmax = _ref44[1];
            var ymin = _ref44[2];
            var ymax = _ref44[3];

            for (var x = xmin; x <= xmax; x++) {
                for (var y = ymin; y <= ymax; y++) {
                    var b = this.get(x, y);
                    if (all ? b != 0 : t == +1 ? b > 0 : t == -1 ? b < 0 : b == t) yield tsumego.stone.make(x, y, b);
                }
            }
        };

        /** Checks if (x, y) is a liberty of block b. */

        Board.prototype.isLibertyOf = function isLibertyOf(x, y, b) {
            return this.get(x - 1, y) == b || this.get(x + 1, y) == b || this.get(x, y - 1) == b || this.get(x, y + 1) == b;
        };

        /**
         * for (const [x, y] of board.libs(block))
         *      console.log("a liberty of the block", x, y);
         */

        Board.prototype.libs = function* libs(b) {
            for (var _iterator11 = this.edge(b), _isArray11 = Array.isArray(_iterator11), _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
                var _ref11;

                if (_isArray11) {
                    if (_i11 >= _iterator11.length) break;
                    _ref11 = _iterator11[_i11++];
                } else {
                    _i11 = _iterator11.next();
                    if (_i11.done) break;
                    _ref11 = _i11.value;
                }

                var _ref112 = _ref11;
                var x = _ref112[0];
                var y = _ref112[1];

                if (!this.get(x, y)) yield [x, y];
            }
        };

        /** All cells adjacent to the block: empty and occupied by the opponent. */

        Board.prototype.edge = function* edge(b) {
            if (!b) return;

            var _block$dims2 = block.dims(b);

            var xmin = _block$dims2[0];
            var xmax = _block$dims2[1];
            var ymin = _block$dims2[2];
            var ymax = _block$dims2[3];

            if (xmin > 0) xmin--;
            if (ymin > 0) ymin--;
            if (xmax < this.size - 1) xmax++;
            if (ymax < this.size - 1) ymax++;
            for (var x = xmin; x <= xmax; x++) {
                for (var y = ymin; y <= ymax; y++) {
                    if (this.get(x, y) * b > 0) continue;
                    var isLib = this.inBounds(x - 1, y) && this.get(x - 1, y) == b || this.inBounds(x, y - 1) && this.get(x, y - 1) == b || this.inBounds(x + 1, y) && this.get(x + 1, y) == b || this.inBounds(x, y + 1) && this.get(x, y + 1) == b;
                    if (isLib) yield [x, y];
                }
            }
        };

        Board.prototype.neighbors = function neighbors(x, y) {
            var nbs = [];
            if (this.inBounds(x - 1, y)) nbs.push([x - 1, y]);
            if (this.inBounds(x + 1, y)) nbs.push([x + 1, y]);
            if (this.inBounds(x, y - 1)) nbs.push([x, y - 1]);
            if (this.inBounds(x, y + 1)) nbs.push([x, y + 1]);
            return nbs;
        };

        Board.prototype.nblocks = function nblocks(color) {
            var n = 0;
            for (var i = 0; i < this.blocks.length; i++) {
                var b = this.blocks[i];
                if (b * color > 0 && block.size(b) > 0) n++;
            }
            return n;
        };

        Board.prototype.nstones = function nstones(color) {
            var n = 0;
            for (var i = 0; i < this.blocks.length; i++) {
                var b = this.blocks[i];
                if (b * color > 0) n += block.size(b);
            }
            return n;
        };

        Board.prototype.sumlibs = function sumlibs(color) {
            var n = 0;
            for (var i = 0; i < this.blocks.length; i++) {
                var b = this.blocks[i];
                if (b * color > 0 && block.size(b) > 0) n += block.libs(b);
            }
            return n;
        };

        Board.prototype.natari = function natari(color) {
            var n = 0;
            for (var i = 0; i < this.blocks.length; i++) {
                var b = this.blocks[i];
                if (b * color > 0 && block.size(b) > 0 && block.libs(b) == 1) n++;
            }
            return n;
        };

        Board.prototype.getBlockInfo = function getBlockInfo(x, y) {
            var b = this.get(x, y);
            return {
                color: tsumego.sign(b),
                libs: block.libs(b),
                size: block.size(b)
            };
        };

        /** the sequence of moves that was given to .play(...) to get this position */

        _createClass(Board, [{
            key: "hash",
            get: function get() {
                return this.hash_b & 0x0000FFFF | this.hash_w & 0xFFFF0000;
            }
        }, {
            key: "sgf",
            get: function get() {
                return this.toStringSGF();
            },
            set: function set(value) {
                this.initFromSGF(value);
            }
        }, {
            key: "text",
            get: function get() {
                return this.toStringTXT();
            },
            set: function set(value) {
                this.initFromTXT(value.split(/\r?\n/));
            }
        }, {
            key: "moves",
            get: function get() {
                var moves = [];
                for (var _iterator12 = this.history.added, _isArray12 = Array.isArray(_iterator12), _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
                    var _ref12;

                    if (_isArray12) {
                        if (_i12 >= _iterator12.length) break;
                        _ref12 = _iterator12[_i12++];
                    } else {
                        _i12 = _iterator12.next();
                        if (_i12.done) break;
                        _ref12 = _i12.value;
                    }

                    var x = _ref12;

                    moves.push(tsumego.stone.make(x & 15, x >> 4 & 15, x));
                }return moves;
            }
        }]);

        return Board;
    })();

    tsumego.Board = Board;
})(tsumego || (tsumego = {}));
/// <reference path="rand.ts" />
var tsumego;
(function (tsumego) {
    var linalg;
    (function (linalg) {
        var from = function from(n, f) {
            var a = new Array(n);
            for (var i = 0; i < n; i++) {
                a[i] = f(i);
            }return a;
        };
        var vector = undefined;
        (function (vector) {
            vector.zero = function (n) {
                return from(n, function () {
                    return 0;
                });
            };
            vector.make = function (n, f) {
                return from(n, f);
            };
            vector.dot = function (u, v) {
                var s = 0;
                for (var i = 0; i < u.length; i++) {
                    s += u[i] * v[i];
                }return s;
            };
            /** m[i][j] = u[i] * v[j] */
            vector.dyad = function (u, v) {
                return from(u.length, function (i) {
                    return from(v.length, function (j) {
                        return u[i] * v[j];
                    });
                });
            };
            /** w[i] = u[i] * v[i] */
            vector.dot2 = function (u, v) {
                return from(u.length, function (i) {
                    return u[i] * v[i];
                });
            };
            /** u + k * v */
            vector.sum = function (u, v) {
                var k = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
                return from(u.length, function (i) {
                    return u[i] + k * v[i];
                });
            };
        })(vector = linalg.vector || (linalg.vector = {}));
        var matrix = undefined;
        (function (matrix) {
            matrix.zero = function (rows, cols) {
                return from(rows, function () {
                    return vector.zero(cols);
                });
            };
            matrix.make = function (rows, cols, f) {
                return from(rows, function (r) {
                    return vector.make(cols, function (c) {
                        return f(r, c);
                    });
                });
            };
            /** m * v */
            matrix.mulv = function (m, v) {
                return from(m.length, function (i) {
                    return vector.dot(m[i], v);
                });
            };
            /** a + k * b */
            matrix.sum = function (a, b) {
                var k = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
                return from(a.length, function (i) {
                    return vector.sum(a[i], b[i], k);
                });
            };
            matrix.transpose = function (m) {
                return from(m[0].length, function (i) {
                    return from(m.length, function (j) {
                        return m[j][i];
                    });
                });
            };
        })(matrix = linalg.matrix || (linalg.matrix = {}));

        var BitMatrix = (function () {
            function BitMatrix(rows, cols, init) {
                _classCallCheck(this, BitMatrix);

                this.rows = rows;
                this.cols = cols;
                this.bits = 0;
                if (typeof init === 'number') {
                    this.bits = init;
                } else if (typeof init === 'function') {
                    for (var i = 0; i < rows; i++) {
                        for (var j = 0; j < cols; j++) {
                            this.set(i, j, init(i, j));
                        }
                    }
                }
            }

            BitMatrix.prototype.toString = function toString() {
                var s = '';
                for (var i = 0; i < this.rows; i++, s += '|') {
                    for (var j = 0; j < this.cols; j++) {
                        s += this.get(i, j) ? '#' : '-';
                    }
                }return s.slice(0, -1);
            };

            BitMatrix.prototype.get = function get(row, col) {
                var mask = this.mask(row, col);
                return !!(this.bits & mask);
            };

            BitMatrix.prototype.set = function set(row, col, bit) {
                var mask = this.mask(row, col);
                if (bit) this.bits |= mask;else this.bits &= ~mask;
            };

            /** transposition */

            BitMatrix.prototype.mask = function mask(row, col) {
                return 1 << row * this.cols + col;
            };

            _createClass(BitMatrix, [{
                key: "t",
                get: function get() {
                    var _this6 = this;

                    return new BitMatrix(this.cols, this.rows, function (i, j) {
                        return _this6.get(j, i);
                    });
                }

                /** counter clock wise rotation by 90 degrees */
            }, {
                key: "r",
                get: function get() {
                    var _this7 = this;

                    return new BitMatrix(this.cols, this.rows, function (i, j) {
                        return _this7.get(j, _this7.cols - i - 1);
                    });
                }

                /** horizontal reflection */
            }, {
                key: "h",
                get: function get() {
                    return this.r.t;
                }

                /** vertical reflection */
            }, {
                key: "v",
                get: function get() {
                    return this.t.r;
                }
            }]);

            return BitMatrix;
        })();

        linalg.BitMatrix = BitMatrix;
    })(linalg = tsumego.linalg || (tsumego.linalg = {}));
})(tsumego || (tsumego = {}));
/// <reference path="board.ts" />
/// <reference path="linalg.ts" />
var tsumego;
(function (tsumego) {
    var BitMatrix = tsumego.linalg.BitMatrix;
    var tags = undefined;
    (function (tags) {
        tags[tags["x"] = 0] = "x";
        tags[tags["o"] = 1] = "o";
        tags[tags["#"] = 2] = "#";
        tags[tags["-"] = 3] = "-";
        tags[tags["X"] = 4] = "X";
        tags[tags["O"] = 5] = "O";
        tags[tags["max"] = 6] = "max";
    })(tags || (tags = {}));
    var same = function same(m, b) {
        return (m.bits & b) === m.bits;
    };
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

    var Pattern = (function () {
        // the constructor can be very slow as every pattern
        // is constructed only once before the solver starts

        function Pattern(data) {
            _classCallCheck(this, Pattern);

            this.masks = [new Array()]; // 8 elements
            // m[0][t] = bitmask for tags[t]
            // m[t] = the t-th transform of m[0]
            var m = this.masks;
            for (var i = 0; i < tags.max; i++) {
                m[0].push(new BitMatrix(3, 3));
            }for (var row = 0; row < data.length; row++) {
                var line = data[row].replace(/\s/g, '');
                for (var col = 0; col < line.length; col++) {
                    var chr = line[col];
                    if (chr == '?') continue;
                    var tag = tags[chr];
                    if (tag === undefined) throw SyntaxError("Invalid char " + chr + " at " + row + ":" + col + " in [" + data.join(' | ') + "]");
                    var mask = m[0][tag];
                    if (mask) mask.set(row, col, true);
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
            for (var i = 0; i < 3; i++) {
                m.push(m[i].map(function (m) {
                    return m.r;
                }));
            }for (var i = 0; i < 4; i++) {
                m.push(m[i].map(function (m) {
                    return m.t;
                }));
            }
        }

        Pattern.take = function take(board, x0, y0, color, safe) {
            // constructing and disposing an array at every call
            // might look very inefficient, but getting rid of it
            // by declaring this array as a variable outside the
            // method doesn't improve performance at all in V8
            var m = [];
            for (var i = 0; i < tags.max; i++) {
                m.push(0);
            }for (var dy = 0; dy < 3; dy++) {
                for (var dx = 0; dx < 3; dx++) {
                    var x = x0 + dx - 1;
                    var y = y0 + dy - 1;
                    var c = board.get(x, y);
                    var s = tsumego.stone.make(x, y, c);
                    var b = 1 << 3 * dy + dx;
                    if (c * color > 0) {
                        // a stone of the same color
                        m[0] |= b;
                        // a safe stone of the same color
                        if (safe && safe(s)) m[4] |= b;
                    } else if (c * color < 0) {
                        // a stone of the opposite color
                        m[1] |= b;
                        // a safe stone of the same color
                        if (safe && safe(s)) m[5] |= b;
                    } else if (!board.inBounds(x, y)) {
                        // a neutral stone (the wall)
                        m[2] |= b;
                    } else {
                        // a vacant intersection
                        m[3] |= b;
                    }
                }
            }
            return m;
        };

        Pattern.prototype.test = function test(m) {
            // for .. of here makes the entires solver 1.12x slower
            search: for (var i = 0; i < 8; i++) {
                var w = this.masks[i];
                for (var j = 0; j < tags.max; j++) {
                    if (!same(w[j], m[j])) continue search;
                }return true;
            }
            return false;
        };

        return Pattern;
    })();

    tsumego.Pattern = Pattern;
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    // Filling in a own sure eye is not always a wrong move.
    // There is a curious example in which the only correct
    // move is to fill an own sure eye.
    //
    // Adrian B. Daniele, A Tsume-Go Life & Death Problem Solver
    // dspace.mit.edu/bitstream/handle/1721.1/50434/41567232-MIT.pdf
    //
    var patterns = [
    // a sure eye
    new tsumego.Pattern([' x x x ', ' x - x ', ' x x x ']),
    // a sure eye
    new tsumego.Pattern([' x x ? ', ' x - x ', ' x x x ']),
    // a sure eye
    new tsumego.Pattern([' x x x ', ' x - x ', ' # # # ']),
    // a sure eye
    new tsumego.Pattern([' x x # ', ' x - # ', ' # # # ']),
    // giving up a liberty
    new tsumego.Pattern([' O O O ', ' ? - - ', ' x x x ']),
    // giving up a liberty
    new tsumego.Pattern([' O O O ', ' O - - ', ' ? x x ']),
    // giving up a liberty
    new tsumego.Pattern([' ? O O ', ' x - - ', ' x x x ']),
    // giving up a liberty
    new tsumego.Pattern([' # O O ', ' # - - ', ' # x x ']),
    // giving up a liberty
    new tsumego.Pattern([' # # # ', ' # - x ', ' # O ? ']),
    // giving up a liberty
    new tsumego.Pattern([' # # # ', ' ? - O ', ' O O O '])];
    /**
     * Recognizes dumb moves that cannot possibly help.
     * For instance, filling in an own sure eye is a dumb move.
     */
    function isDumb(board, x, y, color, safe) {
        var snapshot = tsumego.Pattern.take(board, x, y, color, safe);
        for (var _iterator13 = patterns, _isArray13 = Array.isArray(_iterator13), _i13 = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator]();;) {
            var _ref13;

            if (_isArray13) {
                if (_i13 >= _iterator13.length) break;
                _ref13 = _iterator13[_i13++];
            } else {
                _i13 = _iterator13.next();
                if (_i13.done) break;
                _ref13 = _i13.value;
            }

            var p = _ref13;

            if (p.test(snapshot)) return true;
        }return false;
    }
    tsumego.isDumb = isDumb;
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var stat;
    (function (stat) {
        stat.nodes = 0;
        stat.logv.push(function () {
            return "evaluated nodes = " + (stat.nodes / 1e6).toFixed(1) + " M";
        });
    })(stat = tsumego.stat || (tsumego.stat = {}));
})(tsumego || (tsumego = {}));
(function (tsumego) {
    // this is something like the sigmoid function
    // to map values to [-1, +1] range, but it's
    // considerably faster; it's derivative is
    // dS / dx = (S / x)**2
    tsumego.sigmoid = function (x) {
        return x / (1 + tsumego.sign(x) * x);
    };
    /**
     * Evaluates chances to win for the current player.
     *
     * Returns a number in the [-1, +1] range:
     * +1 = the current player surely wins,
     * -1 = the current player surely loses.
     *
     */
    function evaluate(board, target) {
        var values = arguments.length <= 2 || arguments[2] === undefined ? new tsumego.HashMap() : arguments[2];

        // evaluates the node = (board, color) where color
        // tells who is about to play on this board
        return function _eval(color) {
            var t = board.get(target);
            var n = tsumego.block.libs(t);
            // if the target is in atari and it's the attacker's
            // turn to play, the target is surely captured
            if (!t || t * color < 0 && n < 2) return -tsumego.sign(t) * color;
            var hash_b = board.hash_b ^ color;
            var hash_w = board.hash_w ^ color;
            // it's surprising, that with this dumb moves ordering
            // and with the cached tt results, the 1-st move appears
            // correct in 98 % cases
            var v = values.get(hash_b, hash_w) || ++tsumego.stat.nodes &&
            // maximize the number of captured stones first
            +tsumego.sigmoid(board.nstones(color) - board.nstones(-color))
            // atari as many blocks of the opponent as possible
             + Math.pow(8, -1) * tsumego.sigmoid(board.natari(-color))
            // maximize/minimize the number of libs of the target
             + Math.pow(8, -2) * tsumego.sigmoid(n * color * tsumego.sign(t))
            // minimize the number of libs of all blocks of the opponent
             - Math.pow(8, -3) * tsumego.sigmoid(board.sumlibs(-color))
            // minimize the number of own blocks in atari
             - Math.pow(8, -4) * tsumego.sigmoid(board.natari(color))
            // maximize the number of own libs
             + Math.pow(8, -5) * tsumego.sigmoid(board.sumlibs(color));
            values.set(hash_b, hash_w, v);
            // abs(v) < 1 + 1/8 + 1/64 + ... = 8/7
            // v = �1 should indicate a sure loss/win
            return v / 2;
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
            var ts = board.get(target);
            var rzone = new tsumego.stone.Set();
            var same = function same(u, v) {
                return board.inBounds(u) && board.inBounds(v) && board.get(u) * ts >= 0 && board.get(v) * ts >= 0;
            };
            var neighbors = function neighbors(x) {
                return [].concat(tsumego.stone.diagonals(x), tsumego.stone.neighbors(x));
            };
            // get stones reachable with the 8 moves: direct + diagonal
            for (var _iterator14 = tsumego.region(target, same, neighbors), _isArray14 = Array.isArray(_iterator14), _i14 = 0, _iterator14 = _isArray14 ? _iterator14 : _iterator14[Symbol.iterator]();;) {
                var _ref14;

                if (_isArray14) {
                    if (_i14 >= _iterator14.length) break;
                    _ref14 = _iterator14[_i14++];
                } else {
                    _i14 = _iterator14.next();
                    if (_i14.done) break;
                    _ref14 = _i14.value;
                }

                var rs = _ref14;

                rs && rzone.add(rs);
            } // find blocks of the same color adjacent to rzone
            var adjacent = [];
            for (var _iterator15 = rzone, _isArray15 = Array.isArray(_iterator15), _i15 = 0, _iterator15 = _isArray15 ? _iterator15 : _iterator15[Symbol.iterator]();;) {
                var _ref15;

                if (_isArray15) {
                    if (_i15 >= _iterator15.length) break;
                    _ref15 = _iterator15[_i15++];
                } else {
                    _i15 = _iterator15.next();
                    if (_i15.done) break;
                    _ref15 = _i15.value;
                }

                var rs = _ref15;

                for (var _iterator16 = tsumego.stone.neighbors(rs), _isArray16 = Array.isArray(_iterator16), _i16 = 0, _iterator16 = _isArray16 ? _iterator16 : _iterator16[Symbol.iterator]();;) {
                    var _ref16;

                    if (_isArray16) {
                        if (_i16 >= _iterator16.length) break;
                        _ref16 = _iterator16[_i16++];
                    } else {
                        _i16 = _iterator16.next();
                        if (_i16.done) break;
                        _ref16 = _i16.value;
                    }

                    var ns = _ref16;

                    var b = board.get(ns);
                    if (b * ts < 0 && adjacent.indexOf(b) < 0) adjacent.push(b);
                }
            }
            // find blocks with all the libs in rzone
            var inner = [];
            var safeb = [];
            test: for (var _iterator17 = adjacent, _isArray17 = Array.isArray(_iterator17), _i17 = 0, _iterator17 = _isArray17 ? _iterator17 : _iterator17[Symbol.iterator]();;) {
                var _ref17;

                if (_isArray17) {
                    if (_i17 >= _iterator17.length) break;
                    _ref17 = _iterator17[_i17++];
                } else {
                    _i17 = _iterator17.next();
                    if (_i17.done) break;
                    _ref17 = _i17.value;
                }

                var b = _ref17;

                var n = 0;
                for (var _iterator18 = board.libs(b), _isArray18 = Array.isArray(_iterator18), _i18 = 0, _iterator18 = _isArray18 ? _iterator18 : _iterator18[Symbol.iterator]();;) {
                    var _ref18;

                    if (_isArray18) {
                        if (_i18 >= _iterator18.length) break;
                        _ref18 = _iterator18[_i18++];
                    } else {
                        _i18 = _iterator18.next();
                        if (_i18.done) break;
                        _ref18 = _i18.value;
                    }

                    var x = _ref18[0];
                    var y = _ref18[1];

                    if (!rzone.has(tsumego.stone.make(x, y, 0))) {
                        n++;
                        if (n > 1) {
                            // this block has libs outside the r-zone,
                            // so it won't be captured
                            for (var _iterator19 = board.stones(b), _isArray19 = Array.isArray(_iterator19), _i19 = 0, _iterator19 = _isArray19 ? _iterator19 : _iterator19[Symbol.iterator]();;) {
                                var _ref19;

                                if (_isArray19) {
                                    if (_i19 >= _iterator19.length) break;
                                    _ref19 = _iterator19[_i19++];
                                } else {
                                    _i19 = _iterator19.next();
                                    if (_i19.done) break;
                                    _ref19 = _i19.value;
                                }

                                var s = _ref19;

                                safeb.push(s);
                                break;
                            }
                            continue test;
                        }
                    }
                }
                inner.push(b);
            }
            if (safeb.length < 1) throw Error('There must be a safe outer wall.');
            // and add those blocks to the rzone as they may be captured
            for (var _iterator20 = inner, _isArray20 = Array.isArray(_iterator20), _i20 = 0, _iterator20 = _isArray20 ? _iterator20 : _iterator20[Symbol.iterator]();;) {
                var _ref20;

                if (_isArray20) {
                    if (_i20 >= _iterator20.length) break;
                    _ref20 = _iterator20[_i20++];
                } else {
                    _i20 = _iterator20.next();
                    if (_i20.done) break;
                    _ref20 = _i20.value;
                }

                var b = _ref20;

                for (var _iterator21 = board.stones(b), _isArray21 = Array.isArray(_iterator21), _i21 = 0, _iterator21 = _isArray21 ? _iterator21 : _iterator21[Symbol.iterator]();;) {
                    var _ref21;

                    if (_isArray21) {
                        if (_i21 >= _iterator21.length) break;
                        _ref21 = _iterator21[_i21++];
                    } else {
                        _i21 = _iterator21.next();
                        if (_i21.done) break;
                        _ref21 = _i21.value;
                    }

                    var s = _ref21;

                    rzone.add(tsumego.stone.make(tsumego.stone.x(s), tsumego.stone.y(s), 0));
                }for (var _iterator22 = board.libs(b), _isArray22 = Array.isArray(_iterator22), _i22 = 0, _iterator22 = _isArray22 ? _iterator22 : _iterator22[Symbol.iterator]();;) {
                    var _ref22;

                    if (_isArray22) {
                        if (_i22 >= _iterator22.length) break;
                        _ref22 = _iterator22[_i22++];
                    } else {
                        _i22 = _iterator22.next();
                        if (_i22.done) break;
                        _ref22 = _i22.value;
                    }

                    var _ref222 = _ref22;
                    var x = _ref222[0];
                    var y = _ref222[1];

                    rzone.add(tsumego.stone.make(x, y, 0));
                }
            }
            // remove the target block from the rzone
            rzone.remove(function (s) {
                return board.get(s) == ts;
            });
            function safe(s) {
                for (var i = 0; i < safeb.length; i++) {
                    if (safeb[i] * s > 0 && board.get(safeb[i]) == board.get(s)) return true;
                }return false;
            }
            var moves_b = [];
            var moves_w = [];
            var moves_0 = [];
            for (var _iterator23 = rzone, _isArray23 = Array.isArray(_iterator23), _i23 = 0, _iterator23 = _isArray23 ? _iterator23 : _iterator23[Symbol.iterator]();;) {
                var _ref23;

                if (_isArray23) {
                    if (_i23 >= _iterator23.length) break;
                    _ref23 = _iterator23[_i23++];
                } else {
                    _i23 = _iterator23.next();
                    if (_i23.done) break;
                    _ref23 = _i23.value;
                }

                var s = _ref23;

                moves_0.push(s);
                var x = tsumego.stone.x(s);
                var y = tsumego.stone.y(s);
                moves_b.push(tsumego.stone.make(x, y, +1));
                moves_w.push(tsumego.stone.make(x, y, -1));
            }
            return Object.assign(function expand(color) {
                if (color > 0) return moves_b;
                if (color < 0) return moves_w;
                return moves_0;
            }, { safe: safeb });
        }
        mgen.fixed = fixed;
    })(mgen = tsumego.mgen || (tsumego.mgen = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var mgen;
    (function (mgen) {
        var DistMap = (function () {
            function DistMap() {
                _classCallCheck(this, DistMap);

                this.dist = [];
                this.xmin = +Infinity;
                this.xmax = -Infinity;
                this.ymin = +Infinity;
                this.ymax = -Infinity;
            }

            /**
             * Distance-based moves generator.
             *
             * Generates moves that can be reached from the target
             * either by a solid connection or by capturing a block.
             */

            DistMap.prototype.get = function get(x, y) {
                var d = this.dist[x | y << 4];
                return d || Infinity;
            };

            DistMap.prototype.set = function set(x, y, d) {
                if (d >= this.dist[x | y << 4]) return;
                this.dist[x | y << 4] = d;
                if (x < this.xmin) this.xmin = x;
                if (x > this.xmax) this.xmax = x;
                if (y < this.ymin) this.ymin = y;
                if (y > this.ymax) this.ymax = y;
            };

            return DistMap;
        })();

        function dist(board, target) {
            var maxdist = arguments.length <= 2 || arguments[2] === undefined ? 3 : arguments[2];

            ;
            // moves are same for both sides and determined by where the target can play
            var cache = {};
            var reach = {};
            var state = {};
            function getmoves(color) {
                var nocolor = cache[board.hash];
                if (!color) return nocolor;
                var moves = [];
                for (var _iterator24 = nocolor, _isArray24 = Array.isArray(_iterator24), _i24 = 0, _iterator24 = _isArray24 ? _iterator24 : _iterator24[Symbol.iterator]();;) {
                    var _ref24;

                    if (_isArray24) {
                        if (_i24 >= _iterator24.length) break;
                        _ref24 = _iterator24[_i24++];
                    } else {
                        _i24 = _iterator24.next();
                        if (_i24.done) break;
                        _ref24 = _i24.value;
                    }

                    var s = _ref24;

                    var x = tsumego.stone.x(s);
                    var y = tsumego.stone.y(s);
                    moves.push(tsumego.stone.make(x, y, color));
                }
                return moves;
            }
            return function generate(color) /* Checked */{
                var goal = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];

                ///console.log('generate', color, goal, '\n' + board);
                if (state[board.hash] >= goal) return getmoves(color);
                var tblock = board.get(target);
                var dmap = new DistMap();
                ///console.log('target at', stone.toString(target), block.toString(tblock));
                if (!tblock) return [];
                if (!cache[board.hash]) {
                    var _tsumego$block$dims = tsumego.block.dims(tblock);

                    var xmin = _tsumego$block$dims[0];
                    var xmax = _tsumego$block$dims[1];
                    var ymin = _tsumego$block$dims[2];
                    var ymax = _tsumego$block$dims[3];

                    for (var d = 1; d <= maxdist; d++) {
                        for (var x = xmin; x <= xmax; x++) {
                            for (var y = ymin; y <= ymax; y++) {
                                var cblock = board.get(x, y);
                                var cdist = cblock == tblock ? 0 : dmap.get(x, y); // dist(target) = 0
                                // this iteration is supposed to make an extension from (d - 1) to d
                                if (d != cdist + 1) continue;
                                // now find empty cells and enemy blocks adjacent to (x, y):
                                // empty cells get dist = d, enemy blocks with few libs are
                                // surrounded with dist = d + libs - 1
                                for (var _iterator25 = board.neighbors(x, y), _isArray25 = Array.isArray(_iterator25), _i25 = 0, _iterator25 = _isArray25 ? _iterator25 : _iterator25[Symbol.iterator]();;) {
                                    var _ref25;

                                    if (_isArray25) {
                                        if (_i25 >= _iterator25.length) break;
                                        _ref25 = _iterator25[_i25++];
                                    } else {
                                        _i25 = _iterator25.next();
                                        if (_i25.done) break;
                                        _ref25 = _i25.value;
                                    }

                                    var nx = _ref25[0];
                                    var ny = _ref25[1];

                                    var nb = board.get(nx, ny);
                                    if (!nb) {
                                        // it's an empty cell
                                        dmap.set(nx, ny, d);
                                        // however if this cell is adjacent to a friendly block,
                                        // that block gets dist = d as well
                                        for (var _iterator26 = board.neighbors(nx, ny), _isArray26 = Array.isArray(_iterator26), _i26 = 0, _iterator26 = _isArray26 ? _iterator26 : _iterator26[Symbol.iterator]();;) {
                                            var _ref26;

                                            if (_isArray26) {
                                                if (_i26 >= _iterator26.length) break;
                                                _ref26 = _iterator26[_i26++];
                                            } else {
                                                _i26 = _iterator26.next();
                                                if (_i26.done) break;
                                                _ref26 = _i26.value;
                                            }

                                            var nnx = _ref26[0];
                                            var nny = _ref26[1];

                                            if (nnx == nx && nny == ny) continue;
                                            var nnb = board.get(nnx, nny);
                                            if (nnb == tblock || nnb * tblock <= 0 || dmap.get(nnx, nny) <= d) continue;
                                            for (var _iterator27 = board.stones(nnb), _isArray27 = Array.isArray(_iterator27), _i27 = 0, _iterator27 = _isArray27 ? _iterator27 : _iterator27[Symbol.iterator]();;) {
                                                var _ref27;

                                                if (_isArray27) {
                                                    if (_i27 >= _iterator27.length) break;
                                                    _ref27 = _iterator27[_i27++];
                                                } else {
                                                    _i27 = _iterator27.next();
                                                    if (_i27.done) break;
                                                    _ref27 = _i27.value;
                                                }

                                                var s = _ref27;

                                                dmap.set(tsumego.stone.x(s), tsumego.stone.y(s), d);
                                            }
                                        }
                                    } else if (nb * tblock < 0) {
                                        // it's an adjacent enemy block: check if it can be captured
                                        var rd = d + tsumego.block.libs(nb) - (cblock ? 1 : 0);
                                        if (rd <= maxdist) {
                                            ///console.log('enemy at', nx, ny, rd, '\n' + board);
                                            // it can be captured: now every lib
                                            // of the block is considered to be

                                            for (var _iterator28 = board.edge(nb), _isArray28 = Array.isArray(_iterator28), _i28 = 0, _iterator28 = _isArray28 ? _iterator28 : _iterator28[Symbol.iterator]();;) {
                                                var _ref28;

                                                if (_isArray28) {
                                                    if (_i28 >= _iterator28.length) break;
                                                    _ref28 = _iterator28[_i28++];
                                                } else {
                                                    _i28 = _iterator28.next();
                                                    if (_i28.done) break;
                                                    _ref28 = _i28.value;
                                                }

                                                var _x16 = _ref28[0];
                                                var _y4 = _ref28[1];

                                                var fb = board.get(_x16, _y4);
                                                // the target has d=0, no need to mark it with d=rd
                                                if (fb == tblock) continue;
                                                dmap.set(_x16, _y4, rd);
                                                // if the block being captured has other adjacent blocks,
                                                // those become reachable within rd steps as well                                           
                                                for (var _iterator29 = board.stones(fb), _isArray29 = Array.isArray(_iterator29), _i29 = 0, _iterator29 = _isArray29 ? _iterator29 : _iterator29[Symbol.iterator]();;) {
                                                    var _ref29;

                                                    if (_isArray29) {
                                                        if (_i29 >= _iterator29.length) break;
                                                        _ref29 = _iterator29[_i29++];
                                                    } else {
                                                        _i29 = _iterator29.next();
                                                        if (_i29.done) break;
                                                        _ref29 = _i29.value;
                                                    }

                                                    var s1 = _ref29;

                                                    dmap.set(tsumego.stone.x(s1), tsumego.stone.y(s1), rd);
                                                }
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
                        ///console.log(`d=${d} x=${xmin}..${xmax} y=${ymin}..${ymax}`);
                    }
                    var moves = [];
                    var rzone = [];
                    // now get all the moves with d <= maxdist that can be actually played
                    for (var x = xmin; x <= xmax; x++) {
                        for (var y = ymin; y <= ymax; y++) {
                            if (dmap.get(x, y) > maxdist) continue;
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
                    state[board.hash] = 1;
                }
                /* Draft */if (goal == 2 /* Checked */) {
                        var checked = [];
                        // now play out every found move, generate moves for the opponent
                        // and check if the move still appears in that generated set; if
                        // it doesn't appear there, this means that the opponent can block
                        // the move and make it an overplay
                        for (var _iterator30 = cache[board.hash], _isArray30 = Array.isArray(_iterator30), _i30 = 0, _iterator30 = _isArray30 ? _iterator30 : _iterator30[Symbol.iterator]();;) {
                            var _ref30;

                            if (_isArray30) {
                                if (_i30 >= _iterator30.length) break;
                                _ref30 = _iterator30[_i30++];
                            } else {
                                _i30 = _iterator30.next();
                                if (_i30.done) break;
                                _ref30 = _i30.value;
                            }

                            var move = _ref30;

                            ///console.log('checking', stone.toString(move));
                            var nr = board.play(tsumego.stone.setcolor(move, tblock));
                            // if the defender cannot play there, then the attacker can;
                            // also, capturing/defending a group always makes sense
                            if (nr != 1) {
                                if (nr > 0) board.undo();
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
                            var overplay = false;
                            // see how the opponent can respond to this move
                            for (var _iterator31 = generate(0, 1 /* Draft */), _isArray31 = Array.isArray(_iterator31), _i31 = 0, _iterator31 = _isArray31 ? _iterator31 : _iterator31[Symbol.iterator]();;) {
                                var _ref31;

                                if (_isArray31) {
                                    if (_i31 >= _iterator31.length) break;
                                    _ref31 = _iterator31[_i31++];
                                } else {
                                    _i31 = _iterator31.next();
                                    if (_i31.done) break;
                                    _ref31 = _i31.value;
                                }

                                var resp = _ref31;

                                ///console.log('blocking with', stone.toString(resp));
                                if (!board.play(tsumego.stone.setcolor(resp, -tblock))) {
                                    ///console.log('the opponent cannot play', stone.toString(resp));
                                    continue;
                                }
                                generate(0, 1 /* Draft */);
                                var reachable = reach[board.hash] || [];
                                board.undo();
                                // if now the move is not reachable, then the opponent has a way to block it
                                if (reachable.indexOf(move) < 0) {
                                    overplay = true;
                                    ///console.log(stone.toString(move), 'blocked by', stone.toString(resp), '\n' + board);
                                    break;
                                }
                            }
                            board.undo();
                            if (!overplay) checked.push(move);
                        }
                        ///console.log('checked=' + stone.list.toString(checked), '\n' + board);
                        cache[board.hash] = checked;
                        state[board.hash] = 2;
                    }
                /* Checked */return getmoves(color);
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

    var HashMap = (function () {
        function HashMap() {
            _classCallCheck(this, HashMap);

            // max size is 16 x 2**30 x 2**30, however
            // the actual size is  16 x 5000 x N, e.g.
            // if there are 1.6 M entries, then N = 20
            this.data = [];
            // this is a bit faster than a plain [] or {},
            // probably because negative keys are stringified
            for (var i = 0; i < 16; i++) {
                this.data[i] = [];
            }
        }

        HashMap.prototype.get = function get(key_hi, key_lo) {
            var a = key_hi & 3 | key_lo << 2 & 12;
            var b = key_hi >>> 2;
            var c = key_lo >>> 2;
            var t = this.data[a][b];
            // (t && t[c] || 0) would be much slower
            if (!t) return 0;
            var value = t[c];
            if (!value) return 0;
            return value;
        };

        HashMap.prototype.set = function set(key_hi, key_lo, value) {
            var a = key_hi & 3 | key_lo << 2 & 12;
            var b = key_hi >>> 2;
            var c = key_lo >>> 2;
            var q = this.data[a];
            if (!q[b]) q[b] = [];
            q[b][c] = value;
        };

        return HashMap;
    })();

    tsumego.HashMap = HashMap;
})(tsumego || (tsumego = {}));
/// <reference path="hashmap.ts" />
var tsumego;
(function (tsumego) {
    var stat;
    (function (stat) {
        stat.ttread = 0;
        stat.ttwrite = 0;
        stat.ttnoops = 0;
        stat.ttmiss = 0;
        stat.ttuc = 0;
        stat.logv.push(function () {
            return "tt reads = " + (stat.ttread / 1e6).toFixed(1) + " M";
        });
        stat.logv.push(function () {
            return "tt writes = " + (stat.ttwrite / 1e6).toFixed(1) + " M";
        });
        stat.logv.push(function () {
            return "tt uc writes = " + (stat.ttuc / 1e6).toFixed(1) + " M";
        });
        stat.logv.push(function () {
            return "tt noop writes = " + (stat.ttnoops / stat.ttwrite * 100 | 0) + " %";
        });
        stat.logv.push(function () {
            return "tt misses = " + (stat.ttmiss / stat.ttread * 100 | 0) + " %";
        });
    })(stat = tsumego.stat || (tsumego.stat = {}));
})(tsumego || (tsumego = {}));
(function (tsumego) {
    /**
     * 0               1               2
     *  0 1 2 3 4 5 6 7 0 1 2 3 4 5 6 7
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     * |   x   |   y   |  b  |  w  |c|m|
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     *
     *  b - if km >= b, then black wins; b = -3..+3
     *  w - if km <= w, then white wins; w = -3..+3
     *  m - if km >= b, m tells if black needs to play at (x, y) to win
     *  c - 1 if black wins, 0 if white wins
     *
     * where km = +1 means that B is the ko master, km = -1 means
     * that W is the ko master and km = 0 means neither B nor W has
     * external ko treats
     *
     * Obviously, w < b, as otherwise the status would be ambiguous.
     * This implies that the zero entry is not valid.
     */
    var entry = undefined;
    (function (entry) {})(entry || (entry = {}));
    (function (entry) {
        function make(x, y, b, w, m, c) {
            return x | y << 4 | (b & 7) << 8 | (w & 7) << 11 | (m ? 0x8000 : 0) | (c > 0 ? 0x4000 : 0);
        }
        entry.make = make;
    })(entry || (entry = {}));
    (function (entry) {
        entry.x = function (e) {
            return e & 15;
        };
        entry.y = function (e) {
            return e >> 4 & 15;
        };
        entry.b = function (e) {
            return e << 21 >> 29;
        };
        entry.w = function (e) {
            return e << 18 >> 29;
        };
        entry.m = function (e) {
            return !!(e & 0x8000);
        };
        entry.c = function (e) {
            return e & 0x4000 ? +1 : -1;
        };
        entry.base = entry.make(0, 0, +3, -3, false, 0);
    })(entry || (entry = {}));
    /**
     * The transposition table stores all found solutions:
     * unconditional, i.e. those that don't depend on the
     * path to the node, with a specific km (+1, 0, -1) and
     * conditional with null km.
     */

    var TT = (function () {
        function TT() {
            _classCallCheck(this, TT);

            this.size = 0;
            this.data = [new tsumego.HashMap(), new tsumego.HashMap()];
        }

        TT.prototype.get = function get(hash_0, hash_1, color, km) {
            var t = this.data[color > 0 ? 0 : 1];
            var e = t.get(hash_0, hash_1);
            tsumego.stat.ttread++;
            if (!e) {
                tsumego.stat.ttmiss++;
                return 0;
            }
            var winner = undefined;
            if (km === null) winner = entry.c(e);else if (km >= entry.b(e)) winner = +1; // enough ko treats for black
            else if (km <= entry.w(e)) winner = -1; // enough ko treats for white
                else {
                        tsumego.stat.ttmiss++;
                        return 0; // not solved for this km
                    }
            // the move must be dropped if the outcome is a loss
            return winner * color > 0 && entry.m(e) ? tsumego.stone.make(entry.x(e), entry.y(e), winner) : tsumego.stone.nocoords(winner);
        };

        TT.prototype.set = function set(hash_0, hash_1, color, move, km) {
            var t = this.data[color > 0 ? 0 : 1];
            var e = t.get(hash_0, hash_1) || (++this.size, entry.base);
            tsumego.stat.ttwrite++;
            // The idea here is to not override the winning move.
            // A typical case is the bent 4 shape: B wins if there are
            // no ko treats and loses if W has ko treats. If the first
            // solution is written first, then the second solution shouldn't
            // override the winning move.
            var x = undefined,
                y = undefined,
                c = undefined;
            if (move * color > 0) {
                x = tsumego.stone.x(move);
                y = tsumego.stone.y(move);
                c = tsumego.stone.hascoords(move);
            } else {
                x = entry.x(e);
                y = entry.y(e);
                c = entry.m(e);
            }
            var b = entry.b(e);
            var w = entry.w(e);
            if (km === null) {
                if (b == +3 && w == -3) t.set(hash_0, hash_1, entry.make(x, y, b, w, c, move));else tsumego.stat.ttnoops++;
            } else if (move > 0 && km < b) {
                tsumego.stat.ttuc++;
                t.set(hash_0, hash_1, entry.make(x, y, km, w, c, move));
            } else if (move < 0 && km > w) {
                tsumego.stat.ttuc++;
                t.set(hash_0, hash_1, entry.make(x, y, b, km, c, move));
            } else {
                tsumego.stat.ttnoops++;
            }
        };

        return TT;
    })();

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
        function alive(b, root) {
            var path = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

            var chainId = b.get(root);
            var sameColor = function sameColor(s) {
                return b.get(s) * chainId > 0;
            };
            var visited = [];
            var nEyes = 0;
            // enumerate all liberties of the chain to find two eyes among those liberties
            search: for (var _iterator32 = tsumego.region(root, function (t, s) {
                return sameColor(s) && b.inBounds(t);
            }), _isArray32 = Array.isArray(_iterator32), _i32 = 0, _iterator32 = _isArray32 ? _iterator32 : _iterator32[Symbol.iterator]();;) {
                var _ref32;

                if (_isArray32) {
                    if (_i32 >= _iterator32.length) break;
                    _ref32 = _iterator32[_i32++];
                } else {
                    _i32 = _iterator32.next();
                    if (_i32.done) break;
                    _ref32 = _i32.value;
                }

                var lib = _ref32;

                // the region(...) above enumerates stones in the chain and the liberties
                if (b.get(lib)) continue;
                // chains adjacent to the region
                var adjacent = [];
                var adjacentXY = [];
                for (var _iterator33 = tsumego.region(lib, function (t, s) {
                    return !sameColor(t) && b.inBounds(t);
                }), _isArray33 = Array.isArray(_iterator33), _i33 = 0, _iterator33 = _isArray33 ? _iterator33 : _iterator33[Symbol.iterator]();;) {
                    var _ref33;

                    if (_isArray33) {
                        if (_i33 >= _iterator33.length) break;
                        _ref33 = _iterator33[_i33++];
                    } else {
                        _i33 = _iterator33.next();
                        if (_i33.done) break;
                        _ref33 = _i33.value;
                    }

                    var p = _ref33;

                    // has this region been already marked as non vital to this chain?
                    if (visited[p]) continue search;
                    visited[p] = true;
                    var isAdjacent = false;
                    for (var _iterator34 = tsumego.stone.neighbors(p), _isArray34 = Array.isArray(_iterator34), _i34 = 0, _iterator34 = _isArray34 ? _iterator34 : _iterator34[Symbol.iterator]();;) {
                        var _ref34;

                        if (_isArray34) {
                            if (_i34 >= _iterator34.length) break;
                            _ref34 = _iterator34[_i34++];
                        } else {
                            _i34 = _iterator34.next();
                            if (_i34.done) break;
                            _ref34 = _i34.value;
                        }

                        var q = _ref34;

                        var ch = b.get(q);
                        if (ch == chainId) {
                            isAdjacent = true;
                        } else if (ch * chainId > 0 && adjacent.indexOf(ch) < 0) {
                            adjacent.push(ch);
                            adjacentXY.push(q);
                        }
                    }
                    // is it an empty intersection that is not adjacent to the chain?
                    if (!b.get(p) && !isAdjacent) continue search;
                }
                // check that all adjacent chains are also alive
                for (var i = 0; i < adjacent.length; i++) {
                    var ch = adjacent[i];
                    // if a sequence of chains form a loop, they are all alive
                    if (path.indexOf(ch) < 0 && !alive(b, adjacentXY[i], [].concat(path, [ch]))) continue search;
                }
                if (++nEyes > 1) return true;
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
    var sigmoid0 = function sigmoid0(x) {
        return 1 / (1 + Math.exp(-x));
    }; // S(x) = 1/(1 + 1/e**x)
    var sigmoid1 = function sigmoid1(s) {
        return s * (1 - s);
    }; // d/dx S(x) = S(x) * (1 - S(x))
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

    var DCNN = (function () {
        function DCNN(size) {
            _classCallCheck(this, DCNN);

            this.weights = [];
            this.outputs = [vector.zero(size)];
        }

        /**
         * Adds a new layer and sets all connections as a matrix
         * with the latest layer. The size of the last layer must
         * match the number of columns in the matrix ad the size of
         * the new layer matches the number of rows.
         */

        DCNN.prototype.add = function add(layer) {
            var rand = arguments.length <= 1 || arguments[1] === undefined ? function () {
                return Math.random();
            } : arguments[1];

            var v = this.outputs[this.outputs.length - 1];
            if (typeof layer === 'number') {
                this.add(matrix.make(layer, v.length, function () {
                    return rand() / layer * 2;
                }));
            } else {
                this.weights.push(layer);
                this.outputs.push(vector.zero(layer.length));
            }
        };

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

        DCNN.prototype.apply = function apply(input) {
            var vs = this.outputs;
            var ws = this.weights;
            var n = ws.length;
            vs[0] = input;
            for (var i = 0; i < n; i++) {
                vs[i + 1] = matrix.mulv(ws[i], vs[i]).map(sigmoid0);
            } // vs[i+1] = ws[i]*vs[i] | f'
            return vs[n];
        };

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

        DCNN.prototype.adjust = function adjust(target) {
            var k = arguments.length <= 1 || arguments[1] === undefined ? 1.0 : arguments[1];

            var vs = this.outputs;
            var ws = this.weights;
            var v0 = vs[vs.length - 1];
            // d[n] = (vs[n] - t) : (vs[n] | f')
            var d = vector.dot2(vector.sum(v0, target, -1), v0.map(sigmoid1));
            for (var i = ws.length - 1; i >= 0; i--) {
                var w = ws[i];
                var v = vs[i];
                // dw[i] = -k * dyad(d[i + 1], v[i])
                ws[i] = matrix.sum(w, vector.dyad(d, v), -k);
                // d[i] = (w[i]^T * d[i + 1]) : (v[i] | f')
                d = vector.dot2(matrix.mulv(matrix.transpose(w), d), v.map(sigmoid1));
            }
        };

        return DCNN;
    })();

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
        var mul3 = function mul3(x) {
            return x ^ (x & 0x80 ? x << 1 ^ 0x11b : x << 1);
        }; // x * 3
        var exp3 = new Array(256); // exp3[x] = 3**x
        var log3 = new Array(256); // y = exp3[x], x = log3[y]
        for (var x = 0, y = 1; x < 256; x++, y = mul3(y)) {
            log3[exp3[x] = y] = x;
        }log3[1] = 0;
        var invt = log3.map(function (x) {
            return exp3[255 - x];
        }); // x * inv1[x] = 1
        var cut = function cut(x) {
            return x > 255 ? x - 255 : x;
        };
        gf8.mul = function (a, b) {
            return a && b && exp3[cut(log3[a] + log3[b])];
        };
        gf8.inv = function (a) {
            return invt[a];
        };
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
(function (tsumego) {
    var gf32;
    (function (gf32) {
        var shl = function shl(x) {
            return x = x << 1 ^ (x < 0 ? 0x8d : 0);
        }; // x * 2 + 2**32 + 0x8d
        gf32.mul = function (a, b) {
            return b && (b & 1 ? a : 0) ^ shl(gf32.mul(a, b >>> 1));
        };
        var sqr = function sqr(x) {
            return gf32.mul(x, x);
        };
        gf32.pow = function (a, b) {
            return !b ? 1 : gf32.mul(b & 1 ? a : 1, sqr(gf32.pow(a, b >>> 1)));
        }; // simpler than EGCD
        gf32.inv = function (x) {
            return gf32.pow(x, -2);
        }; // x**q = x (the little Fermat's theorem)
    })(gf32 = tsumego.gf32 || (tsumego.gf32 = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    tsumego._en_calls = 0;
    tsumego._en_stones = 0;
    tsumego._en_blocks = 0;
    tsumego._en_area_x = 0;
    tsumego._en_area_y = 0;
    /**
     * Estimates the "eyeness" of the group.
     *
     * This function is trivial, in fact:
     *
     *          (n1 + q * n2 - n3) / 4
     *
     *  n1 = the number of 2x2 blocks with 1 stone of the same color
     *  n2 = 2x2s with 2 stones placed diagonally
     *  n3 = 2x2s with 3 stones
     *
     * However recomputing this function every time
     * would be too slow, hence here it's its incremental
     * version that checks what has changed on the board
     * since last time it was invoked.
     *
     * Erik van der Werf. "AI techniques for the game of Go"
     * erikvanderwerf.tengen.nl/pubdown/thesis_erikvanderwerf.pdf
     */

    var EulerN = function EulerN(board, color) {
        var q = arguments.length <= 2 || arguments[2] === undefined ? 2 : arguments[2];

        _classCallCheck(this, EulerN);

        var size = board.size;
        // [-1..size+1]x[-1..size+1]
        var snapshot = []; // 0, 1
        var values = []; // 0, 1, 2, 3
        for (var y = -1; y <= size; y++) {
            for (var x = -1; x <= size; x++) {
                snapshot.push(0);
                values.push(0);
            }
        }
        function offset(x, y) {
            return (size + 2) * (y + 1) + x + 1;
        }
        function test(x, y) {
            return board.get(x, y) * color > 0 ? 1 : 0;
        }
        function value(offset) {
            var a = snapshot[offset];
            var b = snapshot[offset + 1];
            var c = snapshot[offset + size + 2];
            var d = snapshot[offset + size + 3];
            return value4(a, b, c, d);
        }
        // accepts four 0..1 values
        function value4(a, b, c, d) {
            var v = a + b + c + d;
            return v != 2 || a == d ? v & 3 : 0;
        }
        var cf = [0, 1 / 4, q / 4, -1 / 4];
        var base = 0; // assigned by reset(), adjusted by value(...)
        return {
            reset: function reset() {
                var _tsumego$block$dims2 = tsumego.block.dims(board.rect(color));

                var xmin = _tsumego$block$dims2[0];
                var xmax = _tsumego$block$dims2[1];
                var ymin = _tsumego$block$dims2[2];
                var ymax = _tsumego$block$dims2[3];

                for (var y = ymin - 1; y <= ymax; y++) {
                    for (var x = xmin - 1; x <= xmax; x++) {
                        snapshot[offset(x, y)] = test(x, y);
                    }
                }base = 0;
                for (var y = ymin - 1; y <= ymax; y++) {
                    for (var x = xmin - 1; x <= xmax; x++) {
                        var i = offset(x, y);
                        var v = value(i);
                        values[i] = v;
                        base += cf[v];
                    }
                }
                return base;
            },
            value: function value(move, nres) {
                tsumego._en_calls++;
                // adding a stone of the opposite color
                // that doesn't capture anything won't
                // change the euler number
                if (move * color < 0 && nres < 2) return base;
                // it gets here in 62% of cases
                tsumego._en_stones += nres;
                var mx = tsumego.stone.x(move);
                var my = tsumego.stone.y(move);
                // the area that has been affected by this move
                var rect = tsumego.block.make(mx, mx, my, my, 0, 0, 0);
                // add all captured blocks
                if (move * color < 0) {
                    var blocks = board.getRemovedBlocks();
                    tsumego._en_blocks += blocks.length;
                    // blocks.length = 0.13 on average
                    for (var i = 0; i < blocks.length; i++) {
                        rect = tsumego.block.join(rect, blocks[i]);
                    }
                }
                // the area size is 0.85 x 0.77 on average

                var _tsumego$block$dims3 = tsumego.block.dims(rect);

                var xmin = _tsumego$block$dims3[0];
                var xmax = _tsumego$block$dims3[1];
                var ymin = _tsumego$block$dims3[2];
                var ymax = _tsumego$block$dims3[3];

                tsumego._en_area_x += xmax - xmin + 1;
                tsumego._en_area_y += ymax - ymin + 1;
                var area_x = xmax - xmin + 3; // 2.85
                var area_y = ymax - ymin + 3; // 2.77
                // since the area is so small on average,
                // all its contents can be represented as
                // bits in one number: in fact, a 32 bit
                // number has 4x more room than needed, as
                // only 8 bits are occupied in it on average
                var area = 0;
                // the loop is reversed to place bits in the direct order:
                // (dx, dy) should map to the (dy * area_x + dx)-th bit
                //
                //      a b c
                //      d e f   -->  0 b i h g f e d c b a
                //      g h i
                //
                //      0 0 1
                //      1 0 1   -->  0 b 0 1 1 1 0 1 1 0 0 = 236
                //      1 1 0
                //
                for (var y = ymin + 1; y >= ymin - 1; y--) {
                    for (var x = xmin + 1; x >= xmin - 1; x--) {
                        area = area << 1 | test(x, y);
                    }
                }var diff = 0;
                for (var y = ymin - 1; y <= ymax; y++) {
                    for (var x = xmin - 1; x <= xmax; x++) {
                        var k = area_x * (y - ymin + 1) + x - xmin + 1;
                        var a = area >> k & 1;
                        var b = area >> k + 1 & 1;
                        var c = area >> k + area_x & 1;
                        var d = area >> k + area_x + 1 & 1;
                        var v = value4(a, b, c, d);
                        var i = offset(x, y);
                        if (v != values[i]) diff += cf[v] - cf[values[i]];
                    }
                }
                return base + diff;
            }
        };
    };

    tsumego.EulerN = EulerN;
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var kWhite = 1 << 31; // the sign bit, as usual
    var kEmpty = 1 << 30;
    var kSafe = 1 << 29; // tells that the stone belongs to teh outer wall
    var kWall = 1 << 28;
    var kHash = (1 << 28) - 1; // 28 bits give 270 M values
    function eyeness(board, rzone, safeb) {
        var area = tsumego.sequence(256, 0);
        var size = board.size;
        function get(x, y) {
            if (!board.inBounds(x, y)) return kWall;
            var d = area[x | y << 4];
            if ((d & kHash) == (~board.hash & kHash)) return d;
            var b = board.get(x, y);
            var q = b & kWhite | ~board.hash & kHash;
            if (!b) {
                q |= kEmpty;
            } else {
                for (var i = 0; i < safeb.length; i++) {
                    if (board.get(safeb[i]) == b) q |= kSafe;
                }
            }
            return area[x | y << 4] = q;
        }
        function enemy(x, y, color) {
            var d = get(x, y);
            return !(d & kEmpty) && !(d & kWall) && d * color < 0;
        }
        function enemysafe(x, y, color) {
            return enemy(x, y, color) && (get(x, y) & kSafe) != 0;
        }
        function edge(x, y) {
            return x == 0 || x + 1 == size || y == 0 || y + 1 == size;
        }
        function test(x, y, target) {
            var d = get(x, y);
            if (d & kWall) {
                // not an eye for sure
                return false;
            } else if (d & kEmpty) {
                // if the empty point has an adjacent stone
                // of the opposite color, an eye cannot be
                // formed there because in order to make an eye,
                // that stone would need to be captured first
                if (enemy(x - 1, y, target) || enemy(x + 1, y, target) || enemy(x, y - 1, target) || enemy(x, y + 1, target)) return false;
                if (edge(x, y)) {
                    // if an empty point is on the edge and
                    // there is a diagonally adjacent safe
                    // stone of the opposite color, the eye
                    // is called false; however there are
                    // rare cases when two false eyes form
                    // an alive shape: those rare cases are
                    // ignored here
                    if (enemysafe(x + 1, y + 1, target) || enemysafe(x + 1, y - 1, target) || enemysafe(x - 1, y - 1, target) || enemysafe(x - 1, y + 1, target)) return false;
                    return true;
                } else {
                    var n = (enemysafe(x + 1, y + 1, target) ? 1 : 0) + (enemysafe(x + 1, y - 1, target) ? 1 : 0) + (enemysafe(x - 1, y - 1, target) ? 1 : 0) + (enemysafe(x - 1, y + 1, target) ? 1 : 0);
                    // if an empty point has two diagonally adjacent
                    // safe stones of the opposite color, the eye at
                    // that point is false; there are cases when groups
                    // with two false eyes live: those rare cases are
                    // ignored here
                    return n < 2;
                }
            } else if (d * target < 0) {
                // a stone of the opposite color
                // can be captured to make an eye,
                // unless that stone is safe
                return (d & kSafe) == 0;
            } else {
                return false;
            }
        }
        return function _eyeness(target) {
            var result = 0;
            for (var i = 0; i < rzone.length; i++) {
                var s = rzone[i];
                var x = tsumego.stone.x(s);
                var y = tsumego.stone.y(s);
                if (test(x, y, target)) result++;
            }
            return result;
        };
    }
    tsumego.eyeness = eyeness;
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
/// <reference path="eulern.ts" />
/// <reference path="eyeness.ts" />
var tsumego;
(function (tsumego) {
    var stat;
    (function (stat) {
        stat.ttinvalid = 0;
        stat.logv.push(function () {
            return "invalid tt entires = " + stat.ttinvalid;
        });
        stat.calls = 0;
        stat.logv.push(function () {
            return "calls to solve = " + (stat.calls / 1e6).toFixed(1) + " M";
        });
        stat.expand = 0;
        stat.logv.push(function () {
            return "calls to expand = " + (stat.expand / stat.calls * 100 | 0) + " %";
        });
        stat.nwins = 0;
        stat.logv.push(function () {
            return "chances that a node is winning = " + (stat.nwins / stat.expand * 100 | 0) + " %";
        });
        stat.nmoves = 0;
        stat.logv.push(function () {
            return "avg number of moves = " + (stat.nmoves / stat.expand).toFixed(1);
        });
        stat.nwmoves = 0;
        stat.logv.push(function () {
            return "avg number of moves when winning = " + (stat.nwmoves / stat.nwins).toFixed(1);
        });
        stat.nm2win = 0;
        stat.logv.push(function () {
            return "avg number of moves to win = " + (stat.nm2win / stat.nwins).toFixed(1);
        });
        stat.sdepth = 0;
        stat.logv.push(function () {
            return "avg depth at expand = " + (stat.sdepth / stat.expand | 0);
        });
        stat.maxdepth = 0;
        stat.logv.push(function () {
            return "max depth at expand = " + stat.maxdepth;
        });
    })(stat = tsumego.stat || (tsumego.stat = {}));
})(tsumego || (tsumego = {}));
(function (tsumego) {
    function solve(args) {
        var g = solve.start(args);
        var s = g.next();
        while (!s.done) s = g.next();
        return s.value;
    }
    tsumego.solve = solve;
    (function (solve_1) {
        function* start(args) {
            var board = args.board;
            var tt = args.tt;
            var log = args.log;
            var expand = args.expand;
            var debug = args.debug;
            var time = args.time;
            var eulern = args.eulern;
            var npeyes = args.npeyes;
            var target = args.target;
            var alive = args.alive;

            if (log && alive) {
                (function () {
                    var test = alive;
                    alive = function (node) {
                        var res = test(node);
                        log && log.write({
                            board: node.hash,
                            benson: res
                        });
                        return res;
                    };
                })();
            }
            // cache results from static analysis as it's quite slow
            alive = tsumego.memoized(alive, function (board) {
                return board.hash;
            });
            var started = Date.now(),
                yieldin = 100,
                remaining = yieldin;
            if (!tsumego.stone.hascoords(target)) throw Error('The target stone is not set');
            // tells who is being captured: coords + color
            target = tsumego.stone.make(tsumego.stone.x(target), tsumego.stone.y(target), tsumego.sign(board.get(target)));
            if (!tsumego.stone.color(target)) throw Error('The target points to an empty point: ' + tsumego.stone.toString(target));
            var sa = new tsumego.SortedArray();
            var values = new tsumego.HashMap();
            var evalnode = tsumego.evaluate(board, target, values);
            var eulerval = new tsumego.EulerN(board, tsumego.sign(target));
            var pec = npeyes && tsumego.eyeness(board, expand(0), expand.safe);
            var path = []; // path[i] = hash of the i-th position
            var tags = []; // this is to detect long loops, e.g. the 10,000 year ko
            var hist = []; // the sequence of moves that leads to the current position
            // 75% of the time the solver spends in this loop;
            // also, it's funny that in pretty much all cases
            // a for-of is slower than the plain for loop, but
            // in this case it's the opposite: for-of is way
            // faster for some mysterious reason; also v8 jit
            // doesn't optimize functions with yield, so it's
            // profitable to move out this chunk of code into
            // a plain function without yield/yield* stuff, but
            // this gives only a marginal profit
            function genmoves(color, km) {
                tsumego.stat.expand++;
                var nodes = sa.reset();
                var depth = path.length;
                var hash_b = board.hash_b;
                var hash_w = board.hash_w;
                var rdmin = tsumego.infdepth; // the earliest repetition
                var moves = [];
                for (var _iterator35 = expand(color), _isArray35 = Array.isArray(_iterator35), _i35 = 0, _iterator35 = _isArray35 ? _iterator35 : _iterator35[Symbol.iterator]();;) {
                    var _ref35;

                    if (_isArray35) {
                        if (_i35 >= _iterator35.length) break;
                        _ref35 = _iterator35[_i35++];
                    } else {
                        _i35 = _iterator35.next();
                        if (_i35.done) break;
                        _ref35 = _i35.value;
                    }

                    var _move = _ref35;

                    if (!board.get(_move)) moves.push(_move);
                }if (eulern && color * target > 0 && moves.length > 3) eulerval.reset();
                var guess = moves.length > 7 ? tt.get(hash_b, hash_w, color, null) : 0;
                for (var _iterator36 = moves, _isArray36 = Array.isArray(_iterator36), _i36 = 0, _iterator36 = _isArray36 ? _iterator36 : _iterator36[Symbol.iterator]();;) {
                    var _ref36;

                    if (_isArray36) {
                        if (_i36 >= _iterator36.length) break;
                        _ref36 = _iterator36[_i36++];
                    } else {
                        _i36 = _iterator36.next();
                        if (_i36.done) break;
                        _ref36 = _i36.value;
                    }

                    var _move2 = _ref36;

                    var nres = board.play(_move2);
                    if (!nres) continue;
                    var value = -evalnode(-color);
                    var eulerv = eulern && color * target > 0 && moves.length > 3 ? eulerval.value(_move2, nres) : 0;
                    var _npeyes = pec ? pec(tsumego.sign(target)) : 0;
                    var _hash_b = board.hash_b;
                    var _hash_w = board.hash_w;
                    var hash32 = board.hash;
                    board.undo();
                    // -1 indicates a sure loss
                    if (value <= -1) continue;
                    // skip moves that are known to be losing
                    if (tt.get(_hash_b, _hash_w, -color, km) * color < 0) continue;
                    var d = depth - 1;
                    while (d >= 0 && path[d] != hash32) d = d > 0 && path[d] == path[d - 1] ? -1 : d - 1;
                    d = d + 1 || tsumego.infdepth;
                    rdmin = tsumego.min(rdmin, d);
                    // there are no ko treats to play this move,
                    // so play a random move elsewhere and yield
                    // the turn to the opponent; this is needed
                    // if the opponent is playing useless ko-like
                    // moves that do not help even if all these
                    // ko fights are won
                    if (d <= depth && km * color <= 0) continue;
                    sa.insert(tsumego.repd.set(_move2, d), [
                    // moves that require a ko treat are considered last
                    // that's not just perf optimization: the search depends on this
                    -1 / d
                    // tt guesses the correct winning move in 83% of cases,
                    // but here this heuristics makes no difference at all
                     + Math.pow(8, -1) * (guess * color > 0 && tsumego.stone.same(guess, _move2) ? 1 : 0)
                    // first consider moves that lead to a winning position
                    // use previously found solution as a hint; this makes
                    // a huge impact on the perf: not using this trick
                    // makes the search 3-4x slower
                     + Math.pow(8, -2) * tsumego.sign(moves.length > 3 ? tt.get(_hash_b, _hash_w, -color, null) * color : 0)
                    // increase eyeness of the target group
                     + Math.pow(8, -3) * tsumego.sigmoid(_npeyes * tsumego.sign(target) * color)
                    // now consider the evaluation of this position
                     + Math.pow(8, -4) * value
                    // the euler number is the number of objects
                    // minus the number of holes; it pretty much
                    // estimates the eyeness of the target group;
                    // however as of now this heuristics doesn't
                    // do much; maybe it'll be useful once iterative
                    // deepening search is implemented
                     + Math.pow(8, -7) * tsumego.sigmoid(eulerv * color * tsumego.sign(target))
                    // if everything above is the same, pick a random move;
                    // in JS floating point numbers are 64 bit with 53 bits
                    // in the significant precision; this means that the
                    // this smallest term can be at most 2**52 times smaller
                    // then the biggest term (which is -1/d) as otherwise
                    // this small random addition will be lost; also, the
                    // number of digits (binary digits) in this random
                    // addition should be sufficiently large; here the 8**15
                    // factor leaves it 52 - 3 * 15 = 7 digits, which lets
                    // the random term have 128 possible values
                     + Math.pow(8, -15) * (tsumego.random() - 0.5)]);
                }
                // Consider making a pass as well. Passing locally is like
                // playing a move elsewhere and yielding the turn to the
                // opponent locally: it doesn't affect the local position,
                // but resets the local history of moves. This is why passing
                // may be useful: a position may be unsolvable with the given
                // history of moves, but once it's reset, the position can be
                // solved despite the move is yilded to the opponent.
                // Also, there is no point to pass if the target is in atari.
                if (tsumego.block.libs(board.get(target)) > 1) nodes.push(0);
                return { nodes: nodes, rdmin: rdmin };
            }
            function* solve(color, km) {
                remaining--;
                tsumego.stat.calls++;
                if (time && !remaining) {
                    yield;
                    var current = Date.now();
                    var speed = yieldin / (current - started);
                    started = current;
                    yieldin = tsumego.max(speed * time | 0, 1);
                    remaining = yieldin;
                }
                var depth = path.length;
                var prevb = depth < 1 ? 0 : path[depth - 1];
                var hash32 = board.hash;
                var hash_b = board.hash_b;
                var hash_w = board.hash_w;
                var ttres = tt.get(hash_b, hash_w, color, km);
                debug && (debug.color = color);
                debug && (debug.depth = depth);
                debug && (debug.moves = hist);
                debug && (debug.path = path);
                debug && (debug.km = km);
                if (ttres) {
                    // due to collisions, tt may give a result for a different position;
                    // however with 64 bit hashes, there expected to be just one collision
                    // per sqrt(2 * 2**64) = 6 billions positions = 12 billion w/b nodes
                    if (!board.get(ttres)) return tsumego.repd.set(ttres, tsumego.infdepth);
                    tsumego.stat.ttinvalid++;
                }
                if (depth > tsumego.infdepth / 2) return tsumego.repd.set(tsumego.stone.nocoords(-color), 0);
                // generate moves and find the earliest repetition;
                // the move casuing that repetition will not be in this list

                var _genmoves = genmoves(color, km);

                var nodes = _genmoves.nodes;
                var rdmin = _genmoves.rdmin;

                tsumego.stat.maxdepth = tsumego.max(tsumego.stat.maxdepth, depth);
                tsumego.stat.sdepth += depth;
                tsumego.stat.nmoves += nodes.length;
                var mindepth = rdmin;
                var result = undefined;
                var trials = 0;
                while (trials < nodes.length) {
                    var _move3 = nodes[trials++];
                    var d = !_move3 ? tsumego.infdepth : tsumego.repd.get(_move3);
                    var resp = undefined; // the best response
                    path.push(hash32);
                    hist.push(_move3 || tsumego.stone.nocoords(color));
                    _move3 && board.play(_move3);
                    debug && (yield tsumego.stone.toString(_move3 || tsumego.stone.nocoords(color)));
                    if (!_move3) {
                        var nextkm = prevb == hash32 && color * km < 0 ? 0 : km;
                        var tag = hash32 & ~15 | (-color & 3) << 2 | nextkm & 3; // tells which position, who plays and who is the km
                        var isloop = tags.lastIndexOf(tag) >= 0;
                        if (isloop) {
                            // yielding the turn again means that both sides agreed on
                            // the group's status; check the target's status and quit
                            resp = tsumego.stone.nocoords(target);
                            resp = tsumego.repd.set(resp, depth - 1);
                        } else {
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
                            resp = yield* solve(-color, nextkm);
                            tags.pop();
                        }
                    } else {
                        if (!board.get(target)) {
                            resp = tsumego.stone.nocoords(-target);
                            resp = tsumego.repd.set(resp, tsumego.infdepth);
                        } else if (color * target > 0 && alive && alive(board)) {
                            resp = tsumego.stone.nocoords(target);
                            resp = tsumego.repd.set(resp, tsumego.infdepth);
                        } else {
                            resp = yield* solve(-color, km);
                        }
                    }
                    path.pop();
                    hist.pop();
                    _move3 && board.undo();
                    debug && (yield tsumego.stone.toString(tsumego.repd.set(_move3, 0) || tsumego.stone.nocoords(color)) + " ⟶ " + tsumego.stone.toString(resp));
                    // the min value of repd is counted only for the case
                    // if all moves result in a loss; if this happens, then
                    // the current player can say that the loss was caused
                    // by the absence of ko treats and point to the earliest
                    // repetition in the path
                    if (resp * color < 0 && _move3) mindepth = tsumego.min(mindepth, d > depth ? tsumego.repd.get(resp) : d);
                    // the winning move may depend on a repetition, while
                    // there can be another move that gives the same result
                    // uncondtiionally, so it might make sense to continue
                    // searching in such cases
                    if (resp * color > 0) {
                        // if the board b was reached via path p has a winning
                        // move m that required to spend a ko treat and now b
                        // is reached via path q with at least one ko treat left,
                        // that ko treat can be spent to play m if it appears in q
                        // and then win the position again; this is why such moves
                        // are stored as unconditional (repd = infty)
                        result = _move3 || tsumego.stone.nocoords(color);
                        result = tsumego.repd.set(result, d > depth && _move3 ? tsumego.repd.get(resp) : d);
                        tsumego.stat.nwins++;
                        tsumego.stat.nwmoves += nodes.length;
                        tsumego.stat.nm2win += trials;
                        break;
                    }
                }
                // if there is no winning move, record a loss
                if (!result) {
                    result = tsumego.stone.nocoords(-color);
                    result = tsumego.repd.set(result, mindepth);
                }
                // if the solution doesn't depend on a ko above the current node,
                // it can be stored and later used unconditionally as it doesn't
                // depend on a path that leads to the node; this stands true if all
                // such solutions are stored and never removed from the table; this
                // can be proved by trying to construct a path from a node in the
                // proof tree to the root node
                tt.set(hash_b, hash_w, color, result, tsumego.repd.get(result) > depth + 1 ? km : null);
                log && log.write({
                    color: color,
                    result: result,
                    target: target,
                    trials: trials,
                    board: board.hash,
                    sgf: log.sgf && board.toStringSGF()
                });
                return result;
            }
            // restore the path from the history of moves
            {
                var moves = [];
                var _move4 = undefined;
                while (_move4 = board.undo()) moves.unshift(_move4);
                for (var _iterator37 = moves, _isArray37 = Array.isArray(_iterator37), _i37 = 0, _iterator37 = _isArray37 ? _iterator37 : _iterator37[Symbol.iterator]();;) {
                    if (_isArray37) {
                        if (_i37 >= _iterator37.length) break;
                        _move4 = _iterator37[_i37++];
                    } else {
                        _i37 = _iterator37.next();
                        if (_i37.done) break;
                        _move4 = _i37.value;
                    }

                    path.push(board.hash);
                    board.play(_move4);
                }
            }
            var color = args.color;
            var km = args.km;

            var move = yield* solve(color, km || 0);
            move = tsumego.stone.km.set(move, km || 0);
            if (!Number.isFinite(km)) {
                // if it's a loss, see what happens if there are ko treats;
                // if it's a win, try to find a stronger move, when the opponent has ko treats
                var km2 = move * color > 0 ? -color : color;
                var move2 = yield* solve(color, km2);
                if (move2 * color > 0 && tsumego.stone.hascoords(move2)) {
                    move = move2;
                    move = tsumego.stone.km.set(move, km2);
                }
            }
            move = tsumego.repd.set(move, 0);
            return typeof args === 'string' ? tsumego.stone.toString(move) : move;
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

    var Solver = (function () {
        function Solver(args) {
            _classCallCheck(this, Solver);

            if (typeof args === 'string') {
                var sgf = tsumego.SGF.parse(args);
                if (!sgf) throw SyntaxError('Invalid SGF.');
                var board = new tsumego.Board(sgf);
                if (!sgf.get('MA')) throw SyntaxError('MA[..] must specify the target.');
                var target = tsumego.stone.fromString(sgf.get('MA')[0]);
                var tb = board.get(target);
                if (!tb) throw Error('The target MA' + tsumego.stone.toString(target) + ' cannot point to an empty intersection.');
                // SQ fills in holes in the outer wall
                var stubs = (sgf.get('SQ') || []).map(function (s) {
                    return tsumego.stone.fromString(s);
                });
                for (var _iterator38 = stubs, _isArray38 = Array.isArray(_iterator38), _i38 = 0, _iterator38 = _isArray38 ? _iterator38 : _iterator38[Symbol.iterator]();;) {
                    var _ref37;

                    if (_isArray38) {
                        if (_i38 >= _iterator38.length) break;
                        _ref37 = _iterator38[_i38++];
                    } else {
                        _i38 = _iterator38.next();
                        if (_i38.done) break;
                        _ref37 = _i38.value;
                    }

                    var s = _ref37;

                    if (!board.play(tsumego.stone.make(tsumego.stone.x(s), tsumego.stone.y(s), -tb))) throw Error('Invalid stub: SQ' + tsumego.stone.toString(s));
                }board.drop();
                args = {
                    color: null,
                    board: board,
                    tt: new tsumego.TT(),
                    expand: tsumego.mgen.fixed(board, target),
                    target: target
                };
            }
            this.args = args;
        }

        Solver.prototype.toString = function toString() {
            return this.args.board.toString();
        };

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

        Solver.prototype.play = function play(move) {
            if (typeof move === 'string') {
                move = tsumego.stone.fromString(move);
                if (!move) throw Error('Invalid move format. Consider W[ea] or B[cd].');
            }
            return this.args.board.play(move) > 0;
        };

        /**
         * Reverts the last move and returns it.
         *
         * @example
         *
         *  play("W[ea]");
         *  undo() == "W[ea]";
         *  undo() == null; // nothing to undo
         */

        Solver.prototype.undo = function undo() {
            var move = this.args.board.undo();
            return tsumego.stone.toString(move);
        };

        Solver.prototype.solve = function solve(player, km) {
            var color = typeof player === 'string' ? tsumego.stone.label.color(player) : player;
            if (!color) throw Error('Invalid color value. Consider W or B.');
            var _args = Object.assign({}, this.args);
            _args.color = color;
            _args.km = km;
            var move = tsumego.solve(_args);
            return typeof player === 'number' ? move : move * color > 0 ? tsumego.stone.toString(move) : '';
        };

        Solver.prototype.g_solve = function g_solve(color, args) {
            if (typeof color === 'string') {
                color = tsumego.stone.label.color(color);
                if (!color) throw Error('Invalid color value. Consider W or B.');
            }
            var _args = Object.assign({}, this.args, args);
            _args.color = color;
            if (_args.benson) _args.alive = function (b) {
                return tsumego.benson.alive(b, _args.target);
            };
            return tsumego.solve.start(_args);
        };

        /**
         * Returns valid moves for the given player.
         * This function does not take repetitions
         * into account as this depends on who is
         * the ko master.
         */

        Solver.prototype.getValidMovesFor = function* getValidMovesFor(color) {
            for (var _iterator39 = this.args.expand(color), _isArray39 = Array.isArray(_iterator39), _i39 = 0, _iterator39 = _isArray39 ? _iterator39 : _iterator39[Symbol.iterator]();;) {
                var _ref38;

                if (_isArray39) {
                    if (_i39 >= _iterator39.length) break;
                    _ref38 = _iterator39[_i39++];
                } else {
                    _i39 = _iterator39.next();
                    if (_i39.done) break;
                    _ref38 = _i39.value;
                }

                var move = _ref38;

                if (this.board.play(move)) {
                    this.board.undo();
                    yield move;
                }
            }
        };

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

        Solver.prototype.threats = function* threats(color) {
            if (typeof color === 'string') {
                color = tsumego.stone.label.color(color);
                if (!color) throw Error('Invalid color value. Consider W or B.');
            }
            for (var _iterator40 = this.args.expand(color), _isArray40 = Array.isArray(_iterator40), _i40 = 0, _iterator40 = _isArray40 ? _iterator40 : _iterator40[Symbol.iterator]();;) {
                var _ref39;

                if (_isArray40) {
                    if (_i40 >= _iterator40.length) break;
                    _ref39 = _iterator40[_i40++];
                } else {
                    _i40 = _iterator40.next();
                    if (_i40.done) break;
                    _ref39 = _i40.value;
                }

                var move = _ref39;

                if (this.args.board.play(move)) {
                    var resp = this.solve(color);
                    this.args.board.undo();
                    if (resp * color > 0) yield tsumego.stone.toString(move);
                }
            }
        };

        Solver.prototype.proofs = function* proofs(player) {
            var color = typeof player === 'string' ? tsumego.stone.label.color(player) : player;
            if (!color) throw Error('Invalid color value. Consider W or B.');
            var move = this.solve(color);
            var km = tsumego.stone.km.get(move);
            if (move * color < 0) return;
            for (var _iterator41 = this.args.expand(color), _isArray41 = Array.isArray(_iterator41), _i41 = 0, _iterator41 = _isArray41 ? _iterator41 : _iterator41[Symbol.iterator]();;) {
                var _ref40;

                if (_isArray41) {
                    if (_i41 >= _iterator41.length) break;
                    _ref40 = _iterator41[_i41++];
                } else {
                    _i41 = _iterator41.next();
                    if (_i41.done) break;
                    _ref40 = _i41.value;
                }

                var _move5 = _ref40;

                if (!this.play(_move5)) continue;
                // can the opponent win with the same km level?
                var resp = this.solve(-color, km);
                this.undo();
                if (resp * color > 0) {
                    // tsc@2.0.0 doesn't see that this yield either
                    // always returns a string or always returns stone;
                    // so the derived return type is Iterable<string|stone>
                    // which is compatible neither with Iterable<string>
                    // or Iterable<stone>
                    yield typeof player === 'string' ? tsumego.stone.toString(_move5) : _move5;
                }
            }
        };

        /**
         * Constructs a proof tree:
         *
         *  - for every wrong move the tree has a disproof
         *  - for every correct move the tree has a strongest response
         *
         * Returns the tree of moves in the SGF format.
         *
         * @param depth The max number of wrong moves from a correct line.
         *
         * @example
         *
         *  (;B[ab];W[ba])
         *  (;B[ba];W[ca])
         *  (;B[ca];W[bb]
         *      (;B[ab];W[ba])
         *      (;B[ba];W[aa]
         *          (;B[ab]C[RIGHT])
         *          (;B[da];W[cb])
         *          (;B[cb];W[da]))
         *      (;B[da];W[aa])
         *      (;B[cb];W[aa]))
         *  (;B[cb];W[ca])
         *  (;B[bb];W[ca])
         *
         */

        Solver.prototype.tree = function* tree(player, depth) {
            var debuginfo = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var color = typeof player === 'string' ? tsumego.stone.label.color(player) : player;
            if (!color) throw Error('Invalid color value. Consider W or B.');
            // first find the best solution, see if
            // it even exists and see who needs
            // to be the ko master; i.e. if the found
            // solution is "B wins even if W is the km"
            // then there will be no point to consider
            // variations in which B wins when B is the km
            var move = this.solve(color);
            var km = tsumego.stone.km.get(move);
            if (move * color < 0) throw Error('There is no correct variation here.');
            var self = this;
            var cache = {}; // contuations chosen by the user
            var board = this.args.board;
            var target = this.args.target;
            var expand = this.args.expand;
            var pathto = new WeakMap();
            var parent = new WeakMap();
            var correct = new WeakMap();
            var terminal = new WeakMap();
            var treesize = new WeakMap();
            function add(tree, move) {
                if (typeof move === 'number') move = tsumego.stone.toString(move);
                var node = {};
                tree[move] = node;
                parent.set(node, tree);
                pathto.set(node, (pathto.get(tree) || '') + ';' + move);
                for (var x = node; x; x = parent.get(x)) {
                    treesize.set(x, (treesize.get(x) || 0) + 1);
                }return node;
            }

            var UserError = (function (_Error) {
                _inherits(UserError, _Error);

                function UserError() {
                    _classCallCheck(this, UserError);

                    _Error.call(this);
                }

                // adds a disproof for every wrong move and
                // a strongest response for every correct move
                return UserError;
            })(Error);

            function* deepen(tree) {
                var sgf = board.sgf;
                for (var _iterator42 = expand(color), _isArray42 = Array.isArray(_iterator42), _i42 = 0, _iterator42 = _isArray42 ? _iterator42 : _iterator42[Symbol.iterator]();;) {
                    var _ref41;

                    if (_isArray42) {
                        if (_i42 >= _iterator42.length) break;
                        _ref41 = _iterator42[_i42++];
                    } else {
                        _i42 = _iterator42.next();
                        if (_i42.done) break;
                        _ref41 = _i42.value;
                    }

                    var _move6 = _ref41;

                    if (board.play(_move6)) {
                        var subtree = add(tree, _move6);
                        if (yield pathto.get(subtree)) throw new UserError();
                        var dead = !board.get(target);
                        var resp = !dead && self.solve(-color, km);
                        if (dead || resp * color > 0) {
                            // this is a correct move: add strongest responses                           
                            correct.set(subtree, true);
                            if (!dead) {
                                var hasThreats = false;
                                // check if there are any threats before
                                // bothering the user to pick one
                                for (var _iterator43 = self.threats(-color), _isArray43 = Array.isArray(_iterator43), _i43 = 0, _iterator43 = _isArray43 ? _iterator43 : _iterator43[Symbol.iterator]();;) {
                                    var _ref42;

                                    if (_isArray43) {
                                        if (_i43 >= _iterator43.length) break;
                                        _ref42 = _iterator43[_i43++];
                                    } else {
                                        _i43 = _iterator43.next();
                                        if (_i43.done) break;
                                        _ref42 = _i43.value;
                                    }

                                    var threat = _ref42;

                                    hasThreats = true;
                                    break;
                                }
                                if (hasThreats) {
                                    // ask the UI to give the best response;
                                    // another option would be to somehow rank
                                    // moves returned by threats(-color) and
                                    // pick the stongest one; a probably good
                                    // heuristics is the max number of threatening,
                                    // moves that the losing player can make; such
                                    // moves are also called ko treats and it's
                                    // better to maximize the number of ko treats
                                    var threat = board.hash in cache ? cache[board.hash] : ( // don't bother the user twice for the same position
                                    yield tsumego.stone.label.string(-color));
                                    cache[board.hash] = threat;
                                    // the UI gives null if the variation needs to end here
                                    if (threat) {
                                        if (!self.play(threat)) {
                                            terminal.set(subtree, true);
                                        } else {
                                            // detect basic ko
                                            if (board.sgf == sgf) terminal.set(subtree, true);else add(subtree, threat);
                                            self.undo();
                                        }
                                    }
                                }
                            }
                            // now this player can ignore any next move:
                            // no need to deepen further this branch
                            if (leaf(subtree)) terminal.set(subtree, true);
                        } else if (!tsumego.stone.hascoords(resp)) {
                            // hmm.. the opponent needs to pass; this usually happens
                            // when the result is seki, but also might happen when the
                            // opponent needs to drop external ko treats and recapture
                            terminal.set(subtree, true);
                        } else {
                            // this is wrong move: add the found disproof;
                            // check first if this wrong line is not too long
                            var d = 0;
                            for (var node = subtree; node; node = parent.get(node), d++) {
                                if (correct.has(node)) break;
                            } // d is always even as it counts the number of black/white paired moves
                            if (d & 1) debugger;
                            // in the simplest case, a wrong move is preceeded by a correct one:
                            // ;W[ea];B[cd] and in this case d = 1; thus depth = 0 prevents adding
                            // any disproofs to the tree, which can be useful, for instance, to generate
                            // a the simplest proof tree for a unit test: the unit test just needs
                            // to know correct lines
                            if (d / 2 > depth) {
                                // stop the varistion here
                                terminal.set(subtree, true);
                            } else {
                                // check if the opponent even needs to answer
                                var pass = self.solve(color, km);
                                if (pass * color > 0) {
                                    // the opponent needs to respond
                                    add(subtree, resp);
                                    board.play(resp);
                                    // detect a basic ko and stop the variation
                                    if (sgf == board.sgf) terminal.set(subtree[tsumego.stone.toString(resp)], true);
                                    board.undo();
                                } else {
                                    // the move is dumb and can be ignored
                                    terminal.set(subtree, true);
                                }
                            }
                        }
                        board.undo();
                    }
                }
            }
            function* leaves(tree) {
                for (var _move7 in tree) {
                    if (!board.play(tsumego.stone.fromString(_move7))) debugger; // the tree is messed up
                    yield* leaves(tree[_move7]);
                    board.undo();
                }
                // danger: this should be at the end,
                // as otherwise the caller may insert
                // subnodes and for-in above will happily
                // list them as well
                if (leaf(tree)) yield tree;
            }
            var root = {};
            while (true) {
                var size = treesize.get(root) || 0;
                for (var _iterator44 = leaves(root), _isArray44 = Array.isArray(_iterator44), _i44 = 0, _iterator44 = _isArray44 ? _iterator44 : _iterator44[Symbol.iterator]();;) {
                    var _ref43;

                    if (_isArray44) {
                        if (_i44 >= _iterator44.length) break;
                        _ref43 = _iterator44[_i44++];
                    } else {
                        _i44 = _iterator44.next();
                        if (_i44.done) break;
                        _ref43 = _i44.value;
                    }

                    var _leaf = _ref43;

                    if (terminal.get(_leaf)) continue;
                    try {
                        yield* deepen(_leaf);
                    } catch (err) {
                        if (err instanceof UserError) break; // user has lost patience
                        throw err;
                    }
                }
                // nothing has been added: no need to proceed;
                // usually, variations end at depth 14-15, if
                // no static analysis is applied
                if (treesize.get(root) == size) break;
                console.log('added', treesize.get(root) - size, 'nodes');
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
                for (var _move8 in tree) {
                    if (!leaf(tree[_move8])) return false;
                }return true;
            }
            return (function stringify(tree) {
                var d = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

                var vars = [];
                for (var _move9 in tree) {
                    var subtree = tree[_move9];
                    // there is no point to explicitly list wrong moves, e.g. ;B[ef];W[cc];B[df]C[WRONG]
                    if (tsumego.stone.fromString(_move9) * color > 0 && !correct.has(subtree) && leaf(subtree)) continue;
                    var line = ';' + _move9;
                    if (correct.get(subtree)) {
                        if (leaf(subtree) || final(subtree)) line += 'C[RIGHT]'; // this tells goproblems that this is a correct final move
                        else if (debuginfo) line += 'R{+]'; // simplifies debugging
                    }
                    // attach the size of the subtree to discover heavy, but useless branches
                    if (debuginfo && treesize.get(subtree)) line += 'N[' + treesize.get(subtree) + ']';
                    // a correct line should end with a correct move;
                    // a wrong line should end with a disproving move
                    if (!correct.has(subtree) || !final(subtree)) line += stringify(subtree, d + 1);
                    vars.push(line);
                }
                if (vars.length < 2) return vars.join('');
                return vars.map(function (s) {
                    return '\n' + '  '.repeat(d + 1) + '(' + s + ')';
                }).join('');
            })(root);
        };

        _createClass(Solver, [{
            key: "board",
            get: function get() {
                return this.args.board;
            }
        }, {
            key: "target",
            get: function get() {
                return this.args.target;
            }
        }]);

        return Solver;
    })();

    tsumego.Solver = Solver;
})(tsumego || (tsumego = {}));
/// <reference path="search.ts" />
/// <reference path="solver.ts" />
var tsumego;
(function (tsumego) {
    try {
        module.exports = tsumego; // node.js
    } catch (_) {
        try {
            define(tsumego); // AMD
        } catch (_) {
            window.tsumego = tsumego;
        }
    }
})(tsumego || (tsumego = {}));
//# sourceMappingURL=(removed; see jakefile.js)
// rd moves away from target block
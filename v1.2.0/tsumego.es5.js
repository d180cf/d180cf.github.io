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
    (function (color) {
        color[color["black"] = 1] = "black";
        color[color["white"] = -1] = "white";
    })(tsumego.color || (tsumego.color = {}));
    var color = tsumego.color;
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
    var marked1$0 = [region].map(regeneratorRuntime.mark);

    tsumego.version = '0.1.0';
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
    function region(root, belongs) {
        var neighbors = arguments.length <= 2 || arguments[2] === undefined ? tsumego.stone.neighbors : arguments[2];

        var body, edge, xy, _iterator, _isArray, _i, _ref, nxy;

        return regeneratorRuntime.wrap(function region$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    body = [];
                    edge = [root];

                case 2:
                    if (!(edge.length > 0)) {
                        context$2$0.next = 24;
                        break;
                    }

                    xy = edge.pop();
                    context$2$0.next = 6;
                    return xy;

                case 6:
                    body.push(xy);
                    _iterator = neighbors(xy), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

                case 8:
                    if (!_isArray) {
                        context$2$0.next = 14;
                        break;
                    }

                    if (!(_i >= _iterator.length)) {
                        context$2$0.next = 11;
                        break;
                    }

                    return context$2$0.abrupt("break", 22);

                case 11:
                    _ref = _iterator[_i++];
                    context$2$0.next = 18;
                    break;

                case 14:
                    _i = _iterator.next();

                    if (!_i.done) {
                        context$2$0.next = 17;
                        break;
                    }

                    return context$2$0.abrupt("break", 22);

                case 17:
                    _ref = _i.value;

                case 18:
                    nxy = _ref;

                    if (belongs(nxy, xy) && body.indexOf(nxy) < 0 && edge.indexOf(nxy) < 0) edge.push(nxy);

                case 20:
                    context$2$0.next = 8;
                    break;

                case 22:
                    context$2$0.next = 2;
                    break;

                case 24:
                case "end":
                    return context$2$0.stop();
            }
        }, marked1$0[0], this);
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
    function sequence(n, f) {
        var x = [];
        while (n-- > 0) x.push(f());
        return x;
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
    (function (stone) {})(tsumego.stone || (tsumego.stone = {}));
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

        var SmallSet = (function () {
            function SmallSet() {
                var test = arguments.length <= 0 || arguments[0] === undefined ? stone.same : arguments[0];

                _classCallCheck(this, SmallSet);

                this.test = test;
                this.stones = [];
            }

            SmallSet.prototype.toString = function toString() {
                return '[' + this.stones.sort(function (a, b) {
                    return a - b;
                }).map(stone.toString).join(',') + ']';
            };

            SmallSet.prototype.has = function has(s) {
                for (var _iterator2 = this.stones, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                    var _ref2;

                    if (_isArray2) {
                        if (_i2 >= _iterator2.length) break;
                        _ref2 = _iterator2[_i2++];
                    } else {
                        _i2 = _iterator2.next();
                        if (_i2.done) break;
                        _ref2 = _i2.value;
                    }

                    var x = _ref2;

                    if (this.test(x, s)) return true;
                }return false;
            };

            SmallSet.prototype.add = function add(s) {
                if (!this.has(s)) this.stones.push(s);
            };

            SmallSet.prototype.remove = function remove(p) {
                for (var i = this.stones.length - 1; i >= 0; i--) {
                    var q = this.stones[i];
                    if (typeof p === 'function' ? p(q) : stone.same(p, q)) this.stones.splice(i, 1);
                }
            };

            /** Adds the item if it wasn't there or removes it otherwise. */

            SmallSet.prototype.xor = function xor(s) {
                if (this.has(s)) this.remove(s);else this.add(s);
            };

            SmallSet.prototype.empty = function empty() {
                this.stones = [];
            };

            SmallSet.prototype[Symbol.iterator] = regeneratorRuntime.mark(function callee$3$0() {
                var _iterator3, _isArray3, _i3, _ref3, s;

                return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            _iterator3 = this.stones, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();

                        case 1:
                            if (!_isArray3) {
                                context$4$0.next = 7;
                                break;
                            }

                            if (!(_i3 >= _iterator3.length)) {
                                context$4$0.next = 4;
                                break;
                            }

                            return context$4$0.abrupt("break", 16);

                        case 4:
                            _ref3 = _iterator3[_i3++];
                            context$4$0.next = 11;
                            break;

                        case 7:
                            _i3 = _iterator3.next();

                            if (!_i3.done) {
                                context$4$0.next = 10;
                                break;
                            }

                            return context$4$0.abrupt("break", 16);

                        case 10:
                            _ref3 = _i3.value;

                        case 11:
                            s = _ref3;
                            context$4$0.next = 14;
                            return s;

                        case 14:
                            context$4$0.next = 1;
                            break;

                        case 16:
                        case "end":
                            return context$4$0.stop();
                    }
                }, callee$3$0, this);
            });

            _createClass(SmallSet, [{
                key: "size",
                get: function get() {
                    return this.stones.length;
                }
            }]);

            return SmallSet;
        })();

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
        repd_1.get = function (move) {
            return move >> 8 & 255;
        };
        repd_1.set = function (move, repd) {
            return move & ~0xFF00 | repd << 8;
        };
    })(repd = tsumego.repd || (tsumego.repd = {}));
    var stone;
    (function (stone) {
        var km;
        (function (km_1) {
            km_1.get = function (s) {
                return s << 3 >> 30;
            }; // the signed shift
            km_1.set = function (s, km) {
                return s & ~0x18000000 | (km & 3) << 27;
            };
        })(km = stone.km || (stone.km = {}));
    })(stone = tsumego.stone || (tsumego.stone = {}));
    var stone;
    (function (stone) {
        var label;
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
    var stone;
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
        var list;
        (function (list) {
            list.toString = function (x) {
                return '[' + x.map(stone.toString).join(',') + ']';
            };
        })(list = stone.list || (stone.list = {}));
    })(stone = tsumego.stone || (tsumego.stone = {}));
    var stone;
    (function (stone) {
        var cc;
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
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
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
                    for (var _iterator4 = r, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
                        var _ref4;

                        if (_isArray4) {
                            if (_i4 >= _iterator4.length) break;
                            _ref4 = _iterator4[_i4++];
                        } else {
                            _i4 = _iterator4.next();
                            if (_i4.done) break;
                            _ref4 = _i4.value;
                        }

                        var p = _ref4;

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
            for (var _len2 = arguments.length, ps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                ps[_key2] = arguments[_key2];
            }

            return new Pattern(function (str, pos) {
                var res = [];
                for (var _iterator5 = ps, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
                    var _ref5;

                    if (_isArray5) {
                        if (_i5 >= _iterator5.length) break;
                        _ref5 = _iterator5[_i5++];
                    } else {
                        _i5 = _iterator5.next();
                        if (_i5.done) break;
                        _ref5 = _i5.value;
                    }

                    var p = _ref5;

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
    (function (block) {})(tsumego.block || (tsumego.block = {}));
    var block = tsumego.block;
    var block;
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
        block.join = function (b1, b2) {
            return block.make(tsumego.min(block.xmin(b1), block.xmin(b2)), tsumego.max(block.xmax(b1), block.xmax(b2)), tsumego.min(block.ymin(b1), block.ymin(b2)), tsumego.max(block.ymax(b1), block.ymax(b2)), 0, 0, 0);
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
                for (var _iterator6 = stones, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
                    var _ref6;

                    if (_isArray6) {
                        if (_i6 >= _iterator6.length) break;
                        _ref6 = _iterator6[_i6++];
                    } else {
                        _i6 = _iterator6.next();
                        if (_i6.done) break;
                        _ref6 = _i6.value;
                    }

                    var xy = _ref6;

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

        /**
         * Drops all the history.
         */

        Board.prototype.drop = function drop() {
            this.history = { added: [], hashes: [], changed: [] };
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
            return this._inBounds(x, y) ? this.lift(this.table[y << 4 | x]) : 0;
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
            this.history.changed.push(id, this.blocks[id] | 0);
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

                    var _block$dims2 = block.dims(bd);

                    var xmin = _block$dims2[0];
                    var xmax = _block$dims2[1];
                    var ymin = _block$dims2[2];
                    var ymax = _block$dims2[3];

                    xmin_new = tsumego.min(xmin_new, xmin);
                    ymin_new = tsumego.min(ymin_new, ymin);
                    xmax_new = tsumego.max(xmax_new, xmax);
                    ymax_new = tsumego.max(ymax_new, ymax);
                    // make the merged block point to the new block
                    if (id != id_new) this.change(id, block.make(0, 0, 0, 0, id_new, 0, 0));
                }
                // libs need to be counted in the rectangle extended by 1 intersection
                var libs_new = 0;
                for (var _y2 = tsumego.max(ymin_new - 1, 0); _y2 <= tsumego.min(ymax_new + 1, this.size - 1); _y2++) {
                    for (var _x7 = tsumego.max(xmin_new - 1, 0); _x7 <= tsumego.min(xmax_new + 1, this.size - 1); _x7++) {
                        if (this.getBlockId(_x7, _y2)) continue;
                        var is_lib = this.getBlockId(_x7 - 1, _y2) == id_new || this.getBlockId(_x7 + 1, _y2) == id_new || this.getBlockId(_x7, _y2 - 1) == id_new || this.getBlockId(_x7, _y2 + 1) == id_new;
                        if (is_lib) libs_new++;
                    }
                }
                this.change(id_new, block.make(xmin_new, xmax_new, ymin_new, ymax_new, libs_new, size_new, color));
            }
            this.history.added.push(x | y << 4 | this.history.changed.length / 2 - n_changed << 8 | id_old << 16 | color & 0x80000000);
            this.history.hashes.push(hash_b, hash_w);
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
            this.history.hashes.push(this.hash_b, this.hash_w);
            this.history.added.push(x | y << 4 | next.list.length / 2 << 8 | this.table[k] << 16 | c & 0x80000000);
            this.hash_b = next.hash_b;
            this.hash_w = next.hash_w;
            this.table[k] = next.cell;
            var nres = 0;
            for (var i = next.list.length - 2; i >= 0; i -= 2) {
                var id = next.list[i];
                var bd = next.list[i + 1];
                if (!bd) nres += block.size(this.blocks[id]);
                this.history.changed.push(id, this.blocks[id]);
                this.blocks[id] = bd;
            }
            return nres + 1;
        };

        Board.prototype.range = regeneratorRuntime.mark(function range() {
            var color = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            var y, x;
            return regeneratorRuntime.wrap(function range$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        y = 0;

                    case 1:
                        if (!(y < this.size)) {
                            context$3$0.next = 12;
                            break;
                        }

                        x = 0;

                    case 3:
                        if (!(x < this.size)) {
                            context$3$0.next = 9;
                            break;
                        }

                        context$3$0.next = 6;
                        return tsumego.stone.make(x, y, color);

                    case 6:
                        x++;
                        context$3$0.next = 3;
                        break;

                    case 9:
                        y++;
                        context$3$0.next = 1;
                        break;

                    case 12:
                    case "end":
                        return context$3$0.stop();
                }
            }, range, this);
        });

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
         */
        Board.prototype.stones = regeneratorRuntime.mark(function stones(b) {
            var all, _ref36, xmin, xmax, ymin, ymax, x, y, c;

            return regeneratorRuntime.wrap(function stones$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        all = b === undefined;

                        if (!(!all && !b)) {
                            context$3$0.next = 3;
                            break;
                        }

                        return context$3$0.abrupt("return");

                    case 3:
                        _ref36 = !all ? block.dims(b) : [0, this.size - 1, 0, this.size - 1];
                        xmin = _ref36[0];
                        xmax = _ref36[1];
                        ymin = _ref36[2];
                        ymax = _ref36[3];
                        x = xmin;

                    case 9:
                        if (!(x <= xmax)) {
                            context$3$0.next = 22;
                            break;
                        }

                        y = ymin;

                    case 11:
                        if (!(y <= ymax)) {
                            context$3$0.next = 19;
                            break;
                        }

                        c = this.get(x, y);

                        if (!(!all ? c == b : c)) {
                            context$3$0.next = 16;
                            break;
                        }

                        context$3$0.next = 16;
                        return tsumego.stone.make(x, y, c);

                    case 16:
                        y++;
                        context$3$0.next = 11;
                        break;

                    case 19:
                        x++;
                        context$3$0.next = 9;
                        break;

                    case 22:
                    case "end":
                        return context$3$0.stop();
                }
            }, stones, this);
        });

        /** Checks if (x, y) is a liberty of block b. */

        Board.prototype.isLibertyOf = function isLibertyOf(x, y, b) {
            return this.get(x - 1, y) == b || this.get(x + 1, y) == b || this.get(x, y - 1) == b || this.get(x, y + 1) == b;
        };

        /**
         * for (const [x, y] of board.libs(block))
         *      console.log("a liberty of the block", x, y);
         */
        Board.prototype.libs = regeneratorRuntime.mark(function libs(b) {
            var _iterator7, _isArray7, _i7, _ref7, _ref72, x, y;

            return regeneratorRuntime.wrap(function libs$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        _iterator7 = this.edge(b), _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();

                    case 1:
                        if (!_isArray7) {
                            context$3$0.next = 7;
                            break;
                        }

                        if (!(_i7 >= _iterator7.length)) {
                            context$3$0.next = 4;
                            break;
                        }

                        return context$3$0.abrupt("break", 19);

                    case 4:
                        _ref7 = _iterator7[_i7++];
                        context$3$0.next = 11;
                        break;

                    case 7:
                        _i7 = _iterator7.next();

                        if (!_i7.done) {
                            context$3$0.next = 10;
                            break;
                        }

                        return context$3$0.abrupt("break", 19);

                    case 10:
                        _ref7 = _i7.value;

                    case 11:
                        _ref72 = _ref7;
                        x = _ref72[0];
                        y = _ref72[1];

                        if (this.get(x, y)) {
                            context$3$0.next = 17;
                            break;
                        }

                        context$3$0.next = 17;
                        return [x, y];

                    case 17:
                        context$3$0.next = 1;
                        break;

                    case 19:
                    case "end":
                        return context$3$0.stop();
                }
            }, libs, this);
        });

        /** All cells adjacent to the block: empty and occupied by the opponent. */
        Board.prototype.edge = regeneratorRuntime.mark(function edge(b) {
            var _block$dims3, xmin, xmax, ymin, ymax, x, y, isLib;

            return regeneratorRuntime.wrap(function edge$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        if (b) {
                            context$3$0.next = 2;
                            break;
                        }

                        return context$3$0.abrupt("return");

                    case 2:
                        _block$dims3 = block.dims(b);
                        xmin = _block$dims3[0];
                        xmax = _block$dims3[1];
                        ymin = _block$dims3[2];
                        ymax = _block$dims3[3];

                        if (xmin > 0) xmin--;
                        if (ymin > 0) ymin--;
                        if (xmax < this.size - 1) xmax++;
                        if (ymax < this.size - 1) ymax++;
                        x = xmin;

                    case 12:
                        if (!(x <= xmax)) {
                            context$3$0.next = 27;
                            break;
                        }

                        y = ymin;

                    case 14:
                        if (!(y <= ymax)) {
                            context$3$0.next = 24;
                            break;
                        }

                        if (!(this.get(x, y) * b > 0)) {
                            context$3$0.next = 17;
                            break;
                        }

                        return context$3$0.abrupt("continue", 21);

                    case 17:
                        isLib = this.inBounds(x - 1, y) && this.get(x - 1, y) == b || this.inBounds(x, y - 1) && this.get(x, y - 1) == b || this.inBounds(x + 1, y) && this.get(x + 1, y) == b || this.inBounds(x, y + 1) && this.get(x, y + 1) == b;

                        if (!isLib) {
                            context$3$0.next = 21;
                            break;
                        }

                        context$3$0.next = 21;
                        return [x, y];

                    case 21:
                        y++;
                        context$3$0.next = 14;
                        break;

                    case 24:
                        x++;
                        context$3$0.next = 12;
                        break;

                    case 27:
                    case "end":
                        return context$3$0.stop();
                }
            }, edge, this);
        });

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
                return this.history.added.map(function (x) {
                    return tsumego.stone.make(x & 15, x >> 4 & 15, x);
                });
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
        var vector;
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
        var matrix;
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
        for (var _iterator8 = patterns, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
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

            if (p.test(snapshot)) return true;
        }return false;
    }
    tsumego.isDumb = isDumb;
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var mgen;
    (function (mgen) {
        function eulern(board, color) {
            var q = arguments.length <= 2 || arguments[2] === undefined ? 2 : arguments[2];

            var n1 = 0,
                n2 = 0,
                n3 = 0;
            for (var x = -1; x <= board.size; x++) {
                for (var y = -1; y <= board.size; y++) {
                    var a = +(board.get(x, y) * color > 0);
                    var b = +(board.get(x + 1, y) * color > 0);
                    var c = +(board.get(x + 1, y + 1) * color > 0);
                    var d = +(board.get(x, y + 1) * color > 0);
                    switch (a + b + c + d) {
                        case 1:
                            n1++;
                            break;
                        case 2:
                            if (a == c) n2++;
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
        stat.logv.push(function () {
            return "evaluated nodes = " + stat.nodes;
        });
    })(stat = tsumego.stat || (tsumego.stat = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    // this is something like the sigmoid function
    // to map values to [-1, +1] range, but it's
    // considerably faster; it's derivative is
    // dS / dx = (S / x)**2
    var sigmoid = function sigmoid(x) {
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
        var values = new tsumego.HashMap();
        // evaluates the node = (board, color) where color
        // tells who is about to play on this board
        return function _eval(color) {
            var t = board.get(target);
            var n = tsumego.block.libs(t);
            if (!t) return -tsumego.sign(t) * color;
            if (t * color < 0 && n < 2) return +1;
            var hash_b = board.hash_b ^ color;
            var hash_w = board.hash_w ^ color;
            // it's surprising, that with this dumb moves ordering
            // and with the cached tt results, the 1-st move appears
            // correct in 98 % cases
            var v = values.get(hash_b, hash_w) || ++tsumego.stat.nodes &&
            // maximize the number of captured stones first
            +1e-0 * sigmoid(board.nstones(color) - board.nstones(-color)) + 1e-1 * sigmoid(board.natari(-color)) + 1e-2 * sigmoid(n * color * tsumego.sign(t)) - 1e-3 * sigmoid(board.sumlibs(-color)) - 1e-4 * sigmoid(board.natari(color)) + 1e-5 * sigmoid(board.sumlibs(color)) + 1e-6 * sigmoid(tsumego.random() - 0.5);
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
            var ts = board.get(target);
            var rzone = new tsumego.stone.SmallSet();
            var same = function same(u, v) {
                return board.inBounds(u) && board.inBounds(v) && board.get(u) * ts >= 0 && board.get(v) * ts >= 0;
            };
            var neighbors = function neighbors(x) {
                return [].concat(tsumego.stone.diagonals(x), tsumego.stone.neighbors(x));
            };
            // get stones reachable with the 8 moves: direct + diagonal
            for (var _iterator9 = tsumego.region(target, same, neighbors), _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
                var _ref9;

                if (_isArray9) {
                    if (_i9 >= _iterator9.length) break;
                    _ref9 = _iterator9[_i9++];
                } else {
                    _i9 = _iterator9.next();
                    if (_i9.done) break;
                    _ref9 = _i9.value;
                }

                var rs = _ref9;

                rs && rzone.add(rs);
            } // find blocks of the same color adjacent to rzone
            var adjacent = [];
            for (var _iterator10 = rzone, _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
                var _ref10;

                if (_isArray10) {
                    if (_i10 >= _iterator10.length) break;
                    _ref10 = _iterator10[_i10++];
                } else {
                    _i10 = _iterator10.next();
                    if (_i10.done) break;
                    _ref10 = _i10.value;
                }

                var rs = _ref10;

                for (var _iterator11 = tsumego.stone.neighbors(rs), _isArray11 = Array.isArray(_iterator11), _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
                    var _ref11;

                    if (_isArray11) {
                        if (_i11 >= _iterator11.length) break;
                        _ref11 = _iterator11[_i11++];
                    } else {
                        _i11 = _iterator11.next();
                        if (_i11.done) break;
                        _ref11 = _i11.value;
                    }

                    var ns = _ref11;

                    var b = board.get(ns);
                    if (b * ts < 0 && adjacent.indexOf(b) < 0) adjacent.push(b);
                }
            }
            // find blocks with all the libs in rzone
            var inner = [];
            var safeb = [];
            test: for (var _iterator12 = adjacent, _isArray12 = Array.isArray(_iterator12), _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
                var _ref12;

                if (_isArray12) {
                    if (_i12 >= _iterator12.length) break;
                    _ref12 = _iterator12[_i12++];
                } else {
                    _i12 = _iterator12.next();
                    if (_i12.done) break;
                    _ref12 = _i12.value;
                }

                var b = _ref12;

                var n = 0;
                for (var _iterator13 = board.libs(b), _isArray13 = Array.isArray(_iterator13), _i13 = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator]();;) {
                    var _ref13;

                    if (_isArray13) {
                        if (_i13 >= _iterator13.length) break;
                        _ref13 = _iterator13[_i13++];
                    } else {
                        _i13 = _iterator13.next();
                        if (_i13.done) break;
                        _ref13 = _i13.value;
                    }

                    var x = _ref13[0];
                    var y = _ref13[1];

                    if (!rzone.has(tsumego.stone.make(x, y, 0))) {
                        n++;
                        if (n > 1) {
                            // this block has libs outside the r-zone,
                            // so it won't be captured
                            for (var _iterator14 = board.stones(b), _isArray14 = Array.isArray(_iterator14), _i14 = 0, _iterator14 = _isArray14 ? _iterator14 : _iterator14[Symbol.iterator]();;) {
                                var _ref14;

                                if (_isArray14) {
                                    if (_i14 >= _iterator14.length) break;
                                    _ref14 = _iterator14[_i14++];
                                } else {
                                    _i14 = _iterator14.next();
                                    if (_i14.done) break;
                                    _ref14 = _i14.value;
                                }

                                var s = _ref14;

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
            for (var _iterator15 = inner, _isArray15 = Array.isArray(_iterator15), _i15 = 0, _iterator15 = _isArray15 ? _iterator15 : _iterator15[Symbol.iterator]();;) {
                var _ref15;

                if (_isArray15) {
                    if (_i15 >= _iterator15.length) break;
                    _ref15 = _iterator15[_i15++];
                } else {
                    _i15 = _iterator15.next();
                    if (_i15.done) break;
                    _ref15 = _i15.value;
                }

                var b = _ref15;

                for (var _iterator16 = board.stones(b), _isArray16 = Array.isArray(_iterator16), _i16 = 0, _iterator16 = _isArray16 ? _iterator16 : _iterator16[Symbol.iterator]();;) {
                    var _ref16;

                    if (_isArray16) {
                        if (_i16 >= _iterator16.length) break;
                        _ref16 = _iterator16[_i16++];
                    } else {
                        _i16 = _iterator16.next();
                        if (_i16.done) break;
                        _ref16 = _i16.value;
                    }

                    var s = _ref16;

                    rzone.add(tsumego.stone.make(tsumego.stone.x(s), tsumego.stone.y(s), 0));
                }for (var _iterator17 = board.libs(b), _isArray17 = Array.isArray(_iterator17), _i17 = 0, _iterator17 = _isArray17 ? _iterator17 : _iterator17[Symbol.iterator]();;) {
                    var _ref17;

                    if (_isArray17) {
                        if (_i17 >= _iterator17.length) break;
                        _ref17 = _iterator17[_i17++];
                    } else {
                        _i17 = _iterator17.next();
                        if (_i17.done) break;
                        _ref17 = _i17.value;
                    }

                    var _ref172 = _ref17;
                    var x = _ref172[0];
                    var y = _ref172[1];

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
            for (var _iterator18 = rzone, _isArray18 = Array.isArray(_iterator18), _i18 = 0, _iterator18 = _isArray18 ? _iterator18 : _iterator18[Symbol.iterator]();;) {
                var _ref18;

                if (_isArray18) {
                    if (_i18 >= _iterator18.length) break;
                    _ref18 = _iterator18[_i18++];
                } else {
                    _i18 = _iterator18.next();
                    if (_i18.done) break;
                    _ref18 = _i18.value;
                }

                var s = _ref18;

                var x = tsumego.stone.x(s);
                var y = tsumego.stone.y(s);
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
                for (var _iterator19 = nocolor, _isArray19 = Array.isArray(_iterator19), _i19 = 0, _iterator19 = _isArray19 ? _iterator19 : _iterator19[Symbol.iterator]();;) {
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
                                for (var _iterator20 = board.neighbors(x, y), _isArray20 = Array.isArray(_iterator20), _i20 = 0, _iterator20 = _isArray20 ? _iterator20 : _iterator20[Symbol.iterator]();;) {
                                    var _ref20;

                                    if (_isArray20) {
                                        if (_i20 >= _iterator20.length) break;
                                        _ref20 = _iterator20[_i20++];
                                    } else {
                                        _i20 = _iterator20.next();
                                        if (_i20.done) break;
                                        _ref20 = _i20.value;
                                    }

                                    var nx = _ref20[0];
                                    var ny = _ref20[1];

                                    var nb = board.get(nx, ny);
                                    if (!nb) {
                                        // it's an empty cell
                                        dmap.set(nx, ny, d);
                                        // however if this cell is adjacent to a friendly block,
                                        // that block gets dist = d as well
                                        for (var _iterator21 = board.neighbors(nx, ny), _isArray21 = Array.isArray(_iterator21), _i21 = 0, _iterator21 = _isArray21 ? _iterator21 : _iterator21[Symbol.iterator]();;) {
                                            var _ref21;

                                            if (_isArray21) {
                                                if (_i21 >= _iterator21.length) break;
                                                _ref21 = _iterator21[_i21++];
                                            } else {
                                                _i21 = _iterator21.next();
                                                if (_i21.done) break;
                                                _ref21 = _i21.value;
                                            }

                                            var nnx = _ref21[0];
                                            var nny = _ref21[1];

                                            if (nnx == nx && nny == ny) continue;
                                            var nnb = board.get(nnx, nny);
                                            if (nnb == tblock || nnb * tblock <= 0 || dmap.get(nnx, nny) <= d) continue;
                                            for (var _iterator22 = board.stones(nnb), _isArray22 = Array.isArray(_iterator22), _i22 = 0, _iterator22 = _isArray22 ? _iterator22 : _iterator22[Symbol.iterator]();;) {
                                                var _ref22;

                                                if (_isArray22) {
                                                    if (_i22 >= _iterator22.length) break;
                                                    _ref22 = _iterator22[_i22++];
                                                } else {
                                                    _i22 = _iterator22.next();
                                                    if (_i22.done) break;
                                                    _ref22 = _i22.value;
                                                }

                                                var s = _ref22;

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

                                            for (var _iterator23 = board.edge(nb), _isArray23 = Array.isArray(_iterator23), _i23 = 0, _iterator23 = _isArray23 ? _iterator23 : _iterator23[Symbol.iterator]();;) {
                                                var _ref23;

                                                if (_isArray23) {
                                                    if (_i23 >= _iterator23.length) break;
                                                    _ref23 = _iterator23[_i23++];
                                                } else {
                                                    _i23 = _iterator23.next();
                                                    if (_i23.done) break;
                                                    _ref23 = _i23.value;
                                                }

                                                var _x16 = _ref23[0];
                                                var _y3 = _ref23[1];

                                                var fb = board.get(_x16, _y3);
                                                // the target has d=0, no need to mark it with d=rd
                                                if (fb == tblock) continue;
                                                dmap.set(_x16, _y3, rd);
                                                // if the block being captured has other adjacent blocks,
                                                // those become reachable within rd steps as well                                           
                                                for (var _iterator24 = board.stones(fb), _isArray24 = Array.isArray(_iterator24), _i24 = 0, _iterator24 = _isArray24 ? _iterator24 : _iterator24[Symbol.iterator]();;) {
                                                    var _ref24;

                                                    if (_isArray24) {
                                                        if (_i24 >= _iterator24.length) break;
                                                        _ref24 = _iterator24[_i24++];
                                                    } else {
                                                        _i24 = _iterator24.next();
                                                        if (_i24.done) break;
                                                        _ref24 = _i24.value;
                                                    }

                                                    var s1 = _ref24;

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
                        for (var _iterator25 = cache[board.hash], _isArray25 = Array.isArray(_iterator25), _i25 = 0, _iterator25 = _isArray25 ? _iterator25 : _iterator25[Symbol.iterator]();;) {
                            var _ref25;

                            if (_isArray25) {
                                if (_i25 >= _iterator25.length) break;
                                _ref25 = _iterator25[_i25++];
                            } else {
                                _i25 = _iterator25.next();
                                if (_i25.done) break;
                                _ref25 = _i25.value;
                            }

                            var move = _ref25;

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
                            for (var _iterator26 = generate(0, 1 /* Draft */), _isArray26 = Array.isArray(_iterator26), _i26 = 0, _iterator26 = _isArray26 ? _iterator26 : _iterator26[Symbol.iterator]();;) {
                                var _ref26;

                                if (_isArray26) {
                                    if (_i26 >= _iterator26.length) break;
                                    _ref26 = _iterator26[_i26++];
                                } else {
                                    _i26 = _iterator26.next();
                                    if (_i26.done) break;
                                    _ref26 = _i26.value;
                                }

                                var resp = _ref26;

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

            this.data = []; // 16 x 2**30 x 2**30
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
        stat.ttmiss = 0;
        stat.logv.push(function () {
            return "tt reads = " + stat.ttread;
        });
        stat.logv.push(function () {
            return "tt misses = " + stat.ttmiss + " = " + (stat.ttmiss / stat.ttread * 100 | 0) + " %";
        });
        stat.logv.push(function () {
            return "tt writes = " + stat.ttwrite + " = " + (stat.ttwrite / stat.ttread * 100 | 0) + " %";
        });
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
    (function (entry) {})(entry || (entry = {}));
    var entry;
    (function (entry) {
        function make(x, y, b, w, m) {
            return x | y << 4 | (b & 7) << 8 | (w & 7) << 11 | (m ? 0x8000 : 0);
        }
        entry.make = make;
    })(entry || (entry = {}));
    var entry;
    (function (entry) {
        entry.x = function (e) {
            return e & 15;
        };
        entry.y = function (e) {
            return e >> 4 & 15;
        };
        entry.b = function (e) {
            return (e >> 8 & 7) << 29 >> 29;
        };
        entry.w = function (e) {
            return (e >> 11 & 7) << 29 >> 29;
        };
        entry.m = function (e) {
            return !!(e & 0x8000);
        };
        entry.base = entry.make(0, 0, +3, -3, false);
    })(entry || (entry = {}));
    /** Transposition Table */

    var TT = (function () {
        function TT() {
            _classCallCheck(this, TT);

            this.size = 0;
            // this is a cache of found solutions
            // and is used only for move ordering;
            // it makes a huge impact on the perf:
            // reducing the number of entries to 1M
            // for example will make the solver 3-4x
            // slower
            this.move = new tsumego.HashMap(); // node -> stone
            this.data = [new tsumego.HashMap(), null, new tsumego.HashMap()];
        }

        TT.prototype.get = function get(hash_0, hash_1, color, km) {
            var e = this.data[color & 2].get(hash_0, hash_1);
            tsumego.stat.ttread++;
            if (!e) return 0;
            tsumego.stat.ttmiss++;
            var winner = km >= entry.b(e) ? +1 : km <= entry.w(e) ? -1 : 0; // not solved for this number of ko treats
            if (!winner) return 0;
            // the move must be dropped if the outcome is a loss
            return winner * color > 0 && entry.m(e) ? tsumego.stone.make(entry.x(e), entry.y(e), winner) : tsumego.stone.nocoords(winner);
        };

        /**
         * @param color Who plays first.
         * @param move The outcome. Must have a color and may have coordinates.
         * @param km Must be either-1, +1 or 0.
         */

        TT.prototype.set = function set(hash_0, hash_1, color, move, km) {
            var e = this.data[color & 2].get(hash_0, hash_1) || ++this.size && entry.base;
            tsumego.stat.ttwrite++;
            // The idea here is to not override the winning move.
            // A typical case is the bent 4 shape: B wins if there are
            // no ko treats and loses if W has ko treats. If the first
            // solution is written first, then the second solution shouldn't
            // override the winning move.

            var _ref37 = move * color > 0 ? [tsumego.stone.x(move), tsumego.stone.y(move), tsumego.stone.hascoords(move)] : [entry.x(e), entry.y(e), entry.m(e)];

            var x = _ref37[0];
            var y = _ref37[1];
            var hc = _ref37[2];

            var b = entry.b(e);
            var w = entry.w(e);
            var e2 = move > 0 && km < b ? entry.make(x, y, km, w, hc) : move < 0 && km > w ? entry.make(x, y, b, km, hc) : e;
            this.data[color & 2].set(hash_0, hash_1, e2);
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
            search: for (var _iterator27 = tsumego.region(root, function (t, s) {
                return sameColor(s) && b.inBounds(t);
            }), _isArray27 = Array.isArray(_iterator27), _i27 = 0, _iterator27 = _isArray27 ? _iterator27 : _iterator27[Symbol.iterator]();;) {
                var _ref27;

                if (_isArray27) {
                    if (_i27 >= _iterator27.length) break;
                    _ref27 = _iterator27[_i27++];
                } else {
                    _i27 = _iterator27.next();
                    if (_i27.done) break;
                    _ref27 = _i27.value;
                }

                var lib = _ref27;

                // the region(...) above enumerates stones in the chain and the liberties
                if (b.get(lib)) continue;
                // chains adjacent to the region
                var adjacent = [];
                var adjacentXY = [];
                for (var _iterator28 = tsumego.region(lib, function (t, s) {
                    return !sameColor(t) && b.inBounds(t);
                }), _isArray28 = Array.isArray(_iterator28), _i28 = 0, _iterator28 = _isArray28 ? _iterator28 : _iterator28[Symbol.iterator]();;) {
                    var _ref28;

                    if (_isArray28) {
                        if (_i28 >= _iterator28.length) break;
                        _ref28 = _iterator28[_i28++];
                    } else {
                        _i28 = _iterator28.next();
                        if (_i28.done) break;
                        _ref28 = _i28.value;
                    }

                    var p = _ref28;

                    // has this region been already marked as non vital to this chain?
                    if (visited[p]) continue search;
                    visited[p] = true;
                    var isAdjacent = false;
                    for (var _iterator29 = tsumego.stone.neighbors(p), _isArray29 = Array.isArray(_iterator29), _i29 = 0, _iterator29 = _isArray29 ? _iterator29 : _iterator29[Symbol.iterator]();;) {
                        var _ref29;

                        if (_isArray29) {
                            if (_i29 >= _iterator29.length) break;
                            _ref29 = _iterator29[_i29++];
                        } else {
                            _i29 = _iterator29.next();
                            if (_i29.done) break;
                            _ref29 = _i29.value;
                        }

                        var q = _ref29;

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
var tsumego;
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
        stat.logv.push(function () {
            return "wrong tt entires = " + stat.ttinvalid;
        });
        stat.calls = 0;
        stat.logv.push(function () {
            return "calls to solve = " + stat.calls;
        });
        stat.expand = 0;
        stat.logv.push(function () {
            return "calls to expand = " + stat.expand + " = " + (stat.expand / stat.calls * 100 | 0) + " %";
        });
        stat.first = 0;
        stat.logv.push(function () {
            return "the 1-st move is correct = " + (stat.first / stat.expand * 100 | 0) + " %";
        });
    })(stat = tsumego.stat || (tsumego.stat = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    function solve(args) {
        var g = solve.start(args);
        var s = g.next();
        while (!s.done) s = g.next();
        return s.value;
    }
    tsumego.solve = solve;
    var solve;
    (function (solve_1) {
        var marked2$0 = [start].map(regeneratorRuntime.mark);

        function start(args) {
            var marked3$0, board, color, km, tt, log, expand, debug, time, target, alive, started, yieldin, remaining, sa, evalnode, path, tags, hist, solve, moves, _move3, _iterator31, _isArray31, _i31, move, km2, move2;

            return regeneratorRuntime.wrap(function start$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        solve = function solve(color, km) {
                            var current, speed, depth, prevb, hash32, hash_b, hash_w, ttres, guess, result, mindepth, nodes, _iterator30, _isArray30, _i30, _ref30, _move, value, _hash_b, _hash_w, _hash32, d, trials, _move2, s, nextkm, tag, isloop;

                            return regeneratorRuntime.wrap(function solve$(context$4$0) {
                                while (1) switch (context$4$0.prev = context$4$0.next) {
                                    case 0:
                                        remaining--;
                                        tsumego.stat.calls++;

                                        if (!(time && !remaining)) {
                                            context$4$0.next = 10;
                                            break;
                                        }

                                        context$4$0.next = 5;
                                        return;

                                    case 5:
                                        current = Date.now();
                                        speed = yieldin / (current - started);

                                        started = current;
                                        yieldin = tsumego.max(speed * time | 0, 1);
                                        remaining = yieldin;

                                    case 10:
                                        depth = path.length;
                                        prevb = depth < 1 ? 0 : path[depth - 1];
                                        hash32 = board.hash;
                                        hash_b = board.hash_b;
                                        hash_w = board.hash_w;
                                        ttres = tt.get(hash_b, hash_w, color, km);

                                        debug && (debug.color = color);
                                        debug && (debug.depth = depth);
                                        debug && (debug.moves = hist);
                                        debug && (debug.path = path);
                                        debug && (debug.km = km);

                                        if (!ttres) {
                                            context$4$0.next = 25;
                                            break;
                                        }

                                        if (board.get(ttres)) {
                                            context$4$0.next = 24;
                                            break;
                                        }

                                        return context$4$0.abrupt("return", tsumego.repd.set(ttres, tsumego.infdepth));

                                    case 24:
                                        tsumego.stat.ttinvalid++;

                                    case 25:
                                        if (!(depth > tsumego.infdepth / 2)) {
                                            context$4$0.next = 27;
                                            break;
                                        }

                                        return context$4$0.abrupt("return", tsumego.repd.set(tsumego.stone.nocoords(-color), 0));

                                    case 27:
                                        guess = tt.move.get(color > 0 ? 1 : 0, hash32);
                                        result = undefined;
                                        mindepth = tsumego.infdepth;
                                        nodes = sa.reset();

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
                                        _iterator30 = expand(color), _isArray30 = Array.isArray(_iterator30), _i30 = 0, _iterator30 = _isArray30 ? _iterator30 : _iterator30[Symbol.iterator]();

                                    case 33:
                                        if (!_isArray30) {
                                            context$4$0.next = 39;
                                            break;
                                        }

                                        if (!(_i30 >= _iterator30.length)) {
                                            context$4$0.next = 36;
                                            break;
                                        }

                                        return context$4$0.abrupt("break", 65);

                                    case 36:
                                        _ref30 = _iterator30[_i30++];
                                        context$4$0.next = 43;
                                        break;

                                    case 39:
                                        _i30 = _iterator30.next();

                                        if (!_i30.done) {
                                            context$4$0.next = 42;
                                            break;
                                        }

                                        return context$4$0.abrupt("break", 65);

                                    case 42:
                                        _ref30 = _i30.value;

                                    case 43:
                                        _move = _ref30;

                                        if (board.play(_move)) {
                                            context$4$0.next = 46;
                                            break;
                                        }

                                        return context$4$0.abrupt("continue", 63);

                                    case 46:
                                        value = -evalnode(-color);
                                        _hash_b = board.hash_b;
                                        _hash_w = board.hash_w;
                                        _hash32 = board.hash;

                                        board.undo();
                                        // -1 indicates a sure loss

                                        if (!(value <= -1)) {
                                            context$4$0.next = 53;
                                            break;
                                        }

                                        return context$4$0.abrupt("continue", 63);

                                    case 53:
                                        if (!(tt.get(_hash_b, _hash_w, -color, km) * color < 0)) {
                                            context$4$0.next = 55;
                                            break;
                                        }

                                        return context$4$0.abrupt("continue", 63);

                                    case 55:
                                        d = depth - 1;

                                        while (d >= 0 && path[d] != _hash32) d = d > 0 && path[d] == path[d - 1] ? -1 : d - 1;
                                        d++;
                                        if (!d) d = tsumego.infdepth;
                                        if (d < mindepth) mindepth = d;
                                        // there are no ko treats to play this move,
                                        // so play a random move elsewhere and yield
                                        // the turn to the opponent; this is needed
                                        // if the opponent is playing useless ko-like
                                        // moves that do not help even if all these
                                        // ko fights are won

                                        if (!(d <= depth && km * color <= 0)) {
                                            context$4$0.next = 62;
                                            break;
                                        }

                                        return context$4$0.abrupt("continue", 63);

                                    case 62:
                                        sa.insert(tsumego.repd.set(_move, d), [
                                        // moves that require a ko treat are considered last
                                        // that's not just perf optimization: the search depends on this
                                        +1e-0 * d + 1e-1 * tsumego.sign(guess * color) + 1e-2 * tsumego.sign(tt.move.get(color < 0 ? 1 : 0, _hash32) * color) + 1e-3 * value]);

                                    case 63:
                                        context$4$0.next = 33;
                                        break;

                                    case 65:
                                        // Consider making a pass as well. Passing locally is like
                                        // playing a move elsewhere and yielding the turn to the
                                        // opponent locally: it doesn't affect the local position,
                                        // but resets the local history of moves. This is why passing
                                        // may be useful: a position may be unsolvable with the given
                                        // history of moves, but once it's reset, the position can be
                                        // solved despite the move is yilded to the opponent.
                                        // Also, there is no point to pass if the target is in atari.
                                        if (tsumego.block.libs(board.get(target)) > 1) nodes.push(0);
                                        trials = 0;

                                    case 67:
                                        if (!(trials < nodes.length)) {
                                            context$4$0.next = 116;
                                            break;
                                        }

                                        _move2 = nodes[trials++];
                                        d = !_move2 ? tsumego.infdepth : tsumego.repd.get(_move2);
                                        s = undefined;

                                        path.push(hash32);
                                        hist.push(_move2 || tsumego.stone.nocoords(color));
                                        _move2 && board.play(_move2);
                                        context$4$0.t0 = debug;

                                        if (!context$4$0.t0) {
                                            context$4$0.next = 78;
                                            break;
                                        }

                                        context$4$0.next = 78;
                                        return tsumego.stone.toString(_move2 || tsumego.stone.nocoords(color));

                                    case 78:
                                        if (_move2) {
                                            context$4$0.next = 92;
                                            break;
                                        }

                                        nextkm = prevb == hash32 && color * km < 0 ? 0 : km;
                                        tag = hash32 & ~15 | (-color & 3) << 2 | nextkm & 3;
                                        isloop = tags.lastIndexOf(tag) >= 0;

                                        if (!isloop) {
                                            context$4$0.next = 86;
                                            break;
                                        }

                                        // yielding the turn again means that both sides agreed on
                                        // the group's status; check the target's status and quit
                                        s = tsumego.repd.set(tsumego.stone.nocoords(target), depth - 1);
                                        context$4$0.next = 90;
                                        break;

                                    case 86:
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
                                        return context$4$0.delegateYield(solve(-color, nextkm), "t1", 88);

                                    case 88:
                                        s = context$4$0.t1;

                                        tags.pop();

                                    case 90:
                                        context$4$0.next = 102;
                                        break;

                                    case 92:
                                        if (board.get(target)) {
                                            context$4$0.next = 96;
                                            break;
                                        }

                                        s = tsumego.repd.set(tsumego.stone.nocoords(-target), tsumego.infdepth);
                                        context$4$0.next = 102;
                                        break;

                                    case 96:
                                        if (!(color * target > 0 && alive && alive(board))) {
                                            context$4$0.next = 100;
                                            break;
                                        }

                                        s = tsumego.repd.set(tsumego.stone.nocoords(target), tsumego.infdepth);
                                        context$4$0.next = 102;
                                        break;

                                    case 100:
                                        return context$4$0.delegateYield(solve(-color, km), "t2", 101);

                                    case 101:
                                        s = context$4$0.t2;

                                    case 102:
                                        path.pop();
                                        hist.pop();
                                        _move2 && board.undo();
                                        context$4$0.t3 = debug;

                                        if (!context$4$0.t3) {
                                            context$4$0.next = 109;
                                            break;
                                        }

                                        context$4$0.next = 109;
                                        return tsumego.stone.toString(tsumego.repd.set(_move2, 0) || tsumego.stone.nocoords(color)) + " ⟶ " + tsumego.stone.toString(s);

                                    case 109:
                                        // the min value of repd is counted only for the case
                                        // if all moves result in a loss; if this happens, then
                                        // the current player can say that the loss was caused
                                        // by the absence of ko treats and point to the earliest
                                        // repetition in the path
                                        if (s * color < 0 && _move2) mindepth = tsumego.min(mindepth, d > depth ? tsumego.repd.get(s) : d);
                                        // the winning move may depend on a repetition, while
                                        // there can be another move that gives the same result
                                        // uncondtiionally, so it might make sense to continue
                                        // searching in such cases

                                        if (!(s * color > 0)) {
                                            context$4$0.next = 114;
                                            break;
                                        }

                                        // if the board b was reached via path p has a winning
                                        // move m that required to spend a ko treat and now b
                                        // is reached via path q with at least one ko treat left,
                                        // that ko treat can be spent to play m if it appears in q
                                        // and then win the position again; this is why such moves
                                        // are stored as unconditional (repd = infty)
                                        result = tsumego.repd.set(_move2 || tsumego.stone.nocoords(color), d > depth && _move2 ? tsumego.repd.get(s) : d);
                                        if (trials == 1 && nodes.length > 2) tsumego.stat.first++;
                                        return context$4$0.abrupt("break", 116);

                                    case 114:
                                        context$4$0.next = 67;
                                        break;

                                    case 116:
                                        // if there is no winning move, record a loss
                                        if (!result) result = tsumego.repd.set(tsumego.stone.nocoords(-color), mindepth);
                                        // if the solution doesn't depend on a ko above the current node,
                                        // it can be stored and later used unconditionally as it doesn't
                                        // depend on a path that leads to the node; this stands true if all
                                        // such solutions are stored and never removed from the table; this
                                        // can be proved by trying to construct a path from a node in the
                                        // proof tree to the root node
                                        if (tsumego.repd.get(result) > depth + 1) tt.set(hash_b, hash_w, color, result, km);
                                        tt.move.set(color > 0 ? 1 : 0, hash32, result);
                                        log && log.write({
                                            color: color,
                                            result: result,
                                            target: target,
                                            trials: trials,
                                            guess: guess,
                                            board: board.hash,
                                            sgf: log.sgf && board.toStringSGF()
                                        });
                                        return context$4$0.abrupt("return", result);

                                    case 121:
                                    case "end":
                                        return context$4$0.stop();
                                }
                            }, marked3$0[0], this);
                        };

                        marked3$0 = [solve].map(regeneratorRuntime.mark);
                        board = args.board;
                        color = args.color;
                        km = args.km;
                        tt = args.tt;
                        log = args.log;
                        expand = args.expand;
                        debug = args.debug;
                        time = args.time;
                        target = args.target;
                        alive = args.alive;

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
                        started = Date.now(), yieldin = 100, remaining = yieldin;

                        if (tsumego.stone.hascoords(target)) {
                            context$3$0.next = 17;
                            break;
                        }

                        throw Error('The target stone is not set');

                    case 17:
                        // tells who is being captured: coords + color
                        target = tsumego.stone.make(tsumego.stone.x(target), tsumego.stone.y(target), tsumego.sign(board.get(target)));

                        if (tsumego.stone.color(target)) {
                            context$3$0.next = 20;
                            break;
                        }

                        throw Error('The target points to an empty point: ' + tsumego.stone.toString(target));

                    case 20:
                        sa = new tsumego.SortedArray();
                        evalnode = tsumego.evaluate(board, target);
                        path = [];
                        tags = [];
                        hist = [];
                        moves = [];
                        _move3 = undefined;

                        while (_move3 = board.undo()) moves.unshift(_move3);
                        _iterator31 = moves, _isArray31 = Array.isArray(_iterator31), _i31 = 0, _iterator31 = _isArray31 ? _iterator31 : _iterator31[Symbol.iterator]();

                    case 29:
                        if (!_isArray31) {
                            context$3$0.next = 35;
                            break;
                        }

                        if (!(_i31 >= _iterator31.length)) {
                            context$3$0.next = 32;
                            break;
                        }

                        return context$3$0.abrupt("break", 43);

                    case 32:
                        _move3 = _iterator31[_i31++];
                        context$3$0.next = 39;
                        break;

                    case 35:
                        _i31 = _iterator31.next();

                        if (!_i31.done) {
                            context$3$0.next = 38;
                            break;
                        }

                        return context$3$0.abrupt("break", 43);

                    case 38:
                        _move3 = _i31.value;

                    case 39:
                        path.push(board.hash);
                        board.play(_move3);

                    case 41:
                        context$3$0.next = 29;
                        break;

                    case 43:
                        return context$3$0.delegateYield(solve(color, km || 0), "t0", 44);

                    case 44:
                        move = context$3$0.t0;

                        move = tsumego.stone.km.set(move, km || 0);

                        if (Number.isFinite(km)) {
                            context$3$0.next = 51;
                            break;
                        }

                        km2 = move * color > 0 ? -color : color;
                        return context$3$0.delegateYield(solve(color, km2), "t1", 49);

                    case 49:
                        move2 = context$3$0.t1;

                        if (move2 * color > 0 && tsumego.stone.hascoords(move2)) {
                            move = move2;
                            move = tsumego.stone.km.set(move, km2);
                        }

                    case 51:
                        move = tsumego.repd.set(move, 0);
                        return context$3$0.abrupt("return", typeof args === 'string' ? tsumego.stone.toString(move) : move);

                    case 53:
                    case "end":
                        return context$3$0.stop();
                }
            }, marked2$0[0], this);
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
                (function () {
                    var sgf = tsumego.SGF.parse(args);
                    if (!sgf) throw SyntaxError('Invalid SGF.');
                    var errors = [];
                    var exec = function exec(fn, em) {
                        try {
                            return fn();
                        } catch (e) {
                            errors.push(em || e && e.message);
                        }
                    };
                    var board = exec(function () {
                        return new tsumego.Board(sgf);
                    });
                    var target = exec(function () {
                        return tsumego.stone.fromString(sgf.get('MA')[0]);
                    }, 'MA[xy] must specify the target white stone.');
                    if (errors.length) throw SyntaxError('The SGF does not correctly describe a tsumego:\n\t' + errors.join('\n\t'));
                    var tb = board.get(target);
                    args = {
                        color: null,
                        board: board,
                        tt: new tsumego.TT(),
                        expand: tsumego.mgen.fixed(board, target),
                        target: target
                    };
                })();
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
        Solver.prototype.threats = regeneratorRuntime.mark(function threats(color) {
            var _iterator32, _isArray32, _i32, _ref31, move, resp;

            return regeneratorRuntime.wrap(function threats$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        if (!(typeof color === 'string')) {
                            context$3$0.next = 4;
                            break;
                        }

                        color = tsumego.stone.label.color(color);

                        if (color) {
                            context$3$0.next = 4;
                            break;
                        }

                        throw Error('Invalid color value. Consider W or B.');

                    case 4:
                        _iterator32 = this.args.expand(color), _isArray32 = Array.isArray(_iterator32), _i32 = 0, _iterator32 = _isArray32 ? _iterator32 : _iterator32[Symbol.iterator]();

                    case 5:
                        if (!_isArray32) {
                            context$3$0.next = 11;
                            break;
                        }

                        if (!(_i32 >= _iterator32.length)) {
                            context$3$0.next = 8;
                            break;
                        }

                        return context$3$0.abrupt("break", 24);

                    case 8:
                        _ref31 = _iterator32[_i32++];
                        context$3$0.next = 15;
                        break;

                    case 11:
                        _i32 = _iterator32.next();

                        if (!_i32.done) {
                            context$3$0.next = 14;
                            break;
                        }

                        return context$3$0.abrupt("break", 24);

                    case 14:
                        _ref31 = _i32.value;

                    case 15:
                        move = _ref31;

                        if (!this.args.board.play(move)) {
                            context$3$0.next = 22;
                            break;
                        }

                        resp = this.solve(color);

                        this.args.board.undo();

                        if (!(resp * color > 0)) {
                            context$3$0.next = 22;
                            break;
                        }

                        context$3$0.next = 22;
                        return tsumego.stone.toString(move);

                    case 22:
                        context$3$0.next = 5;
                        break;

                    case 24:
                    case "end":
                        return context$3$0.stop();
                }
            }, threats, this);
        });
        Solver.prototype.proofs = regeneratorRuntime.mark(function proofs(player) {
            var color, move, km, _iterator33, _isArray33, _i33, _ref32, _move4, resp;

            return regeneratorRuntime.wrap(function proofs$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        color = typeof player === 'string' ? tsumego.stone.label.color(player) : player;

                        if (color) {
                            context$3$0.next = 3;
                            break;
                        }

                        throw Error('Invalid color value. Consider W or B.');

                    case 3:
                        move = this.solve(color);
                        km = tsumego.stone.km.get(move);

                        if (!(move * color < 0)) {
                            context$3$0.next = 7;
                            break;
                        }

                        return context$3$0.abrupt("return");

                    case 7:
                        _iterator33 = this.args.expand(color), _isArray33 = Array.isArray(_iterator33), _i33 = 0, _iterator33 = _isArray33 ? _iterator33 : _iterator33[Symbol.iterator]();

                    case 8:
                        if (!_isArray33) {
                            context$3$0.next = 14;
                            break;
                        }

                        if (!(_i33 >= _iterator33.length)) {
                            context$3$0.next = 11;
                            break;
                        }

                        return context$3$0.abrupt("break", 28);

                    case 11:
                        _ref32 = _iterator33[_i33++];
                        context$3$0.next = 18;
                        break;

                    case 14:
                        _i33 = _iterator33.next();

                        if (!_i33.done) {
                            context$3$0.next = 17;
                            break;
                        }

                        return context$3$0.abrupt("break", 28);

                    case 17:
                        _ref32 = _i33.value;

                    case 18:
                        _move4 = _ref32;

                        if (this.play(_move4)) {
                            context$3$0.next = 21;
                            break;
                        }

                        return context$3$0.abrupt("continue", 26);

                    case 21:
                        resp = this.solve(-color, km);

                        this.undo();

                        if (!(resp * color > 0)) {
                            context$3$0.next = 26;
                            break;
                        }

                        context$3$0.next = 26;
                        return typeof player === 'string' ? tsumego.stone.toString(_move4) : _move4;

                    case 26:
                        context$3$0.next = 8;
                        break;

                    case 28:
                    case "end":
                        return context$3$0.stop();
                }
            }, proofs, this);
        });

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
        Solver.prototype.tree = regeneratorRuntime.mark(function tree(player, depth) {
            var debuginfo = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var marked3$0, color, move, km, self, cache, board, target, expand, pathto, parent, correct, terminal, treesize, add, UserError, deepen, leaves, root, size, _iterator36, _isArray36, _i36, _ref35, _leaf, width, leaf, final;

            return regeneratorRuntime.wrap(function tree$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        final = function final(tree) {
                            for (var _move7 in tree) {
                                if (!leaf(tree[_move7])) return false;
                            }return true;
                        };

                        leaf = function leaf(tree) {
                            return width(tree) < 1;
                        };

                        width = function width(tree) {
                            return Object.keys(tree).length;
                        };

                        leaves = function leaves(tree) {
                            var _move6;

                            return regeneratorRuntime.wrap(function leaves$(context$4$0) {
                                while (1) switch (context$4$0.prev = context$4$0.next) {
                                    case 0:
                                        context$4$0.t0 = regeneratorRuntime.keys(tree);

                                    case 1:
                                        if ((context$4$0.t1 = context$4$0.t0()).done) {
                                            context$4$0.next = 8;
                                            break;
                                        }

                                        _move6 = context$4$0.t1.value;

                                        if (!board.play(tsumego.stone.fromString(_move6))) debugger; // the tree is messed up
                                        return context$4$0.delegateYield(leaves(tree[_move6]), "t2", 5);

                                    case 5:
                                        board.undo();
                                        context$4$0.next = 1;
                                        break;

                                    case 8:
                                        if (!leaf(tree)) {
                                            context$4$0.next = 11;
                                            break;
                                        }

                                        context$4$0.next = 11;
                                        return tree;

                                    case 11:
                                    case "end":
                                        return context$4$0.stop();
                                }
                            }, marked3$0[1], this);
                        };

                        deepen = function deepen(tree) {
                            var sgf, _iterator34, _isArray34, _i34, _ref33, _move5, subtree, dead, resp, hasThreats, _iterator35, _isArray35, _i35, _ref34, threat, d, node, pass;

                            return regeneratorRuntime.wrap(function deepen$(context$4$0) {
                                while (1) switch (context$4$0.prev = context$4$0.next) {
                                    case 0:
                                        sgf = board.sgf;
                                        _iterator34 = expand(color), _isArray34 = Array.isArray(_iterator34), _i34 = 0, _iterator34 = _isArray34 ? _iterator34 : _iterator34[Symbol.iterator]();

                                    case 2:
                                        if (!_isArray34) {
                                            context$4$0.next = 8;
                                            break;
                                        }

                                        if (!(_i34 >= _iterator34.length)) {
                                            context$4$0.next = 5;
                                            break;
                                        }

                                        return context$4$0.abrupt("break", 72);

                                    case 5:
                                        _ref33 = _iterator34[_i34++];
                                        context$4$0.next = 12;
                                        break;

                                    case 8:
                                        _i34 = _iterator34.next();

                                        if (!_i34.done) {
                                            context$4$0.next = 11;
                                            break;
                                        }

                                        return context$4$0.abrupt("break", 72);

                                    case 11:
                                        _ref33 = _i34.value;

                                    case 12:
                                        _move5 = _ref33;

                                        if (!board.play(_move5)) {
                                            context$4$0.next = 70;
                                            break;
                                        }

                                        subtree = add(tree, _move5);
                                        context$4$0.next = 17;
                                        return pathto.get(subtree);

                                    case 17:
                                        if (!context$4$0.sent) {
                                            context$4$0.next = 19;
                                            break;
                                        }

                                        throw new UserError();

                                    case 19:
                                        dead = !board.get(target);
                                        resp = !dead && self.solve(-color, km);

                                        if (!(dead || resp * color > 0)) {
                                            context$4$0.next = 55;
                                            break;
                                        }

                                        // this is a correct move: add strongest responses                           
                                        correct.set(subtree, true);

                                        if (dead) {
                                            context$4$0.next = 52;
                                            break;
                                        }

                                        hasThreats = false;
                                        _iterator35 = self.threats(-color), _isArray35 = Array.isArray(_iterator35), _i35 = 0, _iterator35 = _isArray35 ? _iterator35 : _iterator35[Symbol.iterator]();

                                    case 26:
                                        if (!_isArray35) {
                                            context$4$0.next = 32;
                                            break;
                                        }

                                        if (!(_i35 >= _iterator35.length)) {
                                            context$4$0.next = 29;
                                            break;
                                        }

                                        return context$4$0.abrupt("break", 41);

                                    case 29:
                                        _ref34 = _iterator35[_i35++];
                                        context$4$0.next = 36;
                                        break;

                                    case 32:
                                        _i35 = _iterator35.next();

                                        if (!_i35.done) {
                                            context$4$0.next = 35;
                                            break;
                                        }

                                        return context$4$0.abrupt("break", 41);

                                    case 35:
                                        _ref34 = _i35.value;

                                    case 36:
                                        threat = _ref34;

                                        hasThreats = true;
                                        return context$4$0.abrupt("break", 41);

                                    case 39:
                                        context$4$0.next = 26;
                                        break;

                                    case 41:
                                        if (!hasThreats) {
                                            context$4$0.next = 52;
                                            break;
                                        }

                                        if (!(board.hash in cache)) {
                                            context$4$0.next = 46;
                                            break;
                                        }

                                        context$4$0.t0 = cache[board.hash];
                                        context$4$0.next = 49;
                                        break;

                                    case 46:
                                        context$4$0.next = 48;
                                        return tsumego.stone.label.string(-color);

                                    case 48:
                                        context$4$0.t0 = context$4$0.sent;

                                    case 49:
                                        threat = context$4$0.t0;

                                        cache[board.hash] = threat;
                                        // the UI gives null if the variation needs to end here
                                        if (threat) add(subtree, threat);

                                    case 52:
                                        // now this player can ignore any next move:
                                        // no need to deepen further this branch
                                        if (leaf(subtree)) terminal.set(subtree, true);
                                        context$4$0.next = 69;
                                        break;

                                    case 55:
                                        if (tsumego.stone.hascoords(resp)) {
                                            context$4$0.next = 59;
                                            break;
                                        }

                                        // hmm.. the opponent needs to pass; this usually happens
                                        // when the result is seki, but also might happen when the
                                        // opponent needs to drop external ko treats and recapture
                                        terminal.set(subtree, true);
                                        context$4$0.next = 69;
                                        break;

                                    case 59:
                                        d = 0;
                                        node = subtree;

                                    case 61:
                                        if (!node) {
                                            context$4$0.next = 67;
                                            break;
                                        }

                                        if (!correct.has(node)) {
                                            context$4$0.next = 64;
                                            break;
                                        }

                                        return context$4$0.abrupt("break", 67);

                                    case 64:
                                        node = parent.get(node), d++;
                                        context$4$0.next = 61;
                                        break;

                                    case 67:
                                        // d is always even as it counts the number of black/white paired moves
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
                                            pass = self.solve(color, km);

                                            if (pass * color > 0) {
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

                                    case 69:
                                        board.undo();

                                    case 70:
                                        context$4$0.next = 2;
                                        break;

                                    case 72:
                                    case "end":
                                        return context$4$0.stop();
                                }
                            }, marked3$0[0], this);
                        };

                        add = function add(tree, move) {
                            if (typeof move === 'number') move = tsumego.stone.toString(move);
                            var node = {};
                            tree[move] = node;
                            parent.set(node, tree);
                            pathto.set(node, (pathto.get(tree) || '') + ';' + move);
                            for (var x = node; x; x = parent.get(x)) {
                                treesize.set(x, (treesize.get(x) || 0) + 1);
                            }return node;
                        };

                        marked3$0 = [deepen, leaves].map(regeneratorRuntime.mark);
                        color = typeof player === 'string' ? tsumego.stone.label.color(player) : player;

                        if (color) {
                            context$3$0.next = 10;
                            break;
                        }

                        throw Error('Invalid color value. Consider W or B.');

                    case 10:
                        move = this.solve(color);
                        km = tsumego.stone.km.get(move);

                        if (!(move * color < 0)) {
                            context$3$0.next = 14;
                            break;
                        }

                        throw Error('There is no correct variation here.');

                    case 14:
                        self = this;
                        cache = {};
                        board = this.args.board;
                        target = this.args.target;
                        expand = this.args.expand;
                        pathto = new WeakMap();
                        parent = new WeakMap();
                        correct = new WeakMap();
                        terminal = new WeakMap();
                        treesize = new WeakMap();

                        UserError = (function (_Error) {
                            _inherits(UserError, _Error);

                            function UserError() {
                                _classCallCheck(this, UserError);

                                _Error.call(this);
                            }

                            // adds a disproof for every wrong move and
                            // a strongest response for every correct move
                            return UserError;
                        })(Error);

                        root = {};

                    case 26:
                        if (!true) {
                            context$3$0.next = 58;
                            break;
                        }

                        size = treesize.get(root) || 0;
                        _iterator36 = leaves(root), _isArray36 = Array.isArray(_iterator36), _i36 = 0, _iterator36 = _isArray36 ? _iterator36 : _iterator36[Symbol.iterator]();

                    case 29:
                        if (!_isArray36) {
                            context$3$0.next = 35;
                            break;
                        }

                        if (!(_i36 >= _iterator36.length)) {
                            context$3$0.next = 32;
                            break;
                        }

                        return context$3$0.abrupt("break", 53);

                    case 32:
                        _ref35 = _iterator36[_i36++];
                        context$3$0.next = 39;
                        break;

                    case 35:
                        _i36 = _iterator36.next();

                        if (!_i36.done) {
                            context$3$0.next = 38;
                            break;
                        }

                        return context$3$0.abrupt("break", 53);

                    case 38:
                        _ref35 = _i36.value;

                    case 39:
                        _leaf = _ref35;

                        if (!terminal.get(_leaf)) {
                            context$3$0.next = 42;
                            break;
                        }

                        return context$3$0.abrupt("continue", 51);

                    case 42:
                        context$3$0.prev = 42;
                        return context$3$0.delegateYield(deepen(_leaf), "t0", 44);

                    case 44:
                        context$3$0.next = 51;
                        break;

                    case 46:
                        context$3$0.prev = 46;
                        context$3$0.t1 = context$3$0["catch"](42);

                        if (!(context$3$0.t1 instanceof UserError)) {
                            context$3$0.next = 50;
                            break;
                        }

                        return context$3$0.abrupt("break", 53);

                    case 50:
                        throw context$3$0.t1;

                    case 51:
                        context$3$0.next = 29;
                        break;

                    case 53:
                        if (!(treesize.get(root) == size)) {
                            context$3$0.next = 55;
                            break;
                        }

                        return context$3$0.abrupt("break", 58);

                    case 55:
                        console.log('added', treesize.get(root) - size, 'nodes');
                        context$3$0.next = 26;
                        break;

                    case 58:
                        return context$3$0.abrupt("return", (function stringify(tree) {
                            var d = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

                            var vars = [];
                            for (var _move8 in tree) {
                                var subtree = tree[_move8];
                                // there is no point to explicitly list wrong moves, e.g. ;B[ef];W[cc];B[df]C[WRONG]
                                if (tsumego.stone.fromString(_move8) * color > 0 && !correct.has(subtree) && leaf(subtree)) continue;
                                var line = ';' + _move8;
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
                        })(root));

                    case 59:
                    case "end":
                        return context$3$0.stop();
                }
            }, tree, this, [[42, 46]]);
        });

        _createClass(Solver, [{
            key: "board",
            get: function get() {
                return this.args.board;
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
// path[i] = hash of the i-th position
// this is to detect long loops, e.g. the 10,000 year ko
// the sequence of moves that leads to the current position

// due to collisions, tt may give a result for a different position;
// however with 64 bit hashes, there expected to be just one collision
// per sqrt(2 * 2**64) = 6 billions positions = 12 billion w/b nodes

// skip moves that are known to be losing
// tells which position, who plays and who is the km

// restore the path from the history of moves

// if it's a loss, see what happens if there are ko treats;
// if it's a win, try to find a stronger move, when the opponent has ko treats

// can the opponent win with the same km level?

// tsc@2.0.0 doesn't see that this yield either
// always returns a string or always returns stone;
// so the derived return type is Iterable<string|stone>
// which is compatible neither with Iterable<string>
// or Iterable<stone>

// first find the best solution, see if
// it even exists and see who needs
// to be the ko master; i.e. if the found
// solution is "B wins even if W is the km"
// then there will be no point to consider
// variations in which B wins when B is the km
// contuations chosen by the user

// check if there are any threats before
// bothering the user to pick one

// ask the UI to give the best response;
// another option would be to somehow rank
// moves returned by threats(-color) and
// pick the stongest one; a probably good
// heuristics is the max number of threatening,
// moves that the losing player can make; such
// moves are also called ko treats and it's
// better to maximize the number of ko treats

// this is wrong move: add the found disproof;
// check first if this wrong line is not too long

// check if the opponent even needs to answer

// danger: this should be at the end,
// as otherwise the caller may insert
// subnodes and for-in above will happily
// list them as well
// user has lost patience

// nothing has been added: no need to proceed;
// usually, variations end at depth 14-15, if
// no static analysis is applied

// the idea is to detect branches like (;B[ef]C[RIGHT];W[fg])
// the W[fg] move is really not needed there
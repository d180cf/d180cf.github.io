"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var testbench;
(function (testbench) {
    'use strict';

    var Subscription = function Subscription(dispose) {
        _classCallCheck(this, Subscription);

        this.dispose = dispose;
    };

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
            var listener = function listener(event) {
                if (event.which != key) return;
                handler(event);
            };
            document.addEventListener('keydown', listener);
            return new Subscription(function () {
                return document.removeEventListener('keydown', listener);
            });
        }
        keyboard.hook = hook;
    })(keyboard = testbench.keyboard || (testbench.keyboard = {}));
})(testbench || (testbench = {}));
function send(method, url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.send();
        xhr.onreadystatechange = function (event) {
            if (xhr.readyState == xhr.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);else reject(Error(method + ' ' + url + ' => ' + xhr.status));
            }
        };
    });
}
var testbench;
(function (testbench) {
    var name = 'tsumego.js';
    var storage = localStorage;
    testbench.ls = Object.defineProperties({
        /** A callback that's invoked once an entry is removed. */
        removed: [],
        /** A callback that's invoked once an entry is added. */
        added: [],

        set: function set(path, sgf) {
            var json = testbench.ls.data;
            var wasthere = !!json[path];
            json[path] = sgf || undefined;
            testbench.ls.data = json;
            if (wasthere && !sgf) for (var fn of this.removed) {
                fn(path);
            }if (!wasthere && sgf) for (var fn of this.added) {
                fn(path, sgf);
            }
        }
    }, {
        data: {
            get: function get() {
                return JSON.parse(storage.getItem(name)) || {};
            },
            set: function set(json) {
                storage.setItem(name, JSON.stringify(json));
            },
            configurable: true,
            enumerable: true
        }
    });
})(testbench || (testbench = {}));
var tsumego;
(function (tsumego) {
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
    tsumego.nesw = [[-1, 0], [+1, 0], [0, -1], [0, +1]];
    function* region(root, belongs) {
        var neighbors = arguments.length <= 2 || arguments[2] === undefined ? tsumego.stone.neighbors : arguments[2];

        var body = [];
        var edge = [root];
        while (edge.length > 0) {
            var xy = edge.pop();
            yield xy;
            body.push(xy);
            for (var nxy of neighbors(xy)) {
                if (belongs(nxy, xy) && body.indexOf(nxy) < 0 && edge.indexOf(nxy) < 0) edge.push(nxy);
            }
        }
    }
    tsumego.region = region;

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

        function SortedArray(compare) {
            _classCallCheck(this, SortedArray);

            this.compare = compare;
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
            var compare = this.compare;

            var i = items.length;
            while (i > 0 && compare(flags[i - 1], flag) > 0) i--;
            // using .push when i == n and .unshift when i == 0
            // won't make the solver run faster
            items.splice(i, 0, item);
            flags.splice(i, 0, flag);
            return i;
        };

        return SortedArray;
    })();

    tsumego.SortedArray = SortedArray;
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
    function stone(x, y, color) {
        return x | y << 4 | kCoord | (color && kColor) | color & kWhite;
    }
    tsumego.stone = stone;
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
            return !((a ^ b) & 0xFFFF);
        };
        stone.dist = function (a, b) {
            return Math.abs(stone.x(a) - stone.x(b)) + Math.abs(stone.y(a) - stone.y(b));
        };
        stone.neighbors = function (m) {
            var _stone$coords = stone.coords(m);

            var x = _stone$coords[0];
            var y = _stone$coords[1];

            var c = stone.color(m);
            return [x <= 0x0 ? 0 : stone(x - 1, y, c), x >= 0xF ? 0 : stone(x + 1, y, c), y <= 0x0 ? 0 : stone(x, y - 1, c), y >= 0xF ? 0 : stone(x, y + 1, c)];
        };
        stone.diagonals = function (m) {
            var _stone$coords2 = stone.coords(m);

            var x = _stone$coords2[0];
            var y = _stone$coords2[1];

            var c = stone.color(m);
            return [x <= 0x0 || y <= 0x0 ? 0 : stone(x - 1, y - 1, c), x >= 0xF || y <= 0x0 ? 0 : stone(x + 1, y - 1, c), x <= 0x0 || y >= 0xF ? 0 : stone(x - 1, y + 1, c), x >= 0xF || y >= 0xF ? 0 : stone(x + 1, y + 1, c)];
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
                for (var x of this.stones) {
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

            SmallSet.prototype[Symbol.iterator] = function* () {
                for (var s of this.stones) {
                    yield s;
                }
            };

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
        function toString(m) {
            var c = stone.color(m);

            var _stone$coords3 = stone.coords(m);

            var x = _stone$coords3[0];
            var y = _stone$coords3[1];

            var s = !stone.hascoords(m) ? null : n2s(x) + n2s(y);
            var t = c > 0 ? 'B' : 'W';
            return !c ? s : !s ? t : t + '[' + s + ']';
        }
        stone.toString = toString;
        function fromString(s) {
            if (s == 'B' || s == 'B[]') return stone.nocoords(+1);
            if (s == 'W' || s == 'W[]') return stone.nocoords(-1);
            if (!/^[BW]\[[a-z]{2}\]|[a-z]{2}$/.test(s)) throw SyntaxError('Invalid move: ' + s);
            var c = ({ B: +1, W: -1 })[s[0]] || 0;
            if (c) s = s.slice(2);
            var x = s2n(s[0]);
            var y = s2n(s[1]);
            return stone(x, y, c);
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
                var xs = String.fromCharCode('A'.charCodeAt(0) + (x < 8 ? x : x - 1)); // skip the I letter
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
                    for (var p of r) {
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
                for (var p of ps) {
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
            return block(tsumego.min(block.xmin(b1), block.xmin(b2)), tsumego.max(block.xmax(b1), block.xmax(b2)), tsumego.min(block.ymin(b1), block.ymin(b2)), tsumego.max(block.ymax(b1), block.ymax(b2)), 0, 0, 0);
        };
        /** A pseudo block descriptor with 1 liberty. */
        block.lib1 = block(0, 0, 0, 0, 1, 0, 0);
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
            this.hashtb = tsumego.sequence(256, tsumego.rand).map(function (x) {
                return x & 0x0000FFFF;
            });
            this.hashtw = tsumego.sequence(256, tsumego.rand).map(function (x) {
                return x & 0xFFFF0000;
            });
            if (typeof size === 'string' || typeof size === 'object') this.initFromSGF(size, setup);else if (typeof size === 'number') {
                this.init(size);
                if (setup instanceof Array) this.initFromTXT(setup);
            }
            this.drop();
        }

        Board.prototype.init = function init(size) {
            if (size > 16) throw Error("Board " + size + "x" + size + " is too big. Up to 16x16 boards are supported.");
            this.size = size;
            this.table = new Array(size * size);
            this.drop();
            for (var i = 0; i < size * size; i++) {
                this.table[i] = 0;
            }
        };

        Board.prototype.initFromTXT = function initFromTXT(rows) {
            var _this3 = this;

            rows.map(function (row, y) {
                row.replace(/\s/g, '').split('').map(function (chr, x) {
                    var c = chr == 'X' ? +1 : chr == 'O' ? -1 : 0;
                    if (c && !_this3.play(tsumego.stone(x, y, c))) throw new Error('Invalid setup.');
                });
            });
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
                for (var xy of stones) {
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
        };

        /**
         * Drops all the history.
         */

        Board.prototype.drop = function drop() {
            this.history = { added: [], hashes: [], changed: [] };
        };

        /**
         * Clones the board and without the history of moves.
         * It essentially creates a shallow copy of the board.
         */

        Board.prototype.fork = function fork() {
            var b = new Board(0);
            b.size = this.size;
            b.hash = this.hash;
            b.table = this.table.slice(0);
            b.blocks = this.blocks.slice(0);
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
            return this.isInBounds(x, y) ? this.lift(this.table[y * this.size + x]) : 0;
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
            var hasht = bd > 0 ? this.hashtb : this.hashtw;

            var _block$dims = block.dims(bd);

            var xmin = _block$dims[0];
            var xmax = _block$dims[1];
            var ymin = _block$dims[2];
            var ymax = _block$dims[3];

            for (var y = ymin; y <= ymax; y++) {
                for (var x = xmin; x <= xmax; x++) {
                    if (this.getBlockId(x, y) == id) this.hash ^= hasht[y * this.size + x], this.adjust(x, y, -bd, +1);
                }
            }this.change(id, 0);
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
            return this.isInBounds(x, y);
        };

        Board.prototype.isInBounds = function isInBounds(x, y) {
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
            var color = tsumego.stone.color(move);
            var x = tsumego.stone.x(move);
            var y = tsumego.stone.y(move);
            if (!color || !tsumego.stone.hascoords(move) || this.getBlockId(x, y)) return 0;
            var size = this.size;
            var hash = this.hash;
            var n_changed = this.history.changed.length / 2; // id1, bd1, id2, bd2, ...
            var ids = this.getNbBlockIds(x, y);
            var nbs = [0, 0, 0, 0];
            var lib = [0, 0, 0, 0];
            for (var i = 0; i < 4; i++) {
                nbs[i] = this.blocks[ids[i]], lib[i] = block.libs(nbs[i]);
            } // remove captured blocks           
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
                if (nbs[i] * color > 0 && ids[i] < id_new) id_new = ids[i], is_new = false;
            }var id_old = this.table[y * size + x];
            this.table[y * size + x] = id_new;
            this.hash ^= (color > 0 ? this.hashtb : this.hashtw)[y * size + x];
            if (is_new) {
                // create a new block if the new stone has no neighbors
                var n =
                /* L */+(!nbs[0] && x > 0) +
                /* R */+(!nbs[1] && x < size - 1) +
                /* T */+(!nbs[2] && y > 0) +
                /* B */+(!nbs[3] && y < size - 1);
                this.change(id_new, block(x, x, y, y, n, 1, color));
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
                    if (id != id_new) this.change(id, block(0, 0, 0, 0, id_new, 0, 0));
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
                this.change(id_new, block(xmin_new, xmax_new, ymin_new, ymax_new, libs_new, size_new, color));
            }
            this.history.added.push(x | y << 4 | this.history.changed.length / 2 - n_changed << 8 | id_old << 16 | color & 0x80000000);
            this.history.hashes.push(hash);
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
            var c = move & 0x80000000;
            var n = move >> 8 & 255;
            var b = move >> 16 & 255;
            this.table[y * this.size + x] = b;
            this.hash = this.history.hashes.pop();
            for (var i = 0; i < n; i++) {
                var bd = this.history.changed.pop();
                var id = this.history.changed.pop();
                // when a new block is added, the corresponding
                // record in the history looks like changing
                // the last block from 0 to something;; to undo
                // this properly, the last element in the array
                // needs to be removed as well
                if (id == this.blocks.length - 1 && !bd) this.blocks.pop();else this.blocks[id] = bd;
            }
            return tsumego.stone(x, y, c || +1);
        };

        Board.prototype.toStringCompact = function toStringCompact() {
            var n = this.size;
            var h = '',
                len = 0;
            for (var y = 0; y < n; y++) {
                var rx = h.length;
                for (var x = 0; x < n; x++) {
                    var b = this.get(x, y);
                    h += b > 0 ? 'X' : b < 0 ? 'O' : '-';
                    if (b) len = rx = h.length;
                }
                h = h.slice(0, rx) + ';';
            }
            return n + 'x' + n + '(' + h.slice(0, len) + ')';
        };

        Board.prototype.toStringSGF = function toStringSGF() {
            var _this5 = this;

            var indent = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

            var take = function take(pf, fn) {
                var list = '';
                for (var y = 0; y < _this5.size; y++) {
                    for (var x = 0; x < _this5.size; x++) {
                        if (fn(_this5.get(x, y))) list += tsumego.stone.toString(tsumego.stone(x, y, +1)).slice(1);
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
                s += '  ';
                for (var x = 0; x <= xmax; x++) {
                    s += ' ' + String.fromCharCode(0x41 + (x < 8 ? x : x + 1));
                } // skip I
            }
            for (var y = 0; y <= ymax; y++) {
                if (s) s += '\n';
                if (!hideLabels) {
                    var n = this.size - y + '';
                    s += n.length < 2 ? ' ' + n : n;
                    ;
                }
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

        Board.prototype.stones = function* stones() {
            for (var x = 0; x < this.size; x++) {
                for (var y = 0; y < this.size; y++) {
                    var s = this.get(x, y);
                    if (s) yield tsumego.stone(x, y, s);
                }
            }
        };

        Board.prototype.diff = function diff(from, to) {
            var hash = from ^ to;
            if (!hash) return 0;
            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    var i = y * this.size + x;
                    if (this.hashtb[i] == (hash & 0x0000FFFF)) return tsumego.stone(x, y, +1);
                    if (this.hashtw[i] == (hash & 0xFFFF0000)) return tsumego.stone(x, y, -1);
                }
            }
            return null;
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
            for (var _ref2 of this.edge(b)) {
                var x = _ref2[0];
                var y = _ref2[1];

                if (!this.get(x, y)) yield [x, y];
            }
        };

        /** All cells adjacent to the block: empty and occupied by the opponent. */

        Board.prototype.edge = function* edge(b) {
            if (!b) return;

            var _block$dims3 = block.dims(b);

            var xmin = _block$dims3[0];
            var xmax = _block$dims3[1];
            var ymin = _block$dims3[2];
            var ymax = _block$dims3[3];

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

        /**
         * for (const [x, y] of board.list(block))
         *      console.log("a stone of the block", x, y);
         */

        Board.prototype.list = function* list(b) {
            if (!b) return;

            var _block$dims4 = block.dims(b);

            var xmin = _block$dims4[0];
            var xmax = _block$dims4[1];
            var ymin = _block$dims4[2];
            var ymax = _block$dims4[3];

            for (var x = xmin; x <= xmax; x++) {
                for (var y = ymin; y <= ymax; y++) {
                    if (this.get(x, y) == b) yield [x, y];
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

        Board.prototype.path = function path() {
            var moves = [];
            var path = [];
            var move = undefined;
            while (move = this.undo()) moves.unshift(move);
            for (move of moves) {
                path.push(this.fork());
                this.play(move);
            }
        };

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
    var Tags;
    (function (Tags) {
        Tags[Tags['X'] = 0] = 'X';
        Tags[Tags['O'] = 1] = 'O';
        Tags[Tags['-'] = 2] = '-';
        Tags[Tags['.'] = 3] = '.';
    })(Tags || (Tags = {}));
    var same = function same(m, b) {
        return (m.bits & b) === m.bits;
    };
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

    var Pattern = (function () {
        // the constructor can be very slow as every pattern
        // is constructed only once before the solver starts

        function Pattern(data) {
            _classCallCheck(this, Pattern);

            this.masks = [new Array()]; // 8 elements
            // m[0] = bits for X
            // m[1] = bits for O
            // m[2] = bits for -
            // m[3] = bits for .
            var m = this.masks;
            for (var i = 0; i < 4; i++) {
                m[0].push(new BitMatrix(3, 3));
            }for (var row = 0; row < data.length; row++) {
                for (var col = 0; col < data[row].length; col++) {
                    var tag = data[row].charAt(col).toUpperCase();
                    var mask = m[0][Tags[tag]];
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

        Pattern.take = function take(board, x0, y0, color) {
            // constructing and disposing an array at every call
            // might look very inefficient, but getting rid of it
            // by declaring this array as a variable outside the
            // method doesn't improve performance at all in V8
            var m = [0, 0, 0, 0];
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    var x = x0 + j - 1;
                    var y = y0 + i - 1;
                    var c = board.get(x, y);
                    var b = 1 << 3 * i + j;
                    if (c * color > 0) m[0] |= b; // a stone of the same color
                    else if (c * color < 0) m[1] |= b; // a stone of the opposite color
                        else if (!board.inBounds(x, y)) m[2] |= b; // a neutral stone (the wall)
                            else m[3] |= b; // a vacant intersection
                }
            }
            return m;
        };

        Pattern.prototype.test = function test(m) {
            search: for (var i = 0; i < 8; i++) {
                var w = this.masks[i];
                for (var j = 0; j < 4; j++) {
                    if (!same(w[j], m[j])) continue search;
                }return true;
            }
            return false;
        };

        Pattern.isEye = function isEye(board, x, y, color) {
            var snapshot = Pattern.take(board, x, y, color);
            var patterns = Pattern.uceyes;
            // for..of would create an iterator and make
            // the function about 2x slower overall
            for (var i = 0; i < patterns.length; i++) {
                if (patterns[i].test(snapshot)) return true;
            }return false;
        };

        return Pattern;
    })();

    Pattern.uceyes = [new Pattern(['XXX', 'X.X', 'XXX']), new Pattern(['XX?', 'X.X', 'XXX']), new Pattern(['XXX', 'X.X', '---']), new Pattern(['XX-', 'X.-', '---'])];
    tsumego.Pattern = Pattern;
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var mgen;
    (function (mgen) {
        function sumlibs(board, color) {
            var n = 0;
            for (var b of board.blocks) {
                if (b * color > 0) n += tsumego.block.libs(b);
            }return n;
        }
        mgen.sumlibs = sumlibs;
        function ninatari(board, color) {
            var n = 0;
            for (var i = 1; i < board.blocks.length; i++) {
                var b = board.blocks[i];
                if (tsumego.block.size(b) > 0 && b * color > 0 && tsumego.block.libs(b) == 1) n++;
            }
            return n;
        }
        mgen.ninatari = ninatari;
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
    var mgen;
    (function (mgen) {
        var MvsOrd = (function () {
            function MvsOrd(board, target) {
                _classCallCheck(this, MvsOrd);

                this.board = board;
                this.target = target;
                /** Defines the order in which the solver considers moves. */
                this.sa = new tsumego.SortedArray(function (a, b) {
                    return b.r - a.r || a.u - b.u || b.p - a.p || b.v - a.v || a.q - b.q || tsumego.random() - 0.5;
                });
            }

            MvsOrd.prototype.reset = function reset() {
                return this.sa.reset();
            };

            MvsOrd.prototype.insert = function insert(x, y, color) {
                var board = this.board;
                if (tsumego.Pattern.isEye(board, x, y, color)) return false;
                var s = tsumego.stone(x, y, color);
                var r = board.play(s);
                if (!r) return false;
                var t = board.get(this.target);
                var isSelfAtari = t * color > 0 && tsumego.block.libs(t) < 2;
                if (!isSelfAtari) {
                    this.sa.insert(s, {
                        r: r,
                        p: mgen.sumlibs(board, +color),
                        q: mgen.sumlibs(board, -color),
                        u: mgen.ninatari(board, +color),
                        v: mgen.ninatari(board, -color)
                    });
                }
                board.undo();
                return true;
            };

            return MvsOrd;
        })();

        mgen.MvsOrd = MvsOrd;
    })(mgen = tsumego.mgen || (tsumego.mgen = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    var mgen;
    (function (mgen) {
        /** Basic moves generator. Tries to maximize libs. */
        function fixed(board, target) {
            var maxsize = arguments.length <= 2 || arguments[2] === undefined ? 30 : arguments[2];

            var sa = new mgen.MvsOrd(board, target);
            var ts = board.get(target);
            var rzone = new tsumego.stone.SmallSet();
            var same = function same(u, v) {
                return board.inBounds(u) && board.inBounds(v) && board.get(u) * ts >= 0 && board.get(v) * ts >= 0;
            };
            var neighbors = function neighbors(x) {
                return [].concat(tsumego.stone.diagonals(x), tsumego.stone.neighbors(x));
            };
            // get stones reachable with the 8 moves: direct + diagonal
            for (var rs of tsumego.region(target, same, neighbors)) {
                rs && rzone.add(rs);
            } // find blocks of the same color adjacent to rzone
            var adjacent = [];
            for (var rs of rzone) {
                for (var ns of tsumego.stone.neighbors(rs)) {
                    var b = board.get(ns);
                    if (b * ts < 0 && adjacent.indexOf(b) < 0) adjacent.push(b);
                }
            }
            // find blocks with all the libs in rzone
            var inner = [];
            test: for (var b of adjacent) {
                for (var _ref32 of board.libs(b)) {
                    var x = _ref32[0];
                    var y = _ref32[1];

                    if (!rzone.has(tsumego.stone(x, y, 0))) continue test;
                }inner.push(b);
            }
            // and add those blocks to the rzone as they may be captured
            for (var b of inner) {
                for (var _ref42 of board.list(b)) {
                    var x = _ref42[0];
                    var y = _ref42[1];

                    rzone.add(tsumego.stone(x, y, 0));
                }
            } // remove the target block from the rzone
            rzone.remove(function (s) {
                return board.get(s) == ts;
            });
            if (rzone.size > maxsize) throw new Error("The number of possible moves " + rzone.size + " is more than " + maxsize);
            return function (color) {
                var moves = sa.reset();
                for (var move of rzone) {
                    var x = tsumego.stone.x(move);
                    var y = tsumego.stone.y(move);
                    sa.insert(x, y, color);
                }
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
                var ord = new mgen.MvsOrd(board, target);
                var moves = ord.reset();
                for (var s of nocolor) {
                    ord.insert(tsumego.stone.x(s), tsumego.stone.y(s), color);
                }return moves;
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
                                for (var _ref52 of board.neighbors(x, y)) {
                                    var nx = _ref52[0];
                                    var ny = _ref52[1];

                                    var nb = board.get(nx, ny);
                                    if (!nb) {
                                        // it's an empty cell
                                        dmap.set(nx, ny, d);
                                        // however if this cell is adjacent to a friendly block,
                                        // that block gets dist = d as well
                                        for (var _ref62 of board.neighbors(nx, ny)) {
                                            var nnx = _ref62[0];
                                            var nny = _ref62[1];

                                            if (nnx == nx && nny == ny) continue;
                                            var nnb = board.get(nnx, nny);
                                            if (nnb == tblock || nnb * tblock <= 0 || dmap.get(nnx, nny) <= d) continue;
                                            for (var _ref72 of board.list(nnb)) {
                                                var _x16 = _ref72[0];
                                                var _y3 = _ref72[1];

                                                dmap.set(_x16, _y3, d);
                                            }
                                        }
                                    } else if (nb * tblock < 0) {
                                        // it's an adjacent enemy block: check if it can be captured
                                        var rd = d + tsumego.block.libs(nb) - (cblock ? 1 : 0);
                                        if (rd <= maxdist) {
                                            ///console.log('enemy at', nx, ny, rd, '\n' + board);
                                            // it can be captured: now every lib
                                            // of the block is considered to be

                                            for (var _ref82 of board.edge(nb)) {
                                                var _x17 = _ref82[0];
                                                var _y4 = _ref82[1];

                                                var fb = board.get(_x17, _y4);
                                                // the target has d=0, no need to mark it with d=rd
                                                if (fb == tblock) continue;
                                                dmap.set(_x17, _y4, rd);
                                                // if the block being captured has other adjacent blocks,
                                                // those become reachable within rd steps as well                                           
                                                for (var _ref92 of board.list(fb)) {
                                                    var x1 = _ref92[0];
                                                    var y1 = _ref92[1];

                                                    dmap.set(x1, y1, rd);
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
                    state[board.hash] = 1;
                }
                /* Draft */if (goal == 2 /* Checked */) {
                        var checked = [];
                        // now play out every found move, generate moves for the opponent
                        // and check if the move still appears in that generated set; if
                        // it doesn't appear there, this means that the opponent can block
                        // the move and make it an overplay
                        for (var move of cache[board.hash]) {
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
                            for (var resp of generate(0, 1 /* Draft */)) {
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
/// <reference path="mgen/ord.ts" />
/// <reference path="mgen/fixed.ts" />
/// <reference path="mgen/dist.ts" />
var tsumego;
(function (tsumego) {
    /**
     * Using a plain {} or [] as a int32 -> int32 map
     * can be noticeably slower than a pair of arrays
     * where indexes are trimed to unsigned int31 numbers.
     */

    var Int32HashTable = (function () {
        function Int32HashTable() {
            _classCallCheck(this, Int32HashTable);

            this.data = [];
            for (var i = 0; i < 16; i++) {
                this.data[i] = [];
            }
        }

        Int32HashTable.prototype.get = function get(key) {
            return this.data[key >>> 28][key & 0x0FFFFFFF] || 0;
        };

        Int32HashTable.prototype.set = function set(key, val) {
            this.data[key >>> 28][key & 0x0FFFFFFF] = val;
        };

        return Int32HashTable;
    })();

    tsumego.Int32HashTable = Int32HashTable;
})(tsumego || (tsumego = {}));
/// <reference path="i32ht.ts" />
var tsumego;
(function (tsumego) {
    function entry(x, y, b, w, m) {
        return x | y << 4 | (b & 7) << 8 | (w & 7) << 11 | (m ? 0x8000 : 0);
    }
    var entry;
    (function (entry) {
        entry.get = function (s, color) {
            return (color > 0 ? s : s >> 16) & 0xFFFF;
        };
        entry.set = function (s, color, e) {
            return color > 0 ? s & ~0xFFFF | e : s & 0xFFFF | e << 16;
        };
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
    })(entry || (entry = {}));
    var entry;
    (function (entry) {
        var e = entry(0, 0, +3, -3, false);
        entry.base = e | e << 16;
    })(entry || (entry = {}));
    /** Transposition Table */

    var TT = (function () {
        function TT() {
            _classCallCheck(this, TT);

            this.size = 0;
            this.move = new tsumego.Int32HashTable(); // node -> stone
            this.data = new tsumego.Int32HashTable(); // node -> entry
        }

        TT.prototype.get = function get(hash, color, km) {
            var s = this.data.get(hash);
            if (!s) return 0;
            var e = entry.get(s, color);
            var winner = km >= entry.b(e) ? +1 : km <= entry.w(s) ? -1 : 0; // not solved for this number of ko treats
            if (!winner) return 0;
            // the move must be dropped if the outcome is a loss
            return winner * color > 0 && entry.m(e) ? tsumego.stone(entry.x(e), entry.y(e), winner) : tsumego.stone.nocoords(winner);
        };

        /**
         * @param color Who plays first.
         * @param move The outcome. Must have a color and may have coordinates.
         * @param km Must be either-1, +1 or 0.
         */

        TT.prototype.set = function set(hash, color, move, km) {
            if (km != -1 && km != +1 && km != 0 || !tsumego.stone.color(move)) throw Error('Invalid TT entry.');
            var s = this.data.get(hash) || ++this.size && entry.base;
            var e = entry.get(s, color);
            // The idea here is to not override the winning move.
            // A typical case is the bent 4 shape: B wins if there are
            // no ko treats and loses if W has ko treats. If the first
            // solution is written first, then the second solution shouldn't
            // override the winning move.

            var _ref10 = move * color > 0 ? [tsumego.stone.x(move), tsumego.stone.y(move), tsumego.stone.hascoords(move)] : [entry.x(e), entry.y(e), entry.m(e)];

            var x = _ref10[0];
            var y = _ref10[1];
            var hc = _ref10[2];

            var b = entry.b(e);
            var w = entry.w(e);
            var e2 = move > 0 && km < b ? entry(x, y, km, w, hc) : move < 0 && km > w ? entry(x, y, b, km, hc) : e;
            this.data.set(hash, entry.set(s, color, e2));
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
            search: for (var lib of tsumego.region(root, function (t, s) {
                return sameColor(s) && b.inBounds(t);
            })) {
                // the region(...) above enumerates stones in the chain and the liberties
                if (b.get(lib)) continue;
                // chains adjacent to the region
                var adjacent = [];
                var adjacentXY = [];
                for (var p of tsumego.region(lib, function (t, s) {
                    return !sameColor(t) && b.inBounds(t);
                })) {
                    // has this region been already marked as non vital to this chain?
                    if (visited[p]) continue search;
                    visited[p] = true;
                    var isAdjacent = false;
                    for (var q of tsumego.stone.neighbors(p)) {
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
/// <reference path="pattern.ts" />
/// <reference path="movegen.ts" />
/// <reference path="tt.ts" />
/// <reference path="benson.ts" />
/// <reference path="dcnn.ts" />
/// <reference path="gf2.ts" />
var tsumego;
(function (tsumego) {
    var infdepth = 255;
    var repd;
    (function (repd_1) {
        repd_1.get = function (move) {
            return move >> 8 & 255;
        };
        repd_1.set = function (move, repd) {
            return move & ~0xFF00 | repd << 8;
        };
    })(repd || (repd = {}));
    function solve(args) {
        var g = solve.start(args);
        var s = g.next();
        while (!s.done) s = g.next();
        return s.value;
    }
    tsumego.solve = solve;
    var solve;
    (function (solve_1) {
        function parse(data) {
            var sgf = tsumego.SGF.parse(data);
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
            var color = exec(function () {
                return sgf.get('PL')[0] == 'W' ? -1 : +1;
            }, 'PL[W] or PL[B] must tell who plays first.');
            var target = exec(function () {
                return tsumego.stone.fromString(sgf.get('MA')[0]);
            }, 'MA[xy] must specify the target white stone.');
            if (errors.length) throw SyntaxError('The SGF does not correctly describe a tsumego:\n\t' + errors.join('\n\t'));
            var tb = board.get(target);
            return {
                root: board,
                color: color,
                expand: tsumego.mgen.fixed(board, target),
                status: function status(b) {
                    return b.get(target) ? tb : -tb;
                },
                alive: function alive(b) {
                    return tsumego.benson.alive(b, target);
                }
            };
        }
        function* start(args) {
            var _ref11 = typeof args === 'string' ? parse(args) : args;

            var board = _ref11.root;
            var color = _ref11.color;
            var km = _ref11.km;
            var _ref11$tt = _ref11.tt;
            var tt = _ref11$tt === undefined ? new tsumego.TT() : _ref11$tt;
            var log = _ref11.log;
            var expand = _ref11.expand;
            var status = _ref11.status;
            var alive = _ref11.alive;
            var stats = _ref11.stats;
            var unodes = _ref11.unodes;
            var debug = _ref11.debug;
            var time = _ref11.time;

            if (log) {
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
            // tells who is being captured
            var target = status(board);
            /** Moves that require a ko treat are considered last.
                That's not just perf optimization: the search depends on this. */
            var sa = new tsumego.SortedArray(function (a, b) {
                return b.d - a.d || b.w - a.w;
            }); // first consider moves that lead to a winning position
            var path = []; // path[i] = hash of the i-th position
            function* solve(color, km) {
                remaining--;
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
                var hashb = board.hash;
                var ttres = tt.get(hashb, color, km);
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
                var guess = tt.move.get(hashb ^ color);
                var result = undefined;
                var mindepth = infdepth;
                var nodes = sa.reset();
                for (var _move of expand(color)) {
                    board.play(_move);
                    var hash = board.hash;
                    board.undo();
                    var d = depth - 1;
                    while (d >= 0 && path[d] != hash) d = d > 0 && path[d] == path[d - 1] ? -1 : d - 1;
                    d++;
                    if (!d) d = infdepth;
                    if (d < mindepth) mindepth = d;
                    // there are no ko treats to play this move,
                    // so play a random move elsewhere and yield
                    // the turn to the opponent; this is needed
                    // if the opponent is playing useless ko-like
                    // moves that do not help even if all these
                    // ko fights are won
                    if (d <= depth && km * color <= 0) continue;
                    sa.insert(repd.set(_move, d), {
                        d: d,
                        // use previously found solution as a hint
                        w: tsumego.stone.color(tt.move.get(hash ^ -color)) * color
                    });
                }
                // Consider making a pass as well. Passing locally is like
                // playing a move elsewhere and yielding the turn to the
                // opponent locally: it doesn't affect the local position,
                // but resets the local history of moves. This is why passing
                // may be useful: a position may be unsolvable with the given
                // history of moves, but once it's reset, the position can be
                // solved despite the move is yilded to the opponent.
                nodes.push(0);
                var trials = 0;
                for (var _move2 of nodes) {
                    trials++;
                    var d = !_move2 ? infdepth : repd.get(_move2);
                    var s = undefined;
                    path.push(hashb);
                    stats && stats.nodes++;
                    if (!_move2) {
                        debug && (yield tsumego.stone.label.string(color) + ' plays elsewhere');
                        //const i = tags.lastIndexOf(tags[depth], -2);
                        var npasses = 1;
                        while (npasses <= depth && path[depth - npasses] == hashb) npasses++;
                        if (npasses == 3) {
                            // yielding the turn again means that both sides agreed on
                            // the group's status; check the target's status and quit
                            s = repd.set(tsumego.stone.nocoords(status(board)), depth - npasses + 1);
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
                            s = yield* solve(-color, prevb == hashb ? 0 : km);
                        }
                    } else {
                        board.play(_move2);
                        debug && (yield);
                        s = status(board) * target < 0 ? repd.set(tsumego.stone.nocoords(-target), infdepth) :
                        // white has secured the group: black cannot
                        // capture it no matter how well it plays
                        color * target > 0 && alive && alive(board) ? repd.set(tsumego.stone.nocoords(target), infdepth) : (
                        // let the opponent play the best move
                        yield* solve(-color, _move2 && km));
                        board.undo();
                    }
                    debug && (yield 'the outcome of this move: ' + tsumego.stone.toString(s));
                    path.pop();
                    // the min value of repd is counted only for the case
                    // if all moves result in a loss; if this happens, then
                    // the current player can say that the loss was caused
                    // by the absence of ko treats and point to the earliest
                    // repetition in the path
                    if (s * color < 0 && _move2) mindepth = tsumego.min(mindepth, d > depth ? repd.get(s) : d);
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
                        result = repd.set(_move2 || tsumego.stone.nocoords(color), d > depth && _move2 ? repd.get(s) : d);
                        break;
                    }
                }
                // if there is no winning move, record a loss
                if (!result) result = repd.set(tsumego.stone.nocoords(-color), mindepth);
                // if the solution doesn't depend on a ko above the current node,
                // it can be stored and later used unconditionally as it doesn't
                // depend on a path that leads to the node; this stands true if all
                // such solutions are stored and never removed from the table; this
                // can be proved by trying to construct a path from a node in the
                // proof tree to the root node
                if (repd.get(result) > depth + 1) tt.set(hashb, color, result, km);
                if (guess) {
                    log && log.write({
                        board: hashb,
                        color: color,
                        guess: guess,
                        result: result
                    });
                }
                tt.move.set(hashb ^ color, result);
                log && log.write({
                    result: color * tsumego.stone.color(result),
                    trials: trials
                });
                return result;
            }
            // restore the path from the history of moves
            {
                var moves = [];
                var _move3 = undefined;
                while (_move3 = board.undo()) moves.unshift(_move3);
                for (_move3 of moves) {
                    path.push(board.hash);
                    board.play(_move3);
                }
            }
            var move = yield* solve(color, km || 0);
            if (!Number.isFinite(km)) {
                // if it's a loss, see what happens if there are ko treats;
                // if it's a win, try to find a stronger move, when the opponent has ko treats
                var move2 = yield* solve(color, move * color > 0 ? -color : color);
                if (move2 * color > 0 && tsumego.stone.hascoords(move2)) move = move2;
            }
            return typeof args === 'string' ? tsumego.stone.toString(move) : move;
        }
        solve_1.start = start;
    })(solve = tsumego.solve || (tsumego.solve = {}));
})(tsumego || (tsumego = {}));
var testbench;
(function (testbench) {
    var Marks = (function () {
        function Marks(svg, def) {
            _classCallCheck(this, Marks);

            this.svg = svg;
            this.def = def;
            try {
                this.tag = /\bid="(\w+)"/.exec(def)[1];
            } catch (err) {
                throw SyntaxError('The shape def doesnt have an id="...": ' + def);
            }
            var defs = svg.querySelector('defs');
            defs.innerHTML += def;
        }

        Marks.prototype.nodes = function* nodes() {
            var refs = this.svg.querySelectorAll("use");
            for (var i = 0; i < refs.length; i++) {
                if (refs[i].getAttribute('xlink:href') == '#' + this.tag) yield refs[i];
            }
        };

        Marks.prototype.get = function get(x, y) {
            for (var ref of this.nodes()) {
                if (+ref.getAttribute('x') == x && +ref.getAttribute('y') == y) return ref;
            }return null;
        };

        Marks.prototype.add = function add(x, y) {
            var ref = this.get(x, y);
            if (ref) return ref;
            this.svg.innerHTML += "<use x=\"" + x + "\" y=\"" + y + "\" xlink:href=\"#" + this.tag + "\"/>";
            this.svg.onupdated(x, y);
            return this.get(x, y);
        };

        Marks.prototype.remove = function remove(x, y) {
            var ref = this.get(x, y);
            if (!ref) return;
            this.svg.removeChild(ref);
            this.svg.onupdated(x, y);
        };

        Marks.prototype.clear = function clear() {
            for (var ref of this.nodes()) {
                var x = +ref.getAttribute('x');
                var y = +ref.getAttribute('y');
                this.svg.removeChild(ref);
                this.svg.onupdated(x, y);
            }
        };

        return Marks;
    })();

    var GobanElement;
    (function (GobanElement) {
        function create(board) {
            var n = board.size;
            var div = document.createElement('div');
            div.innerHTML = "\n            <svg version=\"1.0\" xmlns=\"http://www.w3.org/2000/svg\"\n                 xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n                 width=\"100%\"\n                 viewBox=\"-0.5 -0.5 " + n + " " + n + "\">\n              <style>\n                * { stroke-width: 0.05 }\n              </style>\n              <defs>\n                <pattern id=\"grid\" x=\"0\" y=\"0\" width=\"1\" height=\"1\" patternUnits=\"userSpaceOnUse\">\n                  <path d=\"M 1 0 L 0 0 0 1\" fill=\"none\" stroke=\"black\"></path>\n                </pattern>\n              </defs>\n\n              <rect x=\"0\" y=\"0\" width=\"" + (n - 1) + "\" height=\"" + (n - 1) + "\" fill=\"url(#grid)\" stroke=\"black\" stroke-width=\"0.1\"></rect>\n            </svg>";
            var svg = div.querySelector('svg');
            Object.assign(svg, {
                AB: new Marks(svg, '<circle id="AB" r="0.475" fill="black" stroke="black"></circle>'),
                AW: new Marks(svg, '<circle id="AW" r="0.475" fill="white" stroke="black"></circle>'),
                CR: new Marks(svg, '<circle id="CR" r="0.25" fill="none"></circle>'),
                TR: new Marks(svg, '<path id="TR" d="M 0 -0.25 L -0.217 0.125 L 0.217 0.125 Z" fill="none"></path>'),
                MA: new Marks(svg, '<path id="MA" d="M -0.25 -0.25 L 0.25 0.25 M 0.25 -0.25 L -0.25 0.25" fill="none"></path>'),
                SQ: new Marks(svg, '<path id="SQ" d="M -0.25 -0.25 L 0.25 -0.25 L 0.25 0.25 L -0.25 0.25 Z" fill="none"></path>'),
                SL: new Marks(svg, '<rect id="SL" x="-0.5" y="-0.5" width="1" height="1" fill-opacity="0.5" stroke="none"></rect>'),
                // invoked after a marker has been added or removed
                onupdated: function onupdated(x, y) {
                    var color = svg.AB.get(x, y) ? 'white' : 'black';
                    for (var mark in svg) {
                        if (/^[A-Z]{2}$/.test(mark) && mark != 'AB' && mark != 'AW') {
                            try {
                                var item = svg[mark].get(x, y);
                                if (item) item.setAttribute('stroke', color);
                            } catch (err) {
                                console.log(mark, x, y, err);
                            }
                        }
                    }
                }
            });
            for (var x = 0; x < n; x++) {
                for (var y = 0; y < n; y++) {
                    var c = board.get(x, y);
                    if (c > 0) svg.AB.add(x, y);
                    if (c < 0) svg.AW.add(x, y);
                }
            }
            function getStoneCoords(event) {
                // Chrome had a bug which made offsetX/offsetY coords wrong
                // this workaround computes the offset using client coords
                var r = svg.getBoundingClientRect();
                var offsetX = event.clientX - r.left;
                var offsetY = event.clientY - r.top;
                var x = offsetX / r.width;
                var y = offsetY / r.height;
                return [Math.round(x * n - 0.5), Math.round(y * n - 0.5)];
            }
            function attachCellCoords(event) {
                var _getStoneCoords = getStoneCoords(event);

                event.cellX = _getStoneCoords[0];
                event.cellY = _getStoneCoords[1];
            }
            svg.addEventListener('click', attachCellCoords);
            svg.addEventListener('mousedown', attachCellCoords);
            svg.addEventListener('mousemove', attachCellCoords);
            svg.addEventListener('mouseup', attachCellCoords);
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
            var goban = testbench.GobanElement.create(board);
            var container = document.createElement('table');
            container.classList.add('goban-editor');
            container.innerHTML = '<tr><td class="toolbox"><td class="goban">';
            var toolbox = container.querySelector('.toolbox');
            container.querySelector('.goban').appendChild(goban);
            function addTool(tag) {
                var g = testbench.GobanElement.create(new Board(1));
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
    testbench.qargs = {};
    try {
        for (var pair of location.search.slice(1).split('&')) {
            if (!pair) continue;

            var _pair$split$map$map = pair.split('=').map(function (s) {
                return s.replace(/\+/g, ' ');
            }).map(decodeURIComponent);

            var key = _pair$split$map$map[0];
            var val = _pair$split$map$map[1];

            try {
                testbench.qargs[key] = val && JSON.parse(val);
            } catch (err) {
                testbench.qargs[key] = val;
            }
        }
        console.log('qargs:', testbench.qargs);
    } catch (err) {
        console.log('Failed to parse qargs:', err);
    }
})(testbench || (testbench = {}));
/// <reference path="qargs.ts" />
var testbench;
(function (testbench) {
    function hookToolToKey(tool, key) {
        document.addEventListener('keydown', function (event) {
            if (event.key.toUpperCase() == key.toUpperCase()) testbench.vm.tool = tool;
        });
        document.addEventListener('keyup', function (event) {
            if (event.key.toUpperCase() == key.toUpperCase()) testbench.vm.tool = '';
        });
    }
    hookToolToKey('MA', 'T'); // T = target
    hookToolToKey('AB', 'B'); // B = black
    hookToolToKey('AW', 'W'); // W = white
    testbench.vm = Object.defineProperties({}, {
        tool: {
            /** The currently selected editor tool: MA, AB, AW, etc. */

            get: function get() {
                var button = document.querySelector('#tool > button.active');
                return button && button.getAttribute('data-value');
            },
            set: function set(value) {
                for (var button of document.querySelectorAll('#tool > button')) {
                    if (button.getAttribute('data-value') == value) button.classList.add('active');else button.classList.remove('active');
                }
            },
            configurable: true,
            enumerable: true
        },
        debugSolver: {
            /** Tells to invoke the solver in the step-by-step mode. */

            get: function get() {
                return !!testbench.qargs.debug;
            },
            configurable: true,
            enumerable: true
        },
        km: {
            /** ko master: +1, -1 or 0 */

            get: function get() {
                var b = document.querySelector('#km > button.active');
                return b && +b.getAttribute('data-value');
            },
            configurable: true,
            enumerable: true
        },
        kmVisible: {
            /** Hides/shows the km selector. */

            set: function set(viisble) {
                $('#km').css('display', viisble ? '' : 'none');
            },
            configurable: true,
            enumerable: true
        },
        coords: {
            /** e.g. "B3 bc" */

            set: function set(text) {
                $('#coords').text(text);
            },
            configurable: true,
            enumerable: true
        },
        note: {
            set: function set(text) {
                $('#comment').text(text);
            },
            configurable: true,
            enumerable: true
        },
        sgf: {
            get: function get() {
                return $('#sgf').text();
            },
            set: function set(text) {
                $('#sgf').text(text);
            },
            configurable: true,
            enumerable: true
        },
        svg: {
            set: function set(text) {
                $('#svg').text(text);
            },
            configurable: true,
            enumerable: true
        },
        canUndo: {
            set: function set(value) {
                if (value) $('#undo').removeClass('disabled');else $('#undo').addClass('disabled');
            },
            configurable: true,
            enumerable: true
        }
    });
})(testbench || (testbench = {}));
/// <reference path="../libs/jquery.d.ts" />
var testbench;
(function (testbench) {
    /**
     * The sidepane on the left with the list of tsumegos.
     * It uses a .ui.accordion to group tsumegos by folder.
     */

    var Directory = (function () {
        function Directory(container) {
            _classCallCheck(this, Directory);

            this.container = container;
            $(container).click(function (event) {
                var target = $(event.target);
                if (target.is('.title')) {
                    target.siblings().removeClass('active');
                    target.addClass('active').next('.content').addClass('active');
                }
            });
        }

        /**
         * Finds or creates the .ui.content element.
         */

        Directory.prototype.getFolder = function getFolder(folder) {
            for (var x of this.container.querySelectorAll('.title')) {
                if (x.textContent == folder) return x.nextSibling;
            }if (!folder) return $(this.container).find('.content:first')[0];
            this.container.innerHTML += "<div class=\"title\">" + folder + "</div><div class=\"content\"><div class=\"ui inverted selection list\"></div></div>";
            return $(this.container).find('.content:last')[0];
        };

        Directory.prototype.find = function find(path) {
            var list = arguments.length <= 1 || arguments[1] === undefined ? this.container : arguments[1];

            for (var e of list.querySelectorAll('a.item')) {
                var a = e;
                var matches = typeof path === 'string' ? a.hash == '#' + path : path(a.hash.slice(1));
                if (matches) return a;
            }
        };

        /**
         * Returns an existing entry if it already exists.
         */

        Directory.prototype.add = function add(path) {
            if (this.find(path)) return;
            var folder = path.indexOf('/') < 0 ? null : path.split('/')[0];
            var name = folder ? path.slice(folder.length + 1) : path;
            var content = this.getFolder(folder);
            var list = content.querySelector('.ui.list');
            var next = this.find(function (s) {
                return s > path;
            }, list);
            var a = document.createElement('a');
            a.setAttribute('class', 'item');
            a.setAttribute('href', '#' + path);
            a.textContent = name;
            list.insertBefore(a, next);
        };

        /**
         * Does nothing if the entry doesn't exist.
         */

        Directory.prototype.remove = function remove(path) {
            var a = this.find(path);
            a && a.parentNode.removeChild(a);
        };

        /**
         * Makes this item active. Expands folders as necessary.
         */

        Directory.prototype.select = function select(path) {
            $(this.container).find('.active').removeClass('active');
            for (var e of this.container.querySelectorAll('.directory .item')) {
                var a = e;
                if (a.hash == '#' + path) {
                    a.classList.add('active');
                    var content = a.parentElement.parentElement;
                    content.classList.add('active');
                    var title = content.previousElementSibling;
                    title.classList.add('active');
                    a.scrollIntoView();
                } else {
                    a.classList.remove('active');
                }
            }
        };

        return Directory;
    })();

    testbench.Directory = Directory;
})(testbench || (testbench = {}));
/// <reference path="kb.ts" />
/// <reference path="xhr.ts" />
/// <reference path="ls.ts" />
/// <reference path="../src/search.ts" />
/// <reference path="editor.ts" />
/// <reference path="vm.ts" />
/// <reference path="directory.ts" />
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
    var xy2s = function xy2s(m) {
        return !stone.hascoords(m) ? null : String.fromCharCode(0x41 + (stone.x(m) > 7 ? stone.x(m) - 1 : stone.x(m))) + (board.size - stone.y(m));
    };
    var c2s = function c2s(c) {
        return c > 0 ? 'B' : 'W';
    };
    var s2c = function s2c(s) {
        return s == 'B' ? +1 : s == 'W' ? -1 : 0;
    };
    var cm2s = function cm2s(c, m) {
        return c2s(c) + (Number.isFinite(m) ? ' plays at ' + xy2s(m) : ' passes');
    };
    var cw2s = function cw2s(c, m) {
        return c2s(c) + ' wins by ' + (Number.isFinite(m) ? xy2s(m) : 'passing');
    };
    function s2s(c, s) {
        var isDraw = stone.color(s) == 0;
        var isLoss = s * c < 0;
        return c2s(c) + ' ' + (isLoss ? 'loses' : (isDraw ? 'draws' : 'wins') + ' with ' + xy2s(s));
    }
    /** shared transposition table for black and white */
    testbench.tt = new tsumego.TT();
    // ?rs=123 sets the rand seed
    var rs = +testbench.qargs.rs || Date.now() | 0;
    console.log('rand seed:', rs);
    tsumego.rand.seed(rs);
    function solve(op, board, color, km) {
        var log = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

        return Promise.resolve().then(function () {
            profile.reset();
            var g = tsumego.solve.start({
                root: board,
                color: color,
                km: km,
                time: 250,
                tt: testbench.tt,
                expand: tsumego.mgen.fixed(board, aim),
                status: status
            });
            var s = g.next();
            return new Promise(function (resolve) {
                setTimeout(function fn() {
                    op.notify();
                    if (s.done) resolve(s.value);else {
                        s = g.next();
                        setTimeout(fn);
                    }
                });
            }).then(function (rs) {
                if (log) {
                    profile.log();
                    console.log(s2s(color, rs));
                }
                return rs;
            });
        });
    }

    var CancellationToken = function CancellationToken() {
        _classCallCheck(this, CancellationToken);

        this.cancelled = false;
    };

    function sleep(ms) {
        return new Promise(function (resolve) {
            return setTimeout(resolve, ms);
        });
    }
    function dbgsolve(board, color) {
        var nkotreats = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        var solver = tsumego.solve.start({
            debug: true,
            root: board,
            color: color,
            tt: testbench.tt,
            expand: tsumego.mgen.fixed(board, aim),
            status: status,
            alive: function alive(b) {
                return tsumego.benson.alive(b, aim);
            }
        });
        window['solver'] = solver;
        var tick = 0;
        var next = function next() {
            var render = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            var _solver$next = solver.next();

            var done = _solver$next.done;
            var value = _solver$next.value;

            var comment = value;
            !done && tick++;
            if (render) renderBoard(comment);
        };
        var stepOver = function stepOver(ct) {
            var hash = board.hash;
            do {
                next(false);
            } while (board.hash != hash && !ct.cancelled);
            next();
        };
        var stepOut = function stepOut() {
            /*
            log = false;
            const n = solver.depth;
            while (solver.depth >= n)
                next();
            log = true;
            renderSGF(solver.current.node.toString('SGF'));
            */
        };
        testbench.keyboard.hook(testbench.keyboard.Key.F10, function (event) {
            event.preventDefault();
            var ct = new CancellationToken();
            var hook = testbench.keyboard.hook(testbench.keyboard.Key.Esc, function (event) {
                event.preventDefault();
                console.log('cancelling...');
                ct.cancelled = true;
            });
            stepOver(ct);
        });
        testbench.keyboard.hook(testbench.keyboard.Key.F11, function (event) {
            if (!event.shiftKey) {
                event.preventDefault();
                if (event.ctrlKey) debugger;
                next();
            } else {
                // Shift+F11
                event.preventDefault();
                stepOut();
            }
        });
        console.log(c2s(color), 'to play with', nkotreats, 'external ko treats\n', 'F11 - step into\n', 'Ctrl+F11 - step into and debug\n', 'F10 - step over\n', 'Shift+F11 - step out\n', 'G - go to a certain step\n');
        testbench.keyboard.hook('G'.charCodeAt(0), function (event) {
            event.preventDefault();
            var stopat = +prompt('Step #:');
            if (!stopat) return;
            console.log('skipping first', stopat, 'steps...');
            while (tick < stopat) next();
            renderBoard();
        });
    }
    var sign = function sign(x) {
        return x > 0 ? +1 : x < 0 ? -1 : 0;
    };
    var status = function status(b) {
        return sign(b.get(aim) || -tblock);
    };
    var aim = 0,
        lspath = '',
        solvingFor,
        tblock;
    var selection;
    function getSelectedRect() {
        return selection && {
            xmin: Math.min(selection.x1, selection.x2),
            ymin: Math.min(selection.y1, selection.y2),
            xmax: Math.max(selection.x1, selection.x2),
            ymax: Math.max(selection.y1, selection.y2)
        };
    }
    function* listSelectedCoords() {
        if (!selection) return;

        var _getSelectedRect = getSelectedRect();

        var xmin = _getSelectedRect.xmin;
        var xmax = _getSelectedRect.xmax;
        var ymin = _getSelectedRect.ymin;
        var ymax = _getSelectedRect.ymax;

        for (var x = xmin; x <= xmax; x++) {
            for (var y = ymin; y <= ymax; y++) {
                yield [x, y];
            }
        }
    }
    function isSelected(x, y) {
        var rect = getSelectedRect();
        return rect && rect.xmin <= x && x <= rect.xmax && rect.ymin <= y && y <= rect.ymax;
    }
    window.addEventListener('load', function () {
        testbench.vm.kmVisible = !!testbench.qargs.km;
        Promise.resolve().then(function () {
            var directory = new testbench.Directory(document.querySelector('.directory'));
            window.addEventListener('hashchange', function () {
                var path = location.hash.slice(1); // #abc -> abc
                if (path.length > 0) {
                    loadProblem(path).then(function () {
                        directory.select(path);
                    })["catch"](function (e) {
                        console.log(e.stack);
                        document.querySelector('.tsumego').textContent = e;
                    });
                }
            });
            if (!testbench.ls.data['blank']) testbench.ls.set('blank', new Board(9).toStringSGF());
            if (!location.hash) location.hash = '#blank';else {
                (function () {
                    var path = location.hash.slice(1); // #abc -> abc
                    loadProblem(path).then(function () {
                        directory.select(path);
                    })["catch"](function (e) {
                        console.log('cannot load', path, e.stack);
                        location.hash = '#blank';
                    });
                })();
            }
            testbench.ls.added.push(function (path) {
                directory.add(path);
            });
            testbench.ls.removed.push(function (path) {
                directory.remove(path);
            });
            var lsdata = testbench.ls.data;
            for (var path in lsdata) {
                directory.add(path);
            }send('GET', '/problems/manifest.json').then(function (data) {
                var manifest = JSON.parse(data);
                for (var dir of manifest.dirs) {
                    var _loop = function (path) {
                        send('GET', '/problems/' + path).then(function (sgf) {
                            var root = tsumego.SGF.parse(sgf);
                            if (!root) throw SyntaxError('Invalid SGF from ' + path);
                            var name = path.replace('.sgf', '');
                            if (!lsdata[name]) directory.add(name);
                        })["catch"](function (err) {
                            console.log(err.stack);
                        });
                    };

                    for (var path of dir.problems) {
                        _loop(path);
                    }
                }
            })["catch"](function (err) {
                console.log(err.stack);
            });
            document.querySelector('#delete').addEventListener('click', function (e) {
                if (lspath && lspath != 'blank' && confirm('Delete problem ' + lspath + '?')) {
                    testbench.ls.set(lspath, null);
                    location.hash = '#blank';
                }
            });
            document.querySelector('#rename').addEventListener('click', function (e) {
                if (!lspath) return;
                var path2 = prompt('New name for ' + lspath);
                if (!path2) return;
                if (testbench.ls.data[path2]) alert(path2 + ' already exists');
                if (lspath != 'blank') testbench.ls.set(lspath, null);
                lspath = path2;
                renderBoard(); // it saves the sgf at the new location
                location.hash = '#' + lspath;
            });
            document.querySelector('#solve-b').addEventListener('click', function (e) {
                lspath = null;
                solvingFor = +1;
                tblock = board.get(aim);
                if (testbench.vm.debugSolver) dbgsolve(board, solvingFor, testbench.vm.km);else solveAndRender(solvingFor, testbench.vm.km);
            });
            document.querySelector('#solve-w').addEventListener('click', function (e) {
                lspath = null;
                solvingFor = -1;
                tblock = board.get(aim);
                if (testbench.vm.debugSolver) dbgsolve(board, solvingFor, testbench.vm.km);else solveAndRender(solvingFor, testbench.vm.km);
            });
            document.querySelector('#flipc').addEventListener('click', function (e) {
                var b = new Board(board.size);
                for (var s of board.stones()) {
                    var x = stone.x(s);
                    var y = stone.y(s);
                    var c = stone.color(s);
                    b.play(stone(x, y, -c));
                }
                board = b.fork();
                renderBoard();
            });
            document.querySelector('#undo').addEventListener('click', function () {
                var move = board.undo();
                if (move) console.log('undo ' + stone.toString(move));else console.log('nothing to undo');
                console.log(board + '');
                renderBoard();
            });
            var input = document.querySelector('#sgf');
            input.addEventListener('focusout', function (e) {
                try {
                    console.log('focusout');
                    updateSGF(testbench.vm.sgf);
                } catch (err) {
                    // partial input is not valid SGF
                    if (err instanceof SyntaxError) return;
                    throw err;
                }
            });
        })["catch"](function (err) {
            console.error(err.stack);
            alert(err);
        });
    });
    function loadProblem(path) {
        return Promise.resolve().then(function () {
            console.log('loading problem', path);

            var _path$split = path.split(':');

            var source = _path$split[0];
            var nvar = _path$split[1];

            document.title = source;
            lspath = source;
            return Promise.resolve().then(function () {
                return testbench.ls.data[source] || send('GET', '/problems/' + source + '.sgf')["catch"](function (e) {
                    console.log(source, 'cannot be loaded', e);
                    return new Board(9).toStringSGF();
                });
            }).then(function (sgfdata) {
                updateSGF(sgfdata, nvar && +nvar);
                console.log(sgfdata);
                console.log(board + '');
                console.log(board.toStringSGF());
            });
        });
    }
    function updateSGF(sgfdata) {
        var nvar = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        var sgf = tsumego.SGF.parse(sgfdata);
        var setup = sgf.steps[0];
        board = new Board(sgfdata, nvar);
        aim = stone.fromString((setup['MA'] || ['aa'])[0]);
        selection = null;
        board = board.fork(); // drop the history of moves
        renderBoard();
    }
    function removeStone(x, y) {
        var b = new Board(board.size);
        for (var s of board.stones()) {
            var _stone$coords4 = stone.coords(s);

            var sx = _stone$coords4[0];
            var sy = _stone$coords4[1];

            var c = stone.color(s);
            if (sx != x || sy != y) b.play(stone(sx, sy, c));
        }
        board = b.fork(); // drop history
    }
    document.addEventListener('keyup', function (event) {
        if (!selection) return;
        switch (event.keyCode) {
            case 46 /* Delete */:
                for (var s of board.stones()) {
                    var x = stone.x(s);
                    var y = stone.y(s);
                    if (isSelected(x, y)) removeStone(x, y);
                }
                selection = null;
                renderBoard();
                break;
            case 37 /* Left */:
            case 38 /* Top */:
            case 39 /* Right */:
            case 40 /* Bottom */:
        }
    });
    function renderBoard() {
        var comment = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        var move = board.undo();
        board.play(move);
        testbench.vm.canUndo = !!move;
        var ui = testbench.GobanElement.create(board);
        if (stone.hascoords(move) && solvingFor) ui.TR.add(stone.x(move), stone.y(move));
        if (stone.hascoords(aim)) ui.MA.add(stone.x(aim), stone.y(aim));
        for (var _ref122 of listSelectedCoords()) {
            var x = _ref122[0];
            var y = _ref122[1];

            ui.SL.add(x, y);
        } //
        // manages the selection area
        //
        var selecting = false;
        var dragging = false;
        var dragged = false;
        var dragx = 0,
            dragy = 0;
        ui.addEventListener('mousedown', function (event) {
            if (!solvingFor && !testbench.vm.tool) {
                var cx = event.cellX;
                var cy = event.cellY;
                if (!isSelected(cx, cy)) {
                    // start selection
                    if (selection) ui.SL.clear();
                    selecting = true;
                    selection = { x1: cx, y1: cy, x2: cx, y2: cy };
                } else {
                    // start drag'n'drop
                    dragging = true;
                    dragged = false;
                    dragx = cx;
                    dragy = cy;
                }
            }
        });
        ui.addEventListener('mousemove', function (event) {
            var cx = event.cellX;
            var cy = event.cellY;
            if (selecting) {
                selection.x2 = cx;
                selection.y2 = cy;
                ui.SL.clear();
                for (var _ref132 of listSelectedCoords()) {
                    var x = _ref132[0];
                    var y = _ref132[1];

                    ui.SL.add(x, y);
                }
            }
            if (dragging) {
                var dx = cx - dragx;
                var dy = cy - dragy;
                if (dx || dy) {
                    selection.x1 += dx;
                    selection.x2 += dx;
                    selection.y1 += dy;
                    selection.y2 += dy;
                    dragx = cx;
                    dragy = cy;
                    ui.SL.clear();
                    for (var _ref142 of listSelectedCoords()) {
                        var x = _ref142[0];
                        var y = _ref142[1];

                        ui.SL.add(x, y);
                    }dragged = true;
                }
            }
        });
        ui.addEventListener('mouseup', function (event) {
            if (dragging && !dragged) {
                selection = null;
                ui.SL.clear();
            }
            selecting = false;
            dragging = false;
        });
        //
        // displays the current coordinates in the lower right corner
        //
        ui.addEventListener('mousemove', function (event) {
            var x = event.cellX;
            var y = event.cellY;

            var s = stone(x, y, 0);
            testbench.vm.coords = stone.cc.toString(s, board.size) + " [" + stone.toString(s) + "]";
        });
        ui.addEventListener('mouseout', function () {
            testbench.vm.coords = '';
        });
        //
        // the main click handler
        //
        ui.addEventListener('click', function (event) {
            var x = event.cellX;
            var y = event.cellY;

            var c = board.get(x, y);
            if (testbench.vm.tool == 'MA') {
                if (!solvingFor) aim = stone(x, y, 0);
            } else if (/AB|AW/.test(testbench.vm.tool) || solvingFor) {
                if (c && !solvingFor) removeStone(x, y);
                var color = testbench.vm.tool == 'AB' ? +1 : testbench.vm.tool == 'AW' ? -1 : -solvingFor;
                board.play(stone(x, y, color));
            } else {
                return;
            }
            renderBoard(stone.toString(stone(x, y, board.get(x, y))));
        });
        var wrapper = document.querySelector('.tsumego');
        wrapper.innerHTML = '';
        wrapper.appendChild(ui);
        var sgf = getProblemSGF();
        testbench.vm.sgf = sgf;
        testbench.vm.svg = wrapper.innerHTML;
        setComment(comment);
        if (lspath) testbench.ls.set(lspath, sgf);
    }
    function getProblemSGF() {
        return board.toStringSGF('\n  ').replace(/\)$/, (stone.hascoords(aim) ? '\n  MA[' + stone.toString(aim) + ']' : '') + ')');
    }
    function setComment(comment) {
        testbench.vm.note = comment;
    }
    function parse(si, size) {
        var x = si.charCodeAt(0) - 65;
        var y = size - +/\d+/.exec(si)[0];
        return stone(x, y, 0);
    }
    function solveAndRender(color, km) {
        setComment('Solving...');
        setTimeout(function () {
            var started = Date.now();
            var comment = function comment() {
                return ((Date.now() - started) / 1000 | 0) + 's; cached ' + (testbench.tt.size / 1000 | 0) + 'K positions';
            };
            var op = {
                notify: function notify() {
                    setComment('Solving... elapsed ' + comment());
                }
            };
            solve(op, board, color, km, true).then(function (move) {
                var duration = Date.now() - started;
                if (!stone.hascoords(move) || move * color < 0) {
                    setComment(c2s(color) + ' passes');
                } else {
                    board.play(move);
                    console.log(board + '');
                    renderBoard(stone.toString(move) + ' in ' + comment());
                }
            })["catch"](function (err) {
                setComment(err);
            });
        });
    }
})(testbench || (testbench = {}));
//# sourceMappingURL=app.js.map
// rd moves away from target block
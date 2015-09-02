"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

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
var tsumego;
(function (tsumego) {
    'use strict';
    var Color;
    (function (Color) {
        Color.alias = function (color) {
            return color > 0 ? 'B' : 'W';
        };
    })(Color = tsumego.Color || (tsumego.Color = {}));
})(tsumego || (tsumego = {}));
/// <reference path="types.ts" />
var tsumego;
(function (tsumego) {
    'use strict';
    tsumego.infty = 777;
    /** 0 -> `a`, 3 -> `d` */
    tsumego.n2s = function (n) {
        return String.fromCharCode(n + 0x61);
    };
    /** `d` -> 43 `a` -> 0 */
    tsumego.s2n = function (s) {
        var i = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        return s.charCodeAt(i) - 0x61;
    };
    tsumego.min = function (a, b) {
        return a < b ? a : b;
    };
    tsumego.max = function (a, b) {
        return a > b ? a : b;
    };
    tsumego.abs = function (a) {
        return a < 0 ? -a : a;
    };
    /** Simulates yield* which can't be called in a regular function.
        The point is to get the value that a generator returns at the end. */
    function result(g) {
        var r = g.next();
        while (!r.done) r = g.next();
        return r.value;
    }
    tsumego.result = result;
})(tsumego || (tsumego = {}));
/** Generic LL(*) recursive descent parser. */
var SDP;
(function (SDP) {
    'use strict';

    var Pattern = (function () {
        function Pattern(_text, _exec) {
            _classCallCheck(this, Pattern);

            this._text = _text;
            this._exec = _exec;
        }

        _createClass(Pattern, [{
            key: "toString",
            value: function toString() {
                return this._text;
            }
        }, {
            key: "exec",
            value: function exec(str, pos) {
                var r = this._exec.call(null, str, pos || 0);
                //console.log(this + '', str.slice(pos, pos + 10), r);
                if (typeof pos === 'number') return r;
                if (r && r[1] == str.length) return r[0];
                return null;
            }
        }, {
            key: "map",
            value: function map(fn) {
                var _this = this;

                return $(':' + this, function (str, pos) {
                    var r = _this.exec(str, pos);
                    return r ? [fn(r[0]), r[1]] : null;
                });
            }
        }, {
            key: "take",
            value: function take(i) {
                return this.map(function (r) {
                    return r[i];
                });
            }
        }, {
            key: "slice",
            value: function slice(from, to) {
                return this.map(function (r) {
                    return r.slice(from, to);
                });
            }

            /** [["A", 1], ["B", 2]] -> { A: 1, B: 2 } */
        }, {
            key: "fold",
            value: function fold(k, v) {
                return this.map(function (r) {
                    var m = {};
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = r[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var p = _step.value;

                            m[p[k]] = p[v];
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator["return"]) {
                                _iterator["return"]();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    return m;
                });
            }
        }, {
            key: "rep",
            value: function rep() {
                var _this2 = this;

                var min = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

                return $(min + '*' + this, function (str, pos) {
                    var res = [];
                    var r = undefined;
                    while (r = _this2.exec(str, pos)) {
                        res.push(r[0]);
                        pos = r[1];
                    }
                    return res.length >= min ? [res, pos] : null;
                });
            }
        }]);

        return Pattern;
    })();

    SDP.Pattern = Pattern;
    function $(x, s) {
        if (typeof s === 'function') return new Pattern(x, s);
        if (arguments.length > 1) return seq.apply(null, arguments);
        if (x instanceof Pattern) return x;
        if (x instanceof RegExp) return rgx(x);
        if (typeof x === 'string') return txt(x);
    }
    SDP.$ = $;
    function rgx(r) {
        return $(r + '', function (str, pos) {
            var m = r.exec(str.slice(pos));
            return m && m.index == 0 ? [m[0], pos + m[0].length] : null;
        });
    }
    function txt(s) {
        return $('"' + s + '"', function (str, pos) {
            return str.slice(pos, pos + s.length) == s ? [s, pos + s.length] : null;
        });
    }
    function seq() {
        for (var _len = arguments.length, ps = Array(_len), _key = 0; _key < _len; _key++) {
            ps[_key] = arguments[_key];
        }

        return $('(' + ps.join(' ') + ')', function (str, pos) {
            var res = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = ps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var p = _step2.value;

                    var r = $(p).exec(str, pos);
                    if (!r) return null;
                    res.push(r[0]);
                    pos = r[1];
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return [res, pos];
        });
    }
})(SDP || (SDP = {}));
/// <reference path="rdp.ts" />
var SGF;
(function (SGF) {
    'use strict';
    var $ = SDP.$;
    /**
     * Parses an SGF input according to these rules:
     *
     *      val = `[` ... `]`
     *      tag = 1*(`A`..`Z`) *val
     *      stp = `;` *tag
     *      sgf = `(` *stp *sgf `)`
     *
     * Returns AST of the input.
     */
    function parse(source) {
        var wsp = $(/\s*/);
        var val = $(wsp, /\[.*?\]/).take(1).slice(+1, -1);
        var tag = $(wsp, /\w+/, val.rep()).slice(1);
        var stp = $(wsp, ';', tag.rep()).take(2).fold(0, 1);
        var sgf = $(wsp, '(', stp.rep(), $('sgf', function (s, i) {
            return sgf.exec(s, i);
        }).rep(), wsp, ')', wsp).map(function (r) {
            return { steps: r[2], vars: r[3] };
        });
        return sgf.exec(source);
    }
    SGF.parse = parse;
})(SGF || (SGF = {}));
/// <reference path="utils.ts" />
/// <reference path="sgf.ts" />
var tsumego;
(function (tsumego) {
    'use strict';

    var Board = (function () {
        function Board(size, setup) {
            _classCallCheck(this, Board);

            this.nlibs = [0];
            this.gcols = [0];
            if (typeof size === 'string') this.initFromSGF(size);else if (typeof size === 'number') {
                this.init(size);
                if (setup instanceof Array) this.initFromTXT(setup);
            }
        }

        _createClass(Board, [{
            key: "init",
            value: function init(size) {
                this.size = size;
                this.table = new Array(size * size);
            }
        }, {
            key: "initFromTXT",
            value: function initFromTXT(rows) {
                var _this3 = this;

                rows.map(function (row, y) {
                    row.split('').map(function (chr, x) {
                        var c = chr == 'X' ? +1 : chr == 'O' ? -1 : 0;
                        if (c && !_this3.play(x, y, c)) throw new Error('Invalid setup.');
                    });
                });
            }
        }, {
            key: "initFromSGF",
            value: function initFromSGF(source) {
                var _this4 = this;

                var sgf = SGF.parse(source);
                if (!sgf) throw new SyntaxError('Invalid SGF: ' + source);
                var setup = sgf.steps[0]; // ;FF[4]SZ[19]...
                var size = +setup['SZ'];
                this.init(size);
                var place = function place(tag, color) {
                    var stones = setup[tag];
                    if (!stones) return;
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = stones[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var xy = _step3.value;

                            var x = tsumego.s2n(xy, 0);
                            var y = tsumego.s2n(xy, 1);
                            if (!_this4.play(x, y, color)) throw new Error(tag + '[' + xy + '] cannot be added.');
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                                _iterator3["return"]();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }
                };
                place('AW', -1);
                place('AB', +1);
            }
        }, {
            key: "fork",
            value: function fork() {
                var $ = this,
                    board = new Board(0);
                board.size = $.size;
                board._hash = $._hash;
                board.table = $.table.slice(0);
                board.nlibs = $.nlibs.slice(0);
                board.gcols = $.gcols.slice(0);
                return board;
            }
        }, {
            key: "at",
            value: function at(x, y) {
                var $ = this,
                    n = $.size,
                    t = $.table;
                return x < 0 || y < 0 || x >= n || y >= n ? 0 : t[y * n + x];
            }
        }, {
            key: "adjustLibs",
            value: function adjustLibs(s, x, y, q) {
                var $ = this,
                    g = $.nlibs;
                var sl = $.at(x - 1, y);
                var sr = $.at(x + 1, y);
                var st = $.at(x, y + 1);
                var sb = $.at(x, y - 1);
                if (sl && (sl ^ s) < 0) g[tsumego.abs(sl)] += q;
                if (sr && (sr ^ s) < 0 && sr != sl) g[tsumego.abs(sr)] += q;
                if (st && (st ^ s) < 0 && st != sr && st != sl) g[tsumego.abs(st)] += q;
                if (sb && (sb ^ s) < 0 && sb != st && sb != sr && sb != sl) g[tsumego.abs(sb)] += q;
            }
        }, {
            key: "remove",
            value: function remove(s) {
                var $ = this,
                    t = $.table,
                    n = $.size,
                    g = $.nlibs;
                var i = 0,
                    x,
                    y,
                    r = 0;
                for (y = 0; y < n; y++) {
                    for (x = 0; x < n; x++) {
                        if (t[i] == s) {
                            $.adjustLibs(s, x, y, +1);
                            t[i] = 0;
                            r++;
                        }
                        i++;
                    }
                }
                g[s] = 0;
                return r;
            }
        }, {
            key: "countLibs",
            value: function countLibs(s) {
                var $ = this,
                    t = $.table,
                    n = $.size;
                var i = 0,
                    x,
                    y,
                    r = 0;
                for (y = 0; y < n; y++) {
                    for (x = 0; x < n; x++) {
                        if (!t[i]) if ($.at(x - 1, y) == s || $.at(x + 1, y) == s || $.at(x, y - 1) == s || $.at(x, y + 1) == s) r++;
                        i++;
                    }
                }
                return r;
            }
        }, {
            key: "inBounds",
            value: function inBounds(x, y) {
                var n = this.size;
                return x >= 0 && x < n && y >= 0 && y < n;
            }
        }, {
            key: "play",
            value: function play(x, y, s) {
                var $ = this,
                    n = $.size,
                    t = $.table,
                    g = $.nlibs;
                var i,
                    r = 0;
                if (t[y * n + x] || !this.inBounds(x, y)) return;
                // stone id
                var sl = $.at(x - 1, y);
                var sr = $.at(x + 1, y);
                var sb = $.at(x, y - 1);
                var st = $.at(x, y + 1);
                // libs number
                var nl = sl && g[tsumego.abs(sl)];
                var nr = sr && g[tsumego.abs(sr)];
                var nt = st && g[tsumego.abs(st)];
                var nb = sb && g[tsumego.abs(sb)];
                var kx, ky;
                // remove captured enemy neighbors
                if (nl == 1 && (s ^ sl) < 0) r += $.remove(sl), kx = x - 1, ky = y;
                if (nr == 1 && (s ^ sr) < 0) r += $.remove(sr), kx = x + 1, ky = y;
                if (nt == 1 && (s ^ st) < 0) r += $.remove(st), kx = x, ky = y + 1;
                if (nb == 1 && (s ^ sb) < 0) r += $.remove(sb), kx = x, ky = y - 1;
                // suicide is not allowed
                if (r == 0 && (sl && (sl ^ s) < 0 || nl == 1 || x == 0) && (sr && (sr ^ s) < 0 || nr == 1 || x == n - 1) && (st && (st ^ s) < 0 || nt == 1 || y == n - 1) && (sb && (sb ^ s) < 0 || nb == 1 || y == 0)) {
                    return 0;
                }
                // take away a lib of every neighbor group
                $.adjustLibs(s, x, y, -1);
                // new group id = min of neighbor group ids
                var gi = g.length;
                if (sl && (sl ^ s) >= 0) gi = tsumego.min(gi, tsumego.abs(sl));
                if (st && (st ^ s) >= 0) gi = tsumego.min(gi, tsumego.abs(st));
                if (sr && (sr ^ s) >= 0) gi = tsumego.min(gi, tsumego.abs(sr));
                if (sb && (sb ^ s) >= 0) gi = tsumego.min(gi, tsumego.abs(sb));
                // merge neighbors into one group
                var gs = s < 0 ? -gi : gi;
                if (sl && (sl ^ s) >= 0 && sl != gs) {
                    for (i = 0; i < t.length; i++) if (t[i] == sl) t[i] = gs;
                    g[tsumego.abs(sl)] = 0;
                }
                if (st && (st ^ s) >= 0 && st != gs) {
                    for (i = 0; i < t.length; i++) if (t[i] == st) t[i] = gs;
                    g[tsumego.abs(st)] = 0;
                }
                if (sr && (sr ^ s) >= 0 && sr != gs) {
                    for (i = 0; i < t.length; i++) if (t[i] == sr) t[i] = gs;
                    g[tsumego.abs(sr)] = 0;
                }
                if (sb && (sb ^ s) >= 0 && sb != gs) {
                    for (i = 0; i < t.length; i++) if (t[i] == sb) t[i] = gs;
                    g[tsumego.abs(sb)] = 0;
                }
                t[y * n + x] = gs;
                g[gi] = $.countLibs(gs);
                $.gcols[gi] = gs;
                $._hash = null;
                return r + 1;
            }
        }, {
            key: "totalLibs",
            value: function totalLibs(c) {
                var $ = this,
                    t = $.table,
                    n = $.size;
                var i = 0,
                    x,
                    y,
                    r = 0;
                for (y = 0; y < n; y++) {
                    for (x = 0; x < n; x++) {
                        if (!t[i]) if ($.at(x - 1, y) * c > 0 || $.at(x + 1, y) * c > 0 || $.at(x, y - 1) * c > 0 || $.at(x, y + 1) * c > 0) r++;
                        i++;
                    }
                }
                return r;
            }
        }, {
            key: "nInAtari",
            value: function nInAtari(color) {
                var $ = this,
                    ns = $.nlibs,
                    cs = $.gcols,
                    i,
                    n = 0;
                for (i = 0; i < ns.length; i++) if (cs[i] * color > 0 && ns[i] < 2) n++;
                return n;
            }
        }, {
            key: "eulern",
            value: function eulern(color) {
                var q = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];

                var board = this,
                    n = board.size,
                    x,
                    y,
                    a,
                    b,
                    c,
                    d,
                    n1 = 0,
                    n2 = 0,
                    n3 = 0;
                for (x = -1; x < n; x++) {
                    for (y = -1; y < n; y++) {
                        a = board.at(x, y) * color > 0;
                        b = board.at(x + 1, y) * color > 0;
                        c = board.at(x + 1, y + 1) * color > 0;
                        d = board.at(x, y + 1) * color > 0;
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
        }, {
            key: "hash",
            value: function hash() {
                if (!this._hash) {
                    var n = this.size;
                    var h = '',
                        len = 0;
                    for (var y = 0; y < n; y++) {
                        var rx = h.length;
                        for (var x = 0; x < n; x++) {
                            var b = this.at(x, y);
                            h += b > 0 ? 'X' : b < 0 ? 'O' : '-';
                            if (b) len = rx = h.length;
                        }
                        h = h.slice(0, rx) + ';';
                    }
                    this._hash = n + 'x' + n + '(' + h.slice(0, len) + ')';
                }
                return this._hash;
            }
        }, {
            key: "toStringSGF",
            value: function toStringSGF() {
                var _this5 = this;

                var take = function take(pf, fn) {
                    var list = '';
                    for (var y = 0; y < _this5.size; y++) {
                        for (var x = 0; x < _this5.size; x++) {
                            if (fn(_this5.at(x, y))) list += '[' + tsumego.n2s(x) + tsumego.n2s(y) + ']';
                        }
                    }return list && pf + list;
                };
                return '(;FF[4]SZ[' + this.size + ']' + take('AB', function (c) {
                    return c > 0;
                }) + take('AW', function (c) {
                    return c < 0;
                }) + ')';
            }
        }, {
            key: "toStringTXT",
            value: function toStringTXT() {
                var xmax = 0,
                    ymax = 0;
                for (var x = 0; x < this.size; x++) {
                    for (var y = 0; y < this.size; y++) {
                        if (this.at(x, y)) xmax = tsumego.max(x, xmax), ymax = tsumego.max(y, ymax);
                    }
                }var hc = '  ';
                for (var x = 0; x <= xmax; x++) {
                    hc += ' ' + String.fromCharCode(0x41 + x);
                }var s = hc;
                for (var y = 0; y <= ymax; y++) {
                    s += '\n';
                    var vc = y < 9 ? ' ' + (y + 1) : y + 1;
                    s += vc;
                    for (var x = 0; x <= xmax; x++) {
                        var c = this.at(x, y);
                        s += ' ';
                        s += c > 0 ? 'X' : c < 0 ? 'O' : '-';
                    }
                }
                return s;
            }
        }, {
            key: "toString",
            value: function toString(mode) {
                return mode == 'SGF' ? this.toStringSGF() : this.toStringTXT();
            }
        }]);

        return Board;
    })();

    tsumego.Board = Board;
})(tsumego || (tsumego = {}));
/// <reference path="board.ts" />
var tsumego;
(function (tsumego) {
    'use strict';

    var Pattern = (function () {
        function Pattern(data) {
            _classCallCheck(this, Pattern);

            this.data = data.join('');
        }

        _createClass(Pattern, [{
            key: "test",
            value: function test(board, x, y, color) {
                var $ = this,
                    tms = Pattern.tms,
                    k,
                    m;
                for (k = 0; k < tms.length; k++) {
                    m = tms[k];
                    if ($.testrm(board, x, y, color, m[0], m[1], m[2], m[3])) return true;
                }
                return false;
            }
        }, {
            key: "testrm",
            value: function testrm(board, x, y, color, mxx, mxy, myx, myy) {
                var $ = this,
                    data = $.data,
                    i,
                    j,
                    c,
                    d;
                for (i = -1; i <= 1; i++) {
                    for (j = -1; j <= 1; j++) {
                        c = board.at(x + i, y + j);
                        d = data[i * mxx + j * mxy + 1 + 3 * (i * myx + j * myy + 1)];
                        if (d == 'X' && (!c || (c ^ color) < 0) || d == 'O' && (!c || (c ^ color) > 0) || d == '.' && (c || !board.inBounds(x + i, y + j)) || d == '-' && board.inBounds(x + i, y + j)) return false;
                    }
                }
                return true;
            }
        }], [{
            key: "isEye",
            value: function isEye(board, x, y, color) {
                var i;
                for (i = 0; i < Pattern.uceyes.length; i++) if (Pattern.uceyes[i].test(board, x, y, color)) return true;
                return false;
            }
        }]);

        return Pattern;
    })();

    Pattern.tms = [[+1, 0, 0, +1], [-1, 0, 0, +1], [+1, 0, 0, -1], [0, -1, +1, 0], [-1, 0, 0, -1], [0, +1, -1, 0]];
    Pattern.uceyes = [new Pattern(['XXX', 'X.X', 'XXX']), new Pattern(['XX?', 'X.X', 'XXX']), new Pattern(['XXX', 'X.X', '---']), new Pattern(['XX-', 'X.-', '---']) // corner
    ];
    tsumego.Pattern = Pattern;
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    'use strict';
    var generators;
    (function (generators) {
        /** Basic moves generator. Tries to maximize libs. */
        function Basic(rzone) {
            return function (board, color) {
                var leafs = [];
                var forked = undefined;
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = rzone[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var m = _step4.value;

                        if (!tsumego.Pattern.isEye(board, m.x, m.y, color)) {
                            var b = forked || board.fork();
                            var r = b.play(m.x, m.y, color);
                            if (!r) {
                                forked = b;
                                continue;
                            }
                            forked = null;
                            leafs.push({
                                b: b,
                                m: m,
                                r: r,
                                n1: b.totalLibs(color),
                                n2: b.totalLibs(-color)
                            });
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
                            _iterator4["return"]();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                leafs.sort(function (a, b) {
                    return b.r - a.r || // maximize the number of captured stones first
                    b.n1 - a.n1 // then maximize the number of liberties
                     || a.n2 - b.n2; // then minimize the number of the opponent's liberties
                });
                return leafs;
            };
        }
        generators.Basic = Basic;
    })(generators = tsumego.generators || (tsumego.generators = {}));
})(tsumego || (tsumego = {}));
var tsumego;
(function (tsumego) {
    'use strict';
    var hash = function hash(b, c) {
        return (c > 0 ? 'X' : 'O') + ':' + b.hash();
    };
    /** Transposition table. */

    var TT = (function () {
        function TT() {
            _classCallCheck(this, TT);

            this._ = {};
        }

        /**
         * @param n The number of available ko treats.
         */

        _createClass(TT, [{
            key: "get",
            value: function get(b, c, n) {
                var h = hash(b, c);
                var s = this._[h];
                if (s) {
                    if (n >= s.bmax) return { color: +1, move: s.move };
                    if (n <= s.wmin) return { color: -1, move: s.move };
                }
            }

            /**
             * @param n - The number of ko treats that was needed to get the result.
             */
        }, {
            key: "set",
            value: function set(b, c, r, n) {
                var h = hash(b, c);
                var s = this._[h] || { wmin: -tsumego.infty, bmax: +tsumego.infty, move: r.move };
                if (r.color > 0 && n < s.bmax) s.bmax = n, s.move = r.move;
                if (r.color < 0 && n > s.wmin) s.wmin = n, s.move = r.move;
                this._[h] = s;
            }
        }]);

        return TT;
    })();

    tsumego.TT = TT;
})(tsumego || (tsumego = {}));
/// <reference path="pattern.ts" />
/// <reference path="movegen.ts" />
/// <reference path="tt.ts" />
var tsumego;
(function (tsumego) {
    'use strict';
    /** Returns values in 1..path.length-1 range.
        If no repetition found, returns nothing.  */
    var marked1$0 = [_solve].map(regeneratorRuntime.mark);
    function findrepd(path, b) {
        for (var i = path.length - 1; i > 0; i--) {
            if (b.hash() == path[i - 1].hash()) return i;
        }
    }
    function best(s1, s2, c) {
        var r1 = s1 && s1.color;
        var r2 = s2 && s2.color;
        if (!s1 && !s2) return;
        if (!s1) return r2 * c > 0 ? s2 : s1;
        if (!s2) return r1 * c > 0 ? s1 : s2;
        if (r1 * c > 0 && r2 * c > 0) return s1.repd > s2.repd ? s1 : s2;
        if (r1 * c < 0 && r2 * c < 0) return s1.repd < s2.repd ? s1 : s2;
        return (r1 - r2) * c > 0 ? s1 : s2;
    }
    var wins = function wins(color, result) {
        return color * result > 0;
    };
    Array.from = Array.from || function (iterable) {
        var array = [];
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = iterable[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var item = _step5.value;

                array.push(item);
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
                    _iterator5["return"]();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        return array;
    };
    function _solve(path, color, nkt, tt, expand, status, player) {
        var marked2$0, solve;
        return regeneratorRuntime.wrap(function _solve$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    solve = function solve(path, color, nkt, ko) {
                        var depth, board, ttres, result, mindepth, leafs, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _step7$value, b, m, _ko2, s, s_move, s_pass, s_asis;

                        return regeneratorRuntime.wrap(function solve$(context$3$0) {
                            while (1) switch (context$3$0.prev = context$3$0.next) {
                                case 0:
                                    context$3$0.next = 2;
                                    return;

                                case 2:
                                    // entering the node
                                    if (ko) {
                                        // since moves that require to spend a ko treat are considered
                                        // last, by this moment all previous moves have been searched
                                        // and resulted in a loss; hence the only option here is to spend
                                        // a ko treat and repeat the position
                                        nkt -= color;
                                        path = path.slice(-2);
                                    }
                                    depth = path.length;
                                    board = path[depth - 1];
                                    ttres = tt.get(board, color, nkt);

                                    if (!ttres) {
                                        context$3$0.next = 9;
                                        break;
                                    }

                                    player && player.done(ttres.color, ttres.move, null);
                                    return context$3$0.abrupt("return", ttres);

                                case 9:
                                    result = undefined;
                                    mindepth = tsumego.infty;
                                    leafs = Array.from(regeneratorRuntime.mark(function callee$3$0() {
                                        var _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _step6$value, b, m, d, _ko;

                                        return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
                                            while (1) switch (context$4$0.prev = context$4$0.next) {
                                                case 0:
                                                    _iteratorNormalCompletion6 = true;
                                                    _didIteratorError6 = false;
                                                    _iteratorError6 = undefined;
                                                    context$4$0.prev = 3;
                                                    _iterator6 = expand(board, color)[Symbol.iterator]();

                                                case 5:
                                                    if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                                                        context$4$0.next = 18;
                                                        break;
                                                    }

                                                    _step6$value = _step6.value;
                                                    b = _step6$value.b;
                                                    m = _step6$value.m;
                                                    d = findrepd(path, b);
                                                    _ko = d < depth;

                                                    if (d < mindepth) mindepth = d;
                                                    // the move makes sense if it doesn't repeat
                                                    // a previous position or the current player
                                                    // has a ko treat elsewhere on the board and
                                                    // can use it to repeat the local position

                                                    if (!(!_ko || color * nkt > 0)) {
                                                        context$4$0.next = 15;
                                                        break;
                                                    }

                                                    context$4$0.next = 15;
                                                    return {
                                                        b: b,
                                                        m: m,
                                                        ko: _ko,
                                                        nkt: _ko ? nkt - color : nkt
                                                    };

                                                case 15:
                                                    _iteratorNormalCompletion6 = true;
                                                    context$4$0.next = 5;
                                                    break;

                                                case 18:
                                                    context$4$0.next = 24;
                                                    break;

                                                case 20:
                                                    context$4$0.prev = 20;
                                                    context$4$0.t0 = context$4$0["catch"](3);
                                                    _didIteratorError6 = true;
                                                    _iteratorError6 = context$4$0.t0;

                                                case 24:
                                                    context$4$0.prev = 24;
                                                    context$4$0.prev = 25;

                                                    if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
                                                        _iterator6["return"]();
                                                    }

                                                case 27:
                                                    context$4$0.prev = 27;

                                                    if (!_didIteratorError6) {
                                                        context$4$0.next = 30;
                                                        break;
                                                    }

                                                    throw _iteratorError6;

                                                case 30:
                                                    return context$4$0.finish(27);

                                                case 31:
                                                    return context$4$0.finish(24);

                                                case 32:
                                                case "end":
                                                    return context$4$0.stop();
                                            }
                                        }, callee$3$0, this, [[3, 20, 24, 32], [25,, 27, 31]]);
                                    })());

                                    // moves that require a ko treat are considered last
                                    // that's not just perf optimization: the search depends on this
                                    leafs.sort(function (lhs, rhs) {
                                        return (rhs.nkt - lhs.nkt) * color;
                                    });
                                    _iteratorNormalCompletion7 = true;
                                    _didIteratorError7 = false;
                                    _iteratorError7 = undefined;
                                    context$3$0.prev = 16;
                                    _iterator7 = leafs[Symbol.iterator]();

                                case 18:
                                    if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                                        context$3$0.next = 51;
                                        break;
                                    }

                                    _step7$value = _step7.value;
                                    b = _step7$value.b;
                                    m = _step7$value.m;
                                    _ko2 = _step7$value.ko;
                                    s = undefined;

                                    if (!(status(b) > 0)) {
                                        context$3$0.next = 28;
                                        break;
                                    }

                                    // black wins by capturing the white's stones
                                    s = { color: +1, repd: tsumego.infty };
                                    context$3$0.next = 44;
                                    break;

                                case 28:
                                    path.push(b);
                                    player && player.play(color, m);
                                    // the opponent makes a move
                                    return context$3$0.delegateYield(solve(path, -color, nkt, _ko2), "t0", 31);

                                case 31:
                                    s_move = context$3$0.t0;

                                    if (!(s_move && wins(s_move.color, -color))) {
                                        context$3$0.next = 36;
                                        break;
                                    }

                                    s = s_move;
                                    context$3$0.next = 42;
                                    break;

                                case 36:
                                    // the opponent passes
                                    player && player.play(-color, null);
                                    return context$3$0.delegateYield(solve(path, color, nkt, _ko2), "t1", 38);

                                case 38:
                                    s_pass = context$3$0.t1;

                                    player && player.undo();
                                    s_asis = { color: status(b), repd: tsumego.infty };

                                    // the opponent can either make a move or pass if it thinks
                                    // that making a move is a loss, while the current player
                                    // can either pass again to count the result or make two
                                    // moves in a row
                                    s = best(s_move, best(s_asis, s_pass, color), -color);

                                case 42:
                                    path.pop();
                                    player && player.undo();

                                case 44:
                                    // the min value of repd is counted only for the case
                                    // if all moves result in a loss; if this happens, then
                                    // the current player can say that the loss was caused
                                    // by the absence of ko treats and point to the earliest
                                    // repetition in the path
                                    if (s.repd < mindepth) mindepth = s.repd;
                                    // the winning move may depend on a repetition, while
                                    // there can be another move that gives the same result
                                    // uncondtiionally, so it might make sense to continue
                                    // searching in such cases

                                    if (!wins(s.color, color)) {
                                        context$3$0.next = 48;
                                        break;
                                    }

                                    result = {
                                        color: color,
                                        repd: s.repd,
                                        move: m
                                    };
                                    return context$3$0.abrupt("break", 51);

                                case 48:
                                    _iteratorNormalCompletion7 = true;
                                    context$3$0.next = 18;
                                    break;

                                case 51:
                                    context$3$0.next = 57;
                                    break;

                                case 53:
                                    context$3$0.prev = 53;
                                    context$3$0.t2 = context$3$0["catch"](16);
                                    _didIteratorError7 = true;
                                    _iteratorError7 = context$3$0.t2;

                                case 57:
                                    context$3$0.prev = 57;
                                    context$3$0.prev = 58;

                                    if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
                                        _iterator7["return"]();
                                    }

                                case 60:
                                    context$3$0.prev = 60;

                                    if (!_didIteratorError7) {
                                        context$3$0.next = 63;
                                        break;
                                    }

                                    throw _iteratorError7;

                                case 63:
                                    return context$3$0.finish(60);

                                case 64:
                                    return context$3$0.finish(57);

                                case 65:
                                    // if there is no winning move, record a loss
                                    if (!result) {
                                        result = { color: -color, repd: mindepth };
                                        player && player.loss(color, null, null);
                                    } else {
                                        player && player.done(result.color, result.move, null);
                                    }
                                    if (ko) {
                                        // the (dis)proof for the node may or may not intersect with
                                        // previous nodes in the path (the information about this is
                                        // not kept anywhere) and hence it has to be assumed that the
                                        // solution intersects with the path and thus cannot be reused
                                        result.repd = 0;
                                    }
                                    // if the solution doesn't depend on a ko above the current node,
                                    // it can be stored and later used unconditionally as it doesn't
                                    // depend on a path that leads to the node; this stands true if all
                                    // such solutions are stored and never removed from the table; this
                                    // can be proved by trying to construct a path from a node in the
                                    // proof tree to the root node
                                    if (result.repd > depth) {
                                        tt.set(board, color, {
                                            color: result.color,
                                            move: result.move,
                                            repd: tsumego.infty
                                        }, nkt);
                                    }
                                    return context$3$0.abrupt("return", result);

                                case 69:
                                case "end":
                                    return context$3$0.stop();
                            }
                        }, marked2$0[0], this, [[16, 53, 57, 65], [58,, 60, 64]]);
                    };

                    marked2$0 = [solve].map(regeneratorRuntime.mark);
                    return context$2$0.delegateYield(solve(path, color, nkt, false), "t0", 3);

                case 3:
                    return context$2$0.abrupt("return", context$2$0.t0);

                case 4:
                case "end":
                    return context$2$0.stop();
            }
        }, marked1$0[0], this);
    }
    tsumego._solve = _solve;
    function solve(path, color, nkt, tt, expand, status, player) {
        return tsumego.result(_solve(path, color, nkt, tt, expand, status, player));
    }
    tsumego.solve = solve;
})(tsumego || (tsumego = {}));
/// <reference path="kb.ts" />
/// <reference path="xhr.ts" />
/// <reference path="../src/solver.ts" />
/// <reference path="wgo/wgo.d.ts" />
var testbench;
(function (testbench) {
    var n2s = tsumego.n2s;
    var s2n = tsumego.s2n;
    var Color = tsumego.Color;
    var Board = tsumego.Board;
    var goban = null;
    /** In SGF a B stone at x = 8, y = 2
        is written as B[ic] on a 9x9 goban
        it corresponds to J7 - the I letter
        is skipped and the y coordinate is
        counted from the bottom starting from 1. */
    var xy2s = function xy2s(m) {
        return !m ? 'null' : String.fromCharCode(0x41 + (m.x > 7 ? m.x - 1 : m.x)) + (goban.board.size - m.y);
    };
    var c2s = Color.alias;
    var cm2s = function cm2s(c, m) {
        return c2s(c) + (m ? ' plays at ' + xy2s(m) : ' passes');
    };
    var cw2s = function cw2s(c, m) {
        return c2s(c) + ' wins by ' + (m ? xy2s(m) : 'passing');
    };
    /** { x: 2, y: 3 } -> `cd` */
    var xy2f = function xy2f(xy) {
        return n2s(xy.x) + n2s(xy.y);
    };
    /** -1, { x: 2, y: 3 } -> `W[cd]` */
    var xyc2f = function xyc2f(c, xy) {
        return (c > 0 ? 'B' : 'W') + '[' + xy2f(xy) + ']';
    };
    /** `cd` -> { x: 2, y: 3 } */
    var f2xy = function f2xy(s) {
        return { x: s2n(s, 0), y: s2n(s, 1) };
    };
    function parseSGF(source) {
        var brd = new Board(source);
        var sgf = SGF.parse(source);
        var setup = sgf.steps[0];
        var aim = f2xy(setup['MA'][0]);
        var rzn = setup['DD'].map(f2xy);
        return [brd, rzn, aim];
    }
    function s2s(c, s) {
        var isDraw = s.color == 0;
        var isLoss = s.color * c < 0;
        return c2s(c) + ' ' + (isLoss ? 'loses' : (isDraw ? 'draws' : 'wins') + ' with ' + xy2s(s.move));
    }
    /** shared transposition table for black and white */
    var tt = new tsumego.TT();
    function solve(path, color) {
        var nkotreats = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
        var log = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

        var t0 = +new Date();
        var rs = tsumego.solve(path, color, nkotreats, tt, tsumego.generators.Basic(rzone), function (b) {
            return b.at(aim.x, aim.y) < 0 ? -1 : +1;
        });
        var t1 = +new Date();
        if (log) {
            console.log('solved in', ((t1 - t0) / 1000).toFixed(2), 'seconds');
            console.log(s2s(color, rs));
        }
        return rs;
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
    function dbgsolve(path, color) {
        var nkotreats = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        var log = true;
        var player = {
            play: function play(color, move) {
                if (!log) return;
                var node = new WGo.KNode({
                    _edited: true,
                    move: {
                        pass: !move,
                        x: move && move.x,
                        y: move && move.y,
                        c: color > 0 ? WGo.B : WGo.W
                    }
                });
                goban.kifuReader.node.appendChild(node);
                goban.next(goban.kifuReader.node.children.length - 1);
            },
            undo: function undo() {
                if (!log) return;
                goban.previous();
            },
            done: function done(color, move, note) {
                if (!log) return;
                var comment = cw2s(color, move) + " " + (note ? '(' + note + ')' : '') + "\n";
                var node = goban.kifuReader.node;
                node.comment = node.comment || '';
                node.comment += comment;
                goban.update();
            },
            loss: function loss(color, move, response) {
                if (!log) return;
                var comment = "if " + cm2s(color, move) + ", then " + cw2s(-color, response) + "\n";
                var node = goban.kifuReader.node;
                node.comment = node.comment || '';
                node.comment += comment;
                goban.update();
            }
        };
        var solver = tsumego._solve(path, color, nkotreats, tt, tsumego.generators.Basic(rzone), function (b) {
            return b.at(aim.x, aim.y) < 0 ? -1 : +1;
        }, player);
        window['solver'] = solver;
        var tick = 0;
        var board = undefined;
        var result = undefined;
        var next = function next() {
            var _solver$next = solver.next();

            var done = _solver$next.done;
            var value = _solver$next.value;

            tick++;
            board = path[path.length - 1];
            result = value;
            if (log) {
                var bp = ';bp=' + tick;
                var rx = /;bp=\d+/;
                location.href = rx.test(location.hash) ? location.href.replace(rx, bp) : location.href + bp;
            }
        };
        var stepOver = function stepOver(ct) {
            var b = board;
            return new Promise(function (resolve, reject) {
                while (!result || !board || b.hash() != board.hash()) {
                    next();
                    if (ct.cancelled) return void reject();
                }
                resolve();
            }).then(function () {
                //console.log(s2s(color, result) + ':\n' + b);
                next();
            });
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
            stepOver(ct)["catch"]().then(function () {
                return hook.dispose();
            });
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
        console.log('debug mode:', c2s(color), 'to play with', nkotreats, 'external ko treats\n', 'F11 - step into\n', 'Ctrl+F11 - step into and debug\n', 'F10 - step over\n', 'Shift+F11 - step out\n', 'G - go to a certain step\n');
        testbench.keyboard.hook('G'.charCodeAt(0), function (event) {
            event.preventDefault();
            var stopat = +prompt('Step #:');
            if (!stopat) return;
            console.log('skipping first', stopat, 'steps...');
            while (tick < stopat) next();
            renderSGF(board.toString('SGF'));
        });
    }
    /** Constructs the proof tree in the SGF format.
        The tree's root is a winning move and its
        branches are all possible answers of the opponent. */
    function proof(path, color) {
        var nkt = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
        var depth = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

        var _solve2 = solve(path, color, nkt);

        var move = _solve2.move;

        if (!move) return null;
        var b = path[path.length - 1].fork();
        if (!b.play(move.x, move.y, color)) {
            debugger;
            throw new Error('Impossible move: ' + xy2s(move));
        }
        // check for repetitions
        var d = path.length - 1;
        while (d >= 0 && path[d].hash() != b.hash()) d--;
        // check if -color can make this move
        if (d >= 0) {
            if (color * nkt > 0) nkt -= color;else {
                debugger;
                throw new Error('The play doesnt have ko treats for this repetition.');
            }
        }
        var vars = '';
        if (b.at(aim.x, aim.y)) {
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = rzone[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var m = _step8.value;

                    var bm = b.fork();
                    if (!bm.play(m.x, m.y, -color)) continue;
                    // check for repetitions
                    var _d = path.length - 1;
                    while (_d >= 0 && path[_d].hash() != bm.hash()) _d--;
                    // check if -color can make this move
                    if (_d >= 0) {
                        if (color * nkt < 0) nkt += color;else continue;
                    }
                    path.push(bm);
                    var p = proof(path, color, nkt, depth + 1);
                    path.pop();
                    if (p) vars += '\n ' + '  '['repeat'](depth + 1) + '(;' + xyc2f(-color, m) + p + ')';
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
                        _iterator8["return"]();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }
        }
        return ';' + xyc2f(color, move) + vars;
    }
    var board, rzone, aim, path;
    var source = location.search.slice(1);
    var sgfdata = '';
    (source.slice(0, 1) == '(' ? Promise.resolve(source) : send('GET', '/problems/' + source + '.sgf')).then(function (res) {
        var _parseSGF = parseSGF(res);

        var _parseSGF2 = _slicedToArray(_parseSGF, 3);

        board = _parseSGF2[0];
        rzone = _parseSGF2[1];
        aim = _parseSGF2[2];

        path = [board.fork()];
        console.log(res);
        sgfdata = res;
        console.log('\n\n' + board.hash() + '\n\n' + board);
        document.title = source;
        setTimeout(function () {
            return renderSGF(res);
        });
        try {
            var _BWD$exec = /^#(B|W)([+-]\d+)/.exec(location.hash);

            var _BWD$exec2 = _slicedToArray(_BWD$exec, 3);

            var bw = _BWD$exec2[1];
            var nkt = _BWD$exec2[2];

            dbgsolve(path, bw == 'W' ? -1 : +1, +nkt);
        } catch (_) {
            console.log(_);
        }
    })["catch"](function (err) {
        console.error(err);
    });
    function renderSGF(sgf) {
        goban = new WGo.BasicPlayer(document.body, {
            // a dummy C{...] tag is needed to
            // enable the comment box in wgo
            sgf: sgf.replace(/\)\s*$/, 'C[ ])')
        });
        goban.setCoordinates(true);
        goban.kifuReader.allowIllegalMoves(true);
    }
    function parse(si) {
        return {
            x: si.charCodeAt(0) - 65,
            y: +/\d+/.exec(si)[0] - 1
        };
    }
    window['$'] = function (data) {
        var cmd = data.toString().trim().split(' ');
        var col = cmd[0].toLowerCase();
        switch (col) {
            case 'x':
            case 'o':
                var xy = cmd[1] && cmd[1].toUpperCase();
                var b = path[path.length - 1].fork();
                var c = cmd[0].toUpperCase() == 'O' ? -1 : +1;
                if (/^[a-z]\d+$/i.test(xy)) {
                    var p = parse(xy);
                    if (!b.play(p.x, p.y, c)) {
                        console.log(col, 'cannot play at', xy);
                    } else {
                        path.push(b);
                        console.log('\n\n' + b.hash() + '\n\n' + b);
                    }
                } else {
                    var _solve3 = solve(path, c, !xy ? 0 : +xy, true);

                    var move = _solve3.move;

                    if (!move) {
                        console.log(col, 'passes');
                    } else {
                        var sgfp = sgfdata.replace(/\)\s*$/, '\n\n (' + proof(path, c, !xy ? 0 : +xy) + '))');
                        b.play(move.x, move.y, c);
                        path.push(b);
                        console.log('\n\n' + b.hash() + '\n\n' + b);
                        renderSGF(sgfp);
                    }
                }
                break;
            case 'undo':
                if (path.length > 1) {
                    for (var n = +(cmd[1] || 1); n > 0 && path.length > 1; n--) {
                        path.pop();
                        board = path[path.length - 1];
                    }
                    console.log('\n\n' + board.hash() + '\n\n' + board);
                } else {
                    console.log('nothing to undo');
                }
                break;
            case 'path':
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = path[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var _b = _step9.value;

                        console.log('\n\n' + _b.hash() + '\n\n' + _b);
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9["return"]) {
                            _iterator9["return"]();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }

                break;
            default:
                console.log('unknown command');
        }
    };
})(testbench || (testbench = {}));
//# sourceMappingURL=app.js.map

// TODO: better to use array comprehensions here
//# sourceMappingURL=app.es5.js.map
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var testbench;
(function (testbench) {
    var Event = (function () {
        function Event() {
            _classCallCheck(this, Event);

            this.listeners = [];
        }

        _createClass(Event, [{
            key: 'add',
            value: function add(listener) {
                this.listeners.push(listener);
            }
        }, {
            key: 'fire',
            value: function fire() {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var listener = _step.value;

                        try {
                            listener.apply(undefined, arguments);
                        } catch (err) {
                            console.log('an event listener has thrown an error:', err && err.stack || err);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }]);

        return Event;
    })();

    testbench.Event = Event;
})(testbench || (testbench = {}));
var testbench;
(function (testbench) {
    var name = 'tsumego.js';

    var SVM = (function () {
        function SVM(storage) {
            _classCallCheck(this, SVM);

            this.storage = storage;
            /** A callback that's invoked once an entry is removed. */
            this.removed = new testbench.Event();
            /** A callback that's invoked once an entry is added. */
            this.added = new testbench.Event();
        }

        _createClass(SVM, [{
            key: 'get',
            value: function get(path) {
                return this.data[path];
            }
        }, {
            key: 'set',
            value: function set(path, sgf) {
                var json = this.data;
                var wasthere = !!json[path];
                json[path] = sgf || undefined;
                this.data = json;
                if (wasthere && !sgf) this.removed.fire(path);
                if (!wasthere && sgf) this.added.fire(path, sgf);
            }
        }, {
            key: 'data',
            get: function get() {
                return JSON.parse(this.storage.getItem(name)) || {};
            },
            set: function set(json) {
                this.storage.setItem(name, JSON.stringify(json));
            }
        }, {
            key: 'filter',
            get: function get() {
                return this.storage.getItem('filter') || '';
            },
            set: function set(value) {
                this.storage.setItem('filter', value || '');
            }
        }, {
            key: 'dst',
            get: function get() {
                return +this.storage.getItem('dst') || 0;
            },
            set: function set(value) {
                this.storage.setItem('dst', value + '');
            }
        }]);

        return SVM;
    })();

    testbench.ls = new SVM(localStorage);
    testbench.ss = new SVM(sessionStorage);
})(testbench || (testbench = {}));
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
function send(method, url, data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        if (data !== undefined) xhr.send(data);else xhr.send();
        xhr.onreadystatechange = function (event) {
            if (xhr.readyState == xhr.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);else reject(Error(method + ' ' + url + ' => ' + xhr.status));
            }
        };
    });
}
var testbench;
(function (testbench) {
    var stone = tsumego.stone;
    var SGF = tsumego.SGF;

    var Marks = (function () {
        function Marks(svg, update, def) {
            _classCallCheck(this, Marks);

            this.svg = svg;
            this.update = update;
            this.def = def;
            try {
                this.tag = /\bid="(\w+)"/.exec(def)[1];
                var defs = svg.querySelector('defs');
                // IE doesn't support innerHTML for SVG elements, hence this hack
                var g = document.createElementNS(this.svg.getAttribute('xmlns'), 'g');
                g.innerHTML = def;
                var m = g.firstChild;
                g.removeChild(m);
                defs.appendChild(m);
            } catch (_) {}
        }

        _createClass(Marks, [{
            key: 'nodes',
            value: regeneratorRuntime.mark(function nodes() {
                var refs, i, type;
                return regeneratorRuntime.wrap(function nodes$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            if (!this.tag) {
                                context$3$0.next = 12;
                                break;
                            }

                            refs = $(this.svg).find('use').toArray();
                            i = 0;

                        case 3:
                            if (!(i < refs.length)) {
                                context$3$0.next = 10;
                                break;
                            }

                            if (!(refs[i].getAttribute('xlink:href') == '#' + this.tag)) {
                                context$3$0.next = 7;
                                break;
                            }

                            context$3$0.next = 7;
                            return refs[i];

                        case 7:
                            i++;
                            context$3$0.next = 3;
                            break;

                        case 10:
                            context$3$0.next = 15;
                            break;

                        case 12:
                            type = /^<(\w+) /.exec(this.def)[1];
                            refs = $(this.svg).find(type).toArray();
                            return context$3$0.delegateYield(refs, 't0', 15);

                        case 15:
                        case 'end':
                            return context$3$0.stop();
                    }
                }, nodes, this);
            })
        }, {
            key: 'get',
            value: function get(x, y) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.nodes()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var ref = _step2.value;

                        if (+ref.getAttribute('x') == x && +ref.getAttribute('y') == y) return ref;
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                            _iterator2['return']();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return null;
            }
        }, {
            key: 'add',
            value: function add(x, y, value) {
                var ref = this.get(x, y);
                if (ref) return ref;
                var g = document.createElementNS(this.svg.getAttribute('xmlns'), 'g');
                g.innerHTML = this.tag ? '<use x="' + x + '" y="' + y + '" xlink:href="#' + this.tag + '"/>' : this.def.replace(/\bx=""/, 'x="' + x + '"').replace(/\by=""/, 'y="' + y + '"').replace('></', '>' + value + '</');
                var m = g.firstChild;
                g.removeChild(m);
                this.svg.appendChild(m);
                this.update(x, y);
                return m;
            }
        }, {
            key: 'remove',
            value: function remove(x, y) {
                var ref = this.get(x, y);
                if (!ref) return;
                this.svg.removeChild(ref);
                this.update(x, y);
            }
        }, {
            key: 'clear',
            value: function clear() {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.nodes()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var ref = _step3.value;

                        var x = +ref.getAttribute('x');
                        var y = +ref.getAttribute('y');
                        this.svg.removeChild(ref);
                        this.update(x, y);
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                            _iterator3['return']();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }
        }]);

        return Marks;
    })();

    var SVGGobanElement;
    (function (SVGGobanElement) {
        function create(sgf) {
            var root = SGF.parse(sgf).steps[0];
            var n = +root['SZ'][0];
            var div = document.createElement('div');
            div.innerHTML = '\n            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"\n                 xmlns:xlink="http://www.w3.org/1999/xlink"\n                 width="100%"\n                 viewBox="-1.5 -1.5 ' + (n + 2) + ' ' + (n + 2) + '">\n              <defs>\n                <pattern id="svg-goban-grid" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">\n                  <path d="M 1 0 L 0 0 0 1" fill="none" stroke="black" stroke-width="0.05"></path>\n                </pattern>\n              </defs>\n\n              <rect x="0" y="0" width="' + (n - 1) + '" height="' + (n - 1) + '" fill="url(#svg-goban-grid)" stroke="black" stroke-width="0.1"></rect>\n            </svg>';
            var svg = div.querySelector('svg');
            div.removeChild(svg);
            Object.assign(svg, {
                AB: new Marks(svg, update, '<circle id="AB" r="0.475" fill="black" stroke="black" stroke-width="0.05"></circle>'),
                AW: new Marks(svg, update, '<circle id="AW" r="0.475" fill="white" stroke="black" stroke-width="0.05"></circle>'),
                CR: new Marks(svg, update, '<circle id="CR" r="0.5" stroke="none" transform="scale(0.4)"></circle>'),
                TR: new Marks(svg, update, '<path id="TR" d="M 0 -0.5 L -0.433 0.25 L 0.433 0.25 Z" stroke="none" transform="scale(0.5)"></path>'),
                MA: new Marks(svg, update, '<path id="MA" d="M -0.2 -0.2 L 0.2 0.2 M 0.2 -0.2 L -0.2 0.2" stroke-width="0.05"></path>'),
                SQ: new Marks(svg, update, '<rect id="SQ" x="-0.5" y="-0.5" width="1" height="1" stroke="none" transform="scale(0.4)"></rect>'),
                SL: new Marks(svg, update, '<rect id="SL" x="-0.5" y="-0.5" width="1" height="1" fill-opacity="0.5" stroke="none"></rect>'),
                LB: new Marks(svg, update, '<text x="" y="" font-size="0.3" text-anchor="middle" dominant-baseline="middle" stroke-width="0"></text>')
            });
            // invoked after a marker has been added or removed
            function update(x, y) {
                var color = svg.AB.get(x, y) ? 'white' : 'black';
                for (var mark in svg) {
                    if (/^[A-Z]{2}$/.test(mark) && !/AB|AW|SL/.test(mark)) {
                        try {
                            var item = svg[mark].get(x, y);
                            if (item) {
                                item.setAttribute('stroke', color);
                                item.setAttribute('fill', color);
                            }
                        } catch (err) {
                            console.log(mark, x, y, err);
                        }
                    }
                }
            }
            for (var mark in root) {
                var marks = svg[mark];
                if (!marks) continue;
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = root[mark][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var text = _step4.value;

                        var s = stone.fromString(text.slice(0, 2));
                        var m = marks.add(stone.x(s), stone.y(s));
                        if (/:/.test(text)) m.textContent = /:(.+)$/.exec(text)[1];
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                            _iterator4['return']();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            }
            // upper letters: A, B, C, ...
            for (var x = 0; x < n; x++) {
                var label = stone.cc.toString(stone.make(x, 0, 0), n)[0];
                svg.LB.add(x, -0.7, label);
            }
            // left digits: 9, 8, 7, ...
            for (var y = 0; y < n; y++) {
                var label = stone.cc.toString(stone.make(0, y, 0), n).slice(1);
                svg.LB.add(-0.7, y, label);
            }
            // lower labels: a, b, c, ...
            for (var x = 0; x < n; x++) {
                var label = stone.toString(stone.make(x, 0, 0))[1];
                svg.LB.add(x, n - 1 + 0.7, label);
            }
            // right letters: a, b, c, ...
            for (var y = 0; y < n; y++) {
                var label = stone.toString(stone.make(0, y, 0))[2];
                svg.LB.add(n - 1 + 0.7, y, label);
            }
            function getStoneCoords(event) {
                // Chrome had a bug which made offsetX/offsetY coords wrong
                // this workaround computes the offset using client coords
                var r = svg.getBoundingClientRect();
                var offsetX = event.clientX - r.left;
                var offsetY = event.clientY - r.top;
                var x = offsetX / r.width;
                var y = offsetY / r.height;
                var nx = Math.round(x * (n + 2) - 1.5);
                var ny = Math.round(y * (n + 2) - 1.5);
                return nx >= 0 && nx < n && ny >= 0 && ny < n && [nx, ny];
            }
            function attachCellCoords(event) {
                var coords = getStoneCoords(event);
                if (coords) {
                    ;

                    var _coords = _slicedToArray(coords, 2);

                    event.cellX = _coords[0];
                    event.cellY = _coords[1];
                }
            }
            svg.addEventListener('click', attachCellCoords);
            svg.addEventListener('mousedown', attachCellCoords);
            svg.addEventListener('mousemove', attachCellCoords);
            svg.addEventListener('mouseup', attachCellCoords);
            return svg;
        }
        SVGGobanElement.create = create;
    })(SVGGobanElement = testbench.SVGGobanElement || (testbench.SVGGobanElement = {}));
})(testbench || (testbench = {}));
var testbench;
(function (testbench) {
    testbench.qargs = {};
    try {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = location.search.slice(1).split('&')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var pair = _step5.value;

                if (!pair) continue;

                var _pair$split$map$map = pair.split('=').map(function (s) {
                    return s.replace(/\+/g, ' ');
                }).map(decodeURIComponent);

                var _pair$split$map$map2 = _slicedToArray(_pair$split$map$map, 2);

                var key = _pair$split$map$map2[0];
                var val = _pair$split$map$map2[1];

                try {
                    testbench.qargs[key] = val ? JSON.parse(val) : undefined;
                } catch (err) {
                    testbench.qargs[key] = val;
                }
            }
        } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                    _iterator5['return']();
                }
            } finally {
                if (_didIteratorError5) {
                    throw _iteratorError5;
                }
            }
        }

        if (testbench.qargs.autorespond === undefined) testbench.qargs.autorespond = true;
        if (testbench.qargs.check === undefined) testbench.qargs.check = true;
        console.log('qargs:', testbench.qargs);
    } catch (err) {
        console.warn('Failed to parse qargs:', err);
    }
})(testbench || (testbench = {}));
/// <reference path="qargs.ts" />
var testbench;
(function (testbench) {
    testbench.vm = new ((function () {
        function VM() {
            var _this = this;

            _classCallCheck(this, VM);

            this.sgfchanged = new testbench.Event();
            this.dbg = new ((function () {
                function DbgVM() {
                    _classCallCheck(this, DbgVM);
                }

                _createClass(DbgVM, [{
                    key: 'inactive',
                    set: function set(value) {
                        $('#dbg-panel button').toggleClass('disabled', value);
                    }

                    /** aka F5 */
                }, {
                    key: 'run',
                    get: function get() {
                        return $('#dbg-run');
                    }
                }, {
                    key: 'bp',
                    get: function get() {
                        return $('#dbg-bp');
                    }

                    /** aka F11 */
                }, {
                    key: 'stepInto',
                    get: function get() {
                        return $('#dbg-into');
                    }

                    /** aka F10 */
                }, {
                    key: 'stepOver',
                    get: function get() {
                        return $('#dbg-next');
                    }

                    /** aka Shift+F11 */
                }, {
                    key: 'stepOut',
                    get: function get() {
                        return $('#dbg-undo');
                    }
                }, {
                    key: 'stop',
                    get: function get() {
                        return $('#dbg-stop');
                    }
                }]);

                return DbgVM;
            })())();
            $(function () {
                $('#sgf').focusout(function () {
                    _this.sgfchanged.fire();
                });
                document.addEventListener('keydown', function (event) {
                    var key = event.key.toUpperCase();
                    var tool = $('button[data-key=' + key + ']').attr('data-value');
                    if (tool) testbench.vm.tool = tool;
                });
                document.addEventListener('keyup', function (event) {
                    var key = event.key.toUpperCase();
                    var tool = $('button[data-key=' + key + ']').attr('data-value');
                    if (tool == testbench.vm.tool) testbench.vm.tool = null;
                });
            });
        }

        _createClass(VM, [{
            key: 'mode',
            set: function set(value) {
                document.body.className = value;
            },
            get: function get() {
                return document.body.className;
            }

            /** The currently selected editor tool: MA, AB, AW, etc. */
        }, {
            key: 'tool',
            get: function get() {
                var button = document.querySelector('#tool button.active');
                return button && button.getAttribute('data-value');
            },
            set: function set(value) {
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = $('#tool button').toArray()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var button = _step6.value;

                        if (button.getAttribute('data-value') == value) button.classList.add('active');else button.classList.remove('active');
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                            _iterator6['return']();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }
            }

            /** ko master: +1, -1 or 0 */
        }, {
            key: 'km',
            get: function get() {
                var b = document.querySelector('#km button.active');
                return b ? +b.getAttribute('data-value') : undefined;
            },
            set: function set(value) {
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = $('#km button').toArray()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var button = _step7.value;

                        if (+button.getAttribute('data-value') == value) button.classList.add('active');else button.classList.remove('active');
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                            _iterator7['return']();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }
            }

            /** Hides/shows the km selector. */
        }, {
            key: 'kmVisible',
            set: function set(viisble) {
                $('#km').css('display', viisble ? '' : 'none');
            }

            /** e.g. "B3 bc" */
        }, {
            key: 'coords',
            set: function set(text) {
                $('#coords').text(text);
            }
        }, {
            key: 'note',
            set: function set(text) {
                $('#comment').text(text);
            }
        }, {
            key: 'sgf',
            get: function get() {
                return $('#sgf').text();
            },
            set: function set(text) {
                $('#sgf').text(text);
            }
        }, {
            key: 'svg',
            set: function set(text) {
                // better to reformat the entire xml, but this works too
                text = text.replace(/(<\/\w+>)(<\w+)/gm, '$1\n  $2');
                $('#svg').text(text);
            }
        }, {
            key: 'canUndo',
            set: function set(value) {
                if (value) $('#undo').removeClass('disabled');else $('#undo').addClass('disabled');
            }
        }]);

        return VM;
    })())();
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
            var _this2 = this;

            _classCallCheck(this, Directory);

            /** Fired when the close icon is clicked on an item. */
            this.deleted = new testbench.Event();
            this.input = $(container).find('input');
            this.container = $(container).find('.menu');
            this.input.change(function () {
                _this2.filter = _this2.input.val();
            });
            this.filter = testbench.ss.filter;
            setTimeout(function () {
                // restore the scrolling offset after
                // the problems are loaded; that's a hack,
                // actually
                _this2.container.scrollTop(testbench.ss.dst);
            });
            this.container.click(function (event) {
                var target = $(event.target);
                if (target.is('.icon')) {
                    event.stopPropagation();
                    event.preventDefault(); // otherwise window#hashchange will be triggered
                    if (target.is('.close')) {
                        var a = target.parent();
                        a.addClass('deleted'); // to be actually deleted once page closed
                    }
                    if (target.is('.undo')) {
                        var a = target.parent();
                        a.removeClass('deleted');
                    }
                }
            });
            window.addEventListener('beforeunload', function () {
                testbench.ss.dst = _this2.container.scrollTop();
                _this2.container.find('.item.deleted').each(function (i, a) {
                    var path = $(a).text();
                    _this2.deleted.fire(path);
                });
            });
            document.addEventListener('keydown', function (event) {
                var a = _this2.container.find('.item.active');
                if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                    if (event.keyCode == 38) location.hash = a.prevAll('.item:visible').first().attr('href') || location.hash;
                    if (event.keyCode == 40) location.hash = a.nextAll('.item:visible').first().attr('href') || location.hash;
                }
            });
        }

        _createClass(Directory, [{
            key: 'item',
            value: function item(path) {
                var a = this.add(path);
                return new ((function () {
                    function DirectoryItem() {
                        _classCallCheck(this, DirectoryItem);
                    }

                    _createClass(DirectoryItem, [{
                        key: 'hard',
                        set: function set(value) {
                            $(a).toggleClass('hard', value);
                        }
                    }]);

                    return DirectoryItem;
                })())();
            }
        }, {
            key: 'toggle',
            value: function toggle(item, filter) {
                var path = $(item).text();
                var visible = path.indexOf(filter) >= 0 || path == location.hash.slice(1);
                $(item).toggle(visible);
            }
        }, {
            key: 'find',
            value: function find(path) {
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = this.container.find('a.item').toArray()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var e = _step8.value;

                        var a = e;
                        var matches = typeof path === 'string' ? a.hash == '#' + path : path(a.hash.slice(1));
                        if (matches) return a;
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8['return']) {
                            _iterator8['return']();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }
            }

            /**
             * Returns an existing entry if it already exists.
             */
        }, {
            key: 'add',
            value: function add(path) {
                var a = this.find(path);
                if (!a) {
                    var next = this.find(function (s) {
                        return s > path;
                    });
                    a = document.createElement('a');
                    a.setAttribute('class', 'item');
                    a.setAttribute('href', '#' + path);
                    a.textContent = path;
                    a.innerHTML += '<i class="icon close" title="Delete this tsumego"></i>';
                    a.innerHTML += '<i class="icon undo" title="Restore this tsumego"></i>';
                    a.innerHTML += '<i class="icon star" title="This is a hard tsumego"></i>';
                    if (next) $(a).insertBefore(next);else this.container.append(a);
                    this.toggle(a, this.filter);
                }
                return a;
            }

            /**
             * Does nothing if the entry doesn't exist.
             */
        }, {
            key: 'remove',
            value: function remove(path) {
                $(this.find(path)).remove();
            }

            /**
             * Makes this item active. Expands folders as necessary.
             */
        }, {
            key: 'select',
            value: function select(path) {
                this.container.find('.active').removeClass('active');
                $(this.find(path)).addClass('active');
            }
        }, {
            key: 'filter',
            get: function get() {
                return this.input.val();
            },
            set: function set(value) {
                this.input.val(value);
                testbench.ss.filter = value;
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = this.container.find('a.item').toArray()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var e = _step9.value;

                        this.toggle(e, value);
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9['return']) {
                            _iterator9['return']();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }
            }
        }]);

        return Directory;
    })();

    testbench.Directory = Directory;
})(testbench || (testbench = {}));
var testbench;
(function (testbench) {
    var stone = tsumego.stone;
    var solve = tsumego.solve;
    var benson = tsumego.benson;
    var mgen = tsumego.mgen;
    var TT = tsumego.TT;
    var hex = tsumego.hex;
    function dbgsolve(board, color, km, aim, stubs, refresh) {
        var debug = {};
        var target = board.get(aim);
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
            for (var _iterator10 = stubs[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var s = _step10.value;

                if (!board.play(stone.make(stone.x(s), stone.y(s), -target))) throw Error('Invalid stub: ' + stone.toString(s));
            }
        } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion10 && _iterator10['return']) {
                    _iterator10['return']();
                }
            } finally {
                if (_didIteratorError10) {
                    throw _iteratorError10;
                }
            }
        }

        board.drop();
        var solver = solve.start({
            debug: debug,
            board: board,
            color: color,
            km: km,
            tt: new TT(),
            expand: mgen.fixed(board, aim),
            target: aim,
            alive: testbench.qargs.benson && function (b) {
                return benson.alive(b, aim);
            }
        });
        window['solver'] = solver;
        window['debug'] = debug;
        var step = 0;
        var render = true;
        var isdone = false;
        var dbgbreak = false;
        var breakpoints = [];
        breakpoints.matches = function () {
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = breakpoints[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var bp = _step11.value;

                    if (bp == '@' + hex(board.hash) || bp == '#' + step) return bp;
                }
            } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion11 && _iterator11['return']) {
                        _iterator11['return']();
                    }
                } finally {
                    if (_didIteratorError11) {
                        throw _iteratorError11;
                    }
                }
            }

            return null;
        };
        function next() {
            var _solver$next = solver.next();

            var done = _solver$next.done;
            var value = _solver$next.value;

            var comment = done ? 'result = ' + stone.toString(value) : value;
            if (done) {
                isdone = true;
                testbench.vm.dbg.inactive = true;
                console.log('result = ' + stone.toString(value));
            } else {
                step++;
            }
            if (render) {
                refresh();
                writeComment(comment);
            }
            return comment;
        }
        function run() {
            var stop = arguments.length <= 0 || arguments[0] === undefined ? function () {
                return false;
            } : arguments[0];

            var svg = refresh();
            render = false;
            dbgbreak = false;
            testbench.vm.note = 'solving...';
            var comment = '';
            var moves = [];
            var items = [];
            (function fn() {
                var t = Date.now();
                while (!isdone && !dbgbreak && !breakpoints.matches() && !stop()) {
                    comment = next();
                    if (Date.now() > t + (testbench.qargs.freq || 250)) {
                        var newmoves = debug.moves.slice(0, testbench.qargs.depth || 4);
                        if (newmoves + '' != moves + '') {
                            moves.length = 0;
                            moves.push.apply(moves, _toConsumableArray(newmoves));
                            var _iteratorNormalCompletion12 = true;
                            var _didIteratorError12 = false;
                            var _iteratorError12 = undefined;

                            try {
                                for (var _iterator12 = items[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                                    var item = _step12.value;

                                    svg.removeChild(item);
                                }
                            } catch (err) {
                                _didIteratorError12 = true;
                                _iteratorError12 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion12 && _iterator12['return']) {
                                        _iterator12['return']();
                                    }
                                } finally {
                                    if (_didIteratorError12) {
                                        throw _iteratorError12;
                                    }
                                }
                            }

                            items.length = 0;
                            for (var i = 0; i < newmoves.length; i++) {
                                var move = debug.moves[i];

                                var _stone$coords = stone.coords(move);

                                var _stone$coords2 = _slicedToArray(_stone$coords, 2);

                                var x = _stone$coords2[0];
                                var y = _stone$coords2[1];

                                if (stone.hascoords(move)) {
                                    var _stone = (move > 0 ? svg.AB : svg.AW).add(x, y);
                                    var label = svg.LB.add(x, y, i + 1 + '');
                                    items.push(_stone, label);
                                }
                            }
                        }
                        return setTimeout(fn);
                    }
                }
                render = true;
                writeComment(comment);
                refresh();
            })();
        }
        function writeComment(comment) {
            testbench.vm.note = [comment, '#' + step + ' @' + hex(board.hash), 'color = ' + stone.label.string(debug.color), 'km = ' + (debug.km && stone.label.string(debug.km)), 'depth = ' + debug.depth].join('; ');
        }
        // "undo" the current move
        function stepOut() {
            var path = debug.moves;
            var n = path.length;
            run(function () {
                return path.length < n;
            });
        }
        testbench.vm.dbg.stepInto.click(next);
        testbench.vm.dbg.stepOver.click(function () {
            stepOut();
            next();
        });
        testbench.vm.dbg.stepOut.click(stepOut);
        testbench.vm.dbg.run.click(function () {
            run();
        });
        testbench.vm.dbg.stop.click(function () {
            dbgbreak = true;
        });
        testbench.vm.dbg.bp.click(function () {
            var bp = (prompt('Pause at, e.g. @1bc4570f or #225') || '').trim();
            if (!bp) return;
            if (!/^#\d+|@[0-9a-f]{8}$/.test(bp)) {
                alert('Wrong bp format: ' + bp);
                return;
            }
            breakpoints.push(bp);
            testbench.vm.dbg.bp.css('color', 'red');
        });
        testbench.vm.note = stone.label.string(color) + ' to play, km = ' + (km && stone.label.string(km));
    }
    testbench.dbgsolve = dbgsolve;
})(testbench || (testbench = {}));
/// <reference path="../tsumego.d.ts" />
/// <reference path="kb.ts" />
/// <reference path="xhr.ts" />
/// <reference path="goban.ts" />
/// <reference path="vm.ts" />
/// <reference path="directory.ts" />
/// <reference path="debugger.ts" />
// this is useful when debugging
window['board'] = null;
window['$s'] = tsumego.stone.toString;
window['$b'] = tsumego.block.toString;
window['$x'] = tsumego.hex;
window['ui'] = null;
var testbench;
(function (testbench) {
    var marked1$0 = [listSelectedCoords].map(regeneratorRuntime.mark);

    var stone = tsumego.stone;
    var block = tsumego.block;
    var Board = tsumego.Board;
    var SGF = tsumego.SGF;
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
    var solving = undefined;
    var problem = undefined;
    // ?rs=123 sets the rand seed
    var rs = +testbench.qargs.rs || Date.now() | 0;
    console.log('rand seed:', rs);
    tsumego.rand.seed(rs);
    function solve(op, board, color, km) {
        return Promise.resolve().then(function () {
            var g = problem.g_solve(color, {
                km: km,
                time: 300,
                benson: testbench.qargs.benson
            });
            var s = g.next();
            return new Promise(function (resolve, reject) {
                setTimeout(function fn() {
                    op && op.notify();
                    if (op && op.cancelled) {
                        reject(op.cancelled);
                    } else if (s.done) {
                        resolve(s.value);
                    } else {
                        s = g.next();
                        setTimeout(fn);
                    }
                });
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
    var aim = undefined;
    var lspath = '';
    var solvingFor = undefined;
    var stubs = new stone.Set(); // stubs in the outer wall to make it safe
    var selection;
    function getSelectedRect() {
        return selection && {
            xmin: Math.min(selection.x1, selection.x2),
            ymin: Math.min(selection.y1, selection.y2),
            xmax: Math.max(selection.x1, selection.x2),
            ymax: Math.max(selection.y1, selection.y2)
        };
    }
    function listSelectedCoords() {
        var _getSelectedRect, xmin, xmax, ymin, ymax, x, y;

        return regeneratorRuntime.wrap(function listSelectedCoords$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    if (selection) {
                        context$2$0.next = 2;
                        break;
                    }

                    return context$2$0.abrupt('return');

                case 2:
                    _getSelectedRect = getSelectedRect();
                    xmin = _getSelectedRect.xmin;
                    xmax = _getSelectedRect.xmax;
                    ymin = _getSelectedRect.ymin;
                    ymax = _getSelectedRect.ymax;
                    x = xmin;

                case 8:
                    if (!(x <= xmax)) {
                        context$2$0.next = 19;
                        break;
                    }

                    y = ymin;

                case 10:
                    if (!(y <= ymax)) {
                        context$2$0.next = 16;
                        break;
                    }

                    context$2$0.next = 13;
                    return [x, y];

                case 13:
                    y++;
                    context$2$0.next = 10;
                    break;

                case 16:
                    x++;
                    context$2$0.next = 8;
                    break;

                case 19:
                case 'end':
                    return context$2$0.stop();
            }
        }, marked1$0[0], this);
    }
    function isSelected(x, y) {
        var rect = getSelectedRect();
        return rect && rect.xmin <= x && x <= rect.xmax && rect.ymin <= y && y <= rect.ymax;
    }
    window.addEventListener('load', function () {
        if (testbench.qargs.km) {
            testbench.vm.kmVisible = true;
            testbench.vm.km = stone.label.color(testbench.qargs.km);
        }
        Promise.resolve().then(function () {
            var directory = new testbench.Directory('#directory');
            window.addEventListener('hashchange', function () {
                var path = location.hash.slice(1); // #abc -> abc
                if (path.length > 0) {
                    loadProblem(path).then(function () {
                        directory.select(path);
                    })['catch'](function (e) {
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
                        if (testbench.qargs.debug) {
                            testbench.vm.mode = 'debugger';
                            lspath = null;
                            solvingFor = +1;
                            solvingFor = stone.label.color(testbench.qargs.debug);
                            testbench.dbgsolve(board, solvingFor, testbench.vm.km, aim, stubs, renderBoard);
                            console.warn('debug mode is on');
                        }
                    })['catch'](function (e) {
                        console.log('cannot load', path, e.stack);
                        location.hash = '#blank';
                    });
                })();
            }
            testbench.ls.added.add(function (path) {
                directory.add(path);
            });
            testbench.ls.removed.add(function (path) {
                directory.remove(path);
            });
            var lsdata = testbench.ls.data;
            for (var path in lsdata) {
                directory.add(path);
            }send('GET', '/problems/manifest.json').then(function (data) {
                var manifest = JSON.parse(data);
                var _iteratorNormalCompletion13 = true;
                var _didIteratorError13 = false;
                var _iteratorError13 = undefined;

                try {
                    for (var _iterator13 = manifest.dirs[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                        var dir = _step13.value;
                        var _iteratorNormalCompletion14 = true;
                        var _didIteratorError14 = false;
                        var _iteratorError14 = undefined;

                        try {
                            var _loop = function () {
                                var path = _step14.value;

                                send('GET', '/problems/' + path).then(function (sgf) {
                                    var root = tsumego.SGF.parse(sgf);
                                    if (!root) throw SyntaxError('Invalid SGF from ' + path);
                                    var name = path.replace('.sgf', '');
                                    // the problem is considered to be hard if it
                                    // doesn't appear in unit tests
                                    directory.item(name).hard = !/\bPL\[/.test(sgf);
                                })['catch'](function (err) {
                                    console.log(err.stack);
                                });
                            };

                            for (var _iterator14 = dir.problems[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                                _loop();
                            }
                        } catch (err) {
                            _didIteratorError14 = true;
                            _iteratorError14 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion14 && _iterator14['return']) {
                                    _iterator14['return']();
                                }
                            } finally {
                                if (_didIteratorError14) {
                                    throw _iteratorError14;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError13 = true;
                    _iteratorError13 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion13 && _iterator13['return']) {
                            _iterator13['return']();
                        }
                    } finally {
                        if (_didIteratorError13) {
                            throw _iteratorError13;
                        }
                    }
                }
            })['catch'](function (err) {
                console.log(err.stack);
            });
            if (!testbench.qargs.debug) {
                directory.deleted.add(function (path) {
                    console.log('deleting ' + path + '...');
                    testbench.ls.set(path, null);
                });
                $('#solve-b, #solve-w').click(function (event) {
                    var color = ({ 'solve-b': +1, 'solve-w': -1 })[this.id];
                    if (!color) return;
                    try {
                        problem = problem || new tsumego.Solver(testbench.vm.sgf);
                    } catch (err) {
                        testbench.vm.note = err;
                        console.warn(err);
                        return;
                    }
                    testbench.vm.mode = 'solver';
                    lspath = null;
                    solvingFor = color;
                    board = problem.board;
                    if (event.shiftKey) {
                        testbench.vm.note = 'Looking for correct moves...';
                        // let the UI update its stuff...
                        setTimeout(function () {
                            var n = 0;
                            ui.SQ.clear();
                            var _iteratorNormalCompletion15 = true;
                            var _didIteratorError15 = false;
                            var _iteratorError15 = undefined;

                            try {
                                for (var _iterator15 = problem.proofs(color)[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                                    var move = _step15.value;

                                    var _stone$coords3 = stone.coords(move);

                                    var _stone$coords32 = _slicedToArray(_stone$coords3, 2);

                                    var x = _stone$coords32[0];
                                    var y = _stone$coords32[1];

                                    ui.SQ.add(x, y);
                                    n++;
                                }
                            } catch (err) {
                                _didIteratorError15 = true;
                                _iteratorError15 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion15 && _iterator15['return']) {
                                        _iterator15['return']();
                                    }
                                } finally {
                                    if (_didIteratorError15) {
                                        throw _iteratorError15;
                                    }
                                }
                            }

                            solvingFor = -color;
                            testbench.vm.note = n ? 'Here are all the correct solutions' : 'This problem does not have a solution';
                        }, 500);
                    } else if (event.ctrlKey) {
                        (function () {
                            testbench.vm.note = 'Building a proof tree...';
                            testbench.vm.mode = 'proof-tree';
                            var g = problem.tree(color, testbench.qargs.ptd || 1, testbench.qargs.ptdi);
                            // every call to next() creates its own instance of goban element
                            (function next(move) {
                                // let the UI update some stuf...
                                setTimeout(function () {
                                    var _g$next = g.next(move && stone.toString(move));

                                    var value = _g$next.value;
                                    var done = _g$next.done;

                                    if (done) {
                                        var tree = value;
                                        send('POST', '/proof-tree', tree);
                                        testbench.vm.note = 'Proof tree ready: ' + (tree.length >> 10) + 'KB';
                                        testbench.vm.sgf = testbench.vm.sgf.trim().replace(/\)$/, '\n' + tree + ')');
                                        return;
                                    }
                                    var c = stone.label.color(value);
                                    if (!c) {
                                        // that is just the solver reporting progress
                                        testbench.vm.note = 'Adding variations for ' + value;
                                        next(null);
                                        return;
                                    }
                                    testbench.vm.note = 'Pick the strongest response for ' + (value == 'W' ? 'white' : 'black');
                                    var svg = renderBoard();
                                    // mark the basic ko move
                                    if (true) {
                                        var _move = board.undo();
                                        var before = new stone.Set(board.stones(-stone.color(_move)));
                                        var nres = board.play(_move);
                                        // a basic ko always captures one stone
                                        if (nres == 2) {
                                            var after = new stone.Set(board.stones(-stone.color(_move)));
                                            var _iteratorNormalCompletion16 = true;
                                            var _didIteratorError16 = false;
                                            var _iteratorError16 = undefined;

                                            try {
                                                for (var _iterator16 = before[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                                                    var s = _step16.value;

                                                    if (!after.has(s)) {
                                                        var x = stone.x(s);
                                                        var y = stone.y(s);
                                                        svg.SQ.add(x, y);
                                                    }
                                                }
                                            } catch (err) {
                                                _didIteratorError16 = true;
                                                _iteratorError16 = err;
                                            } finally {
                                                try {
                                                    if (!_iteratorNormalCompletion16 && _iterator16['return']) {
                                                        _iterator16['return']();
                                                    }
                                                } finally {
                                                    if (_didIteratorError16) {
                                                        throw _iteratorError16;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    svg.addEventListener('click', function (event) {
                                        var x = event.cellX;
                                        var y = event.cellY;
                                        var s = stone.make(x, y, c);
                                        if (!board.play(s)) {
                                            next(null); // tell to end the variation here
                                        } else {
                                                renderBoard();
                                                testbench.vm.note = 'Ok, proceeding with this variation...';
                                                board.undo();
                                                next(s); // tell to continue the variation with this move
                                            }
                                    });
                                }, testbench.qargs.delay || 0);
                            })(null);
                        })();
                    } else {
                        solveAndRender(solvingFor, testbench.vm.km).then(function (move) {
                            if (move * color < 0) solvingFor = -color;
                        });
                    }
                });
                document.querySelector('#flipc').addEventListener('click', function (e) {
                    var b = new Board(board.size);
                    var _iteratorNormalCompletion17 = true;
                    var _didIteratorError17 = false;
                    var _iteratorError17 = undefined;

                    try {
                        for (var _iterator17 = board.stones()[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                            var s = _step17.value;

                            var x = stone.x(s);
                            var y = stone.y(s);
                            var c = stone.color(s);
                            b.play(stone.make(x, y, -c));
                        }
                    } catch (err) {
                        _didIteratorError17 = true;
                        _iteratorError17 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion17 && _iterator17['return']) {
                                _iterator17['return']();
                            }
                        } finally {
                            if (_didIteratorError17) {
                                throw _iteratorError17;
                            }
                        }
                    }

                    board = b.fork();
                    renderBoard();
                });
                document.querySelector('#undo').addEventListener('click', function () {
                    var move = board.undo();
                    if (!move) testbench.vm.note = 'Nothing to undo';
                    renderBoard();
                });
                testbench.vm.sgfchanged.add(function () {
                    try {
                        updateSGF(testbench.vm.sgf);
                    } catch (err) {
                        // partial input is not valid SGF
                        if (err instanceof SyntaxError) return;
                        throw err;
                    }
                });
            }
        })['catch'](function (err) {
            console.error(err.stack);
            alert(err);
        });
    });
    function loadProblem(path) {
        if (solving) solving.cancelled = 'cancelled because loading ' + path;
        return Promise.resolve().then(function () {
            console.log('loading problem', path);

            var _path$split = path.split(':');

            var _path$split2 = _slicedToArray(_path$split, 2);

            var source = _path$split2[0];
            var nvar = _path$split2[1];

            document.title = source;
            lspath = source;
            return Promise.resolve().then(function () {
                return testbench.ls.data[source] || send('GET', '/problems/' + source + '.sgf')['catch'](function (e) {
                    console.log(source, 'cannot be loaded', e);
                    return new Board(9).toStringSGF();
                });
            }).then(function (sgfdata) {
                updateSGF(sgfdata, nvar && +nvar);
            });
        });
    }
    function updateSGF(sgfdata) {
        var nvar = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        var sgf = tsumego.SGF.parse(sgfdata);
        if (!sgf) {
            debugger;
            console.error('Invalid SGF:\n' + sgfdata);
            throw new SyntaxError('Invalid SGF');
        }
        var setup = sgf.steps[0];
        board = new Board(sgfdata, nvar);
        aim = setup['MA'] ? stone.fromString(setup['MA'][0]) : 0;
        selection = null;
        problem = null;
        solvingFor = 0;
        stubs.empty();
        var _iteratorNormalCompletion18 = true;
        var _didIteratorError18 = false;
        var _iteratorError18 = undefined;

        try {
            for (var _iterator18 = (setup['SQ'] || [])[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                var s = _step18.value;

                stubs.add(stone.fromString(s));
            }
        } catch (err) {
            _didIteratorError18 = true;
            _iteratorError18 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion18 && _iterator18['return']) {
                    _iterator18['return']();
                }
            } finally {
                if (_didIteratorError18) {
                    throw _iteratorError18;
                }
            }
        }

        board = board.fork(); // drop the history of moves
        renderBoard();
    }
    function removeStone(x, y) {
        var b = new Board(board.size);
        var _iteratorNormalCompletion19 = true;
        var _didIteratorError19 = false;
        var _iteratorError19 = undefined;

        try {
            for (var _iterator19 = board.stones()[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                var s = _step19.value;

                var _stone$coords4 = stone.coords(s);

                var _stone$coords42 = _slicedToArray(_stone$coords4, 2);

                var sx = _stone$coords42[0];
                var sy = _stone$coords42[1];

                var c = stone.color(s);
                if (sx != x || sy != y) b.play(stone.make(sx, sy, c));
            }
        } catch (err) {
            _didIteratorError19 = true;
            _iteratorError19 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion19 && _iterator19['return']) {
                    _iterator19['return']();
                }
            } finally {
                if (_didIteratorError19) {
                    throw _iteratorError19;
                }
            }
        }

        board = b.fork(); // drop history
    }
    // removes all the stones in the selection
    $(document).on('keyup', function (event) {
        if (!selection) return;
        switch (event.keyCode) {
            case 46 /* Delete */:
                var _iteratorNormalCompletion20 = true;
                var _didIteratorError20 = false;
                var _iteratorError20 = undefined;

                try {
                    for (var _iterator20 = board.stones()[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                        var s = _step20.value;

                        var x = stone.x(s);
                        var y = stone.y(s);
                        if (isSelected(x, y)) removeStone(x, y);
                    }
                } catch (err) {
                    _didIteratorError20 = true;
                    _iteratorError20 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion20 && _iterator20['return']) {
                            _iterator20['return']();
                        }
                    } finally {
                        if (_didIteratorError20) {
                            throw _iteratorError20;
                        }
                    }
                }

                selection = null;
                renderBoard();
        }
    });
    // moves all the stones in the given direction
    $(document).on('keyup', function (event) {
        var _$39$38$40$event$keyCode;

        if (!event.ctrlKey || selection) return;
        switch (event.keyCode) {
            case 37 /* ArrowL */:
            case 38 /* ArrorT */:
            case 39 /* ArrowR */:
            case 40 /* ArrorB */:
                var _event$keyCode = _slicedToArray((_$39$38$40$event$keyCode = {}, _defineProperty(_$39$38$40$event$keyCode, 37, /* ArrowL */[-1, 0]), _defineProperty(_$39$38$40$event$keyCode, 39, /* ArrowR */[+1, 0]), _defineProperty(_$39$38$40$event$keyCode, 38, /* ArrorT */[0, -1]), _defineProperty(_$39$38$40$event$keyCode, 40, /* ArrorB */[0, +1]), _$39$38$40$event$keyCode)[event.keyCode], 2),
                    dx = _event$keyCode[0],
                    dy = _event$keyCode[1];

                var b = new Board(board.size);
                var shift = function shift(s) {
                    var q = arguments.length <= 1 || arguments[1] === undefined ? stone.move(s, dx, dy) : arguments[1];
                    return (function () {
                        return b.inBounds(q) ? q : 0;
                    })();
                };
                var t = aim && shift(aim);
                var _iteratorNormalCompletion21 = true;
                var _didIteratorError21 = false;
                var _iteratorError21 = undefined;

                try {
                    for (var _iterator21 = board.stones()[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
                        var s = _step21.value;

                        if (!b.play(shift(s))) return;
                    }
                } catch (err) {
                    _didIteratorError21 = true;
                    _iteratorError21 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion21 && _iterator21['return']) {
                            _iterator21['return']();
                        }
                    } finally {
                        if (_didIteratorError21) {
                            throw _iteratorError21;
                        }
                    }
                }

                if (aim && !t) return;
                var stubs2 = stubs.map(shift);
                if (!stubs2) return;
                stubs.empty();
                stubs.add.apply(stubs, _toConsumableArray(stubs2));
                aim = t;
                board = b;
                renderBoard();
        }
    });
    // resizes the board
    $(document).on('keyup', function (event) {
        if (!event.shiftKey || selection) return;
        try {
            switch (event.keyCode) {
                case 37 /* ArrowL */:
                case 39 /* ArrowR */:
                    var ds = event.keyCode == 39 /* ArrowR */ ? +1 : -1;
                    var b = new Board(board.size + ds);
                    var r = block.join(board.rect(0), stubs.rect);
                    var dx = 0;
                    var dy = 0;
                    if (block.xmax(r) == board.size - 1) dx = ds;
                    if (block.ymax(r) == board.size - 1) dy = ds;
                    if (block.xmin(r) == 0) dx = 0;
                    if (block.ymin(r) == 0) dy = 0;
                    var shift = function shift(s) {
                        var q = arguments.length <= 1 || arguments[1] === undefined ? stone.move(s, dx, dy) : arguments[1];
                        return (function () {
                            return b.inBounds(q) ? q : 0;
                        })();
                    };
                    var _iteratorNormalCompletion22 = true;
                    var _didIteratorError22 = false;
                    var _iteratorError22 = undefined;

                    try {
                        for (var _iterator22 = board.stones()[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
                            var s = _step22.value;

                            if (!b.play(shift(s))) return;
                        }
                    } catch (err) {
                        _didIteratorError22 = true;
                        _iteratorError22 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion22 && _iterator22['return']) {
                                _iterator22['return']();
                            }
                        } finally {
                            if (_didIteratorError22) {
                                throw _iteratorError22;
                            }
                        }
                    }

                    var t = aim = aim && shift(aim);
                    if (aim && !t) return;
                    var stubs2 = stubs.map(shift);
                    if (!stubs2) return;
                    stubs.empty();
                    stubs.add.apply(stubs, _toConsumableArray(stubs2));
                    aim = t;
                    board = b;
                    renderBoard();
            }
        } catch (err) {
            testbench.vm.note = err;
            console.warn(err);
            throw err;
        }
    });
    function renderBoard() {
        var move = board.undo();
        board.play(move);
        testbench.vm.canUndo = !!move;
        ui = testbench.SVGGobanElement.create(board.sgf);
        if (stone.hascoords(move) && solvingFor) ui.TR.add(stone.x(move), stone.y(move));
        var _iteratorNormalCompletion23 = true;
        var _didIteratorError23 = false;
        var _iteratorError23 = undefined;

        try {
            for (var _iterator23 = stubs[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
                var s = _step23.value;

                ui.SQ.add(stone.x(s), stone.y(s));
            }
        } catch (err) {
            _didIteratorError23 = true;
            _iteratorError23 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion23 && _iterator23['return']) {
                    _iterator23['return']();
                }
            } finally {
                if (_didIteratorError23) {
                    throw _iteratorError23;
                }
            }
        }

        if (stone.hascoords(aim)) ui.MA.add(stone.x(aim), stone.y(aim));
        var _iteratorNormalCompletion24 = true;
        var _didIteratorError24 = false;
        var _iteratorError24 = undefined;

        try {
            for (var _iterator24 = listSelectedCoords()[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
                var _step24$value = _slicedToArray(_step24.value, 2);

                var x = _step24$value[0];
                var y = _step24$value[1];

                ui.SL.add(x, y);
            } //
            // manages the selection area
            //
        } catch (err) {
            _didIteratorError24 = true;
            _iteratorError24 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion24 && _iterator24['return']) {
                    _iterator24['return']();
                }
            } finally {
                if (_didIteratorError24) {
                    throw _iteratorError24;
                }
            }
        }

        if (testbench.vm.mode == 'editor') {
            (function () {
                var selecting = false;
                var dragging = false;
                var dragged = false;
                var dragx = 0,
                    dragy = 0;
                ui.addEventListener('mousedown', function (event) {
                    var cx = event.cellX;
                    var cy = event.cellY;
                    if (!solvingFor && !testbench.vm.tool && cx >= 0 && cy >= 0) {
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
                        var _iteratorNormalCompletion25 = true;
                        var _didIteratorError25 = false;
                        var _iteratorError25 = undefined;

                        try {
                            for (var _iterator25 = listSelectedCoords()[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
                                var _step25$value = _slicedToArray(_step25.value, 2);

                                var x = _step25$value[0];
                                var y = _step25$value[1];

                                ui.SL.add(x, y);
                            }
                        } catch (err) {
                            _didIteratorError25 = true;
                            _iteratorError25 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion25 && _iterator25['return']) {
                                    _iterator25['return']();
                                }
                            } finally {
                                if (_didIteratorError25) {
                                    throw _iteratorError25;
                                }
                            }
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
                            var _iteratorNormalCompletion26 = true;
                            var _didIteratorError26 = false;
                            var _iteratorError26 = undefined;

                            try {
                                for (var _iterator26 = listSelectedCoords()[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
                                    var _step26$value = _slicedToArray(_step26.value, 2);

                                    var x = _step26$value[0];
                                    var y = _step26$value[1];

                                    ui.SL.add(x, y);
                                }
                            } catch (err) {
                                _didIteratorError26 = true;
                                _iteratorError26 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion26 && _iterator26['return']) {
                                        _iterator26['return']();
                                    }
                                } finally {
                                    if (_didIteratorError26) {
                                        throw _iteratorError26;
                                    }
                                }
                            }

                            dragged = true;
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
            })();
        }
        //
        // displays the current coordinates in the lower right corner
        //
        ui.addEventListener('mousemove', function (event) {
            var x = event.cellX;
            var y = event.cellY;

            var s = stone.make(x, y, 0);
            testbench.vm.coords = x >= 0 && y >= 0 ? stone.cc.toString(s, board.size) + ' ' + stone.toString(s) : '';
        });
        ui.addEventListener('mouseout', function () {
            testbench.vm.coords = '';
        });
        //
        // the main click handler
        //
        if (testbench.vm.mode == 'editor' || testbench.vm.mode == 'solver') {
            ui.addEventListener('click', function (event) {
                var x = event.cellX;
                var y = event.cellY;

                var c = board.get(x, y);
                if (testbench.vm.tool == 'MA') {
                    if (!solvingFor) aim = stone.make(x, y, 0);
                } else if (testbench.vm.tool == 'SQ') {
                    stubs.xor(stone.make(x, y, 0));
                } else if (/AB|AW/.test(testbench.vm.tool) || solvingFor) {
                    (function () {
                        if (c && !solvingFor) removeStone(x, y);
                        var color = testbench.vm.tool == 'AB' ? +1 : testbench.vm.tool == 'AW' ? -1 : -solvingFor;
                        board.play(stone.make(x, y, color));
                        if (color == -solvingFor && testbench.qargs.autorespond) {
                            if (testbench.qargs.check) {
                                testbench.vm.note = 'Checking if ' + stone.label.string(-color) + ' needs to respond...';
                                setTimeout(function () {
                                    solve(null, board, color, testbench.vm.km).then(function (move) {
                                        if (color * move < 0) testbench.vm.note = stone.label.string(-color) + ' does not need to respond';else solveAndRender(-color, testbench.vm.km);
                                    });
                                });
                            } else {
                                solveAndRender(-color, testbench.vm.km);
                            }
                        }
                    })();
                } else {
                    return;
                }
                renderBoard();
            });
        }
        var wrapper = document.querySelector('.tsumego');
        wrapper.innerHTML = '';
        wrapper.appendChild(ui);
        if (testbench.vm.mode == 'editor') {
            var sgf = getProblemSGF();
            try {
                SGF.parse(sgf);
                testbench.vm.sgf = sgf;
                testbench.vm.svg = wrapper.innerHTML;
                if (lspath && testbench.vm.mode == 'editor') testbench.ls.set(lspath, sgf);
            } catch (err) {
                testbench.vm.note = err;
                console.warn(err);
            }
        }
        return ui;
    }
    function getProblemSGF() {
        var sgf = board.toStringSGF('\n  ').slice(+1, -1);
        if (stone.hascoords(aim)) sgf += '\n  MA' + stone.toString(aim);
        if (stubs.size > 0) sgf += '\n  SQ' + [].concat(_toConsumableArray(stubs)).map(function (s) {
            return stone.toString(s);
        }).join('');
        return '(' + sgf + ')';
    }
    function parse(si, size) {
        var x = si.charCodeAt(0) - 65;
        var y = size - +/\d+/.exec(si)[0];
        return stone.make(x, y, 0);
    }
    function solveAndRender(color, km) {
        testbench.vm.note = 'Solving...';
        var _calls = undefined;
        var _nodes = undefined;
        var _time = undefined;
        var started = Date.now();
        var elapsed = function elapsed() {
            return (Date.now() - started) / 1000 | 0;
        };
        var comment = function comment() {
            return elapsed() + ' s' + '; calls = ' + ((tsumego.stat.calls - _calls) / (Date.now() - _time) | 0) + 'K/s' + '; nodes = ' + ((tsumego.stat.nodes - _nodes) / (Date.now() - _time) | 0) + 'K/s';
        };
        var op = solving = {
            notify: function notify() {
                testbench.vm.note = 'Solving... elapsed ' + comment();
                _calls = tsumego.stat.calls;
                _nodes = tsumego.stat.nodes;
                _time = Date.now();
            }
        };
        return solve(op, board, color, km).then(function (move) {
            solving = null;
            if (move * color < 0) {
                var _ret6 = (function () {
                    var note = color * board.get(aim) < 0 ? stone.label.string(color) + ' cannot capture the group' : stone.label.string(color) + ' cannot save the group';
                    testbench.vm.note = note + ', searching for treats...';
                    return {
                        v: Promise.resolve().then(function () {
                            var n = 0;
                            ui.SQ.clear();
                            var _iteratorNormalCompletion27 = true;
                            var _didIteratorError27 = false;
                            var _iteratorError27 = undefined;

                            try {
                                for (var _iterator27 = problem.threats(color)[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
                                    var threat = _step27.value;

                                    var _stone$coords5 = stone.coords(stone.fromString(threat));

                                    var _stone$coords52 = _slicedToArray(_stone$coords5, 2);

                                    var x = _stone$coords52[0];
                                    var y = _stone$coords52[1];

                                    n++;
                                    ui.SQ.add(x, y);
                                }
                            } catch (err) {
                                _didIteratorError27 = true;
                                _iteratorError27 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion27 && _iterator27['return']) {
                                        _iterator27['return']();
                                    }
                                } finally {
                                    if (_didIteratorError27) {
                                        throw _iteratorError27;
                                    }
                                }
                            }

                            if (n > 0) testbench.vm.note = note + ', but here are moves that require response from ' + stone.label.string(-color);else testbench.vm.note = note;
                            return move;
                        })
                    };
                })();

                if (typeof _ret6 === 'object') return _ret6.v;
            } else if (!stone.hascoords(move)) {
                testbench.vm.note = stone.label.string(color) + ' passes';
            } else {
                problem.play(move);
                renderBoard();
                testbench.vm.note = stone.toString(move) + ' in ' + elapsed() + 's';
                console.log('(;' + board.moves.map(stone.toString).join(';') + ')');
                console.log(comment());
                console.log(tsumego.stat.summarizxe().join('\n'));
            }
            return move;
        })['catch'](function (err) {
            debugger;
            solving = null;
            testbench.vm.note = err;
            console.error(err);
            throw err;
        });
    }
})(testbench || (testbench = {}));
//# sourceMappingURL=app.js.map
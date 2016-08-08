'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var testbench;
(function (testbench) {
    var Event = (function () {
        function Event() {
            _classCallCheck(this, Event);

            this.listeners = [];
        }

        Event.prototype.add = function add(listener) {
            this.listeners.push(listener);
        };

        Event.prototype.fire = function fire() {
            for (var _iterator = this.listeners, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref = _i.value;
                }

                var listener = _ref;

                try {
                    listener.apply(undefined, arguments);
                } catch (err) {
                    console.log('an event listener has thrown an error:', err && err.stack || err);
                }
            }
        };

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

        SVM.prototype.get = function get(path) {
            return this.data[path];
        };

        SVM.prototype.set = function set(path, sgf) {
            var json = this.data;
            var wasthere = !!json[path];
            json[path] = sgf || undefined;
            this.data = json;
            if (wasthere && !sgf) this.removed.fire(path);
            if (!wasthere && sgf) this.added.fire(path, sgf);
        };

        _createClass(SVM, [{
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

    var Marks = (function () {
        function Marks(svg, def) {
            _classCallCheck(this, Marks);

            this.svg = svg;
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

        Marks.prototype.nodes = regeneratorRuntime.mark(function nodes() {
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
        });

        Marks.prototype.get = function get(x, y) {
            for (var _iterator2 = this.nodes(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                var _ref2;

                if (_isArray2) {
                    if (_i2 >= _iterator2.length) break;
                    _ref2 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) break;
                    _ref2 = _i2.value;
                }

                var ref = _ref2;

                if (+ref.getAttribute('x') == x && +ref.getAttribute('y') == y) return ref;
            }return null;
        };

        Marks.prototype.add = function add(x, y, value) {
            var ref = this.get(x, y);
            if (ref) return ref;
            var g = document.createElementNS(this.svg.getAttribute('xmlns'), 'g');
            g.innerHTML = this.tag ? '<use x="' + x + '" y="' + y + '" xlink:href="#' + this.tag + '"/>' : this.def.replace(/\bx=""/, 'x="' + x + '"').replace(/\by=""/, 'y="' + y + '"').replace('></', '>' + value + '</');
            var m = g.firstChild;
            g.removeChild(m);
            this.svg.appendChild(m);
            this.svg.onupdated(x, y);
            return m;
        };

        Marks.prototype.remove = function remove(x, y) {
            var ref = this.get(x, y);
            if (!ref) return;
            this.svg.removeChild(ref);
            this.svg.onupdated(x, y);
        };

        Marks.prototype.clear = function clear() {
            for (var _iterator3 = this.nodes(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                var _ref3;

                if (_isArray3) {
                    if (_i3 >= _iterator3.length) break;
                    _ref3 = _iterator3[_i3++];
                } else {
                    _i3 = _iterator3.next();
                    if (_i3.done) break;
                    _ref3 = _i3.value;
                }

                var ref = _ref3;

                var x = +ref.getAttribute('x');
                var y = +ref.getAttribute('y');
                this.svg.removeChild(ref);
                this.svg.onupdated(x, y);
            }
        };

        return Marks;
    })();

    var SVGGobanElement;
    (function (SVGGobanElement) {
        function create(board) {
            var n = board.size;
            var div = document.createElement('div');
            div.innerHTML = '\n            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"\n                 xmlns:xlink="http://www.w3.org/1999/xlink"\n                 width="100%"\n                 viewBox="-1.5 -1.5 ' + (n + 2) + ' ' + (n + 2) + '">\n              <defs>\n                <pattern id="svg-goban-grid" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">\n                  <path d="M 1 0 L 0 0 0 1" fill="none" stroke="black" stroke-width="0.05"></path>\n                </pattern>\n              </defs>\n\n              <rect x="0" y="0" width="' + (n - 1) + '" height="' + (n - 1) + '" fill="url(#svg-goban-grid)" stroke="black" stroke-width="0.1"></rect>\n            </svg>';
            var svg = div.querySelector('svg');
            div.removeChild(svg);
            Object.assign(svg, {
                AB: new Marks(svg, '<circle id="AB" r="0.475" fill="black" stroke="black" stroke-width="0.05"></circle>'),
                AW: new Marks(svg, '<circle id="AW" r="0.475" fill="white" stroke="black" stroke-width="0.05"></circle>'),
                CR: new Marks(svg, '<circle id="CR" r="0.5" stroke="none" transform="scale(0.4)"></circle>'),
                TR: new Marks(svg, '<path id="TR" d="M 0 -0.5 L -0.433 0.25 L 0.433 0.25 Z" stroke="none" transform="scale(0.5)"></path>'),
                MA: new Marks(svg, '<path id="MA" d="M -0.2 -0.2 L 0.2 0.2 M 0.2 -0.2 L -0.2 0.2" stroke-width="0.05"></path>'),
                SQ: new Marks(svg, '<rect id="SQ" x="-0.5" y="-0.5" width="1" height="1" stroke="none" transform="scale(0.4)"></rect>'),
                SL: new Marks(svg, '<rect id="SL" x="-0.5" y="-0.5" width="1" height="1" fill-opacity="0.5" stroke="none"></rect>'),
                LB: new Marks(svg, '<text x="" y="" font-size="0.3" text-anchor="middle" dominant-baseline="middle" stroke-width="0"></text>'),
                // invoked after a marker has been added or removed
                onupdated: function onupdated(x, y) {
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
            });
            for (var x = 0; x < n; x++) {
                for (var y = 0; y < n; y++) {
                    var c = board.get(x, y);
                    if (c > 0) svg.AB.add(x, y);
                    if (c < 0) svg.AW.add(x, y);
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
                return board.inBounds(nx, ny) && [nx, ny];
            }
            function attachCellCoords(event) {
                var coords = getStoneCoords(event);
                if (coords) {
                    ;
                    event.cellX = coords[0];
                    event.cellY = coords[1];
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
        for (var _iterator4 = location.search.slice(1).split('&'), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
            var _ref4;

            if (_isArray4) {
                if (_i4 >= _iterator4.length) break;
                _ref4 = _iterator4[_i4++];
            } else {
                _i4 = _iterator4.next();
                if (_i4.done) break;
                _ref4 = _i4.value;
            }

            var pair = _ref4;

            if (!pair) continue;

            var _pair$split$map$map = pair.split('=').map(function (s) {
                return s.replace(/\+/g, ' ');
            }).map(decodeURIComponent);

            var key = _pair$split$map$map[0];
            var val = _pair$split$map$map[1];

            try {
                testbench.qargs[key] = val ? JSON.parse(val) : undefined;
            } catch (err) {
                testbench.qargs[key] = val;
            }
        }
        if (testbench.qargs.autorespond === undefined) testbench.qargs.autorespond = true;
        console.log('qargs:', testbench.qargs);
    } catch (err) {
        console.warn('Failed to parse qargs:', err);
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
            $(window).on('load', function () {
                $('#sgf').focusout(function () {
                    _this.sgfchanged.fire();
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
                for (var _iterator5 = $('#tool button').toArray(), _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
                    var _ref5;

                    if (_isArray5) {
                        if (_i5 >= _iterator5.length) break;
                        _ref5 = _iterator5[_i5++];
                    } else {
                        _i5 = _iterator5.next();
                        if (_i5.done) break;
                        _ref5 = _i5.value;
                    }

                    var button = _ref5;

                    if (button.getAttribute('data-value') == value) button.classList.add('active');else button.classList.remove('active');
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
                for (var _iterator6 = $('#km button').toArray(), _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
                    var _ref6;

                    if (_isArray6) {
                        if (_i6 >= _iterator6.length) break;
                        _ref6 = _iterator6[_i6++];
                    } else {
                        _i6 = _iterator6.next();
                        if (_i6.done) break;
                        _ref6 = _i6.value;
                    }

                    var button = _ref6;

                    if (+button.getAttribute('data-value') == value) button.classList.add('active');else button.classList.remove('active');
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

        Directory.prototype.item = function item(path) {
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
        };

        Directory.prototype.toggle = function toggle(item, filter) {
            var path = $(item).text();
            var visible = path.indexOf(filter) >= 0 || path == location.hash.slice(1);
            $(item).toggle(visible);
        };

        Directory.prototype.find = function find(path) {
            for (var _iterator7 = this.container.find('a.item').toArray(), _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
                var _ref7;

                if (_isArray7) {
                    if (_i7 >= _iterator7.length) break;
                    _ref7 = _iterator7[_i7++];
                } else {
                    _i7 = _iterator7.next();
                    if (_i7.done) break;
                    _ref7 = _i7.value;
                }

                var e = _ref7;

                var a = e;
                var matches = typeof path === 'string' ? a.hash == '#' + path : path(a.hash.slice(1));
                if (matches) return a;
            }
        };

        /**
         * Returns an existing entry if it already exists.
         */

        Directory.prototype.add = function add(path) {
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
        };

        /**
         * Does nothing if the entry doesn't exist.
         */

        Directory.prototype.remove = function remove(path) {
            $(this.find(path)).remove();
        };

        /**
         * Makes this item active. Expands folders as necessary.
         */

        Directory.prototype.select = function select(path) {
            this.container.find('.active').removeClass('active');
            $(this.find(path)).addClass('active');
        };

        _createClass(Directory, [{
            key: 'filter',
            get: function get() {
                return this.input.val();
            },
            set: function set(value) {
                this.input.val(value);
                testbench.ss.filter = value;
                for (var _iterator8 = this.container.find('a.item').toArray(), _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
                    var _ref8;

                    if (_isArray8) {
                        if (_i8 >= _iterator8.length) break;
                        _ref8 = _iterator8[_i8++];
                    } else {
                        _i8 = _iterator8.next();
                        if (_i8.done) break;
                        _ref8 = _i8.value;
                    }

                    var e = _ref8;

                    this.toggle(e, value);
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
    function dbgsolve(board, color, km, aim, refresh) {
        var debug = {};
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
            for (var _iterator9 = breakpoints, _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
                var _ref9;

                if (_isArray9) {
                    if (_i9 >= _iterator9.length) break;
                    _ref9 = _iterator9[_i9++];
                } else {
                    _i9 = _iterator9.next();
                    if (_i9.done) break;
                    _ref9 = _i9.value;
                }

                var bp = _ref9;

                if (bp == '@' + hex(board.hash) || bp == '#' + step) return bp;
            }return null;
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
                            moves.push.apply(moves, newmoves);
                            for (var _iterator10 = items, _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
                                var _ref10;

                                if (_isArray10) {
                                    if (_i10 >= _iterator10.length) break;
                                    _ref10 = _iterator10[_i10++];
                                } else {
                                    _i10 = _iterator10.next();
                                    if (_i10.done) break;
                                    _ref10 = _i10.value;
                                }

                                var item = _ref10;

                                svg.removeChild(item);
                            }items.length = 0;
                            for (var i = 0; i < newmoves.length; i++) {
                                var move = debug.moves[i];

                                var _stone$coords = stone.coords(move);

                                var x = _stone$coords[0];
                                var y = _stone$coords[1];

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
    var Board = tsumego.Board;
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
    var sign = function sign(x) {
        return x > 0 ? +1 : x < 0 ? -1 : 0;
    };
    var aim = 0,
        lspath = '',
        solvingFor;
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
                            testbench.dbgsolve(board, solvingFor, testbench.vm.km, aim, renderBoard);
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
                for (var _iterator11 = manifest.dirs, _isArray11 = Array.isArray(_iterator11), _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
                    var _ref11;

                    if (_isArray11) {
                        if (_i11 >= _iterator11.length) break;
                        _ref11 = _iterator11[_i11++];
                    } else {
                        _i11 = _iterator11.next();
                        if (_i11.done) break;
                        _ref11 = _i11.value;
                    }

                    var dir = _ref11;

                    var _loop = function () {
                        if (_isArray12) {
                            if (_i12 >= _iterator12.length) return 'break';
                            _ref12 = _iterator12[_i12++];
                        } else {
                            _i12 = _iterator12.next();
                            if (_i12.done) return 'break';
                            _ref12 = _i12.value;
                        }

                        var path = _ref12;

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

                    for (var _iterator12 = dir.problems, _isArray12 = Array.isArray(_iterator12), _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
                        var _ref12;

                        var _ret2 = _loop();

                        if (_ret2 === 'break') break;
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
                    testbench.vm.mode = 'solver';
                    lspath = null;
                    solvingFor = color;
                    problem = problem || new tsumego.Solver(testbench.vm.sgf);
                    board = problem.board;
                    if (event.shiftKey) {
                        testbench.vm.note = 'Looking for correct moves...';
                        // let the UI update its stuff...
                        setTimeout(function () {
                            var n = 0;
                            ui.SQ.clear();
                            for (var _iterator13 = problem.proofs(color), _isArray13 = Array.isArray(_iterator13), _i13 = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator]();;) {
                                var _ref13;

                                if (_isArray13) {
                                    if (_i13 >= _iterator13.length) break;
                                    _ref13 = _iterator13[_i13++];
                                } else {
                                    _i13 = _iterator13.next();
                                    if (_i13.done) break;
                                    _ref13 = _i13.value;
                                }

                                var move = _ref13;

                                var _stone$coords2 = stone.coords(move);

                                var x = _stone$coords2[0];
                                var y = _stone$coords2[1];

                                ui.SQ.add(x, y);
                                n++;
                            }
                            solvingFor = -color;
                            testbench.vm.note = n ? 'Here are all the correct solutions' : 'This problem does not have a solution';
                        }, 500);
                    } else if (event.ctrlKey) {
                        (function () {
                            testbench.vm.note = 'Building a proof tree...';
                            testbench.vm.mode = 'proof-tree';
                            var g = problem.tree(color, testbench.qargs.ptd || 0, testbench.qargs.ptdi);
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
                    for (var _iterator14 = board.stones(), _isArray14 = Array.isArray(_iterator14), _i14 = 0, _iterator14 = _isArray14 ? _iterator14 : _iterator14[Symbol.iterator]();;) {
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

                        var x = stone.x(s);
                        var y = stone.y(s);
                        var c = stone.color(s);
                        b.play(stone.make(x, y, -c));
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

            var source = _path$split[0];
            var nvar = _path$split[1];

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
        board = board.fork(); // drop the history of moves
        renderBoard();
    }
    function removeStone(x, y) {
        var b = new Board(board.size);
        for (var _iterator15 = board.stones(), _isArray15 = Array.isArray(_iterator15), _i15 = 0, _iterator15 = _isArray15 ? _iterator15 : _iterator15[Symbol.iterator]();;) {
            var _ref15;

            if (_isArray15) {
                if (_i15 >= _iterator15.length) break;
                _ref15 = _iterator15[_i15++];
            } else {
                _i15 = _iterator15.next();
                if (_i15.done) break;
                _ref15 = _i15.value;
            }

            var s = _ref15;

            var _stone$coords3 = stone.coords(s);

            var sx = _stone$coords3[0];
            var sy = _stone$coords3[1];

            var c = stone.color(s);
            if (sx != x || sy != y) b.play(stone.make(sx, sy, c));
        }
        board = b.fork(); // drop history
    }
    // removes all the stones in the selection
    $(document).on('keyup', function (event) {
        if (!selection) return;
        switch (event.keyCode) {
            case 46 /* Delete */:
                for (var _iterator16 = board.stones(), _isArray16 = Array.isArray(_iterator16), _i16 = 0, _iterator16 = _isArray16 ? _iterator16 : _iterator16[Symbol.iterator]();;) {
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

                    var x = stone.x(s);
                    var y = stone.y(s);
                    if (isSelected(x, y)) removeStone(x, y);
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
                var _event$keyCode = (_$39$38$40$event$keyCode = {}, _$39$38$40$event$keyCode[37 /* ArrowL */] = [-1, 0], _$39$38$40$event$keyCode[39 /* ArrowR */] = [+1, 0], _$39$38$40$event$keyCode[38 /* ArrorT */] = [0, -1], _$39$38$40$event$keyCode[40 /* ArrorB */] = [0, +1], _$39$38$40$event$keyCode)[event.keyCode],
                    dx = _event$keyCode[0],
                    dy = _event$keyCode[1];

                var b = new Board(board.size);
                var t = aim && stone.make(stone.x(aim) + dx, stone.y(aim) + dy, 0);
                try {
                    if (t && !b.inBounds(t)) throw aim;
                    for (var _iterator17 = board.stones(), _isArray17 = Array.isArray(_iterator17), _i17 = 0, _iterator17 = _isArray17 ? _iterator17 : _iterator17[Symbol.iterator]();;) {
                        var _ref17;

                        if (_isArray17) {
                            if (_i17 >= _iterator17.length) break;
                            _ref17 = _iterator17[_i17++];
                        } else {
                            _i17 = _iterator17.next();
                            if (_i17.done) break;
                            _ref17 = _i17.value;
                        }

                        var s1 = _ref17;

                        var _stone$coords4 = stone.coords(s1);

                        var x1 = _stone$coords4[0];
                        var y1 = _stone$coords4[1];
                        var x2 = x1 + dx;
                        var y2 = y1 + dy;

                        var s2 = stone.make(x2, y2, stone.color(s1));
                        if (!b.inBounds(x2, y2) || !b.play(s2)) throw s1;
                    }
                } catch (err) {
                    if (typeof err === 'number' && board.inBounds(err)) {
                        ui.SL.add(stone.x(err), stone.y(err));
                        testbench.vm.note = 'Cannot move ' + stone.toString(err);
                        return;
                    }
                    throw err;
                }
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
                    var b = new Board(board.size + (event.keyCode == 39 /* ArrowR */ ? +1 : -1));
                    for (var _iterator18 = board.stones(), _isArray18 = Array.isArray(_iterator18), _i18 = 0, _iterator18 = _isArray18 ? _iterator18 : _iterator18[Symbol.iterator]();;) {
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

                        if (!b.play(s)) throw Error(stone.toString(s) + ' does not fit the ' + b.size + 'x' + b.size + ' board');
                    }board = b;
                    renderBoard();
            }
        } catch (err) {
            testbench.vm.note = err;
            throw err;
        }
    });
    function renderBoard() {
        var move = board.undo();
        board.play(move);
        testbench.vm.canUndo = !!move;
        ui = testbench.SVGGobanElement.create(board);
        if (stone.hascoords(move) && solvingFor) ui.TR.add(stone.x(move), stone.y(move));
        if (stone.hascoords(aim)) ui.MA.add(stone.x(aim), stone.y(aim));
        for (var _iterator19 = listSelectedCoords(), _isArray19 = Array.isArray(_iterator19), _i19 = 0, _iterator19 = _isArray19 ? _iterator19 : _iterator19[Symbol.iterator]();;) {
            var _ref19;

            if (_isArray19) {
                if (_i19 >= _iterator19.length) break;
                _ref19 = _iterator19[_i19++];
            } else {
                _i19 = _iterator19.next();
                if (_i19.done) break;
                _ref19 = _i19.value;
            }

            var _ref192 = _ref19;
            var x = _ref192[0];
            var y = _ref192[1];

            ui.SL.add(x, y);
        } //
        // manages the selection area
        //
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
                        for (var _iterator20 = listSelectedCoords(), _isArray20 = Array.isArray(_iterator20), _i20 = 0, _iterator20 = _isArray20 ? _iterator20 : _iterator20[Symbol.iterator]();;) {
                            var _ref20;

                            if (_isArray20) {
                                if (_i20 >= _iterator20.length) break;
                                _ref20 = _iterator20[_i20++];
                            } else {
                                _i20 = _iterator20.next();
                                if (_i20.done) break;
                                _ref20 = _i20.value;
                            }

                            var _ref202 = _ref20;
                            var x = _ref202[0];
                            var y = _ref202[1];

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
                            for (var _iterator21 = listSelectedCoords(), _isArray21 = Array.isArray(_iterator21), _i21 = 0, _iterator21 = _isArray21 ? _iterator21 : _iterator21[Symbol.iterator]();;) {
                                var _ref21;

                                if (_isArray21) {
                                    if (_i21 >= _iterator21.length) break;
                                    _ref21 = _iterator21[_i21++];
                                } else {
                                    _i21 = _iterator21.next();
                                    if (_i21.done) break;
                                    _ref21 = _i21.value;
                                }

                                var _ref212 = _ref21;
                                var x = _ref212[0];
                                var y = _ref212[1];

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
                } else if (/AB|AW/.test(testbench.vm.tool) || solvingFor) {
                    (function () {
                        if (c && !solvingFor) removeStone(x, y);
                        var color = testbench.vm.tool == 'AB' ? +1 : testbench.vm.tool == 'AW' ? -1 : -solvingFor;
                        board.play(stone.make(x, y, color));
                        if (color == -solvingFor && testbench.qargs.autorespond) {
                            testbench.vm.note = 'Checking if ' + stone.label.string(-color) + ' needs to respond...';
                            solve(null, board, color, testbench.vm.km).then(function (move) {
                                if (color * move < 0) testbench.vm.note = stone.label.string(-color) + ' does not need to respond';else return solveAndRender(-color, testbench.vm.km);
                            });
                        }
                    })();
                } else {
                    return;
                }
                renderBoard();
                testbench.vm.note = stone.toString(stone.make(x, y, board.get(x, y)));
            });
        }
        var wrapper = document.querySelector('.tsumego');
        wrapper.innerHTML = '';
        wrapper.appendChild(ui);
        if (testbench.vm.mode == 'editor') {
            var sgf = getProblemSGF();
            testbench.vm.sgf = sgf;
            testbench.vm.svg = wrapper.innerHTML;
            if (lspath && testbench.vm.mode == 'editor') testbench.ls.set(lspath, sgf);
        }
        return ui;
    }
    function getProblemSGF() {
        return board.toStringSGF('\n  ').replace(/\)$/, (stone.hascoords(aim) ? '\n  MA' + stone.toString(aim) : '') + ')');
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
                            for (var _iterator22 = problem.threats(color), _isArray22 = Array.isArray(_iterator22), _i22 = 0, _iterator22 = _isArray22 ? _iterator22 : _iterator22[Symbol.iterator]();;) {
                                var _ref22;

                                if (_isArray22) {
                                    if (_i22 >= _iterator22.length) break;
                                    _ref22 = _iterator22[_i22++];
                                } else {
                                    _i22 = _iterator22.next();
                                    if (_i22.done) break;
                                    _ref22 = _i22.value;
                                }

                                var threat = _ref22;

                                var _stone$coords5 = stone.coords(stone.fromString(threat));

                                var x = _stone$coords5[0];
                                var y = _stone$coords5[1];

                                n++;
                                ui.SQ.add(x, y);
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
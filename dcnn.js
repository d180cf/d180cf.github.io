/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DCNN = __webpack_require__(1);
const json = __webpack_require__(4);

const dcnn = new DCNN(json);

window.evaldcnn = function evaldcnn(board, [x, y]) {
    return dcnn.eval(board, [x, y]);
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const nn = __webpack_require__(2);
const { features, F_COUNT } = __webpack_require__(3);

const WINDOW_SIZE = 11; // 11x11, must match the DCNN
const WINDOW_HALF = WINDOW_SIZE / 2 | 0;

module.exports = class DCNN {
    /**
     * Reconstructs the DCNN that correponds
     * to the weights file. The result is a 
     * function that takes a tensor as input
     * and returns a single value in the 0..1
     * range.
     * 
     * @param {JSON} json description of the NN
     */
    constructor(json) {
        this._nnfn = reconstructDCNN(json);
        this._planes = new Float32Array(18 * 18 * F_COUNT); // enough for any board size
        this._fslice = new Float32Array(WINDOW_SIZE * WINDOW_SIZE * F_COUNT); // no need to recreate it    
    }

    eval(board, [x, y]) {
        this._planes.fill(0); // just in case

        features(this._planes, board, { x, y });

        // (x + 1, y + 1) is to account for the wall
        slice(this._fslice, this._planes, [board.size + 2, board.size + 2, F_COUNT],
            [y + 1 - WINDOW_HALF, y + 1 + WINDOW_HALF],
            [x + 1 - WINDOW_HALF, x + 1 + WINDOW_HALF],
            [0, F_COUNT - 1]);

        return this._nnfn(this._fslice);
    }
}

function offsetFn(x_size, y_size, z_size) {
    return (x, y, z) => (x * y_size + y) * z_size + z;
}

function slice(res, src, [x_size, y_size, z_size], [xmin, xmax], [ymin, ymax], [zmin, zmax]) {
    const ires = offsetFn(xmax - xmin + 1, ymax - ymin + 1, zmax - zmin + 1);
    const isrc = offsetFn(x_size, y_size, z_size);

    for (let x = xmin; x <= xmax; x++) {
        for (let y = ymin; y <= ymax; y++) {
            for (let z = zmin; z <= zmax; z++) {
                const ri = ires(x - xmin, y - ymin, z - zmin);
                const si = isrc(x, y, z);
                const outside = x < 0 || x >= x_size || y < 0 || y >= y_size || z < 0 || z >= z_size;

                res[ri] = outside ? 0 : src[si];
            }
        }
    }
}

function reconstructDCNN(json) {
    const input = nn.value([WINDOW_SIZE * WINDOW_SIZE * F_COUNT]);

    /*

    (1573, 256) align/dense/weights:0
         (256,) align/dense/bias:0

     (256, 256) resb1/1/dense/weights:0
         (256,) resb1/1/dense/bias:0

     (256, 256) resb1/2/dense/weights:0
         (256,) resb1/2/dense/bias:0

       (256, 1) readout/dense/weights:0
           (1,) readout/dense/bias:0

    */
    
    function get(name) {
        const v = json.vars[name];
        const w = v && v.data;
        return w;
    }

    function fconn(x, w, b) {
        x = nn.mul(x, w);
        x = nn.add(x, b);
        return x;
    }

    let x = input;

    // the alignment layer
    x = fconn(x,
        get('align/dense/weights:0'),
        get('align/dense/bias:0'));
    x = nn.relu(x);

    // the residual tower
    for (let i = 1; ; i++) {
        const w_name = k => `resb${i}/${k}/dense/weights:0`;
        const b_name = k => `resb${i}/${k}/dense/bias:0`;

        const w1 = get(w_name(1));
        const b1 = get(b_name(1));

        const w2 = get(w_name(2));
        const b2 = get(b_name(2));

        if (!w1) break;

        const y = x;

        x = fconn(x, w1, b1);
        x = nn.relu(x);

        x = fconn(x, w2, b2);
        x = nn.add(x, y);
        x = nn.relu(x);
    }

    // the readout layer
    x = fconn(x,
        get('readout/dense/weights:0'),
        get('readout/dense/bias:0'));
    x = nn.sigmoid(x);

    if (x.size != 1)
        throw Error('Invalid output shape: ' + x.shape);

    return data => {
        input.set(data);
        x.eval();
        return x.value[0];
    };
}

function print(name, size, depth, data) {
    console.log(name + ' = [ // ' + size + 'x' + size + 'x' + depth);
    for (let d = 0; d < depth; d++) {
        console.log('  [ // feature = ' + d);
        for (let y = 0; y < size; y++) {
            let s = '';
            for (let x = 0; x < size; x++)
                s += (data[y * size * depth + x * depth + d] ? '+' : '-') + ' ';
            console.log('    ' + s.slice(0, -1));
        }
        console.log('  ],');
    }
    console.log(']');
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

function operation(shape, deps, eval, init) {
    for (const x of shape)
        if (x % 1)
            throw Error('Invalid shape: [' + shape + ']');    

    const size = shape.reduce((p, n) => p * n, 1);
    const value = new Float32Array(size);
    const op = {};    
    op.eval = () => {
        for (const dep of deps)
            dep.eval();
        eval(value, deps.map(dep => dep.value));
        //console.log(moments(value));
    };
    op.set = init => {
        if (init.length != size)
            throw Error('Invalid initializer size: ' + init.length);
        value.set(init);
    };
    op.value = value;
    op.shape = shape;
    op.size = size;
    init && op.set(init);
    return op;
}

function moments(a) {
    let n = a.length;
    let s = 0;

    for (let i = 0; i < n; i++)
        s += a[i];

    let m = s / n;
    let v = 0;

    for (let i = 0; i < n; i++)
        v += (a[i] - m) * (a[i] - m);

    return [m, Math.sqrt(v / n)];
}

const nn = {};

/**
 * @param {number[]} shape
 * @param {number[]} input optional array-like initial value
 */
nn.value = function value(shape, input) {
    return operation(shape, [], y => { }, input);
};

/**
 * Multiples a `[n]` vector by a `[n, m]` matrix: `y = x * w`
 * 
 * @param x shape = [n]
 * @param w shape = [n, m]
 * @returns shape = [m] - the result
 */
nn.mul = function mul(x, w) {
    const [n] = x.shape;

    if (w.length) // array-like
        w = nn.value([n, w.length / n], w);

    if (w.shape[0] != n)
        throw Error('Incompatible x and w shapes: [' + x.shape + '] and [' + w.shape + ']');

    const [, m] = w.shape;

    return operation([m], [x, w], (y, [x, w]) => {
        for (let i = 0; i < m; i++) {
            y[i] = 0;

            for (let j = 0; j < n; j++)
                y[i] += x[j] * w[j * m + i];
        }
    });
};

/**
 * Element-wise `z = x + y`.
 */
nn.add = function add(x, y) {
    const n = x.size;

    if (y.length) // array-like
        y = nn.value(x.shape, y);

    if (n != y.size)
        throw Error('Incompatible x and y shapes: [' + x.shape + '] and [' + y.shape + ']');

    return operation(x.shape, [x, y], (z, [x, y]) => {
        for (let i = 0; i < n; i++)
            z[i] = x[i] + y[i];
    });
};

/**
 * Element-wise `y = f(x)`
 */
nn.map = function map(x, f) {
    const n = x.size;

    return operation(x.shape, [x], (y, [x]) => {
        for (let i = 0; i < n; i++)
            y[i] = f(x[i]);
    });
};

/**
 * Element-wise `y = max(0, x)`
 */
nn.relu = function relu(x) {
    return nn.map(x, x => Math.max(0, x));
};

/**
 * Element-wise `y = 1/(1 + exp(-x))`
 */
nn.sigmoid = function sigmoid(x) {
    return nn.map(x, x => 1 / (1 + Math.exp(-x)));
};

module.exports = nn;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

const F_COUNT = 13; // the number of features

const [

    F_WALL,
    F_ALLY,
    F_ENEMY,
    F_TARGET,
    F_SURE_EYE,

    F_LIBS_1,
    F_LIBS_2,
    F_LIBS_3,
    F_LIBS_4, // 4+ libs

    F_SIZE_1,
    F_SIZE_2,
    F_SIZE_3,
    F_SIZE_4, // 4+ stones

] = Array.from(Array(F_COUNT).keys());

exports.F_COUNT = F_COUNT;

/**
 * Computes features of the given board
 * and returns them as a list of feature
 * planes where each number is in `0..1` range.
 * 
 * @param {number[]} result NHWC format;
 *      shape = `[n + 2, n + 2, F_COUNT]`, n = `board.size`;
 *      index = `[y + 1, x + 1, f]` to account for walls;
 *      x, y, f are all zero based
 * @param {tsumego.Board} board
 * @param {{x: number, y: number}} target
 */
exports.features = function features(result, board, target) {
    const size = board.size;
    const tblock = board.get(target.x, target.y);
    const color = Math.sign(tblock);
    const offset = (x, y) => (y + 1) * (size + 2) * F_COUNT + (x + 1) * F_COUNT;

    if ((size + 2) * (size + 2) * F_COUNT > result.length)
        throw Error('The output array is too small: ' + result.length);

    for (let i = 0; i < result.length; i++)
        result[i] = 0;

    for (let x = -1; x < size + 1; x++) {
        for (let y = -1; y < size + 1; y++) {
            const base = offset(x, y);

            if (!board.inBounds(x, y)) {
                result[base + F_WALL] = 1;
            } else {
                const block = board.get(x, y);
                const { libs: nlibs, size: nsize } = board.getBlockInfo(x, y);

                result[base + F_ALLY] = block * color > 0 ? 1 : 0;
                result[base + F_ENEMY] = block * color < 0 ? 1 : 0;
                result[base + F_TARGET] = block == tblock ? 1 : 0;
                result[base + F_SURE_EYE] = isSureEye(board, +1, x, y) || isSureEye(board, -1, x, y) ? 1 : 0;

                result[base + F_LIBS_1] = nlibs == 1 ? 1 : 0;
                result[base + F_LIBS_2] = nlibs == 2 ? 1 : 0;
                result[base + F_LIBS_3] = nlibs == 3 ? 1 : 0;
                result[base + F_LIBS_4] = nlibs >= 4 ? 1 : 0;

                result[base + F_SIZE_1] = nsize == 1 ? 1 : 0;
                result[base + F_SIZE_2] = nsize == 2 ? 1 : 0;
                result[base + F_SIZE_3] = nsize == 3 ? 1 : 0;
                result[base + F_SIZE_4] = nsize >= 4 ? 1 : 0;
            }
        }
    }
}

/**
 * Detects 1-point sure eyes.
 * 
 * @param {tsumego.Board} board 
 * @param {number} color 
 * @param {number} x 
 * @param {number} y 
 */
function isSureEye(board, color, x, y) {
    const n = board.size;

    const get = (dx, dy) => board.get(x + dx, y + dy);
    const dist = (x, y) => Math.min(x, n - 1 - x) + Math.min(y, n - 1 - y);
    const isWall = (dx, dy) => !board.inBounds(x + dx, y + dy);
    const isCorner = (dx, dy) => dist(x + dx, y + dy) == 0;

    if (get(0, 0))
        return false;

    let count = 0;
    let ndiag = 0;
    let nwall = 0;
    let necrn = 0;

    for (let dx = -1; dx <= +1; dx++) {
        for (let dy = -1; dy <= +1; dy++) {
            if (isWall(dx, dy)) {
                nwall++;
            } else {
                const x = get(dx, dy);

                if (x * color > 0) {
                    count++;

                    if (dx && dy)
                        ndiag++;
                } else if (!x && isCorner(dx, dy)) {
                    necrn++;
                }
            }
        }
    }

    switch (count) {
        case 8:
            // X X X
            // X - X
            // X X X
            return true;

        case 7:
            // X X X
            // X - X
            // X X -
            return ndiag == 3;

        case 6:
            // X X -
            // X - X
            // X X -
            return necrn == 1;

        case 5:
            // X X - //  X - -
            // X - - //  X - -
            // X X - //  X X X
            return nwall == 3;

        case 4:
            // X - -
            // X - -
            // X X -        
            return nwall == 4;

        case 3:
            // - - -
            // X - -
            // X X -        
            return nwall == 5;
    }

    return false;
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {


/***/ })
/******/ ]);
/*!
 * 
 *  Wed Dec 16 2020 09:23:07 GMT+0800 (GMT+08:00)
 *  desc：第一条线迁移的服务代码
 *  tag：1608081787513
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else {
        var a = factory();
        for (var i in a)(typeof exports === 'object' ? exports : root)[i] = a[i];
    }
})(window, function() {
    return /******/ (function(modules) { // webpackBootstrap
            /******/ // The module cache
            /******/
            var installedModules = {};
            /******/
            /******/ // The require function
            /******/
            function __webpack_require__(moduleId) {
                /******/
                /******/ // Check if module is in cache
                /******/
                if (installedModules[moduleId]) {
                    /******/
                    return installedModules[moduleId].exports;
                    /******/
                }
                /******/ // Create a new module (and put it into the cache)
                /******/
                var module = installedModules[moduleId] = {
                    /******/
                    i: moduleId,
                    /******/
                    l: false,
                    /******/
                    exports: {}
                    /******/
                };
                /******/
                /******/ // Execute the module function
                /******/
                modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
                /******/
                /******/ // Flag the module as loaded
                /******/
                module.l = true;
                /******/
                /******/ // Return the exports of the module
                /******/
                return module.exports;
                /******/
            }
            /******/
            /******/
            /******/ // expose the modules object (__webpack_modules__)
            /******/
            __webpack_require__.m = modules;
            /******/
            /******/ // expose the module cache
            /******/
            __webpack_require__.c = installedModules;
            /******/
            /******/ // define getter function for harmony exports
            /******/
            __webpack_require__.d = function(exports, name, getter) {
                /******/
                if (!__webpack_require__.o(exports, name)) {
                    /******/
                    Object.defineProperty(exports, name, { enumerable: true, get: getter });
                    /******/
                }
                /******/
            };
            /******/
            /******/ // define __esModule on exports
            /******/
            __webpack_require__.r = function(exports) {
                /******/
                if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                    /******/
                    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                    /******/
                }
                /******/
                Object.defineProperty(exports, '__esModule', { value: true });
                /******/
            };
            /******/
            /******/ // create a fake namespace object
            /******/ // mode & 1: value is a module id, require it
            /******/ // mode & 2: merge all properties of value into the ns
            /******/ // mode & 4: return value when already ns object
            /******/ // mode & 8|1: behave like require
            /******/
            __webpack_require__.t = function(value, mode) {
                /******/
                if (mode & 1) value = __webpack_require__(value);
                /******/
                if (mode & 8) return value;
                /******/
                if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
                /******/
                var ns = Object.create(null);
                /******/
                __webpack_require__.r(ns);
                /******/
                Object.defineProperty(ns, 'default', { enumerable: true, value: value });
                /******/
                if (mode & 2 && typeof value != 'string')
                    for (var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
                /******/
                return ns;
                /******/
            };
            /******/
            /******/ // getDefaultExport function for compatibility with non-harmony modules
            /******/
            __webpack_require__.n = function(module) {
                /******/
                var getter = module && module.__esModule ?
                    /******/
                    function getDefault() { return module['default']; } :
                    /******/
                    function getModuleExports() { return module; };
                /******/
                __webpack_require__.d(getter, 'a', getter);
                /******/
                return getter;
                /******/
            };
            /******/
            /******/ // Object.prototype.hasOwnProperty.call
            /******/
            __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
            /******/
            /******/ // __webpack_public_path__
            /******/
            __webpack_require__.p = "";
            /******/
            /******/
            /******/ // Load entry module and return exports
            /******/
            return __webpack_require__(__webpack_require__.s = 0);
            /******/
        })
        /************************************************************************/
        /******/
        ({

            /***/
            "./node_modules/_@babel_runtime@7.12.1@@babel/runtime/helpers/defineProperty.js":
            /*!**************************************************************************************!*\
              !*** ./node_modules/_@babel_runtime@7.12.1@@babel/runtime/helpers/defineProperty.js ***!
              \**************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                function _defineProperty(obj, key, value) {
                    if (key in obj) {
                        Object.defineProperty(obj, key, {
                            value: value,
                            enumerable: true,
                            configurable: true,
                            writable: true
                        });
                    } else {
                        obj[key] = value;
                    }

                    return obj;
                }

                module.exports = _defineProperty;

                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/a-function.js":
            /*!*********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/a-function.js ***!
              \*********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                module.exports = function(it) {
                    if (typeof it != 'function') {
                        throw TypeError(String(it) + ' is not a function');
                    }
                    return it;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/a-possible-prototype.js":
            /*!*******************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/a-possible-prototype.js ***!
              \*******************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var isObject = __webpack_require__( /*! ../internals/is-object */ "./node_modules/_core-js@3.6.5@core-js/internals/is-object.js");

                module.exports = function(it) {
                    if (!isObject(it) && it !== null) {
                        throw TypeError("Can't set " + String(it) + ' as a prototype');
                    }
                    return it;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/add-to-unscopables.js":
            /*!*****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/add-to-unscopables.js ***!
              \*****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var wellKnownSymbol = __webpack_require__( /*! ../internals/well-known-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js");
                var create = __webpack_require__( /*! ../internals/object-create */ "./node_modules/_core-js@3.6.5@core-js/internals/object-create.js");
                var definePropertyModule = __webpack_require__( /*! ../internals/object-define-property */ "./node_modules/_core-js@3.6.5@core-js/internals/object-define-property.js");

                var UNSCOPABLES = wellKnownSymbol('unscopables');
                var ArrayPrototype = Array.prototype;

                // Array.prototype[@@unscopables]
                // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
                if (ArrayPrototype[UNSCOPABLES] == undefined) {
                    definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
                        configurable: true,
                        value: create(null)
                    });
                }

                // add a key to Array.prototype[@@unscopables]
                module.exports = function(key) {
                    ArrayPrototype[UNSCOPABLES][key] = true;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/advance-string-index.js":
            /*!*******************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/advance-string-index.js ***!
              \*******************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var charAt = __webpack_require__( /*! ../internals/string-multibyte */ "./node_modules/_core-js@3.6.5@core-js/internals/string-multibyte.js").charAt;

                // `AdvanceStringIndex` abstract operation
                // https://tc39.github.io/ecma262/#sec-advancestringindex
                module.exports = function(S, index, unicode) {
                    return index + (unicode ? charAt(S, index).length : 1);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js":
            /*!********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/an-object.js ***!
              \********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var isObject = __webpack_require__( /*! ../internals/is-object */ "./node_modules/_core-js@3.6.5@core-js/internals/is-object.js");

                module.exports = function(it) {
                    if (!isObject(it)) {
                        throw TypeError(String(it) + ' is not an object');
                    }
                    return it;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/array-for-each.js":
            /*!*************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/array-for-each.js ***!
              \*************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $forEach = __webpack_require__( /*! ../internals/array-iteration */ "./node_modules/_core-js@3.6.5@core-js/internals/array-iteration.js").forEach;
                var arrayMethodIsStrict = __webpack_require__( /*! ../internals/array-method-is-strict */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-is-strict.js");
                var arrayMethodUsesToLength = __webpack_require__( /*! ../internals/array-method-uses-to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-uses-to-length.js");

                var STRICT_METHOD = arrayMethodIsStrict('forEach');
                var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

                // `Array.prototype.forEach` method implementation
                // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
                module.exports = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */ ) {
                    return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
                } : [].forEach;


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/array-includes.js":
            /*!*************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/array-includes.js ***!
              \*************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var toIndexedObject = __webpack_require__( /*! ../internals/to-indexed-object */ "./node_modules/_core-js@3.6.5@core-js/internals/to-indexed-object.js");
                var toLength = __webpack_require__( /*! ../internals/to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/to-length.js");
                var toAbsoluteIndex = __webpack_require__( /*! ../internals/to-absolute-index */ "./node_modules/_core-js@3.6.5@core-js/internals/to-absolute-index.js");

                // `Array.prototype.{ indexOf, includes }` methods implementation
                var createMethod = function(IS_INCLUDES) {
                    return function($this, el, fromIndex) {
                        var O = toIndexedObject($this);
                        var length = toLength(O.length);
                        var index = toAbsoluteIndex(fromIndex, length);
                        var value;
                        // Array#includes uses SameValueZero equality algorithm
                        // eslint-disable-next-line no-self-compare
                        if (IS_INCLUDES && el != el)
                            while (length > index) {
                                value = O[index++];
                                // eslint-disable-next-line no-self-compare
                                if (value != value) return true;
                                // Array#indexOf ignores holes, Array#includes - not
                            } else
                                for (; length > index; index++) {
                                    if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
                                }
                        return !IS_INCLUDES && -1;
                    };
                };

                module.exports = {
                    // `Array.prototype.includes` method
                    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
                    includes: createMethod(true),
                    // `Array.prototype.indexOf` method
                    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
                    indexOf: createMethod(false)
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/array-iteration.js":
            /*!**************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/array-iteration.js ***!
              \**************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var bind = __webpack_require__( /*! ../internals/function-bind-context */ "./node_modules/_core-js@3.6.5@core-js/internals/function-bind-context.js");
                var IndexedObject = __webpack_require__( /*! ../internals/indexed-object */ "./node_modules/_core-js@3.6.5@core-js/internals/indexed-object.js");
                var toObject = __webpack_require__( /*! ../internals/to-object */ "./node_modules/_core-js@3.6.5@core-js/internals/to-object.js");
                var toLength = __webpack_require__( /*! ../internals/to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/to-length.js");
                var arraySpeciesCreate = __webpack_require__( /*! ../internals/array-species-create */ "./node_modules/_core-js@3.6.5@core-js/internals/array-species-create.js");

                var push = [].push;

                // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
                var createMethod = function(TYPE) {
                    var IS_MAP = TYPE == 1;
                    var IS_FILTER = TYPE == 2;
                    var IS_SOME = TYPE == 3;
                    var IS_EVERY = TYPE == 4;
                    var IS_FIND_INDEX = TYPE == 6;
                    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
                    return function($this, callbackfn, that, specificCreate) {
                        var O = toObject($this);
                        var self = IndexedObject(O);
                        var boundFunction = bind(callbackfn, that, 3);
                        var length = toLength(self.length);
                        var index = 0;
                        var create = specificCreate || arraySpeciesCreate;
                        var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
                        var value, result;
                        for (; length > index; index++)
                            if (NO_HOLES || index in self) {
                                value = self[index];
                                result = boundFunction(value, index, O);
                                if (TYPE) {
                                    if (IS_MAP) target[index] = result; // map
                                    else if (result) switch (TYPE) {
                                            case 3:
                                                return true; // some
                                            case 5:
                                                return value; // find
                                            case 6:
                                                return index; // findIndex
                                            case 2:
                                                push.call(target, value); // filter
                                        } else if (IS_EVERY) return false; // every
                                }
                            }
                        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
                    };
                };

                module.exports = {
                    // `Array.prototype.forEach` method
                    // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
                    forEach: createMethod(0),
                    // `Array.prototype.map` method
                    // https://tc39.github.io/ecma262/#sec-array.prototype.map
                    map: createMethod(1),
                    // `Array.prototype.filter` method
                    // https://tc39.github.io/ecma262/#sec-array.prototype.filter
                    filter: createMethod(2),
                    // `Array.prototype.some` method
                    // https://tc39.github.io/ecma262/#sec-array.prototype.some
                    some: createMethod(3),
                    // `Array.prototype.every` method
                    // https://tc39.github.io/ecma262/#sec-array.prototype.every
                    every: createMethod(4),
                    // `Array.prototype.find` method
                    // https://tc39.github.io/ecma262/#sec-array.prototype.find
                    find: createMethod(5),
                    // `Array.prototype.findIndex` method
                    // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
                    findIndex: createMethod(6)
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/array-method-has-species-support.js":
            /*!*******************************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/array-method-has-species-support.js ***!
              \*******************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");
                var wellKnownSymbol = __webpack_require__( /*! ../internals/well-known-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js");
                var V8_VERSION = __webpack_require__( /*! ../internals/engine-v8-version */ "./node_modules/_core-js@3.6.5@core-js/internals/engine-v8-version.js");

                var SPECIES = wellKnownSymbol('species');

                module.exports = function(METHOD_NAME) {
                    // We can't use this feature detection in V8 since it causes
                    // deoptimization and serious performance degradation
                    // https://github.com/zloirock/core-js/issues/677
                    return V8_VERSION >= 51 || !fails(function() {
                        var array = [];
                        var constructor = array.constructor = {};
                        constructor[SPECIES] = function() {
                            return { foo: 1 };
                        };
                        return array[METHOD_NAME](Boolean).foo !== 1;
                    });
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/array-method-is-strict.js":
            /*!*********************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/array-method-is-strict.js ***!
              \*********************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");

                module.exports = function(METHOD_NAME, argument) {
                    var method = [][METHOD_NAME];
                    return !!method && fails(function() {
                        // eslint-disable-next-line no-useless-call,no-throw-literal
                        method.call(null, argument || function() { throw 1; }, 1);
                    });
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/array-method-uses-to-length.js":
            /*!**************************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/array-method-uses-to-length.js ***!
              \**************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var DESCRIPTORS = __webpack_require__( /*! ../internals/descriptors */ "./node_modules/_core-js@3.6.5@core-js/internals/descriptors.js");
                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");
                var has = __webpack_require__( /*! ../internals/has */ "./node_modules/_core-js@3.6.5@core-js/internals/has.js");

                var defineProperty = Object.defineProperty;
                var cache = {};

                var thrower = function(it) { throw it; };

                module.exports = function(METHOD_NAME, options) {
                    if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
                    if (!options) options = {};
                    var method = [][METHOD_NAME];
                    var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
                    var argument0 = has(options, 0) ? options[0] : thrower;
                    var argument1 = has(options, 1) ? options[1] : undefined;

                    return cache[METHOD_NAME] = !!method && !fails(function() {
                        if (ACCESSORS && !DESCRIPTORS) return true;
                        var O = { length: -1 };

                        if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
                        else O[1] = 1;

                        method.call(O, argument0, argument1);
                    });
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/array-species-create.js":
            /*!*******************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/array-species-create.js ***!
              \*******************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var isObject = __webpack_require__( /*! ../internals/is-object */ "./node_modules/_core-js@3.6.5@core-js/internals/is-object.js");
                var isArray = __webpack_require__( /*! ../internals/is-array */ "./node_modules/_core-js@3.6.5@core-js/internals/is-array.js");
                var wellKnownSymbol = __webpack_require__( /*! ../internals/well-known-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js");

                var SPECIES = wellKnownSymbol('species');

                // `ArraySpeciesCreate` abstract operation
                // https://tc39.github.io/ecma262/#sec-arrayspeciescreate
                module.exports = function(originalArray, length) {
                    var C;
                    if (isArray(originalArray)) {
                        C = originalArray.constructor;
                        // cross-realm fallback
                        if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
                        else if (isObject(C)) {
                            C = C[SPECIES];
                            if (C === null) C = undefined;
                        }
                    }
                    return new(C === undefined ? Array : C)(length === 0 ? 0 : length);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/classof-raw.js":
            /*!**********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/classof-raw.js ***!
              \**********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                var toString = {}.toString;

                module.exports = function(it) {
                    return toString.call(it).slice(8, -1);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/classof.js":
            /*!******************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/classof.js ***!
              \******************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var TO_STRING_TAG_SUPPORT = __webpack_require__( /*! ../internals/to-string-tag-support */ "./node_modules/_core-js@3.6.5@core-js/internals/to-string-tag-support.js");
                var classofRaw = __webpack_require__( /*! ../internals/classof-raw */ "./node_modules/_core-js@3.6.5@core-js/internals/classof-raw.js");
                var wellKnownSymbol = __webpack_require__( /*! ../internals/well-known-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js");

                var TO_STRING_TAG = wellKnownSymbol('toStringTag');
                // ES3 wrong here
                var CORRECT_ARGUMENTS = classofRaw(function() { return arguments; }()) == 'Arguments';

                // fallback for IE11 Script Access Denied error
                var tryGet = function(it, key) {
                    try {
                        return it[key];
                    } catch (error) { /* empty */ }
                };

                // getting tag from ES6+ `Object.prototype.toString`
                module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function(it) {
                    var O, tag, result;
                    return it === undefined ? 'Undefined' : it === null ? 'Null'
                        // @@toStringTag case
                        :
                        typeof(tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
                        // builtinTag case
                        :
                        CORRECT_ARGUMENTS ? classofRaw(O)
                        // ES3 arguments fallback
                        :
                        (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/copy-constructor-properties.js":
            /*!**************************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/copy-constructor-properties.js ***!
              \**************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var has = __webpack_require__( /*! ../internals/has */ "./node_modules/_core-js@3.6.5@core-js/internals/has.js");
                var ownKeys = __webpack_require__( /*! ../internals/own-keys */ "./node_modules/_core-js@3.6.5@core-js/internals/own-keys.js");
                var getOwnPropertyDescriptorModule = __webpack_require__( /*! ../internals/object-get-own-property-descriptor */ "./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-descriptor.js");
                var definePropertyModule = __webpack_require__( /*! ../internals/object-define-property */ "./node_modules/_core-js@3.6.5@core-js/internals/object-define-property.js");

                module.exports = function(target, source) {
                    var keys = ownKeys(source);
                    var defineProperty = definePropertyModule.f;
                    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
                    }
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/correct-is-regexp-logic.js":
            /*!**********************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/correct-is-regexp-logic.js ***!
              \**********************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var wellKnownSymbol = __webpack_require__( /*! ../internals/well-known-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js");

                var MATCH = wellKnownSymbol('match');

                module.exports = function(METHOD_NAME) {
                    var regexp = /./;
                    try {
                        '/./' [METHOD_NAME](regexp);
                    } catch (e) {
                        try {
                            regexp[MATCH] = false;
                            return '/./' [METHOD_NAME](regexp);
                        } catch (f) { /* empty */ }
                    }
                    return false;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/create-non-enumerable-property.js":
            /*!*****************************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/create-non-enumerable-property.js ***!
              \*****************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var DESCRIPTORS = __webpack_require__( /*! ../internals/descriptors */ "./node_modules/_core-js@3.6.5@core-js/internals/descriptors.js");
                var definePropertyModule = __webpack_require__( /*! ../internals/object-define-property */ "./node_modules/_core-js@3.6.5@core-js/internals/object-define-property.js");
                var createPropertyDescriptor = __webpack_require__( /*! ../internals/create-property-descriptor */ "./node_modules/_core-js@3.6.5@core-js/internals/create-property-descriptor.js");

                module.exports = DESCRIPTORS ? function(object, key, value) {
                    return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
                } : function(object, key, value) {
                    object[key] = value;
                    return object;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/create-property-descriptor.js":
            /*!*************************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/create-property-descriptor.js ***!
              \*************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                module.exports = function(bitmap, value) {
                    return {
                        enumerable: !(bitmap & 1),
                        configurable: !(bitmap & 2),
                        writable: !(bitmap & 4),
                        value: value
                    };
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/create-property.js":
            /*!**************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/create-property.js ***!
              \**************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var toPrimitive = __webpack_require__( /*! ../internals/to-primitive */ "./node_modules/_core-js@3.6.5@core-js/internals/to-primitive.js");
                var definePropertyModule = __webpack_require__( /*! ../internals/object-define-property */ "./node_modules/_core-js@3.6.5@core-js/internals/object-define-property.js");
                var createPropertyDescriptor = __webpack_require__( /*! ../internals/create-property-descriptor */ "./node_modules/_core-js@3.6.5@core-js/internals/create-property-descriptor.js");

                module.exports = function(object, key, value) {
                    var propertyKey = toPrimitive(key);
                    if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
                    else object[propertyKey] = value;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/descriptors.js":
            /*!**********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/descriptors.js ***!
              \**********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");

                // Thank's IE8 for his funny defineProperty
                module.exports = !fails(function() {
                    return Object.defineProperty({}, 1, { get: function() { return 7; } })[1] != 7;
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/document-create-element.js":
            /*!**********************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/document-create-element.js ***!
              \**********************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");
                var isObject = __webpack_require__( /*! ../internals/is-object */ "./node_modules/_core-js@3.6.5@core-js/internals/is-object.js");

                var document = global.document;
                // typeof document.createElement is 'object' in old IE
                var EXISTS = isObject(document) && isObject(document.createElement);

                module.exports = function(it) {
                    return EXISTS ? document.createElement(it) : {};
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/dom-iterables.js":
            /*!************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/dom-iterables.js ***!
              \************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                // iterable DOM collections
                // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
                module.exports = {
                    CSSRuleList: 0,
                    CSSStyleDeclaration: 0,
                    CSSValueList: 0,
                    ClientRectList: 0,
                    DOMRectList: 0,
                    DOMStringList: 0,
                    DOMTokenList: 1,
                    DataTransferItemList: 0,
                    FileList: 0,
                    HTMLAllCollection: 0,
                    HTMLCollection: 0,
                    HTMLFormElement: 0,
                    HTMLSelectElement: 0,
                    MediaList: 0,
                    MimeTypeArray: 0,
                    NamedNodeMap: 0,
                    NodeList: 1,
                    PaintRequestList: 0,
                    Plugin: 0,
                    PluginArray: 0,
                    SVGLengthList: 0,
                    SVGNumberList: 0,
                    SVGPathSegList: 0,
                    SVGPointList: 0,
                    SVGStringList: 0,
                    SVGTransformList: 0,
                    SourceBufferList: 0,
                    StyleSheetList: 0,
                    TextTrackCueList: 0,
                    TextTrackList: 0,
                    TouchList: 0
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/engine-user-agent.js":
            /*!****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/engine-user-agent.js ***!
              \****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var getBuiltIn = __webpack_require__( /*! ../internals/get-built-in */ "./node_modules/_core-js@3.6.5@core-js/internals/get-built-in.js");

                module.exports = getBuiltIn('navigator', 'userAgent') || '';


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/engine-v8-version.js":
            /*!****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/engine-v8-version.js ***!
              \****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");
                var userAgent = __webpack_require__( /*! ../internals/engine-user-agent */ "./node_modules/_core-js@3.6.5@core-js/internals/engine-user-agent.js");

                var process = global.process;
                var versions = process && process.versions;
                var v8 = versions && versions.v8;
                var match, version;

                if (v8) {
                    match = v8.split('.');
                    version = match[0] + match[1];
                } else if (userAgent) {
                    match = userAgent.match(/Edge\/(\d+)/);
                    if (!match || match[1] >= 74) {
                        match = userAgent.match(/Chrome\/(\d+)/);
                        if (match) version = match[1];
                    }
                }

                module.exports = version && +version;


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/enum-bug-keys.js":
            /*!************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/enum-bug-keys.js ***!
              \************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                // IE8- don't enum bug keys
                module.exports = [
                    'constructor',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'toLocaleString',
                    'toString',
                    'valueOf'
                ];


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/export.js":
            /*!*****************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/export.js ***!
              \*****************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");
                var getOwnPropertyDescriptor = __webpack_require__( /*! ../internals/object-get-own-property-descriptor */ "./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-descriptor.js").f;
                var createNonEnumerableProperty = __webpack_require__( /*! ../internals/create-non-enumerable-property */ "./node_modules/_core-js@3.6.5@core-js/internals/create-non-enumerable-property.js");
                var redefine = __webpack_require__( /*! ../internals/redefine */ "./node_modules/_core-js@3.6.5@core-js/internals/redefine.js");
                var setGlobal = __webpack_require__( /*! ../internals/set-global */ "./node_modules/_core-js@3.6.5@core-js/internals/set-global.js");
                var copyConstructorProperties = __webpack_require__( /*! ../internals/copy-constructor-properties */ "./node_modules/_core-js@3.6.5@core-js/internals/copy-constructor-properties.js");
                var isForced = __webpack_require__( /*! ../internals/is-forced */ "./node_modules/_core-js@3.6.5@core-js/internals/is-forced.js");

                /*
                  options.target      - name of the target object
                  options.global      - target is the global object
                  options.stat        - export as static methods of target
                  options.proto       - export as prototype methods of target
                  options.real        - real prototype method for the `pure` version
                  options.forced      - export even if the native feature is available
                  options.bind        - bind methods to the target, required for the `pure` version
                  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
                  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
                  options.sham        - add a flag to not completely full polyfills
                  options.enumerable  - export as enumerable property
                  options.noTargetGet - prevent calling a getter on target
                */
                module.exports = function(options, source) {
                    var TARGET = options.target;
                    var GLOBAL = options.global;
                    var STATIC = options.stat;
                    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
                    if (GLOBAL) {
                        target = global;
                    } else if (STATIC) {
                        target = global[TARGET] || setGlobal(TARGET, {});
                    } else {
                        target = (global[TARGET] || {}).prototype;
                    }
                    if (target)
                        for (key in source) {
                            sourceProperty = source[key];
                            if (options.noTargetGet) {
                                descriptor = getOwnPropertyDescriptor(target, key);
                                targetProperty = descriptor && descriptor.value;
                            } else targetProperty = target[key];
                            FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
                            // contained in target
                            if (!FORCED && targetProperty !== undefined) {
                                if (typeof sourceProperty === typeof targetProperty) continue;
                                copyConstructorProperties(sourceProperty, targetProperty);
                            }
                            // add a flag to not completely full polyfills
                            if (options.sham || (targetProperty && targetProperty.sham)) {
                                createNonEnumerableProperty(sourceProperty, 'sham', true);
                            }
                            // extend global
                            redefine(target, key, sourceProperty, options);
                        }
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/fails.js":
            /*!****************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/fails.js ***!
              \****************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                module.exports = function(exec) {
                    try {
                        return !!exec();
                    } catch (error) {
                        return true;
                    }
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/fix-regexp-well-known-symbol-logic.js":
            /*!*********************************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/fix-regexp-well-known-symbol-logic.js ***!
              \*********************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                // TODO: Remove from `core-js@4` since it's moved to entry points
                __webpack_require__( /*! ../modules/es.regexp.exec */ "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.exec.js");
                var redefine = __webpack_require__( /*! ../internals/redefine */ "./node_modules/_core-js@3.6.5@core-js/internals/redefine.js");
                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");
                var wellKnownSymbol = __webpack_require__( /*! ../internals/well-known-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js");
                var regexpExec = __webpack_require__( /*! ../internals/regexp-exec */ "./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec.js");
                var createNonEnumerableProperty = __webpack_require__( /*! ../internals/create-non-enumerable-property */ "./node_modules/_core-js@3.6.5@core-js/internals/create-non-enumerable-property.js");

                var SPECIES = wellKnownSymbol('species');

                var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function() {
                    // #replace needs built-in support for named groups.
                    // #match works fine because it just return the exec results, even if it has
                    // a "grops" property.
                    var re = /./;
                    re.exec = function() {
                        var result = [];
                        result.groups = { a: '7' };
                        return result;
                    };
                    return ''.replace(re, '$<a>') !== '7';
                });

                // IE <= 11 replaces $0 with the whole match, as if it was $&
                // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
                var REPLACE_KEEPS_$0 = (function() {
                    return 'a'.replace(/./, '$0') === '$0';
                })();

                var REPLACE = wellKnownSymbol('replace');
                // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
                var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function() {
                    if (/./ [REPLACE]) {
                        return /./ [REPLACE]('a', '$0') === '';
                    }
                    return false;
                })();

                // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
                // Weex JS has frozen built-in prototypes, so use try / catch wrapper
                var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function() {
                    var re = /(?:)/;
                    var originalExec = re.exec;
                    re.exec = function() { return originalExec.apply(this, arguments); };
                    var result = 'ab'.split(re);
                    return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
                });

                module.exports = function(KEY, length, exec, sham) {
                    var SYMBOL = wellKnownSymbol(KEY);

                    var DELEGATES_TO_SYMBOL = !fails(function() {
                        // String methods call symbol-named RegEp methods
                        var O = {};
                        O[SYMBOL] = function() { return 7; };
                        return '' [KEY](O) != 7;
                    });

                    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function() {
                        // Symbol-named RegExp methods call .exec
                        var execCalled = false;
                        var re = /a/;

                        if (KEY === 'split') {
                            // We can't use real regex here since it causes deoptimization
                            // and serious performance degradation in V8
                            // https://github.com/zloirock/core-js/issues/306
                            re = {};
                            // RegExp[@@split] doesn't call the regex's exec method, but first creates
                            // a new one. We need to return the patched regex when creating the new one.
                            re.constructor = {};
                            re.constructor[SPECIES] = function() { return re; };
                            re.flags = '';
                            re[SYMBOL] = /./ [SYMBOL];
                        }

                        re.exec = function() { execCalled = true; return null; };

                        re[SYMBOL]('');
                        return !execCalled;
                    });

                    if (!DELEGATES_TO_SYMBOL ||
                        !DELEGATES_TO_EXEC ||
                        (KEY === 'replace' && !(
                            REPLACE_SUPPORTS_NAMED_GROUPS &&
                            REPLACE_KEEPS_$0 &&
                            !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
                        )) ||
                        (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
                    ) {
                        var nativeRegExpMethod = /./ [SYMBOL];
                        var methods = exec(SYMBOL, '' [KEY], function(nativeMethod, regexp, str, arg2, forceStringMethod) {
                            if (regexp.exec === regexpExec) {
                                if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                                    // The native String method already delegates to @@method (this
                                    // polyfilled function), leasing to infinite recursion.
                                    // We avoid it by directly calling the native @@method method.
                                    return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
                                }
                                return { done: true, value: nativeMethod.call(str, regexp, arg2) };
                            }
                            return { done: false };
                        }, {
                            REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
                            REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
                        });
                        var stringMethod = methods[0];
                        var regexMethod = methods[1];

                        redefine(String.prototype, KEY, stringMethod);
                        redefine(RegExp.prototype, SYMBOL, length == 2
                            // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
                            // 21.2.5.11 RegExp.prototype[@@split](string, limit)
                            ?

                            function(string, arg) { return regexMethod.call(string, this, arg); }
                            // 21.2.5.6 RegExp.prototype[@@match](string)
                            // 21.2.5.9 RegExp.prototype[@@search](string)
                            :
                            function(string) { return regexMethod.call(string, this); }
                        );
                    }

                    if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/function-bind-context.js":
            /*!********************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/function-bind-context.js ***!
              \********************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var aFunction = __webpack_require__( /*! ../internals/a-function */ "./node_modules/_core-js@3.6.5@core-js/internals/a-function.js");

                // optional / simple context binding
                module.exports = function(fn, that, length) {
                    aFunction(fn);
                    if (that === undefined) return fn;
                    switch (length) {
                        case 0:
                            return function() {
                                return fn.call(that);
                            };
                        case 1:
                            return function(a) {
                                return fn.call(that, a);
                            };
                        case 2:
                            return function(a, b) {
                                return fn.call(that, a, b);
                            };
                        case 3:
                            return function(a, b, c) {
                                return fn.call(that, a, b, c);
                            };
                    }
                    return function( /* ...args */ ) {
                        return fn.apply(that, arguments);
                    };
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/get-built-in.js":
            /*!***********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/get-built-in.js ***!
              \***********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var path = __webpack_require__( /*! ../internals/path */ "./node_modules/_core-js@3.6.5@core-js/internals/path.js");
                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");

                var aFunction = function(variable) {
                    return typeof variable == 'function' ? variable : undefined;
                };

                module.exports = function(namespace, method) {
                    return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace]) :
                        path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/global.js":
            /*!*****************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/global.js ***!
              \*****************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                /* WEBPACK VAR INJECTION */
                (function(global) {
                    var check = function(it) {
                        return it && it.Math == Math && it;
                    };

                    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
                    module.exports =
                        // eslint-disable-next-line no-undef
                        check(typeof globalThis == 'object' && globalThis) ||
                        check(typeof window == 'object' && window) ||
                        check(typeof self == 'object' && self) ||
                        check(typeof global == 'object' && global) ||
                        // eslint-disable-next-line no-new-func
                        Function('return this')();

                    /* WEBPACK VAR INJECTION */
                }.call(this, __webpack_require__( /*! ./../../_webpack@4.44.2@webpack/buildin/global.js */ "./node_modules/_webpack@4.44.2@webpack/buildin/global.js")))

                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/has.js":
            /*!**************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/has.js ***!
              \**************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                var hasOwnProperty = {}.hasOwnProperty;

                module.exports = function(it, key) {
                    return hasOwnProperty.call(it, key);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/hidden-keys.js":
            /*!**********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/hidden-keys.js ***!
              \**********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                module.exports = {};


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/html.js":
            /*!***************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/html.js ***!
              \***************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var getBuiltIn = __webpack_require__( /*! ../internals/get-built-in */ "./node_modules/_core-js@3.6.5@core-js/internals/get-built-in.js");

                module.exports = getBuiltIn('document', 'documentElement');


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/ie8-dom-define.js":
            /*!*************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/ie8-dom-define.js ***!
              \*************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var DESCRIPTORS = __webpack_require__( /*! ../internals/descriptors */ "./node_modules/_core-js@3.6.5@core-js/internals/descriptors.js");
                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");
                var createElement = __webpack_require__( /*! ../internals/document-create-element */ "./node_modules/_core-js@3.6.5@core-js/internals/document-create-element.js");

                // Thank's IE8 for his funny defineProperty
                module.exports = !DESCRIPTORS && !fails(function() {
                    return Object.defineProperty(createElement('div'), 'a', {
                        get: function() { return 7; }
                    }).a != 7;
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/indexed-object.js":
            /*!*************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/indexed-object.js ***!
              \*************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");
                var classof = __webpack_require__( /*! ../internals/classof-raw */ "./node_modules/_core-js@3.6.5@core-js/internals/classof-raw.js");

                var split = ''.split;

                // fallback for non-array-like ES3 and non-enumerable old V8 strings
                module.exports = fails(function() {
                    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
                    // eslint-disable-next-line no-prototype-builtins
                    return !Object('z').propertyIsEnumerable(0);
                }) ? function(it) {
                    return classof(it) == 'String' ? split.call(it, '') : Object(it);
                } : Object;


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/inherit-if-required.js":
            /*!******************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/inherit-if-required.js ***!
              \******************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var isObject = __webpack_require__( /*! ../internals/is-object */ "./node_modules/_core-js@3.6.5@core-js/internals/is-object.js");
                var setPrototypeOf = __webpack_require__( /*! ../internals/object-set-prototype-of */ "./node_modules/_core-js@3.6.5@core-js/internals/object-set-prototype-of.js");

                // makes subclassing work correct for wrapped built-ins
                module.exports = function($this, dummy, Wrapper) {
                    var NewTarget, NewTargetPrototype;
                    if (
                        // it can work only with native `setPrototypeOf`
                        setPrototypeOf &&
                        // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
                        typeof(NewTarget = dummy.constructor) == 'function' &&
                        NewTarget !== Wrapper &&
                        isObject(NewTargetPrototype = NewTarget.prototype) &&
                        NewTargetPrototype !== Wrapper.prototype
                    ) setPrototypeOf($this, NewTargetPrototype);
                    return $this;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/inspect-source.js":
            /*!*************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/inspect-source.js ***!
              \*************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var store = __webpack_require__( /*! ../internals/shared-store */ "./node_modules/_core-js@3.6.5@core-js/internals/shared-store.js");

                var functionToString = Function.toString;

                // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
                if (typeof store.inspectSource != 'function') {
                    store.inspectSource = function(it) {
                        return functionToString.call(it);
                    };
                }

                module.exports = store.inspectSource;


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/internal-state.js":
            /*!*************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/internal-state.js ***!
              \*************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var NATIVE_WEAK_MAP = __webpack_require__( /*! ../internals/native-weak-map */ "./node_modules/_core-js@3.6.5@core-js/internals/native-weak-map.js");
                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");
                var isObject = __webpack_require__( /*! ../internals/is-object */ "./node_modules/_core-js@3.6.5@core-js/internals/is-object.js");
                var createNonEnumerableProperty = __webpack_require__( /*! ../internals/create-non-enumerable-property */ "./node_modules/_core-js@3.6.5@core-js/internals/create-non-enumerable-property.js");
                var objectHas = __webpack_require__( /*! ../internals/has */ "./node_modules/_core-js@3.6.5@core-js/internals/has.js");
                var sharedKey = __webpack_require__( /*! ../internals/shared-key */ "./node_modules/_core-js@3.6.5@core-js/internals/shared-key.js");
                var hiddenKeys = __webpack_require__( /*! ../internals/hidden-keys */ "./node_modules/_core-js@3.6.5@core-js/internals/hidden-keys.js");

                var WeakMap = global.WeakMap;
                var set, get, has;

                var enforce = function(it) {
                    return has(it) ? get(it) : set(it, {});
                };

                var getterFor = function(TYPE) {
                    return function(it) {
                        var state;
                        if (!isObject(it) || (state = get(it)).type !== TYPE) {
                            throw TypeError('Incompatible receiver, ' + TYPE + ' required');
                        }
                        return state;
                    };
                };

                if (NATIVE_WEAK_MAP) {
                    var store = new WeakMap();
                    var wmget = store.get;
                    var wmhas = store.has;
                    var wmset = store.set;
                    set = function(it, metadata) {
                        wmset.call(store, it, metadata);
                        return metadata;
                    };
                    get = function(it) {
                        return wmget.call(store, it) || {};
                    };
                    has = function(it) {
                        return wmhas.call(store, it);
                    };
                } else {
                    var STATE = sharedKey('state');
                    hiddenKeys[STATE] = true;
                    set = function(it, metadata) {
                        createNonEnumerableProperty(it, STATE, metadata);
                        return metadata;
                    };
                    get = function(it) {
                        return objectHas(it, STATE) ? it[STATE] : {};
                    };
                    has = function(it) {
                        return objectHas(it, STATE);
                    };
                }

                module.exports = {
                    set: set,
                    get: get,
                    has: has,
                    enforce: enforce,
                    getterFor: getterFor
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/is-array.js":
            /*!*******************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/is-array.js ***!
              \*******************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var classof = __webpack_require__( /*! ../internals/classof-raw */ "./node_modules/_core-js@3.6.5@core-js/internals/classof-raw.js");

                // `IsArray` abstract operation
                // https://tc39.github.io/ecma262/#sec-isarray
                module.exports = Array.isArray || function isArray(arg) {
                    return classof(arg) == 'Array';
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/is-forced.js":
            /*!********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/is-forced.js ***!
              \********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");

                var replacement = /#|\.prototype\./;

                var isForced = function(feature, detection) {
                    var value = data[normalize(feature)];
                    return value == POLYFILL ? true :
                        value == NATIVE ? false :
                        typeof detection == 'function' ? fails(detection) :
                        !!detection;
                };

                var normalize = isForced.normalize = function(string) {
                    return String(string).replace(replacement, '.').toLowerCase();
                };

                var data = isForced.data = {};
                var NATIVE = isForced.NATIVE = 'N';
                var POLYFILL = isForced.POLYFILL = 'P';

                module.exports = isForced;


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/is-object.js":
            /*!********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/is-object.js ***!
              \********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                module.exports = function(it) {
                    return typeof it === 'object' ? it !== null : typeof it === 'function';
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/is-pure.js":
            /*!******************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/is-pure.js ***!
              \******************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                module.exports = false;


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/is-regexp.js":
            /*!********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/is-regexp.js ***!
              \********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var isObject = __webpack_require__( /*! ../internals/is-object */ "./node_modules/_core-js@3.6.5@core-js/internals/is-object.js");
                var classof = __webpack_require__( /*! ../internals/classof-raw */ "./node_modules/_core-js@3.6.5@core-js/internals/classof-raw.js");
                var wellKnownSymbol = __webpack_require__( /*! ../internals/well-known-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js");

                var MATCH = wellKnownSymbol('match');

                // `IsRegExp` abstract operation
                // https://tc39.github.io/ecma262/#sec-isregexp
                module.exports = function(it) {
                    var isRegExp;
                    return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/native-symbol.js":
            /*!************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/native-symbol.js ***!
              \************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");

                module.exports = !!Object.getOwnPropertySymbols && !fails(function() {
                    // Chrome 38 Symbol has incorrect toString conversion
                    // eslint-disable-next-line no-undef
                    return !String(Symbol());
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/native-weak-map.js":
            /*!**************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/native-weak-map.js ***!
              \**************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");
                var inspectSource = __webpack_require__( /*! ../internals/inspect-source */ "./node_modules/_core-js@3.6.5@core-js/internals/inspect-source.js");

                var WeakMap = global.WeakMap;

                module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/not-a-regexp.js":
            /*!***********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/not-a-regexp.js ***!
              \***********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var isRegExp = __webpack_require__( /*! ../internals/is-regexp */ "./node_modules/_core-js@3.6.5@core-js/internals/is-regexp.js");

                module.exports = function(it) {
                    if (isRegExp(it)) {
                        throw TypeError("The method doesn't accept regular expressions");
                    }
                    return it;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/object-create.js":
            /*!************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/object-create.js ***!
              \************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");
                var defineProperties = __webpack_require__( /*! ../internals/object-define-properties */ "./node_modules/_core-js@3.6.5@core-js/internals/object-define-properties.js");
                var enumBugKeys = __webpack_require__( /*! ../internals/enum-bug-keys */ "./node_modules/_core-js@3.6.5@core-js/internals/enum-bug-keys.js");
                var hiddenKeys = __webpack_require__( /*! ../internals/hidden-keys */ "./node_modules/_core-js@3.6.5@core-js/internals/hidden-keys.js");
                var html = __webpack_require__( /*! ../internals/html */ "./node_modules/_core-js@3.6.5@core-js/internals/html.js");
                var documentCreateElement = __webpack_require__( /*! ../internals/document-create-element */ "./node_modules/_core-js@3.6.5@core-js/internals/document-create-element.js");
                var sharedKey = __webpack_require__( /*! ../internals/shared-key */ "./node_modules/_core-js@3.6.5@core-js/internals/shared-key.js");

                var GT = '>';
                var LT = '<';
                var PROTOTYPE = 'prototype';
                var SCRIPT = 'script';
                var IE_PROTO = sharedKey('IE_PROTO');

                var EmptyConstructor = function() { /* empty */ };

                var scriptTag = function(content) {
                    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
                };

                // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
                var NullProtoObjectViaActiveX = function(activeXDocument) {
                    activeXDocument.write(scriptTag(''));
                    activeXDocument.close();
                    var temp = activeXDocument.parentWindow.Object;
                    activeXDocument = null; // avoid memory leak
                    return temp;
                };

                // Create object with fake `null` prototype: use iframe Object with cleared prototype
                var NullProtoObjectViaIFrame = function() {
                    // Thrash, waste and sodomy: IE GC bug
                    var iframe = documentCreateElement('iframe');
                    var JS = 'java' + SCRIPT + ':';
                    var iframeDocument;
                    iframe.style.display = 'none';
                    html.appendChild(iframe);
                    // https://github.com/zloirock/core-js/issues/475
                    iframe.src = String(JS);
                    iframeDocument = iframe.contentWindow.document;
                    iframeDocument.open();
                    iframeDocument.write(scriptTag('document.F=Object'));
                    iframeDocument.close();
                    return iframeDocument.F;
                };

                // Check for document.domain and active x support
                // No need to use active x approach when document.domain is not set
                // see https://github.com/es-shims/es5-shim/issues/150
                // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
                // avoid IE GC bug
                var activeXDocument;
                var NullProtoObject = function() {
                    try {
                        /* global ActiveXObject */
                        activeXDocument = document.domain && new ActiveXObject('htmlfile');
                    } catch (error) { /* ignore */ }
                    NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
                    var length = enumBugKeys.length;
                    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
                    return NullProtoObject();
                };

                hiddenKeys[IE_PROTO] = true;

                // `Object.create` method
                // https://tc39.github.io/ecma262/#sec-object.create
                module.exports = Object.create || function create(O, Properties) {
                    var result;
                    if (O !== null) {
                        EmptyConstructor[PROTOTYPE] = anObject(O);
                        result = new EmptyConstructor();
                        EmptyConstructor[PROTOTYPE] = null;
                        // add "__proto__" for Object.getPrototypeOf polyfill
                        result[IE_PROTO] = O;
                    } else result = NullProtoObject();
                    return Properties === undefined ? result : defineProperties(result, Properties);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/object-define-properties.js":
            /*!***********************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/object-define-properties.js ***!
              \***********************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var DESCRIPTORS = __webpack_require__( /*! ../internals/descriptors */ "./node_modules/_core-js@3.6.5@core-js/internals/descriptors.js");
                var definePropertyModule = __webpack_require__( /*! ../internals/object-define-property */ "./node_modules/_core-js@3.6.5@core-js/internals/object-define-property.js");
                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");
                var objectKeys = __webpack_require__( /*! ../internals/object-keys */ "./node_modules/_core-js@3.6.5@core-js/internals/object-keys.js");

                // `Object.defineProperties` method
                // https://tc39.github.io/ecma262/#sec-object.defineproperties
                module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
                    anObject(O);
                    var keys = objectKeys(Properties);
                    var length = keys.length;
                    var index = 0;
                    var key;
                    while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
                    return O;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/object-define-property.js":
            /*!*********************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/object-define-property.js ***!
              \*********************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var DESCRIPTORS = __webpack_require__( /*! ../internals/descriptors */ "./node_modules/_core-js@3.6.5@core-js/internals/descriptors.js");
                var IE8_DOM_DEFINE = __webpack_require__( /*! ../internals/ie8-dom-define */ "./node_modules/_core-js@3.6.5@core-js/internals/ie8-dom-define.js");
                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");
                var toPrimitive = __webpack_require__( /*! ../internals/to-primitive */ "./node_modules/_core-js@3.6.5@core-js/internals/to-primitive.js");

                var nativeDefineProperty = Object.defineProperty;

                // `Object.defineProperty` method
                // https://tc39.github.io/ecma262/#sec-object.defineproperty
                exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
                    anObject(O);
                    P = toPrimitive(P, true);
                    anObject(Attributes);
                    if (IE8_DOM_DEFINE) try {
                        return nativeDefineProperty(O, P, Attributes);
                    } catch (error) { /* empty */ }
                    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
                    if ('value' in Attributes) O[P] = Attributes.value;
                    return O;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-descriptor.js":
            /*!*********************************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-descriptor.js ***!
              \*********************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var DESCRIPTORS = __webpack_require__( /*! ../internals/descriptors */ "./node_modules/_core-js@3.6.5@core-js/internals/descriptors.js");
                var propertyIsEnumerableModule = __webpack_require__( /*! ../internals/object-property-is-enumerable */ "./node_modules/_core-js@3.6.5@core-js/internals/object-property-is-enumerable.js");
                var createPropertyDescriptor = __webpack_require__( /*! ../internals/create-property-descriptor */ "./node_modules/_core-js@3.6.5@core-js/internals/create-property-descriptor.js");
                var toIndexedObject = __webpack_require__( /*! ../internals/to-indexed-object */ "./node_modules/_core-js@3.6.5@core-js/internals/to-indexed-object.js");
                var toPrimitive = __webpack_require__( /*! ../internals/to-primitive */ "./node_modules/_core-js@3.6.5@core-js/internals/to-primitive.js");
                var has = __webpack_require__( /*! ../internals/has */ "./node_modules/_core-js@3.6.5@core-js/internals/has.js");
                var IE8_DOM_DEFINE = __webpack_require__( /*! ../internals/ie8-dom-define */ "./node_modules/_core-js@3.6.5@core-js/internals/ie8-dom-define.js");

                var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

                // `Object.getOwnPropertyDescriptor` method
                // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
                exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
                    O = toIndexedObject(O);
                    P = toPrimitive(P, true);
                    if (IE8_DOM_DEFINE) try {
                        return nativeGetOwnPropertyDescriptor(O, P);
                    } catch (error) { /* empty */ }
                    if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-names.js":
            /*!****************************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-names.js ***!
              \****************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var internalObjectKeys = __webpack_require__( /*! ../internals/object-keys-internal */ "./node_modules/_core-js@3.6.5@core-js/internals/object-keys-internal.js");
                var enumBugKeys = __webpack_require__( /*! ../internals/enum-bug-keys */ "./node_modules/_core-js@3.6.5@core-js/internals/enum-bug-keys.js");

                var hiddenKeys = enumBugKeys.concat('length', 'prototype');

                // `Object.getOwnPropertyNames` method
                // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
                exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
                    return internalObjectKeys(O, hiddenKeys);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-symbols.js":
            /*!******************************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-symbols.js ***!
              \******************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                exports.f = Object.getOwnPropertySymbols;


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/object-keys-internal.js":
            /*!*******************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/object-keys-internal.js ***!
              \*******************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var has = __webpack_require__( /*! ../internals/has */ "./node_modules/_core-js@3.6.5@core-js/internals/has.js");
                var toIndexedObject = __webpack_require__( /*! ../internals/to-indexed-object */ "./node_modules/_core-js@3.6.5@core-js/internals/to-indexed-object.js");
                var indexOf = __webpack_require__( /*! ../internals/array-includes */ "./node_modules/_core-js@3.6.5@core-js/internals/array-includes.js").indexOf;
                var hiddenKeys = __webpack_require__( /*! ../internals/hidden-keys */ "./node_modules/_core-js@3.6.5@core-js/internals/hidden-keys.js");

                module.exports = function(object, names) {
                    var O = toIndexedObject(object);
                    var i = 0;
                    var result = [];
                    var key;
                    for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
                    // Don't enum bug & hidden keys
                    while (names.length > i)
                        if (has(O, key = names[i++])) {
                            ~indexOf(result, key) || result.push(key);
                        }
                    return result;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/object-keys.js":
            /*!**********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/object-keys.js ***!
              \**********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var internalObjectKeys = __webpack_require__( /*! ../internals/object-keys-internal */ "./node_modules/_core-js@3.6.5@core-js/internals/object-keys-internal.js");
                var enumBugKeys = __webpack_require__( /*! ../internals/enum-bug-keys */ "./node_modules/_core-js@3.6.5@core-js/internals/enum-bug-keys.js");

                // `Object.keys` method
                // https://tc39.github.io/ecma262/#sec-object.keys
                module.exports = Object.keys || function keys(O) {
                    return internalObjectKeys(O, enumBugKeys);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/object-property-is-enumerable.js":
            /*!****************************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/object-property-is-enumerable.js ***!
              \****************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
                var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

                // Nashorn ~ JDK8 bug
                var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

                // `Object.prototype.propertyIsEnumerable` method implementation
                // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
                exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
                    var descriptor = getOwnPropertyDescriptor(this, V);
                    return !!descriptor && descriptor.enumerable;
                } : nativePropertyIsEnumerable;


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/object-set-prototype-of.js":
            /*!**********************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/object-set-prototype-of.js ***!
              \**********************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");
                var aPossiblePrototype = __webpack_require__( /*! ../internals/a-possible-prototype */ "./node_modules/_core-js@3.6.5@core-js/internals/a-possible-prototype.js");

                // `Object.setPrototypeOf` method
                // https://tc39.github.io/ecma262/#sec-object.setprototypeof
                // Works with __proto__ only. Old v8 can't work with null proto objects.
                /* eslint-disable no-proto */
                module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function() {
                    var CORRECT_SETTER = false;
                    var test = {};
                    var setter;
                    try {
                        setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
                        setter.call(test, []);
                        CORRECT_SETTER = test instanceof Array;
                    } catch (error) { /* empty */ }
                    return function setPrototypeOf(O, proto) {
                        anObject(O);
                        aPossiblePrototype(proto);
                        if (CORRECT_SETTER) setter.call(O, proto);
                        else O.__proto__ = proto;
                        return O;
                    };
                }() : undefined);


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/object-to-string.js":
            /*!***************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/object-to-string.js ***!
              \***************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var TO_STRING_TAG_SUPPORT = __webpack_require__( /*! ../internals/to-string-tag-support */ "./node_modules/_core-js@3.6.5@core-js/internals/to-string-tag-support.js");
                var classof = __webpack_require__( /*! ../internals/classof */ "./node_modules/_core-js@3.6.5@core-js/internals/classof.js");

                // `Object.prototype.toString` method implementation
                // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
                module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
                    return '[object ' + classof(this) + ']';
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/own-keys.js":
            /*!*******************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/own-keys.js ***!
              \*******************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var getBuiltIn = __webpack_require__( /*! ../internals/get-built-in */ "./node_modules/_core-js@3.6.5@core-js/internals/get-built-in.js");
                var getOwnPropertyNamesModule = __webpack_require__( /*! ../internals/object-get-own-property-names */ "./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-names.js");
                var getOwnPropertySymbolsModule = __webpack_require__( /*! ../internals/object-get-own-property-symbols */ "./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-symbols.js");
                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");

                // all object keys, includes non-enumerable and symbols
                module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
                    var keys = getOwnPropertyNamesModule.f(anObject(it));
                    var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
                    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/path.js":
            /*!***************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/path.js ***!
              \***************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");

                module.exports = global;


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/redefine.js":
            /*!*******************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/redefine.js ***!
              \*******************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");
                var createNonEnumerableProperty = __webpack_require__( /*! ../internals/create-non-enumerable-property */ "./node_modules/_core-js@3.6.5@core-js/internals/create-non-enumerable-property.js");
                var has = __webpack_require__( /*! ../internals/has */ "./node_modules/_core-js@3.6.5@core-js/internals/has.js");
                var setGlobal = __webpack_require__( /*! ../internals/set-global */ "./node_modules/_core-js@3.6.5@core-js/internals/set-global.js");
                var inspectSource = __webpack_require__( /*! ../internals/inspect-source */ "./node_modules/_core-js@3.6.5@core-js/internals/inspect-source.js");
                var InternalStateModule = __webpack_require__( /*! ../internals/internal-state */ "./node_modules/_core-js@3.6.5@core-js/internals/internal-state.js");

                var getInternalState = InternalStateModule.get;
                var enforceInternalState = InternalStateModule.enforce;
                var TEMPLATE = String(String).split('String');

                (module.exports = function(O, key, value, options) {
                    var unsafe = options ? !!options.unsafe : false;
                    var simple = options ? !!options.enumerable : false;
                    var noTargetGet = options ? !!options.noTargetGet : false;
                    if (typeof value == 'function') {
                        if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
                        enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
                    }
                    if (O === global) {
                        if (simple) O[key] = value;
                        else setGlobal(key, value);
                        return;
                    } else if (!unsafe) {
                        delete O[key];
                    } else if (!noTargetGet && O[key]) {
                        simple = true;
                    }
                    if (simple) O[key] = value;
                    else createNonEnumerableProperty(O, key, value);
                    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
                })(Function.prototype, 'toString', function toString() {
                    return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec-abstract.js":
            /*!*******************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec-abstract.js ***!
              \*******************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var classof = __webpack_require__( /*! ./classof-raw */ "./node_modules/_core-js@3.6.5@core-js/internals/classof-raw.js");
                var regexpExec = __webpack_require__( /*! ./regexp-exec */ "./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec.js");

                // `RegExpExec` abstract operation
                // https://tc39.github.io/ecma262/#sec-regexpexec
                module.exports = function(R, S) {
                    var exec = R.exec;
                    if (typeof exec === 'function') {
                        var result = exec.call(R, S);
                        if (typeof result !== 'object') {
                            throw TypeError('RegExp exec method returned something other than an Object or null');
                        }
                        return result;
                    }

                    if (classof(R) !== 'RegExp') {
                        throw TypeError('RegExp#exec called on incompatible receiver');
                    }

                    return regexpExec.call(R, S);
                };



                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec.js":
            /*!**********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec.js ***!
              \**********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var regexpFlags = __webpack_require__( /*! ./regexp-flags */ "./node_modules/_core-js@3.6.5@core-js/internals/regexp-flags.js");
                var stickyHelpers = __webpack_require__( /*! ./regexp-sticky-helpers */ "./node_modules/_core-js@3.6.5@core-js/internals/regexp-sticky-helpers.js");

                var nativeExec = RegExp.prototype.exec;
                // This always refers to the native implementation, because the
                // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
                // which loads this file before patching the method.
                var nativeReplace = String.prototype.replace;

                var patchedExec = nativeExec;

                var UPDATES_LAST_INDEX_WRONG = (function() {
                    var re1 = /a/;
                    var re2 = /b*/g;
                    nativeExec.call(re1, 'a');
                    nativeExec.call(re2, 'a');
                    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
                })();

                var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

                // nonparticipating capturing group, copied from es5-shim's String#split patch.
                var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

                var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;

                if (PATCH) {
                    patchedExec = function exec(str) {
                        var re = this;
                        var lastIndex, reCopy, match, i;
                        var sticky = UNSUPPORTED_Y && re.sticky;
                        var flags = regexpFlags.call(re);
                        var source = re.source;
                        var charsAdded = 0;
                        var strCopy = str;

                        if (sticky) {
                            flags = flags.replace('y', '');
                            if (flags.indexOf('g') === -1) {
                                flags += 'g';
                            }

                            strCopy = String(str).slice(re.lastIndex);
                            // Support anchored sticky behavior.
                            if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
                                source = '(?: ' + source + ')';
                                strCopy = ' ' + strCopy;
                                charsAdded++;
                            }
                            // ^(? + rx + ) is needed, in combination with some str slicing, to
                            // simulate the 'y' flag.
                            reCopy = new RegExp('^(?:' + source + ')', flags);
                        }

                        if (NPCG_INCLUDED) {
                            reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
                        }
                        if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

                        match = nativeExec.call(sticky ? reCopy : re, strCopy);

                        if (sticky) {
                            if (match) {
                                match.input = match.input.slice(charsAdded);
                                match[0] = match[0].slice(charsAdded);
                                match.index = re.lastIndex;
                                re.lastIndex += match[0].length;
                            } else re.lastIndex = 0;
                        } else if (UPDATES_LAST_INDEX_WRONG && match) {
                            re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
                        }
                        if (NPCG_INCLUDED && match && match.length > 1) {
                            // Fix browsers whose `exec` methods don't consistently return `undefined`
                            // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
                            nativeReplace.call(match[0], reCopy, function() {
                                for (i = 1; i < arguments.length - 2; i++) {
                                    if (arguments[i] === undefined) match[i] = undefined;
                                }
                            });
                        }

                        return match;
                    };
                }

                module.exports = patchedExec;


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/regexp-flags.js":
            /*!***********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/regexp-flags.js ***!
              \***********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");

                // `RegExp.prototype.flags` getter implementation
                // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
                module.exports = function() {
                    var that = anObject(this);
                    var result = '';
                    if (that.global) result += 'g';
                    if (that.ignoreCase) result += 'i';
                    if (that.multiline) result += 'm';
                    if (that.dotAll) result += 's';
                    if (that.unicode) result += 'u';
                    if (that.sticky) result += 'y';
                    return result;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/regexp-sticky-helpers.js":
            /*!********************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/regexp-sticky-helpers.js ***!
              \********************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";


                var fails = __webpack_require__( /*! ./fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");

                // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
                // so we use an intermediate function.
                function RE(s, f) {
                    return RegExp(s, f);
                }

                exports.UNSUPPORTED_Y = fails(function() {
                    // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
                    var re = RE('a', 'y');
                    re.lastIndex = 2;
                    return re.exec('abcd') != null;
                });

                exports.BROKEN_CARET = fails(function() {
                    // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
                    var re = RE('^r', 'gy');
                    re.lastIndex = 2;
                    return re.exec('str') != null;
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js":
            /*!***********************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js ***!
              \***********************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                // `RequireObjectCoercible` abstract operation
                // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
                module.exports = function(it) {
                    if (it == undefined) throw TypeError("Can't call method on " + it);
                    return it;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/same-value.js":
            /*!*********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/same-value.js ***!
              \*********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                // `SameValue` abstract operation
                // https://tc39.github.io/ecma262/#sec-samevalue
                module.exports = Object.is || function is(x, y) {
                    // eslint-disable-next-line no-self-compare
                    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/set-global.js":
            /*!*********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/set-global.js ***!
              \*********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");
                var createNonEnumerableProperty = __webpack_require__( /*! ../internals/create-non-enumerable-property */ "./node_modules/_core-js@3.6.5@core-js/internals/create-non-enumerable-property.js");

                module.exports = function(key, value) {
                    try {
                        createNonEnumerableProperty(global, key, value);
                    } catch (error) {
                        global[key] = value;
                    }
                    return value;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/shared-key.js":
            /*!*********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/shared-key.js ***!
              \*********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var shared = __webpack_require__( /*! ../internals/shared */ "./node_modules/_core-js@3.6.5@core-js/internals/shared.js");
                var uid = __webpack_require__( /*! ../internals/uid */ "./node_modules/_core-js@3.6.5@core-js/internals/uid.js");

                var keys = shared('keys');

                module.exports = function(key) {
                    return keys[key] || (keys[key] = uid(key));
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/shared-store.js":
            /*!***********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/shared-store.js ***!
              \***********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");
                var setGlobal = __webpack_require__( /*! ../internals/set-global */ "./node_modules/_core-js@3.6.5@core-js/internals/set-global.js");

                var SHARED = '__core-js_shared__';
                var store = global[SHARED] || setGlobal(SHARED, {});

                module.exports = store;


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/shared.js":
            /*!*****************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/shared.js ***!
              \*****************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var IS_PURE = __webpack_require__( /*! ../internals/is-pure */ "./node_modules/_core-js@3.6.5@core-js/internals/is-pure.js");
                var store = __webpack_require__( /*! ../internals/shared-store */ "./node_modules/_core-js@3.6.5@core-js/internals/shared-store.js");

                (module.exports = function(key, value) {
                    return store[key] || (store[key] = value !== undefined ? value : {});
                })('versions', []).push({
                    version: '3.6.5',
                    mode: IS_PURE ? 'pure' : 'global',
                    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/species-constructor.js":
            /*!******************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/species-constructor.js ***!
              \******************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");
                var aFunction = __webpack_require__( /*! ../internals/a-function */ "./node_modules/_core-js@3.6.5@core-js/internals/a-function.js");
                var wellKnownSymbol = __webpack_require__( /*! ../internals/well-known-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js");

                var SPECIES = wellKnownSymbol('species');

                // `SpeciesConstructor` abstract operation
                // https://tc39.github.io/ecma262/#sec-speciesconstructor
                module.exports = function(O, defaultConstructor) {
                    var C = anObject(O).constructor;
                    var S;
                    return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/string-multibyte.js":
            /*!***************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/string-multibyte.js ***!
              \***************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var toInteger = __webpack_require__( /*! ../internals/to-integer */ "./node_modules/_core-js@3.6.5@core-js/internals/to-integer.js");
                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");

                // `String.prototype.{ codePointAt, at }` methods implementation
                var createMethod = function(CONVERT_TO_STRING) {
                    return function($this, pos) {
                        var S = String(requireObjectCoercible($this));
                        var position = toInteger(pos);
                        var size = S.length;
                        var first, second;
                        if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
                        first = S.charCodeAt(position);
                        return first < 0xD800 || first > 0xDBFF || position + 1 === size ||
                            (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF ?
                            CONVERT_TO_STRING ? S.charAt(position) : first :
                            CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
                    };
                };

                module.exports = {
                    // `String.prototype.codePointAt` method
                    // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
                    codeAt: createMethod(false),
                    // `String.prototype.at` method
                    // https://github.com/mathiasbynens/String.prototype.at
                    charAt: createMethod(true)
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/string-repeat.js":
            /*!************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/string-repeat.js ***!
              \************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var toInteger = __webpack_require__( /*! ../internals/to-integer */ "./node_modules/_core-js@3.6.5@core-js/internals/to-integer.js");
                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");

                // `String.prototype.repeat` method implementation
                // https://tc39.github.io/ecma262/#sec-string.prototype.repeat
                module.exports = ''.repeat || function repeat(count) {
                    var str = String(requireObjectCoercible(this));
                    var result = '';
                    var n = toInteger(count);
                    if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
                    for (; n > 0;
                        (n >>>= 1) && (str += str))
                        if (n & 1) result += str;
                    return result;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/string-trim-forced.js":
            /*!*****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/string-trim-forced.js ***!
              \*****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");
                var whitespaces = __webpack_require__( /*! ../internals/whitespaces */ "./node_modules/_core-js@3.6.5@core-js/internals/whitespaces.js");

                var non = '\u200B\u0085\u180E';

                // check that a method works with the correct list
                // of whitespaces and has a correct name
                module.exports = function(METHOD_NAME) {
                    return fails(function() {
                        return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
                    });
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/string-trim.js":
            /*!**********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/string-trim.js ***!
              \**********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");
                var whitespaces = __webpack_require__( /*! ../internals/whitespaces */ "./node_modules/_core-js@3.6.5@core-js/internals/whitespaces.js");

                var whitespace = '[' + whitespaces + ']';
                var ltrim = RegExp('^' + whitespace + whitespace + '*');
                var rtrim = RegExp(whitespace + whitespace + '*$');

                // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
                var createMethod = function(TYPE) {
                    return function($this) {
                        var string = String(requireObjectCoercible($this));
                        if (TYPE & 1) string = string.replace(ltrim, '');
                        if (TYPE & 2) string = string.replace(rtrim, '');
                        return string;
                    };
                };

                module.exports = {
                    // `String.prototype.{ trimLeft, trimStart }` methods
                    // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
                    start: createMethod(1),
                    // `String.prototype.{ trimRight, trimEnd }` methods
                    // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
                    end: createMethod(2),
                    // `String.prototype.trim` method
                    // https://tc39.github.io/ecma262/#sec-string.prototype.trim
                    trim: createMethod(3)
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/this-number-value.js":
            /*!****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/this-number-value.js ***!
              \****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var classof = __webpack_require__( /*! ../internals/classof-raw */ "./node_modules/_core-js@3.6.5@core-js/internals/classof-raw.js");

                // `thisNumberValue` abstract operation
                // https://tc39.github.io/ecma262/#sec-thisnumbervalue
                module.exports = function(value) {
                    if (typeof value != 'number' && classof(value) != 'Number') {
                        throw TypeError('Incorrect invocation');
                    }
                    return +value;
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/to-absolute-index.js":
            /*!****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/to-absolute-index.js ***!
              \****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var toInteger = __webpack_require__( /*! ../internals/to-integer */ "./node_modules/_core-js@3.6.5@core-js/internals/to-integer.js");

                var max = Math.max;
                var min = Math.min;

                // Helper for a popular repeating case of the spec:
                // Let integer be ? ToInteger(index).
                // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
                module.exports = function(index, length) {
                    var integer = toInteger(index);
                    return integer < 0 ? max(integer + length, 0) : min(integer, length);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/to-indexed-object.js":
            /*!****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/to-indexed-object.js ***!
              \****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                // toObject with fallback for non-array-like ES3 strings
                var IndexedObject = __webpack_require__( /*! ../internals/indexed-object */ "./node_modules/_core-js@3.6.5@core-js/internals/indexed-object.js");
                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");

                module.exports = function(it) {
                    return IndexedObject(requireObjectCoercible(it));
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/to-integer.js":
            /*!*********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/to-integer.js ***!
              \*********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                var ceil = Math.ceil;
                var floor = Math.floor;

                // `ToInteger` abstract operation
                // https://tc39.github.io/ecma262/#sec-tointeger
                module.exports = function(argument) {
                    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/to-length.js":
            /*!********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/to-length.js ***!
              \********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var toInteger = __webpack_require__( /*! ../internals/to-integer */ "./node_modules/_core-js@3.6.5@core-js/internals/to-integer.js");

                var min = Math.min;

                // `ToLength` abstract operation
                // https://tc39.github.io/ecma262/#sec-tolength
                module.exports = function(argument) {
                    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/to-object.js":
            /*!********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/to-object.js ***!
              \********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");

                // `ToObject` abstract operation
                // https://tc39.github.io/ecma262/#sec-toobject
                module.exports = function(argument) {
                    return Object(requireObjectCoercible(argument));
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/to-primitive.js":
            /*!***********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/to-primitive.js ***!
              \***********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var isObject = __webpack_require__( /*! ../internals/is-object */ "./node_modules/_core-js@3.6.5@core-js/internals/is-object.js");

                // `ToPrimitive` abstract operation
                // https://tc39.github.io/ecma262/#sec-toprimitive
                // instead of the ES6 spec version, we didn't implement @@toPrimitive case
                // and the second argument - flag - preferred type is a string
                module.exports = function(input, PREFERRED_STRING) {
                    if (!isObject(input)) return input;
                    var fn, val;
                    if (PREFERRED_STRING && typeof(fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
                    if (typeof(fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
                    if (!PREFERRED_STRING && typeof(fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
                    throw TypeError("Can't convert object to primitive value");
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/to-string-tag-support.js":
            /*!********************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/to-string-tag-support.js ***!
              \********************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var wellKnownSymbol = __webpack_require__( /*! ../internals/well-known-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js");

                var TO_STRING_TAG = wellKnownSymbol('toStringTag');
                var test = {};

                test[TO_STRING_TAG] = 'z';

                module.exports = String(test) === '[object z]';


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/uid.js":
            /*!**************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/uid.js ***!
              \**************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                var id = 0;
                var postfix = Math.random();

                module.exports = function(key) {
                    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/use-symbol-as-uid.js":
            /*!****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/use-symbol-as-uid.js ***!
              \****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var NATIVE_SYMBOL = __webpack_require__( /*! ../internals/native-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/native-symbol.js");

                module.exports = NATIVE_SYMBOL
                    // eslint-disable-next-line no-undef
                    &&
                    !Symbol.sham
                    // eslint-disable-next-line no-undef
                    &&
                    typeof Symbol.iterator == 'symbol';


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js":
            /*!****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js ***!
              \****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");
                var shared = __webpack_require__( /*! ../internals/shared */ "./node_modules/_core-js@3.6.5@core-js/internals/shared.js");
                var has = __webpack_require__( /*! ../internals/has */ "./node_modules/_core-js@3.6.5@core-js/internals/has.js");
                var uid = __webpack_require__( /*! ../internals/uid */ "./node_modules/_core-js@3.6.5@core-js/internals/uid.js");
                var NATIVE_SYMBOL = __webpack_require__( /*! ../internals/native-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/native-symbol.js");
                var USE_SYMBOL_AS_UID = __webpack_require__( /*! ../internals/use-symbol-as-uid */ "./node_modules/_core-js@3.6.5@core-js/internals/use-symbol-as-uid.js");

                var WellKnownSymbolsStore = shared('wks');
                var Symbol = global.Symbol;
                var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

                module.exports = function(name) {
                    if (!has(WellKnownSymbolsStore, name)) {
                        if (NATIVE_SYMBOL && has(Symbol, name)) WellKnownSymbolsStore[name] = Symbol[name];
                        else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
                    }
                    return WellKnownSymbolsStore[name];
                };


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/internals/whitespaces.js":
            /*!**********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/internals/whitespaces.js ***!
              \**********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                // a string of all valid unicode whitespaces
                // eslint-disable-next-line max-len
                module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.array.concat.js":
            /*!************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.array.concat.js ***!
              \************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");
                var isArray = __webpack_require__( /*! ../internals/is-array */ "./node_modules/_core-js@3.6.5@core-js/internals/is-array.js");
                var isObject = __webpack_require__( /*! ../internals/is-object */ "./node_modules/_core-js@3.6.5@core-js/internals/is-object.js");
                var toObject = __webpack_require__( /*! ../internals/to-object */ "./node_modules/_core-js@3.6.5@core-js/internals/to-object.js");
                var toLength = __webpack_require__( /*! ../internals/to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/to-length.js");
                var createProperty = __webpack_require__( /*! ../internals/create-property */ "./node_modules/_core-js@3.6.5@core-js/internals/create-property.js");
                var arraySpeciesCreate = __webpack_require__( /*! ../internals/array-species-create */ "./node_modules/_core-js@3.6.5@core-js/internals/array-species-create.js");
                var arrayMethodHasSpeciesSupport = __webpack_require__( /*! ../internals/array-method-has-species-support */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-has-species-support.js");
                var wellKnownSymbol = __webpack_require__( /*! ../internals/well-known-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js");
                var V8_VERSION = __webpack_require__( /*! ../internals/engine-v8-version */ "./node_modules/_core-js@3.6.5@core-js/internals/engine-v8-version.js");

                var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
                var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
                var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

                // We can't use this feature detection in V8 since it causes
                // deoptimization and serious performance degradation
                // https://github.com/zloirock/core-js/issues/679
                var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function() {
                    var array = [];
                    array[IS_CONCAT_SPREADABLE] = false;
                    return array.concat()[0] !== array;
                });

                var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

                var isConcatSpreadable = function(O) {
                    if (!isObject(O)) return false;
                    var spreadable = O[IS_CONCAT_SPREADABLE];
                    return spreadable !== undefined ? !!spreadable : isArray(O);
                };

                var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

                // `Array.prototype.concat` method
                // https://tc39.github.io/ecma262/#sec-array.prototype.concat
                // with adding support of @@isConcatSpreadable and @@species
                $({ target: 'Array', proto: true, forced: FORCED }, {
                    concat: function concat(arg) { // eslint-disable-line no-unused-vars
                        var O = toObject(this);
                        var A = arraySpeciesCreate(O, 0);
                        var n = 0;
                        var i, k, length, len, E;
                        for (i = -1, length = arguments.length; i < length; i++) {
                            E = i === -1 ? O : arguments[i];
                            if (isConcatSpreadable(E)) {
                                len = toLength(E.length);
                                if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                                for (k = 0; k < len; k++, n++)
                                    if (k in E) createProperty(A, n, E[k]);
                            } else {
                                if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                                createProperty(A, n++, E);
                            }
                        }
                        A.length = n;
                        return A;
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.array.filter.js":
            /*!************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.array.filter.js ***!
              \************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var $filter = __webpack_require__( /*! ../internals/array-iteration */ "./node_modules/_core-js@3.6.5@core-js/internals/array-iteration.js").filter;
                var arrayMethodHasSpeciesSupport = __webpack_require__( /*! ../internals/array-method-has-species-support */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-has-species-support.js");
                var arrayMethodUsesToLength = __webpack_require__( /*! ../internals/array-method-uses-to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-uses-to-length.js");

                var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
                // Edge 14- issue
                var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

                // `Array.prototype.filter` method
                // https://tc39.github.io/ecma262/#sec-array.prototype.filter
                // with adding support of @@species
                $({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
                    filter: function filter(callbackfn /* , thisArg */ ) {
                        return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.array.find.js":
            /*!**********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.array.find.js ***!
              \**********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var $find = __webpack_require__( /*! ../internals/array-iteration */ "./node_modules/_core-js@3.6.5@core-js/internals/array-iteration.js").find;
                var addToUnscopables = __webpack_require__( /*! ../internals/add-to-unscopables */ "./node_modules/_core-js@3.6.5@core-js/internals/add-to-unscopables.js");
                var arrayMethodUsesToLength = __webpack_require__( /*! ../internals/array-method-uses-to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-uses-to-length.js");

                var FIND = 'find';
                var SKIPS_HOLES = true;

                var USES_TO_LENGTH = arrayMethodUsesToLength(FIND);

                // Shouldn't skip holes
                if (FIND in []) Array(1)[FIND](function() { SKIPS_HOLES = false; });

                // `Array.prototype.find` method
                // https://tc39.github.io/ecma262/#sec-array.prototype.find
                $({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH }, {
                    find: function find(callbackfn /* , that = undefined */ ) {
                        return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
                    }
                });

                // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
                addToUnscopables(FIND);


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.array.for-each.js":
            /*!**************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.array.for-each.js ***!
              \**************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var forEach = __webpack_require__( /*! ../internals/array-for-each */ "./node_modules/_core-js@3.6.5@core-js/internals/array-for-each.js");

                // `Array.prototype.forEach` method
                // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
                $({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
                    forEach: forEach
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.array.includes.js":
            /*!**************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.array.includes.js ***!
              \**************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var $includes = __webpack_require__( /*! ../internals/array-includes */ "./node_modules/_core-js@3.6.5@core-js/internals/array-includes.js").includes;
                var addToUnscopables = __webpack_require__( /*! ../internals/add-to-unscopables */ "./node_modules/_core-js@3.6.5@core-js/internals/add-to-unscopables.js");
                var arrayMethodUsesToLength = __webpack_require__( /*! ../internals/array-method-uses-to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-uses-to-length.js");

                var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

                // `Array.prototype.includes` method
                // https://tc39.github.io/ecma262/#sec-array.prototype.includes
                $({ target: 'Array', proto: true, forced: !USES_TO_LENGTH }, {
                    includes: function includes(el /* , fromIndex = 0 */ ) {
                        return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
                    }
                });

                // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
                addToUnscopables('includes');


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.array.index-of.js":
            /*!**************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.array.index-of.js ***!
              \**************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var $indexOf = __webpack_require__( /*! ../internals/array-includes */ "./node_modules/_core-js@3.6.5@core-js/internals/array-includes.js").indexOf;
                var arrayMethodIsStrict = __webpack_require__( /*! ../internals/array-method-is-strict */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-is-strict.js");
                var arrayMethodUsesToLength = __webpack_require__( /*! ../internals/array-method-uses-to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-uses-to-length.js");

                var nativeIndexOf = [].indexOf;

                var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
                var STRICT_METHOD = arrayMethodIsStrict('indexOf');
                var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

                // `Array.prototype.indexOf` method
                // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
                $({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH }, {
                    indexOf: function indexOf(searchElement /* , fromIndex = 0 */ ) {
                        return NEGATIVE_ZERO
                            // convert -0 to +0
                            ?
                            nativeIndexOf.apply(this, arguments) || 0 :
                            $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.array.join.js":
            /*!**********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.array.join.js ***!
              \**********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var IndexedObject = __webpack_require__( /*! ../internals/indexed-object */ "./node_modules/_core-js@3.6.5@core-js/internals/indexed-object.js");
                var toIndexedObject = __webpack_require__( /*! ../internals/to-indexed-object */ "./node_modules/_core-js@3.6.5@core-js/internals/to-indexed-object.js");
                var arrayMethodIsStrict = __webpack_require__( /*! ../internals/array-method-is-strict */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-is-strict.js");

                var nativeJoin = [].join;

                var ES3_STRINGS = IndexedObject != Object;
                var STRICT_METHOD = arrayMethodIsStrict('join', ',');

                // `Array.prototype.join` method
                // https://tc39.github.io/ecma262/#sec-array.prototype.join
                $({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
                    join: function join(separator) {
                        return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.array.map.js":
            /*!*********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.array.map.js ***!
              \*********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var $map = __webpack_require__( /*! ../internals/array-iteration */ "./node_modules/_core-js@3.6.5@core-js/internals/array-iteration.js").map;
                var arrayMethodHasSpeciesSupport = __webpack_require__( /*! ../internals/array-method-has-species-support */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-has-species-support.js");
                var arrayMethodUsesToLength = __webpack_require__( /*! ../internals/array-method-uses-to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-uses-to-length.js");

                var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
                // FF49- issue
                var USES_TO_LENGTH = arrayMethodUsesToLength('map');

                // `Array.prototype.map` method
                // https://tc39.github.io/ecma262/#sec-array.prototype.map
                // with adding support of @@species
                $({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
                    map: function map(callbackfn /* , thisArg */ ) {
                        return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.array.slice.js":
            /*!***********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.array.slice.js ***!
              \***********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var isObject = __webpack_require__( /*! ../internals/is-object */ "./node_modules/_core-js@3.6.5@core-js/internals/is-object.js");
                var isArray = __webpack_require__( /*! ../internals/is-array */ "./node_modules/_core-js@3.6.5@core-js/internals/is-array.js");
                var toAbsoluteIndex = __webpack_require__( /*! ../internals/to-absolute-index */ "./node_modules/_core-js@3.6.5@core-js/internals/to-absolute-index.js");
                var toLength = __webpack_require__( /*! ../internals/to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/to-length.js");
                var toIndexedObject = __webpack_require__( /*! ../internals/to-indexed-object */ "./node_modules/_core-js@3.6.5@core-js/internals/to-indexed-object.js");
                var createProperty = __webpack_require__( /*! ../internals/create-property */ "./node_modules/_core-js@3.6.5@core-js/internals/create-property.js");
                var wellKnownSymbol = __webpack_require__( /*! ../internals/well-known-symbol */ "./node_modules/_core-js@3.6.5@core-js/internals/well-known-symbol.js");
                var arrayMethodHasSpeciesSupport = __webpack_require__( /*! ../internals/array-method-has-species-support */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-has-species-support.js");
                var arrayMethodUsesToLength = __webpack_require__( /*! ../internals/array-method-uses-to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-uses-to-length.js");

                var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
                var USES_TO_LENGTH = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

                var SPECIES = wellKnownSymbol('species');
                var nativeSlice = [].slice;
                var max = Math.max;

                // `Array.prototype.slice` method
                // https://tc39.github.io/ecma262/#sec-array.prototype.slice
                // fallback for not array-like ES3 strings and DOM objects
                $({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
                    slice: function slice(start, end) {
                        var O = toIndexedObject(this);
                        var length = toLength(O.length);
                        var k = toAbsoluteIndex(start, length);
                        var fin = toAbsoluteIndex(end === undefined ? length : end, length);
                        // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
                        var Constructor, result, n;
                        if (isArray(O)) {
                            Constructor = O.constructor;
                            // cross-realm fallback
                            if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
                                Constructor = undefined;
                            } else if (isObject(Constructor)) {
                                Constructor = Constructor[SPECIES];
                                if (Constructor === null) Constructor = undefined;
                            }
                            if (Constructor === Array || Constructor === undefined) {
                                return nativeSlice.call(O, k, fin);
                            }
                        }
                        result = new(Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
                        for (n = 0; k < fin; k++, n++)
                            if (k in O) createProperty(result, n, O[k]);
                        result.length = n;
                        return result;
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.array.sort.js":
            /*!**********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.array.sort.js ***!
              \**********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var aFunction = __webpack_require__( /*! ../internals/a-function */ "./node_modules/_core-js@3.6.5@core-js/internals/a-function.js");
                var toObject = __webpack_require__( /*! ../internals/to-object */ "./node_modules/_core-js@3.6.5@core-js/internals/to-object.js");
                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");
                var arrayMethodIsStrict = __webpack_require__( /*! ../internals/array-method-is-strict */ "./node_modules/_core-js@3.6.5@core-js/internals/array-method-is-strict.js");

                var test = [];
                var nativeSort = test.sort;

                // IE8-
                var FAILS_ON_UNDEFINED = fails(function() {
                    test.sort(undefined);
                });
                // V8 bug
                var FAILS_ON_NULL = fails(function() {
                    test.sort(null);
                });
                // Old WebKit
                var STRICT_METHOD = arrayMethodIsStrict('sort');

                var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD;

                // `Array.prototype.sort` method
                // https://tc39.github.io/ecma262/#sec-array.prototype.sort
                $({ target: 'Array', proto: true, forced: FORCED }, {
                    sort: function sort(comparefn) {
                        return comparefn === undefined ?
                            nativeSort.call(toObject(this)) :
                            nativeSort.call(toObject(this), aFunction(comparefn));
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.function.name.js":
            /*!*************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.function.name.js ***!
              \*************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var DESCRIPTORS = __webpack_require__( /*! ../internals/descriptors */ "./node_modules/_core-js@3.6.5@core-js/internals/descriptors.js");
                var defineProperty = __webpack_require__( /*! ../internals/object-define-property */ "./node_modules/_core-js@3.6.5@core-js/internals/object-define-property.js").f;

                var FunctionPrototype = Function.prototype;
                var FunctionPrototypeToString = FunctionPrototype.toString;
                var nameRE = /^\s*function ([^ (]*)/;
                var NAME = 'name';

                // Function instances `.name` property
                // https://tc39.github.io/ecma262/#sec-function-instances-name
                if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
                    defineProperty(FunctionPrototype, NAME, {
                        configurable: true,
                        get: function() {
                            try {
                                return FunctionPrototypeToString.call(this).match(nameRE)[1];
                            } catch (error) {
                                return '';
                            }
                        }
                    });
                }


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.number.constructor.js":
            /*!******************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.number.constructor.js ***!
              \******************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var DESCRIPTORS = __webpack_require__( /*! ../internals/descriptors */ "./node_modules/_core-js@3.6.5@core-js/internals/descriptors.js");
                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");
                var isForced = __webpack_require__( /*! ../internals/is-forced */ "./node_modules/_core-js@3.6.5@core-js/internals/is-forced.js");
                var redefine = __webpack_require__( /*! ../internals/redefine */ "./node_modules/_core-js@3.6.5@core-js/internals/redefine.js");
                var has = __webpack_require__( /*! ../internals/has */ "./node_modules/_core-js@3.6.5@core-js/internals/has.js");
                var classof = __webpack_require__( /*! ../internals/classof-raw */ "./node_modules/_core-js@3.6.5@core-js/internals/classof-raw.js");
                var inheritIfRequired = __webpack_require__( /*! ../internals/inherit-if-required */ "./node_modules/_core-js@3.6.5@core-js/internals/inherit-if-required.js");
                var toPrimitive = __webpack_require__( /*! ../internals/to-primitive */ "./node_modules/_core-js@3.6.5@core-js/internals/to-primitive.js");
                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");
                var create = __webpack_require__( /*! ../internals/object-create */ "./node_modules/_core-js@3.6.5@core-js/internals/object-create.js");
                var getOwnPropertyNames = __webpack_require__( /*! ../internals/object-get-own-property-names */ "./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-names.js").f;
                var getOwnPropertyDescriptor = __webpack_require__( /*! ../internals/object-get-own-property-descriptor */ "./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-descriptor.js").f;
                var defineProperty = __webpack_require__( /*! ../internals/object-define-property */ "./node_modules/_core-js@3.6.5@core-js/internals/object-define-property.js").f;
                var trim = __webpack_require__( /*! ../internals/string-trim */ "./node_modules/_core-js@3.6.5@core-js/internals/string-trim.js").trim;

                var NUMBER = 'Number';
                var NativeNumber = global[NUMBER];
                var NumberPrototype = NativeNumber.prototype;

                // Opera ~12 has broken Object#toString
                var BROKEN_CLASSOF = classof(create(NumberPrototype)) == NUMBER;

                // `ToNumber` abstract operation
                // https://tc39.github.io/ecma262/#sec-tonumber
                var toNumber = function(argument) {
                    var it = toPrimitive(argument, false);
                    var first, third, radix, maxCode, digits, length, index, code;
                    if (typeof it == 'string' && it.length > 2) {
                        it = trim(it);
                        first = it.charCodeAt(0);
                        if (first === 43 || first === 45) {
                            third = it.charCodeAt(2);
                            if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
                        } else if (first === 48) {
                            switch (it.charCodeAt(1)) {
                                case 66:
                                case 98:
                                    radix = 2;
                                    maxCode = 49;
                                    break; // fast equal of /^0b[01]+$/i
                                case 79:
                                case 111:
                                    radix = 8;
                                    maxCode = 55;
                                    break; // fast equal of /^0o[0-7]+$/i
                                default:
                                    return +it;
                            }
                            digits = it.slice(2);
                            length = digits.length;
                            for (index = 0; index < length; index++) {
                                code = digits.charCodeAt(index);
                                // parseInt parses a string to a first unavailable symbol
                                // but ToNumber should return NaN if a string contains unavailable symbols
                                if (code < 48 || code > maxCode) return NaN;
                            }
                            return parseInt(digits, radix);
                        }
                    }
                    return +it;
                };

                // `Number` constructor
                // https://tc39.github.io/ecma262/#sec-number-constructor
                if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
                    var NumberWrapper = function Number(value) {
                        var it = arguments.length < 1 ? 0 : value;
                        var dummy = this;
                        return dummy instanceof NumberWrapper
                            // check on 1..constructor(foo) case
                            &&
                            (BROKEN_CLASSOF ? fails(function() { NumberPrototype.valueOf.call(dummy); }) : classof(dummy) != NUMBER) ?
                            inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
                    };
                    for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : (
                            // ES3:
                            'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
                            // ES2015 (in case, if modules with ES2015 Number statics required before):
                            'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
                            'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
                        ).split(','), j = 0, key; keys.length > j; j++) {
                        if (has(NativeNumber, key = keys[j]) && !has(NumberWrapper, key)) {
                            defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
                        }
                    }
                    NumberWrapper.prototype = NumberPrototype;
                    NumberPrototype.constructor = NumberWrapper;
                    redefine(global, NUMBER, NumberWrapper);
                }


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.number.to-fixed.js":
            /*!***************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.number.to-fixed.js ***!
              \***************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var toInteger = __webpack_require__( /*! ../internals/to-integer */ "./node_modules/_core-js@3.6.5@core-js/internals/to-integer.js");
                var thisNumberValue = __webpack_require__( /*! ../internals/this-number-value */ "./node_modules/_core-js@3.6.5@core-js/internals/this-number-value.js");
                var repeat = __webpack_require__( /*! ../internals/string-repeat */ "./node_modules/_core-js@3.6.5@core-js/internals/string-repeat.js");
                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");

                var nativeToFixed = 1.0.toFixed;
                var floor = Math.floor;

                var pow = function(x, n, acc) {
                    return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
                };

                var log = function(x) {
                    var n = 0;
                    var x2 = x;
                    while (x2 >= 4096) {
                        n += 12;
                        x2 /= 4096;
                    }
                    while (x2 >= 2) {
                        n += 1;
                        x2 /= 2;
                    }
                    return n;
                };

                var FORCED = nativeToFixed && (
                    0.00008.toFixed(3) !== '0.000' ||
                    0.9.toFixed(0) !== '1' ||
                    1.255.toFixed(2) !== '1.25' ||
                    1000000000000000128.0.toFixed(0) !== '1000000000000000128'
                ) || !fails(function() {
                    // V8 ~ Android 4.3-
                    nativeToFixed.call({});
                });

                // `Number.prototype.toFixed` method
                // https://tc39.github.io/ecma262/#sec-number.prototype.tofixed
                $({ target: 'Number', proto: true, forced: FORCED }, {
                    // eslint-disable-next-line max-statements
                    toFixed: function toFixed(fractionDigits) {
                        var number = thisNumberValue(this);
                        var fractDigits = toInteger(fractionDigits);
                        var data = [0, 0, 0, 0, 0, 0];
                        var sign = '';
                        var result = '0';
                        var e, z, j, k;

                        var multiply = function(n, c) {
                            var index = -1;
                            var c2 = c;
                            while (++index < 6) {
                                c2 += n * data[index];
                                data[index] = c2 % 1e7;
                                c2 = floor(c2 / 1e7);
                            }
                        };

                        var divide = function(n) {
                            var index = 6;
                            var c = 0;
                            while (--index >= 0) {
                                c += data[index];
                                data[index] = floor(c / n);
                                c = (c % n) * 1e7;
                            }
                        };

                        var dataToString = function() {
                            var index = 6;
                            var s = '';
                            while (--index >= 0) {
                                if (s !== '' || index === 0 || data[index] !== 0) {
                                    var t = String(data[index]);
                                    s = s === '' ? t : s + repeat.call('0', 7 - t.length) + t;
                                }
                            }
                            return s;
                        };

                        if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
                        // eslint-disable-next-line no-self-compare
                        if (number != number) return 'NaN';
                        if (number <= -1e21 || number >= 1e21) return String(number);
                        if (number < 0) {
                            sign = '-';
                            number = -number;
                        }
                        if (number > 1e-21) {
                            e = log(number * pow(2, 69, 1)) - 69;
                            z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
                            z *= 0x10000000000000;
                            e = 52 - e;
                            if (e > 0) {
                                multiply(0, z);
                                j = fractDigits;
                                while (j >= 7) {
                                    multiply(1e7, 0);
                                    j -= 7;
                                }
                                multiply(pow(10, j, 1), 0);
                                j = e - 1;
                                while (j >= 23) {
                                    divide(1 << 23);
                                    j -= 23;
                                }
                                divide(1 << j);
                                multiply(1, 1);
                                divide(2);
                                result = dataToString();
                            } else {
                                multiply(0, z);
                                multiply(1 << -e, 0);
                                result = dataToString() + repeat.call('0', fractDigits);
                            }
                        }
                        if (fractDigits > 0) {
                            k = result.length;
                            result = sign + (k <= fractDigits ?
                                '0.' + repeat.call('0', fractDigits - k) + result :
                                result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
                        } else {
                            result = sign + result;
                        }
                        return result;
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js":
            /*!***********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js ***!
              \***********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var toObject = __webpack_require__( /*! ../internals/to-object */ "./node_modules/_core-js@3.6.5@core-js/internals/to-object.js");
                var nativeKeys = __webpack_require__( /*! ../internals/object-keys */ "./node_modules/_core-js@3.6.5@core-js/internals/object-keys.js");
                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");

                var FAILS_ON_PRIMITIVES = fails(function() { nativeKeys(1); });

                // `Object.keys` method
                // https://tc39.github.io/ecma262/#sec-object.keys
                $({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
                    keys: function keys(it) {
                        return nativeKeys(toObject(it));
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.object.to-string.js":
            /*!****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.object.to-string.js ***!
              \****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var TO_STRING_TAG_SUPPORT = __webpack_require__( /*! ../internals/to-string-tag-support */ "./node_modules/_core-js@3.6.5@core-js/internals/to-string-tag-support.js");
                var redefine = __webpack_require__( /*! ../internals/redefine */ "./node_modules/_core-js@3.6.5@core-js/internals/redefine.js");
                var toString = __webpack_require__( /*! ../internals/object-to-string */ "./node_modules/_core-js@3.6.5@core-js/internals/object-to-string.js");

                // `Object.prototype.toString` method
                // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
                if (!TO_STRING_TAG_SUPPORT) {
                    redefine(Object.prototype, 'toString', toString, { unsafe: true });
                }


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.exec.js":
            /*!***********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.exec.js ***!
              \***********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var exec = __webpack_require__( /*! ../internals/regexp-exec */ "./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec.js");

                $({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
                    exec: exec
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.to-string.js":
            /*!****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.to-string.js ***!
              \****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var redefine = __webpack_require__( /*! ../internals/redefine */ "./node_modules/_core-js@3.6.5@core-js/internals/redefine.js");
                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");
                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");
                var flags = __webpack_require__( /*! ../internals/regexp-flags */ "./node_modules/_core-js@3.6.5@core-js/internals/regexp-flags.js");

                var TO_STRING = 'toString';
                var RegExpPrototype = RegExp.prototype;
                var nativeToString = RegExpPrototype[TO_STRING];

                var NOT_GENERIC = fails(function() { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
                // FF44- RegExp#toString has a wrong name
                var INCORRECT_NAME = nativeToString.name != TO_STRING;

                // `RegExp.prototype.toString` method
                // https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
                if (NOT_GENERIC || INCORRECT_NAME) {
                    redefine(RegExp.prototype, TO_STRING, function toString() {
                        var R = anObject(this);
                        var p = String(R.source);
                        var rf = R.flags;
                        var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
                        return '/' + p + '/' + f;
                    }, { unsafe: true });
                }


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.string.ends-with.js":
            /*!****************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.string.ends-with.js ***!
              \****************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var getOwnPropertyDescriptor = __webpack_require__( /*! ../internals/object-get-own-property-descriptor */ "./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-descriptor.js").f;
                var toLength = __webpack_require__( /*! ../internals/to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/to-length.js");
                var notARegExp = __webpack_require__( /*! ../internals/not-a-regexp */ "./node_modules/_core-js@3.6.5@core-js/internals/not-a-regexp.js");
                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");
                var correctIsRegExpLogic = __webpack_require__( /*! ../internals/correct-is-regexp-logic */ "./node_modules/_core-js@3.6.5@core-js/internals/correct-is-regexp-logic.js");
                var IS_PURE = __webpack_require__( /*! ../internals/is-pure */ "./node_modules/_core-js@3.6.5@core-js/internals/is-pure.js");

                var nativeEndsWith = ''.endsWith;
                var min = Math.min;

                var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('endsWith');
                // https://github.com/zloirock/core-js/pull/702
                var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !! function() {
                    var descriptor = getOwnPropertyDescriptor(String.prototype, 'endsWith');
                    return descriptor && !descriptor.writable;
                }();

                // `String.prototype.endsWith` method
                // https://tc39.github.io/ecma262/#sec-string.prototype.endswith
                $({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
                    endsWith: function endsWith(searchString /* , endPosition = @length */ ) {
                        var that = String(requireObjectCoercible(this));
                        notARegExp(searchString);
                        var endPosition = arguments.length > 1 ? arguments[1] : undefined;
                        var len = toLength(that.length);
                        var end = endPosition === undefined ? len : min(toLength(endPosition), len);
                        var search = String(searchString);
                        return nativeEndsWith ?
                            nativeEndsWith.call(that, search, end) :
                            that.slice(end - search.length, end) === search;
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.string.includes.js":
            /*!***************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.string.includes.js ***!
              \***************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var notARegExp = __webpack_require__( /*! ../internals/not-a-regexp */ "./node_modules/_core-js@3.6.5@core-js/internals/not-a-regexp.js");
                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");
                var correctIsRegExpLogic = __webpack_require__( /*! ../internals/correct-is-regexp-logic */ "./node_modules/_core-js@3.6.5@core-js/internals/correct-is-regexp-logic.js");

                // `String.prototype.includes` method
                // https://tc39.github.io/ecma262/#sec-string.prototype.includes
                $({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
                    includes: function includes(searchString /* , position = 0 */ ) {
                        return !!~String(requireObjectCoercible(this))
                            .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.string.match.js":
            /*!************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.string.match.js ***!
              \************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var fixRegExpWellKnownSymbolLogic = __webpack_require__( /*! ../internals/fix-regexp-well-known-symbol-logic */ "./node_modules/_core-js@3.6.5@core-js/internals/fix-regexp-well-known-symbol-logic.js");
                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");
                var toLength = __webpack_require__( /*! ../internals/to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/to-length.js");
                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");
                var advanceStringIndex = __webpack_require__( /*! ../internals/advance-string-index */ "./node_modules/_core-js@3.6.5@core-js/internals/advance-string-index.js");
                var regExpExec = __webpack_require__( /*! ../internals/regexp-exec-abstract */ "./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec-abstract.js");

                // @@match logic
                fixRegExpWellKnownSymbolLogic('match', 1, function(MATCH, nativeMatch, maybeCallNative) {
                    return [
                        // `String.prototype.match` method
                        // https://tc39.github.io/ecma262/#sec-string.prototype.match
                        function match(regexp) {
                            var O = requireObjectCoercible(this);
                            var matcher = regexp == undefined ? undefined : regexp[MATCH];
                            return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
                        },
                        // `RegExp.prototype[@@match]` method
                        // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
                        function(regexp) {
                            var res = maybeCallNative(nativeMatch, regexp, this);
                            if (res.done) return res.value;

                            var rx = anObject(regexp);
                            var S = String(this);

                            if (!rx.global) return regExpExec(rx, S);

                            var fullUnicode = rx.unicode;
                            rx.lastIndex = 0;
                            var A = [];
                            var n = 0;
                            var result;
                            while ((result = regExpExec(rx, S)) !== null) {
                                var matchStr = String(result[0]);
                                A[n] = matchStr;
                                if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                                n++;
                            }
                            return n === 0 ? null : A;
                        }
                    ];
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.string.replace.js":
            /*!**************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.string.replace.js ***!
              \**************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var fixRegExpWellKnownSymbolLogic = __webpack_require__( /*! ../internals/fix-regexp-well-known-symbol-logic */ "./node_modules/_core-js@3.6.5@core-js/internals/fix-regexp-well-known-symbol-logic.js");
                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");
                var toObject = __webpack_require__( /*! ../internals/to-object */ "./node_modules/_core-js@3.6.5@core-js/internals/to-object.js");
                var toLength = __webpack_require__( /*! ../internals/to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/to-length.js");
                var toInteger = __webpack_require__( /*! ../internals/to-integer */ "./node_modules/_core-js@3.6.5@core-js/internals/to-integer.js");
                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");
                var advanceStringIndex = __webpack_require__( /*! ../internals/advance-string-index */ "./node_modules/_core-js@3.6.5@core-js/internals/advance-string-index.js");
                var regExpExec = __webpack_require__( /*! ../internals/regexp-exec-abstract */ "./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec-abstract.js");

                var max = Math.max;
                var min = Math.min;
                var floor = Math.floor;
                var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
                var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

                var maybeToString = function(it) {
                    return it === undefined ? it : String(it);
                };

                // @@replace logic
                fixRegExpWellKnownSymbolLogic('replace', 2, function(REPLACE, nativeReplace, maybeCallNative, reason) {
                    var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
                    var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
                    var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

                    return [
                        // `String.prototype.replace` method
                        // https://tc39.github.io/ecma262/#sec-string.prototype.replace
                        function replace(searchValue, replaceValue) {
                            var O = requireObjectCoercible(this);
                            var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
                            return replacer !== undefined ?
                                replacer.call(searchValue, O, replaceValue) :
                                nativeReplace.call(String(O), searchValue, replaceValue);
                        },
                        // `RegExp.prototype[@@replace]` method
                        // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
                        function(regexp, replaceValue) {
                            if (
                                (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
                                (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
                            ) {
                                var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
                                if (res.done) return res.value;
                            }

                            var rx = anObject(regexp);
                            var S = String(this);

                            var functionalReplace = typeof replaceValue === 'function';
                            if (!functionalReplace) replaceValue = String(replaceValue);

                            var global = rx.global;
                            if (global) {
                                var fullUnicode = rx.unicode;
                                rx.lastIndex = 0;
                            }
                            var results = [];
                            while (true) {
                                var result = regExpExec(rx, S);
                                if (result === null) break;

                                results.push(result);
                                if (!global) break;

                                var matchStr = String(result[0]);
                                if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                            }

                            var accumulatedResult = '';
                            var nextSourcePosition = 0;
                            for (var i = 0; i < results.length; i++) {
                                result = results[i];

                                var matched = String(result[0]);
                                var position = max(min(toInteger(result.index), S.length), 0);
                                var captures = [];
                                // NOTE: This is equivalent to
                                //   captures = result.slice(1).map(maybeToString)
                                // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
                                // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
                                // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
                                for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
                                var namedCaptures = result.groups;
                                if (functionalReplace) {
                                    var replacerArgs = [matched].concat(captures, position, S);
                                    if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
                                    var replacement = String(replaceValue.apply(undefined, replacerArgs));
                                } else {
                                    replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
                                }
                                if (position >= nextSourcePosition) {
                                    accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
                                    nextSourcePosition = position + matched.length;
                                }
                            }
                            return accumulatedResult + S.slice(nextSourcePosition);
                        }
                    ];

                    // https://tc39.github.io/ecma262/#sec-getsubstitution
                    function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
                        var tailPos = position + matched.length;
                        var m = captures.length;
                        var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
                        if (namedCaptures !== undefined) {
                            namedCaptures = toObject(namedCaptures);
                            symbols = SUBSTITUTION_SYMBOLS;
                        }
                        return nativeReplace.call(replacement, symbols, function(match, ch) {
                            var capture;
                            switch (ch.charAt(0)) {
                                case '$':
                                    return '$';
                                case '&':
                                    return matched;
                                case '`':
                                    return str.slice(0, position);
                                case "'":
                                    return str.slice(tailPos);
                                case '<':
                                    capture = namedCaptures[ch.slice(1, -1)];
                                    break;
                                default: // \d\d?
                                    var n = +ch;
                                    if (n === 0) return match;
                                    if (n > m) {
                                        var f = floor(n / 10);
                                        if (f === 0) return match;
                                        if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
                                        return match;
                                    }
                                    capture = captures[n - 1];
                            }
                            return capture === undefined ? '' : capture;
                        });
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.string.search.js":
            /*!*************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.string.search.js ***!
              \*************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var fixRegExpWellKnownSymbolLogic = __webpack_require__( /*! ../internals/fix-regexp-well-known-symbol-logic */ "./node_modules/_core-js@3.6.5@core-js/internals/fix-regexp-well-known-symbol-logic.js");
                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");
                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");
                var sameValue = __webpack_require__( /*! ../internals/same-value */ "./node_modules/_core-js@3.6.5@core-js/internals/same-value.js");
                var regExpExec = __webpack_require__( /*! ../internals/regexp-exec-abstract */ "./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec-abstract.js");

                // @@search logic
                fixRegExpWellKnownSymbolLogic('search', 1, function(SEARCH, nativeSearch, maybeCallNative) {
                    return [
                        // `String.prototype.search` method
                        // https://tc39.github.io/ecma262/#sec-string.prototype.search
                        function search(regexp) {
                            var O = requireObjectCoercible(this);
                            var searcher = regexp == undefined ? undefined : regexp[SEARCH];
                            return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
                        },
                        // `RegExp.prototype[@@search]` method
                        // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
                        function(regexp) {
                            var res = maybeCallNative(nativeSearch, regexp, this);
                            if (res.done) return res.value;

                            var rx = anObject(regexp);
                            var S = String(this);

                            var previousLastIndex = rx.lastIndex;
                            if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
                            var result = regExpExec(rx, S);
                            if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
                            return result === null ? -1 : result.index;
                        }
                    ];
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.string.split.js":
            /*!************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.string.split.js ***!
              \************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var fixRegExpWellKnownSymbolLogic = __webpack_require__( /*! ../internals/fix-regexp-well-known-symbol-logic */ "./node_modules/_core-js@3.6.5@core-js/internals/fix-regexp-well-known-symbol-logic.js");
                var isRegExp = __webpack_require__( /*! ../internals/is-regexp */ "./node_modules/_core-js@3.6.5@core-js/internals/is-regexp.js");
                var anObject = __webpack_require__( /*! ../internals/an-object */ "./node_modules/_core-js@3.6.5@core-js/internals/an-object.js");
                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");
                var speciesConstructor = __webpack_require__( /*! ../internals/species-constructor */ "./node_modules/_core-js@3.6.5@core-js/internals/species-constructor.js");
                var advanceStringIndex = __webpack_require__( /*! ../internals/advance-string-index */ "./node_modules/_core-js@3.6.5@core-js/internals/advance-string-index.js");
                var toLength = __webpack_require__( /*! ../internals/to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/to-length.js");
                var callRegExpExec = __webpack_require__( /*! ../internals/regexp-exec-abstract */ "./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec-abstract.js");
                var regexpExec = __webpack_require__( /*! ../internals/regexp-exec */ "./node_modules/_core-js@3.6.5@core-js/internals/regexp-exec.js");
                var fails = __webpack_require__( /*! ../internals/fails */ "./node_modules/_core-js@3.6.5@core-js/internals/fails.js");

                var arrayPush = [].push;
                var min = Math.min;
                var MAX_UINT32 = 0xFFFFFFFF;

                // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
                var SUPPORTS_Y = !fails(function() { return !RegExp(MAX_UINT32, 'y'); });

                // @@split logic
                fixRegExpWellKnownSymbolLogic('split', 2, function(SPLIT, nativeSplit, maybeCallNative) {
                    var internalSplit;
                    if (
                        'abbc'.split(/(b)*/)[1] == 'c' ||
                        'test'.split(/(?:)/, -1).length != 4 ||
                        'ab'.split(/(?:ab)*/).length != 2 ||
                        '.'.split(/(.?)(.?)/).length != 4 ||
                        '.'.split(/()()/).length > 1 ||
                        ''.split(/.?/).length
                    ) {
                        // based on es5-shim implementation, need to rework it
                        internalSplit = function(separator, limit) {
                            var string = String(requireObjectCoercible(this));
                            var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
                            if (lim === 0) return [];
                            if (separator === undefined) return [string];
                            // If `separator` is not a regex, use native split
                            if (!isRegExp(separator)) {
                                return nativeSplit.call(string, separator, lim);
                            }
                            var output = [];
                            var flags = (separator.ignoreCase ? 'i' : '') +
                                (separator.multiline ? 'm' : '') +
                                (separator.unicode ? 'u' : '') +
                                (separator.sticky ? 'y' : '');
                            var lastLastIndex = 0;
                            // Make `global` and avoid `lastIndex` issues by working with a copy
                            var separatorCopy = new RegExp(separator.source, flags + 'g');
                            var match, lastIndex, lastLength;
                            while (match = regexpExec.call(separatorCopy, string)) {
                                lastIndex = separatorCopy.lastIndex;
                                if (lastIndex > lastLastIndex) {
                                    output.push(string.slice(lastLastIndex, match.index));
                                    if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
                                    lastLength = match[0].length;
                                    lastLastIndex = lastIndex;
                                    if (output.length >= lim) break;
                                }
                                if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
                            }
                            if (lastLastIndex === string.length) {
                                if (lastLength || !separatorCopy.test('')) output.push('');
                            } else output.push(string.slice(lastLastIndex));
                            return output.length > lim ? output.slice(0, lim) : output;
                        };
                        // Chakra, V8
                    } else if ('0'.split(undefined, 0).length) {
                        internalSplit = function(separator, limit) {
                            return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
                        };
                    } else internalSplit = nativeSplit;

                    return [
                        // `String.prototype.split` method
                        // https://tc39.github.io/ecma262/#sec-string.prototype.split
                        function split(separator, limit) {
                            var O = requireObjectCoercible(this);
                            var splitter = separator == undefined ? undefined : separator[SPLIT];
                            return splitter !== undefined ?
                                splitter.call(separator, O, limit) :
                                internalSplit.call(String(O), separator, limit);
                        },
                        // `RegExp.prototype[@@split]` method
                        // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
                        //
                        // NOTE: This cannot be properly polyfilled in engines that don't support
                        // the 'y' flag.
                        function(regexp, limit) {
                            var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
                            if (res.done) return res.value;

                            var rx = anObject(regexp);
                            var S = String(this);
                            var C = speciesConstructor(rx, RegExp);

                            var unicodeMatching = rx.unicode;
                            var flags = (rx.ignoreCase ? 'i' : '') +
                                (rx.multiline ? 'm' : '') +
                                (rx.unicode ? 'u' : '') +
                                (SUPPORTS_Y ? 'y' : 'g');

                            // ^(? + rx + ) is needed, in combination with some S slicing, to
                            // simulate the 'y' flag.
                            var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
                            var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
                            if (lim === 0) return [];
                            if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
                            var p = 0;
                            var q = 0;
                            var A = [];
                            while (q < S.length) {
                                splitter.lastIndex = SUPPORTS_Y ? q : 0;
                                var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
                                var e;
                                if (
                                    z === null ||
                                    (e = min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
                                ) {
                                    q = advanceStringIndex(S, q, unicodeMatching);
                                } else {
                                    A.push(S.slice(p, q));
                                    if (A.length === lim) return A;
                                    for (var i = 1; i <= z.length - 1; i++) {
                                        A.push(z[i]);
                                        if (A.length === lim) return A;
                                    }
                                    q = p = e;
                                }
                            }
                            A.push(S.slice(p));
                            return A;
                        }
                    ];
                }, !SUPPORTS_Y);


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.string.starts-with.js":
            /*!******************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.string.starts-with.js ***!
              \******************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var getOwnPropertyDescriptor = __webpack_require__( /*! ../internals/object-get-own-property-descriptor */ "./node_modules/_core-js@3.6.5@core-js/internals/object-get-own-property-descriptor.js").f;
                var toLength = __webpack_require__( /*! ../internals/to-length */ "./node_modules/_core-js@3.6.5@core-js/internals/to-length.js");
                var notARegExp = __webpack_require__( /*! ../internals/not-a-regexp */ "./node_modules/_core-js@3.6.5@core-js/internals/not-a-regexp.js");
                var requireObjectCoercible = __webpack_require__( /*! ../internals/require-object-coercible */ "./node_modules/_core-js@3.6.5@core-js/internals/require-object-coercible.js");
                var correctIsRegExpLogic = __webpack_require__( /*! ../internals/correct-is-regexp-logic */ "./node_modules/_core-js@3.6.5@core-js/internals/correct-is-regexp-logic.js");
                var IS_PURE = __webpack_require__( /*! ../internals/is-pure */ "./node_modules/_core-js@3.6.5@core-js/internals/is-pure.js");

                var nativeStartsWith = ''.startsWith;
                var min = Math.min;

                var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
                // https://github.com/zloirock/core-js/pull/702
                var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !! function() {
                    var descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith');
                    return descriptor && !descriptor.writable;
                }();

                // `String.prototype.startsWith` method
                // https://tc39.github.io/ecma262/#sec-string.prototype.startswith
                $({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
                    startsWith: function startsWith(searchString /* , position = 0 */ ) {
                        var that = String(requireObjectCoercible(this));
                        notARegExp(searchString);
                        var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
                        var search = String(searchString);
                        return nativeStartsWith ?
                            nativeStartsWith.call(that, search, index) :
                            that.slice(index, index + search.length) === search;
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/es.string.trim.js":
            /*!***********************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/es.string.trim.js ***!
              \***********************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                "use strict";

                var $ = __webpack_require__( /*! ../internals/export */ "./node_modules/_core-js@3.6.5@core-js/internals/export.js");
                var $trim = __webpack_require__( /*! ../internals/string-trim */ "./node_modules/_core-js@3.6.5@core-js/internals/string-trim.js").trim;
                var forcedStringTrimMethod = __webpack_require__( /*! ../internals/string-trim-forced */ "./node_modules/_core-js@3.6.5@core-js/internals/string-trim-forced.js");

                // `String.prototype.trim` method
                // https://tc39.github.io/ecma262/#sec-string.prototype.trim
                $({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
                    trim: function trim() {
                        return $trim(this);
                    }
                });


                /***/
            }),

            /***/
            "./node_modules/_core-js@3.6.5@core-js/modules/web.dom-collections.for-each.js":
            /*!*************************************************************************************!*\
              !*** ./node_modules/_core-js@3.6.5@core-js/modules/web.dom-collections.for-each.js ***!
              \*************************************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                var global = __webpack_require__( /*! ../internals/global */ "./node_modules/_core-js@3.6.5@core-js/internals/global.js");
                var DOMIterables = __webpack_require__( /*! ../internals/dom-iterables */ "./node_modules/_core-js@3.6.5@core-js/internals/dom-iterables.js");
                var forEach = __webpack_require__( /*! ../internals/array-for-each */ "./node_modules/_core-js@3.6.5@core-js/internals/array-for-each.js");
                var createNonEnumerableProperty = __webpack_require__( /*! ../internals/create-non-enumerable-property */ "./node_modules/_core-js@3.6.5@core-js/internals/create-non-enumerable-property.js");

                for (var COLLECTION_NAME in DOMIterables) {
                    var Collection = global[COLLECTION_NAME];
                    var CollectionPrototype = Collection && Collection.prototype;
                    // some Chrome versions have non-configurable methods on DOMTokenList
                    if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
                        createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
                    } catch (error) {
                        CollectionPrototype.forEach = forEach;
                    }
                }


                /***/
            }),

            /***/
            "./node_modules/_webpack@4.44.2@webpack/buildin/global.js":
            /*!***********************************!*\
              !*** (webpack)/buildin/global.js ***!
              \***********************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                var g;

                // This works in non-strict mode
                g = (function() {
                    return this;
                })();

                try {
                    // This works if eval is allowed (see CSP)
                    g = g || new Function("return this")();
                } catch (e) {
                    // This works if the window reference is available
                    if (typeof window === "object") g = window;
                }

                // g can still be undefined, but nothing to do about it...
                // We return undefined, instead of nothing here, so it's
                // easier to handle this case. if(!global) { ...}

                module.exports = g;


                /***/
            }),

            /***/
            "./public/json/oldserver/BaseDataService.js":
            /*!**************************************************!*\
              !*** ./public/json/oldserver/BaseDataService.js ***!
              \**************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.slice */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.slice.js");

                __webpack_require__( /*! core-js/modules/es.number.constructor */ "./node_modules/_core-js@3.6.5@core-js/modules/es.number.constructor.js");

                (function(window) {
                    var Service = function Service(opts) {
                        var options = {
                            //资源类型
                            resourceKeys: ['portwharf', //港口码头
                                'bas_school', //学校
                                'hospital', //医院
                                'culturalrelicunit', //文物保护单位
                                'Hotel※00', 'hotel', //宾馆
                                'airport', //机场
                                'railwaystation', //火车站
                                'coachstation', //汽车站
                                'government※00', 'government', //政府机关
                                'archives', //档案馆
                                'Newscast※00', 'tvcast', //电视台
                                'newscast', //广播电台
                                'Resins※00', 'researchinstitution', //国防科研
                                'Resins※02', //科研单位
                                'financialins', //银行金融机构
                                'market', //大型商贸
                                'bazaar', //集贸市场
                                'Gymnasium', //大型文化体育场所
                                'tourist', //旅游景区
                                'culturalvenues', //文化场馆
                                'gasfacil', //大型能源动力设施
                                'powerfacil', //燃气供应设施
                                'supwatfacil', //供水设施
                                'Powerfacilities※00', 'powerfacilities', //供电设施
                                'Communication※01', //通讯社
                                'sluice', //水闸
                                'ocepasture', //海阳牧场
                                'farm', 'gasstation', 'monitorstation' //地震监测站台
                            ]
                        };
                        this.opts = jQuery.extend(true, options, opts); // this.commonService = window.EMapServerV2.CommonService.getInstance(opts);

                        this.commonService = new window.EMapServerV2.CommonService(opts);
                    };
                    /**
                     *
                     * @param opts.resourceKeys
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getStatistics = function(opts, callback, ctx) {
                        //去掉最后一类地质隐患点
                        var resourceKeys = opts.resourceKeys || this.opts.resourceKeys.slice(0);
                        this.commonService.getStatistics(resourceKeys, {}, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };
                    /**
                     * 按条件统计
                     * @param opts
                     * @param opts.districtCode
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getStatisticsByFilter = function(opts, callback, ctx) {
                        var filter = {};
                        opts = opts || {};
                        filter.districtCode = opts.districtCode;
                        this.commonService.getStatistics(this.opts.resourceKeys, filter, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };
                    /**
                     * 查询列表数据
                     * @param opts
                     * @param opts.resourceKey，多个逗号分隔
                     * @param opts.pageSize
                     * @param opts.pageIndex
                     * @param opts.districtCode
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getDataList = function(opts, callback, ctx) {
                        opts = opts || {};
                        opts.flatTag = true;
                        this.commonService.getDataList(opts, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };

                    Service.prototype.getNearbyList = function(opts, callback, ctx) {
                        opts = opts || {};
                        opts.flatTag = true;
                        opts.resourceKeys = this.opts.resourceKeys;
                        var radius = opts.config["ANJIAN_DAGCHEMENT※DangerousChemical"].radius;
                        this.commonService.getEventData(opts.eventType, function(err, data) {
                            var config = opts.config || {}; //读取默认距离配置、传参的距离

                            var configRadius = data.tag.SEARCH_DIST;

                            if (configRadius != null && configRadius != '' && !isNaN(configRadius)) {
                                configRadius = parseFloat(configRadius) * 1000;
                            } else {
                                configRadius = 1000 * 1000;
                            }

                            for (var i = 0; i < this.opts.resourceKeys.length; i++) {
                                var resourceKey = this.opts.resourceKeys[i];

                                if (config.hasOwnProperty(resourceKey)) {
                                    if (!config[resourceKey].radius) {
                                        config[resourceKey].radius = configRadius;
                                    }
                                } else {
                                    config[resourceKey] = {
                                        radius: configRadius
                                    };
                                }
                            }

                            this.commonService.getNearbyList(opts, function(err, resultSet) {
                                var list = resultSet.list;
                                resultSet.radius = list[0] ? list[0].radius : radius; //危化企业根据产量分类

                                for (var i = 0; i < list.length; i++) {
                                    var item = list[i];

                                    if (item && item.codeKey === this.opts.resourceKeys[0]) {
                                        var itemList = item.data;
                                        var rangeMap = {
                                            '1000': {
                                                range: [1000, Number.MAX_VALUE],
                                                list: []
                                            },
                                            '100': {
                                                range: [100, 1000],
                                                list: []
                                            },
                                            '0': {
                                                range: [0, 100],
                                                list: []
                                            }
                                        };
                                        var itemCount = itemList.length;

                                        for (var j = 0; j < itemCount; j++) {
                                            var rowObj = itemList[j],
                                                sumCount = rowObj.SUMOUTPUT;

                                            for (var rangeKey in rangeMap) {
                                                var rangeObj = rangeMap[rangeKey],
                                                    rangeArr = rangeObj.range;

                                                if (sumCount >= rangeArr[0] && sumCount < rangeArr[1]) {
                                                    rangeObj.list.push(rowObj);
                                                    break;
                                                }
                                            }
                                        }

                                        var newData = {};

                                        for (var k in rangeMap) {
                                            newData[k] = rangeMap[k].list;
                                        }

                                        item.data = newData;
                                    }
                                }

                                callback.call(ctx, null, resultSet);
                            }, this);
                        }, this);
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.BaseDataService = Service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/CommonService.js":
            /*!************************************************!*\
              !*** ./public/json/oldserver/CommonService.js ***!
              \************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.filter */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.filter.js");

                __webpack_require__( /*! core-js/modules/es.array.for-each */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.for-each.js");

                __webpack_require__( /*! core-js/modules/es.array.includes */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.includes.js");

                __webpack_require__( /*! core-js/modules/es.array.index-of */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.index-of.js");

                __webpack_require__( /*! core-js/modules/es.array.join */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.join.js");

                __webpack_require__( /*! core-js/modules/es.array.sort */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.sort.js");

                __webpack_require__( /*! core-js/modules/es.object.keys */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js");

                __webpack_require__( /*! core-js/modules/es.object.to-string */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.to-string.js");

                __webpack_require__( /*! core-js/modules/es.regexp.exec */ "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.exec.js");

                __webpack_require__( /*! core-js/modules/es.regexp.to-string */ "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.to-string.js");

                __webpack_require__( /*! core-js/modules/es.string.includes */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.includes.js");

                __webpack_require__( /*! core-js/modules/es.string.replace */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.replace.js");

                __webpack_require__( /*! core-js/modules/es.string.split */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.split.js");

                __webpack_require__( /*! core-js/modules/web.dom-collections.for-each */ "./node_modules/_core-js@3.6.5@core-js/modules/web.dom-collections.for-each.js");

                (function(window) {
                    /**
                     *
                     * @param opts
                     * @constructor
                     */
                    var Service = function Service(opts) {
                        this.opts = {
                            configUrl: './json/oldserver/nearby.json',
                            serverUrl: EMAP_CONFIG.common.mongoService
                        }; //

                        this._resourceTemp = null; //

                        this._configTemp = null; //

                        this.seperator = '※'; //事件类型

                        this.eventTypeList = null;
                    };
                    /**
                     * 获取资源类型
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getResources = function(callback, ctx) {
                        if (this._resourceTemp == null) {
                            var self = this;
                            var aggregate = [{
                                "$lookup": {
                                    //字典表需要加上user_safety_前缀；
                                    "from": "user_safety_REL_RESOURCE_EMTYPE",
                                    //主表里的关联字段
                                    "localField": "tag.NODEID",
                                    //字典表的关联字段
                                    "foreignField": "tag.NODEID",
                                    //结果信息存放属性
                                    "as": "REL"
                                }
                            }, {
                                //展开数组
                                "$unwind": {
                                    path: "$REL",
                                    preserveNullAndEmptyArrays: true
                                }
                            }, {
                                "$lookup": {
                                    //字典表需要加上user_safety_前缀；
                                    "from": "user_safety_JC_RESTEAMCFG",
                                    //主表里的关联字段
                                    "localField": "tag.NODEID",
                                    //字典表的关联字段
                                    "foreignField": "tag.FIRETEAMTYPECODE",
                                    //结果信息存放属性
                                    "as": "CFG"
                                }
                            }, {
                                //展开数组
                                "$unwind": {
                                    path: "$CFG",
                                    preserveNullAndEmptyArrays: true
                                }
                            }, {
                                $project: {
                                    "tag": "$tag",
                                    "type": "$REL.tag.TYPECODE",
                                    "orderNum": "$REL.tag.ORDERNUM",
                                    "config": "$CFG.tag"
                                }
                            }, {
                                $sort: {
                                    "tag.ORDERNUM": 1
                                }
                            }];
                            var query = {};
                            var data = {};
                            data.dataSetId = 'RESOURCE_CATALOG';
                            data.query = JSON.stringify(query);
                            data.aggregate = JSON.stringify(aggregate);
                            data.eId = 'safety';
                            var opts = {};
                            opts.url = this.opts.serverUrl + '/dataStatics/aggregate';
                            opts.data = data;
                            opts.type = 'get';
                            opts.dataType = 'json';

                            opts.success = function(data) {
                                self._resourceTemp = data.data;
                                callback && callback.call(ctx, null, jQuery.extend(true, [], self._resourceTemp));
                            };

                            opts.error = function(err) {
                                callback && callback.call(ctx, new Error('服务器问题'));
                            };

                            return jQuery.ajax(opts);
                        } else {
                            callback && callback.call(ctx, null, jQuery.extend(true, [], this._resourceTemp));
                            return null;
                        }
                    };
                    /**
                     * 获取资源配置
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getResourceConfig = function(callback, ctx) {
                        if (this._configTemp == null) {
                            var self = this;
                            var opts = {};
                            opts.url = this.opts.configUrl;
                            opts.dataType = 'json';

                            opts.success = function(data) {
                                self._configTemp = plainConfig.call(self, data.resources);
                                callback && callback.call(ctx, null, jQuery.extend(true, {}, self._configTemp));
                            };

                            opts.error = function(err) {
                                callback && callback.call(ctx, new Error('服务器问题'));
                            };

                            jQuery.ajax(opts);
                        } else {
                            callback && callback.call(ctx, null, jQuery.extend(true, {}, this._configTemp));
                        } //


                        function plainConfig(resources) {
                            var resourceSet = {};
                            var seperator = this.seperator;

                            for (var resourceKey in resources) {
                                var resource = resources[resourceKey];
                                var serviceObj = resource.service || {};

                                if (resource.children && Object.keys(resource.children).length > 0) {
                                    for (var childKey in resource.children) {
                                        var resourceId = resourceKey + seperator + childKey,
                                            childResource = resource.children[childKey];
                                        var serviceObjClone = jQuery.extend(true, {}, serviceObj);
                                        childResource.service = jQuery.extend(true, serviceObjClone, childResource.service || {});
                                        childResource.id = resourceId;
                                        childResource.tableFields = childResource.tableFields || resource.tableFields;
                                        childResource.tableName = childResource.tableName || resource.tableName;
                                        childResource.districtField = childResource.districtField || resource.districtField;
                                        childResource.keyWordFields = childResource.keyWordFields || resource.keyWordFields;
                                        childResource.keyField = childResource.keyField || resource.keyField;
                                        childResource.idKey = childResource.idKey || resource.idKey;
                                        childResource.fieldMap = childResource.fieldMap || resource.fieldMap;
                                        childResource.sort = childResource.sort || resource.sort;
                                        childResource.sumField = childResource.sumField || resource.sumField;
                                        resourceSet[resourceId] = childResource;
                                    }
                                } else {
                                    var resourceId = resourceKey;
                                    resource.id = resourceId;
                                    resourceSet[resourceId] = resource;
                                }
                            }

                            return resourceSet;
                        }
                    };
                    /**
                     * 根据事件类型，获取相关联的资源类型树
                     * @param eventType
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getResourceTreeByEventType = function(eventType, cb, ctx) {
                        this.getResources(function(err, data) {
                            var allList = [];
                            var rootId = 'c_root';
                            var nodeMap = {},
                                matchNodeMap = {},
                                filterType = !(eventType == null || eventType == ''); //

                            var index = 0;

                            for (var i = 0; i < data.length; i++) {
                                var item = data[i],
                                    tag = item.tag,
                                    itemId = tag.NODEID,
                                    tempObj = {};
                                nodeMap[itemId] = tempObj;
                                tempObj.id = itemId;
                                tempObj.name = tag.NAME;
                                tempObj.parentId = tag.PARENTID;
                                tempObj.resourceTag = tag.NODEKEY || null;
                                tempObj.e_orderNum = item.orderNum;
                                tempObj.orderNum = tag.ORDERNUM;

                                if (item.config) {
                                    tempObj.allCount = item.config.ALLTEAMNUM;
                                    tempObj.limit = [item.config.NEARBYTEAMNUM, item.config.READYTEANUM]; // console.log(JSON.stringify(item),'  ',tempObj.limit)
                                }

                                if (!filterType || item.type == eventType) {
                                    matchNodeMap[itemId] = tempObj;
                                }

                                allList.push(tempObj);
                            } //


                            var resultMap = {};
                            resultMap[rootId] = nodeMap[rootId];

                            for (var nodeId in matchNodeMap) {
                                var matchNode = matchNodeMap[nodeId];
                                handleEachNode(matchNode, resultMap, matchNodeMap, nodeMap);
                            }

                            var newList = [];

                            for (var nId in resultMap) {
                                newList.push(resultMap[nId]);
                            } //排序


                            if (eventType == null) {
                                //深度优先遍历排序
                                var treeData = this.formatTree(newList, {
                                    pIdField: 'parentId',
                                    idField: 'id'
                                });
                                visitAndSortByDepth(treeData[0], {
                                    idx: 1
                                }, nodeMap);
                                newList.sort(function(a, b) {
                                    return a._order_num - b._order_num;
                                });
                            } else {
                                newList.sort(function(a, b) {
                                    var aN = a.e_orderNum || 10000,
                                        bN = b.e_orderNum || 10000;
                                    return aN - bN;
                                });
                            } // console.log('>>', newList.length);


                            cb && cb.call(ctx, null, newList);
                        }, this);

                        function handleEachNode(node, resultMap, matchMap, fullMap) {
                            resultMap[node.id] = node;
                            visitParent(node, fullMap, resultMap);
                            visitChildren(node, fullMap, resultMap);
                        }

                        function visitParent(node, fullMap, resultMap) {
                            var parent = fullMap[node.parentId];

                            if (parent) {
                                if (!node.limit && parent.limit) {
                                    node.limit = parent.limit;
                                }

                                ensureOrderNum(node, parent);
                                resultMap[parent.id] = parent;
                                visitParent(parent, fullMap, resultMap);
                            }
                        }

                        function visitChildren(node, fullMap, resultMap) {
                            var nodeId = node.id;

                            for (var kk in fullMap) {
                                var tempNode = fullMap[kk];

                                if (tempNode.parentId == nodeId) {
                                    ensureOrderNum(tempNode, node);

                                    if (!tempNode.limit && node.limit) {
                                        tempNode.limit = node.limit;
                                    }

                                    resultMap[tempNode.id] = tempNode;
                                    visitChildren(tempNode.id, fullMap, resultMap);
                                }
                            }
                        }

                        function ensureOrderNum(node, parent) {
                            if (isNaN(node.e_orderNum) && !isNaN(parent.e_orderNum)) {
                                node.e_orderNum = parent.e_orderNum;
                            }

                            if (isNaN(node.orderNum) && !isNaN(parent.orderNum)) {
                                node.orderNum = parent.orderNum;
                            }
                        } //


                        function visitAndSortByDepth(node, obj, fullNodeSet) {
                            var nodeTemp = fullNodeSet[node.id] || {};
                            nodeTemp._order_num = obj.idx++;
                            var children = node.children || [];

                            if (children.length > 0) {
                                for (var j = 0; j < children.length; j++) {
                                    visitAndSortByDepth(children[j], obj, fullNodeSet);
                                }
                            }
                        }
                    };
                    /**
                     * 根据类型获取资源
                     * @param eventType
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getResourcesByEventType = function(eventType, cb, ctx) {
                        this.getResourceConfig(function(err, resources) {
                            //this.getResourceTreeByEventType(eventType, function (err, data) {
                            if (err == null) {
                                var resourceNodeMap = {};
                                var regex = /^(.*)\_([^\_]*)$/;

                                for (var i = 0; i < data.length; i++) {
                                    var item = data[i],
                                        resourceTag = item.resourceTag;

                                    if (resourceTag) {
                                        if (regex.test(resourceTag)) {
                                            var groups = regex.exec(resourceTag);
                                            resourceTag = groups[1] + this.seperator + groups[2];
                                        }

                                        var resource = resources[resourceTag];

                                        if (resource && item.limit) {
                                            resource.limit = item.limit;
                                        }

                                        if (resource) {
                                            resource._order_num = item._order_num;
                                        }

                                        resourceNodeMap[resourceTag] = resource;
                                    }
                                }

                                cb.call(ctx, null, resourceNodeMap);
                            } else {
                                cb.call(ctx, err);
                            } //}, this);

                        }, this);
                    };
                    /**
                     * 获取事件类型
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getEventType = function(cb, ctx) {
                        if (this.eventTypeList == null) {
                            var self = this;
                            jQuery.ajax({
                                url: this.opts.serverUrl + '/dataOperate/queryMulti',
                                dataType: 'json',
                                data: {
                                    eId: 'safety',
                                    data: JSON.stringify({
                                        'CODE_EMERGENCY_CLASS': {
                                            'query': {},
                                            'sort': '_id'
                                        }
                                    })
                                },
                                success: function success(data) {
                                    var data = data.data;
                                    var list = data[Object.keys(data)[0]];
                                    self.eventTypeList = list;
                                    cb && cb.call(ctx, null, list);
                                },
                                error: function error(err) {
                                    cb && cb.call(ctx, err);
                                }
                            });
                        } else {
                            cb && cb.call(ctx, null, jQuery.extend(true, [], this.eventTypeList));
                        }
                    };
                    /**
                     * 获取事件类型信息
                     * @param eventType
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getEventData = function(eventType, cb, ctx) {
                        this.getEventType(function(err, data) {
                            var obj = null;

                            for (var i = 0; i < data.length; i++) {
                                var item = data[i];

                                if (item && item.tag.TYPECODE === eventType) {
                                    obj = item;
                                    break;
                                }
                            }

                            cb && cb.call(ctx, null, obj);
                        }, this);
                    };
                    /**
                     * 格式化为树形式
                     * @param nodes {Array} 节点数组
                     * @param opts {Object}
                     * @param opts.idField {String} id字段名
                     * @param opts.pIdField {String} pId字段名
                     */


                    Service.prototype.formatTree = function(nodes, opts) {
                        if (!(nodes && opts && opts.idField && opts.pIdField)) {
                            return null;
                        }

                        var nodeList = jQuery.extend(true, [], nodes || []),
                            idField = opts.idField,
                            pIdField = opts.pIdField; //

                        var nodeMap = {};

                        for (var i = 0; i < nodeList.length; i++) {
                            var node = nodeList[i];
                            var temp = {};
                            temp.id = node[idField];
                            temp.pId = node[pIdField];
                            temp.orig = node;
                            nodeMap[temp.id] = temp;
                        } //


                        var treeData = [];
                        var visitMap = {};

                        for (var k in nodeMap) {
                            var node = nodeMap[k];

                            if (visitMap.hasOwnProperty(k)) {
                                continue;
                            }

                            visitNode(node, nodeMap, visitMap, treeData);
                        }

                        return treeData;

                        function visitNode(node, nodeMap, visitMap, treeData) {
                            if (nodeMap.hasOwnProperty(node.pId)) {
                                var parentNode = nodeMap[node.pId];

                                if (!visitMap.hasOwnProperty(parentNode.id)) {
                                    arguments.callee(parentNode, nodeMap, visitMap, treeData);
                                }

                                var treeNode = visitMap[parentNode.id];
                                var children = treeNode.children || [];
                                children.push(node.orig);
                                treeNode.children = children;
                                visitMap[node.id] = node.orig;
                            } else {
                                //is root
                                treeData.push(node.orig);
                                visitMap[node.id] = node.orig;
                            }
                        }
                    };
                    /**
                     * 统计资源
                     * @param resourceKeys 资源
                     * @param filter 过滤条件
                     * @param filter.districtCode
                     * @param filter.keyword
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getStatistics = function(resourceKeys, filter, callback, ctx) {
                        this.getFilterResources(null, resourceKeys, function(err, resources) {
                            var aggregateList = [];

                            for (var resourceKey in resources) {
                                var resource = resources[resourceKey];

                                if (resource) {
                                    var aggregateObj = this.getStatisticsAggregate(resources[resourceKey], filter);
                                    aggregateList.push(aggregateObj);
                                }
                            }

                            this.statisticsMulti(aggregateList, function(err, data) {
                                var resultList = [];
                                var total = 0;
                                var resourceList = [];

                                for (var k in resources) {
                                    var r = resources[k];
                                    resourceList.push(r);
                                } //排序


                                resourceList.sort(function(a, b) {
                                    return a._order_num - b._order_num;
                                });

                                for (var i = 0; i < resourceList.length; i++) {
                                    var resource = resourceList[i] || {},
                                        rk = resource.id;
                                    var count = isNaN(data[rk]) || isNaN(parseInt(data[rk])) ? 0 : parseInt(data[rk]);
                                    total += count;
                                    var title = resource.title;
                                    resultList.push({
                                        codeKey: rk,
                                        tabTitle: title,
                                        tabNumber: count
                                    });
                                } // for (var k in resources) {
                                //   var count = (isNaN(data[k]) || isNaN(parseInt(data[k]))) ? 0 : parseInt(data[k]);
                                //   total += count;
                                //   if (k) {
                                //     var title = resources[k].title;
                                //     resultList.push({
                                //       codeKey: k,
                                //       tabTitle: title,
                                //       tabNumber: count
                                //     });
                                //   }
                                // }


                                callback && callback.call(ctx, null, {
                                    total: total,
                                    list: resultList
                                });
                            }, this);
                        }, this);
                    };
                    /**
                     *  拼接统计管道
                     * @param resource
                     * @param opts
                     */


                    Service.prototype.getStatisticsAggregate = function(resource, opts) {
                        var aggregateObj = {},
                            resourceId = resource.id,
                            tableName = resource.tableName,
                            serviceObj = resource.service;
                        opts = opts || {};
                        var aggregate = []; //行政区划过滤

                        var districtMatch = this.getDistrictMatch(opts.districtCode, resource);

                        if (districtMatch) {
                            aggregate.push(districtMatch);
                        }

                        if (serviceObj.queryParams) {
                            var query = serviceObj.queryParams[tableName].query || {};
                            aggregate.push({
                                $match: query
                            });
                        } // 支撑配置计数字段


                        if (resource.sumField) {
                            var or = [];
                            var gte = {};
                            gte["tag." + resource.sumField] = {
                                "$gte": 0
                            };
                            or.push(gte);
                            var lte = {};
                            lte["tag." + resource.sumField] = {
                                "$lte": 0
                            };
                            or.push(lte);
                            aggregate.push({
                                $match: {
                                    "$or": or
                                }
                            });
                            aggregate.push({
                                $project: {
                                    "type": "$_id",
                                    "num": "$tag." + resource.sumField
                                }
                            });
                            aggregate.push({
                                "$group": {
                                    "_id": null,
                                    "_count": {
                                        "$sum": "$num"
                                    }
                                }
                            });
                        } else {
                            aggregate.push({
                                $count: '_count'
                            });
                        }

                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = {};
                        aggregateObj.searchId = resourceId;
                        aggregateObj.dataSetId = tableName;
                        aggregateObj.queryIndex = 1;
                        return aggregateObj;
                    };
                    /**
                     * 查询列表数据
                     * @param opts
                     * @param opts.resourceKey
                     * @param opts.flatTag 是否平铺tag属性
                     * @param opts.fields 字段列表（筛选字段）
                     * @param [opts.geometry] 几何对象（geojson）
                     * @param [opts.keyWord] 关键字
                     * @param [opts.districtCode] 行政区划编码,以逗号隔开
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getMapDataList = function(opts, callback, ctx) {
                        var self = this;
                        this.getResourceConfig(function(err, resources) {
                            if (err == null) {
                                var resource = resources[opts.resourceKey];
                                var param = {};

                                if (resource) {
                                    var serviceObj = resource.service;
                                    var tableName = resource.tableName;
                                    var config = this.getSelectColumn(resource, opts.fields);
                                    var fieldProject = config.fieldProject;
                                    var query = {};
                                    query.$and = [];

                                    if (opts.geometry) {
                                        var geom = {
                                            $geoIntersects: {
                                                $geometry: opts.geometry
                                            }
                                        };
                                        query.$and.push({
                                            geom: geom
                                        });
                                    }

                                    if (serviceObj.queryParams) {
                                        var con = serviceObj.queryParams[tableName].query || {};
                                        query.$and.push(con);
                                    }

                                    if (opts.districtCode) {
                                        var districtMatch = this.getDistrictMatch(opts.districtCode, resource);
                                        var $or = districtMatch.$match;
                                        query.$and.push($or);
                                    }

                                    if (opts.keyWord) {
                                        var keywordMatch = this.getSearchMatch(opts.keyWord, resource);
                                        query.$and.push(keywordMatch.$match);
                                    }

                                    if (query.$and.length === 0) {
                                        delete query.$and;
                                    }

                                    param[tableName] = {
                                        query: query,
                                        select: config.select
                                    }; // query = {
                                    //   $and:[
                                    //     {
                                    //       name:'1',
                                    //     },
                                    //     {
                                    //       $or:[]
                                    //     },
                                    //     {
                                    //     }
                                    //   ]
                                    // }

                                    $.ajax({
                                        url: this.opts.serverUrl + '/dataOperate/queryMulti',
                                        dataType: 'json',
                                        type: 'post',
                                        data: {
                                            eId: 'safety',
                                            data: JSON.stringify(param)
                                        },
                                        success: function success(data) {
                                            var res = self.formatResultColumns(data.data[tableName], fieldProject);
                                            callback && callback.call(ctx, null, res);
                                        },
                                        error: function error(err) {
                                            callback && callback.call(ctx, err);
                                        }
                                    });
                                }
                            } else {
                                callback.call(ctx, err);
                            }
                        }, this);
                    };

                    Service.prototype.formatResultColumns = function(data, fieldProject) {
                        var self = this;
                        data.forEach(function(element) {
                            element = self.flatObject(element);

                            for (var key in element) {
                                if (element.hasOwnProperty(key)) {
                                    if (fieldProject[key]) {
                                        element[fieldProject[key]] = element[key];
                                    }
                                }
                            }
                        });
                        return data;
                    };

                    Service.prototype.flatObject = function(element) {
                        var tag = element.tag;

                        if (tag) {
                            for (var key in tag) {
                                if (tag.hasOwnProperty(key)) {
                                    var value = tag[key];
                                    element[key] = value;
                                }
                            }

                            delete element.tag;
                        }

                        return element;
                    };

                    Service.prototype.getSelectColumn = function(resource, fields) {
                        var fieldMap = resource.fieldMap;
                        var fieldProject = {};
                        var selectArr = [];
                        selectArr.push("_id");
                        selectArr.push("geom");

                        for (var key in fieldMap) {
                            if (fieldMap.hasOwnProperty(key)) {
                                var originField = key;
                                var projectedField = fieldMap[key];

                                if (fields.includes(projectedField)) {
                                    fieldProject[originField] = projectedField;
                                    selectArr.push("tag." + originField);
                                }
                            }
                        }

                        var result = {};
                        result.select = selectArr.join(" ");
                        result.fieldProject = fieldProject;
                        return result;
                    };
                    /**
                     * 查询列表数据
                     * @param opts
                     * @param opts.resourceKey，多个逗号分隔
                     * @param opts.pageSize
                     * @param opts.pageIndex
                     * @param opts.districtCode 政区过滤编码
                     * @param opts.keyword 关键字-预留参数
                     * @param opts.flatTag 是否平铺tag属性
                     * @param opts.fields 字段列表（筛选字段）
                     * @param opts.id 主键筛选
                     * @param opts.filter
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getDataList = function(opts, callback, ctx) {
                        if (opts.keyword) {
                            var fbsArr = ["\\", "$", "(", ")", "*", "+", ".", "[", "]", "?", "^", "{", "}", "|"];

                            for (var key in fbsArr) {
                                if (opts.keyword.indexOf(fbsArr[key]) != -1) {
                                    opts.keyword = opts.keyword.replace(fbsArr[key], "\\" + fbsArr[key]);
                                }
                            }
                        }

                        opts.filter = opts.filter || {};
                        this.getResourceConfig(function(err, resources) {
                            if (err == null) {
                                var resourceList = [],
                                    resourceKey = opts.resourceKey,
                                    resourceKeyList = resourceKey.split(',');
                                var aggregateList = [];

                                for (var i = 0; i < resourceKeyList.length; i++) {
                                    var resource = resources[resourceKeyList[i]];

                                    if (resource) {
                                        var aggregateObj = this.getAllListAggregate(resource, {
                                            pageSize: opts.pageSize,
                                            pageIndex: opts.pageIndex,
                                            flatTag: opts.flatTag,
                                            districtCode: opts.districtCode,
                                            keyword: opts.keyword,
                                            fields: opts.fields,
                                            id: opts.id
                                        });
                                        var resourceFilter = opts.filter[resourceKeyList[i]];

                                        if (resourceFilter) {
                                            if (aggregateObj.query && Object.keys(aggregateObj.query).length > 0) {
                                                aggregateObj.query = {
                                                    $and: [aggregateObj.query, resourceFilter]
                                                };
                                            } else {
                                                aggregateObj.query = resourceFilter;
                                            }
                                        }

                                        aggregateList.push(aggregateObj);
                                    }
                                }

                                this.aggregateMulti(aggregateList, null, function(err, data) {
                                    if (err == null) {
                                        var resultSet = {};

                                        for (var k in data) {
                                            try {
                                                var itemData = data[k];
                                                resultSet[k] = itemData[Object.keys(itemData)[0]];
                                            } catch (e) {}
                                        }

                                        callback.call(ctx, null, resultSet);
                                    } else {
                                        callback.call(ctx, err);
                                    }
                                }, this);
                            } else {
                                callback.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 拼接查询管道
                     * @param resource
                     * @param opts
                     */


                    Service.prototype.getAllListAggregate = function(resource, opts) {
                        var aggregateObj = {},
                            resourceId = resource.id,
                            tableName = resource.tableName,
                            serviceObj = resource.service,
                            pageSize = opts.pageSize,
                            pageIndex = opts.pageIndex,
                            flatTag = !!opts.flatTag,
                            skipVal = null,
                            limitVal = null;

                        if (pageSize !== null && pageSize !== '' && pageIndex !== null && pageIndex !== '') {
                            pageSize = parseInt(pageSize);
                            pageIndex = parseInt(pageIndex);
                            skipVal = (pageIndex - 1) * pageSize; // limitVal = pageSize * (1 + pageIndex);

                            limitVal = pageSize;
                        } else {
                            //todo 暂时最多查询
                            limitVal = 50 * 1000;
                        }

                        var aggregate = []; //灾情信息员

                        if (resource.id === 'JC_DISINFOPER※01' || resource.id === 'BAS_bas_school' || resource.id === 'BAS_shelter') {
                            aggregate.push({
                                $limit: 10000
                            });
                        } //行政区划过滤


                        var districtMatch = this.getDistrictMatch(opts.districtCode, resource);

                        if (districtMatch) {
                            aggregate.push(districtMatch);
                        } //关键字过滤


                        var kwMatch = this.getSearchMatch(opts.keyword, resource);

                        if (kwMatch) {
                            aggregate.push(kwMatch);
                        }

                        if (serviceObj.queryParams) {
                            var query = serviceObj.queryParams[tableName].query || {};
                            aggregate.push({
                                $match: query
                            });
                        }

                        if (opts.id) {
                            aggregate.push(this.getIdMatch(opts.id, resource.idKey));
                        }

                        if (resource.sort) {
                            aggregate.push({
                                $sort: resource.sort
                            });
                        }

                        if (!isNaN(skipVal) && skipVal != null) {
                            aggregate.push({
                                $skip: skipVal
                            });
                        }

                        if (!isNaN(limitVal) && limitVal != null) {
                            aggregate.push({
                                $limit: limitVal
                            });
                        }

                        var fieldMap = resource.fieldMap,
                            project = {},
                            projectSuffix = flatTag ? '' : 'tag.';

                        for (var field in fieldMap) {
                            if (Object.prototype.toString.call(fieldMap[field]) == '[object Object]') {
                                var lookUpObj = fieldMap[field],
                                    lookupAlias = field + '_rel';
                                var as = lookUpObj.as;

                                if (opts.fields) {
                                    if (opts.fields.includes(as)) {
                                        lookUpObj.as = lookupAlias;
                                        aggregate.push({
                                            $lookup: lookUpObj
                                        });
                                        aggregate.push({
                                            $unwind: {
                                                "path": "$" + lookupAlias,
                                                "preserveNullAndEmptyArrays": true
                                            }
                                        });

                                        var _key = as ? as : field;

                                        project[projectSuffix + _key] = '$' + lookupAlias + '.tag.' + field;
                                    }
                                } else {
                                    lookUpObj.as = lookupAlias;
                                    aggregate.push({
                                        $lookup: lookUpObj
                                    });
                                    aggregate.push({
                                        $unwind: {
                                            "path": "$" + lookupAlias,
                                            "preserveNullAndEmptyArrays": true
                                        }
                                    });

                                    var _key = as ? as : field;

                                    project[projectSuffix + _key] = '$' + lookupAlias + '.tag.' + field;
                                }
                            } else {
                                project[projectSuffix + fieldMap[field]] = '$tag.' + field;
                            }
                        } //对字段进行自定义筛选


                        if (opts.fields) {
                            for (var key in project) {
                                if (project.hasOwnProperty(key)) {
                                    if (!opts.fields.includes(key)) {
                                        delete project[key];
                                    }
                                }
                            }
                        }

                        project['geom'] = '$geom';
                        aggregate.push({
                            $project: project
                        });
                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = {};
                        aggregateObj.searchId = resourceId;
                        aggregateObj.dataSetId = tableName;
                        aggregateObj.queryIndex = 1;
                        return aggregateObj;
                    };
                    /**
                     * 拼接行政区划条件
                     * @param districtCode
                     * @param resource
                     * @param resource.districtField 行政区划字段名
                     * @param resource.districtKey 可选，默认为空
                     */


                    Service.prototype.getDistrictMatch = function(districtCode, resource) {
                        var match = null;

                        if (districtCode && districtCode !== '000000' && resource.districtField) {
                            var districtCodes = districtCode.split(','),
                                districtField = resource.districtField;
                            var or = [],
                                districtKey = null;

                            if (resource.districtKey) {
                                districtKey = resource.districtKey;
                            } else {
                                districtKey = 'tag.' + districtField;
                            }

                            for (var i = 0; i < districtCodes.length; i++) {
                                var districtCode = districtCodes[i];

                                if (districtCode) {
                                    var eachFilter = {};
                                    eachFilter[districtKey] = {
                                        $regex: getDistrictRegex(districtCode)
                                    };
                                    or.push(eachFilter);
                                }
                            }

                            match = {
                                $match: {
                                    $or: or
                                }
                            };
                        } else {}

                        return match;

                        function getDistrictRegex(code) {
                            var c = code.substr(0, 6);

                            if ('000000' == c) {
                                //全国不过滤
                                c = '.*';
                            } else if (/^\d{2}0000$/.test(c)) {
                                c = c.substr(0, 2) + '.*';
                            } else if (/^\d{4}00$/.test(c)) {
                                c = c.substr(0, 4) + '.*';
                            } else if (/^\d{6}$/.test(c)) {
                                c = c.substr(0, 6) + '.*';
                            }

                            return '^' + c + '$';
                        }
                    };
                    /**
                     * 根据政区等获取数据id--暂时用于物资/储备库、战勤基地/装备的过滤
                     * @param opts
                     * @param opts.districtCode
                     * @param opts.tables
                     * @param opts.tables[n].tableName
                     * @param opts.tables[n].districtField 行政区划字段名
                     * @param callback
                     * @param ctx
                     * @private
                     */


                    Service.prototype.getRecordIdListByFilter = function(opts, callback, ctx) {
                        opts = opts || {};
                        var tables = opts.tables || [],
                            tableCount = tables.length,
                            districtCode = opts.districtCode;
                        var aggregateList = [];

                        for (var i = 0; i < tableCount; i++) {
                            var tableObj = tables[i];
                            var aggregateObj = {},
                                aggregate = [];
                            var districtMatch = this.getDistrictMatch(districtCode, tableObj);

                            if (districtMatch) {
                                aggregate.push(districtMatch);
                            }

                            aggregate.push({
                                $project: {
                                    "_id": "$_id"
                                }
                            });
                            aggregateObj.aggregate = aggregate;
                            aggregateObj.query = {};
                            aggregateObj.searchId = i;
                            aggregateObj.dataSetId = tableObj.tableName;
                            aggregateList.push(aggregateObj);
                        }

                        if (aggregateList.length == 0) {
                            callback.call(ctx, null, []);
                        } else {
                            this.aggregateMulti(aggregateList, null, function(err, data) {
                                var resultList = [];

                                for (var i = 0; i < tableCount; i++) {
                                    var itemResult = data[i] || {},
                                        itemList = itemResult[Object.keys(itemResult)[0]];
                                    var idList = [];

                                    for (var j = 0; j < itemList.length; j++) {
                                        idList.push(itemList[j]._id);
                                    }

                                    resultList.push({
                                        tableName: tables[i].tableName,
                                        idList: idList
                                    });
                                }

                                callback.call(ctx, null, resultList);
                            }, this);
                        }
                    };
                    /**
                     * 拼接关键字条件--预留方法
                     * @param kw
                     * @param resource
                     */


                    Service.prototype.getSearchMatch = function(kw, resource) {
                        if (kw) {
                            var query = {};
                            var filter = {};
                            filter['$regex'] = "^.*" + kw + ".*$";
                            query[resource.keyWordFields] = filter;
                            var kwquery = {
                                $match: query
                            };
                            return kwquery;
                        } else {
                            return null;
                        }
                    };
                    /**
                     * 主键（id）筛选
                     * @param id
                     * @param [idField]
                     */


                    Service.prototype.getIdMatch = function(id, idField) {
                        if (!idField) {
                            idField = '_id';
                        }

                        if (id) {
                            var query = {};
                            var filter = {};
                            filter['$regex'] = "^" + id + "$";
                            query[idField] = filter;
                            var idquery = {
                                $match: query
                            };
                            return idquery;
                        } else {
                            return null;
                        }
                    };
                    /**
                     * 多个管道执行方法-公共
                     * @param aggregateList 管道列表
                     * @param cb
                     * @param ctx
                     * @returns {*}
                     */


                    Service.prototype.aggregateMulti = function(aggregateList, options, cb, ctx) {
                        var opts = {},
                            data = {};
                        var searchid = null;
                        var datasetid = null;

                        if (aggregateList.length === 1) {
                            var agregate = aggregateList[0];
                            searchid = agregate.searchId;
                            datasetid = agregate.dataSetId;
                        }

                        if (options) {
                            aggregateList.forEach(function(element) {
                                Object.assign(element, options);
                            }); // Object.assign(data, options);
                        }

                        if (options && options.near) {
                            opts.url = this.opts.serverUrl + '/dataStatics/aggregatePageNear';
                        } else {
                            opts.url = this.opts.serverUrl + '/dataStatics/aggregateMulti';
                        }

                        opts.dataType = 'json';
                        opts.type = 'POST';
                        data.data = JSON.stringify(aggregateList);
                        data.eId = 'safety';
                        opts.data = data;

                        opts.success = function(d) {
                            var data = d.data;
                            var result = {};

                            if (Array.isArray(data) && searchid && datasetid) {
                                result[searchid] = {};
                                result[searchid][datasetid] = data;
                            } else {
                                result = data;
                            }

                            cb && cb.call(ctx, null, result);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        return jQuery.ajax(opts);
                    };
                    /**
                     * 多个管道统计
                     * @param aggregateList
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.statisticsMulti = function(aggregateList, cb, ctx) {
                        this.aggregateMulti(aggregateList, null, function(err, data) {
                            for (var k in data) {
                                var item = data[k],
                                    itemData = item[Object.keys(item)[0]];

                                if (itemData.length == 0) {
                                    data[k] = 0;
                                } else {
                                    data[k] = itemData[0]._count;
                                }
                            }

                            cb && cb.call(ctx, null, data);
                        }, this);
                    };
                    /**
                     * 周边列表查询
                     * @param opts
                     * @param opts.eventType 事件类型
                     * @param opts.resourceKeys 资源key值
                     * @param opts.pageSize
                     * @param opts.pageIndex
                     * @param opts.districtCode
                     * @param opts.point
                     * @param opts.buffer
                     * @param opts.config
                     * @param opts.config.limit {Array/Number} 可选 返回记录的限制数 数组或者数字，数组形式对应救援力量的[就近数，增援数]
                     * @param opts.config.radius {Number} 可选 查询半径
                     * @param opts.config.idList {Array} 可选 id数组，用于过滤
                     * @param opts.flatTag
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getNearbyList = function(opts, callback, ctx) {
                        var eventType = opts.eventType,
                            config = opts.config || {};
                        this.getFilterResources(eventType, opts.resourceKeys, function(err, resources) {
                            if (err == null) {
                                var aggregateList = [];

                                for (var resourceKey in resources) {
                                    var resourceObj = resources[resourceKey],
                                        thisConfig = config[resourceKey] || {};

                                    if (resourceObj.id.indexOf('v_equipment') != -1 || !opts.point) {
                                        var aggregateObj = this.getAllListAggregate(resourceObj, {
                                            pageSize: opts.pageSize,
                                            pageIndex: opts.pageIndex,
                                            flatTag: opts.flatTag,
                                            districtCode: opts.districtCode,
                                            keyword: opts.Keyword
                                        });
                                    } else {
                                        var aggregateObj = this.getNearbyAggregate(resourceObj, {
                                            pageSize: opts.pageSize,
                                            pageIndex: opts.pageIndex,
                                            limit: thisConfig.limit || resourceObj.limit,
                                            buffer: opts.buffer,
                                            radius: thisConfig.radius,
                                            point: opts.point,
                                            flatTag: !!opts.flatTag,
                                            Keyword: opts.Keyword,
                                            districtCode: opts.districtCode
                                        });
                                    }

                                    aggregateList.push(aggregateObj);
                                }

                                var options = {};

                                if (opts.pageSize && opts.pageIndex) {
                                    options.pageIndex = opts.pageIndex;
                                    options.pageSize = opts.pageSize;
                                    options.paging = true;
                                }

                                if (opts.point) {
                                    options.near = JSON.stringify(opts.point);
                                    options.distanceField = 'dis';
                                }

                                this.aggregateMulti(aggregateList, options, function(err, data) {
                                    if (err == null) {
                                        var resultSet = {},
                                            resultArr = [],
                                            total = 0;

                                        for (var rk in data) {
                                            var itemObj = data[rk],
                                                itemList = itemObj[Object.keys(itemObj)[0]] || [],
                                                itemConfig = config[rk] || {},
                                                limit = itemConfig.limit || resourceObj.limit;
                                            total += itemList.length; // var listArr = [];
                                            // listArr.push(itemList.slice(0, limit[0]));
                                            // listArr.push(itemList.slice(limit[0]));

                                            var resultObj = {};
                                            resultObj.data = itemList;
                                            resultObj.codeKey = rk;
                                            resultObj.tabTitle = resources[rk].title;
                                            resultObj.limit = limit;
                                            resultObj.radius = itemConfig.radius;
                                            resultObj.tabNumber = itemList.length;
                                            resultArr.push(resultObj);
                                        }

                                        resultSet.list = resultArr;
                                        resultSet.total = total;
                                        callback.call(ctx, null, resultSet);
                                    } else {
                                        callback.call(ctx, err);
                                    }
                                }, this);
                            } else {
                                callback.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 拼接周边查询管道
                     * @param resource
                     * @param opts
                     * @param opts.buffer 缓冲区
                     * @param opts.point 中心点
                     * @param opts.radius 缓冲半径
                     * @param opts.limit {Array[2]}
                     * @param opts.idList Id过滤数组
                     * @param opts.flatTag
                     */


                    Service.prototype.getNearbyAggregate = function(resource, opts) {
                        var aggregateObj = {},
                            resourceId = resource.id,
                            tableName = resource.tableName,
                            flatTag = !!opts.flatTag,
                            serviceObj = resource.service;
                        pageSize = opts.pageSize, pageIndex = opts.pageIndex, skipVal = null, limitVal = null;

                        if (pageSize !== null && pageSize !== '' && pageIndex !== null && pageIndex !== '') {
                            pageSize = parseInt(pageSize);
                            pageIndex = parseInt(pageIndex);
                            skipVal = (pageIndex - 1) * pageSize; // limitVal = pageSize * (1 + pageIndex);

                            limitVal = pageSize;
                        } else {
                            //todo 暂时最多查询
                            limitVal = 50 * 1000;
                        }

                        var aggregate = []; //geonear

                        var geoNear = {};
                        geoNear.limit = 1000 * 1000;
                        geoNear.maxDistance = opts.radius ? parseFloat(opts.radius) : 5000 * 1000;
                        geoNear.spherical = true;
                        geoNear.near = {
                            type: 'Point',
                            coordinates: opts.point
                        };
                        geoNear.includeLocs = "geom";
                        geoNear.distanceField = "dis"; // if(opts.point){
                        //   aggregate.push({
                        //     $geoNear: geoNear
                        //   });
                        // }
                        //geometry 过滤

                        if (opts.buffer) {
                            aggregate.push({
                                $match: {
                                    "geom": {
                                        "$geoIntersects": {
                                            "$geometry": opts.buffer
                                        }
                                    }
                                }
                            });
                        }

                        if (opts.Keyword) {
                            //关键字过滤
                            var query = {};
                            var filter = {};
                            filter['$regex'] = "^.*" + opts.Keyword + ".*$";
                            query[resource.keyWordFields] = filter;
                            aggregate.push({
                                $match: query
                            });
                        } //行政区划过滤


                        var districtMatch = this.getDistrictMatch(opts.districtCode, resource);

                        if (districtMatch) {
                            aggregate.push(districtMatch);
                        }

                        if (serviceObj.queryParams) {
                            var query = serviceObj.queryParams[tableName].query || {};
                            aggregate.push({
                                $match: query
                            });
                        } // if (!isNaN(skipVal) && skipVal != null) {
                        //   aggregate.push({
                        //     $skip: skipVal
                        //   });
                        // }
                        // if (!isNaN(limitVal) && limitVal != null) {
                        //   aggregate.push({
                        //     $limit: limitVal
                        //   });
                        // }     


                        var project = this.parseProject(aggregate, resource.fieldMap, flatTag);
                        project['geom'] = '$geom';
                        project['dis'] = '$dis';
                        aggregate.push({
                            $project: project
                        }); // if (Object.prototype.toString.call(opts.limit) == '[object Array]' && opts.limit.length == 2) {
                        //   aggregate.push({
                        //     $limit: opts.limit[0] + opts.limit[1]
                        //   });
                        // } else if (!isNaN(opts.limit)) {
                        //   aggregate.push({
                        //     $limit: parseInt(opts.limit)
                        //   });
                        // }    

                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = {};
                        aggregateObj.searchId = resourceId;
                        aggregateObj.dataSetId = tableName;
                        aggregateObj.queryIndex = 1;
                        return aggregateObj;
                    };
                    /**
                     * 过滤获取列表
                     * @param queryResources
                     * @param queryResources[key].idList {Array}
                     * @param queryResources[key].districtCode 行政区划编码，多个逗号分隔
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getListByFilter = function(queryResources, callback, ctx) {
                        var resourceKeys = Object.keys(queryResources || {});
                        this.getFilterResources(null, resourceKeys, function(err, resources) {
                            var aggregateList = [];

                            for (var rk in queryResources) {
                                var resource = resources[rk],
                                    qResource = queryResources[rk];
                                var aggregateObj = this.getListByFilterAggregate(resource, {
                                    idList: qResource.idList,
                                    flatTag: false,
                                    districtCode: qResource.districtCode
                                });
                                aggregateList.push(aggregateObj);
                            }

                            this.aggregateMulti(aggregateList, null, function(err, resultSet) {
                                var resultList = [];

                                for (var resultKey in resultSet) {
                                    var resultObj = resultSet[resultKey] || {},
                                        tempObj = {};
                                    tempObj.codeKey = resultKey;
                                    tempObj.data = resultObj[Object.keys(resultObj)[0]];
                                    tempObj.tabTitle = resources[resultKey].title;
                                    tempObj.tabNumber = tempObj.data.length;
                                    resultList.push(tempObj);
                                }

                                callback.call(ctx, null, resultList);
                            }, this);
                        }, this);
                    };
                    /**
                     *
                     * @param resource
                     * @param opts
                     * @param opts.idList
                     * @param opts.flatTag
                     * @returns {{}}
                     */


                    Service.prototype.getListByFilterAggregate = function(resource, opts) {
                        var aggregateObj = {},
                            resourceId = resource.id,
                            tableName = resource.tableName,
                            flatTag = !!opts.flatTag,
                            serviceObj = resource.service;
                        var aggregate = []; //传递的id

                        if (opts.idList && opts.idList.length > 0) {
                            aggregate.push({
                                $match: {
                                    _id: {
                                        $in: opts.idList
                                    }
                                }
                            });
                        } //行政区划过滤


                        var districtMatch = this.getDistrictMatch(opts.districtCode, resource);

                        if (districtMatch) {
                            aggregate.push(districtMatch);
                        }

                        if (serviceObj.queryParams) {
                            var query = serviceObj.queryParams[tableName].query || {};
                            aggregate.push({
                                $match: query
                            });
                        }

                        var project = this.parseProject(aggregate, resource.fieldMap, flatTag);
                        project['geom'] = '$geom';
                        project['dis'] = '$dis';
                        aggregate.push({
                            $project: project
                        });
                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = {};
                        aggregateObj.searchId = resourceId;
                        aggregateObj.dataSetId = tableName;
                        return aggregateObj;
                    };
                    /**
                     *  获取指定事件类型关联的资源
                     * @param eventType 事件类型
                     * @param resourceKeys {Array} 匹配的资源key
                     * @param callback
                     * @param ctx
                     * @private
                     */


                    Service.prototype.getFilterResources = function(eventType, resourceKeys, callback, ctx) {
                        // this.getResourcesByEventType(eventType, function (err, resources) {
                        //   var resourceKeyMatches = resourceKeys,
                        //     matchLength = resourceKeyMatches.length,
                        //     resourceMap = {};
                        //   for (var resourceKey in resources) {
                        //     var flag = false;
                        //     for (var j = 0; j < matchLength; j++) {
                        //       if (resourceKey.indexOf(resourceKeyMatches[j]) == 0) {
                        //         flag = true;
                        //         break;
                        //       }
                        //     }
                        //     if (flag) {
                        //       resourceMap[resourceKey] = resources[resourceKey];
                        //     }
                        //   }
                        //   callback.call(ctx, null, resourceMap);
                        // }, this);
                        this.getResourceConfig(function(err, resources) {
                            if (err == null) {
                                var resourceNodeMap = {};

                                for (var i = 0; i < resourceKeys.length; i++) {
                                    var resourceTag = resourceKeys[i];

                                    if (resourceTag) {
                                        var resource = resources[resourceTag];
                                        resourceNodeMap[resourceTag] = resource;
                                    }
                                }

                                callback.call(ctx, null, resourceNodeMap);
                            } else {
                                callback.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 拼接project
                     * @param aggregate
                     * @param fieldMap
                     * @param flatTag
                     * @returns {{}}
                     */


                    Service.prototype.parseProject = function(aggregate, fieldMap, flatTag) {
                        var project = {},
                            projectSuffix = flatTag ? '' : 'tag.';

                        for (var field in fieldMap) {
                            if (Object.prototype.toString.call(fieldMap[field]) == '[object Object]') {
                                var lookUpObj = fieldMap[field],
                                    lookupAlias = field + '_rel';
                                var as = lookUpObj.as;
                                lookUpObj.as = lookupAlias;
                                aggregate.push({
                                    $lookup: lookUpObj
                                });
                                aggregate.push({
                                    $unwind: {
                                        "path": "$" + lookupAlias,
                                        "preserveNullAndEmptyArrays": true
                                    }
                                });

                                var _key = as ? as : field;

                                project[projectSuffix + _key] = '$' + lookupAlias + '.tag.' + field;
                            } else {
                                project[projectSuffix + fieldMap[field]] = '$tag.' + field;
                            }
                        }

                        return project;
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {};
                    window.EMapServerV2.CommonService = Service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/CoordTransformUtil.js":
            /*!*****************************************************!*\
              !*** ./public/json/oldserver/CoordTransformUtil.js ***!
              \*****************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.regexp.exec */ "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.exec.js");

                __webpack_require__( /*! core-js/modules/es.string.split */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.split.js");

                (function(window) {
                    var G = window['G'] || {};
                    window['G'] = G;
                    G.import = G.import || {}; //

                    var util = {};
                    util.x_PI = 3.14159265358979324 * 3000.0 / 180.0;
                    util.PI = 3.1415926535897932384626;
                    util.a = 6378245.0;
                    util.ee = 0.00669342162296594323;
                    /**
                     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
                     * 即 百度 转 谷歌、高德
                     * @param bd_lon
                     * @param bd_lat
                     */

                    util.bd09togcj02 = function(bd_lonlat) {
                        var bd_lon = +bd_lonlat.split(",")[0];
                        var bd_lat = +bd_lonlat.split(",")[1];
                        var x = bd_lon - 0.0065;
                        var y = bd_lat - 0.006;
                        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * util.x_PI);
                        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * util.x_PI);
                        var gg_lng = z * Math.cos(theta);
                        var gg_lat = z * Math.sin(theta);
                        var gcj02_lonlat = gg_lng + ',' + gg_lat;
                        return gcj02_lonlat;
                    };
                    /**
                     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
                     * 即谷歌、高德 转 百度
                     * @param lng
                     * @param lat
                     */


                    util.gcj02tobd09 = function(gcj_lnglat) {
                        var lat = +gcj_lnglat.split(",")[0];
                        var lng = +gcj_lnglat.split(",")[1];
                        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * util.x_PI);
                        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * util.x_PI);
                        var bd_lng = z * Math.cos(theta) + 0.0065;
                        var bd_lat = z * Math.sin(theta) + 0.006;
                        return bd_lng + ',' + bd_lat;
                    };
                    /**
                     * WGS84转GCj02
                     * @param lng
                     * @param lat
                     */


                    util.wgs84togcj02 = function(wgs_lnglat) {
                        var lat = +wgs_lnglat.split(",")[0];
                        var lng = +wgs_lnglat.split(",")[1];

                        if (util.out_of_china(lng, lat)) {
                            //return [lng, lat];
                            console.log("超出国界范围!");
                            return lng + ',' + lat;
                        } else {
                            var dlat = util.transformlat(lng - 105.0, lat - 35.0);
                            var dlng = util.transformlng(lng - 105.0, lat - 35.0);
                            var radlat = lat / 180.0 * util.PI;
                            var magic = Math.sin(radlat);
                            magic = 1 - util.ee * magic * magic;
                            var sqrtmagic = Math.sqrt(magic);
                            dlat = dlat * 180.0 / (util.a * (1 - util.ee) / (magic * sqrtmagic) * util.PI);
                            dlng = dlng * 180.0 / (util.a / sqrtmagic * Math.cos(radlat) * util.PI);
                            var mglat = lat + dlat;
                            var mglng = lng + dlng;
                            return mglng + ',' + mglat;
                        }
                    };
                    /**
                     * GCJ02 转换为 WGS84
                     * @param lng
                     * @param lat
                     */


                    util.gcj02towgs84 = function(gcj_lonlat) {
                        var lng = +gcj_lonlat.split(",")[0];
                        var lat = +gcj_lonlat.split(",")[1];

                        if (util.out_of_china(lng, lat)) {
                            //return [lng, lat];
                            console.log("超出国界范围!");
                            return lng + ',' + lat;
                        } else {
                            var dlat = util.transformlat(lng - 105.0, lat - 35.0);
                            var dlng = util.transformlng(lng - 105.0, lat - 35.0);
                            var radlat = lat / 180.0 * util.PI;
                            var magic = Math.sin(radlat);
                            magic = 1 - util.ee * magic * magic;
                            var sqrtmagic = Math.sqrt(magic);
                            dlat = dlat * 180.0 / (util.a * (1 - util.ee) / (magic * sqrtmagic) * util.PI);
                            dlng = dlng * 180.0 / (util.a / sqrtmagic * Math.cos(radlat) * util.PI);
                            var mglat = lat + dlat;
                            var mglng = lng + dlng;
                            var wgslng = lng * 2 - mglng;
                            var wgslat = lat * 2 - mglat;
                            return wgslng + ',' + wgslat;
                        }
                    };

                    util.transformlat = function(lng, lat) {
                        var lat = +lat;
                        var lng = +lng;
                        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
                        ret += (20.0 * Math.sin(6.0 * lng * util.PI) + 20.0 * Math.sin(2.0 * lng * util.PI)) * 2.0 / 3.0;
                        ret += (20.0 * Math.sin(lat * util.PI) + 40.0 * Math.sin(lat / 3.0 * util.PI)) * 2.0 / 3.0;
                        ret += (160.0 * Math.sin(lat / 12.0 * util.PI) + 320 * Math.sin(lat * util.PI / 30.0)) * 2.0 / 3.0;
                        return ret;
                    };

                    util.transformlng = function(lng, lat) {
                        var lat = +lat;
                        var lng = +lng;
                        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
                        ret += (20.0 * Math.sin(6.0 * lng * util.PI) + 20.0 * Math.sin(2.0 * lng * util.PI)) * 2.0 / 3.0;
                        ret += (20.0 * Math.sin(lng * util.PI) + 40.0 * Math.sin(lng / 3.0 * util.PI)) * 2.0 / 3.0;
                        ret += (150.0 * Math.sin(lng / 12.0 * util.PI) + 300.0 * Math.sin(lng / 30.0 * util.PI)) * 2.0 / 3.0;
                        return ret;
                    };
                    /**
                     * 判断是否在国内，不在国内则不做偏移
                     * @param lng
                     * @param lat
                     * @returns {boolean}
                     */


                    util.out_of_china = function(lng, lat) {
                        var lat = +lat;
                        var lng = +lng; // 纬度3.86~53.55,经度73.66~135.05

                        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.CoordTransformUtil = util;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/DetailInfoServices.js":
            /*!*****************************************************!*\
              !*** ./public/json/oldserver/DetailInfoServices.js ***!
              \*****************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.object.keys */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js");

                (function(window) {
                    var Service = function Service(options) {
                        this.opts = options;
                    };
                    /**
                     * 查询队站详情-消防
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getFireTeamDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                //主表里的关联字段
                                "localField": "tag.RESCOUNTY",
                                //字典表的关联字段
                                "foreignField": "tag.DISTRICTCODE",
                                //结果信息存放属性
                                "as": "district"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_RESOURCE_CATALOG",
                                //主表里的关联字段
                                "localField": "tag.TEAMSTATYPECODE",
                                //字典表的关联字段
                                "foreignField": "tag.NODEID",
                                //结果信息存放属性
                                "as": "teamstatype"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_JC_FIRETEAMPERSON",
                                //主表里的关联字段
                                "localField": "_id",
                                //字典表的关联字段
                                "foreignField": "tag.TEAMSTAID",
                                //结果信息存放属性
                                "as": "person"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_JC_EQUIPMENT",
                                //主表里的关联字段
                                "localField": "_id",
                                //字典表的关联字段
                                "foreignField": "tag.TEAMSTAID",
                                //结果信息存放属性
                                "as": "equipments"
                            }
                        }, {
                            //展开数组
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            //展开数组
                            "$unwind": {
                                path: "$teamstatype",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "district": "$district",
                                "teamstatype": "$teamstatype",
                                "persons": "$person",
                                "equipments": "$equipments",
                                "tag": "$tag"
                            }
                        }];
                        var aggregateObj = {};
                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = {};
                        aggregateObj.searchId = "query";
                        aggregateObj.dataSetId = "JYXX_TEA_RESCUE";
                        aggregateObj.queryIndex = 1;
                        this.aggregateMulti([aggregateObj], function(err, data) {
                            var obj = data.query[Object.keys(data.query)[0]][0];
                            var resultSet = {};
                            resultSet["result"] = obj;
                            cb.call(ctx, resultSet);
                        }, this);
                    };
                    /**
                     * 查询救援队详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getRescueTeamDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                //主表里的关联字段
                                "localField": "tag.RESCOUNTY",
                                //字典表的关联字段
                                "foreignField": "tag.DISTRICTCODE",
                                //结果信息存放属性
                                "as": "district"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_EQUIP_RESCUETYPE",
                                //主表里的关联字段
                                "localField": "tag.RESCUETYPECODE",
                                //字典表的关联字段
                                "foreignField": "tag.RESCUETYPECODE",
                                //结果信息存放属性
                                "as": "teamstatype"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_V_EQUIPMENT",
                                //主表里的关联字段
                                "localField": "_id",
                                //字典表的关联字段
                                "foreignField": "tag.RESCUEID",
                                //结果信息存放属性
                                "as": "equipments"
                            }
                        }, {
                            //展开数组
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            //展开数组
                            "$unwind": {
                                path: "$teamstatype",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "district": "$district",
                                "teamstatype": "$teamstatype",
                                "equipments": "$equipments",
                                "tag": "$tag"
                            }
                        }];
                        var aggregateObj = {};
                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = {};
                        aggregateObj.searchId = "query";
                        aggregateObj.dataSetId = "JYXX_TEA_RESCUE";
                        aggregateObj.queryIndex = 1;
                        this.aggregateMulti([aggregateObj], function(err, data) {
                            var obj = data.query[Object.keys(data.query)[0]][0];
                            var resultSet = {};
                            resultSet["result"] = obj;
                            cb.call(ctx, resultSet);
                        }, this);
                    };
                    /**
                     * 查询物资储备库
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getReposityDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_JC_MATERIAL_INFO",
                                //主表里的关联字段
                                "localField": "_id",
                                //字典表的关联字段
                                "foreignField": "tag.REPERTORYID",
                                //结果信息存放属性
                                "as": "materials"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                //主表里的关联字段
                                "localField": "tag.DISTRICTCODE",
                                //字典表的关联字段
                                "foreignField": "tag.DISTRICTCODE",
                                //结果信息存放属性
                                "as": "district"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_CODE_REP_LEVEL",
                                //主表里的关联字段
                                "localField": "tag.LEVELCODE",
                                //字典表的关联字段
                                "foreignField": "tag.LEVELCODE",
                                //结果信息存放属性
                                "as": "level"
                            }
                        }, {
                            //展开数组
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "tag": "$tag",
                                "materials": "$materials",
                                "district": "$district",
                                "level": "$level"
                            }
                        }];
                        var aggregateObj = {};
                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = {};
                        aggregateObj.searchId = "query";
                        aggregateObj.dataSetId = "JC_REPERTORY";
                        aggregateObj.queryIndex = 1;
                        this.aggregateMulti([aggregateObj], function(err, data) {
                            var obj = data.query[Object.keys(data.query)[0]][0];
                            var resultSet = {};
                            resultSet["result"] = obj;
                            cb.call(ctx, resultSet);
                        }, this);
                    };
                    /**
                     * 获取战勤保障详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getWarBaseDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_JC_FIRETEAMPERSON",
                                //主表里的关联字段
                                "localField": "_id",
                                //字典表的关联字段
                                "foreignField": "tag.TEAMSTAID",
                                //结果信息存放属性
                                "as": "persons"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_JC_EQUIPMENT",
                                //主表里的关联字段
                                "localField": "_id",
                                //字典表的关联字段
                                "foreignField": "tag.TEAMSTAID",
                                //结果信息存放属性
                                "as": "equipments"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                //主表里的关联字段
                                "localField": "tag.DISTRICTCODE",
                                //字典表的关联字段
                                "foreignField": "tag.DISTRICTCODE",
                                //结果信息存放属性
                                "as": "district"
                            }
                        }, {
                            //展开数组
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "name": "$tag.WARBASENAME",
                                "address": "$tag.ADDRESS",
                                "pernum": "$tag.PERNUM",
                                "carnum": "$tag.CARNUM",
                                "infoMan": "$tag.CONCATE",
                                "infoTel": "$tag.CONCATETEL",
                                "position": "$tag.POSITION",
                                "latitude": "$tag.LATITUDE",
                                "longitude": "$tag.LONGITUDE",
                                "persons": "$persons",
                                "equipments": "$equipments",
                                "district": "$district"
                            }
                        }];
                        var aggregateObj = {};
                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = {};
                        aggregateObj.searchId = "query";
                        aggregateObj.dataSetId = "JC_WARBASE";
                        aggregateObj.queryIndex = 1;
                        this.aggregateMulti([aggregateObj], function(err, data) {
                            var obj = data.query[Object.keys(data.query)[0]][0];
                            var resultSet = {};
                            resultSet["result"] = obj;
                            cb.call(ctx, resultSet);
                        }, this);
                    };
                    /**
                     * 查询专家详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getExpertDataDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_JC_EXPERT_EVENTREL",
                                "localField": "tag.EXPERTID",
                                "foreignField": "tag.EXPERTID",
                                "as": "EXPERT"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.DISTRICT",
                                "foreignField": "tag.DISTRICTCODE",
                                "as": "DIST"
                            }
                        }, {
                            "$unwind": "$EXPERT"
                        }, {
                            "$unwind": "$DIST"
                        }];
                        var aggregateObj = {};
                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = {};
                        aggregateObj.searchId = "query";
                        aggregateObj.dataSetId = "JC_EXPERT";
                        aggregateObj.queryIndex = 1;
                        this.aggregateMulti([aggregateObj], function(err, data) {
                            var obj = data.query[Object.keys(data.query)[0]][0];
                            var resultSet = {};
                            resultSet["result"] = obj;
                            cb.call(ctx, resultSet);
                        }, this);
                    };
                    /**
                     * 查询避难场所详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getShelterDataDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.DISTRICTCODE",
                                "foreignField": "tag.DISTRICTCODE",
                                "as": "DIST"
                            }
                        }, {
                            "$unwind": "$DIST"
                        }];
                        var aggregateObj = {};
                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = {};
                        aggregateObj.searchId = "query";
                        aggregateObj.dataSetId = "BAS_SHELTER";
                        aggregateObj.queryIndex = 1;
                        this.aggregateMulti([aggregateObj], function(err, data) {
                            var obj = data.query[Object.keys(data.query)[0]][0];
                            var resultSet = {};
                            resultSet["result"] = obj;
                            cb.call(ctx, resultSet);
                        }, this);
                    };
                    /**
                     * 多个管道执行方法-公共
                     * @param aggregateList 管道列表
                     * @param cb
                     * @param ctx
                     * @returns {*}
                     */


                    Service.prototype.aggregateMulti = function(aggregateList, cb, ctx) {
                        var opts = {},
                            data = {};
                        opts.url = EMAP_CONFIG.common.mongoService + '/dataStatics/aggregateMulti';
                        opts.dataType = 'json';
                        opts.type = 'post';
                        data.data = JSON.stringify(aggregateList);
                        data.eId = 'safety';
                        opts.data = data;

                        opts.success = function(d) {
                            cb && cb.call(ctx, null, d.data);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        return jQuery.ajax(opts);
                    };
                    /**
                     * 获取危化企业详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getDangerQYDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                //主表里的关联字段
                                "localField": "tag.COUNTY",
                                //字典表的关联字段
                                "foreignField": "tag.DISTRICTCODE",
                                //结果信息存放属性
                                "as": "district"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_CODE_DAGCHEM_PROPERTY",
                                //主表里的关联字段
                                "localField": "tag.PROPERTYCODE",
                                //字典表的关联字段
                                "foreignField": "tag.PROPERTYCODE",
                                //结果信息存放属性
                                "as": "property"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_CODE_DAGCHEM_ECONOMYTYPE",
                                //主表里的关联字段
                                "localField": "tag.ECONOMYTYPECODE",
                                //字典表的关联字段
                                "foreignField": "tag.ECONOMYTYPECODE",
                                //结果信息存放属性
                                "as": "economy"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_ANJIAN_DAGCHEM_TECH",
                                //主表里的关联字段
                                "localField": "tag.DAGCHEMENTID",
                                //字典表的关联字段
                                "foreignField": "tag.DAGCHEMENTID",
                                //结果信息存放属性
                                "as": "tech"
                            }
                        }, {
                            "$lookup": {
                                //字典表需要加上user_safety_前缀；
                                "from": "user_safety_ANJIAN_DAGCHEM_CHEM",
                                //主表里的关联字段
                                "localField": "tag.DAGCHEMENTID",
                                //字典表的关联字段
                                "foreignField": "tag.DAGCHEMENTID",
                                //结果信息存放属性
                                "as": "chem"
                            }
                        }, {
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$property",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$economy",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$tech",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$chem",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "tag": "$tag",
                                "district": "$district",
                                "property": "$property",
                                "economy": "$economy",
                                "tech": "$tech",
                                "chem": "$chem",
                                "geom": "$geom"
                            }
                        }];
                        var opts = {};
                        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
                        var data = {};
                        data.dataSetId = 'ANJIAN_DAGCHEMENT';
                        data.eId = 'safety';
                        data.query = JSON.stringify({});
                        data.aggregate = JSON.stringify(aggregate);
                        opts.data = data;
                        opts.type = 'post';

                        opts.success = function(data) {
                            cb && cb.call(ctx, null, data.data);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        jQuery.ajax(opts);
                    };
                    /**
                     * 获取工贸企业详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getGMQYDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.COUNTY",
                                "foreignField": "tag.DISTRICTCODE",
                                "as": "district"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_ENTERPRISE_INDUSTRY",
                                "localField": "tag.INDUSTRYCODE",
                                "foreignField": "tag.INDUSTRYCODE",
                                "as": "industry"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_ENTERPRISE_NATURE",
                                "localField": "tag.ENTNATURECODE",
                                "foreignField": "tag.ENTNATURECODE",
                                "as": "nature"
                            }
                        }, {
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$industry",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$nature",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "tag": "$tag",
                                "district": "$district",
                                "industry": "$industry",
                                "nature": "$nature",
                                "geom": "$geom"
                            }
                        }];
                        var opts = {};
                        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
                        var data = {};
                        data.dataSetId = 'ANJIAN_ENT_WHSMYHBZ';
                        data.eId = 'safety';
                        data.query = JSON.stringify({});
                        data.aggregate = JSON.stringify(aggregate);
                        opts.data = data;
                        opts.type = 'post';

                        opts.success = function(data) {
                            cb && cb.call(ctx, null, data.data);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        jQuery.ajax(opts);
                    };
                    /**
                     * 获取煤矿企业详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getMKQYDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.COUNTY",
                                "foreignField": "tag.DISTRICTCODE",
                                "as": "district"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_COAL_STATE",
                                "localField": "tag.COALSTATECODE",
                                "foreignField": "tag.COALSTATECODE",
                                "as": "state"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_COAL_TYPE",
                                "localField": "tag.COALTYPECODE",
                                "foreignField": "tag.COALTYPECODE",
                                "as": "type"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_COAL_DEPTCLASS",
                                "localField": "tag.DEPTCLASS",
                                "foreignField": "tag.DEPTCLASS",
                                "as": "dept"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_COAL_WSGRADE",
                                "localField": "tag.WS_GRADE",
                                "foreignField": "tag.WS_GRADE",
                                "as": "ws"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_COAL_MINESTYLE",
                                "localField": "tag.MINESTYLE",
                                "foreignField": "tag.MINESTYLE",
                                "as": "mine"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_COAL_TRANSMITSTYLE",
                                "localField": "tag.TRANSMITSTYLE",
                                "foreignField": "tag.TRANSMITSTYLE",
                                "as": "transmit"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_COAL_POWERSTYLE",
                                "localField": "tag.OWERSTYLE",
                                "foreignField": "tag.OWERSTYLE",
                                "as": "power"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_COAL_HYDROGEOLOGICAL",
                                "localField": "tag.HYDROGEOLOGICAL",
                                "foreignField": "tag.HYDROGEOLOGICAL",
                                "as": "hydro"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_COAL_VENTILATESTYLE",
                                "localField": "tag.VENTILATESTYLE",
                                "foreignField": "tag.VENTILATESTYLE",
                                "as": "vent"
                            }
                        }, {
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$state",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$type",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$dept",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$ws",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$mine",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$transmit",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$power",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$hydro",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$vent",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "tag": "$tag",
                                "district": "$district",
                                "state": "$state",
                                "type": "$type",
                                "dept": "$dept",
                                "ws": "$ws",
                                "mine": "$mine",
                                "transmit": "$transmit",
                                "power": "$power",
                                "hydro": "$hydro",
                                "vent": "$vent",
                                "geom": "$geom"
                            }
                        }];
                        var opts = {};
                        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
                        var data = {};
                        data.dataSetId = 'ANJIAN_COAL';
                        data.eId = 'safety';
                        data.query = JSON.stringify({});
                        data.aggregate = JSON.stringify(aggregate);
                        opts.data = data;
                        opts.type = 'post';

                        opts.success = function(data) {
                            cb && cb.call(ctx, null, data.data);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        jQuery.ajax(opts);
                    };
                    /**
                     * 获取非煤矿企业详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getFMKQYDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.COUNTY",
                                "foreignField": "tag.DISTRICTCODE",
                                "as": "district"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_TAILINGPOND_RUNSTATUS",
                                "localField": "tag.RUNSTATUSCODE",
                                "foreignField": "tag.RUNSTATUSCODE",
                                "as": "state"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_TAILINGPOND_TYPE",
                                "localField": "tag.TAILINGPONDTYPE",
                                "foreignField": "tag.TAILINGPONDTYPE",
                                "as": "type"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_TAILINGPOND_GRADE",
                                "localField": "tag.WKKDBCODE",
                                "foreignField": "tag.WKKDBCODE",
                                "as": "dept"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_TAILINGPOND_GRADE",
                                "localField": "tag.WKKDBCODE",
                                "foreignField": "tag.WKKDBCODE",
                                "as": "ws"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_TAILINGPOND_SAFETY",
                                "localField": "tag.WKKAQDCODE",
                                "foreignField": "tag.WKKAQDCODE",
                                "as": "mine"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_TAILINGPOND_INDUSTRY",
                                "localField": "tag.WKKSSHYCODE",
                                "foreignField": "tag.WKKSSHYCODE",
                                "as": "transmit"
                            }
                        }, {
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$state",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$type",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$dept",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$ws",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$mine",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$transmit",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "tag": "$tag",
                                "district": "$district",
                                "state": "$state",
                                "type": "$type",
                                "dept": "$dept",
                                "ws": "$ws",
                                "mine": "$mine",
                                "transmit": "$transmit",
                                "geom": "$geom"
                            }
                        }];
                        var opts = {};
                        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
                        var data = {};
                        data.dataSetId = 'ANJIAN_TAILINGPOND';
                        data.eId = 'safety';
                        data.query = JSON.stringify({});
                        data.aggregate = JSON.stringify(aggregate);
                        opts.data = data;
                        opts.type = 'post';

                        opts.success = function(data) {
                            cb && cb.call(ctx, null, data.data);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        jQuery.ajax(opts);
                    };
                    /**
                     * 获取地质灾害详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getGEODISASTERDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.DISTRICTCODE",
                                "foreignField": "tag.DISTRICTCODE",
                                "as": "district"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_GEOLOGICHAZARD_TYPE",
                                "localField": "tag.GEOHAZARDTYPECODE",
                                "foreignField": "tag.GEOHAZARDTYPECODE",
                                "as": "geohazardtype"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_HAZARDLEVEL",
                                "localField": "tag.HAZARDLEVELCODE",
                                "foreignField": "tag.HAZARDLEVELCODE",
                                "as": "hazardlevel"
                            }
                        }, {
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$geohazardtype",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$hazardlevel",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "tag": "$tag",
                                "district": "$district",
                                "geohazardtype": "$geohazardtype",
                                "hazardlevel": "$hazardlevel",
                                "geom": "$geom"
                            }
                        }];
                        var opts = {};
                        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
                        var data = {};
                        data.dataSetId = 'BAS_GEOLOGICHAZARD';
                        data.eId = 'safety';
                        data.query = JSON.stringify({});
                        data.aggregate = JSON.stringify(aggregate);
                        opts.data = data;
                        opts.type = 'post';

                        opts.success = function(data) {
                            cb && cb.call(ctx, null, data.data);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        jQuery.ajax(opts);
                    };
                    /**
                     * 获取烟花爆竹企业详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getYHBZQYDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.COUNTY",
                                "foreignField": "tag.DISTRICTCODE",
                                "as": "district"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_FIRENT_DEPTTYPE",
                                "localField": "tag.DEPTTYPECODE",
                                "foreignField": "tag.DEPTTYPECODE",
                                "as": "dept"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_ANJIAN_FIRENT_CREDTYPE",
                                "localField": "tag.CREDTYPECODE",
                                "foreignField": "tag.CREDTYPECODE",
                                "as": "cred"
                            }
                        }, {
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$dept",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$cred",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "tag": "$tag",
                                "dept": "$dept",
                                "cred": "$cred",
                                "district": "$district",
                                "geom": "$geom"
                            }
                        }];
                        var opts = {};
                        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
                        var data = {};
                        data.dataSetId = 'ANJIAN_FIREWORKENT';
                        data.eId = 'safety';
                        data.query = JSON.stringify({});
                        data.aggregate = JSON.stringify(aggregate);
                        opts.data = data;
                        opts.type = 'post';

                        opts.success = function(data) {
                            cb && cb.call(ctx, null, data.data);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        jQuery.ajax(opts);
                    };
                    /**
                     * 获取重大危险源详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getDangerDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_HAZARDLEVEL",
                                "localField": "tag.HAZARDLEVELCODE",
                                "foreignField": "tag.HAZARDLEVELCODE",
                                "as": "hazardlevel"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DANGERTYPE",
                                "localField": "tag.DANGERTYPECODE",
                                "foreignField": "tag.DANGERTYPECODE",
                                "as": "dangertype"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.COUNTY",
                                "foreignField": "tag.DISTRICTCODE",
                                "as": "district"
                            }
                        }, {
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$hazardlevel",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            "$unwind": {
                                path: "$dangertype",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "tag": "$tag",
                                "dangertype": "$dangertype",
                                "hazardlevel": "$hazardlevel",
                                "district": "$district",
                                "geom": "$geom"
                            }
                        }];
                        var opts = {};
                        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
                        var data = {};
                        data.dataSetId = 'ANJIAN_DANGER';
                        data.eId = 'safety';
                        data.query = JSON.stringify({});
                        data.aggregate = JSON.stringify(aggregate);
                        opts.data = data;
                        opts.type = 'post';

                        opts.success = function(data) {
                            cb && cb.call(ctx, null, data.data);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        jQuery.ajax(opts);
                    };
                    /**
                     * 获取基础数据详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getBaseDataDetail = function(id, tablename, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.DISTRICTCODE",
                                "foreignField": "tag.DISTRICTCODE",
                                "as": "district"
                            }
                        }, {
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "tag": "$tag",
                                "district": "$district",
                                "geom": "$geom"
                            }
                        }];
                        var opts = {};
                        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
                        var data = {};
                        data.dataSetId = tablename;
                        data.eId = 'safety';
                        data.query = JSON.stringify({});
                        data.aggregate = JSON.stringify(aggregate);
                        opts.data = data;
                        opts.type = 'post';

                        opts.success = function(data) {
                            cb && cb.call(ctx, null, data.data);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        jQuery.ajax(opts);
                    };
                    /**
                     * 获取装备数据详情
                     * @param id
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getEquipDataDetail = function(id, cb, ctx) {
                        var aggregate = [{
                            $match: {
                                _id: id
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.RESCOUNTY",
                                "foreignField": "tag.DISTRICTCODE",
                                "as": "district"
                            }
                        }, {
                            "$unwind": {
                                path: "$district",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $project: {
                                "tag": "$tag",
                                "district": "$district",
                                "geom": "$geom"
                            }
                        }];
                        var opts = {};
                        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
                        var data = {};
                        data.dataSetId = "V_EQUIPMENT";
                        data.eId = 'safety';
                        data.query = JSON.stringify({});
                        data.aggregate = JSON.stringify(aggregate);
                        opts.data = data;
                        opts.type = 'post';

                        opts.success = function(data) {
                            cb && cb.call(ctx, null, data.data);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        jQuery.ajax(opts);
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.DetailInfoServices = Service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/DistrictUtil.js":
            /*!***********************************************!*\
              !*** ./public/json/oldserver/DistrictUtil.js ***!
              \***********************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.map */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.map.js");

                __webpack_require__( /*! core-js/modules/es.object.to-string */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.to-string.js");

                __webpack_require__( /*! core-js/modules/es.regexp.exec */ "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.exec.js");

                __webpack_require__( /*! core-js/modules/es.regexp.to-string */ "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.to-string.js");

                __webpack_require__( /*! core-js/modules/es.string.ends-with */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.ends-with.js");

                __webpack_require__( /*! core-js/modules/es.string.replace */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.replace.js");

                __webpack_require__( /*! core-js/modules/es.string.search */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.search.js");

                __webpack_require__( /*! core-js/modules/es.string.split */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.split.js");

                __webpack_require__( /*! core-js/modules/es.string.starts-with */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.starts-with.js");

                __webpack_require__( /*! core-js/modules/es.string.trim */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.trim.js");

                (function(window) {
                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.DistrictUtil = {};

                    window.EMapServerV2.DistrictUtil.getDistrict = function(districtCodes, callback, context) {
                        var requestHandler = function requestHandler(data, status, xhr) {
                            if (data == null) {
                                console.error('请求后台出错！' + status);
                            } else {
                                if (data && data.success) {
                                    if (G.utils.CommonUtil.isFunction(callback)) {
                                        context = context || window;
                                        callback.call(context, data.data.result);
                                    }
                                } else {
                                    //alert(data.msg);
                                    console.info('DistrictUtil.getDistrict data.msg=' + data.msg);
                                }
                            }
                        };

                        var districtCodeArr = districtCodes.split(','),
                            districtCode = districtCodeArr[0];
                        var query = {},
                            or = [];

                        for (var k = 0, len = districtCodeArr.length; k < len; k++) {
                            or.push({
                                "tag.adcode": districtCodeArr[k]
                            });
                        }

                        query['$or'] = or; //

                        var table = '';
                        query = JSON.stringify(query);

                        if (districtCode == '000000') {
                            table = window.EMapServerV2.DistrictUtil._getDicTableName('country');
                            query = '';
                        } else if (districtCode.endsWith('0000')) {
                            table = window.EMapServerV2.DistrictUtil._getDicTableName('province');
                        } else if (districtCode.endsWith('00')) {
                            table = window.EMapServerV2.DistrictUtil._getDicTableName('city');
                        } else {
                            table = window.EMapServerV2.DistrictUtil._getDicTableName('county');
                        }

                        var ajax = G.utils.CommonUtil.ajaxGetData({
                            url: this._getQueryUrl(),
                            data: {
                                query: query,
                                dataSetId: table,
                                limit: 100,
                                eId: 'siptea'
                            }
                        }, requestHandler);
                        return ajax;
                    };
                    /***
                     * 获取政区表配置
                     * @param key
                     * @param evacuationIndex
                     * @param fullName true要表名；false要查询名；
                     * @returns {*}
                     * @private
                     */


                    window.EMapServerV2.DistrictUtil._getDicTableName = function(key, evacuationIndex, fullName) {
                        var districtTables = G.static.districtTables,
                            tableCfg = districtTables[key],
                            tableName;

                        if (tableCfg) {
                            tableName = fullName ? tableCfg.fullName : tableCfg.shortName;

                            if (tableCfg.evacuationParams && tableCfg.evacuationParams.length > 0) {
                                evacuationIndex = isNaN(evacuationIndex) ? 0 : evacuationIndex;
                                tableName += tableCfg.evacuationParams[evacuationIndex];
                            }
                        }

                        return tableName;
                    };
                    /***
                     * 获取政区统计
                     * @param options
                     * options.tableName 表名
                     * options.districtKey 政区字段名
                     * options.classifyKey 分类统计的字段名
                     * options.statisticsLevel : 政区统计的级别 'province':省;'city':市;'county':县
                     * options.query 过滤条件如
                     * options.aggregate 管道
                     * "query":{"tag.EXPERTTYPECODE":"1"}
                     * options.extra 需要在回调传回的参数
                     * @param callback
                     * @param context
                     */


                    window.EMapServerV2.DistrictUtil.getStatistics = function(options, callback, context) {;

                        var url = this._getStaticsQueryUrl(),
                            aggregate;

                        if (options.aggregate) {
                            aggregate = jQuery.extend(true, [], options.aggregate);
                        } else {
                            aggregate = [];
                        } //添加管道；


                        getDistrictPipline(aggregate, options);
                        aggregate = JSON.stringify(aggregate);
                        aggregate = replaceStrs(aggregate, [/\$\{districtKey\}/g], [options.districtKey]);
                        aggregate = replaceStrs(aggregate, [/\$\{classifyKey\}/g], [options.classifyKey]);
                        var query = {
                            "tag.${districtKey}": {
                                "$regex": ".*"
                            }
                        }; //接收过滤条件

                        if (typeof options.query == 'string') {
                            try {
                                options.query = JSON.parse(options.query);
                            } catch (e) {
                                options.query = {};
                            }
                        }

                        jQuery.extend(query, options.query || {});
                        query = replaceStrs(JSON.stringify(query), [/\$\{districtKey\}/g], [options.districtKey]); //

                        var data = {
                            eId: G.utils.CommonUtil.eId,
                            dataSetId: options.tableName,
                            query: query,
                            aggregate: aggregate
                        };
                        G.utils.CommonUtil.showLoading(true);
                        return G.utils.CommonUtil.ajaxGet({
                            url: url,
                            data: data,
                            dataType: 'jsonp'
                        }, function(d, s, f, opts) {
                            var results = window.EMapServerV2.DistrictUtil.refineStatisticsData(d.data, opts.classifyKey);

                            if (Object.prototype.toString.call(callback) === '[object Function]') {
                                callback.call(context || this, results, opts.extra);
                            }

                            G.utils.CommonUtil.showLoading(false);
                        }, null, options);
                        /**
                         *  获取查询管道
                         */

                        function getDistrictPipline(agg, opts) {
                            var statisticsLevel = opts.statisticsLevel || 'province';
                            var strOper,
                                tableCfgs = G.static.districtTables,
                                tableCfg,
                                dicTable;
                            tableCfg = tableCfgs[statisticsLevel];
                            dicTable = window.EMapServerV2.DistrictUtil._getDicTableName(statisticsLevel, 0, true);

                            switch (statisticsLevel) {
                                case 'province':
                                    {
                                        strOper = {
                                            "$concat": [{
                                                "$substr": ["$tag.${districtKey}", 0, 2]
                                            }, "0000"]
                                        };
                                        break;
                                    }

                                case 'city':
                                    {
                                        strOper = {
                                            "$concat": [{
                                                "$substr": ["$tag.${districtKey}", 0, 4]
                                            }, "00"]
                                        };
                                        break;
                                    }

                                case 'county':
                                    {
                                        break;
                                    }
                            }

                            if (options.classifyKey) {
                                //是否有分类统计
                                if (strOper) {
                                    agg.push({
                                        "$project": {
                                            "tag.${districtKey}": strOper,
                                            "tag.${classifyKey}": "$tag.${classifyKey}"
                                        }
                                    });
                                }

                                agg.push({
                                    "$group": {
                                        "_id": {
                                            "district": "$tag.${districtKey}",
                                            "${classifyKey}": "$tag.${classifyKey}"
                                        },
                                        "count": {
                                            "$sum": 1
                                        }
                                    }
                                });
                            } else {
                                if (strOper) {
                                    agg.push({
                                        "$project": {
                                            "tag.${districtKey}": strOper
                                        }
                                    });
                                }

                                agg.push({
                                    "$group": {
                                        "_id": {
                                            "district": "$tag.${districtKey}"
                                        },
                                        "count": {
                                            "$sum": 1
                                        }
                                    }
                                });
                            } //配置字典项


                            var lookup = {
                                "$lookup": {
                                    "from": dicTable,
                                    "localField": "_id.district",
                                    "foreignField": "tag.adcode",
                                    "as": "_id.district"
                                }
                            };
                            agg.push(lookup);
                        }
                        /**
                         *
                         * @param src
                         * @param regexs arr
                         * @param replaces arr
                         */


                        function replaceStrs(src, regexs, replaces) {
                            var i = 0,
                                len = regexs.length;

                            for (; i < len; i++) {
                                var regex = regexs[i],
                                    replace = replaces[i] || '';

                                while (regex.test(src)) {
                                    src = src.replace(regex, replace);
                                }
                            }

                            return src;
                        }
                    };
                    /**
                     * 组装统计数据
                     * @param dataArr
                     * @param classifyKey 非空 =按行政区划&分类统计的字段名；空值表示只按行政区划统计;
                     *已知验证模块：可视化模块（危化品,大喇叭）
                     */


                    window.EMapServerV2.DistrictUtil.refineStatisticsData = function(dataArr, classifyKey) {
                        var i = 0,
                            len = dataArr.length,
                            results = {}; //两对象取一个有意义的值

                        function getTwoObjHas(oneObj, twoObj) {
                            return oneObj || twoObj;
                        } //处理分类为空的方法


                        function doClassifyKeyUndefined() {
                            for (; i < len; i++) {
                                var d = dataArr[i];

                                if (d) {
                                    var obj = {},
                                        dicts = getTwoObjHas(d._id.district, []),
                                        dict = getTwoObjHas(dicts[0], {});
                                    obj.value = d.count;
                                    jQuery.extend(obj, getTwoObjHas(dict.tag, {}));
                                    var gov = getTwoObjHas(obj.gov, ''),
                                        lnglats = gov.trim().split(',');

                                    if (gov) {
                                        obj.longitude = lnglats[0];
                                        obj.latitude = lnglats[1];
                                        delete obj.gov;
                                    }

                                    results[obj.adcode] = obj;
                                }
                            }

                            return results;
                        }

                        ; //处理分类不为空的方法

                        function doClassifyKeyHas() {
                            var itemKeys = {},
                                resultObj = {},
                                keys = '';

                            for (; i < len; i++) {
                                var d = dataArr[i];

                                if (d) {
                                    var dicts = getTwoObjHas(d._id.district, []),
                                        dict = getTwoObjHas(dicts[0], {});

                                    if (!(dict && dict.tag)) {
                                        continue;
                                    }

                                    var obj = resultObj[dict.tag.adcode],
                                        classifyVal = d._id[classifyKey]; //政区统计

                                    if (!obj) {
                                        obj = {
                                            items: {}
                                        };
                                        jQuery.extend(obj, getTwoObjHas(dict.tag, {}));
                                        var gov = getTwoObjHas(obj.gov, ''),
                                            lnglats = gov.trim().split(',');

                                        if (gov) {
                                            obj.longitude = lnglats[0];
                                            obj.latitude = lnglats[1];
                                            delete obj.gov;
                                        }

                                        resultObj[obj.adcode] = obj;
                                    }

                                    obj.items[classifyVal] = d.count;
                                    itemKeys[classifyVal] = true;
                                }
                            }

                            for (var key0 in itemKeys) {
                                if (key0 != null) {
                                    keys += key0 + ',';
                                }
                            }

                            if (keys && keys.endsWith(',')) {
                                keys = keys.substr(0, keys.length - 1);
                            }

                            results[keys] = resultObj;
                            return results;
                        }

                        ;

                        if (classifyKey) {
                            results = doClassifyKeyHas();
                        } else {
                            results = doClassifyKeyUndefined();
                        }

                        return results;
                    };
                    /**
                     * 获取查询路径
                     * @returns {*}
                     * @private
                     */


                    window.EMapServerV2.DistrictUtil._getQueryUrl = function() {
                        var service = G.utils.CommonUtil.getServiceConfig() || {};
                        return service.dataServerIP + '/' + service.dataServerPageQuery;
                    };
                    /**
                     * 获取多表查询路径
                     * @returns {*}
                     * @private
                     */


                    window.EMapServerV2.DistrictUtil._getMultiQueryUrl = function() {
                        var service = G.utils.CommonUtil.getServiceConfig() || {};
                        return service.dataServerIP + '/' + service.dataServerQuery;
                    };
                    /**
                     * 获取统计查询路径
                     * @returns {*}
                     * @private
                     */


                    window.EMapServerV2.DistrictUtil._getStaticsQueryUrl = function() {
                        var service = G.utils.CommonUtil.getServiceConfig() || {};
                        return service.dataServerIP + '/' + service.dataServerStatistics;
                    };

                    window.EMapServerV2.DistrictUtil.search = function(options, callback) {
                        // options.eId = 'siptea';
                        // var ajax = window.EMapServerV2.DistrictUtil.ajaxPostData({
                        //     url: EMAP_CONFIG.common.mongoService + '/biz/district/search',
                        //     data: options,
                        //     showLoading: false,
                        //     async: true
                        // }, window.EMapServerV2.DistrictUtil.search._callback, null, callback);
                        // return ajax;
                    };

                    window.EMapServerV2.DistrictUtil.search._callback = function(data, status, xhr, callback) {
                        if (data == null) {
                            console.error('请求后台出错！' + status);
                        } else {
                            if (data && data.success) {
                                callback(data.data);
                            } else {
                                //alert(data.msg);
                                console.info('DistrictUtil.search._callback data.msg= ' + data.msg);
                            }
                        }
                    };

                    window.EMapServerV2.DistrictUtil.ajaxPostData = function(options, callback, context, param) {
                        var opts = jQuery.extend({}, options); // console.log(options.data.data)

                        if (opts.url && !opts.url.startsWith('http')) {
                            if (!opts.url.startsWith('/')) {
                                opts.url = '/' + opts.url;
                            }

                            opts.url = EMAP_CONFIG.common.mongoService;
                        }

                        opts.type = 'post';
                        opts.dataType = 'json';
                        opts.async = options.async === false ? false : true; //添加参数

                        opts.data = opts.data || {};
                        opts.data.eId = opts.data.eId || window.EMapServerV2.DistrictUtil.eId; //

                        opts.success = function(data, status, xhr) {
                            window.EMapServerV2.DistrictUtil.isFunction(callback) && callback.call(context || window, data, status, xhr, param); // if (options.showLoading) {
                            //     window.EMapServerV2.DistrictUtil.showLoading(false);
                            // }
                        };

                        opts.error = function(xhr, status, msg) {
                            console.error(options.url + " request failed!");
                            window.EMapServerV2.DistrictUtil.isFunction(callback) && callback.call(context || window, null, status, msg, param); // if (options.showLoading) {
                            //     window.EMapServerV2.DistrictUtil.showLoading(false);
                            // }
                        }; // if (options.showLoading) {
                        //     window.EMapServerV2.DistrictUtil.showLoading(true);
                        // }


                        return jQuery.ajax(opts);
                    };
                    /**
                     * 是否是函数
                     * @param obj {Object} 必填，需要判断的参数
                     * @returns {boolean}
                     */


                    window.EMapServerV2.DistrictUtil.isFunction = function(obj) {
                        return Object.prototype.toString.call(obj) === '[object Function]';
                    };
                    /**
                     * 聚合管道查询
                     * @param obj.dataSetId 数据集ID(表名)
                     * @param obj.query 查询条件对象
                     * @param obj.fieldMap key:表字段名 value:别名
                     * @param obj.pipeline 管道数组
                     * @parma callback 回调函数
                     * @example
                     * G.utils.DistrictUtil.aggregate({
                            eId:'siptea',
                            dataSetId:'province0.01',
                            fieldMap:{
                                adcode:'a',
                                name:'b'
                            }
                        },function(){
                            console.info(arguments);
                        });
                     */

                    /**
                     *叠加行政区划面数据
                     * @param districCodes 行政区划对象集合 包含level id
                     * @param drawLayer 标绘的图岑
                     * @param districEles 存储element的对象
                     * @param districGeoJsons 存储geojson的对象
                     * @param symbol 标绘的样式
                     * @private
                     */


                    window.EMapServerV2.DistrictUtil._addDistricPolygonToLayer_ProcessData = function(data, param, drawLayer) {
                        if (data == undefined) return;
                        if (data.length < 1) return;

                        for (var i = 0; i < data.length > 0; i++) {
                            if (!param.districEles[data[i].adcode]) {
                                var polygonGeometry = g2.sfs.GeometryFactory.createGeometryFromGeoJson(data[i].geom, param.map.spatialReference);
                                var ring = new g2.sfs.Ring({
                                    spatialReference: param.map.spatialReference
                                });
                                polygonGeometry.addGeometry(ring);
                                var polygonEle = new g2.sfs.Element({
                                    geometry: polygonGeometry,
                                    symbol: symbol,
                                    id: data[i].adcode
                                });
                                drawLayer.add(polygonEle);
                                param.districEles[data[i].adcode] = polygonEle;
                            }

                            param.districGeoJsons[data[i].adcode] = data[i].geom;
                        }
                    };
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/EmerSourceService.js":
            /*!****************************************************!*\
              !*** ./public/json/oldserver/EmerSourceService.js ***!
              \****************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.slice */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.slice.js");

                __webpack_require__( /*! core-js/modules/es.number.constructor */ "./node_modules/_core-js@3.6.5@core-js/modules/es.number.constructor.js");

                (function(window) {
                    var Service = function Service(opts) {
                        var options = {
                            //资源类型
                            resourceKeys: ['RescueTeam※03', //救援队
                                'floodteam', 'fireteam', 'transportationteam', 'forestfireteam', 'hazardousteam', 'mineteam', 'nonmineteam', 'corecompetenceteam', 'transportationteam', 'powerteam', 'mobileteam', 'gasteam', 'environmentteam', 'salvageteam', 'searescueteam', 'shipspillteam', 'healthyteam', 'portrescueteam', 'portpassengerteam', 'portconstructionteam', 'buildingemergencyteam', 'passengeremergencyteam', 'emergencytransportteam', 'snowteam', 'equipteam', 'civilianteam', 'equipment', //救援装备
                                'v_equipment※02', 'v_equipment※03', 'v_equipment※04', 'v_equipment※05', 'v_equipment※06', 'v_equipment※07', 'v_equipment※08', 'v_equipment※09', 'v_equipment※10', 'v_equipment※11', 'v_equipment※12', 'v_equipment※13', 'v_equipment※14', 'v_equipment※15', 'v_equipment※16', 'v_equipment※17', 'v_equipment※18', 'v_equipment※19', 'v_equipment※20', 'v_equipment※21', 'v_equipment※22', 'v_equipment※23', 'v_equipment※24', 'v_equipment※25', 'v_equipment※26', 'v_equipment※27', 'v_equipment※28', 'v_equipment※29', 'v_equipment※30', 'v_equipment※31', 'v_equipment※32', 'v_equipment※33', 'v_equipment※34', 'v_equipment※35', 'v_equipment※36', 'v_equipment※37', 'v_equipment※38', 'v_equipment※39', 'v_equipment※40', 'v_equipment※41', 'v_equipment※42', 'v_equipment※43', 'v_equipment※44', 'v_equipment※45', 'v_equipment※46', 'v_equipment※47', 'v_equipment※48', 'v_equipment※49', 'v_equipment_list※01', //救援装备
                                'v_equipment_list※02', 'v_equipment_list※03', 'v_equipment_list※04', 'v_equipment_list※05', 'v_equipment_list※06', 'v_equipment_list※07', 'v_equipment_list※08', 'v_equipment_list※09', 'v_equipment_list※10', 'v_equipment_list※11', 'v_equipment_list※12', 'v_equipment_list※13', 'v_equipment_list※14', 'v_equipment_list※15', 'v_equipment_list※16', 'v_equipment_list※17', 'v_equipment_list※18', 'v_equipment_list※19', 'v_equipment_list※20', 'v_equipment_list※21', 'v_equipment_list※22', 'v_equipment_list※23', 'v_equipment_list※24', 'v_equipment_list※25', 'v_equipment_list※26', 'v_equipment_list※27', 'v_equipment_list※28', 'v_equipment_list※29', 'v_equipment_list※30', 'v_equipment_list※31', 'v_equipment_list※32', 'v_equipment_list※33', 'v_equipment_list※34', 'v_equipment_list※35', 'v_equipment_list※36', 'v_equipment_list※37', 'v_equipment_list※38', 'v_equipment_list※39', 'v_equipment_list※40', 'v_equipment_list※41', 'v_equipment_list※42', 'v_equipment_list※43', 'v_equipment_list※44', 'v_equipment_list※45', 'v_equipment_list※46', 'v_equipment_list※47', 'v_equipment_list※48', 'v_equipment_list※49', 'ANJIAN_REPERTORY※01', //物资储备库
                                'generalrepository', 'floodrepository', 'cityrepository', 'firerepository', 'firepreventionrepository', 'powerrepository', 'communicationrepository', 'biologyrepository', 'airrepository', 'oilrepository', 'earthrepository', 'pottrepository', 'Expert※01', //专家
                                'nonmineexpert', 'chemicalexpert', 'tradexpert', 'emergenceexpert', 'fireexpert', 'floodexpert', 'earthquakeexpert', 'fireworkexpert', 'lawexpert', 'infomationexpert', 'Expert※12', 'Expert※13', 'Expert※14', 'Expert※15', 'Expert※16', 'Expert※17', 'Expert※18', 'Expert※19', 'Expert※20', 'Expert※21', 'Expert※22', 'Expert※23', 'Expert※24', 'Expert※25', 'Expert※26', 'Expert※27', 'Expert※28', 'Expert※29', 'Expert※30', 'Expert※31', 'for_watersourceport', 'for_waterport', 'for_watersource', 'FOR_WATERSOURCE※04', 'forestfireteam', 'firepreventionrepository', 'airport', // 机场
                                'shelter', //避难场所
                                'JC_WARBASE※01', 'for_forestfarm', //全国国有林场
                                'for_naturalreserve' //自然保护区
                            ]
                        };
                        this.opts = jQuery.extend(true, options, opts); // this.commonService = window.EMapServerV2.CommonService.getInstance(opts);

                        this.commonService = new window.EMapServerV2.CommonService(opts);
                    };
                    /**
                     *
                     * @param opts
                     * @param opts.resourceKeys
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getStatistics = function(opts, callback, ctx) {
                        opts = opts || {};
                        var resourceKeys = opts.resourceKeys || this.opts.resourceKeys.slice(0);
                        this.commonService.getStatistics(resourceKeys, {}, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };
                    /**
                     * 按条件统计
                     * @param opts
                     * @param opts.districtCode
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getStatisticsByFilter = function(opts, callback, ctx) {
                        var filter = {};
                        opts = opts || {};
                        filter.districtCode = opts.districtCode;
                        this.commonService.getStatistics(this.opts.resourceKeys, filter, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };
                    /**
                     * 查询列表数据
                     * @param opts
                     * @param opts.keyword 关键字
                     * @param opts.resourceKey，多个逗号分隔
                     * @param opts.pageSize
                     * @param opts.pageIndex
                     * @param opts.districtCode
                     * @param opts.fields 字段列表（筛选字段）
                     * @param opts.id 主键筛选
                     * @param opts.filter
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getDataList = function(opts, callback, ctx) {
                        opts = opts || {};
                        opts.flatTag = true;
                        this.commonService.getDataList(opts, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };

                    Service.prototype.getNearbyList = function(opts, callback, ctx) {
                        opts = opts || {};
                        opts.flatTag = true; // opts.resourceKeys = this.opts.resourceKeys;

                        var radius = opts.radius;
                        this.commonService.getEventData(opts.eventType, function(err, data) {
                            var config = opts.config || {}; //读取默认距离配置、传参的距离
                            // var configRadius = data.tag.SEARCH_DIST;
                            // if (configRadius != null && configRadius != '' && !isNaN(configRadius)) {
                            //   configRadius = parseFloat(configRadius) * 1000;
                            // } else {
                            //   configRadius = 1000 * 1000;
                            // }
                            // for (var i = 0; i < this.opts.resourceKeys.length; i++) {
                            //   var resourceKey = this.opts.resourceKeys[i];
                            //   if (config.hasOwnProperty(resourceKey)) {
                            //     if (!config[resourceKey].radius) {
                            //       config[resourceKey].radius = opts.radius;
                            //     }
                            //   } else {
                            //     config[resourceKey] = {
                            //       radius: opts.radius
                            //     }
                            //   }
                            // }

                            this.commonService.getNearbyList(opts, function(err, resultSet) {
                                var list = resultSet.list;
                                resultSet.radius = list[0] ? list[0].radius : radius; //危化企业根据产量分类

                                for (var i = 0; i < list.length; i++) {
                                    var item = list[i];

                                    if (item && item.codeKey === this.opts.resourceKeys[0]) {
                                        var itemList = item.data;
                                        var rangeMap = {
                                            '1000': {
                                                range: [1000, Number.MAX_VALUE],
                                                list: []
                                            },
                                            '100': {
                                                range: [100, 1000],
                                                list: []
                                            },
                                            '0': {
                                                range: [0, 100],
                                                list: []
                                            }
                                        };
                                        var itemCount = itemList.length;

                                        for (var j = 0; j < itemCount; j++) {
                                            var rowObj = itemList[j],
                                                sumCount = rowObj.SUMOUTPUT;

                                            for (var rangeKey in rangeMap) {
                                                var rangeObj = rangeMap[rangeKey],
                                                    rangeArr = rangeObj.range;

                                                if (sumCount >= rangeArr[0] && sumCount < rangeArr[1]) {
                                                    rangeObj.list.push(rowObj);
                                                    break;
                                                }
                                            }
                                        }

                                        var newData = {};

                                        for (var k in rangeMap) {
                                            newData[k] = rangeMap[k].list;
                                        }

                                        item.data = newData;
                                    }
                                }

                                callback.call(ctx, null, resultSet);
                            }, this);
                        }, this);
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.EmerSourceService = Service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/HazardQueryService.js":
            /*!*****************************************************!*\
              !*** ./public/json/oldserver/HazardQueryService.js ***!
              \*****************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.join */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.join.js");

                __webpack_require__( /*! core-js/modules/es.object.keys */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js");

                (function(window) {
                    var NewHazardQConfig = {
                        'dz': {
                            "tables": [{
                                "id": "huapo",
                                "table": "BAS_GEOLOGICHAZARD",
                                "query": {
                                    "tag.GEOHAZARDTYPECODE": {
                                        "$in": ["20104.0300", "20104.0200", "20104.0100"]
                                    }
                                },
                                "fieldMap": {
                                    "title": "HAZARDNAME",
                                    "monitorType": "MONITMODE",
                                    "monitorTel": "MONRESPPEROTEL",
                                    "monitorMeasure": "TREATSTEP",
                                    "dsBaseLevel": "HAZARDLEVELCODE",
                                    "dsBaseType": "GEOHAZARDTYPECODE",
                                    "dsBaseAdress": "ADDRESS",
                                    "dsThreatenNum": "MAXPERSONNUM",
                                    "dsThreatenObj": "THREATOBJ",
                                    "dsThreatenProperty": "THREATWEALTH"
                                }
                            }]
                        },
                        'qy': {
                            "tables": [{
                                "//": "危化品企业",
                                "id": "hazardous",
                                "table": "ANJIAN_DAGCHEMENT",
                                "fieldMap": {
                                    "title": "DAGCHEMENTNAME",
                                    "longitude": "LONGITUDE",
                                    "latitude": "LATITUDE",
                                    "enBaseAdress": "ADDRESS",
                                    "enBaseLevel": "RISKLEVEL",
                                    "enBaseEnTel": "EMERASKTEL",
                                    "enBaseStaffNum": "EMPNUM"
                                }
                            }, {
                                "//": "煤矿企业",
                                "id": "coalMine",
                                "table": "ANJIAN_COAL",
                                "fieldMap": {
                                    "title": "COALNAME",
                                    "enBaseAdress": "ADDRESS",
                                    "enBaseLevel": "RISKLEVEL",
                                    "enBaseEnTel": "CONTROLCENTERTEL",
                                    "enBaseStaffNum": "WORERNUM"
                                }
                            }, {
                                "//": "烟花爆竹企业",
                                "id": "firework",
                                "table": "ANJIAN_FIREWORKENT",
                                "fieldMap": {
                                    "title": "FIREWORKENTNAME",
                                    "enBaseEnTel": "TEL",
                                    "enBaseAdress": "ADDRESS",
                                    "longitude": "LONGITUDE",
                                    "latitude": "LATITUDE",
                                    "enBaseStaffNum": "WORKERNUM"
                                }
                            }, {
                                "//": "非煤矿山企业",
                                "id": "mine",
                                "table": "ANJIAN_TAILINGPOND",
                                "fieldMap": {
                                    "title": "WKKMC",
                                    "enBaseEnTel": "WKKFZRYDDH",
                                    "enBaseAdress": "WKKDZMC",
                                    "longitude": "LONGITUDE",
                                    "latitude": "LATITUDE",
                                    "respper": "WKKFZR",
                                    "enBaseStaffNum": "TZZYRYSL"
                                }
                            }]
                        },
                        'ss': {
                            "tables": [{
                                "//": "水库",
                                "id": "reservoir",
                                "table": "BAS_RESERVOIR",
                                "fieldMap": {
                                    "title": "NAME",
                                    "CODE": "CODE"
                                }
                            }, {
                                "//": "桥梁",
                                "id": "tunnel",
                                "table": "BAS_BRIDGE",
                                "fieldMap": {
                                    "title": "BRIDGENAME",
                                    "inBaseEnTel": "RESPOTEL",
                                    "inBaseAdress": "ADDRESS",
                                    "respper": "RESPPER",
                                    "BRIDGECATEGORYCODE": "BRIDGECATEGORYCODE",
                                    "DISTRICTCODE": "DISTRICTNAME"
                                }
                            }]
                        }
                    };
                    var util = {
                        /**
                         * @param opts
                         * @param opts.server
                         * @param opts.data
                         * @param cb
                         * @param ctx
                         */
                        aggregateMulti: function aggregateMulti(opts, cb, ctx) {
                            var urlNew = window.EMAP_CONFIG.common.mongoService + '/dataOperate/queryMulti';
                            jQuery.ajax({
                                // url: opts.server + '/dataStatics/aggregateMulti',
                                url: urlNew,
                                type: 'post',
                                data: {
                                    eId: 'safety',
                                    data: JSON.stringify(opts.data)
                                },
                                dataType: 'json',
                                success: function success(data) {
                                    if (data.success) {
                                        cb && cb.call(ctx, null, data.data);
                                    } else {
                                        cb && cb.call(ctx, new Error(data.msg));
                                    }
                                },
                                error: function error(xhr, msg, err) {
                                    cb && cb.call(ctx, new Error(err));
                                }
                            });
                        },

                        /**
                         * @param opts
                         * @param opts.server
                         * @param opts.eId
                         * @param opts.data
                         * @param cb
                         * @param ctx
                         */
                        queryMulti: function queryMulti(opts, cb, ctx) {
                            var urlNew = window.EMAP_CONFIG.common.mongoService + '/dataOperate/queryMulti';
                            jQuery.ajax({
                                // url: opts.server + '/dataOperate/queryMulti',
                                url: urlNew,
                                type: 'post',
                                data: {
                                    eId: opts.eId || 'safety',
                                    data: JSON.stringify(opts.data)
                                },
                                dataType: 'json',
                                success: function success(data) {
                                    if (data.success) {
                                        cb && cb.call(ctx, null, data.data);
                                    } else {
                                        cb && cb.call(ctx, new Error(data.msg));
                                    }
                                },
                                error: function error(xhr, msg, err) {
                                    cb && cb.call(ctx, new Error(err));
                                }
                            });
                        },
                        //是否为空
                        isEmptyValue: function isEmptyValue(value) {
                            return value == null || value == undefined || value == "" || value == " ";
                        },
                        R: 6378137,
                        fullRange: {
                            type: 'Polygon',
                            coordinates: [
                                [
                                    [0, 0],
                                    [180, 0],
                                    [180, 90],
                                    [0, 90],
                                    [0, 0]
                                ]
                            ]
                        },
                        //计算经纬度距离
                        caculateDistancePoints: function caculateDistancePoints(pt1, pt2) {
                            var R = util.R,
                                rad = Math.PI / 180,
                                lat1 = pt1[1] * rad,
                                lat2 = pt2[1] * rad,
                                a = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos((pt2[0] - pt1[0]) * rad);
                            return R * Math.acos(Math.min(a, 1));
                        }
                    };
                    /**
                     *
                     * @param opts
                     * @param opts.server
                     * @constructor
                     */

                    var Service = function Service(opts) {
                        this.opts = opts; //

                        this.store = {};
                    };
                    /**
                     * 地震烈度范围的地质隐患统计
                     * @param opts
                     * @param opts.point {Array} [x,y] 事故点
                     * @param opts.geometry {GeoJSON} 烈度范围
                     * @param opts.resources {Object}
                     * @param opts.resources[k] {Object}
                     * @param opts.resources[k].tables {Array}
                     * @param opts.resources[k].tables[i].table
                     * @param opts.resources[k].tables[i].query
                     * @param opts.resources[k].tables[i].fieldMap
                     * @param opts.levels {Object} 级别映射表
                     * @param opts.levelFn {Function} 计算等级的方法
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getEqStatistics = function(opts, cb, ctx) {
                        var seperator = '_ss_',
                            geoJsonReader = G.utils.GeometryUtil.getGeoJSONReader();
                        var jtsGeometry = geoJsonReader.read(util.fullRange).difference(geoJsonReader.read(opts.geometry)),
                            pointJson = {
                                "type": "Point",
                                "coordinates": opts.point
                            },
                            jtsPoint = geoJsonReader.read(pointJson);
                        var distanceLimit = jtsGeometry.distance(jtsPoint) * Math.PI * util.R / 180;
                        var geoNear = {
                            "$geoNear": {
                                "spherical": true,
                                "near": pointJson,
                                "limit": 1000 * 10000,
                                "maxDistance": distanceLimit,
                                "distanceField": "distance",
                                "includeLocs": "geom"
                            }
                        };
                        var resourceCol = jQuery.extend(true, {}, opts.resources);
                        var aggregateList = [];

                        for (var resourceKey in resourceCol) {
                            var resourceTables = resourceCol[resourceKey].tables;

                            for (var i = 0; i < resourceTables.length; i++) {
                                var tableObj = resourceTables[i];
                                var aggregateObj = {},
                                    aggregate = [];
                                aggregate.push(geoNear);
                                aggregate.push({
                                    $match: {
                                        "geom": {
                                            "$geoIntersects": {
                                                "$geometry": opts.geometry
                                            }
                                        }
                                    }
                                });

                                if (tableObj.query && Object.keys(tableObj.query).length > 0) {
                                    aggregate.push({
                                        $match: tableObj.query
                                    });
                                }

                                aggregate.push({
                                    "$project": {
                                        "distance": "$distance"
                                    }
                                });
                                aggregateObj.aggregate = aggregate;
                                aggregateObj.queryIndex = 1;
                                aggregateObj.searchId = [resourceKey, tableObj.id].join(seperator);
                                aggregateObj.dataSetId = tableObj.table;
                                aggregateList.push(aggregateObj);
                            }
                        }

                        util.aggregateMulti({
                            server: this.opts.server,
                            data: aggregateList
                        }, function(err, data) {
                            var resultObj = {};

                            for (var resourceKey in resourceCol) {
                                var resourceObj = resourceCol[resourceKey];
                                var resourceResult = {
                                    total: 0,
                                    levels: new Array(4)
                                };

                                for (var kk = 0; kk < resourceResult.levels.length; kk++) {
                                    resourceResult.levels[kk] = {
                                        value: 0
                                    };
                                }

                                resultObj[resourceKey] = resourceResult;
                                var resourceTables = resourceObj.tables;

                                for (var i = 0; i < resourceTables.length; i++) {
                                    var dataList = data[[resourceKey, resourceTables[i].id].join(seperator)][resourceTables[i].table];

                                    for (var j = 0, dataLen = dataList.length; j < dataLen; j++) {
                                        var levelResult = opts.levelFn({
                                            data: dataList[j],
                                            maxDistance: distanceLimit,
                                            levels: opts.levels
                                        });
                                        resourceResult.levels[levelResult.level].value++;
                                    }

                                    resourceResult.total += dataLen;
                                }
                            }

                            cb && cb.call(ctx, null, resultObj);
                        }, this);
                    };
                    /**
                     * 地震烈度范围的地质隐患查询
                     * @param opts
                     * @param opts.point {Array} [x,y] 事故点
                     * @param opts.geometry {GeoJSON} 烈度范围
                     * @param opts.resources {Object}
                     * @param opts.resources[k] {Object}
                     * @param opts.resources[k].tables {Array}
                     * @param opts.resources[k].tables[i].table
                     * @param opts.resources[k].tables[i].query
                     * @param opts.resources[k].tables[i].fieldMap
                     * @param opts.levels {Object} 级别映射表
                     * @param opts.levelFn {Function} 计算等级的方法
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getEqData = function(opts, cb, ctx) {
                        var geoJsonReader = G.utils.GeometryUtil.getGeoJSONReader(); //aggregate

                        var jtsGeometry = geoJsonReader.read(util.fullRange).difference(geoJsonReader.read(opts.geometry)),
                            pointJson = {
                                "type": "Point",
                                "coordinates": opts.point
                            },
                            jtsPoint = geoJsonReader.read(pointJson);
                        var distanceLimit = jtsGeometry.distance(jtsPoint) * Math.PI * util.R / 180;
                        var resourceCol = jQuery.extend(true, {}, opts.resources);
                        var queryCol = {};

                        for (var resourceKey in resourceCol) {
                            var resourceTables = resourceCol[resourceKey].tables;

                            for (var i = 0; i < resourceTables.length; i++) {
                                var tableObj = resourceTables[i];
                                var queryItem = {},
                                    query = {
                                        $and: [{
                                            "geom": {
                                                "$geoIntersects": {
                                                    "$geometry": opts.geometry
                                                }
                                            }
                                        }]
                                    };
                                queryItem.query = query;

                                if (tableObj.query) {
                                    query.$and.push(tableObj.query);
                                }

                                var selectList = ['geom', '_id'];

                                if (tableObj.fieldMap) {
                                    for (var field in tableObj.fieldMap) {
                                        selectList.push('tag.' + tableObj.fieldMap[field]);
                                    }
                                }

                                queryItem.select = selectList.join(' ');
                                queryCol[tableObj.table] = queryItem;
                            }
                        }

                        var resultHandler = function resultHandler(resultdata) {
                            var resultCol = {};

                            for (var resourceKey in resourceCol) {
                                var resultObj = {};
                                resultCol[resourceKey] = resultObj;

                                for (var levelCode in opts.levels) {
                                    resultObj[levelCode] = [];
                                }

                                var resourceTables = resourceCol[resourceKey].tables;

                                for (var i = 0; i < resourceTables.length; i++) {
                                    var tableObj = resourceTables[i];
                                    var dataList = resultdata[tableObj.table];

                                    for (var j = 0, dataLen = dataList.length; j < dataLen; j++) {
                                        var dataItem = dataList[j];
                                        var dataTemp = {};
                                        dataTemp.id = dataItem._id;
                                        dataTemp.geom = dataItem.geom;
                                        dataTemp._table = tableObj.table;
                                        dataTemp._type = tableObj.id; //attributes

                                        if (tableObj.fieldMap) {
                                            for (var field in tableObj.fieldMap) {
                                                dataTemp[field] = dataItem.tag[tableObj.fieldMap[field]] || '';
                                            }
                                        } //


                                        dataTemp.distance = util.caculateDistancePoints(opts.point, dataItem.geom.coordinates);
                                        var levelResult = opts.levelFn({
                                            data: dataTemp,
                                            maxDistance: distanceLimit,
                                            levels: opts.levels
                                        });
                                        resultObj[levelResult.level].push(dataTemp);
                                    }
                                }
                            }

                            return resultCol;
                        };

                        util.queryMulti({
                            server: this.opts.server,
                            data: queryCol
                        }, function(err, data) {
                            if (err == null) {
                                cb && cb.call(ctx, null, resultHandler(data, opts));
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.HazardQueryService = Service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/RescueAssistanceService.js":
            /*!**********************************************************!*\
              !*** ./public/json/oldserver/RescueAssistanceService.js ***!
              \**********************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.slice */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.slice.js");

                __webpack_require__( /*! core-js/modules/es.function.name */ "./node_modules/_core-js@3.6.5@core-js/modules/es.function.name.js");

                __webpack_require__( /*! core-js/modules/es.object.keys */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js");

                __webpack_require__( /*! core-js/modules/es.regexp.exec */ "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.exec.js");

                __webpack_require__( /*! core-js/modules/es.string.split */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.split.js");

                (function(window) {
                    /**
                     *
                     * @param opts
                     * @param opts.server
                     * @constructor
                     */
                    var Service = function Service(opts) {
                        this.opts = opts; //

                        this.store = {
                            rescueWorker: null,
                            //救援力量
                            resuceNeed: null,
                            //救援需求
                            materialNeed: null,
                            //物资需求
                            placement: null //安置

                        }; //

                        this.materialSet = {
                            "TP001": {
                                "label": "救灾帐篷",
                                "code": "TP001",
                                "unit": "顶"
                            },
                            "TP002": {
                                "label": "救灾被服",
                                "code": "TP002",
                                "unit": "件"
                            },
                            "TP003": {
                                "label": "救灾食品",
                                "code": "TP003",
                                "unit": "件"
                            },
                            "TP004": {
                                "label": "生活用品",
                                "code": "TP004",
                                "unit": "件"
                            },
                            "TP005": {
                                "label": "照明用具",
                                "code": "TP005",
                                "unit": "件"
                            },
                            "TP006": {
                                "label": "能源动力",
                                "code": "TP006",
                                "unit": "件"
                            },
                            "TP007": {
                                "label": "应急救生",
                                "code": "TP007",
                                "unit": "件"
                            },
                            "TP008": {
                                "label": "交通工具",
                                "code": "TP008",
                                "unit": "台"
                            },
                            "TP009": {
                                "label": "彩条苫布",
                                "code": "TP009",
                                "unit": "件"
                            },
                            "TP010": {
                                "label": "卫生设施",
                                "code": "TP010",
                                "unit": "件"
                            },
                            "TP011": {
                                "label": "生活家具",
                                "code": "TP011",
                                "unit": "件"
                            },
                            "TP012": {
                                "label": "装备工具",
                                "code": "TP012",
                                "unit": "件"
                            },
                            "TP013": {
                                "label": "个体防护",
                                "code": "TP013",
                                "unit": "件"
                            },
                            "TP014": {
                                "label": "侦测与搜寻",
                                "code": "TP014",
                                "unit": "件"
                            }
                        };
                    };
                    /**
                     * 获取救援力量
                     * @param opts
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getRescueWorker = function(opts, cb, ctx) {
                        // let data = {
                        //   total: 1,//总队伍数目
                        //   totalNum: 12,//总人数
                        //   //救援队伍列表
                        //   list: [
                        //     {
                        //       "id": 1559460642167,
                        //       "name": "XX救援队",//名称
                        //       "typeCode": "T005",//类型
                        //       "typeName": "地震救援队",//类型名称
                        //       "num": 12,//人数
                        //       "unit": "人",//单位
                        //       "x": 116.92704975,//经度
                        //       "y": 40.28975715,//纬度
                        //     }
                        //   ]
                        // }
                        // cb && cb.call(ctx, null, data);
                        cb && cb.call(ctx, null, this.store.rescueWorker);
                    };
                    /**
                     * 基于消息更新救援力量
                     * @param data
                     */


                    Service.prototype.updateRescueWorker = function(data, cb, ctx) {
                        data = data || {};

                        if (Object.keys(data).length == 0) {
                            //test data
                            {
                                return;
                            }
                        } //   data = {
                        //     total: 1,//总队伍数目
                        //     totalNum: 12,//总人数
                        //     //救援队伍列表
                        //     list: [
                        //       {
                        //         "id": 1559460642167,
                        //         "name": "XX救援队",//名称
                        //         "typeCode": "T005",//类型
                        //         "typeName": "地震救援队",//类型名称
                        //         "num": 12,//人数
                        //         "unit": "人",//单位
                        //         "x": 116.92704975,//经度
                        //         "y": 40.28975715,//纬度
                        //       }
                        //     ]
                        //   }
                        // }


                        this.store.rescueWorker = data;
                        cb && cb.call(ctx, null, data);
                    };
                    /**
                     * 查询灾损区的区县
                     * @param opts
                     * @param opts.geometry {GeoJSON} 可选，地震灾损区，geojson格式
                     * @param opts.codeList {Array} 可选，行政区划编码
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getCounties = function(opts, cb, ctx) {
                        var query = {};

                        if (opts.geometry) {
                            query['geom'] = {
                                '$geoIntersects': {
                                    '$geometry': opts.geometry
                                }
                            };
                        }

                        if (opts.codeList) {
                            query['tag.adcode'] = {
                                $in: opts.codeList
                            };
                        }

                        jQuery.ajax({
                            url: EMAP_CONFIG.common.mongoService + '/dataOperate/queryMulti',
                            dataType: 'json',
                            type: 'POST',
                            data: {
                                eId: 'siptea',
                                data: JSON.stringify({
                                    'county0.06': {
                                        'query': query,
                                        'select': '_id geom tag.name tag.adcode tag.gov'
                                    }
                                })
                            },
                            success: function success(data) {
                                var data = data.data;
                                var list = data[Object.keys(data)[0]];
                                var newList = [];

                                for (var i = 0; i < list.length; i++) {
                                    var itemObj = list[i];
                                    var tempObj = {};
                                    tempObj.geom = itemObj.geom;
                                    tempObj.name = itemObj.tag.name;
                                    tempObj.code = itemObj.tag.adcode;
                                    var xy = itemObj.tag.gov.split(",");
                                    tempObj.x = parseFloat(xy[0]);
                                    tempObj.y = parseFloat(xy[1]);
                                    newList.push(tempObj);
                                }

                                cb && cb.call(ctx, null, newList);
                            },
                            error: function error(err) {
                                cb && cb.call(ctx, err);
                            }
                        });
                    };
                    /**
                     * 获取救援力量需求
                     * @param opts
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getRescueNeed = function(opts, cb, ctx) {
                        cb && cb.call(ctx, null, this.store.resuceNeed);
                    };
                    /**
                     * 基于消息更新救援力量需求
                     * @param data
                     */


                    Service.prototype.updateRescueNeed = function(data, cb, ctx) {
                        data = data || {};

                        if (Object.keys(data).length == 0) {
                            //test data
                            return;
                        } //   data = {
                        //     list: [
                        //       {
                        //         "district": "xx县",
                        //         "x": 116.92704975,//经度
                        //         "y": 40.28975715,//纬度
                        //         //救援队需求
                        //         workers: [
                        //           {
                        //             "typeCode": "T005",
                        //             "typeName": "地震救援队",
                        //             "num": 100
                        //           },
                        //
                        //           {
                        //             "typeCode": "T002",
                        //             "typeName": "xx救援队",
                        //             "num": 200
                        //           }
                        //         ]
                        //       }
                        //     ]
                        //   }
                        // }


                        data.total = data.total || 0;

                        for (var i = 0; i < data.list.length; i++) {
                            var tlist = data.list[i].workers;

                            for (var j = 0; j < tlist.length; j++) {
                                data.total += parseInt(tlist[j].num);
                            }
                        }

                        this.store.resuceNeed = data;
                        cb && cb.call(ctx, null, data);
                    };
                    /**
                     * 获取三个梯队的救援队
                     * @param opts
                     * @param opts.point {Array} 必填，事故点
                     * @param opts.typeList {Array} 可选，救援队类型过滤
                     * @param opts.limit {Num} 可选，数据量限制
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getRescueCol = function(opts, cb, ctx) {
                        var resultCol = {
                            total: 0,
                            list: [{
                                total: 0,
                                title: '第一梯队',
                                list: []
                            }, {
                                total: 0,
                                title: '第二梯队',
                                list: []
                            }, {
                                total: 0,
                                title: '第三梯队',
                                list: [{
                                    name: '中部战区',
                                    x: 116.3590,
                                    y: 39.9110
                                }, {
                                    name: '北部战区',
                                    x: 123.4116,
                                    y: 41.7966
                                }, {
                                    name: '西部战区',
                                    x: 104.0817,
                                    y: 30.6610
                                }, {
                                    name: '南部战区',
                                    x: 113.2614,
                                    y: 23.1189
                                }, {
                                    name: '东部战区',
                                    x: 118.7727,
                                    y: 32.0476
                                }]
                            }]
                        };
                        var limit = opts.limit || 10000,
                            radius = 200000;
                        var queryCol = [];
                        opts.typeList = opts.typeList || ['T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T008', 'T009', 'T010', 'T011', 'T014']; //第一梯队

                        var bufferGeom1 = G.utils.SpatialOPUtil.getBuffer({
                            geometry: {
                                type: 'Point',
                                coordinates: opts.point
                            },
                            radius: radius,
                            spatialReference: 4326
                        });
                        resultCol.list[0].geometry = bufferGeom1;
                        resultCol.list[0].titlePoint = [opts.point[0], opts.point[1] + radius / (Math.PI * 6378137 / 180)];
                        queryCol.push({
                            point: opts.point,
                            typeList: opts.typeList,
                            limit: limit,
                            geometry: bufferGeom1
                        }); //第二梯队

                        var chinaRange = {
                            type: 'Polygon',
                            coordinates: [
                                [
                                    [70, 3],
                                    [70, 55],
                                    [136, 55],
                                    [136, 3],
                                    [70, 3]
                                ]
                            ]
                        };
                        var bufferGeom2 = G.utils.SpatialOPUtil.differGeom(chinaRange, [bufferGeom1]);
                        queryCol.push({
                            point: opts.point,
                            typeList: opts.typeList,
                            limit: limit,
                            geometry: bufferGeom2
                        });
                        return this._getRescue({
                            querys: queryCol
                        }, function(err, data) {
                            if (err == null) {
                                for (var i = 0; i < data.length; i++) {
                                    resultCol.list[i].list = data[i];
                                    var total = 0;

                                    for (var j = 0, len = data[i].length; j < len; j++) {
                                        total += data[i][j].num;
                                    }

                                    resultCol.list[i].total = total;
                                    resultCol.total += total;
                                } //缺口人数


                                var resuceNeed = 0;

                                if (this.store.resuceNeed && this.store.resuceNeed.total) {
                                    resuceNeed = his.store.resuceNeed.total;
                                }

                                resultCol.needNum = Math.max(resuceNeed - resultCol.total, 0);
                                cb && cb.call(ctx, null, resultCol);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 获取需求点周边的指定类型的救援队
                     * @param opts
                     * @param opts.point {Array} 必填，如[116,39]
                     * @param opts.typeList {Array} 必填，类型编码，如['T002']
                     * @param opts.num {Number} 必填，人数需求
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getRescueByTypeAndNeedLoc = function(opts, cb, ctx) {
                        var options = {};
                        options.point = opts.point;
                        options.typeList = opts.typeList;
                        options.limit = 5000;
                        options.byDistance = true;
                        return this._getRescue({
                            querys: [options]
                        }, function(err, data) {
                            if (err == null) {
                                var provideList = this._caculateDispatchResult(opts.num, data[0], {
                                    numKey: 'num',
                                    codeKey: 'typeCode'
                                });

                                cb && cb.call(ctx, null, provideList);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 提取调配，如救援队
                     * @param needCount
                     * @param list
                     * @param opts
                     * @param opts.numKey
                     * @private
                     */


                    Service.prototype._caculateDispatchResult = function(needCount, list, opts) {
                        var provideList = [],
                            fulfillCount = 0,
                            total = list.length,
                            numKey = opts.numKey;

                        for (var i = 0; i < total; i++) {
                            var item = list[i];
                            var thisItem = item;
                            var attachNum = item[numKey],
                                promiseCount = fulfillCount + attachNum;

                            if (!attachNum || isNaN(attachNum)) {
                                continue;
                            }

                            if (promiseCount < needCount) {
                                thisItem.num = attachNum;
                            } else {
                                thisItem.num = needCount - fulfillCount;
                            }

                            fulfillCount += thisItem.num;
                            provideList.push(thisItem);

                            if (fulfillCount >= needCount) {
                                break;
                            }
                        }

                        return provideList;
                    };
                    /**
                     * 提取调配，如关联形式，如储备库物资
                     * @param needSet {Object} 需求对象
                     * @param list
                     * @param opts
                     * @param opts.numKey
                     * @param opts.attachKey {String} 附属集合的key
                     * @param opts.codeKey {String} 类型字段的key，与needSet里对应
                     * @param opts.nameKey {String} 类型名称字段key
                     * @param opts.numKey {String} 数量的key
                     * @private
                     */


                    Service.prototype._caculateDispatchAttachResult = function(needSet, list, opts) {
                        var total = list.length,
                            maxReposityCount = 0;
                        var dispatchSet = {};

                        for (var codeKey in needSet) {
                            var provideList = [];
                            var needCount = needSet[codeKey];
                            var fulfillCount = 0;

                            for (var i = 0; i < total; i++) {
                                var item = list[i];
                                var provideItem = {
                                    num: 0
                                };

                                for (var kk in item) {
                                    if (kk == opts.attachKey) {
                                        continue;
                                    }

                                    provideItem[kk] = item[kk];
                                }

                                var attachList = item[opts.attachKey];

                                for (var j = 0; j < attachList.length; j++) {
                                    var attachItem = attachList[j].tag;

                                    if (!(attachItem[opts.codeKey] == codeKey)) {
                                        continue;
                                    }

                                    var attachNum = attachItem[opts.numKey],
                                        promiseCount = fulfillCount + attachNum;

                                    if (!attachNum || isNaN(attachNum)) {
                                        continue;
                                    }

                                    var addNum = 0;

                                    if (promiseCount < needCount) {
                                        addNum = attachNum;
                                    } else {
                                        addNum = needCount - fulfillCount;
                                    }

                                    fulfillCount += addNum;
                                    provideItem.num += addNum;

                                    if (fulfillCount >= needCount) {
                                        break;
                                    }
                                }

                                if (provideItem.num > 0) {
                                    provideList.push(provideItem);
                                }

                                if (fulfillCount >= needCount) {
                                    break;
                                }
                            }

                            dispatchSet[codeKey] = provideList;
                            maxReposityCount = Math.max(maxReposityCount, provideList.length);
                        }

                        return {
                            dispatchSet: dispatchSet,
                            list: list.slice(0, maxReposityCount)
                        };
                    };
                    /**
                     * 查询救援队
                     * @param opts
                     * @param opts.querys
                     * @param opts.querys[i].point {Array} 必填，如[116,39]
                     * @param opts.querys[i].typeList {Array} 必填，类型编码，如['T002']
                     * @param opts.querys[i].query {Object} 可选，自定义查询条件
                     * @param opts.querys[i].geometry {GeoJSON} 必填，地震灾损区，geojson格式
                     * @param opts.querys[i].bufferMeter {Number} 可选，缓冲距离/米
                     * @param opts.querys[i].limit {Number} 可选，返回数据数量
                     * @param opts.querys[i].byDistance {Boolean} 可选，
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype._getRescue = function(opts, cb, ctx) {
                        var aggregateList = [];

                        for (var i = 0; i < opts.querys.length; i++) {
                            var aggregateObj = {},
                                aggregate = [];
                            var queryObj = opts.querys[i]; //

                            var geometry = queryObj.geometry;

                            if (queryObj.bufferMeter && geometry) {
                                geometry = G.utils.SpatialOPUtil.getBuffer({
                                    geometry: queryObj.geometry,
                                    radius: queryObj.bufferMeter,
                                    spatialReference: 4326
                                });
                            }

                            var query = {
                                'tag.RESCUETYPECODE': {
                                    $in: queryObj.typeList
                                }
                            };

                            if (geometry) {
                                query['geom'] = {
                                    $geoIntersects: {
                                        $geometry: geometry
                                    }
                                };
                            }

                            if (queryObj.query) {
                                for (var kk in queryObj.query) {
                                    query[kk] = queryObj.query[kk];
                                }
                            }

                            aggregate.push({
                                $geoNear: {
                                    limit: 100000,
                                    maxDistance: 5000 * 1000,
                                    spherical: true,
                                    includeLocs: 'geom',
                                    distanceField: 'distance',
                                    near: {
                                        type: 'Point',
                                        coordinates: queryObj.point
                                    }
                                }
                            });
                            aggregate.push({
                                $lookup: {
                                    from: 'user_safety_EQUIP_RESCUETYPE',
                                    localField: 'tag.RESCUETYPECODE',
                                    foreignField: '_id',
                                    as: 'type'
                                }
                            });
                            aggregate.push({
                                $unwind: {
                                    path: '$type',
                                    "preserveNullAndEmptyArrays": false
                                }
                            });

                            if (queryObj.byDistance) {
                                aggregate.push({
                                    $limit: queryObj.limit || 150
                                });
                            } else {
                                aggregate.push({
                                    $sort: {
                                        _id: 1
                                    }
                                });
                                aggregate.push({
                                    $limit: queryObj.limit || 150
                                });
                            }

                            aggregate.push({
                                $project: {
                                    name: '$tag.RESCUENAME',
                                    typeCode: '$tag.RESCUETYPECODE',
                                    typeName: '$type.tag.SHORTNAME',
                                    num: '$tag.TOTALPERNUM',
                                    geom: '$geom',
                                    distance: '$distance',
                                    address: '$tag.ADDRESS',
                                    carNum: '$tag.CARNUM',
                                    contact: '$tag.CHARGER',
                                    tel: '$tag.CHARGERMTEL'
                                }
                            });
                            aggregateObj.aggregate = aggregate;
                            aggregateObj.query = query;
                            aggregateObj.searchId = i;
                            aggregateObj.dataSetId = 'JYXX_TEA_RESCUE';
                            aggregateObj.queryIndex = 1;
                            aggregateList.push(aggregateObj);
                        }

                        this.aggregateMulti(aggregateList, function(err, data) {
                            if (err == null) {
                                var resultCol = [];

                                for (var j = 0; j < aggregateList.length; j++) {
                                    var list = data[j]['JYXX_TEA_RESCUE']; // var measureService = new g2.sfs.MeasureService({
                                    //   projectService: new g2.sfs.CoordinateTransform()
                                    // });

                                    for (var i = 0; i < list.length; i++) {
                                        var itemObj = list[i];

                                        if (!itemObj.geom) {
                                            continue;
                                        }

                                        itemObj.x = itemObj.geom.coordinates[0];
                                        itemObj.y = itemObj.geom.coordinates[1];
                                        delete itemObj.geom;
                                        itemObj.id = itemObj._id;
                                        delete itemObj._id; //
                                        // var line = g2.sfs.GeometryFactory.createGeometryFromGeoJson({
                                        //   type: 'LineString',
                                        //   coordinates: [
                                        //     opts.querys[j].point,
                                        //     [itemObj.x, itemObj.y]
                                        //   ]
                                        // });
                                        // line.spatialReference = 4326;
                                        // itemObj.distance = measureService.length(line);
                                    } // list.sort(function (a, b) {
                                    //   return a.distance - b.distance;
                                    // })


                                    resultCol.push(list);
                                }

                                cb && cb.call(ctx, null, resultCol);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        });
                    };
                    /**
                     * 扩展
                     */


                    for (var k in window.EMapServerV2.RescueAssistanceServiceExt) {
                        Service.prototype[k] = window.EMapServerV2.RescueAssistanceServiceExt[k];
                    }

                    for (var k in window.EMapServerV2.RescueAssistanceServiceChartExt) {
                        Service.prototype[k] = window.EMapServerV2.RescueAssistanceServiceChartExt[k];
                    }

                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.RescueAssistanceService = Service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/RescueAssistanceServiceChartExt.js":
            /*!******************************************************************!*\
              !*** ./public/json/oldserver/RescueAssistanceServiceChartExt.js ***!
              \******************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.number.to-fixed */ "./node_modules/_core-js@3.6.5@core-js/modules/es.number.to-fixed.js");

                __webpack_require__( /*! core-js/modules/es.object.keys */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js");

                (function(window) {
                    var ext = {
                        /**
                         * 获取队伍需求图表数据
                         * @param opts
                         * @param cb
                         * @param ctx
                         */
                        getTeamNeedSta: function getTeamNeedSta(opts, cb, ctx) {
                            this.getRescueNeed({}, function(err, data) {
                                if (err == null) {
                                    var resultObj = {};
                                    var textList = [];
                                    var chartData = [];
                                    var list = [];

                                    if (data) {
                                        list = data.list;
                                        chartData.push({
                                            "name": "需要队伍人数",
                                            "value": 0
                                        });

                                        for (var i = 0; i < list.length; i++) {
                                            var workers = list[i].workers;

                                            for (var j = 0; j < workers.length; j++) {
                                                textList.push(workers[j].typetitle + '急需' + parseInt(workers[j].num) + '人' + workers[j].typeName);
                                                chartData[0].value += parseInt(workers[j].num);
                                            }
                                        }
                                    } //


                                    if (this.store.rescueWorker) {
                                        chartData.push({
                                            "name": "现场队伍人数",
                                            "value": 0
                                        });
                                        chartData[chartData.length - 1].value = this.store.rescueWorker.totalNum || 0;
                                    }

                                    resultObj.textList = textList;
                                    resultObj.chartData = chartData;
                                    cb && cb.call(ctx, null, resultObj);
                                } else {
                                    cb && cb.call(ctx, err);
                                }
                            }, this);
                        },

                        /**
                         * 获取现场队伍图表数据
                         * @param opts
                         * @param cb
                         * @param ctx
                         */
                        getRescueWorkerSta: function getRescueWorkerSta(opts, cb, ctx) {
                            this.getRescueWorker({}, function(err, data) {
                                if (err == null) {
                                    var dataObj = {
                                        team: {
                                            title: "队伍数量",
                                            value: 0,
                                            unit: "支",
                                            ydata: [],
                                            xdata: []
                                        },
                                        person: {
                                            title: "队伍人数",
                                            value: 0,
                                            unit: "人",
                                            ydata: [],
                                            xdata: []
                                        }
                                    };
                                    var typeMap = {
                                        '社会救援': {
                                            teamValue: 0,
                                            personValue: 0,
                                            list: ['T011']
                                        },
                                        '应急搜救': {
                                            teamValue: 0,
                                            personValue: 0,
                                            list: ['T005', 'T003', 'T004', 'T001', 'T002']
                                        },
                                        '医疗防疫': {
                                            teamValue: 0,
                                            personValue: 0,
                                            list: ['T014', 'T006']
                                        },
                                        '抢通抢修': {
                                            teamValue: 0,
                                            personValue: 0,
                                            list: ['T008', 'T009', 'T010']
                                        }
                                    };

                                    if (data != null) {
                                        dataObj.team.value = data.total;
                                        dataObj.person.value = data.totalNum || 0; //
                                        //

                                        for (var i = 0; i < data.list.length; i++) {
                                            var item = data.list[i];
                                            var matchedType = null;

                                            for (var typeName in typeMap) {
                                                var typeList = typeMap[typeName].list;

                                                for (var j = 0; j < typeList.length; j++) {
                                                    if (typeList[j] == item.typeCode) {
                                                        matchedType = typeName;
                                                        break;
                                                    }
                                                }

                                                if (matchedType) {
                                                    break;
                                                }
                                            }

                                            if (matchedType) {
                                                typeMap[typeName].teamValue++;
                                                var val = isNaN(parseInt(item.num)) ? 0 : parseInt(item.num);
                                                typeMap[typeName].personValue += val;
                                            }
                                        }
                                    }

                                    dataObj.team.ydata = Object.keys(typeMap);
                                    dataObj.team.xdata = [];
                                    dataObj.person.ydata = Object.keys(typeMap);
                                    dataObj.person.xdata = [];

                                    for (var typeName in typeMap) {
                                        dataObj.team.xdata.push(typeMap[typeName].teamValue);
                                        dataObj.person.xdata.push(typeMap[typeName].personValue);
                                    }

                                    cb && cb.call(ctx, null, dataObj);
                                } else {
                                    cb && cb.call(ctx, err);
                                }
                            }, this);
                        },

                        /**
                         * 获取物资需求图表数据
                         * @param opts
                         * @param cb
                         * @param ctx
                         */
                        getMaterialNeedSta: function getMaterialNeedSta(opts, cb, ctx) {
                            this.getMaterialNeed({}, function(err, data) {
                                if (err == null) {
                                    var materialSet = {
                                        'TP001': {
                                            "code": "TP001",
                                            "name": "救灾帐篷",
                                            "iconClass": "tentIcon",
                                            unit: "顶",
                                            total: 0,
                                            transfering: 0,
                                            onArrival: 0
                                        },
                                        'TP002': {
                                            "code": "TP002",
                                            "name": "救灾被服",
                                            "iconClass": "tentIcon",
                                            unit: "件",
                                            total: 0,
                                            transfering: 0,
                                            onArrival: 0
                                        },
                                        'TP003': {
                                            "code": "TP003",
                                            "name": "救灾食品",
                                            "iconClass": "tentIcon",
                                            unit: "件",
                                            total: 0,
                                            transfering: 0,
                                            onArrival: 0
                                        },
                                        'TP004': {
                                            "code": "TP004",
                                            "name": "生活用品",
                                            "iconClass": "tentIcon",
                                            unit: "件",
                                            total: 0,
                                            transfering: 0,
                                            onArrival: 0
                                        },
                                        'TP005': {
                                            "code": "TP005",
                                            "name": "照明用具",
                                            "iconClass": "tentIcon",
                                            unit: "件",
                                            total: 0,
                                            transfering: 0,
                                            onArrival: 0
                                        },
                                        'TP006': {
                                            "code": "TP006",
                                            "name": "能源动力",
                                            "iconClass": "tentIcon",
                                            unit: "件",
                                            total: 0,
                                            transfering: 0,
                                            onArrival: 0
                                        },
                                        'TP007': {
                                            "code": "TP007",
                                            "name": "应急救生",
                                            "iconClass": "tentIcon",
                                            unit: "件",
                                            total: 0,
                                            transfering: 0,
                                            onArrival: 0
                                        },
                                        'TP008': {
                                            "code": "TP008",
                                            "name": "交通工具",
                                            "iconClass": "tentIcon",
                                            unit: "件",
                                            total: 0,
                                            transfering: 0,
                                            onArrival: 0
                                        }
                                    };

                                    if (data != null) {
                                        var list = data.list;
                                        if (!list) list = [];

                                        for (var i = 0; i < list.length; i++) {
                                            var itemObj = list[i];
                                            var placed = itemObj.placed,
                                                placing = itemObj.placing,
                                                unplaced = itemObj.unplaced;

                                            for (var j = 0; j < placed.length; j++) {
                                                var mObj = placed[j];

                                                if (materialSet.hasOwnProperty(mObj.code)) {
                                                    materialSet[mObj.code].total += parseInt(mObj.num);
                                                    materialSet[mObj.code].unit = materialSet[mObj.code].unit || mObj.unit;
                                                }
                                            }

                                            for (var j = 0; j < placing.length; j++) {
                                                var mObj = placing[j];

                                                if (materialSet.hasOwnProperty(mObj.code)) {
                                                    materialSet[mObj.code].total += parseInt(mObj.num);
                                                    materialSet[mObj.code].transfering += parseInt(mObj.num);
                                                    materialSet[mObj.code].unit = materialSet[mObj.code].unit || mObj.unit;
                                                }
                                            }

                                            for (var j = 0; j < unplaced.length; j++) {
                                                var mObj = unplaced[j];

                                                if (materialSet.hasOwnProperty(mObj.code)) {
                                                    materialSet[mObj.code].total += parseInt(mObj.num);
                                                    materialSet[mObj.code].onArrival += parseInt(mObj.num);
                                                    materialSet[mObj.code].unit = materialSet[mObj.code].unit || mObj.unit;
                                                }
                                            }
                                        }
                                    }

                                    var list = [];

                                    for (var kk in materialSet) {
                                        //只提供有数据的物资
                                        if (materialSet[kk].total > 0) {
                                            list.push(materialSet[kk]);
                                        }
                                    }

                                    cb && cb.call(ctx, null, list);
                                } else {
                                    cb && cb.call(ctx, err);
                                }
                            }, this);
                        },

                        /**
                         * 获取安置点图表数据
                         * @param opts
                         * @param cb
                         * @param ctx
                         */
                        getPlacementSta: function getPlacementSta(opts, cb, ctx) {
                            this.getPlacement({}, function(err, data) {
                                if (err == null) {
                                    var dataObj = {
                                        name: ['未安置人数', '剩余安置容量', '安置率'],
                                        value: [0, 0, 0],
                                        total: 0,
                                        notPlacedNum: 0,
                                        capacity: 0
                                    };

                                    if (data != null) {
                                        dataObj.value[0] = data.totalPlacementLeft;
                                        dataObj.value[1] = data.totalCapacityLeft;
                                        dataObj.value[2] = parseFloat((100 * data.totalPlacementVictims / data.totalPlacement).toFixed(2));
                                        dataObj.notPlacedNum = Math.max(0, dataObj.value[0] - dataObj.value[1]);
                                        dataObj.capacity = data.totalCapacity;
                                        dataObj.total = data.totalPlacement;
                                    }

                                    cb && cb.call(ctx, null, dataObj);
                                } else {
                                    cb && cb.call(ctx, err);
                                }
                            }, this);
                        }
                    };
                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.RescueAssistanceServiceChartExt = ext;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/RescueAssistanceServiceExt.js":
            /*!*************************************************************!*\
              !*** ./public/json/oldserver/RescueAssistanceServiceExt.js ***!
              \*************************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.function.name */ "./node_modules/_core-js@3.6.5@core-js/modules/es.function.name.js");

                __webpack_require__( /*! core-js/modules/es.number.to-fixed */ "./node_modules/_core-js@3.6.5@core-js/modules/es.number.to-fixed.js");

                __webpack_require__( /*! core-js/modules/es.object.keys */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js");

                (function(window) {
                    var ext = {
                        /**
                         * 多个管道执行方法-公共
                         * @param aggregateList 管道列表
                         * @param cb
                         * @param ctx
                         * @returns {*}
                         */
                        aggregateMulti: function aggregateMulti(aggregateList, cb, ctx) {
                            var opts = {},
                                data = {};
                            opts.url = EMAP_CONFIG.common.mongoService + '/dataStatics/aggregateMulti';
                            opts.dataType = 'json';
                            opts.type = 'POST';
                            data.data = JSON.stringify(aggregateList);
                            data.eId = 'safety';
                            opts.data = data;

                            opts.success = function(d) {
                                cb && cb.call(ctx, null, d.data);
                            };

                            opts.error = function(err) {
                                cb && cb.call(ctx, new Error(err));
                            };

                            return jQuery.ajax(opts);
                        },

                        /**
                         * 获取物资需求
                         * @param opts
                         * @param cb
                         * @param ctx
                         */
                        getMaterialNeed: function getMaterialNeed(opts, cb, ctx) {
                            cb && cb.call(ctx, null, this.store.materialNeed);
                        },

                        /**
                         *
                         * @param data
                         * @param cb
                         * @param ctx
                         */
                        updateMaterialNeed: function updateMaterialNeed(data, cb, ctx) {
                            data = data || [];
                            this.store.materialNeed = data;
                            cb && cb.call(ctx, null, data);
                        },

                        /**
                         * 根据物资需求获取储备库列表
                         * @param opts
                         * @param opts.point
                         * @param opts.materialSet {Object} 必填
                         * @param opts.materialSet[key] key为物资类型编码，value为物资需求
                         * @param cb
                         * @param ctx
                         */
                        getNearbyReposity: function getNearbyReposity(opts, cb, ctx) {
                            return this._getNearbyReposity(opts, function(err, data) {
                                if (err == null) {
                                    cb && cb.call(ctx, null, data.list);
                                } else {
                                    cb && cb.call(ctx, err);
                                }
                            }, ctx);
                        },

                        /**
                         * 根据物资需求获取储备库列表
                         * @param opts
                         * @param opts.point
                         * @param opts.materialSet {Object} 必填
                         * @param opts.materialSet[key] key为物资类型编码，value为物资需求
                         * @param cb
                         * @param ctx
                         */
                        _getNearbyReposity: function _getNearbyReposity(opts, cb, ctx) {
                            var point = opts.point;
                            var aggregate = [];
                            var geoNear = {
                                limit: 1000000,
                                maxDistance: 5000 * 1000,
                                spherical: true,
                                includeLocs: 'geom',
                                distanceField: 'distance'
                            };
                            geoNear.near = {
                                type: 'Point',
                                coordinates: [point[0], point[1]]
                            };
                            aggregate.push({
                                $geoNear: geoNear
                            });
                            aggregate.push({
                                "$lookup": {
                                    "from": "user_safety_JC_MATERIAL_INFO",
                                    "localField": "_id",
                                    "foreignField": "tag.REPERTORYID",
                                    "as": "materials"
                                }
                            }, {
                                "$lookup": {
                                    "from": "user_safety_CODE_BAS_DISTRICT",
                                    "localField": "tag.DISTRICTCODE",
                                    "foreignField": "_id",
                                    "as": "districts"
                                }
                            }, {
                                "$lookup": {
                                    "from": "user_safety_CODE_REP_LEVEL",
                                    "localField": "tag.LEVELCODE_",
                                    "foreignField": "id",
                                    "as": "levels"
                                }
                            }, {
                                "$project": {
                                    "materials": "$materials",
                                    "districts": "$districts",
                                    "levels": "$levels",
                                    "orgname": "$tag.ORGNAME",
                                    "name": "$tag.REPERTORYNAME",
                                    "address": "$tag.ADDRESS",
                                    "contact": "$tag.CONCATEPER",
                                    "phone": "$tag.CONCATEMOBTEL",
                                    "tel": "$tag.CONCATEOFFTEL",
                                    "distance": "$distance",
                                    "geom": "$geom"
                                }
                            });
                            var aggregateObj = {};
                            aggregateObj.aggregate = aggregate;
                            aggregateObj.query = {};
                            aggregateObj.searchId = 0;
                            aggregateObj.dataSetId = "JC_REPERTORY";
                            aggregateObj.queryIndex = 1;
                            var aggregateList = [aggregateObj];
                            aggregateList.push({
                                aggregate: [{
                                    $project: {
                                        "name": "$tag.MATERIALTYPENAME",
                                        "code": "$tag.MATERIALTYPECOE"
                                    }
                                }],
                                query: {},
                                searchId: 1,
                                dataSetId: 'JC_MATERIAL_TYPE'
                            });
                            this.aggregateMulti(aggregateList, function(err, data) {
                                if (err == null) {
                                    var list = data[aggregateObj.searchId][aggregateObj.dataSetId];

                                    var dispatchResult = this._caculateDispatchAttachResult(opts.materialSet, list, {
                                        attachKey: 'materials',
                                        codeKey: 'MATERIALTYPE',
                                        // nameKey: 'MATERIALNAME',
                                        numKey: 'MATERIALNUM'
                                    });

                                    var list = dispatchResult.list;

                                    for (var i = 0; i < list.length; i++) {
                                        var item = list[i];
                                        var materials = item.materials;
                                        delete item.materials;
                                        var newList = [];

                                        for (var j = 0; j < materials.length; j++) {
                                            var materialObj = materials[j].tag;
                                            newList.push({
                                                name: materialObj.MATERIALNAME,
                                                code: materialObj.MATERIALTYPE,
                                                num: materialObj.MATERIALNUM,
                                                unit: materialObj.MEASUREUNIT || (this.materialSet[materialObj.MATERIALTYPE] ? this.materialSet[materialObj.MATERIALTYPE].unit : '件')
                                            });
                                        }

                                        item.material = newList;
                                        item.x = item.geom.coordinates[0];
                                        item.y = item.geom.coordinates[1];
                                        item.district = '';
                                        item.level = '';

                                        if (item.districts && item.districts.length > 0) {
                                            item.district = item.districts[0].tag.DISTRICTNAME;
                                            delete item.districts;
                                        }

                                        if (item.levels && item.levels.length > 0) {
                                            item.level = item.levels[0].tag.LEVELNAME;
                                            delete item.levels;
                                        }

                                        delete item.geom;
                                    } //


                                    dispatchResult.typeList = data[1]['JC_MATERIAL_TYPE'];
                                    cb.call(ctx, null, dispatchResult);
                                } else {
                                    cb && cb.call(ctx, err);
                                }
                            }, this);
                        },

                        /**
                         * 获取储备库调度方案
                         * @param opts.point
                         * @param opts.materialSet {Object} 必填
                         * @param opts.materialSet[key] key为物资类型编码，value为物资需求
                         * @param cb
                         * @param ctx
                         */
                        getReposityDispatch: function getReposityDispatch(opts, cb, ctx) {
                            return this._getNearbyReposity(opts, function(err, data) {
                                if (err == null) {
                                    var promise = null;
                                    var current = 0;
                                    var self = this;
                                    var resultList = [];

                                    var async = function async() {
                                        var dtd = jQuery.Deferred();

                                        self._pathAnalysis({
                                            start: [data.list[current].x, data.list[current].y],
                                            end: opts.point
                                        }).then(function(data) {
                                            current++;
                                            resultList.push(data);
                                            dtd.resolve();
                                        });

                                        return dtd;
                                    };

                                    for (var i = 0; i < data.list.length; i++) {
                                        if (promise == null) {
                                            promise = async();
                                        } else {
                                            promise = promise.then(function() {
                                                return async();
                                            });
                                        }
                                    }

                                    if (promise == null) {
                                        cb && cb.call(ctx, null, []);
                                    } else {
                                        promise.done(function() {
                                            var repositySet = {};

                                            for (var i = 0; i < data.list.length; i++) {
                                                data.list[i].duration = parseFloat((resultList[i].duration / 3600).toFixed(2));
                                                repositySet[data.list[i]._id] = data.list[i];
                                            }

                                            var dataList = [];

                                            for (var type in data.dispatchSet) {
                                                var reposityList = data.dispatchSet[type];
                                                var itemObj = {};
                                                itemObj.list = []; //

                                                for (var j = 0; j < reposityList.length; j++) {
                                                    var reposity = repositySet[reposityList[j]._id];

                                                    if (reposity) {
                                                        delete reposity.material;
                                                        reposity.num = reposityList[j].num;
                                                        itemObj.list.push(reposity);
                                                    }
                                                } //


                                                for (var k = 0; k < data.typeList.length; k++) {
                                                    if (data.typeList[k].code == type) {
                                                        itemObj.name = data.typeList[k].name;
                                                        itemObj.code = type;
                                                        itemObj.unit = '件';

                                                        if (self.materialSet.hasOwnProperty(type)) {
                                                            itemObj.unit = self.materialSet[type].unit;
                                                        }

                                                        break;
                                                    }
                                                }

                                                dataList.push(itemObj);
                                            }

                                            cb && cb.call(ctx, null, dataList);
                                        });
                                    }
                                } else {
                                    cb && cb.call(ctx, err);
                                }
                            }, this);
                        },

                        /**
                         * 路径规划
                         * @param opts
                         * @param opts.start {Array} [116,39]
                         * @param opts.end {Array} [117,39]
                         * @param cb
                         * @param ctx
                         * @private
                         */
                        _pathAnalysis: function _pathAnalysis(opts, cb, ctx) {
                            var promise = jQuery.Deferred();
                            var startTemp = opts.start[1] + ',' + opts.start[0];
                            var start = window.EMapServerV2.CoordTransformUtil.wgs84togcj02(startTemp);
                            var endTemp = opts.end[1] + ',' + opts.end[0];
                            var end = window.EMapServerV2.CoordTransformUtil.wgs84togcj02(endTemp);
                            var url = EMAP_CONFIG.common.GaoDeService + 'direction/driving?origin=' + start + '&destination=' + end + '&extensions=all&strategy=10&waypoints=&avoidpolygons=&output=json&key=' + EMAP_CONFIG.common.GaoDeKey;
                            $.ajax({
                                url: url,
                                dataType: 'jsonp',
                                success: function success(res) {
                                    if (res.route) {
                                        var dataObj = {};
                                        dataObj.duration = 0;

                                        if (res.route.paths.length > 0) {
                                            dataObj.duration = parseInt(res.route.paths[0].duration);
                                        } else {
                                            //根据距离计算
                                            var measureService = new g2.sfs.MeasureService({
                                                projectService: new g2.sfs.CoordinateTransform()
                                            });
                                            var line = g2.sfs.GeometryFactory.createGeometryFromGeoJson({
                                                type: 'LineString',
                                                coordinates: [opts.end, opts.start]
                                            });
                                            line.spatialReference = 4326;
                                            dataObj.duration = parseInt((measureService.length(line) * 3.6 / 60).toFixed(0));
                                        }

                                        promise.resolve(dataObj);
                                    } else {
                                        promise.reject(res);
                                    }
                                },
                                error: function error(er) {
                                    promise.reject(er);
                                }
                            });
                            return promise;
                        },

                        /**
                         * 获取安置信息
                         * @param opts
                         * @param cb
                         * @param ctx
                         */
                        getPlacement: function getPlacement(opts, cb, ctx) {
                            cb && cb.call(ctx, null, this.store.placement);
                        },

                        /**
                         * 更新安置信息
                         * @param data
                         * @param cb
                         * @param ctx
                         */
                        updatePlacement: function updatePlacement(data, cb, ctx) {
                            data = data || {};

                            if (Object.keys(data).length == 0) {
                                //test data
                                {
                                    return;
                                }
                            } //   data = {
                            //     "list": [
                            //       {
                            //         "district": "大厂回族自治县",
                            //         "districtCode": "320775",//行政区划编码
                            //         "id": "131028100",
                            //         "x": 116.97272379,
                            //         "y": 39.88101247,
                            //         "totalCapacity": "200",//总容量
                            //         "totalCapacityPlaced": "100",//已安置容量
                            //         "totalPlacement": "30",//总安置人数
                            //         "totalPlacementVictims": "20"//已安置人数
                            //       }, {
                            //         "district": "宝坻区",
                            //         "districtCode": "320775",//行政区划编码
                            //         "x": 117.29933412,
                            //         "y": 39.75204604,
                            //         "totalCapacity": "2000",
                            //         "totalCapacityPlaced": "500",
                            //         "totalPlacement": "30",
                            //         "totalPlacementVictims": "10"
                            //       }
                            //     ]
                            //   }
                            // }


                            data.totalCapacity = 0;
                            data.totalCapacityPlaced = 0;
                            data.totalCapacityLeft = 0;
                            data.totalPlacement = 0;
                            data.totalPlacementVictims = 0;
                            data.totalPlacementLeft = 0; //安置点数

                            data.placeNum = 100; //安置缺口

                            data.needNum = Math.max(data.totalPlacementVictims - data.totalCapacity, 0);

                            for (var i = 0; i < data.list.length; i++) {
                                var item = data.list[i];
                                item.totalCapacity = parseInt(item.totalCapacity); //总容量

                                item.totalCapacityPlaced = parseInt(item.totalCapacityPlaced); //已用安置容量

                                item.totalCapacityLeft = item.totalCapacity - item.totalCapacityPlaced; //剩余安置容量

                                item.totalPlacement = parseInt(item.totalPlacement); //总安置灾民

                                item.totalPlacementVictims = parseInt(item.totalPlacementVictims); //已安置灾民

                                item.totalPlacementLeft = item.totalPlacement - item.totalPlacementVictims; //待安置人数

                                item.placementPercentage = (100 * item.totalPlacementVictims / item.totalPlacement).toFixed(2) + '%'; //安置率
                                //

                                data.totalCapacity += item.totalCapacity;
                                data.totalCapacityPlaced += item.totalCapacityPlaced;
                                data.totalCapacityLeft += item.totalCapacityLeft;
                                data.totalPlacement += item.totalPlacement;
                                data.totalPlacementVictims += item.totalPlacementVictims;
                                data.totalPlacementLeft += item.totalPlacementLeft;
                            }

                            data.placementPercentage = (100 * data.totalPlacementVictims / data.totalPlacement).toFixed(2) + '%'; //安置率

                            this.store.placement = data;
                            cb && cb.call(ctx, null, data);
                        }
                    };
                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.RescueAssistanceServiceExt = ext;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/RescueHelpService.js":
            /*!****************************************************!*\
              !*** ./public/json/oldserver/RescueHelpService.js ***!
              \****************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.slice */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.slice.js");

                (function(window) {
                    /**
                     * @param opts
                     * @param opts.server
                     * @constructor
                     */
                    var Service = function Service(opts) {
                        this.opts = opts; //

                        this.materialSet = {
                            "TP001": {
                                "label": "救灾帐篷",
                                "code": "TP001",
                                "unit": "顶"
                            },
                            "TP002": {
                                "label": "救灾被服",
                                "code": "TP002",
                                "unit": "件"
                            },
                            "TP003": {
                                "label": "救灾食品",
                                "code": "TP003",
                                "unit": "件"
                            },
                            "TP004": {
                                "label": "生活用品",
                                "code": "TP004",
                                "unit": "件"
                            },
                            "TP005": {
                                "label": "照明用具",
                                "code": "TP005",
                                "unit": "件"
                            },
                            "TP006": {
                                "label": "能源动力",
                                "code": "TP006",
                                "unit": "件"
                            },
                            "TP007": {
                                "label": "应急救生",
                                "code": "TP007",
                                "unit": "件"
                            },
                            "TP008": {
                                "label": "交通工具",
                                "code": "TP008",
                                "unit": "台"
                            },
                            "TP009": {
                                "label": "彩条苫布",
                                "code": "TP009",
                                "unit": "件"
                            },
                            "TP010": {
                                "label": "卫生设施",
                                "code": "TP010",
                                "unit": "件"
                            },
                            "TP011": {
                                "label": "生活家具",
                                "code": "TP011",
                                "unit": "件"
                            },
                            "TP012": {
                                "label": "装备工具",
                                "code": "TP012",
                                "unit": "件"
                            },
                            "TP013": {
                                "label": "个体防护",
                                "code": "TP013",
                                "unit": "件"
                            },
                            "TP014": {
                                "label": "侦测与搜寻",
                                "code": "TP014",
                                "unit": "件"
                            }
                        };
                    };
                    /**
                     * 多个管道执行方法-公共
                     * @param aggregateList 管道列表
                     * @param cb
                     * @param ctx
                     * @returns {*}
                     */


                    Service.prototype.aggregateMulti = function(aggregateList, cb, ctx) {
                        var opts = {},
                            data = {};
                        opts.url = EMAP_CONFIG.common.mongoService + '/dataStatics/aggregateMulti';
                        opts.dataType = 'json';
                        opts.type = 'POST';
                        data.data = JSON.stringify(aggregateList);
                        data.eId = 'safety';
                        opts.data = data;

                        opts.success = function(d) {
                            cb && cb.call(ctx, null, d.data);
                        };

                        opts.error = function(err) {
                            cb && cb.call(ctx, new Error(err));
                        };

                        return jQuery.ajax(opts);
                    };
                    /**
                     * 查询救援队
                     * @param opts
                     * @param opts.querys
                     * @param opts.querys[i].point {Array} 必填，如[116,39]
                     * @param opts.querys[i].typeList {Array} 必填，类型编码，如['T002']
                     * @param opts.querys[i].query {Object} 可选，自定义查询条件
                     * @param opts.querys[i].geometry {GeoJSON} 必填，地震灾损区，geojson格式
                     * @param opts.querys[i].limit {Number} 可选，返回数据数量
                     * @param opts.querys[i].sortByDistance {Boolean} 可选，默认为true
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getRescueTeam = function(opts, cb, ctx) {
                        var aggregateList = [];

                        for (var i = 0; i < opts.querys.length; i++) {
                            var aggregateObj = {},
                                aggregate = [];
                            var queryObj = opts.querys[i]; //

                            var geometry = queryObj.geometry;
                            var nearQuery = {
                                'tag.RESCUETYPECODE': {
                                    $in: queryObj.typeList
                                }
                            };
                            var query = {};

                            if (geometry) {
                                query['geom'] = {
                                    $geoIntersects: {
                                        $geometry: geometry
                                    }
                                };
                            }

                            if (queryObj.query) {
                                for (var kk in queryObj.query) {
                                    query[kk] = queryObj.query[kk];
                                }
                            }

                            aggregate.push({
                                $geoNear: {
                                    limit: 100000,
                                    maxDistance: 500000 * 1000,
                                    spherical: true,
                                    includeLocs: 'geom',
                                    distanceField: 'distance',
                                    near: {
                                        type: 'Point',
                                        coordinates: queryObj.point
                                    },
                                    query: nearQuery
                                }
                            });
                            aggregate.push({
                                $lookup: {
                                    from: 'user_safety_EQUIP_RESCUETYPE',
                                    localField: 'tag.RESCUETYPECODE',
                                    foreignField: '_id',
                                    as: 'type'
                                }
                            });
                            aggregate.push({
                                $unwind: {
                                    path: '$type',
                                    "preserveNullAndEmptyArrays": false
                                }
                            });

                            if (queryObj.sortByDistance == false) {
                                aggregate.push({
                                    $sort: {
                                        _id: 1
                                    }
                                });
                                aggregate.push({
                                    $limit: queryObj.limit || 150
                                });
                            } else {
                                aggregate.push({
                                    $limit: queryObj.limit || 150
                                });
                            }

                            aggregate.push({
                                $project: {
                                    name: '$tag.RESCUENAME',
                                    typeCode: '$tag.RESCUETYPECODE',
                                    typeName: '$type.tag.SHORTNAME',
                                    num: '$tag.TOTALPERNUM',
                                    geom: '$geom',
                                    distance: '$distance'
                                }
                            });
                            aggregateObj.aggregate = aggregate;
                            aggregateObj.query = query;
                            aggregateObj.searchId = i;
                            aggregateObj.dataSetId = 'JYXX_TEA_RESCUE';
                            aggregateObj.queryIndex = 1;
                            aggregateList.push(aggregateObj);
                        }

                        this.aggregateMulti(aggregateList, function(err, data) {
                            if (err == null) {
                                var resultCol = [];

                                for (var j = 0; j < aggregateList.length; j++) {
                                    var list = data[j]['JYXX_TEA_RESCUE']; // var measureService = new g2.sfs.MeasureService({
                                    //   projectService: new g2.sfs.CoordinateTransform()
                                    // });

                                    for (var i = 0; i < list.length; i++) {
                                        var itemObj = list[i];

                                        if (!itemObj.geom) {
                                            continue;
                                        }

                                        itemObj.x = itemObj.geom.coordinates[0];
                                        itemObj.y = itemObj.geom.coordinates[1];
                                        delete itemObj.geom;
                                        itemObj.id = itemObj._id;
                                        delete itemObj._id; //
                                        // var line = g2.sfs.GeometryFactory.createGeometryFromGeoJson({
                                        //   type: 'LineString',
                                        //   coordinates: [
                                        //     opts.querys[j].point,
                                        //     [itemObj.x, itemObj.y]
                                        //   ]
                                        // });
                                        // line.spatialReference = 4326;
                                        // itemObj.distance = measureService.length(line);
                                    } // list.sort(function (a, b) {
                                    //   return a.distance - b.distance;
                                    // })


                                    resultCol.push(list);
                                }

                                cb && cb.call(ctx, null, resultCol);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        });
                    };
                    /**
                     * 获取储备库
                     * @param opts
                     * @param opts.point
                     * @param opts.query
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getReposity = function(opts, cb, ctx) {
                        var point = opts.point;
                        var aggregate = [];
                        var geoNear = {
                            limit: 1000000,
                            maxDistance: 5000 * 1000,
                            spherical: true,
                            includeLocs: 'geom',
                            distanceField: 'distance'
                        };
                        geoNear.near = {
                            type: 'Point',
                            coordinates: [point[0], point[1]]
                        };
                        aggregate.push({
                            $geoNear: geoNear
                        });
                        aggregate.push({
                            "$lookup": {
                                "from": "user_safety_JC_MATERIAL_INFO",
                                "localField": "_id",
                                "foreignField": "tag.REPERTORYID",
                                "as": "materials"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.DISTRICTCODE",
                                "foreignField": "_id",
                                "as": "districts"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_REP_LEVEL",
                                "localField": "tag.LEVELCODE_",
                                "foreignField": "id",
                                "as": "levels"
                            }
                        }, {
                            "$project": {
                                "materials": "$materials",
                                "districts": "$districts",
                                "levels": "$levels",
                                "orgname": "$tag.ORGNAME",
                                "name": "$tag.REPERTORYNAME",
                                "address": "$tag.ADDRESS",
                                "contact": "$tag.CONCATEPER",
                                "phone": "$tag.CONCATEMOBTEL",
                                "tel": "$tag.CONCATEOFFTEL",
                                "distance": "$distance",
                                "geom": "$geom"
                            }
                        });
                        var aggregateObj = {};
                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = opts.query || {};
                        aggregateObj.searchId = 0;
                        aggregateObj.dataSetId = "JC_REPERTORY";
                        aggregateObj.queryIndex = 1;
                        var aggregateList = [aggregateObj];
                        this.aggregateMulti(aggregateList, function(err, data) {
                            if (err == null) {
                                var list = data[0]['JC_REPERTORY'];
                                cb && cb.call(ctx, null, list);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 根据物资需求获取储备库列表
                     * @param opts
                     * @param opts.point
                     * @param opts.materialSet {Object} 必填
                     * @param opts.materialSet[key] key为物资类型编码，value为物资需求
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getNearbyReposity = function(opts, cb, ctx) {
                        var point = opts.point;
                        var aggregate = [];
                        var geoNear = {
                            limit: 1000000,
                            maxDistance: 5000 * 1000,
                            spherical: true,
                            includeLocs: 'geom',
                            distanceField: 'distance'
                        };
                        geoNear.near = {
                            type: 'Point',
                            coordinates: [point[0], point[1]]
                        };
                        aggregate.push({
                            $geoNear: geoNear
                        });
                        aggregate.push({
                            "$lookup": {
                                "from": "user_safety_JC_MATERIAL_INFO",
                                "localField": "_id",
                                "foreignField": "tag.REPERTORYID",
                                "as": "materials"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_BAS_DISTRICT",
                                "localField": "tag.DISTRICTCODE",
                                "foreignField": "_id",
                                "as": "districts"
                            }
                        }, {
                            "$lookup": {
                                "from": "user_safety_CODE_REP_LEVEL",
                                "localField": "tag.LEVELCODE_",
                                "foreignField": "id",
                                "as": "levels"
                            }
                        }, {
                            "$project": {
                                "materials": "$materials",
                                "districts": "$districts",
                                "levels": "$levels",
                                "orgname": "$tag.ORGNAME",
                                "name": "$tag.REPERTORYNAME",
                                "address": "$tag.ADDRESS",
                                "contact": "$tag.CONCATEPER",
                                "phone": "$tag.CONCATEMOBTEL",
                                "tel": "$tag.CONCATEOFFTEL",
                                "distance": "$distance",
                                "geom": "$geom"
                            }
                        });
                        var aggregateObj = {};
                        aggregateObj.aggregate = aggregate;
                        aggregateObj.query = {};
                        aggregateObj.searchId = 0;
                        aggregateObj.dataSetId = "JC_REPERTORY";
                        aggregateObj.queryIndex = 1;
                        var aggregateList = [aggregateObj];
                        aggregateList.push({
                            aggregate: [{
                                $project: {
                                    "name": "$tag.MATERIALTYPENAME",
                                    "code": "$tag.MATERIALTYPECOE"
                                }
                            }],
                            query: {},
                            searchId: 1,
                            dataSetId: 'JC_MATERIAL_TYPE'
                        });
                        this.aggregateMulti(aggregateList, function(err, data) {
                            if (err == null) {
                                var list = data[aggregateObj.searchId][aggregateObj.dataSetId];

                                var dispatchResult = this._caculateDispatchAttachResult(opts.materialSet, list, {
                                    attachKey: 'materials',
                                    codeKey: 'MATERIALTYPE',
                                    // nameKey: 'MATERIALNAME',
                                    numKey: 'MATERIALNUM'
                                });

                                var list = dispatchResult.list;

                                for (var i = 0; i < list.length; i++) {
                                    var item = list[i];
                                    var materials = item.materials;
                                    delete item.materials;
                                    var newList = [];

                                    for (var j = 0; j < materials.length; j++) {
                                        var materialObj = materials[j].tag;
                                        newList.push({
                                            name: materialObj.MATERIALNAME,
                                            code: materialObj.MATERIALTYPE,
                                            num: materialObj.MATERIALNUM,
                                            unit: materialObj.MEASUREUNIT || (this.materialSet[materialObj.MATERIALTYPE] ? this.materialSet[materialObj.MATERIALTYPE].unit : '件')
                                        });
                                    }

                                    item.material = newList;
                                    item.x = item.geom.coordinates[0];
                                    item.y = item.geom.coordinates[1];
                                    item.district = '';
                                    item.level = '';

                                    if (item.districts && item.districts.length > 0) {
                                        item.district = item.districts[0].tag.DISTRICTNAME;
                                        delete item.districts;
                                    }

                                    if (item.levels && item.levels.length > 0) {
                                        item.level = item.levels[0].tag.LEVELNAME;
                                        delete item.levels;
                                    }

                                    delete item.geom;
                                } //


                                dispatchResult.typeList = data[1]['JC_MATERIAL_TYPE'];
                                cb.call(ctx, null, dispatchResult);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 提取调配，如关联形式，如储备库物资
                     * @param needSet {Object} 需求对象
                     * @param list
                     * @param opts
                     * @param opts.numKey
                     * @param opts.attachKey {String} 附属集合的key
                     * @param opts.codeKey {String} 类型字段的key，与needSet里对应
                     * @param opts.nameKey {String} 类型名称字段key
                     * @param opts.numKey {String} 数量的key
                     * @private
                     */


                    Service.prototype._caculateDispatchAttachResult = function(needSet, list, opts) {
                        var total = list.length,
                            maxReposityCount = 0;
                        var dispatchSet = {};

                        for (var codeKey in needSet) {
                            var provideList = [];
                            var needCount = needSet[codeKey];
                            var fulfillCount = 0;

                            for (var i = 0; i < total; i++) {
                                var item = list[i];
                                var provideItem = {
                                    num: 0
                                };

                                for (var kk in item) {
                                    if (kk == opts.attachKey) {
                                        continue;
                                    }

                                    provideItem[kk] = item[kk];
                                }

                                var attachList = item[opts.attachKey];

                                for (var j = 0; j < attachList.length; j++) {
                                    var attachItem = attachList[j].tag;

                                    if (!(attachItem[opts.codeKey] == codeKey)) {
                                        continue;
                                    }

                                    var attachNum = attachItem[opts.numKey],
                                        promiseCount = fulfillCount + attachNum;

                                    if (!attachNum || isNaN(attachNum)) {
                                        continue;
                                    }

                                    var addNum = 0;

                                    if (promiseCount < needCount) {
                                        addNum = attachNum;
                                    } else {
                                        addNum = needCount - fulfillCount;
                                    }

                                    fulfillCount += addNum;
                                    provideItem.num += addNum;

                                    if (fulfillCount >= needCount) {
                                        break;
                                    }
                                }

                                if (provideItem.num > 0) {
                                    provideList.push(provideItem);
                                }

                                if (fulfillCount >= needCount) {
                                    break;
                                }
                            }

                            dispatchSet[codeKey] = provideList;
                            maxReposityCount = Math.max(maxReposityCount, provideList.length);
                        }

                        return {
                            dispatchSet: dispatchSet,
                            list: list.slice(0, maxReposityCount)
                        };
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.RescueHelpService = Service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/RescueTeamService.js":
            /*!****************************************************!*\
              !*** ./public/json/oldserver/RescueTeamService.js ***!
              \****************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.slice */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.slice.js");

                __webpack_require__( /*! core-js/modules/es.number.constructor */ "./node_modules/_core-js@3.6.5@core-js/modules/es.number.constructor.js");

                (function(window) {
                    var Service = function Service(opts) {
                        var options = {
                            //资源类型
                            resourceKeys: ['floodteam', 'fireteam', 'transportationteam', 'forestfireteam', 'hazardousteam', 'mineteam', 'nonmineteam', 'corecompetenceteam']
                        };
                        this.opts = jQuery.extend(true, options, opts);
                        this.commonService = new window.EMapServerV2.CommonService(opts);
                    };
                    /**
                     *
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getStatistics = function(callback, ctx) {
                        var resourceKeys = this.opts.resourceKeys.slice(0);
                        this.commonService.getStatistics(resourceKeys, {}, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };
                    /**
                     * 按条件统计
                     * @param opts
                     * @param opts.districtCode
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getStatisticsByFilter = function(opts, callback, ctx) {
                        var filter = {};
                        opts = opts || {};
                        filter.districtCode = opts.districtCode;
                        this.commonService.getStatistics(this.opts.resourceKeys, filter, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };
                    /**
                     * 查询列表数据
                     * @param opts
                     * @param opts.resourceKey，多个逗号分隔
                     * @param opts.pageSize
                     * @param opts.pageIndex
                     * @param opts.districtCode
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getDataList = function(opts, callback, ctx) {
                        opts = opts || {};
                        opts.flatTag = true;
                        this.commonService.getDataList(opts, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };

                    Service.prototype.getNearbyList = function(opts, callback, ctx) {
                        opts = opts || {};
                        opts.flatTag = true;
                        opts.resourceKeys = this.opts.resourceKeys;
                        var radius = opts.config["ANJIAN_DAGCHEMENT※DangerousChemical"].radius;
                        this.commonService.getEventData(opts.eventType, function(err, data) {
                            var config = opts.config || {}; //读取默认距离配置、传参的距离

                            var configRadius = data.tag.SEARCH_DIST;

                            if (configRadius != null && configRadius != '' && !isNaN(configRadius)) {
                                configRadius = parseFloat(configRadius) * 1000;
                            } else {
                                configRadius = 1000 * 1000;
                            }

                            for (var i = 0; i < this.opts.resourceKeys.length; i++) {
                                var resourceKey = this.opts.resourceKeys[i];

                                if (config.hasOwnProperty(resourceKey)) {
                                    if (!config[resourceKey].radius) {
                                        config[resourceKey].radius = configRadius;
                                    }
                                } else {
                                    config[resourceKey] = {
                                        radius: configRadius
                                    };
                                }
                            }

                            this.commonService.getNearbyList(opts, function(err, resultSet) {
                                var list = resultSet.list;
                                resultSet.radius = list[0] ? list[0].radius : radius; //危化企业根据产量分类

                                for (var i = 0; i < list.length; i++) {
                                    var item = list[i];

                                    if (item && item.codeKey === this.opts.resourceKeys[0]) {
                                        var itemList = item.data;
                                        var rangeMap = {
                                            '1000': {
                                                range: [1000, Number.MAX_VALUE],
                                                list: []
                                            },
                                            '100': {
                                                range: [100, 1000],
                                                list: []
                                            },
                                            '0': {
                                                range: [0, 100],
                                                list: []
                                            }
                                        };
                                        var itemCount = itemList.length;

                                        for (var j = 0; j < itemCount; j++) {
                                            var rowObj = itemList[j],
                                                sumCount = rowObj.SUMOUTPUT;

                                            for (var rangeKey in rangeMap) {
                                                var rangeObj = rangeMap[rangeKey],
                                                    rangeArr = rangeObj.range;

                                                if (sumCount >= rangeArr[0] && sumCount < rangeArr[1]) {
                                                    rangeObj.list.push(rowObj);
                                                    break;
                                                }
                                            }
                                        }

                                        var newData = {};

                                        for (var k in rangeMap) {
                                            newData[k] = rangeMap[k].list;
                                        }

                                        item.data = newData;
                                    }
                                }

                                callback.call(ctx, null, resultSet);
                            }, this);
                        }, this);
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {};
                    window.EMapServerV2.RescueTeamService = Service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/ResourceQueryService.js":
            /*!*******************************************************!*\
              !*** ./public/json/oldserver/ResourceQueryService.js ***!
              \*******************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                (function(window) {
                    var Service = function Service(opts) {
                        var options = {};
                        this.opts = jQuery.extend(true, options, opts);
                        this.commonService = new window.EMapServerV2.CommonService(opts);
                    };
                    /**
                     *
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getStatistics = function(callback, ctx) {
                        //去掉最后一类地质隐患点
                        var resourceKeys = this.opts.resourceKeys;
                        this.commonService.getStatistics(resourceKeys, {}, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };
                    /**
                     * 按条件统计
                     * @param opts
                     * @param opts.districtCode
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getStatisticsByFilter = function(opts, callback, ctx) {
                        var filter = {};
                        opts = opts || {};
                        filter.districtCode = opts.districtCode;
                        this.commonService.getStatistics(this.opts.resourceKeys, filter, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };
                    /**
                     * 查询列表数据
                     * @param opts
                     * @param opts.resourceKey，多个逗号分隔
                     * @param opts.pageSize
                     * @param opts.pageIndex
                     * @param opts.districtCode
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getDataList = function(opts, callback, ctx) {
                        opts = opts || {};
                        opts.flatTag = true;
                        this.commonService.getDataList(opts, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };

                    Service.prototype.getNearbyList = function(opts, callback, ctx) {
                        opts = opts || {};
                        opts.flatTag = true; // opts.resourceKeys = this.opts.resourceKeys;

                        this.commonService.getNearbyList(opts, function(err, resultSet) {
                            callback.call(ctx, null, resultSet);
                        }, this);
                    }; //查询企业、防护目标、重要设施 2019年12月17日14:25:48


                    Service.prototype.getGroupCounts = function(dataA, types, cb) {
                        var queryOpts = {
                            //查询的表配置
                            querys: BigTypeCountQueryConfig[types],
                            //缓冲区
                            bufferList: [dataA]
                        };
                        this.servicemodule.bufferStatistics(queryOpts, function(err, data) {
                            if (err == null) {
                                if (cb) {
                                    cb(data);
                                }
                            } else {
                                console.error('查询失败：' + err.message);
                            }
                        });
                    }; //查询企业、防护目标、重要设施 2019年12月31日16:03:03


                    Service.prototype.getGroupCountsNoPoly = function(codes, types, cb) {
                        var queryOpts = {
                            //查询的表配置
                            querys: BigTypeCountQueryConfig[types],
                            //缓冲区
                            bufferList: [],
                            codes: codes
                        };
                        this.servicemodule.bufferStatistics(queryOpts, function(err, data) {
                            if (err == null) {
                                if (cb) {
                                    cb(data);
                                }
                            } else {
                                console.error('查询失败：' + err.message);
                            }
                        });
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {};
                    window.EMapServerV2.ResourceQueryService = Service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/RiskQueryServiceConfig.js":
            /*!*********************************************************!*\
              !*** ./public/json/oldserver/RiskQueryServiceConfig.js ***!
              \*********************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                window.EMapServerV2.RiskQueryServiceConfig = {
                    'dz': {
                        "tables": [{
                            "id": "huapo",
                            "table": "BAS_GEOLOGICHAZARD",
                            "query": {
                                "tag.GEOHAZARDTYPECODE": {
                                    "$in": ["20104.0300", "20104.0200", "20104.0100"]
                                }
                            },
                            "fieldMap": {
                                "title": "HAZARDNAME",
                                "monitorType": "MONITMODE",
                                "monitorTel": "MONRESPPEROTEL",
                                "monitorMeasure": "TREATSTEP",
                                "dsBaseLevel": "HAZARDLEVELCODE",
                                "dsBaseType": "GEOHAZARDTYPECODE",
                                "dsBaseAdress": "ADDRESS",
                                "dsThreatenNum": "MAXPERSONNUM",
                                "dsThreatenObj": "THREATOBJ",
                                "dsThreatenProperty": "THREATWEALTH"
                            }
                        }]
                    },
                    'qy': {
                        "tables": [{
                            "//": "危化品企业",
                            "id": "hazardous",
                            "table": "ANJIAN_DAGCHEMENT",
                            "fieldMap": {
                                "title": "DAGCHEMENTNAME",
                                "longitude": "LONGITUDE",
                                "latitude": "LATITUDE",
                                "enBaseAdress": "ADDRESS",
                                "enBaseLevel": "RISKLEVEL",
                                "enBaseEnTel": "EMERASKTEL",
                                "enBaseStaffNum": "EMPNUM"
                            }
                        }, {
                            "//": "煤矿企业",
                            "id": "coalMine",
                            "table": "ANJIAN_COAL",
                            "fieldMap": {
                                "title": "COALNAME",
                                "enBaseAdress": "ADDRESS",
                                "enBaseLevel": "RISKLEVEL",
                                "enBaseEnTel": "CONTROLCENTERTEL",
                                "enBaseStaffNum": "WORERNUM"
                            }
                        }, {
                            "//": "烟花爆竹企业",
                            "id": "firework",
                            "table": "ANJIAN_FIREWORKENT",
                            "fieldMap": {
                                "title": "FIREWORKENTNAME",
                                "enBaseEnTel": "TEL",
                                "enBaseAdress": "ADDRESS",
                                "longitude": "LONGITUDE",
                                "latitude": "LATITUDE",
                                "enBaseStaffNum": "WORKERNUM"
                            }
                        }, {
                            "//": "非煤矿山企业",
                            "id": "mine",
                            "table": "ANJIAN_TAILINGPOND",
                            "fieldMap": {
                                "title": "WKKMC",
                                "enBaseEnTel": "WKKFZRYDDH",
                                "enBaseAdress": "WKKDZMC",
                                "longitude": "LONGITUDE",
                                "latitude": "LATITUDE",
                                "respper": "WKKFZR",
                                "enBaseStaffNum": "TZZYRYSL"
                            }
                        }]
                    },
                    'ss': {
                        "tables": [{
                            "//": "水库",
                            "id": "reservoir",
                            "table": "BAS_RESERVOIR",
                            "fieldMap": {
                                "title": "NAME",
                                "CODE": "CODE"
                            }
                        }, {
                            "//": "桥梁",
                            "id": "tunnel",
                            "table": "BAS_BRIDGE",
                            "fieldMap": {
                                "title": "BRIDGENAME",
                                "inBaseEnTel": "RESPOTEL",
                                "inBaseAdress": "ADDRESS",
                                "respper": "RESPPER",
                                "BRIDGECATEGORYCODE": "BRIDGECATEGORYCODE",
                                "DISTRICTCODE": "DISTRICTNAME"
                            }
                        }]
                    }
                };

                /***/
            }),

            /***/
            "./public/json/oldserver/RiskSourceService.js":
            /*!****************************************************!*\
              !*** ./public/json/oldserver/RiskSourceService.js ***!
              \****************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.slice */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.slice.js");

                __webpack_require__( /*! core-js/modules/es.number.constructor */ "./node_modules/_core-js@3.6.5@core-js/modules/es.number.constructor.js");

                (function(window) {
                    var Service = function Service(opts) {
                        var options = {
                            //资源类型
                            resourceKeys: ['NAH_GEO_GEOLOGICHAZ_P※01', //地质隐患
                                'mountaincollapse', 'landslide', 'debrisflow', 'miningcollapse', 'bottomcollapse', 'ANJIAN_DAGCHEMENT※DangerousChemical', //危化企业
                                'productionindustry', 'runeddustry', 'useddustry', 'otherdustry', 'majordanger', //危险源
                                'tailingpond', //尾矿库
                                'firework', //烟花爆竹企业
                                'fireworkhouse', //烟花爆竹企业
                                'metalnonmetal', 'coal', 'ANJIAN_ENT_WHSMYHBZ※01', 'metallurgical', 'nonferrous', 'mechanical', 'dust', 'refrigeration'
                            ]
                        };
                        this.opts = jQuery.extend(true, options, opts); // this.commonService = window.EMapServerV2.CommonService.getInstance(opts);

                        this.commonService = new window.EMapServerV2.CommonService(opts);
                    };
                    /**
                     * @param opts.resourceKeys
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getStatistics = function(opts, callback, ctx) {
                        //去掉最后一类地质隐患点
                        var resourceKeys = opts.resourceKeys || this.opts.resourceKeys.slice(0);
                        this.commonService.getStatistics(resourceKeys, {}, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };
                    /**
                     * 按条件统计
                     * @param opts
                     * @param opts.districtCode
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getStatisticsByFilter = function(opts, callback, ctx) {
                        var filter = {};
                        opts = opts || {};
                        filter.districtCode = opts.districtCode;
                        this.commonService.getStatistics(this.opts.resourceKeys, filter, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };
                    /**
                     * 查询列表数据
                     * @param opts
                     * @param opts.resourceKey，多个逗号分隔
                     * @param opts.pageSize
                     * @param opts.pageIndex
                     * @param opts.districtCode
                     * @param callback
                     * @param ctx
                     */


                    Service.prototype.getDataList = function(opts, callback, ctx) {
                        opts = opts || {};
                        opts.flatTag = true;
                        this.commonService.getDataList(opts, function(err, data) {
                            callback.call(ctx, null, data);
                        }, this);
                    };

                    Service.prototype.getNearbyList = function(opts, callback, ctx) {
                        opts = opts || {};
                        opts.flatTag = true;
                        opts.resourceKeys = this.opts.resourceKeys;
                        var radius = opts.config["ANJIAN_DAGCHEMENT※DangerousChemical"].radius;
                        this.commonService.getEventData(opts.eventType, function(err, data) {
                            var config = opts.config || {}; //读取默认距离配置、传参的距离

                            var configRadius = data.tag.SEARCH_DIST;

                            if (configRadius != null && configRadius != '' && !isNaN(configRadius)) {
                                configRadius = parseFloat(configRadius) * 1000;
                            } else {
                                configRadius = 1000 * 1000;
                            }

                            for (var i = 0; i < this.opts.resourceKeys.length; i++) {
                                var resourceKey = this.opts.resourceKeys[i];

                                if (config.hasOwnProperty(resourceKey)) {
                                    if (!config[resourceKey].radius) {
                                        config[resourceKey].radius = configRadius;
                                    }
                                } else {
                                    config[resourceKey] = {
                                        radius: configRadius
                                    };
                                }
                            }

                            this.commonService.getNearbyList(opts, function(err, resultSet) {
                                var list = resultSet.list;
                                resultSet.radius = list[0] ? list[0].radius : radius; //危化企业根据产量分类

                                for (var i = 0; i < list.length; i++) {
                                    var item = list[i];

                                    if (item && item.codeKey === this.opts.resourceKeys[0]) {
                                        var itemList = item.data;
                                        var rangeMap = {
                                            '1000': {
                                                range: [1000, Number.MAX_VALUE],
                                                list: []
                                            },
                                            '100': {
                                                range: [100, 1000],
                                                list: []
                                            },
                                            '0': {
                                                range: [0, 100],
                                                list: []
                                            }
                                        };
                                        var itemCount = itemList.length;

                                        for (var j = 0; j < itemCount; j++) {
                                            var rowObj = itemList[j],
                                                sumCount = rowObj.SUMOUTPUT;

                                            for (var rangeKey in rangeMap) {
                                                var rangeObj = rangeMap[rangeKey],
                                                    rangeArr = rangeObj.range;

                                                if (sumCount >= rangeArr[0] && sumCount < rangeArr[1]) {
                                                    rangeObj.list.push(rowObj);
                                                    break;
                                                }
                                            }
                                        }

                                        var newData = {};

                                        for (var k in rangeMap) {
                                            newData[k] = rangeMap[k].list;
                                        }

                                        item.data = newData;
                                    }
                                }

                                callback.call(ctx, null, resultSet);
                            }, this);
                        }, this);
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.RiskSourceService = Service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/RiskTroubleQueryService.js":
            /*!**********************************************************!*\
              !*** ./public/json/oldserver/RiskTroubleQueryService.js ***!
              \**********************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.join */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.join.js");

                __webpack_require__( /*! core-js/modules/es.object.keys */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js");

                (function(window) {
                    var util = {
                        /**
                         * @param opts
                         * @param opts.server
                         * @param opts.data
                         * @param cb
                         * @param ctx
                         */
                        aggregateMulti: function aggregateMulti(opts, cb, ctx) {
                            jQuery.ajax({
                                url: opts.server + '/dataStatics/aggregateMulti',
                                type: 'post',
                                data: {
                                    eId: 'safety',
                                    data: JSON.stringify(opts.data)
                                },
                                dataType: 'json',
                                success: function success(data) {
                                    if (data.success) {
                                        cb && cb.call(ctx, null, data.data);
                                    } else {
                                        cb && cb.call(ctx, new Error(data.msg));
                                    }
                                },
                                error: function error(xhr, msg, err) {
                                    cb && cb.call(ctx, new Error(err));
                                }
                            });
                        },

                        /**
                         * @param opts
                         * @param opts.server
                         * @param opts.eId
                         * @param opts.data
                         * @param cb
                         * @param ctx
                         */
                        queryMulti: function queryMulti(opts, cb, ctx) {
                            jQuery.ajax({
                                url: opts.server + '/dataOperate/queryMulti',
                                type: 'post',
                                data: {
                                    eId: opts.eId || 'safety',
                                    data: JSON.stringify(opts.data)
                                },
                                dataType: 'json',
                                success: function success(data) {
                                    if (data.success) {
                                        cb && cb.call(ctx, null, data.data);
                                    } else {
                                        cb && cb.call(ctx, new Error(data.msg));
                                    }
                                },
                                error: function error(xhr, msg, err) {
                                    cb && cb.call(ctx, new Error(err));
                                }
                            });
                        },
                        //是否为空
                        isEmptyValue: function isEmptyValue(value) {
                            return value == null || value == undefined || value == "" || value == " ";
                        },
                        R: 6378137,
                        fullRange: {
                            type: 'Polygon',
                            coordinates: [
                                [
                                    [0, 0],
                                    [180, 0],
                                    [180, 90],
                                    [0, 90],
                                    [0, 0]
                                ]
                            ]
                        },
                        //计算经纬度距离
                        caculateDistancePoints: function caculateDistancePoints(pt1, pt2) {
                            var R = util.R,
                                rad = Math.PI / 180,
                                lat1 = pt1[1] * rad,
                                lat2 = pt2[1] * rad,
                                a = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos((pt2[0] - pt1[0]) * rad);
                            return R * Math.acos(Math.min(a, 1));
                        },
                        levelFn: function levelFn(opts) {
                            var ratio = opts.data.distance / opts.maxDistance;
                            var levelCode = null;

                            for (var k in opts.levels) {
                                if (ratio > opts.levels[k][0] && ratio <= opts.levels[k][1]) {
                                    levelCode = k;
                                    break;
                                }
                            }

                            return {
                                level: levelCode
                            };
                        }
                    };
                    /**
                     *
                     * @param opts
                     * @param opts.server
                     * @constructor
                     */

                    var Service = function Service(opts) {
                        this.opts = {
                            server: EMAP_CONFIG.common.mongoService
                        };
                    };
                    /**
                     * 地震烈度范围的地质隐患统计
                     * @param opts
                     * @param opts.point {Array} [x,y] 事故点
                     * @param opts.geometry {GeoJSON} 烈度范围
                     * @param opts.resources {Object}
                     * @param opts.resources[k] {Object}
                     * @param opts.resources[k].tables {Array}
                     * @param opts.resources[k].tables[i].table
                     * @param opts.resources[k].tables[i].query
                     * @param opts.resources[k].tables[i].fieldMap
                     * @param opts.levels {Object} 级别映射表
                     * @param opts.levelFn {Function} 计算等级的方法
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getEqStatistics = function(opts, cb, ctx) {
                        var seperator = '_ss_',
                            geoJsonReader = G.utils.GeometryUtil.getGeoJSONReader(); //aggregate

                        var jtsGeometry = geoJsonReader.read(util.fullRange).difference(geoJsonReader.read(opts.geometry)),
                            pointJson = {
                                "type": "Point",
                                "coordinates": opts.point
                            },
                            jtsPoint = geoJsonReader.read(pointJson);
                        var distanceLimit = jtsGeometry.distance(jtsPoint) * Math.PI * util.R / 180;
                        var geoNear = {
                            "$geoNear": {
                                "spherical": true,
                                "near": pointJson,
                                "limit": 1000 * 10000,
                                "maxDistance": distanceLimit,
                                "distanceField": "distance",
                                "includeLocs": "geom"
                            }
                        };
                        var resourceCol = jQuery.extend(true, {}, opts.resources);
                        var aggregateList = [];

                        for (var resourceKey in resourceCol) {
                            var resourceTables = resourceCol[resourceKey].tables;

                            for (var i = 0; i < resourceTables.length; i++) {
                                var tableObj = resourceTables[i];
                                var aggregateObj = {},
                                    aggregate = [];
                                aggregate.push(geoNear);
                                aggregate.push({
                                    $match: {
                                        "geom": {
                                            "$geoIntersects": {
                                                "$geometry": opts.geometry
                                            }
                                        }
                                    }
                                });

                                if (tableObj.query && Object.keys(tableObj.query).length > 0) {
                                    aggregate.push({
                                        $match: tableObj.query
                                    });
                                }

                                aggregate.push({
                                    "$project": {
                                        "distance": "$distance"
                                    }
                                });
                                aggregateObj.aggregate = aggregate;
                                aggregateObj.queryIndex = 1;
                                aggregateObj.searchId = [resourceKey, tableObj.id].join(seperator);
                                aggregateObj.dataSetId = tableObj.table;
                                aggregateList.push(aggregateObj);
                            }
                        }

                        util.aggregateMulti({
                            server: this.opts.server,
                            data: aggregateList
                        }, function(err, data) {
                            var resultObj = {};

                            for (var resourceKey in resourceCol) {
                                var resourceObj = resourceCol[resourceKey];
                                var resourceResult = {
                                    total: 0,
                                    levels: new Array(4)
                                };

                                for (var kk = 0; kk < resourceResult.levels.length; kk++) {
                                    resourceResult.levels[kk] = {
                                        value: 0
                                    };
                                }

                                resultObj[resourceKey] = resourceResult;
                                var resourceTables = resourceObj.tables;

                                for (var i = 0; i < resourceTables.length; i++) {
                                    var dataList = data[[resourceKey, resourceTables[i].id].join(seperator)][resourceTables[i].table];

                                    for (var j = 0, dataLen = dataList.length; j < dataLen; j++) {
                                        var levelResult = opts.levelFn({
                                            data: dataList[j],
                                            maxDistance: distanceLimit,
                                            levels: opts.levels
                                        });
                                        resourceResult.levels[levelResult.level].value++;
                                    }

                                    resourceResult.total += dataLen;
                                }
                            }

                            cb && cb.call(ctx, null, resultObj);
                        }, this);
                    };
                    /**
                     * 地震烈度范围的地质隐患查询
                     * @param opts
                     * @param opts.point {Array} [x,y] 事故点
                     * @param opts.geometry {GeoJSON} 烈度范围
                     * @param opts.resources {Object}
                     * @param opts.resources[k] {Object}
                     * @param opts.resources[k].tables {Array}
                     * @param opts.resources[k].tables[i].table
                     * @param opts.resources[k].tables[i].query
                     * @param opts.resources[k].tables[i].fieldMap
                     * @param opts.levels {Object} 级别映射表
                     * @param opts.levelFn {Function} 计算等级的方法
                     * @param cb
                     * @param ctx
                     */


                    Service.prototype.getEqData = function(opts, cb, ctx) {
                        var geoJsonReader = G.utils.GeometryUtil.getGeoJSONReader(); //aggregate

                        var jtsGeometry = geoJsonReader.read(util.fullRange).difference(geoJsonReader.read(opts.geometry)),
                            pointJson = {
                                "type": "Point",
                                "coordinates": opts.point
                            },
                            jtsPoint = geoJsonReader.read(pointJson);
                        var distanceLimit = jtsGeometry.distance(jtsPoint) * Math.PI * util.R / 180;
                        var resourceCol = jQuery.extend(true, {}, opts.resources);
                        var queryCol = {};

                        for (var resourceKey in resourceCol) {
                            var resourceTables = resourceCol[resourceKey].tables;

                            for (var i = 0; i < resourceTables.length; i++) {
                                var tableObj = resourceTables[i];
                                var queryItem = {},
                                    query = {
                                        $and: [{
                                            "geom": {
                                                "$geoIntersects": {
                                                    "$geometry": opts.geometry
                                                }
                                            }
                                        }]
                                    };
                                queryItem.query = query;

                                if (tableObj.query) {
                                    query.$and.push(tableObj.query);
                                }

                                var selectList = ['geom', '_id'];

                                if (tableObj.fieldMap) {
                                    for (var field in tableObj.fieldMap) {
                                        selectList.push('tag.' + tableObj.fieldMap[field]);
                                    }
                                }

                                queryItem.select = selectList.join(' ');
                                queryCol[tableObj.table] = queryItem;
                            }
                        }

                        var resultHandler = function resultHandler(resultdata) {
                            var resultCol = {};

                            for (var resourceKey in resourceCol) {
                                var resultObj = {};
                                resultCol[resourceKey] = resultObj;

                                for (var levelCode in opts.levels) {
                                    resultObj[levelCode] = [];
                                }

                                var resourceTables = resourceCol[resourceKey].tables;

                                for (var i = 0; i < resourceTables.length; i++) {
                                    var tableObj = resourceTables[i];
                                    var dataList = resultdata[tableObj.table];

                                    for (var j = 0, dataLen = dataList.length; j < dataLen; j++) {
                                        var dataItem = dataList[j];
                                        var dataTemp = {};
                                        dataTemp.id = dataItem._id;
                                        dataTemp.geom = dataItem.geom;
                                        dataTemp._table = tableObj.table;
                                        dataTemp._type = tableObj.id; //attributes

                                        if (tableObj.fieldMap) {
                                            for (var field in tableObj.fieldMap) {
                                                dataTemp[field] = dataItem.tag[tableObj.fieldMap[field]] || '';
                                            }
                                        } //


                                        dataTemp.distance = util.caculateDistancePoints(opts.point, dataItem.geom.coordinates);
                                        var levelResult = opts.levelFn({
                                            data: dataTemp,
                                            maxDistance: distanceLimit,
                                            levels: opts.levels
                                        });
                                        resultObj[levelResult.level].push(dataTemp);
                                    }
                                }
                            }

                            return resultCol;
                        };

                        util.queryMulti({
                            server: this.opts.server,
                            data: queryCol
                        }, function(err, data) {
                            if (err == null) {
                                cb && cb.call(ctx, null, resultHandler(data, opts));
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * opts
                     * opts.type 
                     * opts.point 
                     * opts.geometry 
                     */


                    Service.prototype.queryData = function(opts, cb) {
                        //按照类型查询数据
                        var query = {};
                        query[opts.type] = window.EMapServerV2.RiskQueryServiceConfig[opts.type];
                        this.getEqData({
                            point: opts.point,
                            geometry: opts.geometry,
                            levelFn: util.levelFn,
                            levels: {
                                3: [0.7, 100000],
                                //最大距离的0.7倍以上
                                2: [0.4, 0.7],
                                //最大距离的0.4-0.7倍
                                1: [0.2, 0.4],
                                //最大距离的0.2-0.4倍
                                0: [0, 0.2] //最大距离的0.2倍

                            },
                            resources: query
                        }, function(err, data) {
                            if (err == null) {
                                console.log('隐患点统计');
                                cb(data);
                            } else {
                                console.error(err);
                            }
                        });
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {};
                    window.EMapServerV2.RiskTroubleQueryService = Service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/ServiceModule.js":
            /*!************************************************!*\
              !*** ./public/json/oldserver/ServiceModule.js ***!
              \************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.for-each */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.for-each.js");

                __webpack_require__( /*! core-js/modules/es.array.index-of */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.index-of.js");

                __webpack_require__( /*! core-js/modules/es.array.join */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.join.js");

                __webpack_require__( /*! core-js/modules/es.object.keys */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js");

                __webpack_require__( /*! core-js/modules/es.regexp.exec */ "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.exec.js");

                __webpack_require__( /*! core-js/modules/es.string.split */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.split.js");

                __webpack_require__( /*! core-js/modules/web.dom-collections.for-each */ "./node_modules/_core-js@3.6.5@core-js/modules/web.dom-collections.for-each.js");

                (function(window) {
                    var util = {
                        /**
                         * @param opts
                         * @param opts.server
                         * @param opts.eId
                         * @param opts.data
                         * @param cb
                         * @param ctx
                         */
                        aggregateMulti: function aggregateMulti(opts, cb, ctx) {
                            var url = opts.server + '/dataStatics/aggregateMulti';
                            var confs = opts.data;
                            var isNearbyQuery = false;

                            if (confs && confs.length === 1) {
                                var conf = confs[0];

                                if (conf.near) {
                                    isNearbyQuery = true;
                                    url = opts.server + '/dataStatics/aggregatePageNear';
                                }
                            }

                            jQuery.ajax({
                                url: url,
                                type: 'post',
                                data: {
                                    eId: opts.eId,
                                    data: JSON.stringify(opts.data)
                                },
                                dataType: 'json',
                                success: function success(data) {
                                    if (data.success) {
                                        var result = null;

                                        if (isNearbyQuery) {
                                            var searchId = conf.searchId;
                                            var datasetId = conf.dataSetId;

                                            if (Array.isArray(data.data) && searchId && datasetId) {
                                                result = {};
                                                result[searchId] = {};
                                                result[searchId][datasetId] = data.data;
                                            }
                                        } else {
                                            result = data.data;
                                        }

                                        cb && cb.call(ctx, null, result);
                                    } else {
                                        cb && cb.call(ctx, new Error(data.msg));
                                    }
                                },
                                error: function error(xhr, msg, err) {
                                    cb && cb.call(ctx, new Error(err));
                                }
                            });
                        }
                    }; //

                    var TABLE_PREFIX = 'user_safety_';
                    var DICT_SUFFIX = '_OBJ';
                    var EID = 'safety';
                    /**
                     *
                     * @param opts
                     * @param opts.server
                     */

                    var service = function service(opts) {
                        this.options = {
                            server: opts.server,
                            eId: EID
                        };
                    };
                    /**
                     * @private
                     */


                    service.prototype.aggregateMulti = util.aggregateMulti;
                    /**
                     * 缓冲区范围内的总数统计
                     * @param opts
                     * @param [opts.districtCode] {string} 行政区划编码
                     * @param [opts.districtField] {string} 行政区划编码字段
                     * @param opts.keyWord
                     * @param opts.bufferList {Array} 缓冲范围，geojson格式数组，4326坐标系
                     * @param opts.querys {Object} 统计的数据集合
                     * @param opts.querys[i].table {String}  表名
                     * @param opts.querys[i].query {String} 属性过滤
                     * @param opts.querys[i].sumType {String} 计数类型，1=按照记录数统计，2=按照记录某些数值属性统计，默认为1
                     * @param opts.querys[i].sumFields {Array} 用于统计总和的字段名数组（数字类型），当sumType=2时必填
                     */

                    service.prototype.bufferStatistics = function(opts, cb, ctx) {
                        var bufferList = opts.bufferList || [],
                            bufferCount = bufferList.length,
                            querys = opts.querys || {};
                        var queryCol = [];

                        for (var queryId in querys) {
                            var queryObj = querys[queryId];

                            if (bufferCount > 0) {
                                for (var j = 0; j < bufferCount; j++) {
                                    var queryItem = {};
                                    queryItem.query = queryObj.query || {};
                                    queryItem.dataSetId = queryObj.table;
                                    queryItem.queryIndex = 1;
                                    queryItem.searchId = [queryId, j].join('_');
                                    var aggregates = [{
                                        "$match": {
                                            "geom": {
                                                "$geoIntersects": {
                                                    "$geometry": bufferList[j]
                                                }
                                            }
                                        }
                                    }];
                                    var keyWords = [];

                                    if (Array.isArray(opts.keyWord)) {
                                        keyWords = opts.keyWord;
                                    } else if (typeof opts.keyWord == 'string') {
                                        keyWords.push(opts.keyWord);
                                    }

                                    var self = this;
                                    keyWords.forEach(function(keyWord) {
                                        var kwMatch = self.getSearchMatch(keyWord, queryObj);

                                        if (kwMatch) {
                                            aggregates.push(kwMatch);
                                        }
                                    });
                                    queryObj.districtField = queryObj.districtField || opts.districtField || 'DISTRICTCODE';
                                    var districtMatch = this.getDistrictMatch(opts.districtCode, queryObj);

                                    if (districtMatch) {
                                        aggregates.push(districtMatch);
                                    }

                                    queryObj.defaultSumObj = {};

                                    if (queryObj.sumType == 2) {
                                        //按照字段统计
                                        if (queryObj.sumFields && queryObj.sumFields.length > 0) {
                                            var groupObj = {
                                                _id: null
                                            };
                                            var defaultSumObj = {};

                                            for (var q = 0; q < queryObj.sumFields.length; q++) {
                                                var sumField = queryObj.sumFields[q];
                                                groupObj[sumField] = {
                                                    $sum: '$tag.' + sumField
                                                };
                                                defaultSumObj[sumField] = 0;
                                            }

                                            aggregates.push({
                                                $group: groupObj
                                            });
                                            queryObj.defaultSumObj = defaultSumObj;
                                        } else {
                                            throw new Error(queryObj.table + '：sumFields必须为正确的字段名数组！');
                                        }
                                    } else {
                                        queryObj.defaultSumObj.count = 0;
                                        aggregates.push({
                                            $count: 'count'
                                        });
                                    }

                                    queryItem.aggregate = aggregates;
                                    queryCol.push(queryItem);
                                }
                            } else {
                                if (opts.codes && opts.codes.length > 0) {
                                    var queryItem = {}; // queryItem.query = queryObj.query || {};

                                    queryItem.dataSetId = queryObj.table;
                                    queryItem.queryIndex = 0;
                                    queryItem.searchId = [queryId, 0].join('_');
                                    var aggregates = [];

                                    if (queryObj.query) {
                                        aggregates.push({
                                            $match: queryObj.query
                                        });
                                    }

                                    queryObj.districtField = queryObj.districtField || opts.districtField || 'DISTRICTCODE';
                                    var districtMatch = this.getDistrictMatch(opts.codes, queryObj);

                                    if (districtMatch) {
                                        aggregates.push(districtMatch);
                                    }

                                    var keyWords = [];

                                    if (Array.isArray(opts.keyWord)) {
                                        keyWords = opts.keyWord;
                                    } else if (typeof opts.keyWord == 'string') {
                                        keyWords.push(opts.keyWord);
                                    }

                                    var self = this;
                                    keyWords.forEach(function(keyWord) {
                                        var kwMatch = self.getSearchMatch(keyWord, queryObj);

                                        if (kwMatch) {
                                            aggregates.push(kwMatch);
                                        }
                                    });
                                    queryObj.defaultSumObj = {};

                                    if (queryObj.sumType == 2) {
                                        //按照字段统计
                                        if (queryObj.sumFields && queryObj.sumFields.length > 0) {
                                            var groupObj = {
                                                _id: null
                                            };
                                            var defaultSumObj = {};

                                            for (var q = 0; q < queryObj.sumFields.length; q++) {
                                                var sumField = queryObj.sumFields[q];
                                                groupObj[sumField] = {
                                                    $sum: '$tag.' + sumField
                                                };
                                                defaultSumObj[sumField] = 0;
                                            }

                                            aggregates.push({
                                                $group: groupObj
                                            });
                                            queryObj.defaultSumObj = defaultSumObj;
                                        } else {
                                            throw new Error(queryObj.table + '：sumFields必须为正确的字段名数组！');
                                        }
                                    } else {
                                        queryObj.defaultSumObj.count = 0;
                                        aggregates.push({
                                            $count: 'count'
                                        });
                                    }

                                    queryItem.aggregate = aggregates;
                                    queryCol.push(queryItem);
                                }
                            }
                        }

                        util.aggregateMulti({
                            server: this.options.server,
                            eId: this.options.eId,
                            async: false,
                            data: queryCol
                        }, function(err, data) {
                            if (err == null) {
                                var dataSet = data;
                                var resultSet = [];

                                if (bufferCount > 0) {
                                    for (var j = 0; j < bufferCount; j++) {
                                        var bufferResult = {};

                                        for (var queryId in querys) {
                                            var searchId = [queryId, j].join('_');
                                            var countResult = dataSet[searchId];

                                            if (countResult) {
                                                var sumObj = countResult[Object.keys(countResult)[0]][0] || querys[queryId].defaultSumObj;
                                                delete sumObj._id;
                                                bufferResult[queryId] = sumObj;
                                            } else {
                                                bufferResult[queryId] = 0;
                                            }
                                        }

                                        resultSet.push(bufferResult);
                                    }
                                } else {
                                    var bufferResult = {};

                                    for (var queryId in querys) {
                                        var searchId = [queryId, 0].join('_');
                                        var countResult = dataSet[searchId];

                                        if (countResult) {
                                            var sumObj = countResult[Object.keys(countResult)[0]][0] || querys[queryId].defaultSumObj;
                                            delete sumObj._id;
                                            bufferResult[queryId] = sumObj;
                                        } else {
                                            bufferResult[queryId] = 0;
                                        }
                                    }

                                    resultSet.push(bufferResult);
                                }

                                cb && cb.call(ctx, null, resultSet);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 缓冲区范围内的数据查询
                     * @param opts
                     * @param opts.id id
                     * @param opts.keyWord 关键字
                     * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
                     * @param opts.maxDistance {Number} 查询的范围半径，单位米，当buffer指定时，此属性无效
                     * @param opts.buffer {Object} 指定缓冲范围，geojson格式，4326坐标系
                     * @param opts.limit {Number} 每类数据查询结果记录数量限制，默认为100000
                     * @param opts.distanceField {String} 距离属性名
                     * @param opts.querys {Array} 查询的数据集合
                     * @param opts.querys[i].table {String}  表名
                     * @param opts.querys[i].maxDistance {Number} 当前数据查询的范围半径，单位米，默认等于opts.maxDistance
                     * @param opts.querys[i].limit {Number} 当前数据查询的记录数量限制，默认等于opts.limit
                     * @param opts.querys[i].query {String} 属性过滤
                     * @param opts.querys[i].fieldMap {String} 字段映射
                     * @param cb
                     * @param ctx
                     */


                    service.prototype.bufferQuery = function(opts, cb, ctx) {
                        var defaultLimit = 400000;
                        var defaults = {
                            limit: defaultLimit,
                            distanceField: '_distance'
                        };
                        var options = jQuery.extend(true, defaults, opts || {});

                        if (options.buffer) {
                            options.maxDistance = 3000 * 1000;
                        }

                        var limit = options.limit,
                            maxDistance = options.maxDistance,
                            distanceField = options.distanceField;
                        var queryCol = [];

                        for (var queryId in options.querys) {
                            var queryObj = options.querys[queryId];
                            var queryItem = {};
                            var aggregates = []; //geonear
                            //去除geonear条件，改用aggregatePageNear接口，解决mongo管道限制
                            // if (options.point) {
                            //     var geoNear = {
                            //         "spherical": true,
                            //         "near": {
                            //             "type": "Point",
                            //             "coordinates": options.point
                            //         },
                            //         "limit": queryObj.limit || limit || defaultLimit,
                            //         "maxDistance": queryObj.maxDistance || maxDistance,
                            //         "distanceField": distanceField,
                            //         "includeLocs": "geom"
                            //     };
                            //     aggregates.push({
                            //         "$geoNear": geoNear
                            //     });                
                            // }

                            if (options.id) {
                                aggregates.push(this.getIdMatch(opts.id));
                            }

                            queryObj.districtField = queryObj.districtField || 'DISTRICTCODE';
                            var districtMatch = this.getDistrictMatch(opts.districtCode, queryObj);

                            if (districtMatch) {
                                aggregates.push(districtMatch);
                            }

                            var keyWords = [];

                            if (Array.isArray(opts.keyWord)) {
                                keyWords = opts.keyWord;
                            } else if (typeof opts.keyWord == 'string') {
                                keyWords.push(opts.keyWord);
                            }

                            var self = this;
                            keyWords.forEach(function(keyWord) {
                                var kwMatch = self.getSearchMatch(keyWord, queryObj);

                                if (kwMatch) {
                                    aggregates.push(kwMatch);
                                }
                            });

                            if (options.near) {
                                queryItem.near = options.near;
                                queryItem.distanceField = options.distanceField;
                            }

                            if (options.paging && options.pageSize && options.pageIndex) {
                                queryItem.paging = options.paging;
                                queryItem.pageSize = options.pageSize;
                                queryItem.pageIndex = options.pageIndex;
                            } //属性过滤


                            if (queryObj.query && Object.keys(queryObj.query).length > 0) {
                                aggregates.push({
                                    "$match": queryObj.query
                                });
                            } //缓冲过滤


                            if (options.buffer) {
                                aggregates.push({
                                    "$match": {
                                        "geom": {
                                            "$geoIntersects": {
                                                "$geometry": options.buffer
                                            }
                                        }
                                    }
                                });
                            } //


                            var projectMap = {
                                'geom': '$geom'
                            };
                            projectMap[distanceField] = '$' + distanceField; //排序

                            var sorts = queryObj.sorts;

                            if (sorts) {
                                aggregates.push({
                                    "$sort": sorts
                                });
                            } //关联


                            var relations = queryObj.relations || [];
                            var relProjectSet = {};

                            if (relations.length > 0) {
                                for (var kk = 0; kk < relations.length; kk++) {
                                    var relationObj = relations[kk];
                                    aggregates.push({
                                        "$lookup": {
                                            "from": TABLE_PREFIX + relationObj.table,
                                            "localField": "tag." + relationObj.localField,
                                            "foreignField": "tag." + relationObj.foreignField,
                                            "as": relationObj.localField
                                        }
                                    });
                                    aggregates.push({
                                        "$unwind": {
                                            "path": "$" + relationObj.localField,
                                            "preserveNullAndEmptyArrays": true
                                        }
                                    });
                                    relProjectSet[relationObj.localField] = '$' + relationObj.localField + '.tag';
                                }
                            } //字段映射


                            var fieldMap = queryObj.fieldMap || {};

                            for (var relField in relProjectSet) {
                                var alias = 'tag.' + relField;

                                for (var fieldName in fieldMap) {
                                    if (fieldMap[fieldName] === relField) {
                                        alias = 'tag.' + fieldName + DICT_SUFFIX;
                                    }
                                }

                                projectMap[alias] = relProjectSet[relField];
                            }

                            for (var fieldName in fieldMap) {
                                if (fieldMap[fieldName].indexOf('.') >= 0) {
                                    projectMap['tag.' + fieldName] = '$' + fieldMap[fieldName];
                                } else {
                                    projectMap['tag.' + fieldName] = '$tag.' + fieldMap[fieldName];
                                }
                            }

                            aggregates.push({
                                "$project": projectMap
                            }); //

                            queryItem.dataSetId = queryObj.table;
                            queryItem.queryIndex = 1;
                            queryItem.searchId = queryId;
                            queryItem.aggregate = aggregates; //重大风险加筛选 by lsl

                            if (queryObj.query) {
                                queryItem.query = queryObj.query;
                            }

                            queryCol.push(queryItem);
                        }

                        var eId;

                        if (options.eId) {
                            eId = options.eId;
                        } else {
                            eId = this.options.eId;
                        }

                        util.aggregateMulti({
                            server: this.options.server,
                            eId: eId,
                            data: queryCol
                        }, function(err, dataSet) {
                            if (err == null) {
                                var resultSet = {};

                                for (var queryId in options.querys) {
                                    var eachData = dataSet[queryId];
                                    var list = eachData[Object.keys(eachData)[0]];
                                    resultSet[queryId] = list;
                                }

                                cb && cb.call(ctx, null, resultSet);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 主键（id）筛选
                     * @param id
                     * @param [idField]
                     */


                    service.prototype.getIdMatch = function(id, idField) {
                        if (!idField) {
                            idField = '_id';
                        }

                        if (id) {
                            var query = {};
                            var filter = {};
                            filter['$regex'] = "^" + id + "$";
                            query[idField] = filter;
                            var idquery = {
                                $match: query
                            };
                            return idquery;
                        } else {
                            return null;
                        }
                    };
                    /**
                     * 拼接关键字条件--预留方法
                     * @param kw
                     * @param resource
                     */


                    service.prototype.getSearchMatch = function(kw, resource) {
                        if (kw) {
                            var query = {};
                            var filter = {};
                            filter['$regex'] = "^.*" + kw + ".*$";
                            query['tag.' + resource.keyWordFields] = filter;
                            var kwquery = {
                                $match: query
                            };
                            return kwquery;
                        } else {
                            return null;
                        }
                    };
                    /**
                     * 查询详情
                     * @param opts
                     * @param opts.table {String} 表名
                     * @param opts.dataId {String} 数据id
                     * @param opts.relations {Array} 关联
                     * @param cb
                     * @param ctx
                     */


                    service.prototype.queryById = function(opts, cb, ctx) {
                        var queryCol = [],
                            queryItem = {},
                            aggregates = []; //

                        aggregates.push({
                            $match: {
                                "_id": opts.dataId
                            }
                        }); //

                        var projectMap = {
                            'geom': '$geom',
                            'tag': '$tag'
                        }; //关联

                        var relations = opts.relations || [];

                        if (relations.length > 0) {
                            for (var kk = 0; kk < relations.length; kk++) {
                                var relationObj = relations[kk];
                                aggregates.push({
                                    "$lookup": {
                                        "from": TABLE_PREFIX + relationObj.table,
                                        "localField": "tag." + relationObj.localField,
                                        "foreignField": "tag." + relationObj.foreignField,
                                        "as": relationObj.localField
                                    }
                                });
                                aggregates.push({
                                    "$unwind": {
                                        "path": "$" + relationObj.localField,
                                        "preserveNullAndEmptyArrays": true
                                    }
                                });
                                projectMap[relationObj.localField] = '$' + relationObj.localField + '.tag';
                            }

                            aggregates.push({
                                '$project': projectMap
                            });
                        } //


                        queryItem.dataSetId = opts.table;
                        queryItem.queryIndex = 1;
                        queryItem.searchId = 'query';
                        queryItem.aggregate = aggregates;
                        queryCol.push(queryItem);
                        util.aggregateMulti({
                            server: this.options.server,
                            eId: this.options.eId,
                            data: queryCol
                        }, function(err, dataSet) {
                            if (err == null) {
                                var resultObj = dataSet.query;
                                var resultSet = resultObj[opts.table][0];
                                var tag = resultSet.tag;

                                for (var kk in tag) {
                                    if (resultSet.hasOwnProperty(kk)) {
                                        tag[kk + DICT_SUFFIX] = resultSet[kk];
                                        delete resultSet[kk];
                                    }
                                }

                                cb && cb.call(ctx, null, resultSet);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };

                    service.prototype.queryByAttr = function(opts, cb, ctx) {
                        var queryCol = [],
                            queryItem = {},
                            aggregates = []; //

                        if (opts.dataId) {
                            aggregates.push({
                                $match: {
                                    "tag.CLASID": opts.dataId
                                }
                            });
                        } //


                        var projectMap = {
                            'geom': '$geom',
                            'tag': '$tag'
                        }; //关联

                        var relations = opts.relations || [];

                        if (relations.length > 0) {
                            for (var kk = 0; kk < relations.length; kk++) {
                                var relationObj = relations[kk];
                                aggregates.push({
                                    "$lookup": {
                                        "from": TABLE_PREFIX + relationObj.table,
                                        "localField": "tag." + relationObj.localField,
                                        "foreignField": "tag." + relationObj.foreignField,
                                        "as": relationObj.localField
                                    }
                                });
                                aggregates.push({
                                    "$unwind": {
                                        "path": "$" + relationObj.localField,
                                        "preserveNullAndEmptyArrays": true
                                    }
                                });
                                projectMap[relationObj.localField] = '$' + relationObj.localField + '.tag';
                            }

                            aggregates.push({
                                '$project': projectMap
                            });
                        } //


                        queryItem.dataSetId = opts.table;
                        queryItem.queryIndex = 10;
                        queryItem.searchId = 'query';
                        queryItem.aggregate = aggregates;
                        queryCol.push(queryItem);
                        util.aggregateMulti({
                            server: this.options.server,
                            eId: this.options.eId,
                            data: queryCol
                        }, function(err, dataSet) {
                            if (err == null) {
                                var resultObj = dataSet.query;
                                var resultSet = resultObj[opts.table]; // var tag = resultSet.tag;
                                // for (var kk in tag) {
                                //     if (resultSet.hasOwnProperty(kk)) {
                                //         tag[kk + DICT_SUFFIX] = resultSet[kk];
                                //         delete resultSet[kk];
                                //     }
                                // }

                                cb && cb.call(ctx, null, resultSet);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 缓冲区范围内的数据查询
                     * @param opts
                     * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
                     * @param opts.distanceField {String} 距离属性名
                     * @param opts.materialNeed　{Object} 物资需求
                     * @param cb
                     * @param ctx
                     */


                    service.prototype.bufferQueryMaterial = function(opts, cb, ctx) {
                        opts.distanceField = opts.distanceField || '_distance';
                        var queryCol = [],
                            queryItem = {};
                        var aggregates = [{
                            "$geoNear": {
                                "spherical": true,
                                "near": {
                                    "type": "Point",
                                    "coordinates": opts.point
                                },
                                "limit": 100000,
                                "maxDistance": 10000000,
                                "distanceField": opts.distanceField,
                                "includeLocs": "geom"
                            }
                        }, {
                            $lookup: {
                                "from": "user_safety_JC_MATERIAL_INFO",
                                "localField": "_id",
                                "foreignField": "tag.REPERTORYID",
                                "as": "materials"
                            }
                        }];
                        queryItem.dataSetId = 'JC_REPERTORY';
                        queryItem.queryIndex = 1;
                        queryItem.searchId = 'query';
                        queryItem.aggregate = aggregates;
                        queryCol.push(queryItem);
                        util.aggregateMulti({
                            server: this.options.server,
                            eId: this.options.eId,
                            data: queryCol
                        }, function(err, dataSet) {
                            if (err == null) {
                                var reposityList = dataSet.query[Object.keys(dataSet.query)[0]];
                                var resultSet = {}; //计算提取物资提取

                                var materialNeed = opts.materialNeed || {};

                                for (var materialId in materialNeed) {
                                    var dispatchResult = this._caculateDispatchResult(materialId, materialNeed[materialId], reposityList, {
                                        attachKey: 'materials',
                                        codeKey: 'MATERIALTYPE',
                                        numKey: 'MATERIALNUM',
                                        distanceField: opts.distanceField
                                    });

                                    resultSet[materialId] = dispatchResult;
                                }

                                cb && cb.call(ctx, null, resultSet);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 提取调配
                     * @param code
                     * @param needCount
                     * @param list
                     * @private
                     */


                    service.prototype._caculateDispatchResult = function(code, needCount, list, opts) {
                        var provideList = [],
                            fulfillCount = 0,
                            total = list.length,
                            attachKey = opts.attachKey,
                            codeKey = opts.codeKey,
                            numKey = opts.numKey;

                        for (var i = 0; i < total; i++) {
                            var item = list[i];
                            var attachList = item[attachKey] || [],
                                attachCount = attachList.length,
                                thisItem = {
                                    _id: item._id,
                                    geom: item.geom,
                                    dis: item[opts.distanceField],
                                    tag: item.tag
                                }; //遍历装备物资

                            for (var j = 0; j < attachCount; j++) {
                                var attachItem = attachList[j];

                                if (attachItem && attachItem.tag && attachItem.tag[codeKey] == code) {
                                    var attachNum = attachItem.tag[numKey],
                                        promiseCount = fulfillCount + attachNum;

                                    if (!attachNum || isNaN(attachNum)) {
                                        continue;
                                    }

                                    if (promiseCount < needCount) {
                                        thisItem.num = attachNum;
                                    } else {
                                        thisItem.num = needCount - fulfillCount;
                                    }

                                    fulfillCount += thisItem.num;
                                    provideList.push(thisItem);
                                    break;
                                }
                            }

                            if (fulfillCount >= needCount) {
                                break;
                            }
                        }

                        var result = {
                            num: fulfillCount,
                            list: provideList
                        };
                        return result;
                    };
                    /**
                     * 拼接行政区划条件
                     * @param districtCode
                     * @param resource
                     * @param resource.districtField 行政区划字段名
                     * @param resource.districtKey 可选，默认为空
                     */


                    service.prototype.getDistrictMatch = function(districtCode, resource) {
                        var match = null;

                        if (districtCode && districtCode !== '000000' && resource.districtField) {
                            var districtCodes = districtCode.split(','),
                                districtField = resource.districtField;
                            var or = [],
                                districtKey = null;

                            if (resource.districtKey) {
                                districtKey = resource.districtKey;
                            } else {
                                districtKey = 'tag.' + districtField;
                            }

                            for (var i = 0; i < districtCodes.length; i++) {
                                var districtCode = districtCodes[i];

                                if (districtCode) {
                                    var eachFilter = {};
                                    eachFilter[districtKey] = {
                                        $regex: getDistrictRegex(districtCode)
                                    };
                                    or.push(eachFilter);
                                }
                            }

                            match = {
                                $match: {
                                    $or: or
                                }
                            };
                        } else {
                            var matchObj = {}; // matchObj['tag.'+resource.districtField] = {
                            //     $regex: '.*',
                            // };

                            match = {
                                $match: matchObj
                            };
                            console.debug('ignore district filter');
                        }

                        return match;

                        function getDistrictRegex(code) {
                            var c = code.substr(0, 6);

                            if ('000000' == c) {
                                //全国不过滤
                                c = '.*';
                            } else if (/^\d{2}0000$/.test(c)) {
                                c = c.substr(0, 2) + '.*';
                            } else if (/^\d{4}00$/.test(c)) {
                                c = c.substr(0, 4) + '.*';
                            } else {
                                //灾情信息员code都是12位
                                c = c + '.*';
                            }

                            return '^' + c + '$';
                        }
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.ServiceModule = service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/bufferService.js":
            /*!************************************************!*\
              !*** ./public/json/oldserver/bufferService.js ***!
              \************************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.concat */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.concat.js");

                __webpack_require__( /*! core-js/modules/es.array.index-of */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.index-of.js");

                __webpack_require__( /*! core-js/modules/es.array.join */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.join.js");

                __webpack_require__( /*! core-js/modules/es.array.sort */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.sort.js");

                __webpack_require__( /*! core-js/modules/es.function.name */ "./node_modules/_core-js@3.6.5@core-js/modules/es.function.name.js");

                __webpack_require__( /*! core-js/modules/es.object.keys */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js");

                __webpack_require__( /*! core-js/modules/es.object.to-string */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.to-string.js");

                __webpack_require__( /*! core-js/modules/es.regexp.exec */ "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.exec.js");

                __webpack_require__( /*! core-js/modules/es.regexp.to-string */ "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.to-string.js");

                __webpack_require__( /*! core-js/modules/es.string.ends-with */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.ends-with.js");

                __webpack_require__( /*! core-js/modules/es.string.match */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.match.js");

                __webpack_require__( /*! core-js/modules/es.string.split */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.split.js");

                __webpack_require__( /*! core-js/modules/es.string.trim */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.trim.js");

                (function(window) {
                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.bufferService = {};
                    var EID = 'safety';
                    var CONSTS = {
                        "EMPTY_STR": "-",
                        "TEAM": "队伍",
                        "EQUIPMENT": "装备",
                        "CONTACT": "CONTACT",
                        "CONTACT_LABEL": "负责人",
                        "TEL": "TEL",
                        "TEL_LABEL": "负责人电话",
                        "BELONG_RESCUE": "所属救援队伍"
                    };
                    var util = {
                        /**
                         * 获取元数据
                         * @param opts
                         * @param opts
                         * @param opts.server
                         * @param opts.eId
                         * @param opts.tableNames {Array}
                         * @param cb
                         * @param ctx
                         */
                        queryDataSet: function queryDataSet(opts, cb, ctx) {
                            var query = {
                                "dataSetId": {
                                    "$in": opts.tableNames
                                }
                            };
                            jQuery.ajax({
                                url: opts.server + '/dataSet/query',
                                type: 'post',
                                data: {
                                    eId: opts.eId,
                                    query: JSON.stringify(query)
                                },
                                dataType: 'json',
                                success: function success(data) {
                                    if (data.success) {
                                        cb && cb.call(ctx, null, data.data);
                                    } else {
                                        cb && cb.call(ctx, new Error(data.msg));
                                    }
                                },
                                error: function error(xhr, msg, err) {
                                    cb && cb.call(ctx, new Error(err));
                                }
                            });
                        },

                        /**
                         * @param opts
                         * @param opts.server
                         * @param opts.eId
                         * @param opts.data
                         * @param cb
                         * @param ctx
                         */
                        aggregateMulti: function aggregateMulti(opts, cb, ctx) {
                            jQuery.ajax({
                                url: opts.server + '/dataStatics/aggregateMulti',
                                type: 'post',
                                data: {
                                    eId: opts.eId,
                                    data: JSON.stringify(opts.data)
                                },
                                dataType: 'json',
                                success: function success(data) {
                                    if (data.success) {
                                        cb && cb.call(ctx, null, data.data);
                                    } else {
                                        cb && cb.call(ctx, new Error(data.msg));
                                    }
                                },
                                error: function error(xhr, msg, err) {
                                    cb && cb.call(ctx, new Error(err));
                                }
                            });
                        },

                        /**
                         * @param opts
                         * @param opts.server
                         * @param opts.eId
                         * @param opts.data
                         * @param cb
                         * @param ctx
                         */
                        queryMulti: function queryMulti(opts, cb, ctx) {
                            jQuery.ajax({
                                url: opts.server + '/dataOperate/queryMulti',
                                type: 'post',
                                data: {
                                    eId: opts.eId,
                                    data: JSON.stringify(opts.data)
                                },
                                dataType: 'json',
                                success: function success(data) {
                                    if (data.success) {
                                        cb && cb.call(ctx, null, data.data);
                                    } else {
                                        cb && cb.call(ctx, new Error(data.msg));
                                    }
                                },
                                error: function error(xhr, msg, err) {
                                    cb && cb.call(ctx, new Error(err));
                                }
                            });
                        },
                        //计算经纬度距离
                        caculateDistancePoints: function caculateDistancePoints(pt1, pt2) {
                            var R = 6378137,
                                rad = Math.PI / 180,
                                lat1 = pt1[1] * rad,
                                lat2 = pt2[1] * rad,
                                a = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos((pt2[0] - pt1[0]) * rad);
                            return R * Math.acos(Math.min(a, 1));
                        },
                        //计算距离
                        caculateDistance: function caculateDistance(point, geojson) {
                            var geom = g2.sfs.GeometryFactory.createGeometryFromGeoJson(geojson);
                            geom.spatialReference = 4326;
                            var point2d = util.projectService.transform(new g2.sfs.Point({
                                x: point[0],
                                y: point[1],
                                spatialReference: 4326
                            }), 3857);
                            var geom2d = util.projectService.transform(geom, 3857);
                            var jtsPoint = util.geoJsonReader.read(point2d.asGeoJson());
                            var jtsGeom = util.geoJsonReader.read(geom2d.asGeoJson());
                            return jtsPoint.distance(jtsGeom);
                        },
                        isObject: function isObject(obj) {
                            return Object.prototype.toString.call(obj) == '[object Object]';
                        },
                        isString: function isString(obj) {
                            return Object.prototype.toString.call(obj) == '[object String]';
                        },
                        //处理空值
                        handleEmptyValue: function handleEmptyValue(obj) {
                            if (obj) {
                                for (var attrName in obj) {
                                    var attrVal = obj[attrName];
                                    obj[attrName] = util.isEmptyValue(attrVal) ? CONSTS.EMPTY_STR : attrVal;
                                }
                            }
                        },
                        //是否为空
                        isEmptyValue: function isEmptyValue(value) {
                            return value == null || value == undefined || value == "" || value == " ";
                        },

                        /**
                         * 提取关联项字段
                         * @param showField
                         * @param data
                         */
                        extractDictShowField: function extractDictShowField(localField, showField, data) {
                            if (data[localField]) {
                                if (util.isObject(showField)) {
                                    var tag = data[localField].tag;
                                    delete data[localField];

                                    for (var k in showField) {
                                        if (k == '//') {
                                            continue;
                                        }

                                        data[showField[k]] = util.isEmptyValue(tag[k]) ? CONSTS.EMPTY_STR : tag[k];
                                    }
                                } else {
                                    data[localField] = data[localField].tag[showField];
                                }
                            }
                        },

                        /**
                         * 处理联系人电话
                         * @param type
                         * @param data
                         */
                        handleContactTel: function handleContactTel(type, data) {
                            if (type === CONSTS.EQUIPMENT || type === CONSTS.TEAM) {
                                var count = 4,
                                    i = 1,
                                    n = 0;

                                for (; i <= count; i++) {
                                    if (n == 2) {
                                        break;
                                    }

                                    if (data.hasOwnProperty('C' + i) && data['C' + i] != CONSTS.EMPTY_STR) {
                                        data[CONSTS.CONTACT] = data['C' + i];
                                        n++;
                                    }

                                    if (data.hasOwnProperty('T' + i) && data['T' + i] != CONSTS.EMPTY_STR) {
                                        data[CONSTS.TEL] = data['T' + i];
                                        n++;
                                    }
                                }

                                if (n < 2) {
                                    data[CONSTS.CONTACT] = data[CONSTS.CONTACT] || CONSTS.EMPTY_STR;
                                    data[CONSTS.TEL] = data[CONSTS.TEL] || CONSTS.EMPTY_STR;
                                }
                            }
                        },
                        //关键字过滤
                        filterByKw: function filterByKw(kw, data, kwFields) {
                            if (kw) {
                                var flag = false;

                                for (var i = 0; i < kwFields.length; i++) {
                                    var kwField = kwFields[i];

                                    if (util.isObject(kwField.relShowField)) {
                                        for (var relField in kwField.relShowField) {
                                            var fieldName = kwField.relShowField[relField];

                                            if (data[fieldName] && (data[fieldName] + '').indexOf(kw) >= 0) {
                                                flag = true;
                                                break;
                                            }
                                        }

                                        if (flag) {
                                            break;
                                        }
                                    } else {
                                        var fieldName = kwField.mapName || kwField.name;

                                        if (data[fieldName] && (data[fieldName] + '').indexOf(kw) >= 0) {
                                            flag = true;
                                            break;
                                        }
                                    }
                                }

                                return flag;
                            } else {
                                return true;
                            }
                        }
                    };
                    util.projectService = new g2.sfs.CoordinateTransform();
                    util.geoJsonReader = new jsts.io.GeoJSONReader(); //

                    /**
                     *
                     * @param opts
                     * @param opts.server
                     * @param opts.resourceConfig
                     */

                    window.EMapServerV2.bufferService = function(opts) {
                        this.options = {
                            server: opts.server,
                            eId: EID,
                            resourceConfig: jQuery.extend(true, {}, opts.resourceConfig)
                        };
                        this.initialize();
                    };
                    /**
                     * 初始化
                     * @param cb
                     * @param ctx
                     */


                    window.EMapServerV2.bufferService.prototype.initialize = function() {
                        var resources = this.options.resourceConfig.resources;
                        var tableNames = [];

                        for (var i = 0; i < resources.length; i++) {
                            var resourceObj = resources[i];
                            resourceObj.tableIdSet = {};
                            var resourceTables = resourceObj.tables;

                            for (var j = 0; j < resourceTables.length; j++) {
                                var tableObj = resourceTables[j];
                                tableNames.push(tableObj.name); //

                                resourceObj.tableIdSet[tableObj.name] = true; //

                                var listFields = tableObj.list;
                                var kwFields = [];
                                var listFieldMap = {};
                                var listRelations = [];

                                for (var k = 0; k < listFields.length; k++) {
                                    var fieldObj = listFields[k];

                                    if (fieldObj.match) {
                                        kwFields.push(listFields[k]);
                                    }

                                    if (fieldObj.mapName) {
                                        listFieldMap[fieldObj.name] = fieldObj.mapName;
                                    } //关联


                                    if (fieldObj.relShowField) {
                                        listRelations.push({
                                            localField: fieldObj.name,
                                            showField: fieldObj.relShowField
                                        });
                                    }
                                } //


                                var detailFields = tableObj.detail;
                                var detailFieldMap = {};
                                var detailRelations = [];

                                for (var k = 0; k < detailFields.length; k++) {
                                    var fieldObj = detailFields[k];

                                    if (fieldObj.mapName) {
                                        detailFieldMap[fieldObj.name] = fieldObj.mapName;
                                    } //关联


                                    if (fieldObj.relShowField) {
                                        detailRelations.push({
                                            localField: fieldObj.name,
                                            showField: fieldObj.relShowField
                                        });
                                    }
                                } //


                                var relateTables = tableObj.relateTables || [];

                                for (var k = 0; k < relateTables.length; k++) {
                                    var relateTable = relateTables[k];
                                    var fields = relateTable.fields || [];
                                    var relateFieldMap = {};
                                    var relateRelations = [];

                                    for (var kk = 0; kk < fields.length; kk++) {
                                        var fieldObj = fields[kk];

                                        if (fieldObj.mapName) {
                                            relateFieldMap[fieldObj.name] = fieldObj.mapName;
                                        } //关联


                                        if (fieldObj.relShowField) {
                                            relateRelations.push({
                                                localField: fieldObj.name,
                                                showField: fieldObj.relShowField
                                            });
                                        }
                                    }

                                    relateTable.fieldMap = relateFieldMap;
                                    relateTable.relations = relateRelations;
                                } //


                                tableObj.listFieldMap = listFieldMap;
                                tableObj.listKw = kwFields;
                                tableObj.listRelations = listRelations;
                                tableObj.detailFieldMap = detailFieldMap;
                                tableObj.detailRelations = detailRelations;
                            }
                        }
                    };
                    /**
                     * 缓冲查或者范围查询
                     * @param opts
                     * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
                     * @param opts.radius　{Number} 缓冲距离，单位公里，与geometry互斥
                     * @param opts.geometry　{Number} 查询多边形，优先于radius
                     * @param opts.distanceField {String} 距离属性名
                     * @param opts.keyword　{String} 模糊匹配
                     * @param opts.resources {Array} 资源数组
                     * @param cb
                     * @param ctx
                     */


                    window.EMapServerV2.bufferService.prototype.bufferOrPolygonQuery = function(opts, cb, ctx) {
                        var polygon = null;

                        if (opts.geometry) {
                            if (util.isString(opts.geometry)) {
                                var jtsGeom = G.utils.GeometryUtil.getWktReader().read(opts.geometry);
                                polygon = G.utils.GeometryUtil.getGeoJSONWriter().write(jtsGeom);
                            } else {
                                polygon = opts.geometry;
                            }
                        } else {
                            var projService = new g2.sfs.CoordinateTransform();
                            var pointGeom = new g2.sfs.Point({
                                x: opts.point[0],
                                y: opts.point[1],
                                spatialReference: 4326
                            });
                            var pointGeom3857 = projService.transform(pointGeom, 3857);
                            polygon = G.utils.SpatialOPUtil.getBuffer({
                                geometry: {
                                    type: "Point",
                                    coordinates: [pointGeom3857.x, pointGeom3857.y]
                                },
                                radius: opts.radius * 1000,
                                spatialReference: 3857
                            });
                            var polygonGeom = g2.sfs.GeometryFactory.createGeometryFromGeoJson(polygon);
                            polygonGeom.spatialReference = 3857;
                            polygon = projService.transform(polygonGeom, 4326).asGeoJson();
                        }

                        return this._query({
                            geometry: polygon,
                            point: opts.point,
                            distanceField: opts.distanceField,
                            keyword: opts.keyword,
                            resources: opts.resources
                        }, cb, ctx);
                    };
                    /**
                     * 查询行政区划内的数据，并计算到指定点距离，由近到远排序
                     * @param opts
                     * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
                     * @param opts.districtCode　{String} 行政区划编码
                     * @param opts.distanceField {String} 距离属性名
                     * @param opts.keyword　{String} 模糊匹配
                     * @param opts.resources {Array} 资源数组
                     * @param opts.resources[i].tables {Array} 查询的条件
                     * @param opts.resources[i].tables[j].table {String} 查询的表
                     * @param opts.resources[i].tables[j].query {Object} 查询条件
                     * @param cb
                     * @param ctx
                     */


                    window.EMapServerV2.bufferService.prototype.districtQuery = function(opts, cb, ctx) {
                        var queryCol = {},
                            queryItem = {},
                            districtCodes = opts.districtCode.split(',');

                        for (var i = 0; i < districtCodes.length; i++) {
                            var districtCode = districtCodes[i];
                            var districtTable = "province0.01";

                            if (districtCode.endsWith('0000')) {
                                districtTable = 'province0.01';
                            } else if (districtCode.endsWith('00')) {
                                districtTable = 'city0.03';
                            } else {
                                districtTable = 'county0.06';
                            }

                            if (queryCol.hasOwnProperty(districtTable)) {
                                queryItem.query['$or'].push({
                                    "tag.adcode": districtCode
                                });
                            } else {
                                queryItem.query = {
                                    "$or": [{
                                        "tag.adcode": districtCode
                                    }]
                                };
                                queryCol[districtTable] = queryItem;
                            }
                        }

                        util.queryMulti({
                            server: this.options.server,
                            eId: 'siptea',
                            data: queryCol
                        }, function(err, data) {
                            if (err == null) {
                                var geojsonList = [];

                                for (var table in data) {
                                    var list = data[table];

                                    for (var i = 0; i < list.length; i++) {
                                        if (list[i] && list[i].geom) {
                                            geojsonList.push(list[i].geom);
                                        }
                                    }
                                }

                                var geometry = null;

                                if (geojsonList.length > 1) {
                                    var tempCoordinates = [];
                                    console.debug(JSON.stringify(geojsonList, null, 4));

                                    for (var k = 0; k < geojsonList.length; k++) {
                                        var geoJsonItem = geojsonList[k];

                                        if (geoJsonItem.type === 'MultiPolygon') {
                                            for (var kk = 0; kk < geoJsonItem.coordinates.length; kk++) {
                                                tempCoordinates.push(geoJsonItem.coordinates[kk]);
                                            }
                                        } else {
                                            tempCoordinates.push(geoJsonItem.coordinates);
                                        }
                                    }

                                    geometry = {
                                        type: 'MultiPolygon',
                                        coordinates: tempCoordinates
                                    };
                                } else {
                                    geometry = geojsonList[0];
                                }

                                this._query({
                                    geometry: geometry,
                                    point: opts.point,
                                    distanceField: opts.distanceField,
                                    keyword: opts.keyword,
                                    resources: opts.resources
                                }, cb, ctx);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 查询范围内的数据，并计算到指定点距离，由近到远排序
                     * @param opts
                     * @param opts.tableName　{String} 表名
                     * @param opts.dataId {String} 数据id
                     * @param cb
                     * @param ctx
                     */


                    window.EMapServerV2.bufferService.prototype.queryDetail = function(opts, cb, ctx) {
                        var tableObj = null;
                        var resources = this.options.resourceConfig.resources;
                        var thisResourceObj = null;

                        for (var i = 0; i < resources.length; i++) {
                            var resourceObj = resources[i];

                            for (var j = 0; j < resourceObj.tables.length; j++) {
                                var thisTable = resourceObj.tables[j];

                                if (thisTable.name === opts.tableName) {
                                    tableObj = thisTable;
                                    thisResourceObj = resourceObj;
                                    break;
                                }
                            }
                        }

                        if (tableObj == null) {
                            cb && cb.call(ctx, new Error('表不存在！'));
                            return;
                        }

                        var queryCol = {},
                            relationTableNames = []; //关联数据

                        var relationTables = tableObj.relateTables || [];

                        for (var r = 0; r < relationTables.length; r++) {
                            var relation = relationTables[r];
                            var qItem = {};
                            var fields = relation.fields || [];

                            if (fields.length > 0) {
                                var select = {
                                    _id: true,
                                    geom: true
                                };

                                for (var s = 0; s < fields.length; s++) {
                                    select['tag.' + fields[s].name] = true;
                                }

                                qItem = this._makeQuery(relation.relations, relation.fieldMap, fields);
                                qItem.select = Object.keys(select).join(' ');
                            } else {
                                qItem.select = '';
                            }

                            qItem.query = {};
                            qItem.query['tag.' + relation.relField] = opts.dataId;
                            queryCol[relation.table] = qItem;
                            relationTableNames.push(relation.table);
                        }

                        this._getTableMeta([tableObj.name].concat(relationTableNames), function(err, tableMetaSet) {
                            if (err == null) {
                                //
                                var relations = tableObj.listRelations,
                                    fieldMap = tableObj.fieldMap;

                                var queryItem = this._makeQuery(relations, fieldMap, tableObj.detail);

                                queryItem.query = {
                                    '_id': opts.dataId
                                }; //救援队跟储备库的关联装备查询 add by lsl

                                if (opts.equConfig) {
                                    for (var key in queryCol) {
                                        opts.equConfig[tableObj.name] = queryItem;
                                        queryCol = opts.equConfig;
                                    }
                                } else {
                                    queryCol[tableObj.name] = queryItem;
                                } //查询


                                util.queryMulti({
                                    server: this.options.server,
                                    eId: this.options.eId,
                                    data: queryCol
                                }, function(err, dataSet) {
                                    if (err == null) {
                                        var dataList = dataSet[tableObj.name];

                                        if (dataList && dataList.length == 1) {
                                            var tableMeta = tableMetaSet[tableObj.name];
                                            var dataItem = dataList[0],
                                                attrObj = dataItem.tag;
                                            var metaFields = tableMeta.model,
                                                detailFields = tableObj.detail;
                                            var fieldMap = tableObj.detailFieldMap || {};
                                            var attributes = [],
                                                result = {
                                                    id: dataItem._id,
                                                    attributes: attributes
                                                };

                                            for (var i = 0; i < detailFields.length; i++) {
                                                var fieldObj = detailFields[i];

                                                if (util.isObject(fieldObj.relShowField)) {
                                                    var relObj = {};
                                                    relObj[fieldObj.name] = dataItem['tag'][fieldObj.name];
                                                    util.extractDictShowField(fieldObj.name, fieldObj.relShowField, relObj);
                                                    util.handleContactTel(thisResourceObj.name, relObj);

                                                    for (var kk in fieldObj.relShowField) {
                                                        var kkVv = fieldObj.relShowField[kk];

                                                        if (kk == '//' || /^C\d$/.test(kkVv) || /^T\d$/.test(kkVv)) {
                                                            continue;
                                                        }

                                                        var attribute = {};
                                                        attribute.name = kkVv;
                                                        attribute.label = kkVv === "RESCUENAME" ? CONSTS.BELONG_RESCUE : "";
                                                        attribute.value = relObj[attribute.name];
                                                        attributes.push(attribute);
                                                    }

                                                    if (thisResourceObj.name === CONSTS.EQUIPMENT) {
                                                        //装备
                                                        var attribute1 = {};
                                                        attribute1.name = CONSTS.CONTACT;
                                                        attribute1.label = CONSTS.CONTACT_LABEL;
                                                        attribute1.value = relObj[CONSTS.CONTACT];
                                                        attributes.push(attribute1);
                                                        var attribute2 = {};
                                                        attribute2.name = CONSTS.TEL;
                                                        attribute2.label = CONSTS.TEL_LABEL;
                                                        attribute2.value = relObj[CONSTS.TEL];
                                                        attributes.push(attribute2);
                                                    }
                                                } else {
                                                    var itemObj = {};
                                                    itemObj.name = fieldObj.name;
                                                    itemObj.label = "";
                                                    itemObj.value = attrObj[fieldObj.name];
                                                    itemObj.value = util.isEmptyValue(itemObj.value) ? CONSTS.EMPTY_STR : itemObj.value;

                                                    if (fieldObj.relShowField) {
                                                        if (util.isObject(itemObj.value)) {
                                                            itemObj.value = attrObj[fieldObj.name].tag[fieldObj.relShowField];
                                                        } else {
                                                            itemObj.value = CONSTS.EMPTY_STR;
                                                        }
                                                    }

                                                    if (fieldMap.hasOwnProperty(itemObj.name)) {
                                                        itemObj.name = fieldMap[itemObj.name];
                                                    }

                                                    if (fieldObj.label) {
                                                        itemObj.label = fieldObj.label;
                                                    } else {
                                                        for (var j = 0; j < metaFields.length; j++) {
                                                            var metaField = metaFields[j];

                                                            if (metaField.fieldName === fieldObj.name) {
                                                                itemObj.label = metaField.fieldDesc;
                                                                break;
                                                            }
                                                        }
                                                    }

                                                    attributes.push(itemObj);
                                                }
                                            }

                                            if (opts.equConfig) {
                                                result.equTable = {};

                                                for (var key in dataSet) {
                                                    if (dataSet[key].length > 0 && key != "EQUIP_TEA_RESCUE" // &&key!="JC_FIRETEAMSTA"
                                                    ) {
                                                        result.equTable[key] = dataSet[key];
                                                    }
                                                }

                                                cb && cb.call(ctx, null, result);
                                            } else {
                                                //relations
                                                for (var r = 0; r < relationTables.length; r++) {
                                                    var relationObj = relationTables[r];
                                                    var relationData = dataSet[relationObj.table];
                                                    var metaFields = tableMetaSet[relationObj.table].model,
                                                        metaFieldsLen = metaFields.length,
                                                        fields = relationObj.fields || [],
                                                        fieldsLen = fields.length,
                                                        fieldMap = relationObj.fieldMap,
                                                        relations = relationObj.relations;

                                                    for (var kk = 0; kk < relationData.length; kk++) {
                                                        var dataItem = relationData[kk];
                                                        var attributes = [],
                                                            dataObj = {
                                                                attributes: attributes
                                                            };
                                                        dataObj.id = dataItem._id;
                                                        dataObj.geom = dataItem.geom;

                                                        for (var kkk = 0; kkk < metaFieldsLen; kkk++) {
                                                            var metaField = metaFields[kkk];
                                                            var fieldObj = {};

                                                            for (var k4 = 0; k4 < fieldsLen; k4++) {
                                                                if (fields[k4].name === metaField.fieldName) {
                                                                    fieldObj = fields[k4];
                                                                    break;
                                                                }
                                                            }

                                                            if (dataItem.tag.hasOwnProperty(metaField.fieldName)) {
                                                                var attribute = {};
                                                                attribute.name = metaField.fieldName;
                                                                attribute.value = dataItem.tag[metaField.fieldName];
                                                                attributes.push(attribute); //

                                                                if (fieldObj.relShowField) {
                                                                    if (dataItem.tag[fieldObj.name]) {
                                                                        //党未查询到
                                                                        attribute.value = dataItem.tag[fieldObj.name].tag[fieldObj.relShowField];
                                                                    } else {
                                                                        attribute.value = "";
                                                                    }
                                                                }

                                                                if (fieldMap.hasOwnProperty(itemObj.name)) {
                                                                    attribute.name = fieldMap[attribute.name];
                                                                }

                                                                if (fieldObj.label) {
                                                                    attribute.label = fieldObj.label;
                                                                } else {
                                                                    attribute.label = metaField.fieldDesc;
                                                                }
                                                            }
                                                        }

                                                        relationData[kk] = dataObj;
                                                    }

                                                    result[relationObj.as || relationObj.table] = relationData;
                                                }

                                                cb && cb.call(ctx, null, result);
                                            }
                                        } else {
                                            cb && cb.call(ctx, new Error('查询失败！'));
                                        }
                                    } else {
                                        cb && cb.call(ctx, err);
                                    }
                                }, this);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 查询装备的详情框
                     * @param opts 查询参数
                     * @opts.param：参数集
                     * @param cb：回调函数
                     * @param ctx
                     */


                    window.EMapServerV2.bufferService.prototype.queryEquDetail = function(opts, cb, ctx) {
                        //查询
                        util.queryMulti({
                            server: this.options.server,
                            eId: this.options.eId,
                            data: opts
                        }, function(err, dataSet) {
                            if (err == null) {
                                for (var key in dataSet) {
                                    var dataList = dataSet[key];

                                    if (dataList && dataList.length == 1) {
                                        cb && cb.call(ctx, null, dataList);
                                    } else {
                                        cb && cb.call(ctx, new Error('查询失败！'));
                                    }
                                }
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 获取分类列表
                     * @param opts
                     * @param opts.resources {Array} 资源序号数组
                     * @param cb
                     * @param ctx
                     */


                    window.EMapServerV2.bufferService.prototype.getTypeList = function(opts, cb, ctx) {
                        // var dataParam={};
                        // dataParam.EQUIP_EQU_TYPE={};
                        // dataParam.EQUIP_EQU_TYPE.query={"tag.PARENTCODE":"0"};
                        // dataParam.EQUIP_EQU_TYPE.select="_id tag.EQUIPTYPECODE tag.EQUIPTYPENAME tag.PARENTCODE tag.SHORTNAME";
                        // dataParam.EQUIP_EQU_TYPE.sort="tag.ORDERBY";
                        // util.queryMulti({
                        //     server: this.options.server,
                        //     eId: this.options.eId,
                        //     data:dataParam
                        // }, function (err, data) {
                        //     for(var i=0;i<data.length;i++){
                        //         let eleData=data[i];
                        //         resourceTypes[i] = {
                        //             label: eleData.tag.EQUIPTYPENAME,
                        //             field: null,
                        //             value: eleData.tag.SHORTNAME,
                        //             id:eleData.tag.EQUIPTYPECODE,
                        //             pId:eleData.tag.PARENTCODE
                        //         };
                        //     }
                        // })
                        var configResources = this.options.resourceConfig.resources,
                            resourceCount = opts.resources.length;
                        var resultSet = [];

                        if (opts.resources.length == 0) {
                            cb && cb.call(ctx, null, resultSet);
                            return;
                        }

                        var tempSet = {};

                        for (var i = 0; i < resourceCount; i++) {
                            var resourceIndex = opts.resources[i],
                                index = parseInt(resourceIndex) - 1;
                            var resourceObj = configResources[index];

                            if (!resourceObj) {
                                continue;
                            }
                            /*
                            /此处处理装备的字典查询
                             */


                            var tables = resourceObj.tables;
                            var resourceTypes = new Array(tables.length);

                            if (resourceObj.classification && resourceObj.classification.type == "dict") {
                                tempSet[i + '_0'] = {};
                                tempSet[i + '_0'].classification = resourceObj.classification;
                            } else {
                                for (var j = 0; j < tables.length; j++) {
                                    var table = tables[j];
                                    var classification = table.classification || {};

                                    if (classification.type == 'dict') {
                                        resourceTypes[j] = {};
                                        tempSet[i + '_' + j] = table;
                                    } else {
                                        resourceTypes[j] = {
                                            label: table.label || table.name,
                                            table: table.name,
                                            field: null,
                                            value: null,
                                            id: G.utils.CommonUtil.newUUID(),
                                            pId: '0'
                                        };
                                    }
                                }

                                resultSet.push(resourceTypes);
                            }
                        }

                        if (Object.keys(tempSet).length == 0) {
                            cb && cb.call(ctx, null, resultSet);
                            return;
                        }

                        var queryCol = {};

                        for (var idx in tempSet) {
                            var tempObj = tempSet[idx],
                                classification = tempObj.classification;
                            var queryItem = {};

                            if (classification.pId) {
                                queryItem.select = ['_id', 'tag.' + classification.showField, 'tag.' + classification.pId].join(' ');
                            } else {
                                queryItem.select = ['_id', 'tag.' + classification.showField].join(' ');
                            }

                            queryItem.query = classification.query || {};

                            if (classification.sortField) {
                                var sort = classification.sortDirection === 'DESC' ? '-' : '';
                                queryItem.sort = sort + 'tag.' + classification.sortField;
                            }

                            queryCol[classification.dictTable] = queryItem;
                        }

                        util.queryMulti({
                            server: this.options.server,
                            eId: this.options.eId,
                            data: queryCol
                        }, function(err, data) {
                            if (err == null) {
                                for (var idx in tempSet) {
                                    var tempObj = tempSet[idx],
                                        classification = tempObj.classification;
                                    var dataList = data[classification.dictTable];
                                    var list = [];

                                    for (var k = 0; k < dataList.length; k++) {
                                        var dataItem = dataList[k];
                                        var dataObj = {};
                                        dataObj.label = dataItem.tag[classification.showField];
                                        dataObj.value = dataItem._id;
                                        dataObj.table = tempObj.name;
                                        dataObj.field = classification.localField;
                                        dataObj.id = G.utils.CommonUtil.newUUID();

                                        if (classification.pId) {
                                            dataObj.pId = dataItem.tag[classification.pId];;
                                        } else {
                                            dataObj.pId = '0';
                                        }

                                        list.push(dataObj);
                                    }

                                    var idxArr = idx.split('_');

                                    if (resultSet[idxArr[0]]) {
                                        resultSet[idxArr[0]][idxArr[1]] = list;
                                    } else {
                                        resultSet[idxArr[0]] = list;
                                    }
                                }

                                for (var m = 0; m < resultSet.length; m++) {
                                    var resultItem = resultSet[m];
                                    var list = [];

                                    for (var n = 0; n < resultItem.length; n++) {
                                        list = list.concat(resultItem[n]);
                                    }

                                    resultSet[m] = list;
                                }

                                cb && cb.call(ctx, null, resultSet);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     *
                     * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
                     * @param opts.geometry　{GeoJson} 筛选范围
                     * @param opts.caculateDistance {Boolean} 是否计算距离并排序
                     * @param opts.distanceField {String} 距离属性名
                     * @param opts.keyword　{String} 模糊匹配
                     * @param opts.resources　{Array} 资源id
                     * @param cb
                     * @param ctx
                     * @private
                     */


                    window.EMapServerV2.bufferService.prototype._query = function(opts, cb, ctx) {
                        var resourcesOpt = jQuery.extend(true, {}, opts.resources);
                        var queryCol = {};
                        var distanceField = opts.distanceField || 'dis';
                        var keyword = opts.keyword ? (opts.keyword + '').trim() : '';
                        var resourceConfig = jQuery.extend(true, {}, this.options.resourceConfig.resources);
                        var queryResurces = [];

                        for (var resourceId in resourcesOpt) {
                            var resourceIndex = parseInt(resourceId) - 1;
                            var resourceObj = resourceConfig[resourceIndex];

                            if (!resourceObj) {
                                continue;
                            }

                            var resourceQueryTables = resourcesOpt[resourceId] || [],
                                queryAllTable = resourceQueryTables.length == 0; //处理每类数据的筛选条件

                            var resourceQueryTableSet = {};

                            for (var i = 0; i < resourceQueryTables.length; i++) {
                                var queryTable = resourceQueryTables[i];
                                var tableQueryObj = resourceQueryTableSet[queryTable.table];

                                if (tableQueryObj) {
                                    if (queryTable.field) {
                                        tableQueryObj['tag.' + queryTable.field]["$in"].push(queryTable.value);
                                    }
                                } else {
                                    tableQueryObj = {};

                                    if (queryTable.field) {
                                        tableQueryObj['tag.' + queryTable.field] = {
                                            "$in": [queryTable.value]
                                        };
                                    }

                                    resourceQueryTableSet[queryTable.table] = tableQueryObj;
                                }
                            }

                            var filteredQueryTable = [];

                            for (var j = 0; j < resourceObj.tables.length; j++) {
                                var tableObj = resourceObj.tables[j];

                                if (!(queryAllTable || resourceQueryTableSet.hasOwnProperty(tableObj.name))) {
                                    continue;
                                }

                                var andList = [];

                                if (resourceQueryTableSet.hasOwnProperty(tableObj.name) && Object.keys(resourceQueryTableSet[tableObj.name]).length > 0) {
                                    andList.push(resourceQueryTableSet[tableObj.name]);
                                }

                                if (opts.geometry) {
                                    andList.push({
                                        "geom": {
                                            "$geoIntersects": {
                                                "$geometry": opts.geometry
                                            }
                                        }
                                    });
                                } //模糊匹配


                                var shouldFilterOnServer = this._kwFilterOnServer(tableObj.list);

                                tableObj.shouldFilterOnServer = shouldFilterOnServer;

                                if (opts.keyword && shouldFilterOnServer) {
                                    var kwFields = tableObj.listKw;
                                    var orList = [];

                                    for (var j1 = 0; j1 < kwFields.length; j1++) {
                                        var or = {};
                                        or["tag." + kwFields[j1].name] = {
                                            $regex: "^.*" + keyword + ".*$"
                                        };
                                        orList.push(or);
                                    }

                                    andList.push({
                                        "$or": orList
                                    });
                                }

                                var relations = tableObj.listRelations,
                                    fieldMap = tableObj.fieldMap;

                                var queryItem = this._makeQuery(relations, fieldMap, tableObj.list);

                                queryItem.query = {
                                    "$and": andList
                                };
                                queryCol[tableObj.name] = queryItem; //

                                filteredQueryTable.push(tableObj);
                            } //


                            if (!queryAllTable) {
                                resourceObj.tables = filteredQueryTable;
                            }

                            queryResurces.push(resourceObj);
                        }

                        console.debug('> 查询的表名：' + JSON.stringify(Object.keys(queryCol)));
                        util.queryMulti({
                            server: this.options.server,
                            eId: this.options.eId,
                            data: queryCol
                        }, function(err, dataSet) {
                            if (err == null) {
                                var resultSet = {},
                                    caculateDistance = opts.caculateDistance;

                                for (var i = 0; i < queryResurces.length; i++) {
                                    var resourceObj = queryResurces[i];
                                    var resourceDataList = [];

                                    for (var j = 0; j < resourceObj.tables.length; j++) {
                                        var tableObj = resourceObj.tables[j],
                                            relations = tableObj.listRelations,
                                            relationsLen = relations.length,
                                            fieldMap = tableObj.listFieldMap || {},
                                            shouldMap = Object.keys(fieldMap).length > 0;
                                        var dataList = dataSet[tableObj.name],
                                            dataTempList = [];

                                        for (var k = 0, dataCount = dataList.length; k < dataCount; k++) {
                                            var dataItem = dataList[k],
                                                attrObj = dataItem.tag;
                                            var tempItem = attrObj;
                                            tempItem.id = dataItem._id;

                                            if (relationsLen > 0) {
                                                for (var rIdx = 0; rIdx < relationsLen; rIdx++) {
                                                    var relationObj = relations[rIdx];

                                                    if (tempItem[relationObj.localField]) {
                                                        tempItem[relationObj.localField + '_'] = tempItem[relationObj.localField]._id;
                                                        util.extractDictShowField(relationObj.localField, relationObj.showField, tempItem);
                                                    }
                                                }
                                            }

                                            if (shouldMap) {
                                                for (var mapField in fieldMap) {
                                                    tempItem[fieldMap[mapField]] = tempItem[mapField];
                                                    delete tempItem[mapField];
                                                }
                                            } //关键字过滤


                                            if (!(tableObj.shouldFilterOnServer || util.filterByKw(opts.keyword, tempItem, tableObj.listKw))) {
                                                continue;
                                            }

                                            if (dataItem.geom) {
                                                tempItem['longitude'] = dataItem.geom.coordinates[0];
                                                tempItem['latitude'] = dataItem.geom.coordinates[1];

                                                if (caculateDistance !== false) {
                                                    tempItem[distanceField] = util.caculateDistance(opts.point, dataItem.geom);
                                                }
                                            }

                                            tempItem.table_name = tableObj.name;
                                            tempItem.table_label = tableObj.label; //替换空值

                                            util.handleEmptyValue(tempItem);
                                            util.handleContactTel(resourceObj.name, tempItem);
                                            dataTempList.push(tempItem);
                                        }

                                        resourceDataList = resourceDataList.concat(dataTempList);
                                    }

                                    resourceDataList.sort(function(a, b) {
                                        return a[distanceField] - b[distanceField];
                                    });
                                    resultSet[resourceObj.name] = resourceDataList;
                                }

                                cb && cb.call(ctx, null, resultSet);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     *
                     * @param relations
                     * @param fieldMap
                     * @param fieldList
                     * @return {{}}
                     * @private
                     */


                    window.EMapServerV2.bufferService.prototype._makeQuery = function(relations, fieldMap, fieldList) {
                        var queryItem = {};
                        fieldMap = fieldMap || {};
                        var populate = [],
                            select = {
                                _id: true,
                                geom: true
                            };

                        if (relations.length > 0) {
                            for (var kk = 0; kk < relations.length; kk++) {
                                var relationObj = relations[kk];
                                select[relationObj.localField] = true;

                                for (var fieldAlias in fieldMap) {
                                    select["tag." + fieldMap[fieldAlias]] = true;

                                    if (fieldMap[fieldAlias] == relationObj.localField) {
                                        relationObj.alias = fieldAlias;
                                        break;
                                    }
                                }

                                select["tag." + relationObj.localField] = true;
                                populate.push(["tag." + relationObj.localField]);
                            }

                            queryItem.populate = populate;
                        }

                        for (var j2 = 0; j2 < fieldList.length; j2++) {
                            select["tag." + fieldList[j2].name] = true;
                        }

                        queryItem.select = Object.keys(select).join(' ');
                        return queryItem;
                    };
                    /**
                     *
                     * @param dataSetIds
                     * @param cb
                     * @param ctx
                     * @private
                     */


                    window.EMapServerV2.bufferService.prototype._getTableMeta = function(dataSetIds, cb, ctx) {
                        this.dataSetCache = this.dataSetCache || {};
                        var dataSetIds2Query = [];
                        var resultSet = {};

                        for (var i = 0; i < dataSetIds.length; i++) {
                            var dataSetId = dataSetIds[i];

                            if (this.dataSetCache[dataSetId]) {
                                resultSet[dataSetId] = this.dataSetCache[dataSetId];
                            } else {
                                dataSetIds2Query.push(dataSetId);
                            }
                        }

                        if (dataSetIds2Query.length == 0) {
                            cb && cb.call(ctx, null, resultSet);
                        } else {
                            util.queryDataSet({
                                server: this.options.server,
                                eId: this.options.eId,
                                tableNames: dataSetIds2Query
                            }, function(err, data) {
                                if (err == null) {
                                    if (data.result && data.result.length > 0) {
                                        for (var j = 0; j < data.result.length; j++) {
                                            resultSet[data.result[j].dataSetId] = data.result[j];
                                        }

                                        cb && cb.call(ctx, null, resultSet);
                                    } else {
                                        cb && cb.call(ctx, new Error('查询元数据失败！'));
                                    }
                                } else {
                                    cb && cb.call(ctx, err);
                                }
                            }, this);
                        }
                    };
                    /**
                     * 是否服务端关键子过滤，对于装备（因为关联救援队伍的名称）类型前端过滤
                     * @param fieldList
                     * @private
                     */


                    window.EMapServerV2.bufferService.prototype._kwFilterOnServer = function(fieldList) {
                        var flag = true;

                        for (var i = 0; i < fieldList.length; i++) {
                            if (util.isObject(fieldList[i].relShowField)) {
                                flag = false;
                                break;
                            }
                        }

                        return flag;
                    };
                    /****
                     * 行政区划统计
                     * @param opts
                     * @param opts.table 表名
                     * @param opts.districtField 行政区划字段名
                     * @param opts.districtCode 行政区划编码
                     * @param opts.useCache 使用缓存
                     * @param cb
                     * @param ctx
                     */


                    window.EMapServerV2.bufferService.prototype.statisticByDistrict = function(opts, cb, ctx) {
                        var url = this.options.server + '/biz/district/statistics';
                        var data = {
                            eId: this.options.eId,
                            dataSetId: opts.table,
                            districtField: opts.districtField,
                            districtTable: 'CODE_BAS_DISTRICT',
                            districtCode: opts.districtCode,
                            useCache: !!opts.useCache
                        };

                        if (opts.districtCode === '000000') {
                            data.useCache = true;
                        }

                        jQuery.ajax({
                            url: url,
                            type: 'get',
                            data: data,
                            success: function success(data) {
                                cb && cb.call(ctx, null, data.data);
                            },
                            error: function error(x, msg, err) {
                                cb && cb.call(ctx, err);
                            }
                        });
                    };
                    /**
                     * 按行政区划查询
                     * @param opts
                     * @param opts.dataSetId
                     * @param opts.districtField
                     * @param opts.districtCode
                     *
                     */


                    window.EMapServerV2.bufferService.prototype.queryByDistrict = function(opts, cb, ctx) {
                        var queryCol = {},
                            queryItem = opts;
                        queryItem.query = {};
                        queryItem.query['tag.' + opts.districtField] = {
                            "$regex": opts.districtCode + ".*"
                        };
                        queryCol[opts.dataSetId] = queryItem;
                        util.queryMulti({
                            server: this.options.server,
                            eId: this.options.eId,
                            data: queryCol
                        }, function(err, data) {
                            if (err == null) {
                                cb && cb.call(ctx, null, data[opts.dataSetId]);
                            } else {
                                cb && cb.call(ctx, err);
                            }
                        }, this);
                    };
                    /**
                     * 查询所有装备的展示字段
                     * @opts 参数
                     */


                    window.EMapServerV2.bufferService.prototype.queryAllField = function(opts, cb, ctx) {
                        util.queryMulti({
                            server: this.options.server,
                            eId: this.options.eId,
                            data: opts
                        }, function(err, data) {
                            if (err == null) {
                                cb && cb(data);
                            } else {
                                cb && cb(ctx, err);
                            }
                        }, this);
                    };

                    window.EMapServerV2.bufferService.Util = util;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/index.js":
            /*!****************************************!*\
              !*** ./public/json/oldserver/index.js ***!
              \****************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! ./CommonService.js */ "./public/json/oldserver/CommonService.js"); //<!----资源查询-行政区划 服务-->


                __webpack_require__( /*! ./DistrictUtil.js */ "./public/json/oldserver/DistrictUtil.js"); //<!----资源查询-资源查询 服务-->


                __webpack_require__( /*! ./ResourceQueryService.js */ "./public/json/oldserver/ResourceQueryService.js"); //<!----资源查询-类型树 服务-->


                __webpack_require__( /*! ./bufferService.js */ "./public/json/oldserver/bufferService.js");

                __webpack_require__( /*! ./queryData.js */ "./public/json/oldserver/queryData.js");

                __webpack_require__( /*! ./typeTree.js */ "./public/json/oldserver/typeTree.js"); //<!----应急资源 服务-->


                __webpack_require__( /*! ./EmerSourceService.js */ "./public/json/oldserver/EmerSourceService.js"); //!----风险隐患 服务-->


                __webpack_require__( /*! ./RiskSourceService.js */ "./public/json/oldserver/RiskSourceService.js"); //<!----基础数据 服务-->


                __webpack_require__( /*! ./BaseDataService.js */ "./public/json/oldserver/BaseDataService.js");

                __webpack_require__( /*! ./provinceData.js */ "./public/json/oldserver/provinceData.js"); //<!----应急物资、风险隐患、基础数据 详情框 服务-->


                __webpack_require__( /*! ./DetailInfoServices.js */ "./public/json/oldserver/DetailInfoServices.js"); //<!----人口热力 服务-->


                __webpack_require__( /*! ./ServiceModule.js */ "./public/json/oldserver/ServiceModule.js");

                __webpack_require__( /*! ./queryservice.js */ "./public/json/oldserver/queryservice.js"); //<!----救援队伍 服务-->


                __webpack_require__( /*! ./RescueTeamService.js */ "./public/json/oldserver/RescueTeamService.js"); //<!-- 风险隐患地震 -->


                __webpack_require__( /*! ./HazardQueryService.js */ "./public/json/oldserver/HazardQueryService.js"); //<!----风险隐患排查 服务-->


                __webpack_require__( /*! ./RiskQueryServiceConfig.js */ "./public/json/oldserver/RiskQueryServiceConfig.js");

                __webpack_require__( /*! ./RiskTroubleQueryService.js */ "./public/json/oldserver/RiskTroubleQueryService.js"); //<!----救援救助 服务-->


                __webpack_require__( /*! ./CoordTransformUtil.js */ "./public/json/oldserver/CoordTransformUtil.js");

                __webpack_require__( /*! ./RescueAssistanceServiceExt.js */ "./public/json/oldserver/RescueAssistanceServiceExt.js");

                __webpack_require__( /*! ./RescueAssistanceServiceChartExt.js */ "./public/json/oldserver/RescueAssistanceServiceChartExt.js");

                __webpack_require__( /*! ./RescueAssistanceService.js */ "./public/json/oldserver/RescueAssistanceService.js");

                __webpack_require__( /*! ./RescueHelpService.js */ "./public/json/oldserver/RescueHelpService.js");

                /***/
            }),

            /***/
            "./public/json/oldserver/provinceData.js":
            /*!***********************************************!*\
              !*** ./public/json/oldserver/provinceData.js ***!
              \***********************************************/
            /*! no static exports found */
            /***/
                (function(module, exports) {

                window.EMapServerV2.provinceDistrictData = {
                    "province": [{
                        "code": "110000",
                        "lat": 39.9236,
                        "lng": 116.3809,
                        "name": "北京市",
                        "count": 0
                    }, {
                        "code": "120000",
                        "lat": 39.1311,
                        "lng": 117.2034,
                        "name": "天津市",
                        "count": 0
                    }, {
                        "code": "130000",
                        "lat": 38.1,
                        "lng": 114.4336,
                        "name": "河北省",
                        "count": 0
                    }, {
                        "code": "140000",
                        "lat": 38.0827,
                        "lng": 112.5659,
                        "name": "山西省",
                        "count": 0
                    }, {
                        "code": "150000",
                        "lat": 40.8801,
                        "lng": 111.6723,
                        "name": "内蒙古自治区",
                        "count": 0
                    }, {
                        "code": "210000",
                        "lat": 42.033,
                        "lng": 123.4644,
                        "name": "辽宁省",
                        "count": 0
                    }, {
                        "code": "220000",
                        "lat": 44.3081,
                        "lng": 125.3101,
                        "name": "吉林省",
                        "count": 0
                    }, {
                        "code": "230000",
                        "lat": 46.1646,
                        "lng": 126.6504,
                        "name": "黑龙江省",
                        "count": 0
                    }, {
                        "code": "310000",
                        "lat": 31.2381,
                        "lng": 121.4692,
                        "name": "上海市",
                        "count": 0
                    }, {
                        "code": "320000",
                        "lat": 32.4171,
                        "lng": 118.6743,
                        "name": "江苏省",
                        "count": 0
                    }, {
                        "code": "330000",
                        "lat": 30.5433,
                        "lng": 120.0806,
                        "name": "浙江省",
                        "count": 0
                    }, {
                        "code": "340000",
                        "lat": 32.0826,
                        "lng": 117.29,
                        "name": "安徽省",
                        "count": 0
                    }, {
                        "code": "350000",
                        "lat": 26.4312,
                        "lng": 119.2236,
                        "name": "福建省",
                        "count": 0
                    }, {
                        "code": "360000",
                        "lat": 28.9985,
                        "lng": 115.8398,
                        "name": "江西省",
                        "count": 0
                    }, {
                        "code": "370000",
                        "lat": 37.0376,
                        "lng": 116.9824,
                        "name": "山东省",
                        "count": 0
                    }, {
                        "code": "410000",
                        "lat": 34.7777,
                        "lng": 113.5767,
                        "name": "河南省",
                        "count": 0
                    }, {
                        "code": "420000",
                        "lat": 30.9776,
                        "lng": 114.2798,
                        "name": "湖北省",
                        "count": 0
                    }, {
                        "code": "430000",
                        "lat": 28.4783,
                        "lng": 113.0054,
                        "name": "湖南省",
                        "count": 0
                    }, {
                        "code": "440000",
                        "lat": 23.1189,
                        "lng": 113.2614,
                        "name": "广东省",
                        "count": 0
                    }, {
                        "code": "450000",
                        "lat": 23.4229,
                        "lng": 108.3252,
                        "name": "广西壮族自治区",
                        "count": 0
                    }, {
                        "code": "460000",
                        "lat": 20.0308,
                        "lng": 110.3439,
                        "name": "海南省",
                        "count": 0
                    }, {
                        "code": "500000",
                        "lat": 29.5581,
                        "lng": 106.5103,
                        "name": "重庆市",
                        "count": 0
                    }, {
                        "code": "510000",
                        "lat": 31.4662,
                        "lng": 104.0625,
                        "name": "四川省",
                        "count": 0
                    }, {
                        "code": "520000",
                        "lat": 27.0983,
                        "lng": 106.7432,
                        "name": "贵州省",
                        "count": 0
                    }, {
                        "code": "530000",
                        "lat": 25.6613,
                        "lng": 102.7661,
                        "name": "云南省",
                        "count": 0
                    }, {
                        "code": "540000",
                        "lat": 30.8268,
                        "lng": 91.2305,
                        "name": "西藏自治区",
                        "count": 0
                    }, {
                        "code": "610000",
                        "lat": 34.7777,
                        "lng": 109.0063,
                        "name": "陕西省",
                        "count": 0
                    }, {
                        "code": "620000",
                        "lat": 36.09,
                        "lng": 103.7622,
                        "name": "甘肃省",
                        "count": 0
                    }, {
                        "code": "630000",
                        "lat": 36.5734,
                        "lng": 101.8066,
                        "name": "青海省",
                        "count": 0
                    }, {
                        "code": "640000",
                        "lat": 39.0106,
                        "lng": 106.3037,
                        "name": "宁夏回族自治区",
                        "count": 0
                    }, {
                        "code": "650000",
                        "lat": 43.8024,
                        "lng": 87.5683,
                        "name": "新疆维吾尔自治区",
                        "count": 0
                    }, {
                        "code": "710000",
                        "lat": 25.0491,
                        "lng": 121.5142,
                        "name": "台湾省",
                        "count": 0
                    }, {
                        "code": "810000",
                        "lat": 22.2806,
                        "lng": 114.1544,
                        "name": "香港特别行政区",
                        "count": 0
                    }, {
                        "code": "820000",
                        "lat": 22.2007,
                        "lng": 113.55,
                        "name": "澳门特别行政区",
                        "count": 0
                    }]
                };

                /***/
            }),

            /***/
            "./public/json/oldserver/queryData.js":
            /*!********************************************!*\
              !*** ./public/json/oldserver/queryData.js ***!
              \********************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.find */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.find.js");

                (function(window) {
                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.queryData = {};

                    window.EMapServerV2.queryData.getConfig = function(cb) {
                        var self = this;
                        $.ajax({
                            url: './json/oldserver/queryData/resourceQueryConfig.json',
                            dataType: "json",
                            success: function success(resourceConfig) {
                                self.service = new window.EMapServerV2.bufferService({
                                    server: EMAP_CONFIG.common.mongoService,
                                    resourceConfig: resourceConfig
                                });
                                cb && cb();
                            }
                        });
                        $.ajax("./json/oldserver/queryData/equTableCorCode.json").then(function(data) {
                            self.equTableAndCodeConfig = data;
                        });
                    };
                    /**
                     * 通过缓冲区查询
                     * @param param
                     */


                    window.EMapServerV2.queryData.bufferOrPolygonQuery = function(param, callBack) {
                        var self = this;
                        self.service.bufferOrPolygonQuery(param, function(err, data) {
                            if (err == null) {
                                $("#loadingnewoverlay").hide();
                                self.addTypeNameToEqu(data);
                                callBack(data);
                            } else {
                                $("#loadingnewoverlay").hide();
                                console.error(err);
                            }
                        });
                    };
                    /**
                     * 装备的返回数据添加装备类型
                     */


                    window.EMapServerV2.queryData.addTypeNameToEqu = function(data) {
                        var self = this;

                        if ($(".requeryBox-inner-tap1").find(".active").attr("listcode") == 2) {
                            //当展示装备列表时
                            for (var key in data) {
                                var EquInfArr = data[key];

                                for (var i = 0; i < EquInfArr.length; i++) {
                                    var tagInf = EquInfArr[i];
                                    var equTypeCode = "";

                                    if (tagInf.hasOwnProperty("EQUIPTYPECODE")) {
                                        equTypeCode = tagInf.EQUIPTYPECODE;
                                    } else {
                                        var equTableNameConfig = self.equTableAndCodeConfig;

                                        a: for (var keyTwo in equTableNameConfig) {
                                            if (equTableNameConfig[keyTwo].code == tagInf.table_name) {
                                                equTypeCode = keyTwo;
                                                break a;
                                            }
                                        }
                                    }

                                    var equTypeName = G.equConfigInf.equContrast[equTypeCode];
                                    tagInf.EQUIPTYPENAME = equTypeName;
                                }
                            }
                        }
                    };
                    /**
                     * 通过缓冲区查询
                     * @param param
                     */


                    window.EMapServerV2.queryData.queryDataByBuffer = function(param, callBack) {
                        var self = this;
                        self.service.bufferOrPolygonQuery(param, function(err, data) {
                            if (err == null) {
                                callBack(data); // console.log(data)
                            } else { // console.error(err)
                            }
                        });
                    };
                    /**
                     * 行政区划查询
                     * @param param
                     */


                    window.EMapServerV2.queryData.queryDataByDis = function(param, callBackFun) {
                        var self = this; //行政区划查询
                        // var param = {
                        //     //1=队伍 2=装备 …… 跟原来一致
                        //     "resources": [1],
                        //     "point": point,
                        //     "districtCode": "530000",//多个逗号分隔
                        //     "keyword": "大"
                        // }

                        self.service.districtQuery(param, function(err, data) {
                            if (err == null) {
                                // console.log(data);
                                callBackFun(data);
                            } else { // console.error(err)
                            }
                        });
                    };
                    /**
                     * 查询详情
                     * @param param
                     * @param callBack
                     */


                    window.EMapServerV2.queryData.queryDetail = function(param, callBack) {
                        var self = this; //查询详情
                        // var param = {
                        //     tableName: "EQUIP_EQU_WATERTANKCAR",
                        //     dataId: "RFSGXFBU0001"
                        // }
                        // var param = {
                        //     tableName: param.tableName,
                        //     dataId: param.dataId
                        // }

                        self.service.queryDetail(param, function(err, data) {
                            if (err == null) {
                                if (data.equTable) {
                                    self.getRelevnceEquTypeName(data.equTable);
                                }

                                callBack(data);
                            } else {
                                console.error(err);
                            }
                        });
                    };
                    /**
                     * 救援队关联装备的装备类型
                     */


                    window.EMapServerV2.queryData.getRelevnceEquTypeName = function(data) {
                        var self = this;

                        for (var key in data) {
                            var EquInfArr = data[key];

                            for (var i = 0; i < EquInfArr.length; i++) {
                                var tagInf = EquInfArr[i].tag;
                                var equTypeCode = "";

                                if (tagInf.hasOwnProperty("EQUIPTYPECODE")) {
                                    equTypeCode = tagInf.EQUIPTYPECODE;
                                } else {
                                    var equTableNameConfig = self.equTableAndCodeConfig;

                                    a: for (var keyTwo in equTableNameConfig) {
                                        if (equTableNameConfig[keyTwo].code == key) {
                                            equTypeCode = keyTwo;
                                            break a;
                                        }
                                    }
                                }

                                var equTypeName = G.equConfigInf.equContrast[equTypeCode];
                                tagInf.EQUIPTYPENAME = equTypeName;
                            }
                        }
                    };
                    /**
                     *装备的详情框
                     */


                    window.EMapServerV2.queryData.queryEquDetail = function(param, callBack) {
                        var self = this;
                        self.service.queryEquDetail(param, function(err, data) {
                            if (err == null) {
                                for (var key in param) {
                                    self.getDetailEquTypeName(data, key);
                                    callBack(data);
                                }
                            } else {
                                console.error(err);
                            }
                        });
                    };
                    /**
                     * 装备的详情框的装备类型转换
                     * @param param
                     * @param callBackFun
                     */


                    window.EMapServerV2.queryData.getDetailEquTypeName = function(data, tableName) {
                        var self = this;
                        var tagInf = data[0].tag;
                        var equTypeCode = "";

                        for (var key in tagInf) {
                            if (key == "EQUIPTYPECODE") {
                                equTypeCode = tagInf[key];
                            }
                        }

                        if (!equTypeCode) {
                            var equTableNameConfig = self.equTableAndCodeConfig;

                            a: for (var keyTwo in equTableNameConfig) {
                                if (equTableNameConfig[keyTwo].code == tableName) {
                                    equTypeCode = keyTwo;
                                    break a;
                                }
                            }
                        }

                        var equTypeName = G.equConfigInf.equContrast[equTypeCode];
                        var newTypeName = "";

                        if (equTypeName && equTypeName != "-") {
                            //如果能在类型字典表找到名称
                            newTypeName = equTypeName;
                        } else {
                            //之前表中有code表示name的
                            newTypeName = equTypeCode;
                        }

                        tagInf.EQUIPTYPENAME = newTypeName;
                    }; //获取救援队类型


                    window.EMapServerV2.queryData.queryTree = function(param, callBackFun) {
                        var self = this;
                        this.getConfig(function() {
                            var param = {
                                resources: [1, 2]
                            };
                            self.service.getTypeList(param, function(err, data) {
                                if (err == null) {
                                    callBackFun && callBackFun(data);
                                } else {}
                            });
                        });
                    }; //查询关联装备


                    window.EMapServerV2.queryData.queryEquById = function(param, callBackFun) {
                        var self = this;
                        self.service.getTypeList(param, function(err, data) {
                            if (err == null) {
                                console.log('获取救援队类型 ', data);
                                callBackFun(data);
                            } else {
                                console.error(err);
                            }
                        });
                    }; //查询所有装备的展示字段


                    window.EMapServerV2.queryData.queryAllEquField = function(param, callBackFun) {
                        var self = this;
                        self.service.queryAllField(param, function(data) {
                            callBackFun(data);
                        });
                    };
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/queryservice.js":
            /*!***********************************************!*\
              !*** ./public/json/oldserver/queryservice.js ***!
              \***********************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.array.concat */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.concat.js");

                __webpack_require__( /*! core-js/modules/es.array.for-each */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.for-each.js");

                __webpack_require__( /*! core-js/modules/es.array.includes */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.includes.js");

                __webpack_require__( /*! core-js/modules/es.array.index-of */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.index-of.js");

                __webpack_require__( /*! core-js/modules/es.array.join */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.join.js");

                __webpack_require__( /*! core-js/modules/es.array.sort */ "./node_modules/_core-js@3.6.5@core-js/modules/es.array.sort.js");

                __webpack_require__( /*! core-js/modules/es.function.name */ "./node_modules/_core-js@3.6.5@core-js/modules/es.function.name.js");

                __webpack_require__( /*! core-js/modules/es.object.keys */ "./node_modules/_core-js@3.6.5@core-js/modules/es.object.keys.js");

                __webpack_require__( /*! core-js/modules/es.regexp.exec */ "./node_modules/_core-js@3.6.5@core-js/modules/es.regexp.exec.js");

                __webpack_require__( /*! core-js/modules/es.string.includes */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.includes.js");

                __webpack_require__( /*! core-js/modules/es.string.replace */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.replace.js");

                __webpack_require__( /*! core-js/modules/es.string.split */ "./node_modules/_core-js@3.6.5@core-js/modules/es.string.split.js");

                __webpack_require__( /*! core-js/modules/web.dom-collections.for-each */ "./node_modules/_core-js@3.6.5@core-js/modules/web.dom-collections.for-each.js");

                var _defineProperty = __webpack_require__( /*! ./node_modules/@babel/runtime/helpers/defineProperty */ "./node_modules/_@babel_runtime@7.12.1@@babel/runtime/helpers/defineProperty.js");

                (function(window) {
                    var service = {};
                    var DefenceObjConfig = {
                        "development": {
                            "table": "BAS_DEVELOPMENT",
                            "fieldMap": {
                                "name": "DEFOBJNAME",
                                "phone": "RESPOTEL",
                                "address": "ADDRESS",
                                "respper": "RESPPER"
                            }
                        },
                        "school": {
                            "table": "BAS_SCHOOL",
                            "fieldMap": {
                                "name": "SCHOOLNAME",
                                "SCHOOLTYPENAME": {
                                    "from": "user_safety_CODE_SCHOOL_TYPE",
                                    "localField": "tag.DEFOBJTYPECODE",
                                    "foreignField": "tag.SCHOOLTYPECODE",
                                    "as": "DEFOBJTYPECODE"
                                },
                                "address": "ADDRESS",
                                "CONTACTPER": "RESPPER",
                                "CONTACTMTEL": "RESPMTEL",
                                "STUDENTNUM": "STUDENTNUM",
                                "FACULTYNUM": "FACULTYNUM",
                                "BUILDAREA": "BUILDAREA",
                                "district": "COUNTY",
                                "districtname": "COUNTY.tag.FULLNAME",
                                "objecttype": "DEFOBJTYPECODE",
                                "DEFOBJTYPECODE": "DEFOBJTYPECODE.tag.SCHOOLTYPENAME"
                            },
                            "relations": [{
                                "table": "CODE_BAS_DISTRICT",
                                "localField": "COUNTY",
                                "foreignField": "DISTRICTCODE"
                            }, {
                                "table": "CODE_SCHOOL_TYPE",
                                "localField": "DEFOBJTYPECODE",
                                "foreignField": "SCHOOLTYPECODE"
                            }]
                        },
                        "hospital": {
                            "table": "BAS_HEALTHORG",
                            "fieldMap": {
                                "name": "ORGNAME",
                                "phone": "RESPOTEL",
                                "address": "ADDRESS",
                                "respper": "RESPPER"
                            }
                        }
                    };
                    var QueryConfig = {};
                    $.ajax({
                        url: './json/oldserver/queryservice.json',
                        type: 'get',
                        dataType: "json",
                        async: false,
                        success: function success(res) {
                            QueryConfig = res;
                        },
                        error: function error(res) {}
                    }); //人口热力

                    service.getpeopleInforData = function(point, dataA, EventTime, cb) {
                        var _POPU_DISTPOPU;

                        this.servicemodule = new window.EMapServerV2.ServiceModule({
                            server: EMAP_CONFIG.common.mongoService
                        });
                        var peopletable = "POPU_FEVER";

                        if (EventTime.indexOf('时') != -1) {
                            var currenttime = EventTime.split('日')[1].split('时')[0] * 1;

                            if (currenttime >= 6 && currenttime <= 18) {
                                peopletable = "POPU_FEVER";
                            } else {
                                peopletable = "POPU_FEVER_NIGHT";
                            }
                        }

                        var queryOpts = {
                            point: point,
                            //指定每类最多返回的记录数
                            limit: 999999,
                            //查询的表配置
                            querys: {
                                "POPU_DISTPOPU": (_POPU_DISTPOPU = {
                                    "table": peopletable,
                                    "//": "默认过滤条件"
                                }, _defineProperty(_POPU_DISTPOPU, "//", "字段映射，需要查询的字段都在这里写"), _defineProperty(_POPU_DISTPOPU, "fieldMap", {
                                    "poptotal": "POPTOTAL",
                                    "district": "DISTRICT",
                                    "downtow": "DISTNAME",
                                    "distcode": "DISTCODE"
                                }), _POPU_DISTPOPU)
                            },
                            //缓冲区
                            buffer: dataA
                        };
                        this.servicemodule.bufferQuery(queryOpts, function(err, data) {
                            if (err == null) {
                                cb(data);
                            } else {
                                console.error('查询失败：' + err.message);
                            }
                        });
                    }; //人口总数


                    service._querypeopleTotaldata = function(dataA, districtCode, callback) {
                        var self = this; // self.querypeopleTotalData = null;

                        var callBackGetData = function callBackGetData(data) {
                            var people = 0;

                            if (data.length > 0) {
                                people = parseInt(data[0].POPU_DISTPOPU.POPTOTAL); //查询到的数据

                                callback(people);
                            }
                        };

                        service.bufferStatistics(callBackGetData, dataA, districtCode);
                    }; //查询乡镇区县


                    service.getDistrictInforData = function(cb, dataA, point) {
                        this.servicemodule = new window.EMapServerV2.ServiceModule({
                            server: EMAP_CONFIG.common.mongoService
                        });
                        var queryOpts = {
                            point: point,
                            //指定每类最多返回的记录数
                            limit: 9999,
                            //查询的表配置
                            querys: {
                                "POPU_DISTPOPU": {
                                    "table": "POPU_DISTPOPU",
                                    "fieldMap": {
                                        "poptotal": "POPTOTAL",
                                        "district": "DISTRICT",
                                        "downtow": "DISTNAME",
                                        "distcode": "DISTCODE"
                                    }
                                }
                            },
                            //缓冲区
                            buffer: dataA
                        };
                        this.servicemodule.bufferQuery(queryOpts, function(err, data) {
                            if (err == null) {
                                cb(data);
                            } else {
                                console.error('查询失败：' + err.message);
                            }
                        });
                    };
                    /**
                     * 查询多个类型的数据
                     * @param param  typecode 编码  dataA为polygon point为事件点
                     * @param cb
                     */


                    service.getCurrencyData = function(param, cb) {
                        this.servicemodule = new window.EMapServerV2.ServiceModule({
                            server: EMAP_CONFIG.common.mongoService
                        });
                        var id = param.id;
                        var typecode = param.typecode;
                        var dataA = param.dataA;
                        var point = param.point;
                        var near = param.near;
                        var distanceField = param.distanceField;
                        var paging = param.paging;
                        var pageIndex = param.pageIndex;
                        var pageSize = param.pageSize;
                        var keyWord = param.keyWord;
                        var districtCode = param.districtCode;
                        var query = {};

                        if (typecode == "enterprise" || typecode == "derivativerisk") //重点企业和地质灾害
                        {
                            query = QueryConfig[typecode];
                        } else {
                            query[typecode] = QueryConfig[typecode];
                        }

                        if (param.query) {
                            if (query[typecode].query) {
                                Object.assign(query[typecode].query, param.query);
                            } else {
                                query[typecode].query = param.query;
                            }
                        } else {
                            if (!param.rescueTypecodes && typecode == 'RescueTeam※03') {
                                //解决赋值rescuetypecode后，再次查询由于没有清空类型筛选导致救援队伍详情出不来
                                query[typecode].query = {};
                            } else {
                                query[typecode].query = query[typecode].query || {};
                                Object.assign(query[typecode].query, param.query);
                            }
                        }

                        if (keyWord) {
                            var fbsArr = ["\\", "$", "(", ")", "*", "+", ".", "[", "]", "?", "^", "{", "}", "|"];

                            for (var key in fbsArr) {
                                for (var kw in keyWord) {
                                    if (keyWord[kw].indexOf(fbsArr[key]) != -1) {
                                        keyWord[kw] = keyWord[kw].replace(fbsArr[key], "\\" + fbsArr[key]);
                                    }
                                }
                            }
                        }

                        var queryOpts = {
                            id: id,
                            keyWord: keyWord,
                            districtCode: districtCode,
                            point: point,
                            near: near,
                            distanceField: distanceField,
                            paging: paging,
                            pageIndex: pageIndex,
                            pageSize: pageSize,
                            //指定每类最多返回的记录数
                            limit: 99999,
                            //缓冲区
                            buffer: dataA,
                            //查询的表配置
                            querys: query
                        }; //危化企业烈度圈标志位

                        if (param.earthLevel) var earthLevel = param.earthLevel;
                        this.servicemodule.bufferQuery(queryOpts, function(err, data) {
                            if (err == null) {
                                if (cb) {
                                    //危化企业烈度圈标志位
                                    if (earthLevel) data['level'] = earthLevel;

                                    if (!data[typecode]) {
                                        var typecodeArr = ["collapse", "mudslide", "falldown", "landslide"];

                                        for (var i in typecodeArr) {
                                            var code = typecodeArr[i];

                                            for (var kk in data[code]) {
                                                data[code][kk].level = earthLevel;
                                            }
                                        }
                                    } else {
                                        for (var kk in data[typecode]) {
                                            data[typecode][kk].level = earthLevel;
                                        }
                                    }

                                    cb(data);
                                }
                            } else {
                                console.error('查询失败：' + err.message);
                            }
                        });
                    }; // 查询多个类型的统计数量


                    service.getCurrencyCount = function(cb, dataA) {
                        this.servicemodule = new window.EMapServerV2.ServiceModule({
                            server: EMAP_CONFIG.common.mongoService
                        });
                        var queryOpts = {
                            //查询的表配置
                            querys: {
                                "居民区": {
                                    "table": "BAS_DEVELOPMENT",
                                    "fieldMap": {
                                        "name": "DEFOBJNAME",
                                        "phone": "RESPOTEL",
                                        "address": "ADDRESS",
                                        "respper": "RESPPER"
                                    }
                                },
                                "学校": {
                                    "table": "BAS_SCHOOL",
                                    "fieldMap": {
                                        "name": "SCHOOLNAME",
                                        "phone": "RESPOTEL",
                                        "address": "ADDRESS",
                                        "respper": "RESPPER"
                                    }
                                },
                                "医院": {
                                    "table": "BAS_HEALTHORG",
                                    "fieldMap": {
                                        "name": "ORGNAME",
                                        "phone": "RESPOTEL",
                                        "address": "ADDRESS",
                                        "respper": "RESPPER"
                                    }
                                },
                                "灾情信息员": {
                                    "table": "JC_DISINFOPER",
                                    "//": "灾情信息员",
                                    "fieldMap": {
                                        "name": "DISINFOPERNAME",
                                        "phone": "MOBPHONE",
                                        "districtname": "DISTRICTNAME",
                                        "post": "POST"
                                    }
                                }
                            },
                            //缓冲区
                            bufferList: [dataA]
                        };
                        this.servicemodule.bufferStatistics(queryOpts, function(err, data) {
                            if (err == null) {
                                if (cb) {
                                    cb(data);
                                }
                            } else {
                                console.error('查询失败：' + err.message);
                            }
                        });
                    };
                    /**
                     * 获取资源统计
                     * @param opts
                     * @param opts.level
                     * @param opts.typecodes
                     * @param opts.geometry [Array]  //[{level:"Ⅵ级", geometry:{}},{level:"Ⅶ级", geometry:{}}}
                     * @param [opts.query]
                     */


                    service.getStatistics = function(opts, callback) {
                        var servicemodule = new window.EMapServerV2.ServiceModule({
                            server: EMAP_CONFIG.common.mongoService
                        }); //var deffered = jQuery.Deferred();
                        // return new Promise((resolve, reject) => {

                        var queries = {};
                        var result = {};
                        var counter = 0;
                        opts.typecodes.forEach(function(typecode) {
                            queries[typecode] = QueryConfig[typecode]; // if (opts.query) {

                            if (queries[typecode].query) {
                                Object.assign(queries[typecode].query, opts.query);
                            } else {
                                queries[typecode].query = opts.query;
                            }
                        });
                        var level = opts.level;
                        var geometry = opts.geometry;
                        var queryOpts = {
                            querys: queries,
                            bufferList: [geometry]
                        };
                        servicemodule.bufferStatistics(queryOpts, function(err, data) {
                            if (err) {
                                //deffered.reject(err);
                                callback(err);
                            }

                            result[level] = {};
                            result[level].data = data[0];
                            result[level].total = 0;

                            for (var typecode in result[level].data) {
                                result[level].total += result[level].data[typecode].count;
                            } // if (counter === opts.typecodes.length - 1) {
                            // deffered.resolve(result);


                            callback(result); // }
                            // counter++;
                        }); // return deffered.promise();
                        // });
                    };

                    service.bufferStatistics = function(callback, dataA, districtCode) {
                        var self = this;
                        self.dataA = dataA;
                        this.servicemodule = new window.EMapServerV2.ServiceModule({
                            server: EMAP_CONFIG.common.mongoService
                        });
                        var bufferList = dataA ? [dataA] : [];
                        var statisticsOpts = {
                            querys: {
                                "POPU_DISTPOPU": {
                                    "table": "POPU_FEVER",
                                    "///": "计数类型，1=按照记录数统计，2=按照记录某些数值属性统计",
                                    "sumType": 2,
                                    "//": "统计人口的字段，可以指定多个数字类型的字段",
                                    "sumFields": ["POPTOTAL"]
                                }
                            },
                            districtCode: districtCode,
                            codes: districtCode,
                            districtField: 'DISTCODE',
                            bufferList: bufferList
                        };
                        this.servicemodule.bufferStatistics(statisticsOpts, function(err, data) {
                            if (err == null) {
                                // var text = '统计结果：' + JSON.stringify(data, null, 4) ;
                                // console.log(text)
                                if (callback) {
                                    callback(data, self.dataA);
                                }
                            } else {
                                // console.error('查询失败：' + err.message)
                                callback([]);
                            }
                        });
                    }; //受灾区县


                    service._queryDistricts = function(point, dataA, cb) {
                        var callback1 = function callback1(data) {
                            cb(data);
                        };

                        service.getDistrictInforData(callback1, dataA, point);
                    }; //受灾区县的多边形


                    service._queryDistrictPolygon = function(point, dataA, cb) {
                        this.servicemodule = new window.EMapServerV2.ServiceModule({
                            server: EMAP_CONFIG.common.mongoService
                        });
                        var queryOpts = {
                            point: point,
                            //指定每类最多返回的记录数
                            limit: 9999,
                            eId: 'siptea',
                            //查询的表配置
                            querys: {
                                "COUNTY": {
                                    "table": "county0.06",
                                    "fieldMap": {
                                        "name": "name",
                                        "adcode": "adcode",
                                        "gov": "gov"
                                    }
                                }
                            },
                            //缓冲区
                            buffer: dataA
                        };
                        this.servicemodule.bufferQuery(queryOpts, function(err, data) {
                            if (err == null) {
                                cb(data);
                            } else {
                                console.error('查询失败：' + err.message);
                            }
                        });
                    }; //查询乡镇面


                    service._queryTownPolygon = function(url, point, dataA, cb) {
                        var geom = g2.sfs.GeometryFactory.createGeometryFromGeoJson(dataA).asWkt();
                        $.ajax({
                            url: url + '/api/public/dlgbouaxiang/list/v1',
                            type: 'POST',
                            dataType: "json",
                            async: false,
                            contentType: "application/json",
                            data: '{"polygon":"' + geom + '"}',
                            // data: JSON.stringify({
                            //     "polygon": geom
                            // }),
                            success: function success(res) {
                                if (res.success || res.code === 0) {
                                    var dataArr = res.data;
                                    var result = [];

                                    for (var i in dataArr) {
                                        if (dataArr[i].centerid) {
                                            var tmpitem = {};
                                            tmpitem.tag = {};
                                            tmpitem.tag.name = dataArr[i].name;
                                            tmpitem.tag.adcode = dataArr[i].pac;
                                            tmpitem.shape_area = dataArr[i].shapeArea;

                                            if (g2.sfs.GeometryFactory.createGeometryFromWkt(dataArr[i].centerid, 4326)) {
                                                //
                                                var startpoint = new g2.sfs.Point({
                                                    x: point[0],
                                                    y: point[1],
                                                    spatialReference: 4326
                                                });
                                                var endpoint = g2.sfs.GeometryFactory.createGeometryFromWkt(dataArr[i].centerid, 4326);
                                                var polyline = new g2.sfs.Polyline({
                                                    spatialReference: 4326
                                                });
                                                var path = new g2.sfs.Path({
                                                    spatialReference: 4326
                                                });
                                                path.addPoint(startpoint);
                                                path.addPoint(endpoint);
                                                polyline.addGeometry(path);
                                                var projectService = new g2.sfs.CoordinateTransform();
                                                var measureService = new g2.sfs.MeasureService({
                                                    projectService: projectService
                                                });
                                                var length = measureService.length(polyline);
                                                tmpitem._distance = length;
                                                tmpitem._id = dataArr[i].objectid;
                                                tmpitem.centerid = dataArr[i].centerid;
                                                result.push(tmpitem);
                                            }
                                        }
                                    }

                                    result.sort(function(a, b) {
                                        if (a._distance < b._distance) {
                                            return -1;
                                        } else if (a._distance == b._distance) {
                                            return 0;
                                        } else {
                                            return 1;
                                        }
                                    });
                                    cb(result);
                                }
                            },
                            error: function error(err) {}
                        }); // this.servicemodule = new ServiceModule({
                        //     server: EMAP_CONFIG.common.mongoService
                        // })
                        // var queryOpts = {
                        //     point: point,
                        //     //指定每类最多返回的记录数
                        //     limit: 9999,
                        //     eId: 'safety',
                        //     //查询的表配置
                        //     querys: {
                        //         "TOWN": {
                        //             "table": "BAS_TOWN",
                        //             "fieldMap": {
                        //                 "name": "TOWN",
                        //                 "adcode":"TOWN_CODE"
                        //             }
                        //         }
                        //     },
                        //     //缓冲区
                        //     buffer: dataA,
                        // }
                        // this.servicemodule.bufferQuery(queryOpts, function (err, data) {
                        //     if (err == null) {
                        //         cb(data);
                        //     } else {
                        //         console.error('查询失败：' + err.message)
                        //     }
                        // })
                    }; //查询城市


                    service._queryCity = function(point, dataA, cb) {
                        this.servicemodule = new window.EMapServerV2.ServiceModule({
                            server: EMAP_CONFIG.common.mongoService
                        });
                        var queryOpts = {
                            point: point,
                            //指定每类最多返回的记录数
                            limit: 9999,
                            eId: "siptea",
                            //查询的表配置
                            querys: {
                                "city0.03": {
                                    "table": "city0.03",
                                    "fieldMap": {
                                        "name": "name",
                                        "adcode": "adcode",
                                        "gov": "gov"
                                    }
                                }
                            },
                            //缓冲区
                            buffer: dataA
                        };
                        this.servicemodule.bufferQuery(queryOpts, function(err, data) {
                            if (err == null) {
                                cb(data["city0.03"]);
                            } else {
                                console.error('查询失败：' + err.message);
                            }
                        });
                    }; //查询防护目标


                    service.getProctectObjectDatacount = function(cb, dataA, point) {
                        this.servicemodule = new window.EMapServerV2.ServiceModule({
                            server: EMAP_CONFIG.common.mongoService
                        });
                        var queryOpts = {
                            //查询的表配置
                            querys: DefenceObjConfig,
                            //缓冲区
                            bufferList: [dataA]
                        };
                        this.servicemodule.bufferStatistics(queryOpts, function(err, data) {
                            if (err == null) {
                                if (cb) {
                                    cb(data);
                                }
                            } else {
                                console.error('查询失败：' + err.message);
                            }
                        });
                    };
                    /**
                     * 查询列表数据
                     * @param opts
                     * @param opts.keyWord
                     * @param opts.level
                     * @param opts.typecode
                     * @param opts.geometry 几何对象（geojson）
                     * @param [opts.fields] 字段列表（筛选字段）
                     * @param [opts.query] 参数查询
                     * @param callback
                     * @param ctx
                     */


                    service.getMapDataList = function(opts, callback, ctx) {
                        var self = this;
                        var typeCodeQuery = QueryConfig[opts.typecode];
                        var param = {};

                        if (typeCodeQuery) {
                            var tableName = typeCodeQuery.table;
                            var config = this.getSelectColumn(typeCodeQuery, opts.fields);
                            var fieldProject = config.fieldProject;
                            var query = {};
                            query.$and = [];

                            if (opts.geometry) {
                                var geom = {
                                    $geoIntersects: {
                                        $geometry: opts.geometry
                                    }
                                };
                                query.$and.push({
                                    geom: geom
                                });
                            }

                            if (opts.query) {
                                query.$and.push(opts.query);
                            }

                            if (opts.keyWord) {
                                var keyWords = [];

                                if (Array.isArray(opts.keyWord)) {
                                    keyWords = opts.keyWord;
                                } else if (typeof opts.keyWord == 'string') {
                                    keyWords.push(opts.keyWord);
                                }

                                var self = this;
                                keyWords.forEach(function(keyWord) {
                                    var kwMatch = self.getSearchMatch(keyWord, typeCodeQuery);
                                    query.$and.push(kwMatch);
                                });
                            }

                            if (opts.districtCode) {
                                typeCodeQuery.districtField = typeCodeQuery.districtField || 'DISTRICTCODE';
                                var districtMatch = this.getDistrictMatch(opts.districtCode, typeCodeQuery);

                                if (districtMatch && districtMatch.length > 0) {
                                    query.$and = query.$and.concat(districtMatch);
                                }
                            }

                            if (query.$and.length === 0) {
                                delete query.$and;
                            }

                            param[tableName] = {
                                query: query,
                                select: config.select
                            };
                            $.ajax({
                                url: EMAP_CONFIG.common.mongoService + '/dataOperate/queryMulti',
                                dataType: 'json',
                                type: 'post',
                                data: {
                                    eId: 'safety',
                                    data: JSON.stringify(param)
                                },
                                success: function success(data) {
                                    var res = self.formatResultColumns(data.data[tableName], fieldProject);
                                    callback && callback.call(ctx, null, res);
                                },
                                error: function error(err) {
                                    callback && callback.call(ctx, err);
                                }
                            });
                        }
                    };
                    /**
                     * 拼接关键字条件--预留方法
                     * @param kw
                     * @param resource
                     */


                    service.getSearchMatch = function(kw, resource) {
                        if (kw) {
                            var query = {};
                            var filter = {};
                            filter['$regex'] = "^.*" + kw + ".*$";
                            query['tag.' + resource.keyWordFields] = filter;
                            return query;
                        } else {
                            return null;
                        }
                    };

                    service.getDistrictMatch = function(districtCode, resource) {
                        var match = null;

                        if (districtCode && districtCode !== '000000' && resource.districtField) {
                            var districtCodes = districtCode.split(','),
                                districtField = resource.districtField;
                            var or = [],
                                districtKey = null;

                            if (resource.districtKey) {
                                districtKey = resource.districtKey;
                            } else {
                                districtKey = 'tag.' + districtField;
                            }

                            var eachFilter = {};
                            var regStrArr = [];

                            for (var i = 0; i < districtCodes.length; i++) {
                                var districtCode = districtCodes[i];

                                if (districtCode) {
                                    regStrArr.push(getDistrictRegex(districtCode));
                                }
                            }

                            eachFilter[districtKey] = {
                                $regex: regStrArr.join('|')
                            };
                            or.push(eachFilter);
                            match = or;
                        } else {
                            var matchObj = {}; // matchObj['tag.'+resource.districtField] = {
                            //     $regex: '.*',
                            // };

                            match = [];
                            console.debug('ignore district filter');
                        }

                        return match;

                        function getDistrictRegex(code) {
                            var c = code.substr(0, 6);

                            if ('000000' == c) {
                                //全国不过滤
                                c = '.*';
                            } else if (/^\d{2}0000$/.test(c)) {
                                c = c.substr(0, 2) + '.*';
                            } else if (/^\d{4}00$/.test(c)) {
                                c = c.substr(0, 4) + '.*';
                            } else {
                                //灾情信息员code都是12位
                                c = c + '.*';
                            }

                            return '^' + c + '$';
                        }
                    };

                    service.getSelectColumn = function(resource, fields) {
                        var fieldMap = resource.fieldMap;
                        var selectArr = [];
                        var fieldProject = {};
                        selectArr.push("_id");
                        selectArr.push("geom");

                        for (var key in fieldMap) {
                            if (fieldMap.hasOwnProperty(key)) {
                                var originalField = fieldMap[key];

                                if (fields.includes(key)) {
                                    fieldProject[originalField] = key;
                                    selectArr.push("tag." + originalField);
                                }
                            }
                        }

                        var result = {};
                        result.select = selectArr.join(" ");
                        result.fieldProject = fieldProject;
                        return result;
                    };

                    service.formatResultColumns = function(data, fieldProject) {
                        data.forEach(function(element) {
                            var tag = element.tag;
                            Object.keys(tag).forEach(function(key) {
                                element[key] = tag[key];
                            });

                            for (var key in element) {
                                if (element.hasOwnProperty(key)) {
                                    if (fieldProject[key]) {
                                        element[fieldProject[key]] = element[key];
                                    }
                                }
                            }
                        });
                        return data;
                    };

                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.queryservice = service;
                })(window);

                /***/
            }),

            /***/
            "./public/json/oldserver/typeTree.js":
            /*!*******************************************!*\
              !*** ./public/json/oldserver/typeTree.js ***!
              \*******************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                __webpack_require__( /*! core-js/modules/es.function.name */ "./node_modules/_core-js@3.6.5@core-js/modules/es.function.name.js");

                (function(window) {
                    window.EMapServerV2 = window.EMapServerV2 || {}; // 参考

                    window.EMapServerV2.typeTree = {};
                    /*
                     *
                     * 点击出现ztree树
                     *
                     * */

                    window.EMapServerV2.typeTree.getZtree = function() {
                        var self = this;
                        G.equConfigInf = {}; //查询结果的回调

                        var callBackFun = function callBackFun(data) {
                            //ztree树的弹框
                            var setting = {
                                check: {
                                    enable: true,
                                    chkboxType: {
                                        "Y": "ps",
                                        "N": "ps"
                                    }
                                },
                                view: {
                                    dblClickExpand: false
                                },
                                data: {
                                    simpleData: {
                                        enable: true
                                    }
                                },
                                callback: {
                                    beforeClick: beforeClick,
                                    onCheck: onCheck
                                }
                            };
                            var data1 = data[0];
                            var data2 = data[1]; //json数据

                            var edu_type_list = [];

                            for (var i = 0; i < data1.length; i++) {
                                var obj = {};
                                obj.id = data1[i].id;
                                obj.pId = data1[i].pId;
                                obj.name = data1[i].label;
                                obj.table = data1[i].table;
                                obj.field = data1[i].field;
                                obj.value = data1[i].value;
                                obj.checked = true;
                                edu_type_list.push(obj);
                            }

                            var learner_list = [];
                            var equContrast = {};

                            for (var j = 0; j < data2.length; j++) {
                                if (data2[j].value.length > 1 && data2[j].value.length < 8) {
                                    var obj1 = {};
                                    obj1.id = data2[j].value;
                                    obj1.pId = data2[j].pId;
                                    obj1.name = data2[j].label;
                                    obj1.table = data2[j].table;
                                    obj1.field = data2[j].field;
                                    obj1.value = data2[j].value;
                                    obj1.checked = true;
                                    learner_list.push(obj1);
                                    equContrast[data2[j].value] = data2[j].label;
                                }
                            }

                            G.equConfigInf.equContrast = equContrast;

                            function beforeClick(treeId, treeNode) {
                                var zTree = $.fn.zTree.getZTreeObj(treeId);
                                zTree.checkNode(treeNode, !treeNode.checked, null, true);
                                return false;
                            }

                            function onCheck(e, treeId, treeNode) {
                                var zTree = $.fn.zTree.getZTreeObj(treeId),
                                    nodes = zTree.getCheckedNodes(true),
                                    v = ""; //返回checkbox值

                                for (var i = 0, l = nodes.length; i < l; i++) {
                                    if (!nodes[i].isParent) {
                                        v += nodes[i].name + ","; //多值用,隔开
                                    }
                                }

                                if (v.length > 0) v = v.substring(0, v.length - 1);
                                var cityObj = $("#input_" + treeId);
                                cityObj.attr("value", v);
                            }

                            function showMenu(v) {
                                var cityObj = $("#input_" + v + "_a");
                                var cityOffset = $("#input_" + v + "_a").offset();
                                $("#menuContent ul").hide();
                                $("#" + v).show();
                                $("#menuContent").css({
                                    left: cityOffset.left + "px",
                                    top: cityOffset.top + cityObj.outerHeight() + "px"
                                }).slideDown("fast");
                                $("body").bind("mousedown", onBodyDown);
                            }

                            function hideMenu() {
                                $("#menuContent").fadeOut("fast");
                                $("body").unbind("mousedown", onBodyDown);
                            }

                            function onBodyDown(event) {
                                if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
                                    hideMenu();
                                }
                            }

                            $(document).ready(function() {
                                //初始化ztree
                                $.fn.zTree.init($("#treeDemo"), setting, edu_type_list);
                                $.fn.zTree.init($("#learner_list"), setting, learner_list);
                                G.equConfigInf.objTree1 = $.fn.zTree.getZTreeObj("treeDemo");
                                G.equConfigInf.objTree2 = $.fn.zTree.getZTreeObj("learner_list");
                            });
                        };

                        window.EMapServerV2.queryData.queryTree([1, 2], callBackFun);
                    };
                })(window);

                /***/
            }),

            /***/
            0:
            /*!**********************************************!*\
              !*** multi ./public/json/oldserver/index.js ***!
              \**********************************************/
            /*! no static exports found */
            /***/
                (function(module, exports, __webpack_require__) {

                module.exports = __webpack_require__( /*! ./public/json/oldserver/index.js */ "./public/json/oldserver/index.js");


                /***/
            })

            /******/
        });
});
//# sourceMappingURL=oldserver.js.map
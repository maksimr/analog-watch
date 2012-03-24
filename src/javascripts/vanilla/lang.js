/**
 * Helper module
 *
 */

(function (global) {
	"use strict";

	define(function () {
		var doc = global.document,
		ap = Array.prototype,
		opts = Object.prototype.toString,
		_pattern = /\{([^\}]+)\}/g,

		/**
   * @param {Any} it any type
   * @return {Boolea} if type of it is string then return true
   */
		isString = function (it) {
			return typeof it === "string";
		},

		isUndefined = function (it) {
			return typeof it === "undefined";
		},

		/**
   * @param {Any} it any type
   * @return {Boolea} if type of it is object then return true
   */
		isObject = function (it) {
			return opts.call(it) === "[object Object]";
		},

		isFunction = function (it) {
			return opts.call(it) === "[object Function]";
		},

		/**
   * @param {Object} arrayLike array like object
   * @return {Array}
   */
		toArray = function (obj, offset, startWith) {
			return (startWith || []).concat(Array.prototype.slice.call(obj, offset || 0));
		},

		/**
     * @param {Object} scope contex of the call
     * @param {Function|String} method
     */
		hitch = function (scope, method) {
			var args = toArray(arguments, 2),
			_scope = scope || global;
			return function () {
				args = args.length ? args.concat(toArray(arguments)) : toArray(arguments);
				return isString(method) ? _scope[method]() : method.apply(_scope, args);
			};
		},

		/*
     * Add properties to dest object from source object
     */
		_mixin = function (dest, source, copyFunc) {
			var name, s, i, empty = {};
			for (name in source) {
				s = source[name];
				if (! (name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))) {
					dest[name] = copyFunc ? copyFunc(s) : s;
				}
			}
			return dest; // Object
		},

		mixin = function (dest, sources) {
			var i, l;
			if (!dest) {
				dest = {};
			}
			for (i = 1, l = arguments.length; i < l; i++) {
				_mixin(dest, arguments[i]);
			}
			return dest; // Object
		},

		delegate = (function () {
			// boodman/crockford delegation w/ cornford optimization
			function TMP() {}
			return function (obj, props) {
				TMP.prototype = obj;
				var tmp = new TMP();
				TMP.prototype = null;
				if (props) {
					_mixin(tmp, props);
				}
				return tmp; // Object
			};
		} ()),

		getProp = function (parts, create, context) {
			var p, i = 0;

			if (!context) {
				//try find context in global scope
				//assuming that first element in array parts is name of context in
				//global scope
				if (!parts.length) {
					return global;
				}
				p = parts[i++];

				try {
					context = global[p];
				} catch(e) {}
			}

			for (i; context && (p = parts[i++]); p) {
				context = context[p];
        if (isUndefined(context)) {
          context = create ? context[p] = {}: undefined;
        }
			}

			return context;
		},

		setObject = function (name, value, context) {
			var parts = name.split("."),
			p = parts.pop(),
			obj = getProp(parts, true, context);
			return obj && p ? (obj[p] = value) : undefined; // Object
		},

		getObject = function (name, create, context) {
			return getProp(name.split("."), create, context); // Object
		},

		replace = function (tmpl, map, pattern) {
			return tmpl.replace(pattern || _pattern, isFunction(map) ? map: function (_, k) {
				/*
       * 0 - everything feel into regexp
       * 1 - only that feel in parentheses
       * 2 - start index
       * 3 - all template
       *
       * function must return what should insert instead of match
       */
				return getObject(k, false, map);
			});
		},

		trim = String.prototype.trim ?
		function (str) {
			return str.trim();
		}: function (str) {
			return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		},

		/**
   * DOM METHODS
   *
   */

		/**
     * set attribute to node
     * @param {Element} node
     * @param {String|Object} nameAttr attribute(attributes) on get or set
     * @param {String} value value of attribute
     */
		attr = function (node, nameAttr, value) {
			var atr;

      if (!node) {
        return;
      }

			if (arguments.length < 3) {

				if (isObject(nameAttr)) {
					for (atr in nameAttr) {
						if (Object.prototype.hasOwnProperty.call(nameAttr, atr)) {
							attr(node, atr, nameAttr[atr]);
						}
					}
					return node;
				}

				return node.getAttribute(nameAttr);
			}

			if (value) {
				node.setAttribute(nameAttr, value);
			}
			return node;
		},

		/**
   * @param {String} id identifier of node
   * @param {Element} rootNode document node
   * @return {Element|null}
   */
		byId = function (id, docNode) {
			return isString(id) ? (docNode || doc).getElementById(id) : id;
		},

		/**
   * @param {String} tagName
   * @param {Element} rootNode parent node
   * @param {Object} attributes attributes of node
   * @return {Element}
   */
		createNode = function (tagName, attributes, rootNode) {
			var node = (isString(tagName) ? doc.createElement(tagName) : tagName),
			atr;

      if (!node) {
        return;
      }

			if (!rootNode && attributes && !isObject(attributes)) {
				rootNode = attributes;
				attributes = null;
			}

			attributes = attributes || {};

			attr(node, attributes);

			rootNode = byId(rootNode);
			if (rootNode) {
				rootNode.appendChild(node);
			}
			return node;
		};

		//EXPORT MODULE
		return {
			isString: isString,
			isUndefined: isUndefined,
			isObject: isObject,
			isFunction: isFunction,
			toArray: toArray,
			hitch: hitch,
			mixin: mixin,
			delegate: delegate,
			setObject: setObject,
			getObject: getObject,
			replace: replace,
			attr: attr,
			trim: trim,
			createNode: createNode,
			byId: byId
		};
	});

} (this));

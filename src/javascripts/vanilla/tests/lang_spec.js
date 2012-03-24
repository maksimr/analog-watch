/**
 * Spec for lang module
 */

(function (global) {
	var doc = {},
	console = {},
	bundle, Should, should;

	/**
   * spec decorator
   * add test function
   */
	should = Should = function (it) {
		if (! (this instanceof Should)) {
			return new Should(it);
		}
		this.spec = it;
	};

	Should.prototype.be = function (so) {
		var it = this.spec;
		if (so !== it) {
			console.log("expected " + so + " but get " + it);
		}
	};

	Should.prototype.has = function (method) {
		var it = this.spec;
		if (!it[method]) {
			console.log(it + " does not has method " + method);
		}
	};

	/**
   * mock define function
   */
	global.define = function (callback) {
		bundle = callback();
	};

	console.log = global.print;


	/**
   * TESTS =============================================================================================
   */

	/**
   * load module lang
   * I DO NOT TEST DOM METHODS
   */
	global.load('../lang.js');

	/**
   * isString spec
   */
	should(bundle.isString("foo")).be(true);
	should(bundle.isString(1)).be(false);
	should(bundle.isString({})).be(false);
	should(bundle.isString([])).be(false);

	/**
   * isObject spec
   */
	should(bundle.isObject({})).be(true);
	should(bundle.isObject(1)).be(false);
	should(bundle.isObject("foo")).be(false);
	should(bundle.isObject([])).be(false);

	/**
   * toArray spec
   *
   */
	should(bundle.toArray({
		"0": 1,
		"1": 2,
		length: 2
	})).has("join");

	/**
   * hitch spec
   * save scope
   */
	should(bundle.hitch({
		foo: 'foo'
	},
	function () {
		return this.foo;
	})()).be('foo');

	/**
   * hitch spec
   * currying
   */
	should(bundle.hitch(null, function (predefine) {
		return predefine;
	},
	'bar')()).be('bar');

	/**
   * hitch spec
   * pass only function's name
   */
  should(bundle.hitch({
    foo: 'foo',
    bar: function () {
     return this.foo;
   }
  },'bar')()).be('foo');

	/**
   * replace spec
   * array with one parameter
   */
  should(bundle.replace("foo {0}",["bar"])).be("foo bar");

	/**
   * replace spec
   * array any count parameters
   */
  should(bundle.replace("foo {0} {0} {1}",["bar", "foo"])).be("foo bar bar foo");

	/**
   * replace spec
   * should correct work with value that auto convert to false
   */
  should(bundle.replace("foo {0}",[0])).be("foo 0");
  should(bundle.replace("foo {0}",[""])).be("foo ");
  should(bundle.replace("foo {0}",[null])).be("foo null");

	/**
   * replace spec
   * object
   */
  should(bundle.replace("foo {bar}",{
    bar: 'bar'
  })).be("foo bar");

	/**
   * replace spec
   * custom pattern
   */
  should(bundle.replace("foo %{mtch}",{
    mtch: 'fooBar'
  },/%\{([^\}]+)\}/g)).be("foo fooBar");

} (this));

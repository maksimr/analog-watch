/**
 * @module svg
 * @description provide API for work with svg objects
 */

(function (global) {
	define(['./lang'], function (lang) {
    var doc = document, svgNS = 'http://www.w3.org/2000/svg';

		/**
     * create svg node
     * @param {Element|String} domNode
     * @param {String|Number} width
     * @return {String|Number} height
     */
		var Svg = function (domNode, width, height) {
      var rootNode;

			if (! (this instanceof Svg)) {
				return new Svg(domNode, width, height);
			}

			this.svgNS = svgNS;
      rootNode = this.containerNode = doc.createElementNS(this.svgNS, 'svg');

			lang.attr(rootNode, {
				xmlns: this.svgNS,
				version: '1.1',
				width: width,
				height: height
			});

			this.srcNode = lang.byId(domNode);
      lang.createNode(rootNode, this.srcNode);
		};

		/**
     * create Path object
     */
		Svg.prototype.path = function (d) {
			return this.create('path', {
				d: d
			});
		};

		/**
     * create Circle object
     * @param {String|Number} x coordinates of center by x
     * @param {String|Number} y coordinates of center by y
     * @param {String|Number} radius radius of circle
     */
		Svg.prototype.circle = function (x, y, radius) {
			return this.create('circle', {
				cx: x,
				cy: y,
				r: radius
			});
		};

		/**
     * create Rectangle object
     * @param {String|Number} x coordinates of center by x
     * @param {String|Number} y coordinates of center by y
     * @param {String|Number} width
     * @param {String|Number} height
     */
		Svg.prototype.rect = function (x, y, width, height) {
			return this.create('rect', {
				x: x,
				y: y,
				width: width,
				height: height
			});
		};

		/**
     * factory method for creating objects
     * @param {String} tagName
     * @param {Object} opts attributes of tag
     * @return {Element}
     */
		Svg.create = function (tagName, opts, ns) {
			var tag = doc.createElementNS(ns || svgNS, tagName);
      lang.attr(tag, opts);
			return tag;
		};

		Svg.prototype.create = function (tagName, opts) {
			var tag = Svg.create(tagName, opts, this.svgNS);
      lang.createNode(tag, this.containerNode);
			return tag;
		};

		/**
     * EXPORT SVG MODULE
     */
		return Svg;
	});
} (this));

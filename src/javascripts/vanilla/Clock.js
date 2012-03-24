/*
 * @module Clock
 */

(function (global) {

	define(['./lang', './Svg'], function (lang, Svg) {
		"use strict";

		var Clock, M = Math,
		TX = [],
		TY = [],
		R = M.PI / 180,
		count;

		/*
     * get angel of rotation
     */
		for (count = 13; --count; count) {
			TX[count] = [M.cos(30 * count * R)];
			TY[count] = [M.sin(30 * count * R)];
		}
		/*
     * @param {Element|String} domNode root node of clock
     * @param {Object} parameter configuration object
     */
		Clock = function (domNode, parametrs) {
			if (! (this instanceof Clock)) {
				return new Clock(domNode);
			}
      this.uber = Clock.prototype;
			this.create(domNode, parametrs);
		};

		/**
     * create
     * call on create Clock object
     *
     * life cicle postMixinProperties, buildRendering, postCreate
     */
		Clock.prototype.create = function (domNode, parametrs) {
			this.srcNode = lang.byId(domNode) || lang.createNode('div');

			//clock's size
			this.width = 200;
			this.height = 200;

			lang.mixin(this, parametrs);

			this.postMixinProperties();

			this.buildRendering();

			this.postCreate();
		};

		/**
     * postMixinProperties
     */
		Clock.prototype.postMixinProperties = function () {};

		/**
     * buildRendering
     * Render clock
     */
		Clock.prototype.buildRendering = function () {
			var rootNode = this.srcNode,
			width = this.width,
			height = this.height,
			svg = this.svg = new Svg(rootNode, width, height),
      //third parametr is height of hand
      path = ["M{0} {1}L{2} {3}L{4} {3}Z", [width / 2, height*0.3, width/2 - width*0.05, height/2, width/2+width*0.05]],
			x,
			y,
			i;

			/*
       * Draw clock frame
       */
			if (lang.isUndefined(this.clockNode)) {
				this.clockNode = lang.attr(Svg.create('circle'), {
          cx: width/2,
          cy: height/2,
          r: width/2 - 5,
					fill: "#EEFEFF",
					stroke: "#444444",
					"stroke-width": 5
				});
			}
      lang.createNode(this.clockNode, this.svg.containerNode);

			/*
       * Draw time markers
       */
			if (lang.isUndefined(this.markers)) {
				this.markers = [];
				for (i = 13; --i; i) {
					x = [width / 2 + M.round((width/2 - 20) * TX[i]), width / 2 + M.round((width/2 - 10) * TX[i])];
					y = [height / 2 + M.round((height/2 - 20) * TY[i]), height / 2 + M.round((height/2 - 10) * TY[i])];

					this.markers.push(lang.attr(svg.path("M" + x[0] + " " + y[0] + "L" + x[1] + " " + y[1]), {
						stroke: "#000000",
						fill: "none"
					}));
				}
			}

			/*
       * Draw hour hand
       * M - moveto
       * L - lineto
       * Z - closepath
       */
			if (lang.isUndefined(this.hourHandNode)) {
				this.hourHandNode = lang.attr(Svg.create('path'), {
          d: lang.replace.apply(lang, path)
				});
			}
      lang.createNode(this.hourHandNode, this.svg.containerNode);
			/*
       * Draw minute hand
       */
			if (lang.isUndefined(this.minHandNode)) {
				path[1][1] = height * 0.2;
				this.minHandNode = lang.attr(Svg.create('path'), {
          d: lang.replace.apply(lang, path)
				});
			}
      lang.createNode(this.minHandNode, this.svg.containerNode);

      lang.attr(svg.circle(width / 2, height / 2, width * 0.05), {
        fill: "#FFF",
        stroke: "#000",
        "stroke-width": 3
      });

			/*
       * Draw second hand
       */
			if (lang.isUndefined(this.secHandNode)) {
        path = ["M{0} {1}L{0} {2}", [width / 2, height / 2, height*0.1]];
				this.secHandNode = lang.attr(Svg.create('path'), {
          d: lang.replace.apply(lang, path),
					stroke: "red",
					"stroke-width": 1
				});

        lang.attr(svg.circle(width / 2, height / 2, width * 0.02), {
          fill: "red",
        });
			}
      lang.createNode(this.secHandNode, this.svg.containerNode);

		};

		/**
     * post create object
     */
		Clock.prototype.postCreate = function () {
			this.run();
		};

		/**
     * tick
     */
		Clock.prototype.tick = function () {
			var timeNow = this.getTimeZone(),
			width = this.width,
			height = this.height,
			hours = timeNow.getHours(),
			min = timeNow.getMinutes(),
			sec = timeNow.getSeconds();

			lang.attr(this.hourHandNode, 'transform', lang.replace('rotate({0},{1},{2})', [30 * hours + min / 2.5, width/2, height/2]));
			lang.attr(this.minHandNode, 'transform', lang.replace('rotate({0},{1},{2})', [6 * min, width/2, height/2]));
			lang.attr(this.secHandNode, 'transform', lang.replace('rotate({0},{1},{2})', [6 * sec, width/2, height/2]));
		};

		/**
     * getTimeZone
     * get date time for specific zone
     * @return {Date}
     */
    Clock.prototype.getTimeZone = function () {
      return new Date();
    };

		/**
     * run clock
     */
		Clock.prototype.run = function (dateTime) {
			this.tick();
			this._interval = global.setInterval(lang.hitch(this, 'tick'), 1000);
		};

		/**
     * stop stop
     *
     */
		Clock.prototype.stop = function () {
			global.clearInterval(this._interval);
		};

		return Clock;
	});

} (this));
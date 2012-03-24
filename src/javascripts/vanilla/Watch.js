/*
 * @module Watch
 */

(function (global) {

	define(['./lang', './Svg'], function (lang, Svg) {
		"use strict";

		var Watch, M = Math,
    doc = global.document,
		TX = [],
		TY = [],
		R = M.PI / 180,
		count;

		/*
     * get angel of rotation
     */
		for (count = 13; --count; count) {
			TX[count] = [ M.sin(30 * count * R)];
			TY[count] = [-M.cos(30 * count * R)];
		}
		/*
     * @param {Element|String} domNode root node of watch
     * @param {Object} parameter configuration object
     */
		Watch = function (domNode, parametrs) {
			if (! (this instanceof Watch)) {
				return new Watch(domNode);
			}
      this.uber = Watch.prototype;
			this.create(domNode, parametrs);
		};

		/**
     * create
     * call on create Watch object
     *
     * life cicle postMixinProperties, buildRendering, postCreate
     */
		Watch.prototype.create = function (domNode, parametrs) {
			this.srcNode = lang.byId(domNode) || lang.createNode('div');

			//watch's size
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
		Watch.prototype.postMixinProperties = function () {};

		/**
     * buildRendering
     * Render watch
     */
		Watch.prototype.buildRendering = function () {
			var rootNode = this.srcNode,
			width = this.width,
			height = this.height,
			svg = this.svg = new Svg(rootNode, width, height),
      path = ["M{0} {1}L{2} {3}L{4} {3}Z", [width / 2, height*0.3, width/2 - width*0.05, height/2, width/2+width*0.05]],
			x,
			y,
			i;

			/*
       * Draw watch frame
       */
			if (lang.isUndefined(this.watchNode)) {
				this.watchNode = lang.attr(Svg.create('circle'), {
          cx: width/2,
          cy: height/2,
          r: width/2 - 5,
					fill: "#EEFEFF",
					stroke: "#444444",
					"stroke-width": 5
				});
			}
      lang.createNode(this.watchNode, this.svg.containerNode);

			/*
       * Draw time markers
       */
			if (lang.isUndefined(this.markers)) {
				this.markers = [];
				for (i = 13; --i; i) {
					x = width / 2 + M.round(width * 0.35 * TX[i]);
					y = height / 2 + M.round(height * 0.35* TY[i]);

          this.markers.push(svg.create('text',{
            x: x - width * 0.025 * (i < 10 ? 1 : 2),
            y: y + height * 0.025 * (i < 10 ? 1 : 2),
            'font-size': width*0.1,
						fill: "#000"
          }).appendChild(doc.createTextNode(i)));
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
       * Draw seconds hand
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
		Watch.prototype.postCreate = function () {
			this.run();
		};

		/**
     * tick
     */
		Watch.prototype.tick = function () {
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
    Watch.prototype.getTimeZone = function () {
      return new Date();
    };

		/**
     * run watch
     */
		Watch.prototype.run = function (dateTime) {
			this.tick();
			this._interval = global.setInterval(lang.hitch(this, 'tick'), 1000);
		};

		/**
     * stop stop
     *
     */
		Watch.prototype.stop = function () {
			global.clearInterval(this._interval);
		};

		return Watch;
	});

} (this));

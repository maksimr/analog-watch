(function (global) {
	"use strict";

	require(['./lang', './Clock', './Svg'], function (lang, Clock, Svg) {
    var doc = document;

		var clock1 = new Clock("clock-1", {
			width: 400,
			height: 400,
			postCreate: function () {
        var w = this.width, h = this.height;
        this.svg.create('text',{
          x: w/2 - 5,
          y: h - 25,
          fill: "red"
        }).appendChild(doc.createTextNode(6));

        this.svg.create('text',{
          x: w/2 - 5,
          y: 35,
          fill: "red"
        }).appendChild(doc.createTextNode(0));

        this.svg.create('text',{
          x: 35,
          y: h/2 + 5,
          fill: "red"
        }).appendChild(doc.createTextNode(9));

        this.svg.create('text',{
          x: w - 35,
          y: h/2 + 5,
          fill: "red"
        }).appendChild(doc.createTextNode(3));

        var c = (new Clock("clock-1"));

        this.uber.postCreate.call(this);
			}
		});

		//Only hour
		var clock2 = new Clock("clock-2", {
			width: 100,
			height: 100,
			clockNode: Svg.create('rect', {
				width: 100,
				height: 100,
				rx: 10,
				ry: 10
			}),
			minHandNode: false,
			secHandNode: false
		});

		//Only minutes
		var clock3 = new Clock("clock-3", {
			width: 100,
			height: 100,
			hourHandNode: false,
			secHandNode: false
		});

		//Only seconds
		var clock4 = new Clock("clock-4", {
			width: 100,
			height: 100,
			hourHandNode: false,
			minHandNode: false
		});
	});

} (this));

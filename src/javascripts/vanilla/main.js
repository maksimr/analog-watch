(function (global) {
	"use strict";

	require(['./lang', './Watch', './Svg'], function (lang, Watch, Svg) {
    var doc = document;

		var watch1 = new Watch("watch-1", {
			width: 400,
			height: 400,
			postCreate: function () {
        var c = (new Watch("watch-1"));
        this.uber.postCreate.call(this);
			}
		});

		//Only hour
		var watch2 = new Watch("watch-2", {
			width: 100,
			height: 100,
			watchNode: Svg.create('rect', {
				width: 100,
				height: 100,
				rx: 10,
				ry: 10
			}),
			minHandNode: false,
			secHandNode: false
		});

		//Only minutes
		var watch3 = new Watch("watch-3", {
			width: 100,
			height: 100,
			hourHandNode: false,
			secHandNode: false
		});

		//Only seconds
		var watch4 = new Watch("watch-4", {
			width: 100,
			height: 100,
			hourHandNode: false,
			minHandNode: false
		});
	});

} (this));

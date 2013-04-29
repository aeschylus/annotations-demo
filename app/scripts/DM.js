window.DM = (function ($, d3, openseadragon, undefined) {
    'use strict';
    var dm = {
        annotations: [],
        buildAnnotations: buildAnnotations,
        getAnnotations: function() {
            return this.annotations;
        }
    }

    return dm;
})(jQuery, d3, OpenSeadragon, d3);

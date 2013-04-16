(function ($, d3, openseadragon, undefined) {
    'use strict';

    var annotations = [],
    width = 500,
    height = 1200;

    function genUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    function createAnno() {
        var anno = {
            id: genUUID(),
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            title: 'Behold',
            body: 'The studio was filled with the rich odor of roses, and when the light summer wind stirred amidst the trees of the garden there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.',
            className: 'text_commentary'

        };

        annotations.push(anno);
    }

    for (var i = 0; i < 80; i ++) {
        createAnno();
    }

    console.log(annotations);

    function render() {
        ;
    }

    function init() {
        render();
    }

    $(function () {

        var svg = d3.select('#annotations_overlay');

        var annotation = svg.selectAll('.annotation')
        .data(annotations)
        .enter()
        .append('circle')
        .attr('class', 'annotation')
        .attr('r', '3')
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; })
        .style('fill', 'cyan');

        console.log(svg);

        $('#viewer').height($('body').innerHeight());

        window.DGN = openseadragon({
            'id':               'viewer',
            'prefixUrl':        'http://openseadragon.github.com/openseadragon/images/',
            'preserveViewport': true,
            'visibilityRatio':  1,
            'minZoomLevel':     0,
            'defaultZoomLevel': 0,
            'tileSources':      [{
                'identifier': 'bg210vm0680%2fbookCover',
                'width': 5233,
                'height': 7200,
                'tile_width': 512,
                'tile_height': 512,
                'formats': [ 'jpeg', 'png', 'gif', 'bmp' ],
                'qualities': [ 'native' ],
                'profile': 'http://library.stanford.edu/iiif/image-api/compliance.html#level1',
                'image_host': 'https://stacks-test.stanford.edu/image/iiif',
                overlays: [{
                    id: 'annotations_overlay',
                    px: 0,
                    py: 0,
                    width:  5233,
                    height:  7200,
                    className: 'text_commentary'
                }]
            }]
        });
        init();
    });
})(jQuery, d3, OpenSeadragon, d3);

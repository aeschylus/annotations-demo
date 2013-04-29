(function ($, d3, openseadragon, undefined) {
    
    'use strict';

    var annotations = [],
    width = 5233,
    height = 7200;

    function genUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    function collectAnnotations(json) {
        d3.json('data/Transcriptions-f1r.json', function (error, json) {
            var rawAnnos = json['@graph'],
            commentaryBodies = {};
            window.commentaryBodies = commentaryBodies;
            rawAnnos.forEach(function (item) {

                function commentaryBodyById(id) {
                    return commentaryBodies[id];
                }

                if (item['@type'][0] === 'cnt:ContentAsText') {
                    commentaryBodies[item['@id']] = item['cnt:chars'];
                } else if (item['@type'][1] === 'dms:TextAnnotation') {
                    var itemId = item['oac:hasBody']['@id'],
                    annotation = {
                        id: genUUID(),
                        px: Math.random() * width,
                        py: Math.random() * height,
                        width: Math.random() * width / 4,
                        height: Math.random() * height / 5,
                        title: 'Behold',
                        body: commentaryBodyById(itemId),
                        className: 'text_commentary'
                    };
                    console.log(itemId);
                    annotations.push(annotation);
                }
            });
            console.log(annotations);
            return annotations;
        });
    }

    function createAnnotation() {
        var annotation = {
            id: genUUID(),
            px: Math.random() * width,
            py: Math.random() * height,
            title: 'Behold',
            body: 'The studio was filled with the rich odor of roses, and when the light summer wind stirred amidst the trees of the garden there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.',
            className: 'text_commentary'
        };

        annotations.push(annotation);
    }

    // for (var i = 0; i < 280; i ++) {
    //     createAnnotation();
    // }


    function bindEvents() {
        $('.annotation').on('click', clickAnnotation);
        $('.annotation').on('hover', annotationHover);
    }

    function render() {

    }

    // Event Handlers

    function clickAnnotation() {
        d3.selectAll('.annotation').attr('class', 'annotation');
        $(this).attr('class','annotation selected');
        var id = $(this).parent().attr('id');
    }

    function annotationHover() {
        var id = $(this).parent().attr('id');

    }

    function init() {
        collectAnnotations();
        bindEvents();
        render();
    }
    init();
    
    $(function () {

        var svg = d3.select('#annotations_overlay');

        var annotation = d3.select('#viewer').selectAll('.annotation')
        .data(annotations)
        .enter()
        .append('svg')
        .attr('height', '15')
        .attr('width', '15')
        .attr('id', function (d) { return d.id; })
        .append('circle')
        .attr('class', 'annotation')
        .attr('r', '4')
        .attr('cx', 7.5)
        .attr('cy', 7.5)
        .style('fill', 'cyan');

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
                overlays: annotations
            }]
        });
    });
})(jQuery, d3, OpenSeadragon, d3);

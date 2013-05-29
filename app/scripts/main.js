DM = (function ($, d3, openseadragon, undefined) {

    'use strict';

    var dm = {
        init: init,
        annotations: [],
        setAnnotations: function (annotations) {
            this.annotations = annotations;
            this.render();
        },
        bindEvents: bindEvents,
        render: render,
        countAnnotations: function () {
            return dm.annotations.length;
        },
        canvas: null,
        getZoomLevel : function() {

        },
        getBoundRatios : function() {

        },
        scale : {

        },
        setScale: function (canvas) {
            this.scale.render();
        },
    };

    var annotations = [],
    width =  3071,
    height = 4851;

    function genUUID() {
        var idNum = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });

        return "uuid-" + idNum;
    }

    function buildAnnotations() {
        d3.json('data/Transcriptions-f1r.json', function (error, json) {
            var rawAnnos = json['@graph'],
            commentaryBodies = {};
            window.commentaryBodies = commentaryBodies;
            var annotations = [];
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
                        x: Math.random(),
                        y: Math.random(),
                        width: Math.random(),
                        height: Math.random(),
                        title: 'Behold',
                        body: commentaryBodyById(itemId),
                        className: 'text_commentary',
                    };
                    annotation.frame = new OpenSeadragon.Rect( annotation.x - annotation.width/40, annotation.y - annotation.height/40, annotation.width + annotation.width/20, annotation.height + annotation.height/20 );
                    annotations.push(annotation);
                }
            });
            dm.setAnnotations(annotations);
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

    function bindEvents() {
        $('#viewer').on('click', clickViewer);
        $(window).on('scroll', function() {console.log("scrollin' homies");});
        $('.annotation').on('click', clickAnnotation);
        $('.annotation').on('hover', annotationHover);
        $('.annotation').on('hover', annotationHover);
        $('.annotationCard').on('click', clickAnnotationCard);
        $('.annotationCard').on('hover', annotationCardHover);
    }

    function render() {
        var $annotationCard = $('.annotationCard').clone(),
        $annotationsTotal = $('.annotationsTotal'),
        $annotationList = $('.annotationList');

        $('.annotationCard').remove();

        dm.annotations.forEach(function (item, iterator) {
            newCard(item, iterator);
        });

        function newCard(annotationDetails, num) {
            var $newCard = $annotationCard.clone();
            $newCard.attr('id', "listing"+annotationDetails.id);
            $newCard.find('h3').text(num);
            $newCard.find('p').text(annotationDetails.body);
            $('.annotationList').append($newCard);
        }

        $annotationsTotal.text(dm.countAnnotations);

        var annotation = d3.select('#viewer').selectAll('.annotation')
        .data(dm.annotations)
        .enter()
        .append('svg')
        .attr('height', '15')
        .attr('width', '15')
        .attr('id', function (d) { return d.id; })
        .append('rect')
        .attr('class', 'annotation')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 98 + '%')
        .attr('height', 98 + '%');

        dm.canvas =  new OpenSeadragon({
            'id':               'viewer',
            'prefixUrl':        'http://openseadragon.github.com/openseadragon/images/',
            'preserveViewport': true,
            'visibilityRatio':  1,
            'minZoomLevel':     0,
            'defaultZoomLevel': 0,
            'tileSources':      [{
                'identifier': 'bd183mz0176%2fW688_000001_300',
                'width': 3071,
                'height': 4851,
                'tile_width': 512,
                'tile_height': 512,
                'formats': [ 'jpeg', 'png', 'gif', 'bmp' ],
                'qualities': [ 'native' ],
                'profile': 'http://library.stanford.edu/iiif/image-api/compliance.html#level1',
                'image_host': 'https://stacks-test.stanford.edu/image/iiif',
                overlays: DM.annotations
            }]
        });

        bindEvents();
    }

    // Event Handlers
    //
    function clickViewer() {
        var canvasWidth = 700,
        scaleWidth = 200,
        relativeScaleWidth = scaleWidth/canvasWidth,
        scaleRatio = DM.canvas.viewport.getBounds().width;

        var newLabel = (canvasWidth*scaleRatio)*relativeScaleWidth + "mm";
        $('#scale .label').text(newLabel);
    }

    function clickAnnotation() {
        d3.selectAll('.annotation').attr('class', 'annotation');
        $(this).attr('class','annotation selected');
        $('.annotationCard').removeClass('selected');
        var id = "#listing" + $(this).parent().attr('id');
        $(id).addClass('selected');
        $('#sidepanel').animate(
            {scrollTop: $(id).offset().top},
            500
        );

        var annotationId = id.substring(8, 10000); 
        var annotationFrame = $.grep(dm.canvas.tileSources[0].overlays, function(e) { return e.id === annotationId; } )[0].frame;
        dm.canvas.viewport.fitBounds(annotationFrame);
    }

    function annotationHover() {
        d3.selectAll('.annotationHover').attr('class', 'annotation');
        $(this).attr('class','annotation annotationHover');
        $('.annotationCard').removeClass('annotationCardHover');
        var id = "#listing" + $(this).parent().attr('id');
        $(id).addClass('annotationCardHover');
    }

    function clickAnnotationCard() {
        d3.selectAll('.annotation').attr('class', 'annotation');
        $('.annotationCard').removeClass('selected');
        $(this).addClass('selected');
        var id = $(this).attr('id');
        id = '#' + id.substring(7, 10000);
        var el = d3.select(id + " .annotation").attr('class','annotation selected');
        var annotationId = id.substring(1, 10000); 
        var annotationFrame = $.grep(dm.canvas.tileSources[0].overlays, function(e) { return e.id === annotationId; } )[0].frame;
        dm.canvas.viewport.fitBounds(annotationFrame);
        clickViewer();
    }

    function annotationCardHover() {
        d3.selectAll('.annotationHover').attr('class', 'annotation');
        $('.annotationCard').removeClass('annotationCardHover');
        $(this).addClass('annotationCardHover');
        var id = $(this).attr('id');
        id = '#' + id.substring(7, 10000);
        var el = d3.select(id + " .annotation").attr('class','annotation annotationHover');
    }

    function init() {
        buildAnnotations();
    }

    return dm;
})(jQuery, d3, OpenSeadragon, d3);

var scale = function() {
    var scale = {
        prop: "tester",
        drawFrom: DM.canvas
    }

    return scale;
};
$(function () {
    $('#viewer').height($('body').innerHeight());
    DM.init()
    herp = new scale();
});


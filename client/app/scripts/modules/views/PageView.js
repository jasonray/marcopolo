define(function(require, exports, module) {
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var HeaderFooter    = require('famous/views/HeaderFooterLayout');
    var ImageSurface    = require('famous/surfaces/ImageSurface');

    var FeedData       = require('modules/data/NewFeedData');

    function PageView() {
        View.apply(this, arguments);

        _createBacking.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);

        _setListeners.call(this);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.DEFAULT_OPTIONS = {
        headerSize: 44
    };

    function _createBacking() {
        var backing = new Surface({
            properties: {
                backgroundColor: 'black',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }
        });

        this.add(backing);
    }

    function _createLayout() {
        this.layout = new HeaderFooter({
            headerSize: this.options.headerSize
        });

        var layoutModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.1)
        });

        this.add(layoutModifier).add(this.layout);
    }

    function _createHeader() {
        var backgroundSurface = new Surface({
            properties: {
                backgroundColor: '#00a9a6'
            }
        });

        this.hamburgerSurface = new ImageSurface({
            size: [44, 44],
            content : './images/hamburger.png'
        });
        this.titleSurface = new Surface({
            size: [200, 44],
            content : 'NEW IDEAS',
            properties: {
                color: 'white',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                fontSize: '26px',
                textTransform: 'uppercase',
                pointerEvents : 'none'
            }
        });

        var searchSurface = new ImageSurface({
            size: [232, 44],
            content : './images/search.png'
        });

        var iconSurface = new ImageSurface({
            size: [44, 44],
            content : './images/plus.png'
        });

        var backgroundModifier = new StateModifier({
            transform : Transform.behind
        });

        var hamburgerModifier = new StateModifier({
            origin: [0, 0.5],
            align : [0, 0.5]
        });
        var titleModifier = new StateModifier({
            transform: Transform.translate(60, 4, 0)
        });

        var searchModifier = new StateModifier({
            origin: [1, 1],
            transform: Transform.translate(-40, 0, 60),   
        });

        var iconModifier = new StateModifier({
            origin: [1, 0.5],
            align : [1, 0.5]
        });

        this.layout.header.add(backgroundModifier).add(backgroundSurface);
        this.layout.header.add(hamburgerModifier).add(this.hamburgerSurface);
        this.layout.header.add(searchModifier).add(searchSurface);
        this.layout.header.add(iconModifier).add(iconSurface);
        this.layout.header.add(titleModifier).add(this.titleSurface);
    }

    function _createBody() {
        this.bodySurface = new Surface({
            size : [undefined, undefined],
            content : 'Feeds go here',
            properties: {
                textAlign: 'center',
                backgroundColor: '#e9e9e9'
            }
        });

        this.layout.content.add(this.bodySurface);
    }

    function _setListeners() {
        this.hamburgerSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));

        this.bodySurface.pipe(this._eventOutput);
    }

    module.exports = PageView;
});

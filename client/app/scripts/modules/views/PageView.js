define(function(require, exports, module) {
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var HeaderFooter    = require('famous/views/HeaderFooterLayout');
    var ImageSurface    = require('famous/surfaces/ImageSurface');
     var Lightbox       = require('famous/views/Lightbox');
    var Easing          = require('famous/transitions/Easing');

    var AddItemView     = require('modules/views/AddItemView');
    var FeedView        = require('modules/views/FeedView');
    var FeedData        = JSON.parse(window.localStorage['newFeed']);

    function PageView() {
        View.apply(this, arguments);

        _createBacking.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
        _createFeedView.call(this);
        _createLightbox.call(this);
        _createModal.call(this);

        _setListeners.call(this);
    }
    
    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.DEFAULT_OPTIONS = {
        headerSize: 44,
        lightboxOpts: {
            inOpacity: 1,
            outOpacity: 0,
            inOrigin: [.5, 0],
            outOrigin: [0, 0],
            showOrigin: [.5, .5],
            inTransform: Transform.thenMove(Transform.rotateX(0.9), [0, -300, 500]),
            outTransform: Transform.thenMove(Transform.rotateZ(0.7), [0, window.innerHeight, 500]),
            inTransition: { duration: 650, curve: 'easeOut' },
            outTransition: { duration: 500, curve: Easing.inCubic }
        }
    };

    function _createBacking() {
        var backing = new Surface({
            properties: {
                backgroundColor: 'white',
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

        this.addIdeaSurface = new ImageSurface({
            size: [44, 44],
            content : './images/plus.png',
            properties: {
                backgroundColor: '#4f4f4f',
            }
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
            transform: Transform.translate(-60, 0, 60),   
        });

        var addItemModifier = new StateModifier({
            origin: [1, 0.5],
            align : [1, 0.5]
        });

        this.layout.header.add(backgroundModifier).add(backgroundSurface);
        this.layout.header.add(hamburgerModifier).add(this.hamburgerSurface);
        this.layout.header.add(searchModifier).add(searchSurface);
        this.layout.header.add(addItemModifier).add(this.addIdeaSurface);
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

        // this.layout.content.add(this.bodySurface);
    }
    function _createLightbox() {
        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.add(this.lightbox);
    }
    function _createModal() {
        this.modalbacking = new Surface({
            properties: {
                backgroundColor: 'white',
                opacity: '0.7'
            }
        });
    }
    function _openModal() {
        var stateModifier = new StateModifier({
            transform: Transform.translate(0, 0, 100)
        });

        this.add(stateModifier).add(this.modalbacking);
    }
    function _closeModal() {
        var stateModifier = new StateModifier({
            transform: Transform.translate(0, 0, -100)
        });
        this.add(stateModifier).add(this.modalbacking);
    }
    function _createFeedView() {
        this.feedView = new FeedView({ feedData: FeedData });
        // this.feedModifier = new Modifier({
        //     transform: function() {
        //         return Transform.translate(this.pageViewPos.get(), 0, 0);
        //     }.bind(this)
        // });

        // this._add(this.feedModifier).add(this.pageView);
        this.layout.content.add(this.feedView);
    }
    function _openAddItemView() {
        var form = new AddItemView();
        _openModal.call(this);
        this.lightbox.show(form, function() {
            this.ready = true;   
        }.bind(this));
    }

    function _setListeners() {
        this.hamburgerSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));

        this.bodySurface.pipe(this._eventOutput);

        this.addIdeaSurface.on("mouseover", function(){
            this.setProperties({
                backgroundColor: '#5e5e5e'
            });
        });
        this.addIdeaSurface.on("mouseout", function(){
            this.setProperties({
                backgroundColor: '#4f4f4f'
            });
        });
        this.addIdeaSurface.on("click", function(){
            this._eventOutput.emit('slideLeft');
            _openAddItemView.call(this);
        }.bind(this));
        
        this.modalbacking.on('click', function() {
            this.lightbox.hide();
            _closeModal.call(this);
        }.bind(this));
    }

    module.exports = PageView;
});

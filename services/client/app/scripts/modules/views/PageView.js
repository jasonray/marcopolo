define(function(require, exports, module) {
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var HeaderFooter    = require('famous/views/HeaderFooterLayout');
    var ImageSurface    = require('famous/surfaces/ImageSurface');
    var Lightbox        = require('famous/views/Lightbox');
    var Easing          = require('famous/transitions/Easing');
    var InputSurface  = require('famous/surfaces/InputSurface');

    var AddItemView     = require('modules/views/AddItemView');
    var LoginView       = require('modules/views/LoginView')
    var FeedItemDetailsView    = require('modules/views/FeedItemDetailsView')
    var FeedView        = require('modules/views/FeedView');
    var Store           = require('store');
    var User            = require('entities/user')
    var Ideas           = require('entities/ideas');

    var modalClose      = true;

    function PageView() {
        View.apply(this, arguments);

        _createLightbox.call(this);
        _createBacking.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
        _createModal.call(this);
        _authenticate.call(this);
        _createFeedView.call(this);
        
        _createAddItemView.call(this);

        _setListeners.call(this);
        _setVolatileListeners.call(this);

        _createPublicFunctions.call(this);

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
            inTransition: { duration: 600, curve: 'easeOut' },
            outTransition: { duration: 400, curve: 'easeOut' }
        }
    };

    function _authenticate() {
        if (!User.instance().auth()) {
            _createLoginView.call(this);
            modalClose = false;
        }
    }

    function _createLoginView() {
        this.loginView = new LoginView();
        _openLightBox.call(this, this.loginView);
        this.loginView.on('login:close', function(){
            modalClose = true;
           _closeLightBox.call(this);
        }.bind(this));
    }

    function _createPublicFunctions() {
        this.refreshFeed = function() {
            this.feedView.render = function(){ return null; }
            this.titleSurface.render = function(){ return null; }
            _createFeedView.call(this);
            _createTitleSurface.call(this);
            this.layout.header.add(this.titleModifier).add(this.titleSurface);
            _setVolatileListeners.call(this);
        }
    }

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
    function _createTitleSurface() {
        this.titleSurface = new Surface({
            size: [200, 44],
            content : this.options.feed.title,
            properties: {
                color: 'white',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                fontSize: '26px',
                textTransform: 'uppercase',
                pointerEvents : 'none'
            }
        });
        this.titleModifier = new StateModifier({
            transform: Transform.translate(60, 4, 0)
        });
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
        
        this.searchInput = new InputSurface({
            size: [180, 30],
            name: 'input-search',
            attributes: ['results'],
            placeholder: 'Start search',
            value: '',
            type: 'search',
            attributes: {
                results: 'results' 
            }
        });

        this.addIdeaSurface = new ImageSurface({
            size: [44, 44],
            content : './images/plus.png',
            properties: {
                backgroundColor: '#4f4f4f',
            }
        });

        var addItemModifier = new StateModifier({
            origin: [1, 0.5],
            align : [1, 0.5]
        });

        var backgroundModifier = new StateModifier({
            transform : Transform.behind
        });

        var hamburgerModifier = new StateModifier({
            origin: [0, 0.5],
            align : [0, 0.5]
        });

        var searchModifier = new StateModifier({
            origin: [1, 1],
            transform: Transform.translate(-60, -7, 60),   
        });

        _createTitleSurface.call(this);

        this.layout.header.add(backgroundModifier).add(backgroundSurface);
        this.layout.header.add(hamburgerModifier).add(this.hamburgerSurface);
        this.layout.header.add(searchModifier).add(this.searchInput);
        this.layout.header.add(addItemModifier).add(this.addIdeaSurface);
        this.layout.header.add(this.titleModifier).add(this.titleSurface);
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
            classes: ["blur-effect"],
            properties: {
                backgroundColor: 'white'
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
    function _createAddItemView() {
        this.addItemView = new AddItemView();
    }
    function _createFeedView() {
        this.feedView = new FeedView({ feedData: this.options.feed.data, feedName: this.options.feed.name });
        // this.feedModifier = new Modifier({
        //     transform: function() {
        //         return Transform.translate(this.pageViewPos.get(), 0, 0);
        //     }.bind(this)
        // });

        // this._add(this.feedModifier).add(this.pageView);
        this.layout.content.add(this.feedView);

    }
    function _openLightBox(view) {
        _openModal.call(this);
        this.lightbox.show(view, function() {
            this.ready = true;   
        }.bind(this));
    }
    function _closeLightBox() {
        this.lightbox.hide();
        _closeModal.call(this);
    }
    function _createFeedItemDetails(item) {
        this.feedItemDetailsView = new FeedItemDetailsView(item);
        _openLightBox.call(this, this.feedItemDetailsView);
        this.feedItemDetailsView.on('login:close', function(){
            modalClose = true;
           _closeLightBox.call(this);
        }.bind(this));
        this.feedItemDetailsView.on('itemDetails:close', function(){
           _closeLightBox.call(this);
        }.bind(this));
        this.feedItemDetailsView.on('idea:delete', function(item){
           this.feedView.delete(item)
        }.bind(this));
    }

    function _setVolatileListeners() {
        this.feedView.on('idea:open', function(item){
            _createFeedItemDetails.call(this, item)
        }.bind(this));
    } 

    function _setListeners() {
        this.hamburgerSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));

        this.bodySurface.pipe(this._eventOutput);

        // this._eventInput.on('deleteTask', function(task) {
        //     this.model.get('tasks').remove(task);
        // }.bind(this));

        this.searchInput.on("keypress", function(e) {
            if (e.which == 13) {
                var callback = function() {
                    this.options.feed.data = Store.get("searchFeed");
                    this.options.feed.title = "Results"
                    this.refreshFeed();
                }.bind(this);
                var search = new Ideas.searchIdeas(this.searchInput.getValue(), callback); 
            }
        }.bind(this));

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
            _openLightBox.call(this, this.addItemView);
        }.bind(this));
        
        this.modalbacking.on('click', function() {
            if (modalClose){
                _closeLightBox.call(this);
            }
        }.bind(this));

        this.addItemView.on('newFeed:add', function(item){
            var Ideas           = require('entities/ideas');
            _closeLightBox.call(this);
            var newFeedData = Store.get("newFeed");
            newFeedData.unshift(item);
            
            Store.set("newFeed", newFeedData);
            var newIdea = new Ideas.Idea(item);
            newIdea.save({}, {
                success: function(resp) {
                    var Ideas = require('entities/ideas');
                    new Ideas.myIdeas();
                }
            });

            if (this.options.feed.name === 'newFeed') {
                this.options.feed.data = newFeedData;
                this.feedView.render = function(){ return null; }
                _createFeedView.call(this);
            }
        }.bind(this));

        this.addItemView.on('newFeed:close', function(){
           _closeLightBox.call(this);
        }.bind(this));


    }
    
    module.exports = PageView;
});

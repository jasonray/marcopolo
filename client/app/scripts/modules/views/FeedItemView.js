/*** FeedItemView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface  = require('famous/surfaces/ImageSurface');
    var EventHandler = require('famous/core/EventHandler');

    function FeedItemView() {
        View.apply(this, arguments);

        this.voteUpEvent = new EventHandler();
        this.voteDownEvent = new EventHandler();

        _createBackground.call(this);
        _createButtons.call(this);
        _createTitle.call(this);
        if (this.options.data.comments) {
            _createComments.call(this);
        }
        _setListeners.call(this);
    }

    FeedItemView.prototype = Object.create(View.prototype);
    FeedItemView.prototype.constructor = FeedItemView;

    FeedItemView.DEFAULT_OPTIONS = {
        height: 55,
        angle: 0,
        iconSize: 32,
        iconUrl: 'img/strip-icons/famous.png',
        title: 'Famo.us',
        primaryFontSize: 18,
        secondaryFontSize: 12
    };

    function _createBackground() {
        this.backgroundSurface = new Surface({
            size: [this.options.width, this.options.height],
            properties: {
                backgroundColor: '#e9e9e9'
            }
        });   

        this.add(this.backgroundSurface);
    }

    function _createButtons() {
        var buttonView = new View();
        this.voteUpSurface = new ImageSurface({
            size: [55, 55],
            content : './images/thumbs-up.png',
            properties: {
                // backgroundColor: '#4f4f4f',
                borderLeft: '5px solid white',
                zIndex: '5'
            }
        });
        this.voteDownSurface = new ImageSurface({
            size: [55, 55],
            content : './images/thumbs-down.png',
            properties: {
                // backgroundColor: '#fe9a9a',
                borderLeft: '5px solid white',
                zIndex: '5'
            }
        });
        var viewModifier = new StateModifier({
            origin: [1, 0],
            align : [0, 0]
        });
        var voteUpModifier = new StateModifier({
            origin: [1, 0],
            align : [0, 0]
        });
        var voteDownModifier = new StateModifier({
            transform: Transform.translate(-55, 0, 0)
        });
        buttonView.add(voteUpModifier).add(this.voteUpSurface);
        buttonView.add(voteDownModifier).add(this.voteDownSurface);
        this.add(viewModifier).add(buttonView);
    }

    function _createTitle() {
        var titleSurface = new Surface({
            size: [true, true],
            content: this.options.data.title,
            properties: {
                color: '#4f4f4f',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                fontSize: this.options.primaryFontSize + 'px',
                pointerEvents : 'none'
            }
        });

        var titleModifier = new StateModifier({
            transform: Transform.translate(15, 10, 0)
        });

        this.add(titleModifier).add(titleSurface);
    }
    function _createComments() {
        var commentSurface = new Surface({
            size: [true, true],
            content: 'Comments: '+this.options.data.comments,
            properties: {
                color: '#b2b2b2',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                fontSize: this.options.secondaryFontSize + 'px',
                pointerEvents : 'none'
            }
        });

        var commentModifier = new StateModifier({
            transform: Transform.translate(15, 30, 0)
        });

        this.add(commentModifier).add(commentSurface);
    }

    function _setListeners() {
        this.backgroundSurface.on("mouseover", function(){
            this.setProperties({
                backgroundColor: 'white'
            });
        });
        this.backgroundSurface.on("mouseout", function(){
            this.setProperties({
                backgroundColor: '#e9e9e9'
            });
        });

        this.voteUpSurface.on("mouseover", function(){
            this.setProperties({
                backgroundColor: 'white'
            });
        });
        this.voteUpSurface.on("mouseout", function(){
            this.setProperties({
                backgroundColor: null
            });
        });

        this.voteDownSurface.on("mouseover", function(){
            this.setProperties({
                backgroundColor: 'white'
            });
        });
        this.voteDownSurface.on("mouseout", function(){
            this.setProperties({
                backgroundColor: null
            });
        });

        this.voteUpSurface.on("click", function(){
            this._eventOutput.emit('idea:yes', this.options.data);
        }.bind(this));

        this.voteDownSurface.on("click", function(){
            this._eventOutput.emit('idea:no', this.options.data);
        }.bind(this));

        this.backgroundSurface.on("click", function(){
            this._eventOutput.emit('ides:open', this.options.data);
        }.bind(this));
    }

    module.exports = FeedItemView;
});

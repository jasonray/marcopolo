/*** FeedItemView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface  = require('famous/surfaces/ImageSurface');

    function FeedItemView() {
        View.apply(this, arguments);

        _createBackground.call(this);
       // _createIcon.call(this);
        _createTitle.call(this);
        _createComments.call(this);
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

    function _createIcon() {
        var iconSurface = new ImageSurface({
            size: [this.options.iconSize, this.options.iconSize],
            content : this.options.iconUrl,
            pointerEvents : 'none'
        });

        var iconModifier = new StateModifier({
            transform: Transform.translate(24, 2, 0)
        });

        this.add(iconModifier).add(iconSurface);
    }

    function _createTitle() {
        var titleSurface = new Surface({
            size: [true, true],
            content: this.options.title,
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
            content: 'Comments: '+this.options.comments,
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
    function _createActionButton() {
        var commentSurface = new Surface({
            size: [true, true],
            content: 'Comments: '+this.options.comments,
            properties: {
                color: '#ccc',
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
        this.backgroundSurface.on("click", function(){
            this._eventOutput.emit('menuToggle');
        }.bind(this));
    }

    module.exports = FeedItemView;
});

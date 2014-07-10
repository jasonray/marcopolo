/*** FeedView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var ScrollView    = require('famous/views/Scrollview');
    var ViewSequence = require('famous/core/viewSequence');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Timer         = require('famous/utilities/Timer');
    // var Transitionable   = require('famous/transitions/Transitionable');

    var FeedItemView     = require('modules/views/FeedItemView');

    function FeedView() {
        View.apply(this, arguments);

        _createFeedItemViews.call(this);
        _setListeners.call(this);
    }

    FeedView.prototype = Object.create(View.prototype);
    FeedView.prototype.constructor = FeedView;

    FeedView.DEFAULT_OPTIONS = {
        feedData: {},
        angle: 0,
        stripWidth: -320,
        stripHeight: 54,
        topOffset: 10,
        stripOffset: 58,
        staggerDelay: 38,
        // featureOffset: 280,
        transition: {
            duration: 400,
            curve: 'easeOut'
        }
    };

    function _createFeedItemViews() {
        this.stripModifiers = [];
        var yOffset = this.options.topOffset;
        var itemArray = [];
        var feedSequence = new ViewSequence(itemArray)
        var feedScroll = new ScrollView({
            paginated: 'false'
        });
        feedScroll.sequenceFrom(feedSequence);

        for (var i = 0; i < this.options.feedData.length; i++) {
            this.feedItemView = new FeedItemView({data: this.options.feedData[i], yOffset: yOffset});

            var stripModifier = new StateModifier({
                transform: Transform.translate(0, yOffset, 0)
            });

            this.stripModifiers.push(stripModifier);

            this.add(stripModifier).add(this.feedItemView);

            yOffset += this.options.stripOffset;

            this.feedItemView.on("idea:delete", function(item){
                this.delete(item)
            }.bind(this));

            this.feedItemView.on("idea:open", function(item){
                this._eventOutput.emit("idea:open", item);
            }.bind(this));

            itemArray.push(this.feedItemView);
        }
        
        // this.add(feedScroll);
        
        this.animateStrips();
    }

    FeedView.prototype.resetStrips = function() {
        for(var i = 0; i < this.stripModifiers.length; i++) {
            var initX = -this.options.stripWidth;
            var initY = this.options.topOffset
                + this.options.stripOffset * i
                + this.options.stripWidth * Math.tan(-this.options.angle);

            this.stripModifiers[i].setTransform(Transform.translate(initX, initY, 0));
        }
    };

    FeedView.prototype.restack = function(item, index) {
        for(var i = index; i < this.stripModifiers.length; i++) {
            var initY = this.options.topOffset
                + this.options.stripOffset * i;
            this.stripModifiers[i].setTransform(Transform.translate(0, initY - this.options.stripHeight, 0));
        }
    };

    FeedView.prototype.animateStrips = function() {
        this.resetStrips();

        var transition = this.options.transition;
        var delay = this.options.staggerDelay;
        var stripOffset = this.options.stripOffset;
        var topOffset = this.options.topOffset;

        for(var i = 0; i < this.stripModifiers.length; i++) {
            Timer.setTimeout(function(i) {
                var yOffset = topOffset + stripOffset * i;

                this.stripModifiers[i].setTransform(
                    Transform.translate( 0, yOffset, 0), transition);
            }.bind(this, i), i * delay);
        }
    };

    function _setListeners() {
    

    }

    FeedView.prototype.delete = function(item) {
        
        var index = this.options.feedData.indexOf(item.options.data);
        this.restack(item, index);
        if (index > -1) {
            this.stripModifiers.splice(index, 1);
            this.options.feedData.splice(index, 1);
        }
        item.render = function(){ return null; }
        
        // Timer.setTimeout(function(i) {
        //     item.stripModifier.setTransform(
        //         Transform.translate( offSet, 0, 0), transition);
        // }.bind(this), delay);
        
    };

    module.exports = FeedView;
});

/*** FeedView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/view');
    var ScrollView    = require('famous/views/Scrollview');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Timer         = require('famous/utilities/Timer');

    var FeedItemView     = require('modules/views/FeedItemView');

    function FeedView() {
        View.apply(this, arguments);

        _createFeedItemViews.call(this);
    }

    FeedView.prototype = Object.create(View.prototype);
    FeedView.prototype.constructor = FeedView;

    FeedView.DEFAULT_OPTIONS = {
        feedData: {},
        angle: 0,
        stripWidth: -320,
        stripHeight: 54,
        topOffset: 0,
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

        for (var i = 0; i < this.options.feedData.length; i++) {
            var feedItemView = new FeedItemView({
                title: this.options.feedData[i].title,
                comments: this.options.feedData[i].comments
            });

            var stripModifier = new StateModifier({
                transform: Transform.translate(0, yOffset, 0)
            });

            this.stripModifiers.push(stripModifier);
            this.add(stripModifier).add(feedItemView);

            this.animateStrips();

            yOffset += this.options.stripOffset;
        }
    }

    // function _createFeaturedView() {
    //     var featuredView = new FeaturedView({ angle: this.options.angle });

    //     this.featuredMod = new StateModifier({
    //         transform: Transform.translate(0, this.options.featureOffset, 0),
    //         opacity: 0
    //     });

    //     this.add(this.featuredMod).add(featuredView);
    //     this.animateStrips();
    // }

    FeedView.prototype.resetStrips = function() {
        for(var i = 0; i < this.stripModifiers.length; i++) {
            var initX = -this.options.stripWidth;
            var initY = this.options.topOffset
                + this.options.stripOffset * i
                + this.options.stripWidth * Math.tan(-this.options.angle);

            this.stripModifiers[i].setTransform(Transform.translate(initX, initY, 0));
        }

        // this.featuredMod.setOpacity(0);
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

        // Timer.setTimeout((function() {
        //     this.featuredMod.setOpacity(1, transition);
        // }).bind(this), transition.duration);
    };

    module.exports = FeedView;
});

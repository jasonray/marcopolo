/*** StripView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface  = require('famous/surfaces/ImageSurface');

    function StripView() {
        View.apply(this, arguments);

        _createBackground.call(this);
       // _createIcon.call(this);
        _createTitle.call(this);
        _setListeners.call(this);
    }

    StripView.prototype = Object.create(View.prototype);
    StripView.prototype.constructor = StripView;

    StripView.DEFAULT_OPTIONS = {
        width: 320,
        height: 55,
        angle: -0.2,
        iconSize: 32,
        iconUrl: 'img/strip-icons/famous.png',
        title: 'Famo.us',
        fontSize: 26,
    };

    function _createBackground() {
        this.backgroundSurface = new Surface({
            size: [this.options.width, this.options.height],
            properties: {
                backgroundColor: '#4f4f4f',
                boxShadow: '0 0 1px black'
            }
        });        

        var rotateModifier = new StateModifier({
            transform: Transform.rotateZ(this.options.angle)
        });

        var skewModifier = new StateModifier({
            transform: Transform.skew(0, 0, this.options.angle)
        });

        this.add(rotateModifier).add(skewModifier).add(this.backgroundSurface);
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
                color: 'white',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                fontSize: this.options.fontSize + 'px',
                textTransform: 'uppercase',
                pointerEvents : 'none'
            }
        });

        var titleModifier = new StateModifier({
            transform: Transform.thenMove(Transform.rotateZ(this.options.angle), [15, 7.5, 0])
        });

        this.add(titleModifier).add(titleSurface);
    }

    function _setListeners() {
        this.backgroundSurface.on("mouseover", function(){
            this.setProperties({
                backgroundColor: '#5e5e5e'
            });
        });
        this.backgroundSurface.on("mouseout", function(){
            this.setProperties({
                backgroundColor: '#4f4f4f'
            });
        });
        this.backgroundSurface.on("click", function(){
            this._eventOutput.emit('menuToggle');
        }.bind(this));
    }

    module.exports = StripView;
});

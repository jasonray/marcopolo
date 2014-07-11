/*** FeedItemView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface  = require('famous/surfaces/ImageSurface');
    var EventHandler  = require('famous/core/EventHandler');
    var Transitionable   = require('famous/transitions/Transitionable');

    var User           = require('entities/user');
    var Ideas          = require('entities/ideas');
    var env            = "";

    // dev
    env = 'http://demos.agilex.com:9998'

    function FeedItemView() {
        View.apply(this, arguments);

        this.voteUpEvent = new EventHandler();
        this.voteDownEvent = new EventHandler();

        // this.transform = new Transitionable([0, 0, 0]);
        // this.size = new Transitionable(100);

        _createBackground.call(this);
        _createButtons.call(this);
        _createContent.call(this);
        _setListeners.call(this);
        
        this.setContent();
    }

    FeedItemView.prototype = Object.create(View.prototype);
    FeedItemView.prototype.constructor = FeedItemView;

    FeedItemView.DEFAULT_OPTIONS = {
        height: 55,
        angle: 0,
        iconSize: 32,
        iconUrl: 'img/strip-icons/famous.png',
        title: 'Famo.us',
        primaryFontSize: 14,
        secondaryFontSize: 10,
        stripOffset: 58,
        staggerDelay: 38,
        transition: {
            duration: 400,
            curve: 'easeOut'
        }
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
                backgroundColor: '#e9e9e9',
                // borderLeft: '5px solid white',
                zIndex: '5',
                // opacity: '.2'
            }
        });
        this.voteDownSurface = new ImageSurface({
            size: [55, 55],
            content : './images/thumbs-down.png',
            properties: {
                backgroundColor: '#e9e9e9',
                // borderLeft: '5px solid white',
                zIndex: '5'
            }
        });
        this.buttonBgSurface = new Surface({
            size: [120, 55],
            properties: {
                backgroundColor: 'white',
                border: 'none',
                zIndex: '4'
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
        var bgModifier = new StateModifier({
            origin: [1, 0],
            align : [0, 0]
        });
        var voteDownModifier = new StateModifier({
            transform: Transform.translate(-60, 0, 0)
        });
        
        _buttonStateHighlight.call(this);

        buttonView.add(bgModifier).add(this.buttonBgSurface);
        buttonView.add(voteUpModifier).add(this.voteUpSurface);
        buttonView.add(voteDownModifier).add(this.voteDownSurface);
        this.add(viewModifier).add(buttonView);
    }

    function _createContent() {
        this.contentSurface = new Surface({
            size: [true, true],
            classes: ["feedItem"],
            properties: {
                color: '#4f4f4f',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                fontSize: this.options.primaryFontSize + 'px',
                pointerEvents : 'none',
                zIndex: '3000'
            }
        });

        var titleModifier = new StateModifier({
            transform: Transform.translate(15, 10, 0)
        });

        this.add(titleModifier).add(this.contentSurface);
    }
    function _buttonStateHighlight() {
        if (typeof this.options.data.vote !== 'undefined' && this.options.data.vote) {
            this.buttonBgSurface.setProperties({
                backgroundColor: '#e9e9e9'
            });
            if (this.options.data.vote === 'no') {
                this.voteUpSurface.setProperties({
                    opacity: '.2'
                });
                this.voteDownSurface.setProperties({
                    backgroundColor: 'white'
                });
            }
            else {
                this.voteDownSurface.setProperties({
                    opacity: '.2'
                });
                this.voteUpSurface.setProperties({
                    backgroundColor: 'white'
                });
            }
        }
    } 

    function _voteChange() {
        if (this.options.feedName === 'newFeed') {
            this._eventOutput.emit("idea:delete", this);
        } else if(this.options.data.vote === 'no') {
            this.options.data.vote = 'yes';
            this.voteUpSurface.setProperties({
                backgroundColor: 'white'
            });
            this.voteDownSurface.setProperties({
                backgroundColor: '#e9e9e9'
            });
            _buttonStateHighlight.call(this);
        } else if(this.options.data.vote === 'yes') {
            this.options.data.vote = 'no';
            this.voteDownSurface.setProperties({
                backgroundColor: 'white'
            });
            this.voteUpSurface.setProperties({
                backgroundColor: '#e9e9e9'
            });
            _buttonStateHighlight.call(this);
        }
    }
    
    function _setListeners() {
        this.backgroundSurface.on("mouseover", function(){
            this.backgroundSurface.setProperties({
                backgroundColor: 'white'
            });
            this.buttonBgSurface.setProperties({
                backgroundColor: 'white'
            });
            this.voteDownSurface.setProperties({
                backgroundColor: 'white'
            });
            this.voteUpSurface.setProperties({
                backgroundColor: 'white'
            });
        }.bind(this));
        this.backgroundSurface.on("mouseout", function(){
            this.backgroundSurface.setProperties({
                backgroundColor: '#e9e9e9'
            });
            this.buttonBgSurface.setProperties({
                backgroundColor: 'white'
            });
            this.voteDownSurface.setProperties({
                backgroundColor: '#e9e9e9'
            });
            this.voteUpSurface.setProperties({
                backgroundColor: '#e9e9e9'
            });
            _buttonStateHighlight.call(this);
            
        }.bind(this));

        this.backgroundSurface.on("click", function(){
           this._eventOutput.emit("idea:open", this.options.data);
        }.bind(this));

        this.voteUpSurface.on("mouseover", function(){
            this.setProperties({
                backgroundColor: 'white',
                opacity: '1'
            });
        });
        this.voteUpSurface.on("mouseout", function(){
            this.voteUpSurface.setProperties({
                backgroundColor: '#e9e9e9'
            });
            _buttonStateHighlight.call(this);
        }.bind(this));

        this.voteDownSurface.on("mouseover", function(){
            this.setProperties({
                backgroundColor: 'white',
                opacity: '1'
            });
        });
        this.voteDownSurface.on("mouseout", function(){
            this.voteDownSurface.setProperties({
                backgroundColor: '#e9e9e9'
            });
            _buttonStateHighlight.call(this);
        }.bind(this));

        this.voteDownSurface.on("click", function(){
            var id = this.options.data.id;
            var tempIdea = new Ideas.Idea(this.options.data);
            tempIdea.unset('id');
            tempIdea.save({},{
                success: function(resp) {
                   new Ideas.pastIdeas();
                },
                url: env+'/ideas/id/'+id+'/operations/voteNo?user='+User.instance().get('username')
            });
            _voteChange.call(this);
            
        }.bind(this));
        this.voteUpSurface.on("click", function(){
            var id = this.options.data.id;
            var tempIdea = new Ideas.Idea(this.options.data);
            tempIdea.unset('id');
            tempIdea.save({},{
                success: function(resp) {
                   new Ideas.pastIdeas();
                },
                url: env+'/ideas/id/'+id+'/operations/voteYes?user='+User.instance().get('username')
            });
            _voteChange.call(this);
        }.bind(this));
    };

    FeedItemView.prototype.setContent = function() {
        this.contentSurface.setContent(template.call(this));
    };
    var template = function() {
        var title = this.options.data.short_description;
        return "<h3>" + title + "</h3>";
        // "<div class='checkbox'>&#xf10c;</div>"
    };

    module.exports = FeedItemView;
});

/*** AddItemView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var InputSurface  = require('famous/surfaces/InputSurface');
    var TextareaSurface  = require('famous/surfaces/TextareaSurface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var SequentialLayout = require("famous/views/SequentialLayout");
    var ImageSurface  = require('famous/surfaces/ImageSurface');
    var Lightbox      = require('famous/views/Lightbox');
    var Easing        = require('famous/transitions/Easing');

    var User           = require('entities/user');
    var Ideas          = require('entities/ideas');
    var env      = '';

    //dev
    env = 'http://demos.agilex.com:9998'
    

    function FeedItemDetailsView() {
        View.apply(this, arguments);
        this.rootModifier = new StateModifier({
            size: this.options.size,
            origin: [0.5, 0],
            align: [0.5, 0]
        });

        this.mainNode = this.add(this.rootModifier);
        
        
        _createLayout.call(this);
        // _createInputs.call(this);
        _createBackground.call(this);
        _createButtons.call(this);
        _createMetaData.call(this);
        _setListeners.call(this);
        
    }

    FeedItemDetailsView.prototype = Object.create(View.prototype);
    FeedItemDetailsView.prototype.constructor = FeedItemDetailsView;

    FeedItemDetailsView.DEFAULT_OPTIONS = {
        size: [320, 500],
        primaryFontSize: 18,
        zIndex: 500,
        inputs: {
            fontSize: 12,
            size: [260, 30]
        },
        secondaryFontSize: 14,
    };

    function _createLayout() {
        var sequentialLayout = new SequentialLayout();
    
        var layoutModifier = new StateModifier({
            transform: Transform.translate(0, 0, this.options.zIndex)
        });
        this.details = [];
        sequentialLayout.sequenceFrom(this.details);

        this.add(layoutModifier).add(sequentialLayout);
    }

    function _createBackground() {
        this.backgroundSurface = new Surface({
            size : this.options.size,
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#3f3f3f',
                fontSize: this.options.primaryFontSize + 'px',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                pointerEvents : 'none'
            }
        });   
        var formModifier = new StateModifier({
            transform: Transform.translate(0, 0, this.options.zIndex)
        });

        this.add(formModifier).add(this.backgroundSurface);
    }
    function _createButtons() {
        this.buttonView = new View();
        this.buttonBgSurface = new Surface({
            size: [120, 55],
            properties: {
                backgroundColor: 'white',
                border: 'none',
                zIndex: '4'
            }
        });
        this.voteUpSurface = new ImageSurface({
            size: [55, 55],
            content : './images/thumbs-up.png',
            properties: {
                // backgroundColor: '#4f4f4f',
                // borderLeft: '5px solid white',
                zIndex: this.options.zIndex
            }
        });
        this.voteDownSurface = new ImageSurface({
            size: [55, 55],
            content : './images/thumbs-down.png',
            properties: {
                // backgroundColor: '#fe9a9a',
                // borderLeft: '5px solid white',
               zIndex: this.options.zIndex
            }
        });
        this.inappropriateSurface = new ImageSurface({
            size: [55, 55],
            content : './images/inapp.png',
            properties: {
                // backgroundColor: '#fe9a9a',
                // borderLeft: '5px solid white',
               zIndex: this.options.zIndex
            }
        });
        this.ignoreSurface = new ImageSurface({
            size: [55, 55],
            content : './images/Ignore_icon.png',
            properties: {
                // backgroundColor: '#fe9a9a',
                // borderLeft: '5px solid white',
               zIndex: this.options.zIndex
            }
        });
        var inappropriateModifier = new StateModifier({
            transform: Transform.translate(225, -25, 0)
        });

        var ignoreModifier = new StateModifier({
            transform: Transform.translate(225, -80, 0)
        });
        var voteDownModifier = new StateModifier({
            transform: Transform.translate(225, -135, 0)
        });
        var voteUpModifier = new StateModifier({
            transform: Transform.translate(225, -190, 0)
        });
        var bgModifier = new StateModifier({
            origin: [1, 0],
            align : [0, 0]
        });
       // this.buttonView.add(bgModifier).add(this.buttonBgSurface);
        this.buttonView.add(voteDownModifier).add(this.voteDownSurface);
        this.buttonView.add(voteUpModifier).add(this.voteUpSurface);
        this.buttonView.add(ignoreModifier).add(this.ignoreSurface);
        this.buttonView.add(inappropriateModifier).add(this.inappropriateSurface);
        
    }
    function _createMetaData() {
        var footerView = new View();
        var oneView = new View();
        var twoView = new View();
        
        this.ideaSummary = new Surface({
            size: [this.options.inputs.size[0] - 60, undefined],
            content : this.options.short_description,
            properties: {
                color: 'white',
                textAlign: 'left',
                fontSize: this.options.primaryFontSize + 'px',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                pointerEvents : 'none',
                zIndex: this.options.zIndex
            }
        });
        this.ideaDescription = new Surface({
            size: [this.options.inputs.size[0], undefined],
            content : this.options.description,
            properties: {
                color: 'white',
                textAlign: 'left',
                fontSize: this.options.secondaryFontSize + 'px',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                pointerEvents : 'none',
                zIndex: this.options.zIndex
            }
        });
        
        this.cancelSurface = new Surface({
            size: [120, 50],
            content: 'Close',
            properties: {
                zIndex: this.options.zIndex,
                lineHeight: '30px',
                verticalAlign: 'middle',
                border: 'none',
                backgroundColor: '#5e5e5e',
                color: 'white',
                textAlign: 'center',
                borderRadius: '5px',
                padding: '10px',
                textDecoration: 'none', 
                fontFamily: 'AvenirNextCondensed-DemiBold',
                fontSize: this.options.secondarySize + 'px',

            }
        }); 
        var summaryModifier = new StateModifier({
            transform: Transform.translate(0,-180,0)
        });
        var descriptionModifier = new StateModifier({
            transform: Transform.translate(0,0,0)
        });
        var submitModifier = new StateModifier({
            transform: Transform.translate(140,300,0)
        });
        var cancelModifier = new StateModifier({
            transform: Transform.translate(140,180,0)
        });
        oneView.add(summaryModifier).add(this.ideaSummary);
        twoView.add(descriptionModifier).add(this.ideaDescription);
        footerView.add(cancelModifier).add(this.cancelSurface);
        
        this.details.push(oneView);
        this.details.push(twoView);
        this.details.push(this.buttonView); 
        this.details.push(footerView); 
    }

    function _setListeners() {
        this.voteDownSurface.on("mouseover", function(){
            this.ignoreSurface.setProperties({
                backgroundColor: null
            });
            this.voteDownSurface.setProperties({
                backgroundColor: 'white'
            });
            this.voteUpSurface.setProperties({
                backgroundColor: null
            });
            this.inappropriateSurface.setProperties({
                backgroundColor: null
            });
        }.bind(this));
        this.voteDownSurface.on("mouseout", function(){
            this.ignoreSurface.setProperties({
                backgroundColor: null
            });
            this.voteDownSurface.setProperties({
                backgroundColor: null
            });
            this.voteUpSurface.setProperties({
                backgroundColor: null
            });
            this.inappropriateSurface.setProperties({
                backgroundColor: null
            });
        }.bind(this));
        this.voteUpSurface.on("mouseover", function(){
            this.ignoreSurface.setProperties({
                backgroundColor: null
            });
            this.voteDownSurface.setProperties({
                backgroundColor: null
            });
            this.voteUpSurface.setProperties({
                backgroundColor: 'white'
            });
            this.inappropriateSurface.setProperties({
                backgroundColor: null
            });
        }.bind(this));
        this.voteUpSurface.on("mouseout", function(){
            this.ignoreSurface.setProperties({
                backgroundColor: null
            });
            this.voteDownSurface.setProperties({
                backgroundColor: null
            });
            this.voteUpSurface.setProperties({
                backgroundColor: null
            });
            this.inappropriateSurface.setProperties({
                backgroundColor: null
            });
        }.bind(this));
        this.ignoreSurface.on("mouseover", function(){
            this.ignoreSurface.setProperties({
                backgroundColor: 'white'
            });
            this.voteDownSurface.setProperties({
                backgroundColor: null
            });
            this.voteUpSurface.setProperties({
                backgroundColor: null
            });
            this.inappropriateSurface.setProperties({
                backgroundColor: null
            });
        }.bind(this));
        this.ignoreSurface.on("mouseout", function(){
            this.ignoreSurface.setProperties({
                backgroundColor: null
            });
            this.voteDownSurface.setProperties({
                backgroundColor: null
            });
            this.voteUpSurface.setProperties({
                backgroundColor: null
            });
            this.inappropriateSurface.setProperties({
                backgroundColor: null
            });
        }.bind(this));
        this.inappropriateSurface.on("mouseover", function(){
            this.ignoreSurface.setProperties({
                backgroundColor: null
            });
            this.voteDownSurface.setProperties({
                backgroundColor: null
            });
            this.voteUpSurface.setProperties({
                backgroundColor: null
            });
            this.inappropriateSurface.setProperties({
                backgroundColor: 'white'
            });
        }.bind(this));
        this.inappropriateSurface.on("mouseout", function(){
            this.ignoreSurface.setProperties({
                backgroundColor: null
            });
            this.voteDownSurface.setProperties({
                backgroundColor: null
            });
            this.voteUpSurface.setProperties({
                backgroundColor: null
            });
            this.inappropriateSurface.setProperties({
                backgroundColor: null
            });
        }.bind(this));
        this.cancelSurface.on("mouseover", function(){
            this.cancelSurface.setProperties({
                backgroundColor: '#00a9a6',
                cursor: 'ponter'
            });
        }.bind(this));
        this.cancelSurface.on("mouseout", function(){
            this.cancelSurface.setProperties({
                backgroundColor: '#5e5e5e',
            });
        }.bind(this));

        this.cancelSurface.on("click", function(){
            this._eventOutput.emit('itemDetails:close');
        }.bind(this));

        this.voteDownSurface.on("click", function(){
            var id = this.options.id;
            var tempIdea = new Ideas.Idea(this.options);
            tempIdea.unset('id');
            tempIdea.save({},{
                success: function(resp) {
                   new Ideas.pastIdeas();
                },
                url: env+'/ideas/id/'+id+'/operations/voteNo?user='+User.instance().get('username')
            });
            this._eventOutput.emit('itemDetails:close');
        }.bind(this));

        this.voteDownSurface.on("click", function(){
            var id = this.options.id;
            var tempIdea = new Ideas.Idea(this.options);
            tempIdea.unset('id');
            tempIdea.save({},{
                success: function(resp) {
                   new Ideas.pastIdeas();
                },
                url: env+'/ideas/id/'+id+'/operations/voteNo?user='+User.instance().get('username')
            });
            this._eventOutput.emit('itemDetails:close');
        }.bind(this));

        this.inappropriateSurface.on("click", function(){
            var id = this.options.id;
            var tempIdea = new Ideas.Idea(this.options);
            tempIdea.unset('id');
            tempIdea.save({},{
                success: function(resp) {},  
                url: env+'/ideas/id/'+id+'/operations/suspend?user='+User.instance().get('username')
            });
            this._eventOutput.emit('itemDetails:close');
        }.bind(this));
        this.ignoreSurface.on("click", function(){
            var id = this.options.id;
            var tempIdea = new Ideas.Idea(this.options);
            tempIdea.unset('id');
            tempIdea.save({},{
                success: function(resp) {}, 
                url: env+'/ideas/id/'+id+'/operations/ignore?user='+User.instance().get('username')
            });
            this._eventOutput.emit("idea:delete", this);
            this._eventOutput.emit('itemDetails:close');
        }.bind(this));
    }
    FeedItemDetailsView.prototype.setContent = function() {
        this.contentSurface.setContent(template.call(this));
    };
    var template = function() {
        return '<form class="form-horizontal"> \
            <fieldset> \
                <!-- Form Name --> \
                <legend>New Idea!</legend> \
                <!-- Text input--> \
                <div class="form-group"> \
                    <label class="col-md-4 control-label" for="short_description">Summary</label> \
                    <div class="col-md-5"> \
                        <input id="short_description" name="short_description" type="text" placeholder="Type idea here" class="form-control input-md" required=""> \
                        <span class="help-block">Keep it succint!</span> \
                    </div> \
                </div> \
                <!-- Textarea --> \
                <div class="form-group"> \
                    <label class="col-md-4 control-label" for="long_description">Description</label> \
                    <div class="col-md-4"> \
                        <textarea class="form-control" id="long_description" name="description"></textarea> \
                    </div> \
                </div> \
                <!-- Select Basic --> \
                <div class="form-group"> \
                  <label class="col-md-4 control-label" for="ideaDuration">Duration</label> \
                  <div class="col-md-5"> \
                    <select id="ideaDuration" name="ideaDuration" class="form-control"> \
                      <option value="1209600000">Month</option> \
                      <option value="302400000">Week</option> \
                      <option value="43200000">Day</option> \
                      <option value="3600000">Hour</option> \
                    </select> \
                  </div> \
                </div> \
                <!-- Button (Double) --> \
                <div class="form-group"> \
                  <label class="col-md-4 control-label" for="newIdeaCancel"></label> \
                  <div class="col-md-8"> \
                    <button id="newIdeaCancel" name="newIdeaCancel" class="btn btn-default">Cancel</button> \
                    <button id="newIdeaSubmit" name="newIdeaSubmit" class="btn btn-primary">Submit</button> \
                  </div> \
                </div> \
            </fieldset> \
        </form>';        
    };


    module.exports = FeedItemDetailsView;
});

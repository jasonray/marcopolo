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
    

    function AddItemView() {
        View.apply(this, arguments);
        this.rootModifier = new StateModifier({
            size: this.options.size,
            origin: [0.5, 0],
            align: [0.5, 0]
        });

        this.mainNode = this.add(this.rootModifier);
        
        _createBackground.call(this);
        _createContent.call(this);
        // _createTitle.call(this);
        // _createComments.call(this);
        _setListeners.call(this);

        this.setContent();
        
    }

    AddItemView.prototype = Object.create(View.prototype);
    AddItemView.prototype.constructor = AddItemView;

    AddItemView.DEFAULT_OPTIONS = {
        size: [450, 500],
        title: 'New Idea',
        primaryFontSize: 18,
        zIndex: 500,
        inputs: {
            fontSize: 12,
            size: [260, 30]
        },
        secondaryFontSize: 14
    };

    function _createLayout() {
        var sequentialLayout = new SequentialLayout();
    
        var layoutModifier = new StateModifier({
            transform: Transform.translate(0, 0, this.options.zIndex)
        });
        this.inputs = [];
        sequentialLayout.sequenceFrom(this.inputs);

        this.add(layoutModifier).add(sequentialLayout);
    }

    function _createBackground() {
        this.backgroundSurface = new Surface({
            size : [320, 500],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#3f3f3f',
                fontSize: 'primaryFontSize'
            }
        });   
        var formModifier = new StateModifier({
            transform: Transform.translate(0, 0, this.options.zIndex)
        });

        this.add(formModifier).add(this.backgroundSurface);
    }

    function _createContent() {
        this.contentSurface = new Surface({
            size: [true, true],
            properties: {
                color: '#4f4f4f',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                fontSize: this.options.primaryFontSize + 'px',
                zIndex : this.options.zIndex
            }
        });

        var titleModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0)
        });

        this.add(titleModifier).add(this.contentSurface);
    }

    function _setListeners() {
        // this.submitSurface.on("click", function(){
        //     this.newIdea = {comments:''};
        //     this.newIdea.short_description = this.summaryInput.getValue();
        //     this.newIdea.long_description = this.descriptionInput.getValue();
        //     this._eventOutput.emit('newFeed:add', this.newIdea);
        //     this.descriptionInput.setValue('');
        // }.bind(this));
        // this.cancelSurface.on("click", function(){
        //     this._eventOutput.emit('newFeed:close');
        // }.bind(this));
    }
    AddItemView.prototype.setContent = function() {
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
                        <textarea class="form-control" id="long_description" name="long_description"></textarea> \
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

    module.exports = AddItemView;
});

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
        
        
        _createLayout.call(this);
        _createInputs.call(this);
        _createBackground.call(this);
        // _createTitle.call(this);
        // _createComments.call(this);
        _setListeners.call(this);
        
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
            content : this.options.title,
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
    function _createInputs() {
        var buttonView = new View();
        var oneView = new View();
        var twoView = new View();
        this.summaryInput = new InputSurface({
            size: this.options.inputs.size,
            name: 'input-summary',
            placeholder: 'Type idea here',
            value: '',
            type: 'text',
            properties: {
                zIndex: this.options.zIndex
            }
        });
        this.descriptionInput = new TextareaSurface({
            size: [this.options.inputs.size[0], 200],
            name: 'input-description',
            placeholder: 'Type description',
            value: '',
            type: 'textarea',
            properties: {
                zIndex: this.options.zIndex
            }
        });
        
        this.submitSurface = new Surface({
            size: [120, 50],
            content: 'Submit',
            properties: {
                zIndex: this.options.zIndex,
                lineHeight: '30px',
                verticalAlign: 'middle',
                border: 'none',
                backgroundColor: '#00a9a6',
                color: 'white',
                textAlign: 'center',
                borderRadius: '5px',
                padding: '10px',
                textDecoration: 'none'
              //  pointerEvents : 'none'

            }
        }); 
        this.cancelSurface = new Surface({
            size: [120, 50],
            content: 'Cancel',
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
                textDecoration: 'none'
            }
        }); 
        var submitModifier = new StateModifier({
            transform: Transform.translate(140,20,0)
        });
        var cancelModifier = new StateModifier({
            transform: Transform.translate(0,20,0)
        });
        oneView.add(this.summaryInput);
        twoView.add(this.descriptionInput);
        buttonView.add(submitModifier).add(this.submitSurface);
        buttonView.add(cancelModifier).add(this.cancelSurface);
        this.inputs.push(oneView);
        this.inputs.push(twoView);
        this.inputs.push(buttonView); 
    }

    function _setListeners() {
        this.submitSurface.on("click", function(){
            this.newIdea = {comments:''};
            this.newIdea.short_description = this.summaryInput.getValue();
            this.newIdea.long_description = this.descriptionInput.getValue();
            this._eventOutput.emit('newFeed:add', this.newIdea);
            this.descriptionInput.setValue('');
        }.bind(this));
        this.cancelSurface.on("click", function(){
            this._eventOutput.emit('newFeed:close');
        }.bind(this));
    }

    module.exports = AddItemView;
});

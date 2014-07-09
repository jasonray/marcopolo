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

    var User          = require('entities/user')
    
    console.log(User);
    function LoginView() {
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

    LoginView.prototype = Object.create(View.prototype);
    LoginView.prototype.constructor = LoginView;

    LoginView.DEFAULT_OPTIONS = {
        size: [320, 200],
        title: 'Login',
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
            size : this.options.size,
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
        this.usernameInput = new InputSurface({
            size: this.options.inputs.size,
            name: 'input-username',
            placeholder: 'Username',
            value: '',
            type: 'text',
            properties: {
                zIndex: this.options.zIndex
            }
        });
        this.passwordInput = new InputSurface({
            size: this.options.inputs.size,
            name: 'input-password',
            placeholder: 'Password',
            value: '',
            type: 'password',
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
        
        var submitModifier = new StateModifier({
            transform: Transform.translate(140,20,0)
        });
        
        oneView.add(this.usernameInput);
        twoView.add(this.passwordInput);
        buttonView.add(submitModifier).add(this.submitSurface);
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
    }

    module.exports = LoginView;
});

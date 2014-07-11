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
    var env            = "";

    //dev
    env = 'http://demos.agilex.com:9998'
    
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
        size: [320, 197.77],
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
                fontSize: this.options.primaryFontSize + 'px',
                textAlign: 'left',
                padding: '14px 0 0 30px',
            }
        });   
        var formModifier = new StateModifier({
            transform: Transform.translate(0, 0, this.options.zIndex)
        });

        this.add(formModifier).add(this.backgroundSurface);
    }
    function _createInputs() {
        this.buttonView = new View();
        var oneView = new View();
        var twoView = new View();
        this.usernameInput = new InputSurface({
            size: this.options.inputs.size,
            name: 'auth-username',
            placeholder: 'Username',
            value: '',
            type: 'text',
            properties: {
                zIndex: this.options.zIndex
            }
        });
        this.passwordInput = new InputSurface({
            size: this.options.inputs.size,
            name: 'auth-password',
            placeholder: 'Password',
            value: '',
            type: 'password',
            properties: {
                zIndex: this.options.zIndex
            }
        });
        this.errorSurface = new Surface({
            size: this.options.inputs.size,
            content: 'Try Again!',
            properties: {
                zIndex: this.options.zIndex+1,
                color: 'white',
                paddingTop: '15px'
            }
        });
        
        this.submitSurface = new Surface({
            size: [71.19, 44],
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
                padding: '8px',
                textDecoration: 'none'
              //  pointerEvents : 'none'

            }
        }); 
        
        var submitModifier = new StateModifier({
            transform: Transform.translate(188,20,0)
        });
        
        oneView.add(this.usernameInput);
        twoView.add(this.passwordInput);
        this.buttonView.add(submitModifier).add(this.submitSurface);
        this.inputs.push(oneView);
        this.inputs.push(twoView);
        this.inputs.push(this.buttonView); 
    }

    function _setListeners() {
        this.submitSurface.on("click", function() {
            var auth = {};
            var that = this;
            auth.username = this.usernameInput.getValue();
            auth.password = this.passwordInput.getValue();
            User.instance().save({},{
                success: function(resp){
                    resp.submit();
                    that._eventOutput.emit('login:close');
                },
                error: function(){
                    that.buttonView.add(that.errorSurface);
                    that.usernameInput.focus();
                    that.passwordInput.setValue('');
                },
                url: env + '/login?user='+auth.username+'&pw='+auth.password
            });
        }.bind(this));
    }

    module.exports = LoginView;
});

define(function(require, exports, module) {
    var Backbone = require("backbone");
    var env      = '';
    
    var model = Backbone.Model.extend({
        defaults: {
            
        },
        submit: function() {
            
        },
        get: function() {
            return window.sessionStorage['auth'];

        }

    })
    var User = (function() {
        var singleInstance;

        function init() {
            return new Model();
        }

        return {
            instance: function() {
                if (!singleInstance) {
                    singleInstance = init();
                }
                return singleInstance;
            }
        };
    })();
    module.exports = User;
});
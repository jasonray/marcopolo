define(function(require, exports, module) {
    var Backbone = require("backbone");
    var env      = '';
    
    var Model = Backbone.Model.extend({
        defaults: {
            
        },
        initialize: function() {
            this.get();
        },
        submit: function() {
            
        },
        get: function() {
            var auth = window.sessionStorage['auth'];
            return auth;
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
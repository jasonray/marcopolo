define(function(require, exports, module) {
    var Backbone = require("backbone");
    var env      = '';
    
    var Model = Backbone.Model.extend({
        defaults: {
            
        },
        initialize: function() {
            _.bindAll(this, 'submit', 'get', 'auth');
        },
        parse: function(resp) {
            var user = {};
            user.token = resp.returnParam;
            user.username = resp.returnParam1;
            user.firstname = resp.returnParam2;
            user.lastname = resp.returnParam3;
            user.email = resp.returnParam4;
            return user;
        },
        submit: function() {
            window.sessionStorage["auth"] = JSON.stringify(this);
        },
        get: function() {
            var auth = window.sessionStorage.getItem('auth');
            return auth && JSON.parse(auth);
        },
        auth: function() {
            var user = this.get();
            if (user) {
                this.set(user);
            }
            return user;
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
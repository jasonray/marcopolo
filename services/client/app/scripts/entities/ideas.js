define(function(require, exports, module) {
    var Backbone = require("backbone");
    var Store    = require("store");
    var uuid     = require("uuid");
    var User     = require('entities/user');
    var env      = '';

    //dev
    env = 'http://demos.agilex.com:9998'

    this.Idea = Backbone.Model.extend({
        initialize: function() {
            this.url = env + '/ideas'+ '?user='+User.instance().get('username');
        },
        defaults: {
            "comment_count": 0,
            "created": new Date(),
            "guiID": uuid.v1(),
            "description": "long description A",
            "short_description": "ideaA"
        },
        generateId: function() {
            return new Date().getTime();
        }
    })

    this.newIdeas = Backbone.Collection.extend({
        model: this.Idea,
        initialize: function() {
            this.fetch({
                url: env + '/ideas/new'+ '?user='+User.instance().get('username'),
                success: function(data){
                    Store.set("newFeed", data);
                }
            })
        },
        parse: function(data) {
            // console.log(data);
            return data;
        }
    });

    this.trackedIdeas = Backbone.Collection.extend({
        model: this.Idea,
        initialize: function() {
            this.fetch({
                url: env +'/ideas/tracked'+ '?user='+User.instance().get('username'),
                success: function(data){
                    Store.set("trackedFeed", data);
                }
            })
        },
        parse: function(data) {
            console.log(data);
            return data;
        }
    });
    this.myIdeas = Backbone.Collection.extend({
        model: this.Idea,
        initialize: function() {
            this.fetch({
                url: env +'/ideas/mine'+ '?user='+User.instance().get('username'),
                success: function(data){
                    Store.set("myFeed", data);
                }
            })
        },
        parse: function(data) {
            console.log(data);
            return data;
        }
    });
    this.pastIdeas = Backbone.Collection.extend({
        model: this.Idea,
        initialize: function() {
            this.fetch({
                url: env + '/ideas/past'+ '?user='+User.instance().get('username'),
                success: function(data){
                    Store.set("pastFeed", data);
                }
            })
        },
        parse: function(data) {
            console.log(data);
            return data;
        }
    });
    this.searchIdeas = Backbone.Collection.extend({
        model: this.Idea,
        initialize: function(value, callback) {
            var search = encodeURIComponent(value);
            this.fetch({
                url: env + '/ideas/search'+ '?user='+User.instance().get('username')+'&search='+search,
                success: function(data){
                    Store.set("searchFeed", data);
                    callback.call(this);
                }
            })
        },
        parse: function(data) {
            console.log(data);
            return data;
        }
    });

    module.exports = this;
});
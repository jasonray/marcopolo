define(function(require, exports, module) {
    var Backbone = require("backbone");
    var Store    = require("store");
    var uuid     = require("uuid");
    var user     = '?user=cushingb';
    var env      = '';

    //dev
    env = 'http://demos.agilex.com:9998'

    this.Idea = Backbone.Model.extend({
        defaults: {
            "comment_count": 0,
            "created": new Date(),
            "guiID": uuid.v1(),
            "long_description": "long description A",
            "short_description": "ideaA"
        },
        url: '/ideas/',
        generateId: function() {
            return new Date().getTime();
        }
    })

    this.newIdeas = Backbone.Collection.extend({
        model: this.Idea,
        initialize: function() {
            this.fetch({
                url: env + '/ideas/new'+ user,
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
                url: env +'/ideas/tracked'+ user,
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
                url: env +'/ideas/mine'+ user,
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
                url: env + '/ideas/past'+ user,
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

    module.exports = this;
});
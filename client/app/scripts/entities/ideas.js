define(function(require, exports, module) {
    var Backbone = require("backbone");
    var Store    = require("store");
    var uuid     = require("uuid");

    this.Idea = Backbone.Model.extend({
        defaults: {
            "comment_count": 0,
            "created": new Date(),
            "guiID": uuid.v1(),
            "long_description": "long description A",
            "short_description": "ideaA"
        },
        url: 'http://localhost:9999/ideas/',
        generateId: function() {
            return new Date().getTime();
        }
    })

    this.newIdeas = Backbone.Collection.extend({
        model: this.Idea,
        initialize: function() {
            this.fetch({
                url: 'http://localhost:9999/ideas/',
                success: function(data){
                    Store.set("newFeed", data);
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
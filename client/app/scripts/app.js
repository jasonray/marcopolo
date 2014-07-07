define(function(require, exports, module) {
    var Marionette = require("marionette"),
        Backbone = require("backbone"),
        Engine = require("famous/core/Engine"),
        AppView = require('modules/views/AppView'),
        Ideas = require('entities/ideas'),
        Store = require("store");
        bootstrapData = require('modules/data/NewFeedData');
        require('famous/inputs/FastClick');

    var iRate = new Marionette.Application();
    //Bootstrap data //Delete 
        if (Modernizr.localstorage && !window.localStorage['newFeed']) {
            window.localStorage["newFeed"] = JSON.stringify(bootstrapData);
        } 

    iRate.navigate = function(route,  options){
      options || (options = {});
      Backbone.history.navigate(route, options);
    };

    // iRate.getCurrentRoute = function(){
    //   return Backbone.history.fragment
    // };
    iRate.on("initialize:before", function(){

        if (!Store.enabled) {
            alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
            return
        }

        var test = new Ideas.newIdeas();

        function onStorageEvent(e){
                alert(e);
            }

            window.addEventListener('storage', onStorageEvent, true);
    });

    iRate.on("initialize:after", function(){
      if(Backbone.history){
        Backbone.history.start();

        // if(this.getCurrentRoute() === ""){
        //   iRate.trigger("contacts:list");
        // }
      }

        var mainContext = Engine.createContext(),
            appView = new AppView();
        mainContext.add(appView);
    });

    iRate.start();
    module.exports = iRate;
});

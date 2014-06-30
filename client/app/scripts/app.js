define(function(require, exports, module) {
    var Marionette = require("marionette"),
        Engine = require("famous/core/Engine"),
        AppView = require('modules/views/AppView'),
        bootstrapData = require('modules/data/NewFeedData');
        require('famous/inputs/FastClick');

    var iRate = new Marionette.Application();
    //Bootstrap data //Delete 
        if (Modernizr.localstorage && !window.localStorage['newFeed']) {
            window.localStorage["newFeed"] = JSON.stringify(bootstrapData);
        } 
    // iRate.addRegions({
    //   headerRegion: "#header-region",
    //   mainRegion: "#main-region",
    //   dialogRegion: Marionette.Region.Dialog.extend({
    //     el: "#dialog-region"
    //   })
    // });

    // iRate.navigate = function(route,  options){
    //   options || (options = {});
    //   Backbone.history.navigate(route, options);
    // };

    // iRate.getCurrentRoute = function(){
    //   return Backbone.history.fragment
    // };
    iRate.on("initialize:before", function(){
    
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

var dependencies = [
    "backbone",
    "marionette"
];

define(dependencies, exportAMD);

function exportAMD(Backbone, Marionette) {
    var iRate = new Marionette.Application();

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

    // iRate.on("initialize:after", function(){
    //   if(Backbone.history){
    //     Backbone.history.start();

    //     if(this.getCurrentRoute() === ""){
    //       iRate.trigger("contacts:list");
    //     }
    //   }
    // });

    return iRate;
}

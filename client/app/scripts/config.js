/*jslint node: true, nomen: true, unparam: true */
/*global jquery, _, $ */

'use strict';

require.config({
    baseUrl: './scripts/',
    paths: {
        // Core Libraries
        "jquery": "vendor/jquery",
        "backbone": "vendor/backbone",
        "underscore": "vendor/underscore",
        "marionette": "vendor/backbone.marionette"
        
    },
    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        "backbone": {
            "deps": ["underscore", "jquery"],
            "exports": "Backbone"
        },
        "marionette": {
            "deps": ["underscore", "backbone", "jquery"],
            "exports": "Marionette"
        }
    },
});
require(['app']);

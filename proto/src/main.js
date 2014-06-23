/*** main.js ***/

define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var AppView = require('views/AppView');

    var mainContext = Engine.createContext();
    var appView = new AppView();

    mainContext.add(appView);

  var socket = io.connect('http://localhost');
  // socket.on('news', function (data) {
  //   console.log(data);
  //   socket.emit('my other event', { my: 'data' });
  // });
});


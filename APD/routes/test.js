var YourThing = require('./YourThing.js');

var id = 'P0001';
YourThing.discoverById(function(yourThingInstance) {


  // you can be notified of disconnects
  yourThingInstance.on('disconnect', function() {
    console.log('we got disconnected! :( ');
  });

  // you'll need to call connect and set up
  yourThingInstance.connectAndSetUp(function(error) {
    console.log('were connected!');
  });

});
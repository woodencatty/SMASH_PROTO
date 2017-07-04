(function() {
    "use strict";

    var util = require('util');
    var BluetoothSerialPortServer = require("../lib/bluetooth-serial-port.js").BluetoothSerialPortServer;
    var server = new BluetoothSerialPortServer();

    const CHANNEL = 10;

    server.on('data', function(buffer){
        console.log("Received data from client: " + buffer);
        if(buffer == "END"){
            console.log("Finishing connection!");
            server.close();
            return;
        }

        var buf = new Buffer("PONG");
        console.log("Sending a PONG to the client...");
            server.write(buf, function(error, bytesWritten){
            if(error){
                console.error("Something went wrong sending the PONG message: bytesWritten = " + error);
            }else{
                console.log("PONG sent! (" + bytesWritten + " bytes)");
            }
        });
    });

    server.on('closed', function(){
      console.log("Client closed the connection!");
    });

    server.on('failure', function(err){
      console.log("Something wrong happened!: " + err);
    });

    server.listen(function(clientAddress){
        console.log("Client: " + clientAddress + " connected!");
    }, function(error){
        console.log("Something wrong happened while setting up the server for listening: error = " + error);
    }, { /*uuid: UUID,*/ channel: CHANNEL });

})();
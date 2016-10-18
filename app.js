var express = require('express');
var soap = require('soap');

var log = function(callerName, msg) {
    console.log(callerName + ' >>\n' + msg);
}

var ps = {
    PlanetSystemService: {
        PlanetPort: {
            addPlanet: function(args, callback) {
                log("addPlanet", JSON.stringify(args, null, '  '));

                callback({
                    status: {
                        status: false,
                        message: "Doesn't implemented yet"
                    }
                });
            },
            getPlanet: function(args, callback) {
                log("getPlanet", JSON.stringify(args, null, '  '));

                callback({
                    status: {
                        status: false,
                        message: "Doesn't implemented yet"
                    }
                });
            }
        }
    }
};

var xml = require('fs').readFileSync('ps.wsdl', 'utf8');

var app = express();
app.listen(8001, function() {
    console.log('SOAP server has been started!');
    soap.listen(app, '/wsdl', ps, xml);
});
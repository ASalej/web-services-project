// SOAP client example

var soap = require('soap');
var url = 'http://localhost:8001/wsdl?wsdl';
var addPlanetArgs = {
    planet: {
        name: "Earth",
        radius: 40000,
        opener_id: null
    }
};
var getPlanetArgs = {
    planet_name: "Earth"
};

soap.createClient(url,function(err, client) {
    client.addPlanet(addPlanetArgs, function(err, result) {
        console.log(result);
        if (err) console.log(err);
    });
    client.getPlanet(getPlanetArgs, function(err, result) {
        console.log(result);
        if (err) console.log(err);
    });
});
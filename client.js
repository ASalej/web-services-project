// SOAP client example

var soap = require('soap');
var url = 'http://localhost:8001/wsdl?wsdl';
var addPlanetArgs = {
    planet: {
        name: "Neptun",
        radius: 40000,
        opener_id: 2
    }
};
var getPlanetArgs = {
    planet_name: "Earth"
};
var addPersonArgs = {
    person: {
        name: "Alena",
        surname: "Pazniak"
    }
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

    client.addPerson(addPersonArgs, function(err, result) {
        console.log(result);
        if (err) console.log(err);
    })

});

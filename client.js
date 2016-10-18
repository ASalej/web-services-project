// SOAP client example

var soap = require('soap');
var url = 'http://localhost:8001/planet?wsdl';

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
var changePlanetArgs = {
    planet: {
        name: "Earth",
        radius: 123321,
        opener_id: 42
    }
};
var delPlanetArgs = {
    planet_name: "Earth"
};

soap.createClient(url, function(err, client) {
    client.addPlanet(addPlanetArgs, function(err, result) {
        console.log('============= Planet Service ==============');
        console.log(JSON.stringify(result, null, '  '));
        if (err) console.log(err);
    });

    client.getPlanet(getPlanetArgs, function(err, result) {
        console.log('============= Planet Service ==============');
        console.log(JSON.stringify(result, null, '  '));
        if (err) console.log(err);
    });
    client.changePlanet(changePlanetArgs, function(err, result) {
        console.log('============= Planet Service ==============');
        console.log(JSON.stringify(result, null, '  '));
        if (err) console.log(err);
    });
    client.delPlanet(delPlanetArgs, function(err, result) {
        console.log('============= Planet Service ==============');
        console.log(JSON.stringify(result, null, '  '));
        if (err) console.log(err);
    });
});


var url = 'http://localhost:8001/person?wsdl';

var addPersonArgs = {
    person: {
        name: "Alena",
        surname: "Pazniak"
    }
};

soap.createClient(url, function(err, client) {
    client.addPerson(addPersonArgs, function(err, result) {
        console.log('============= Person Service ==============');
        console.log(JSON.stringify(result, null, '  '));
        if (err) console.log(err);
    });
});

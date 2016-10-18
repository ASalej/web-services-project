'use strict';

var express = require('express');
var soap = require('soap');
var fs = require('fs');

class Status {
    constructor(status, msg, id) {
        this.status = status || false;
        this.message = msg || undefined;
        this.id = id || undefined;
    };

    getObj() {
        return {
            status: this.status,
            message: this.message,
            id: this.id
        };
    };
};

class Planet {
    constructor(id, planet) {
        this.id = id;
        this.name = planet.name;
        this.radius = planet.radius;
        this.opener_id = planet.opener_id;
    }

    getObj() {
        return {
            p_id: this.id,
            name: this.name,
            radius: this.radius,
            opener_id: this.opener_id
        }
    }
};

class Person {
    constructor(id, person) {
        this.id = id;
        this.name = person.name;
        this.surname = person.surname;
    }

    getObj() {
        return {
            opener_id: this.id,
            name: this.name,
            surname: this.surname
        }
    }
};

var PlanetDB = JSON.parse(fs.readFileSync('planets.json', 'utf8'));
var OpenerDB = JSON.parse(fs.readFileSync('openers.json', 'utf8'));

function printDB(db) {
    console.log('\n====================\n');
    console.log('db:\n' + JSON.stringify(db, null, '  '));
    console.log('\n====================\n');
}

var log = function(callerName, msg) {
    console.log('\n' + callerName + ' >>\n' + msg);
};

var ps = {
    PlanetSystemService: {
        PlanetPort: {
            addPlanet: function(args, callback) {
                var sts = new Status();

                log("addPlanet", JSON.stringify(args, null, '  '));

                if (args.planet.name &&
                    args.planet.radius &&
                    args.planet.opener_id) {
                    var planet = new Planet(PlanetDB.length + 1, args.planet);
                    PlanetDB.push(planet.getObj());
                    sts.status = true;
                    sts.id = PlanetDB.length;
                } else {
                    sts.status = false;
                    sts.message = "Some field are incorect";
                }

                printPlanetDB(PlanetDB);

                callback({
                    status: sts.getObj()
                });
            },
            getPlanet: function(args, callback) {
                var sts = new Status();

                log("getPlanet", JSON.stringify(args, null, '  '));

                if (args.planet_name) {
                    var planet = PlanetDB.find(function(e, i, arr) {
                        if (e.name === args.planet_name) {
                            return true;
                        }
                        return false;
                    })
                    if (planet) {
                        sts.status = true;
                        sts.id = planet.p_id;
                    } else {
                        sts.status = false;
                        sts.message = "Can not find " + args.planet_name + " planet";
                    }
                } else {
                    sts.status = false;
                    sts.message = "Some field are incorect";
                }

                callback({
                    planet: planet,
                    status: sts.getObj()
                });
            },
            addPerson: function (args, callback) {
                var sts = new Status();

                log("addPerson", JSON.stringify(args, null, '  '));

                if (args.person.name && args.person.surname) {
                    var person = new Person(OpenerDB.length + 1, args.person);
                    OpenerDB.push(person.getObj());
                    sts.status = true;
                    sts.id = OpenerDB.length;
                } else {
                    sts.status = false;
                    sts.message = "Some field are incorect";
                }

                callback({
                    status: sts.getObj()
                });
            },
            getPerson: function(args, callback) {
                var sts = new Status();

                log("getPerson", JSON.stringify(args, null, '  '));

                if (args.name) {
                    var person = OpenerDB.find(function(e, i, arr) {
                        return e.name === args.planet_name) {
                    });
                    if (person) {
                        sts.status = true;
                        sts.id = person.opener_id;
                    } else {
                        sts.status = false;
                        sts.message = "Can not find " + args.name + " planet";
                    }
                } else {
                    sts.status = false;
                    sts.message = "incorect name";
                }

                callback({
                    person: person,
                    status: sts.getObj()
                });
            },

        }
    }
};

var xml = require('fs').readFileSync('ps.wsdl', 'utf8');

var app = express();
app.listen(8001, function() {
    console.log('SOAP server has been started!');
    soap.listen(app, '/wsdl', ps, xml);
});

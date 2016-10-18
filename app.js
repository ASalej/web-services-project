'use strict';

function hash(string) {
    var hash = 0;
    if (string.length == 0) return hash;
    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & 0x7fffffff; // Convert to 32bit integer
    }
    return hash;
}

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

    change(planet) {
        this.name = planet.name;
        this.radius = planet.radius;
        this.opener_id = planet.opener_id;
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

var planet_service = {
    PlanetService: {
        PlanetPort: {
            addPlanet: function(args, callback) {
                var sts = new Status();

                log("addPlanet", JSON.stringify(args, null, '  '));

                if (args.planet.name &&
                    args.planet.radius &&
                    args.planet.opener_id) {

                    var planet = new Planet(hash(args.planet.name), args.planet);
                    PlanetDB.push(planet.getObj());
                    sts.status = true;
                    sts.id = planet.id;
                } else {
                    sts.status = false;
                    sts.message = "Some field are incorect";
                }

                printDB(PlanetDB);

                callback({
                    status: sts.getObj()
                });
            },
            getPlanet: function(args, callback) {
                var sts = new Status();

                log("getPlanet", JSON.stringify(args, null, '  '));

                if (args.planet_name) {
                    var planet = PlanetDB.find(function(e, i, arr) {
                        return e.name === args.planet_name;
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
            changePlanet: function(args, callback) {
                var sts = new Status();

                log("changePlanet", JSON.stringify(args, null, '  '));

                if (args.planet.name &&
                    args.planet.radius &&
                    args.planet.opener_id) {

                    var p_index = PlanetDB.findIndex(function(e, i, arr) {
                        return (e) ? e.name === args.planet.name : false;
                    });
                    if (p_index != -1) {
                        var p = new Planet(0, PlanetDB[p_index]);
                        p.change(args.planet);
                        PlanetDB[p_index] = p.getObj();
                        sts.status = true;
                        sts.id = p.id;
                    } else {
                        sts.status = false;
                        sts.message = "Can not find " + args.planet.name + " planet";
                    }
                } else {
                    sts.status = false;
                    sts.message = "Some field are incorect";
                }

                printDB(PlanetDB);

                callback({
                    planet: p,
                    status: sts.getObj()
                });
            },
            delPlanet: function(args, callback) {
                var sts = new Status();

                log("delPlanet", JSON.stringify(args, null, '  '));

                if (args.planet_name) {
                    var len = PlanetDB.length;
                    PlanetDB = PlanetDB.filter(function(e, i, arr) {
                        return e.name != args.planet_name;
                    });
                    if (len == PlanetDB) {
                        sts.status = false;
                        sts.message = "Can not find " + args.planet_name + " planet";
                    } else {
                        sts.status = true;
                    }
                } else {
                    sts.status = false;
                    sts.message = "Some field are incorect";
                }

                printDB(PlanetDB);

                callback({
                    status: sts.getObj()
                });
            }
        }
    }
};

var person_service = {
    PersonService: {
        PersonPort: {
            addPerson: function (args, callback) {
                var sts = new Status();

                log("addPerson", JSON.stringify(args, null, '  '));

                if (args.person.name && args.person.surname) {
                    var person = new Person(hash(args.person.name + args.person.surname), args.person);
                    OpenerDB.push(person.getObj());
                    sts.status = true;
                    sts.id = true;
                }

                printDB(OpenerDB);

                callback({
                    status: sts.getObj()
                });
            },
            getPerson: function(args, callback) {
                var sts = new Status();

                log("getPerson", JSON.stringify(args, null, '  '));

                if (args.name && args.surname) {
                    var persons = OpenerDB.filter(function(e, i, arr) {
                        return e.name === args.name && e.surname === args.surname;
                    });
                    if (persons.length) {
                        sts.status = true;
                    } else {
                        sts.status = false;
                        sts.message = "Can not find " + args.name + " " + args.surname + " person";
                    }
                } else {
                    sts.status = false;
                    sts.message = "incorect name";
                }

                callback({
                    persons: persons,
                    status: sts.getObj()
                });
            },
            changePerson: function(args, callback) {
                var sts = new Status(true, "Change person does nothing");

                log("changePerson", JSON.stringify(args, null, '  '));

                if (args.person.name && args.person.surname) {
                    var p = OpenerDB.filter(function(e, i, arr) {
                        return e.name === args.person.name && e.surname === args.person.surname;
                    });
                    if (p.length) {
                        sts.status = true;
                    } else {
                        sts.status = false;
                        sts.message = "Can not find " + args.name + " " + args.surname + " person";
                    }
                } else {
                    sts.status = false;
                    sts.message = "incorect name";
                }

                callback({
                    persons: p,
                    status: sts.getObj()
                });
            },
            delPerson: function(args, callback) {
                var sts = new Status(true);

                log("delPerson", JSON.stringify(args, null, '  '));

                if (args.name && args.surname) {
                    var len = OpenerDB.length;
                    OpenerDB = OpenerDB.filter(function(e, i, arr) {
                        return e.name != args.name && e.surname != args.surname;
                    });
                    if (len != OpenerDB.length) {
                        sts.status = true;
                    } else {
                        sts.status = false;
                        sts.message = "Can not find " + args.name + " " + args.surname + " person";
                    }
                } else {
                    sts.status = false;
                    sts.message = "incorect name";
                }

                printDB(OpenerDB);

                callback({
                    status: sts.getObj()
                });
            },
        }
    }
};

var planet_xml = require('fs').readFileSync('planet.wsdl', 'utf8');
var person_xml = require('fs').readFileSync('person.wsdl', 'utf8');

var app = express();

app.use(express.static('wsdl'))

app.listen(8001, function() {
    console.log('SOAP server has been started!');
    soap.listen(app, '/planet', planet_service, planet_xml);
    soap.listen(app, '/person', person_service, person_xml);
});

/*
var server = http.createServer(function(request, response) {
    response.end("404: Not Found: " + request.url);
});

server.listen(8001);
soap.listen(server, '/planet', planet_service, planet_xml);
soap.listen(server, '/person', person_service, person_xml);
*/
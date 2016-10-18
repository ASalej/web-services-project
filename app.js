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
        this.id = id || undefined;
        this.name = planet.name || undefined;
        this.radius = planet.radius || undefined;
        this.opener_id = planet.opener_id || undefined;
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

var PlanetDB = JSON.parse(fs.readFileSync('planets.json', 'utf8'));
var OpenerDB = JSON.parse(fs.readFileSync('openers.json', 'utf8'));

function printPlanetDB() {
    console.log('\n====================\n');
    console.log('PlanetDB:\n' + JSON.stringify(PlanetDB, null, '  '));
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

                    var planet = new Planet(hash(args.planet.name), args.planet);
                    PlanetDB.push(planet.getObj());
                    sts.status = true;
                    sts.id = planet.id;
                } else {
                    sts.status = false;
                    sts.message = "Some field are incorect";
                }

                printPlanetDB();

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

                printPlanetDB();

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

                printPlanetDB();

                callback({
                    status: sts.getObj()
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
'use strict'

$(document).ready(function () {
    var planetUrl = 'http://localhost:8001/planet?wsdl';
    var personUrl = 'http://localhost:8001/person?wsdl';

    var addPlanet = $('#addPlanet');
    var addPerson = $('#addPerson');
    var getPlanet = $('#getPlanet');
    var getPerson = $('#getPerson');
    var removePlanet = $('#removePlanet');
    var removePerson = $('#removePerson');
    var changePlanet = $('#changePlanet');
    var changePerson = $('#changePerson');
    var getPlanetList = $('#getPlanetList');

    function soap (args, button, url) {
        var temp = { button: ''};
        $.soap({
            url: url,
            method: temp.keys().toString(),
            data: args,
            success: function (soapResponse) {
                console.log(soapResponse.toXML());
                button.next().html(soapResponse);
                button.next().addClass('alert alert-success');
            },
            error: function (SOAPResponse) {
                console.log('Error');
                button.next().html(SOAPResponse);
                button.next().addClass('alert alert-danger');
            }
        });
    }

    addPlanet.on('click', function () {
        var planetName = $('#planetName').val();
        var planetRadius = $('#planetRadius').val();
        var opener = $('#opener').val();
        var args = {
            planet: {
                name: planetName,
                radius: planetRadius,
                opener_id: opener
            }
        };
        soap(args, addPlanet, planetUrl);
    });

    addPerson.on('click', function () {
        var personName = $('#persontName').val();
        var personSurmane = $('#personSurmane').val();
        var args = {
            person: {
                name: personName,
                surname: personSurmane
            }
        };
        soap(args, addPerson, personUrl);
    });

    getPlanet.on('click', function () {
        var planet = $('#getPlanetName').val();
        var args = {
            planet_name: planet
        };
        soap(args, getPlanet, planetUrl);
    });

    getPerson.on('click', function() {
        var name = $('#getPersonName');
        var surname = $('#getPersonSurName');
        var args = {
            person: {
                name: name,
                surname: surname
            }
        }
        soap(args, getPerson, personUrl);
    })

    changePlanet.on('click', function () {
        var planetName = $('#changePlanetName').val();
        var planetRadius = $('#changePlanetRadius').val();
        var changePlanetOpener = $('#changePlanetOpener').val();
        var args = {
            planet: {
                name: planetName,
                radius: planetRadius,
                opener_id: changePlanetOpener
            }
        };
        soap(args, changePlanet, planetUrl);
    });

    changePerson.on('click', function () {
        var personName = $('#changePersonName').val();
        var personSurmane = $('#changePersonSurname').val();
        var args = {
            person: {
                name: personName,
                surname: personSurmane
            }
        };
        soap(args, changePerson, personUrl);
    });

    removePlanet.on('click', function () {
        var removePlanetName = $('#removePlanetName').val();
        var args = { planet_name: removePlanetName };
        soap(args, removePlanet, planetUrl);
    });

    removePerson.on('click', function () {
        var removePersonName = $('#removePersonName').val();
        var removePersonSurnameName = $('#removePersonSurnameName').val();
        var args = {
            name: removePersonName,
            surname: removePersonSurnameName
        };
        soap(args, removePerson, personUrl);
    });

    getPlanetList.on('click', function () {
        soap({}, getPlanetList, planetUrl);
    })
})

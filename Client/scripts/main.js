'use strict'

$(document).ready(function () {
    var url = 'http://localhost:8000/wsdl?wsdl';

    var addPlanet = $('#addPlanet');
    var addPerson = $('#addPerson');
    var getPlanet = $('#getPlanet');
    var getPerson = $('#getPerson');
    var removePlanet = $('#removePlanet');
    var removePerson = $('#removePerson');
    var changePlanet = $('#changePlanet');
    var changePerson = $('#changePerson');
    var getPlanetList = $('#getPlanetList');

    function soap (args, button) {
        $.soap({
            url: url,
            method: 'changePlanet',
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
        soap(args, addPlanet);
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
        soap(args, addPerson);
    });

    getPlanet.on('click', function () {
        var planet = $('#getPlanetName').val();
        var args = {
            planet_name: planet
        };
        soap(args, getPlanet);
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
        soap(args, getPerson);
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
        soap(args, changePlanet);
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
        soap(args, changePerson);
    });

    removePlanet.on('click', function () {
        var removePlanetName = $('#removePlanetName').val();
        var args = { planet_name: removePlanetName };
        soap(args, removePlanet);
    });

    removePerson.on('click', function () {
        var removePersonName = $('#removePersonName').val();
        var removePersonSurnameName = $('#removePersonSurnameName').val();
        var args = {
            name: removePersonName,
            surname: removePersonSurnameName
        };
        soap(args, removePerson);
    });

    getPlanetList.on('click', function () {
        soap({}, getPlanetList);
    })
})

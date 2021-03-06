var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');

function collectStreets(val, streetParts) {
    streetParts.push(val);
    return streetParts;
}
program.version('0.0.1').usage('[options]').option('-r, --registry <registry>', 'Registry', '', 'test').option('-n, --name <name>', 'Name', '').option('-i, --id <id>', 'id', ['myreg', moment().unix()].join('')).option('-f, --fax <fax>', 'Fax', '').option('-e, --email <email>', 'Email', '').option('-a, --authinfo <auth info>', 'AuthInfo', '').option('-s, --street [street]', 'Street', collectStreets, []).option('-c, --city <city>', 'City').option('-t, --state <state>', 'State/Province').option('-o, --country <country>', 'Country').option('-p, --telephone <telephone>').option('-y, --type', 'Type', 'int').option('-l, --postcode <postcode>', 'Postcode').option('--company <company>', "Company name", '');
program.parse(process.argv);

var registry = program.registry;
var name = program.name;
var telephone = program.telephone;
var street = program.street;
var city = program.city;
var country = program.country;
var state = program.state;
var fax = program.fax;
var postcode = program.postcode;
var email = program.email;
var auth = program.authinfo;
var state = program.state;
var org = program.company;
var type = program.type || 'int';
var id = program.id;
var postalInfo = {
    "type": type,
    "name": name,
    "org": org,
    "addr": {
        "street": street,
        "city": city,
        "sp": state,
        "cc": country,
        "pc": postcode,
    }
};
var contactData = {
    "id": id,
    "voice": telephone,
    "fax": fax,
    "email": email,
    "authInfo": auth,
    "postalInfo": postalInfo
};

var eppCommander = new EppCommander(registry);
eppCommander.createContact(contactData).then(function(data) {
    var contact = data.data['contact:creData']['contact:id'];
    console.log("Created contact: ", contact);
},
function(error) {
    console.error("Unable to create contact: ", error);
    if (error.result.hasOwnProperty('extValue')) {
        console.error(error.result.extValue);
    }
    throw error;
}).fin(function() {
    process.exit(0);
});


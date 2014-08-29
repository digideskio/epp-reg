# epp-reg

Backend logic for EPP commands to help with testing and prototyping



# Synopsis

    var EppCommander = require('./lib/epp-commander.js');
    var epp = new EppCommander('nzrs');


    epp.createContact(contactData).then(
        function (okResult) {
            // process data
        },
        function (errorResult) {
            // handle error
        }
    );

# Description

Library for posting to the EPP service listening to RabbitMQ. Although mostly
for testing purposes, there will hopefully be some code here worthy of being
in our backend system in the future.

This code is all about end-to-end testing operations like creating contacts
and domains, updating domains, etc.

Please see the ```ideegeo/nodepp``` repository for a detailed description of
commands.

Note that all commands return a *promise* object.

# Dependencies

1.  An instance of RabbitMQ. The ```devel``` configuration assumes this is
    running at ```devel.iwantmyname.com```.
2.  ```nodepp``` installed, running and connected to RabbitMQ.



# Installation

    git clone git@github.com:ideegeo/epp-reg.git
    cd epp-reg
    npm install



# Configuration

    ln -sf `pwd`/config/epp-reg-devel.json `pwd`/config/epp-reg.json

This is for developement environments, however as this is mostly generic
RabbitMQ stuff it can probably be safely copied for production or other
environments.

If you want to change anything, please make a new config file with your
settings and ```ln -sf``` to it. Otherwise you might cause future automated
unit tests to do something unpredictable.


# Testing

    npm test

*Note* see section on **Dependencies** in regards to testing.


# Command line scripts

## create-contact.js

      node lib/create-contact.js -r nzrs-test1 \
            --name 'Joe User' \
            --email joeuser@null.com \
            --street '742 Evergreen Terrace' \
            --street 'Apt. b'
            --country 'Springfield' \
            --state Florida \
            --telephone '+1.123456789' \
            --postcode 25000 \ # postcode 
            -o USA 


## create-domain.js


        node lib/create-domain.js -r nzrs-test1 \
            --name test-6-iwmn.co.nz \
            --registrant iwmn-1409280841 \
            --admin iwmn-1409280485 \
            --tech iwmn-1409280762  \
            --nameserver 'ns1.hexonet.net' \
            --nameserver 'ns2.hexonet.net' \
            --nsobj 'ns.test-6-iwmn.co.nz;23.44.23.12' \ # Glue record!
            --period 1  \
            --unit y 

Output:

        Created domain:  test-6-iwmn.co.nz
        Expires:  2015-08-29T21:55:12+12:00

or if there was an error (eg. the domain is already registered):

        Unable to register domain:  [Error: Domain is not available]

## info-domain.js


        node lib/info-domain.js -d test-4-iwmn.co.nz -r nzrs-test1

Output:
        
        { 'xmlns:domain': 'urn:ietf:params:xml:ns:domain-1.0',
            'domain:name': 'test-4-iwmn.co.nz',
            'domain:roid': 'd95928bbc4a0-DOM',
            'domain:status': { lang: 'en', s: 'ok' },
            'domain:ns': { 'domain:hostAttr': [Object] },
            'domain:clID': {},
            'domain:crDate': '2014-08-29T21:51:34+12:00',
            'domain:exDate': '2015-08-29T21:51:34+12:00' } }


## poll-cli.js
This is used to iteratively retrieve queued messages from the registry. The
nature of these messages depends on the registry and can vary wildly.

        node lib/poll-cli.js -r nzrs-test1

Output:

        Remaining messages:   2
        next message id:    0195iwmn-1409306037
        Poll msg:   Domain Create
        Received data:  { 'xmlns:domain': 'urn:ietf:params:xml:ns:domain-1.0',
        'domain:name': 'test-5-iwmn.co.nz',
        'domain:roid': '3fd1074ac89c-DOM',
        'domain:status': { lang: 'en', s: 'ok' },
        'domain:registrant': 'iwmn-1409280841',
        'domain:contact':
        [ { type: 'admin', '$t': 'iwmn-1409280485' },
            { type: 'tech', '$t': 'iwmn-1409280762' } ],
        'domain:ns': { 'domain:hostAttr': [ [Object], [Object] ] },
        'domain:clID': 195,
        'domain:crDate': '2014-08-29T21:53:57+12:00',
        'domain:exDate': '2015-08-29T21:53:57+12:00',
        'domain:authInfo': { 'domain:pw': 'FMMhQJHZ' } }

To dequeue that message:
        
        node lib/poll-cli.js -r nzrs-test1 -i 0195iwmn-1409306037

Output:

        Remaining messages:   1


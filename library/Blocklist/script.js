var dns = require('dns');
var assert = require('assert');


/**
 * Configuration values
 */

var listOfAddresses = [
    "127.0.0.2",
    "127.0.0.3",
];

var listOfProviders = [
    {
        "name": "OpenRBL Blacklist",
        "dns": "openrbl.org",
        "website": "http://www.openrbl.org/"
    },
    {
        "name": "Mail-abuse.org",
        "dns": "blackholes.mail-abuse.org",
        "website": "http://www.mail-abuse.org/"
    },
    {
        "name": "Distributed Sender",
        "dns": "list.dsbl.org",
        "website": "http://dsbl.org/",
    },
    {
        "name": "SpamCop",
        "dns": "bl.spamcop.net",
        "website": "http://spamcop.net"
    },
    {
        "name": "Sorbs Aggregate Zone",
        "dns": "dnsbl.sorbs.net",
        "website": "http://dnsbl.sorbs.net/"
    },
    {
        "name": "Sorbs spam.dnsbl Zone",
        "dns": "spam.dnsbl.sorbs.net",
        "website": "http://sorbs.net"
    },
    {
        "name": "Composite Blocking List",
        "dns": "cbl.abuseat.org",
        "website": "http://www.abuseat.org"
    },
    {
        "name": "SpamHaus Zen",
        "dns": "zen.spamhaus.org",
        "website": "http://spamhaus.org"
    },
    {
        "name": "Multi SURBL",
        "dns": "multi.surbl.org",
        "website": "http://www.surbl.org"
    },
    {
        "name": "Spam Cannibal",
        "dns": "bl.spamcannibal.org",
        "website": "http://www.spamcannibal.org/cannibal.cgi"
    },
    {
        "name": "dnsbl.abuse.ch",
        "dns": "spam.abuse.ch",
        "website": "http://dnsbl.abuse.ch/"
    },
    {
        "name": "The Unsubscribe Blacklist(UBL)",
        "dns": "ubl.unsubscore.com ",
        "website": "http://www.lashback.com/blacklist/"
    },
    {
        "name": "UCEPROTECT Network",
        "dns": "dnsbl-1.uceprotect.net",
        "website": "http://www.uceprotect.net/en"
    }
];

/**
 * Script, don't change anything if you don't know what you're doing!
 */

// Helper function to check if an IP is registered with a spam provider
function check(ip, provider) {
    var reversed = ip.split('.').reverse().join('.');
    dns.resolve4(reversed + '.' + provider.dns, function(error) {
        if (error === null) {
            // Unexpected path, this means the ip address exists in the spam list
            assert.ok(false, 'Match for ' + ip + ' in ' + provider.name + ' (' + provider.website + ' )');
        } else {
            assert.ok(true, 'Ip address not found');
        }
    });
}

// Loop all the provided addresses with the available providers
listOfAddresses.forEach(function(ip) {
    listOfProviders.forEach(function(provider) {
        check(ip, provider);
    });
});

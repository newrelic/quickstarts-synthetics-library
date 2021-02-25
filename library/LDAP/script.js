var LdapAuth = require('ldapauth-fork');

var options = {
    url: 'ldap://YourLdapServer:389',
    bindDN: 'BindUsername',
    bindCredentials: $secure.LDAP_BIND_PASSWORD,
    searchBase: 'dc=yourDomain,dc=com',
    searchFilter: '(cn=)'
}

// Connect to LDAP server
var ldap = newLdapAuth(options);

ldap.on('error', function(err) {
    throw new Error('Unable to connect to LDAP server. Error: '+err);
})

// Test user authentication
ldap.authenticate('TestUser', $secure.LDAP_TEST_PASSWORD, function(err, user) {
   if (err) {
       ldap.close();
       throw new Error('Unable to authenticate user. Error: '+err);
   }
   else {
        console.log('User authentication successful.');
        ldap.close();
   }
})
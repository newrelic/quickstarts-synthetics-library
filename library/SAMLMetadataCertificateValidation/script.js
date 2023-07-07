// SAML Metadata requirements are documented here:
// https://www.oasis-open.org/committees/download.php/56785/sstc-saml-metadata-errata-2.0-wd-05.pdf

const assert = require('assert');
const { X509Certificate } = require('crypto');
const xml2js = require('xml2js');
var stripNS = require('xml2js').processors.stripPrefix;
const util = require('util');

// EDIT: Put your custom URL here
const metadataUrl = 'https://samltest.id/saml/idp';

// EDIT: Put your custom expiry days value here
const daysBeforeExpiration = 30;

const certHeader = '-----BEGIN CERTIFICATE-----';
const certFooter = '-----END CERTIFICATE-----';
let failures = 0;

// SAML cert data needs to be formatted with X509 header and footer before
// it can be decrypted
function makeCertFromArray(data) {
  data = data.join().trim();
  const allLines = certHeader + '\n' + data.trim() + '\n' + certFooter;
  return new X509Certificate(allLines);
}

// IdP and SP metadata uses different descriptors per the SAML specification
function getKeyFromEntityDescriptor(descriptor) {
  return (
    descriptor.IDPSSODescriptor?.[0].KeyDescriptor ||
    descriptor.SPSSODescriptor[0].KeyDescriptor
  );
}

// Extracting KeyDescriptors requires parsing the metadata and then navigating to the
// descriptors. There is some flexibility about where these can be,
// e.g. EntityDescriptors can be a list withing EntitiesDescriptor if there are multiple
function getKeyDescriptorObj(body) {
  const parser = new xml2js.Parser({ tagNameProcessors: [stripNS] });
  let keyDescriptors = [];
  parser.parseString(body, function (err, result) {
    if (err) {
      console.log('xml parse data error: ' + err.message);
    } else {
      try {
        const entities = result.EntitiesDescriptor?.EntityDescriptor || [
          result.EntityDescriptor,
        ];
        entities.forEach((entity) => {
          keyDescriptors = keyDescriptors.concat(
            getKeyFromEntityDescriptor(entity)
          );
        });
      } catch (error) {
        console.log('No keys found');
        throw error;
      }
      console.log(keyDescriptors.length + ' key(s) found');
    }
  });
  return keyDescriptors;
}

function checkCertExpiry(cert) {
  let expirationDate = new Date(cert.validTo);
  const currentDate = new Date();

  console.log('This certificate will expire on ' + expirationDate, '');

  // Offset the failure date by the user supplied daysBeforeExpiration
  expirationDate.setDate(expirationDate.getDate() - daysBeforeExpiration);

  console.log('**** Offset expiration date: ' + expirationDate);
  console.log('**** Date at time of testing: ' + currentDate);

  // Track total failures so that more than one certificate can be checked.
  if (expirationDate < currentDate) {
    failures++;
    console.log(
      'The test has FAILED as the offset expiration date is before now!'
    );
  } else {
    console.log(
      'The test is a SUCCESS, the expiration date is more than ' +
        daysBeforeExpiration +
        ' after now...'
    );
  }
}

function certCheckForUrl(url) {
  $http.get(
    url,
    // Callback
    function (err, response, body) {
      if (err) {
        console.log('GET request failed');
        throw err;
      }
      assert.equal(response.statusCode, 200, 'Expected a 200 OK response');

      const keyDesc = getKeyDescriptorObj(body);

      // build and check certificate for each key
      keyDesc.forEach((key) => {
        if (key.$ && 'use' in key.$) {
          console.log('Use for: ' + key.$.use);
        } else {
          console.log('No usage type given');
        }
        const certArray = key.KeyInfo[0].X509Data[0].X509Certificate;
        const cert = makeCertFromArray(certArray);
        console.log('Certificate Subject: ' + cert.subject);
        checkCertExpiry(cert);
      });

      if (failures) {
        throw new Error(
          'WARNING: ' +
            failures +
            ' certificates will expire within ' +
            daysBeforeExpiration +
            ' days.'
        );
      }
    }
  );
}

certCheckForUrl(metadataUrl);

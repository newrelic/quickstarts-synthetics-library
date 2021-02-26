$browser.get('https://s3.amazonaws.com/nr-synthetics-assets/nat-ip-dnsname/production/ip-dnsname.json').then(function(){
  return $browser.findElement($driver.By.xpath('//pre')).then(function(element){
    return element.getText().then(function(text){
      var jsonResp = JSON.parse(text);
      // Log the first IP for the Washington, DC location
      console.log(jsonResp['Washington, DC, USA'][0])
    });
  });
});
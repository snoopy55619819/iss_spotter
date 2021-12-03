const request = require('request');

//Get IP
const fetchMyIP = function(callback) {
  const urlForIP = 'https://api.ipify.org?format=json';

  request(urlForIP, (err, response, body) => {
    const data = JSON.parse(body);
    const currentIP = data["ip"];
    const responseMsg = response.statusCode;
    //Error when getting IP
    if (err) {
      callback(err, null);
    }

    if (responseMsg !== 200) {
      const msg = `Status Code ${responseMsg} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(err, currentIP);
  });
};

//Get coordinates.
const fetchCoordsByIP = (ip, callback) => {
  const freeGeoAPIKey = '13cb8510-53f1-11ec-8756-5fb0aa2f77ae';
  const freeGeoURL = `https://api.freegeoip.app/json/${ip}?apikey=${freeGeoAPIKey}`;

  request(freeGeoURL, (err, response, body) => {
    if (err) {
      callback(err, null);
    }
    
    const responseMsg = response.statusCode;
    if (responseMsg !== 200) {
      const msg = `Status Code ${responseMsg} when fetching coordinates. Response: ${body}`;
      callback(msg, null);
      return;
    }

    const data = JSON.parse(body);
    const latitude = data['latitude'];
    const longitude = data['longitude'];
    const coords = {latitude: String(latitude), longitude: String(longitude)};

    callback(err, coords);
  });
};

//Get ISS fly by times.
const fetchISSFlyOverTimes = (coords, callback) => {
  const latitude = coords['latitude'];
  const longitude = coords['longitude'];
  const issPassbyURL = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  
  request(issPassbyURL, (err, response, body) => {
    if (err) {
      callback(err, null);
    }
    
    const responseMsg = response.statusCode;
    if (responseMsg !== 200) {
      const msg = `Status Code ${responseMsg} when fetching ISS flyover times. Response: ${body}`;
      callback(msg, null);
      return;
    }
    
    const data = JSON.parse(body);
    const flyOverTimes = data['response'];

    callback(err, flyOverTimes);
  });
};

//Convert passby times to message format such as:
//  'Next pass at Fri Jun 01 2021 13:01:35 GMT-0700 (Pacific Daylight Time) for 465 seconds!'
const nextISSTimesForMyLocation = (flyOverTimes, callback) => {
  const passTimes = [];

  for (const time of flyOverTimes) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(time.risetime);
    const duration = time['duration'];

    let nextPassTimeMessage = `Next pass at ${dateTime} for ${duration} seconds!`;
    passTimes.push(nextPassTimeMessage);
  }

  callback("", passTimes);
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};

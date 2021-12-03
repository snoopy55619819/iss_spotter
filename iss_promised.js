const request = require('request-promise-native');

//Get IP
const fetchMyIP = callback => {
  const urlForIP = 'https://api.ipify.org?format=json';
  return request(urlForIP);
};

const fetchCoordsByIP = body => {
  const ip = JSON.parse(body).ip;
  const freeGeoAPIKey = '13cb8510-53f1-11ec-8756-5fb0aa2f77ae';
  const freeGeoURL = `https://api.freegeoip.app/json/${ip}?apikey=${freeGeoAPIKey}`;

  return request(freeGeoURL);
};

const fetchISSFlyOverTimes = (body) => {
  const data = JSON.parse(body);
  const latitude = data['latitude'];
  const longitude = data['longitude'];
  const issPassbyURL = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  
  return request(issPassbyURL)
};


const convertToOutputMessage = (body) => {
  const flyOverTimes = JSON.parse(body).response;
  const passTimes = [];
  
  for (const time of flyOverTimes) {
    const duration = time['duration'];
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(time.risetime);
    
    let nextPassTimeMessage = `Next pass at ${dateTime} for ${duration} seconds!`;
    passTimes.push(nextPassTimeMessage);
  }
  return passTimes;
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(convertToOutputMessage);
};

module.exports = {
  nextISSTimesForMyLocation
};

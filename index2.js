const { nextISSTimesForMyLocation } = require('./iss_promised');

nextISSTimesForMyLocation()
  .then((passTimes) => {
    passTimes.forEach(time => console.log(time))
  })
  .catch((err) => {
    console.log(`There was an error: ${err.message}`);
  });
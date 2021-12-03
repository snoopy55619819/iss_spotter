const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

// Get current IP.
fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  // Get current gps coordinates using IP.
  fetchCoordsByIP(ip, (error, coords) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
    
    //Get ISS fly over times for current coordinates.
    fetchISSFlyOverTimes(coords, (error, flyOverTimes) => {
      if (error) {
        console.log("It didn't work!" , error);
        return;
      }
      
      //Parse flyOvertimes into output messages.
      nextISSTimesForMyLocation(flyOverTimes, (error, passTimes) => {
        if (error) {
          return console.log("It didn't work!", error);
        }
        // success, print out the pass times!
        for (const time of passTimes) {
          console.log(time);
        }
      });
    });
  });
});


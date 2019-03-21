/*
 * @author Jesse Sydänmäki
 * Github: https://github.com/Pygmicaesar
 * 
 * A file for storing utility functions for data parsing
 * .
 */

/* Function that parses data fetched from the API and
 * saves the data in an array which is the returned.
 * Parameters: an array of trains, a dictionary of stations,
 * the current station and a boolean that is used to determine
 * whether the app should display a table of arriving or departing trains.
 */
export const parseTrainData = (trains, stations, currentStation, arrival) => {
  let data = [];
  let isArrival = arrival ? "ARRIVAL" : "DEPARTURE";
  let currentTime = new Date();

  // Helps with finding the name associated with station short code. 
  const getStationName = (shortCode, stations) => {
    for (let key in stations) {
      if (stations[key] === shortCode) {
        return key;
      }
    }
  };

  trains.map(train => {
    if (
      train.trainCategory !== 'Long-distance' &&
      train.trainCategory !== 'Commuter'
    ) {
      return;
    }

    train.timeTableRows.map(timeTableRow => {

      const scheduledTime = new Date(timeTableRow.scheduledTime);

      if (
        timeTableRow.stationShortCode === stations[currentStation] &&
        timeTableRow.type === isArrival &&
        currentTime < scheduledTime
      ) {

        let number;

        if (train.trainCategory === 'Long-distance') {
          number = train.trainType + ' ' + train.trainNumber; 
        } else {
          number = train.commuterLineID + ' ' + train.trainNumber;
        }

        const estimatedTime =
          timeTableRow.liveEstimateTime === undefined
            ? ''
            : new Date(timeTableRow.liveEstimateTime);

        const origin = getStationName(
          train.timeTableRows[0].stationShortCode,
          stations,
        );

        const destination = getStationName(
          train.timeTableRows[train.timeTableRows.length - 1].stationShortCode,
          stations,
        );

        data.push({
          number,
          type: train.trainType,
          origin,
          destination,
          time: scheduledTime,
          estimatedTime,
          cancelled: timeTableRow.cancelled,
        });
      }
    });
  });
  return data;
};

/* Function that handles sorting an array of trains based on time.
 * Parameters a and b are objects in the array of trains.
 */
export const compare = (a, b) => {
  if (a.time < b.time) {
    return -1;
  } else if (a.time > b.time) {
    return 1;
  } else {
    return 0;
  }
};

export const parseTrainData = (trains, stations, currentStation, arrival) => {
  let data = [];
  let isArrival = arrival ? "ARRIVAL" : "DEPARTURE";
  let currentTime = new Date();

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

export const compare = (a, b) => {
  if (a.time < b.time) {
    return -1;
  } else if (a.time > b.time) {
    return 1;
  } else {
    return 0;
  }
};

/*
  for (let i = 0; i < trains.length; i++) {
    if (
      trains[i].trainCategory === "Long-distance" ||
      trains[i].trainCategory === "Commuter"
    ) {
      for (let j = 0; j < trains[i].timeTableRows.length; j++) {
        let scheduledTime = new Date(trains[i].timeTableRows[j].scheduledTime);
        if (
          trains[i].timeTableRows[j].stationShortCode ===
            stations[currentStation] &&
          trains[i].timeTableRows[j].type === isArrival &&
          currentTime < scheduledTime
        ) {
          let trainObject = {};
          if (trains[i].trainCategory === "Long-distance") {
            trainObject["number"] =
              trains[i].trainType + " " + trains[i].trainNumber;
          } else {
            trainObject["number"] =
              trains[i].commuterLineID + " " + trains[i].trainNumber;
          }

          trainObject["type"] = trains[i].trainType;
          trainObject["origin"] = getStationName(
            trains[i].timeTableRows[0].stationShortCode,
            stations
          );
          trainObject["destination"] = getStationName(
            trains[i].timeTableRows[trains[i].timeTableRows.length - 1].stationShortCode,
            stations
          );
          trainObject["time"] = scheduledTime;
          trainObject["cancelled"] = trains[i].timeTableRows[j].cancelled;
          trainObject["estimatedTime"] =
            trains[i].timeTableRows[j].liveEstimateTime === undefined
              ? ""
              : new Date(trains[i].timeTableRows[j].liveEstimateTime);

          data.push(trainObject);
        }
      }
    }
  }
  */

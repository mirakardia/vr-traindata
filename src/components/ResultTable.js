import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import '../style/Table.css';

const CustomTableCell = withStyles => ({

    head: {
      paddingLeft: 10,
      textAlign: 'left',
      fontWeight: 'normal',
      color: '#b9b9b9'
    },
    body: {
      paddingTop: 10,
      paddingLeft: 10,
      paddingBottom: 10,
      border: '1 solid #ddd',
      borderLeft: 'none',
      borderRight: 'none',
      borderTop: 'none'
    }
  }(TableCell));

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#fafafa'
    }
  }
};

let data = [];

const compare = (a, b) => {
  if (a.time < b.time) {
    return -1;
  } else if (a.time > b.time) {
    return 1;
  } else {
    return 0;
  }
};

const getStationName = (shortCode, stations) => {
  for (let key in stations) {
    if (stations[key] === shortCode) {
      return key;
    }
  }
};

const parseData = (trains, stations, currentStation, arrival) => {
  data = [];
  let isArrival = arrival ? 'ARRIVAL' : 'DEPARTURE';
  let currentTime = new Date();

  for (let i = 0; i < trains.length; i++) {
    if (
      trains[i].trainCategory === 'Long-distance' ||
      trains[i].trainCategory === 'Commuter'
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
          if (trains[i].trainCategory === 'Long-distance') {
            trainObject['number'] =
              trains[i].trainType + ' ' + trains[i].trainNumber;
          } else {
            trainObject['number'] =
              trains[i].commuterLineID + ' ' + trains[i].trainNumber;
          }

          trainObject['type'] = trains[i].trainType;
          trainObject['origin'] = getStationName(trains[i].timeTableRows[0].stationShortCode, stations);
          trainObject['destination'] = getStationName(trains[i].timeTableRows[trains[i].timeTableRows.length - 1].stationShortCode, stations);
          trainObject['time'] = scheduledTime;
          trainObject['cancelled'] = trains[i].timeTableRows[j].cancelled;
          trainObject['estimatedTime'] =
            trains[i].timeTableRows[j].liveEstimateTime === undefined
              ? ''
              : new Date(trains[i].timeTableRows[j].liveEstimateTime);

          data.push(trainObject);
        }
      }
    }
  }
};

const ResultTable = props => {
  const { classes } = props;

  parseData(props.trains, props.stations, props.currentStation, props.arrival);
  data.sort(compare);

  const items = data.map(data => (

    <tr key={data.number}>
      <td>{data.number}</td>
      <td>{data.origin}</td>
      <td>{data.destination}</td>
      <td>
        <table>
          <tbody>
            <tr className='estimatedTime'>
              {data.estimatedTime > data.time
                ? (data.estimatedTime.getHours() < 10 ? '0' : '') +
                  data.estimatedTime.getHours() +
                  ':' +
                  (data.estimatedTime.getMinutes() < 10 ? '0' : '') +
                  data.estimatedTime.getMinutes()
                : ''}
            </tr>
            <tr>
              {data.cancelled === true
                ? 'Cancelled'
                : (data.time.getHours() < 10 ? '0' : '') +
                  data.time.getHours() +
                  ':' +
                  (data.time.getMinutes() < 10 ? '0' : '') +
                  data.time.getMinutes()}
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  ));

  return (
    <table className='tableOfContents'>
      <tbody>
        <tr>
          <th>Juna</th>
          <th>Lähtöasema</th>
          <th>Pääteasema</th>
          <th>{props.arrival ? 'Saapuu' : 'Lähtee'}</th>
        </tr>
        {items}
      </tbody>
    </table>
  );
};

export default ResultTable;

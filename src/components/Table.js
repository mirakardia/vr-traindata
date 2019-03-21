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
import {parseTrainData, compare} from '../utilities/dataParsers';

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

const ResultTable = props => {
  const { classes } = props;
  let data = [];

  data = parseTrainData(props.trains, props.stations, props.currentStation, props.arrival);
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

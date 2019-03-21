import React from 'react';
import '../style/Table.css';
import { parseTrainData, compare } from '../utilities/dataParsers';

/*
 * @author Jesse Sydänmäki
 * Github: https://github.com/Pygmicaesar
 * 
 * A component for visualizing the fetched
 * train data in a handy table.
 */

const TrainTable = props => {
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

export default TrainTable;

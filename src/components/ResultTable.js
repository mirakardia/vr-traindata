import React from 'react';
import '../style/Table.css';

let data = [];
let stationNames = {};

function compare(a, b) {
    
    if (a.time < b.time) {
        return -1;
    } else if (a.time > b.time) {
        return 1;
    } else {
        return 0;
    }
}

const parseData = (trainList, currentStation, mov) => {

    data = [];
    let moving = (mov === 'Saapuu') ? 'ARRIVAL' : 'DEPARTURE';
    let currentTime = new Date();

    for (let i = 0; i < trainList.length; i++) {

        if (trainList[i].trainCategory === 'Long-distance' || trainList[i].trainsCategory === 'Commuter') {

            for (let j = 0; j < trainList[i].timeTableRows.length; j++) {

                let scheduledTime = new Date(trainList[i].timeTableRows[j].scheduledTime);
                if (trainList[i].timeTableRows[j].stationShortCode === stationNames[currentStation] &&
                    trainList[i].timeTableRows[j].type === moving &&
                    currentTime < scheduledTime) {
                    
                    let trainObject = {};
                    if (trainList[i].trainCategory === 'Long-distance') {
                        trainObject['number'] = trainList[i].trainType + ' ' + trainList[i].trainNumber;
                    } else {
                        trainObject['number'] = trainList[i].commuterLineID + ' ' + trainList[i].trainNumber;
                    }

                    trainObject['type'] = trainList[i].trainType;
                    trainObject['origin'] = getStationName(trainList[i].timeTableRows[0].stationShortCode);
                    trainObject['destination'] = getStationName(trainList[i].timeTableRows[trainList[i].timeTableRows.length-1].stationShortCode);
                    trainObject['time'] = scheduledTime;
                    trainObject['cancelled'] = trainList[i].timeTableRows[j].cancelled;
                    trainObject['estimatedTime'] = trainList[i].timeTableRows[j].liveEstimateTime === undefined ? "" : new Date(trainList[i].timeTableRows[j].liveEstimateTime);

                    data.push(trainObject);
                }
            }            
        }
    }
}

const getStationName = (shortCode) => {

    for (let key in stationNames) {
        if (stationNames[key] === shortCode) {
            return key;
        }
    }
}

const ResultTable = (props) => {

    stationNames = props.stationNames;
    parseData(props.trainList, props.currentStation, props.mov);
    data.sort(compare);

    const items = data.map((data) =>
        <tr key = {data.number}>
            <td>{data.number}</td>
            <td>{data.origin}</td>
            <td>{data.destination}</td>
            <td>
                <table>
                    <tbody>
                        <tr className = "estimatedTime">
                            {(data.estimatedTime > data.time ? (data.estimatedTime.getHours() < 10 ? '0' : '') + data.estimatedTime.getHours() + ':' + (data.estimatedTime.getMinutes() < 10 ? '0' : '') + data.estimatedTime.getMinutes() : '')}
                        </tr>
                        <tr>
                            {(data.cancelled === true ? 'Cancelled' : (data.time.getHours() < 10 ? '0' : '') + data.time.getHours() + ':' + (data.time.getMinutes() < 10 ? '0' : '') + data.time.getMinutes())}
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    );

    return(
        <table className = "tableOfContents">
            <tbody>
                <tr>
                    <th>Juna</th>
                    <th>Lähtöasema</th>
                    <th>Pääteasema</th>
                    <th>{props.mov}</th>
                </tr>
                    {items}
            </tbody>
        </table>
    );
}

export default ResultTable;
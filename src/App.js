import React, { Component } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import 'react-tabs/style/react-tabs.css';
import ResultTable from './components/ResultTable';

let stationNames = {};

function saveStations(response) {

    for (let i = 0; i < response.length; i++) {
        let split = response[i].stationName.split(' ');

        if (split[1] === 'asema') {
            stationNames[split[0]] = response[i].stationShortCode;
        } else {
            stationNames[response[i].stationName] = response[i].stationShortCode;
        }
    }
}

class App extends Component {

    state = {
        query: '',
        trainList: [],
        currentStation: "",
    };

    componentDidMount() {
        axios.get('https://rata.digitraffic.fi/api/v1/metadata/stations').then(function (result) {
            saveStations(result.data);
        })
    }

    handleFieldWrite = (query) => {
        this.setState({query});
        console.log({query});
    }

    onSearchSubmit = async (query) => {
        query = query.trim();

        let capitalized = query.charAt(0).toUpperCase() + query.slice(1).trim();
        const response = await axios
        .get('https://rata.digitraffic.fi/api/v1/live-trains/station/' + stationNames[capitalized] + 
        '?minutes_before_departure=420&minutes_after_departure=420&minutes_before_arrival=420&minutes_after_arrival=420');
        
        this.setState({trainList: response.data});
        this.setState({currentStation: capitalized});
    }

    render() { 

        return (
            <div>
                <Header/>
                <SearchBar
                    query = {this.state.query}
                    onFieldWrite = {this.handleFieldWrite}
                    onSubmit = {this.onSearchSubmit} />
                <Tabs className = "tabs">
                    <TabList>
                        <Tab>Saapuvat</Tab>
                        <Tab>Lähtevät</Tab>
                    </TabList>
                    <TabPanel>
                        <ResultTable 
                            trainList = {this.state.trainList} 
                            currentStation = {this.state.currentStation} 
                            stationNames = {stationNames}
                            mov = {'Saapuu'} />
                    </TabPanel>
                    <TabPanel>
                        <ResultTable 
                            trainList = {this.state.trainList} 
                            currentStation = {this.state.currentStation} 
                            stationNames = {stationNames}
                            mov = {'Lähtee'} />
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}
 
export default App;

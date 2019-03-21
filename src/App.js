import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Table from './components/Table';
import 'react-tabs/style/react-tabs.css';
import {getTrainsForStation, getStations} from './utilities/api.js';

const stationURL = 'https://rata.digitraffic.fi/api/v1/metadata/stations';
const trainURL = 'https://rata.digitraffic.fi/api/v1/live-trains/station/';
const parameter = '?minutes_before_departure=420&minutes_after_departure=420&minutes_before_arrival=420&minutes_after_arrival=420';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      trains: [],
      currentStation: '',
      stations: {},
    };
    this.saveStations = this.saveStations.bind(this);
  }

  async componentDidMount() {
    const result = await getStations(stationURL);
    this.saveStations(result.data);
  }

  handleQueryChange = (query) => {
    this.setState({ query: query });
  };

  saveStations = (data) => {
    for (let i = 0; i < data.length; i++) {
      const split = data[i].stationName.split(' ');

      if (split[1] === 'asema') {
        let stations = Object.assign({}, this.state.stations);
        stations[split[0]] = data[i].stationShortCode;
        this.setState({ stations });
      } else {
        let stations = Object.assign({}, this.state.stations);
        stations[data[i].stationName] = data[i].stationShortCode;
        this.setState({ stations });
      }
    }
  }

  submitSearch = async () => {
    const temp = this.state.query.trim();
    const capitalized = temp.charAt(0).toUpperCase() + temp.slice(1).trim();
    const station = this.state.stations[capitalized];

    const response = await getTrainsForStation(trainURL, station, parameter);

    this.setState({ trains: response.data });
    this.setState({ currentStation: capitalized });
  };

  render() {
    return (
      <div>
        <Header />
        <SearchBar
          query={this.state.query}
          handleQueryChange={this.handleQueryChange}
          onSubmit={this.submitSearch}
        />
        <Tabs className = 'tabs'>
          <TabList>
            <Tab>Saapuvat</Tab>
            <Tab>Lähtevät</Tab>
          </TabList>
          <TabPanel>
            <Table
              trains={this.state.trains}
              currentStation={this.state.currentStation}
              stations={this.state.stations}
              arrival={true}
            />
          </TabPanel>
          <TabPanel>
            <Table
              trains={this.state.trains}
              currentStation={this.state.currentStation}
              stations={this.state.stations}
              arrival={false}
            />
          </TabPanel>
        </Tabs>
      </div>
      
    );
  }
}

export default App;

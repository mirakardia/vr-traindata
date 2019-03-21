import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import TrainTable from './components/TrainTable';
import 'react-tabs/style/react-tabs.css';
import { getTrainsForStation, getStations } from './utilities/api.js';

/*
 * @author Jesse Sydänmäki
 * Github: https://github.com/Pygmicaesar
 */

// URLs and pieces thereof.
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
  }

  /* Fetch stations from the API when the component mounts.
   * Save the stations in component state with saveStations.
   * The axios function (getStations) used to handle the
   * HTTP request is imported from api.js in the 'utilities' folder.
   */ 
  async componentDidMount() {
    const result = await getStations(stationURL);
    this.saveStations(result.data);
  }

  // Handles saving the current query in the component state.
  handleQueryChange = query => {
    this.setState({ query: query });
  };

  /* Some of the station names have some ugly looking
   * parts like 'asema' etc. This method parses the
   * names to make them prettier in the table. It then
   * saves the stations in the component state.
   */
  saveStations = data => {
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

  /* Fetches a train list when the user submits their query.
   * The axios function (getTrainsForStation) used to handle 
   * the HTTP request is imported from api.js in the 'utilities' folder. 
   */
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
            <TrainTable
              trains={this.state.trains}
              currentStation={this.state.currentStation}
              stations={this.state.stations}
              arrival={true}
            />
          </TabPanel>
          <TabPanel>
            <TrainTable
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

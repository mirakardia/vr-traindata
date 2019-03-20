import React, { Component } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import 'react-tabs/style/react-tabs.css';
import ResultTable from './components/ResultTable';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      trains: [],
      currentStation: '',
      stations: {}
    };
    this.saveStations = this.saveStations.bind(this);
  }

  componentDidMount() {
    axios
      .get('https://rata.digitraffic.fi/api/v1/metadata/stations')
      .then(result => {
        this.saveStations(result.data);
      });
  }

  handleQueryChange = query => {
    this.setState({ query: query });
  };

  submitSearch = async () => {
    let temp = this.state.query.trim();

    let capitalized = temp.charAt(0).toUpperCase() + temp.slice(1).trim();
    const response = await axios.get(
      'https://rata.digitraffic.fi/api/v1/live-trains/station/' +
      this.state.stations[capitalized] +
      '?minutes_before_departure=420&minutes_after_departure=420&minutes_before_arrival=420&minutes_after_arrival=420'
    );

    this.setState({ trains: response.data });
    this.setState({ currentStation: capitalized });
  };

  saveStations(data) {
    for (let i = 0; i < data.length; i++) {
      let split = data[i].stationName.split(' ');

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

  render() {
    return (
      <div>
        <Header />
        <SearchBar
          query={this.state.query}
          handleQueryChange={this.handleQueryChange}
          onSubmit={this.submitSearch}
        />
        <Tabs className='tabs'>
          <TabList>
            <Tab>Saapuvat</Tab>
            <Tab>Lähtevät</Tab>
          </TabList>
          <TabPanel>
            <ResultTable
              trains={this.state.trains}
              currentStation={this.state.currentStation}
              stations={this.state.stations}
              arrival={true}
            />
          </TabPanel>
          <TabPanel>
            <ResultTable
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

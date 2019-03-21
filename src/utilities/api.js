import axios from "axios";

export const getTrainsForStation = (url, station, parameter) => {
  const response = axios.get(url + station + parameter);
  return response;
};

export const getStations = (url) => {
  return axios.get(url);
}




import axios from "axios";

/*
 * @author Jesse Sydänmäki
 * Github: https://github.com/Pygmicaesar
 * 
 * A file for storing functions that handle
 * communication with the API.
 * 
 */

export const getTrainsForStation = (url, station, parameter) => {
  return axios.get(url + station + parameter);
};

export const getStations = (url) => {
  return axios.get(url);
};




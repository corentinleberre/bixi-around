import { Request, Response } from "express";
import fetch from "node-fetch";
import {
  BixiAroundRequest,
  BixiAroundResponse,
  BixiStation,
} from "../model/bixi-around.model";
import getDistance from "geolib/es/getDistance";
import {
  StationInformation,
  StationsInformation,
} from "../model/station-api.model";
import { StationsStatus, StationStatusData } from "../model/status-api.model";

const bixiAround = async (req: Request, res: Response) => {
  const queryParams = req.query as unknown as BixiAroundRequest;
  if (queryParams.city && queryParams.lat && queryParams.lon) {
    const neareastStations: StationInformation[] = await fetch(
      "https://gbfs.velobixi.com/gbfs/fr/station_information.json"
    ).then(async (response) => {
      const stationsInformation: StationsInformation = await response.json();
      const neareastStations = stationsInformation.data.stations
        .map((station) => {
          return {
            ...station,
            distanceFromUser: getDistance(
              { latitude: queryParams.lat, longitude: queryParams.lon },
              { latitude: station.lat, longitude: station.lon }
            ),
          };
        })
        .sort((a, b) => a.distanceFromUser - b.distanceFromUser)
        .slice(0, 5);
      return neareastStations;
    });
    const stationsStatus: StationStatusData = await fetch(
      "https://gbfs.velobixi.com/gbfs/fr/station_status.json"
    ).then(async (response) => {
      const stationsStatus: StationsStatus = await response.json();
      return stationsStatus.data;
    });
    const results: BixiStation[] = neareastStations.map((station) => {
      return mapToBixiAroundResponse({
        ...station,
        ...stationsStatus.stations.find(
          (s) => s.station_id === station.station_id
        ),
      });
    });
    const response: BixiAroundResponse = {
      userParams: queryParams,
      stations: results,
    };
    return res.status(200).json(response);
  }
  res.statusCode = 400;
  return res.json({
    error: 400,
    info: "You must provide city, latitude and logitude.",
  });
};

const mapToBixiAroundResponse = (station): BixiStation => {
  return {
    id: station.station_id,
    name: station.name,
    coordinates: {
      lat: station.lat,
      lon: station.lon,
    },
    distanceFromUser: station.distanceFromUser,
    bikes: station.num_bikes_available,
    ebikes: station.num_ebikes_available,
    docks: station.num_docks_available,
  };
};

export { bixiAround };

import { Request, Response } from "express";
import fetch from "node-fetch";
import {
  BixiAroundRequest,
  BixiAroundResponse,
  BixiStation,
  ErrorResponse,
} from "./model/bixi-around.model";
import getDistance from "geolib/es/getDistance";
import { StationsInformation } from "./model/station-api.model";
import { StationsStatus } from "./model/status-api.model";

const nearestBixiStationsAroundApi = (
  req: Request,
  res: Response<BixiAroundResponse | ErrorResponse>
) => {
  const queryParams = req.query as unknown as BixiAroundRequest;
  if (queryParams.city && queryParams.lat && queryParams.lon) {
    const neareastStationsRequest: Promise<StationsInformation> = fetch(
      "https://gbfs.velobixi.com/gbfs/fr/station_information.json"
    ).then((response) => response.json());
    const stationsStatusRequest: Promise<StationsStatus> = fetch(
      "https://gbfs.velobixi.com/gbfs/fr/station_status.json"
    ).then((response) => response.json());

    return Promise.all([neareastStationsRequest, stationsStatusRequest]).then(
      (tuple) => {
        const [stationsInformations, stationsStatus] = [...tuple];
        const nearestStations = findNeareastStationsAroundUser(
          stationsInformations,
          queryParams
        );
        const completeNearestBixiStations: BixiStation[] =
          completeNearestStationsWithStatusInformations(
            nearestStations,
            stationsStatus
          );
        const response: BixiAroundResponse = {
          userParams: queryParams,
          stations: completeNearestBixiStations,
        };
        return res.status(200).json(response);
      }
    );
  }
  return res.status(400).json({
    info: "You must provide city, latitude and logitude.",
  } as ErrorResponse);
};

const findNeareastStationsAroundUser = (
  stationsInformation: any,
  queryParams: BixiAroundRequest
) => {
  const nearestStations = stationsInformation.data.stations
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
  return nearestStations;
};

function completeNearestStationsWithStatusInformations(
  neareastStations: any,
  stationsStatus: StationsStatus
): BixiStation[] {
  return neareastStations.map((station) => {
    return mapToBixiAroundResponse({
      ...station,
      ...stationsStatus.data.stations.find(
        (s) => s.station_id === station.station_id
      ),
    });
  });
}

const mapToBixiAroundResponse = (station: any): BixiStation => {
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

export default nearestBixiStationsAroundApi;

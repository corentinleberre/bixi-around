import { Request, Response } from "express";
import fetch from "node-fetch";
import {
  BixiAroundRequest,
  BixiAroundResponse,
  BixiStation,
  ErrorResponse,
} from "./model/bixi-around.model";
import getDistance from "geolib/es/getDistance";
import {
  StationInformation,
  StationsInformation,
} from "./model/station-api.model";
import { StationsStatus } from "./model/status-api.model";

const nearestBixiStationsAroundApi = (
  req: Request,
  res: Response<BixiAroundResponse | ErrorResponse>
) => {
  const queryParams = req.query as unknown as BixiAroundRequest;
  if (queryParams.city && queryParams.lat && queryParams.lon) {
    const bixiApiUrl = "https://gbfs.velobixi.com/gbfs/fr";
    const neareastStationsRequest: Promise<StationsInformation> = fetch(
      `${bixiApiUrl}/station_information.json`
    ).then((res) => res.json());
    const stationsStatusRequest: Promise<StationsStatus> = fetch(
      `${bixiApiUrl}/station_status.json`
    ).then((res) => res.json());

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
        return res.status(200).json({
          userParams: queryParams,
          stations: completeNearestBixiStations,
        } as BixiAroundResponse);
      }
    );
  }
  return res.status(400).json({
    info: "You must provide city, latitude and logitude.",
  } as ErrorResponse);
};

const findNeareastStationsAroundUser = (
  stationsInformation: StationsInformation,
  queryParams: BixiAroundRequest
): Array<StationInformation> => {
  return stationsInformation.data.stations
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
};

const completeNearestStationsWithStatusInformations = (
  neareastStations: any,
  stationsStatus: StationsStatus
): Array<BixiStation> => {
  return neareastStations.map((station) =>
    mapToBixiAroundResponse({
      ...station,
      ...stationsStatus.data.stations.find(
        (s) => s.station_id === station.station_id
      ),
    })
  );
};

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

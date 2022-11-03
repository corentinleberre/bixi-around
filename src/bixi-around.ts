import { Request, Response } from "express";
import fetch from "node-fetch";
import {
  ClientRequest,
  ClientResponse,
  BixiStation,
  ErrorResponse,
} from "./model/bixi-around.model";
import getDistance from "geolib/es/getDistance";
import {
  StationInformation,
  StationsInformation,
} from "./model/station-api.model";
import { StationsStatus } from "./model/status-api.model";
import { citiesGbfsUrl } from "./utils/cities";
import { mapToBixiStation } from "./utils/mapper";

const nearestBixiStationsAroundApi = (
  req: Request<{}, {}, {}, ClientRequest>,
  res: Response<ClientResponse | ErrorResponse>
) => {
  const queryParams = req.query as unknown as ClientRequest;
  if (
    queryParams.city &&
    queryParams.lat &&
    queryParams.lon &&
    queryParams.nbResult
  ) {
    const apiUrl = citiesGbfsUrl[queryParams.city];
    const neareastStationsRequest: Promise<StationsInformation> = fetch(
      `${apiUrl}/station_information.json`
    ).then((res) => res.json());
    const stationsStatusRequest: Promise<StationsStatus> = fetch(
      `${apiUrl}/station_status.json`
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
        } as ClientResponse);
      }
    );
  }
  return res.status(400).json({
    info: "You must provide city, latitude, logitude and number of results expected.",
  } as ErrorResponse);
};

const findNeareastStationsAroundUser = (
  stationsInformation: StationsInformation,
  queryParams: ClientRequest
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
    .slice(0, queryParams.nbResult);
};

const completeNearestStationsWithStatusInformations = (
  neareastStations: any,
  stationsStatus: StationsStatus
): Array<BixiStation> => {
  return neareastStations.map((station) =>
    mapToBixiStation({
      ...station,
      ...stationsStatus.data.stations.find(
        (s) => s.station_id === station.station_id
      ),
    })
  );
};

export default nearestBixiStationsAroundApi;

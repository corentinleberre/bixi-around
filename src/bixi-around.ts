import { Request, Response } from "express";
import fetch from "node-fetch";
import { BikeAroundRequest } from "./model/bixi-around.model";
import getDistance from "geolib/es/getDistance";
import { StationsInformation } from "./model/api.model";

const bixiAround = async (req: Request, res: Response) => {
  const queryParams = req.query as unknown as BikeAroundRequest;
  console.log(queryParams);
  if (queryParams.city && queryParams.lat && queryParams.long) {
    res.statusCode = 200;
    return await fetch(
      "https://gbfs.velobixi.com/gbfs/fr/station_information.json"
    ).then(async (response) => {
      const stationsInformation: StationsInformation = await response.json();
      const neareastStations = stationsInformation.data.stations
        .map((station) => {
          return {
            ...station,
            distanceFromUser: getDistance(
              { latitude: queryParams.lat, longitude: queryParams.long },
              { latitude: station.lat, longitude: station.lon }
            ),
          };
        })
        .sort((a, b) => a.distanceFromUser - b.distanceFromUser)
        .slice(0, 5);
      return res.json({
        queryParams,
        neareastStations,
      });
    });
  }
  res.statusCode = 400;
  return res.json({
    error: 400,
    info: "You must provide city, latitude and logitude.",
  });
};

export { bixiAround };

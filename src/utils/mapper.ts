import { BixiStation } from "../model/bixi-around.model";

const mapToBixiStation = (station: any): BixiStation => {
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

export { mapToBixiStation };

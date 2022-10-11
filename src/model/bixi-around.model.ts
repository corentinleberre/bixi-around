interface BixiAroundRequest {
  city: string;
  lat: string;
  lon: string;
}

interface BixiAroundResponse {
  userParams: BixiAroundRequest;
  stations: BixiStation[];
}

interface BixiStation {
  id: string;
  name: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  distanceFromUser: string;
  bikes: number;
  ebikes: number;
  docks: number;
}

export { BixiAroundRequest, BixiAroundResponse, BixiStation };

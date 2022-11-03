import { Cities } from "./cities.model";

interface ClientRequest {
  city: Cities;
  lat: string;
  lon: string;
  nbResult: number;
}

interface ClientResponse {
  userParams: ClientRequest;
  stations: Array<BixiStation>;
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

interface ErrorResponse {
  info: string;
}

export { ClientRequest, ClientResponse, BixiStation, ErrorResponse };

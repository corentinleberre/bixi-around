export interface EightdStationService {
  id: string;
  service_type: string;
  bikes_availability: string;
  docks_availability: string;
  name: string;
  description: string;
  schedule_description: string;
  link_for_more_info: string;
}

export interface StationInformation {
  station_id: string;
  external_id: string;
  name: string;
  short_name: string;
  lat: number;
  lon: number;
  rental_methods: Array<string>;
  capacity: number;
  electric_bike_surcharge_waiver: boolean;
  is_charging: boolean;
  eightd_has_key_dispenser: boolean;
  eightd_station_services: Array<EightdStationService>;
  has_kiosk: boolean;
  distanceFromUser?: number;
}

export interface StationInformationData {
  stations: Array<StationInformation>;
}

export interface StationsInformation {
  last_updated: number;
  ttl: number;
  data: StationInformationData;
}

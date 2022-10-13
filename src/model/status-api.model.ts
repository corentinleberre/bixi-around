export interface EightdActiveStationService {
  id: string;
}

export interface StationStatus {
  station_id: string;
  num_bikes_available: number;
  num_ebikes_available: number;
  num_bikes_disabled: number;
  num_docks_available: number;
  num_docks_disabled: number;
  is_installed: number;
  is_renting: number;
  is_returning: number;
  last_reported: number;
  eightd_has_available_keys: boolean;
  is_charging: boolean;
  eightd_active_station_services: Array<EightdActiveStationService>;
}

export interface StationStatusData {
  stations: Array<StationStatus>;
}

export interface StationsStatus {
  last_updated: number;
  ttl: number;
  data: StationStatusData;
}

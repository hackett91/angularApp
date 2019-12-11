export interface BikeStationModel {
    number: number;
    contract_name: string;
    name: string;
    address: string;
    position: {
        lat: number,
        lng: number
    };
    banking: boolean;
    bonus: boolean;
    bike_stands: number;
    available_bike_stands: number;
    available_bikes: number;
    status: string;
    last_update: bigint;
}

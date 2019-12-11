import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BikeStationModel} from './dublin-bike.model';
import {Observable} from 'rxjs';
import * as L from 'leaflet';

@Injectable({
    providedIn: 'root'
})

export class MapService {
    private bikeUrl = 'https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=36b6666afea774b4bc97df9f52ef2f466e1502f7';
    private luasUrl = 'https://www.irish-transit.com/luasstops/?format=json';
    constructor(private http: HttpClient ) {
    }

    addBikeMarkers(map: L.map): void {
        this.http.get<BikeStationModel[]>(this.bikeUrl)
            .subscribe((bikeStops: BikeStationModel[]) => {
                bikeStops.map(bike => {
                    L.marker([bike.position.lat, bike.position.lng]).addTo(map);
                });
            });
    }

    addLuasMarkers(map: L.map): void {
        this.http.get(this.luasUrl)
            .subscribe((luasStops: any) => {
                luasStops.map(luas => {
                    L.marker([luas.point.coordinates[1], luas.point.coordinates[0]]).addTo(map);
                });
            });

    }
}

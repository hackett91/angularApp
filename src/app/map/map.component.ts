import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import {GeoSearchControl, OpenStreetMapProvider} from 'leaflet-geosearch';
import {MapService} from './map.service';
import 'leaflet-draw';
import 'leaflet-providers';
import 'leaflet-styleeditor';
import 'leaflet-ajax';
import 'leaflet.awesome-markers';
import 'beautifymarker';
import 'leaflet-routing-machine';
import 'leaflet.markercluster';
import 'leaflet.featuregroup.subgroup';
// inspiration taking from https://alligator.io/angular/angular-and-leaflet-marker-service/
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = iconDefault;
const provider = new OpenStreetMapProvider();
const searchControl = new GeoSearchControl({
  provider: provider,                               // required
  style: 'button',
  showMarker: true,                                   // optional: true|false  - default true
  showPopup: false,                                   // optional: true|false  - default false
  marker: {                                           // optional: L.Marker    - default L.Icon.Default
    icon: new L.Icon.Default(),
    draggable: false,
  },
  popupFormat: ({ query, result }) => result.label,   // optional: function    - default returns result label
  maxMarkers: 1,                                      // optional: number      - default 1
  retainZoomLevel: false,                             // optional: true|false  - default false
  animateZoom: true,                                  // optional: true|false  - default true
  autoClose: false,                                   // optional: true|false  - default false
  searchLabel: 'Enter address',                       // optional: string      - default 'Enter address'
  keepResult: false                                   // optional: true|false  - default false
});
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map;
  constructor(private mapService: MapService) {

  }

  ngAfterViewInit(): void {
    this.initMap();
    // this.mapService.addBikeMarkers(this.map);
    // this.mapService.addLuasMarkers(this.map);
  }

  private latLngToArrayString(ll) {
    return "["+ll.lat.toFixed(5)+", "+ ll.lng.toFixed(5)+"]";

  }
  private returnCafe(json, latlng) {
    var att = json.properties;
    return L.circleMarker(latlng, {radius:10, color:'green'}).bindPopup("<h4>Cafe: "+att.name+"</h4>");
  }

  private returnBar(json, latlng) {
      var att = json.properties;
      return L.circleMarker(latlng, {radius:10, color:'blue'}).bindPopup("<h4>Bar: "+att.name+"</h4>");
  }

  private returnRestraurant(json, latlng) {
      var att = json.properties;
      return L.circleMarker(latlng, {radius:10, color:'yellow'}).bindPopup("<h4>Restraurants: "+att.name+"<br> Cuisine"+att.cuisine+"</h4>");
  }

    private openEvent(event){
      console.log(event);
    }

  private initMap(): void {
    this.map = L.map('map', {
        center: [53.350140, -6.266155],
        zoom: 13
    });

    var markerCurrentLocation = null;
    var popPhoenixPark;
    var lyrOSM;
    var lyrWatercolor;
    var lyrTopo;
    var lyrImagery;
    var ctrlLayers;
    var objBasemaps;
    var objOverLays;
    var lyrCafes;
    var polyParks;
    var fgpChapultepec;
    var ctrlDraw;
    var fgpDrawItems;
    var ctrlStyle;
    var lyrBars;
    var lyrRestraurants;
    var lyrMarkerCluster;
    var subgroup;

    lyrOSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
    lyrWatercolor = L.tileLayer.provider('Stamen.Watercolor');
    lyrTopo = L.tileLayer.provider('OpenTopoMap');
    lyrImagery = L.tileLayer.provider('Esri.WorldImagery');
    this.map.addLayer(lyrOSM);

    fgpDrawItems = L.featureGroup([]).addTo(this.map);
    lyrCafes = L.geoJSON.ajax('https://info-sys-app-backend.herokuapp.com/cafes',{pointToLayer:this.returnCafe});
    lyrBars = L.geoJSON.ajax('https://info-sys-app-backend.herokuapp.com/bars',{pointToLayer:this.returnBar});
    lyrRestraurants = L.geoJSON.ajax('https://info-sys-app-backend.herokuapp.com/restraurants',{pointToLayer:this.returnRestraurant});


    lyrMarkerCluster =  L.markerClusterGroup();
    subgroup = L.featureGroup.subGroup(lyrMarkerCluster,[lyrBars, lyrRestraurants, lyrCafes]);

    lyrRestraurants.on('data:loaded', () => {
      lyrMarkerCluster.addTo(this.map);
      subgroup.addTo(this.map);
    });

    objBasemaps = {
      "Open Street Map": lyrOSM,
      "Topo Map": lyrTopo,
      "Imagery": lyrImagery,
      "Watercolor": lyrWatercolor
    };
    objOverLays = {
      'Clusters': lyrMarkerCluster,
      'Draw Items': fgpDrawItems,
    };

    ctrlLayers = L.control.layers(objBasemaps, objOverLays).addTo(this.map);
    ctrlDraw = new L.Control.Draw({
      draw: {
        circle:false
      },
      edit: {
        featureGroup: fgpDrawItems
      }
    });
    ctrlDraw.addTo(this.map);
    this.map.on('draw:created', (event) => {
      console.log(event);
      fgpDrawItems.addLayer(event.layer);
    });

    ctrlStyle = L.control.styleEditor({position:'topright'}).addTo(this.map);

    popPhoenixPark = L.popup({maxWidth:200});
    popPhoenixPark.setLatLng([53.349424, -6.29714]);
    popPhoenixPark.setContent("<h2>Phoenix Park</h2><img src='assets/images/phoenix.jpg' width='200px'>");

    // setInterval(() => {
    //   this.map.locate();
    // }, 5000);

    // this.map.on('click', (e) =>  {
    //     if(e.originalEvent.shiftKey) {
    //       alert(this.map.getZoom());
    //     } else {
    //       alert(e.latlng.toString());
    //       console.log(L);
    //     }
    // // });
    var destLat;
    var destLng;
    var srcLat;
    var srcLng;

    this.map.on('dblclick', (e) => {
      destLat = e.latlng.lat;
      destLng = e.latlng.lng;
      L.marker(e.latlng).addTo(this.map);
      if(confirm("Do you want to travel here?")){
        this.map.locate();
      }
    } );
    //
    // this.map.on('keypress', (e) => {
    //   if(e.originalEvent.key=="l") {
    //     this.map.locate();
    //   }
    // });
    // mrkMuseum.on('dragend', (e) =>
    //   mrkMuseum.setTooltipContent("Current Location: "+mrkMuseum.getLatLng().toString()+
    //   "<br>"+"Distance to Museum:"+ mrkMuseum.getLatLng().distanceTo([53.3420246,-6.2564647]).toFixed(0))
    // );


    // this.map.on('mousemove', (e) => {
    //   document.getElementById('zoom').innerHTML = this.latLngToArrayString(e.latlng);
    // });



    // subgroup.on('click', (e) => {
    //   console.log(e);
    //
    // });

    var route = null;
    this.map.on('locationfound', (e) => {
      if(markerCurrentLocation != null) {
        markerCurrentLocation.remove();
      }
      if(route != null){
        route.remove();
      }
      markerCurrentLocation = L.circle(e.latlng, {radius:5}).addTo(this.map);
      this.map.setView(e.latlng, 14);
        route =  L.Routing.control({
            waypoints: [
              L.latLng(e.latlng.lat, e.latlng.lng),
              L.latLng(destLat, destLng)
            ], closeButton: true, input: true, geocoder: true
          })
          route.addTo(this.map);
  });

    this.map.on('locationerror', (e) => {
      console.log(e);
      alert("Location was not found");
  });

  document.getElementById("getLocation").addEventListener('click', () => {
    this.map.locate();
  });

  document.getElementById("openPopUpPhoenix").addEventListener('click', () => {
    this.map.setView([53.349424, -6.29714], 17);
    this.map.openPopup(popPhoenixPark);

  });

  document.getElementById("addBars").addEventListener('click', () => {
    if(subgroup.hasLayer(lyrBars)){
      subgroup.removeLayer(lyrBars);
      document.getElementById("addBars").innerHTML = "Add Bars";
    } else {
      subgroup.addLayer(lyrBars);
      document.getElementById("addBars").innerHTML = "Remove Bars";
    }
  });

    document.getElementById("addRestaurants").addEventListener('click', () => {
      if(subgroup.hasLayer(lyrRestraurants)){
        subgroup.removeLayer(lyrRestraurants);
        document.getElementById("addRestaurants").innerHTML = "Add Restaurants";
      } else {
        subgroup.addLayer(lyrRestraurants);
        document.getElementById("addRestaurants").innerHTML = "Remove Restaurants";
      }
    });

    document.getElementById("addCafes").addEventListener('click', () => {
      if(subgroup.hasLayer(lyrCafes)){
        subgroup.removeLayer(lyrCafes);
        document.getElementById("addCafes").innerHTML = "Add Cafes";
      } else {
        subgroup.addLayer(lyrCafes);
        document.getElementById("addCafes").innerHTML = "Remove Cafes";
      }
    });

  this.map.addControl(searchControl);
}

}

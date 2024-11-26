import { Injectable, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapacliService implements OnDestroy {
  map!: L.Map;
  clientMarker!: L.Marker;

 
  clientCoordinates = { lat: -33.4489, lng: -70.6631 }; 

  constructor() { }

  initializeMap(containerId: string) {
    
    this.map = L.map(containerId).setView([this.clientCoordinates.lat, this.clientCoordinates.lng], 10);

   
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    
    this.clientMarker = L.marker([this.clientCoordinates.lat, this.clientCoordinates.lng])
      .addTo(this.map)
      .bindPopup("Cliente")
      .openPopup(); 
  }

  ngOnDestroy() {
  
    if (this.map) {
      this.map.remove();
    }
  }
}

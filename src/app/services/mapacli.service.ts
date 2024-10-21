import { Injectable, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapacliService implements OnDestroy {
  map!: L.Map;
  clientMarker!: L.Marker;

  // Coordenadas iniciales del cliente
  clientCoordinates = { lat: -33.4489, lng: -70.6631 }; // Coordenadas iniciales del cliente

  constructor() { }

  initializeMap(containerId: string) {
    // Inicializar el mapa centrado en las coordenadas del cliente
    this.map = L.map(containerId).setView([this.clientCoordinates.lat, this.clientCoordinates.lng], 10);

    // Añadir la capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Añadir el marcador del cliente
    this.clientMarker = L.marker([this.clientCoordinates.lat, this.clientCoordinates.lng])
      .addTo(this.map)
      .bindPopup("Cliente")
      .openPopup(); // Muestra el popup automáticamente
  }

  ngOnDestroy() {
    // Limpiar el mapa cuando el servicio sea destruido
    if (this.map) {
      this.map.remove();
    }
  }
}

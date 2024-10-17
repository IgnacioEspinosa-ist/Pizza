import { Injectable, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapaService implements OnDestroy {
  map!: L.Map;
  deliveryPerson1Marker!: L.Marker;
  deliveryPerson2Marker!: L.Marker;

  deliveryPerson1Coordinates = { lat: -33.4489, lng: -70.6631 };
  deliveryPerson2Coordinates = { lat: -33.4248, lng: -70.6058 };
  private intervalId!: number;

  constructor() { }

  initializeMap(containerId: string) {
    this.map = L.map(containerId).setView([-33.4372, -70.6506], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.deliveryPerson1Marker = L.marker([this.deliveryPerson1Coordinates.lat, this.deliveryPerson1Coordinates.lng])
      .addTo(this.map)
      .bindPopup("Repartidor 1");

    this.deliveryPerson2Marker = L.marker([this.deliveryPerson2Coordinates.lat, this.deliveryPerson2Coordinates.lng])
      .addTo(this.map)
      .bindPopup("Repartidor 2");

    this.startMovingDeliveryPersons();
  }

  startMovingDeliveryPersons() {
    this.intervalId = window.setInterval(() => {
      this.deliveryPerson1Coordinates.lat += (Math.random() - 0.5) * 0.01;
      this.deliveryPerson1Coordinates.lng += (Math.random() - 0.5) * 0.01;
      this.deliveryPerson1Marker.setLatLng([this.deliveryPerson1Coordinates.lat, this.deliveryPerson1Coordinates.lng]);

      this.deliveryPerson2Coordinates.lat += (Math.random() - 0.5) * 0.01;
      this.deliveryPerson2Coordinates.lng += (Math.random() - 0.5) * 0.01;
      this.deliveryPerson2Marker.setLatLng([this.deliveryPerson2Coordinates.lat, this.deliveryPerson2Coordinates.lng]);
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    // Opcionalmente, puedes limpiar el mapa aquí
    // this.map.remove(); // Esto puede ser útil si el servicio se destruye
  }
}

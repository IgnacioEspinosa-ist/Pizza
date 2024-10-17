import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit {
  map!: L.Map;
  clientMarker!: L.Marker;

  // Coordenadas iniciales del cliente
  clientCoordinates = { lat: -33.4489, lng: -70.6631 }; // Puedes modificar estas coordenadas para la ubicación inicial del cliente

  constructor() { }

  ngAfterViewInit() {
    // Inicializar el mapa
    this.map = L.map('map').setView([this.clientCoordinates.lat, this.clientCoordinates.lng], 10);

    // Añadir capa de azulejos de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/%7Bz%7D/%7Bx%7D/%7By%7D.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Inicializar el marcador del cliente
    this.clientMarker = L.marker([this.clientCoordinates.lat, this.clientCoordinates.lng])
      .addTo(this.map)
      .bindPopup("Cliente");

    // Iniciar la simulación del movimiento
    this.startMovingClient();
  }

  startMovingClient() {
    setInterval(() => {
      // Simular movimiento para el cliente
      this.clientCoordinates.lat += (Math.random() - 0.5) * 0.01; // Movimiento aleatorio
      this.clientCoordinates.lng += (Math.random() - 0.5) * 0.01; // Movimiento aleatorio
      this.clientMarker.setLatLng([this.clientCoordinates.lat, this.clientCoordinates.lng]);
    }, 1000); // Actualiza cada segundo
  }
}
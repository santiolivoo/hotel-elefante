'use client'

import { useEffect, useRef } from 'react'

// Coordenadas del Hotel Elefante en San Lorenzo, Salta
const HOTEL_LOCATION = {
  lat: -24.727880622902873,
  lng: -65.51385091210109,
}

export function HotelMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined' || !mapRef.current) return

    // Evitar reinicializar el mapa
    if (mapInstanceRef.current) return

    // Cargar Leaflet dinámicamente
    const initMap = async () => {
      // @ts-ignore
      const L = window.L

      if (!L) {
        console.error('Leaflet no está cargado')
        return
      }

      // Crear el mapa
      const map = L.map(mapRef.current).setView([HOTEL_LOCATION.lat, HOTEL_LOCATION.lng], 15)

      // Agregar capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Crear un ícono personalizado para el hotel
      const hotelIcon = L.divIcon({
        html: `
          <div style="
            background-color: #748067;
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-size: 20px;
              font-weight: bold;
            ">🏨</span>
          </div>
        `,
        className: 'custom-hotel-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      })

      // Agregar marcador
      const marker = L.marker([HOTEL_LOCATION.lat, HOTEL_LOCATION.lng], {
        icon: hotelIcon,
      }).addTo(map)

      // Agregar popup
      marker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #748067;">
            🏨 Hotel Elefante
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #666;">
            San Lorenzo, Salta<br/>
            Cerca del Cerro Elefante
          </p>
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}" 
            target="_blank"
            rel="noopener noreferrer"
            style="
              display: inline-block;
              padding: 6px 12px;
              background-color: #748067;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
            "
          >
            Cómo llegar →
          </a>
        </div>
      `)

      // Abrir el popup automáticamente
      marker.openPopup()

      mapInstanceRef.current = map
    }

    // Pequeño delay para asegurar que Leaflet está cargado
    const timer = setTimeout(initMap, 100)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border shadow-md">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  )
}

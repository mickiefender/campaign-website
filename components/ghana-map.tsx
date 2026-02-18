'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    google: any
  }
}

interface GhanaMapProps {
  className?: string
}

export function GhanaMap({ className = '' }: GhanaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainer.current) return
    
    // Check if Google Maps is loaded
    if (!window.google) {
      console.log('[v0] Google Maps API not loaded yet. Make sure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set.')
      return
    }
    
    setMapLoaded(true)

    // Initialize map centered on Ghana
    const mapOptions = {
      zoom: 6,
      center: { lat: 7.3697, lng: -5.6789 }, // Center of Ghana
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: false,
    }

    map.current = new window.google.maps.Map(mapContainer.current, mapOptions)

    // Define Ghana's major regions with coordinates
    const regions = [
      { name: 'Ashanti', lat: 6.6289, lng: -1.6242, campaigns: 85 },
      { name: 'Greater Accra', lat: 5.6037, lng: -0.1870, campaigns: 120 },
      { name: 'Western', lat: 5.4164, lng: -2.3355, campaigns: 65 },
      { name: 'Eastern', lat: 6.2406, lng: -0.7969, campaigns: 72 },
      { name: 'Northern', lat: 10.2969, lng: -0.8637, campaigns: 58 },
      { name: 'Upper East', lat: 10.7595, lng: -0.8554, campaigns: 42 },
      { name: 'Upper West', lat: 10.3637, lng: -2.3285, campaigns: 38 },
      { name: 'Volta', lat: 7.4197, lng: 0.6455, campaigns: 55 },
      { name: 'Central', lat: 5.1937, lng: -1.2548, campaigns: 68 },
      { name: 'Bono', lat: 7.7456, lng: -2.6350, campaigns: 52 },
      { name: 'Ahafo', lat: 6.8000, lng: -3.2000, campaigns: 45 },
      { name: 'Bono East', lat: 8.0000, lng: -0.5000, campaigns: 40 },
      { name: 'North East', lat: 10.8905, lng: -0.2417, campaigns: 35 },
      { name: 'Oti', lat: 8.5, lng: 0.5, campaigns: 48 },
      { name: 'Savanna', lat: 10.8069, lng: -1.7589, campaigns: 32 },
      { name: 'West-North', lat: 9.5, lng: -3.0, campaigns: 30 },
    ]

    // Add markers for each region
    regions.forEach((region) => {
      const marker = new window.google.maps.Marker({
        position: { lat: region.lat, lng: region.lng },
        map: map.current,
        title: region.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#ef4444',
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      })

      // Add info window on marker click
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="font-weight: bold; color: #111827; margin: 0; margin-bottom: 8px;">${region.name}</h3>
            <p style="font-size: 14px; color: #4b5563; margin: 0; margin-bottom: 4px;">Campaign Events: <span style="font-weight: 600; color: #dc2626;">${region.campaigns}+</span></p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">Strong community engagement and grassroots presence</p>
          </div>
        `,
      })

      marker.addListener('click', () => {
        infoWindow.open(map.current, marker)
      })
    })
  }, [])

  return (
    <div className={`w-full h-96 md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-white/20 ${className}`}>
      <div
        ref={mapContainer}
        className="w-full h-full"
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white rounded-xl">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Google Maps API Key Required</p>
            <p className="text-sm text-gray-300">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables in the Vars section</p>
          </div>
        </div>
      )}
    </div>
  )
}

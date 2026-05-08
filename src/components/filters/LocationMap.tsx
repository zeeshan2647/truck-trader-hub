import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons (Vite + leaflet)
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function Recenter({ lat, lng, radius }: { lat: number; lng: number; radius: number }) {
  const map = useMap();
  useEffect(() => {
    // zoom roughly based on radius
    const z = radius <= 25 ? 9 : radius <= 50 ? 8 : radius <= 100 ? 7 : radius <= 250 ? 6 : 5;
    map.setView([lat, lng], z);
  }, [lat, lng, radius, map]);
  return null;
}

export function LocationMap({
  lat,
  lng,
  radius,
}: {
  lat: number;
  lng: number;
  radius: number;
}) {
  const radiusMeters = useMemo(() => radius * 1609.34, [radius]);
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={7}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon} />
      <Circle
        center={[lat, lng]}
        radius={radiusMeters}
        pathOptions={{ color: "#1d4ed8", fillColor: "#3b82f6", fillOpacity: 0.15 }}
      />
      <Recenter lat={lat} lng={lng} radius={radius} />
    </MapContainer>
  );
}
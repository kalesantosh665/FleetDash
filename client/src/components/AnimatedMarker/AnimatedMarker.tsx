import { memo, useEffect, useMemo, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import type { DivIcon, Marker as LeafletMarker } from "leaflet";
import type { Vehicle } from "../../types/vehicle";

interface AnimatedMarkerProps {
  vehicle: Vehicle;
  icon: DivIcon;
  markerRef?: (marker: LeafletMarker | null) => void;
  onClick: (vehicle: Vehicle) => void;
}

function AnimatedMarker({
  vehicle,
  icon,
  markerRef,
  onClick,
}: AnimatedMarkerProps) {
  const localMarkerRef = useRef<LeafletMarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  // Keep React-Leaflet from applying each telemetry position directly.
  // Marker movement is controlled exclusively by the animation effect below.
  const initialPositionRef = useRef<[number, number]>([
    vehicle.lat,
    vehicle.lng,
  ]);

  useEffect(() => {
    const marker = localMarkerRef.current;
    if (!marker) return;

    // When socket data arrives mid-animation, start at the marker's visible
    // position rather than an old telemetry point to prevent a visual jump.
    const visiblePosition = marker.getLatLng();
    const start = { lat: visiblePosition.lat, lng: visiblePosition.lng };
    const end = { lat: vehicle.lat, lng: vehicle.lng };

    if (start.lat === end.lat && start.lng === end.lng) {
      return;
    }

    const duration = Math.max(250, Math.min(1_000, vehicle.speed * 12));
    const startedAt = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const lat = start.lat + (end.lat - start.lat) * easedProgress;
      const lng = start.lng + (end.lng - start.lng) * easedProgress;
      marker.setLatLng([lat, lng]);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    if (animationFrameRef.current !== null)
      cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [vehicle.lat, vehicle.lng, vehicle.speed]);

  const statusLabel = useMemo(() => {
    if (vehicle.speed > 80) return "Overspeed";
    return vehicle.status === "Running" ? "Running" : "Stopped";
  }, [vehicle.speed, vehicle.status]);

  const speedColor = useMemo(() => {
    if (vehicle.speed > 80) return "#ef4444";
    if (vehicle.speed > 50) return "#f59e0b";
    return "#22c55e";
  }, [vehicle.speed]);

  return (
    <Marker
      ref={(marker) => {
        localMarkerRef.current = marker;
        markerRef?.(marker);
        marker?.setZIndexOffset(1_000);
      }}
      position={initialPositionRef.current}
      icon={icon}
      alt={`${vehicle.name}, ${statusLabel}`}
      eventHandlers={{ click: () => onClick(vehicle) }}
    >
      <Popup className="fleet-popup">
        <article className="popup-card" aria-label={`${vehicle.name} details`}>
          <header className="popup-header">
            <div>
              <h3>{vehicle.name}</h3>
              <small>Vehicle ID: {vehicle.id}</small>
            </div>
            <span className="popup-status">{statusLabel}</span>
          </header>
          <div className="popup-row">
            <span>Driver</span>
            <strong>{vehicle.driver}</strong>
          </div>
          <div className="popup-row">
            <span>Speed</span>
            <strong style={{ color: speedColor }}>{vehicle.speed} km/h</strong>
          </div>
          <div className="popup-row">
            <span>Fuel</span>
            <strong>{vehicle.fuel}%</strong>
          </div>
          <div className="popup-row">
            <span>Battery</span>
            <strong>{vehicle.battery}%</strong>
          </div>
          <div className="popup-row">
            <span>Location</span>
            <strong>
              {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}
            </strong>
          </div>
          <footer className="popup-footer">
            <small>Live telemetry</small>
          </footer>
        </article>
      </Popup>
    </Marker>
  );
}

export default memo(
  AnimatedMarker,
  (previous, next) =>
    previous.vehicle.id === next.vehicle.id &&
    previous.vehicle.name === next.vehicle.name &&
    previous.vehicle.driver === next.vehicle.driver &&
    previous.vehicle.lat === next.vehicle.lat &&
    previous.vehicle.lng === next.vehicle.lng &&
    previous.vehicle.speed === next.vehicle.speed &&
    previous.vehicle.status === next.vehicle.status &&
    previous.vehicle.fuel === next.vehicle.fuel &&
    previous.vehicle.battery === next.vehicle.battery &&
    previous.icon === next.icon,
);

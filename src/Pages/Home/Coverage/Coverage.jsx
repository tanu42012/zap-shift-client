import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useLoaderData } from 'react-router';

// Fix Leaflet default icon issue
let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper Component to fly to district
function FlyToDistrict({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 12, { duration: 1.5 });
  }
  return null;
}

const Coverage = () => {
  const serviceCenters = useLoaderData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoords, setSelectedCoords] = useState(null);
  const markerRefs = useRef([]);

  const handleSearch = () => {
    const match = serviceCenters.find((d) =>
      d.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (match) {
      setSelectedCoords([match.latitude, match.longitude]);
      const marker = markerRefs.current.find(
        (m) => m?.district === match.district
      );
      marker?.ref?.openPopup();
    } else {
      alert('District not found');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center">📍 Our Coverage Areas</h1>
      <h1 className="text-2xl font-semibold text-center">
        We are covering 64 Districts
      </h1>

      {/* Search box */}
      <div className="flex justify-center gap-2">
        <input
          type="text"
          placeholder="Search district..."
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Map */}
      <div className="w-full h-[800px] rounded-lg shadow-lg overflow-hidden">
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={8}
          minZoom={6}
          maxZoom={12}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
          maxBounds={[
            [20.5, 87.5],
            [26.7, 92.7],
          ]}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Move to district if searched */}
          {selectedCoords && <FlyToDistrict coords={selectedCoords} />}

          {/* Markers */}
          {serviceCenters.map((district, idx) => {
            const refObj = { ref: null, district: district.district };
            markerRefs.current[idx] = refObj;

            return (
              <Marker
                key={idx}
                position={[district.latitude, district.longitude]}
                ref={(ref) => (refObj.ref = ref)}
              >
                <Popup>
                  <div>
                    <h2 className="font-bold">{district.district}</h2>
                    <p className="text-sm text-gray-600">
                      Areas: {district.covered_area.join(', ')}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;

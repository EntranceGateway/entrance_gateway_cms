import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

// Component to update map center
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 13);
    }
  }, [center, map]);
  
  return null;
}

const LocationPicker = ({ value, onChange, error }) => {
  const [position, setPosition] = useState(value || { lat: 27.7172, lng: 85.324 }); // Default: Kathmandu
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const searchTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  // Update position when value prop changes
  useEffect(() => {
    if (value && value.lat && value.lng) {
      setPosition(value);
    }
  }, [value?.lat, value?.lng]);

  // Call onChange when position changes (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Call onChange on mount with initial position
      if (onChange) {
        onChange(position);
      }
      return;
    }
    
    if (onChange) {
      onChange(position);
    }
  }, [position.lat, position.lng]); // Only depend on lat/lng values, not onChange function

  // Search location using Nominatim (OpenStreetMap) - Free and no API key required
  const handleSearch = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=np&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'EntranceGateway-CMS/1.0' // Required by Nominatim usage policy
          }
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce search (1 second to respect Nominatim rate limits)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 1000);
  };

  const selectLocation = (result) => {
    const newPosition = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };
    setPosition(newPosition);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setShowMap(true);
  };

  const clearLocation = () => {
    const defaultPosition = { lat: 27.7172, lng: 85.324 };
    setPosition(defaultPosition);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            placeholder="Search location in Nepal..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearLocation}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectLocation(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-indigo-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {result.display_name.split(",")[0]}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {result.display_name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {searching && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
              <p className="text-sm text-gray-600">Searching...</p>
            </div>
          </div>
        )}
      </div>

      {/* Coordinates Display */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <MapPin size={16} className="text-indigo-500" />
        <div className="flex-1 text-sm">
          <span className="font-medium text-gray-700">Coordinates:</span>{" "}
          <span className="text-gray-600">
            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          {showMap ? "Hide Map" : "Show Map"}
        </button>
      </div>

      {/* Map */}
      {showMap && (
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
            <MapUpdater center={position} />
          </MapContainer>
          <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600 border-t border-gray-200">
            <strong>Tip:</strong> Click anywhere on the map to set the location, or use the search bar above
          </div>
        </div>
      )}

      {error && (
        <span className="text-red-600 text-xs block">{error}</span>
      )}
    </div>
  );
};

export default LocationPicker;

import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue with leaflet + webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function cleanPhoneNumber(phone) {
  return phone.replace(/\D/g, "");
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const sortOptions = [
  { value: "", label: "Sort By" },
  { value: "name", label: "Name (A-Z)" },
  { value: "location_state", label: "State (A-Z)" },
  { value: "location_district", label: "District (A-Z)" },
  { value: "location_locality", label: "Locality (A-Z)" },
];

// Component to update map view on coordinates change smoothly
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function Home() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [userLocation, setUserLocation] = useState(null); // [lat, lng]
  const [searchLocationCoords, setSearchLocationCoords] = useState(null); // [lat, lng]
  const [showDonorList, setShowDonorList] = useState(true);

  // Fetch donors from backend API with optional filters
  const fetchDonors = async (location = "", bloodGroup = "") => {
    setLoading(true);
    setError("");
    try {
      const url = new URL("http://localhost:4000/api/search-donors");
      url.searchParams.append("location", location);
      if (bloodGroup) url.searchParams.append("bloodGroup", bloodGroup);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch donors");
      setDonors(data);
    } catch (err) {
      setError(err.message);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  // Get current user location with fallback to IP geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    const geoSuccess = (position) => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
    };
    const geoError = async (error) => {
      console.error("Geolocation error:", error);
      alert(
        "Could not get your location from browser, trying fallback via IP..."
      );
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.latitude && data.longitude) {
          setUserLocation([data.latitude, data.longitude]);
        }
      } catch (e) {
        console.error("IP location fetch failed:", e);
      }
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    });
  }, []);

  // Geocode location_locality (searchTerm) to get coordinates via OpenStreetMap Nominatim
  const geocodeLocation = async (locationName) => {
    if (!locationName) {
      setSearchLocationCoords(null);
      return;
    }
    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.append("q", locationName);
      url.searchParams.append("format", "json");
      url.searchParams.append("limit", "1");
      url.searchParams.append("addressdetails", "0");

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.length === 0) {
        setSearchLocationCoords(null);
      } else {
        const { lat, lon } = data[0];
        setSearchLocationCoords([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (e) {
      console.error("Geocode error:", e);
      setSearchLocationCoords(null);
    }
  };

  // Initial fetch of all donors on component mount
  useEffect(() => {
    fetchDonors();
    setSearchLocationCoords(null); // clear searched location coords initially
  }, []);

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    fetchDonors(trimmedSearch, selectedBloodGroup);
    geocodeLocation(trimmedSearch);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied ${text} to clipboard!`);
  };

  // Sort donors if sortBy is selected
  const sortedDonors = useMemo(() => {
    if (!sortBy) return donors;
    return [...donors].sort((a, b) =>
      (a[sortBy] || "").localeCompare(b[sortBy] || "")
    );
  }, [donors, sortBy]);

  // Default map center if no user location or searched location found
  const defaultCenter = [20.5937, 78.9629]; // India center approx

  // Map center priority: searchLocationCoords > userLocation > defaultCenter
  const mapCenter = searchLocationCoords || userLocation || defaultCenter;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-green-400 p-4 sm:p-6 md:p-8 flex flex-col items-center font-sans">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 text-green-400 drop-shadow-lg text-center max-w-4xl">
        Admin Panel - Blood Donors
      </h1>

      <form
        onSubmit={handleSearch}
        className="w-full max-w-5xl mb-8 flex flex-col sm:flex-row flex-wrap sm:flex-nowrap gap-3"
      >
        <input
          type="text"
          placeholder="Search donors by state, district, or locality"
          className="flex-grow px-4 py-2 sm:py-3 rounded bg-gray-900 border border-green-600 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition min-w-[200px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search donors by location"
        />

        <select
          value={selectedBloodGroup}
          onChange={(e) => setSelectedBloodGroup(e.target.value)}
          className="w-full sm:w-40 px-4 py-2 sm:py-3 rounded bg-gray-900 border border-green-600 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          aria-label="Filter donors by blood group"
        >
          <option value="">All Blood Groups</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-44 px-4 py-2 sm:py-3 rounded bg-gray-900 border border-green-600 text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          aria-label="Sort donors"
        >
          {sortOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-black font-semibold rounded hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Search donors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Toggle button ONLY for donor list visibility */}
      <div className="w-full max-w-5xl mb-4 flex justify-end">
        <button
          onClick={() => setShowDonorList((prev) => !prev)}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition font-semibold text-black shadow-md"
          aria-pressed={showDonorList}
          aria-label="Toggle donor list visibility"
        >
          {showDonorList ? "Hide Donor List" : "Show Donor List"}
        </button>
      </div>

      {error && (
        <p className="text-red-500 font-semibold mb-6 w-full max-w-5xl text-center drop-shadow-md">
          {error}
        </p>
      )}

      {!loading && donors.length === 0 && !error && (
        <p className="text-green-300 w-full max-w-5xl text-center text-lg italic">
          No donors found.
        </p>
      )}

      <div className="w-full max-w-5xl h-[450px] mb-6 rounded shadow-lg overflow-hidden border border-green-600">
        <MapContainer
          center={mapCenter}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={mapCenter} zoom={12} />
          {/* Marker for searched location */}
          {searchLocationCoords && (
            <Marker position={searchLocationCoords}>
              <Popup>Searched Location: {searchTerm}</Popup>
            </Marker>
          )}
          {/* Marker for user location */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>Your Current Location</Popup>
            </Marker>
          )}
          {/* Always show donor markers */}
          {donors.map((d) =>
            d.lat && d.lng ? (
              <Marker key={d.id} position={[d.lat, d.lng]}>
                <Popup>
                  <strong>{d.name}</strong>
                  <br />
                  Blood Group: {d.blood_group}
                  <br />
                  {d.location_locality}, {d.location_district},{" "}
                  {d.location_state}
                  <br />
                  Contact: {d.contact}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      {/* Donor list toggle */}
      {showDonorList && (
        <ul className="space-y-6 w-full max-w-5xl px-2 sm:px-0">
          {donors.map((donor) => {
            const whatsappNumber = cleanPhoneNumber(donor.contact);
            return (
              <li
                key={donor.id}
                className="bg-gray-900 rounded-lg shadow-lg p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:scale-[1.03] transition-transform"
              >
                <div className="mb-4 md:mb-0 md:max-w-xl">
                  <p className="font-semibold text-xl sm:text-2xl text-green-400 mb-1 drop-shadow-md">
                    {donor.name}
                  </p>
                  <p className="mb-1 text-sm sm:text-base">
                    Blood Group:{" "}
                    <span className="font-medium text-green-300">
                      {donor.blood_group}
                    </span>
                  </p>
                  <p className="mb-1 text-sm sm:text-base">
                    Location:{" "}
                    <span className="font-medium text-green-300">
                      {donor.location_locality}, {donor.location_district},{" "}
                      {donor.location_state}
                    </span>
                  </p>
                  <p className="text-sm sm:text-base">
                    Contact:{" "}
                    <span className="font-medium text-green-300">
                      {donor.contact}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <a
                    href={`tel:${donor.contact}`}
                    className="bg-green-600 text-black px-5 py-2 rounded hover:bg-green-700 transition shadow-md flex items-center justify-center font-semibold text-sm sm:text-base"
                    aria-label={`Call ${donor.name}`}
                  >
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Hello, I am contacting you regarding blood donation.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-black px-5 py-2 rounded hover:bg-green-700 transition shadow-md flex items-center justify-center font-semibold text-sm sm:text-base"
                    aria-label={`WhatsApp message to ${donor.name}`}
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={() => copyToClipboard(donor.contact)}
                    className="bg-green-600 text-black px-5 py-2 rounded hover:bg-green-700 transition shadow-md font-semibold text-sm sm:text-base"
                    aria-label={`Copy contact number of ${donor.name}`}
                  >
                    Copy Number
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

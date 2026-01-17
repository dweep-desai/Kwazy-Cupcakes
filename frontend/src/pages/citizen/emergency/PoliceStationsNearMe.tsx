import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, Navigation, Shield } from 'lucide-react';

import api from '../../../services/api';
import L from 'leaflet';

// Fix leaflet marker icon issue
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PoliceStation {
    id: string;
    name: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
    distance?: string;
}

const PoliceStationsNearMe = () => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [stations, setStations] = useState<PoliceStation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    fetchStations(latitude, longitude);
                },
                (err) => {
                    console.error("Error getting location", err);
                    setError("Could not get your location. Showing default results.");
                    // Fallback location (New Delhi)
                    const fallbackLat = 28.6139;
                    const fallbackLng = 77.2090;
                    setLocation({ lat: fallbackLat, lng: fallbackLng });
                    fetchStations(fallbackLat, fallbackLng);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, []);

    const fetchStations = async (lat: number, lng: number) => {
        try {
            setLoading(true);
            const data = await api.getNearbyPoliceStations(lat, lng);
            setStations(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch police stations", err);
            // Mock data for demo if API fails
            setStations([
                { id: '1', name: 'Parliament Street Police Station', address: 'Parliament Street, New Delhi', phone: '011-23361100', lat: lat + 0.002, lng: lng + 0.002, distance: '0.5 km' },
                { id: '2', name: 'Connaught Place Police Station', address: 'Baba Kharak Singh Marg, CP', phone: '011-23370928', lat: lat - 0.002, lng: lng - 0.002, distance: '0.8 km' },
                { id: '3', name: 'Mandir Marg Police Station', address: 'Mandir Marg, Gole Market', phone: '011-23364100', lat: lat + 0.005, lng: lng - 0.003, distance: '1.2 km' },
                { id: '4', name: 'Tilak Marg Police Station', address: 'Tilak Marg, India Gate', phone: '011-23380928', lat: lat - 0.005, lng: lng + 0.004, distance: '1.8 km' },
                { id: '5', name: 'Tughlak Road Police Station', address: 'Tughlak Road, New Delhi', phone: '011-23378900', lat: lat + 0.008, lng: lng + 0.001, distance: '2.5 km' },
            ]);
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-gray-50">
            {/* List Section */}
            <div className="w-full md:w-1/3 lg:w-96 bg-white shadow-lg z-10 overflow-y-auto flex flex-col">
                <div className="p-4 border-b bg-white sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Shield className="text-blue-600" /> Police Stations
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {loading ? 'Locating...' : `${stations.length} stations found near you`}
                    </p>
                </div>

                <div className="flex-1 p-4 space-y-4">
                    {error && (
                        <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        stations.map((station) => (
                            <div key={station.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow bg-white group">
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{station.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{station.address}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-400">
                                    <Navigation className="w-3 h-3" />
                                    <span>{station.distance || 'Nearby'}</span>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <a
                                        href={`tel:${station.phone}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                    >
                                        <Phone className="w-4 h-4" /> Call
                                    </a>
                                    <button
                                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`, '_blank')}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        <Navigation className="w-4 h-4" /> Directions
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Map Section */}
            <div className="flex-1 h-[50vh] md:h-full relative">
                {location && (
                    <MapContainer
                        center={[location.lat, location.lng]}
                        zoom={14}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* User Location */}
                        <Marker position={[location.lat, location.lng]}>
                            <Popup>You are here</Popup>
                        </Marker>

                        {/* Station Locations */}
                        {stations.map((station) => (
                            <Marker key={station.id} position={[station.lat, station.lng]}>
                                <Popup>
                                    <div className="p-1">
                                        <h3 className="font-bold">{station.name}</h3>
                                        <p className="text-sm">{station.address}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
                {!location && (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                        Map Loading...
                    </div>
                )}
            </div>
        </div>
    );
};

export default PoliceStationsNearMe;

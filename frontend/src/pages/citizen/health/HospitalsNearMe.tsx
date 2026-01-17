import { useEffect, useState } from 'react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Clock, ShieldAlert } from 'lucide-react';
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

interface Hospital {
    id: string;
    name: string;
    address: string;
    hasEmergency: boolean;
    isOpenNow: boolean;
    lat: number;
    lng: number;
    distance?: string;
}

const HospitalsNearMe = () => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    fetchHospitals(latitude, longitude);
                },
                (err) => {
                    console.error("Error getting location", err);
                    setError("Could not get your location. Showing default results.");
                    const fallbackLat = 28.6139;
                    const fallbackLng = 77.2090;
                    setLocation({ lat: fallbackLat, lng: fallbackLng });
                    fetchHospitals(fallbackLat, fallbackLng);
                }
            );
        } else {
            setError("Geolocation is not supported");
            setLoading(false);
        }
    }, []);

    const fetchHospitals = async (lat: number, lng: number) => {
        try {
            setLoading(true);
            const data = await api.getNearbyHospitals(lat, lng);
            setHospitals(data);
            setLoading(false);
        } catch (err) {
            // Mock data
            setHospitals([
                { id: '1', name: 'City General Hospital', address: 'Sector 12, Civil Lines', hasEmergency: true, isOpenNow: true, lat: lat + 0.004, lng: lng - 0.002, distance: '1.5 km' },
                { id: '2', name: 'Sunrise Eye Clinic', address: 'Plot 4, Market Road', hasEmergency: false, isOpenNow: true, lat: lat - 0.003, lng: lng + 0.004, distance: '2.1 km' },
                { id: '3', name: 'Max Trauma Centre', address: 'Highway Road, Exit 4', hasEmergency: true, isOpenNow: true, lat: lat + 0.01, lng: lng + 0.01, distance: '5.0 km' },
            ]);
            setLoading(false);
        }
    };

    const openDirections = (hLat: number, hLng: number) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${hLat},${hLng}`, '_blank');
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-gray-50">
            {/* List Section */}
            <div className="w-full md:w-1/3 lg:w-96 bg-white shadow-lg z-10 overflow-y-auto flex flex-col">
                <div className="p-4 border-b bg-white sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <ShieldAlert className="text-blue-600" /> Hospitals Nearby
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {loading ? 'Locating...' : `${hospitals.length} centers found`}
                    </p>
                </div>

                <div className="flex-1 p-4 space-y-4">
                    {error && <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm">{error}</div>}

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        hospitals.map((hospital) => (
                            <div key={hospital.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow bg-white group">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{hospital.name}</h3>
                                    {hospital.hasEmergency && (
                                        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">Emergency</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{hospital.address}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs font-medium text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Navigation className="w-3 h-3" /> {hospital.distance || 'Nearby'}
                                    </div>
                                    <div className="flex items-center gap-1 text-green-600">
                                        <Clock className="w-3 h-3" /> {hospital.isOpenNow ? 'Open Now' : 'Closed'}
                                    </div>
                                </div>
                                <button
                                    onClick={() => openDirections(hospital.lat, hospital.lng)}
                                    className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                >
                                    <MapPin className="w-4 h-4" /> Get Directions
                                </button>
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
                        zoom={13}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={[location.lat, location.lng]}>
                            <Popup>You are here</Popup>
                        </Marker>

                        {hospitals.map((hospital) => (
                            <Marker key={hospital.id} position={[hospital.lat, hospital.lng]}>
                                <Popup>
                                    <div className="p-1">
                                        <h3 className="font-bold">{hospital.name}</h3>
                                        <p className="text-sm">{hospital.address}</p>
                                        {hospital.hasEmergency && <p className="text-xs text-red-600 font-bold mt-1">Emergency Available</p>}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

export default HospitalsNearMe;

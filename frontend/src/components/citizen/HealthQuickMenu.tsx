import { useNavigate } from 'react-router-dom';
import { MapPin, Building2, Ambulance, Pill, X } from 'lucide-react';
import '../../pages/citizen/CitizenDashboard.css'; // Reusing dashboard styles for consistency


interface HealthQuickMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const HealthQuickMenu: React.FC<HealthQuickMenuProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const options = [
        {
            title: "Medical Stores Near Me",
            description: "Find pharmacies nearby",
            icon: <Building2 className="w-8 h-8 text-pink-600" />,
            path: "/citizen/health/medical-stores-near-me",
            color: "bg-pink-50 hover:bg-pink-100 border-pink-200"
        },
        {
            title: "Hospitals Near Me",
            description: "Find hospitals & clinics",
            icon: <MapPin className="w-8 h-8 text-blue-600" />,
            path: "/citizen/health/hospitals-near-me",
            color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
        },
        {
            title: "Call an Ambulance",
            description: "Emergency booking",
            icon: <Ambulance className="w-8 h-8 text-red-600" />,
            path: "/citizen/health/call-ambulance",
            color: "bg-red-50 hover:bg-red-100 border-red-200"
        },
        {
            title: "Search Medicines",
            description: "Check prices & MRP",
            icon: <Pill className="w-8 h-8 text-green-600" />,
            path: "/citizen/health/search-medicines",
            color: "bg-green-50 hover:bg-green-100 border-green-200"
        }
    ];

    const handleNavigate = (path: string) => {
        onClose();
        navigate(path);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 mx-4">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Health Services</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigate(option.path)}
                            className={`flex items-start p-4 text-left border rounded-xl transition-all duration-200 ${option.color} group`}
                        >
                            <div className="p-3 bg-white rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
                                {option.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                                    {option.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {option.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                        Close Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HealthQuickMenu;

import { useState, useEffect } from 'react';

import {
  Heart, AlertTriangle, Castle,
  Bookmark, ChevronLeft, ChevronRight, Phone, Calculator,
  Star, Cloud, Wind, Droplets, Mail, X, Bus,
  Sun, Calendar
} from "lucide-react";
import HealthQuickMenu from '../../components/citizen/HealthQuickMenu';
import EmergencyQuickMenu from '../../components/citizen/EmergencyQuickMenu';
import MyCityQuickMenu from '../../components/citizen/MyCityQuickMenu';
import TransportQuickMenu from '../../components/citizen/TransportQuickMenu';
import FinancialCalculatorModal from '../../components/citizen/FinancialCalculatorModal';
import { getWeather } from '../../services/weatherService';
import { useAuth } from '../../context/AuthContext';


// Welcome Header
const WelcomeHeader = () => {
  const { user } = useAuth();
  const date = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back, <span className="text-blue-600">{user?.aadhar ? `User ${user.aadhar.slice(-4)}` : 'Citizen'}</span>
        </h1>
        <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm font-medium">
          <Calendar className="w-4 h-4 text-slate-400" />
          {date}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          Verified Citizen
        </div>
      </div>
    </div>
  );
};

// Quick Services Component
const QuickServices = () => {
  const [isHealthMenuOpen, setIsHealthMenuOpen] = useState(false);
  const [isEmergencyMenuOpen, setIsEmergencyMenuOpen] = useState(false);
  const [isMyCityMenuOpen, setIsMyCityMenuOpen] = useState(false);
  const [isTransportMenuOpen, setIsTransportMenuOpen] = useState(false);


  const services = [
    {
      title: "Health",
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      bg: "bg-gradient-to-br from-pink-50 to-pink-100/50 hover:from-pink-100 hover:to-pink-200/50",
      border: "border-pink-200/60",
      action: () => setIsHealthMenuOpen(true)
    },
    {
      title: "Emergency",
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
      bg: "bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200/50",
      border: "border-orange-200/60",
      action: () => setIsEmergencyMenuOpen(true)
    },
    {
      title: "My City",
      icon: <Castle className="w-8 h-8 text-emerald-500" />,
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:from-emerald-100 hover:to-emerald-200/50",
      border: "border-emerald-200/60",
      action: () => setIsMyCityMenuOpen(true)
    },
    {
      title: "Transport",
      icon: <Bus className="w-8 h-8 text-blue-500" />,
      bg: "bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50",
      border: "border-blue-200/60",
      action: () => setIsTransportMenuOpen(true)
    },
  ];


  return (
    <>
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Star className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Quick Services</h2>
            <p className="text-sm text-slate-500">Access essential services in one click</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={service.action}
              className={`group relative flex flex-col justify-between p-6 h-40 rounded-2xl border ${service.border} ${service.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <span className="text-lg font-bold text-slate-800 group-hover:text-slate-900">{service.title}</span>
              <div className="self-end p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
            </button>
          ))}
        </div>
      </section>

      <HealthQuickMenu
        isOpen={isHealthMenuOpen}
        onClose={() => setIsHealthMenuOpen(false)}
      />
      <EmergencyQuickMenu
        isOpen={isEmergencyMenuOpen}
        onClose={() => setIsEmergencyMenuOpen(false)}
      />
      <MyCityQuickMenu
        isOpen={isMyCityMenuOpen}
        onClose={() => setIsMyCityMenuOpen(false)}
      />
      <TransportQuickMenu
        isOpen={isTransportMenuOpen}
        onClose={() => setIsTransportMenuOpen(false)}
      />
    </>
  );


};

// Recent Services Component
const RecentServices = () => {
  const recentServices = [
    { icon: "🏛️", name: "CBSE", category: "Education, Skills & Employment", color: "bg-blue-100 text-blue-700" },
    { icon: "🌾", name: "Agriculture Dept", category: "General", color: "bg-green-100 text-green-700" },
    { icon: "🏥", name: "ABHA", category: "Health & Wellness", color: "bg-teal-100 text-teal-700" },
    { icon: "👶", name: "CHILDLINE 1098", category: "Women & Child", color: "bg-pink-100 text-pink-700" },
  ];

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-900">Recently Used Services</h2>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentServices.map((service, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-blue-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${service.color}`}>
              {service.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">{service.name}</h3>
              <p className="text-xs text-slate-500 truncate">{service.category}</p>
            </div>
            <button className="text-slate-300 hover:text-blue-500 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

// Helpline Data Types
interface HelplineContact {
  name: string;
  description?: string;
  numbers: string[];
  email?: string;
  icon?: string; // Emoji or image path
}

interface HelplineCategoryData {
  id: string;
  icon: string;
  label: string;
  contacts: HelplineContact[];
}

// Helpline Data
const helplineData: HelplineCategoryData[] = [
  {
    id: "farmers",
    icon: "👨‍🌾",
    label: "Farmers",
    contacts: [
      { name: "Agriculture Ministry Helpline", description: "Farmer Grievances", numbers: ["1800-180-1551"], email: "help@kisan.gov.in" },
      { name: "Kisan Call Centre", numbers: ["1800-180-1551"] },
      { name: "National Seeds Corporation", numbers: ["011-25845528"] },
      { name: "National Horticulture Board", numbers: ["0124-2343414"] },
      { name: "Soil Health Card Scheme", numbers: ["1800-180-1551"] }
    ]
  },
  {
    id: "senior_citizen",
    icon: "👴",
    label: "Senior Citizen",
    contacts: [
      { name: "HelpAge India", numbers: ["011-41688955", "011-41688956"] },
      { name: "Elder Line", numbers: ["14567"] }
    ]
  },
  {
    id: "student",
    icon: "🎓",
    label: "Student",
    contacts: [
      { name: "National Anti-Ragging Helpline", numbers: ["1800-180-5522"], email: "helpline@antiragging.in" },
      { name: "University Grants Commission", numbers: ["011-23604446"], email: "contact.ugc@nic.in" },
      { name: "All India Council for Technical Education", numbers: ["011-26131576-78", "011-26131576-80"], email: "helpdesk1@aicte-india.org" },
      { name: "Central Board of Secondary Education", numbers: ["1800-11-8002", "7669886950"], email: "info@cbse.gov.in" }
    ]
  },
  {
    id: "women_child",
    icon: "👩‍👧",
    label: "Women & Child",
    contacts: [
      { name: "Women Helpline", numbers: ["1091"] },
      { name: "Child Helpline", numbers: ["1098"] },
      { name: "National Commission for Women", numbers: ["7827-170-170"] },
      { name: "National Commission for Protection of Child Rights", numbers: ["1800-121-2830"] }
    ]
  },
  {
    id: "health",
    icon: "🏥",
    label: "Health",
    contacts: [
      { name: "COVID-19 Helpline", numbers: ["1075"] },
      { name: "National AIDS Helpline", numbers: ["1097"] },
      { name: "Indian Medical Association", numbers: ["011-26588895", "011-26588900"] }
    ]
  },
  {
    id: "police",
    icon: "👮",
    label: "Police",
    contacts: [
      { name: "Cyber Crime Reporting", numbers: ["1930"] },
      { name: "Emergency Police Helpline", numbers: ["112"] },
      { name: "Women's Helpline (Police)", numbers: ["1090"] },
      { name: "Delhi Police Complaints", numbers: ["1093"] },
      { name: "All India Railway Helpline", numbers: ["1512"] }
    ]
  }
];

// Helpline Modal Component
const HelplineModal = ({ category, onClose }: { category: HelplineCategoryData | null, onClose: () => void }) => {
  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800">
            <span className="text-2xl filter drop-shadow-sm">{category.icon}</span>
            {category.label} Helplines
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
          {category.contacts.map((contact, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-lg border border-slate-100">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{contact.name}</h3>
                  <p className="text-xs text-slate-500 font-medium font-mono mt-0.5">{contact.numbers.join(', ')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Send Email">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                <a href={`tel:${contact.numbers[0]}`} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Call Now">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helpline Categories Component
const HelplineCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<HelplineCategoryData | null>(null);

  return (
    <>
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Phone className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Essential Helpline Numbers</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {helplineData.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="flex flex-col items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:border-orange-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl border border-slate-100 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                {category.icon}
              </div>
              <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 text-center">{category.label}</span>
            </button>
          ))}
        </div>
      </section>

      <HelplineModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  );
};

// Weather & AQI Card Component
const WeatherAQICard = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const data = await getWeather(position.coords.latitude, position.coords.longitude);
                setWeather(data);
              } catch (e) {
                const data = await getWeather();
                setWeather(data);
              }
            },
            async () => {
              const data = await getWeather();
              setWeather(data);
            }
          );
        } else {
          const data = await getWeather();
          setWeather(data);
        }
      } catch (error) {
        console.error("Weather fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading || !weather) {
    return (
      <div className="h-full min-h-[220px] w-full bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-600 bg-emerald-50';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getAqiBarColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-emerald-500';
    if (aqi <= 100) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    return 'Unhealthy';
  };

  const aqiColorClass = getAqiColor(weather.aqi);
  const aqiPercentage = Math.min((weather.aqi / 300) * 100, 100);

  return (
    <div className="h-full bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Cloud className="w-32 h-32" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Sun className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-900">{weather.location}</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl font-bold text-slate-900">{weather.temp}°</div>
          <div className="text-sm font-medium text-slate-500 px-3 py-1 bg-slate-100 rounded-full">
            {weather.condition}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>Humidity: {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Wind className="w-4 h-4 text-slate-400" />
            <span>Wind: {weather.wind} km/h</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Air Quality</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${aqiColorClass}`}>AQI {weather.aqi}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
            <div className={`h-2 rounded-full ${getAqiBarColor(weather.aqi)}`} style={{ width: `${aqiPercentage}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 text-right">{getAqiStatus(weather.aqi)}</p>
        </div>
      </div>
    </div>
  );
};

// Financial Calculator Card Component
const FinancialCalculatorCard = ({ onOpen }: { onOpen: () => void }) => {
  return (
    <div className="h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg cursor-pointer group hover:shadow-xl transition-all hover:translate-y-[-2px]" onClick={onOpen}>
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:translate-x-8 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full blur-xl transform -translate-x-5 translate-y-5"></div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <Calculator className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Financial Tools</h3>
          <p className="text-blue-100 text-sm mb-6 leading-relaxed">
            Calculate Provident Fund, Pension, and TDR returns instantly.
          </p>

          <button className="w-full py-2.5 px-4 bg-white text-blue-700 font-semibold rounded-lg shadow-sm hover:shadow-md hover:bg-blue-50 transition-all text-sm">
            Open Calculator
          </button>
        </div>
      </div>
    </div>
  );
};

// Promo Cards Component
const PromoCards = ({ onOpenCalculator }: { onOpenCalculator: () => void }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <WeatherAQICard />
      <FinancialCalculatorCard onOpen={onOpenCalculator} />
    </section>
  );
};

// ============================================
// Main Dashboard Component
// ============================================
const CitizenDashboard = () => {
  const [isFinancialCalculatorOpen, setIsFinancialCalculatorOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-500">
      <WelcomeHeader />
      <QuickServices />
      <RecentServices />
      <HelplineCategories />
      <PromoCards onOpenCalculator={() => setIsFinancialCalculatorOpen(true)} />

      <FinancialCalculatorModal
        isOpen={isFinancialCalculatorOpen}
        onClose={() => setIsFinancialCalculatorOpen(false)}
      />
    </div>
  );
};

export default CitizenDashboard;
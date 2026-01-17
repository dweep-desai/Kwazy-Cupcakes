import React, { useState } from 'react';
import { Search, Pill, ShoppingCart, Info } from 'lucide-react';
import api from '../../../services/api';

interface Medicine {
    id: string;
    name: string;
    brand: string;
    dosage: string;
    mrp: number;
}

const SearchMedicines = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Mock cart state
    const [cartCount, setCartCount] = useState(0);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);

        try {
            const data = await api.searchMedicines(query);
            setResults(data);
        } catch (err) {
            // Mock data
            setResults([
                { id: '1', name: 'Paracetamol', brand: 'Dolo 650', dosage: '650mg Tablet', mrp: 30.50 },
                { id: '2', name: 'Azithromycin', brand: 'Azithral 500', dosage: '500mg Tablet', mrp: 115.00 },
                { id: '3', name: 'Cetirizine', brand: 'Cetzine', dosage: '10mg Tablet', mrp: 18.00 },
                { id: '4', name: 'Vitamin C', brand: 'Limcee', dosage: 'Chewable Tablet', mrp: 22.00 },
            ].filter(m => m.name.toLowerCase().includes(query.toLowerCase()) || m.brand.toLowerCase().includes(query.toLowerCase())));
        } finally {
            setLoading(false);
        }
    };

    const addToCart = () => {
        setCartCount(prev => prev + 1);
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            {/* Header & Cart Mock */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Search Medicines</h1>
                <button className="relative p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                    <ShoppingCart className="w-6 h-6 text-gray-600" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="relative">
                    <input
                        type="text"
                        className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-lg transition-all"
                        placeholder="Search by medicine name (e.g. Dolo, Cough Syrup)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-green-600 text-white px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Results */}
            <div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
                        <p>Searching database...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid gap-4">
                        {results.map((med) => (
                            <div key={med.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-green-200 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                                        <Pill className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{med.brand}</h3>
                                        <p className="text-gray-600 text-sm">{med.name} • {med.dosage}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="font-bold text-gray-900">₹{med.mrp.toFixed(2)}</span>
                                            <span className="text-xs text-gray-400">MRP</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={addToCart}
                                    className="px-4 py-2 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 transition-colors text-sm"
                                >
                                    Add +
                                </button>
                            </div>
                        ))}
                    </div>
                ) : searched ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Info className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p>No medicines found matching "{query}"</p>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Pill className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                        <p className="text-lg">Type a medicine name above to check MRP and availability.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchMedicines;

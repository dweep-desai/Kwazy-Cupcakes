import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Building2, ArrowLeft } from 'lucide-react';

const ProviderLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { loginProvider } = useAuth();
    const [aadhaar, setAadhaar] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Just one step login now
            await loginProvider(aadhaar);
            navigate('/provider/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                        <Building2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Provider Login</h1>
                    <p className="text-gray-500">Access your service dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Aadhaar Number</label>
                        <input
                            type="text"
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            placeholder="e.g. 123456789012"
                            required
                            minLength={12}
                        />
                    </div>

                    {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center pt-6 border-t">
                    <p className="text-gray-600 mb-2">New Service Provider?</p>
                    <Link to="/auth/provider/register" className="text-blue-600 font-bold hover:underline">
                        Register here
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    <Link to="/auth/selection" className="text-sm text-gray-500 flex items-center justify-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Back to Role Selection
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProviderLoginPage;

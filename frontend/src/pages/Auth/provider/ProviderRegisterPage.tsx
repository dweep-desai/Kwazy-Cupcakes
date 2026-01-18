import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../../services/api';
import { Building2, ArrowLeft } from 'lucide-react';

const ProviderRegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        aadhaar: '',
        full_name: '',
        phone: '',
        gender: 'MALE',
        date_of_birth: '',
        address: '',
        organization_name: '',
        registration_number: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.registerProvider(formData);
            // Show success and redirect to login
            alert("Registration successful! Your account is pending approval by the admin.");
            navigate('/auth/provider/login');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate('/auth/provider/login')}><ArrowLeft className="w-5 h-5" /></button>
                        <h1 className="text-xl font-bold">Provider Registration</h1>
                    </div>
                    <Building2 className="w-6 h-6 opacity-80" />
                </div>

                <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Aadhaar Number *</label>
                        <input
                            type="text"
                            required
                            minLength={12}
                            maxLength={12}
                            className="w-full p-2 border rounded"
                            value={formData.aadhaar}
                            onChange={e => setFormData({ ...formData, aadhaar: e.target.value })}
                            placeholder="12 digit Aadhaar"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name *</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border rounded"
                            value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number *</label>
                        <input
                            type="tel"
                            required
                            className="w-full p-2 border rounded"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Gender *</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={formData.gender}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                        <input
                            type="date"
                            required
                            className="w-full p-2 border rounded"
                            value={formData.date_of_birth}
                            onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            rows={3}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Organization Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={formData.organization_name}
                            onChange={e => setFormData({ ...formData, organization_name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Registration Number</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={formData.registration_number}
                            onChange={e => setFormData({ ...formData, registration_number: e.target.value })}
                        />
                    </div>

                    {error && (
                        <div className="md:col-span-2 bg-red-50 text-red-600 p-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Register as Provider'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProviderRegisterPage;

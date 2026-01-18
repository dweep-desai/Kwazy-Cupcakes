import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface Request {
    request_id: number;
    status: string;
    created_at: string;
    service_provider: {
        full_name: string;
        organization_name?: string;
        phone: string;
    };
}

const AdminApprovalsPage: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await api.getProviderRequests();
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleUpdate = async (id: number, status: string) => {
        try {
            if (status === 'REJECTED') {
                const reason = prompt("Enter rejection reason:");
                if (!reason) return;
                await api.updateProviderRequest(id, status, reason);
            } else {
                await api.updateProviderRequest(id, status);
            }
            fetchRequests();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-8">Loading requests...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Pending Provider Approvals</h1>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="p-4 border-b">Provider</th>
                            <th className="p-4 border-b">Organization</th>
                            <th className="p-4 border-b">Date</th>
                            <th className="p-4 border-b">Status</th>
                            <th className="p-4 border-b text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No pending requests</td></tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req.request_id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-medium">{req.service_provider.full_name}</div>
                                        <div className="text-sm text-gray-500">{req.service_provider.phone}</div>
                                    </td>
                                    <td className="p-4">{req.service_provider.organization_name || '-'}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            <Clock className="w-3 h-3 mr-1" /> Pending
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleUpdate(req.request_id, 'APPROVED')}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(req.request_id, 'REJECTED')}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                        >
                                            <XCircle className="w-4 h-4 mr-1" /> Reject
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminApprovalsPage;

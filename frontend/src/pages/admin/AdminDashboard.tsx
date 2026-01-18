import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ServiceOnboardingRequest } from '../../types';
import {
  Building2,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Inbox,
  FileText,
  Briefcase,
  Stethoscope,
  Activity,
  Search,
  Filter,
  Users,
  LayoutDashboard,
  Clock
} from 'lucide-react';

interface SPRegistrationRequest {
  request_id: string;
  service_provider_id: string;
  request_type: string;
  status: string;
  full_name: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  address?: string;
  organization_name?: string;
  registration_number?: string;
  provider_type?: string;
  specialization?: string;
  years_of_experience?: number;
  provider_category?: string;
  business_license?: string;
  gst_number?: string;
  years_in_business?: number;
  submitted_at: string;
}

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<ServiceOnboardingRequest[]>([]);
  const [spRequests, setSpRequests] = useState<SPRegistrationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceOnboardingRequest | null>(null);
  const [selectedSpRequest, setSelectedSpRequest] = useState<SPRegistrationRequest | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | 'changes' | null>(null);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'onboarding' | 'sp-registration'>('sp-registration');

  useEffect(() => {
    if (activeTab === 'onboarding') {
      fetchRequests();
    } else {
      fetchSpRequests();
    }
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/admin/onboarding-requests?status_filter=PENDING');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const fetchSpRequests = async () => {
    try {
      const response = await api.get('/admin/sp-registration-requests?status_filter=PENDING');
      setSpRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch SP requests:', error);
    }
  };

  const handleAction = async () => {
    if (!selectedRequest || !action) return;

    try {
      if (action === 'approve') {
        await api.put(`/admin/onboarding-requests/${selectedRequest.id}/approve`, null, {
          params: { admin_notes: notes },
        });
      } else if (action === 'reject') {
        await api.put(`/admin/onboarding-requests/${selectedRequest.id}/reject`, {
          admin_notes: notes,
        });
      } else if (action === 'changes') {
        await api.put(`/admin/onboarding-requests/${selectedRequest.id}/request-changes`, {
          admin_notes: notes,
        });
      }
      setSelectedRequest(null);
      setAction(null);
      setNotes('');
      fetchRequests();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to process request');
    }
  };

  const handleSpAction = async () => {
    if (!selectedSpRequest || !action) return;

    try {
      if (action === 'approve') {
        await api.put(`/admin/sp-registration-requests/${selectedSpRequest.request_id}/approve`, null, {
          params: { admin_comments: notes },
        });
      } else if (action === 'reject') {
        if (!notes.trim()) {
          alert('Rejection reason is required');
          return;
        }
        await api.put(`/admin/sp-registration-requests/${selectedSpRequest.request_id}/reject?rejection_reason=${encodeURIComponent(notes)}`);
      }
      setSelectedSpRequest(null);
      setAction(null);
      setNotes('');
      fetchSpRequests();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to process request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-500 mt-1">Monitor onboarding requests and service health</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600">
          <span className="relative flex h-2.5 w-2.5 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          System Operational
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
            <span className="text-xs font-medium text-slate-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{spRequests.length}</div>
          <div className="text-sm text-slate-500">Pending SP Requests</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <LayoutDashboard size={20} />
            </div>
            <span className="text-xs font-medium text-slate-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{requests.length}</div>
          <div className="text-sm text-slate-500">Pending Services</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle size={20} />
            </div>
            <span className="text-xs font-medium text-slate-400">Today</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">0</div>
          <div className="text-sm text-slate-500">Approved Requests</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Clock size={20} />
            </div>
            <span className="text-xs font-medium text-slate-400">Avg Time</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">2h</div>
          <div className="text-sm text-slate-500">Response Time</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Segmented Control Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-lg w-full md:w-fit border border-slate-200">
          <button
            onClick={() => { setActiveTab('sp-registration'); fetchSpRequests(); }}
            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center ${activeTab === 'sp-registration'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <Users size={16} />
            SP Registrations
            {spRequests.length > 0 && (
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeTab === 'sp-registration' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                {spRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('onboarding'); fetchRequests(); }}
            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 justify-center ${activeTab === 'onboarding'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <Briefcase size={16} />
            Service Onboarding
            {requests.length > 0 && (
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeTab === 'onboarding' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'}`}>
                {requests.length}
              </span>
            )}
          </button>
        </div>

        {/* SP Registration Requests Grid */}
        {activeTab === 'sp-registration' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              Pending SP Registration Requests
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-normal border border-slate-200">
                Sorted by newest
              </span>
            </h3>

            {spRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Inbox size={32} className="text-slate-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900">All caught up</h4>
                <p className="text-slate-500 max-w-sm mt-1">No pending SP registration requests right now. New requests will appear here automatically.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spRequests.map((request) => (
                  <div
                    key={request.request_id}
                    onClick={() => setSelectedSpRequest(request)}
                    className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
                  >
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(request.submitted_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                        {request.full_name}
                      </h4>

                      <div className="space-y-2 mt-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-slate-400" />
                          {request.phone}
                        </div>
                        {request.request_type === 'ESANJEEVANI' && (
                          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded text-xs font-medium">
                            <Stethoscope size={12} />
                            {request.provider_type} • {request.specialization}
                          </div>
                        )}
                        {request.request_type === 'MKISAN' && (
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 w-fit px-2 py-1 rounded text-xs font-medium">
                            <Building2 size={12} />
                            {request.provider_category}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-500 group-hover:bg-slate-100/50 transition-colors">
                      <span>View Details</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Service Onboarding Requests Grid */}
        {activeTab === 'onboarding' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              Pending Service Requests
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-normal border border-slate-200">
                Sorted by newest
              </span>
            </h3>

            {requests.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Inbox size={32} className="text-slate-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900">All caught up</h4>
                <p className="text-slate-500 max-w-sm mt-1">No pending service onboarding requests. New service submissions will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
                  >
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                        {request.name}
                      </h4>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                        {request.description}
                      </p>

                      <div className="space-y-1 text-xs text-slate-500 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                        <div className="flex justify-between">
                          <span>Service ID:</span>
                          <span className="text-slate-700">{request.service_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <span className="text-slate-700">{request.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-500 group-hover:bg-slate-100/50 transition-colors">
                      <span>Review Application</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SP Registration Request Modal */}
      {selectedSpRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Review Application</h3>
                <p className="text-sm text-slate-500">SP Registration Request</p>
              </div>
              <button onClick={() => { setSelectedSpRequest(null); setAction(null); setNotes(''); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-500 flex-shrink-0">
                  {selectedSpRequest.full_name[0]}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">{selectedSpRequest.full_name}</h4>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-slate-400" />
                      {selectedSpRequest.request_type} Provider
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-slate-400" />
                      {selectedSpRequest.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      Born {new Date(selectedSpRequest.date_of_birth).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-slate-400" />
                      {selectedSpRequest.gender}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 my-4"></div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Location & Org</h5>
                  <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block mb-1">Address</span>
                      <p className="text-sm font-medium text-slate-900">{selectedSpRequest.address || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block mb-1">Organization</span>
                      <p className="text-sm font-medium text-slate-900">{selectedSpRequest.organization_name || 'Individual'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Professional Details</h5>
                  <div className="space-y-3">
                    {selectedSpRequest.request_type === 'ESANJEEVANI' ? (
                      <>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                          <span className="text-xs text-blue-500 block mb-1">Profession</span>
                          <p className="text-sm font-medium text-blue-900">
                            {selectedSpRequest.provider_type} • {selectedSpRequest.specialization}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-xs text-slate-500 block mb-1">Experience</span>
                          <p className="text-sm font-medium text-slate-900">{selectedSpRequest.years_of_experience} Years</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                          <span className="text-xs text-green-500 block mb-1">Category</span>
                          <p className="text-sm font-medium text-green-900">{selectedSpRequest.provider_category}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-xs text-slate-500 block mb-1">Business License / GST</span>
                          <p className="text-sm font-medium text-slate-900 font-mono">
                            {selectedSpRequest.business_license || selectedSpRequest.gst_number || 'N/A'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Area */}
              {!action ? (
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => setAction('approve')} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-sm hover:bg-green-700 hover:shadow-md transition-all flex items-center justify-center gap-2">
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button onClick={() => setAction('reject')} className="flex-1 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-semibold shadow-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 animate-in slide-in-from-bottom-2">
                  <h5 className="font-semibold text-slate-900 mb-3">
                    {action === 'approve' ? 'Approve Registration' : 'Reject Registration'}
                  </h5>
                  <label className="block text-sm text-slate-600 mb-2">
                    {action === 'approve' ? 'Admin Comments (Optional)' : 'Rejection Reason (Required)'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                    placeholder="Enter details..."
                    required={action === 'reject'}
                    autoFocus
                  />
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleSpAction} className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
                    </button>
                    <button onClick={() => { setAction(null); setNotes(''); }} className="px-6 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                      Back
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Service Onboarding Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Review Service Request</h3>
                <p className="text-sm text-slate-500">Service Onboarding</p>
              </div>
              <button onClick={() => { setSelectedRequest(null); setAction(null); setNotes(''); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h4 className="text-xl font-bold text-slate-900 mb-2">{selectedRequest.name}</h4>
                <p className="text-slate-600">{selectedRequest.description}</p>
                <div className="flex gap-4 mt-4 pt-4 border-t border-slate-200/60">
                  <div className="text-sm">
                    <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Service ID</span>
                    <span className="font-mono font-medium text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">{selectedRequest.service_id}</span>
                  </div>
                  <div className="text-sm">
                    <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Category</span>
                    <span className="font-medium text-slate-700">{selectedRequest.category}</span>
                  </div>
                  <div className="text-sm">
                    <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Base URL</span>
                    <a href={selectedRequest.base_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block max-w-[200px]">
                      {selectedRequest.base_url}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              {!action ? (
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => setAction('approve')} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-sm hover:bg-green-700 hover:shadow-md transition-all flex items-center justify-center gap-2">
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button onClick={() => setAction('changes')} className="flex-1 py-3 bg-white text-orange-600 border border-orange-200 rounded-xl font-semibold shadow-sm hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                    <FileText size={18} /> Request Changes
                  </button>
                  <button onClick={() => setAction('reject')} className="flex-1 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-semibold shadow-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 animate-in slide-in-from-bottom-2">
                  <h5 className="font-semibold text-slate-900 mb-3">
                    {action === 'approve' ? 'Approve Service' : action === 'reject' ? 'Reject Service' : 'Request Changes'}
                  </h5>
                  <label className="block text-sm text-slate-600 mb-2">Admin Notes (Required for rejection/changes)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                    placeholder="Enter details..."
                    required={action !== 'approve'}
                    autoFocus
                  />
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleAction} className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Submit Decision
                    </button>
                    <button onClick={() => { setAction(null); setNotes(''); }} className="px-6 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                      Back
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

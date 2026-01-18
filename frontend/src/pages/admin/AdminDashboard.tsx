import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ServiceOnboardingRequest } from '../../types';
import './AdminDashboard.css';

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

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' }}>
        <button
          onClick={() => setActiveTab('sp-registration')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'sp-registration' ? '#667eea' : 'transparent',
            color: activeTab === 'sp-registration' ? 'white' : '#666',
            cursor: 'pointer',
            borderBottom: activeTab === 'sp-registration' ? '2px solid #667eea' : '2px solid transparent',
          }}
        >
          SP Registration Requests ({spRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('onboarding')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'onboarding' ? '#667eea' : 'transparent',
            color: activeTab === 'onboarding' ? 'white' : '#666',
            cursor: 'pointer',
            borderBottom: activeTab === 'onboarding' ? '2px solid #667eea' : '2px solid transparent',
          }}
        >
          Service Onboarding Requests ({requests.length})
        </button>
      </div>

      {/* SP Registration Requests Tab */}
      {activeTab === 'sp-registration' && (
        <div className="dashboard-section">
          <h3>Pending SP Registration Requests</h3>
          <div className="requests-list">
            {spRequests.length === 0 ? (
              <p>No pending SP registration requests</p>
            ) : (
              spRequests.map((request) => (
                <div
                  key={request.request_id}
                  className="request-item"
                  onClick={() => setSelectedSpRequest(request)}
                >
                  <div>
                    <h4>{request.full_name}</h4>
                    <p>Type: {request.request_type} | Phone: {request.phone}</p>
                    {request.request_type === 'ESANJEEVANI' && (
                      <span className="meta">
                        {request.provider_type} - {request.specialization} ({request.years_of_experience} years exp.)
                      </span>
                    )}
                    {request.request_type === 'MKISAN' && (
                      <span className="meta">
                        Category: {request.provider_category}
                      </span>
                    )}
                  </div>
                  <span className={`status-badge ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Service Onboarding Requests Tab */}
      {activeTab === 'onboarding' && (
        <div className="dashboard-section">
          <h3>Pending Onboarding Requests</h3>
          <div className="requests-list">
            {requests.map((request) => (
              <div
                key={request.id}
                className="request-item"
                onClick={() => setSelectedRequest(request)}
              >
                <div>
                  <h4>{request.name}</h4>
                  <p>{request.description}</p>
                  <span className="meta">Category: {request.category} | Service ID: {request.service_id}</span>
                </div>
                <span className={`status-badge ${request.status.toLowerCase()}`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SP Registration Request Modal */}
      {selectedSpRequest && (
        <div className="modal">
          <div className="modal-content">
            <h3>Review SP Registration: {selectedSpRequest.full_name}</h3>
            <div className="request-details">
              <p><strong>Request Type:</strong> {selectedSpRequest.request_type}</p>
              <p><strong>Full Name:</strong> {selectedSpRequest.full_name}</p>
              <p><strong>Phone:</strong> {selectedSpRequest.phone}</p>
              <p><strong>Gender:</strong> {selectedSpRequest.gender}</p>
              <p><strong>Date of Birth:</strong> {selectedSpRequest.date_of_birth}</p>
              {selectedSpRequest.address && <p><strong>Address:</strong> {selectedSpRequest.address}</p>}
              {selectedSpRequest.organization_name && <p><strong>Organization:</strong> {selectedSpRequest.organization_name}</p>}
              {selectedSpRequest.request_type === 'ESANJEEVANI' && (
                <>
                  <p><strong>Profession:</strong> {selectedSpRequest.provider_type}</p>
                  <p><strong>Specialization:</strong> {selectedSpRequest.specialization}</p>
                  <p><strong>Years of Experience:</strong> {selectedSpRequest.years_of_experience}</p>
                </>
              )}
              {selectedSpRequest.request_type === 'MKISAN' && (
                <>
                  <p><strong>Category:</strong> {selectedSpRequest.provider_category}</p>
                  {selectedSpRequest.business_license && <p><strong>Business License:</strong> {selectedSpRequest.business_license}</p>}
                  {selectedSpRequest.gst_number && <p><strong>GST Number:</strong> {selectedSpRequest.gst_number}</p>}
                  {selectedSpRequest.years_in_business && <p><strong>Years in Business:</strong> {selectedSpRequest.years_in_business}</p>}
                </>
              )}
            </div>
            <div className="action-buttons">
              <button onClick={() => setAction('approve')} className="approve-btn">
                Approve
              </button>
              <button onClick={() => setAction('reject')} className="reject-btn">
                Reject
              </button>
            </div>
            {action && (
              <div className="action-form">
                <label>{action === 'approve' ? 'Admin Comments (Optional):' : 'Rejection Reason (Required):'}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  required={action === 'reject'}
                />
                <div className="form-actions">
                  <button onClick={handleSpAction} className="primary-btn">
                    Submit
                  </button>
                  <button onClick={() => { setAction(null); setNotes(''); }} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <button onClick={() => { setSelectedSpRequest(null); setAction(null); setNotes(''); }} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Service Onboarding Request Modal */}
      {selectedRequest && (
        <div className="modal">
          <div className="modal-content">
            <h3>Review Request: {selectedRequest.name}</h3>
            <div className="request-details">
              <p><strong>Description:</strong> {selectedRequest.description}</p>
              <p><strong>Base URL:</strong> {selectedRequest.base_url}</p>
              <p><strong>Category:</strong> {selectedRequest.category}</p>
              <p><strong>Service ID:</strong> {selectedRequest.service_id}</p>
            </div>
            <div className="action-buttons">
              <button onClick={() => setAction('approve')} className="approve-btn">
                Approve
              </button>
              <button onClick={() => setAction('reject')} className="reject-btn">
                Reject
              </button>
              <button onClick={() => setAction('changes')} className="changes-btn">
                Request Changes
              </button>
            </div>
            {action && (
              <div className="action-form">
                <label>Admin Notes:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  required={action !== 'approve'}
                />
                <div className="form-actions">
                  <button onClick={handleAction} className="primary-btn">
                    Submit
                  </button>
                  <button onClick={() => { setAction(null); setNotes(''); }} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <button onClick={() => { setSelectedRequest(null); setAction(null); setNotes(''); }} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

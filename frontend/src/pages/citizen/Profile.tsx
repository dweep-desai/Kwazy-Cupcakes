import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Profile.css';

interface CitizenProfile {
  citizen_id: string;
  aadhaar_hash: string;
  full_name: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  age: number;
  address: string | null;
  kisan_id: string | null;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingKisanId, setEditingKisanId] = useState(false);
  const [kisanIdValue, setKisanIdValue] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.aadhar) {
        setError('User Aadhaar not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/citizen/profile');
        setProfile(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.detail || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateKisanId = async () => {
    if (!kisanIdValue.trim()) {
      setError('Kisan ID cannot be empty');
      return;
    }

    try {
      setUpdating(true);
      setError(null); // Clear previous errors
      await api.put('/citizen/profile/kisan-id', { kisan_id: kisanIdValue.trim() });
      // Refresh profile
      const response = await api.get('/citizen/profile');
      setProfile(response.data);
      setEditingKisanId(false);
      setError(null);
    } catch (err: any) {
      console.error('Error updating kisan_id:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to update Kisan ID';
      setError(errorMessage);
      // Keep the form open so user can fix the issue
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Citizen Profile</h1>
        <p className="profile-subtitle">View your complete profile information</p>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '0.5rem',
          color: '#991b1b'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Personal Information</h2>
          </div>
          <div className="profile-card-body">
            <div className="profile-field">
              <label>Citizen ID</label>
              <div className="profile-value">{profile.citizen_id}</div>
            </div>
            <div className="profile-field">
              <label>Full Name</label>
              <div className="profile-value">{profile.full_name}</div>
            </div>
            <div className="profile-field">
              <label>Aadhaar Number</label>
              <div className="profile-value">{user?.aadhar || 'N/A'}</div>
            </div>
            <div className="profile-field">
              <label>Phone Number</label>
              <div className="profile-value">{profile.phone}</div>
            </div>
            <div className="profile-field">
              <label>Gender</label>
              <div className="profile-value">{profile.gender}</div>
            </div>
            <div className="profile-field">
              <label>Date of Birth</label>
              <div className="profile-value">
                {new Date(profile.date_of_birth).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="profile-field">
              <label>Age</label>
              <div className="profile-value">{profile.age} years</div>
            </div>
            <div className="profile-field">
              <label>Address</label>
              <div className="profile-value">{profile.address || 'Not provided'}</div>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Additional Information</h2>
          </div>
          <div className="profile-card-body">
            <div className="profile-field">
              <label>Kisan ID</label>
              {editingKisanId ? (
                <div className="profile-field-edit">
                  <input
                    type="text"
                    value={kisanIdValue}
                    onChange={(e) => setKisanIdValue(e.target.value)}
                    placeholder="Enter Kisan ID (e.g., KISAN001)"
                    className="profile-input"
                    disabled={updating}
                  />
                  <div className="profile-edit-actions">
                    <button
                      onClick={handleUpdateKisanId}
                      disabled={updating}
                      className="profile-save-btn"
                    >
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingKisanId(false);
                        setKisanIdValue(profile.kisan_id || '');
                        setError(null);
                      }}
                      disabled={updating}
                      className="profile-cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-value-with-edit">
                  <div className="profile-value">{profile.kisan_id || 'Not registered as a farmer'}</div>
                  <button
                    onClick={() => {
                      setEditingKisanId(true);
                      setKisanIdValue(profile.kisan_id || '');
                    }}
                    className="profile-edit-btn"
                    type="button"
                  >
                    {profile.kisan_id ? 'Edit' : 'Add Kisan ID'}
                  </button>
                </div>
              )}
            </div>
            <div className="profile-field">
              <label>Profile Created</label>
              <div className="profile-value">
                {new Date(profile.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="profile-field">
              <label>Last Updated</label>
              <div className="profile-value">
                {new Date(profile.updated_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

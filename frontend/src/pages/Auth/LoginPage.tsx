import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

type LoginTab = 'citizen' | 'service-provider' | 'admin';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LoginTab>('citizen');
  
  // Citizen login state (same as before)
  const [aadhar, setAadhar] = useState('');
  const [otpId, setOtpId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  
  // Service Provider registration state
  const [spAadhar, setSpAadhar] = useState('');
  const [spRequestType, setSpRequestType] = useState<'ESANJEEVANI' | 'MKISAN' | ''>('');
  const [spOrganizationName, setSpOrganizationName] = useState('');
  const [spRegistrationNumber, setSpRegistrationNumber] = useState('');
  // e-Sanjeevani fields
  const [spProviderType, setSpProviderType] = useState('');
  const [spSpecialization, setSpSpecialization] = useState('');
  const [spYearsOfExperience, setSpYearsOfExperience] = useState('');
  // mKisan fields
  const [spProviderCategory, setSpProviderCategory] = useState('');
  const [spBusinessLicense, setSpBusinessLicense] = useState('');
  const [spGstNumber, setSpGstNumber] = useState('');
  const [spYearsInBusiness, setSpYearsInBusiness] = useState('');
  
  // Admin login state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { login, verifyOTP } = useAuth();

  // Citizen login handlers (same as before)
  const handleAadharSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(aadhar);
      setOtpId(response.otp_id);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyOTP(aadhar, otpId!, otpCode);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Service Provider registration handler
  const handleSPRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const registrationData: any = {
        aadhar: spAadhar,
        request_type: spRequestType,
        organization_name: spOrganizationName || null,
        registration_number: spRegistrationNumber || null,
      };

      if (spRequestType === 'ESANJEEVANI') {
        registrationData.provider_type = spProviderType;
        registrationData.specialization = spSpecialization;
        registrationData.years_of_experience = spYearsOfExperience ? parseInt(spYearsOfExperience) : null;
      } else if (spRequestType === 'MKISAN') {
        registrationData.provider_category = spProviderCategory;
        registrationData.business_license = spBusinessLicense || null;
        registrationData.gst_number = spGstNumber || null;
        registrationData.years_in_business = spYearsInBusiness ? parseInt(spYearsInBusiness) : null;
      }

      const response = await api.post('/sp-registration/register', registrationData);
      setSuccess(`Registration request submitted successfully! Request ID: ${response.data.request_id}. Your request has been assigned to admin ${response.data.assigned_admin.full_name} for approval.`);
      
      // Reset form
      setSpAadhar('');
      setSpRequestType('');
      setSpOrganizationName('');
      setSpRegistrationNumber('');
      setSpProviderType('');
      setSpSpecialization('');
      setSpYearsOfExperience('');
      setSpProviderCategory('');
      setSpBusinessLicense('');
      setSpGstNumber('');
      setSpYearsInBusiness('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit registration request');
    } finally {
      setLoading(false);
    }
  };

  // Admin login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/admin/login', {
        username: adminUsername,
        password: adminPassword,
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // Fetch user details
      const userResponse = await api.get('/auth/me');
      const userData = userResponse.data;
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/90 via-primary to-accent/80 p-5">
      <div className="bg-card rounded-xl p-10 w-full max-w-md shadow-2xl border border-border">
        <h1 className="text-center text-foreground mb-2 text-3xl font-bold">JanSetu</h1>
        <p className="text-center text-muted-foreground mb-8 text-sm">Unified Digital Public Infrastructure Platform</p>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => {
              setActiveTab('citizen');
              setError('');
              setSuccess('');
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'citizen'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => {
              setActiveTab('service-provider');
              setError('');
              setSuccess('');
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'service-provider'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Service Provider
          </button>
          <button
            onClick={() => {
              setActiveTab('admin');
              setError('');
              setSuccess('');
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'admin'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Citizen Login */}
        {activeTab === 'citizen' && (
          <>
            {!otpId ? (
              <form onSubmit={handleAadharSubmit}>
                <div className="mb-5">
                  <label htmlFor="aadhar" className="block mb-2 text-foreground font-medium">Aadhar Card Number</label>
                  <input
                    type="text"
                    id="aadhar"
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value.toUpperCase().slice(0, 20))}
                    placeholder="Enter Aadhar (e.g., ABC123456789)"
                    required
                    minLength={12}
                    maxLength={20}
                    className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                  />
                </div>
                {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4 text-sm border border-destructive/20">{error}</div>}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit}>
                <div className="mb-5">
                  <label htmlFor="otp" className="block mb-2 text-foreground font-medium">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    autoFocus
                    className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Check the <strong>backend terminal</strong> for your OTP code.
                  </p>
                </div>
                {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4 text-sm border border-destructive/20">{error}</div>}
                <button 
                  type="submit" 
                  disabled={loading || otpCode.length !== 6}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed mb-3"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpId(null);
                    setOtpCode('');
                    setError('');
                  }}
                  className="w-full py-3 bg-secondary text-secondary-foreground rounded-md font-semibold hover:bg-secondary/80 transition-colors"
                >
                  Change Aadhar Number
                </button>
              </form>
            )}
          </>
        )}

        {/* Service Provider Registration */}
        {activeTab === 'service-provider' && (
          <form onSubmit={handleSPRegistration} className="space-y-4">
            <div>
              <label className="block mb-2 text-foreground font-medium">Aadhar Card Number *</label>
              <input
                type="text"
                value={spAadhar}
                onChange={(e) => setSpAadhar(e.target.value.toUpperCase().slice(0, 20))}
                placeholder="Enter Aadhar (e.g., ABC123456789)"
                required
                minLength={12}
                maxLength={20}
                className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block mb-2 text-foreground font-medium">Service Type *</label>
              <select
                value={spRequestType}
                onChange={(e) => setSpRequestType(e.target.value as 'ESANJEEVANI' | 'MKISAN' | '')}
                required
                className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select service type</option>
                <option value="ESANJEEVANI">e-Sanjeevani (Healthcare)</option>
                <option value="MKISAN">mKisan (Agriculture)</option>
              </select>
            </div>

            {/* e-Sanjeevani fields */}
            {spRequestType === 'ESANJEEVANI' && (
              <>
                <div>
                  <label className="block mb-2 text-foreground font-medium">Profession *</label>
                  <select
                    value={spProviderType}
                    onChange={(e) => setSpProviderType(e.target.value)}
                    required
                    className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select profession</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="NURSE">Nurse</option>
                    <option value="PHARMACIST">Pharmacist</option>
                    <option value="LAB_TECHNICIAN">Lab Technician</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-foreground font-medium">Specialization *</label>
                  <input
                    type="text"
                    value={spSpecialization}
                    onChange={(e) => setSpSpecialization(e.target.value)}
                    placeholder="e.g., Orthopedic, Cardiology"
                    required
                    className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-foreground font-medium">Years of Experience *</label>
                  <input
                    type="number"
                    value={spYearsOfExperience}
                    onChange={(e) => setSpYearsOfExperience(e.target.value)}
                    placeholder="e.g., 5"
                    required
                    min="0"
                    className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}

            {/* mKisan fields */}
            {spRequestType === 'MKISAN' && (
              <>
                <div>
                  <label className="block mb-2 text-foreground font-medium">Provider Category *</label>
                  <select
                    value={spProviderCategory}
                    onChange={(e) => setSpProviderCategory(e.target.value)}
                    required
                    className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select category</option>
                    <option value="PROCUREMENT_AGENT">Procurement Agent</option>
                    <option value="WHOLESALER">Wholesaler</option>
                    <option value="RETAILER">Retailer</option>
                    <option value="EXPORTER">Exporter</option>
                    <option value="PROCESSING_UNIT">Processing Unit</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-foreground font-medium">Business License</label>
                  <input
                    type="text"
                    value={spBusinessLicense}
                    onChange={(e) => setSpBusinessLicense(e.target.value)}
                    placeholder="Business license number"
                    className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-foreground font-medium">GST Number</label>
                  <input
                    type="text"
                    value={spGstNumber}
                    onChange={(e) => setSpGstNumber(e.target.value)}
                    placeholder="GST number"
                    className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-foreground font-medium">Years in Business</label>
                  <input
                    type="number"
                    value={spYearsInBusiness}
                    onChange={(e) => setSpYearsInBusiness(e.target.value)}
                    placeholder="e.g., 5"
                    min="0"
                    className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block mb-2 text-foreground font-medium">Organization Name</label>
              <input
                type="text"
                value={spOrganizationName}
                onChange={(e) => setSpOrganizationName(e.target.value)}
                placeholder="Organization name (optional)"
                className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block mb-2 text-foreground font-medium">Registration Number</label>
              <input
                type="text"
                value={spRegistrationNumber}
                onChange={(e) => setSpRegistrationNumber(e.target.value)}
                placeholder="Registration number (optional)"
                className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm border border-destructive/20">{error}</div>}
            {success && <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md text-sm border border-green-300">{success}</div>}
            <button 
              type="submit" 
              disabled={loading || !spRequestType}
              className="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Register as Service Provider'}
            </button>
          </form>
        )}

        {/* Admin Login */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin}>
            <div className="mb-5">
              <label className="block mb-2 text-foreground font-medium">Username</label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-foreground font-medium">Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4 text-sm border border-destructive/20">{error}</div>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

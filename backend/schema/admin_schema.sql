CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE admins (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE sp_registration_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_provider_id UUID NOT NULL,
    request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('ESANJEEVANI', 'MKISAN')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'RESUBMISSION_REQUIRED')) DEFAULT 'PENDING',
    
    -- Service Provider Basic Info (from service_providers table)
    aadhaar_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT,
    organization_name VARCHAR(255),
    registration_number VARCHAR(255),
    
    -- e-Sanjeevani Specific Fields (if request_type = 'ESANJEEVANI')
    provider_type VARCHAR(50),
    specialization VARCHAR(100),
    years_of_experience INTEGER,
    
    -- mKisan Specific Fields (if request_type = 'MKISAN')
    provider_category VARCHAR(50),
    business_license VARCHAR(255),
    gst_number VARCHAR(50),
    years_in_business INTEGER,
    
    -- Documents/Attachments (JSON or comma-separated file paths)
    documents TEXT,
    
    -- Admin Review Fields
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    admin_comments TEXT,
    rejection_reason TEXT,
    
    -- Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT fk_sp_request_service_provider FOREIGN KEY (service_provider_id) REFERENCES service_providers(service_provider_id) ON DELETE CASCADE,
    CONSTRAINT fk_sp_request_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_sp_requests_service_provider_id ON sp_registration_requests(service_provider_id);
CREATE INDEX idx_sp_requests_status ON sp_registration_requests(status);
CREATE INDEX idx_sp_requests_request_type ON sp_registration_requests(request_type);
CREATE INDEX idx_sp_requests_submitted_at ON sp_registration_requests(submitted_at);
CREATE INDEX idx_sp_requests_reviewed_by ON sp_registration_requests(reviewed_by);

CREATE OR REPLACE FUNCTION update_admin_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_admin_updated_at_column();

CREATE OR REPLACE FUNCTION update_sp_request_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sp_requests_updated_at BEFORE UPDATE ON sp_registration_requests FOR EACH ROW EXECUTE FUNCTION update_sp_request_updated_at_column();

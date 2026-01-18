CREATE TABLE IF NOT EXISTS admins (
    admin_id TEXT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS sp_registration_requests (
    request_id TEXT PRIMARY KEY,
    service_provider_id TEXT NOT NULL,
    request_type TEXT NOT NULL CHECK (request_type IN ('ESANJEEVANI', 'MKISAN')),
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'RESUBMISSION_REQUIRED')) DEFAULT 'PENDING',
    
    -- Service Provider Basic Info (from service_providers table)
    aadhaar_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    gender TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    address TEXT,
    organization_name TEXT,
    registration_number TEXT,
    
    -- e-Sanjeevani Specific Fields (if request_type = 'ESANJEEVANI')
    provider_type TEXT,
    specialization TEXT,
    years_of_experience INTEGER,
    
    -- mKisan Specific Fields (if request_type = 'MKISAN')
    provider_category TEXT,
    business_license TEXT,
    gst_number TEXT,
    years_in_business INTEGER,
    
    -- Documents/Attachments (JSON or comma-separated)
    documents TEXT,
    
    -- Admin Review Fields
    reviewed_by TEXT,
    reviewed_at TEXT,
    admin_comments TEXT,
    rejection_reason TEXT,
    
    -- Timestamps
    submitted_at TEXT DEFAULT (datetime('now')) NOT NULL,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')) NOT NULL,
    
    FOREIGN KEY (service_provider_id) REFERENCES service_providers(service_provider_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_sp_requests_service_provider_id ON sp_registration_requests(service_provider_id);
CREATE INDEX IF NOT EXISTS idx_sp_requests_status ON sp_registration_requests(status);
CREATE INDEX IF NOT EXISTS idx_sp_requests_request_type ON sp_registration_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_sp_requests_submitted_at ON sp_registration_requests(submitted_at);
CREATE INDEX IF NOT EXISTS idx_sp_requests_reviewed_by ON sp_registration_requests(reviewed_by);

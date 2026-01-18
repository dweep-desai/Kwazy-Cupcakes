-- User Activity Logs Schema for PostgreSQL
-- This table logs all user activities across the platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE user_activity_logs (
    activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID NOT NULL,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN (
        'BOOK_TRANSPORT',
        'BOOK_APPOINTMENT',
        'CALL_AMBULANCE',
        'LIST_PRODUCT',
        'PURCHASE_PRODUCT',
        'UPDATE_PROFILE',
        'REGISTER_SELLER',
        'ACCESS_SERVICE',
        'VIEW_SCHEME',
        'OTHER'
    )),
    activity_description TEXT NOT NULL,
    entity_type VARCHAR(50),  -- e.g., 'transport_booking', 'appointment', 'product'
    entity_id UUID,           -- ID of the related entity (booking_id, appointment_id, product_id)
    metadata JSONB,           -- JSON with additional details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_user_activity_citizen FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_activity_logs_citizen_id ON user_activity_logs(citizen_id);
CREATE INDEX idx_user_activity_logs_activity_type ON user_activity_logs(activity_type);
CREATE INDEX idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX idx_user_activity_logs_entity_type ON user_activity_logs(entity_type);

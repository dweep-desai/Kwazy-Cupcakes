-- User Activity Logs Schema for SQLite
-- This table logs all user activities across the platform

CREATE TABLE IF NOT EXISTS user_activity_logs (
    activity_id TEXT PRIMARY KEY,
    citizen_id TEXT NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
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
    entity_type TEXT,  -- e.g., 'transport_booking', 'appointment', 'product'
    entity_id TEXT,    -- ID of the related entity (booking_id, appointment_id, product_id)
    metadata TEXT,     -- JSON string with additional details
    created_at TEXT DEFAULT (datetime('now')) NOT NULL,
    FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_citizen_id ON user_activity_logs(citizen_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_activity_type ON user_activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_entity_type ON user_activity_logs(entity_type);

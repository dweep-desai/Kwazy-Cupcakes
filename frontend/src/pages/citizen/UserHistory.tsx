import React, { useState, useEffect } from 'react';
import { Clock, Bus, Calendar, Package, User, Eye, ChevronDown, ChevronUp, Ambulance } from 'lucide-react';
import api from '@/services/api';

interface ActivityLog {
    activity_id: string;
    citizen_id: string;
    activity_type: string;
    activity_description: string;
    entity_type: string | null;
    entity_id: string | null;
    metadata: any;
    created_at: string;
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'BOOK_TRANSPORT':
            return <Bus className="w-5 h-5" />;
        case 'BOOK_APPOINTMENT':
            return <Calendar className="w-5 h-5" />;
        case 'CALL_AMBULANCE':
            return <Ambulance className="w-5 h-5" />;
        case 'LIST_PRODUCT':
        case 'PURCHASE_PRODUCT':
            return <Package className="w-5 h-5" />;
        case 'UPDATE_PROFILE':
            return <User className="w-5 h-5" />;
        default:
            return <Clock className="w-5 h-5" />;
    }
};

const getActivityColor = (type: string) => {
    switch (type) {
        case 'BOOK_TRANSPORT':
            return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'BOOK_APPOINTMENT':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'CALL_AMBULANCE':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'LIST_PRODUCT':
            return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'PURCHASE_PRODUCT':
            return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'UPDATE_PROFILE':
            return 'bg-gray-100 text-gray-700 border-gray-200';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

const formatActivityType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const UserHistory: React.FC = () => {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchActivities();
    }, [filter]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const url = filter === 'ALL' 
                ? '/activity-logs/my-history' 
                : `/activity-logs/my-history?activity_type=${filter}`;
            const response = await api.get(url);
            setActivities(response.data || []);
        } catch (error: any) {
            console.error('Failed to fetch activity history:', error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (activityId: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(activityId)) {
            newExpanded.delete(activityId);
        } else {
            newExpanded.add(activityId);
        }
        setExpandedItems(newExpanded);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const activityTypes = [
        { value: 'ALL', label: 'All Activities' },
        { value: 'BOOK_TRANSPORT', label: 'Transport Bookings' },
        { value: 'BOOK_APPOINTMENT', label: 'Appointments' },
        { value: 'CALL_AMBULANCE', label: 'Ambulance Requests' },
        { value: 'LIST_PRODUCT', label: 'Product Listings' },
        { value: 'PURCHASE_PRODUCT', label: 'Product Purchases' },
        { value: 'UPDATE_PROFILE', label: 'Profile Updates' },
    ];

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Activity History</h1>
                <p className="text-gray-600">Track all your activities and interactions on the platform</p>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
                {activityTypes.map((type) => (
                    <button
                        key={type.value}
                        onClick={() => setFilter(type.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === type.value
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>

            {/* Activities List */}
            {loading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <p className="text-gray-600">Loading your activity history...</p>
                </div>
            ) : activities.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Eye size={32} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">No activities found</h4>
                    <p className="text-gray-500 max-w-sm mt-1">
                        {filter === 'ALL' 
                            ? "Your activity history will appear here as you use the platform."
                            : `No ${activityTypes.find(t => t.value === filter)?.label.toLowerCase()} found.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activities.map((activity) => {
                        const isExpanded = expandedItems.has(activity.activity_id);
                        const hasMetadata = activity.metadata && Object.keys(activity.metadata).length > 0;

                        return (
                            <div
                                key={activity.activity_id}
                                className={`bg-white rounded-xl border ${getActivityColor(activity.activity_type)} transition-all duration-200 hover:shadow-md`}
                            >
                                <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => hasMetadata && toggleExpand(activity.activity_id)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-lg ${getActivityColor(activity.activity_type)}`}>
                                            {getActivityIcon(activity.activity_type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900 mb-1">
                                                        {activity.activity_description}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {formatDate(activity.created_at)}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/50">
                                                            {formatActivityType(activity.activity_type)}
                                                        </span>
                                                    </div>
                                                </div>
                                                {hasMetadata && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleExpand(activity.activity_id);
                                                        }}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Metadata */}
                                {isExpanded && hasMetadata && (
                                    <div className="px-4 pb-4 pt-0 border-t border-gray-200 mt-2">
                                        <div className="pt-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Details:</h4>
                                            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                                {Object.entries(activity.metadata).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between text-sm">
                                                        <span className="text-gray-600 capitalize">
                                                            {key.replace(/_/g, ' ')}:
                                                        </span>
                                                        <span className="font-medium text-gray-900">
                                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserHistory;

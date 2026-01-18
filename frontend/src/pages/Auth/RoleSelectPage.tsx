import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const RoleSelectPage: React.FC = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'citizen',
            title: 'Citizen',
            description: 'Access government services and documents.',
            icon: User,
            color: 'bg-green-100 text-green-700',
            path: '/auth/citizen/login'
        },
        {
            id: 'provider',
            title: 'Service Provider',
            description: 'Register and offer services to citizens.',
            icon: Building2,
            color: 'bg-blue-100 text-blue-700',
            path: '/auth/provider/login'
        },
        {
            id: 'admin',
            title: 'Government Admin',
            description: 'Manage platform and approvals.',
            icon: ShieldCheck,
            color: 'bg-purple-100 text-purple-700',
            path: '/auth/admin/login'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">JanSetu</h1>
                <p className="text-xl text-gray-600">Select your role to continue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => navigate(role.path)}
                        className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 group text-left"
                    >
                        <div className={cn("p-4 rounded-full mb-6", role.color)}>
                            <role.icon className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h3>
                        <p className="text-gray-500 text-center mb-8">{role.description}</p>
                        <div className="mt-auto flex items-center text-sm font-semibold text-gray-900 group-hover:translate-x-1 transition-transform">
                            Continue <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RoleSelectPage;

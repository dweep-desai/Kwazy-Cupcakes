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
            color: 'bg-emerald-100 text-emerald-700',
            borderColor: 'group-hover:border-emerald-500/50',
            path: '/login?tab=citizen'
        },
        {
            id: 'provider',
            title: 'Service Provider',
            description: 'Register and offer services to citizens.',
            icon: Building2,
            color: 'bg-blue-100 text-blue-700',
            borderColor: 'group-hover:border-blue-500/50',
            path: '/login?tab=service-provider'
        },
        {
            id: 'admin',
            title: 'Government Admin',
            description: 'Manage platform and approvals.',
            icon: ShieldCheck,
            color: 'bg-purple-100 text-purple-700',
            borderColor: 'group-hover:border-purple-500/50',
            path: '/login?tab=admin'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50">
            {/* Premium Background */}
            <div className="absolute inset-0 bg-slate-50">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent blur-3xl opacity-70" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-500/20 via-teal-500/20 to-transparent blur-3xl opacity-70" />
            </div>

            <div className="relative z-10 max-w-6xl w-full">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center p-2 bg-white/50 backdrop-blur-sm rounded-full border border-slate-200/60 shadow-sm mb-4">
                        <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full mr-2">New</span>
                        <span className="text-sm font-medium text-slate-600 pr-2">JanSetu 2.0 is now live</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">JanSetu</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
                        Unified Digital Public Infrastructure Platform for seamless access to government services.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-4">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => navigate(role.path)}
                            className={cn(
                                "relative flex flex-col items-start p-8 bg-white/80 backdrop-blur-xl rounded-3xl",
                                "border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
                                "hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1",
                                "transition-all duration-300 group text-left w-full",
                                role.borderColor
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className={cn("relative p-4 rounded-2xl mb-6 transition-transform duration-300 group-hover:scale-110", role.color)}>
                                <role.icon className="w-8 h-8" />
                            </div>

                            <div className="relative space-y-2 mb-8 flex-1">
                                <h3 className="text-2xl font-bold text-slate-900">{role.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">{role.description}</p>
                            </div>

                            <div className="relative w-full flex items-center justify-between pt-6 border-t border-slate-100 group-hover:border-slate-200/0 transition-colors">
                                <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-900 transition-colors">Select Role</span>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-6 text-center text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} JanSetu Platform. Secure Government Gateway.
            </div>
        </div>
    );
};

export default RoleSelectPage;

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface SchemeWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

const SchemeWizard: React.FC<SchemeWizardProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        state: '',
        category: '',
        gender: '',
        isBPL: false,
        isDifferentlyAbled: false,
        isSeniorCitizen: false,
        residenceArea: '',
        occupation: '',
        employmentStatus: '',
        isMinority: false
    });

    if (!isOpen) return null;

    const handleNext = () => {
        setLoading(true);
        // Simulate processing delay
        setTimeout(() => {
            setLoading(false);
            setStep(prev => prev + 1);
        }, 600);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleReset = () => {
        setFormData({
            state: '',
            category: '',
            gender: '',
            isBPL: false,
            isDifferentlyAbled: false,
            isSeniorCitizen: false,
            residenceArea: '',
            occupation: '',
            employmentStatus: '',
            isMinority: false
        });
        setStep(1);
    };

    // Render Steps
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white rounded-2xl shadow-xl w-full ${step === 3 ? 'max-w-2xl' : 'max-w-xl'} overflow-hidden animate-in zoom-in-95 duration-200 mx-4 max-h-[90vh] flex flex-col`}>

                {/* Header with Progress */}
                <div className="p-6 border-b flex items-start justify-between">
                    <div>
                        <div className="flex gap-2 mb-2">
                            {[1, 2, 3].map(s => (
                                <div
                                    key={s}
                                    className={`h-2 rounded-full transition-all duration-500 ${s === step ? 'w-12 bg-blue-600' :
                                        s < step ? 'w-12 bg-green-500' : 'w-12 bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {step === 1 && "Basic Details"}
                            {step === 2 && "Additional Details"}
                            {step === 3 && "You might be eligible for..."}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar">

                    {/* Step 1: Basic Details */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Your State *</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.state}
                                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="UP">Uttar Pradesh</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <div className="flex gap-4 flex-wrap">
                                    {['General', 'OBC', 'PVTG', 'SC', 'ST'].map(opt => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={opt}
                                                checked={formData.category === opt}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="text-gray-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Gender</label>
                                <div className="flex gap-3">
                                    {['Male', 'Female', 'Transgender'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setFormData({ ...formData, gender: opt })}
                                            className={`flex-1 py-2 rounded-xl border transition-all ${formData.gender === opt
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                                : 'border-gray-300 text-gray-600 hover:border-blue-300'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                {[
                                    { label: 'Do you belong to BPL category?', key: 'isBPL' },
                                    { label: 'Are you differently abled?', key: 'isDifferentlyAbled' },
                                    { label: 'Are you senior citizen?', key: 'isSeniorCitizen' }
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between">
                                        <label className="text-gray-700">{item.label}</label>
                                        <input
                                            type="checkbox"
                                            checked={(formData as any)[item.key]}
                                            onChange={e => setFormData({ ...formData, [item.key]: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Additional Details */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Area of Residence</label>
                                <div className="flex gap-3">
                                    {['Urban', 'Rural'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setFormData({ ...formData, residenceArea: opt })}
                                            className={`flex-1 py-2 rounded-xl border transition-all ${formData.residenceArea === opt
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                                : 'border-gray-300 text-gray-600 hover:border-blue-300'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Occupation</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.occupation}
                                    onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="Student">Student</option>
                                    <option value="Farmer">Farmer</option>
                                    <option value="Business">Business</option>
                                    <option value="Unemployed">Unemployed</option>
                                    <option value="Government Employee">Government Employee</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.employmentStatus}
                                    onChange={e => setFormData({ ...formData, employmentStatus: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="Employed">Employed</option>
                                    <option value="Unemployed">Unemployed</option>
                                    <option value="Self Employed">Self Employed</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="text-gray-700">Do you belong to minority?</label>
                                <input
                                    type="checkbox"
                                    checked={formData.isMinority}
                                    onChange={e => setFormData({ ...formData, isMinority: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Results */}
                    {step === 3 && (
                        <div className="animate-in slide-in-from-right duration-300 space-y-4">
                            <p className="text-sm text-gray-600">* Select one or more categories to view.</p>

                            <div className="space-y-3">
                                {[
                                    { title: "Social Welfare & Empowerment", count: 24, color: "bg-purple-50 text-purple-700", icon: "🧘" },
                                    { title: "Skills & Employment", count: 17, color: "bg-orange-50 text-orange-700", icon: "💼" },
                                    { title: "Banking, Financial & Insurance", count: 13, color: "bg-yellow-50 text-yellow-700", icon: "🏦" },
                                    { title: "Education & Learning", count: 11, color: "bg-red-50 text-red-700", icon: "🎓" },
                                    { title: "Health & Wellness", count: 11, color: "bg-green-50 text-green-700", icon: "🏥" },
                                    { title: "Agriculture", count: 9, color: "bg-emerald-50 text-emerald-700", icon: "🚜" },
                                ].map((cat, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${cat.color}`}>
                                                {cat.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">{cat.title}</h3>
                                                <p className="text-sm text-gray-500">{cat.count} schemes</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t bg-gray-50 flex justify-between items-center">

                    {step === 1 ? (
                        <button
                            onClick={handleReset}
                            className="text-gray-500 hover:text-gray-700 font-medium px-4"
                        >
                            Reset
                        </button>
                    ) : (
                        <button
                            onClick={handleBack}
                            className="flex items-center text-gray-600 hover:text-gray-800 font-medium px-4 gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                            {step === 2 ? 'Show Eligible Schemes' : 'Next'}
                        </button>
                    ) : (
                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            Show Schemes (69)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchemeWizard;

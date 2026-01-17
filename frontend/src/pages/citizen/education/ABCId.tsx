import React, { useState } from 'react';
import { IdCard, Search, GraduationCap, FileText } from 'lucide-react';

interface Credit {
    id: string;
    course: string;
    institution: string;
    credits: number;
    grade: string;
    semester: string;
    status: 'Verified' | 'Pending';
}

const ABCId = () => {
    const [abcId, setAbcId] = useState('');
    const [credits, setCredits] = useState<Credit[]>([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!abcId.trim()) return;

        // Mock data
        setCredits([
            { id: '1', course: 'Computer Science', institution: 'Delhi University', credits: 4, grade: 'A', semester: 'Semester 1', status: 'Verified' },
            { id: '2', course: 'Mathematics', institution: 'Delhi University', credits: 3, grade: 'B+', semester: 'Semester 1', status: 'Verified' },
            { id: '3', course: 'Physics', institution: 'IIT Delhi', credits: 4, grade: 'A+', semester: 'Semester 2', status: 'Verified' },
        ]);
        setSearched(true);
    };

    const totalCredits = credits.reduce((sum, credit) => sum + credit.credits, 0);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">ABC ID - Academic Bank of Credits</h1>
                <p className="text-gray-600">View and manage your academic credits</p>
            </div>

            {/* Search Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <IdCard className="w-4 h-4 inline mr-1" />
                            ABC ID
                        </label>
                        <input
                            type="text"
                            value={abcId}
                            onChange={(e) => setAbcId(e.target.value)}
                            placeholder="Enter your ABC ID"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <Search className="w-5 h-5" />
                        Search Credits
                    </button>
                </form>
            </div>

            {/* Results */}
            {searched && (
                <div className="space-y-4">
                    {credits.length > 0 ? (
                        <>
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-700 font-medium">Total Credits Earned</p>
                                        <p className="text-3xl font-bold text-green-800">{totalCredits}</p>
                                    </div>
                                    <GraduationCap className="w-12 h-12 text-green-600" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {credits.map((credit) => (
                                    <div key={credit.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                                                    <FileText className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-gray-900">{credit.course}</h3>
                                                    <p className="text-gray-600 mb-2">{credit.institution}</p>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-500">Credits:</span>
                                                            <span className="font-medium ml-1">{credit.credits}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Grade:</span>
                                                            <span className="font-medium ml-1">{credit.grade}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500">Semester:</span>
                                                            <span className="font-medium ml-1">{credit.semester}</span>
                                                        </div>
                                                        <div>
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                credit.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                                {credit.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <IdCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No credits found for this ABC ID.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ABCId;

import React, { useState } from 'react';
import { Download, FileText, Search, Calendar, GraduationCap } from 'lucide-react';

interface Marksheet {
    id: string;
    examName: string;
    board: string;
    year: string;
    rollNumber: string;
    status: 'Available' | 'Pending';
    downloadUrl?: string;
}

const DownloadMarksheet = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [dob, setDob] = useState('');
    const [marksheets, setMarksheets] = useState<Marksheet[]>([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rollNumber || !dob) return;

        // Mock data
        setMarksheets([
            { id: '1', examName: 'Class 12 Board Exam', board: 'CBSE', year: '2023', rollNumber: rollNumber, status: 'Available', downloadUrl: '#' },
            { id: '2', examName: 'Class 10 Board Exam', board: 'CBSE', year: '2021', rollNumber: rollNumber, status: 'Available', downloadUrl: '#' },
        ]);
        setSearched(true);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Download Marksheet</h1>
                <p className="text-gray-600">Get your academic certificates and marksheets</p>
            </div>

            {/* Search Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Roll Number
                            </label>
                            <input
                                type="text"
                                value={rollNumber}
                                onChange={(e) => setRollNumber(e.target.value)}
                                placeholder="Enter roll number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <Search className="w-5 h-5" />
                        Search Marksheets
                    </button>
                </form>
            </div>

            {/* Results */}
            {searched && (
                <div className="space-y-4">
                    {marksheets.length > 0 ? (
                        marksheets.map((marksheet) => (
                            <div key={marksheet.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                            <GraduationCap className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-gray-900">{marksheet.examName}</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm text-gray-600">
                                                <div>
                                                    <span className="font-medium">Board:</span> {marksheet.board}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Year:</span> {marksheet.year}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Roll No:</span> {marksheet.rollNumber}
                                                </div>
                                            </div>
                                            <span className={`inline-block mt-2 px-3 py-1 rounded text-xs font-medium ${
                                                marksheet.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {marksheet.status}
                                            </span>
                                        </div>
                                    </div>
                                    {marksheet.status === 'Available' && (
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No marksheets found for the provided details.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DownloadMarksheet;

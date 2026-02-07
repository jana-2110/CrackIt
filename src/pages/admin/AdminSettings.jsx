import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminSettings = () => {
    const [config, setConfig] = useState({
        defaultTimeLimit: 30,
        maintenanceMode: false,
        appName: 'Crack It',
        allowSignup: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(db, 'settings', 'globalTestSettings');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setConfig(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
            setLoading(false);
        };
        fetchConfig();
    }, []);

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(db, 'settings', 'globalTestSettings');
            await setDoc(docRef, config, { merge: true });
            alert("System configuration updated successfully.");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings.");
        }
        setSaving(false);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-white">System Configuration</h1>

            {/* General Settings */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-300 mb-6 border-b border-gray-800 pb-2">General</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Application Name</label>
                        <input
                            type="text"
                            value={config.appName}
                            onChange={(e) => handleChange('appName', e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">System Mode</label>
                        <div className="flex items-center gap-4 py-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.maintenanceMode}
                                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-brand-primary focus:ring-offset-black"
                                />
                                <span className={config.maintenanceMode ? "text-red-400 font-bold" : "text-gray-400"}>Maintenance Mode</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.allowSignup}
                                    onChange={(e) => handleChange('allowSignup', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-brand-primary focus:ring-offset-black"
                                />
                                <span className="text-gray-400">Allow Public Signups</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Defaults */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-300 mb-6 border-b border-gray-800 pb-2">Exam Defaults</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Default Duration (Minutes)</label>
                        <input
                            type="number"
                            min="5"
                            max="180"
                            value={config.defaultTimeLimit}
                            onChange={(e) => handleChange('defaultTimeLimit', parseInt(e.target.value))}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Logs (Mockup) */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-300 mb-6 border-b border-gray-800 pb-2">Recent System Logs</h2>
                <div className="font-mono text-xs text-gray-500 space-y-2 max-h-40 overflow-y-auto">
                    <p>[2026-02-04 22:35] Admin login detected (admin@aptitude.com)</p>
                    <p>[2026-02-04 22:30] System update check completed</p>
                    <p>[2026-02-04 22:15] Firestore rules updated</p>
                    <p>[2026-02-04 21:55] User jdoe@example.com promoted to moderator</p>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
                >
                    {saving ? 'Saving Config...' : 'Save Configuration'}
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;

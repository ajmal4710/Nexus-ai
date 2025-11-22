import React, { useState, useEffect } from 'react';
import { 

User, CreditCard, Bell, Shield, Users, Key, 
CheckCircle2, AlertCircle, ChevronRight, Mail, 
LogOut, Globe, Moon, Laptop, Zap, Save, Loader2
} from 'lucide-react';

const Settings: React.FC = () => {
const [activeTab, setActiveTab] = useState<'general' | 'billing' | 'team' | 'notifications'>('general');
const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'connected' | 'missing'>('checking');

// Profile State
const [profile, setProfile] = useState({
    firstName: 'Alex',
    lastName: 'Chen',
    email: 'alex.chen@nexus.ai'
});
const [isSavingProfile, setIsSavingProfile] = useState(false);
const [profileSaved, setProfileSaved] = useState(false);

useEffect(() => {
    checkApiStatus();
}, []);

const checkApiStatus = async () => {
    if ((window as any).aistudio) {
        try {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            setApiKeyStatus(hasKey ? 'connected' : 'missing');
        } catch (e) {
            setApiKeyStatus('missing');
        }
    } else {
            // Fallback if not in expected environment, assume connected via env if present
            setApiKeyStatus(
                typeof window !== "undefined" && (window as any).API_KEY
                    ? 'connected'
                    : 'missing'
            );
    }
};

const handleConnectBilling = async () => {
    if ((window as any).aistudio) {
        try {
            await (window as any).aistudio.openSelectKey();
            // Re-check after selection
            setTimeout(checkApiStatus, 1000); 
        } catch (error) {
            console.error("Failed to open key selection", error);
        }
    } else {
            alert("Billing management is only available in the primary application environment.");
    }
};

const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    if (profileSaved) setProfileSaved(false);
};

const handleSaveProfile = () => {
    setIsSavingProfile(true);
    // Simulate API call
    setTimeout(() => {
        setIsSavingProfile(false);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
    }, 1000);
};

const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'team', label: 'Team & Roles', icon: Users },
    { id: 'billing', label: 'Billing & API', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
];

return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-fade-in">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <p className="text-slate-400">Manage your workspace preferences and billing.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-grow overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                            ${activeTab === tab.id 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                : 'text-slate-400 hover:bg-slate-900 hover:text-white'}
                        `}
                    >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                    </button>
                ))}
                
                <div className="pt-6 mt-6 border-t border-slate-800">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow bg-slate-900 rounded-2xl border border-slate-800 overflow-y-auto custom-scrollbar">
                
                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                    <div className="p-8 space-y-8">
                        <section>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">Profile Information</h3>
                                    <p className="text-sm text-slate-500">Update your account's profile information and email address.</p>
                                </div>
                                <button 
                                    onClick={handleSaveProfile}
                                    disabled={isSavingProfile}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all
                                        ${profileSaved 
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}
                                    `}
                                >
                                    {isSavingProfile ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                    ) : profileSaved ? (
                                        <><CheckCircle2 className="w-4 h-4" /> Saved</>
                                    ) : (
                                        <><Save className="w-4 h-4" /> Save Changes</>
                                    )}
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                                    <input 
                                        type="text" 
                                        name="firstName"
                                        value={profile.firstName}
                                        onChange={handleProfileChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                                    <input 
                                        type="text" 
                                        name="lastName"
                                        value={profile.lastName}
                                        onChange={handleProfileChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                                    <div className="flex">
                                         <div className="bg-slate-800 border border-r-0 border-slate-800 rounded-l-lg px-3 flex items-center text-slate-400">
                                             <Mail className="w-4 h-4" />
                                         </div>
                                         <input 
                                            type="email" 
                                            name="email"
                                            value={profile.email}
                                            onChange={handleProfileChange}
                                            className="flex-1 bg-slate-950 border border-slate-800 rounded-r-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                                         />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="w-full h-px bg-slate-800"></div>

                        <section>
                            <h3 className="text-lg font-semibold text-white mb-1">Appearance</h3>
                            <p className="text-sm text-slate-500 mb-6">Customize how Nexus AI looks on your device.</p>
                            
                            <div className="grid grid-cols-3 gap-4">
                                    <button className="border-2 border-indigo-500 bg-slate-950 p-4 rounded-xl flex flex-col items-center gap-2 text-indigo-400">
                                         <Moon className="w-6 h-6" />
                                         <span className="text-sm font-medium">Dark Mode</span>
                                    </button>
                                    <button className="border border-slate-800 hover:border-slate-600 bg-slate-950 p-4 rounded-xl flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors">
                                         <Zap className="w-6 h-6" />
                                         <span className="text-sm font-medium">Light Mode</span>
                                    </button>
                                    <button className="border border-slate-800 hover:border-slate-600 bg-slate-950 p-4 rounded-xl flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors">
                                         <Laptop className="w-6 h-6" />
                                         <span className="text-sm font-medium">System</span>
                                    </button>
                            </div>
                        </section>
                    </div>
                )}

                {/* TEAM TAB */}
                {activeTab === 'team' && (
                    <div className="p-8 space-y-6">
                         <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Team Members</h3>
                                    <p className="text-sm text-slate-500">Manage who has access to this workspace.</p>
                                </div>
                                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                                    <Users className="w-4 h-4" /> Invite Member
                                </button>
                         </div>

                         <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                             <table className="w-full text-left">
                                 <thead className="bg-slate-900 text-xs uppercase font-bold text-slate-500">
                                     <tr>
                                         <th className="px-6 py-4">User</th>
                                         <th className="px-6 py-4">Role</th>
                                         <th className="px-6 py-4">Status</th>
                                         <th className="px-6 py-4 text-right">Actions</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-800 text-sm">
                                        <tr>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">AC</div>
                                                    <div>
                                                        <div className="text-white font-medium">{profile.firstName} {profile.lastName}</div>
                                                        <div className="text-slate-500 text-xs">{profile.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><span className="text-white">Admin</span></td>
                                            <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400">Active</span></td>
                                            <td className="px-6 py-4 text-right text-slate-500">Owner</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">SJ</div>
                                                    <div>
                                                        <div className="text-white font-medium">Sarah Jones</div>
                                                        <div className="text-slate-500 text-xs">sarah.j@nexus.ai</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><span className="text-white">Editor</span></td>
                                            <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400">Active</span></td>
                                            <td className="px-6 py-4 text-right">
                                                    <button className="text-indigo-400 hover:text-indigo-300 text-xs font-medium">Edit</button>
                                            </td>
                                        </tr>
                                 </tbody>
                             </table>
                         </div>
                    </div>
                )}

                {/* BILLING & API TAB */}
                {activeTab === 'billing' && (
                     <div className="p-8 space-y-8">
                            {/* API Connection Status */}
                            <div className={`rounded-xl p-6 border ${apiKeyStatus === 'connected' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                                 <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                             <div className={`p-3 rounded-lg ${apiKeyStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                    <Key className="w-6 h-6" />
                                             </div>
                                             <div>
                                                    <h3 className="text-lg font-bold text-white mb-1">Google Cloud Billing & API</h3>
                                                    <p className="text-sm text-slate-400 max-w-lg mb-4">
                                                         To access premium generative features like Veo (Video) and Imagen 3 (Pro Images), a paid Google Cloud Project API key is required.
                                                    </p>
                                                    <div className="flex items-center gap-2 text-sm">
                                                            Status: 
                                                            {apiKeyStatus === 'checking' && <span className="text-slate-400 flex items-center gap-1"><div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div> Checking...</span>}
                                                            {apiKeyStatus === 'connected' && <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Active & Linked</span>}
                                                            {apiKeyStatus === 'missing' && <span className="text-rose-400 font-bold flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Not Connected</span>}
                                                    </div>
                                             </div>
                                        </div>
                                        <button 
                                            onClick={handleConnectBilling}
                                            className="bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg"
                                        >
                                             {apiKeyStatus === 'connected' ? 'Manage Key' : 'Connect Billing Account'}
                                        </button>
                                 </div>
                            </div>

                            <div className="w-full h-px bg-slate-800"></div>

                            {/* Usage Statistics */}
                            <section>
                                    <h3 className="text-lg font-semibold text-white mb-4">Current Usage (Monthly)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                                                    <div className="flex justify-between mb-2">
                                                            <span className="text-sm font-medium text-slate-400">Pro Generations (Veo/Imagen)</span>
                                                            <span className="text-sm font-bold text-white">12 / 50</span>
                                                    </div>
                                                    <div className="w-full bg-slate-900 rounded-full h-2 mb-2">
                                                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                                                    </div>
                                                    <p className="text-xs text-slate-500">Resets on Nov 1, 2024</p>
                                            </div>
                                            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                                                    <div className="flex justify-between mb-2">
                                                            <span className="text-sm font-medium text-slate-400">Flash Generations (Text/Code)</span>
                                                            <span className="text-sm font-bold text-white">1,240 / 10,000</span>
                                                    </div>
                                                    <div className="w-full bg-slate-900 rounded-full h-2 mb-2">
                                                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                                                    </div>
                                                    <p className="text-xs text-slate-500">High limits available</p>
                                            </div>
                                    </div>
                            </section>

                            {/* Plan Details */}
                            <section>
                                    <h3 className="text-lg font-semibold text-white mb-4">Subscription Plan</h3>
                                    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl p-6 flex items-center justify-between">
                                            <div>
                                                    <div className="uppercase tracking-wider text-xs font-bold text-indigo-400 mb-1">Current Plan</div>
                                                    <h2 className="text-2xl font-bold text-white mb-1">Pro Workspace</h2>
                                                    <p className="text-sm text-slate-400">$29/user/month • Next billing date: Oct 24</p>
                                            </div>
                                            <button className="text-indigo-300 hover:text-white text-sm font-medium underline">View Invoices</button>
                                    </div>
                            </section>
                     </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                     <div className="p-8 space-y-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                            
                            <div className="space-y-4">
                                    {[
                                            { title: "Campaign Performance", desc: "Daily summary of ad spend and ROAS", default: true },
                                            { title: "Content Approvals", desc: "When team members submit content for review", default: true },
                                            { title: "System Updates", desc: "New features and maintenance alerts", default: false },
                                            { title: "Budget Alerts", desc: "When campaigns reach 90% of daily budget", default: true }
                                    ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                                                    <div>
                                                            <div className="text-white font-medium">{item.title}</div>
                                                            <div className="text-slate-500 text-sm">{item.desc}</div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                            <input type="checkbox" className="sr-only peer" defaultChecked={item.default} />
                                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                    </label>
                                            </div>
                                    ))}
                            </div>
                     </div>
                )}

            </div>
        </div>
    </div>
);
};

export default Settings;
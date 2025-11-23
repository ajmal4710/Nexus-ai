import React, { useState, useRef } from 'react';
import { generatePPCKeywords, generatePPCAdCopy, generateMarketingImage, generateMarketingVideo, ensurePaidKey } from '../services/geminiService';
import { 
TrendingUp, DollarSign, MousePointerClick, Target, 
Search, ArrowUp, ArrowDown, 
Plus, X, Rocket, BrainCircuit, LayoutTemplate, Users, RefreshCw, Loader2, 
Globe, Image as ImageIcon, Video, Upload, Wand2, PlayCircle, Link as LinkIcon,
ShoppingBag, Facebook, Instagram, Linkedin, Twitter, Youtube, Ghost, Pin, Music,
CheckCircle2, Lock, AlertCircle
} from 'lucide-react';

interface Campaign {
id: number;
name: string;
platform: 'Google' | 'Facebook' | 'TikTok' | 'Bing' | 'LinkedIn' | 'Amazon' | 'Instagram' | 'Twitter' | 'YouTube' | 'Snapchat' | 'Pinterest';
status: 'Active' | 'Paused' | 'Draft';
budget: number;
spend: number;
cpc: number;
ctr: number;
roas: number;
bidStrategy: string;
}

const initialCampaigns: Campaign[] = [
{ id: 1, name: 'Summer Sale - Search', platform: 'Google', status: 'Active', budget: 150, spend: 1240, cpc: 1.20, ctr: 4.5, roas: 4.2, bidStrategy: 'Max Conv.' },
{ id: 2, name: 'Retargeting - Catalog', platform: 'Facebook', status: 'Active', budget: 80, spend: 850, cpc: 0.85, ctr: 2.1, roas: 6.8, bidStrategy: 'Target ROAS' },
{ id: 3, name: 'Brand Awareness', platform: 'TikTok', status: 'Paused', budget: 200, spend: 420, cpc: 0.45, ctr: 1.2, roas: 1.1, bidStrategy: 'Lowest Cost' },
];

const PPCManager: React.FC = () => {
const [view, setView] = useState<'dashboard' | 'create'>('dashboard');
const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);

// Platform Connection State
const [connectedPlatforms, setConnectedPlatforms] = useState<Record<string, boolean>>({
    'Google': true, // Simulating one already connected
    'Facebook': false,
    'TikTok': false,
    'Instagram': false
});
const [showConnectModal, setShowConnectModal] = useState(false);
const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

// Deployment State
const [isDeploying, setIsDeploying] = useState(false);
const [deploymentStep, setDeploymentStep] = useState(0);
const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);

// Wizard State
const [step, setStep] = useState(1);
const [newCampaign, setNewCampaign] = useState({
    name: '',
    platform: 'Google' as Campaign['platform'],
    objective: 'Sales',
    budget: 50,
    bidStrategy: 'Max Conversions',
    keywords: [] as string[],
    adHeadline: '',
    adDescription: '',
    adCTA: 'Shop Now',
    landingPageUrl: '',
    adMedia: null as string | null,
    adMediaType: 'image' as 'image' | 'video'
});

// Platform Categories
const platformCategories = {
    Search: [
        { id: 'Google', icon: Search, label: 'Google Ads' },
        { id: 'Bing', icon: Globe, label: 'Microsoft Ads' },
        { id: 'Amazon', icon: ShoppingBag, label: 'Amazon Ads' }
    ],
    Social: [
        { id: 'Facebook', icon: Facebook, label: 'Facebook' },
        { id: 'Instagram', icon: Instagram, label: 'Instagram' },
        { id: 'LinkedIn', icon: Linkedin, label: 'LinkedIn' },
        { id: 'Twitter', icon: Twitter, label: 'Twitter / X' }
    ],
    Video: [
        { id: 'YouTube', icon: Youtube, label: 'YouTube' },
        { id: 'TikTok', icon: Music, label: 'TikTok' },
        { id: 'Snapchat', icon: Ghost, label: 'Snapchat' }
    ],
    Display: [
        { id: 'Pinterest', icon: Pin, label: 'Pinterest' }
    ]
};

const [activeCategory, setActiveCategory] = useState<keyof typeof platformCategories>('Search');

// Creative State
const [mediaTab, setMediaTab] = useState<'upload' | 'ai'>('upload');
const [aiPrompt, setAiPrompt] = useState('');
const [generatingMedia, setGeneratingMedia] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);

// AI State
const [loadingAI, setLoadingAI] = useState(false);
const [loadingCopy, setLoadingCopy] = useState(false);

// Styles
const inputClass = "w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm";
const labelClass = "block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide";

const handleGenerateKeywords = async () => {
    if (!newCampaign.name) return;
    setLoadingAI(true);
    try {
        const kws = await generatePPCKeywords(newCampaign.name, newCampaign.platform);
        setNewCampaign({ ...newCampaign, keywords: kws });
    } catch (e) {
        console.error(e);
    }
    setLoadingAI(false);
};

const handleGenerateAd = async () => {
    setLoadingCopy(true);
    try {
        const genericPlatform = ['Google', 'Bing', 'Amazon'].includes(newCampaign.platform) ? 'Google' : 
                                                        ['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'Pinterest'].includes(newCampaign.platform) ? 'Facebook' : 'LinkedIn';
                                                        
        const copy = await generatePPCAdCopy(newCampaign.name, newCampaign.objective, genericPlatform as any);
        setNewCampaign({ 
            ...newCampaign, 
            adHeadline: copy.headlines[0], 
            adDescription: copy.descriptions[0] 
        });
        setAiPrompt(`Professional ${newCampaign.platform} ad visual for ${newCampaign.name}, focusing on ${newCampaign.objective}, high quality, commercial photography`);
    } catch (e) {
        console.error(e);
    }
    setLoadingCopy(false);
};

const handleGenerateMedia = async () => {
    setGeneratingMedia(true);
    try {
            const apiKey = await ensurePaidKey();
            if (!apiKey) {
                    alert("API Key required for media generation");
                    setGeneratingMedia(false);
                    return;
            }
            
            let resultUrl;
            const isVertical = ['TikTok', 'Snapchat', 'Instagram', 'Pinterest'].includes(newCampaign.platform);
            const aspectRatio = isVertical ? "9:16" : "16:9";
            const imgAspectRatio = isVertical ? "9:16" : "16:9";

            if (newCampaign.adMediaType === 'image') {
                    resultUrl = await generateMarketingImage(aiPrompt || newCampaign.name, imgAspectRatio as any, apiKey);
            } else {
                    resultUrl = await generateMarketingVideo(aiPrompt || newCampaign.name, aspectRatio as any, apiKey);
            }
            
            setNewCampaign({ ...newCampaign, adMedia: resultUrl });
    } catch (e) {
            console.error("Media generation failed", e);
            alert("Failed to generate media. Please try again.");
    }
    setGeneratingMedia(false);
};

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
                setNewCampaign({
                        ...newCampaign,
                        adMedia: event.target?.result as string,
                        adMediaType: file.type.startsWith('video') ? 'video' : 'image'
                });
        };
        reader.readAsDataURL(file);
};

// --- LAUNCH & CONNECTION LOGIC ---

const initiateLaunch = () => {
        // 1. Check if platform is connected
        if (!connectedPlatforms[newCampaign.platform]) {
                setShowConnectModal(true);
                return;
        }
        // 2. Start Deployment
        runDeploymentSequence();
};

const connectPlatform = () => {
        setConnectingPlatform(newCampaign.platform);
        // Simulate OAuth flow
        setTimeout(() => {
                setConnectedPlatforms(prev => ({ ...prev, [newCampaign.platform]: true }));
                setConnectingPlatform(null);
                setShowConnectModal(false);
                runDeploymentSequence(); // Auto-continue after connection
        }, 2000);
};

const runDeploymentSequence = () => {
        setIsDeploying(true);
        const logs = [
                `Initializing connection to ${newCampaign.platform} Ads API...`,
                `Authenticating with Client ID... Success.`,
                `Validating campaign structure... OK.`,
                `Uploading creative assets (${newCampaign.adMediaType})...`,
                `Setting bid strategy to '${newCampaign.bidStrategy}'...`,
                `Submitting for policy review...`,
                `Campaign '${newCampaign.name}' successfully published.`
        ];

        let currentStep = 0;
        setDeploymentLogs([]);

        const interval = setInterval(() => {
                if (currentStep >= logs.length) {
                        clearInterval(interval);
                        finalizeLaunch();
                } else {
                        setDeploymentLogs(prev => [...prev, logs[currentStep]]);
                        setDeploymentStep(currentStep + 1);
                        currentStep++;
                }
        }, 800); // Simulate network delay per step
};

const finalizeLaunch = () => {
    setTimeout(() => {
            const campaign: Campaign = {
                id: Date.now(),
                name: newCampaign.name,
                platform: newCampaign.platform,
                status: 'Active',
                budget: newCampaign.budget,
                spend: 0,
                cpc: 0,
                ctr: 0,
                roas: 0,
                bidStrategy: newCampaign.bidStrategy
            };
            setCampaigns([campaign, ...campaigns]);
            setIsDeploying(false);
            setDeploymentLogs([]);
            setDeploymentStep(0);
            setView('dashboard');
            setStep(1);
            // Reset form
            setNewCampaign({ 
                name: '', 
                platform: 'Google', 
                objective: 'Sales', 
                budget: 50, 
                bidStrategy: 'Max Conversions',
                keywords: [], 
                adHeadline: '', 
                adDescription: '',
                adCTA: 'Shop Now',
                landingPageUrl: '',
                adMedia: null,
                adMediaType: 'image'
            });
    }, 1000);
};

const toggleStatus = (id: number) => {
        setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c));
};

const getDisplayUrl = () => {
        if (!newCampaign.landingPageUrl) return 'example.com';
        try {
                const url = new URL(newCampaign.landingPageUrl.startsWith('http') ? newCampaign.landingPageUrl : `https://${newCampaign.landingPageUrl}`);
                return url.hostname + (url.pathname !== '/' ? url.pathname : '');
        } catch {
                return newCampaign.landingPageUrl;
        }
};

const renderAdPreview = () => {
        const isSearch = ['Google', 'Bing'].includes(newCampaign.platform);
        const isCommerce = ['Amazon'].includes(newCampaign.platform);
        const isVerticalVideo = ['TikTok', 'Snapchat'].includes(newCampaign.platform);
        const isPinterest = ['Pinterest'].includes(newCampaign.platform);
        const isYouTube = ['YouTube'].includes(newCampaign.platform);
        
        if (isSearch) {
                return (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm font-sans text-left">
                            <div className="flex items-center gap-1 mb-1">
                                    <span className="text-xs font-bold text-slate-900">Ad</span>
                                    <span className="text-xs text-slate-500">· {getDisplayUrl()}</span>
                            </div>
                            <h3 className="text-blue-700 text-xl font-medium hover:underline cursor-pointer leading-snug mb-1">
                                    {newCampaign.adHeadline || "Your Headline Here"}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                    {newCampaign.adDescription || "Your ad description will appear here. Highlight your unique value proposition and call to action."}
                            </p>
                    </div>
                );
        }

        if (isCommerce) {
                return (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-left">
                                <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center relative">
                                        {newCampaign.adMedia ? <img src={newCampaign.adMedia} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-300 w-12 h-12" />}
                                        <div className="absolute top-2 right-2 text-[10px] text-slate-500 bg-white/90 px-1 rounded border">Sponsored</div>
                                </div>
                                <h3 className="text-slate-900 font-medium leading-snug line-clamp-2 mb-1">{newCampaign.adHeadline || "Product Name & Key Features"}</h3>
                                <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-lg font-bold text-slate-900">$49.99</span>
                                </div>
                                <button className="w-full py-1.5 bg-yellow-400 hover:bg-yellow-500 rounded-full text-xs font-bold text-slate-900 transition-colors">Add to Cart</button>
                        </div>
                );
        }

        if (isVerticalVideo || isPinterest) {
                 return (
                        <div className={`bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden relative text-left ${isPinterest ? 'aspect-[2/3]' : 'aspect-[9/16]'}`}>
                                {newCampaign.adMedia ? (
                                        newCampaign.adMediaType === 'video' ? 
                                        <video src={newCampaign.adMedia} className="w-full h-full object-cover" muted loop autoPlay /> :
                                        <img src={newCampaign.adMedia} className="w-full h-full object-cover" />
                                ) : (
                                        <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-500">
                                                <Video className="w-10 h-10 mb-2" />
                                                <span className="text-xs">Vertical Media</span>
                                        </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="text-white font-bold text-sm mb-1">@{newCampaign.name.split(' ')[0] || 'Brand'}</div>
                                        <p className="text-white/90 text-xs line-clamp-2 mb-3">{newCampaign.adDescription}</p>
                                        <button className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 ${isPinterest ? 'bg-red-600 text-white' : 'bg-rose-500 text-white'}`}>
                                                {newCampaign.adCTA} <ArrowUp className="w-3 h-3 rotate-45" />
                                        </button>
                                </div>
                        </div>
                 );
        }

        return (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-left">
                            <div className="p-3 flex items-center gap-2 border-b border-slate-100">
                                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">{newCampaign.platform[0]}</div>
                                    <div>
                                            <div className="text-xs font-bold text-slate-900">{newCampaign.name || 'Brand Name'}</div>
                                            <div className="text-[10px] text-slate-500">Sponsored · {newCampaign.platform}</div>
                                    </div>
                            </div>
                            <div className="p-3">
                                    <p className="text-sm text-slate-800 mb-3">{newCampaign.adDescription || "Your engaging ad copy goes here."}</p>
                            </div>
                            <div className={`bg-slate-100 flex items-center justify-center text-slate-400 text-sm overflow-hidden relative ${isYouTube ? 'aspect-video' : 'aspect-square'}`}>
                                    {newCampaign.adMedia ? (
                                            newCampaign.adMediaType === 'video' ? (
                                                    <video src={newCampaign.adMedia} className="w-full h-full object-cover" muted loop autoPlay />
                                            ) : (
                                                    <img src={newCampaign.adMedia} alt="Ad Creative" className="w-full h-full object-cover" />
                                            )
                                    ) : (
                                            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                    )}
                            </div>
                            <div className="p-3 bg-slate-50 flex justify-between items-center">
                                    <div className="truncate mr-2">
                                            <div className="text-xs text-slate-500 uppercase truncate">{getDisplayUrl()}</div>
                                            <div className="text-sm font-bold text-slate-900 truncate">{newCampaign.adHeadline || "Headline Here"}</div>
                                    </div>
                                    <button className="px-4 py-1.5 bg-slate-200 text-slate-800 text-xs font-bold rounded whitespace-nowrap">
                                            {newCampaign.adCTA}
                                    </button>
                            </div>
                </div>
        );
};

if (view === 'dashboard') {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">PPC Manager</h2>
                    <p className="text-slate-400">Track performance and launch new ad campaigns across all platforms.</p>
                </div>
                <button onClick={() => setView('create')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all">
                         <Plus className="w-5 h-5" /> Launch Campaign
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Spend', val: '$2,820', change: '+12%', icon: DollarSign, color: 'rose' },
                    { label: 'Conversions', val: '485', change: '+8%', icon: Target, color: 'emerald' },
                    { label: 'Avg. CPC', val: '$1.15', change: '-3%', icon: MousePointerClick, color: 'blue' },
                    { label: 'ROAS', val: '4.1x', change: '+5%', icon: TrendingUp, color: 'purple' }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                         <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 bg-${stat.color}-500/10 rounded-lg text-${stat.color}-500`}><stat.icon className="w-5 h-5" /></div>
                                <span className={`text-${stat.change.startsWith('+') ? 'emerald' : 'rose'}-400 text-xs font-bold`}>{stat.change}</span>
                         </div>
                         <div className="text-slate-400 text-xs uppercase tracking-wide font-bold">{stat.label}</div>
                         <div className="text-2xl font-bold text-white mt-1">{stat.val}</div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                     <h3 className="font-bold text-white">Active Campaigns</h3>
                </div>
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
                            <tr>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Campaign</th>
                                    <th className="px-6 py-4">Budget/Day</th>
                                    <th className="px-6 py-4">Spend</th>
                                    <th className="px-6 py-4">ROAS</th>
                                    <th className="px-6 py-4">Bid Strat</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                            {campaigns.map((camp) => (
                                    <tr key={camp.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                    <button onClick={() => toggleStatus(camp.id)} className={`w-10 h-5 rounded-full p-1 transition-colors ${camp.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                                            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${camp.status === 'Active' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                    </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                    <div className="font-medium text-white">{camp.name}</div>
                                                    <div className="text-xs opacity-60 flex items-center gap-1">
                                                            {camp.platform === 'Google' ? <Search className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                                                            {camp.platform}
                                                    </div>
                                            </td>
                                            <td className="px-6 py-4">${camp.budget}</td>
                                            <td className="px-6 py-4">${camp.spend}</td>
                                            <td className="px-6 py-4 font-bold text-emerald-400">{camp.roas}x</td>
                                            <td className="px-6 py-4"><span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">{camp.bidStrategy}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">Edit</button>
                                            </td>
                                    </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

return (
    <div className="max-w-6xl mx-auto animate-fade-in h-full flex flex-col relative">
         {/* --- MODALS --- */}
         
         {/* Connection Modal */}
         {showConnectModal && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                         <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                                 <div className="text-center mb-6">
                                         <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                 <LinkIcon className="w-8 h-8 text-slate-400" />
                                         </div>
                                         <h3 className="text-xl font-bold text-white">Connect {newCampaign.platform} Ads</h3>
                                         <p className="text-slate-400 text-sm mt-2">
                                                 To launch campaigns directly, you must link your ad account. This is a one-time secure authorization.
                                         </p>
                                 </div>
                                 <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                                         <div className="flex items-center gap-3 text-sm text-slate-300 mb-2">
                                                 <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Read Account Info
                                         </div>
                                         <div className="flex items-center gap-3 text-sm text-slate-300">
                                                 <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Manage Campaigns & Ads
                                         </div>
                                 </div>
                                 <div className="flex gap-3">
                                         <button onClick={() => setShowConnectModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
                                         <button 
                                                 onClick={connectPlatform} 
                                                 disabled={!!connectingPlatform}
                                                 className="flex-1 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center gap-2"
                                         >
                                                 {connectingPlatform ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</> : 'Connect Account'}
                                         </button>
                                 </div>
                                 <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-500">
                                         <Lock className="w-3 h-3" /> Encrypted Secure Connection
                                 </div>
                         </div>
                 </div>
         )}

         {/* Deployment Console Modal */}
         {isDeploying && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
                         <div className="bg-black border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                                 <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                                         <div className="flex items-center gap-2">
                                                 <div className="flex gap-1.5">
                                                         <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                                         <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                         <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                                 </div>
                                                 <span className="text-xs font-mono text-slate-400 ml-3">deployment_console.exe — {newCampaign.platform}</span>
                                         </div>
                                 </div>
                                 <div className="p-6 font-mono text-sm h-80 overflow-y-auto bg-black text-emerald-500">
                                         {deploymentLogs.map((log, i) => (
                                                 <div key={i} className="mb-2 flex gap-2 animate-fade-in">
                                                         <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                                                         <span>{log}</span>
                                                 </div>
                                         ))}
                                         <div className="animate-pulse mt-2">_</div>
                                 </div>
                                 <div className="bg-slate-900 p-4 border-t border-slate-800">
                                         <div className="flex items-center justify-between">
                                                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status: Deployment in Progress</span>
                                                 <span className="text-xs font-bold text-white">{Math.min(100, Math.round((deploymentStep / 7) * 100))}%</span>
                                         </div>
                                         <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                                                 <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(deploymentStep / 7) * 100}%` }}></div>
                                         </div>
                                 </div>
                         </div>
                 </div>
         )}

         <div className="flex items-center justify-between mb-8">
                 <button onClick={() => setView('dashboard')} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium">
                         <X className="w-4 h-4" /> Cancel
                 </button>
                 <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-2 w-8 rounded-full transition-colors ${step >= i ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
                        ))}
                 </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Form Area */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8">
                     {step === 1 && (
                         <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-500" /> Campaign Strategy</h3>
                                <div>
                                     <label className={labelClass}>Campaign Name</label>
                                     <input value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} className={inputClass} placeholder="e.g. Winter Sale 2024" />
                                </div>
                                
                                <div>
                                     <label className={labelClass}>Ad Platform</label>
                                     <div className="flex gap-2 mb-4 border-b border-slate-800 pb-1">
                                            {Object.keys(platformCategories).map(cat => (
                                                    <button 
                                                            key={cat} 
                                                            onClick={() => setActiveCategory(cat as any)}
                                                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors relative ${activeCategory === cat ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                                    >
                                                            {cat}
                                                            {activeCategory === cat && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></div>}
                                                    </button>
                                            ))}
                                     </div>
                                     <div className="grid grid-cols-3 gap-4">
                                            {platformCategories[activeCategory].map(p => (
                                                 <button 
                                                     key={p.id} 
                                                     onClick={() => setNewCampaign({...newCampaign, platform: p.id as any})}
                                                     className={`p-4 rounded-xl border text-sm font-bold transition-all flex flex-col items-center gap-2 ${newCampaign.platform === p.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-500'}`}
                                                 >
                                                        <p.icon className="w-6 h-6" />
                                                        {p.label}
                                                 </button>
                                            ))}
                                     </div>
                                </div>
                                
                                <div>
                                     <label className={labelClass}>Objective</label>
                                     <select value={newCampaign.objective} onChange={e => setNewCampaign({...newCampaign, objective: e.target.value})} className={inputClass}>
                                            <option>Sales</option>
                                            <option>Leads</option>
                                            <option>Website Traffic</option>
                                            <option>Brand Awareness</option>
                                            <option>App Installs</option>
                                            <option>Video Views</option>
                                     </select>
                                </div>
                         </div>
                     )}

                     {step === 2 && (
                         <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500" /> Audience & Targeting</h3>
                                <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex items-start gap-3">
                                     <BrainCircuit className="w-5 h-5 text-indigo-400 mt-1" />
                                     <div>
                                            <h4 className="font-bold text-white text-sm">AI Keyword Researcher</h4>
                                            <p className="text-xs text-slate-400 mb-3">Generate high-intent keywords based on your campaign name.</p>
                                            <button onClick={handleGenerateKeywords} disabled={loadingAI} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                                                 {loadingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <Rocket className="w-3 h-3" />} Generate Keywords
                                            </button>
                                     </div>
                                </div>
                                <div>
                                     <label className={labelClass}>Target Keywords / Interests</label>
                                     <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl border border-slate-200 min-h-[100px]">
                                            {newCampaign.keywords.map((kw, i) => (
                                                 <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold flex items-center gap-1">
                                                        {kw} <X className="w-3 h-3 cursor-pointer" onClick={() => setNewCampaign({...newCampaign, keywords: newCampaign.keywords.filter(k => k !== kw)})} />
                                                 </span>
                                            ))}
                                            {newCampaign.keywords.length === 0 && <span className="text-slate-400 text-sm italic">No keywords yet. Use AI generator above.</span>}
                                     </div>
                                </div>
                         </div>
                     )}

                     {step === 3 && (
                            <div className="space-y-6">
                                 <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><DollarSign className="w-5 h-5 text-indigo-500" /> Budget & Bidding</h3>
                                 
                                 <div>
                                        <label className={labelClass}>Daily Budget</label>
                                        <div className="flex items-center gap-4">
                                             <div className="relative flex-1">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                                    <input type="number" value={newCampaign.budget} onChange={e => setNewCampaign({...newCampaign, budget: parseInt(e.target.value)})} className={`${inputClass} pl-8 text-lg`} />
                                             </div>
                                             <span className="text-slate-400 text-sm font-medium">/ day</span>
                                        </div>
                                 </div>

                                 <div>
                                         <label className={labelClass}>Bid Strategy</label>
                                         <div className="grid grid-cols-2 gap-4">
                                                 {['Max Conversions', 'Target ROAS', 'Lowest Cost', 'Manual CPC'].map(strat => (
                                                         <button 
                                                                 key={strat}
                                                                 onClick={() => setNewCampaign({...newCampaign, bidStrategy: strat})}
                                                                 className={`p-3 rounded-xl border text-sm font-bold transition-all ${newCampaign.bidStrategy === strat ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-indigo-500 hover:text-white'}`}
                                                         >
                                                                 {strat}
                                                         </button>
                                                 ))}
                                         </div>
                                 </div>

                                 <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                        <div className="flex justify-between text-sm mb-2">
                                             <span className="text-slate-400">Estimated Clicks</span>
                                             <span className="text-white font-bold">~{(newCampaign.budget * 0.8).toFixed(0)} - {(newCampaign.budget * 1.5).toFixed(0)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                             <span className="text-slate-400">Estimated Conversions</span>
                                             <span className="text-white font-bold">~{(newCampaign.budget * 0.05).toFixed(0)} - {(newCampaign.budget * 0.1).toFixed(0)}</span>
                                        </div>
                                 </div>
                            </div>
                     )}

                     {step === 4 && (
                            <div className="space-y-6">
                                 <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><LayoutTemplate className="w-5 h-5 text-indigo-500" /> Ad Creative</h3>
                                            <button onClick={handleGenerateAd} disabled={loadingCopy} className="text-indigo-400 hover:text-white text-sm font-bold flex items-center gap-2">
                                                    {loadingCopy ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Auto-Generate Copy
                                            </button>
                                 </div>
                                 
                                 <div>
                                        <label className={labelClass}>Headline</label>
                                        <input value={newCampaign.adHeadline} onChange={e => setNewCampaign({...newCampaign, adHeadline: e.target.value})} className={inputClass} maxLength={30} />
                                        <div className="text-right text-xs text-slate-500 mt-1">{newCampaign.adHeadline.length}/30</div>
                                 </div>
                                 <div>
                                        <label className={labelClass}>Description</label>
                                        <textarea value={newCampaign.adDescription} onChange={e => setNewCampaign({...newCampaign, adDescription: e.target.value})} className={inputClass} rows={3} maxLength={90} />
                                        <div className="text-right text-xs text-slate-500 mt-1">{newCampaign.adDescription.length}/90</div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-6">
                                         <div>
                                                 <label className={labelClass}>Call to Action</label>
                                                 <select value={newCampaign.adCTA} onChange={e => setNewCampaign({...newCampaign, adCTA: e.target.value})} className={inputClass}>
                                                         {['Shop Now', 'Learn More', 'Sign Up', 'Book Now', 'Contact Us', 'Download', 'Apply Now', 'Get Offer'].map(cta => (
                                                                 <option key={cta} value={cta}>{cta}</option>
                                                         ))}
                                                 </select>
                                         </div>
                                         <div>
                                                 <label className={labelClass}>Destination URL</label>
                                                 <div className="relative">
                                                         <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                         <input 
                                                                 value={newCampaign.landingPageUrl} 
                                                                 onChange={e => setNewCampaign({...newCampaign, landingPageUrl: e.target.value})} 
                                                                 className={`${inputClass} pl-10`} 
                                                                 placeholder="https://example.com/page"
                                                         />
                                                 </div>
                                         </div>
                                 </div>

                                 {/* Media Upload & Generation Section */}
                                 {!['Google', 'Bing'].includes(newCampaign.platform) && (
                                         <div className="pt-4 border-t border-slate-800">
                                                    <label className={labelClass}>Ad Media (Image / Video)</label>
                                                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 flex mb-4">
                                                            <button 
                                                                    onClick={() => setMediaTab('upload')} 
                                                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mediaTab === 'upload' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                                            >
                                                                    Upload File
                                                            </button>
                                                            <button 
                                                                    onClick={() => setMediaTab('ai')} 
                                                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mediaTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                                            >
                                                                    <Wand2 className="w-4 h-4" /> Generate with AI
                                                            </button>
                                                    </div>

                                                    {mediaTab === 'upload' ? (
                                                            <div 
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                    className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/50 hover:bg-slate-900 group"
                                                            >
                                                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,video/*" />
                                                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-white" />
                                                                    </div>
                                                                    <p className="text-sm font-medium text-slate-300">Click to upload creative</p>
                                                                    <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, MP4</p>
                                                            </div>
                                                    ) : (
                                                            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                                    <div className="flex gap-4">
                                                                            <label className="flex items-center gap-2 text-sm font-medium text-slate-400 cursor-pointer">
                                                                                    <input type="radio" checked={newCampaign.adMediaType === 'image'} onChange={() => setNewCampaign({...newCampaign, adMediaType: 'image'})} className="text-indigo-600 focus:ring-indigo-500" />
                                                                                    <ImageIcon className="w-4 h-4" /> Image
                                                                            </label>
                                                                            <label className="flex items-center gap-2 text-sm font-medium text-slate-400 cursor-pointer">
                                                                                    <input type="radio" checked={newCampaign.adMediaType === 'video'} onChange={() => setNewCampaign({...newCampaign, adMediaType: 'video'})} className="text-indigo-600 focus:ring-indigo-500" />
                                                                                    <Video className="w-4 h-4" /> Video
                                                                            </label>
                                                                    </div>
                                                                    <textarea 
                                                                            value={aiPrompt} 
                                                                            onChange={(e) => setAiPrompt(e.target.value)} 
                                                                            className={`${inputClass} text-xs`} 
                                                                            placeholder="Describe the ad creative you want..."
                                                                            rows={3}
                                                                    />
                                                                    <button 
                                                                            onClick={handleGenerateMedia}
                                                                            disabled={generatingMedia}
                                                                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
                                                                    >
                                                                            {generatingMedia ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Wand2 className="w-4 h-4" /> Generate Creative</>}
                                                                    </button>
                                                            </div>
                                                    )}
                                         </div>
                                 )}
                            </div>
                     )}

                     <div className="mt-8 flex justify-between pt-6 border-t border-slate-800">
                            {step > 1 ? (
                                 <button onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-white font-bold text-sm">Back</button>
                            ) : <div></div>}
                            
                            {step < 4 ? (
                                 <button onClick={() => setStep(step + 1)} className="bg-white text-slate-900 hover:bg-slate-200 px-6 py-2 rounded-lg font-bold shadow-lg transition-colors">Next Step</button>
                            ) : (
                                 <button 
                                            onClick={initiateLaunch}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                                    >
                                        <Rocket className="w-5 h-5" /> Launch Campaign
                                 </button>
                            )}
                     </div>
                </div>

                {/* RIGHT: Live Preview */}
                <div className="lg:col-span-1">
                     <div className="sticky top-8">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Live Ad Preview</h3>
                            {renderAdPreview()}

                            {/* Contextual Tips */}
                            <div className="mt-8 bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl">
                                 <h4 className="text-indigo-300 font-bold text-sm mb-2 flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> Pro Tip</h4>
                                 <p className="text-xs text-indigo-200 leading-relaxed">
                                        {newCampaign.platform === 'Google' ? "Include keywords in your headline to improve Quality Score." :
                                         newCampaign.platform === 'Facebook' ? "Keep text overlays under 20% of image area." :
                                         "Ensure high contrast visual elements for mobile feeds."}
                                 </p>
                            </div>
                     </div>
                </div>
         </div>
    </div>
);
};

export default PPCManager;
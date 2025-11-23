import React, { useState, useRef } from 'react';
import { generateMarketingVideo, ensurePaidKey } from '../services/geminiService';
import { Video, Clapperboard, Loader2, Upload, Film, Camera, Download, Share2, CheckCircle, Image as ImageIcon, Globe, ZoomIn, MoveHorizontal, Layers, Sun, Zap } from 'lucide-react';

interface VideoStudioProps {
    onActivity?: () => void;
}

const styles = [
    "Cinematic", "Drone Shot", "Slow Motion", "Product Macro", "Neon / Cyberpunk", "Minimalist", "Vintage Film"
];

const animationPresets = [
    { id: 'orbit', label: '360° Orbit', icon: Globe, prompt: 'Smooth orbital camera movement around the subject, keeping it in center focus, cinematic 3d visualization' },
    { id: 'zoom', label: 'Slow Zoom', icon: ZoomIn, prompt: 'Slow, dramatic cinematic zoom in on the subject, revealing texture details, high quality' },
    { id: 'pan', label: 'Cinematic Pan', icon: MoveHorizontal, prompt: 'Smooth lateral camera pan across the subject from left to right, professional product reveal' },
    { id: 'float', label: 'Levitation', icon: Layers, prompt: 'The subject gently floats and rotates in zero gravity, magical atmosphere, soft lighting' },
    { id: 'light', label: 'Light Sweep', icon: Sun, prompt: 'A soft, professional studio light sweeps across the product, highlighting contours and materials' },
    { id: 'action', label: 'Dynamic Action', icon: Zap, prompt: 'Dynamic action shot, fast camera movement, energetic blur, high impact commercial style' },
];

const motionIntensities = [
    { value: 'Subtle, slow motion, elegant', label: 'Subtle' },
    { value: 'Cinematic speed, smooth', label: 'Cinematic' },
    { value: 'Fast paced, energetic, rapid', label: 'Active' },
];

const VideoStudio: React.FC<VideoStudioProps> = ({ onActivity }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [inputImage, setInputImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [intensity, setIntensity] = useState<string>('Cinematic speed, smooth');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async () => {
        if (!prompt && !inputImage) return;
        setLoading(true);
        setVideoUrl(null);
        setStatusMessage('Checking access...');

        try {
            const apiKey = await ensurePaidKey();
            if (!apiKey) {
                setStatusMessage('API Key Required');
                setLoading(false);
                return;
            }

            setStatusMessage('Initializing Veo Engine...');
            const progressInterval = setInterval(() => {
                 setStatusMessage(prev => {
                         if (prev === 'Rendering video frames...') return 'Applying physics simulation...';
                         if (prev === 'Applying physics simulation...') return 'Polishing lighting...';
                         return 'Rendering video frames...';
                 });
            }, 4000);

            const imagePayload = activeTab === 'image' ? inputImage : undefined;
            const finalPrompt = activeTab === 'image' ? `${prompt}, ${intensity}` : prompt;

            const url = await generateMarketingVideo(finalPrompt, aspectRatio, apiKey, imagePayload);
            
            clearInterval(progressInterval);
            setVideoUrl(url);
            if (onActivity) onActivity();
        } catch (error) {
            console.error(error);
            setStatusMessage('Generation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                    setInputImage(e.target?.result as string);
                    setActiveTab('image');
            };
            reader.readAsDataURL(file);
        }
    };

    const applyAnimationPreset = (p: typeof animationPresets[0]) => {
            setSelectedPreset(p.id);
            setPrompt(p.prompt);
    };

    const appendToPrompt = (text: string) => {
         setPrompt(prev => prev.includes(text) ? prev : prev ? `${prev}, ${text}` : text);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)]">
             <div className="lg:col-span-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col h-full overflow-y-auto custom-scrollbar">
                <div className="mb-6">
                     <div className="flex items-center gap-2 mb-2 text-rose-500">
                        <Video className="w-5 h-5" />
                        <h2 className="font-semibold tracking-wide uppercase text-sm">Motion Studio Pro</h2>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Generate Video Ads</h3>
                </div>

                <div className="space-y-6 flex-grow">
                    <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex">
                        <button onClick={() => setActiveTab('text')} className={`flex-1 py-2 text-sm font-medium rounded transition-all flex items-center justify-center gap-2 ${activeTab === 'text' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                                <Clapperboard className="w-4 h-4" /> Text-to-Video
                        </button>
                        <button onClick={() => setActiveTab('image')} className={`flex-1 py-2 text-sm font-medium rounded transition-all flex items-center justify-center gap-2 ${activeTab === 'image' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                                <ImageIcon className="w-4 h-4" /> Image-to-Video
                        </button>
                    </div>

                    {activeTab === 'image' && (
                            <div className="space-y-6 animate-fade-in">
                                    <div>
                                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            <div onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden group ${inputImage ? 'border-rose-500/50 bg-slate-950' : 'border-slate-700 hover:border-rose-500/50 hover:bg-slate-800/50'}`}>
                                                    {inputImage ? (
                                                            <img src={inputImage} alt="Reference" className="w-full h-full object-contain p-2 opacity-80" />
                                                    ) : (
                                                            <><div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Upload className="w-5 h-5 text-rose-400" /></div><span className="text-sm font-medium text-slate-300">Upload Reference Image</span></>
                                                    )}
                                            </div>
                                    </div>
                                    <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Film className="w-3 h-3" /> Animation Type</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                    {animationPresets.map((preset) => (
                                                            <button key={preset.id} onClick={() => applyAnimationPreset(preset)} className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${selectedPreset === preset.id ? 'bg-rose-500/20 border-rose-500 text-rose-200' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'}`}>
                                                                    <preset.icon className={`w-5 h-5 mt-0.5 ${selectedPreset === preset.id ? 'text-rose-400' : 'text-slate-500'}`} />
                                                                    <div className="text-xs font-bold">{preset.label}</div>
                                                            </button>
                                                    ))}
                                            </div>
                                    </div>
                                    <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Motion Strength</label>
                                            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                                                    {motionIntensities.map((level) => (
                                                            <button key={level.label} onClick={() => setIntensity(level.value)} className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${intensity === level.value ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>{level.label}</button>
                                                    ))}
                                            </div>
                                    </div>
                            </div>
                    )}

                    {activeTab === 'text' && (
                             <div className="space-y-6 animate-fade-in">
                                        <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Film className="w-3 h-3" /> Visual Style</label>
                                                <div className="flex flex-wrap gap-2">
                                                        {styles.map(style => (
                                                                <button key={style} onClick={() => appendToPrompt(style)} className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:border-rose-500 hover:text-white transition-all">{style}</button>
                                                        ))}
                                                </div>
                                        </div>
                                        <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Camera className="w-3 h-3" /> Camera Movement</label>
                                                <div className="flex flex-wrap gap-2">
                                                        {["Pan Left", "Pan Right", "Zoom In", "Zoom Out", "Orbit"].map(motion => (
                                                                <button key={motion} onClick={() => appendToPrompt(`Camera movement: ${motion}`)} className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:border-rose-500 hover:text-white transition-all">{motion}</button>
                                                        ))}
                                                </div>
                                        </div>
                             </div>
                    )}

                    <div>
                        <div className="flex justify-between mb-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{activeTab === 'image' ? 'Prompt Details' : 'Video Description'}</label>
                        </div>
                        <textarea
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none h-24 text-sm leading-relaxed placeholder-slate-600 font-mono"
                            placeholder={activeTab === 'image' ? "Describe specific details..." : "Describe your video scene in detail..."}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform Format</label>
                        <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setAspectRatio("9:16")} className={`p-3 rounded-lg text-left border transition-all flex items-center gap-3 ${aspectRatio === "9:16" ? 'bg-rose-500/10 border-rose-500/50' : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'}`}>
                                    <div className="w-4 h-6 border-2 border-current rounded-sm"></div>
                                    <div><div className={`text-sm font-bold ${aspectRatio === '9:16' ? 'text-rose-400' : 'text-slate-400'}`}>Vertical</div><div className="text-[10px] text-slate-500">TikTok / Reels</div></div>
                                </button>
                                <button onClick={() => setAspectRatio("16:9")} className={`p-3 rounded-lg text-left border transition-all flex items-center gap-3 ${aspectRatio === "16:9" ? 'bg-rose-500/10 border-rose-500/50' : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'}`}>
                                    <div className="w-6 h-4 border-2 border-current rounded-sm"></div>
                                    <div><div className={`text-sm font-bold ${aspectRatio === '16:9' ? 'text-rose-400' : 'text-slate-400'}`}>Landscape</div><div className="text-[10px] text-slate-500">YouTube</div></div>
                                </button>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-800">
                         <button
                                onClick={handleGenerate}
                                disabled={loading || (!prompt && !inputImage)}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden
                                        ${loading || (!prompt && !inputImage) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 shadow-rose-500/25'}
                                `}
                         >
                                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> {statusMessage}</> : <><Clapperboard className="w-5 h-5" /> {activeTab === 'image' ? 'Animate Image' : 'Generate Video'}</>}
                        </button>
                </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6 h-full">
                    <div className="flex-grow bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                        {loading ? (
                                <div className="text-center z-10 p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50">
                                <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-4" />
                                <h4 className="text-xl font-medium text-white mb-1">Creating Magic</h4>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto">{statusMessage}</p>
                                </div>
                        ) : videoUrl ? (
                                <div className="relative w-full h-full flex items-center justify-center bg-black">
                                <video src={videoUrl} controls autoPlay loop className={`max-h-full shadow-2xl ${aspectRatio === '9:16' ? 'h-full aspect-[9/16]' : 'w-full aspect-[16/9]'}`} />
                                </div>
                        ) : (
                                <div className="text-center p-8 opacity-40">
                                        <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4"><Video className="w-10 h-10 text-slate-500" /></div>
                                        <h3 className="text-lg font-medium text-slate-300">Preview Area</h3>
                                </div>
                        )}
                    </div>
                    {videoUrl && (
                            <div className="h-24 bg-slate-900 rounded-xl border border-slate-800 p-4 flex items-center justify-between animate-fade-in">
                                    <div>
                                            <h3 className="text-white font-medium flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Ready for Distribution</h3>
                                            <p className="text-xs text-slate-500 mt-1">Video generated successfully. Choose a platform to export.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"><Share2 className="w-4 h-4" /> Share Link</button>
                                            <a href={videoUrl} download={`nexus-ad-${Date.now()}.mp4`} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"><Download className="w-4 h-4" /> Download MP4</a>
                                    </div>
                            </div>
                    )}
            </div>
        </div>
    );
};

export default VideoStudio;
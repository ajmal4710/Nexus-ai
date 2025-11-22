import React, { useState } from 'react';
import { generateMarketingImage, ensurePaidKey } from '../services/geminiService';
import { Image, Wand2, Loader2, Download, Maximize2, Sparkles, X, Plus, Eraser } from 'lucide-react';

interface ImageStudioProps {
    onActivity?: () => void;
}

const templates = [
    { label: 'Product Hero (Studio)', value: 'Professional studio photography of [Product], centered, dramatic lighting, neutral background, high resolution, 8k' },
    { label: 'Lifestyle Context', value: 'A photo of [Product] being used in a modern bright environment, natural sunlight, shallow depth of field, lifestyle photography' },
    { label: 'Minimalist Podium', value: 'Minimalist composition of [Product] on a pastel colored podium, soft shadows, clean lines, aesthetic, high quality' },
    { label: 'Neon Cyberpunk', value: 'Futuristic shot of [Product], neon blue and pink lighting, cyberpunk city background, reflection, cinematic' },
    { label: 'Nature/Organic', value: 'Close up of [Product] surrounded by natural elements, leaves, wood texture, soft daylight, eco-friendly vibe' }
];

const styles = [
    "Photorealistic", "3D Render", "Cinematic", "Vintage", "Flat Art", "Oil Painting", "Isometric"
];

const enhancers = [
    "Studio Lighting", "4K Resolution", "Bokeh", "Golden Hour", "HDR", "Sharp Focus", "Ray Tracing"
];

const ImageStudio: React.FC<ImageStudioProps> = ({ onActivity }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setError(null);
        try {
            const apiKey = await ensurePaidKey();
            if (!apiKey) {
                setError("API Key selection is required for high-quality image generation.");
                setLoading(false);
                return;
            }

            const result = await generateMarketingImage(prompt, aspectRatio, apiKey);
            setGeneratedImage(result);
            if (onActivity) onActivity();
        } catch (err: any) {
            console.error(err);
            setError("Failed to generate image. Please try again or check your API limits.");
        } finally {
            setLoading(false);
        }
    };

    const openKeySelection = async () => {
         if ((window as any).aistudio) {
                await (window as any).aistudio.openSelectKey();
         }
    };

    const addToPrompt = (text: string) => {
        setPrompt(prev => {
            const trimmed = prev.trim();
            if (!trimmed) return text;
            if (trimmed.toLowerCase().includes(text.toLowerCase())) return trimmed; 
            return `${trimmed}, ${text}`;
        });
    };

    const applyTemplate = (templateValue: string) => {
        if (prompt && !window.confirm("Replace current prompt with template?")) return;
        setPrompt(templateValue);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)]">
            <div className="lg:col-span-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col h-full overflow-y-auto custom-scrollbar">
                <div className="mb-6">
                     <div className="flex items-center gap-2 mb-2 text-purple-400">
                        <Image className="w-5 h-5" />
                        <h2 className="font-semibold tracking-wide uppercase text-sm">Visual Studio</h2>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Create Assets</h3>
                </div>

                <div className="space-y-6 flex-grow">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Start Templates</label>
                        <select 
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all cursor-pointer"
                            onChange={(e) => {
                                if(e.target.value) applyTemplate(e.target.value);
                                e.target.value = ""; 
                            }}
                        >
                            <option value="">Select a template...</option>
                            {templates.map((t, i) => (
                                <option key={i} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <div className="flex justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-300">Image Prompt</label>
                            {prompt && (
                                <button onClick={() => setPrompt('')} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                                    <Eraser className="w-3 h-3" /> Clear
                                </button>
                            )}
                        </div>
                        <textarea
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none h-36 text-sm leading-relaxed"
                            placeholder="Describe your image..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Styles</label>
                            <div className="flex flex-wrap gap-2">
                                {styles.map(style => (
                                    <button
                                        key={style}
                                        onClick={() => addToPrompt(style)}
                                        className="px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:border-purple-500 hover:text-white transition-all flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> {style}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quality & Lighting</label>
                            <div className="flex flex-wrap gap-2">
                                {enhancers.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => addToPrompt(item)}
                                        className="px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:border-purple-500 hover:text-white transition-all flex items-center gap-1"
                                    >
                                        <Sparkles className="w-3 h-3" /> {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[{ label: '1:1', desc: 'Square' }, { label: '16:9', desc: 'Landscape' }, { label: '9:16', desc: 'Portrait' }].map((ratio) => (
                                <button
                                    key={ratio.label}
                                    onClick={() => setAspectRatio(ratio.label as any)}
                                    className={`py-2 px-2 rounded-lg text-center border transition-all ${aspectRatio === ratio.label ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                                >
                                    <span className="block text-sm font-bold">{ratio.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-2">
                            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                     <div className="pt-2"><button onClick={openKeySelection} className="text-xs text-slate-500 hover:text-purple-400 underline">Check API Billing Status</button></div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className={`mt-6 w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                        ${loading || !prompt ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/25'}
                    `}
                >
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Wand2 className="w-5 h-5" /> Generate Asset</>}
                </button>
            </div>

            <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                {loading && (
                        <div className="absolute inset-0 z-10 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center"><Sparkles className="w-6 h-6 text-purple-500 animate-pulse" /></div>
                                </div>
                                <p className="text-slate-300 mt-6 font-medium animate-pulse">Creating your masterpiece...</p>
                        </div>
                )}
                {!generatedImage ? (
                    <div className="text-center p-8 max-w-md">
                        <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/50"><Image className="w-10 h-10 text-slate-600" /></div>
                        <h3 className="text-xl font-bold text-white mb-3">Ready to Create</h3>
                        <p className="text-slate-500 leading-relaxed">Use the template selector on the left or build your own prompt to generate high-fidelity marketing assets.</p>
                    </div>
                ) : (
                    <div className="relative w-full h-full p-4 sm:p-8 flex items-center justify-center">
                        <img src={generatedImage} alt="Generated" className="max-w-full max-h-full rounded-lg shadow-2xl border border-slate-800 object-contain" />
                        <div className="absolute bottom-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                             <a href={generatedImage} download={`nexus-ai-${Date.now()}.png`} className="p-3 bg-slate-900/90 hover:bg-white hover:text-slate-900 text-white rounded-full backdrop-blur transition-all border border-slate-700 shadow-xl"><Download className="w-5 h-5" /></a>
                             <button className="p-3 bg-slate-900/90 hover:bg-white hover:text-slate-900 text-white rounded-full backdrop-blur transition-all border border-slate-700 shadow-xl" onClick={() => window.open(generatedImage, '_blank')}><Maximize2 className="w-5 h-5" /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageStudio;
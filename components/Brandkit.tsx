import React, { useState, useRef } from 'react';
import { Palette, Upload, Plus, X, Save, Type, MessageSquare, Check, RefreshCw } from 'lucide-react';

interface BrandKitProps {
    initialBrandName?: string;
    initialLogo?: string | null;
    onUpdate?: (name: string, logo: string | null) => void;
}

const BrandKit: React.FC<BrandKitProps> = ({
    initialBrandName = 'Nexus',
    initialLogo = null,
    onUpdate,
}) => {
    const [brandName, setBrandName] = useState(initialBrandName);
    const [logo, setLogo] = useState<string | null>(initialLogo);
    const [colors, setColors] = useState(['#4f46e5', '#06b6d4', '#10b981', '#f43f5e']);
    const [newColor, setNewColor] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [extractingColors, setExtractingColors] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddColor = () => {
        if (newColor && !colors.includes(newColor)) {
            setColors([...colors, newColor]);
            setNewColor('');
        }
    };

    const handleSave = () => {
        setLoading(true);
        if (onUpdate) {
            onUpdate(brandName, logo);
        }
        setTimeout(() => {
            setLoading(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 1000);
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        return (
            '#' +
            ((1 << 24) + (r << 16) + (g << 8) + b)
                .toString(16)
                .slice(1)
        );
    };

    const extractColorsFromImage = (imageSrc: string) => {
        setExtractingColors(true);
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setExtractingColors(false);
                return;
            }
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);

            const imageData = ctx.getImageData(0, 0, 100, 100).data;
            const colorMap: Record<string, number> = {};

            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const a = imageData[i + 3];
                if (a < 200) continue;
                const rQ = Math.round(r / 32) * 32;
                const gQ = Math.round(g / 32) * 32;
                const bQ = Math.round(b / 32) * 32;
                const key = `${rQ},${gQ},${bQ}`;
                colorMap[key] = (colorMap[key] || 0) + 1;
            }

            const sortedColors = Object.entries(colorMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([key]) => {
                    const [r, g, b] = key.split(',').map(Number);
                    return rgbToHex(Math.min(255, r), Math.min(255, g), Math.min(255, b));
                });

            if (sortedColors.length > 0) {
                setColors(sortedColors);
            }
            setExtractingColors(false);
        };

        img.onerror = () => {
            setExtractingColors(false);
            // eslint-disable-next-line no-console
            console.error('Failed to load image for color extraction');
        };
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setLogo(result);
                if (onUpdate) onUpdate(brandName, result);
                extractColorsFromImage(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Brand Kit</h2>
                    <p className="text-slate-400">
                        Centralize your brand assets for consistent AI generation across all creatives.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all
                    ${
                        saved
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    }
                `}
                >
                    {loading ? (
                        'Saving...'
                    ) : saved ? (
                        <>
                            <Check className="w-4 h-4" /> Saved
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" /> Save Changes
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2 mb-6 text-indigo-400">
                            <Palette className="w-5 h-5" />
                            <h3 className="text-lg font-semibold text-white">Visual Identity</h3>
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Brand Name
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-600 font-medium"
                                placeholder="Enter your brand name (e.g. Nexus)"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">
                                    Brand Logo
                                </label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/svg+xml"
                                    onChange={handleLogoUpload}
                                />
                                <div
                                    onClick={triggerFileInput}
                                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer h-48 group relative overflow-hidden
                                    ${
                                        logo
                                            ? 'border-indigo-500/50 bg-slate-900'
                                            : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50 hover:text-indigo-400 text-slate-500'
                                    }
                                `}
                                >
                                    {logo ? (
                                        <>
                                            <img
                                                src={logo}
                                                alt="Brand Logo"
                                                className="max-h-32 max-w-full object-contain z-10"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20 backdrop-blur-sm">
                                                <span className="text-white font-medium flex items-center gap-2">
                                                    <RefreshCw className="w-4 h-4" /> Change Logo
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-medium">
                                                Click to upload Logo
                                            </span>
                                            <span className="text-xs text-slate-600 mt-1">
                                                Auto-extracts colors
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-medium text-slate-400">
                                        Primary Palette
                                    </label>
                                    {extractingColors && (
                                        <span className="text-xs text-indigo-400 flex items-center gap-1 animate-pulse">
                                            <RefreshCw className="w-3 h-3 animate-spin" /> Extracting...
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((c, idx) => (
                                            <div
                                                key={`${c}-${idx}`}
                                                className="group relative w-12 h-12 rounded-lg shadow-lg border border-slate-700 cursor-pointer overflow-hidden transition-transform hover:scale-105"
                                                style={{ backgroundColor: c }}
                                            >
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() =>
                                                            setColors(colors.filter((_, i) => i !== idx))
                                                        }
                                                        className="text-white hover:text-rose-400"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() =>
                                                document.getElementById('colorInput')?.focus()
                                            }
                                            className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative flex-grow">
                                            <div
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-slate-600"
                                                style={{
                                                    backgroundColor: newColor || 'transparent',
                                                }}
                                            ></div>
                                            <input
                                                id="colorInput"
                                                type="text"
                                                placeholder="#000000"
                                                className="bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2.5 text-white text-sm w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                                value={newColor}
                                                onChange={(e) => setNewColor(e.target.value)}
                                                onKeyDown={(e) =>
                                                    e.key === 'Enter' && handleAddColor()
                                                }
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddColor}
                                            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2 mb-6 text-pink-400">
                            <MessageSquare className="w-5 h-5" />
                            <h3 className="text-lg font-semibold text-white">
                                Brand Voice & Tone
                            </h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    System Instructions for AI
                                </label>
                                <p className="text-xs text-slate-500 mb-3">
                                    These instructions will be automatically appended to your Copywriter
                                    prompts.
                                </p>
                                <textarea
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none h-32 text-sm leading-relaxed"
                                    placeholder="Describe your brand's personality. E.g., We are a bold, futuristic tech company that uses concise, punchy language. Avoid jargon but sound expert."
                                    defaultValue="We are Nexus, a premium digital marketing partner. Our voice is professional, empathetic, and data-driven. We prioritize clarity over buzzwords. Always use an encouraging tone."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">
                                    Voice Traits
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['Professional', 'Trustworthy', 'Innovative', 'Minimalist'].map(
                                        (tag) => (
                                            <span
                                                key={tag}
                                                className="pl-3 pr-2 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-sm text-slate-300 flex items-center gap-2 hover:border-pink-500/50 transition-colors cursor-default"
                                            >
                                                {tag}{' '}
                                                <X className="w-3 h-3 cursor-pointer text-slate-500 hover:text-white" />
                                            </span>
                                        )
                                    )}
                                    <button className="px-3 py-1.5 rounded-full border border-dashed border-slate-700 text-sm text-slate-500 hover:text-white hover:border-slate-500 flex items-center gap-1 transition-all">
                                        <Plus className="w-3 h-3" /> Add Trait
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2 mb-6 text-emerald-400">
                            <Type className="w-5 h-5" />
                            <h3 className="text-lg font-semibold text-white">Typography</h3>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Primary Font (Headings)
                                </label>
                                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                                    <option>Inter</option>
                                    <option>Roboto</option>
                                    <option>Playfair Display</option>
                                    <option>Montserrat</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Secondary Font (Body)
                                </label>
                                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                                    <option>Inter</option>
                                    <option>Open Sans</option>
                                    <option>Lato</option>
                                    <option>Roboto</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
                        <h3 className="text-white font-medium mb-2 relative z-10">Pro Tip</h3>
                        <p className="text-sm text-slate-400 relative z-10">
                            Setting your brand colors here allows the Image Studio to prioritize your
                            palette when generating marketing assets.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandKit;
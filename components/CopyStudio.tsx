import React, { useState } from 'react';
import { CopyTone } from '../types';
import { generateMarketingCopy } from '../services/geminiService';
import { Copy, Check, Wand2, Loader2 } from 'lucide-react';

interface CopyStudioProps {
    onActivity?: () => void;
}

const CopyStudio: React.FC<CopyStudioProps> = ({ onActivity }) => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [audience, setAudience] = useState('');
    const [tone, setTone] = useState<string>(CopyTone.PROFESSIONAL);
    const [platform, setPlatform] = useState('Facebook Ads');
    const [generatedCopy, setGeneratedCopy] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!productName || !productDescription || !audience) return;
        setLoading(true);
        try {
            const result = await generateMarketingCopy(productName, productDescription, audience, tone, platform);
            setGeneratedCopy(result);
            if (onActivity) onActivity();
        } catch (error) {
            console.error(error);
            setGeneratedCopy("Error generating copy. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-140px)]">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col h-full overflow-y-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2 text-indigo-400">
                        <Wand2 className="w-5 h-5" />
                        <h2 className="font-semibold tracking-wide uppercase text-sm">AI Copywriter</h2>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Generate High-Converting Copy</h3>
                </div>

                <div className="space-y-6 flex-grow">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Product / Service Name</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="e.g., LuxeSleep Memory Foam Pillow"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Product Details / Description</label>
                        <textarea
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-32"
                            placeholder="e.g., Cooling technology, ergonomic design, 100-night trial..."
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Target Audience</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g., Professionals with back pain, age 30-50"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Tone of Voice</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                            >
                                {Object.values(CopyTone).map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Platform</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                            >
                                <option value="Facebook Ads">Facebook Ads</option>
                                <option value="Instagram Caption">Instagram Caption</option>
                                <option value="LinkedIn Post">LinkedIn Post</option>
                                <option value="Twitter/X Post">Twitter/X Post</option>
                                <option value="Email Newsletter">Email Newsletter</option>
                                <option value="Google Search Ads">Google Search Ads</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !productName || !productDescription}
                    className={`mt-8 w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                        ${loading || !productName || !productDescription ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-500/25'}
                    `}
                >
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Wand2 className="w-5 h-5" /> Generate Copy</>}
                </button>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex flex-col h-full relative overflow-hidden group">
                 {!generatedCopy ? (
                     <div className="flex-grow flex flex-col items-center justify-center text-slate-600">
                         <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                             <Copy className="w-8 h-8" />
                         </div>
                         <p>Your generated copy will appear here</p>
                     </div>
                 ) : (
                     <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Result</h3>
                            <button 
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                            >
                                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="flex-grow overflow-y-auto pr-2">
                            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-slate-300 leading-relaxed">
                                {generatedCopy}
                            </div>
                        </div>
                     </>
                 )}
            </div>
        </div>
    );
};

export default CopyStudio;
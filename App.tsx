import React, { useState } from 'react';
import Layout from './components/Layout.tsx';

import Dashboard from './components/Dashboard';
import CopyStudio from './components/CopyStudio';
import ImageStudio from './components/ImageStudio';
import VideoStudio from './components/VideoStudio';
import Campaigns from './components/Campaigns';
import BrandKit from './components/Brandkit';
import PPCManager from './components/PPCManager';
import SocialManager from './components/SocialManager';
import Settings from './components/Setting';
import { AppView, Strategy, Post, SocialAccount, ActivityStats } from './types';

// --- Initial Mock Data (Moved from Child Components) ---
const initialStrategies: Strategy[] = [
    {
        id: '1',
        businessName: 'Nexus AI',
        goal: 'Q4 User Acquisition',
        date: 'Oct 24, 2024',
        status: 'Active',
        mode: 'advanced',
        content: `# Executive Summary\nFocus on aggressive user acquisition...\n# SWOT Analysis\n**Strengths:**\n- AI Tech...`
    }
];

const initialAccounts: SocialAccount[] = [
    { id: 'acc_1', platform: 'Instagram', name: 'Nexus Brand', handle: '@nexus_official', avatar: 'bg-gradient-to-tr from-yellow-400 to-purple-600', connected: false, brandColor: 'from-yellow-500 to-purple-600', permissions: ['Read Profile', 'Publish Content'] },
    { id: 'acc_2', platform: 'Twitter', name: 'Nexus', handle: '@nexus_ai', avatar: 'bg-sky-500', connected: false, brandColor: 'bg-sky-500', permissions: ['Read Tweets', 'Post Tweets'] },
    { id: 'acc_3', platform: 'LinkedIn', name: 'Nexus Inc.', handle: 'Nexus AI', avatar: 'bg-blue-700', connected: false, brandColor: 'bg-blue-700', permissions: ['Manage Page', 'Post Updates'] },
    { id: 'acc_4', platform: 'Facebook', name: 'Nexus Official', handle: 'Nexus Brand', avatar: 'bg-blue-600', connected: false, brandColor: 'bg-blue-600', permissions: ['Manage Pages', 'Publish Posts'] },
    { id: 'acc_5', platform: 'TikTok', name: 'NexusTok', handle: '@nexus_tik', avatar: 'bg-black', connected: false, brandColor: 'bg-black', permissions: ['Read Profile', 'Upload Video'] },
];

const getMockDate = (offsetDays: number) => {
        const d = new Date();
        d.setDate(d.getDate() + offsetDays);
        return d.toISOString().split('T')[0];
};

const initialPosts: Post[] = [
    { id: 1, date: getMockDate(1), time: '09:00', content: "Summer vibes are here! ☀️", platforms: ['acc_1'], status: 'Scheduled' },
    { id: 2, date: getMockDate(2), time: '14:30', content: "Flash Sale starts in 1 hour!", platforms: ['acc_2', 'acc_4'], status: 'Scheduled' },
];

const App: React.FC = () => {
    // Navigation State
    const [history, setHistory] = useState<AppView[]>([AppView.DASHBOARD]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Global Brand State
    const [brandName, setBrandName] = useState('Nexus AI');
    const [brandLogo, setBrandLogo] = useState<string | null>(null);

    // --- CENTRALIZED DATA STATE ---
    const [strategies, setStrategies] = useState<Strategy[]>(initialStrategies);
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [accounts, setAccounts] = useState<SocialAccount[]>(initialAccounts);
    const [activityStats, setActivityStats] = useState<ActivityStats>({
        copyGenerated: 142,
        imagesGenerated: 28,
        videosGenerated: 5
    });

    const currentView = history[currentIndex];

    // Navigation Handlers
    const handleNavigate = (view: AppView) => {
        if (view === currentView) return;
        const newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(view);
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
    };

    const handleBack = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const handleForward = () => {
        if (currentIndex < history.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const updateBrand = (name: string, logo: string | null) => {
            setBrandName(name);
            if (logo) setBrandLogo(logo);
    };

    // State Updaters for Children
    const handleActivity = (type: 'copy' | 'image' | 'video') => {
            setActivityStats(prev => ({
                    ...prev,
                    copyGenerated: type === 'copy' ? prev.copyGenerated + 1 : prev.copyGenerated,
                    imagesGenerated: type === 'image' ? prev.imagesGenerated + 1 : prev.imagesGenerated,
                    videosGenerated: type === 'video' ? prev.videosGenerated + 1 : prev.videosGenerated,
            }));
    };

    const renderView = () => {
        switch (currentView) {
            case AppView.DASHBOARD:
                return (
                    <Dashboard 
                        strategies={strategies}
                        posts={posts}
                        accounts={accounts}
                        activityStats={activityStats}
                        onNavigate={handleNavigate}
                    />
                );
            case AppView.COPYWRITER:
                return <CopyStudio onActivity={() => handleActivity('copy')} />;
            case AppView.IMAGE_STUDIO:
                return <ImageStudio onActivity={() => handleActivity('image')} />;
            case AppView.VIDEO_STUDIO:
                return <VideoStudio onActivity={() => handleActivity('video')} />;
            case AppView.CAMPAIGNS:
                return (
                    <Campaigns 
                         strategies={strategies} 
                         setStrategies={setStrategies}
                         onNavigate={handleNavigate} 
                    />
                );
            case AppView.BRAND_KIT:
                return (
                        <BrandKit 
                                initialBrandName={brandName} 
                                initialLogo={brandLogo} 
                                onUpdate={updateBrand} 
                        />
                );
            case AppView.PPC_MANAGER:
                return <PPCManager />;
            case AppView.SOCIAL_MANAGER:
                return (
                        <SocialManager 
                                posts={posts}
                                setPosts={setPosts}
                                accounts={accounts}
                                setAccounts={setAccounts}
                        />
                );
            case AppView.SETTINGS:
                return <Settings />;
            default:
                return <Dashboard 
                        strategies={strategies}
                        posts={posts}
                        accounts={accounts}
                        activityStats={activityStats}
                        onNavigate={handleNavigate}
                />;
        }
    };

    return (
        <Layout 
            currentView={currentView} 
            onNavigate={handleNavigate}
            onBack={handleBack}
            onForward={handleForward}
            canGoBack={currentIndex > 0}
            canGoForward={currentIndex < history.length - 1}
            brandName={brandName}
            brandLogo={brandLogo}
        >
            {renderView()}
        </Layout>
    );
};

export default App;
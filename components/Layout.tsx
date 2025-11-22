import React from 'react';
import { AppView } from '../types';
import {

LayoutDashboard,
PenTool,
Image as ImageIcon,
Video,
Target,
Settings,
Bell,
UserCircle,
Palette,
MessageCircle,
DollarSign,
ChevronLeft,
ChevronRight
} from 'lucide-react';

interface LayoutProps {
currentView: AppView;
onNavigate: (view: AppView) => void;
onBack: () => void;
onForward: () => void;
canGoBack: boolean;
canGoForward: boolean;
children: React.ReactNode;
brandName?: string;
brandLogo?: string | null;
}

interface NavItemProps {
view: AppView;
current: AppView;
icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
label: string;
onClick: (view: AppView) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, current, icon: Icon, label, onClick }) => (
<button
    onClick={() => onClick(view)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
        ${current === view
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
    `}
>
    <Icon className="w-5 h-5" />
    <span className="truncate">{label}</span>
</button>
);

const Layout: React.FC<LayoutProps> = ({
currentView,
onNavigate,
onBack,
onForward,
canGoBack,
canGoForward,
children,
brandName = 'Nexus AI',
brandLogo
}) => {
const title = String(currentView).replace(/_/g, ' ').toLowerCase();

return (
    <div className="min-h-screen bg-slate-950 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950 fixed h-full z-10 flex flex-col">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    {brandLogo ? (
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-800">
                            <img src={brandLogo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                    )}

                    <h1 className="text-xl font-bold text-white tracking-tight truncate">
                        {brandName === 'Nexus AI' ? (
                            <>
                                Nexus<span className="text-indigo-500">AI</span>
                            </>
                        ) : (
                            brandName
                        )}
                    </h1>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Overview</div>
                <NavItem view={AppView.DASHBOARD} current={currentView} icon={LayoutDashboard} label="Dashboard" onClick={onNavigate} />
                <NavItem view={AppView.CAMPAIGNS} current={currentView} icon={Target} label="Strategy Builder" onClick={onNavigate} />

                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-1">Marketing Suite</div>
                <NavItem view={AppView.SOCIAL_MANAGER} current={currentView} icon={MessageCircle} label="Social Media" onClick={onNavigate} />
                <NavItem view={AppView.PPC_MANAGER} current={currentView} icon={DollarSign} label="PPC & Ads" onClick={onNavigate} />

                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-1">Creative Suite</div>
                <NavItem view={AppView.BRAND_KIT} current={currentView} icon={Palette} label="Brand Kit" onClick={onNavigate} />
                <NavItem view={AppView.COPYWRITER} current={currentView} icon={PenTool} label="Copywriter" onClick={onNavigate} />
                <NavItem view={AppView.IMAGE_STUDIO} current={currentView} icon={ImageIcon} label="Image Studio" onClick={onNavigate} />
                <NavItem view={AppView.VIDEO_STUDIO} current={currentView} icon={Video} label="Video Studio" onClick={onNavigate} />
            </nav>

            <div className="p-4 border-t border-slate-800">
                <NavItem view={AppView.SETTINGS} current={currentView} icon={Settings} label="Settings" onClick={onNavigate} />
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    {/* Navigation Controls */}
                    <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-1">
                        <button
                            onClick={onBack}
                            disabled={!canGoBack}
                            className={`p-1.5 rounded-md transition-colors ${!canGoBack ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            title="Go Back"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="w-px h-4 bg-slate-800 mx-1"></div>
                        <button
                            onClick={onForward}
                            disabled={!canGoForward}
                            className={`p-1.5 rounded-md transition-colors ${!canGoForward ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            title="Go Forward"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-white capitalize ml-2">{title}</h2>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">Alex Chen</p>
                            <p className="text-xs text-slate-500">Marketing Lead</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                            <UserCircle className="w-full h-full text-slate-400" />
                        </div>
                    </div>
                </div>
            </header>

            {children}
        </main>
    </div>
);
};

export default Layout;
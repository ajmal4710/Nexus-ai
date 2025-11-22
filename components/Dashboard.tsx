import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, Megaphone, Calendar, PenTool } from 'lucide-react';
import { Strategy, Post, SocialAccount, ActivityStats } from '../types';

interface DashboardProps {
    strategies: Strategy[];
    posts: Post[];
    accounts: SocialAccount[];
    activityStats: ActivityStats;
    onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    strategies,
    posts,
    accounts,
    activityStats,
    onNavigate,
}) => {
    // Calculate Live Stats
    const activeStrategies = strategies.filter((s) => s.status === 'Active').length;
    const draftStrategies = strategies.filter((s) => s.status === 'Draft').length;
    const scheduledPosts = posts.filter((p) => p.status === 'Scheduled').length;
    const connectedAccounts = accounts.filter((a) => a.connected).length;
    const totalAssets =
        activityStats.copyGenerated +
        activityStats.imagesGenerated +
        activityStats.videosGenerated;

    // Mock Data blended with Live Counts for charts
    const trafficData = [
        { name: 'Mon', visits: 4000 + activeStrategies * 100, conversions: 240 },
        { name: 'Tue', visits: 3000 + activeStrategies * 120, conversions: 139 },
        { name: 'Wed', visits: 2000 + activeStrategies * 150, conversions: 980 },
        { name: 'Thu', visits: 2780 + activeStrategies * 110, conversions: 390 },
        { name: 'Fri', visits: 1890 + activeStrategies * 180, conversions: 480 },
        { name: 'Sat', visits: 2390 + activeStrategies * 90, conversions: 380 },
        { name: 'Sun', visits: 3490 + activeStrategies * 100, conversions: 430 },
    ];

    const assetData = [
        { name: 'Copy', value: activityStats.copyGenerated },
        { name: 'Images', value: activityStats.imagesGenerated },
        { name: 'Videos', value: activityStats.videosGenerated },
    ];

    const StatCard = ({
        title,
        value,
        subtitle,
        icon: Icon,
        color,
        onClick,
    }: any) => (
        <div
            onClick={onClick}
            className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-600 transition-all cursor-pointer group relative overflow-hidden"
        >
            <div
                className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}
            >
                <Icon className={`w-16 h-16 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-slate-500 text-xs font-medium bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    Live Data
                </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium relative z-10">
                {title}
            </h3>
            <p className="text-3xl font-bold text-white mt-1 relative z-10">
                {value}
            </p>
            <p className="text-xs text-slate-500 mt-2 relative z-10 flex items-center gap-1">
                {subtitle}
            </p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Strategies"
                    value={activeStrategies}
                    subtitle={`${draftStrategies} drafts pending`}
                    icon={Megaphone}
                    color="bg-emerald-500 text-emerald-500"
                    onClick={() => onNavigate('CAMPAIGNS')}
                />
                <StatCard
                    title="Scheduled Posts"
                    value={scheduledPosts}
                    subtitle={`Across ${connectedAccounts} platforms`}
                    icon={Calendar}
                    color="bg-indigo-500 text-indigo-500"
                    onClick={() => onNavigate('SOCIAL_MANAGER')}
                />
                <StatCard
                    title="Assets Created"
                    value={totalAssets}
                    subtitle={`${activityStats.imagesGenerated} visuals generated`}
                    icon={PenTool}
                    color="bg-purple-500 text-purple-500"
                />
                <StatCard
                    title="PPC Ad Spend"
                    value="$12,450"
                    subtitle="+15% vs last month"
                    icon={DollarSign}
                    color="bg-rose-500 text-rose-500"
                    onClick={() => onNavigate('PPC_MANAGER')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white">
                            Traffic & Conversions
                        </h3>
                        <select className="bg-slate-950 border border-slate-800 text-slate-400 text-xs rounded px-2 py-1 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="flex-grow min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient
                                        id="colorVisits"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#8b5cf6"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#8b5cf6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#334155"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: '#334155',
                                        color: '#fff',
                                        borderRadius: '8px',
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVisits)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="conversions"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={0}
                                    fill="transparent"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Asset Breakdown */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-6">
                        Creative Output
                    </h3>
                    <div className="flex-grow min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={assetData} layout="vertical">
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#334155"
                                    horizontal={true}
                                    vertical={false}
                                />
                                <XAxis type="number" stroke="#64748b" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="#94a3b8"
                                    width={60}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: '#334155',
                                        color: '#fff',
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#f43f5e"
                                    radius={[0, 4, 4, 0]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {activityStats.copyGenerated}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                                Copy
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {activityStats.imagesGenerated}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                                Images
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {activityStats.videosGenerated}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                                Videos
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">
                        Recent Strategy Activity
                    </h3>
                    <button
                        onClick={() => onNavigate('CAMPAIGNS')}
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                        View All Strategies
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Business Name</th>
                                <th className="px-6 py-4">Goal</th>
                                <th className="px-6 py-4">Date Created</th>
                                <th className="px-6 py-4">Mode</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {strategies.slice(0, 5).map((strat) => (
                                <tr
                                    key={strat.id}
                                    className="hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-white">
                                        {strat.businessName}
                                    </td>
                                    <td className="px-6 py-4">{strat.goal}</td>
                                    <td className="px-6 py-4">{strat.date}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs uppercase font-bold border ${
                                                strat.mode === 'advanced'
                                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}
                                        >
                                            {strat.mode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                strat.status === 'Active'
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-slate-700 text-slate-300'
                                            }`}
                                        >
                                            {strat.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {strategies.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No strategies created yet. Go to Strategy Builder to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
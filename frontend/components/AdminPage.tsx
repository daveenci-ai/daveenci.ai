import React, { useState, useEffect } from 'react';
import { Logo, Button, VitruvianBackground, ScrollReveal } from './Shared';
import type { Page } from './types';
import { LogIn, ShieldAlert, CheckCircle2, Loader2, LayoutDashboard, FileText, FolderRoot, Download, ExternalLink, Search } from 'lucide-react';
import { API_ENDPOINTS } from '../config';
import PDFSlideshow from './PDFSlideshow';

const GoogleLogo = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

interface DemoItem {
    id: string;
    title: string;
    description: string;
    features?: string[];
    category: 'CRM' | 'Automation' | 'Marketing' | 'Logistics';
    review?: {
        text: string;
        author: string;
    };
    link: string;
    architecturePdf?: string;
}

const DEMO_DATA: DemoItem[] = [
    {
        id: 'lumina',
        title: 'Lumina Real Estate Media',
        description: 'An end-to-end operating system for real estate photography agencies that automates the entire workflow—from agent bookings and geospatial photographer scheduling to final asset delivery and billing.',
        features: [
            'Unified Marketplace: Connects Agents, Photographers, and Ops in one synced environment.',
            'Geospatial Logistics: Smart assignment logic using radius checks and route optimization.',
            'Dynamic Booking: Role-aware interface for complex services and real-time scheduling.',
            'High-Volume Pipeline: Direct-to-cloud uploads and edge caching for media handling.',
            'Automated Finance: Integrated invoicing, automated payouts, and accounting sync.'
        ],
        category: 'CRM',
        link: "https://lumina.media",
        architecturePdf: '/docs/portfolio-lumina.pdf'
    },
    {
        id: 'nexus-flow',
        title: 'Nexus Flow',
        description: 'An intelligent automation engine that connects siloed enterprise tools, optimizing data delivery and reducing manual entry by up to 90% across departments.',
        category: 'Automation',
        review: {
            text: "The ROI was immediate. Our teams are finally focused on strategy instead of spreadsheets.",
            author: "Michael R., Tech Lead"
        },
        link: "#"
    },
    {
        id: 'pulse-marketing',
        title: 'Pulse AI',
        description: 'Predictive marketing analytics that analyzes customer behavior in real-time to trigger personalized outreach and maximize conversion rates.',
        category: 'Marketing',
        review: {
            text: "Our conversion rates jumped 40% in the first quarter of using Pulse. It's like having a mind-reader for your customers.",
            author: "Elena G., Marketing Director"
        },
        link: "#"
    },
    {
        id: 'logi-sync',
        title: 'LogiSync',
        description: 'Next-generation logistics management that optimizes delivery routes and manages driver dispatch through a decentralized agentic framework.',
        category: 'Logistics',
        review: {
            text: "Route efficiency is up 25%. The AI agents handle the edge cases that used to break our system.",
            author: "David L., Logistics Manager"
        },
        link: "#"
    },
    {
        id: 'omni-admin',
        title: 'OmniAdmin',
        description: 'A comprehensive CRM solution designed specifically for scaling agencies, featuring automated lead scoring and integrated billing.',
        category: 'CRM',
        review: {
            text: "The lead scoring is a game changer. We finally know exactly where to spend our sales time.",
            author: "James T., Agency Founder"
        },
        link: "#"
    }
];

interface AdminPageProps {
    onNavigate: (page: any) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
    const [user, setUser] = useState<{ name: string; email: string; picture?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'All' | DemoItem['category']>('All');

    const categories: ('All' | DemoItem['category'])[] = ['All', 'CRM', 'Automation', 'Marketing', 'Logistics'];

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const success = params.get('success');
        const errorParam = params.get('error');

        if (success === 'true') {
            const newUser = {
                name: params.get('name') || '',
                email: params.get('email') || '',
                picture: params.get('picture') || undefined
            };
            setUser(newUser);
            localStorage.setItem('admin_user', JSON.stringify(newUser));
            // Clean up URL
            window.history.replaceState({}, document.title, "/admin");
        } else if (errorParam) {
            setError(decodeURIComponent(errorParam));
            window.history.replaceState({}, document.title, "/admin");
        } else {
            // Check if already logged in
            const savedUser = localStorage.getItem('admin_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.authUrl);
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            setError('Could not reach server for login URL.');
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('admin_user');
        onNavigate('landing');
    };

    const filteredDemos = activeFilter === 'All'
        ? DEMO_DATA
        : DEMO_DATA.filter(d => d.category === activeFilter);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base flex items-center justify-center p-6">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base font-sans text-ink selection:bg-accent/20 flex flex-col">
            {user && (
                <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink/10 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate('landing')}>
                            <Logo className="w-8 h-8 text-ink" />
                            <span className="font-serif text-xl tracking-tight hidden sm:block">Admin Console</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                {user.picture ? (
                                    <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-ink/10" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                                <span className="text-sm font-medium text-ink hidden sm:block">{user.name}</span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="text-xs font-mono font-bold text-ink/40 hover:text-ink uppercase tracking-widest transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>
            )}

            <main className={`flex-grow flex ${user ? 'items-start pt-40 pb-24' : 'items-center'} justify-center p-6 relative overflow-hidden`}>
                <VitruvianBackground className="opacity-[0.08] fixed" />

                <div className="relative z-10 w-full max-w-7xl mx-auto">
                    <ScrollReveal>
                        {!user ? (
                            <div className="bg-white/60 backdrop-blur-xl shadow-2xl shadow-ink/10 border border-ink/10 rounded-sm overflow-hidden p-12 text-center max-w-2xl mx-auto">
                                <Logo className="w-16 h-16 text-ink mx-auto mb-8" />
                                <h1 className="font-serif text-4xl text-ink mb-4">Admin Access</h1>
                                <p className="text-ink-muted text-lg mb-10 max-w-md mx-auto">
                                    Restricted to internal DaVeenci team members.
                                </p>

                                {error ? (
                                    <div className="bg-red-50 border border-red-100 p-6 rounded-sm mb-8 flex items-start gap-4 text-left animate-in slide-in-from-top-2">
                                        <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-bold text-red-900 text-sm uppercase tracking-wider mb-1">Access Denied</h3>
                                            <p className="text-red-700 text-sm">{error}</p>
                                        </div>
                                    </div>
                                ) : null}

                                <button
                                    onClick={handleLogin}
                                    className="w-full py-3 px-4 bg-white border border-[#D1D5DB] rounded-md flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-sans font-medium text-[#374151]"
                                >
                                    <GoogleLogo />
                                    Continue with Google
                                </button>

                                <button
                                    onClick={() => onNavigate('landing')}
                                    className="mt-8 text-xs font-mono font-bold text-ink-muted/60 uppercase tracking-widest hover:text-ink transition-colors"
                                >
                                    Return to Public Folio
                                </button>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-500 w-full">

                                <div className="animate-in fade-in duration-500">
                                    {/* Filter Bar */}
                                    <div className="flex flex-wrap items-center justify-center gap-3 mb-12 border-b border-ink/5 pb-10">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mr-2">Filter by Category:</span>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveFilter(cat)}
                                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${activeFilter === cat
                                                    ? 'bg-ink text-white border-ink shadow-lg shadow-ink/20'
                                                    : 'bg-white/50 text-ink/60 border-ink/10 hover:border-ink/20'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Demos Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                                        {filteredDemos.map((demo) => (
                                            <div
                                                key={demo.id}
                                                className="bg-white/80 backdrop-blur-xl border border-ink/5 rounded-lg overflow-hidden flex flex-col hover:border-accent/20 transition-all duration-500 group shadow-md hover:shadow-2xl hover:shadow-ink/10 hover:-translate-y-1"
                                            >
                                                {/* PDF Preview at Top */}
                                                {demo.architecturePdf && (
                                                    <div
                                                        className="relative aspect-[16/10] overflow-hidden cursor-pointer border-b border-ink/5"
                                                        onClick={() => window.open(demo.architecturePdf, '_blank')}
                                                    >
                                                        <PDFSlideshow
                                                            pdfUrl={demo.architecturePdf}
                                                            className="w-full h-full"
                                                            interval={4000}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                                            <div className="bg-white/95 backdrop-blur-sm px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-ink shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                                View Full Documentation
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Card Content */}
                                                <div className="p-6 flex flex-col flex-grow">
                                                    {/* Header: Category + Icon */}
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="px-3 py-1.5 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                            {demo.category}
                                                        </span>
                                                        <div className="w-9 h-9 rounded-full bg-ink/5 flex items-center justify-center opacity-50 group-hover:opacity-100 group-hover:bg-accent/10 transition-all duration-300">
                                                            <LayoutDashboard className="w-4 h-4 text-ink group-hover:text-accent transition-colors" />
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="font-serif text-2xl text-ink mb-3 group-hover:text-accent transition-colors duration-300">
                                                        {demo.title}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="text-sm text-ink/60 leading-relaxed mb-5 line-clamp-3">
                                                        {demo.description}
                                                    </p>

                                                    {/* Features List - All Items with Bold Styling */}
                                                    {demo.features && (
                                                        <div className="mb-5 flex flex-wrap gap-2">
                                                            {demo.features.map((feature, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-3 py-1.5 bg-accent/10 text-[9px] text-accent font-bold uppercase tracking-wide rounded-full border border-accent/20 hover:bg-accent/20 transition-colors cursor-default"
                                                                >
                                                                    {feature.split(':')[0]}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Client Review - Compact */}
                                                    {demo.review && (
                                                        <div className="mb-5 p-4 bg-ink/[0.02] rounded-lg border-l-2 border-accent/30">
                                                            <p className="text-xs text-ink/60 italic leading-relaxed mb-2 line-clamp-2">
                                                                "{demo.review.text}"
                                                            </p>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
                                                                — {demo.review.author}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Spacer */}
                                                    <div className="flex-grow" />

                                                    {/* Action Button */}
                                                    <div className="mt-4">
                                                        <a
                                                            href={demo.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center gap-2 py-3.5 bg-ink text-white text-[10px] font-bold uppercase tracking-widest text-center hover:bg-accent transition-all duration-300 rounded-md shadow-lg shadow-ink/10 hover:shadow-accent/20"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                            Launch Demo
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </ScrollReveal>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;

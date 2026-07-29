import React from 'react';
import { 
  Award, ShieldCheck, Globe, LockKeyhole, 
  Cloud, Layers, FileCheck, ShoppingBag, Compass, 
  Hammer, HardHat, Recycle, Building, Scale, TrendingUp 
} from 'lucide-react';

// Use real people and environment photos instead of AI-generated illustrations
const heroImage = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600';
const complianceImage = 'https://edgebuildings.com/wp-content/uploads/2022/04/edge-featured-landing-excellence-dfge.jpg';
const footerImage = 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1200';

interface LandingViewProps {
  onRequestAccess: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onRequestAccess }) => {
  return (
    <>
      <style>{`
        .landing-container {
          --moss: #1A3C2A;
          --leaf: #2E6B45;
          --lime: #5BAD6F;
          --sage: #A8C5A0;
          --offwhite: #F0EDE6;
          --concrete: #C8C4BC;
          --steel: #3A3D3E;
          --charcoal: #1C1E1F;
          --amber: #D4820A;
          --amber-light: #F5B84A;
          --white: #FFFFFF;
          --glass: rgba(255,255,255,0.06);
          --glass-border: rgba(255,255,255,0.12);
          
          font-family: 'Space Grotesk', sans-serif;
          background: var(--charcoal);
          color: var(--offwhite);
          overflow-x: hidden;
          line-height: 1.6;
        }

        .landing-container * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* ── NAV ── */
        .landing-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          height: 72px;
          background: rgba(28,30,31,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
        }
        .logo-mark {
          width: 36px; height: 36px; background: var(--leaf);
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700; color: #fff;
          letter-spacing: -1px;
        }
        .logo-text { font-size: 15px; font-weight: 600; letter-spacing: 0.01em; }
        .logo-sub { font-size: 10px; color: var(--sage); letter-spacing: 0.12em; text-transform: uppercase; }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a { color: var(--concrete); font-size: 13px; text-decoration: none; letter-spacing: 0.04em; transition: color 0.2s; }
        .nav-links a:hover { color: var(--offwhite); }
        .nav-cta {
          background: var(--leaf); color: #fff; border: none; padding: 10px 22px;
          border-radius: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 13px;
          font-weight: 500; cursor: pointer; transition: background 0.2s;
        }
        .nav-cta:hover { background: var(--lime); }
        .nav-badges {
          display: none;
        }
        @media (min-width: 1024px) {
          .nav-badges {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-right: 20px;
          }
        }

        /* ── HERO ── */
        .landing-hero {
          min-height: 75vh;
          display: flex;
          align-items: center;
          padding: 80px 48px 20px;
          position: relative; overflow: hidden;
        }
        .hero-bg-wrapper {
          position: absolute; inset: 0; z-index: 0; width: 100vw; margin-left: calc(-50vw + 50%);
        }
        .hero-bg-wrapper::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(17, 19, 20, 0.4);
        }
        .hero-bg-image {
          width: 100%; height: 100%; object-fit: cover; opacity: 1;
        }
        .hero-bg-gradient {
          display: none;
        }
        .hero-content { position: relative; z-index: 2; max-width: 600px; text-shadow: none; }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(91,173,111,0.12); border: 1px solid rgba(91,173,111,0.25);
          padding: 6px 14px; border-radius: 100px;
          font-size: 11px; font-weight: 500; color: var(--lime); letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 28px;
        }
        .eyebrow-dot { width: 6px; height: 6px; background: var(--lime); border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .landing-hero h1 {
          font-size: clamp(38px, 5vw, 62px); font-weight: 700; line-height: 1.08;
          letter-spacing: -0.03em; margin-bottom: 24px;
        }
        .landing-hero h1 em { font-style: normal; color: var(--lime); }
        .hero-sub {
          font-size: 16px; color: var(--concrete); line-height: 1.7; max-width: 480px; margin-bottom: 40px;
        }
        .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
        .btn-primary {
          background: var(--leaf); color: #fff; border: none; padding: 14px 28px;
          border-radius: 8px; font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s;
        }
        .btn-primary:hover { background: var(--lime); }
        .btn-outline {
          background: transparent; color: var(--offwhite);
          border: 1px solid rgba(255,255,255,0.2); padding: 14px 28px;
          border-radius: 8px; font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: border-color 0.2s, background 0.2s;
        }
        .btn-outline:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); }

        .hero-visual { position: relative; z-index: 1; display: flex; justify-content: center; }
        .hero-card-stack { position: relative; width: 380px; }

        .metric-card {
          background: var(--glass); border: 1px solid var(--glass-border);
          backdrop-filter: blur(8px); border-radius: 14px; padding: 20px 24px;
        }
        .mc-label { font-size: 11px; color: var(--concrete); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px; }
        .mc-value { font-family: 'Space Mono', monospace; font-size: 32px; font-weight: 700; color: var(--white); }
        .mc-value span { font-size: 16px; color: var(--lime); margin-left: 4px; }
        .mc-sub { font-size: 12px; color: var(--sage); margin-top: 4px; }

        .metric-card-main { margin-bottom: 12px; }
        .metric-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .metric-card.sm .mc-value { font-size: 22px; }

        .waste-gauge-card {
          background: var(--glass); border: 1px solid var(--glass-border);
          border-radius: 14px; padding: 20px 24px;
        }
        .gauge-title { font-size: 11px; color: var(--concrete); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 14px; }
        .gauge-bars { display: flex; flex-direction: column; gap: 10px; }
        .gauge-item { display: flex; align-items: center; gap: 10px; font-size: 12px; }
        .gauge-name { color: var(--concrete); width: 80px; flex-shrink: 0; }
        .gauge-track { flex: 1; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
        .gauge-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
        .gauge-pct { color: var(--offwhite); font-family: 'Space Mono', monospace; font-size: 11px; width: 36px; text-align: right; }

        .floating-badge {
          position: absolute; background: var(--amber); color: var(--charcoal);
          font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 100px;
          letter-spacing: 0.06em;
        }
        .badge-breeam { top: -16px; right: -16px; }
        .badge-iso { bottom: 80px; left: -24px; background: var(--leaf); color: #fff; }

        /* ── STATS BAR ── */
        .stats-bar {
          background: var(--moss); padding: 24px 48px;
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid rgba(255,255,255,0.07);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-wrap: wrap; /* Added logic for mobile */
        }
        .stat-item { text-align: center; margin: 10px 0; }
        .stat-num { font-family: 'Space Mono', monospace; font-size: 28px; font-weight: 700; color: var(--white); }
        .stat-num em { color: var(--lime); font-style: normal; }
        .stat-label { font-size: 11px; color: var(--sage); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 2px; }
        .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); display: none; } /* Disabled divider on mobile */
        @media (min-width: 768px) {
           .stat-divider { display: block; }
        }

        /* ── SECTION SHARED ── */
        .landing-section { padding: 96px 48px; }
        .section-eyebrow {
          font-size: 11px; color: var(--lime); letter-spacing: 0.12em; text-transform: uppercase;
          font-weight: 500; margin-bottom: 12px;
        }
        .section-title {
          font-size: clamp(28px, 3vw, 42px); font-weight: 700; letter-spacing: -0.02em;
          line-height: 1.15; margin-bottom: 16px;
        }
        .section-sub { font-size: 16px; color: var(--concrete); max-width: 520px; line-height: 1.7; }

        /* ── PLATFORM SECTION ── */
        .platform-section { background: var(--steel); }
        .platform-grid { display: grid; grid-template-columns: 1fr; gap: 64px; align-items: center; }
        @media (min-width: 900px) { .platform-grid { grid-template-columns: 1fr 1fr; } }
        .platform-modules { display: flex; flex-direction: column; gap: 16px; margin-top: 40px; }
        .module-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 24px;
          display: flex; align-items: flex-start; gap: 20px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;
          position: relative; overflow: hidden;
        }
        .module-card::before {
          content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%;
          background: transparent; transition: background-color 0.3s;
        }
        .module-card:hover {
          background: rgba(255,255,255,0.05); border-color: rgba(91,173,111,0.25);
          transform: translateX(4px);
        }
        .module-card:hover::before {
          background: var(--lime);
        }
        .module-icon {
          width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.3s;
        }
        .module-card:hover .module-icon {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(91,173,111,0.15);
        }
        .mod-green { background: rgba(91,173,111,0.1); color: var(--lime); border: 1px solid rgba(91,173,111,0.15); }
        .mod-amber { background: rgba(245,184,74,0.1); color: var(--amber-light); border: 1px solid rgba(245,184,74,0.15); }
        .mod-blue { background: rgba(130,170,223,0.1); color: #82AADF; border: 1px solid rgba(130,170,223,0.15); }
        .mod-teal { background: rgba(110,205,224,0.1); color: #6ECDE0; border: 1px solid rgba(110,205,224,0.15); }
        .mod-purple { background: rgba(180,142,224,0.1); color: #B48EE0; border: 1px solid rgba(180,142,224,0.15); }
        .module-text h3 { font-size: 16px; font-weight: 600; color: var(--offwhite); margin-bottom: 6px; }
        .module-text p { font-size: 13px; color: var(--concrete); line-height: 1.6; }

        .platform-visual {
          background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 28px; overflow: hidden;
        }
        .pv-header { font-size: 11px; color: var(--sage); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .pv-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--lime); animation: pulse 2s infinite; }
        .flow-node {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; padding: 12px 16px; margin-bottom: 10px;
          font-size: 13px; display: flex; justify-content: space-between; align-items: center;
        }
        .flow-node-label { color: var(--offwhite); }
        .flow-node-tag {
          font-size: 10px; padding: 3px 10px; border-radius: 100px; font-weight: 600;
          letter-spacing: 0.06em;
        }
        .tag-live { background: rgba(91,173,111,0.2); color: var(--lime); }
        .tag-ai { background: rgba(212,130,10,0.2); color: var(--amber-light); }
        .tag-int { background: rgba(56,100,160,0.25); color: #82AADF; }
        .flow-arrow { text-align: center; color: rgba(255,255,255,0.2); font-size: 18px; margin: 4px 0 4px 16px; }

        /* ── WASTE TYPES ── */
        .waste-section { background: var(--charcoal); }
        .waste-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 56px; }
        @media (min-width: 768px) { .waste-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .waste-grid { grid-template-columns: repeat(3, 1fr); } }
        .waste-card {
          border-radius: 16px; overflow: hidden; position: relative; min-height: 250px;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 28px 24px; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .waste-card:hover { 
          transform: translateY(-6px); 
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
          border-color: rgba(255,255,255,0.12);
        }
        .wc-concrete { background: linear-gradient(145deg, rgba(46,75,55,0.3) 0%, rgba(20,30,22,0.6) 100%); }
        .wc-metal { background: linear-gradient(145deg, rgba(40,55,75,0.3) 0%, rgba(18,22,30,0.6) 100%); }
        .wc-timber { background: linear-gradient(145deg, rgba(75,50,30,0.3) 0%, rgba(30,18,10,0.6) 100%); }
        .wc-hazmat { background: linear-gradient(145deg, rgba(75,30,30,0.3) 0%, rgba(30,12,12,0.6) 100%); }
        .wc-glass { background: linear-gradient(145deg, rgba(30,65,75,0.3) 0%, rgba(12,25,30,0.6) 100%); }
        .wc-mixed { background: linear-gradient(145deg, rgba(55,40,75,0.3) 0%, rgba(22,15,30,0.6) 100%); }
        
        .waste-card:hover.wc-concrete { border-color: rgba(91,173,111,0.4); box-shadow: 0 12px 30px rgba(91,173,111,0.15); }
        .waste-card:hover.wc-metal { border-color: rgba(130,170,223,0.4); box-shadow: 0 12px 30px rgba(130,170,223,0.15); }
        .waste-card:hover.wc-timber { border-color: rgba(245,184,74,0.4); box-shadow: 0 12px 30px rgba(245,184,74,0.15); }
        .waste-card:hover.wc-hazmat { border-color: rgba(200,60,60,0.4); box-shadow: 0 12px 30px rgba(200,60,60,0.15); }
        .waste-card:hover.wc-glass { border-color: rgba(110,205,224,0.4); box-shadow: 0 12px 30px rgba(110,205,224,0.15); }
        .waste-card:hover.wc-mixed { border-color: rgba(180,142,224,0.4); box-shadow: 0 12px 30px rgba(180,142,224,0.15); }

        .wc-icon-wrap {
          width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px; transition: transform 0.3s;
        }
        .waste-card:hover .wc-icon-wrap { transform: scale(1.1) rotate(3deg); }
        
        .wc-concrete .wc-icon-wrap { background: rgba(91,173,111,0.15); color: var(--lime); }
        .wc-metal .wc-icon-wrap { background: rgba(130,170,223,0.15); color: #82AADF; }
        .wc-timber .wc-icon-wrap { background: rgba(245,184,74,0.15); color: var(--amber-light); }
        .wc-hazmat .wc-icon-wrap { background: rgba(200,60,60,0.15); color: #E26B6B; }
        .wc-glass .wc-icon-wrap { background: rgba(110,205,224,0.15); color: #6ECDE0; }
        .wc-mixed .wc-icon-wrap { background: rgba(180,142,224,0.15); color: #B48EE0; }

        .wc-title { font-size: 18px; font-weight: 700; color: var(--white); margin-bottom: 8px; }
        .wc-sub { font-size: 13px; color: var(--concrete); line-height: 1.5; }
        .wc-tag {
          position: absolute; top: 20px; right: 20px;
          font-size: 10px; font-weight: 700; padding: 4px 10px;
          border-radius: 100px; letter-spacing: 0.08em;
        }

        /* ── BREEAM / COMPLIANCE ── */
        .compliance-section { background: var(--moss); }
        .comp-grid { display: grid; grid-template-columns: 1fr; gap: 64px; align-items: center; }
        @media (min-width: 900px) { .comp-grid { grid-template-columns: 1fr 1.1fr; } }
        .comp-scores { display: flex; flex-direction: column; gap: 16px; margin-top: 40px; }
        .score-row { display: flex; align-items: center; gap: 16px; }
        .score-label { font-size: 13px; font-weight: 500; color: var(--sage); width: 140px; flex-shrink: 0; }
        .score-bar-wrap { flex: 1; }
        .score-track { height: 6px; background: rgba(0,0,0,0.3); border-radius: 4px; overflow: hidden; }
        .score-fill { height: 100%; border-radius: 4px; box-shadow: 0 0 10px rgba(91,173,111,0.5); }
        .score-val { font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700; color: var(--offwhite); width: 44px; text-align: right; }
        
        .comp-visual-col {
           position: relative; border-radius: 16px; overflow: hidden;
           border: 1px solid rgba(255,255,255,0.08); background: rgba(10,10,10,0.5);
           box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .comp-main-image { width: 100%; height: 280px; object-fit: cover; opacity: 0.9; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .compliance-badges { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 600px) { .compliance-badges { grid-template-columns: 1fr 1fr; } }
        .comp-badge {
          background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.05);
          border-right: 1px solid rgba(255,255,255,0.05);
          border-radius: 0; padding: 24px 20px; text-align: left;
          display: flex; flex-direction: column; gap: 12px;
          transition: background 0.2s;
        }
        .comp-badge:hover { background: rgba(255,255,255,0.02); }
        .comp-badge:nth-child(even) { border-right: none; }
        .comp-badge:nth-child(3), .comp-badge:nth-child(4) { border-bottom: none; }
        
        .cb-header { display: flex; align-items: center; gap: 12px; }
        .cb-icon-wrap { width: 36px; height: 36px; border-radius: 8px; background: rgba(91,173,111,0.1); display: flex; align-items: center; justify-content: center; color: var(--lime); }
        .comp-badge-title { font-size: 14px; font-weight: 600; color: var(--offwhite); }
        .comp-badge-sub { font-size: 13px; color: var(--sage); line-height: 1.5; }

        /* ── TEAM / USE CASES ── */
        .use-section { background: var(--steel); }
        .use-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 56px; }
        @media (min-width: 768px) { .use-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .use-grid { grid-template-columns: repeat(4, 1fr); } }
        .use-card {
          background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px; padding: 32px 24px; text-align: left;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;
          display: flex; flex-direction: column; gap: 16px;
          backdrop-filter: blur(8px);
        }
        .use-card:hover { 
          transform: translateY(-5px); 
          border-color: rgba(91,173,111,0.3); 
          background: rgba(255,255,255,0.035);
          box-shadow: 0 12px 24px rgba(0,0,0,0.2);
        }
        .use-icon-wrap { 
          width: 44px; height: 44px; border-radius: 10px; 
          background: rgba(255,255,255,0.04); 
          display: flex; align-items: center; justify-content: center; 
          color: var(--lime); transition: all 0.3s;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .use-card:hover .use-icon-wrap {
          background: rgba(91,173,111,0.15);
          color: var(--lime);
          border-color: rgba(91,173,111,0.25);
          transform: scale(1.05);
        }
        .use-title { font-size: 16px; font-weight: 600; color: var(--offwhite); }
        .use-desc { font-size: 13px; color: var(--concrete); line-height: 1.6; }

        /* ── TESTIMONIAL / IMPACT ── */
        .impact-section { background: var(--charcoal); }
        .impact-grid { display: grid; grid-template-columns: 1fr; gap: 24px; margin-top: 56px; }
        @media (min-width: 900px) { .impact-grid { grid-template-columns: 1fr 1fr; } }
        .impact-big {
          grid-row: span 2; background: var(--leaf);
          border-radius: 16px; padding: 36px; display: flex; flex-direction: column; justify-content: space-between;
        }
        .impact-quote { font-size: 20px; font-weight: 500; line-height: 1.5; margin-bottom: 24px; }
        .impact-author { display: flex; align-items: center; gap: 12px; }
        .author-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700;
        }
        .author-name { font-size: 14px; font-weight: 600; }
        .author-role { font-size: 12px; color: rgba(255,255,255,0.7); }
        .impact-stat-card {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 28px; display: flex; flex-direction: column; justify-content: center;
        }
        .isc-num { font-family: 'Space Mono', monospace; font-size: 40px; font-weight: 700; color: var(--lime); }
        .isc-label { font-size: 14px; color: var(--concrete); margin-top: 6px; }

        /* ── CTA BANNER ── */
        .cta-section {
          background: var(--leaf); padding: 72px 48px; text-align: center;
        }
        .cta-section h2 { font-size: 38px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 16px; }
        .cta-section p { font-size: 16px; color: rgba(255,255,255,0.75); max-width: 480px; margin: 0 auto 36px; }
        .cta-btns { display: flex; gap: 14px; justify-content: center; }
        .cta-btn-white {
          background: #fff; color: var(--leaf); padding: 14px 28px; border-radius: 8px;
          font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; border: none; transition: opacity 0.2s;
        }
        .cta-btn-white:hover { opacity: 0.9; }
        .cta-btn-ghost {
          background: transparent; color: #fff;
          border: 1.5px solid rgba(255,255,255,0.4); padding: 14px 28px; border-radius: 8px;
          font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: border-color 0.2s;
        }
        .cta-btn-ghost:hover { border-color: rgba(255,255,255,0.8); }

        /* ── PARTNERS SECTION ── */
        .partners-section {
          background: #121314;
          padding: 64px 48px;
          border-top: 1px solid rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.03);
          text-align: center;
          overflow: hidden;
        }
        .partners-eyebrow {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--sage);
          opacity: 0.7;
          margin-bottom: 32px;
          font-weight: 600;
        }
        .marquee-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 12px 0;
        }
        /* Mask overlay to fade out at edges */
        .marquee-container::before,
        .marquee-container::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120px;
          z-index: 2;
          pointer-events: none;
        }
        .marquee-container::before {
          left: 0;
          background: linear-gradient(to right, #121314, transparent);
        }
        .marquee-container::after {
          right: 0;
          background: linear-gradient(to left, #121314, transparent);
        }
        .marquee-track {
          display: flex;
          gap: 60px;
          width: max-content;
          animation: marquee-scroll 40s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .partner-logo-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--concrete);
          opacity: 0.45;
          transition: all 0.3s ease;
          cursor: pointer;
          white-space: nowrap;
        }
        .partner-logo-item:hover {
          opacity: 1;
          color: var(--lime);
          transform: scale(1.03);
        }
        .partner-mark {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 12px;
          border: 1.5px solid currentColor;
          border-radius: 6px;
        }
        .partner-name {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-family: 'Space Grotesk', sans-serif;
        }
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* ── CASE STUDIES ── */
        .cases-section {
          background: #17191a;
          padding: 96px 48px;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .cases-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          margin-top: 56px;
        }
        @media (min-width: 768px) {
          .cases-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1100px) {
          .cases-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .case-card {
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .case-card:hover {
          transform: translateY(-8px);
          border-color: rgba(91,173,111,0.3);
          background: rgba(255,255,255,0.03);
          box-shadow: 0 20px 40px rgba(0,0,0,0.35);
        }
        .case-image-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .case-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .case-card:hover .case-image {
          transform: scale(1.05);
        }
        .case-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(23,25,26,0.95) 0%, rgba(23,25,26,0) 100%);
        }
        .case-location {
          position: absolute;
          bottom: 16px;
          left: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--lime);
          background: rgba(26, 60, 42, 0.85);
          padding: 4px 10px;
          border-radius: 4px;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(91,173,111,0.25);
        }
        .case-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .case-meta {
          font-size: 11px;
          color: var(--sage);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .case-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .case-desc {
          font-size: 13px;
          color: var(--concrete);
          line-height: 1.6;
          margin-bottom: 24px;
          flex: 1;
        }
        .case-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .case-stat-box {
          display: flex;
          flex-direction: column;
        }
        .case-stat-num {
          font-family: 'Space Mono', monospace;
          font-size: 16px;
          font-weight: 700;
          color: var(--lime);
        }
        .case-stat-label {
          font-size: 10px;
          color: var(--sage);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-top: 2px;
        }

        /* ── FOOTER ── */
        .landing-footer {
          position: relative;
          background: #111314; padding: 56px 48px 32px;
          border-top: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
        }
        .footer-bg {
          position: absolute; inset: 0; z-index: 0;
          width: 100%; height: 100%; object-fit: cover; opacity: 0.15;
          mix-blend-mode: color-dodge;
        }
        .footer-content { position: relative; z-index: 1; }
        .footer-grid { display: grid; grid-template-columns: 1fr; gap: 48px; margin-bottom: 48px; }
        @media (min-width: 768px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; } }
        .footer-brand p { font-size: 13px; color: var(--concrete); line-height: 1.7; max-width: 280px; margin-top: 14px; }
        .footer-col h4 { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sage); margin-bottom: 16px; font-weight: 500; }
        .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-col ul li a { font-size: 13px; color: var(--concrete); text-decoration: none; transition: color 0.2s; }
        .footer-col ul li a:hover { color: var(--offwhite); }
        .footer-bottom {
          display: flex; flex-direction: column; gap: 20px; align-items: flex-start;
          border-top: 1px solid rgba(255,255,255,0.07); padding-top: 24px;
          font-size: 12px; color: rgba(255,255,255,0.3);
        }
        @media (min-width: 600px) { .footer-bottom { flex-direction: row; justify-content: space-between; align-items: center; } }
        .footer-certbadges { display: flex; gap: 12px; flex-wrap: wrap; }
        .fcert {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 10px; border-radius: 6px; font-size: 10px; color: var(--sage);
          letter-spacing: 0.08em;
        }
      `}</style>
      <div className="landing-container">
        {/* NAV */}
        <nav className="landing-nav">
          <div className="nav-logo">
            <div className="logo-mark">CG</div>
            <div>
              <div className="logo-text">CG WasteData</div>
              <div className="logo-sub">Intelligence Engine</div>
            </div>
          </div>
          <ul className="nav-links hidden md:flex">
            <li><a href="#platform">Platform</a></li>
            <li><a href="#waste">Waste Streams</a></li>
            <li><a href="#compliance">Compliance</a></li>
            <li><a href="#analytics">Analytics</a></li>
            <li><a href="#about">About</a></li>
          </ul>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="nav-badges">
              <span className="fcert" style={{ background: 'var(--leaf)', color: 'white', borderColor: 'transparent' }}>BREEAM Verified</span>
              <span className="fcert">ISO 14001</span>
            </div>
            <button className="nav-cta" onClick={onRequestAccess}>Request Access →</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="landing-hero" id="about">
          <div className="hero-bg-wrapper">
            <img src={heroImage} alt="" className="hero-bg-image" />
            <div className="hero-bg-gradient" />
          </div>

          <div className="hero-content">
            <h1>
              Intelligent <em>C&D Waste</em> Management
            </h1>
            <p className="hero-sub">
              Transforming how the construction, demolition, and waste recovery sectors manage material flows, compliance, and circular economy outcomes. Turning Waste Data into Circular Value.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={onRequestAccess}>Explore the Platform →</button>
              <button className="btn-outline">See Live Demo</button>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-num"><em>2.4M+</em></div>
            <div className="stat-label">Tonnes tracked</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-num"><em>340+</em></div>
            <div className="stat-label">Active sites</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-num"><em>98.2%</em></div>
            <div className="stat-label">Compliance accuracy</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-num"><em>73%</em></div>
            <div className="stat-label">Avg diversion rate</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-num"><em>12</em></div>
            <div className="stat-label">Countries active</div>
          </div>
        </div>

        {/* PLATFORM SECTION */}
        <section className="landing-section platform-section" id="platform">
          <div className="platform-grid">
            <div>
              <div className="section-eyebrow">The Platform</div>
              <h2 className="section-title">An intelligence layer built for construction waste</h2>
              <p className="section-sub">From skip-level tracking to digital compliance manifests, CG WasteData gives project managers, EHS teams and sustainability officers a single source of truth.</p>
              <div className="platform-modules">
                <div className="module-card">
                  <div className="module-icon mod-green"><Cloud size={20} /></div>
                  <div className="module-text">
                    <h3>CG Waste Intelligence Cloud</h3>
                    <p>A centralized SaaS operating environment providing real-time waste data visibility, project monitoring dashboards, and automated smart reporting.</p>
                  </div>
                </div>
                <div className="module-card">
                  <div className="module-icon mod-amber"><Layers size={20} /></div>
                  <div className="module-text">
                    <h3>C&D Waste Digital Twin Monitoring</h3>
                    <p>Digital modelling for tracking waste flows, project performance, and recovery opportunities across full asset lifecycles.</p>
                  </div>
                </div>
                <div className="module-card">
                  <div className="module-icon mod-blue"><FileCheck size={20} /></div>
                  <div className="module-text">
                    <h3>Green Compliance Management Suite</h3>
                    <p>Integrated tools supporting environmental regulations, circular economy reporting, ESG disclosures, and green building standards.</p>
                  </div>
                </div>
                <div className="module-card">
                  <div className="module-icon mod-teal"><ShoppingBag size={20} /></div>
                  <div className="module-text">
                    <h3>Construction Waste Marketplace</h3>
                    <p>A digital exchange connecting waste generators, recyclers, processors, and buyers through intelligent matching.</p>
                  </div>
                </div>
                <div className="module-card">
                  <div className="module-icon mod-purple"><Compass size={20} /></div>
                  <div className="module-text">
                    <h3>Edge Building Design Consultancy</h3>
                    <p>Green building advisory, resource-efficient design intelligence, and ESG certification readiness support.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="platform-visual">
              <div className="pv-header"><div className="pv-dot" /> Live data pipeline</div>
              <div className="flow-node">
                <span className="flow-node-label">Weighbridge IoT sensors</span>
                <span className="flow-node-tag tag-live">LIVE</span>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-node">
                <span className="flow-node-label">Classification engine</span>
                <span className="flow-node-tag tag-ai">SYSTEM</span>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-node">
                <span className="flow-node-label">Manifest auto-generation</span>
                <span className="flow-node-tag tag-live">AUTO</span>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-node">
                <span className="flow-node-label">Regulator & auditor API</span>
                <span className="flow-node-tag tag-int">INT.</span>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-node">
                <span className="flow-node-label">Client intelligence dashboard</span>
                <span className="flow-node-tag tag-ai">REPORT</span>
              </div>
              <div style={{marginTop: '20px', background: 'rgba(91,173,111,0.1)', border: '1px solid rgba(91,173,111,0.2)', borderRadius: '8px', padding: '14px 16px'}}>
                <div style={{fontSize: '11px', color: 'var(--sage)', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase'}}>Processing now</div>
                <div style={{fontFamily: "'Space Mono', monospace", fontSize: '12px', color: 'var(--lime)'}}>
                  [14:32:07] Site 023 · 18.4t concrete classified<br />
                  [14:31:55] Manifest #WM-2941 generated ✓<br />
                  [14:31:22] Alert: hazmat flagged at Site 017
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WASTE TYPES */}
        <section className="landing-section waste-section" id="waste">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px'}}>
            <div>
              <div className="section-eyebrow">Waste Streams</div>
              <h2 className="section-title">Every stream. Tracked,<br />classified, optimised.</h2>
            </div>
            <button className="btn-outline" style={{flexShrink: 0}}>View all streams →</button>
          </div>
          <div className="waste-grid">
            <div className="waste-card wc-concrete">
              <span className="wc-tag" style={{background: 'rgba(91,173,111,0.2)', color: 'var(--lime)'}}>RECYC. 88%</span>
              <div className="wc-icon-wrap"><Layers size={24} /></div>
              <div className="wc-title">Concrete & Masonry</div>
              <div className="wc-sub">Crushed aggregate, block, brick — tracked to licensed recyclers</div>
            </div>
            <div className="waste-card wc-metal">
              <span className="wc-tag" style={{background: 'rgba(56,100,160,0.25)', color: '#82AADF'}}>RECYC. 94%</span>
              <div className="wc-icon-wrap"><Hammer size={24} /></div>
              <div className="wc-title">Steel & Metal</div>
              <div className="wc-sub">Rebar, structural steel, copper — high-value circular chain</div>
            </div>
            <div className="waste-card wc-timber">
              <span className="wc-tag" style={{background: 'rgba(212,130,10,0.2)', color: 'var(--amber-light)'}}>RECYC. 61%</span>
              <div className="wc-icon-wrap"><Building size={24} /></div>
              <div className="wc-title">Timber & Boarding</div>
              <div className="wc-sub">Formwork, scaffolding boards, engineered timber classification</div>
            </div>
            <div className="waste-card wc-hazmat">
              <span className="wc-tag" style={{background: 'rgba(200,60,60,0.2)', color: '#E26B6B'}}>CONTROLLED</span>
              <div className="wc-icon-wrap"><LockKeyhole size={24} /></div>
              <div className="wc-title">Hazardous Materials</div>
              <div className="wc-sub">Asbestos, lead paint, PCBs — compliant licensed disposal chain</div>
            </div>
            <div className="waste-card wc-glass">
              <span className="wc-tag" style={{background: 'rgba(56,160,180,0.2)', color: '#6ECDE0'}}>RECYC. 52%</span>
              <div className="wc-icon-wrap"><Compass size={24} /></div>
              <div className="wc-title">Glass & Glazing</div>
              <div className="wc-sub">Float glass, laminated panels, curtain wall components</div>
            </div>
            <div className="waste-card wc-mixed">
              <span className="wc-tag" style={{background: 'rgba(140,100,200,0.2)', color: '#B48EE0'}}>AUTOSORTED</span>
              <div className="wc-icon-wrap"><Recycle size={24} /></div>
              <div className="wc-title">Mixed & Unclassified</div>
              <div className="wc-sub">Automated vision sorting on mixed skips — reclassified in under 4 seconds</div>
            </div>
          </div>
        </section>

        {/* COMPLIANCE */}
        <section className="landing-section compliance-section" id="compliance">
          <div className="comp-grid">
            <div>
              <div className="section-eyebrow">Compliance & Certification</div>
              <h2 className="section-title">Built for Green Star. Ready for BREEAM.</h2>
              <p className="section-sub">Automated scoring across every major green building framework — so your auditors get a report, not a spreadsheet.</p>
              <div className="comp-scores">
                <div className="score-row">
                  <span className="score-label">BREEAM Waste</span>
                  <div className="score-bar-wrap"><div className="score-track"><div className="score-fill" style={{width: '91%', background: 'var(--lime)'}} /></div></div>
                  <span className="score-val">91%</span>
                </div>
                <div className="score-row">
                  <span className="score-label">Green Star SA</span>
                  <div className="score-bar-wrap"><div className="score-track"><div className="score-fill" style={{width: '84%', background: 'var(--lime)'}} /></div></div>
                  <span className="score-val">84%</span>
                </div>
                <div className="score-row">
                  <span className="score-label">SANS 10400</span>
                  <div className="score-bar-wrap"><div className="score-track"><div className="score-fill" style={{width: '99%', background: 'var(--lime)'}} /></div></div>
                  <span className="score-val">99%</span>
                </div>
                <div className="score-row">
                  <span className="score-label">ISO 14001</span>
                  <div className="score-bar-wrap"><div className="score-track"><div className="score-fill" style={{width: '96%', background: 'var(--amber-light)'}} /></div></div>
                  <span className="score-val">96%</span>
                </div>
                <div className="score-row">
                  <span className="score-label">NWMS Diversion</span>
                  <div className="score-bar-wrap"><div className="score-track"><div className="score-fill" style={{width: '73%', background: '#82AADF'}} /></div></div>
                  <span className="score-val">73%</span>
                </div>
              </div>
            </div>
            <div className="comp-visual-col">
              <img src={complianceImage} alt="Compliance visualization" className="comp-main-image" />
              <div className="compliance-badges">
                <div className="comp-badge">
                  <div className="cb-header">
                    <div className="cb-icon-wrap"><Award size={20} /></div>
                    <div className="comp-badge-title">BREEAM</div>
                  </div>
                  <div className="comp-badge-sub">Outstanding verified tracking</div>
                </div>
                <div className="comp-badge">
                  <div className="cb-header">
                    <div className="cb-icon-wrap"><ShieldCheck size={20} /></div>
                    <div className="comp-badge-title">Green Star SA</div>
                  </div>
                  <div className="comp-badge-sub">6-Star ready reporting</div>
                </div>
                <div className="comp-badge">
                  <div className="cb-header">
                    <div className="cb-icon-wrap"><Globe size={20} /></div>
                    <div className="comp-badge-title">ISO 14001</div>
                  </div>
                  <div className="comp-badge-sub">Environmental scope logic</div>
                </div>
                <div className="comp-badge">
                  <div className="cb-header">
                    <div className="cb-icon-wrap"><LockKeyhole size={20} /></div>
                    <div className="comp-badge-title">NWMS</div>
                  </div>
                  <div className="comp-badge-sub">Compliant manifest system</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CASE STUDIES SECTION */}
        <section className="cases-section" id="case-studies">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="section-eyebrow">Real-World Performance</div>
            <h2 className="section-title">Case Studies Across Africa & Globally</h2>
            <p className="section-sub" style={{ marginBottom: '40px' }}>
              Discover how our enterprise clients utilize CG WasteData to streamline materials recovery, reduce hauling overheads, automate compliance reporting, and achieve international green build certifications.
            </p>
            
            <div className="cases-grid">
              {/* Card 1 */}
              <div className="case-card">
                <div className="case-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800" alt="The Leonardo" className="case-image" />
                  <div className="case-image-overlay" />
                  <span className="case-location">Sandton, South Africa</span>
                </div>
                <div className="case-content">
                  <div className="case-meta">Sovereign Supertall Landmark</div>
                  <h3 className="case-title">The Leonardo Development</h3>
                  <p className="case-desc">
                    Faced with high-density urban site limitations during the 55-story tower execution, our systems tracked all concrete and timber workflows, routing rubble directly to nearby regional aggregators.
                  </p>
                  <div className="case-stats-row">
                    <div className="case-stat-box">
                      <span className="case-stat-num">89%</span>
                      <span className="case-stat-label">Diverted from Landfill</span>
                    </div>
                    <div className="case-stat-box">
                      <span className="case-stat-num">342 t</span>
                      <span className="case-stat-label">CO2e Saved</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="case-card">
                <div className="case-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=800" alt="Eko Atlantic Marina" className="case-image" />
                  <div className="case-image-overlay" />
                  <span className="case-location">Lagos, Nigeria</span>
                </div>
                <div className="case-content">
                  <div className="case-meta">Coastal Smart City Project</div>
                  <h3 className="case-title">Eko Atlantic Marina District</h3>
                  <p className="case-desc">
                    Managing and safeguarding massive marine reclamation works. Outfitted trucks with IoT weighbridge sensors and integrated manifests to ensure absolute circularity and heavy steel recycling.
                  </p>
                  <div className="case-stats-row">
                    <div className="case-stat-box">
                      <span className="case-stat-num">100%</span>
                      <span className="case-stat-label">Steel Re-smelted</span>
                    </div>
                    <div className="case-stat-box">
                      <span className="case-stat-num">1,150 t</span>
                      <span className="case-stat-label">CO2e Saved</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="case-card">
                <div className="case-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800" alt="New Administrative Capital" className="case-image" />
                  <div className="case-image-overlay" />
                  <span className="case-location">Cairo, Egypt</span>
                </div>
                <div className="case-content">
                  <div className="case-meta">Megacity Infrastructure Hub</div>
                  <h3 className="case-title">New Administrative Capital</h3>
                  <p className="case-desc">
                    Optimized the sorting of masonry waste across sprawling districts using our digital twin monitoring system, enabling regional factories to process brick rubble directly into building blocks.
                  </p>
                  <div className="case-stats-row">
                    <div className="case-stat-box">
                      <span className="case-stat-num">45k Tonnes</span>
                      <span className="case-stat-label">Material Repurposed</span>
                    </div>
                    <div className="case-stat-box">
                      <span className="case-stat-num">4,890 t</span>
                      <span className="case-stat-label">CO2e Saved</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="case-card">
                <div className="case-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800" alt="Claridge Hotel Extension" className="case-image" />
                  <div className="case-image-overlay" />
                  <span className="case-location">London, United Kingdom</span>
                </div>
                <div className="case-content">
                  <div className="case-meta">Subterranean Historic Renovation</div>
                  <h3 className="case-title">Claridge's Hotel Extension</h3>
                  <p className="case-desc">
                    Navigated complex inner-city historic preservation rules during sub-grade excavation. CG WasteData tracked and documented hazardous soils, preserving BREEAM Outstanding standards.
                  </p>
                  <div className="case-stats-row">
                    <div className="case-stat-box">
                      <span className="case-stat-num">98%</span>
                      <span className="case-stat-label">Recycling Efficiency</span>
                    </div>
                    <div className="case-stat-box">
                      <span className="case-stat-num">180 t</span>
                      <span className="case-stat-label">Carbon Abated</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5 */}
              <div className="case-card">
                <div className="case-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=800" alt="Kigali Green City" className="case-image" />
                  <div className="case-image-overlay" />
                  <span className="case-location">Kigali, Rwanda</span>
                </div>
                <div className="case-content">
                  <div className="case-meta">Eco-District Housing Development</div>
                  <h3 className="case-title">Kigali Green City Pilot</h3>
                  <p className="case-desc">
                    Empowered high-efficiency residential development. CG WasteData tracked raw soil brick offcuts and locally-sourced clay waste to optimize pre-fabrication loops and eliminate haulage.
                  </p>
                  <div className="case-stats-row">
                    <div className="case-stat-box">
                      <span className="case-stat-num">94%</span>
                      <span className="case-stat-label">Local Recovery</span>
                    </div>
                    <div className="case-stat-box">
                      <span className="case-stat-num">BREEAM</span>
                      <span className="case-stat-label">Pre-certified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 6 */}
              <div className="case-card">
                <div className="case-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800" alt="Mombasa Port Expansion" className="case-image" />
                  <div className="case-image-overlay" />
                  <span className="case-location">Mombasa, Kenya</span>
                </div>
                <div className="case-content">
                  <div className="case-meta">Heavy Civil Infrastructure</div>
                  <h3 className="case-title">Mombasa Port Modernization</h3>
                  <p className="case-desc">
                    Managed subsea dredging debris and heavy wharf pylon rubble. Monitored real-time water quality limits and logistics to keep port construction within strict marine regulatory requirements.
                  </p>
                  <div className="case-stats-row">
                    <div className="case-stat-box">
                      <span className="case-stat-num">12k t</span>
                      <span className="case-stat-label">Pylon Rubble Repurposed</span>
                    </div>
                    <div className="case-stat-box">
                      <span className="case-stat-num">Marine</span>
                      <span className="case-stat-label">Compliant Flow</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 7 */}
              <div className="case-card">
                <div className="case-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=800" alt="The Red Sea Project" className="case-image" />
                  <div className="case-image-overlay" />
                  <span className="case-location">Tabuk, Saudi Arabia</span>
                </div>
                <div className="case-content">
                  <div className="case-meta">Ultra-Luxury Eco-Tourism Gateway</div>
                  <h3 className="case-title">The Red Sea Giga-Project</h3>
                  <p className="case-desc">
                    Ensured compliance with strict zero-waste-to-landfill criteria. Logged all structural packaging, timber pallets, and structural steel offcuts via digital twin workflows for direct supplier buyback.
                  </p>
                  <div className="case-stats-row">
                    <div className="case-stat-box">
                      <span className="case-stat-num">100%</span>
                      <span className="case-stat-label">Zero-Landfill Compliant</span>
                    </div>
                    <div className="case-stat-box">
                      <span className="case-stat-num">2,800 t</span>
                      <span className="case-stat-label">Carbon Avoided</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 8 */}
              <div className="case-card">
                <div className="case-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" alt="Silicon Valley Campus" className="case-image" />
                  <div className="case-image-overlay" />
                  <span className="case-location">California, USA</span>
                </div>
                <div className="case-content">
                  <div className="case-meta">Commercial Office Retrofit</div>
                  <h3 className="case-title">Silicon Valley Tech HQ</h3>
                  <p className="case-desc">
                    Digitized structural demolition across a multi-acre tech campus. Identified high-value drywall, timber beams, and copper networks, proving carbon reduction metrics for local authorities.
                  </p>
                  <div className="case-stats-row">
                    <div className="case-stat-box">
                      <span className="case-stat-num">82%</span>
                      <span className="case-stat-label">Drywall Recycled</span>
                    </div>
                    <div className="case-stat-box">
                      <span className="case-stat-num">LEED</span>
                      <span className="case-stat-label">Platinum Certified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 9 */}
              <div className="case-card">
                <div className="case-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" alt="Casablanca Finance Tower" className="case-image" />
                  <div className="case-image-overlay" />
                  <span className="case-location">Casablanca, Morocco</span>
                </div>
                <div className="case-content">
                  <div className="case-meta">Financial District Skyscraper</div>
                  <h3 className="case-title">Casablanca Finance City Tower</h3>
                  <p className="case-desc">
                    Streamlined specialized material classification. Leveraged our material database and manifest suite to isolate curtain wall glass, high-grade aluminum, and copper conduits during high-rise commissioning.
                  </p>
                  <div className="case-stats-row">
                    <div className="case-stat-box">
                      <span className="case-stat-num">91%</span>
                      <span className="case-stat-label">Aluminum Recovered</span>
                    </div>
                    <div className="case-stat-box">
                      <span className="case-stat-num">ISO 50001</span>
                      <span className="case-stat-label">Aligned Metrics</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 10 */}
              <div className="case-card">
                <div className="case-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800" alt="GERD Infrastructure" className="case-image" />
                  <div className="case-image-overlay" />
                  <span className="case-location">Guba, Ethiopia</span>
                </div>
                <div className="case-content">
                  <div className="case-meta">Hydropower Support Infrastructure</div>
                  <h3 className="case-title">GERD Support Works</h3>
                  <p className="case-desc">
                    Managed high-volume rock excavation and aggregate processing. Outfitted heavy crusher machinery with tracking tools, utilizing rock waste for retaining walls and local sub-base layers.
                  </p>
                  <div className="case-stats-row">
                    <div className="case-stat-box">
                      <span className="case-stat-num">120k m³</span>
                      <span className="case-stat-label">Rock Re-engineered</span>
                    </div>
                    <div className="case-stat-box">
                      <span className="case-stat-num">Zero</span>
                      <span className="case-stat-label">Haulage Waste</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED PARTNERS (ANIMATED MARQUEE) */}
        <section className="partners-section">
          <div className="partners-eyebrow">Trusted Across Pan-African & Global Enterprise Projects</div>
          <div className="marquee-container">
            <div className="marquee-track">
              {/* Copy 1 */}
              <div className="partner-logo-item">
                <div className="partner-mark">D</div>
                <span className="partner-name">Dangote</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">AC</div>
                <span className="partner-name">Arab Contractors</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">JB</div>
                <span className="partner-name">Julius Berger</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">W</div>
                <span className="partner-name">WBHO</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">SS</div>
                <span className="partner-name">Stefanutti Stocks</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">G5</div>
                <span className="partner-name">Group Five</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">OC</div>
                <span className="partner-name">Orascom</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">BC</div>
                <span className="partner-name">Bouygues</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">LH</div>
                <span className="partner-name">LafargeHolcim</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">AV</div>
                <span className="partner-name">Aveng</span>
              </div>

              {/* Copy 2 (Seamless loop duplicate) */}
              <div className="partner-logo-item">
                <div className="partner-mark">D</div>
                <span className="partner-name">Dangote</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">AC</div>
                <span className="partner-name">Arab Contractors</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">JB</div>
                <span className="partner-name">Julius Berger</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">W</div>
                <span className="partner-name">WBHO</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">SS</div>
                <span className="partner-name">Stefanutti Stocks</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">G5</div>
                <span className="partner-name">Group Five</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">OC</div>
                <span className="partner-name">Orascom</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">BC</div>
                <span className="partner-name">Bouygues</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">LH</div>
                <span className="partner-name">LafargeHolcim</span>
              </div>
              <div className="partner-logo-item">
                <div className="partner-mark">AV</div>
                <span className="partner-name">Aveng</span>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="landing-section use-section" id="analytics">
          <div style={{textAlign: 'center'}}>
            <div className="section-eyebrow">Stakeholders We Empower</div>
            <h2 className="section-title">One platform. Every stakeholder.</h2>
            <p className="section-sub" style={{margin: '0 auto'}}>Providing end-to-end digital solutions across the full C&D waste value chain.</p>
          </div>
          <div className="use-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="use-card">
              <div className="use-icon-wrap"><Compass size={22} /></div>
              <div className="use-title">Architects & Designers</div>
              <div className="use-desc">Supporting sustainable building planning and waste-conscious design.</div>
            </div>
            <div className="use-card">
              <div className="use-icon-wrap"><HardHat size={22} /></div>
              <div className="use-title">Construction & Demolition Firms</div>
              <div className="use-desc">Driving operational efficiency, compliance, and material recovery.</div>
            </div>
            <div className="use-card">
              <div className="use-icon-wrap"><Recycle size={22} /></div>
              <div className="use-title">Recycling & Recovery Companies</div>
              <div className="use-desc">Unlocking supply intelligence and marketplace opportunities.</div>
            </div>
            <div className="use-card">
              <div className="use-icon-wrap"><Building size={22} /></div>
              <div className="use-title">Property Developers</div>
              <div className="use-desc">Improving project sustainability and reducing waste costs.</div>
            </div>
            <div className="use-card">
              <div className="use-icon-wrap"><Scale size={22} /></div>
              <div className="use-title">Government & Regulators</div>
              <div className="use-desc">Enabling digital oversight, reporting, and environmental governance.</div>
            </div>
            <div className="use-card">
              <div className="use-icon-wrap"><TrendingUp size={22} /></div>
              <div className="use-title">Infrastructure Investors & Green Funds</div>
              <div className="use-desc">Providing sustainability intelligence for responsible investment.</div>
            </div>
          </div>
        </section>

        {/* IMPACT */}
        <section className="landing-section impact-section">
          <div className="section-eyebrow">Impact Outcomes</div>
          <h2 className="section-title">What Organizations Achieve</h2>
          <div className="impact-grid">
            <div className="impact-big">
              <div>
                <div style={{fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: '16px'}}>Reduced Landfill Dependency</div>
                <div className="impact-quote">"Higher waste diversion rates through intelligent tracking and recovery optimization, transitioning from fragmented management to intelligent resource management."</div>
              </div>
              <div className="impact-author">
                <div className="author-avatar">CG</div>
                <div>
                  <div className="author-name">Waste Valorization</div>
                  <div className="author-role">Enhanced profitability through circular assets</div>
                </div>
              </div>
            </div>
            <div className="impact-stat-card">
              <div className="isc-num">ESG</div>
              <div className="isc-label">Improved scores and green certification readiness via automated reporting</div>
            </div>
            <div className="impact-stat-card">
              <div className="isc-num">ROI</div>
              <div className="isc-label">Greater recycling and circular reuse through marketplace material exchange</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="cta-section">
          <h2>Ready to close the loop?</h2>
          <p>Join 340+ sites already turning demolition waste into compliance intelligence and circular revenue.</p>
          <div className="cta-btns">
            <button className="cta-btn-white" onClick={onRequestAccess}>Request Platform Access →</button>
            <button className="cta-btn-ghost">Book a demo</button>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="landing-footer">
          <img src={footerImage} alt="" className="footer-bg" />
          <div className="footer-content">
            <div className="footer-grid">
            <div className="footer-brand">
              <div className="nav-logo">
                <div className="logo-mark">CG</div>
                <div>
                  <div className="logo-text">CG WasteData</div>
                  <div className="logo-sub">Intelligence Engine</div>
                </div>
              </div>
              <p>The smart waste intelligence platform for the green construction sector — from site skip to circular economy.</p>
              <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--lime)' }}>
                <a href="https://www.cgwastedata.co.za" style={{ color: 'inherit', textDecoration: 'none' }}>www.cgwastedata.co.za</a><br />
                <a href="mailto:waste@cgwastedata.co.za" style={{ color: 'inherit', textDecoration: 'none' }}>waste@cgwastedata.co.za</a>
              </p>
            </div>
            <div className="footer-col">
              <h4>Platform</h4>
              <ul>
                <li><a href="#">Site Tracking</a></li>
                <li><a href="#">AI Manifests</a></li>
                <li><a href="#">Compliance Dashboard</a></li>
                <li><a href="#">Marketplace</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About CG</a></li>
                <li><a href="#">Case studies</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Compliance</h4>
              <ul>
                <li><a href="#">BREEAM guide</a></li>
                <li><a href="#">Green Star SA</a></li>
                <li><a href="#">NWMS explained</a></li>
                <li><a href="#">SANS 10400</a></li>
                <li><a href="#">ISO 14001</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 CG WasteData. All rights reserved.</span>
            <div className="footer-certbadges">
              <span className="fcert">BREEAM VERIFIED</span>
              <span className="fcert">ISO 14001</span>
              <span className="fcert">GREEN STAR SA</span>
              <span className="fcert">POPIA COMPLIANT</span>
            </div>
          </div>
          </div>
        </footer>
      </div>
    </>
  );
};

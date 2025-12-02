import React, { useState, ReactNode } from 'react';
import SeoArticle from '../utils/SeoArticle';

interface ThemeLayoutProps {
  children: ReactNode;
}

const Modal: React.FC<{ title: string; content: ReactNode; onClose: () => void }> = ({ title, content, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-900/90 border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all scale-100" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gray-900/95 p-5 flex justify-between items-center border-b border-white/10 backdrop-blur-md z-10">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none transition-colors">&times;</button>
        </div>
        <div className="p-6 md:p-8 text-gray-300 leading-relaxed text-lg">
          {content}
        </div>
      </div>
    </div>
);

const ThemeLayout: React.FC<ThemeLayoutProps> = ({ children }) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const modalContent: { [key: string]: { title: string; content: ReactNode } } = {
        about: { 
            title: "About Us", 
            content: <p>Cosmic Pass is a premier, privacy-first cybersecurity tool designed to empower users with military-grade password analysis and generation. Engineered by HSINI MOHAMED, this application operates entirely client-side, ensuring that your sensitive data never leaves your device. We believe in a safer internet where robust security is accessible to everyone.</p> 
        },
        contact: { 
            title: "Contact", 
            content: (
                <div className="space-y-4">
                    <p>We value your feedback and inquiries. Whether you have security questions, feature suggestions, or business proposals, we are here to listen.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Website:</strong> <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">doodax.com</a></li>
                        <li><strong>Email:</strong> <a href="mailto:hsini.web@gmail.com" className="text-cyan-400 hover:text-cyan-300 underline">hsini.web@gmail.com</a></li>
                    </ul>
                </div>
            )
        },
        guide: { title: "The Ultimate Guide to Password Security", content: <SeoArticle /> },
        privacy: { 
            title: "Privacy Policy", 
            content: <p>Your privacy is our absolute priority. Cosmic Pass functions as a 100% client-side application. This means all password generation and strength calculations occur locally within your browser's memory using the Web Crypto API. No data is ever transmitted to external servers, cloud storage, or third-party analytics. We do not use tracking cookies or collect personally identifiable information (PII).</p> 
        },
        terms: { 
            title: "Terms of Service", 
            content: <p>By using Cosmic Pass, you agree that this tool is provided "as is" for educational and utility purposes. While we strive for cryptographic perfection, the developers (HSINI MOHAMED) cannot be held liable for any data breaches, losses, or damages arising from the use of generated passwords. Security is a shared responsibility.</p> 
        },
        dmca: { 
            title: "DMCA", 
            content: <p>We respect intellectual property rights. If you believe any content on Cosmic Pass infringes upon your copyright, please contact us immediately via the details provided in the Contact section. We are committed to resolving valid claims promptly in accordance with the Digital Millennium Copyright Act.</p> 
        }
    };

  return (
    <>
      <style>{`
        @keyframes drift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .galaxy-bg {
          background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
          position: relative;
          overflow-x: hidden;
        }
        .stars-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            pointer-events: none;
        }
        .nebula {
            position: absolute;
            top: -20%;
            left: -20%;
            width: 140%;
            height: 140%;
            background: 
                radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.2), transparent 60%),
                radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.15), transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.15), transparent 50%);
            filter: blur(60px);
            animation: drift 20s ease infinite alternate;
            z-index: 0;
        }
        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle var(--duration) ease-in-out infinite;
            opacity: 0.8;
        }
      `}</style>
      
      <div className="min-h-screen font-sans text-slate-200 galaxy-bg flex flex-col relative selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
        {/* Animated Background Layers */}
        <div className="stars-container z-0">
            <div className="nebula"></div>
            {/* Generate random stars */}
            {[...Array(50)].map((_, i) => (
                <div 
                    key={i} 
                    className="star" 
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 3 + 1}px`,
                        height: `${Math.random() * 3 + 1}px`,
                        '--duration': `${Math.random() * 3 + 2}s`
                    } as React.CSSProperties}
                />
            ))}
        </div>

        <header className="w-full p-4 border-b border-white/5 sticky top-0 bg-[#090a0f]/80 backdrop-blur-xl z-40 shadow-lg">
            <nav className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                    </div>
                    <div className="text-2xl font-bold tracking-tight">
                        <span className="text-white">Cosmic</span><span className="text-cyan-400">Pass</span>
                    </div>
                </div>
                
                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-6 text-sm font-medium">
                    {Object.keys(modalContent).map(key => (
                        <li key={key}>
                            <button 
                                onClick={() => setActiveModal(key)} 
                                className="text-gray-400 hover:text-white transition-colors uppercase tracking-wider text-xs py-2"
                            >
                                {modalContent[key].title.replace("The Ultimate ", "").split(" ")[0]}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Mobile Menu Icon */}
                <button className="md:hidden text-white" onClick={() => setActiveModal('about')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </nav>
        </header>

        <main className="flex-grow flex flex-col justify-center items-center p-4 relative z-10 w-full max-w-7xl mx-auto">
            <div className="text-center mb-10 max-w-3xl animate-fade-in-down">
                <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
                    Next Gen Security
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-white drop-shadow-sm">
                    Fortify Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Digital</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-500">Universe</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
                    Analyze vulnerability and generate unbreakable, cryptographically secure passwords in a beautiful, privacy-focused environment.
                </p>
            </div>
            {children}
        </main>

        <footer className="w-full text-center p-8 border-t border-white/5 bg-[#090a0f]/50 backdrop-blur-sm z-10">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
                 <p className="text-slate-400 text-sm">
                    &copy; {new Date().getFullYear()} Cosmic Pass. All rights reserved.
                </p>
                <p className="text-sm font-medium text-slate-300">
                    Powered by <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold">HSINI MOHAMED</a>
                </p>
                <div className="flex gap-4 text-xs text-slate-500">
                    <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-300">Privacy</button>
                    <span>&bull;</span>
                    <button onClick={() => setActiveModal('terms')} className="hover:text-slate-300">Terms</button>
                    <span>&bull;</span>
                    <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">Doodax.com</a>
                </div>
            </div>
        </footer>

        {activeModal && modalContent[activeModal] && (
            <Modal
                title={modalContent[activeModal].title}
                content={modalContent[activeModal].content}
                onClose={() => setActiveModal(null)}
            />
        )}
      </div>
    </>
  );
};

export default ThemeLayout;
import React, { useState, useEffect, useCallback } from 'react';
import { calculateStrength, generatePassword, RuleCheckResult } from '../utils/SecurityMath';

type ActiveTool = 'checker' | 'generator';

interface Strength {
  score: number;
  feedback: string;
  timeToCrack: string;
  color: string;
  width: string;
}

const Checkbox: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer group select-none">
        <div className="relative">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-5 h-5 bg-gray-800 rounded border border-gray-600 peer-checked:bg-fuchsia-500 peer-checked:border-fuchsia-500 transition-colors group-hover:border-fuchsia-400"></div>
            <svg className="absolute w-3 h-3 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden peer-checked:block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
        </div>
        <span className="text-gray-300 group-hover:text-white transition-colors">{label}</span>
    </label>
);

const PasswordTool: React.FC = () => {
    const [activeTool, setActiveTool] = useState<ActiveTool>('checker');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState<Strength | null>(null);
    const [ruleChecks, setRuleChecks] = useState<RuleCheckResult | null>(null);
    
    // Generator state
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        if (activeTool === 'checker') {
            const { strength, rules } = calculateStrength(password);
            
            let color = 'bg-gray-600';
            let width = 'w-2';

            if (password.length > 0) {
                if (strength.score < 50) { color = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'; width = 'w-1/4'; }
                else if (strength.score < 75) { color = 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]'; width = 'w-1/2'; }
                else if (strength.score < 90) { color = 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]'; width = 'w-3/4'; }
                else { color = 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]'; width = 'w-full'; }
            }

            setStrength({ ...strength, color, width });
            setRuleChecks(rules);
        }
    }, [password, activeTool]);
    
    const handleGenerate = useCallback(() => {
        const options = { length, upper: includeUppercase, lower: includeLowercase, numbers: includeNumbers, symbols: includeSymbols };
        if (!options.upper && !options.lower && !options.numbers && !options.symbols) {
            setGeneratedPassword('Select at least one character type');
            return;
        }
        setGeneratedPassword(generatePassword(options));
        setCopySuccess(false);
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

    useEffect(() => {
        if(activeTool === 'generator') {
            handleGenerate();
        }
    }, [activeTool, handleGenerate]);

    const handleCopy = () => {
        if (generatedPassword && generatedPassword !== 'Select at least one character type') {
            navigator.clipboard.writeText(generatedPassword).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };
    
    const RuleItem: React.FC<{ label: string; valid: boolean }> = ({ label, valid }) => (
        <li className={`flex items-center transition-all duration-300 ${valid ? 'text-green-400 translate-x-1' : 'text-gray-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`mr-2 h-4 w-4 transition-transform ${valid ? 'text-green-500 scale-110' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {valid ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />}
            </svg>
            {label}
        </li>
    );

    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5 animate-fade-in-down">
            <div className="flex border-b border-white/5">
                <button onClick={() => setActiveTool('checker')} className={`flex-1 p-5 text-center font-bold transition-all duration-300 text-lg tracking-wide ${activeTool === 'checker' ? 'bg-cyan-500/10 text-cyan-300 border-b-2 border-cyan-400 shadow-[inset_0_-20px_20px_-20px_rgba(6,182,212,0.2)]' : 'hover:bg-white/5 text-gray-400 border-b-2 border-transparent'}`}>
                    Strength Checker
                </button>
                <button onClick={() => setActiveTool('generator')} className={`flex-1 p-5 text-center font-bold transition-all duration-300 text-lg tracking-wide ${activeTool === 'generator' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-b-2 border-fuchsia-500 shadow-[inset_0_-20px_20px_-20px_rgba(217,70,239,0.2)]' : 'hover:bg-white/5 text-gray-400 border-b-2 border-transparent'}`}>
                    Password Generator
                </button>
            </div>

            {activeTool === 'checker' ? (
                <div className="p-6 md:p-8 space-y-8">
                    <div className="relative group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Type your password here..."
                            className="w-full bg-black/30 border border-gray-600/50 rounded-xl p-4 pr-24 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all text-xl font-medium tracking-wide shadow-inner"
                            aria-label="Password input"
                        />
                        <button 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute inset-y-0 right-0 px-4 text-gray-400 hover:text-white font-semibold text-sm uppercase tracking-wider transition-colors"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    
                    {strength && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                     <span className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Security Score</span>
                                     <span className={`text-xl font-bold ${strength.score > 75 ? 'text-green-400' : strength.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{strength.score}%</span>
                                </div>
                                <div className="bg-gray-800 rounded-full h-3 w-full overflow-hidden shadow-inner border border-gray-700">
                                    <div className={`h-full rounded-full transition-all duration-700 ease-out ${strength.color} ${strength.width}`}></div>
                                </div>
                            </div>
                            
                            <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                                <span className="block font-bold text-2xl mb-1 text-white">{strength.feedback}</span>
                                <p className="text-sm text-gray-400">Estimated time to crack: <span className="text-cyan-300 font-mono">{strength.timeToCrack}</span></p>
                            </div>
                        </div>
                    )}
                    
                    {ruleChecks && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-2 border-t border-white/5">
                            <RuleItem label="8+ Characters" valid={ruleChecks.length} />
                            <RuleItem label="Uppercase Letter" valid={ruleChecks.hasUpper} />
                            <RuleItem label="Lowercase Letter" valid={ruleChecks.hasLower} />
                            <RuleItem label="Number" valid={ruleChecks.hasNumber} />
                            <RuleItem label="Special Symbol" valid={ruleChecks.hasSymbol} />
                        </ul>
                    )}
                </div>
            ) : (
                <div className="p-6 md:p-8 space-y-8">
                    <div className="relative bg-black/30 border border-gray-600/50 rounded-xl p-4 flex items-center justify-between min-h-[64px] shadow-inner group">
                        <span className="font-mono text-xl md:text-2xl truncate pr-4 text-white tracking-wider">{generatedPassword}</span>
                        <button onClick={handleCopy} className={`bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-lg shadow-fuchsia-500/30 ${copySuccess ? 'bg-green-500 shadow-green-500/30' : ''}`}>
                            {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label htmlFor="length" className="text-gray-300 font-medium tracking-wide">Password Length</label>
                                <span className="text-2xl font-bold text-fuchsia-400 font-mono">{length}</span>
                            </div>
                            <input
                                id="length"
                                type="range"
                                min="8"
                                max="32"
                                value={length}
                                onChange={(e) => setLength(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                            <Checkbox label="Uppercase" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} />
                            <Checkbox label="Lowercase" checked={includeLowercase} onChange={() => setIncludeLowercase(!includeLowercase)} />
                            <Checkbox label="Numbers" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} />
                            <Checkbox label="Symbols" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} />
                        </div>

                        <button onClick={handleGenerate} className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all text-lg flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 active:scale-[0.98]">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin-slow" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V4a1 1 0 011-1zm10 8a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Generate Secure Password
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordTool;
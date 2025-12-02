
export interface RuleCheckResult {
  length: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

export interface StrengthResult {
  score: number; // 0-100
  feedback: string;
  timeToCrack: string;
}

const CHAR_SETS = {
  LOWER: 'abcdefghijklmnopqrstuvwxyz',
  UPPER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMBERS: '0123456789',
  SYMBOLS: '!@#$%^&*()_+-=[]{}|;:",./<>?'
};

// --- Strength Calculation Logic ---

export const calculateStrength = (password: string): { strength: StrengthResult, rules: RuleCheckResult } => {
  const rules: RuleCheckResult = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=[\]{}|;:",./<>?]/.test(password)
  };

  let characterPoolSize = 0;
  if (rules.hasLower) characterPoolSize += 26;
  if (rules.hasUpper) characterPoolSize += 26;
  if (rules.hasNumber) characterPoolSize += 10;
  if (rules.hasSymbol) characterPoolSize += 32;

  const entropy = password.length * Math.log2(characterPoolSize);
  
  if (!password || password.length === 0 || !isFinite(entropy)) {
    return {
      strength: { score: 0, feedback: 'Very Weak', timeToCrack: 'instantly' },
      rules
    };
  }

  const timeToCrack = estimateTimeToCrack(entropy);
  const score = Math.min(100, Math.floor((entropy / 128) * 100));
  let feedback = 'Very Weak';

  if (score >= 90) feedback = 'Excellent';
  else if (score >= 75) feedback = 'Strong';
  else if (score >= 50) feedback = 'Good';
  else if (score >= 25) feedback = 'Weak';
  
  return {
    strength: { score, feedback, timeToCrack },
    rules
  };
};

const estimateTimeToCrack = (entropy: number): string => {
  const GUESSES_PER_SECOND = 1_000_000_000_000; // 1 trillion guesses/sec
  const combinations = Math.pow(2, entropy);
  const seconds = combinations / (2 * GUESSES_PER_SECOND); // x2 factor for avg case

  const MINUTE = 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const MONTH = DAY * 30.44;
  const YEAR = DAY * 365.25;
  const CENTURY = YEAR * 100;

  if (seconds < 1) return 'less than a second';
  if (seconds < MINUTE) return `${Math.round(seconds)} seconds`;
  if (seconds < HOUR) return `${Math.round(seconds / MINUTE)} minutes`;
  if (seconds < DAY) return `${Math.round(seconds / HOUR)} hours`;
  if (seconds < MONTH) return `${Math.round(seconds / DAY)} days`;
  if (seconds < YEAR) return `${Math.round(seconds / MONTH)} months`;
  if (seconds < CENTURY * 10) return `${Math.round(seconds / YEAR)} years`;
  return 'trillions of years';
};


// --- Password Generation Logic ---

export interface GeneratorOptions {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
}

export const generatePassword = (options: GeneratorOptions): string => {
  const { length, upper, lower, numbers, symbols } = options;
  let charset = '';
  let requiredChars = '';

  if (upper) {
    charset += CHAR_SETS.UPPER;
    requiredChars += getRandomChar(CHAR_SETS.UPPER);
  }
  if (lower) {
    charset += CHAR_SETS.LOWER;
    requiredChars += getRandomChar(CHAR_SETS.LOWER);
  }
  if (numbers) {
    charset += CHAR_SETS.NUMBERS;
    requiredChars += getRandomChar(CHAR_SETS.NUMBERS);
  }
  if (symbols) {
    charset += CHAR_SETS.SYMBOLS;
    requiredChars += getRandomChar(CHAR_SETS.SYMBOLS);
  }

  if (charset === '') return '';

  let password = requiredChars;
  const remainingLength = length - requiredChars.length;

  for (let i = 0; i < remainingLength; i++) {
    password += getRandomChar(charset);
  }
  
  // Shuffle the password to ensure required characters are not always at the start
  return shuffleString(password);
};

const getRandomChar = (str: string): string => {
  const randomValues = new Uint32Array(1);
  window.crypto.getRandomValues(randomValues);
  return str[randomValues[0] % str.length];
};

const shuffleString = (str: string): string => {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    const j = randomValues[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
};

import { LayoutGrid, TrendingUp, Zap, Clock, Trophy, Globe } from 'lucide-react';

export interface Market {
  id: string;
  question: string;
  description: string;
  image?: string;
  volume: string;
  participants: number;
  endTime: string;
  category: string;
  status?: string;
  outcome?: string | null;
  outcomes: {
    name: string;
    probability: number;
    price: number;
  }[];
}

export interface Trader {
  rank: number;
  address: string;
  profit: string;
  volume: string;
  winRate: string;
  trades: number;
}

export const CATEGORIES = [
  { name: 'All', icon: LayoutGrid, href: '/markets?category=All' },
  { name: 'Trending', icon: TrendingUp, href: '/markets?category=Trending' },
  { name: 'Newest', icon: Zap, href: '/markets?category=Newest' },
  { name: 'Closing Soon', icon: Clock, href: '/markets?category=Closing Soon' },
  { name: 'Sports', icon: Trophy, href: '/markets?category=Sports' },
  { name: 'Politics', icon: Globe, href: '/markets?category=Politics' },
];

export const MOCK_LEADERBOARD: Trader[] = [
  { rank: 1, address: '0.0.123456', profit: '+125,430', volume: '1.2M', winRate: '68%', trades: 450 },
  { rank: 2, address: '0.0.789012', profit: '+84,200', volume: '850K', winRate: '62%', trades: 320 },
  { rank: 3, address: '0.0.345678', profit: '+62,150', volume: '540K', winRate: '59%', trades: 210 },
  { rank: 4, address: '0.0.901234', profit: '+45,800', volume: '420K', winRate: '55%', trades: 180 },
  { rank: 5, address: '0.0.567890', profit: '+38,900', volume: '380K', winRate: '64%', trades: 155 },
  { rank: 6, address: '0.0.112233', profit: '+31,200', volume: '290K', winRate: '52%', trades: 140 },
  { rank: 7, address: '0.0.445566', profit: '+28,450', volume: '250K', winRate: '57%', trades: 125 },
  { rank: 8, address: '0.0.778899', profit: '+24,100', volume: '210K', winRate: '51%', trades: 110 },
  { rank: 9, address: '0.0.334455', profit: '+19,800', volume: '180K', winRate: '49%', trades: 95 },
  { rank: 10, address: '0.0.667788', profit: '+15,600', volume: '150K', winRate: '53%', trades: 88 },
];

export const MOCK_MARKETS: Market[] = [
  {
    id: '1',
    question: 'Will Bitcoin reach $100,000 before the end of 2024?',
    description: 'This market will resolve to "Yes" if Bitcoin (BTC) reaches a price of $100,000.00 or higher at any point before December 31, 2024, 11:59 PM UTC, according to the CoinGecko BTC price index. Otherwise, this market will resolve to "No".',
    category: 'Crypto',
    volume: '2.4M',
    participants: 1240,
    endTime: 'Dec 31, 2024',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=400&fit=crop',
    outcomes: [
      { name: 'Yes', probability: 0.65, price: 0.65 },
      { name: 'No', probability: 0.35, price: 0.35 },
    ],
  },
  {
    id: '2',
    question: 'Who will win the 2024 US Presidential Election?',
    description: 'This market will resolve based on the official results of the 2024 United States Presidential Election as certified by the relevant authorities.',
    category: 'Politics',
    volume: '45.1M',
    participants: 85200,
    endTime: 'Nov 5, 2024',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&h=400&fit=crop',
    outcomes: [
      { name: 'Democratic Candidate', probability: 0.48, price: 0.48 },
      { name: 'Republican Candidate', probability: 0.52, price: 0.52 },
    ],
  },
  {
    id: '3',
    question: 'Will Ethereum transition to a fully deflationary asset in 2024?',
    description: 'This market will resolve to "Yes" if the total supply of Ethereum (ETH) at the end of 2024 is lower than the total supply at the beginning of 2024, according to ultrasound.money data. Otherwise, this market will resolve to "No".',
    category: 'Crypto',
    volume: '850K',
    participants: 850,
    endTime: 'Dec 31, 2024',
    image: 'https://images.unsplash.com/photo-1622790698141-94e30457ef12?w=400&h=400&fit=crop',
    outcomes: [
      { name: 'Yes', probability: 0.30, price: 0.30 },
      { name: 'No', probability: 0.70, price: 0.70 },
    ],
  },
  {
    id: '4',
    question: 'Will SpaceX land humans on Mars by 2026?',
    description: 'This market will resolve to "Yes" if SpaceX successfully lands at least one human on the surface of Mars before December 31, 2026, 11:59 PM UTC. Official confirmation from SpaceX or NASA will be required.',
    category: 'Science',
    volume: '1.2M',
    participants: 3400,
    endTime: 'Dec 31, 2026',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=400&fit=crop',
    outcomes: [
      { name: 'Yes', probability: 0.15, price: 0.15 },
      { name: 'No', probability: 0.85, price: 0.85 },
    ],
  },
];

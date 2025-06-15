export const productImages = [
  "https://storage.googleapis.com/hostinger-horizons-assets-prod/ea53f6ca-f251-454e-b647-f80b78099549/00cf8c331c86f5e7c19dfde84956027f.png", // Placeholder 1
  "https://storage.googleapis.com/hostinger-horizons-assets-prod/ea53f6ca-f251-454e-b647-f80b78099549/7150440ec9a6e4432404ad22e23d90d8.png", // Placeholder 2
  "https://storage.googleapis.com/hostinger-horizons-assets-prod/ea53f6ca-f251-454e-b647-f80b78099549/1f0fa3ce8a9b60945e326da9f4db923e.png", // Placeholder 3
  "https://storage.googleapis.com/hostinger-horizons-assets-prod/ea53f6ca-f251-454e-b647-f80b78099549/93b5c08c1ae9c1b935e97743ac9d0490.png"  // Placeholder 4
];

export const productData = {
  seo: [
    {
      id: 'seo1',
      name: 'Google Proxyless Parser X',
      description: 'Next-gen, undetectable Google SERP data extraction. Zero proxies, maximum speed. AI-enhanced query understanding.',
      price: 199.99,
      rating: 4.9,
      status: 'Hot Seller',
      category: 'seo',
      image: productImages[0] 
    },
    {
      id: 'seo2',
      name: 'CryoRank SEO Suite',
      description: 'All-in-one SEO powerhouse: advanced keyword research, AI-driven site audits, real-time rank tracking, and competitor analysis.',
      price: 349.99,
      rating: 4.8,
      status: 'New Release',
      category: 'seo',
      image: productImages[1]
    }
  ],
  blockchain: [
    {
      id: 'bc1',
      name: 'Solana Mempool Sniper PRO',
      description: 'Ultra-low latency mempool monitoring and transaction sniping on Solana. Customizable strategies and MEV protection.',
      price: 9.5, // Example: 9.5 SOL
      priceUnit: 'SOL',
      rating: 5.0,
      status: 'Top Tier',
      category: 'blockchain',
      image: productImages[2]
    },
    {
      id: 'bc2',
      name: 'GhostPump Elite (Rust)',
      description: 'High-performance Rust-based NonJito Bundler. Features Antisnipe/MEV, Moonshot/Raydium integration, and priority fee management.',
      price: 6.0, // Example: 6 SOL
      priceUnit: 'SOL',
      rating: 4.9,
      status: 'Popular',
      category: 'blockchain',
      image: productImages[3]
    }
  ],
  exploits: [
    {
      id: 'ex1',
      name: 'WP/CPanel Dominator Kit',
      description: 'Comprehensive toolkit for WordPress & cPanel enumeration and exploitation. Includes private 0-day database exploits.',
      price: 499.99,
      rating: 4.7,
      status: 'Limited Stock',
      category: 'exploits',
      image: productImages[0] 
    },
    {
      id: 'ex2',
      name: 'CryoIntel 0-Day Feed',
      description: 'Exclusive subscription to a continuously updated, verified feed of 0-day vulnerabilities across various platforms.',
      price: 1299.99,
      rating: 4.9,
      status: 'Private Access',
      category: 'exploits',
      image: productImages[1]
    }
  ]
};

export const serviceData = [
  { name: 'SEO Parser API', uptime: 99.98 },
  { name: 'Solana Sniper Network', uptime: 99.95 },
  { name: 'Exploit Intel DB', uptime: 100 },
  { name: 'Payment Gateway', uptime: 99.99 },
  { name: 'Client Support Portal', uptime: 99.9 }
];
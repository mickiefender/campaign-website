'use client'

import { useState, useEffect } from 'react'
import { X, Users, Calendar, MapPin, TrendingUp } from 'lucide-react'

interface Region {
  id: string
  name: string
  coverage: number
  communities: number
  events: number
  color: string
  description: string
  position: { x: number; y: number }
}

const regions: Region[] = [
  { 
    id: 'GHAF', 
    name: 'Ahafo', 
    coverage: 81, 
    communities: 167, 
    events: 26, 
    color: '#E53935',
    description: 'Strong agricultural support with focus on cocoa farming communities',
    position: { x: 28, y: 65 }
  },
  { 
    id: 'GHAH', 
    name: 'Ashanti', 
    coverage: 95, 
    communities: 312, 
    events: 48, 
    color: '#CE1126',
    description: 'Highest engagement region with vibrant youth participation',
    position: { x: 43, y: 68 }
  },
  { 
    id: 'GHBO', 
    name: 'Bono', 
    coverage: 84, 
    communities: 211, 
    events: 33, 
    color: '#D32F2F',
    description: 'Growing support in educational and healthcare initiatives',
    position: { x: 30, y: 55 }
  },
  { 
    id: 'GHBE', 
    name: 'Bono East', 
    coverage: 79, 
    communities: 145, 
    events: 23, 
    color: '#F44336',
    description: 'Emerging region with focus on rural development',
    position: { x: 43, y: 51 }
  },
  { 
    id: 'GHCP', 
    name: 'Central', 
    coverage: 88, 
    communities: 267, 
    events: 41, 
    color: '#E53935',
    description: 'Coastal region with strong tourism and fishing community support',
    position: { x: 48, y: 86 }
  },
  { 
    id: 'GHEP', 
    name: 'Eastern', 
    coverage: 82, 
    communities: 198, 
    events: 31, 
    color: '#D32F2F',
    description: 'Mountainous region with agricultural and mining community focus',
    position: { x: 58, y: 73 }
  },
  { 
    id: 'GHAA', 
    name: 'Greater Accra', 
    coverage: 98, 
    communities: 425, 
    events: 62, 
    color: '#D32F2F',
    description: 'Capital region with highest urban engagement and youth mobilization',
    position: { x: 67, y: 79 }
  },
  { 
    id: 'GHNP', 
    name: 'Northern', 
    coverage: 78, 
    communities: 156, 
    events: 24, 
    color: '#C62828',
    description: 'Major northern hub with focus on agriculture and trade',
    position: { x: 60, y: 25 }
  },
  { 
    id: 'GHNE', 
    name: 'North East', 
    coverage: 71, 
    communities: 85, 
    events: 13, 
    color: '#A71930',
    description: 'Developing region with emerging community structures',
    position: { x: 55, y: 16 }
  },
  { 
    id: 'GHOT', 
    name: 'Oti', 
    coverage: 76, 
    communities: 121, 
    events: 19, 
    color: '#C62828',
    description: 'Newly created region with growing grassroots support',
    position: { x: 68, y: 51 }
  },
  { 
    id: 'GHSV', 
    name: 'Savannah', 
    coverage: 72, 
    communities: 98, 
    events: 15, 
    color: '#B71C1C',
    description: 'Agricultural heartland with focus on food security',
    position: { x: 39, y: 32 }
  },
  { 
    id: 'GHUE', 
    name: 'Upper East', 
    coverage: 80, 
    communities: 187, 
    events: 29, 
    color: '#C62828',
    description: 'Border region with cross-community collaboration initiatives',
    position: { x: 50, y: 10 }
  },
  { 
    id: 'GHUW', 
    name: 'Upper West', 
    coverage: 75, 
    communities: 132, 
    events: 21, 
    color: '#B71C1C',
    description: 'Rural communities with traditional leadership engagement',
    position: { x: 34, y: 15 }
  },
  { 
    id: 'GHTV', 
    name: 'Volta', 
    coverage: 87, 
    communities: 289, 
    events: 44, 
    color: '#E53935',
    description: 'Eastern border region with strong educational focus',
    position: { x: 71, y: 73 }
  },
  { 
    id: 'GHWP', 
    name: 'Western', 
    coverage: 85, 
    communities: 245, 
    events: 38, 
    color: '#F44336',
    description: 'Mining and oil region with diverse economic activities',
    position: { x: 34, y: 87 }
  },
  { 
    id: 'GHWN', 
    name: 'Western North', 
    coverage: 73, 
    communities: 107, 
    events: 17, 
    color: '#B71C1C',
    description: 'Timber and cocoa region with rural development focus',
    position: { x: 25, y: 75 }
  },
]

interface StatCardProps {
  title: string
  value: string
  delay: number
  isLoaded: boolean
}

function StatCard({ title, value, delay, isLoaded }: StatCardProps) {
  return (
    <div 
      className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700 transform transition-all duration-700 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
    </div>
  )
}

export function GhanaMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleRegionClick = (region: Region) => {
    setSelectedRegion(selectedRegion?.id === region.id ? null : region)
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-200 dark:border-slate-700">
        
        {/* Stats Cards */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
          <StatCard title="Total Regions" value="16" delay={0} isLoaded={isLoaded} />
          <StatCard title="Avg. Coverage" value="83.4%" delay={0.1} isLoaded={isLoaded} />
          <StatCard title="Communities" value="3,247" delay={0.2} isLoaded={isLoaded} />
          <StatCard title="Events" value="512" delay={0.3} isLoaded={isLoaded} />
        </div>

        {/* Map Container */}
        <div className="relative w-full aspect-[4/3] bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner">
          {/* Ghana Map SVG */}
          <svg 
            viewBox="0 0 1000 1000" 
            className="w-full h-full"
            style={{ willChange: 'transform' }}
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6f9c76" />
                <stop offset="100%" stopColor="#4a7c59" />
              </linearGradient>
            </defs>
            
            {/* Base Map Background */}
            <rect width="1000" height="1000" fill="url(#mapGradient)" opacity="0.1" />
            
            {/* Ghana Outline - Simplified representation */}
            <path 
              d="M200 100 L800 100 L850 200 L900 400 L850 600 L800 800 L700 900 L500 950 L300 900 L200 800 L150 600 L100 400 L150 200 Z"
              fill="#6f9c76"
              stroke="#4a7c59"
              strokeWidth="3"
              opacity="0.3"
            />
            
            {/* Region boundaries - stylized representation */}
            <g stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.5">
              <path d="M400 100 L400 400" />
              <path d="M600 100 L600 400" />
              <path d="M200 400 L800 400" />
              <path d="M300 600 L700 600" />
              <path d="M200 800 L800 800" />
            </g>
          </svg>

          {/* Interactive Region Markers */}
          {regions.map((region, index) => (
            <div
              key={region.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${region.position.x}%`,
                top: `${region.position.y}%`,
                transitionDelay: `${index * 0.05}s`,
                willChange: 'transform',
              }}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => handleRegionClick(region)}
            >
              {/* Simplified Pulse Animation Ring */}
              {hoveredRegion === region.id && (
                <div 
                  className="absolute inset-0 rounded-full bg-red-400 animate-ping"
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    marginLeft: '-20px',
                    marginTop: '-20px',
                    opacity: 0.5,
                    willChange: 'transform, opacity',
                  }}
                />
              )}
              
              {/* Marker Dot */}
              <div 
                className={`relative w-5 h-5 rounded-full border-2 border-white shadow-lg transform transition-all duration-200 ${
                  hoveredRegion === region.id ? 'scale-125' : 'scale-100'
                } ${selectedRegion?.id === region.id ? 'ring-4 ring-yellow-400' : ''}`}
                style={{ 
                  backgroundColor: region.color,
                  boxShadow: hoveredRegion === region.id ? `0 0 15px ${region.color}` : '0 2px 8px rgba(0,0,0,0.3)',
                  willChange: 'transform',
                }}
              />
              
              {/* Region Label */}
              <div 
                className={`absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-semibold transition-all duration-200 ${
                  hoveredRegion === region.id || selectedRegion?.id === region.id
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-2'
                }`}
                style={{ willChange: 'transform, opacity' }}
              >
                <span 
                  className="px-2 py-1 rounded-md text-white shadow-md"
                  style={{ backgroundColor: region.color }}
                >
                  {region.name}
                </span>
              </div>
            </div>
          ))}

          {/* Hover Tooltip */}
          {hoveredRegion && !selectedRegion && (
            <div 
              className="absolute pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full pb-2"
              style={{
                left: `${regions.find(r => r.id === hoveredRegion)?.position.x}%`,
                top: `${regions.find(r => r.id === hoveredRegion)?.position.y}%`,
              }}
            >
              <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl text-sm whitespace-nowrap">
                <p className="font-semibold">{regions.find(r => r.id === hoveredRegion)?.name}</p>
                <p className="text-slate-300 text-xs">Click for details</p>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800" />
              </div>
            </div>
          )}
        </div>

        {/* Selected Region Detail Panel */}
        {selectedRegion && (
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 animate-fade-in-up">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedRegion.color }}
                />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {selectedRegion.name} Region
                </h3>
              </div>
              <button 
                onClick={() => setSelectedRegion(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {selectedRegion.description}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Coverage</span>
                </div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {selectedRegion.coverage}%
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Communities</span>
                </div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {selectedRegion.communities.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Events</span>
                </div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {selectedRegion.events}
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                </div>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  Active
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Info Box */}
        <div className="mt-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-l-4 border-red-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
            Interactive Regional Analysis
          </h3>
          <p className="text-slate-600 dark:text-slate-300">
            Explore the map above to discover detailed coverage statistics for each
            region. Click on any region marker to view community engagement
            metrics, campaign events, and local impact data.
          </p>
        </div>
      </div>
    </div>
  )
}

// Flag Animation Component
export function FlagAnimation() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  return (
    <div className="relative w-full h-32 overflow-hidden">
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
          isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-2xl">🇬🇭</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            Ghana
          </div>
        </div>
      </div>
    </div>
  )
}

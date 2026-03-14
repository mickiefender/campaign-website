'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Users, Newspaper, ArrowRight, BookOpen, TrendingUp, Stethoscope, Building2, Leaf, Handshake, Menu, X, Calendar, User, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import TypingName from '@/components/typing-name'
import RouteLoader from '@/components/route-loader'
import { FlagAnimation } from '@/components/svg-animations'
import { VideoModal } from '@/components/video-modal'
import { VisionModal } from '@/components/vision-modal'
import { GhanaMap } from '@/components/ghana-map'
import { AchievementTabs } from '@/components/achievement-tabs'
import { Footer } from '@/components/footer'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVision, setSelectedVision] = useState<any>(null)
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false)
const [mobileOpen, setMobileOpen] = useState(false)

  const [featuredNews, setFeaturedNews] = useState<any[]>([])
  const [newsLoading, setNewsLoading] = useState(true)

  const visionData = [
    {
      id: 1,
      title: 'Leadership Restoration',
      desc: 'Restore Leadership that is disciplined, and politically matured.',
      icon: <BookOpen className="text-white" size={24} />,
      color: 'bg-purple-500',
      details: 'We believe in restoring Ghanaian leadership by providing opportunities for young people to learn and grow, and for experienced leaders to find their place in the political arena.'
    },
    {
      id: 2,
      title: 'Firm and Decisive Leadership',
      desc: 'Provide firm and decisive leadership characterized by consultation and engagement.',
      icon: <TrendingUp className="text-white" size={24} />,
      color: 'bg-red-500',
      details: 'Our vision is to provide firm and decisive leadership that is characterized by consultation and engagement with all stakeholders. We will ensure that our leaders are accountable, transparent, and responsive to the needs of the people.'
    },
    {
      id: 3,
      title: 'Good Decisions',
      desc: 'Ensure that all decisions are based on research an sound judgement.',
      icon: <Newspaper className="text-white" size={24} />,
      color: 'bg-cyan-500',
      details: 'Our vision is to ensure that all decisions are based on research and sound judgement. We will invest in data collection and analysis, and we will ensure that our leaders have access to the information they need to make informed decisions.'
    },
    {
      id: 4,
      title: 'Leader That Create Enabling Environment',
      desc: 'Provide Leadership that create enabling environment for all executive officers whether elected or appointed to play their roles. ',
      icon: <Users className="text-white" size={24} />,
      color: 'bg-yellow-500',
      details: 'We believe in providing leadership that creates an enabling environment for all executive officers, whether elected or appointed, to play their roles effectively. We will ensure that our leaders have the resources and support they need to make a difference.'
    },
    {
      id: 5,
      title: 'Leader That is in Touch with the People',
      desc: 'Provide Leadership that is in touch with the people by visiting all the constituencies across the length and breadth of this country and not be an armchair General Secretary.',
      icon: <Leaf className="text-white" size={24} />,
      color: 'bg-green-500',
      details: 'We will provide leadership that is in touch with the people by visiting all the constituencies across the length and breadth of this country and not be an armchair General Secretary. We will ensure that our leaders are accessible and responsive to the needs of the people.'
    },
    {
      id: 6,
      title: 'Leader That Prioritizes the Welfare of Party Members',
      desc: 'Provide Leadership that prioritizes the welfare of party members. This can be achieved through the comprehensive implementation of the policies such as the Business Incubation Fund; The Human Resource Empowerment Program; Rebust Welfare Fund for party members; Support to Former Executive Memebers; Support to Incumbent Executive Members; TESCON Secretariats and External Branch Secretariats. ',
      icon: <Handshake className="text-white" size={24} />,
      color: 'bg-pink-500',
      details: 'We will provide leadership that prioritizes the welfare of party members. This can be achieved through the comprehensive implementation of policies such as the Business Incubation Fund, the Human Resource Empowerment Program, a robust Welfare Fund for party members, support to former executive members, support to incumbent executive members, TESCON secretariats, and external branch secretariats.'
    },
  ]

  const handleVisionClick = (vision: any) => {
    setSelectedVision(vision)
    setIsVisionModalOpen(true)
  }

useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleStop = () => setIsLoading(false)

    // Simulate route changes for demo - in production use Next.js router events
    window.addEventListener('beforeunload', handleStart)
    return () => window.removeEventListener('beforeunload', handleStart)
  }, [])

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        setNewsLoading(true)
        const response = await fetch('/api/news?featured=true&limit=6')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setFeaturedNews(data.news || [])
      } catch (error) {
        console.error('News fetch error:', error)
        setFeaturedNews([])
      } finally {
        setNewsLoading(false)
      }
    }

    fetchFeaturedNews()
  }, [])

  return (
    <div className="w-full">
      {/* Scrolling Marquee - Before Header */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600 text-white py-1 overflow-hidden">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .marquee-text {
            animation: marquee 20s linear infinite;
            white-space: nowrap;
          }
        `}</style>
        <div className="marquee-text">
          <span className="text-sm md:text-base font-bold mx-8">
           Rebuilding to restore the main love !!!•       Rebuilding to restore the main love!!! •    Rebuilding to restore the main love!!! •    Rebuilding to restore the main love!!!
          </span>
        </div>
      </div>
      
      {isLoading && <RouteLoader />}
      
      {/* Video Modal - Displays on page load and every refresh */}
      <VideoModal 
        videoUrl="/compressed-2EgY30rG.mp4"
        title="Dr. Charles Dwamena's Campaign Message"
      />

      
      {/* Header - Fixed Above Everything */}
<header className="fixed top-[34px] md:top-[42px] left-0 right-0 z-50 
bg-gradient-to-b  
backdrop-blur-md 
py-3 px-4 md:py-4">

  <div className="max-w-7xl mx-auto flex items-center justify-between">

    {/* Logo */}
    <div className="flex items-center">
      <Image
        src="/image/campaign-logo1.png"
        alt="Dr Dwamena Logo"
        width={150}
        height={50}
        className="object-contain"
        priority
      />
    </div>

    {/* Mobile GS-2028 Badge */}
    <div className="sm:hidden flex items-center gap-0.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
      <span className="text-red-600 font-extrabold text-sm">General Secretary</span>
      <span className="text-gray-400 text-sm">-</span>
      <span className="text-blue-600 font-extrabold text-sm">2026</span>
    </div>

    {/* Desktop Nav */}
    <nav className="hidden sm:flex items-center gap-4 md:gap-8">
      <Link href="/" className="text-blue-900 text-sm md:text-base hover:text-primary transition duration-300 font-medium">Home</Link>
      <Link href="#about" className="text-blue-900 text-sm md:text-base hover:text-primary transition duration-300 font-medium">About</Link>
      <Link href="#vision" className="text-blue-900 text-sm md:text-base hover:text-primary transition duration-300 font-medium">Vision</Link>
      <Link href="/contact" className="text-blue-900 text-sm md:text-base hover:text-primary transition duration-300 font-medium">Contact</Link>
    </nav>

    {/* Mobile Hamburger */}
    <button
      onClick={() => setMobileOpen(!mobileOpen)}
      className="sm:hidden text-blue-900"
      aria-label="Toggle menu"
    >
      {mobileOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  </div>

  {/* Mobile Menu Dropdown */}
  <div
    className={`sm:hidden overflow-hidden transition-all duration-300 ${
      mobileOpen ? 'max-h-96 mt-4' : 'max-h-0'
    }`}
  >
    <div className="bg-black/80 backdrop-blur-xl rounded-xl p-4 flex flex-col gap-4">

      <Link
        href="/"
        onClick={() => setMobileOpen(false)}
        className="text-white font-medium hover:text-primary transition"
      >
        Home
      </Link>

      <Link
        href="#about"
        onClick={() => setMobileOpen(false)}
        className="text-white font-medium hover:text-primary transition"
      >
        About
      </Link>

      <Link
        href="#vision"
        onClick={() => setMobileOpen(false)}
        className="text-white font-medium hover:text-primary transition"
      >
        Vision
      </Link>

      <Link
        href="/contact"
        onClick={() => setMobileOpen(false)}
        className="text-white font-medium hover:text-primary transition"
      >
        Contact
      </Link>

    </div>
  </div>
</header>
     
     {/* Hero Section — Clean White Background */}
<section className="relative pt-32 md:pt-36 min-h-screen flex items-center overflow-hidden bg-white">

  {/* Optional subtle gradient */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 via-white to-white" />

  {/* Embedded Card Styles */}
  <style>{`
    .contestant-card {
      width: clamp(350px, 40vw, 520px);
      height: clamp(450px, 60vw, 650px);
      background: #ac8da6;
      position: relative;
      display: flex;
      place-content: center;
      place-items: center;
      overflow: hidden;
      border-radius: 24px;
      animation: bounce-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      transition: transform 0.4s ease;
      box-shadow: 0 25px 60px rgba(0,0,0,0.12);
    }

    .contestant-card::before {
      content: '';
      position: absolute;
      width: 110px;
      height: 180%;
      background-image: linear-gradient(
        180deg,
        rgb(0, 183, 255),
        rgb(237, 21, 21)
      );
      animation: rotBGimg 4s linear infinite;
    }

    @keyframes rotBGimg {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .contestant-card::after {
      content: '';
      position: absolute;
      background: #000000;
      inset: 6px;
      border-radius: 18px;
    }

    .contestant-card-image {
      z-index: 1;
      position: relative;
      width: calc(100% - 14px);
      height: calc(100% - 14px);
      border-radius: 16px;
      overflow: hidden;
    }

    .contestant-card:hover {
      transform: scale(1.05);
    }

    @keyframes bounce-in {
      0% { transform: scale(0.8); opacity: 0; }
      60% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1); }
    }
  `}</style>

  {/* Hero Content */}
  <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16">

      {/* LEFT SIDE */}
      <div className="lg:w-1/2 text-center lg:text-left text-gray-900 animate-fade-in-up">

        <TypingName />

        {/* Campaign Badge */}
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
          <span className="text-sm md:text-base font-bold">
            <span className="text-red-600">FOR NPP</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-blue-600">GENERAL SECRETARY-2026</span>
          </span>
        </div>

        {/* Donation CTA */}
        <div className="mt-8 p-6 rounded-xl bg-white border border-gray-200 shadow-lg">
          <p className="text-gray-900 font-semibold mb-2">Support Our Vision</p>

          <p className="text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text mb-3">
            Dial <span className="font-mono">*713*2028#</span> to Donate
          </p>

          <p className="text-sm text-gray-600">
            Every contribution empowers our movement for national transformation
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link
              href="/donate"
              className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-black active:scale-95 transition-all duration-300 w-full sm:w-auto text-center"
            >
              Donate Now
            </Link>

            
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:w-1/2 flex justify-center lg:justify-end relative">

        {/* Soft glow */}
        <div className="absolute -z-10 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full" />

        <div className="contestant-card">
          <div className="contestant-card-image">
            <Image
              src="/image/Dr.China white shirt.png"
              alt="Dr. Charles Dwamena"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

      <section className="relative py-20 px-4 -translate-y">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center">

     

      {/* Join Team Card */}
      <div className="bg-red-600 text-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition group">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow group-hover:bg-white/40 transition">
          <Users className="text-white group-hover:scale-110 transition" size={28} />
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-3 text-center">Join Our Team</h3>
        <p className="text-sm md:text-base mb-6 text-center">
          Become a volunteer and be part of this historic movement. Your skills and passion can transform communities.
        </p>
        <div className="text-center">
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition group"
          >
            Volunteer <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>

      {/* Stay Informed Card */}
      <div className="bg-blue-500 text-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition group">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow group-hover:bg-white/40 transition">
          <Newspaper className="text-white group-hover:scale-110 transition" size={28} />
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-3 text-center">Send Message</h3>
        <p className="text-sm md:text-base mb-6 text-center">
          Have questions or want to share your ideas? Send us a message and let's start a conversation about our future.
        </p>
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition group"
          >
            Send Message <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* About Section - Modern Design */}
      <section id='about' className="relative py-20 px-4 overflow-hidden bg-white">
        <style>{`
          .circular-main {
            width: clamp(280px, 35vw, 400px);
            height: clamp(280px, 35vw, 400px);
            border-radius: 50%;
            overflow: hidden;
            position: relative;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            animation: float 3s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          .circular-secondary {
            width: clamp(150px, 18vw, 200px);
            height: clamp(150px, 18vw, 200px);
            border-radius: 50%;
            overflow: hidden;
            position: absolute;
            bottom: -20px;
            right: -20px;
            background: #0891b2;
            box-shadow: 0 10px 30px rgba(8, 145, 178, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          .circular-profile {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            overflow: hidden;
            background: #0891b2;
            border: 4px solid white;
            box-shadow: 0 8px 20px rgba(8, 145, 178, 0.25);
            margin-top: 12px;
          }

          .curve-accent {
            position: absolute;
            opacity: 0.6;
          }

          .curve-top {
            top: -20px;
            right: 50px;
            width: 80px;
            height: 80px;
            border: 3px solid #f87171;
            border-radius: 0 0 100% 0;
          }

          .curve-bottom {
            bottom: 50px;
            left: 20px;
            width: 60px;
            height: 60px;
            border: 2px solid #0891b2;
            border-radius: 100% 0 0 0;
          }
        `}</style>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left - Images Section */}
            <div className="relative h-96 md:h-full flex items-center justify-center animate-fade-in-left">
              
              {/* Main circular image */}
              <div className="circular-main relative">
                <Image
                  src="/image/main-flyer.JPG"
                  alt="Dr. Charles Dwamena"
                  fill
                  className="object-cover"
                />
                
               
              </div>
            </div>

            {/* Right - Content Section */}
            <div className="animate-fade-in-right">
              <p className="text-sm font-semibold text-red-500 mb-3 tracking-wide">ABOUT </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight text-balance">
                Transforming Ghana Through Visionary Leadership
              </h2>
              
              <div className="space-y-4 mb-8">
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Dr. Charles Dwamena is a visionary leader with decades of experience in public service, an aluminary in Finance and Administration. Born and raised in Ghana, he understands the unique challenges facing our nation and is committed to delivering real solutions.
                </p>
              </div>

              {/* Achievement Tabs */}
              <div className="mb-8">
                <AchievementTabs />
              </div>

              {/* CTA Button */}
              <Link
                href="/vision"
                className="inline-block px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => setIsLoading(true)}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* Vision Section - Premium Layout */}
      <section id='vision' className="max-w-7xl mx-auto px-4 py-16 md:py-24 bg-white">
        <style>{`
          .vision-icon-circle {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: bold;
            color: white;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .vision-icon-red {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          }

          .vision-icon-blue {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          }

          .vision-card {
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 24px;
            background: white;
            border: none;
            position: relative;
            overflow: hidden;
          }

          .vision-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            border-radius: 24px;
            transition: all 0.3s ease;
          }

          .vision-card:hover {
            transform: translateX(8px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          }
        `}</style>

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Vision for Ghana
          </h2>
          <p className="text-center text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Dr. Charles Dwamena seeks the office of General Secretary so as to:
          </p>
        </div>

        {/* Main Vision Layout - Image Left, Cards Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Side - Image */}
          <div className="flex justify-center animate-fade-in-left">
            <div className="relative w-full max-w-sm">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/image/Dr and Bawumia.JPG"
                  alt="Dr. Charles Dwamena Vision"
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Right Side - Vision Cards */}
          <div className="space-y-4 animate-fade-in-right">
            {visionData.map((vision, idx) => (
              <div
                key={vision.id}
                onClick={() => handleVisionClick(vision)}
                className="vision-card p-5 md:p-6 group"
                style={{
                  background: 'white',
                  '--card-color': idx % 2 === 0 ? '#ef4444' : '#3b82f6',
                  animationDelay: `${idx * 0.1}s`,
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                } as React.CSSProperties}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: idx % 2 === 0 ? '#ef4444' : '#3b82f6',
                  borderRadius: '24px 24px 0 0'
                }}></div>
                <div className="flex items-start gap-4 pt-1">
                  {/* Icon Circle */}
                  <div
                    className={`vision-icon-circle flex-shrink-0 mt-1 ${
                      idx % 2 === 0 ? 'vision-icon-red' : 'vision-icon-blue'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition">
                      {vision.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-800 transition">
                      {vision.desc}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <ArrowRight
                    size={20}
                    className="text-gray-400 flex-shrink-0 mt-1 group-hover:text-red-500 group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Modal */}
      <VisionModal 
        isOpen={isVisionModalOpen} 
        onClose={() => setIsVisionModalOpen(false)} 
        vision={selectedVision} 
      />

      {/* Blog Section - Latest News About Dr. Charles Dwamena */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold text-red-500 mb-3 tracking-wide">LATEST NEWS</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              News & Updates
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Stay updated with the latest news, events, and announcements from Dr. Charles Dwamena's campaign
            </p>
          </div>

{/* Dynamic Featured News from Admin */}
            <div className="grid grid-cols-1 md:flex md:flex-nowrap md:overflow-x-auto md:gap-8 lg:gap-8 pb-4 md:pb-8 -mr-4 md:-mr-6 lg:-mr-8 scrollbar-thin md:scrollbar-thin scrollbar-thumb-gray-400 md:scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-600">

              {newsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-card border border-border rounded-lg p-6">
                    <div className="h-40 bg-muted rounded-md mb-4"></div>
                    <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between text-sm">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                ))
              ) : featuredNews.length > 0 ? (
                featuredNews.map((article: any) => (
                  <article key={article.id} className="group bg-card border border-border hover:border-accent rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex-shrink-0 w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2.66rem)] min-w-0 md:min-h-[400px]">

                    <div className="relative h-48 lg:h-52 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 overflow-hidden">
                      {article.featured_image_url ? (
                        <Image
                          src={article.featured_image_url}
                          alt={article.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : null}
                    </div>
                    <div className="p-6">
                      {article.category && (
                        <Badge 
                          className="mb-3"
                          style={{ backgroundColor: article.category.color || '#dc2626' }}
                        >
                          {article.category.name}
                        </Badge>
                      )}
                      <h3 className="font-bold text-lg md:text-xl mb-3 line-clamp-2 group-hover:text-foreground transition">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(article.published_at || article.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {article.author_name}
                        </span>
                      </div>
                      <Link
                        href={`/news/${article.slug}`}
                        className="inline-flex items-center gap-1 text-accent font-semibold hover:text-accent-foreground text-sm group-hover:translate-x-1 transition-all"
                      >
                        Read More <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-500">No featured news yet. Publish from admin dashboard.</p>
                  <Link href="/news" className="mt-4 inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold">
                    View All News <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </div>

          {/* View All Button */}
          <div className="text-center mt-10 md:mt-12">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 hover:bg-red-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All News
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ghana Map Section */}
     {/* Nationwide Campaign Coverage Section */}
<section className="relative py-20 px-4 overflow-hidden">

  {/* Blurry Background Image */}
  <div className="absolute inset-0 -z-10">
    <Image
      src="/image/Dr.Dwamena-Black outfit.jpg"
      alt="Campaign Background"
      fill
      className="object-cover blur-2xl scale-110 brightness-75"
      priority
    />
  </div>

  {/* Soft Dark Overlay For Text Readability */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

  <div className="relative z-10 max-w-7xl mx-auto">

    {/* Section Header */}
    <div className="text-center mb-12 md:mb-16 px-2">
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
        Nationwide Campaign Coverage
      </h2>
      <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto">
        Our comprehensive campaign strategy has established a strong presence
        across all 16 regions of Ghana. Through grassroots engagement,
        community events, and local partnerships, we're building a movement
        that represents every Ghanaian.
      </p>
    </div>

    {/* Ghana Map */}
    <div className="mb-16">
      <GhanaMap />
    </div>

    {/* Campaign Statistics */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      {/* Card 1 */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/20 transition transform hover:-translate-y-2 hover:shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-red-400">16</span>
          </div>
          <div>
            <p className="text-sm text-white/70">Regions Covered</p>
            <p className="text-sm font-semibold text-white">100% National Reach</p>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/20 transition transform hover:-translate-y-2 hover:shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-400">3K+</span>
          </div>
          <div>
            <p className="text-sm text-white/70">Communities</p>
            <p className="text-sm font-semibold text-white">Direct Engagement</p>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/20 transition transform hover:-translate-y-2 hover:shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-green-400">480+</span>
          </div>
          <div>
            <p className="text-sm text-white/70">Campaign Events</p>
            <p className="text-sm font-semibold text-white">Nationwide Presence</p>
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/20 transition transform hover:-translate-y-2 hover:shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-yellow-400">83%</span>
          </div>
          <div>
            <p className="text-sm text-white/70">Average Coverage</p>
            <p className="text-sm font-semibold text-white">Strong Regional Support</p>
          </div>
        </div>
      </div>

    </div>

    {/* Bottom Info Box */}
    <div className="mt-12 bg-white/10 backdrop-blur-xl border-l-4 border-red-500 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-3">
        Interactive Regional Analysis
      </h3>
      <p className="text-white/80">
        Explore the map above to discover detailed coverage statistics for each
        region. Click on any region marker to view community engagement
        metrics, campaign events, and local impact data.
      </p>
    </div>

  </div>
</section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

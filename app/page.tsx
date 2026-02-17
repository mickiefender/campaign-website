'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Users, Newspaper, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import TypingName from '@/components/typing-name'
import RouteLoader from '@/components/route-loader'
import { FlagAnimation, GhanaMap } from '@/components/svg-animations'
import { VideoModal } from '@/components/video-modal'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleStop = () => setIsLoading(false)

    // Simulate route changes for demo - in production use Next.js router events
    window.addEventListener('beforeunload', handleStart)
    return () => window.removeEventListener('beforeunload', handleStart)
  }, [])

  return (
    <div className="w-full">
      {isLoading && <RouteLoader />}
      
      {/* Video Modal - Displays on page load and every refresh */}
      <VideoModal 
        videoUrl="/compressed-2EgY30rG.mp4"
        title="Dr. Charles Dwamena's Campaign Message"
      />

      {/* Header - Fixed Above Everything */}
      <header className="fixed top-0 left-0 right-0 z-50 
bg-gradient-to-b  
backdrop-blur-md 
py-4 px-4 md:py-5">

        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-white font-bold text-xl md:text-2xl tracking-wider">Dr.Dwamena</div>
          <nav className="hidden sm:flex items-center gap-4 md:gap-8">
            <Link href="#" className="text-white text-sm md:text-base hover:text-primary transition duration-300 font-medium">Home</Link>
            <Link href="#" className="text-white text-sm md:text-base hover:text-primary transition duration-300 font-medium">About</Link>
            <Link href="#" className="text-white text-sm md:text-base hover:text-primary transition duration-300 font-medium">Vision</Link>
            <Link href="#" className="text-white text-sm md:text-base hover:text-primary transition duration-300 font-medium">Contact</Link>
          </nav>
          <button className="sm:hidden text-white text-2xl font-light">☰</button>
        </div>
      </header>

      {/* Hero Section with Flag Background */}
      {/* Hero Section with Flag Background */}
<section className="relative pt-24 min-h-screen flex items-center overflow-hidden">

  {/* Background */}
  <div className="absolute inset-0 z-0">
    <Image
      src="/gif/flag_gif.gif"
      alt="NPP Flag Background"
      fill
      className="object-cover blur-md scale-110"
      priority
    />
    <div className="absolute inset-0 bg-black/30" />
  </div>

  {/* Embedded Styles */}
  <style>{`
    .contestant-card {
      width: clamp(350px, 40vw, 520px);
      height: clamp(450px, 60vw, 650px);
      background: #ffffff;
      position: relative;
      display: flex;
      place-content: center;
      place-items: center;
      overflow: hidden;
      border-radius: 24px;
      animation: bounce-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      transition: transform 0.4s ease;
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
      background: #07182E;
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

      {/* LEFT SIDE - TEXT */}
      <div className="lg:w-1/2 text-center lg:text-left text-white animate-fade-in-up">

        <TypingName />

        {/* NPP Campaign Badge */}
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-red-600/30 to-blue-600/30 border border-red-500/50 backdrop-blur-sm mb-6">
          <span className="text-sm md:text-base font-bold">
            <span className="text-red-400">FOR NPP</span>
            <span className="text-white mx-2">•</span>
            <span className="text-blue-400">GENERAL SECRETARY</span>
          </span>
        </div>


       


        {/* Donation CTA */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-red-600/20 to-blue-600/20 border-2 border-red-500/50 backdrop-blur-sm">
          <p className="text-white font-semibold mb-2">Support Our Vision</p>
          <p className="text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text mb-3">
            Dial <span className="font-mono">*713*2028#</span> to Donate
          </p>
          <p className="text-sm text-white/80">Every contribution empowers our movement for national transformation</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mt-8">

        </div>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="lg:w-1/2 flex justify-center lg:justify-end relative">

        {/* Glow Effect */}
        <div className="absolute -z-10 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full"></div>

        <div className="contestant-card">
          <div className="contestant-card-image">
            <Image
              src="/image/Dr.Dwamena grey outfit.jpg"
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


      {/* Support Cards Section - Removed Background Image */}
      <section className="relative py-20 -translate-y-24 px-4">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Donate Card */}
            <div className="animate-slide-in-left bg-blue-800/20 
backdrop-blur-xl 
border border-white/10
 rounded-xl p-6 md:p-8 border-2 border-primary/30 hover:border-primary transition text-center backdrop-blur-sm transform hover:-translate-y-2 hover:shadow-2xl group" style={{ animationDelay: '0s', animationFillMode: 'both' }}>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow group-hover:bg-primary/40 transition">
                <Heart className="text-primary group-hover:scale-110 transition" size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Donate</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">Support Dr. Charles Dwamena's vision for Ghana. Every contribution counts towards building a better future.</p>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition group"
                onClick={() => setIsLoading(true)}
              >
                Donate Now <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>

            {/* Join Team Card */}
            <div className="animate-zoom-in 
bg-red-800/20 
backdrop-blur-xl 
rounded-xl 
p-6 md:p-8 
border border-white/10 
shadow-lg shadow-blue-900/20 
hover:shadow-blue-500/30 
transition 
text-center 
transform hover:-translate-y-2 hover:shadow-2xl 
group"
 style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow group-hover:bg-accent/40 transition">
                <Users className="text-accent group-hover:scale-110 transition" size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Join Our Team</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">Become a volunteer and be part of this historic movement. Your skills and passion can transform communities.</p>
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition group"
                onClick={() => setIsLoading(true)}
              >
                Volunteer <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>

            {/* Stay Informed Card */}
            <div className="animate-slide-in-right bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 md:p-8 border-2 border-primary/30 hover:border-primary transition text-center backdrop-blur-sm transform hover:-translate-y-2 hover:shadow-2xl group" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow group-hover:bg-primary/40 transition">
                <Newspaper className="text-primary group-hover:scale-110 transition" size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Stay Informed</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">Keep up with the latest news, updates, and announcements from the campaign trail.</p>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition group"
                onClick={() => setIsLoading(true)}
              >
                Read News <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contestant Bio Section */}
      <section className="relative bg-secondary text-secondary-foreground py-20 px-4 overflow-hidden">
        {/* Blurred Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/image/Dr.Dwamena-Black outfit.jpg"
            alt="Background"
            fill
            className="object-cover blur-2xl scale-110 opacity-20"
          />
        </div>
        {/* Blurred Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/15 via-black/30 to-red-500/15 blur-xl opacity-60" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-secondary/80 via-secondary/70 to-secondary/90" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="animate-fade-in-left bg-secondary/70 backdrop-blur-md rounded-xl p-6 md:p-0 md:bg-transparent md:backdrop-blur-none">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-down-fade">About Dr. Charles Dwamena</h2>
              <div className="space-y-4 text-base md:text-lg leading-relaxed">
                <p className="animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                  Dr. Charles Dwamena is a visionary leader with decades of experience in public service, education, and economic development. Born and raised in Ghana, he understands the unique challenges facing our nation.
                </p>
                <p className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                  With a doctorate in Economics and a proven track record of transformative leadership, Dr. Dwamena has dedicated his life to creating opportunities for all Ghanaians. His vision centers on sustainable development, quality education, healthcare accessibility, and economic prosperity.
                </p>
                <p className="animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                  As the New Patriotic Party's candidate, he brings integrity, innovation, and inclusive governance to the forefront of his campaign. Dr. Dwamena believes that Ghana's greatest resource is its people, and together, we can build a nation where every citizen has the opportunity to thrive.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                  <div className="text-3xl font-bold text-primary">30+</div>
                  <p className="text-sm">Years of Experience</p>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <p className="text-sm">Community Projects</p>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                  <div className="text-3xl font-bold text-primary">100K+</div>
                  <p className="text-sm">Lives Impacted</p>
                </div>
              </div>
            </div>
            <div className="relative h-72 md:h-96 rounded-xl overflow-hidden shadow-2xl animate-slide-in-right">
              <Image
                src="/image/Dr.Dwamena_image.png"
                alt="Dr. Charles Dwamena"
                fill
                className="object-cover transform hover:scale-110 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>



      {/* Vision Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 animate-expand-width">Our Vision for Ghana</h2>
        <p className="text-center text-muted-foreground text-base md:text-lg mb-12 max-w-3xl mx-auto animate-fade-in-up px-2" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          Dr. Charles Dwamena's vision encompasses six pillars that will transform Ghana into a beacon of progress and prosperity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: 'Quality Education', desc: 'Ensuring every child has access to world-class education and skills training.' },
            { title: 'Economic Growth', desc: 'Creating jobs and supporting entrepreneurship across all sectors.' },
            { title: 'Healthcare for All', desc: 'Building accessible, affordable, and quality healthcare services.' },
            { title: 'Infrastructure', desc: 'Developing roads, electricity, water, and digital infrastructure nationwide.' },
            { title: 'Environmental Care', desc: 'Protecting our environment while pursuing sustainable development.' },
            { title: 'Social Cohesion', desc: 'Building unity, peace, and mutual respect across all communities.' },
          ].map((pillar, idx) => (
            <div 
              key={idx} 
              className="animate-bounce-in bg-card rounded-xl p-8 border border-border hover:border-primary transition transform hover:-translate-y-2 hover:shadow-2xl group"
              style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition">
                <span className="text-primary font-bold text-lg">{idx + 1}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition">{pillar.title}</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <Link
            href="/vision"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition transform hover:scale-105"
            onClick={() => setIsLoading(true)}
          >
            Learn More <ArrowRight size={18} />
          </Link>
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

      {/* Final CTA Section */}
      <section className="section-animate bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in-up">Join the Movement</h2>
          <p className="text-lg mb-12 text-primary-foreground/90 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            Together, we can build a Ghana where opportunity, prosperity, and peace are within reach for all citizens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <Link
              href="/donate"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition transform hover:scale-105"
              onClick={() => setIsLoading(true)}
            >
              Contribute Now
            </Link>
            <Link
              href="/volunteer"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105"
              onClick={() => setIsLoading(true)}
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

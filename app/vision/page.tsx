import { BookOpen, Briefcase, Leaf, Heart, Home, Users } from 'lucide-react'

export default function Vision() {
  const pillars = [
    {
      icon: BookOpen,
      title: 'Quality Education',
      description: 'Provide free quality education from primary to tertiary level. Improve teacher training and school infrastructure across all regions.',
      points: ['Free primary & secondary education', 'Modern STEM facilities', 'Digital learning platforms', 'Teacher capacity building'],
    },
    {
      icon: Briefcase,
      title: 'Economic Development',
      description: 'Create sustainable jobs and support SMEs to drive economic growth and reduce unemployment.',
      points: ['1 million new jobs', 'SME support programs', 'Tech hub development', 'Agricultural modernization'],
    },
    {
      icon: Heart,
      title: 'Healthcare Excellence',
      description: 'Ensure accessible, affordable healthcare for every Ghanaian through improved facilities and services.',
      points: ['Universal healthcare', 'Modern facilities', 'Preventive care focus', 'Medical research funding'],
    },
    {
      icon: Home,
      title: 'Housing & Infrastructure',
      description: 'Develop affordable housing and world-class infrastructure to support urban and rural development.',
      points: ['Affordable housing units', 'Road network expansion', 'Digital infrastructure', 'Water systems upgrade'],
    },
    {
      icon: Leaf,
      title: 'Environmental Care',
      description: 'Protect Ghana\'s environment and natural resources for future generations through sustainable practices.',
      points: ['Renewable energy', 'Reforestation programs', 'Waste management', 'Coastal protection'],
    },
    {
      icon: Users,
      title: 'Social Cohesion',
      description: 'Build a unified Ghana where every citizen feels valued and protected, regardless of background.',
      points: ['Anti-discrimination laws', 'Community programs', 'Youth empowerment', 'Women\'s rights'],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

     {/* Hero Section */}
<section className="relative max-w-7xl mx-auto px-4 py-24 overflow-hidden rounded-2xl">

  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src="/image/All flags.png" // 🔥 replace with your image
      alt="Our Vision for Ghana"
      className="w-full h-full object-cover"
    />
    {/* Overlay for readability */}
    <div className="absolute inset-0 bg-black/55"></div>
  </div>

  {/* Content */}
  <div className="relative text-center z-10">
    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white text-balance">
      Our Vision for Ghana
    </h1>

    <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-4xl mx-auto font-medium">
      A prosperous, inclusive Ghana where every citizen has access to quality education, healthcare, and economic opportunities.
    </p>

    <p className="text-lg text-white/80 max-w-3xl mx-auto">
      A nation built on justice, integrity, and shared prosperity.
    </p>
  </div>
</section>


      {/* Vision Statement */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-200">
        <div className="bg-gradient-to-r from-red-50 to-blue-50 border-2 border-red-200 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
            Our Promise to Ghana
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">
            By 2030, Ghana will be an upper-middle-income country with a robust diversified economy, quality universal education and healthcare, world-class infrastructure, and a united, peaceful society where every citizen has the opportunity to thrive. The New Patriotic Party commits to transparent governance, evidence-based policymaking, and accountability at every level.
          </p>
        </div>
      </section>

      {/* Six Pillars */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-gray-200">
        <h2 className="text-4xl font-bold mb-16 text-center text-gray-900">Six Pillars of Our Vision</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => {
            const isRed = i % 2 === 0;
            const bgColor = isRed ? 'from-red-50 to-red-100' : 'from-blue-50 to-blue-100';
            const iconColor = isRed ? 'text-red-600' : 'text-blue-600';
            const borderColor = isRed ? 'border-red-200' : 'border-blue-200';
            const bulletColor = isRed ? 'bg-red-500' : 'bg-blue-500';
            return (
              <div key={i} className={`bg-gradient-to-br ${bgColor} border-2 ${borderColor} rounded-2xl p-8 hover:shadow-lg transition transform hover:-translate-y-2`}>
                <div className={`${isRed ? 'bg-red-100' : 'bg-blue-100'} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
                  <pillar.icon className={`${iconColor}`} size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{pillar.title}</h3>
                <p className="text-gray-700 mb-6">{pillar.description}</p>
                <ul className="space-y-3 text-sm">
                  {pillar.points.map((point, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span className={`w-2 h-2 ${bulletColor} rounded-full flex-shrink-0`}></span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-gray-200">
        <h2 className="text-4xl font-bold mb-16 text-center text-gray-900">Implementation Timeline</h2>
        <div className="space-y-6">
          {[
            { period: '2029-2030', title: 'Foundation Phase', items: ['Policy development', 'Infrastructure planning', 'Team building', 'Community engagement'], color: 'from-red-600 to-red-700' },
            { period: '2030-2032', title: 'Implementation Phase', items: ['Education expansion', 'Healthcare rollout', 'Job creation programs', 'Infrastructure development'], color: 'from-blue-600 to-blue-700' },
            { period: '2032-2033', title: 'Consolidation Phase', items: ['Sustainability measures', 'Impact evaluation', 'Continuous improvement', 'Legacy planning'], color: 'from-red-600 to-red-700' },
          ].map((phase, i) => (
            <div key={i} className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="flex items-start gap-6">
                <div className={`bg-gradient-to-r ${phase.color} text-white rounded-xl px-6 py-3 font-bold whitespace-nowrap flex-shrink-0`}>
                  {phase.period}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{phase.title}</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {phase.items.map((item, j) => (
                      <li key={j} className="text-gray-700 flex items-center gap-2">
                        <span className={`w-2 h-2 ${i % 2 === 0 ? 'bg-red-600' : 'bg-blue-600'} rounded-full`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-24 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Us in Building This Vision</h2>
          <p className="text-lg mb-12 text-red-50">
            This ambitious vision for Ghana can only be achieved with the support and participation of every Ghanaian. Whether through donations, volunteering, or advocacy, your contribution matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="bg-white text-red-600 hover:bg-gray-50 px-10 py-4 rounded-xl font-bold transition transform hover:scale-105 shadow-lg"
            >
              Support Our Vision
            </a>
            <a
              href="/volunteer"
              className="border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold transition transform hover:scale-105"
            >
              Become a Volunteer
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

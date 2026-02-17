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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-6 text-balance">Our Vision for Ghana</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
          A prosperous, inclusive Ghana where every citizen has access to quality education, healthcare, and economic opportunities. A nation built on justice, integrity, and shared prosperity.
        </p>
      </section>

      {/* Vision Statement */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-border">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Our Promise to Ghana</h2>
          <p className="text-lg leading-relaxed">
            By 2030, Ghana will be an upper-middle-income country with a robust diversified economy, quality universal education and healthcare, world-class infrastructure, and a united, peaceful society where every citizen has the opportunity to thrive. The New Patriotic Party commits to transparent governance, evidence-based policymaking, and accountability at every level.
          </p>
        </div>
      </section>

      {/* Six Pillars */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-border">
        <h2 className="text-3xl font-bold mb-12 text-center">Six Pillars of Our Vision</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-8 hover:border-accent transition">
              <pillar.icon className="text-accent mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">{pillar.title}</h3>
              <p className="text-muted-foreground mb-6">{pillar.description}</p>
              <ul className="space-y-2 text-sm">
                {pillar.points.map((point, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-border">
        <h2 className="text-3xl font-bold mb-12 text-center">Implementation Timeline</h2>
        <div className="space-y-6">
          {[
            { period: '2024-2025', title: 'Foundation Phase', items: ['Policy development', 'Infrastructure planning', 'Team building', 'Community engagement'] },
            { period: '2025-2027', title: 'Implementation Phase', items: ['Education expansion', 'Healthcare rollout', 'Job creation programs', 'Infrastructure development'] },
            { period: '2027-2030', title: 'Consolidation Phase', items: ['Sustainability measures', 'Impact evaluation', 'Continuous improvement', 'Legacy planning'] },
          ].map((phase, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 font-bold whitespace-nowrap">
                  {phase.period}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {phase.items.map((item, j) => (
                      <li key={j} className="text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-secondary text-secondary-foreground py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us in Building This Vision</h2>
          <p className="text-lg mb-8">
            This ambitious vision for Ghana can only be achieved with the support and participation of every Ghanaian. Whether through donations, volunteering, or advocacy, your contribution matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition"
            >
              Support Our Vision
            </a>
            <a
              href="/volunteer"
              className="border border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground/10 px-8 py-3 rounded-lg font-semibold transition"
            >
              Become a Volunteer
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

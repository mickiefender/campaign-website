import { CheckCircle, Globe, Users, Zap } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-6 text-balance">About NPP Campaign</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
          The New Patriotic Party is committed to building a prosperous Ghana through principled leadership, economic development, and social progress.
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              To lead Ghana towards sustainable economic growth, improved living standards, and quality education through transparent governance and evidence-based policies.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-primary mt-1" size={20} />
                <span>Deliver quality education and healthcare</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-primary mt-1" size={20} />
                <span>Create jobs and economic opportunities</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-primary mt-1" size={20} />
                <span>Ensure transparent and accountable governance</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-primary mt-1" size={20} />
                <span>Protect our environment and natural resources</span>
              </li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Core Values</h3>
            <ul className="space-y-3">
              <li><strong>Integrity:</strong> Acting with honesty and moral principles</li>
              <li><strong>Excellence:</strong> Pursuing the highest standards in all we do</li>
              <li><strong>Inclusivity:</strong> Representing all Ghanaians regardless of background</li>
              <li><strong>Accountability:</strong> Taking responsibility for our actions and decisions</li>
              <li><strong>Innovation:</strong> Embracing modern solutions to traditional challenges</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-border">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Globe, title: 'National Presence', desc: 'Present in all 16 regions of Ghana' },
            { icon: Users, title: 'Community Engagement', desc: '50,000+ active volunteers nationwide' },
            { icon: Zap, title: 'Economic Growth', desc: 'Committed to 5% annual growth rate' },
            { icon: CheckCircle, title: 'Education', desc: '1M+ students impacted through initiatives' },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6">
              <item.icon className="text-accent mb-4" size={32} />
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-border">
        <h2 className="text-3xl font-bold mb-12 text-center">Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Dr. John Owusu', role: 'Presidential Candidate', region: 'Accra' },
            { name: 'Sarah Mensah', role: 'Campaign Director', region: 'Kumasi' },
            { name: 'Kwaku Asante', role: 'Finance & Strategy', region: 'Takoradi' },
          ].map((person, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold">{person.name}</h3>
              <p className="text-accent font-semibold mb-2">{person.role}</p>
              <p className="text-sm text-muted-foreground">{person.region}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency Section */}
      <section className="bg-secondary text-secondary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Financial Transparency</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$2.5M</div>
              <p>Total Funds Raised</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">85%</div>
              <p>Spent on Campaign Activities</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15%</div>
              <p>Administrative Overhead</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

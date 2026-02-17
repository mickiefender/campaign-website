'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, User, ArrowRight, Search } from 'lucide-react'

const NEWS_ARTICLES = [
  {
    id: 1,
    title: 'NPP Announces Comprehensive Education Manifesto',
    excerpt: 'The New Patriotic Party unveiled its ambitious education program promising free quality education from primary to tertiary level.',
    content: 'Full article content here...',
    date: '2024-02-10',
    author: 'Campaign Press Office',
    category: 'Education',
    featured: true,
  },
  {
    id: 2,
    title: 'Campaign Reaches 50,000 Active Volunteers',
    excerpt: 'Celebrating a major milestone as our grassroots movement continues to grow across all 16 regions.',
    content: 'Full article content here...',
    date: '2024-02-08',
    author: 'Volunteer Coordinator',
    category: 'Campaign',
    featured: true,
  },
  {
    id: 3,
    title: 'Economic Blueprint Launched for Job Creation',
    excerpt: 'NPP presents detailed plan to create 1 million new jobs and support small and medium enterprises.',
    content: 'Full article content here...',
    date: '2024-02-05',
    author: 'Economic Team',
    category: 'Economy',
    featured: false,
  },
  {
    id: 4,
    title: 'Healthcare Initiative Targets All 16 Regions',
    excerpt: 'New healthcare program aims to provide affordable, accessible medical services to every Ghanaian.',
    content: 'Full article content here...',
    date: '2024-02-01',
    author: 'Health Policy Team',
    category: 'Healthcare',
    featured: false,
  },
  {
    id: 5,
    title: 'Youth Empowerment Program Launches Successfully',
    excerpt: 'Thousands of young Ghanaians sign up for skills training and entrepreneurship support.',
    content: 'Full article content here...',
    date: '2024-01-28',
    author: 'Youth Outreach',
    category: 'Youth',
    featured: false,
  },
  {
    id: 6,
    title: 'Environmental Protection Initiative Announced',
    excerpt: 'NPP commits to renewable energy and reforestation programs as part of climate action.',
    content: 'Full article content here...',
    date: '2024-01-25',
    author: 'Environment Office',
    category: 'Environment',
    featured: false,
  },
]

export default function News() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = ['Education', 'Campaign', 'Economy', 'Healthcare', 'Youth', 'Environment']

  const filteredArticles = NEWS_ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredArticles = filteredArticles.filter(a => a.featured)
  const regularArticles = filteredArticles.filter(a => !a.featured)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-6 text-balance">Campaign News & Updates</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Stay informed about the latest developments from the NPP campaign.
        </p>
      </section>

      {/* Search and Filter */}
      <section className="max-w-7xl mx-auto px-4 pb-12 border-b border-border">
        <div className="flex flex-col gap-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                !selectedCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-accent'
              }`}
            >
              All Articles
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:border-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">Featured Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredArticles.map(article => (
              <article
                key={article.id}
                className="bg-card border-2 border-accent rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gradient-to-r from-primary to-accent h-48"></div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{article.title}</h3>
                  <p className="text-muted-foreground mb-6">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} /> {new Date(article.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                        <Calendar size={16} /> {new Date(article.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={16} /> {article.author}
                      </span>
                    </div>
                    <Link href={`/news/${article.id}`} className="text-accent font-semibold hover:gap-2 flex items-center gap-1 transition">
                      Read <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Regular Articles */}
      {regularArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 border-t border-border">
          <h2 className="text-2xl font-bold mb-8">{featuredArticles.length > 0 ? 'More Articles' : 'Latest Articles'}</h2>
          <div className="space-y-6">
            {regularArticles.map(article => (
              <article
                key={article.id}
                className="bg-card border border-border rounded-lg p-8 hover:border-accent transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                    <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} /> {new Date(article.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={16} /> {article.author}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/news/${article.id}`}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition whitespace-nowrap"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-xl text-muted-foreground">No articles found matching your criteria.</p>
        </section>
      )}

      {/* Subscribe Section */}
      <section className="bg-secondary text-secondary-foreground py-16 mt-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8">Subscribe to receive the latest news and updates from our campaign.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-secondary-foreground/10 border border-secondary-foreground/20 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

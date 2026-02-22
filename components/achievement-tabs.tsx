'use client'

import { useState } from 'react'
import { ChevronDown, BookOpen, Award } from 'lucide-react'

export function AchievementTabs() {
  const [expandedTab, setExpandedTab] = useState<'education' | 'political' | null>(null)

  const educationalAchievements = [
    {
      title: 'MSc Clinical Sciences (Otolaryngology–ENT)',
      institution: 'Plymouth University',
      details: 'Specialized postgraduate degree in clinical sciences with focus on Otolaryngology and ENT specialization'
    },
    {
      title: 'Master of Business Administration (MBA)',
      institution: 'University of Cumbria',
      details: 'Leadership and Sustainability focus - comprehensive business and leadership training'
    },
    {
      title: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
      institution: 'Wenzhou Medical University',
      details: 'Complete medical degree with training in clinical practice and patient care'
    },
    {
      title: 'Teaching Certificate (CELTA)',
      institution: 'Cambridge University',
      details: 'Cambridge English Language Teaching qualification for educators'
    }
  ]

  const politicalAchievements = [
    {
      title: 'NPP National Tressurer',
      description: 'Led the party\s financial management and fundraising efforts',
      impact: 'Financial stability and growth for the National Patriotic Party'
    },
    {
      title: 'Ghana\s deputy Ambassador to the people of Republic of China',
      description: 'Strengthened diplomatic relations and promoted Ghana\'s interests in China',
      impact: 'Enhanced Ghana\s international presence and economic partnerships with China'
    },
    {
      title: 'Branch Chairman, China Branch of the New Patriotic Party (NPP)',
      description: 'Led the party\s activities and engagement with the Ghanaian diaspora in China',
      impact: 'Increased party membership and influence among the Ghanaian diaspora in China'
    },
    {
      title: 'Chairman, Asia-Pacific Caucaus of the New Patriotic Party (NPP)',
      description: 'Led the party\s engagement and collaboration with political stakeholders in the Asia-Pacific region',
      impact: 'Strengthened the party\s international alliances and support in the Asia-Pacific region'
    },
     {
      title: 'New Patriotic Party (NPP) representative to the 2016 ECOWAS Commission Internal Democratic and Administrative Process Training Seminar',
      description: 'Represented the NPP at the training seminar on internal democratic and administrative processes in the ECOWAS region',
      impact: 'Enhanced the party\s understanding and adherence to democratic principles in the ECOWAS region'
    }, {
      title: 'New Patriotic Party (NPP) representative to the 2016 UNPD Democratic Governance Cluster Annual Retreat',
      description: 'Represented the NPP at the UNPD Democratic Governance Cluster Annual Retreat, contributing to discussions on democratic governance and development',
      impact: 'Strengthened the party\s engagement with international organizations and promoted democratic governance'
    },
     {
      title: 'New Patriotic Party (NPP) Representative to the UNPD Climate Change Conference',
      description: 'Represented the NPP at the UNPD Climate Change Conference, contributing to discussions on climate change and sustainable development',
      impact: 'Enhanced the party\s engagement with international organizations and promoted climate change awareness and sustainable development'
    },
     {
      title: 'New Patriotic Party (NPP) Representative, Tourism and NaturalResources Management Seminar',
      description: 'Represented the NPP at the Tourism and Natural Resources Management Seminar',
      impact: 'Enhanced the party\s understanding of tourism and natural resources management'
    },
    {
      title: 'Secretary to the 2016 National Campaign Committee of the New Patriotic Party (NPP)',
      description: 'Led the administrative and organizational efforts of the NPP National Campaign Committee',
      impact: 'Enhanced the party\s campaign coordination and administrative efficiency'
    },{
      title: 'Member/Secretary, 2016 Manifesto Launch Planning Committee of the National Executive Committee of the New Patriotic Party (NPP)',
      description: 'Led the planning and execution of the 2016 manifesto launch',
      impact: 'Enhanced the party\s strategic planning and execution capabilities'
    },
    {
      title: 'Patron, Ashanti Regional Women Wing of the New Patriotic Party (NPP)',
      description: 'Supported and promoted the activities of the Ashanti Regional Women Wing of the NPP',
      impact: 'Enhanced women\s participation and leadership in the NPP in the Ashanti region'
    },{
      title: 'Paliamentary Aspirant, New Patriotic Party (NPP) for the Kwadaso Constituency in the Ashanti Region-2015',
      description: 'Contested the 2015 parliamentary election for the Kwadaso Constituency in the Ashanti Region as a candidate of the New Patriotic Party (NPP)',
      impact: 'Increased the party\s presence and influence in the Kwadaso Constituency'
    }
  ]

  const toggleTab = (tab: 'education' | 'political') => {
    setExpandedTab(expandedTab === tab ? null : tab)
  }

  return (
    <div className="w-full space-y-4">
      {/* Educational Achievements Tab */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <button
          onClick={() => toggleTab('education')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900">See Educational Qualifications</h3>
              <p className="text-sm text-gray-600">4 degrees and certifications</p>
            </div>
          </div>
          <ChevronDown
            size={24}
            className={`text-gray-600 transition-transform ${expandedTab === 'education' ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Content */}
        {expandedTab === 'education' && (
          <div className="bg-white border-t border-gray-200 px-6 py-6 space-y-4">
            {educationalAchievements.map((achievement, index) => (
              <div
                key={index}
                className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                    <p className="text-sm text-blue-600 font-medium mb-1">{achievement.institution}</p>
                    <p className="text-sm text-gray-600">{achievement.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Political Achievements Tab */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <button
          onClick={() => toggleTab('political')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <Award className="text-white" size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900">Political Achievements</h3>
              <p className="text-sm text-gray-600">Leadership milestones</p>
            </div>
          </div>
          <ChevronDown
            size={24}
            className={`text-gray-600 transition-transform ${expandedTab === 'political' ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Content */}
        {expandedTab === 'political' && (
          <div className="bg-white border-t border-gray-200 px-6 py-6 space-y-4">
            {politicalAchievements.map((achievement, index) => (
              <div
                key={index}
                className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-red-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200">
                      <span className="text-xs font-medium text-red-700">{achievement.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

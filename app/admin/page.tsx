'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Users, Heart, MessageSquare, TrendingUp, LogOut, RefreshCw, Download, CheckCircle, XCircle, Clock, Menu, X, Bell, Settings, Search, LayoutDashboard, HandCoins, UserCircle, Flag } from 'lucide-react'
import Image from 'next/image'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Stats {
  totalDonations: number
  totalDonors: number
  totalVolunteers: number
  totalMessages: number
  donationTrend: number
  volunteerTrend: number
  todayMessages: number
}

interface Donation {
  id: string
  donor_name: string
  donor_email: string
  amount: number
  status: string
  created_at: string
  payment_method: string
}

interface Volunteer {
  id: string
  full_name: string
  email: string
  phone: string
  region: string
  status: string
  created_at: string
  availability: string
}

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  created_at: string
}

type TabType = 'overview' | 'donations' | 'volunteers' | 'messages' | 'reports'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const [stats, setStats] = useState<Stats>({
    totalDonations: 0,
    totalDonors: 0,
    totalVolunteers: 0,
    totalMessages: 0,
    donationTrend: 0,
    volunteerTrend: 0,
    todayMessages: 0,
  })
  const [recentDonations, setRecentDonations] = useState<any[]>([])
  const [recentVolunteers, setRecentVolunteers] = useState<any[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [donationsPagination, setDonationsPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [volunteersPagination, setVolunteersPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [messagesPagination, setMessagesPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [filters, setFilters] = useState({
    donationStatus: 'all',
    volunteerStatus: 'all',
    volunteerRegion: 'all',
    messageStatus: 'all',
  })

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    if (activeTab === 'donations') {
      fetchDonations()
    } else if (activeTab === 'volunteers') {
      fetchVolunteers()
    } else if (activeTab === 'messages') {
      fetchMessages()
    }
  }, [activeTab, donationsPagination.page, volunteersPagination.page, messagesPagination.page, filters])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      setStats(data.stats)
      setRecentDonations(data.recentDonations)
      setRecentVolunteers(data.recentVolunteers)
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load statistics')
    }
  }

  const fetchDonations = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: donationsPagination.page.toString(),
        limit: donationsPagination.limit.toString(),
        status: filters.donationStatus,
      })
      const response = await fetch(`/api/admin/donations?${params}`)
      if (!response.ok) throw new Error('Failed to fetch donations')
      const data = await response.json()
      setDonations(data.donations)
      setDonationsPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching donations:', error)
      toast.error('Failed to load donations')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVolunteers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: volunteersPagination.page.toString(),
        limit: volunteersPagination.limit.toString(),
        status: filters.volunteerStatus,
        region: filters.volunteerRegion,
      })
      const response = await fetch(`/api/admin/volunteers?${params}`)
      if (!response.ok) throw new Error('Failed to fetch volunteers')
      const data = await response.json()
      setVolunteers(data.volunteers)
      setVolunteersPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching volunteers:', error)
      toast.error('Failed to load volunteers')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: messagesPagination.page.toString(),
        limit: messagesPagination.limit.toString(),
        status: filters.messageStatus,
      })
      const response = await fetch(`/api/admin/messages?${params}`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data.messages)
      setMessagesPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const updateDonationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/donations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!response.ok) throw new Error('Failed to update donation')
      toast.success('Donation status updated')
      fetchDonations()
    } catch (error) {
      console.error('Error updating donation:', error)
      toast.error('Failed to update donation')
    }
  }

  const updateVolunteerStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/volunteers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!response.ok) throw new Error('Failed to update volunteer')
      toast.success('Volunteer status updated')
      fetchVolunteers()
    } catch (error) {
      console.error('Error updating volunteer:', error)
      toast.error('Failed to update volunteer')
    }
  }

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!response.ok) throw new Error('Failed to update message')
      toast.success('Message status updated')
      fetchMessages()
    } catch (error) {
      console.error('Error updating message:', error)
      toast.error('Failed to update message')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-gray-100 text-gray-800',
      replied: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return `₵${amount.toLocaleString()}`
  }

  const sidebarItems: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'donations', label: 'Donations', icon: HandCoins },
    { id: 'volunteers', label: 'Volunteers', icon: UserCircle },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          : `${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300`
        } 
        bg-gradient-to-b from-red-600 via-red-700 to-blue-800 text-white overflow-hidden shadow-2xl flex flex-col
      `}>
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Flag className="w-6 h-6 text-white" /> 
              <span className="tracking-wide">Dr. Dwamena</span>
            </h1>
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <p className="text-xs text-red-100 mt-1">Campaign Dashboard</p>
        </div>
        
        <nav className="flex-1 mt-6 space-y-1 px-3 overflow-y-auto">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                if (isMobile) setSidebarOpen(false)
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                activeTab === item.id
                  ? 'bg-white text-red-700 font-semibold shadow-lg'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-lg">
              N
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Admin User</p>
              <p className="text-xs text-red-200 truncate">drdwamena</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-red-50 text-red-700 rounded-lg transition-colors lg:hidden"
            >
              <Menu size={24} />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 hover:bg-red-50 text-red-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search donations, volunteers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative p-2 hover:bg-red-50 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-3 lg:pl-6 border-l border-gray-200">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-red-200 shadow-sm">
                <Image
                  src="/image/Dr.Dwamena_image.png"
                  alt="Admin Profile"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <div className="bg-white rounded-xl border-l-4 border-red-600 shadow-sm p-5 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Donations</p>
                        <p className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(stats.totalDonations)}</p>
                        <p className="text-xs text-green-600 mt-1 font-medium">+{stats.donationTrend}% this month</p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Heart className="text-red-600" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border-l-4 border-blue-600 shadow-sm p-5 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Donors</p>
                        <p className="text-2xl font-bold mt-1 text-gray-900">{stats.totalDonors.toLocaleString()}</p>
                        <p className="text-xs text-green-600 mt-1 font-medium">+{stats.donationTrend}% this month</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <TrendingUp className="text-blue-600" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border-l-4 border-red-500 shadow-sm p-5 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Volunteers</p>
                        <p className="text-2xl font-bold mt-1 text-gray-900">{stats.totalVolunteers.toLocaleString()}</p>
                        <p className="text-xs text-green-600 mt-1 font-medium">+{stats.volunteerTrend}% this month</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <Users className="text-red-500" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border-l-4 border-blue-500 shadow-sm p-5 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Messages</p>
                        <p className="text-2xl font-bold mt-1 text-gray-900">{stats.totalMessages}</p>
                        <p className="text-xs text-green-600 mt-1 font-medium">+{stats.todayMessages} today</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <MessageSquare className="text-blue-500" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-5 lg:p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">Donations Over Time</h3>
                    <div className="h-64">
                      {recentDonations.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={recentDonations.slice(0, 7).map((d, idx) => ({
                            name: d.donor_name ? d.donor_name.split(' ')[0] : `Donor ${idx + 1}`,
                            amount: Number(d.amount) || 0
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis tick={{fontSize: 12}} />
                            <Tooltip 
                              formatter={(value: number) => formatCurrency(value)} 
                              contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}}
                            />
                            <Bar dataKey="amount" fill="#DC2626" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">No donation data available</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-5 lg:p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">Volunteer Registration</h3>
                    <div className="h-64">
                      {recentVolunteers.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={recentVolunteers.slice(0, 7).map((v, idx) => ({
                            name: `Vol ${idx + 1}`,
                            count: idx + 1
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis tick={{fontSize: 12}} />
                            <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb'}} />
                            <Line type="monotone" dataKey="count" stroke="#1D4ED8" strokeWidth={3} dot={{fill: '#1D4ED8', strokeWidth: 2, r: 4}} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">No volunteer data available</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">Donations Management</h2>
                  <div className="flex gap-3">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">+ Add New</Button>
                    <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">Export</Button>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <DataTable
                    columns={[
                      { key: 'donor_name', label: 'Donor Name' },
                      { key: 'donor_email', label: 'Email' },
                      {
                        key: 'amount',
                        label: 'Amount',
                        render: (value) => formatCurrency(value)
                      },
                      {
                        key: 'status',
                        label: 'Status',
                        render: (value) => getStatusBadge(value)
                      },
                      {
                        key: 'created_at',
                        label: 'Date',
                        render: (value) => formatDate(value)
                      },
                      {
                        key: 'actions',
                        label: 'Actions',
                        render: (_, row) => (
                          <div className="flex gap-2">
                            {row.status === 'pending' && (
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => updateDonationStatus(row.id, 'completed')}
                            >
                              Complete
                            </Button>

                            )}
                          </div>
                        )
                      }
                    ]}
                    data={donations}
                    pagination={donationsPagination}
                    onPageChange={(page) => setDonationsPagination({ ...donationsPagination, page })}
                    filters={[
                      {
                        key: 'status',
                        label: 'Status',
                        options: [
                          { value: 'all', label: 'All Status' },
                          { value: 'completed', label: 'Completed' },
                          { value: 'pending', label: 'Pending' },
                          { value: 'failed', label: 'Failed' },
                        ]
                      }
                    ]}
                    onFilterChange={(key, value) => setFilters({ ...filters, donationStatus: value })}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Volunteers Tab */}
            {activeTab === 'volunteers' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">Volunteers Management</h2>
                  <div className="flex gap-3">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">+ Add New</Button>
                    <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">Import</Button>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <DataTable
                    columns={[
                      { key: 'full_name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'region', label: 'Region' },
                      {
                        key: 'status',
                        label: 'Status',
                        render: (value) => getStatusBadge(value)
                      },
                      {
                        key: 'created_at',
                        label: 'Date',
                        render: (value) => formatDate(value)
                      },
                      {
                        key: 'actions',
                        label: 'Actions',
                        render: (_, row) => (
                          <div className="flex gap-2">
                            {row.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => updateVolunteerStatus(row.id, 'approved')}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => updateVolunteerStatus(row.id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        )
                      }
                    ]}
                    data={volunteers}
                    pagination={volunteersPagination}
                    onPageChange={(page) => setVolunteersPagination({ ...volunteersPagination, page })}
                    filters={[
                      {
                        key: 'status',
                        label: 'Status',
                        options: [
                          { value: 'all', label: 'All Status' },
                          { value: 'pending', label: 'Pending' },
                          { value: 'approved', label: 'Approved' },
                          { value: 'rejected', label: 'Rejected' },
                        ]
                      },
                      {
                        key: 'region',
                        label: 'Region',
                        options: [
                          { value: 'all', label: 'All Regions' },
                          { value: 'Greater Accra', label: 'Greater Accra' },
                          { value: 'Ashanti', label: 'Ashanti' },
                          { value: 'Eastern', label: 'Eastern' },
                          { value: 'Western', label: 'Western' },
                          { value: 'Central', label: 'Central' },
                          { value: 'Northern', label: 'Northern' },
                        ]
                      }
                    ]}
                    onFilterChange={(key, value) => {
                      if (key === 'status') {
                        setFilters({ ...filters, volunteerStatus: value })
                      } else if (key === 'region') {
                        setFilters({ ...filters, volunteerRegion: value })
                      }
                    }}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">Contact Messages</h2>
                  <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">Export</Button>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <DataTable
                    columns={[
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'subject', label: 'Subject' },
                      {
                        key: 'status',
                        label: 'Status',
                        render: (value) => getStatusBadge(value)
                      },
                      {
                        key: 'created_at',
                        label: 'Date',
                        render: (value) => formatDate(value)
                      },
                      {
                        key: 'actions',
                        label: 'Actions',
                        render: (_, row) => (
                          <div className="flex gap-2">
                            {row.status === 'new' && (
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => updateMessageStatus(row.id, 'read')}
                              >
                                Mark Read
                              </Button>
                            )}
                            {row.status === 'read' && (
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => updateMessageStatus(row.id, 'replied')}
                              >
                                Mark Replied
                              </Button>
                            )}
                          </div>
                        )
                      }
                    ]}
                    data={messages}
                    pagination={messagesPagination}
                    onPageChange={(page) => setMessagesPagination({ ...messagesPagination, page })}
                    filters={[
                      {
                        key: 'status',
                        label: 'Status',
                        options: [
                          { value: 'all', label: 'All Status' },
                          { value: 'new', label: 'New' },
                          { value: 'read', label: 'Read' },
                          { value: 'replied', label: 'Replied' },
                        ]
                      }
                    ]}
                    onFilterChange={(key, value) => setFilters({ ...filters, messageStatus: value })}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Campaign Reports</h2>
                <p className="text-gray-600">Generate comprehensive campaign reports and financial statements.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <button className="bg-white border-l-4 border-red-600 rounded-xl p-6 text-left hover:shadow-lg hover:border-red-400 transition-all shadow-sm">
                    <h3 className="font-bold mb-2 text-gray-800">Monthly Campaign Report</h3>
                    <p className="text-sm text-gray-600">Latest campaign performance metrics</p>
                  </button>
                  <button className="bg-white border-l-4 border-blue-600 rounded-xl p-6 text-left hover:shadow-lg hover:border-blue-400 transition-all shadow-sm">
                    <h3 className="font-bold mb-2 text-gray-800">Financial Statement</h3>
                    <p className="text-sm text-gray-600">Donation and expense breakdown</p>
                  </button>
                  <button className="bg-white border-l-4 border-red-500 rounded-xl p-6 text-left hover:shadow-lg hover:border-red-400 transition-all shadow-sm">
                    <h3 className="font-bold mb-2 text-gray-800">Volunteer Report</h3>
                    <p className="text-sm text-gray-600">Volunteer engagement and impact</p>
                  </button>
                  <button className="bg-white border-l-4 border-blue-500 rounded-xl p-6 text-left hover:shadow-lg hover:border-blue-400 transition-all shadow-sm">
                    <h3 className="font-bold mb-2 text-gray-800">Regional Analytics</h3>
                    <p className="text-sm text-gray-600">Performance by region breakdown</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

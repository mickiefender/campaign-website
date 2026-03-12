'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Calendar, 
  MessageSquare,
  CheckCircle2,
  Shield
} from 'lucide-react'

// Role mapping from IDs to display names
const VOLUNTEER_ROLES: Record<string, string> = {
  campaign: 'Campaign Ambassador',
  events: 'Event Coordinator',
  canvassing: 'Door-to-Door Canvasser',
  social: 'Social Media Manager',
  finance: 'Fundraising Coordinator',
  admin: 'Administrative Support',
}

// Availability display mapping
const AVAILABILITY_LABELS: Record<string, string> = {
  weekends: 'Weekends only',
  evenings: 'Weekday evenings',
  fulltime: 'Full-time',
  flexible: 'Flexible/As needed',
}

// Commitment display mapping
const COMMITMENT_LABELS: Record<string, string> = {
  occasional: 'Occasional (few hours/month)',
  regular: 'Regular (4-8 hours/week)',
  dedicated: 'Dedicated (8+ hours/week)',
}

interface Volunteer {
  id: string
  full_name: string
  email: string
  phone: string
  region: string
  address?: string
  city?: string
  skills?: string[]
  interested_roles?: string[]
  availability?: string
  commitment?: string
  message?: string
  status: string
  created_at: string
  updated_at?: string
}

interface VolunteerDetailsDialogProps {
  volunteer: Volunteer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VolunteerDetailsDialog({
  volunteer,
  open,
  onOpenChange,
}: VolunteerDetailsDialogProps) {
  if (!volunteer) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      active: 'bg-green-100 text-green-800 border-green-300',
      inactive: 'bg-gray-100 text-gray-800 border-gray-300',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <User className="w-5 h-5 text-red-600" />
            Volunteer Details
          </DialogTitle>
          <DialogDescription>
            Full information submitted by the volunteer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Banner */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Status:</span>
            </div>
            {getStatusBadge(volunteer.status)}
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-red-600" />
              Personal Information
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{volunteer.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email Address</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Mail className="w-3 h-3 text-gray-400" />
                    {volunteer.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="w-3 h-3 text-gray-400" />
                    {volunteer.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Region</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {volunteer.region}
                  </p>
                </div>
              </div>
              
              {(volunteer.city || volunteer.address) && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Full Address</p>
                  <p className="font-medium text-gray-900">
                    {[volunteer.address, volunteer.city].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Volunteer Roles */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Interested Volunteer Roles
            </h3>
            <div className="flex flex-wrap gap-2">
              {volunteer.interested_roles && volunteer.interested_roles.length > 0 ? (
                volunteer.interested_roles.map((roleId) => (
                  <Badge 
                    key={roleId} 
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
                  >
                    {VOLUNTEER_ROLES[roleId] || roleId}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No roles selected</p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Skills & Experience
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              {volunteer.skills && volunteer.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-gray-200 text-gray-700 px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No skills provided</p>
              )}
            </div>
          </div>

          {/* Availability & Commitment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                Availability
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  {AVAILABILITY_LABELS[volunteer.availability || ''] || volunteer.availability || 'Not specified'}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Commitment Level
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  {COMMITMENT_LABELS[volunteer.commitment || ''] || volunteer.commitment || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Message */}
          {volunteer.message && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                Additional Message
              </h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{volunteer.message}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Timestamps */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <p>Submitted: {formatDate(volunteer.created_at)}</p>
              {volunteer.updated_at && (
                <p>Last Updated: {formatDate(volunteer.updated_at)}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


# TODO: Show Full Volunteer Information in Dashboard

## Task
On the volunteer management page inside the dashboard, show the full information provided by the volunteer.

## Plan

### Step 1: Update Volunteer Interface
- [x] Add missing fields to the Volunteer interface: skills, interested_roles, availability, commitment, message

### Step 2: Add View Details Button
- [x] Add a new action button in the volunteers DataTable

### Step 3: Create Volunteer Details Dialog
- [x] Create a dialog to display full volunteer information

### Step 4: Update Admin Page
- [x] Import and render the volunteer details dialog

## Summary
Successfully implemented volunteer details viewing functionality in the admin dashboard:

1. Created `components/admin/volunteer-details-dialog.tsx` - A dialog component that displays:
   - Personal Information (name, email, phone, region, address)
   - Interested Volunteer Roles (with role name mapping)
   - Skills & Experience
   - Availability & Commitment Level
   - Additional Message
   - Status and Timestamps

2. Updated `app/admin/page.tsx`:
   - Added VolunteerDetailsDialog import
   - Updated Volunteer interface with all fields
   - Added state management for selected volunteer and dialog
   - Added "View" button with Eye icon to volunteers table
   - Added the dialog component at the end of JSX


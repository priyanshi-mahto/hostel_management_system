# Hostel Management System

A full-stack Hostel Management System built to streamline hostel administration, student accommodation management, visitor handling, complaint tracking, leave approvals, and hostel operations.

## Features

### Authentication & Role Management
- Secure login system
- Role-based access control
- Supported roles:
  - Hostel Admin
  - Warden
  - Office Staff
  - Student

### Student Management
- Student profile management
- Personal and contact information
- Blood group and address records
- Guardian information management
- Student hostel assignment

### Hostel & Room Management
- Multiple hostel support
- Hostel capacity tracking
- Room creation and management
- Room allocation history
- Roommate management

### Student ID Verification
- Upload front and back ID card images
- Verification workflow
- Approval/Rejection system
- Rejection reason tracking

### Leave Management
- Leave application submission
- Leave approval/rejection by authorities
- Leave history tracking

### Complaint Management
- Complaint registration
- Category-wise complaints:
  - Plumbing
  - Electrical
  - Internet
  - Cleanliness
  - Civil
  - Other
- Complaint status tracking
- Complaint feedback and ratings

### Visitor Management
- Visitor profile registration
- Visitor request management
- Visit approval workflow
- Student-visitor mapping

### Lost & Found
- Report lost items
- Report found items
- Item claim tracking

### Notification System
- Hostel announcements
- Important updates
- Broadcast notifications

### Warden & Staff Management
- Warden management
- Warden contact details
- Office staff management
- Hostel-wise administration

---

## Database Schema

The system contains the following major tables:

- users
- hostel
- hostel_admin
- warden
- warden_contact_details
- room
- room_allocation
- roommate
- student
- guardian
- student_id_card
- office_staff
- complaint
- complaint_feedback
- leave_request
- visitor_profile
- visiting_request
- visitor_request
- lost_and_found
- notification

---

## Tech Stack

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

---



## 🚀 Installation

### Clone Repository

bash
git clone https://github.com/priyanshi-mahto/hostel_management_system.git
cd hostel_management_system


### Install Dependencies

bash
npm install


### Configure Database

1. Create a MySQL database.
2. Import the provided SQL file.
3. Update database credentials in the configuration file.

### Run the Project

bash
npm start


or

bash
node server.js


---

## Installation

### Clone Repository

```bash
git clone https://github.com/priyanshi-mahto/hostel_management_system.git
cd hostel_management/hostel_management

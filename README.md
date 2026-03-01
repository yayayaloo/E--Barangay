# E-Barangay PWA - Setup Instructions

## 🚀 Quick Start

Due to PowerShell execution policy restrictions, please follow these steps to run the application:

### 1. Install Dependencies

Open **Command Prompt** (cmd.exe) or **Git Bash** and navigate to the project folder:

```bash
cd c:\E-Barangay
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 3. Build for Production

```bash
npm run build
npm run start
```

## 📱 Testing PWA Features

### Desktop (Chrome/Edge)
1. Open the app in Chrome or Edge
2. Look for the install icon in the address bar
3. Click "Install" to add to your desktop

### Mobile
1. Open the app in Chrome (Android) or Safari (iOS)
2. Tap the menu (⋮ or share icon)
3. Select "Add to Home Screen"

## 🎯 Features Overview

### Landing Page (/)
- Hero section with animated gradients
- Feature showcase with glassmorphism cards
- Services catalog
- Technology stack display
- Responsive navigation

### Resident Portal (/resident)
- Dashboard with quick actions
- Service request cards (Clearance, Permits, ID, Certificates)
- Application tracking
- Recent announcements
- Floating AI chatbot button

### Admin Dashboard (/admin)
- Statistics overview
- Document request management
- QR verification interface
- Announcement publishing
- Resident database access

### AI Chatbot 🤖
- Click the floating button or "Ask AI Assistant" card
- Mock NLP responses for common queries
- Quick reply suggestions
- Typing indicators
- 24/7 availability simulation

## 🎨 Design Features

- **Glassmorphism:** Frosted glass effect with backdrop blur
- **Dark Theme:** Premium dark color scheme
- **Gradients:** Indigo to teal gradient palette
- **Animations:** Smooth transitions and micro-interactions
- **Responsive:** Mobile-first design
- **Premium Typography:** Inter and Poppins fonts

## 🔧 Technology Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Vanilla CSS with CSS Variables
- **PWA:** Progressive Web App capabilities
- **Icons:** SVG with gradient backgrounds

## 📦 Project Structure

```
c:\E-Barangay/
├── app/
│   ├── globals.css          # Design system & global styles
│   ├── layout.tsx            # Root layout with fonts
│   ├── page.tsx              # Landing page
│   ├── page.module.css       # Landing page styles
│   ├── resident/
│   │   ├── page.tsx          # Resident portal
│   │   └── resident.module.css
│   └── admin/
│       ├── page.tsx          # Admin dashboard
│       └── admin.module.css
├── components/
│   ├── ChatBot.tsx           # AI chatbot component
│   └── ChatBot.module.css
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── icon-192.svg         # PWA icon (small)
│   └── icon-512.svg         # PWA icon (large)
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🧪 Testing Recommendations

1. **Responsive Design:** Test on mobile (375px), tablet (768px), and desktop (1440px)
2. **AI Chatbot:** Try queries like "clearance", "hours", "help"
3. **Navigation:** Test all links and page transitions
4. **PWA Installation:** Install on different devices
5. **Glassmorphism:** Verify backdrop blur effects work

## 🎯 Next Steps (Future Development)

- Connect to real backend API
- Implement actual AI/NLP integration (OpenAI/Gemini)
- Add QR code generation library
- Set up Firebase/AWS backend
- Implement user authentication
- Add real-time notifications
- Database integration
- Payment processing (for permits/fees)

## 📝 Notes

This is a **mockup/prototype** demonstrating the UI/UX design. All data is mocked, and the chatbot uses predefined responses. For production deployment, backend integration will be required.

## 👥 Support

For questions or issues, contact the development team or review the implementation plan in the artifacts directory.

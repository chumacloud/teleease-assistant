
# TeleEase — Smart Telecom Assistant Prototype

## Overview
A mobile-first web app prototype simulating telecom management for MTN and Airtel networks, with mock data, smart alerts, and clean UI.

## Screens & Features

### 1. Splash Screen
- App logo with "TeleEase" branding, auto-transitions to home after 2 seconds with fade animation

### 2. Home Screen
- App title & subtitle
- Two large cards: MTN (yellow #FFCC00) and Airtel (red #ED1C24) with network icons, soft shadows, hover/tap animations

### 3. Network Dashboard
- Dynamic theme color based on selected network
- Cards showing: Airtime Balance, Data Balance, Active Plan, Expiry Date, Last Updated
- Refresh button that simulates loading state and randomizes values slightly
- Smart alert banners: low airtime (<₦200), low data (<500MB), expiry (<2 days)

### 4. My Numbers Management
- List of saved phone numbers with active indicator
- Add number form with simulated OTP verification (auto-success)
- Switch between numbers (updates dashboard data)

### 5. Buy Services
- Buy Airtime / Buy Data buttons
- Modal with amount selection grid and "Proceed to Pay" button
- Success confirmation with animation

### 6. Notifications Panel
- Banner-style alerts for low data, low airtime, plan expiry
- Dismissible notifications list

## Technical Approach
- React Router for navigation between screens
- React Context for network theme and mock data state
- All data is mock/simulated with slight randomization on refresh
- Mobile-first responsive design (max-width container, touch-friendly)
- Tailwind for theming with CSS variables swapped per network
- Lucide icons throughout
- Framer-motion-style transitions via Tailwind animate utilities

## Data Model (In-Memory Mock)
- Numbers array with associated balances, plans, and expiry dates per network
- Refresh simulates ±5% balance changes with 1-second loading delay
- 10% chance of simulated network error on refresh

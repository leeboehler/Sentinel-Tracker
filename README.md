# Sentinel Activity Tracker

A comprehensive activity tracking application built with React, Vite, and Supabase.

## Features

- **Activity Tracking**: Track custom activities with specific intervals and days.
- **Log Management**: Add, update, and delete activity logs.
- **Goals & Sections**: Organize activities into categories and sections.
- **Data Visualization**: View progress and history.
- **Supabase Integration**: Real-time data sync and authentication.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Sentinel-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your Supabase credentials in `.env`:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Database Schema

Ensure your Supabase project has the following tables:
- `activities`
- `logs`
- `goals`
- `sections`
- `categories`

(Refer to `types.ts` for schema details)

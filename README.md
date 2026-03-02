# LawFirm Docketing App - Prototype

A cloud-based docket tracking application for law firms.

## Quick Start

1. **Create a Supabase project:**
   - Go to https://supabase.com and create a free account
   - Create a new project
   - Get your project URL and anon key

2. **Deploy to Vercel:**
   - Click the button below to deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js&repository-name=law-docket)

3. **Set environment variables in Vercel:**
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key

4. **Run the SQL setup:**
   - Copy the contents of `supabase/schema.sql`
   - Run it in your Supabase SQL Editor

5. **Open your app** and start adding matters!

## Features (Prototype v1)

- ✅ Add/Edit/Delete Matters
- ✅ Fields: Matter Number, Client Number, Case Name, Court, Judge, Practice Area
- ✅ Deadline tracking with automation
- ✅ Dashboard showing upcoming deadlines
- ✅ Filter by Practice Area, Court, Status

## Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + API)
- **Deployment:** Vercel (free)

## Project Structure

```
law-docket/
├── app/
│   ├── page.tsx          # Main dashboard
│   ├── matters/
│   │   ├── page.tsx     # Matters list
│   │   └── [id]/        # Edit matter
│   └── api/             # API routes (if needed)
├── components/
│   ├── MatterForm.tsx   # Add/Edit form
│   ├── MatterCard.tsx   # Display card
│   └── DeadlineAlert.tsx
├── lib/
│   └── supabase.ts      # Supabase client
├── supabase/
│   └── schema.sql       # Database schema
└── .env.local.example   # Environment template
```

## Database Schema

See `supabase/schema.sql` for the complete schema with:
- `matters` table
- `deadlines` table
- Row Level Security (RLS) policies

## Next Steps

1. Add user authentication
2. Add document attachments
3. Add calendar integration
4. Add billing/time tracking
5. Add client management

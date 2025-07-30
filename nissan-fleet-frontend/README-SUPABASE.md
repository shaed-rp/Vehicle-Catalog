# Supabase Database Setup Guide

## 🗄️ Database Setup Instructions

### 1. **Access Your Supabase Project**

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Navigate to your project: `nmtomyconqyabpjixjkj`

### 2. **Set Up Database Schema**

1. **Open the SQL Editor** in your Supabase dashboard
2. **Copy and paste** the contents of `supabase-schema.sql` into the SQL editor
3. **Run the script** to create all tables and sample data

### 3. **Verify Environment Variables**

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nmtomyconqyabpjixjkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdG9teWNvbnF5YWJwaml4amtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTQ0MDIsImV4cCI6MjA2OTM5MDQwMn0.reVt4cfJnC_IPrTeCySvkEJzt1fLo6l53PRZ-7TugGQ
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. **Initialize Sample Data**

After setting up the schema, you can initialize the database with sample vehicles:

```bash
# Make a POST request to initialize the database
curl -X POST http://localhost:3000/api/init-database
```

Or visit: `http://localhost:3000/api/init-database` in your browser

### 5. **Test the Integration**

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Visit the application**: `http://localhost:3000`

3. **Test the API endpoints**:
   - Health check: `http://localhost:3000/api/health`
   - Vehicle search: `http://localhost:3000/api/vehicles/search`
   - Years: `http://localhost:3000/api/governance/years`

## 🗂️ Database Schema Overview

### **Core Tables**
- `vehicles` - Main vehicle records
- `vehicle_identifications` - VIN and other IDs
- `vehicle_pricing` - MSRP, invoice, dealer net
- `makes` - Manufacturers (Nissan)
- `models` - Vehicle models
- `model_years` - Available years
- `trims` - Trim levels
- `body_types` - Sedan, SUV, etc.
- `drive_types` - FWD, AWD, etc.

### **Relationships**
- Vehicles link to all lookup tables
- Vehicle identifications and pricing link to vehicles
- Models link to makes
- All tables have proper foreign key constraints

## 🔧 API Endpoints

### **Vehicle Search**
- `POST /api/vehicles/search` - Search with filters

### **Governance (Filtering)**
- `GET /api/governance/years` - Available years
- `GET /api/governance/makes/[yearId]` - Makes by year
- `GET /api/governance/models/[yearId]/[makeId]` - Models by year/make
- `GET /api/governance/trims/[yearId]/[makeId]/[modelId]` - Trims by year/make/model

### **Utility**
- `GET /api/health` - Health check
- `POST /api/init-database` - Initialize sample data

## 🚀 Features Implemented

### ✅ **Real Database Integration**
- Supabase PostgreSQL database
- Type-safe queries with proper error handling
- Optimized database queries with joins
- Row Level Security (RLS) enabled

### ✅ **Sample Data**
- 10 sample vehicles with realistic pricing
- Complete Nissan model lineup
- Multiple trim levels and body types
- VIN numbers and pricing data

### ✅ **Advanced Filtering**
- Year/Make/Model cascading dropdowns
- Price range filtering
- Body type and drive type filters
- Real-time search results

### ✅ **Performance Optimized**
- Database indexes for fast queries
- Efficient joins and filtering
- Caching with React Query
- Optimistic updates

## 🔍 Troubleshooting

### **Common Issues**

1. **"Failed to fetch" errors**
   - Check your Supabase URL and API key
   - Verify the database schema is set up
   - Check browser console for detailed errors

2. **No data showing**
   - Run the database initialization: `POST /api/init-database`
   - Check if tables exist in Supabase dashboard
   - Verify RLS policies are set to allow public read access

3. **API 404 errors**
   - Restart the development server: `npm run dev`
   - Check that API routes are in the correct location
   - Verify environment variables are loaded

### **Database Connection Test**

Visit: `http://localhost:3000/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-07-30T...",
  "environment": "development",
  "message": "Nissan Catalog API is running"
}
```

## 📊 Sample Data Structure

After initialization, you'll have:

- **3 Model Years**: 2023, 2024, 2025
- **1 Make**: Nissan
- **5 Models**: Altima, Rogue, Sentra, Maxima, Murano
- **5 Trims**: S, SR, SL, Platinum, SV
- **4 Body Types**: Sedan, SUV, Truck, Hatchback
- **4 Drive Types**: FWD, AWD, RWD, 4WD
- **10 Vehicles**: Mix of different configurations with realistic pricing

## 🎯 Next Steps

1. **Add more vehicles** to the database
2. **Implement photo management** with Supabase Storage
3. **Add user authentication** for admin features
4. **Implement real-time updates** with Supabase subscriptions
5. **Add analytics tracking** for search patterns

Your Nissan Catalog is now fully integrated with Supabase! 🎉 
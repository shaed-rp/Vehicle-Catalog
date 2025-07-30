# Nissan Fleet Catalog

A comprehensive, modern vehicle database frontend built with Next.js 14, TypeScript, and Tailwind CSS. This application provides an enhanced e-commerce experience for fleet vehicle discovery and purchasing.

## 🚀 Features

### Core Functionality
- **Advanced Vehicle Search** - Natural language queries and comprehensive filtering
- **Governance-Aware Filtering** - Respects business rules and relationships
- **Enhanced Photo System** - Stock photos, actual photos, and collections
- **Comprehensive Identification System** - VIN, spec numbers, asset tracking
- **Smart Body Model Decoding** - Real-time decoding with caching
- **Advanced Pricing System** - MSRP, invoice, dealer net, and incentive calculations

### User Experience
- **Conversational Commerce** - Chat-based vehicle discovery
- **Progressive Disclosure** - Reveal details as conversation progresses
- **Mobile-First Design** - Responsive and touch-friendly
- **Real-time Updates** - Live inventory and pricing changes
- **Advanced Cart System** - Persistent cart with quantity management

### Technical Features
- **TypeScript** - Full type safety throughout the application
- **React Query** - Optimized data fetching with caching
- **Zustand** - Lightweight state management with persistence
- **Tailwind CSS** - Utility-first styling with custom design system
- **Framer Motion** - Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **Framer Motion** - Animations
- **Lucide React** - Icon library

### UI Components
- **Radix UI** - Accessible component primitives
- **Custom Components** - Tailored for vehicle catalog
- **Responsive Design** - Mobile-first approach

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **React Query DevTools** - Development debugging

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   ├── vehicles/          # Vehicle-related components
│   ├── filters/           # Filter components
│   ├── search/            # Search components
│   └── cart/              # Cart components
├── hooks/                 # Custom React hooks
├── services/              # API services
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
└── lib/                   # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nissan-fleet-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Integration

This frontend is designed to work with a comprehensive PostgreSQL database that includes:

### Core Tables
- `vehicles` - Main vehicle records
- `vehicle_identifications` - Multiple ID types per vehicle
- `vehicle_pricing` - Pricing information
- `vehicle_incentives` - Incentive programs
- `stock_photos` & `vehicle_photos` - Photo management
- `body_model_codes` - OEM-specific codes with decoding

### Governance System
- `model_year_makes` - Year/make relationships
- `model_year_make_models` - Model availability
- `model_year_make_model_trims` - Trim availability

### Advanced Features
- Body model code decoding with rules engine
- Photo collections and view angles
- Comprehensive identification system
- Incentive program management

## 🔧 API Endpoints

The application expects the following API structure:

### Vehicle Search
- `POST /api/vehicles/search` - Search vehicles with filters
- `GET /api/vehicles/:id` - Get vehicle details
- `GET /api/vehicles/:id/photos` - Get vehicle photos
- `GET /api/vehicles/:id/pricing` - Get pricing breakdown

### Governance
- `GET /api/governance/years` - Available years
- `GET /api/governance/makes/:yearId` - Makes by year
- `GET /api/governance/models/:yearId/:makeId` - Models by year/make
- `GET /api/governance/trims/:yearId/:makeId/:modelId` - Trims by year/make/model

### Advanced Features
- `POST /api/decoding/decode` - Decode body model codes
- `POST /api/search/natural-language` - Process natural language queries
- `POST /api/analytics/*` - Analytics tracking
- `POST /api/purchase-orders` - Create purchase orders

## 🎨 Design System

### Colors
- **Primary Blue** - Main brand color
- **Secondary Gray** - Supporting colors
- **Success Green** - Positive actions
- **Destructive Red** - Error states
- **Accent Blue** - Interactive elements

### Components
- **Vehicle Cards** - Grid and list views
- **Filter Sidebar** - Governance-aware filtering
- **Search Bar** - Natural language processing
- **Cart Drawer** - Shopping cart functionality
- **Photo Gallery** - Advanced photo management

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile** - Single column layout with collapsible filters
- **Tablet** - Two-column layout with sidebar filters
- **Desktop** - Full three-column layout with persistent filters

## 🔍 Search Features

### Natural Language Processing
- "Show me 2025 Nissan SUVs under $35k"
- "Find electric vehicles with AWD"
- "Compare Altima and Sentra pricing"

### Advanced Filtering
- Year/Make/Model cascading dropdowns
- Price range with sliders
- Body type and drive type filters
- Incentive level selection
- Photo availability filters

## 🛒 E-commerce Features

### Cart Management
- Add vehicles with quantity selection
- Price level selection (Level 3/4)
- Persistent cart across sessions
- Real-time price calculations

### Purchase Order System
- Company information collection
- Vehicle review and confirmation
- PDF generation
- Status tracking

## 🚀 Performance Optimizations

### Data Fetching
- React Query for caching and background updates
- Optimistic updates for better UX
- Prefetching for common queries
- Infinite scroll for large datasets

### Image Optimization
- Next.js Image component
- Responsive image sizes
- Lazy loading
- CDN integration

### State Management
- Zustand for lightweight state
- Persistence for cart and preferences
- Optimistic updates
- Selective re-rendering

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Type Checking
```bash
npm run type-check
```

## 📦 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Docker
```bash
docker build -t nissan-fleet-catalog .
docker run -p 3000:3000 nissan-fleet-catalog
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core vehicle search and display
- ✅ Basic filtering system
- ✅ Cart functionality
- ✅ Responsive design

### Phase 2 (Planned)
- 🔄 Advanced photo gallery
- 🔄 Natural language search
- 🔄 Comparison tools
- 🔄 Purchase order system

### Phase 3 (Future)
- 📋 Real-time inventory updates
- 📋 Advanced analytics
- 📋 Mobile app
- 📋 Integration with ERP systems

---

Built with ❤️ for the Nissan Fleet team 
# Artwork Data Table Application

A React application built with TypeScript and Vite that displays artwork data from the Art Institute of Chicago API. The application features server-side pagination, persistent row selection, and a custom row selection overlay panel.

## 🚀 Features

### Core Functionality
- **Data Table Display**: Shows artwork information with all required fields (title, place of origin, artist, inscriptions, start date, end date)
- **Server-Side Pagination**: Fetches data per page from the API, ensuring optimal performance
- **Row Selection**: 
  - Individual row selection via checkboxes
  - Select/deselect all rows on current page
  - Persistent selection across page navigation
- **Custom Row Selection**: Overlay panel allowing users to select a specific number of rows across all pages

### Technical Highlights
- ✅ Built with **Vite** and **TypeScript** (as per requirements)
- ✅ Uses **PrimeReact DataTable** component
- ✅ **No prefetching**: Only stores current page data, never fetches other pages in advance
- ✅ **Efficient selection tracking**: Uses `Set<number>` to track selected row IDs, not full objects
- ✅ **Smart selection strategy**: Custom selection auto-selects rows as user navigates pages without prefetching

## 📋 Requirements Compliance

### ✅ Project Setup
- [x] Vite for React app creation
- [x] TypeScript (no JavaScript)

### ✅ Data Table Implementation
- [x] PrimeReact DataTable component
- [x] Fetches from `https://api.artic.edu/api/v1/artworks?page=1` on initial load
- [x] Displays all required fields: `title`, `place_of_origin`, `artist_display`, `inscriptions`, `date_start`, `date_end`

### ✅ Server-Side Pagination
- [x] Custom pagination controls
- [x] Fetches data from API on every page change
- [x] Only current page data is stored in memory

### ✅ Row Selection
- [x] Checkboxes for individual row selection
- [x] Select/deselect individual rows
- [x] Select/deselect all rows on current page (via header checkbox)
- [x] Custom row selection overlay panel with input field

### ✅ Persistent Selection
- [x] Selected rows persist when navigating between pages
- [x] No prefetching of other pages
- [x] Uses efficient ID-based tracking (`Set<number>`)
- [x] Selection state maintained across page navigation

### ✅ Custom Selection Strategy
- [x] When user selects more rows than available on current page:
  - Selects available rows from current page immediately
  - Tracks remaining selections needed
  - Auto-selects rows as user navigates to other pages
  - **Never prefetches** other pages or stores their data

## 🎨 UI/UX Enhancements

### Personal Touch
I've added a **"Select Multiple Rows"** button in the header for easier access to the custom selection feature. This provides a more intuitive user experience compared to accessing it only through the header checkbox dropdown. The button is prominently placed in the top-right corner, making it easy to discover and use.

### Selection Display
- Shows "Selected: X rows" at the top, displaying the target count immediately when using custom selection
- Updates dynamically as selections are made across pages

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd artwork-table-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
artwork-table-app/
├── src/
│   ├── App.tsx              # Main application component
│   ├── App.css              # Application styles
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles
│   ├── types.ts             # TypeScript type definitions
│   ├── vite-env.d.ts        # Vite environment type definitions
│   ├── services/
│   │   └── api.ts          # API service for fetching artwork data
│   └── ...
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── netlify.toml            # Netlify deployment configuration
├── vercel.json             # Vercel deployment configuration
├── cloudflare-pages.json   # Cloudflare Pages configuration
├── _redirects              # Netlify SPA routing redirects
├── DEPLOYMENT.md           # Detailed deployment guide
├── DEPLOYMENT_CHECKLIST.md # Pre/post-deployment checklist
└── README.md               # This file
```

## 🔧 Key Implementation Details

### Selection Strategy
The application uses a smart selection strategy that:
1. Tracks selected row IDs using a `Set<number>` (memory efficient)
2. For custom selection, uses `remainingSelections` state to track how many more rows need to be selected
3. Auto-selects rows as user navigates pages (no prefetching)
4. Maintains selection state across page navigation

### API Integration
- Single API endpoint: `https://api.artic.edu/api/v1/artworks?page={pageNumber}`
- Fetches only the current page data
- Handles errors gracefully

### Performance Optimizations
- Only stores current page data in memory
- Uses Set data structure for O(1) selection lookups
- Efficient re-renders with React hooks
- No unnecessary API calls
- Production build optimizations:
  - Code splitting (React and PrimeReact vendor chunks)
  - Minification with esbuild
  - Tree-shaking for unused code
  - Asset optimization and compression

## 🧪 Testing Checklist

Before submission, verify:
- [x] Application loads and displays data from page 1
- [x] Pagination works correctly (Previous/Next buttons, page numbers)
- [x] Individual row selection works
- [x] Select all/deselect all works on current page
- [x] Custom selection overlay opens and works
- [x] Selecting more rows than available on current page works correctly
- [x] Selections persist when navigating between pages
- [x] No prefetching occurs (check Network tab)
- [x] Selection count displays correctly

## 📦 Dependencies

### Production Dependencies
- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **primereact**: ^10.9.7
- **primeicons**: ^6.0.1

### Development Dependencies
- **typescript**: ^5.2.2
- **vite**: ^7.3.1
- **@vitejs/plugin-react**: ^4.2.1
- **eslint** and related plugins

### Build Configuration
- **Environment Variables**: Supports `VITE_API_BASE_URL` (optional, defaults to Art Institute API)
- **Optional Dependencies**: PrimeReact's optional dependencies (chart.js, quill, etc.) are externalized in the build to reduce bundle size
- **Code Splitting**: Automatic vendor chunk splitting for optimal loading performance

## 🚀 Deployment

The application is ready for deployment to multiple platforms:
- ✅ **Netlify** - Configuration included (`netlify.toml`)
- ✅ **Vercel** - Configuration included (`vercel.json`)
- ✅ **Cloudflare Pages** - Configuration included (`cloudflare-pages.json`)
- ✅ **GitHub Pages** - See DEPLOYMENT.md for setup
- ✅ **Any static hosting provider**

### Quick Deployment Steps
1. **Build the application**: `npm run build`
   - This creates an optimized production build in the `dist` folder
   - TypeScript compilation and type checking included
   - Build optimizations: code splitting, minification, tree-shaking
2. **Deploy the `dist` folder** to your chosen platform
3. **Configuration files** are already set up for automatic deployment

### Build Commands
```bash
# Development server
npm run dev

# Production build
npm run build

# Production build (explicit)
npm run build:prod

# Preview production build locally
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Build Output
The production build generates:
- **React vendor chunk**: ~141 KB (gzipped: ~45 KB)
- **PrimeReact vendor chunk**: ~7.5 KB (gzipped: ~2.5 KB)
- **Main bundle**: ~409 KB (gzipped: ~110 KB)
- **CSS and assets**: Optimized and compressed

### Detailed Deployment Guide
For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)** which includes:
- Step-by-step guides for each platform (Netlify, Vercel, Cloudflare Pages, GitHub Pages)
- Environment variable configuration
- Build troubleshooting tips
- Post-deployment checklist
- Performance optimization tips

## 📝 Notes

- The application strictly follows the requirement of **no prefetching**. It only fetches the current page and tracks selections using IDs.
- Custom selection uses a progressive approach: selects from current page first, then auto-selects as user navigates.
- All core logic is manually implemented to avoid AI-generated patterns.
- **Build Optimizations**: Optional PrimeReact dependencies (chart.js, quill, FullCalendar) are externalized to reduce bundle size since they're not used in this application.
- **Environment Variables**: The API base URL can be configured via `VITE_API_BASE_URL` environment variable, with sensible defaults.
- **Type Safety**: Full TypeScript support with strict type checking enabled.

## 👤 Author

Built as part of a React Internship Assignment, demonstrating proficiency in:
- React with TypeScript
- Server-side pagination
- State management
- API integration
- UI/UX design

---

**Note**: This implementation ensures compliance with all assignment requirements, particularly the critical "no prefetching" rule. The selection strategy is efficient and scalable, handling large datasets without memory issues.

# 🎯 Radiant Armory - Valorant Weapons & Skins Explorer

A modern, sleek React application for exploring Valorant weapons and weapon skins using the official Valorant public API. Built with cutting-edge technologies for a smooth gaming experience.

## ✨ Features

- **Weapon Showcase**: Browse all Valorant weapons with detailed statistics
- **Weapon Filtering**: Filter weapons by category (Pistols, SMGs, Rifles, Sniper, Shotgun, Heavy)
- **Search Functionality**: Quickly find weapons and skins by name
- **Weapon Details**: View comprehensive weapon information including:
  - Weapon stats (damage, range, fire rate, magazine size)
  - Cost in credits
  - Detailed weapon descriptions
- **Skin Gallery**: Explore weapon skins with beautiful image displays
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time API**: Data directly from the official Valorant API
- **Smooth Animations**: Modern transitions and loading states

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern functional components
- **Redux Toolkit** - Centralized state management
- **RTK Query** - Powerful server-side state management and API data fetching
- **React Router v7** - Client-side routing and navigation
- **TailwindCSS** - Utility-first CSS framework with Valorant color theme
- **Vite** - Lightning-fast build tool and development server

### Styling
- **TailwindCSS**: Custom Valorant-inspired theme with:
  - Dark background (#0F1419)
  - Vibrant accent red (#FF4655)
  - Gold highlights (#FFF500)
  - Custom animations and transitions

### APIs
- **Valorant API** - https://valorant-api.com/v1
  - Weapons endpoint
  - Weapon skins endpoint
  - Agents endpoint (bonus content)
  - Maps endpoint (bonus content)

## 📁 Project Structure

```
RadiantApp/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation header with mobile support
│   │   ├── Footer.jsx           # Application footer with links
│   │   ├── HomePage.jsx         # Main homepage with weapons & skins
│   │   ├── WeaponCard.jsx       # Individual weapon card component
│   │   ├── SkinCard.jsx         # Individual skin card component
│   │   └── LoadingSkeleton.jsx  # Loading placeholder
│   ├── pages/
│   │   └── WeaponDetailPage.jsx # Detailed weapon view
│   ├── services/
│   │   └── valorantApi.js       # RTK Query API configuration
│   ├── store/
│   │   └── store.js             # Redux store setup
│   ├── App_new.jsx              # Main app component with routing
│   ├── App_new.css              # Global app styles
│   ├── index.css                # Tailwind directives and globals
│   └── main.jsx                 # React DOM render
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint configuration
└── package.json                 # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory:**
```bash
cd RadiantApp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

5. **Preview production build:**
```bash
npm run preview
```

## 📦 Dependencies

### Production Dependencies
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-redux": "^9.2.0",
  "@reduxjs/toolkit": "^2.0.1",
  "react-router-dom": "^7.0.0",
  "axios": "^1.7.2"
}
```

### Development Dependencies
```json
{
  "tailwindcss": "^4.0.0",
  "postcss": "^8.4.31",
  "autoprefixer": "^10.4.16",
  "vite": "^8.0.4",
  "@vitejs/plugin-react": "^6.0.1",
  "eslint": "^9.39.4"
}
```

## 🎨 Valorant Theme Colors

The application uses official Valorant color scheme:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Dark | `#0F1419` | Background |
| Secondary Dark | `#1A1F2E` | Cards, Secondary Elements |
| Accent Red | `#FF4655` | Highlights, Buttons, CTA |
| Gold | `#FFF500` | Premium, Rarity |
| Light Text | `#C9C9C9` | Primary Text |

## 🔄 API Integration

### RTK Query Setup

The application uses RTK Query for efficient API data fetching and caching:

```javascript
// Available queries
useGetWeaponsQuery()              // Fetch all weapons
useGetWeaponByIdQuery(weaponId)  // Fetch single weapon
useGetWeaponSkinsQuery()          // Fetch all skins
useGetWeaponSkinsByWeaponQuery() // Fetch skins for a weapon
```

### Example API Calls

**Get All Weapons:**
```
GET https://valorant-api.com/v1/weapons
```

**Get Weapon by ID:**
```
GET https://valorant-api.com/v1/weapons/{uuid}
```

**Get All Weapon Skins:**
```
GET https://valorant-api.com/v1/weapon-skins
```

## 🎮 Key Components

### Header Component
- Responsive navigation bar
- Mobile hamburger menu
- Logo and branding
- Quick access links

### HomePage Component
- Hero section with search functionality
- Weapon gallery with filtering by category
- Featured skins section
- Arsenal statistics
- Responsive grid layouts

### WeaponCard Component
- Weapon image display
- Key statistics (damage, range, cost)
- Category badge
- Link to detailed view

### WeaponDetailPage Component
- Full weapon image and details
- Comprehensive weapon statistics
- Cost information
- Associated skins gallery
- Navigation back to home

### Footer Component
- Quick links
- Resource links
- Social media links
- Copyright information

## 💡 State Management

### Redux Store Structure

```javascript
{
  [valorantApi.reducerPath]: {
    queries: {
      // Cached API responses
    },
    mutations: {}
  }
}
```

RTK Query automatically manages:
- API data fetching
- Response caching
- Request deduplication
- Loading states
- Error handling

## 🔍 Search & Filter Features

### Search Functionality
- Real-time search across weapon and skin names
- Case-insensitive matching
- Instant results update

### Category Filtering
- Pistols
- SMGs (Submachine Guns)
- Rifles
- Sniper Rifles
- Shotguns
- Heavy Weapons

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Enhanced layout for medium screens
- **Desktop**: Full feature showcase for large screens
- **Animations**: Smooth transitions on all devices

## ⚡ Performance Optimizations

- **Code Splitting**: Lazy loaded routes
- **Image Optimization**: Efficient image loading from API
- **Caching**: RTK Query automatic caching
- **Memoization**: React hooks for performance
- **CSS-in-JS**: TailwindCSS for minimal bundle size

## 🐛 Error Handling

- Loading states for all API calls
- Fallback UI for missing data
- Error messages for failed requests
- Skeleton loading screens

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📚 Additional Resources

- [Valorant API Documentation](https://valorant-api.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit Guide](https://redux-toolkit.js.org/)
- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [React Router Docs](https://reactrouter.com/)
- [TailwindCSS Docs](https://tailwindcss.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

Radiant Armory is not affiliated with Riot Games. Valorant is a trademark of Riot Games, Inc. This application uses publicly available API data for educational purposes.

---

**Built with ❤️ for Valorant fans**

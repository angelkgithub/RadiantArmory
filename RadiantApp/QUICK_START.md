# 🚀 Quick Start Guide - Radiant Armory

## Installation & Setup

### 1. Navigate to the project directory
```bash
cd RadiantApp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The application will start at `http://localhost:5173` (default Vite port)

### 4. Open in browser
- Navigate to http://localhost:5173
- You should see the Radiant Armory homepage with weapons and skins!

## Project Structure

```
src/
├── components/
│   ├── Header.jsx           # Navigation bar
│   ├── Footer.jsx           # Footer with links
│   ├── HomePage.jsx         # Main homepage
│   ├── WeaponCard.jsx       # Weapon card component
│   ├── SkinCard.jsx         # Skin card component
│   └── LoadingSkeleton.jsx  # Loading placeholder
├── pages/
│   └── WeaponDetailPage.jsx # Weapon detail view
├── data/
│   └── mockData.js          # Mock weapons and skins data
├── App_new.jsx              # Main app component
├── App_new.css              # App styles
├── index.css                # Global styles
└── main.jsx                 # React entry point
```

## Features Implemented

✅ **Responsive Design**
- Mobile-first approach
- Works on all screen sizes
- Hamburger menu for mobile

✅ **Weapon Showcase**
- Display all weapons in a grid
- Filter by weapon category
- Search functionality

✅ **Weapon Details**
- Click on any weapon to view details
- Display weapon statistics (damage, range, fire rate, magazine)
- Show weapon cost
- Display related skins

✅ **Skin Gallery**
- Beautiful skin display grid
- Chroma information
- Organized layout

✅ **Modern UI**
- Valorant-inspired color scheme
- Smooth animations
- Hover effects
- Glass-morphism elements

## Styling System

### Colors Used
- **Primary Dark**: `#0F1419` - Main background
- **Secondary Dark**: `#1A1F2E` - Cards and secondary elements
- **Accent Red**: `#FF4655` - Primary accent and highlights
- **Gold**: `#FFF500` - Premium elements and accents
- **Light Text**: `#C9C9C9` - Primary text color

### Custom CSS Classes
- `.valorant-btn` - Primary button
- `.valorant-btn-secondary` - Secondary button
- `.valorant-card` - Card component
- `.valorant-input` - Input field

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm lint
```

## Current Data

The app currently uses mock data located in `src/data/mockData.js`:

**Mock Weapons:**
- Vandal (Rifle)
- Phantom (Rifle)
- Operator (Sniper)
- Spectre (SMG)
- Classic (Pistol)
- Judge (Shotgun)

**Mock Skins:**
- Vandal | Valorant
- Phantom | Elderflame
- Operator | Dragon
- Vandal | Reaver

## Next Steps (Optional Enhancements)

1. **Integrate Real API**
   - Replace mock data with actual Valorant API calls
   - Add Redux Toolkit for state management
   - Implement RTK Query for data fetching

2. **Add More Features**
   - Agent showcase
   - Map information
   - Trading/marketplace interface
   - User authentication
   - Wishlist/favorites

3. **Performance**
   - Add code splitting
   - Implement lazy loading
   - Optimize images

4. **Testing**
   - Add unit tests with Vitest
   - Add component tests
   - Add E2E tests with Playwright

## Troubleshooting

### Port already in use
If port 5173 is already in use:
```bash
npm run dev -- --port 3000
```

### Clear dependencies and reinstall
```bash
rm -r node_modules package-lock.json
npm install
```

### Build issues
```bash
npm run build
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Resources

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Valorant API](https://valorant-api.com/)

## Notes

- The app currently uses mock data for quick development
- No API calls are made by default
- All styling is done with TailwindCSS
- No external component libraries are used
- Redux and RTK Query files are included for future integration

---

**Happy exploring! 🎮**

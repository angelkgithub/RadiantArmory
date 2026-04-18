# Quick Reference Guide - Radiant Armory

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📍 Route Map

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Dashboard with feature overview |
| `/quiz` | QuizPage | Personalized agent recommendation |
| `/loadout` | LoadoutPage | Weapon & skin customization |
| `/strategy` | StrategyPage | Tactical strategy generation |
| `/planner` | MapPlannerPage | Interactive map drawing tool |
| `/collection` | CollectionPage | Skin inventory tracker |
| `/weapon/:weaponId` | WeaponDetailPage | Individual weapon details |

## 🎨 Design Colors

```css
--primary-red: #ff4654;      /* Main actions, buttons, accents */
--dark-red: #ba3a46;         /* Hover states, secondary accents */
--background: #111823;       /* Main background */
--text-white: #ffffff;       /* Primary text */
--text-gray: #999999;        /* Secondary text */
```

## 🔧 Common Code Patterns

### Fetch API Data
```jsx
import { useGetAllAgentsQuery } from '../services/valorantApi';

const { data: agents = [], isLoading, error } = useGetAllAgentsQuery();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error loading data</div>;
```

### Responsive Grid Layout
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  {items.map(item => <Card key={item.id} item={item} />)}
</div>
```

### Styled Button
```jsx
<button className="px-4 py-2 bg-[#ff4654] text-white font-bold 
  hover:bg-[#ba3a46] transition-all rounded">
  Click Me
</button>
```

### Feature Card
```jsx
<div className="bg-gradient-to-br from-[#ff4654]/20 to-[#ba3a46]/20 
  border-2 border-[#ff4654] p-6 rounded-lg hover:opacity-80 transition-all">
  <h3 className="text-2xl font-bold text-white">Feature Title</h3>
  <p className="text-gray-300">Feature description</p>
</div>
```

## 📊 Data Structure Examples

### Agent Object
```javascript
{
  uuid: "string",
  displayName: "Agent Name",
  description: "Agent description",
  displayIcon: "image_url",
  role: {
    displayName: "Duelist/Sentinel/etc",
    displayIcon: "role_icon_url"
  }
}
```

### Weapon Object
```javascript
{
  uuid: "string",
  displayName: "Weapon Name",
  category: "EEquippableCategory::Type",
  cost: 2100,
  displayIcon: "weapon_icon_url"
}
```

### Skin Object
```javascript
{
  uuid: "string",
  displayName: "Skin Name",
  displayIcon: "skin_icon_url",
  cost: 1775,
  rarity: "EEquippableRarity::Premium",
  weaponId: "weapon_uuid"
}
```

### Map Object
```javascript
{
  uuid: "string",
  displayName: "Map Name",
  displayIcon: "map_icon_url",
  splash: "map_splash_url",
  mapUrl: "map_url"
}
```

## 🎯 Component Best Practices

1. **Always use RTK Query hooks** for API calls
2. **Handle loading/error states** in every component
3. **Use Tailwind classes** for styling (no inline styles)
4. **Keep components small** and focused
5. **Extract reusable logic** into custom hooks
6. **Use meaningful names** for variables and functions
7. **Add comments** for complex logic
8. **Test responsive design** on multiple breakpoints

## 📝 Tailwind Class Hierarchy

### Colors
- Background: `bg-[#111823]`
- Primary Accent: `bg-[#ff4654]`
- Dark Accent: `bg-[#ba3a46]`
- Transparent Red: `bg-[#ff4654]/20` (with opacity)

### Text
- White: `text-white`
- Gray: `text-gray-300` / `text-gray-400`
- Accent: `text-[#ff4654]`

### Effects
- Hover: `hover:bg-[#ff4654]/20`
- Transition: `transition-all duration-300`
- Transform: `transform scale-105` / `translate-x-2`
- Border: `border-2 border-[#ff4654]`

## 🐛 Debugging Tips

1. **Check Console**: `F12` → Console tab for errors
2. **React DevTools**: Install React DevTools browser extension
3. **Network Tab**: Check API calls and responses
4. **Redux DevTools**: Monitor state changes
5. **Disable Cache**: Disable browser cache in DevTools

## 📱 Responsive Breakpoints

```tailwind
sm: 640px
md: 768px  (tablet)
lg: 1024px (desktop)
xl: 1280px (large desktop)
```

## ✨ Hover Effects Applied

- Scale: `transform group-hover:scale-110`
- Border Color: `group-hover:border-[#ff4654]`
- Opacity: `group-hover:opacity-80`
- Background: `group-hover:bg-[#ff4654]/10`
- Text Color: `group-hover:text-[#ff4654]`

## 🔄 State Management Flow

1. Component requests data via RTK Query hook
2. Redux middleware caches response
3. Component receives data and renders UI
4. User interactions trigger state updates
5. Component re-renders with new data

## 🎬 Animation Patterns

### Fade In
```jsx
className="opacity-0 animate-fadeIn"
// keyframes handled by Tailwind
```

### Hover Scale
```jsx
className="transition-transform duration-300 hover:scale-105"
```

### Glow on Hover
```jsx
className="border border-gray-600 hover:border-[#ff4654] hover:shadow-lg"
```

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Components not showing | Check if Route is added to App.jsx |
| Styling not working | Verify Tailwind class names are correct |
| API calls failing | Check browser Network tab for CORS errors |
| Props not updating | Ensure state is managed properly with hooks |
| Build failing | Clear node_modules and reinstall |

## 📚 File Organization

```
Logic & Data:
├── services/           (API calls, RTK Query)
├── store/              (Redux configuration)
└── hooks/              (Custom React hooks)

UI Components:
├── components/         (Reusable components)
├── pages/              (Page-level components)
└── assets/             (Images, icons)

Configuration:
├── vite.config.js      (Vite settings)
├── tailwind.config.js  (Tailwind customization)
├── eslint.config.js    (Code quality)
└── package.json        (Dependencies)
```

## 🎯 Performance Tips

1. Use `useMemo` for expensive calculations
2. Use `useCallback` for event handlers passed to children
3. Lazy load images with `loading="lazy"`
4. Close unused browser tabs during development
5. Run `npm run build` to check bundle size

---

**Version**: 1.0.0  
**Last Updated**: April 18, 2026

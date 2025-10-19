# Responsive Sidebar Component for LMS

This implementation provides a fully responsive sidebar component with smooth animations, mobile-first design, and persistent state management.

## 🚀 Features Implemented

### ✅ Core Requirements
- **Fixed positioning**: Sidebar stays fixed on the left side across all routes
- **Global layout**: Positioned above all routes without breaking existing layouts
- **Toggle functionality**: Smooth open/close with hamburger button
- **Responsive design**: Desktop collapse/expand + mobile overlay modes
- **Smooth animations**: Framer Motion powered transitions
- **Persistent state**: Sidebar state maintained across route navigation

### ✅ Navigation Items
- Question Bank (`/question-bank`)
- Video Solution (`/video-solution`) 
- Test Series (`/test-series`)
- PYQ (`/pyq-bundles`)
- MCQ of the Day (`/mcq-of-the-day`)
- PEARL (`/pearl`)
- Courses (`/allcourses`)

### ✅ Technology Stack
- **React** with hooks and context
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Icons** for iconography

## 📁 File Structure

```
src/
├── contexts/
│   └── SidebarContext.jsx          # Global sidebar state management
├── components/
│   ├── Sidebar.jsx                 # Main sidebar component
│   └── Layout.jsx                  # Layout wrapper with sidebar
├── pages/
│   ├── QuestionBank.jsx           # Page components for new routes
│   ├── VideoSolution.jsx
│   ├── TestSeries.jsx
│   ├── MCQOfTheDay.jsx
│   └── Pearl.jsx
└── App.jsx                         # Updated with new routes & layout
```

## 🔧 Implementation Details

### 1. SidebarContext.jsx
Manages global sidebar state with responsive behavior:
- `isOpen`: Controls sidebar visibility
- `isCollapsed`: Desktop-only collapsed state (icons only)
- `isMobile`: Automatically detects mobile/tablet devices
- Auto-responsive: Adapts behavior based on screen size

### 2. Sidebar.jsx
Main sidebar component featuring:
- **Desktop mode**: Collapsible (280px ↔ 80px width)
- **Mobile mode**: Overlay with backdrop (0px ↔ 280px width)
- **Active route highlighting**: Current page highlighted in blue
- **Hover effects**: Icon scaling and tooltip on collapsed state
- **Click outside**: Mobile sidebar closes when clicking backdrop

### 3. Layout.jsx
Wrapper component that:
- Renders sidebar globally
- Adjusts main content margin based on sidebar state
- Smooth margin transitions with Framer Motion

### 4. App.jsx Integration
- Wrapped entire app in `SidebarProvider`
- Added `Layout` component around all routes
- Added new sidebar navigation routes

## 🎯 Responsive Behavior

### Desktop (≥768px)
- Sidebar open by default
- Toggle button collapses to icons-only mode (80px width)
- Main content margin adjusts automatically
- Tooltips show on collapsed state hover

### Mobile/Tablet (<768px)
- Sidebar closed by default
- Overlay mode slides from left
- Toggle button shows in fixed position when closed
- Backdrop closes sidebar when clicked
- No margin adjustment on main content

## 🎨 Design Features

### Visual Design
- Modern gradient logo
- Color-coded menu icons
- Smooth hover animations
- Clean typography with Outfit font
- Consistent spacing and borders

### Animation Details
- 300ms duration for all transitions
- `easeInOut` timing function
- Framer Motion `AnimatePresence` for smooth mount/unmount
- Coordinated sidebar and content animations

## 📱 Usage Examples

### Basic Implementation
The sidebar is automatically available across all routes once the `SidebarProvider` and `Layout` are set up in App.jsx:

```jsx
function App() {
  return (
    <SidebarProvider>
      <Layout>
        <Routes>
          {/* Your existing routes */}
        </Routes>
      </Layout>
    </SidebarProvider>
  );
}
```

### Accessing Sidebar State
Use the `useSidebar` hook in any component:

```jsx
import { useSidebar } from '../contexts/SidebarContext';

function MyComponent() {
  const { isOpen, toggleSidebar, isMobile } = useSidebar();
  
  return (
    <button onClick={toggleSidebar}>
      {isMobile ? 'Toggle Menu' : 'Collapse Sidebar'}
    </button>
  );
}
```

### Adding New Menu Items
Edit the `menuItems` array in `Sidebar.jsx`:

```jsx
const menuItems = [
  // ... existing items
  {
    id: 'new-feature',
    label: 'New Feature',
    icon: FaNewIcon,
    path: '/new-feature',
    color: 'text-teal-500'
  }
];
```

## 🧪 Testing Instructions

### Desktop Testing
1. Load the app on desktop (≥768px width)
2. Sidebar should be open by default
3. Click toggle button - sidebar collapses to icons only
4. Hover over collapsed icons - tooltips should appear
5. Navigate between routes - sidebar state persists

### Mobile Testing
1. Load app on mobile (<768px width) or use browser dev tools
2. Sidebar should be closed by default
3. Floating toggle button appears in top-left
4. Click toggle - sidebar slides in from left with backdrop
5. Click backdrop or toggle again - sidebar slides out
6. Navigate between routes - sidebar behavior persists

### Responsive Testing
1. Resize browser window from desktop to mobile
2. Sidebar should automatically adapt behavior
3. State should be maintained appropriately for each breakpoint

## 🎛️ Customization Options

### Styling
- Edit Tailwind classes in `Sidebar.jsx` for colors/spacing
- Modify `sidebarVariants` in Framer Motion for animation timing
- Update menu item colors in the `menuItems` array

### Behavior
- Adjust breakpoint in `SidebarContext.jsx` (currently 768px)
- Modify animation duration in motion variants
- Change default states for mobile/desktop

### Content
- Add/remove menu items in `menuItems` array
- Update logo and branding in sidebar header
- Customize footer information

## 🔍 Browser Compatibility
- Modern browsers supporting CSS Grid and Flexbox
- React 19+ compatibility
- Responsive design works on all screen sizes
- Touch-friendly on mobile devices

## 📝 Notes
- All animations are optimized for performance
- State management uses React Context for minimal re-renders
- Fully accessible with keyboard navigation support
- Clean code structure for easy maintenance and extension

The sidebar is now fully functional and ready for production use! 🎉
# 🎨 Color Palette Implementation Guide

## Color Palette
- **Primary**: #128F8B (Teal) - `bg-primary-teal`, `text-primary-teal`, `border-primary-teal`
- **Background**: #FFFFFF (White) - `bg-primary-bg`
- **Text**: #000000 (Black) - `text-text-primary`
- **Secondary**: #24D4C6 (Light Teal) - `bg-secondary-teal`, `text-secondary-teal`, `border-secondary-teal`
- **Secondary Background**: #E0E0E0 (Light Gray) - `bg-secondary-bg`
- **Error**: #EA6B66 (Red/Coral) - `bg-error`, `text-error`, `border-error`

## Implementation Examples

### Buttons
```tsx
// Primary Button
<button className="bg-primary-teal text-white hover:bg-secondary-teal">
  Primary Action
</button>

// Secondary Button
<button className="bg-secondary-bg text-text-primary hover:bg-primary-teal hover:text-white border border-secondary-bg hover:border-primary-teal">
  Secondary Action
</button>

// Error Button
<button className="bg-error text-white hover:bg-error">
  Delete
</button>
```

### Cards and Containers
```tsx
// Main Card
<div className="bg-primary-bg border border-secondary-bg rounded-lg shadow-sm">
  <div className="p-6">
    <h3 className="text-text-primary font-semibold">Card Title</h3>
    <p className="text-text-primary opacity-70">Card description</p>
  </div>
</div>

// Header Section
<div className="bg-secondary-bg border-b border-secondary-bg">
  <h2 className="text-text-primary font-medium">Section Header</h2>
</div>
```

### Forms
```tsx
// Input Field
<input className="border border-secondary-bg focus:border-primary-teal focus:ring-primary-teal bg-primary-bg text-text-primary" />

// Label
<label className="text-text-primary font-medium">Field Label</label>

// Error Message
<p className="text-error text-sm">Error message here</p>
```

### Navigation
```tsx
// Navigation Link
<a className="text-primary-teal hover:text-text-primary">Navigation Link</a>

// Active Navigation
<a className="text-text-primary bg-secondary-bg">Active Link</a>
```

### Tables
```tsx
// Table Header
<thead className="bg-secondary-bg">
  <th className="text-text-primary">Header</th>
</thead>

// Table Body
<tbody className="bg-primary-bg divide-y divide-secondary-bg">
  <tr className="hover:bg-secondary-bg">
    <td className="text-text-primary">Cell content</td>
  </tr>
</tbody>
```

### Status Indicators
```tsx
// Success/Featured Badge
<span className="bg-secondary-teal text-white px-2 py-1 rounded-full text-xs">
  Featured
</span>

// Info Badge
<span className="bg-secondary-bg text-primary-teal border border-primary-teal px-2 py-1 rounded-full text-xs">
  Info
</span>

// Error Badge
<span className="bg-error text-white px-2 py-1 rounded-full text-xs">
  Error
</span>
```

## Pages to Update

### 1. ProductList.tsx
- Background: `bg-secondary-bg`
- Product cards: Use updated ProductCard component
- Search/filter controls: `bg-primary-bg` with `border-secondary-bg`

### 2. ProductDetail.tsx
- Main container: `bg-primary-bg`
- Headers: `text-text-primary`
- Buttons: Primary teal theme
- Breadcrumbs: `text-primary-teal`

### 3. LoginPage.tsx & RegisterPage.tsx
- Form container: `bg-primary-bg border border-secondary-bg`
- Input fields: `border-secondary-bg focus:border-primary-teal`
- Submit button: `bg-primary-teal hover:bg-secondary-teal`
- Links: `text-primary-teal hover:text-text-primary`

### 4. CartPage.tsx
- Cart items: `bg-primary-bg border border-secondary-bg`
- Quantity controls: `border-secondary-bg`
- Total section: `bg-secondary-bg`
- Checkout button: `bg-primary-teal hover:bg-secondary-teal`

### 5. Profile.tsx
- Profile sections: `bg-primary-bg border border-secondary-bg`
- Form fields: Standard form styling
- Save button: Primary teal theme

### 6. AdminUsers.tsx
- Table styling: Same as AdminDashboard
- Action buttons: `text-primary-teal` for edit, `text-error` for delete

## Quick Replace Patterns

### Common Replacements
- `bg-white` → `bg-primary-bg`
- `bg-gray-50` → `bg-secondary-bg`
- `text-gray-900` → `text-text-primary`
- `text-gray-600` → `text-text-primary opacity-70`
- `text-gray-500` → `text-text-primary opacity-60`
- `border-gray-200` → `border-secondary-bg`
- `bg-indigo-600` → `bg-primary-teal`
- `hover:bg-indigo-700` → `hover:bg-secondary-teal`
- `text-blue-600` → `text-primary-teal`
- `text-red-600` → `text-error`

### Hover States
- `hover:bg-gray-50` → `hover:bg-secondary-bg`
- `hover:text-gray-900` → `hover:text-text-primary`
- `hover:bg-blue-700` → `hover:bg-secondary-teal`

## Testing Checklist
- [ ] All text is readable against backgrounds
- [ ] Hover states work correctly
- [ ] Focus states are visible
- [ ] Error states use error color
- [ ] Buttons have proper contrast
- [ ] Forms are consistent
- [ ] Tables are properly styled
- [ ] Navigation is clear
# Developer Quick Reference Guide

## 🎯 Project Structure

```
src/
├── components/          # Shared components
│   ├── ErrorBoundary.tsx
│   └── Navbar.tsx
├── constants/          # Application constants
│   └── app.constants.ts
├── features/           # Feature-based modules
│   ├── dashboard/
│   ├── leads/
│   ├── login/
│   └── onboarding/
├── hooks/              # Custom React hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   └── index.ts
├── lib/                # Core libraries
│   ├── authContext.tsx
│   ├── authQueries.ts
│   ├── axios.ts
│   ├── enums.ts
│   └── firebase.ts
├── routes/             # Routing configuration
│   ├── index.tsx
│   └── routeStatics.ts
├── services/           # API services
│   └── mockAuth.ts
├── utils/              # Utility functions
│   ├── format.utils.ts
│   ├── validation.utils.ts
│   └── index.ts
├── App.tsx
└── main.tsx
```

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

---

## 📚 Common Patterns

### 1. Creating a New Feature Component

```typescript
import { memo } from 'react'
import type { FC } from 'react'

/**
 * Component description
 * @param props - Component props
 */
interface MyComponentProps {
  title: string
  onAction: () => void
}

export const MyComponent: FC<MyComponentProps> = memo(({ title, onAction }) => {
  // Component logic here
  
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  )
})

MyComponent.displayName = 'MyComponent'

export default MyComponent
```

### 2. Using Custom Hooks

```typescript
import { useDebounce, useLocalStorage, useIsMobile } from '@/hooks'

function MyComponent() {
  // Debounce search input
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  
  // Persistent state
  const [settings, setSettings] = useLocalStorage('settings', defaultSettings)
  
  // Responsive design
  const isMobile = useIsMobile()
  
  return (
    // Your JSX
  )
}
```

### 3. Using Utility Functions

```typescript
import { formatCurrency, isValidEmail, getInitials } from '@/utils'

// Format currency
const displayPrice = formatCurrency(amount) // "$1,234.56"

// Validate email
if (!isValidEmail(email)) {
  showError('Invalid email')
}

// Generate initials
const avatar = getInitials(userName) // "JD"
```

### 4. Using Constants

```typescript
import { STORAGE_KEYS, VALIDATION, ERROR_MESSAGES } from '@/constants/app.constants'

// Storage
localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))

// Validation
const emailRegex = VALIDATION.EMAIL_REGEX

// Messages
toast.error(ERROR_MESSAGES.NETWORK_ERROR)
```

---

## 🎨 Styling Guidelines

### Tailwind CSS Classes
```typescript
// ✅ Good - Semantic and organized
<div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-gray-900">Title</h1>
  </div>
</div>

// ❌ Avoid - Too many classes, hard to read
<div className="w-full h-full p-4 m-2 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
```

### Ant Design Components
```typescript
import { Button, Card, Form, Input } from 'antd'

// Use Ant Design for complex UI components
<Card title="User Info" extra={<Button>Edit</Button>}>
  <Form layout="vertical">
    <Form.Item label="Name" name="name">
      <Input />
    </Form.Item>
  </Form>
</Card>
```

---

## 🔄 State Management

### Local State (useState)
```typescript
// Simple component state
const [count, setCount] = useState(0)
const [user, setUser] = useState<User | null>(null)
```

### Server State (React Query)
```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})

// Mutate data
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

### Global State (Context)
```typescript
import { useAuth } from '@/lib/authContext'

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()
  
  return (
    // Your JSX
  )
}
```

---

## 🛡️ Error Handling

### Component Level
```typescript
try {
  await someAsyncOperation()
} catch (error) {
  console.error('Operation failed:', error)
  toast.error(ERROR_MESSAGES.SERVER_ERROR)
}
```

### Error Boundaries
```typescript
// Wrap components that might throw errors
<ErrorBoundary fallback={<CustomErrorUI />}>
  <RiskyComponent />
</ErrorBoundary>
```

---

## ♿ Accessibility

### ARIA Labels
```typescript
// Always add aria-label for screen readers
<button aria-label="Close dialog" onClick={onClose}>
  <CloseIcon />
</button>

// Use semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>
```

### Keyboard Navigation
```typescript
// Ensure keyboard accessibility
<div 
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>
```

---

## 🧪 Testing Guidelines

### Unit Tests (Example)
```typescript
import { describe, it, expect } from 'vitest'
import { formatCurrency, isValidEmail } from '@/utils'

describe('formatCurrency', () => {
  it('formats USD currency correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })
})

describe('isValidEmail', () => {
  it('validates correct email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })
  
  it('rejects invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false)
  })
})
```

---

## 🚨 Common Pitfalls to Avoid

### ❌ Don't
```typescript
// Don't use inline functions in JSX (causes re-renders)
<Button onClick={() => handleClick(id)}>Click</Button>

// Don't forget cleanup in useEffect
useEffect(() => {
  const timer = setTimeout(() => {}, 1000)
  // Missing cleanup!
}, [])

// Don't mutate state directly
user.name = 'New Name' // ❌
setUser(user)
```

### ✅ Do
```typescript
// Use useCallback for stable references
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
<Button onClick={handleClick}>Click</Button>

// Always cleanup side effects
useEffect(() => {
  const timer = setTimeout(() => {}, 1000)
  return () => clearTimeout(timer) // ✅
}, [])

// Create new objects when updating state
setUser({ ...user, name: 'New Name' }) // ✅
```

---

## 📦 Import Organization

```typescript
// 1. React imports
import { useState, useEffect, memo } from 'react'
import type { FC } from 'react'

// 2. Third-party imports
import { useQuery } from '@tanstack/react-query'
import { Button, Card } from 'antd'

// 3. Internal imports - Absolute paths
import { useAuth } from '@/lib/authContext'
import { formatCurrency } from '@/utils'
import { STORAGE_KEYS } from '@/constants/app.constants'

// 4. Relative imports
import { MyComponent } from './MyComponent'
import type { MyType } from './types'

// 5. Styles
import './styles.css'
```

---

## 🎯 Performance Tips

### 1. Use React.memo
```typescript
export const ExpensiveComponent = memo(({ data }) => {
  // Component only re-renders when data changes
})
```

### 2. Use useMemo for expensive calculations
```typescript
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value)
}, [data])
```

### 3. Use useCallback for stable function references
```typescript
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

### 4. Lazy load components
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

---

## 🔐 Security Best Practices

### 1. Never expose sensitive data
```typescript
// ❌ Don't
const API_KEY = 'secret-key-123'

// ✅ Do - Use environment variables
const API_KEY = import.meta.env.VITE_API_KEY
```

### 2. Sanitize user input
```typescript
// Always validate and sanitize
if (!isValidEmail(email)) {
  return
}
```

### 3. Use HTTPS for API calls
```typescript
// Always use HTTPS in production
const API_URL = import.meta.env.PROD 
  ? 'https://api.example.com'
  : 'http://localhost:3000'
```

---

## 📞 Getting Help

### Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Ant Design Components](https://ant.design/components/overview/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Code Review Checklist
- [ ] TypeScript types are properly defined
- [ ] Components are memoized where appropriate
- [ ] useEffect has proper cleanup
- [ ] Accessibility attributes are added
- [ ] Error handling is implemented
- [ ] Code is documented with JSDoc
- [ ] No console.logs in production code
- [ ] Constants are used instead of magic strings

---

**Happy Coding! 🚀**

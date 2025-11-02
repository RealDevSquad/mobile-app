# RDS Mobile app

### Setup guide

1. Setup your environment for Android by following this [guide](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated)
2. Setup your environment for IOS by following this [guide](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated)
3. Install [Volta](https://volta.sh/) to manage Node.js versions.
4. Install [pnpm](https://pnpm.io/) if you haven't already: `npm install -g pnpm`
5. Run `pnpm install` to install all the required dependencies.

### Running the application

1. Run `pnpm start` to start the development server.
2. Run android simulator by pressing `a` (or) run ios simulator by pressing `i` after the development server is running.

### Common Commands

#### Development

- `pnpm start` - Start the Expo development server
- `pnpm ios` - Start the development server and open iOS simulator
- `pnpm android` - Start the development server and open Android emulator
- `pnpm web` - Start the development server and open in web browser

#### Code Quality

- `pnpm lint` - Run ESLint to check for code issues
- `pnpm lint:fix` - Run ESLint and automatically fix issues
- `pnpm format` - Format code using Prettier
- `pnpm format:check` - Check if code is formatted correctly
- `pnpm test` - Run tests with coverage

#### Building

- `pnpm build:android:local` - Build Android APK locally (for preview/staging)
- `pnpm build:android:preview` - Build Android APK for preview (via EAS)
- `pnpm build:android:production` - Build Android APK for production (via EAS)

## Project Structure

This project follows a well-organized structure with clear separation of concerns. Here's an overview of the codebase organization and coding patterns:

### Directory Structure

```
mobile-app/
├── app/                    # Expo Router file-based routing
│   ├── _layout.tsx         # Root layout with providers
│   ├── (tabs)/             # Tab-based navigation screens
│   │   ├── _layout.tsx     # Tab navigation configuration
│   │   ├── home/           # Home screen
│   │   ├── tasks/          # Tasks listing screen
│   │   ├── my-tasks/       # User's personal tasks
│   │   ├── task-requests/  # Task request management
│   │   ├── extension-requests/ # Extension request screens
│   │   ├── create-task/    # Task creation screen
│   │   ├── profile/        # User profile screens
│   │   └── calendar/       # Calendar view
│   └── +not-found.tsx      # 404 fallback screen
├── api/                    # API layer - domain-based organization
│   ├── auth/               # Authentication API
│   │   ├── auth.api.ts     # API functions
│   │   └── auth.types.ts   # Type definitions
│   ├── tasks/              # Task-related API
│   │   ├── tasks.api.ts    # Task API functions
│   │   ├── tasks.types.ts  # Task types
│   │   ├── task.dto.ts     # Data transfer objects
│   │   └── tasks.schema.ts # Validation schemas
│   ├── users/              # User-related API
│   ├── task-requests/      # Task request API
│   └── extension-requests/ # Extension request API
├── components/             # Reusable UI components
│   ├── Modal/              # Modal components (grouped by feature)
│   │   ├── CustomModal.tsx
│   │   ├── TaskRequestModal.tsx
│   │   └── ...
│   ├── form/               # Form components
│   │   ├── FormInput.tsx
│   │   ├── FormDatePicker.tsx
│   │   └── FormSubmitButton.tsx
│   ├── task-card/          # Task card components
│   └── ...                 # Other standalone components
├── constants/              # App constants and configuration
│   ├── theme.ts            # Theme configuration (colors, typography, spacing)
│   ├── constants.ts        # General constants
│   └── apiConstant/        # API endpoint constants
├── store/                  # State management (Zustand)
│   ├── authStore.ts        # Authentication state
│   ├── uiStore.ts          # UI state (modals, etc.)
│   └── index.ts            # Store exports
├── hooks/                  # Custom React hooks
│   └── useCurrentUser.ts   # User data hook
├── contexts/               # React contexts
│   └── AuthProvider.tsx    # Authentication context
├── lib/                    # Library configurations
│   └── api-client.ts       # Axios client configuration
├── utils/                  # Utility functions
│   ├── authHeaders.ts      # Auth header utilities
│   └── storage.ts           # Storage utilities
├── config/                  # App configuration
│   └── app-config.ts       # Environment-based config
├── common/                  # Shared utilities
│   └── utils/              # Common utility functions
└── assets/                 # Static assets
    ├── images/             # Image files
    ├── fonts/              # Font files
    └── svgs/               # SVG components
```

### Coding Patterns and Conventions

#### 1. **API Layer Pattern**

Each domain (tasks, users, etc.) has its own folder with consistent file naming:

- `*.api.ts` - API functions following the pattern:

  ```typescript
  export const DomainApi = {
    getItems: {
      key: (params?: Type) => ['DomainApi.getItems', JSON.stringify(params)],
      fn: async (params?: Type): Promise<ResponseType> => {
        const { data } = await apiClient.get<ResponseType>('/endpoint', {
          params,
        });
        return data;
      },
    },
    // ... other methods
  };
  ```

- `*.types.ts` - TypeScript interfaces and types
- `*.dto.ts` - Data transfer object definitions
- `*.schema.ts` - Zod validation schemas (when needed)

**Example:**

```typescript:api/tasks/tasks.api.ts
export const TasksApi = {
  getTasks: {
    key: (params?: TGetTaskReqDto) => ['TasksApi.getTasks', JSON.stringify(params)],
    fn: async (params?: TGetTaskReqDto): Promise<TGetTasksDto> => {
      const { data } = await apiClient.get<TGetTasksDto>('/tasks', { params });
      return data;
    },
  },
};
```

#### 2. **Component Pattern**

- **Location**: Components go in `components/` directory
- **Grouping**: Related components in subdirectories (e.g., `Modal/`, `form/`, `task-card/`)
- **Exports**: Named exports with default export fallback
- **Props**: TypeScript interfaces defined above component or in separate types file
- **Styling**: StyleSheet at the bottom of the file, using theme constants
- **Structure**:
  1. Imports (external first, then internal with `@/` alias)
  2. Type/Interface definitions
  3. Component function
  4. Styles (StyleSheet.create at bottom)

**Example:**

```typescript:components/task-card/TaskCard.tsx
import { TaskDTO } from '@/api/tasks/task.dto';
import { theme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type TaskCardProps = {
  task: TaskDTO;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <View style={styles.card}>
      {/* Component content */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },
});
```

#### 3. **File-based Routing (Expo Router)**

- Routes defined by file structure in `app/` directory
- `_layout.tsx` files define layout components for route groups
- Dynamic routes use `[param].tsx` syntax
- Tab navigation in `app/(tabs)/` directory

**Example:**

```typescript:app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { theme } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary[500],
        // ... other options
      }}
    >
      <Tabs.Screen name="home" />
      {/* ... other screens */}
    </Tabs>
  );
}
```

#### 4. **State Management (Zustand)**

- Stores in `store/` directory
- Each domain has its own store file
- Uses `persist` middleware for persistence when needed
- Exports hooks for accessing store state

**Example:**

```typescript:store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

#### 5. **Import Patterns**

- Use `@/` alias for absolute imports (configured in `tsconfig.json`)
- Import order:
  1. External libraries (`react`, `react-native`, `expo-router`, etc.)
  2. Internal absolute imports (`@/api`, `@/components`, `@/constants`, etc.)
  3. Relative imports (only when necessary)

**Example:**

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { TasksApi } from '@/api/tasks/tasks.api';
import { theme } from '@/constants/theme';
import TaskCard from '@/components/task-card/TaskCard';
```

#### 6. **TypeScript Conventions**

- Type prefixed with `T` for API types (e.g., `TGetTasksDto`, `TUserResponse`)
- Use type for component props
- Strict TypeScript enabled in `tsconfig.json`
- All API responses and requests are typed
- Optional properties use `?` modifier

**Example:**

```typescript
export type TGetTasksDto = {
  message: string;
  tasks: TaskDTO[];
  count: number;
};

export type TaskCardProps = {
  task: TaskDTO;
  onPress?: () => void;
};
```

#### 7. **Styling Patterns**

- Always use `theme` constants from `@/constants/theme`
- StyleSheet created at the bottom of component files
- Use theme spacing, colors, typography, and radius values
- No inline styles unless necessary for dynamic values

**Example:**

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
});
```

#### 8. **React Query Usage**

- Use `useQuery` for data fetching
- Use `useMutation` for mutations
- Query keys follow pattern: `['DomainApi.method', ...params]`
- Invalidate queries on mutations

**Example:**

```typescript
const { data, isLoading } = useQuery({
  queryKey: TasksApi.getTasks.key(params),
  queryFn: () => TasksApi.getTasks.fn(params),
});

const mutation = useMutation({
  mutationFn: (data) => TasksApi.createTask.fn(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: TasksApi.getTasks.key() });
  },
});
```

### Key Conventions Summary

1. **Domain-driven organization**: Group related files by feature/domain
2. **Consistent naming**:
   - API files: `*.api.ts`, `*.types.ts`, `*.dto.ts`
   - Components: PascalCase (`TaskCard.tsx`)
   - Hooks: camelCase with `use` prefix (`useCurrentUser.ts`)
3. **Type safety**: Full TypeScript coverage with strict mode
4. **Theme-based styling**: All styles reference theme constants
5. **Absolute imports**: Use `@/` alias for cleaner imports
6. **Functional components**: Use function declarations with TypeScript
7. **Separation of concerns**: Clear boundaries between API, UI, state, and utilities

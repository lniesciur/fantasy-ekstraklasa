# UI Architecture for Fantasy Ekstraklasa

## 1. UI Structure Overview

The application is composed of three primary modules:

- **Authentication Flow**: A unified login page that routes users based on role.
- **User Experience**: Includes the Dashboard, Lineup Builder, and My Lineups views for standard users.
- **Admin Panel**: A protected section with tabs for Excel Import, Auto-Scraping, and CRUD management of players, matches, and gameweeks. Only visible and accessible to administrators.

State is managed via React Context for caching static lists (teams, players). Secure routes use guard components and JWT authentication with RLS policies enforcing role restrictions.

## 2. View List

### Login Page
- **View path**: `/login`
- **Main purpose**: Authenticate users and determine role (admin or standard).
- **Key information**: Email/password fields, error messages, submit button.
- **Key view components**: `AuthForm`, `FieldErrorMessage`, `Toast`
- **UX, accessibility, security**:
  - ARIA labels on inputs, focus on first field.
  - Inline validation errors under fields.
  - Early guard-clauses prevent empty submissions.
  - Toggle password visibility with accessible controls.

### Dashboard
- **View path**: `/dashboard`
- **Main purpose**: Entry point for standard users to create new lineups or review history.
- **Key information**: Quick action buttons for “Create Lineup” and “My Lineups”, summary of most recent lineup.
- **Key view components**: `Navbar`, `Button`, `LineupCard`
- **UX, accessibility, security**:
  - Clear primary calls to action.
  - Keyboard navigable buttons.
  - Guard component ensures only authenticated users.

### Lineup Builder
- **View path**: `/creator`
- **Main purpose**: Build and save a custom football lineup.
- **Key information**: Selectable roster of players by team and position, formation selector, save button, disabled “Bonuses” placeholder with tooltip.
- **Key view components**: `LineupBuilder`, `Select`, `Tooltip`, `Button`, `FieldErrorMessage`
- **UX, accessibility, security**:
  - Drag-and-drop or click-to-select interactions with ARIA support.
  - Disabled bonus section clearly styled with tooltip text “Available in next version”.
  - Inline validation prevents invalid lineup shapes.

### My Lineups
- **View path**: `/my-lineups`
- **Main purpose**: Display saved lineups with options to preview or reload into builder.
- **Key information**: List of saved lineups (date, name), preview and reload buttons.
- **Key view components**: `DataTable`, `LineupCard`, `Button`
- **UX, accessibility, security**:
  - Table rows keyboard-selectable.
  - Accessible labels for preview and reload actions.
  - Guard-clauses ensure only owner’s lineups are fetched.

### Admin Panel
- **View path**: `/admin`
- **Main purpose**: Central hub for administrative data operations.
- **Key view components**: `Sidebar`, `Breadcrumbs`, `Navbar`
- **UX, accessibility, security**:
  - Sidebar lists tabs: Import Excel, Auto-Scraping, Players, Matches, Gameweeks.
  - Role-based guard hides entire module from non-admins.

#### Import Excel
- **View path**: `/admin/import-excel`
- **Main purpose**: Upload and seed statistics via Excel templates.
- **Key information**: File selector, template download link, progress indicator.
- **Key view components**: `ImportExcelForm`, `ProgressBar`, `Toast`
- **UX, accessibility, security**:
  - Accept only `.xlsx` files.
  - Show inline error if format invalid.
  - Success and error toasts.

#### Auto-Scraping
- **View path**: `/admin/auto-scraping`
- **Main purpose**: Trigger and monitor automated data scraping.
- **Key information**: Start/stop buttons, status display, last run timestamp.
- **Key view components**: `ScrapingControls`, `StatusBadge`, `Toast`
- **UX, accessibility, security**:
  - Confirm before starting a new scrape.
  - Polling updates status live.

#### Players Management
- **View path**: `/admin/players`
- **Main purpose**: CRUD operations on player entities.
- **Key information**: Table of players, add/edit/delete forms.
- **Key view components**: `DataTable`, `ModalForm`, `Button`, `FieldErrorMessage`
- **UX, accessibility, security**:
  - Confirmation dialogs for deletions.
  - Inline validation on forms.

#### Matches Management
- **View path**: `/admin/matches`
- **Main purpose**: CRUD operations on match entities.
- **Key information**: Table of matches, add/edit/delete forms.
- **Key view components**: `DataTable`, `ModalForm`, `Button`
- **UX, accessibility, security**: similar to Players Management

#### Gameweeks Management
- **View path**: `/admin/gameweeks`
- **Main purpose**: CRUD operations on gameweek entities.
- **Key information**: Table of gameweeks, add/edit/delete forms.
- **Key view components**: `DataTable`, `ModalForm`, `Button`
- **UX, accessibility, security**: similar to Players Management

## 3. User Journey Map

1. **Unauthenticated Access** → Redirect to `/login`.
2. **Login** → Validate credentials → On success:
   - **Admin** → Redirect to `/admin/import-excel` (default tab).
   - **User** → Redirect to `/dashboard`.
3. **User Dashboard**:
   - Click “Create Lineup” → `/creator`.
   - Click “My Lineups” → `/my-lineups`.
4. **Lineup Builder**:
   - Select players → Save → Show success toast → Optionally redirect to My Lineups.
5. **My Lineups**:
   - Preview lineup → Modal/preview panel.
   - Reload lineup → Navigate back to `/creator` with preloaded data.
6. **Admin Panel**:
   - Choose tab → Perform import, scraping, or CRUD → Show toasts and update tables.

## 4. Layout and Navigation Structure

- **Global Navbar**: Logo, app title, user avatar/dropdown, primary links:
  - “Dashboard” (all authenticated users)
  - “Admin Panel” (admins only)
- **Sidebar (Admin Panel only)**: Vertical nav for tabs: Import Excel, Auto-Scraping, Players, Matches, Gameweeks.
- **Breadcrumbs**: Show under Navbar reflecting current path (e.g., Admin / Players / Edit).
- **Main Content Area**: Renders selected view, handles loading states and toasts.
- **Footer**: Minimal, copyright.

## 5. Key Components

- **AuthForm**: Handles login inputs, inline validation, ARIA support.
- **ProtectedRoute**: Wraps routes to enforce authentication and role guards.
- **Navbar** & **Sidebar**: Responsive navigation elements with role-aware visibility.
- **Breadcrumbs**: Dynamic path mapping.
- **LineupBuilder**: Interactive roster and formation selection.
- **LineupCard**: Displays saved lineup preview.
- **DataTable**: Generic table with sorting, filtering, pagination.
- **ModalForm**: Reusable add/edit form in a modal wrapper.
- **ImportExcelForm** & **ScrapingControls**: File upload and scraping management.
- **Toast**: Centralized notification system for errors and successes.
- **Tooltip**: Accessible hover/click tooltips for placeholders and disabled features.
- **FieldErrorMessage**: Inline field-level error display.
- **LoadingSpinner**: Global and view-level loading indicators.

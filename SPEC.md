# FRC Design Pipeline App Specification

## Project Overview
- **Project Name:** FRC Design Pipeline
- **Type:** Kanban-style engineering workflow tracker (Single-page webapp)
- **Core Functionality:** Manage design requests through stages: Submitted → Assigned → In Progress → Review → Fabrication → Complete
- **Target Users:** FRC robotics team members (Designers, Fabrication, Leads)

## UI/UX Specification

### Layout Structure
- **Sticky Header** (64px height): App title, view toggle (Board/Activity Log), "New Request" button
- **Stats Bar** (48px height): Count per stage displayed as pills
- **Main Content Area**:
  - Board View: Horizontal scrolling Kanban with 6 columns
  - Activity Log View: Vertical list of all events
- **Modal Overlay**: For request details and form inputs

### Responsive Breakpoints
- Desktop: Full 6-column Kanban (min-width: 1024px)
- Tablet: Scrollable columns (768px - 1023px)
- Mobile: Stacked columns with horizontal scroll (< 768px)

### Visual Design

#### Color Palette
- **Background:** #0D0D0D (near-black)
- **Surface:** #1A1A1A (cards, modals)
- **Surface Elevated:** #242424 (hover states)
- **Border:** #333333
- **Text Primary:** #FFFFFF
- **Text Secondary:** #A0A0A0
- **Text Muted:** #666666

#### Stage Colors
- Submitted: #6366F1 (Indigo)
- Assigned: #8B5CF6 (Violet)
- In Progress: #F59E0B (Amber)
- Review: #3B82F6 (Blue)
- Fabrication: #10B981 (Emerald)
- Complete: #22C55E (Green)

#### Priority Colors
- High: #EF4444 (Red)
- Medium: #F59E0B (Amber)
- Low: #22C55E (Green)

#### Typography
- **Font Family:** "JetBrains Mono", monospace (techy/engineering feel)
- **Headings:** 600 weight
- **Body:** 400 weight
- **Title:** 24px
- **Section Headers:** 14px uppercase, letter-spacing 0.1em
- **Body Text:** 14px
- **Small Text:** 12px

#### Spacing System
- Base unit: 4px
- Card padding: 16px
- Column gap: 16px
- Section margins: 24px

#### Visual Effects
- Card shadows: 0 4px 6px rgba(0,0,0,0.3)
- Modal backdrop: rgba(0,0,0,0.8) with blur
- Hover transitions: 150ms ease
- Stage indicator: 4px left border on cards

### Components

#### Header
- Logo/Title: "FRC Design Pipeline" with gear icon
- View Toggle: Segmented control (Board | Activity Log)
- New Request Button: Primary action, green accent

#### Stats Bar
- Horizontal pill layout
- Each pill shows stage name + count
- Stage colors as subtle background tint

#### Kanban Card
- Stage indicator (4px left border with stage color)
- Title (bold, truncate if long)
- Priority tag (colored pill)
- Assignee avatar/initials
- Notes indicator (comment icon if has notes)
- Click opens detail modal

#### Detail Modal
- Full request information
- Activity log section with timestamps
- "Advance to Next Stage" button (if not complete)
- Add note input
- Delete button (with confirmation)
- Close button (X)

#### New Request Form (Modal)
- Title input (required)
- Description textarea
- Priority dropdown (High/Medium/Low)
- Assignee dropdown (from team members)
- Role dropdown (Designer/Fabrication/Lead)
- File/Link attachments textarea (multi-line)
- Initial notes textarea
- Submit and Cancel buttons

#### Activity Log View
- Chronological list of all events
- Each entry shows: timestamp, request title, action type, details
- Grouped by date

## Functionality Specification

### Core Features
1. **Create Request:** Form to submit new design requests
2. **View Board:** Kanban view grouped by stage
3. **View Details:** Click card to see full info + activity log
4. **Advance Stage:** Move request to next stage with automatic activity log entry
5. **Add Notes:** Append timestamped notes to activity log
6. **Delete Request:** Remove request with confirmation
7. **View Activity Log:** Toggle to see all events across all requests
8. **Stats Display:** Real-time count per stage

### Data Model
```typescript
interface Request {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  role: 'Designer' | 'Fabrication' | 'Lead';
  attachments: string;
  notes: string;
  stage: Stage;
  createdAt: string;
  updatedAt: string;
  activity: Activity[];
}

interface Activity {
  id: string;
  type: 'created' | 'stage_change' | 'note_added' | 'updated';
  message: string;
  timestamp: string;
}
```

### Stage Flow
- Submitted → Assigned → In Progress → Review → Fabrication → Complete

### Team Members (Hardcoded)
- Alex Chen
- Jordan Williams
- Sam Rodriguez
- Taylor Kim
- Casey Johnson
- Morgan Lee
- Riley Thompson

### User Interactions
- Click card → Open detail modal
- Click "New Request" → Open form modal
- Click stage advance → Add activity log + update stage
- Type note + submit → Append to activity log
- Click delete → Confirm dialog → Remove
- Toggle view → Switch between Board/Activity Log
- Refresh page → Data persists via localStorage

### Edge Cases
- Empty states for each stage
- Long titles truncated with ellipsis
- Activity log sorted by most recent first
- Prevent advancing from "Complete" stage

## Acceptance Criteria
1. App loads without errors
2. Can create a new request with all fields
3. Requests appear in correct Kanban columns
4. Clicking a card shows detail modal with activity log
5. Can advance stage and see activity log update
6. Can add notes to a request
7. Can delete a request
8. Activity log view shows all events chronologically
9. Stats bar shows accurate counts per stage
10. Data persists after page refresh
11. UI matches the dark, professional aesthetic specified
12. All interactions feel smooth with appropriate transitions

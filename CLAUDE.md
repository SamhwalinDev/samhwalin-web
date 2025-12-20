# CLAUDE.md

## Project Overview

삼활인(Samhwalin) - A Next.js web application for preserving and sharing stories of Korean elders through "활서(Hwalseo)" (living letters). The platform allows users to read elder stories, send postcards, and make donations to support the project.

Key features:
- **활서 (Hwalseo)**: Browse and read stories from Korean elders organized by themes
- **어르신 (Elders)**: View profiles of elders and their associated stories
- **후원 (Donations)**: Support the project with one-time or recurring donations
- **엽서 (Postcards)**: Send thank-you postcards to elders after reading their stories
- **뉴스레터 (Newsletter)**: Email subscription for updates

## Tech Stack

- **Framework**: Next.js 14.1 (App Router with Server Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens
- **Database/CMS**: Notion API (all content stored in Notion databases)
- **Icons**: Lucide React
- **Error Monitoring**: Sentry
- **Font**: Pretendard Variable (Korean-optimized)

## File Structure

```
app/                        # Next.js App Router pages
├── about/                  # About page (al'ive program, team, philosophy)
├── api/
│   ├── donation/           # Donation API route
│   ├── image/              # Image proxy for Notion/S3 URLs
│   ├── postcard/           # Postcard submission API
│   └── subscribe/          # Newsletter subscription API
├── donate/                 # Donation flow pages
├── elders/                 # Elder list and detail pages
│   └── [slug]/             # Elder detail page (UUID without dashes)
├── hwalseo/                # Hwalseo list and detail pages
│   └── [slug]/             # Hwalseo detail page
├── postcard/               # Postcard thank-you page
├── layout.tsx              # Root layout (header, footer)
├── page.tsx                # Home page
└── globals.css             # Global styles

components/
├── features/               # Feature-specific components
│   ├── ElderCard.tsx       # Elder card for list view
│   ├── EmailSubscribeForm.tsx
│   ├── HeroSection.tsx     # Home page hero
│   ├── HwalseoCard.tsx     # Hwalseo card for list view
│   ├── HwalseoFilter.tsx   # Theme filtering for hwalseo
│   └── ...
├── layout/                 # Layout components
│   ├── Container.tsx       # Container and Section wrappers
│   ├── Footer.tsx
│   └── Header.tsx
└── ui/                     # Reusable UI components
    ├── Button.tsx
    ├── Card.tsx
    ├── Input.tsx
    ├── Modal.tsx
    ├── ProgressBar.tsx
    └── ProxiedImage.tsx    # Handles image proxy for long URLs

lib/
├── notion.ts               # Notion API integration (all data functions)
└── utils.ts                # Utility functions (cn, formatDate, etc.)

types/
└── index.ts                # TypeScript type definitions

public/images/              # Static images (logos, team photos, etc.)
```

## Key Commands

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint
npm run type-check     # Run TypeScript type checking
npm run test:notion    # Test Notion API connection
```

## Environment Variables

Required in `.env.local`:
```
NOTION_API_KEY=              # Notion integration token
NOTION_HWALSEO_DATABASE_ID=  # Hwalseo content database
NOTION_ELDER_DATABASE_ID=    # Elder profiles database
NOTION_DONATION_DATABASE_ID= # Donation records database
NOTION_SETTINGS_DATABASE_ID= # Site settings (donation goal, etc.)
NOTION_POSTCARD_DATABASE_ID= # Postcard messages database
NOTION_SUBSCRIBE_DATABASE_ID=# Newsletter subscribers database
SENTRY_DSN=                  # Sentry error tracking (optional)
SENTRY_AUTH_TOKEN=           # Sentry build upload (optional)
```

## Key Types

### Core Data Types
```typescript
// 어르신 (Elder) - Full profile
interface Elder {
  id: string;
  name: string;
  slug: string;           // UUID without dashes
  photo?: string;
  birthYear?: number;
  gender?: '남성' | '여성';
  region?: string;
  introduction?: string;  // Short intro quote
  bio?: string;           // Full biography
  status: 'Published' | 'Draft';
  hwalseoIds: string[];   // Related hwalseo IDs
}

// 활서 (Hwalseo) - Full article with content
interface Hwalseo {
  id: string;
  slug: string;
  title: string;
  elderName: string;
  elderId?: string;       // Reference to Elder DB
  elder?: Elder;          // Populated on detail view
  theme: string;          // e.g., '전쟁의 기억', '인생의 지혜'
  excerpt: string;
  content: string;        // Markdown/HTML from Notion blocks
  coverImage: string;     // Proxied image URL
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Card variants for list views
interface ElderCard { ... }   // Abbreviated elder for cards
interface HwalseoCard { ... } // Abbreviated hwalseo for cards
```

### Constants
```typescript
// Available themes
const THEMES = ['전쟁의 기억', '인생의 지혜', '가족 이야기',
                '직업과 소명', '사랑과 우정', '고향의 추억'];

// Navigation links
const NAV_LINKS = [
  { label: '활서', href: '/hwalseo' },
  { label: '어르신들', href: '/elders' },
  { label: '삼활인', href: '/about' },
  { label: '후원하기', href: '/donate' },
];
```

## Notion Integration

All data functions are in `lib/notion.ts`:

### Hwalseo Functions
- `getHwalseoList()` - Fetch published hwalseo list (for listing pages)
- `getHwalseoBySlug(slug)` - Fetch single hwalseo with full content
- `getHwalseoThemes()` - Fetch available themes from database schema
- `getRelatedHwalseos(id, theme, limit)` - Get related stories by theme
- `getHwalseoByElderId(elderId)` - Get all hwalseo for an elder

### Elder Functions
- `getElderList()` - Fetch published elder list
- `getElderById(elderId)` - Fetch elder by UUID
- `getElderByName(name)` - Fetch elder by name (legacy support)

### Donation Functions
- `getDonationStats()` - Get donation progress, goal, and recent donors
- `createDonation(data)` - Submit new donation record
- `createPostcard(data)` - Submit new postcard message

### Subscriber Functions
- `checkSubscriberExists(email)` - Check for duplicate email
- `createSubscriber(data)` - Add newsletter subscriber

## Utility Functions

In `lib/utils.ts`:

```typescript
cn(...inputs)           // Tailwind class merge (clsx + tailwind-merge)
formatDate(dateString)  // Korean date format: "2024년 1월 15일"
formatCurrency(amount)  // Korean currency: "10,000원"
generateSlug(title)     // URL-safe slug from title
truncateText(text, max) // Truncate with ellipsis
getProxiedImageUrl(url) // Convert Notion/S3 URLs to proxy URLs
```

## Image Handling

### The Problem
Notion S3 signed URLs expire after ~1 hour and can be very long (>2000 chars).

### The Solution
1. **Image Proxy** (`/api/image`): Proxies and caches Notion/S3 images
   - GET for short URLs (<1500 chars)
   - POST for long URLs (sends URL in body)
   - Re-encodes `+` and `/` in S3 signature query params

2. **ProxiedImage Component**: Handles proxy URL automatically
   - Short URLs: Uses native `<img>` with GET
   - Long URLs: Fetches via POST, creates blob URL
   - Shows loading/error states

3. **Usage**:
```tsx
import { ProxiedImage } from '@/components/ui';

<ProxiedImage
  src={getProxiedImageUrl(notionImageUrl)}
  alt="Description"
  fill
  className="object-cover"
/>
```

## Design System

### Colors (Tailwind tokens)
```
primary:    #F49249 (warm orange)
secondary:  #7B7FA8 (soft blue-gray)
accent:     #7A9B7E (sage green)
base:       #FFFEF9 (warm white)
text:       #2D3748 (dark gray)
```

### Typography
```
# UI Typography
text-display:  2.5rem, 700 weight (hero titles)
text-h1:       1.75rem, 600 weight
text-h2:       1.25rem, 600 weight
text-h3:       1.125rem, 600 weight
text-body:     1.0625rem, 1.75 line-height
text-body-sm:  0.9375rem
text-caption:  0.875rem
text-small:    0.75rem

# Article Content Typography (for hwalseo detail pages)
text-article-h1: 1.875rem (30px), 700 weight
text-article-h2: 1.5rem (24px), 600 weight
text-article-h3: 1.25rem (20px), 600 weight
```

### Layout
```
max-w-container: 1200px (main content width)
max-w-content:   680px  (article text width)
max-w-narrow:    480px  (forms, cards)
```

## Component Patterns

### Container and Section
```tsx
import { Container, Section } from '@/components/layout';

<Section spacing="lg" background="gray">
  <Container size="default">
    {/* Content */}
  </Container>
</Section>
```

### Card Components
```tsx
// Elder card with photo, name, age, region, hwalseo count
<ElderCard elder={elderData} />

// Hwalseo card with cover image, title, theme, excerpt
<HwalseoCard hwalseo={hwalseoData} />
```

## ISR and Caching

- Pages use ISR with `revalidate = 60` (1 minute)
- Image proxy has aggressive caching:
  - `Cache-Control: public, max-age=604800` (7 days browser)
  - `CDN-Cache-Control: public, max-age=2592000` (30 days CDN)

## Code Conventions

- Path aliases: `@/*` (e.g., `@/components`, `@/lib`, `@/types`)
- Components organized by purpose: `features/`, `layout/`, `ui/`
- Barrel exports in each component folder (`index.ts`)
- Korean language in UI copy and some code comments
- Server Components by default; `'use client'` only when needed
- UUID slugs without dashes for elder URLs

## Notion Rich Text Rendering

The system converts Notion rich text annotations to markdown, then parses that to HTML for rendering.

### Flow
1. **Notion API** returns rich text blocks with `annotations` (bold, italic, color, etc.)
2. **`richTextToString()`** in `lib/notion.ts` converts annotations to markdown syntax:
   - `annotations.bold` → `**text**`
   - `annotations.italic` → `*text*`
   - `annotations.code` → `` `text` ``
   - `annotations.strikethrough` → `~~text~~`
   - `annotations.underline` → `<u>text</u>`
   - `annotations.color` → `[COLOR:name]text[/COLOR]`
   - `annotations.color` (background) → `[HIGHLIGHT:name]text[/HIGHLIGHT]`
   - `item.href` → `[text](url)`

3. **`parseInlineFormatting()`** in `app/hwalseo/[slug]/page.tsx` converts markdown to HTML:
   - Regex patterns transform markdown syntax to HTML tags
   - Colors use CSS variables: `var(--notion-{color})` and `var(--notion-{color}-bg)`
   - Returns React element with `dangerouslySetInnerHTML`

### Notion Color CSS Variables
Defined in `styles/globals.css`:
```css
/* Text colors */
--notion-gray, --notion-brown, --notion-orange, --notion-yellow,
--notion-green, --notion-blue, --notion-purple, --notion-pink, --notion-red

/* Background colors (for highlights) */
--notion-gray-bg, --notion-brown-bg, --notion-orange-bg, etc.
```

### Article Content Rendering
The `ContentRenderer` component in `app/hwalseo/[slug]/page.tsx` handles:

| Notion Block  | Markdown | Rendered HTML | Tailwind Class |
|---------------|----------|---------------|----------------|
| heading_1     | `# text` | `<h2>`        | `text-article-h1` |
| heading_2     | `## text`| `<h3>`        | `text-article-h2` |
| heading_3     | `### text`| `<h4>`       | `text-article-h3` |
| paragraph     | text     | `<p>`         | `text-body-lg` |
| quote         | `> text` | `<blockquote>`| `border-l-4 border-primary` |
| bullet list   | `• text` | `<li>`        | `text-body-lg` |
| image         | `[IMAGE:url CAPTION:text]` | `<figure>` | - |

Note: Headings are shifted down one level (h1→h2, etc.) since the page title uses `<h1>`.

## Known Issues / TODOs

- Notion S3 URLs require careful URL encoding/decoding
- Long URLs (>2000 chars) need POST method for proxy
- Image comparison in getPageContent uses path matching to avoid duplicates

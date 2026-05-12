# SwapStyle - Sustainable Fashion Exchange

A modern clothing swap platform that enables users to exchange wardrobe items sustainably. Built with Next.js 15, MongoDB, and a warm, earthy design aesthetic inspired by platforms like Depop and Vinted.

## Features

### Core Functionality

- **Browse Feed** - Grid-based view of swappable clothing items with images, owner info, size, and condition badges
- **Category Filtering** - Filter items by category (Tops, Bottoms, Dresses, Outerwear, Shoes, Accessories)
- **Item Details** - Full item information with swap proposal functionality
- **Swap Proposals** - Send swap requests with custom messages and offer descriptions
- **Accept/Decline Swaps** - Item owners can manage incoming swap requests
- **Real-time Chat** - Accepted swaps unlock a chat feature for coordinating exchanges

### Authentication

- **User Registration** - Create accounts with name, email, password, and location
- **Secure Login** - JWT-based authentication with HTTP-only cookies
- **Protected Routes** - Profile and Add Item features require authentication
- **Password Security** - Bcrypt hashing for secure password storage

### User Features

- **Profile Dashboard** - View your stats (items listed, swaps completed, CO2 saved)
- **My Listings** - See all items you have listed for swap
- **Swap Management** - Track sent and received swap proposals
- **Image Upload** - Multi-image upload with drag-and-drop support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB
- **Authentication**: JWT + bcryptjs
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Fonts**: DM Sans (body) + Playfair Display (headings)
- **Language**: TypeScript

## Design System

### Color Palette

| Token | Description |
|-------|-------------|
| `--primary` | Sage green (#8CAE68) - Main brand color |
| `--background` | Warm cream - Page backgrounds |
| `--card` | Off-white - Card surfaces |
| `--accent` | Warm tan - Secondary accents |
| `--foreground` | Dark brown - Primary text |

### Typography

- **Headings**: Playfair Display (serif) - Elegant, sustainable feel
- **Body**: DM Sans (sans-serif) - Clean, readable

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- MongoDB database (local or Atlas)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGO_URI=mongodb://your-connection-string
JWT_SECRET=your-secret-key-min-32-chars
```

### Installation

```bash
# Clone the repository
git clone https://github.com/sutartushar/clothing-swap-app.git
cd clothing-swap-app

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # User login
│   │   │   ├── logout/route.ts     # User logout
│   │   │   ├── me/route.ts         # Get current user
│   │   │   └── register/route.ts   # User registration
│   │   ├── chat/
│   │   │   └── [swapId]/route.ts   # Chat messages for swaps
│   │   ├── items/
│   │   │   ├── [id]/route.ts       # Single item operations
│   │   │   └── route.ts            # List/create items
│   │   ├── swaps/
│   │   │   ├── [id]/route.ts       # Accept/decline swaps
│   │   │   └── route.ts            # List/create swaps
│   │   └── upload/route.ts         # Image upload handler
│   ├── globals.css                 # Tailwind + design tokens
│   ├── layout.tsx                  # Root layout with providers
│   └── page.tsx                    # Main app page
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── add-item-dialog.tsx         # Add new item form
│   ├── auth-dialog.tsx             # Login/register forms
│   ├── auth-provider.tsx           # Authentication context
│   ├── bottom-nav.tsx              # Mobile navigation
│   ├── category-filter.tsx         # Category filter chips
│   ├── chat-dialog.tsx             # Swap chat interface
│   ├── hero.tsx                    # Landing hero section
│   ├── item-card.tsx               # Item display card
│   ├── item-detail-dialog.tsx      # Item details + swap form
│   ├── item-grid.tsx               # Grid layout for items
│   ├── profile-view.tsx            # User profile page
│   └── swaps-view.tsx              # Swap management page
├── lib/
│   ├── auth.ts                     # JWT utilities
│   ├── mongodb.ts                  # Database connection
│   └── types.ts                    # TypeScript interfaces
└── public/
    └── uploads/                    # Uploaded images
```

## API Reference

### Authentication

#### POST /api/auth/register
Register a new user.

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "location": "New York, NY"
}
```

#### POST /api/auth/login
Authenticate user and receive session cookie.

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### POST /api/auth/logout
Clear session cookie and log out.

#### GET /api/auth/me
Get current authenticated user (requires auth cookie).

### Items

#### GET /api/items
List all items. Supports `?category=` query parameter for filtering.

#### POST /api/items
Create a new item (requires authentication).

```json
{
  "title": "Vintage Denim Jacket",
  "description": "Classic 90s style",
  "category": "Outerwear",
  "size": "M",
  "condition": "good",
  "imageUrl": "/uploads/image.jpg",
  "ownerId": "user-id",
  "owner": {
    "name": "John",
    "avatar": "JD",
    "location": "NYC"
  }
}
```

#### GET /api/items/[id]
Get single item by ID.

### Swaps

#### GET /api/swaps
List swaps. Supports `?userId=` to filter by user.

#### POST /api/swaps
Create a swap proposal.

```json
{
  "itemId": "item-id",
  "itemTitle": "Vintage Jacket",
  "itemOwnerId": "owner-id",
  "proposerId": "proposer-id",
  "proposerName": "Jane",
  "proposerEmail": "jane@example.com",
  "message": "I would love to swap!",
  "offerDescription": "I have a similar jacket in blue"
}
```

#### PATCH /api/swaps/[id]
Update swap status (accept/decline).

```json
{
  "status": "accepted"
}
```

### Chat

#### GET /api/chat/[swapId]
Get all messages for a swap.

#### POST /api/chat/[swapId]
Send a new message.

```json
{
  "senderId": "user-id",
  "senderName": "John",
  "message": "When can we meet?"
}
```

### Upload

#### POST /api/upload
Upload an image file (multipart/form-data with `file` field).

Returns:
```json
{
  "url": "/uploads/filename.jpg"
}
```

## Database Schema

### Users Collection

```typescript
{
  _id: ObjectId,
  name: string,
  email: string,          // unique
  password: string,       // bcrypt hashed
  avatar: string,         // initials
  location: string,
  itemsListed: number,
  swapsDone: number,
  co2Saved: number,
  createdAt: Date
}
```

### Items Collection

```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  category: string,
  size: string,
  condition: 'new' | 'like-new' | 'good' | 'fair',
  imageUrl: string,
  ownerId: string,
  owner: {
    name: string,
    avatar: string,
    location: string
  },
  createdAt: Date
}
```

### Swaps Collection

```typescript
{
  _id: ObjectId,
  itemId: string,
  itemTitle: string,
  itemOwnerId: string,
  proposerId: string,
  proposerName: string,
  proposerEmail: string,
  message: string,
  offerDescription: string,
  status: 'pending' | 'accepted' | 'declined',
  createdAt: Date
}
```

### Messages Collection

```typescript
{
  _id: ObjectId,
  swapId: string,
  senderId: string,
  senderName: string,
  message: string,
  createdAt: Date
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
4. Deploy

Note: For production, consider using Vercel Blob for image storage instead of the local filesystem.

### Environment Variables for Production

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing (min 32 characters) |

## Security Considerations

- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens are stored in HTTP-only cookies to prevent XSS
- All database queries use parameterized inputs
- File uploads are validated for type and size
- Protected routes verify authentication server-side

## Future Enhancements

- Real-time chat with WebSockets
- Image optimization and CDN storage
- Email notifications for swap updates
- User ratings and reviews
- Location-based item discovery
- Social login (Google, Apple)
- Push notifications for mobile

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below.

[Continue working on v0](https://v0.app/chat/projects/prj_xgq6La1QBfrcBThB1rh3Hl3a5Qt5)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

Built with sustainability in mind. Every swap saves approximately 2.3kg of CO2.

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


# Admin Panel Guide

## Overview
Your portfolio website now includes a complete content management system with admin capabilities.

## New Features Added

### 1. **Services & Pricing Page** (`/services`)
- Professional pricing tiers
- Industry showcase
- FAQ section
- Clear calls-to-action

### 2. **Blog/Insights Section** (`/blog`)
- SEO-friendly blog posts
- Category filtering
- Individual post pages with full content
- Published/draft status

### 3. **Free Resource Lead Magnet** (Homepage)
- Newsletter signup form
- Email capture for building your audience
- "10 Best AI Prompts" guide offer
- Subscriber management in admin panel

### 4. **Admin Dashboard** (`/admin`)
- Secure login system
- Content management for blog posts and portfolio
- File upload capability
- Publish/unpublish controls

## Getting Started with the Admin Panel

### First Time Setup

1. **Create Your Admin Account**
   - You'll need to create an admin account first
   - This is a one-time setup process
   - Contact support or use the signup endpoint to create your account

2. **Sign In**
   - Visit `/admin` to access the login page
   - Enter your email and password
   - You'll be redirected to the dashboard

### Managing Content

#### Blog Posts
1. Click "New Post" from the dashboard
2. Fill in:
   - Title (required)
   - Category (e.g., "AI Tools", "Tips & Tricks", "Case Study")
   - Excerpt (shown on blog listing page)
   - Full content
   - Read time
   - Featured image (upload or paste URL)
3. Check "Publish immediately" to make it live, or leave unchecked to save as draft
4. Click "Create Post"

**Editing Posts:**
- From the dashboard, click the edit icon next to any post
- Make your changes
- Click "Update Post"

**Publishing/Unpublishing:**
- Click the eye icon to toggle between published and draft status

#### Portfolio Items
1. Click "New Item" from the portfolio section
2. Fill in:
   - Title
   - Category (Beauty, Fashion, Food & Drink, Fitness, etc.)
   - Description
   - AI Prompt (optional - shows visitors how you created it)
   - Image (upload or paste URL)
3. Check "Publish immediately" or save as draft
4. Click "Create Item"

**Note:** New portfolio items will appear in the gallery alongside your existing 4 showcase pieces.

#### Newsletter Subscribers
- View all subscribers from the dashboard
- Export emails for your email marketing campaigns
- Track growth over time

### Image Upload
- Upload directly from your computer
- Or paste an image URL
- Uploaded files are stored securely in Supabase Storage
- Images get signed URLs (valid for 1 year)

### Publishing Workflow
1. **Draft Mode:** Create and preview content without making it public
2. **Publish:** Toggle the publish status to make content live
3. **Unpublish:** Revert to draft status at any time

## Page URLs

- **Main Site:**
  - Homepage/Gallery: `/`
  - Services: `/services`
  - Blog: `/blog`
  - Individual Post: `/blog/[post-slug]`
  - Contact: `/contact`

- **Admin Panel:**
  - Login: `/admin`
  - Dashboard: `/admin/dashboard`
  - New Blog Post: `/admin/blog/new`
  - Edit Blog Post: `/admin/blog/edit/[slug]`
  - New Portfolio Item: `/admin/portfolio/new`

## Security Notes

⚠️ **Important:**
- Never share your admin password
- Always sign out when using a public computer
- Your access token is stored locally in the browser
- The admin panel requires authentication for all content management

## Tips for Success

### Blog Content Strategy
1. **Weekly Posts:** Aim for 1-2 posts per week
2. **Mix Content Types:**
   - How-to guides ("How I Created [X] with AI")
   - Tool reviews ("Best AI Tools for [Y]")
   - Case studies ("[Brand] Results with AI Content")
   - Industry insights

### SEO Best Practices
- Use descriptive titles with keywords
- Write compelling excerpts
- Include relevant images
- Link to your services page in posts

### Newsletter Growth
- Promote the free guide on social media
- Mention it in client communications
- Add it to your email signature
- Create additional lead magnets over time

## Support

If you encounter any issues or need help:
1. Check the browser console for error messages
2. Verify you're logged in (visit `/admin/dashboard`)
3. Ensure images are properly formatted URLs or uploaded files
4. For backend issues, check that Supabase is connected

## Future Enhancements

Consider these potential additions:
- Analytics dashboard (page views, popular posts)
- Social media integration
- Automated email sequences for new subscribers
- Client testimonials section
- Advanced SEO tools

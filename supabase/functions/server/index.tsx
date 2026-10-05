import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase clients
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize storage bucket
const bucketName = 'make-42a7539f-uploads';
(async () => {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabaseAdmin.storage.createBucket(bucketName, { public: false });
    console.log(`Created bucket: ${bucketName}`);
  }
})();

// Middleware to verify authentication
async function verifyAuth(c: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { authorized: false, userId: null };
  }
  
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !user?.id) {
    return { authorized: false, userId: null };
  }
  
  return { authorized: true, userId: user.id };
}

// Health check endpoint
app.get("/make-server-42a7539f/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ AUTH ROUTES ============

// Sign up
app.post("/make-server-42a7539f/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ user: data.user });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to sign up' }, 500);
  }
});

// Sign in
app.post("/make-server-42a7539f/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      return c.json({ error: error.message }, 401);
    }
    
    return c.json({ 
      session: data.session,
      user: data.user 
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

// ============ BLOG POST ROUTES ============

// Get all blog posts (published only for public, all for authenticated admin)
app.get("/make-server-42a7539f/blog", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    
    let allPosts = await kv.getByPrefix('blog_');
    
    // If no posts exist, seed with mock data
    if (allPosts.length === 0) {
      const mockPosts = [
        {
          id: 'blog_ai-product-photography-guide',
          slug: 'ai-product-photography-guide',
          title: '5 Ways AI is Revolutionizing Product Photography',
          excerpt: 'Discover how artificial intelligence is transforming the way brands create stunning product images without expensive photoshoots.',
          content: `# 5 Ways AI is Revolutionizing Product Photography

Artificial intelligence is reshaping the landscape of product photography. Here's how brands are leveraging AI to create stunning visuals at a fraction of traditional costs.

## 1. Infinite Background Variations
Generate unlimited background options for your products in seconds. From studio white to lifestyle settings, AI makes it effortless.

## 2. Consistent Lighting & Angles
Maintain perfect lighting and angles across your entire product catalog without manual adjustments.

## 3. Seasonal & Themed Content
Create holiday-themed or seasonal product shots instantly, without waiting for a photoshoot.

## 4. A/B Testing Made Easy
Test multiple visual styles to see what resonates with your audience before committing to expensive production.

## 5. Rapid Turnaround
Go from concept to final image in hours, not weeks. Perfect for fast-paced marketing campaigns.

AI isn't replacing creativity—it's amplifying it. Brands that embrace this technology now will have a significant competitive advantage.`,
          image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
          category: 'AI Photography',
          date: '2026-02-15T10:00:00.000Z',
          readTime: '5 min read',
          published: true,
          createdAt: '2026-02-15T10:00:00.000Z',
          updatedAt: '2026-02-15T10:00:00.000Z',
        },
        {
          id: 'blog_social-media-content-strategy',
          slug: 'social-media-content-strategy',
          title: 'Building a Social Media Content Strategy with AI',
          excerpt: 'Learn how to scale your social media presence using AI-generated visuals that maintain brand consistency.',
          content: `# Building a Social Media Content Strategy with AI

Creating consistent, high-quality social media content can be overwhelming. Here's how AI simplifies the process.

## The Challenge
Most brands struggle to maintain a consistent posting schedule because:
- Traditional photoshoots are expensive
- Content creation is time-consuming
- Seasonal campaigns require advanced planning

## The AI Solution
AI-generated content allows you to:
- Create weeks of content in a single session
- Adapt to trending topics quickly
- Maintain visual consistency across all platforms

## Best Practices
1. **Define Your Brand Aesthetic** - Train AI on your brand guidelines
2. **Plan Content Themes** - Create content buckets for different campaigns
3. **Test & Iterate** - Use analytics to refine your approach
4. **Stay Authentic** - Blend AI content with behind-the-scenes real photos

## Results You Can Expect
Brands using AI for social content report:
- 3x more content produced
- 60% cost reduction
- Better engagement rates

The future of social media is here, and it's powered by AI.`,
          image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
          category: 'Social Media',
          date: '2026-02-10T10:00:00.000Z',
          readTime: '4 min read',
          published: true,
          createdAt: '2026-02-10T10:00:00.000Z',
          updatedAt: '2026-02-10T10:00:00.000Z',
        },
        {
          id: 'blog_beauty-brand-ai-visuals',
          slug: 'beauty-brand-ai-visuals',
          title: 'How Beauty Brands Are Using AI for Product Visuals',
          excerpt: 'From skincare to cosmetics, discover how beauty brands are creating stunning product imagery with AI.',
          content: `# How Beauty Brands Are Using AI for Product Visuals

The beauty industry is notoriously visual. Here's how AI is helping brands stand out.

## The Beauty Industry Challenge
Beauty brands need:
- High-quality product shots
- Lifestyle imagery
- Diverse representation
- Seasonal campaign visuals
- Fast turnaround times

## AI-Powered Solutions

### Product Shots
Create flawless product photography with perfect lighting, shadows, and reflections.

### Lifestyle Integration
Show your products in real-life settings—from bathroom counters to vanity tables.

### Diverse Models
Generate inclusive imagery that represents your entire customer base.

### Seasonal Campaigns
Quickly adapt visuals for holidays, seasons, and trending aesthetics.

## Case Study
A skincare brand used AI to:
- Reduce photography costs by 70%
- Create 100+ product images in one week
- Test 5 different visual styles
- Launch campaigns 3x faster

## Getting Started
1. Define your brand aesthetic
2. Identify key products and use cases
3. Start with a small test batch
4. Measure engagement and iterate

AI isn't just for tech companies—it's transforming beauty marketing.`,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
          category: 'Beauty Industry',
          date: '2026-02-05T10:00:00.000Z',
          readTime: '6 min read',
          published: true,
          createdAt: '2026-02-05T10:00:00.000Z',
          updatedAt: '2026-02-05T10:00:00.000Z',
        },
        {
          id: 'blog_food-photography-ai-tips',
          slug: 'food-photography-ai-tips',
          title: 'AI Food Photography: Making Your Menu Items Irresistible',
          excerpt: 'Restaurant and food brands are using AI to create mouth-watering visuals that drive orders and engagement.',
          content: `# AI Food Photography: Making Your Menu Items Irresistible

Food photography can make or break a restaurant's marketing. Here's how AI is changing the game.

## Why Food Photography Matters
Studies show that high-quality food images:
- Increase orders by up to 30%
- Boost social media engagement
- Build brand credibility
- Drive foot traffic

## Traditional Photography Challenges
- Food stylists are expensive
- Dishes look different than in real life
- Constant menu updates require new shoots
- Seasonal specials need quick turnaround

## The AI Advantage

### Consistency
Every dish looks perfect, every time.

### Speed
Update your entire menu's imagery in hours.

### Variety
Test different plating styles and backgrounds.

### Cost
Fraction of traditional food photography costs.

## Best Practices
- Start with your hero items
- Test different plating styles
- Consider your brand aesthetic
- Use AI for social, real photos for in-restaurant

## Real Results
A local restaurant chain used AI to:
- Refresh their entire online menu in 2 days
- Increase online orders by 25%
- Launch seasonal specials 5x faster
- Reduce photography costs by 80%

The future of food marketing is visual, fast, and AI-powered.`,
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
          category: 'Food & Beverage',
          date: '2026-01-28T10:00:00.000Z',
          readTime: '5 min read',
          published: true,
          createdAt: '2026-01-28T10:00:00.000Z',
          updatedAt: '2026-01-28T10:00:00.000Z',
        },
        {
          id: 'blog_fitness-brand-content-creation',
          slug: 'fitness-brand-content-creation',
          title: 'Fitness Brands: Create Motivational Content at Scale',
          excerpt: 'How gyms, trainers, and fitness brands are using AI to produce inspiring visuals that motivate their audience.',
          content: `# Fitness Brands: Create Motivational Content at Scale

The fitness industry thrives on motivation and inspiration. Here's how AI helps brands deliver.

## The Content Demand
Fitness brands need constant content for:
- Social media posts
- Email campaigns
- Website updates
- Promotional materials
- Client success stories

## Traditional Approach Limitations
- Professional photoshoots are expensive
- Models and locations add costs
- Seasonal campaigns require planning
- Hard to maintain posting consistency

## AI Content Creation Benefits

### Diverse Representation
Create imagery that represents all body types, ages, and fitness levels.

### Motivation Library
Build a library of motivational scenes—gym workouts, outdoor training, home fitness.

### Seasonal Flexibility
Quickly adapt content for New Year's resolutions, summer fitness, or holiday campaigns.

### Brand Consistency
Maintain your visual style across all platforms.

## Use Cases
1. **Social Media** - Daily motivation posts
2. **Email Marketing** - Targeted campaign visuals
3. **Class Promotions** - Specific workout type imagery
4. **Success Stories** - Before/after style content
5. **Merchandise** - Product mockups and lifestyle shots

## Success Story
A fitness studio used AI to:
- Post 3x daily with unique content
- Create targeted ads for different demographics
- Launch new class promotions in hours
- Build a 6-month content calendar in 1 week

AI empowers fitness brands to inspire at scale.`,
          image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
          category: 'Fitness & Wellness',
          date: '2026-01-20T10:00:00.000Z',
          readTime: '4 min read',
          published: true,
          createdAt: '2026-01-20T10:00:00.000Z',
          updatedAt: '2026-01-20T10:00:00.000Z',
        },
        {
          id: 'blog_fashion-ecommerce-ai-images',
          slug: 'fashion-ecommerce-ai-images',
          title: 'Fashion E-commerce: AI Product Images That Convert',
          excerpt: 'Online fashion retailers are using AI to create product images that drive sales and reduce returns.',
          content: `# Fashion E-commerce: AI Product Images That Convert

E-commerce fashion brands need high-quality images to drive sales. Here's how AI delivers.

## The E-commerce Challenge
Online fashion retailers face:
- High photography costs
- Need for multiple angles
- Model booking challenges
- Seasonal inventory turnover
- High return rates due to unclear visuals

## AI-Powered Solutions

### Multiple Angles
Generate 360° views without expensive turntable equipment.

### Consistent Lighting
Every product shot has perfect, consistent lighting.

### Model Variations
Show products on diverse body types and styles.

### Lifestyle Context
Create styled looks and outfit combinations.

### Quick Turnaround
New arrivals online within hours of arrival.

## Reducing Returns
Better images mean:
- Customers know exactly what they're buying
- Accurate color representation
- Clear detail shots
- Realistic expectations

## Implementation Strategy
1. **Start with hero products** - Test AI on bestsellers
2. **Gather feedback** - Compare conversion rates
3. **Scale gradually** - Expand to full catalog
4. **A/B test** - Compare AI vs traditional shots
5. **Optimize** - Refine based on data

## Real Results
An online boutique used AI to:
- Reduce photography costs by 75%
- Cut time-to-market from 2 weeks to 2 days
- Decrease returns by 20%
- Increase conversion rate by 15%

The future of fashion e-commerce is visual, fast, and AI-driven.`,
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
          category: 'Fashion & Apparel',
          date: '2026-01-15T10:00:00.000Z',
          readTime: '5 min read',
          published: true,
          createdAt: '2026-01-15T10:00:00.000Z',
          updatedAt: '2026-01-15T10:00:00.000Z',
        },
      ];
      
      // Save all mock posts
      for (const post of mockPosts) {
        await kv.set(post.id, post);
      }
      
      allPosts = mockPosts;
    }
    
    // Filter based on auth status
    const filteredPosts = authorized 
      ? allPosts 
      : allPosts.filter((post: any) => post.published);
    
    return c.json({ posts: filteredPosts.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ) });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return c.json({ error: 'Failed to fetch blog posts' }, 500);
  }
});

// Get single blog post
app.get("/make-server-42a7539f/blog/:slug", async (c) => {
  try {
    const slug = c.req.param('slug');
    const post = await kv.get(`blog_${slug}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    const { authorized } = await verifyAuth(c);
    
    // Only allow unpublished posts for authenticated users
    if (!post.published && !authorized) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    return c.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return c.json({ error: 'Failed to fetch blog post' }, 500);
  }
});

// Create blog post (requires auth)
app.post("/make-server-42a7539f/blog", async (c) => {
  try {
    const { authorized, userId } = await verifyAuth(c);
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const post = await c.req.json();
    const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newPost = {
      ...post,
      slug,
      id: `blog_${slug}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: userId,
    };
    
    await kv.set(`blog_${slug}`, newPost);
    
    return c.json({ post: newPost });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return c.json({ error: 'Failed to create blog post' }, 500);
  }
});

// Update blog post (requires auth)
app.put("/make-server-42a7539f/blog/:slug", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const slug = c.req.param('slug');
    const updates = await c.req.json();
    const existingPost = await kv.get(`blog_${slug}`);
    
    if (!existingPost) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    const updatedPost = {
      ...existingPost,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`blog_${slug}`, updatedPost);
    
    return c.json({ post: updatedPost });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return c.json({ error: 'Failed to update blog post' }, 500);
  }
});

// Delete blog post (requires auth)
app.delete("/make-server-42a7539f/blog/:slug", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const slug = c.req.param('slug');
    await kv.del(`blog_${slug}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return c.json({ error: 'Failed to delete blog post' }, 500);
  }
});

// ============ PORTFOLIO ROUTES ============

// Get all portfolio items
app.get("/make-server-42a7539f/portfolio", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    
    const allItems = await kv.getByPrefix('portfolio_');
    
    const filteredItems = authorized 
      ? allItems 
      : allItems.filter((item: any) => item.published);
    
    return c.json({ items: filteredItems });
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return c.json({ error: 'Failed to fetch portfolio items' }, 500);
  }
});

// Create portfolio item (requires auth)
app.post("/make-server-42a7539f/portfolio", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const item = await c.req.json();
    const id = `portfolio_${Date.now()}`;
    
    const newItem = {
      ...item,
      id,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(id, newItem);
    
    return c.json({ item: newItem });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return c.json({ error: 'Failed to create portfolio item' }, 500);
  }
});

// Update portfolio item (requires auth)
app.put("/make-server-42a7539f/portfolio/:id", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existingItem = await kv.get(id);
    
    if (!existingItem) {
      return c.json({ error: 'Item not found' }, 404);
    }
    
    const updatedItem = {
      ...existingItem,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(id, updatedItem);
    
    return c.json({ item: updatedItem });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return c.json({ error: 'Failed to update portfolio item' }, 500);
  }
});

// Delete portfolio item (requires auth)
app.delete("/make-server-42a7539f/portfolio/:id", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const id = c.req.param('id');
    await kv.del(id);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return c.json({ error: 'Failed to delete portfolio item' }, 500);
  }
});

// ============ NEWSLETTER ROUTES ============

// Subscribe to newsletter
app.post("/make-server-42a7539f/newsletter", async (c) => {
  try {
    const { email, name } = await c.req.json();
    
    const subscriber = {
      email,
      name,
      subscribedAt: new Date().toISOString(),
    };
    
    await kv.set(`newsletter_${email}`, subscriber);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return c.json({ error: 'Failed to subscribe' }, 500);
  }
});

// Get newsletter subscribers (requires auth)
app.get("/make-server-42a7539f/newsletter", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const subscribers = await kv.getByPrefix('newsletter_');
    
    return c.json({ subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return c.json({ error: 'Failed to fetch subscribers' }, 500);
  }
});

// ============ SNAPSHOTS ROUTES ============

// Get all snapshots
app.get("/make-server-42a7539f/snapshots", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    
    const allSnapshots = await kv.getByPrefix('snapshot_');
    
    const filteredSnapshots = authorized 
      ? allSnapshots 
      : allSnapshots.filter((snapshot: any) => snapshot.published);
    
    return c.json({ snapshots: filteredSnapshots });
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    return c.json({ error: 'Failed to fetch snapshots' }, 500);
  }
});

// Create snapshot (requires auth)
app.post("/make-server-42a7539f/snapshots", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const snapshot = await c.req.json();
    const id = `snapshot_${Date.now()}`;
    
    const newSnapshot = {
      ...snapshot,
      id,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(id, newSnapshot);
    
    return c.json({ snapshot: newSnapshot });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    return c.json({ error: 'Failed to create snapshot' }, 500);
  }
});

// Update snapshot (requires auth)
app.put("/make-server-42a7539f/snapshots/:id", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existingSnapshot = await kv.get(id);
    
    if (!existingSnapshot) {
      return c.json({ error: 'Snapshot not found' }, 404);
    }
    
    const updatedSnapshot = {
      ...existingSnapshot,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(id, updatedSnapshot);
    
    return c.json({ snapshot: updatedSnapshot });
  } catch (error) {
    console.error('Error updating snapshot:', error);
    return c.json({ error: 'Failed to update snapshot' }, 500);
  }
});

// Delete snapshot (requires auth)
app.delete("/make-server-42a7539f/snapshots/:id", async (c) => {
  try {
    const { authorized } = await verifyAuth(c);
    if (!authorized) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const id = c.req.param('id');
    await kv.del(id);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting snapshot:', error);
    return c.json({ error: 'Failed to delete snapshot' }, 500);
  }
});

Deno.serve(app.fetch);
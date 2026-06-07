# Deployment Guide for Cloudflare Pages

## Static Site for Cloudflare Pages

This is a converted pure HTML, CSS, and JavaScript version of your Next.js site, ready to deploy to Cloudflare Pages.

### Files Structure

```
static/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # All styling
├── js/
│   └── main.js            # JavaScript functionality
├── data/
│   └── portfolio.json     # Portfolio items data
└── public/                # Static assets (copy from../public)
```

### Deployment Steps

#### Option 1: GitHub Integration (Recommended)

1. **Commit the static folder to your Git repository:**
   ```bash
   git add static/
   git commit -m "Add static site for Cloudflare Pages"
   git push
   ```

2. **Deploy via GitHub:**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Connect your GitHub account
   - Select your repository
   - Set build configuration:
     - **Build command:** (leave empty - no build needed)
     - **Build output directory:** `static`
   - Click "Save and Deploy"

#### Option 2: Direct Upload (Using Wrangler CLI)

1. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate:**
   ```bash
   wrangler login
   ```

3. **Deploy:**
   ```bash
   wrangler pages deploy static/
   ```

#### Option 3: Drag & Drop

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Create a project" → "Direct upload"
3. Drag the `static` folder into the upload area
4. Click "Deploy site"

### Portfolio Data

The portfolio items are stored in `static/data/portfolio.json`. To update your portfolio:

1. Edit `static/data/portfolio.json`
2. Add/remove items with the following structure:
   ```json
   {
     "id": "unique-id",
     "title": "Project Title",
     "description": "Optional description",
     "tools": "Optional tools used",
     "imageUrl": "https://example.com/image.jpg"
   }
   ```
3. Commit and push changes (or re-deploy if using direct upload)

### Contact Form

The contact form uses Formspree (configured with ID `mdakyedw`). To update:

1. Edit `static/js/main.js`
2. Change the Formspree URL in the form submission handler:
   ```javascript
   const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
   ```
3. Update your form ID at [Formspree](https://formspree.io/)

### Analytics

Google Analytics is configured with ID `G-9J28T0G3LB`. To update:

1. Edit `static/index.html`
2. Replace the analytics ID in the script tags:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
   <script>
     gtag('config', 'YOUR_GA_ID');
   </script>
   ```

### Custom Domain

After deployment:

1. In Cloudflare Pages dashboard
2. Go to your project settings
3. Add a custom domain
4. Update DNS records as needed

### Local Testing

To test the site locally:

1. Start a simple HTTP server:
   ```bash
   cd static
   python -m http.server 8000
   # or
   python3 -m http.server 8000
   ```

2. Open [http://localhost:8000](http://localhost:8000)

### Browser Support

This site uses:
- Modern CSS (flexbox, grid)
- Fetch API for portfolio loading
- Google Analytics
- No JavaScript framework dependencies

Works on all modern browsers (Chrome, Firefox, Safari, Edge).

### Performance

- **Pure static HTML/CSS/JS** - no build process needed
- **Font Awesome icons** - loaded via CDN
- **Responsive design** - mobile, tablet, and desktop optimized
- **Fast loading** - minimal dependencies

### Troubleshooting

**Portfolio images not loading:**
- Check that image URLs in `portfolio.json` are accessible
- Ensure CORS is enabled on your image hosting

**Form not submitting:**
- Verify Formspree form ID is correct
- Check browser console for errors
- Ensure JavaScript is enabled

**Styles not applying:**
- Check that `styles/main.css` is properly linked in `index.html`
- Verify all CSS files are included in deployment

### Next Steps

- Add your actual portfolio images to `data/portfolio.json`
- Update the Formspree form ID for your email
- Configure Google Analytics tracking
- Test thoroughly before going live
- Set up auto-deployment via GitHub for future updates

 **Create GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/chaliraza176/your-repo-name.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Login to Netlify: https://modrenportfolio-ali.netlify.app/
   # 🚀 Ali Raza - Portfolio Website

A modern, responsive portfolio website built with vanilla HTML, CSS, and JavaScript featuring dynamic color themes, smooth animations, and interactive elements.

![Portfolio Preview](https://via.placeholder.com/1200x600/000000/DC143C?text=Ali+Raza+Portfolio)

## ✨ Features

- 🎨 **Dynamic Color Theme Switcher** - Choose from 8 preset colors or create custom themes
- 🌓 **Dark Theme** - Pure black background with vibrant color accents
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ⚡ **Smooth Animations** - Scroll-triggered animations and micro-interactions
- 🎯 **Orbiting Tech Icons** - Animated technology stack showcase
- 💼 **Project Showcase** - Display projects with live demo links
- 📧 **Contact Form** - Functional contact section with validation
- 🔗 **Social Integration** - GitHub, LinkedIn, Freelancer, WhatsApp links
- 📄 **CV Download** - Direct resume download functionality
- 🎭 **Typing Effect** - Dynamic text rotator in hero section

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Variables, Grid, Flexbox
- **JavaScript (ES6+)** - Vanilla JS for interactivity
- **Font Awesome** - Icon library
- **DevIcons CDN** - Technology logos

## 📂 Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styles
├── js/
│   └── main.js            # JavaScript functionality
├── assets/
│   ├── images/            # Images and screenshots
│   │   ├── profile.jpg    # Profile photo
│   │   └── *.png          # Project screenshots
│   └── documents/
│       └── Ali_Raza_CV.pdf # Resume/CV
├── netlify.toml           # Netlify configuration
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/chaliraza176/portfolio.git
cd portfolio
```

### 2. Add Your Content

**Profile Photo:**
- Add your photo: `assets/images/profile.jpg`
- Recommended size: 500x500px (square)

**Project Screenshots:**
- Add screenshots in `assets/images/`
- Names: `student-portal.png`, `futuristic-portfolio.png`, etc.

**CV/Resume:**
- Add your CV: `assets/documents/Ali_Raza_CV.pdf`
- Format: PDF (under 2MB)

### 3. Customize Content

**Update Personal Info:**
- Open `index.html`
- Update name, email, phone, location
- Update social media links

**Update Projects:**
- Edit project titles, descriptions, and links
- Add your live demo URLs

### 4. Run Locally

Simply open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using VS Code
# Install "Live Server" extension and right-click index.html
```

Visit: `http://localhost:8000`

## 🎨 Color Theme Customization

The website features a dynamic color theme system:

1. Click the **palette icon** (🎨) in the navigation bar
2. Choose from 8 preset colors:
   - Red (Default)
   - Blue
   - Green
   - Orange
   - Purple
   - Pink
   - Gold
   - Cyan
3. Or use the **custom color picker** for any color
4. Theme persists across page reloads (localStorage)

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🌐 Deployment

### Deploy to Netlify (Recommended)

**Option 1: Drag & Drop**
1. Go to https://app.netlify.com/drop
2. Drag your project folder
3. Done!

**Option 2: GitHub Integration**
1. Push code to GitHub
2. Connect repository to Netlify
3. Auto-deploy on every push

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📋 Checklist Before Deployment

- [ ] Add profile photo (`assets/images/profile.jpg`)
- [ ] Add project screenshots
- [ ] Add CV/Resume (`assets/documents/Ali_Raza_CV.pdf`)
- [ ] Update personal information (email, phone, location)
- [ ] Update social media links
- [ ] Test all project links
- [ ] Test color theme switcher
- [ ] Test on mobile devices
- [ ] Test CV download
- [ ] Check all animations

## 🎯 Key Sections

### 1. Hero Section
- Dynamic typing effect with rotating titles
- Orbiting technology icons
- Social media links
- CV download button

### 2. About Section
- Professional bio
- Skills showcase with interactive tags
- Code block with developer info

### 3. Projects Section
- 8 project cards with:
  - Project screenshots
  - Descriptions
  - Technology tags
  - Live demo & GitHub links

### 4. Contact Section
- Contact information
- Contact form
- Social media links

## 🔧 Customization Guide

### Change Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #8B0000;
    --secondary-color: #DC143C;
    --accent-color: #FF6B6B;
}
```

### Add More Projects
In `index.html`, duplicate a project card:
```html
<article class="project-card">
    <!-- Project content -->
</article>
```

### Modify Rotating Titles
In `js/main.js`, edit the titles array:
```javascript
const titles = [
    'Code Explorer',
    'Problem Solver',
    'MERN Stack Developer',
    'Full Stack Developer'
];
```

## 📊 Performance

- ✅ Lazy loading for images
- ✅ Optimized animations
- ✅ Minimal dependencies
- ✅ Fast load times
- ✅ SEO friendly

## 🌟 Features in Detail

### Dynamic Color Theme
- 8 preset colors + custom picker
- Automatic light/dark shade generation
- Affects all UI elements (borders, shadows, backgrounds)
- Persists using localStorage

### Orbiting Icons
- 8 technology icons orbit around profile
- Smooth circular animation
- Hover effects with scale and glow
- Responsive positioning

### Typing Effect
- 4 rotating professional titles
- Smooth typing and deleting animation
- Customizable speed and delay
- Cursor blink effect

## 🐛 Troubleshooting

**Images not showing?**
- Check file paths are correct
- Ensure images are in `assets/images/`
- Verify file names match exactly

**Colors not changing?**
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors
- Ensure JavaScript is enabled

**CV not downloading?**
- Verify file exists: `assets/documents/Ali_Raza_CV.pdf`
- Check file name matches exactly
- Try different browser

## 📞 Contact

- **Email:** alirazachh176@example.com
- **Phone:** +92-323-0917176
- **Location:** Vehari, Pakistan
- **GitHub:** [chaliraza176](https://github.com/chaliraza176)
- **LinkedIn:** [Ali Raza](https://www.linkedin.com/in/ali-raza-455102292/)
- **Freelancer:** [BSCSAliRaza176](https://www.freelancer.pk/u/BSCSAliRaza176)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Font Awesome for icons
- DevIcons for technology logos
- Unsplash for placeholder images
- Netlify for hosting

## 🚀 Future Enhancements

- [ ] Blog section
- [ ] Testimonials
- [ ] Skills progress bars
- [ ] Project filters
- [ ] Dark/Light mode toggle
- [ ] Multi-language support
- [ ] Analytics integration
- [ ] SEO optimization

---

**Made with ❤️ by Ali Raza**

⭐ Star this repo if you like it!


# Deployment Guide - Ali Raza Portfolio

## 🚀 Deploy to Netlify

### Option 1: Drag & Drop (Fastest)

1. Go to: https://app.netlify.com/drop
2. Drag your entire project folder
3. Done! Your site is live

### Option 2: GitHub + Netlify (Recommended)

1. **Create GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/chaliraza176/your-repo-name.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Login to Netlify: https://app.netlify.com
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository
   - Click "Deploy site"

### Option 3: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

## 📝 Before Deployment Checklist

- [ ] Add your profile photo: `assets/images/profile.jpg`
- [ ] Add project screenshots in `assets/images/`
- [ ] Update email in contact section
- [ ] Test all links (GitHub, LinkedIn, Freelancer)
- [ ] Test color theme switcher
- [ ] Check responsive design on mobile

## 🔧 Custom Domain (Optional)

1. Go to Netlify Dashboard
2. Site settings → Domain management
3. Add custom domain
4. Update DNS records

## 📊 Performance Tips

- Images are already optimized with lazy loading
- CSS and JS are minified
- Font Awesome loaded from CDN
- LocalStorage used for theme persistence

## 🌐 Your Live URLs

After deployment, you'll get:
- Netlify URL: `https://your-site-name.netlify.app`
- Custom domain (if added): `https://alirazachh176.com`

## 🎨 Features Included

✅ Dynamic color theme switcher
✅ Responsive design (mobile, tablet, desktop)
✅ Smooth animations
✅ Orbiting tech icons
✅ Project showcase with live links
✅ Contact form
✅ Social media integration

## 📱 Test Your Site

After deployment, test on:
- Desktop browsers (Chrome, Firefox, Edge)
- Mobile devices (iOS, Android)
- Different screen sizes
- All interactive features

## 🐛 Troubleshooting

**Images not showing?**
- Make sure images are in `assets/images/` folder
- Check file names match exactly

**Colors not changing?**
- Clear browser cache
- Check browser console for errors

**Links not working?**
- Verify all URLs are correct
- Check target="_blank" for external links

## 📞 Support

If you face any issues:
1. Check browser console (F12)
2. Verify all files are uploaded
3. Clear cache and hard refresh (Ctrl+Shift+R)

---

**Good Luck with Your Deployment! 🚀**

# Matrimonial Page CSS Documentation

## Overview
This document describes the CSS implementation for the matrimonial page with proper font families and responsive design.

## Font Families Used

### Primary Fonts
- **Barlow Condensed**: Used for headings, titles, and profile names
  - Weights: 300, 400, 500, 600, 700
  
- **Barlow**: Used for body text, labels, and descriptions
  - Weights: 300, 400, 500, 600, 700

### Font Import
```css
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@300;400;500;600;700&display=swap');
```

## File Structure

### Main CSS Files
1. **style.css** - Main stylesheet with matrimonial section styles
2. **matrimonial.css** - Dedicated matrimonial page styles (optional standalone)

## Key Components

### 1. List Section (Header)
- Background: Light beige pattern (#faf7f3)
- Centered header with label and title
- Font: Barlow Condensed for titles

### 2. Filter Buttons
- Three main filters: "ALL PROFILES", "BRIDES", "GROOMS"
- Active state: Red gradient background
- Hover effect: Transform and shadow
- Font: Barlow, 16px, 600 weight

### 3. Age Range Filter
- Two input fields: Min Age and Max Age
- Width: 100px each
- Border: 2px solid #ddd
- Focus state: Red border (#b9252f)

### 4. Marital Status Filter
- Dropdown select with options:
  - All
  - Never Married
  - Divorced
  - Widowed
  - Separated
- Width: 200px
- Font: Barlow, 15px

### 5. Profile Grid
- Desktop: 4 columns
- Tablet: 3 columns
- Mobile Landscape: 2 columns
- Mobile Portrait: 1 column
- Gap: 30px (desktop), 20px (mobile)

### 6. Profile Card
- Background: White (#fff)
- Border: 1px solid #f0e6dc
- Border radius: 8px
- Hover effect: 
  - Transform: translateY(-5px)
  - Shadow: 0 8px 20px rgba(185, 37, 47, 0.15)
  - Border color: #b9252f

### 7. Profile Image
- Height: 280px (desktop), 240px (tablet), 320px (mobile)
- Object-fit: cover
- Hover effect: Scale(1.05)

### 8. Profile Content
- Padding: 18px 16px
- Profile ID: 13px, uppercase, #999
- Profile Name: 20px, Barlow Condensed, 600 weight
- Profile Info: 14px, Barlow, #666

### 9. Pagination
- Centered alignment
- Button size: 40x40px (desktop), 36x36px (tablet), 34x34px (mobile)
- Active state: Red gradient
- Disabled state: 40% opacity

## Color Palette

### Primary Colors
- **Red Primary**: #b9252f
- **Red Dark**: #6a2c2d
- **Red Gradient**: linear-gradient(180deg, #b9252f 0%, #6a2c2d 100%)

### Neutral Colors
- **Background**: #faf7f3
- **White**: #fff
- **Border**: #f0e6dc, #ddd
- **Text Dark**: #222, #333
- **Text Medium**: #666
- **Text Light**: #999

## Responsive Breakpoints

### Desktop (Default)
- Grid: 4 columns
- Filter buttons: 150px min-width
- Profile image: 280px height

### Tablet (max-width: 991px)
- Grid: 3 columns
- Gap: 25px
- Title: 40px

### Mobile Landscape (max-width: 767px)
- Grid: 2 columns
- Gap: 20px
- Title: 32px
- Filter buttons: 120px min-width
- Profile image: 240px height

### Mobile Portrait (max-width: 575px)
- Grid: 1 column
- Title: 28px
- Filter buttons: Full width, stacked
- Profile image: 320px height

### Small Mobile (max-width: 480px)
- Title: 24px
- Profile image: 280px height
- Reduced padding and margins

## Usage

### In React Component
```jsx
import '../css/style.css';
// or
import '../css/matrimonial.css';
```

### HTML Structure
```html
<section class="list-section">
  <div class="container">
    <div class="header-section">
      <span class="header-label">Listing</span>
      <h2 class="header-title-center">
        <strong>
          <span>Turning </span>profiles <span>into lifelong </span>partnerships.
        </strong>
      </h2>
    </div>
    
    <div class="filter-buttons">
      <button class="filter-btn active">All Profiles</button>
      <button class="filter-btn">Brides</button>
      <button class="filter-btn">Grooms</button>
    </div>
    
    <div class="age-filter">
      <label>Age Range:</label>
      <input type="number" placeholder="Min Age" />
      <span>to</span>
      <input type="number" placeholder="Max Age" />
    </div>
    
    <div class="marital-status-filter">
      <label>Marital Status:</label>
      <select>
        <option value="">All</option>
        <option value="Never Married">Never Married</option>
        <option value="Divorced">Divorced</option>
        <option value="Widowed">Widowed</option>
        <option value="Separated">Separated</option>
      </select>
    </div>
  </div>
</section>

<section class="profile-section">
  <div class="container">
    <div class="profile-grid">
      <a href="/profile/1" class="profile-card-link">
        <div class="profile-card">
          <div class="profile-img">
            <img src="profile.jpg" alt="Profile" />
          </div>
          <div class="profile-content">
            <span class="profile-id">Profile ID: F-123</span>
            <h4 class="profile-name">Jane Doe</h4>
            <p class="profile-dob">Birth Date: 01/01/1990</p>
            <p class="profile-info">Age: 34</p>
          </div>
        </div>
      </a>
    </div>
    
    <div class="pagination">
      <button disabled>«</button>
      <button class="active">1</button>
      <button>2</button>
      <button>3</button>
      <button>»</button>
    </div>
  </div>
</section>
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations
- Uses CSS Grid for efficient layout
- Hardware-accelerated transforms
- Optimized hover effects
- Responsive images with object-fit

## Accessibility
- Proper color contrast ratios
- Focus states for interactive elements
- Semantic HTML structure
- Keyboard navigation support

## Future Enhancements
- Dark mode support
- Animation transitions
- Advanced filtering options
- Skeleton loading states

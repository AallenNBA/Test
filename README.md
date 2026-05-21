# NBA Venue Tracker

An interactive web-based tool for tracking and managing NBA and WNBA venue camera positions, broadcast operations, and engineering data.

## Features

### 🎥 Camera Management
- **Drag-and-Drop Positioning**: Easily position cameras on interactive venue maps
- **Multiple Camera Types**: Broadcast cameras, handheld cameras, headsets, announce tables
- **Real-time Customization**: Adjust size, color, rotation, opacity, and more
- **Auto-Save**: All changes automatically saved to browser storage

### 🏟️ Venue Management
- State Farm Arena (Atlanta Hawks) included
- Expandable venue database
- Complete venue information and facilities
- Seating chart integration

### 📝 Documentation
- Position notes and descriptions
- Camera specifications
- Broadcast standards reference
- Measurement tracking

### 🎨 Customization
- Custom background and icon colors
- Adjustable icon sizes and rotation
- Label customization
- Opacity controls
- Professional dark theme

### ☁️ Sharing
- GitHub Pages deployment
- Shareable URL
- No installation required
- Works on desktop and tablets

## Getting Started

1. **Access the Live Site**: https://aallennba.github.io/Test/
2. **Select a Venue**: Choose from available venues in the dropdown
3. **Add Cameras**: Click "Add New Camera" or click on the map to add positions
4. **Customize**: Click on a camera to edit its properties
5. **Save**: Changes auto-save to your browser

## How to Use

### Adding Cameras
- Click **"Add New Camera"** button in the Quick Add section
- Or click directly on the arena map
- Cameras appear with default settings

### Positioning
- **Drag** camera icons to move them around the venue
- Positions update in real-time
- Click **Zoom In/Out** to adjust map scale

### Customizing
- **Icon Type**: Change between broadcast camera, handheld, headset, announce table
- **Colors**: Set background and icon colors
- **Size**: Adjust icon size (20-80px)
- **Rotation**: Rotate icons 0-360 degrees
- **Opacity**: Control transparency (0-100%)
- **Labels**: Add custom titles and descriptions

### Recording Notes
- Add detailed notes about each camera position
- Notes auto-save and persist across sessions
- Include angle, distance, and special instructions

## Data Structure

### Camera Object
```json
{
  "id": "camera-1234567890",
  "type": "broadcast-camera",
  "x": 400,
  "y": 300,
  "size": 44,
  "bgColor": "#e63946",
  "iconColor": "#ffffff",
  "rotation": 0,
  "labelSize": 14,
  "opacity": 80,
  "title": "Mid-Level Center Court",
  "subtitle": "Play-by-Play",
  "notes": "Primary camera position..."
}
```

### Venue Object
```json
{
  "id": "state-farm-arena",
  "name": "State Farm Arena",
  "location": "Atlanta, GA",
  "team": "Atlanta Hawks",
  "league": "NBA",
  "capacity": 18676,
  "yearOpened": 2018,
  "dimensions": {...},
  "broadcastFacilities": {...}
}
```

## Features Coming Soon

- ✨ Multiple venue support (all NBA/WNBA venues)
- ✨ Image upload and annotation
- ✨ Export camera configurations
- ✨ Measurement tools
- ✨ Broadcast standards templates
- ✨ Team collaboration features
- ✨ Historical data tracking
- ✨ Advanced reporting

## Technical Details

### Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser LocalStorage
- **Hosting**: GitHub Pages
- **No dependencies required** - Pure vanilla implementation

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

Open source - Feel free to fork and customize for your venue tracking needs.

## Contributing

Contributions welcome! Areas for expansion:
- Additional venues
- Enhanced measurement tools
- Broadcast standards library
- Documentation templates
- Collaboration features

## Support

For issues or feature requests, please open an issue in the repository.

# Productivity Tracker Chrome Extension

A comprehensive productivity tracking solution that monitors website usage and provides detailed analytics through a Chrome extension, backend API, and web dashboard.

## Features

### Chrome Extension
- **Real-time tracking**: Monitors active tabs and logs time spent on each website
- **Smart categorization**: Automatically classifies websites as productive, unproductive, or neutral
- **Local storage**: Stores data locally with automatic backend sync
- **Popup interface**: Quick overview of daily productivity stats
- **Inactivity detection**: Stops tracking during periods of inactivity

### Backend API
- **RESTful API**: Built with Node.js and Express
- **MongoDB integration**: Persistent data storage
- **JWT authentication**: Secure user sessions
- **Analytics endpoints**: Daily and weekly data aggregation
- **CORS enabled**: Cross-origin requests support

### Web Dashboard
- **Modern UI**: Built with React and TailwindCSS
- **Interactive charts**: Powered by Recharts library
- **Multiple views**: Daily, weekly, and report views
- **Productivity scoring**: Automatic calculation of productivity metrics
- **Responsive design**: Works on desktop and mobile devices

## Tech Stack

- **Extension**: JavaScript (Manifest V3)
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React, TailwindCSS, Recharts
- **Authentication**: JWT tokens
- **Database**: MongoDB with Mongoose ODM

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Chrome browser for extension testing

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env` file and update MongoDB URI if needed
   - Default MongoDB URI: `mongodb://localhost:27017/productivity-tracker`
   - Update JWT_SECRET for production use

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3001`

### Dashboard Setup

1. Navigate to the dashboard directory:
```bash
cd dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The dashboard will run on `http://localhost:3000`

### Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`

2. Enable "Developer mode" (toggle in top right)

3. Click "Load unpacked" and select the `chrome-extension` folder

4. The extension should now appear in your browser toolbar

## Usage

### Getting Started

1. **Start the backend server** (required for data persistence)
2. **Start the dashboard** (for viewing analytics)
3. **Install the Chrome extension**
4. **Create an account** on the dashboard at `http://localhost:3000`
5. **Start browsing** - the extension will automatically track your activity

### Extension Features

- **Popup**: Click the extension icon to see today's summary
- **Automatic tracking**: No manual intervention required
- **Category detection**: Websites are automatically categorized
- **Data sync**: Data is stored locally and synced to backend

### Dashboard Features

- **Daily View**: Bar chart of today's website usage + productivity pie chart
- **Weekly View**: Line chart showing productivity trends over time
- **Weekly Report**: Comprehensive analysis with recommendations
- **Authentication**: Secure login/registration system

## Website Categories

### Productive Websites
- github.com, stackoverflow.com, leetcode.com
- developer.mozilla.org, w3schools.com, freecodecamp.org
- coursera.org, udemy.com, edx.org, khanacademy.org

### Unproductive Websites
- facebook.com, instagram.com, youtube.com, twitter.com
- tiktok.com, reddit.com, netflix.com, twitch.tv
- snapchat.com, pinterest.com

### Neutral Websites
- All other websites not in the above categories

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Analytics
- `POST /api/time-tracking` - Store time tracking data
- `GET /api/analytics/daily` - Get daily analytics
- `GET /api/analytics/weekly` - Get weekly analytics
- `GET /api/analytics` - Get user-specific analytics (requires auth)

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd dashboard
npm run dev  # Hot reload enabled
```

### Extension Development
- Make changes to files in `chrome-extension/`
- Go to `chrome://extensions/`
- Click the refresh icon on your extension
- Test the changes

## Project Structure

```
productivity-tracker/
├── chrome-extension/          # Chrome extension files
│   ├── manifest.json         # Extension manifest
│   ├── background.js         # Service worker
│   ├── content.js           # Content script
│   ├── popup.html           # Extension popup
│   └── popup.js             # Popup functionality
├── backend/                  # Node.js backend
│   ├── server.js            # Main server file
│   ├── package.json         # Dependencies
│   └── .env                 # Environment variables
├── dashboard/               # React dashboard
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Dependencies
│   └── vite.config.js      # Vite configuration
└── README.md               # This file
```

## Troubleshooting

### Extension Issues
- **Extension not tracking**: Check if it's enabled in `chrome://extensions/`
- **No data in popup**: Ensure you've browsed some websites after installation
- **Backend connection failed**: Verify backend is running on port 3001

### Backend Issues
- **MongoDB connection error**: Ensure MongoDB is running locally or update connection string
- **Port already in use**: Change PORT in `.env` file
- **CORS errors**: Verify frontend is running on port 3000

### Dashboard Issues
- **Login not working**: Ensure backend is running and accessible
- **No data showing**: Check browser console for API errors
- **Charts not loading**: Verify Recharts is installed correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Website blocking functionality
- [ ] Custom category management
- [ ] Export data to CSV/PDF
- [ ] Mobile app companion
- [ ] Team/organization features
- [ ] Integration with productivity tools
- [ ] Advanced analytics and insights
- [ ] Notification system for productivity goals
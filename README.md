# RFID Dashboard - Learning Documentation

Welcome! This repository contains an RFID Dashboard application built with Next.js and React. This documentation will help you understand how the entire application works, from start to finish.

## 📚 Documentation Files

To help you learn the flow of this application, we've created comprehensive documentation:

### 1. [CODE_EXPLANATION.md](CODE_EXPLANATION.md) 📖
**Start here!** This is the main documentation file that provides:
- **Line-by-line code explanations** for every file
- **Detailed descriptions** of how each component works
- **Technology stack** overview
- **Key concepts** explained (React hooks, state management, API integration)
- **Common operations** with examples
- **Development commands** to run the project
- **Troubleshooting guide** for common issues

### 2. [FLOW_DIAGRAM.md](FLOW_DIAGRAM.md) 📊
**Visual learner?** This file contains:
- **ASCII diagrams** showing the complete application flow
- **Step-by-step visualizations** of:
  - Application initialization
  - Data fetching process
  - Component rendering
  - State management
  - Continuous polling loop
  - Error handling
- **React lifecycle** diagrams

### 3. Inline Code Comments 💬
The actual source code files now contain **extensive inline comments**:
- `rfid_dashboard/pages/_app.js` - App initialization explained
- `rfid_dashboard/pages/index.js` - Main dashboard with detailed comments
- `rfid_dashboard/styles/globals.css` - CSS explanations

## 🚀 Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd rfid_dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🎯 What This Application Does

This is a **real-time RFID monitoring dashboard** that:

1. **Connects** to an ESP32 device via HTTP API
2. **Fetches** RFID scan logs every second
3. **Displays** two synchronized views:
   - **Left side**: List of unique RFID tags with status toggles
   - **Right side**: Complete log table with all scan events
4. **Updates** automatically without page refresh

## 📖 How to Learn the Flow

We recommend learning in this order:

### For Complete Beginners:
1. Start with [CODE_EXPLANATION.md](CODE_EXPLANATION.md) - Section "Project Overview"
2. Look at the "Technology Stack" table to understand what tools are used
3. Review the "Project Structure" to see how files are organized
4. Read through "File-by-File Explanation" - each file is explained in detail
5. Study the "Application Flow" section to understand the sequence
6. Check out [FLOW_DIAGRAM.md](FLOW_DIAGRAM.md) for visual diagrams

### For Visual Learners:
1. Start with [FLOW_DIAGRAM.md](FLOW_DIAGRAM.md)
2. Follow the ASCII diagrams to visualize the flow
3. Then read [CODE_EXPLANATION.md](CODE_EXPLANATION.md) for details
4. Look at the actual code with inline comments

### For Experienced Developers:
1. Skim [CODE_EXPLANATION.md](CODE_EXPLANATION.md) - "Application Flow" section
2. Read the inline comments in `rfid_dashboard/pages/index.js`
3. Check [FLOW_DIAGRAM.md](FLOW_DIAGRAM.md) for data flow diagrams
4. Run the app and explore the code yourself

## 🗂️ Project Structure

```
Elective3_FinalPIT/
├── README.md                        # This file - Start here!
├── CODE_EXPLANATION.md              # Complete code explanation
├── FLOW_DIAGRAM.md                  # Visual flow diagrams
└── rfid_dashboard/                  # Main application
    ├── pages/                       # Next.js pages (routing)
    │   ├── _app.js                  # App initialization (with comments)
    │   └── index.js                 # Main dashboard (with detailed comments)
    ├── styles/                      # CSS styles
    │   └── globals.css              # Global styles (with comments)
    ├── public/                      # Static assets (images, icons)
    ├── package.json                 # Dependencies and scripts
    ├── tsconfig.json                # TypeScript configuration
    ├── eslint.config.mjs            # Linting configuration
    ├── next.config.ts               # Next.js configuration
    └── postcss.config.mjs           # PostCSS configuration
```

## 🔑 Key Concepts

### React Hooks
- **`useState`**: Manages component state (data that changes)
- **`useEffect`**: Handles side effects (API calls, timers)

### State Management
- **`logs`**: Array of all RFID scan events
- **`rfidList`**: Array of unique RFID tags

### Data Flow
```
ESP32 Device → PHP API → Axios → React State → UI Rendering
```

### Polling Mechanism
- Fetches data every 1 second using `setInterval`
- Automatically updates UI with new data
- Cleans up interval on component unmount

## 🛠️ Technologies Explained

- **Next.js**: React framework that handles routing, server-side rendering, and build optimization
- **React**: JavaScript library for building user interfaces with components
- **TypeScript**: Adds type safety to JavaScript code
- **Bootstrap**: CSS framework for responsive design and pre-built components
- **Axios**: HTTP client for making API requests
- **Tailwind CSS**: Utility-first CSS framework for styling

## 📝 Common Tasks

### View RFID logs in real-time
- Just open the app in your browser
- Data updates automatically every second

### Understand how data is fetched
- Read the `fetchData()` function in `pages/index.js`
- Check the "Data Fetching Flow" diagram in `FLOW_DIAGRAM.md`

### Modify the polling interval
- Change `1000` to your desired milliseconds in `pages/index.js` line:
  ```javascript
  const interval = setInterval(fetchData, 1000); // Change 1000 to your value
  ```

### Change the API endpoint
- Update the URL in `pages/index.js`:
  ```javascript
  const res = await axios.get("http://10.141.68.150/esp32/get_logs.php");
  ```

## 🎓 Learning Resources

- [React Documentation](https://react.dev/) - Learn React fundamentals
- [Next.js Documentation](https://nextjs.org/docs) - Learn Next.js framework
- [Bootstrap Documentation](https://getbootstrap.com/docs/) - Learn Bootstrap components
- [MDN Web Docs](https://developer.mozilla.org/) - Learn web technologies

## 🤝 Need Help?

If you're stuck:
1. Read the relevant section in [CODE_EXPLANATION.md](CODE_EXPLANATION.md)
2. Check the diagrams in [FLOW_DIAGRAM.md](FLOW_DIAGRAM.md)
3. Look at the inline comments in the source code
4. Run the app and use browser DevTools to inspect behavior

## 📚 Additional Documentation

Each section of the code is extensively documented:

- **Configuration files**: Explained in CODE_EXPLANATION.md
- **Component logic**: Inline comments in source files
- **Data flow**: Diagrams in FLOW_DIAGRAM.md
- **API integration**: Detailed in CODE_EXPLANATION.md

Happy learning! 🎉

---

**Note**: This documentation was created to help you understand every aspect of the application. Take your time, read through each section, and don't hesitate to experiment with the code!

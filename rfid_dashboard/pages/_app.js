// pages/_app.js
// This is the root component that wraps all pages in the Next.js application
// It runs once when the app initializes and persists across page navigation

// Import Bootstrap CSS framework - provides pre-built UI components and grid system
import 'bootstrap/dist/css/bootstrap.min.css';

// Import custom global styles that apply to all pages
import '../styles/globals.css';

/**
 * MyApp Component - Custom Next.js App Component
 * 
 * This component wraps every page in the application and allows us to:
 * - Load global CSS files
 * - Maintain state across page navigation
 * - Add global layouts or providers
 * 
 * @param {Object} props
 * @param {React.Component} props.Component - The active page component being rendered
 * @param {Object} props.pageProps - Props passed to the page component
 * @returns {JSX.Element} The page component with its props
 */
export default function MyApp({ Component, pageProps }) {
  // Render the current page component and spread its props
  return <Component {...pageProps} />;
}

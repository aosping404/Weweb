import { useApp } from '../context/AppContext';
import './UnifiedNavbar.css';

const UnifiedNavbar = () => {
  const { switchToHome } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#top" 
            onClick={(e) => {
              e.preventDefault();
              switchToHome();
            }}
            className="navbar-logo-unified"
          >
            <div className="logo-icon-unified">
              <span>Aos</span>
            </div>
            <span className="logo-text-unified">时雨</span>
          </a>

          {/* 页面标题 */}
          <div className="page-title">
            <span className="text-white/60 text-sm uppercase tracking-wider">
              Personal Gallery
            </span>
          </div>

          {/* 返回主页按钮 */}
          <button
            onClick={switchToHome}
            className="back-to-home-btn"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>主页</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default UnifiedNavbar;

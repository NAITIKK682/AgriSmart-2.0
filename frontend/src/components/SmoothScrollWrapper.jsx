import { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * SmoothScrollWrapper Component - Provides smooth scrolling behavior for the entire page
 * Features:
 * - Smooth scroll-to-element functionality
 * - Scroll progress indicator
 * - Momentum-based scrolling
 * - Accessibility support
 */
const SmoothScrollWrapper = ({ children, className = '' }) => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    container: scrollRef,
  });

  // Smooth scroll progress for animations
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Enable smooth scrolling globally
  useEffect(() => {
    // Add smooth scrolling CSS
    document.documentElement.style.scrollBehavior = 'smooth';

    // Handle smooth scroll to hash links
    const handleHashLink = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;

      e.preventDefault();
      const targetId = target.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    };

    // Add event listener for hash links
    document.addEventListener('click', handleHashLink);

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.removeEventListener('click', handleHashLink);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className={`relative ${className}`}
      style={{
        scrollBehavior: 'smooth',
      }}
    >
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Main content */}
      <div className="relative">
        {children}
      </div>

      {/* Scroll to top button appears on scroll */}
      <ScrollToTopButton />
    </div>
  );
};

/**
 * ScrollToTopButton Component - Floating button to scroll to top
 */
const ScrollToTopButton = () => {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setShow(latest > 400);
    });

    return unsubscribe;
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: show ? 1 : 0,
        scale: show ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      aria-label="Scroll to top"
    >
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ y: show ? 0 : 2 }}
        transition={{ duration: 0.3 }}
        className="group-hover:-translate-y-1 transition-transform"
      >
        <path d="M18 15l-6-6-6 6" />
      </motion.svg>
    </motion.button>
  );
};

export default SmoothScrollWrapper;

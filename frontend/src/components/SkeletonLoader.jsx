import { motion } from 'framer-motion';

/**
 * SkeletonLoader Component - Animated skeleton placeholders for loading states
 * Features:
 * - Multiple skeleton types (text, card, avatar, etc.)
 * - Customizable dimensions and animations
 * - Shimmer effect animation
 * - Responsive design
 */
const SkeletonLoader = ({
  type = 'text',
  width = '100%',
  height = '1rem',
  className = '',
  count = 1,
  animate = true,
  ...props
}) => {
  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded';

  const skeletonVariants = {
    text: `${baseClasses} h-4`,
    title: `${baseClasses} h-6`,
    avatar: `${baseClasses} rounded-full`,
    card: `${baseClasses} h-32`,
    button: `${baseClasses} h-10 rounded-lg`,
    image: `${baseClasses} h-48`,
    paragraph: `${baseClasses} h-16 mb-2`,
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const renderSkeleton = (index) => {
    let skeletonClass = skeletonVariants[type] || skeletonVariants.text;

    // Apply custom dimensions
    const style = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      ...props.style,
    };

    return (
      <div
        key={index}
        className={`relative overflow-hidden ${skeletonClass} ${className}`}
        style={style}
        {...props}
      >
        {animate && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-gray-500/60"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        )}
      </div>
    );
  };

  if (count === 1) {
    return renderSkeleton(0);
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => renderSkeleton(index))}
    </div>
  );
};

/**
 * Predefined skeleton components for common use cases
 */
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <SkeletonLoader
        key={i}
        type="text"
        width={i === lines - 1 ? '60%' : '100%'}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
    <div className="flex items-center space-x-3 mb-3">
      <SkeletonLoader type="avatar" width={40} height={40} />
      <div className="flex-1">
        <SkeletonLoader type="text" width="60%" height={16} className="mb-1" />
        <SkeletonLoader type="text" width="40%" height={12} />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }, (_, i) => (
        <SkeletonLoader key={i} type="text" width="100%" height={16} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }, (_, colIndex) => (
          <SkeletonLoader
            key={colIndex}
            type="text"
            width="100%"
            height={14}
          />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonChat = ({ messages = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: messages }, (_, i) => (
      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
        <div className={`flex items-start space-x-3 max-w-xs ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
          <SkeletonLoader type="avatar" width={32} height={32} />
          <div className="flex-1">
            <SkeletonLoader type="text" width="80%" height={12} className="mb-1" />
            <SkeletonLoader type="text" width="60%" height={12} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;

import { useEffect, useRef } from 'react';
import { Spinner } from './Spinner';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  children: React.ReactNode;
}

export const InfiniteScroll = ({
  onLoadMore,
  isLoading,
  hasMore,
  children,
}: InfiniteScrollProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [onLoadMore, isLoading]);

  return (
    <div className="flex flex-col gap-3">
      {children}
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-4">
          {isLoading && <Spinner />}
        </div>
      )}
    </div>
  );
}; 
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/graphql',
          destination: `${process.env.NEXT_PUBLIC_GRAPHQL_SCHEMA_PATH}`,
        },
      ];
    }

    return [];
  },
  experimental: {
    extensionAlias: {
      '.graphql': ['.graphql.ts'],
    },
  },
};

export default nextConfig;

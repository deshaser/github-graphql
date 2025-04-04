import { useState, useCallback, useEffect } from 'react';
import { useRepositoriesByOwnerQuery } from '@/entities/repositories/gql/queries/repositoriesByOwner.graphql';
import { RepositoryFragment } from '@/entities/repositories/gql/fragments/repository.graphql';

const REPOS_PER_PAGE = 20;

export const useGetRepositories = (login: string) => {
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setHasMore(true);
  }, [login]);

  const { data, loading: isLoading, fetchMore } = useRepositoriesByOwnerQuery({
    variables: {
      login,
      first: REPOS_PER_PAGE,
    },
    notifyOnNetworkStatusChange: true,
    skip: !login,
  });

  const repos = data?.repositoryOwner?.repositories.nodes?.filter(Boolean) as RepositoryFragment[];
  const pageInfo = data?.repositoryOwner?.repositories.pageInfo;

  const loadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || !hasMore) {
      setHasMore(false);
      return;
    }

    await fetchMore({
      variables: {
        login,
        first: REPOS_PER_PAGE,
        after: pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.repositoryOwner || !prev?.repositoryOwner) return prev;
        
        const newPageInfo = fetchMoreResult.repositoryOwner.repositories.pageInfo;
        setHasMore(newPageInfo.hasNextPage);
        
        return {
          repositoryOwner: {
            ...prev.repositoryOwner,
            repositories: {
              ...prev.repositoryOwner.repositories,
              nodes: [
                ...(prev.repositoryOwner.repositories.nodes || []),
                ...(fetchMoreResult.repositoryOwner.repositories.nodes || []),
              ].filter(Boolean),
              pageInfo: newPageInfo,
            },
          },
        };
      },
    });
  }, [fetchMore, hasMore, login, pageInfo?.endCursor, pageInfo?.hasNextPage]);

  return {
    repos,
    isLoading,
    hasMore,
    loadMore,
  };
}; 
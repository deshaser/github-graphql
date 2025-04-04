'use client';
import { RepoCard } from '@/entities/repositories';
import { useRepositoriesByOwnerQuery } from '@/entities/repositories/gql/queries/repositoriesByOwner.graphql';
import { RepositoryFragment } from '@/entities/repositories/gql/fragments/repository.graphql';
import { Input } from '@/shared/components/ui/Input';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useState, useEffect, useRef, useCallback } from 'react';

const REPOS_PER_PAGE = 20;

export const ReposExplorer = () => {
  const [login, setLogin] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (login) {
      setIsInitialLoad(false);
    }
  }, [login]);

  useEffect(() => {
    setHasMore(true);
  }, [login]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
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
  }, [loadMore, isLoading]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-prose">
      <Input
        {...{
          name: 'login',
          label: 'Логин GitHub',
          placeholder: 'Введите логин для поиска репозиториев',
          value: login,
          onChange: e => {
            setLogin(e.target.value);
          },
        }}
      />
      <div className="flex flex-col gap-3">
        {repos?.map(repo => (
          <RepoCard
            key={repo.id}
            repo={repo}
          />
        ))}
        {hasMore && (
          <div ref={loaderRef} className="flex justify-center py-4">
            {isLoading && <Spinner />}
          </div>
        )}
        {!hasMore && repos && repos.length > 0 && (
          <p className="text-center text-gray-500 my-4">
            Больше репозиториев не найдено
          </p>
        )}
      </div>
      {!!login && !isLoading && !repos?.length && (
        <p className="text-center text-gray-500">Репозитории не найдены</p>
      )}
    </div>
  );
};

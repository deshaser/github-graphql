'use client';
import { RepoCard } from '@/entities/repositories';
import { useGetRepositories } from '@/entities/repositories/hooks/useGetRepositories';
import { Input } from '@/shared/components/ui/Input';
import { InfiniteScroll } from '@/shared/components/ui/InfiniteScroll/InfiniteScroll';
import { useState } from 'react';

export const ReposExplorer = () => {
  const [login, setLogin] = useState('');
  const { repos, isLoading, hasMore, loadMore } = useGetRepositories(login);

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
      <InfiniteScroll
        onLoadMore={loadMore}
        isLoading={isLoading}
        hasMore={hasMore}
      >
        {repos?.map(repo => (
          <RepoCard
            key={repo.id}
            repo={repo}
          />
        ))}
        {!hasMore && repos && repos.length > 0 && (
          <p className="text-center text-gray-500 my-4">
            Больше репозиториев не найдено
          </p>
        )}
      </InfiniteScroll>
      {!!login && !isLoading && !repos?.length && (
        <p className="text-center text-gray-500">Репозитории не найдены</p>
      )}
    </div>
  );
};

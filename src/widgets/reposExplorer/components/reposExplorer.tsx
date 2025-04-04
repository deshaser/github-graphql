'use client';

import { useState } from 'react';

import { RepoCard } from '@/entities/repositories';
import { useGetRepositories } from '@/entities/repositories/hooks/useGetRepositories';
import { ErrorMessage, InfiniteScroll, Input } from '@/shared/components/ui';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';

export const ReposExplorer = () => {
  const [login, setLogin] = useState('');
  const debouncedLogin = useDebounce(login, 300);
  const { repos, isLoading, hasMore, loadMore, error } = useGetRepositories(debouncedLogin);

  const errorMessage = error
    ? error.message === 'Could not resolve to a User with the login of'
      ? 'Пользователь не найден'
      : 'Произошла ошибка при загрузке репозиториев. Пожалуйста, попробуйте позже.'
    : '';

  return (
    <div className="flex flex-col gap-8 w-full max-w-prose">
      <Input
        name="login"
        label="Логин GitHub"
        placeholder="Введите логин для поиска репозиториев"
        value={login}
        onChange={e => setLogin(e.target.value)}
      />

      {error && <ErrorMessage message={errorMessage} />}

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

      {!!debouncedLogin && !isLoading && !error && !repos?.length && (
        <p className="text-center text-gray-500">
          Репозитории не найдены
        </p>
      )}
    </div>
  );
};

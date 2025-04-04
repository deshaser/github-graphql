'use client';
import { RepoCard } from '@/entities/repositories';
import { useRepositoriesByOwnerQuery } from '@/entities/repositories/gql/queries/repositoriesByOwner.graphql';
import { Input } from '@/shared/components/ui/Input';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useState } from 'react';

export const ReposExplorer = () => {
  const [login, setLogin] = useState('');

  const { data, loading: isLoading } = useRepositoriesByOwnerQuery({
    variables: {
      login,
    },
    notifyOnNetworkStatusChange: true,
    skip: !login,
  });
  const repos = data?.repositoryOwner?.repositories.nodes;

  return (
    <div className="flex flex-col gap-8 w-full max-w-prose">
      <Input
        {...{
          name: 'login',
          label: 'Логин GitHub',
          placeholder: 'Введите логин для поиска репозиториев',
          value: login,
          onChange: e => setLogin(e.target.value),
        }}
      />
      {!!repos?.length && (
        <div className="flex flex-col gap-3">
          {repos?.map(repo =>
            repo ? (
              <RepoCard
                key={repo.id}
                {...{
                  repo,
                }}
              />
            ) : null
          )}
        </div>
      )}
      {!!login && !isLoading && !repos?.length && <p>Репозитории не найдены</p>}
      {isLoading && <Spinner className="self-center" />}
    </div>
  );
};

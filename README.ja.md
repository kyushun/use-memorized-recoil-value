# `useMemorizedRecoilValue`
Recoil で非同期 selector のデータ取得中に直前の値を参照できるようにする React hooks

[![npm version](https://badge.fury.io/js/use-memorized-recoil-value.svg)](https://badge.fury.io/js/use-memorized-recoil-value)
![CI](https://github.com/kyushun/use-memorized-recoil-value/workflows/CI/badge.svg)

[English](https://github.com/kyushun/use-memorized-recoil-value/blob/master/README.md)

## About
Recoil では selector の get コールバック関数に Promise を返すことができます。
しかし、取得中のデータデータを扱うためにコンポーネントを `<React.Suspense />` でラップする必要があり、また Promise が解決するまでの間は直前の値を参照することもできません。
`useMemorizedRecoilValue` はロード中に直前の値を返し、`<React.Suspense />` でラップする必要がなくなります。

## Installation
```sh
npm i --save use-memorized-recoil-value
# or
yarn add use-memorized-recoil-value
```

## Usage
```tsx
import useMemorizedRecoilValue from 'use-memorized-recoil-value';

const currentUserNameQuery = selector({
  key: 'CurrentUserName',
  get: async ({ get }) => {
    const response = await myDBQuery({
      userID: get(currentUserIDState),
    });
    return response.name;
  },
});

const Sample = () => {
  const { value: userName } = useMemorizedRecoilValue(currentUserNameQuery);

  return <div>{username}</div>;
};
```

## Reference
```ts
type useMemorizedRecoilValue = (
  recoilValue: RecoilValue<T>
) => { value: T | undefined; loadable: Loadable<T> }
```

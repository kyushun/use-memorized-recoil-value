# `useMemorizedRecoilValue`
A react hook for subscribing to the previous value of the asynchronous selector in Recoil while loading. 

[![npm version](https://badge.fury.io/js/use-memorized-recoil-value.svg)](https://badge.fury.io/js/use-memorized-recoil-value)
![CI](https://github.com/kyushun/use-memorized-recoil-value/workflows/CI/badge.svg)

[🇯🇵 日本語](https://github.com/kyushun/use-memorized-recoil-value/blob/master/README.ja.md)

## About
Recoil allows you to return a Promise from a selector `get` callback.
However, we need to wrap components with `<React.Suspense />` to take care of pending data, also it's impossible to read the previous value while waiting for the promise to resolve.
`useMemorizedRecoilValue` returns the previous value while loading data and it's not necessary to wrap with `<React.Suspense>`.

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
  recoilValue: RecoilValue<T>, defaultValue?: T
) => { value: T | undefined; loadable: Loadable<T> }
```

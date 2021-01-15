# `useMemorizedRecoilValue`
A react hook for subscribing to the memorized value of asynchronous recoil selectors.

## About
Recoil allows you to return a Promise from a selector get callback.
However, a pending asynchronous selector needs to be handled with `React Suspense`, also is impossible to keep the previous value while waiting for the promise to resolve.
`useMemorizedRecoilValue` will return the previous value while waiting and can be used like `useRecoilValue`.

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

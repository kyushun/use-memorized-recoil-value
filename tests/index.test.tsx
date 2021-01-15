import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { atom, selector, RecoilRoot, useSetRecoilState } from 'recoil';
import useMemorizedRecoilValue from '../src/index';

const users = {
  0: 'Guest',
  1: 'Alice',
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const userIdState = atom({
  key: 'userIdState',
  default: 0,
});

const userNameSelector = selector({
  key: 'userNameSelector',
  get: async ({ get }) => {
    const id = get(userIdState);

    await sleep(50);

    return users[id];
  },
});

const useUserName = () => {
  const setUserId = useSetRecoilState(userIdState);
  const { value: userName, state } = useMemorizedRecoilValue(userNameSelector);

  return { setUserId, userName, state };
};

const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

test('useMemorizedRecoilValue', async () => {
  const { result } = renderHook(() => useUserName(), {
    wrapper,
  });

  expect(result.current.userName).toBe(undefined);

  while (result.current.state !== 'hasValue') {
    await sleep(10);
  }
  expect(result.current.userName).toBe(users[0]);

  act(() => result.current.setUserId(1));

  expect(result.current.userName).toBe(users[0]);

  while (result.current.state !== 'hasValue') {
    await sleep(10);
  }
  expect(result.current.userName).toBe(users[1]);
});

import {
  act,
  renderHook,
  RenderResult,
  WaitFor,
} from '@testing-library/react-hooks';
import React from 'react';
import { atom, selector, RecoilRoot, useRecoilState } from 'recoil';
import useMemorizedRecoilValue from '../src/index';

const users = {
  0: 'Guest',
  1: 'Alice',
  2: 'Bob',
};

const createUseUserName = () => {
  const userIdState = atom({
    key: 'userIdState' + Math.random(),
    default: 1,
  });

  const userNameSelector = selector<string>({
    key: 'userNameSelector' + Math.random(),
    get: async ({ get }) => {
      const id = get(userIdState);

      await new Promise((resolve) => setTimeout(resolve, 50));

      return users[id];
    },
  });

  const useUserName = (defaultValue?: string) => {
    const [userId, setUserId] = useRecoilState(userIdState);
    const { value: userName, state } = useMemorizedRecoilValue(
      userNameSelector,
      defaultValue
    );

    return { userId, setUserId, userName, state };
  };

  return useUserName;
};

const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

describe('useMemorizedRecoilValue', () => {
  let result: RenderResult<ReturnType<ReturnType<typeof createUseUserName>>>;
  let waitFor: WaitFor;

  describe('with default value', () => {
    beforeEach(() => {
      const useUserName = createUseUserName();
      ({ result, waitFor } = renderHook(() => useUserName(users[0]), {
        wrapper,
      }));
    });

    describe('just after called', () => {
      it('returns default value', () => {
        expect(result.current.userId).toBe(1);
        expect(result.current.userName).toBe(users[0]);
      });
    });

    describe('after promise resolved', () => {
      it('returns resolved value', async () => {
        await waitFor(() => result.current.state === 'hasValue');
        expect(result.current.userId).toBe(1);
        expect(result.current.userName).toBe(users[1]);
      });
    });
  });

  describe('with no default value', () => {
    beforeEach(() => {
      const useUserName = createUseUserName();
      ({ result, waitFor } = renderHook(() => useUserName(), {
        wrapper,
      }));
    });

    describe('just after called', () => {
      it('returns undefined', () => {
        expect(result.current.userId).toBe(1);
        expect(result.current.userName).toBe(undefined);
      });
    });

    describe('after promise resolved', () => {
      it('returns resolved value', async () => {
        await waitFor(() => result.current.state === 'hasValue');
        expect(result.current.userId).toBe(1);
        expect(result.current.userName).toBe(users[1]);
      });
    });
  });

  describe('when relative state is updated', () => {
    beforeEach(async () => {
      const useUserName = createUseUserName();
      ({ result, waitFor } = renderHook(() => useUserName(), {
        wrapper,
      }));
      await waitFor(() => result.current.state === 'hasValue');
    });

    describe('before updated', () => {
      it('returns previous value', () => {
        expect(result.current.userId).toBe(1);
        expect(result.current.userName).toBe(users[1]);
      });
    });

    describe('just after updated', () => {
      it('returns previous value', () => {
        act(() => result.current.setUserId(2));

        expect(result.current.userId).toBe(2);
        expect(result.current.userName).toBe(users[1]);
      });
    });

    describe('after promise resolved', () => {
      it('returns resolved value', async () => {
        act(() => result.current.setUserId(2));

        await waitFor(() => result.current.state === 'hasValue');
        expect(result.current.userId).toBe(2);
        expect(result.current.userName).toBe(users[2]);
      });
    });
  });
});

import { useEffect, useState } from 'react';
import { Loadable, RecoilValue, useRecoilValueLoadable } from 'recoil';

type MemorizedLoadable<T> = Loadable<T> & {
  value: T | undefined;
};

const useMemorizedRecoilValue = <T>(
  recoilValue: RecoilValue<T>
): MemorizedLoadable<T> => {
  const loadable = useRecoilValueLoadable(recoilValue);
  const [value, setValue] = useState<T>();

  useEffect(() => {
    if (loadable.state === 'hasValue') {
      setValue(loadable.contents);
    }
  }, [loadable.state]);

  return {
    ...loadable,
    value,
  } as const;
};

export default useMemorizedRecoilValue;

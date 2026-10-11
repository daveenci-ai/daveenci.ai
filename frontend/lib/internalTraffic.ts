// Marks the team's own browsers so GA4 can drop their visits. Visit any page with ?internal=1 once per browser
// (?internal=0 undoes it). The mark lives in localStorage; analytics then tags every event with
// traffic_type=internal, which the GA4 "Internal Traffic" data filter (Active) excludes from reports.
// IP rules don't work for us: the team travels, so there is no fixed office IP.

const KEY = 'daveenci-internal';

type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem' | 'removeItem'>;

const defaultStorage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

/** Apply ?internal=1 / ?internal=0 from this URL, then say whether this browser is marked internal. */
export const isInternalTraffic = (search: string, storage: Storage | null = defaultStorage()): boolean => {
  const flag = new URLSearchParams(search).get('internal');
  try {
    if (flag === '1') storage?.setItem(KEY, '1');
    else if (flag === '0') storage?.removeItem(KEY);
    return storage?.getItem(KEY) === '1';
  } catch {
    // Storage blocked: fall back to what this URL alone says.
    return flag === '1';
  }
};

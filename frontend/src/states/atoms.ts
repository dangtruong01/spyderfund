
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();
export const metamaskAccountAtom = atom({
    key: 'metamaskAccount', // unique ID (with respect to other atoms/selectors)
    default: null, // default value (aka initial value)
    effects_UNSTABLE: [persistAtom]
});
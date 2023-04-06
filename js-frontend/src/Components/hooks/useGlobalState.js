import { atom, useAtom } from 'jotai';

const stateAtom = atom({
  user: undefined,
});

export default function useGlobalState() {
  const [state, setState] = useAtom(stateAtom);

  const setUser = (usr) => setState({ ...state, user: { ...state.user, ...usr } });

  const loginUser = (user) => setState({ ...state, user });

  const logoutUser = () => setState({ ...state, user: undefined });

  return { ...state, loginUser, logoutUser, setUser };
}

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserInfo = {
  username: string;
  userIcon?: string;
  token: string;
};

export const UserContext = createContext<{
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserInfo | null>(null);

  // クッキーからユーザー情報を取得する関数
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:8080/me", {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUserState(userData);
      }
    };

    fetchUser();
  }, []);

  const setUser = (user: UserInfo | null) => {
    setUserState(user);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

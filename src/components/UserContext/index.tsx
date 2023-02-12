import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import uniqid from "uniqid";
import { initialize, listenForEvents, listenForUsers, removeEvent } from "./db";
import { DBEventType, UserPressObj } from "./types";

interface UserContextProps {
  userCount: number;
  disabled: boolean;
  presses: UserPressObj[];
  onRemove: (id: string) => void;
}

const UserContext = createContext<UserContextProps>({
  userCount: 0,
  disabled: false,
  presses: [],
  onRemove: () => false,
});

const UserContainer: React.FC<{ forceNonInteractive?: boolean }> = ({
  children,
  forceNonInteractive = false,
}) => {
  const [presses, setPresses] = useState<UserPressObj[]>([]);
  const [users, setUsers] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const userCount = useMemo(() => {
    return users.length;
  }, [users]);

  useEffect(() => {
    try {
      if (forceNonInteractive) {
        throw Error("Forced");
      }
      initialize();

      listenForUsers((changedUsers) => {
        setUsers(changedUsers);
      });

      listenForEvents((obj) => {
        if (obj.type === DBEventType.Location) {
          setPresses((curr) => {
            const idx = curr.findIndex(
              (i) => i.id === obj.timestamp.toString(),
            );

            if (idx >= 0) {
              return curr;
            }

            return [
              ...curr,
              {
                ...obj.value,
                key: obj.key,
                id: uniqid(),
              },
            ];
          });
        }
      });
    } catch {
      setDisabled(true);
    }
  }, [forceNonInteractive]);

  const onRemove = useCallback((id: string) => {
    setPresses((curr) => {
      const c = curr.slice();

      const idx = c.findIndex((i) => i.id === id);

      if (idx >= 0) {
        removeEvent(c[idx].key);

        c.splice(idx, 1);
      }

      return c;
    });
  }, []);

  return (
    <UserContext.Provider value={{ userCount, disabled, presses, onRemove }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export { UserContainer, useUser };

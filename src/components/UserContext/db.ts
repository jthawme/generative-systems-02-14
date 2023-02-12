import { initializeApp } from "firebase/app";
import {
  child,
  get,
  getDatabase,
  onChildAdded,
  onChildRemoved,
  onDisconnect,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import uniqid from "uniqid";
import {
  DBEventCallback,
  DBEventObject,
  DBEventType,
  DBUsersCallback,
} from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyA3jm4FpypUGoreqiV1-I_H-AZxaHPE6xM",
  authDomain: "sennep-talk.firebaseapp.com",
  databaseURL:
    "https://sennep-talk-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sennep-talk",
  storageBucket: "sennep-talk.appspot.com",
  messagingSenderId: "143389696507",
  appId: "1:143389696507:web:0a26a471c1c8f27d30ab5e",
};

export const initialize = async () => {
  // Initialize Firebase
  try {
    initializeApp(firebaseConfig);

    const DB = getDatabase();

    const eventsRef = ref(DB, "events");
    const infoRef = ref(DB, "info");

    const uid = uniqid();
    const userRef = ref(DB, `info/usersCount/${uid}`);
    await set(userRef, true);
    onDisconnect(userRef).remove();

    const users = await get(child(infoRef, `usersCount`)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return {};
      }
    });

    return { DB, events: eventsRef, info: infoRef, users: Object.keys(users) };
  } catch (e) {
    throw e;
  }
};

export const listenForUsers = (cb: DBUsersCallback) => {
  onValue(ref(getDatabase(), "info/usersCount"), (snapshot) => {
    const val = snapshot.val();

    cb(Object.keys(val));
  });
};

export const listenForEvents = (cb: DBEventCallback) => {
  const t = new Date().getTime();

  onChildAdded(ref(getDatabase(), "events"), (snapshot) => {
    const val: DBEventObject = snapshot.val();

    if (val.timestamp > t) {
      cb({ ...val, key: snapshot.key });
    }
  });
};

export const addEvent = (type: DBEventType, value: DBEventObject["value"]) => {
  const item = push(ref(getDatabase(), "events"));
  return set(item, {
    timestamp: new Date().getTime(),
    type,
    value,
  });
};

export const removeEvent = (key: string) => {
  const item = child(ref(getDatabase(), "events"), key);
  remove(item);
};

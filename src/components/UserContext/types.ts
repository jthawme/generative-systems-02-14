export type UserPressData = {
  x: number;
  y: number;
  icon?: string;
  color?: string;
};

export type UserPressObj = {
  id: string;
  key: string;
} & UserPressData;

export enum DBEventType {
  Location = "location",
}

export type DBEventLocation = {
  type: DBEventType.Location;
  timestamp: number;
  key: string;
  value: UserPressData;
};

export type DBEventCallback = {
  (obj: DBEventObject): void;
};

export type DBUsersCallback = {
  (users: string[]): void;
};

export type DBEventObject = DBEventLocation;

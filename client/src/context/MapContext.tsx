"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface RoomState {
  roomName: string;
  roomIcon: string;
  roomDetail: string;
  roomPassword: string;
  roomLongitude: number | null;
  roomLatitude: number | null;
}

type AppProviderProps = {
  children: ReactNode;
};

type AppContextType = {
  isFirstViewModal: boolean;
  setIsFirstViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  isRoomDetailModal: boolean;
  setIsRoomDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
  roomInfo: RoomState;
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomState>>;
  pushToRoomTriger: boolean;
  setPushToRoomTriger: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultContextData = {
  isFirstViewModal: true,
  isRoomDetailModal: true,
  pushToRoomTriger: false,
  setIsFirstViewModal: () => {},
  setIsRoomDetailModal: () => {},
  setPushToRoomTriger: () => {},
  roomInfo: {
    roomName: "",
    roomIcon: "",
    roomDetail: "",
    roomPassword: "",
    roomLongitude: 0.0,
    roomLatitude: 0.0,
  },
  setRoomInfo: () => {},
};

const MapContext = createContext<AppContextType>(defaultContextData);

export function MapProvider({ children }: AppProviderProps) {
  const [isFirstViewModal, setIsFirstViewModal] = useState(true);
  const [isRoomDetailModal, setIsRoomDetailModal] = useState(true);
  const [pushToRoomTriger, setPushToRoomTriger] = useState(false);
  const [roomInfo, setRoomInfo] = useState<RoomState>({
    roomName: "",
    roomIcon: "",
    roomDetail: "",
    roomPassword: "",
    roomLongitude: 0.0,
    roomLatitude: 0.0,
  });

  return (
    <MapContext.Provider
      value={{ isFirstViewModal, setIsFirstViewModal, roomInfo, setRoomInfo, isRoomDetailModal, setIsRoomDetailModal, pushToRoomTriger, setPushToRoomTriger }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapTransactionContext() {
  return useContext(MapContext);
}

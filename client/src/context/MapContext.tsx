"use client"
import { createContext, ReactNode, useContext, useState } from "react"

interface RoomState{
    roomName: string,
    roomIcon: File | null,
    roomDetail: string,
    roomPassword: string,
    roomLongitude: number | null,
    roomLatitude: number | null,
}

type AppProviderProps = {
    children: ReactNode
}

type AppContextType = {
    isFirstViewModal: boolean;
    setIsFirstViewModal: React.Dispatch<React.SetStateAction<boolean>>;
    roomInfo: RoomState,
    setRoomInfo: React.Dispatch<React.SetStateAction<RoomState>>;

}

const defaultContextData = {
    isFirstViewModal: true,
    setIsFirstViewModal: () => {},
    roomInfo: {
        roomName: "", 
        roomIcon: null, 
        roomDetail: "",
        roomPassword: "",
        roomLongitude: 0.0, 
        roomLatitude: 0.0, 
      },
    setRoomInfo: () => {},
}

const MapContext = createContext<AppContextType>(defaultContextData);

export function MapProvider({children}: AppProviderProps){

    const [isFirstViewModal, setIsFirstViewModal] = useState(true);
    const [roomInfo, setRoomInfo] = useState<RoomState>({
        roomName: "",
        roomIcon: null,
        roomDetail: "",
        roomPassword: "",
        roomLongitude: 0.0,
        roomLatitude: 0.0,
    });

    return <MapContext.Provider
    value={{isFirstViewModal, setIsFirstViewModal, roomInfo, setRoomInfo}}
    >
        {children}
    </MapContext.Provider>
}

export function useMapTransactionContext(){
    return useContext(MapContext);
}
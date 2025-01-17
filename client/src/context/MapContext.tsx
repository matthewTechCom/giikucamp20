"use client"
import { createContext, ReactNode, useContext, useState } from "react"

type AppProviderProps = {
    children: ReactNode
}

type AppContextType = {
    isFirstViewModal: boolean;
    setIsFirstViewModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContextData = {
    isFirstViewModal: true,
    setIsFirstViewModal: () => {},
}

const MapContext = createContext<AppContextType>(defaultContextData);

export function MapProvider({children}: AppProviderProps){

    const [isFirstViewModal, setIsFirstViewModal] = useState(true);

    return <MapContext.Provider
    value={{isFirstViewModal, setIsFirstViewModal}}
    >
        {children}
    </MapContext.Provider>
}

export function useMapTransactionContext(){
    return useContext(MapContext);
}
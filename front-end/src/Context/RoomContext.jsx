import React, { createContext, useState, useEffect } from 'react'


export const RoomContext = createContext();

const RoomContextProvider = (props) => {
    const [room, setRoom] = useState(() => {
        const localData = localStorage.getItem('room');
        console.log(localData)
        if (localData === undefined || localData === null) {
            return 'nul1'
        } else {
            return JSON.parse(localData) ? JSON.parse(localData) : ''
        }
    })

    useEffect(() => {
        localStorage.setItem('room', JSON.stringify(room))
    }, [room]);
    return (
        <RoomContext.Provider value={{ room, setRoom }}>
            {props.children}
        </RoomContext.Provider>
    );
}

export default RoomContextProvider;
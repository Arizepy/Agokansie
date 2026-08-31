import { createContext, useState, useEffect } from "react";

export const AudioSettingsContext = createContext()

const MUSIC_KEY = 'agokansie-music-volume'
const SFX_KEY = 'agokansie-sfx-volume'

function readStored(key, fallback) {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = Number(raw)
    return Number.isNaN(parsed) ? fallback : parsed
}

export function AudioSettingsProvider({children}) {
    const [musicVolume, setMusicVolume] = useState(() => readStored(MUSIC_KEY, 0.7))
    const [sfxVolume, setSfxVolume] = useState(() => readStored(SFX_KEY, 0.5))

    useEffect(() => {
        localStorage.setItem(MUSIC_KEY, String(musicVolume))
    }, [musicVolume])

    useEffect(() => {
        localStorage.setItem(SFX_KEY, String(sfxVolume))
    }, [sfxVolume])

    return(
        <AudioSettingsContext.Provider value={{musicVolume, setMusicVolume, sfxVolume, setSfxVolume}}>
            {children}
        </AudioSettingsContext.Provider>
    )
}

import { useRef, useEffect, useCallback } from 'react'

export function useVoicePlayer(volume) {
    const audioRef = useRef(null)

    if (!audioRef.current) {
        audioRef.current = new Audio()
    }

    useEffect(() => {
        audioRef.current.volume = volume
    }, [volume])

    const playVoice = useCallback((src) => {
        const audio = audioRef.current
        audio.src = src
        audio.currentTime = 0
        audio.volume = volume
        audio.play().catch((err) => console.error('Voice audio failed:', err))
    }, [volume])

    return playVoice
}

export function useSfxPlayer(src, volume) {
    const audioRef = useRef(null)

    if (!audioRef.current) {
        audioRef.current = new Audio(src)
    }

    useEffect(() => {
        audioRef.current.volume = volume
    }, [volume])

    const play = useCallback(() => {
        const audio = audioRef.current
        audio.currentTime = 0
        audio.volume = volume
        audio.play().catch((err) => console.error('SFX audio failed:', err))
    }, [volume])

    return play
}
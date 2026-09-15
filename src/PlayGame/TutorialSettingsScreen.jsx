import { useContext, useState } from 'react'
import { Settings, Music, AudioLines, RotateCcw, CircleX, Volume2, AudioLinesIcon, Check } from 'lucide-react'
import { AudioSettingsContext } from '../context/audioSettingsContext'

function SoundSettingsWidget({isOpen, setIsOpen}) {
    const { musicVolume, setMusicVolume, sfxVolume, setSfxVolume } = useContext(AudioSettingsContext)

    const toggleOpen = () => setIsOpen(false)

    const resetVolumes = () => {
        setMusicVolume(0.7)
        setSfxVolume(0.5)
    }

    return (
       
                <div className="h-[70%] w-[50%] rounded-3xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2   border-4 border-[#b98b56] bg-[#efe0c2] shadow-2xl overflow-hidden bg-wood1">
                
                        {/* Header */}
                        <div className="relative py-2 text-center border-b border-[#c8aa73] ">
                
                        
                          <button className="absolute right-3 top-3 cursor-pointer hover:scale-110 transition" onClick={toggleOpen}>
                            <CircleX className='size-9 text-gold'/>
                          </button>
                
                          <h1
                            className="text-6xl tracking-widest text-darkgold font-kablammo "
                          >
                            Tutorial
                          </h1> 
                
                          <p className="text-gold uppercase tracking-[4px] mt-1">
                            SETTINGS
                          </p>
                        </div>
                
                        {/* Body */}
                        <div className="p-8 space-y-10">
                
                          {/* ---------------- SOUND ---------------- */}
                
                          <section>
                
                            <div className="flex items-center gap-3 mb-5">
                
                              <div className="w-14 h-14 rounded-full bg-[#5f4326] text-white flex items-center justify-center">
                                <Volume2 size={28} />
                              </div>
                
                              <h2 className="text-2xl font-bold">
                                SOUND
                              </h2>
                
                            </div>
                
                            <div className="space-y-5 ml-20">
                
                              <div className="flex items-center gap-4">
                
                                <Music />
                
                                <label className="w-24">
                                  Music
                                </label>
                
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={Math.round(musicVolume * 100)}
                                  onChange={(e) => setMusicVolume(Number(e.target.value) / 100)}
                                  className="flex-1 accent-sky-500"
                                />
                
                                <span>{Math.round(musicVolume * 100)}%</span>
                
                              </div>
                
                              <div className="flex items-center gap-4">
                
                                <AudioLines />
                
                                <label className="w-24">
                                  SFX
                                </label>
                
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={Math.round(sfxVolume * 100)}
                                  onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
                                  className="flex-1 accent-sky-500"
                                />
                
                                <span>{Math.round(sfxVolume * 100)}%</span>
                
                              </div>
                
                            </div>
                
                          </section>
                
                         
                
                
                        </div>
                
                        {/* Footer */}
                
                        <div className="flex mt-20 justify-between p-8 border-t border-[#c8aa73]">
                
                          <button className="flex items-center gap-2 border px-6 py-3 rounded-xl hover:bg-[#e8d6b4] transition" onClick={resetVolumes}>
                
                            <RotateCcw size={18} />
                
                            Reset
                
                          </button>
                
                          <button className="flex items-center gap-2 bg-[#5A3A22] text-white px-8 py-3 rounded-xl hover:bg-[#382416] transition" onClick={toggleOpen}>
                
                            <Check size={18} />
                
                            Save & Close
                
                          </button>
                
                        </div>
                
                      </div>
    )
}

export default SoundSettingsWidget
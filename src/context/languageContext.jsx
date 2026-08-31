import { createContext, useContext, useState, useEffect, useDebugValue } from "react"; 

const LanguageContext = createContext()

export  function LanguageProvider({children}) {
    const [language, setLanguage] = useState(() => localStorage.getItem('agokansie-lang') || 'english')

    useEffect (() => {
        localStorage.setItem('agokansie-lang', language)
    }, [language])


    return( 
        <LanguageContext.Provider value= {{language, setLanguage}}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage () { 
    return useContext(LanguageContext)
}


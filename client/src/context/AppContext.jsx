import { createContext, useState } from "react";
import {useAuth, useClerk, useUser} from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom';
export const AppContext = createContext()

const AppContextProvider = (props) =>{

    const [credit, setCredit] = useState(false);
    const [image,setImage] = useState(false);
    const [resultImage, setResultImage] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const {getToken} = useAuth()
    const {isSignedIn} = useUser()
    const {openSignIn} = useClerk()
    const navigate = useNavigate()

    const loadCreditsData = async()=>{
        try {
            
            const token = await getToken()
            const {data} = await axios.get(backendUrl + '/api/user/credits',{headers:{token}})
            if(data.success){
                setCredit(data.credits)
                console.log(data.credits)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const removeBg = async(image) =>{
        try {
            if(!isSignedIn){
                return openSignIn()
            }

            setImage(image)
            setResultImage(false)

            navigate('/result')
            console.log(image);

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const value = {
        credit,setCredit,
        loadCreditsData,
        backendUrl,
        image,setImage,
        removeBg
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
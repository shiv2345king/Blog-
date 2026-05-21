import React,{useEffect,useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({children , authentication = true}){

  const navigate = useNavigate()
  const [loader, setLoader] = useState(true)
  const userStatus = useSelector(state => state.user.status)

  useEffect(() => {
    if(authentication && userStatus !== authentication) 
    {
        navigate("/login")
    }
    else if(!authentication && userStatus !== authentication)
    {
        navigate("/");
    }
    setLoader(false);
  },[userStatus,navigate,authentication])
  return  loader ? <div>Loading...</div> : <> {children} </>
  
}


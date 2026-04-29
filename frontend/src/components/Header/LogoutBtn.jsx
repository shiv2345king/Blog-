import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../../store/userSlice';
import { userService } from '../../api/services/userService';

function LogoutBtn() {
    const dispatch = useDispatch();
    const logoutHandler = () => {
        userService.logout().then(() => {
            dispatch(logout(
                {
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                }
            ));
        });
    };
   return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn

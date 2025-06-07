import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setToken } from '@/feature/authSlice';

const Home = () => {

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);

  useEffect(() => {
    if(!token){
      const authToken = localStorage.getItem("auth-token");

      if(authToken) dispatch(setToken({authToken}));
    }
  })

  return (
    <div>Home</div>
  )
}

export default Home
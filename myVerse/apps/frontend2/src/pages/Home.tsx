import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token === null) {
      navigate("/auth");
    }
  })

  return (
    <div>Home</div>
  )
}

export default Home
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
function App() {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('button')
    }
  }, [])
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default App

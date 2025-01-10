import { Navigate, Outlet } from "react-router"
import useUserStore from "../stores/useUserStore"

const LayoutPrivate = () => {
    const user = useUserStore((state) => state.user);

    if (!user.email) {
        return <Navigate to="/login" replace />
    }

    return (
        <div>
          <Outlet />        
        </div>
  )
}

export default LayoutPrivate

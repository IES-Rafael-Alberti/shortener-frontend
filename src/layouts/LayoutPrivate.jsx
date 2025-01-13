import { Navigate, Outlet } from "react-router"
import useUserStore from "../stores/useUserStore"
import Header from '../components/Header'
import Footer from '../components/Footer'

const LayoutPrivate = () => {
    const user = useUserStore((state) => state.user);

    if (!user.email) {
        return <Navigate to="/login" replace />
    }

    return (
      <>
          <Header />
          <Outlet />
          <Footer />
      </>
    )
}

export default LayoutPrivate

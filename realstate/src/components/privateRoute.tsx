import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks'
export default function PrivateRoute() {
    const { currentUser } = useAppSelector((state) => state.user);
    return (
        <div>
            {currentUser ? <Outlet /> : <Navigate to='signin' />}
        </div>
    )
}

import { useRoutes, Navigate } from 'react-router-dom';

// routes
import { MainRoutes, CompactRoutes } from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([{ path: '*', element: <Navigate to="/404" /> }, MainRoutes, CompactRoutes]);
}

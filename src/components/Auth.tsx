import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'hooks/useRedux';

const Auth = ({ children }: any) => {
    const navigate = useNavigate();
    const { connect } = useAppSelector((state) => state.info);

    useEffect(() => {
        if (!connect) navigate('/');
    }, [connect, navigate]);

    return children;
};

export default Auth;

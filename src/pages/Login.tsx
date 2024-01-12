import { Link } from 'react-router-dom';

import Card from 'components/Card';
import { ReactComponent as UserIcon } from 'assets/img/icon/user.svg';
import { ReactComponent as LockIcon } from 'assets/img/icon/lock.svg';

const Login = () => {
    return (
        <Card>
            <h1 className="text-4xl font-bold font-Unbounded">Welcome back!</h1>
            <div className="w-full  my-[65px]">
                <div className="relative rounded-lg border-[0.6px] border-[#ACACAE] py-4 px-5 mb-8">
                    <UserIcon className="absolute" />
                    <input className="w-full bg-transparent pl-10 text-lg" placeholder="Email" />
                </div>
                <div className="relative rounded-lg border-[0.6px] border-[#ACACAE] py-4 px-5">
                    <LockIcon className="absolute" />
                    <input className="w-full bg-transparent pl-10 text-lg" placeholder="Password" />
                </div>
            </div>
            <Link to="/dashboard" className="w-full">
                <button className="w-full text-center py-4 bg-[#5a4ee8] rounded-lg cursor-pointer">Login</button>
            </Link>
        </Card>
    );
};

export default Login;

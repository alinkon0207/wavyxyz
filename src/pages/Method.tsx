import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// component
import Card from 'components/Card';
import { useAppDispatch, useAppSelector } from 'hooks/useRedux';
import { changeMethod } from 'redux/info';

const Method = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { pathname } = useLocation();
    const { methods }: any = useAppSelector((state) => state.info);
    const [showChild, setShowChild] = useState(false);
    const [childrens, setChildrens] = useState([]);

    const selectMethod = (method: { title: string; icon: string; sub: string; child?: any }) => {
        if (method.child) {
            setChildrens(method.child);
            setShowChild(true);
        } else {
            dispatch(changeMethod({ title: method.title, icon: method.icon }));
            navigate(-1);
        }
    };

    useEffect(() => {
        setShowChild(false);
    }, []);

    return (
        <Card title={pathname === '/top-up/method' ? 'Top Up Method' : 'Withdrawal Method'} back={() => navigate(-1)}>
            <div className="flex flex-col w-full">
                <p className="text-center mb-5 text-sm">
                    {pathname === '/top-up/method'
                        ? 'Select how you want to Top Up '
                        : 'Select the destination to withdraw your stablecoin'}
                </p>
                {showChild
                    ? childrens.map((one: any, i: number) => (
                          <div
                              key={i}
                              onClick={() => selectMethod(one)}
                              className="py-3 px-6 rounded-lg bg-dark-primary w-full flex justify-between items-center cursor-pointer my-2"
                          >
                              <div className="flex items-center">
                                  <img src={one.icon} alt="icon" className="h-[30px] w-[30px]" />
                                  <div className="ml-4">
                                      <p className="text-md font-medium">{one.title}</p>
                                      <p className="text-xs text-light-dark">{one.sub}</p>
                                  </div>
                              </div>
                          </div>
                      ))
                    : methods.list.map((one: any, i: number) => (
                          <div
                              key={i}
                              onClick={() => selectMethod(one)}
                              className="py-3 px-6 rounded-lg bg-dark-primary w-full flex justify-between items-center cursor-pointer my-2"
                          >
                              <div className="flex items-center">
                                  <img src={one.icon} alt="icon" className="h-[30px] w-[30px]" />
                                  <div className="ml-4">
                                      <p className="text-md font-medium">{one.title}</p>
                                      <p className="text-xs text-light-dark">{one.sub}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
            </div>
        </Card>
    );
};
export default Method;

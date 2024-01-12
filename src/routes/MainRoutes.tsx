import { lazy } from 'react';

// Bounding Import
import Layout from 'layouts';
import CompactLayout from 'layouts/Compact';
import Loadable from 'components/Loadable';
import Auth from 'components/Auth';

const Home = Loadable(lazy(() => import('pages/Home')));
const Login = Loadable(lazy(() => import('pages/Login')));
const Dashboard = Loadable(lazy(() => import('pages/Dashboard')));
const Stables = Loadable(lazy(() => import('pages/Stables')));
const Page404 = Loadable(lazy(() => import('pages/Page404')));
const Method = Loadable(lazy(() => import('pages/Method')));
const SelectToken = Loadable(lazy(() => import('pages/SelectToken')));
const SelectNet = Loadable(lazy(() => import('pages/SelectNet')));

const Send = Loadable(lazy(() => import('pages/Send')));
const SendCheck = Loadable(lazy(() => import('pages/Send/Send')));

const NewOffer = Loadable(lazy(() => import('pages/Send/NewOffer')));
const EditOffer = Loadable(lazy(() => import('pages/Send/EditOffer')));
const DeleteOffer = Loadable(lazy(() => import('pages/Send/DeleteOffer')));
const DeleteSuccess = Loadable(lazy(() => import('pages/Send/DeleteSuccess')));
const SendLoading = Loadable(lazy(() => import('pages/Send/Loading')));
const SendSuccess = Loadable(lazy(() => import('pages/Send/Success')));
const ConfirmOffer = Loadable(lazy(() => import('pages/Send/ConfirmOffer')));
const DeleteLoading = Loadable(lazy(() => import('pages/Send/DeleteLoading')));
const Offers = Loadable(lazy(() => import('pages/Send/Offers')));

const Swap = Loadable(lazy(() => import('pages/Swap')));
const PreviewSwap = Loadable(lazy(() => import('pages/Swap/PreviewSwap')));
const SwapLoading = Loadable(lazy(() => import('pages/Swap/Loading')));
const Success = Loadable(lazy(() => import('pages/Swap/Success')));

const TopUp = Loadable(lazy(() => import('pages/TopUp')));
const Withdraw = Loadable(lazy(() => import('pages/Withdraw')));

const Bridge = Loadable(lazy(() => import('pages/Bridge')));

export const MainRoutes = {
    path: '/',
    element: <Layout />,
    children: [
        {
            path: '',
            element: <Home />
        },
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/dashboard',
            element: <Dashboard />
        },
        {
            path: '/stables',
            element: <Stables />
        },
        {
            path: 'top-up',
            element: (
                <Auth>
                    <TopUp />
                </Auth>
            )
        },
        {
            path: 'top-up/method',
            element: (
                <Auth>
                    <Method />
                </Auth>
            )
        },
        {
            path: 'withdraw',
            element: (
                <Auth>
                    <Withdraw />
                </Auth>
            )
        },
        {
            path: 'withdraw/method',
            element: <Method />
        },
        {
            path: 'select',
            element: (
                <Auth>
                    <SelectToken />
                </Auth>
            )
        },
        {
            path: 'select-net',
            element: (
                <Auth>
                    <SelectNet />
                </Auth>
            )
        },
        {
            path: 'swap',
            element: (
                <Auth>
                    <Swap />
                </Auth>
            )
        },
        {
            path: 'swap/preview',
            element: (
                <Auth>
                    <PreviewSwap />
                </Auth>
            )
        },
        {
            path: 'swap/process',
            element: (
                <Auth>
                    <SwapLoading />
                </Auth>
            )
        },
        {
            path: 'swap/success',
            element: (
                <Auth>
                    <Success />
                </Auth>
            )
        },
        {
            path: 'send',
            element: (
                <Auth>
                    <Send />
                </Auth>
            )
        },
        {
            path: 'send/check/:index',
            element: (
                <Auth>
                    <SendCheck />
                </Auth>
            )
        },
        {
            path: 'send/process',
            element: (
                <Auth>
                    <SendLoading />
                </Auth>
            )
        },
        {
            path: 'send/success',
            element: (
                <Auth>
                    <SendSuccess />
                </Auth>
            )
        },
        {
            path: 'send/create-offer',
            element: (
                <Auth>
                    <NewOffer />
                </Auth>
            )
        },
        {
            path: 'send/edit-offer/:idx',
            element: (
                <Auth>
                    <EditOffer />
                </Auth>
            )
        },
        {
            path: 'send/delete-offer/:idx',
            element: (
                <Auth>
                    <DeleteOffer />
                </Auth>
            )
        },
        {
            path: 'send/delete-process',
            element: (
                <Auth>
                    <DeleteLoading />
                </Auth>
            )
        },
        {
            path: 'send/delete-success',
            element: (
                <Auth>
                    <DeleteSuccess />
                </Auth>
            )
        },
        {
            path: 'send/create-offer/confirm',
            element: (
                <Auth>
                    <ConfirmOffer />
                </Auth>
            )
        },
        {
            path: 'send/offers',
            element: (
                <Auth>
                    <Offers />
                </Auth>
            )
        },
        {
            path: 'bridge',
            element: (
                <Auth>
                    <Bridge />
                </Auth>
            )
        }
    ]
};

export const CompactRoutes = {
    path: '/404',
    element: <CompactLayout />,
    children: [
        {
            path: '',
            element: <Page404 />
        }
    ]
};

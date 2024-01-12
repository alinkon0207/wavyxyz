import { Suspense, LazyExoticComponent, ComponentType } from 'react';

// project imports
import Loader from './Loader';

const Loadable =
    (Component: LazyExoticComponent<() => JSX.Element> | ComponentType<React.ReactNode> | any) => (props: any) =>
        (
            <Suspense fallback={<Loader />}>
                <Component {...props} />
            </Suspense>
        );

export default Loadable;

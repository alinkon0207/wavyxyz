const Page404 = () => {
    return (
        <div className={`flex flex-col items-center justify-center w-full h-screen bg-page-404`}>
            <h2 className="text-center text-6xl font-extrabold font-sansmedium">404 - Page not found</h2>
            <p className="text-center text-xl font-normal text-[#ACACAE] my-10">
                This page is missing or you entered the link incorrectly
            </p>
            <p className="text-center text-md">
                Incase of any disputes, contact our support <br /> team at{' '}
                <a href="mailto:support@usewavy.xyz" className="text-[#B8ACFF]">
                    support@usewavy.xyz
                </a>
            </p>
        </div>
    );
};

export default Page404;

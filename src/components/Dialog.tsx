const Dialog = ({ children, open, onClose }) => {
    const removeEvent = (e: any) => {
        e.preventDefault();
    };

    return (
        <>
            {open && (
                <>
                    <div className="fixed w-screen h-screen z-20 top-0 left-0 right-0 bottom-0">
                        <div className="h-full flex items-center justify-center">
                            <div className="min-w-[444px] min-h-[400px] m-[32px] rounded-lg" onClick={removeEvent}>
                                <div className="py-[5] px-[6] bg-[#151518] py-5 px-4 rounded-lg">{children}</div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="fixed w-screen h-screen z-10 top-0 left-0 right-0 bottom-0 bg-[#00000066]"
                        onClick={onClose}
                    />
                </>
            )}
        </>
    );
};

export default Dialog;

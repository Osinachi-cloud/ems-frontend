export default function ActivationPage() {
    return (
        <>
            <div className="flex flex-col justify-center h-[100vh] bg-[#f9f9f9]">
                <div>
                    <img src="" alt="icon" />
                </div>
                <h1 className="text-center font-extrabold leading-8 text-[22px] mb-4">Account Pending Activation</h1>
                <p className="text-center w-[50%] mx-auto text-grey">Your account is awaiting approval from an administrator. You'll be able to access the dashboard once your account is activated.</p>
                <div className="flex justify-center mt-[25px]">
                    <button className="rounded-[8px] py-[6px] px-[8px] border border-grey-100 ">Sign Out</button>
                </div>
            </div>
        </>
    )
}
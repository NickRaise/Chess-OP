import Button from "./Button";
import InputText from "./InputText";
import SigninOptions from "./SigninOptions";

const AuthOptions = () => {
    const enterAsUser = () => {
        //logic to play as a user
        return;
    };

    return (
        <div className="bg-slate-800 rounded-md flex flex-col md:flex-row">
            <div className="flex flex-col justify-center items-center p-5 md:p-10 gap-4">
                <SigninOptions type="Google" />
                <SigninOptions type="Github" />
            </div>
            <div className="flex flex-col items-center justify-center gap-3 p-5 md:p-10">
                <OR />
                <InputText />
                <div className="w-44">
                    <Button onClick={enterAsUser}>Enter as guest</Button>
                </div>
            </div>
        </div>
    );
};

const OR = () => {
    return (
        <div className="flex items-center gap-3">
            <div className="h-1 w-10 bg-slate-600 rounded-md"></div>
            <span className="font-bold text-slate-400">OR</span>
            <div className="h-1 w-10 bg-slate-600 rounded-md"></div>
        </div>
    );
};

export default AuthOptions;

import React from "react";
import Login from "../components/login";

const LoginPage: React.FC<undefined> = () => {
    return (
        <div>
            <Login 
                onSuccess={()=> {}}
                onError={()=> {}}
            />
        </div>
    );
};

export default LoginPage;

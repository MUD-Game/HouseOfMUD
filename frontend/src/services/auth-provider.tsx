import Cookies from "universal-cookie";
const cookies = new Cookies();
// TODO: Implement real Authenticator
const getLoginCookie = () => {
    const cookie = {
        user: cookies.get("user"),
        token: cookies.get("token"),
    }
    return cookie;
};

const setLoginCookie = (username: string, token: string) => {
    cookies.set("token", token, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    cookies.set("user", username, { path: "/", maxAge: 60 * 60 * 24 * 7 });
}

const clearLoginCookie = () => {
    cookies.remove("token", { path: "/" });
    cookies.remove("user", { path: "/" });
}


const authProvider = {
    login(username: string, password: string, success: (token:string)=>void, error: (error:string)=>void) {
        
    },
    logout(callback: VoidFunction) {
        clearLoginCookie();
        setTimeout(callback, 100);
    },
    register(username: string, password: string, success: VoidFunction, error: VoidFunction) {
        setTimeout(success, 100);
    }
};

export { authProvider };

import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
type LoginProps = {}

interface LocationState {
    from: { pathname: string }
}
const Login: React.FC<LoginProps> = (props) => {
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();
    let from = (location.state as LocationState)?.from?.pathname || "/";

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let username = formData.get("username") as string;
        let password = formData.get("password") as string;
        auth.login(username, password, () => {
            navigate(from, { replace: true });
        }, ()=>{
            alert("Login failed");
        });
    }

    return (
        <div>

            <form onSubmit={handleSubmit}>
                <label>
                    Username: <input name="username" type="text" />
                </label>{" "}
                <label>
                    Password: <input name="password" type="password" />
                </label>{" "}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;    
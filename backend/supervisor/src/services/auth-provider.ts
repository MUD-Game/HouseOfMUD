import { mockauth } from "../mock/api";

const authProvider = {
    validateToken: async (user:string, authToken: string) => {
        // Fake wait
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockauth.authToken === authToken && mockauth.user === user;
    },
    validatePassword: async (user:string, password: string) => {
        // Fake wait
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockauth.user === user && mockauth.password === password;
    }

}

export default authProvider;
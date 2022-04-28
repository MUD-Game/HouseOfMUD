export interface User {
    id: string;
    email: string;
    username: string;
    password: string;
  }
  
export class UserImpl implements User {
    id: string;
    email: string;
    username: string;
    password: string;

    constructor(id: string, email: string, username: string, password: string) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
    }
}
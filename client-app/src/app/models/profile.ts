import { User } from "./user";

export interface Profile{
    displayName: string,
    username: string,
    bio?: string,
    image?: string,
    //photos: IPhoto[]
}
export class Profile implements Profile{
    constructor (user: User){
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}
export interface Photo{
    id: string,
    url: string,
    isMain: boolean
}
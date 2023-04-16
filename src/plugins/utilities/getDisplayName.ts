import { User } from "payload/dist/auth/types";

export default function getDisplayName(user:User, displayField:string): string {
    if (displayField && user[displayField]) {
        return user[displayField] as string;
    } else {
        const email = user.email;
        return email.split('@')[0];
    }
}
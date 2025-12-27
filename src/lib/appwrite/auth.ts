import {Client,Account,ID,Avatars, Query,Databases} from 'appwrite'
import { config } from './config.ts';
import type { INewUser, SigninUser } from '../types/types.ts';
import databasesservice from './databases.ts';

export class AuthService {
    client = new Client()
    account
    avatars
    databases

    constructor(){
        this.client
        .setEndpoint(config.projectUrl)
        .setProject(config.projectId)

        this.account = new Account(this.client)
        this.avatars = new Avatars(this.client)
        this.databases = new Databases(this.client)
    }

     async createUserAccount(user:INewUser){
        try {
            const newAccount = await this.account.create(
                ID.unique(),
                user.email,
                user.password,
                user.name,
            )
            console.log("New Account:", newAccount);
console.log("Account ID:", newAccount.$id);
console.log("Saving user to DB with:", {
  accountId: newAccount.$id,
  name: newAccount.name,
  email: newAccount.email,
  username: user.username,
});

            if(!newAccount) throw new Error('account creation failed')
            const avatarUrl = this.avatars.getInitials(user.name)

            const newUserProfile = await databasesservice.saveUsertoDB({
                accountId: newAccount.$id,
                name: newAccount.name,
                email: newAccount.email,
                username:user.username,
                imageUrl: avatarUrl.toString()
            })
            return newUserProfile
            
        } catch (error) {
            console.log('new userprofile failed')
            return error
            
        }


    };
    async SignInAccount(user:SigninUser) {
        try {
         
            const session = await this.account.createEmailPasswordSession(user.email,user.password)
            console.log("hello",session)
           

            return session
            
            
        } catch (error) {
            console.log('Sigin account creation failed',error)
            return null
            
        }
        
    }
  async getCurrentUser() {
    try {
        const currentAccount = await this.account.get()
        if (!currentAccount) throw new Error('No current account found');

        const currentUser = await this.databases.listDocuments(
            config.databasesId,
            config.userscollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser || currentUser.total === 0) return null;

        return currentUser.documents[0];
    } catch (error) {
        console.log("getCurrentUser error:", error);
        return null;
    }
}


    async SignoutAccount(){
        try {
      await this.account.deleteSessions()
            
        } catch (error) {
            console.log("logout failed",error);
                  throw error;

            
        }

    }



 
}

const authservice = new AuthService()
export  default authservice


 
 
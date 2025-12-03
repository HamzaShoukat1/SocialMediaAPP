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
           try {
      await this.account.deleteSession('current');
    } catch {
      // ignore if no session exists
    }
            const session = await this.account.createEmailPasswordSession(user.email,user.password)
            return session
            
        } catch (error) {
            console.log('Sigin account creation failed',error)
            return null
            
        }
        
    }
    async getCurreentUser(){
        try {
            const currentAccount = await this.account.get()
            if(!currentAccount) throw new Error('no current a found')

            // compares cuurentuserid with accountId so it return whole profile accroing to user 
            const currentUser = await this.databases.listDocuments(
                config.databasesId,
                config.userscollectionId,
                [Query.equal('accountId',currentAccount.$id),
                 Query.select(['*', 'save.*']),
                ]
                
                
            )
            if (!currentUser) throw new Error("No user found in database");
            
            if(currentUser.total === 0) return null
            
            
            return currentUser.documents[0]
         

            
        } catch (error) {
            console.log(error);
            return null
            
            
        }
    }

    async SignoutAccount(){
        try {
            const session = await this.account.deleteSession('current')
            return session
            
        } catch (error) {
            console.log(error);
            
        }

    }



 
}

const authservice = new AuthService()
export  default authservice


 
 

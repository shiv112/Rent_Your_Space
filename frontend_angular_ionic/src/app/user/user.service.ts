import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { headerDict } from '../shared/utility';
import { BehaviorSubject, Observable, catchError, firstValueFrom } from 'rxjs';
import { User } from '../shared/interface/user';
import { StorageService } from '../shared/services/storage/storage.service';
import { GoogleAuthResponse } from '../shared/interface/google';

const url = environment.api.server;
const requestOptions = {
  headers: new HttpHeaders(headerDict()),
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public apiUrl = "https://backend-python-mongodb.onrender.com/";
  public user$: Observable<User>;
  private readonly userSub = new BehaviorSubject<User>(null);
  result: any;
  response:any;

  constructor(private http: HttpClient, private storage: StorageService) {

    this.user$ = this.userSub.asObservable();
    // Access Stored User
    this.storage.init().then(() => {
      this.storage.getUser().then((user) => {
        if (user) {
          this.updateUser(user);
        }
      });
    });
  }

  public get user(): User {
    return this.userSub.getValue();
  }

  public token(): string {
    return this.userSub.getValue().accessToken;
  }

  public async signOut() {
    this.userSub.next(null);
    this.storage.removeUser();
  }

  async sendOtp(obj: any):Promise<any> {
    let mobile_number = obj.mobile_number
    this.response = await firstValueFrom(
      this.http.post<any>(
        this.apiUrl + 'login_user',
        {
          mobile_number
        },
        requestOptions
      )
    );
    // console.log("64--",this.response);
    return this.response;
  
   


  }

  public async signIn(email: string, password: string) {
    try {
      const result = await firstValueFrom(
        this.http.post<User>(
          url + 'auth/signin',
          {
            email,
            password,
          },
          requestOptions
        )
      );
      await this.updateUser(result);
      return result;
    } catch (error) {
      console.log('err', error);
      return error;
    }
  }

  public register2():Promise<any>{
    try {
      // firstValueFrom() return promise
      const ress : Promise<any> = firstValueFrom(
        this.http.get("https://jsonplaceholder.typicode.com/todos")
      );
      console.log("128---",ress);
      return ress;
      
    } catch (error) {
      console.log('error', error);
      return error;
    }
   
  }

  public register(name: string, email: string, password: string, number: number):Promise<any> {
    this.result = firstValueFrom(
      this.http.post<User>(
        this.apiUrl + 'create_user',
        {
          name,
          email,
          password,
          number
        },
        requestOptions
      )
    );
    //console.log("136----", this.result);
    this.updateUser(this.result);

    return this.result;

  }

  // public async register(fullName: string, email: string, password: string) {
  //   try {
  //     const result = await firstValueFrom(
  //       this.http.post<User>(
  //         url + 'auth/register',
  //         {
  //           fullName,
  //           email,
  //           password,
  //         },
  //         requestOptions
  //       )
  //     );
  //     await this.updateUser(result);
  //     return result;
  //   } catch (error) {
  //     console.log('error', error);
  //     return error;
  //   }
  // }

  public async googleAuth(payload: GoogleAuthResponse) {
    try {
      const result = await firstValueFrom(
        this.http.post<User>(url + 'auth/google', payload)
      );
      await this.updateUser(result);
      return result;
    } catch (error) {
      console.log('google-auth error:', error);
    }
  }
  private updateUser(user: User) {
    console.log("124----", user);
    this.userSub.next(user);
    this.storage.setUser(user);
  }

  // private async updateUser(user: User) {
  //   this.userSub.next(user);
  //   await this.storage.setUser(user);
  // }


}

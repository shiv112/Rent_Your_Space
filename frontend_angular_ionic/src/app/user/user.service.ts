import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
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
  providedIn: 'root',
})
export class UserService {
  public apiUrl = 'https://backend-python-mongodb.onrender.com/';
  public user$: Observable<User>;
  private readonly userSub = new BehaviorSubject<User>(null);
  result: any;
  response: any;

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

  async sendOtp(obj: any): Promise<any> {
    let mobile_number = '+91' + obj.mobile_number;
    this.response = await firstValueFrom(
      this.http.post<any>(
        this.apiUrl + 'login_user',
        {
          mobile_number,
        },
        requestOptions
      )
    );
    return this.response;
  }

  async enterOtp(obj: any) {
    try {
      let otp_code = obj.otp;
      const response = await firstValueFrom(
        this.http.post<any>(this.apiUrl + 'check_otp', { 
          otp_code
        })
      );
      return response;
    } catch (error) {
      throw error; 
      // if(error instanceof HttpErrorResponse){

      //   console.log("HTTP Error",error.status,error.message);

      // }else{
      //   console.log('An unexpected error occurred:', error);
      // }       
    }
  }

  //   async enterOtp(obj:any):Promise<any>{
  //   let otp_code = obj.otp
  //   this.response = await firstValueFrom(
  //     this.http.post<any>(
  //       this.apiUrl + 'check_otp',
  //       {
  //         otp_code
  //       },
  //       requestOptions
  //     )
  //   );
  //   return this.response;

  // }

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

  public register(
    full_name: string,
    email: string,
    password: string,
    mobile_number: number
  ): Promise<any> {
    this.result = firstValueFrom(
      this.http.post<User>(
        this.apiUrl + 'create_user',
        {
          full_name,
          email,
          password,
          mobile_number,
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

  // public async googleAuth(payload: GoogleAuthResponse) {
  //   try {
  //     const result = await firstValueFrom(
  //       this.http.post<User>(url + 'auth/google', payload)
  //     );
  //     await this.updateUser(result);
  //     return result;
  //   } catch (error) {
  //     console.log('google-auth error:', error);
  //   }
  // }
  private updateUser(user: User) {
    //console.log("124----", user);
    this.userSub.next(user);
    this.storage.setUser(user);
  }

  // private async updateUser(user: User) {
  //   this.userSub.next(user);
  //   await this.storage.setUser(user);
  // }
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { headerDict } from '../shared/utility';
import { BehaviorSubject, Observable, catchError, firstValueFrom } from 'rxjs';
import { User } from '../shared/interface/user';
import { StorageService } from '../shared/services/storage/storage.service';

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
  // call when user entered mobile number
  async sendOtp(obj: any) {
    try {
      let mobile_number = '+91' + obj.mobile_number;
      const response = await firstValueFrom(
        this.http.post<any>(this.apiUrl + 'login_user', {
          mobile_number,
        })
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  // call when user entered OTP
  async enterOtp(obj: any) {
    try {
      let otp_code = obj.otp;
      const response = await firstValueFrom(
        this.http.post<any>(this.apiUrl + 'check_otp', {
          otp_code,
        })
      );
      return response;
    } catch (error) {
      throw error;
    }
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

  public async register(
    full_name: string,
    email: string,
    password: string,
    mobile_number: number
  ){
    try {
      const response = await firstValueFrom(
        this.http.post<User>(this.apiUrl + 'create_user', {
          full_name,
          email,
          password,
          mobile_number
        })
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  private updateUser(user: User) {
    this.userSub.next(user);
    this.storage.setUser(user);
  }
}

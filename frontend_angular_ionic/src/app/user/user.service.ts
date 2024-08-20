import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { headerDict } from '../shared/utility';
import { BehaviorSubject, Observable, catchError, firstValueFrom } from 'rxjs';
import { User } from '../shared/interface/user';
import { StorageService } from '../shared/services/storage/storage.service';
import { ActivatedRoute } from '@angular/router';

const url = environment.api.server;
const requestOptions = {
  headers: new HttpHeaders(headerDict()),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public apiUrl = 'https://backend-python-mongodb.vercel.app/';
  public user$: Observable<any>;
  public  userSub = new BehaviorSubject<any>("");
  public  userSessionSub = new BehaviorSubject<{isSession:any,userName:any}>({isSession:false,userName:null});
  isUserInSession:any;
  result: any;
  response: any;
  userSession:any;
  userName:string;
  userId:any;

  constructor(private http: HttpClient, private storage: StorageService, public route: ActivatedRoute) {
    
  }
  

  public get user(): User {
    return this.userSub.getValue();
  }

  public token(): string {
    return this.userSub.getValue().accessToken;
  }

  public async signOut() {

    try{
     const response = firstValueFrom(this.http.get(this.apiUrl+'logout'));
     return response;
    }
    catch(error){
      throw error;
    }
   
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
    // this.userId = _id ;
    try {
      const response = firstValueFrom(
        this.http.post<User>(this.apiUrl + 'login_user_manual', {
          email,
          password,
        })
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async register(
    full_name: string,
    email: string,
    password: string,
    mobile_numb: number
  ) {
    try {
      let mobile_number = '+91' + mobile_numb;
      const response = await firstValueFrom(
        this.http.post<User>(this.apiUrl + 'create_user', {
          full_name,
          email,
          password,
          mobile_number,
        })
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  headerDynVal(isSession:any,userName:any){
     this.isUserInSession = isSession;
     this.userName = userName;
    this.userSessionSub.next({isSession,userName});
  }

}

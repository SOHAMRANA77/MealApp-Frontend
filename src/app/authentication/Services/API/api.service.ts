import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor( private Http: HttpClient) {}

  loginApi(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      email: email,
      currentPassword: password
    };

    return this.Http.post<any>(environment.mainURL+"/Login", body, { headers: headers });
  };

  public RegisterApi(RegisterReq : any){
    return this.Http.post<[]>(environment.mainURL+"/Register",RegisterReq)
  }

  public SendOtp(email: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      email: email
    };
    return this.Http.post<any>(environment.mainURL+"/sendMail", body, { headers: headers });
  }

  public verifyOtp(email: string, opt: string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      email: email,
      otp: opt
    };
    return this.Http.post<any>(environment.mainURL+"/verifyOtp", body, { headers: headers });
  }

  public changePass(email : string, password : string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      email: email,
      newPassword: password
    };
    return this.Http.put<any>(environment.mainURL+"/changePasswordByOtp", body, { headers: headers });
  }

  public ListDepart(){
    return this.Http.get<any>(environment.mainURL+"/ListDepart");
  }


}

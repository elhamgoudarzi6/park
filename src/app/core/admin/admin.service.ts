import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  baseUrl = 'http://78.39.218.12:3000/admin/';

  constructor(private http: HttpClient) { }

  login(data: any): any {
    return this.http.post(this.baseUrl + 'loginAdmin', data);
  }

  getToken(id: string): any {
    let body = {
      SecretKey: 'sadas@!$@#%!^#!GSDGETWT@#OI%J@#%!*#)^U#)^U!@)U',
    };
    return this.http.post(this.baseUrl + 'getToken/' + id, body);
  }

  //#region Files
  uploadFile(data: any): any {
    return this.http.post(this.baseUrl + 'upload', data);
  }

  uploadFiles(data: any): any {
    return this.http.post(this.baseUrl + 'multiUpload', data);
  }

  deleteFile(data: any): any {
    return this.http.post(this.baseUrl + 'deleteFile', data);
  }
  //#endregion


  //#region Admins
  getAllAdmins(token: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'getAllAdmin', { params });
  }
  getAdmin(token: string, id: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'getAdmin/' + id, { params });
  }
  addAdmin(token: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'registerAdmin', data, { params });
  }
  updateAdmin(token: string, id: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + 'updateAdmin/' + id, data, { params });
  }
  deleteAdmin(token: string, id: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.delete(this.baseUrl + 'deleteAdmin/' + id, { params });
  }
  changePassword(token: string, id: any, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + 'changePassword/' + id, data, { params });
  }
  changeUsername(token: string, id: any, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + 'changeUsername/' + id, data, { params });
  }
  resetPassword(token: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + '/resetPassword', data, { params });
  }
  //#endregion

  //#region Unit
  getAllUnit(token: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'getAllUnit', { params });
  }
  getAllUnitTrash(token: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'getAllUnitTrash', { params });
  }

  getAllUnitExit(token: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'getAllUnitExit', { params });
  }

  getUnit(token: string, id: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'getUnit/' + id, { params });
  }
  registerUnit(token: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'registerUnit', data, { params });
  }
  updateUnit(token: string, id: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + 'updateUnit/' + id, data, { params });
  }
  deleteUnit(token: string, id: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.delete(this.baseUrl + 'deleteUnit/' + id, { params });
  }
  advanceSearchUnit(token: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'advanceSearchUnit', data, { params });
  }
  //#endregion


  //#region PaidLoan
  getAllPayment(token: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'getAllPayment', { params });
  }
  getAllPaymentTrash(token: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'getAllPaymentTrash', { params });
  }
  getPayment(token: string, id: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'getPayment/' + id, { params });
  }
  registerPayment(token: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'registerPayment', data, { params });
  }
  updatePayment(token: string, id: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + 'updatePayment/' + id, data, { params });
  }
  deletePayment(token: string, id: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.delete(this.baseUrl + 'deletePayment/' + id, { params });
  }
  advanceSearchPayment(token: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'advanceSearchPayment', data, { params });
  }
  //#endregion


  getTokenSms(): any {
    let data = {
      UserApiKey: 'f2a1c337366e0cd3ddffc337',
      SecretKey: 'it66)%#teBC!@*&',
    };
    return this.http.post('https://RestfulSms.com/api/Token', data);
  }

  sendSms(data: any, token: any): any {
    const headers = {
      'content-type': 'application/json',
      'x-sms-ir-secure-token': token,
    };
    return this.http.post('https://RestfulSms.com/api/UltraFastSend', data, { 'headers': headers });
  }

}



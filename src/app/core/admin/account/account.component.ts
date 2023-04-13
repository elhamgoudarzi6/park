import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from './../admin.service';
import { LocalStorageService } from './../../../auth/local-storage.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [MessageService]

})
export class AccountComponent implements OnInit {
  form: FormGroup | any;
  fullName: any;
  image: any;
  errorMessages = {
    fullName: [{ type: 'required', message: 'نام و نام خانوادگی را وارد کنید.' }],
    userName: [{ type: 'required', message: 'نام کاربری  را وارد کنید.' }],
  };
  constructor(
    private messageService: MessageService,
    private localStorage: LocalStorageService,
    private service: AdminService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.image = this.localStorage.userImage;
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      fullName: new FormControl(this.localStorage.userFullName, Validators.compose([Validators.required])),
      userName: new FormControl(this.localStorage.userName, Validators.compose([Validators.required])),
      password: new FormControl(null),
      image: new FormControl(this.localStorage.userImage),
    });
  }

  onFileUpload(event: any): void {
    const file: File = event.files[0];
    const formData = new FormData();
    formData.append("file", file, file.name);
    this.service
      .uploadFile(formData)
      .subscribe((response: { success: boolean; imagePath: any; data: any; }) => {
        if (response.success === true) {
          this.form.controls.image.setValue(response.imagePath);
          this.messageService.add({
            severity: 'success',
            summary: ' آپلود تصویر',
            detail: 'تصویر با موفقیت آپلود شد.',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: ' آپلود تصویر',
            detail: response.data,
          });
        }
      });
  }


  submitForm(): void {
    this.service
      .updateAdmin(this.localStorage.userToken, this.localStorage.userID, this.form.value)
      .subscribe((response: any) => {
        if (response.success === true) {
          this.messageService.add({
            severity: 'success',
            summary: 'ثبت اطلاعات',
            detail: 'اطلاعات با موفقیت ویرایش شد.',
          });
          setTimeout(() => {
            this.localStorage.removeCurrentUser();
            this.router.navigateByUrl('/login');
          }, 1000)
        } else {
          this.messageService.add({
            severity: 'error',
            summary: ' ثبت اطلاعات ',
            detail: response.data,
          });
        }
      });
  }


}

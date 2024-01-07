import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TokenService } from './../../../auth/token.service';
import { LocalStorageService } from './../../../auth/local-storage.service';
import { AdminService } from './../admin.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class TrashComponent implements OnInit {
  units: any[] = [];
  selectedUnits: any[] = [];
  cols: any[] | any;
  cols2: any[] | any;
  payments: any[] = [];
  constructor(
    private messageService: MessageService,
    private service: AdminService,
    private token: TokenService,
    private localStorage: LocalStorageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getUnits();
    this.cols = [
      { field: 'unitType', header: 'نوع', customExportHeader: 'نوع واحد فناور', showSort: true },
      { field: 'companyName', header: 'نام شرکت', customExportHeader: 'نام شرکت', showSort: true },
      { field: 'companyID', header: 'شناسه ملی شرکت', customExportHeader: 'شناسه ملی شرکت', showSort: false },
      { field: 'ceoFullName', header: 'مدیرعامل/نماینده', customExportHeader: 'مدیرعامل / نماینده', showSort: true },
      { field: 'ceoID', header: 'کد ملی ', customExportHeader: 'کد ملی', showSort: true },
      { field: 'ceoMobile', header: 'شماره همراه', customExportHeader: 'شماره همراه', showSort: false },
    ];
    this.getPayments();

    this.cols2 = [
      { field: 'unitType', header: 'فناور', showSort: true },
      { field: 'ceoFullName', header: 'وام گیرنده', showSort: true },
      { field: 'companyName', header: 'شرکت', showSort: true },
      { field: 'amountPayable', header: 'مبلغ', showSort: true },
      { field: 'approvalType', header: 'نوع اعتبار', showSort: true },
      { field: 'meetingDate', header: 'تاریخ صورت جلسه', showSort: true },
      { field: 'meetingNumber', header: 'شماره صورت جلسه', showSort: true },
      { field: 'paymentDate', header: 'تاریخ پرداخت ', showSort: true },
    ];

  }

  getUnits(): any {
    this.service.getAllUnitTrash(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.units = response.data;
      } else {
        this.token.checkTokenExamination(response.data, 'admin');
        this.messageService.add({
          severity: 'error',
          summary: ' دریافت اطلاعات ',
          detail: response.data,
        });
      }
    });
  }

  getPayments(): any {
    this.service.getAllPaymentTrash(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.payments = [];
        for (let i = 0; i < response.data.length; i++) {
          let a1 = response.data[i];
          let a2 = response.data[i].Unit[0];
          let merged = { ...a1, ...a2 };
          this.payments.push(merged);
          // delete this.payments[i].id;
          delete this.payments[i].Unit;
        }
      } else {
        this.token.checkTokenExamination(response.data, 'admin');
        this.messageService.add({
          severity: 'error',
          summary: ' دریافت اطلاعات ',
          detail: response.data,
        });
      }
    });
  }

  restoreUnit(id: any) {
    let data = { show: "true" };
    this.confirmationService.confirm({
      message: 'آیا از بازیابی رکورد انتخابی مطمئن هستید؟',
      header: '',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'خیر',
      acceptLabel: 'بله',
      defaultFocus: 'reject',
      accept: () => {
        this.service.updateUnit(this.localStorage.userToken, id, data).subscribe((response: any) => {
          if (response.success === true) {
            this.confirmationService.close();
            this.messageService.add({
              severity: 'success',
              summary: ' بازیابی اطلاعات ',
              detail: response.data,
            });
            this.getUnits();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: ' بازیابی اطلاعات ',
              detail: response.data,
            });
          }
        });
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  deleteUnit(id: any): void {
    this.confirmationService.confirm({
      message: 'آیا از حذف برای همیشه مطمئن هستید؟',
      header: '',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'خیر',
      acceptLabel: 'بله',
      defaultFocus: 'reject',
      accept: () => {
        this.service.deleteUnit(this.localStorage.userToken, id).subscribe((response: { success: boolean; data: any; }) => {
          if (response.success === true) {
            this.confirmationService.close();
            this.messageService.add({
              severity: 'success',
              summary: ' حذف اطلاعات ',
              detail: response.data,
            });
            this.getUnits();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: ' حذف اطلاعات ',
              detail: response.data,
            });
          }
        });
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  restorePayment(id: any) {
    let data = { show: "true" };
    console.log(id)
    this.confirmationService.confirm({
      message: 'آیا از بازیابی رکورد انتخابی مطمئن هستید؟',
      header: '',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'خیر',
      acceptLabel: 'بله',
      defaultFocus: 'reject',
      accept: () => {
        this.service.updatePayment(this.localStorage.userToken, id, data).subscribe((response: any) => {
          if (response.success === true) {
            this.confirmationService.close();
            this.messageService.add({
              severity: 'success',
              summary: ' بازیابی اطلاعات ',
              detail: response.data,
            });
            this.getPayments();
          } else {
            console.log(response)
            this.messageService.add({
              severity: 'error',
              summary: ' بازیابی اطلاعات ',
              detail: response.data,
            });
          }
        });
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  deletePayment(id: any): void {
    this.confirmationService.confirm({
      message: 'آیا از حذف برای همیشه مطمئن هستید؟',
      header: '',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'خیر',
      acceptLabel: 'بله',
      defaultFocus: 'reject',
      accept: () => {
        this.service.deletePayment(this.localStorage.userToken, id).subscribe((response: { success: boolean; data: any; }) => {
          if (response.success === true) {
            this.confirmationService.close();
            this.messageService.add({
              severity: 'success',
              summary: ' حذف اطلاعات ',
              detail: response.data,
            });
            this.getPayments();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: ' حذف اطلاعات ',
              detail: response.data,
            });
          }
        });
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

}

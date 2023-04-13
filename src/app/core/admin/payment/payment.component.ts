import { TokenService } from '../../../auth/token.service';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { ViewPaymentComponent } from './view-payment/view-payment.component';
import { LocalStorageService } from '../../../auth/local-storage.service';
import { AdminService } from '../admin.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
@Component({
  selector: 'app-paid-loan',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService]
})

export class PaymentComponent implements OnInit {
  payments: any[] = [];
  selectedPaidLoans: any[] = [];
  cols: any[] | any;
  allCols: any[] | any;
  exportCols: any[] | any;
  exportColumns: any[] | any;
  constructor(
    private messageService: MessageService,
    private service: AdminService,
    private token: TokenService,
    private localStorage: LocalStorageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getPayments();
    this.cols = [
      { field: 'unitType', header: 'فناور', showSort: true },
      { field: 'ceoFullName', header: 'نماینده', showSort: true },
      { field: 'companyName', header: 'شرکت', showSort: true },
      { field: 'amountPayable', header: 'مبلغ', showSort: true },
      { field: 'approvalType', header: 'نوع اعتبار', showSort: true },
      { field: 'meetingDate', header: 'تاریخ صورت جلسه', showSort: true },
      { field: 'paymentDate', header: 'تاریخ پرداخت ', showSort: true },
    ];

    this.allCols = [
      { field: 'unitType', header: 'فناور' },
      { field: 'ceoFullName', header: 'وام گیرنده' },
      { field: 'guarantorsName', header: 'نام ضامنین' },
      { field: 'guarantorMobile', header: 'شماره ضامنین' },
      { field: 'amountPayable', header: 'مبلغ پرداختی ' },
      { field: 'approvalType', header: 'نوع اعتبار' },
      { field: 'approvalSubType', header: 'مصوبه' },
      { field: 'meetingDate', header: 'تاریخ صورت جلسه' },
      { field: 'meetingNumber', header: 'شماره صورت جلسه' },
      { field: 'paymentDate', header: 'تاریخ پرداخت ' },
      { field: 'InstallmentNumber', header: 'تعداد اقساط' },
      { field: 'breathingTime', header: 'مدت تنفس' },
      { field: 'paymentPlace', header: 'محل پرداخت' },
    ];

    this.exportCols = this.allCols.map((col: { header: any; field: any; }) => ({ title: col.header, dataKey: col.field }));
  }

  showAddPaymentDialog(): void {
    const ref = this.dialogService.open(AddPaymentComponent, {
      header: 'ثبت پرداختی جدید',
      width: '95%',
      style: { "font-family": "IRANSans_Light" },
    });
    ref.onClose.subscribe((res) => {
      if (res === true) {
        this.messageService.add({
          severity: 'success',
          summary: ' ثبت اطلاعات ',
          detail: 'اطلاعات با موفقیت ثبت شد.',
        });
        this.getPayments();
      }
    });
  }

  showPaymentDialog(id: string): void {
    let payment = this.payments.filter((x) => x.id == id)[0];
    const ref = this.dialogService.open(ViewPaymentComponent, {
      data: {
        payment,
      },
      header: 'مشاهده اطلاعات نماینده',
      width: '90%',
      style: { "font-family": "IRANSans_Light" },
    });
    ref.onClose.subscribe((res) => {
      if (res === true) {
        this.getPayments();
      }
    });
  }


  getPayments(): any {
    this.service.getAllPayment(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.payments = [];
        for (let i = 0; i < response.data.length; i++) {
          let a1 = response.data[i];
          let a2 = response.data[i].Unit[0];
          let merged = { ...a1, ...a2 };
          this.payments.push(merged);
          //delete this.payments[i]._id;
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

  exportCSV() {
    let data = this.selectedPaidLoans.length === 0 ? this.payments : this.selectedPaidLoans;
    const replacer = (_key: any, value: null) => value === null ? '' : value;
    const header = Object.keys(this.payments[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], { type: 'text/csv' })
    FileSaver.saveAs(blob, "payments.csv");
  }

  exportPdf() {
    let data = this.selectedPaidLoans.length === 0 ? this.payments : this.selectedPaidLoans;
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.addFont('./../../../../assets/fonts/iran-sans/IRANSansWeb(FaNum)_Light.ttf', 'IRANSansWeb(FaNum)_Light', 'normal');
    doc.addFont('./../../../../assets/fonts/iran-sans/IRANSansWeb(FaNum).ttf', 'IRANSansWeb(FaNum)', 'normal');
    doc.setFont('IRANSansWeb(FaNum)');
    doc.text('گزارش تسهیلات پرداختی', 100, 8, { align: 'center' });
    (doc as any).autoTable(this.exportCols, data,
      {
        headStyles: { fontSize: 8, font: 'IRANSansWeb(FaNum)', textColor: "#fff", cellWidth: 'wrap', halign: 'center', minCellWidth: 10 },
        styles: { fontSize: 7, font: 'IRANSansWeb(FaNum)_Light', textColor: "#666", cellWidth: 'wrap', halign: 'center' },
        margin: { top: 15, left: 2, right: 2, bottom: 10 },
        tableWidth: 'wrap',
        overflow: 'visible'
      },
    );
    doc.save('paidLoans.pdf');
  }

  exportExcel() {
    let data = this.selectedPaidLoans.length === 0 ? this.payments : this.selectedPaidLoans;
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "payments");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  showEditPaidLoanDialog(id: string): void {
    let payment = this.payments.filter((x) => x.id == id)[0];
    const ref = this.dialogService.open(EditPaymentComponent, {
      data: {
        payment,
      },
      header: 'ویرایش تسهیلات پرداختی',
      width: '95%',
      style: { "font-family": "IRANSans_Light" },
    });
    ref.onClose.subscribe((res) => {
      if (res === true) {
        this.messageService.add({
          severity: 'success',
          summary: ' ویرایش اطلاعات ',
          detail: 'اطلاعات با موفقیت ویرایش شد.',
        });
        this.getPayments();
      }
    });
  }

  sendToTrash(id: any) {
    let data = { show: "false" };
    this.confirmationService.confirm({
      message: 'آیا از حذف رکورد انتخابی مطمئن هستید؟',
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


  deletePayment(id: any): void {
    this.confirmationService.confirm({
      message: 'آیا از حذف رکورد انتخابی مطمئن هستید؟',
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
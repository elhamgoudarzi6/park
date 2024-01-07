import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AdminService } from '../admin.service';
import { LocalStorageService } from '../../../auth/local-storage.service';
import { FormControl } from '@angular/forms';
import { IDatepickerTheme } from 'ng-persian-datepicker';
import { ResultComponent } from './result/result.component';
import { DialogService } from 'primeng/dynamicdialog';
import { TokenService } from '../../../auth/token.service';
import { FilterService } from 'primeng/api';
@Component({
  selector: 'app-unit-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [MessageService, DialogService]
})

export class ReportComponent implements OnInit {
  checked = true;
  display: boolean = false;
  meetingNumber: any = "";
  // meetingDate: any = "";
  selectedUnits: any[] = [];
  dateObject: any;
  unitTypes: any[] | any;
  filteredUnits: any[] = [];
  filteredUnitsPayment: any[] = [];
  units: any[] = [];
  allUnits: any[] = [];
  payments: any[] = [];
  cols: any[] | any;
  payCols: any[] | any;
  admissionDateMin: string | any;
  data: any = {};
  data2: any = {};
  field: string = 'unitID';
  dateMin = new FormControl();
  dateMax = new FormControl();
  meetingDate = new FormControl();
  dateValueMin = new FormControl();
  dateValueMax = new FormControl();
  selectedColUnit: any[] = [];
  selectedColPayment: any[] = [];
  exportCols: any[] | any;
  exportHeader: any[] = [];
  approvalTypes: any[] = [];
  approvalSubTypes: any[] = [];
  paymentPlaces: any[] = [];
  filteredPlaces: any[] = [];
  filteredTypes: any[] = [];
  filteredSubTypes: any[] = [];


  constructor(
    private messageService: MessageService,
    private localStorage: LocalStorageService,
    private dialogService: DialogService,
    private service: AdminService,
    private token: TokenService,
    private filterService: FilterService
  ) {
    this.approvalTypes = [{ title: 'حمایت مالی' }, { title: 'کمک هزینه' }];
    this.paymentPlaces = [{ title: 'صندوق' }, { title: 'پارک' }, { title: 'سایر' }];
  }

  ngOnInit(): void {
    this.data.select = this.field;
    this.getunits();
    this.advanceSearchPayment(this.data);
    this.data2.select = "unitType ceoFullName guarantors amountPayable approvalType"
    this.advanceSearchUnit(this.data2);
    this.payCols = [
      { field: 'unitType', header: 'فناور' },
      { field: 'ceoFullName', header: 'وام گیرنده' },
      // { field: 'guarantors', header: 'ضامنین' },
      { field: 'amountPayable', header: 'مبلغ پرداختی ' },
      { field: 'approvalType', header: 'نوع مصوبه' },
      { field: 'approvalSubType', header: 'مصوبه' },
      { field: 'meetingDate', header: 'تاریخ صورت جلسه' },
      { field: 'meetingNumber', header: 'شماره صورت جلسه' },
      { field: 'paymentDate', header: 'تاریخ پرداخت ' },
      { field: 'InstallmentNumber', header: 'تعداد اقساط' },
      { field: 'breathingTime', header: 'مدت تنفس' },
      { field: 'paymentPlace', header: 'محل پرداخت' },
    ];

    this.cols = [
      { field: 'unitType', header: 'نوع', showSort: true },
      { field: 'ceoFullName', header: 'مدیرعامل/نماینده', showSort: true },
      { field: 'ceoID', header: 'کد ملی ', showSort: true },
      { field: 'ceoMobile', header: 'شماره همراه', showSort: false },
      { field: 'companyName', header: 'نام شرکت', showSort: true },
      { field: 'companyID', header: 'شناسه ملی شرکت', showSort: false },
      { field: 'ceoPhone', header: 'تلفن ثابت', showSort: false },
      { field: 'admissionDate', header: 'تاریخ پذیرش', showSort: false },
      { field: 'idea', header: 'ایده محوری', showSort: false },
      { field: 'members', header: 'اعضا', showSort: false, sub: true },
      { field: 'team', header: 'تیم کاری', showSort: false, sub: true },
    ];

    this.exportCols = this.selectedColUnit.map((col: { header: any; field: any; }) => ({ title: col.header, dataKey: col.field }));
    this.unitTypes = [{ title: 'هسته' }, { title: 'شرکت' }];
  }


  onClickselectColUnit(field: string, header: string, e: any): void {
    if (e.checked === true) {
      this.field = this.field + " " + field;
      this.data2.select = this.field;
      this.selectedColUnit.push({ field: field, header: header });
      this.advanceSearchUnit(this.data2);
    } else {
      this.field = this.field.replace(field, "");
      this.data2.select = this.field;
      this.selectedColUnit = this.selectedColUnit.filter(item => { return item.field !== field; });
      this.advanceSearchUnit(this.data2);
      // delete this.selectedCol[this.selectedCol.findIndex(item => item.field === col)]
    }
  }


  onClickselectColPayment(field: string, header: string, e: any): void {
    if (e.checked === true) {
      this.field = this.field + " " + field;
      this.data.select = this.field;
      this.selectedColPayment.push({ field: field, header: header });
      this.advanceSearchPayment(this.data);
    } else {
      this.field = this.field.replace(field, "");
      this.data.select = this.field;
      this.selectedColPayment = this.selectedColPayment.filter(item => { return item.field !== field; });
      this.advanceSearchPayment(this.data);
    }
  }

  onSelectType(event: any) {
    delete this.data.approvalSubType;
    this.data.approvalType = event.title;
    this.advanceSearchPayment(this.data);
    if (event.title === 'حمایت مالی') {
      this.approvalSubTypes = []
      //this.approvalSubTypes = [{ title: 'مرحله اول' }, { title: 'مرحله دوم' }, { title: 'مرحله سوم' }];
    }
    if (event.title === 'کمک هزینه') {
      this.approvalSubTypes = [{ title: 'تولید مستندات تبلیغاتی' }, { title: 'تولید مستندات تبلیغاتی بین المللی' }, { title: 'اجاره سوله' }, { title: 'حضور در نمایشگاه داخلی' }
        , { title: 'حضور در نمایشگاه خارجی' }, { title: 'ثبت اختراع ملی' }, { title: 'ثبت اختراع بین المللی' }, { title: 'اخذ عنوان دانش بنیان نو پا' }, { title: 'تبدیل موقعیت دانش بنیان نوپا به مراتب بالاتر' },
      { title: 'تبدیل پیش رشد به رشد یا رشد یافته' }, { title: 'کسب رتبه در همایش ها و جشنواره های ملی و منطقه ای' },
      { title: 'خدمات آزمایشگاهی و کارگاهی' }, { title: 'مشاوره های عمومی،مدیریتی،تجاری و کسب وکار' }, { title: 'ثبت برند' }, { title: 'مشاوره صادرات و گمرک' },
      { title: 'دوره های آموزشی و کارگاهی تخصصی' }, { title: 'طراحی صنعتی محصولات یا طراحی بسته بندی' }, { title: 'ساخت وتولید محصول مشترک فی مابین واحد های فناور پارک یا مراکز رشد' }, { title: 'عقد قرارداد فی مابین  واحد های فناور پارک یا مراکز رشد' },
      { title: 'اخذ مجوز ها واستاندارد های بین المللی مرتبط با حوزه فناوری  مرحله رشد یافته ' }, { title: 'اخذ مجوز ها واستاندارد های مرتبط با ایده محوری ' }, { title: 'اخذ مجوز R&D' }];
    }

  }

  filterType(event: any) {
    this.filteredTypes = this.approvalTypes.filter((item: any) => item.title.includes(event.query));
  }

  onSelectSubType(event: any) {
    this.data.approvalSubType = event.title;
    this.advanceSearchPayment(this.data);
  }

  filterSubType(event: any) {
    this.filteredSubTypes = this.approvalSubTypes.filter((item: any) => item.title.includes(event.query));
  }
  onSelectPlace(event: any) {
    this.data.paymentPlace = event.title;
    this.advanceSearchPayment(this.data);
  }
  filterPlace(event: any) {
    this.filteredPlaces = this.paymentPlaces.filter((item: any) => item.title.includes(event.query));
  }


  onSelectUnitPayment(event: any) {
    this.data.unitID = event._id;
    this.advanceSearchPayment(this.data);
  }

  filterUnitPayment(event: any) {
    this.filteredUnitsPayment = this.allUnits.filter((item: any) => item.ceoFullName.includes(event.query) ||
      item.companyName.includes(event.query) || item.unitType.includes(event.query));
  }

  onSelectUnitTypePayment(event: any) {
    this.data.unitType = event.title;
    this.advanceSearchPayment(this.data);
  }

  filterUnit(event: any) {
    this.filteredUnits = this.unitTypes.filter((item: any) => item.title.includes(event.query));
  }

  onSelectDateFromPayment(event: any) {
    this.data.paymentDateMin = event.shamsi;
    this.advanceSearchPayment(this.data);
  }

  onSelectDateToPayment(event: any) {
    this.data.paymentDateMax = event.shamsi;
    this.advanceSearchPayment(this.data);
  }

  onSelectmeetingDate(event: any) {
    this.data.meetingDate = event.shamsi;
    this.advanceSearchPayment(this.data);
  }

  onSelectUnitType(event: any) {
    this.data2.unitType = event.title;
    this.advanceSearchUnit(this.data2);
  }

  onSelectDateFrom(event: any) {
    this.data2.admissionDateMin = event.shamsi;
    this.advanceSearchUnit(this.data2);
  }

  onSelectDateTo(event: any) {
    this.data2.admissionDateMax = event.shamsi;
    this.advanceSearchUnit(this.data2);
  }

  showResultDialog(report: string): void {
    let select = report === 'unit' ? this.selectedColUnit.length : this.selectedColPayment.length;
    if (select > 0) {
      let result = report === 'unit' ? this.units : this.payments;
      let cols = report === 'unit' ? this.selectedColUnit : this.selectedColPayment;
      let title = report === 'unit' ? "گزارش واحد فناور" : "گزارش تسهیلات پرداختی";
      const ref = this.dialogService.open(ResultComponent, {
        data: {
          result, cols, title
        },
        header: 'نتیجه گزارش',
        width: '95%',
        style: { "font-family": "IRANSans_Light" },
      });
      ref.onClose.subscribe((res: any) => {
        if (res === true) {
          // this.advanceSearchUnit();
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'خطا',
        detail: 'لطفا فیلدهای خروجی را انتخاب کنید',
      });
    }

  }


  advanceSearchPayment(data: any): any {
    this.data.meetingDate = this.meetingDate;
    this.data.meetingNumber = this.meetingNumber;
    this.service.advanceSearchPayment(this.localStorage.userToken, data).subscribe((response: any) => {
      if (response.success === true) {
        this.payments=response.data;
        // this.payments = [];
        // for (let i = 0; i < response.data.length; i++) {
        //   let a1 = response.data[i];
        //   let a2 = response.data[i].Unit[0];
        //   let merged = { ...a1, ...a2 };
        //   this.payments.push(merged);
        //   //delete this.payments[i]._id;
        //   delete this.payments[i].Unit;
        // }

        // let payments = response.data;
        // let guarantors;
        // for (let i in payments) {
        //   guarantors = '';
        //   for (let j in payments[i].guarantors) {
        //     guarantors += payments[i].guarantors[j].fullName + " - ";
        //   }
        //   payments[i].guarantors = guarantors;
        //   payments[i].unitType = payments[i].Unit[0].unitType;
        //   payments[i].ceoFullName = payments[i].Unit[0].ceoFullName;
        // }
     
        console.log(this.payments)
      } else {
        this.messageService.add({
          severity: 'error',
          summary: ' دریافت اطلاعات ',
          detail: response.data,
        });
      }
    });

  }


  
// db.getCollection('payments').aggregate([
//   {$match : {"data.loanID" :objectId('5f0f010dbb476710f4d29f3b')}},
//   {$lookup: {from: "units",localField: "_id",foreignField: "unitID",as: "data"}},
//   {  $project: {      
//          __v: 0,      
//          "data.__v": 0,      
//          "data._id": 0,      
//      }
//  }
// ])

  advanceSearchUnit(data: any): any {
    this.service.advanceSearchUnit(this.localStorage.userToken, data).subscribe((response: any) => {
      if (response.success === true) {
        this.units = [];
        let members, idea, team;
        let obj = { members: "", idea: "", team: "" };
        for (let i in response.data) {
          delete response.data[i].__v;
          obj = response.data[i];
          members = '';
          idea = '';
          team = '';
          for (let j in response.data[i].members) {
            members = members + " " + response.data[i].members[j].fullName;
          }
          for (let j in response.data[i].idea) {
            idea = idea + " " + response.data[i].idea[j].title;
          }
          for (let j in response.data[i].team) {
            team = team + " " + response.data[i].team[j].fullName;
          }
          obj.members = members;
          obj.idea = idea;
          obj.team = team;
          this.units.push(obj);
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: ' دریافت اطلاعات ',
          detail: response.data,
        });
      }
    });
  }

  getunits(): any {
    this.service.getAllUnit(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.allUnits = response.data;
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


}

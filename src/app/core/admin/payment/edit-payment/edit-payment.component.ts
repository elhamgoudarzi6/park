import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AdminService } from '../../admin.service';
import { LocalStorageService } from '../../../../auth/local-storage.service';
import { MessageService } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../../auth/token.service';

@Component({
  selector: 'app-edit-paid-loan',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss'],
  providers: [MessageService]

})

export class EditPaymentComponent implements OnInit {
  payment: any;
  units: any[] = [];
  guarantors: any[] = [];
  approvalTypes: any[] = [];
  approvalSubTypes: any[] = [];
  paymentPlaces: any[] = [];
  form: FormGroup | any;
  formGuarantor: FormGroup | any;
  myGroup: FormGroup | any;
  filteredPlaces: any[] = [];
  filteredTypes: any[] = [];
  filteredSubTypes: any[] = [];
  filteredUnits: any[] = [];
  meetingDate = new FormControl();
  guaranteeType: any[] = [];
  filteredGuaranteeType: any[] = [];
  errorMessages = {
    meetingDate: [{ type: 'required', message: 'تاریخ صورت جلسه را وارد کنید.' }],
    meetingNumber: [{ type: 'required', message: 'شماره صورت جلسه را وارد کنید.' }],
  };

  constructor(
    private messageService: MessageService,
    private localStorage: LocalStorageService,
    private service: AdminService,
    public ref: DynamicDialogRef,
    private token: TokenService,
    public config: DynamicDialogConfig) {
    this.approvalTypes = [{ title: 'حمایت مالی' }, { title: 'کمک هزینه' }];
    this.paymentPlaces = [{ title: 'صندوق' }, { title: 'پارک' }, { title: 'سایر' }];
    this.guaranteeType = [{ title: 'ضامن کارمند' }, { title: 'وثیقه ملکی' }, { title: 'جواز کسب' }, { title: 'چک و سفته' }, { title: 'ضمانت نامه بانکی' }]

  }

  ngOnInit(): void {
    this.payment = this.config.data.payment;
    this.guarantors = this.payment.guarantors;

    this.getunits();
    this.createForm();
  }
  delguarantor(i: any) {
    this.guarantors.splice(i, 1);
  }
  onSelectGuaranteeType(event: any) {
    this.form.controls.guaranteeType.setValue(event.title);
  }
  filterGuaranteeType(event: any) {
    this.filteredGuaranteeType = this.guaranteeType.filter((item: any) => item.title.includes(event.query));
  }
  onSelectPlace(event: any) {
    this.form.controls.paymentPlace.setValue(event.title);
  }
  filterPlace(event: any) {
    this.filteredPlaces = this.paymentPlaces.filter((item: any) => item.title.includes(event.query));
  }
  onSelectUnit(event: any) {
    this.form.controls.unitID.setValue(event._id);
  }
  filterUnit(event: any) {
    this.filteredUnits = this.units.filter((item: any) => item.ceoFullName.includes(event.query) ||
      item.companyName.includes(event.query) || item.unitType.includes(event.query));
  }
  onSelectType(event: any) {
    this.form.controls.approvalType.setValue(event.title);
    if (event.title === 'حمایت مالی') {
      this.approvalSubTypes = []
      //this.approvalSubTypes = [{ title: 'مرحله اول' }, { title: 'مرحله دوم' }, { title: 'مرحله سوم' }];
    }
    if (event.title === 'کمک هزینه') {
      this.approvalSubTypes = [{ title: 'تولید مستندات تبلیغاتی' }, { title: 'تولید مستندات تبلیغاتی بین المللی' }, { title: 'اجاره سوله' }, { title: 'حضوذ در نمایشگاه داخلی' }
        , { title: 'حضور در نمایشگاه خارجی' }, { title: 'ثبت اختراع ملی' }, { title: 'ثبت اختراع بین المللی' }, { title: 'اخذ عنوان دانش بنیان نو پا' }, { title: 'تبدیل موقعیت دانش بنیان نوپا به مراتب بالاتر' },
      { title: 'تبدیل پیش رشد به رشد یا رشد یافته' }, { title: 'کسب رتبه در همایش ها و جشنواره های ملی و منطقه ای' },
      { title: 'خدمات آزمایشگاهی و کارگاهی' }, { title: 'مشاوره های عمومی،مدیریتی،تجاری و کسب وکار' }, { title: 'ثبت برند' }, { title: 'مشاوره صادرات و گمرک' },
      { title: 'دوره های آموزشی و کارگاهی تخصصی' }, { title: 'طراحی صنعتی محصولات یا طراحی بسته بندی' }, { title: 'ساخت وتولید محصول مشترک فی مابین واحد های فناور پارک یا مراکز رشد' }, { title: 'عقد قرارداد فی مابین  واحد های فناور پارک یا مراکز رشد' },
      { title: 'اخذ مجوز ها واستاندارد های بین المللی مرتبط با حوزه فناوری  مرحله رشد یافته ' }, { title: 'اخذ مجوز ها واستاندارد های مرتبط با ایده محوری ' }, { title: 'اخذ مجوز R&D' }];
    }
  }

  onSelectmeetingDate(event: any) {
    this.form.controls['meetingDate']=event.shamsi;
  }
  filterType(event: any) {
    this.filteredTypes = this.approvalTypes.filter((item: any) => item.title.includes(event.query));
  }

  onSelectSubType(event: any) {
    this.form.controls.approvalSubTypes.setValue(event.title);
  }

  filterSubType(event: any) {
    this.filteredSubTypes = this.approvalSubTypes.filter((item: any) => item.title.includes(event.query));
  }

  createForm() {
    this.myGroup = new FormGroup({
      cell: new FormControl(null),
    });
    this.formGuarantor = new FormGroup({
      fullName: new FormControl(null),
      mobile: new FormControl(null),
      nationalCode: new FormControl(null),
    });
    this.form = new FormGroup({
      meetingDate: new FormControl(this.payment.meetingDate, Validators.compose([Validators.required])),
      meetingNumber: new FormControl(this.payment.meetingNumber, Validators.compose([Validators.required])),
      paymentDate: new FormControl(this.payment.paymentDate),
      approvedAmount: new FormControl(this.payment.approvedAmount),
      amountPayable: new FormControl(this.payment.amountPayable),
      paymentDateFirst: new FormControl(this.payment.paymentDateFirst),
      paymentDateSecond: new FormControl(this.payment.paymentDateSecond),
      InstallmentNumber: new FormControl(this.payment.InstallmentNumber),
      InstallmentRemainNumber: new FormControl(this.payment.InstallmentRemainNumber),
      breathingTime: new FormControl(this.payment.breathingTime),
      paymentPlace: new FormControl(this.payment.paymentPlace),
      approvalType: new FormControl(this.payment.approvalType),
      unitID: new FormControl(this.payment.unitID),
      guarantors: new FormControl(this.guarantors),
      finalDueDate: new FormControl(this.payment.finalDueDate),
      info: new FormControl(this.payment.info),
      guaranteeType: new FormControl(this.payment.guaranteeType),
    });
  }
  addGuarantor() {
    if (this.formGuarantor.value.fullName == null || this.formGuarantor.value.mobile == null || this.formGuarantor.value.nationalCode == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطا',
        detail: 'لطفا اطلاعات به طور کامل وارد کنید',
      });
    }
    else {
      this.guarantors.push({
        fullName: this.formGuarantor.value.fullName,
        mobile: this.formGuarantor.value.mobile,
        nationalCode: this.formGuarantor.value.nationalCode,
      });
    }
    this.formGuarantor.controls['fullName'].reset();
    this.formGuarantor.controls['mobile'].reset();
    this.formGuarantor.controls['nationalCode'].reset();
  }

  getunits(): any {
    this.service.getAllUnit(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
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

  submitForm(): void {
    this.service
      .updatePayment(this.localStorage.userToken, this.payment.id, this.form.value)
      .subscribe((response: { success: boolean; data: any; }) => {
        if (response.success === true) {
          this.ref.close(true);
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

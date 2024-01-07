import { AngularMaterialListModule } from './../../angular-material-list.module';
import { PrimengListModule } from './../../primeng-list.module';
import { AdminRoutingModule } from './admin-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { UnitComponent } from './unit/unit.component';
import { AddUnitComponent } from './unit/add-unit/add-unit.component';
import { PaymentComponent } from './payment/payment.component';
import { AddPaymentComponent } from './payment/add-payment/add-payment.component';
import { ViewPaymentComponent } from './payment/view-payment/view-payment.component';
import { ViewUnitComponent } from './unit/view-unit/view-unit.component';
import { AdministratorsComponent } from './administrators/administrators.component';
import { AdministratorAddComponent } from './administrators/administrator-add/administrator-add.component';
import { AdministratorEditComponent } from './administrators/administrator-edit/administrator-edit.component';
import { AdministratorDetailsComponent } from './administrators/administrator-details/administrator-details.component';
import { AdministratorSecurityComponent } from './administrators/administrator-security/administrator-security.component';
import { EditUnitComponent } from './unit/edit-unit/edit-unit.component';
import { EditPaymentComponent } from './payment/edit-payment/edit-payment.component';
import { ReportComponent } from './report/report.component';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import {NgxPrintModule} from 'ngx-print';
import { ResultComponent } from './report/result/result.component';
import { AccountComponent } from './account/account.component';
import { TrashComponent } from './trash/trash.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    LoginComponent,
    UnitComponent,
    AddUnitComponent,
    PaymentComponent,
    AddPaymentComponent,
    ViewPaymentComponent,
    ViewUnitComponent,
    AdministratorsComponent,
    AdministratorAddComponent,
    AdministratorEditComponent,
    AdministratorDetailsComponent,
    AdministratorSecurityComponent,
    EditUnitComponent,
    EditPaymentComponent,
    ReportComponent,
    ResultComponent,
    AccountComponent,
    TrashComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengListModule,
    AngularMaterialListModule,
    NgPersianDatepickerModule,
    NgxPrintModule
  ],
  entryComponents: [
    UnitComponent,
    AdministratorAddComponent,
    AdministratorEditComponent,
    AdministratorDetailsComponent,
    AdministratorSecurityComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],

})
export class AdminModule { }

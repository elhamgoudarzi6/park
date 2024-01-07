import { AdminService } from '../../admin.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LocalStorageService } from '../../../../auth/local-storage.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-view-paid-loan',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.scss']
})
export class ViewPaymentComponent implements OnInit {
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;

  payment: any;

  constructor(
    private messageService: MessageService,
    private localStorage: LocalStorageService,
    private confirmationService: ConfirmationService,
    private service: AdminService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.payment = this.config.data.payment;
  }

}

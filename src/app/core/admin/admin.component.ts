import { LocalStorageService } from './../../auth/local-storage.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  items: MenuItem[] | any;
  fullName: any;
  image: any;
  access: any[] | any;
  public date = moment(Date.now()).locale('fa').format('YYYY/M/D');
  public time: any;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private localStorage: LocalStorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    if (!this.localStorage.getCurrentUser() || this.localStorage.userType != 'admin') {
      this.router.navigateByUrl('/');
    }
    this.fullName = this.localStorage.userFullName;
    this.image = this.localStorage.userImage;
    this.access = this.localStorage.accessLevel;
console.log(this.image);

    this.createMenu();

    setInterval(() => {
      this.time = moment(Date.now()).locale('fa').format('HH:mm');
    }, 1000);
  }

  createMenu() {
    let menu: MenuItem[] = [];
    this.access.forEach((result: any) => {
      if (result.title === 'صفحه اصلی') menu.push({
        label: 'صفحه اصلی',
        icon: 'pi pi-home',
        routerLink: '/panel',
      })
      if (result.title === 'واحد فناور') menu.push({
        label: 'واحد فناور',
        icon: 'pi pi-building',
        routerLink: '/panel/unit',
      })
      if (result.title === 'تسهیلات') menu.push({
        label: 'تسهیلات',
        icon: 'pi pi-calendar',
        routerLink: '/panel/payment',
      })
      // if (result.title === 'گزارش گیری') menu.push({
      //   label: 'گزارش گیری',
      //   icon: 'pi pi-file-pdf',
      //   routerLink: '/panel/report',
      // })
      if (result.title === 'تنظیمات') menu.push({
        label: 'تنظیمات',
        icon: 'pi pi-cog',
        routerLink: '/panel/config',
      })
      if (result.title === 'حساب کاربری') menu.push({
        label: 'حساب کاربری',
        icon: 'pi pi-user-edit',
        routerLink: '/panel/account',
      })
      if (result.title === 'سطل زباله') menu.push({
        label: 'سطل زباله',
        icon: 'pi pi-trash',
        routerLink: '/panel/trash',
      })
      this.items = menu;
    });
    // this.items = [
    //   {
    //     label: 'صفحه اصلی',
    //     icon: 'pi pi-home',
    //     routerLink: '/panel',
    //   },
    //   {
    //     label: 'واحد فناور',
    //     icon: 'pi pi-briefcase',
    //     routerLink: '/panel/unit',
    //   },
    //   {
    //     label: 'تسهیلات',
    //     icon: 'pi pi-dollar',
    //     routerLink: '/panel/payment',
    //   },

    //   {
    //     label: 'گزارش گیری',
    //     icon: 'pi pi-file-pdf',
    //     routerLink: '/panel/report',
    //   },
    //   {
    //     label: 'تنظیمات',
    //     icon: 'pi pi-cog',
    //     routerLink: '/panel/config',
    //   },
    // ];
  }

  logOut(): void {
    this.localStorage.removeCurrentUser();
    this.router.navigateByUrl('/');
  }

}

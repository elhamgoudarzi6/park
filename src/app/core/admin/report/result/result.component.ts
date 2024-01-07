import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;

  cols: any[] | any;
  result: any[] = [];
  exportCols: any[] | any;
  title: any;
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.result = this.config.data.result;
    this.cols = this.config.data.cols;
    this.title = this.config.data.title;
    this.exportCols = this.cols.map((col: { header: any; field: any; }) => ({ title: col.header, dataKey: col.field }));
  }

  exportCSV() {
    let data = this.result;
    const replacer = (_key: any, value: null) => value === null ? '' : value;
    const header = Object.keys(this.result[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], { type: 'text/csv' })
    FileSaver.saveAs(blob, "report.csv");
  }

  exportExcel() {
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'report.xlsx');
  }

  exportPdf() {
    let data = this.result;
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.addFont('./../../../../assets/fonts/iran-sans/IRANSansWeb(FaNum)_Light.ttf', 'IRANSansWeb(FaNum)_Light', 'normal');
    doc.addFont('./../../../../assets/fonts/iran-sans/IRANSansWeb(FaNum).ttf', 'IRANSansWeb(FaNum)', 'normal');
    doc.setFont('IRANSansWeb(FaNum)');
    doc.text('گزارش', 100, 8, { align: 'center' });
    (doc as any).autoTable(this.exportCols, data,
      {
        headStyles: { fontSize: 8, font: 'IRANSansWeb(FaNum)', textColor: "#fff", cellWidth: 'wrap', halign: 'center', minCellWidth: 10 },
        styles: { fontSize: 7, font: 'IRANSansWeb(FaNum)_Light', textColor: "#666", cellWidth: 'wrap', halign: 'center' },
      },
    );
    doc.save('report.pdf');
  }

}

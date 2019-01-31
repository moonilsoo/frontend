import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { DxDataGridModule, DxDataGridComponent, DxLoadPanelModule } from 'devextreme-angular';

import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { AppService } from "../../app.service";
import { AppState } from '../../app.state';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';


import { CohortViewService } from './cohort-view.service';
// import { DeleteModal } from '../../modal/delete-modal.component';
import {TableViewComponent} from "./tableview/table-view.component";

import { CohortService } from '../cohort.service';


@Component({
    selector: 'cohort-view',
    templateUrl: './cohort-view.component.html',
    styleUrls: ['./cohort-view.component.css'],
  providers: [
    CohortViewService
  ]
})
export class CohortViewComponent implements OnInit {

  @Output() select = new EventEmitter();
  isMenuCollapsed: boolean = true;

  idx: string;
  initial: boolean = false;
  selectApvTxt : string;
  constructor(
      private _modalService: NgbModal,
      public _service: CohortViewService,
      private _translate: TranslateService,
      private _router: Router,
      private _appService: AppService,
      private _app: AppState,
      private router: ActivatedRoute,
      private _cohortService: CohortService
  ) {}
  ngOnInit() {
//    this.idx = this._cohortService.getCohortViewTableidx();

    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._translate.use(this._appService.langInfo);
    this._appService.language$.subscribe(res => {
      this._translate.use(res);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    });
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

}

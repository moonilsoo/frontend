import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { DashboardService } from '../../dashboard.service';
import { DiagMedicalService } from './diag-medical.service';

import * as Model from '../../model/dashboard.model';

declare const $: any;

@Component({
 	selector: 'diag-medical-filter',
	templateUrl: './diag-medical-filter.component.html'
})

export class DiagMedicalFilterComponent implements OnInit {
	
	dataSource: any;
	selectedRowsData: Model.DiagMedicalList;

	secCode: string;
	clientIdx: number = 0;
	totalCount: any;

    constructor(
        private _service: DiagMedicalService,
        private _dashboard: DashboardService
    ) {
		this.secCode = this._service.secCode;
    }
    ngOnInit() {
        this._dashboard.diagMedicalStore$.subscribe(res => {
			res['filter'].length ? this.dataSource = res['filter'] : this.dataSource = [];
			this.totalCount = res['filter'].length;
		});	
	}

    onDeleteRow(data: Model.DiagMedicalList): void {
        this._dashboard.removeData(this.secCode, this.clientIdx, data.data);
	}

	onDeleteAll(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		this._dashboard.removeFilterGroup(this.secCode, 0);
	}	
	
    onContentReady(e) {
		e.component.option("loadPanel.enabled", false);
	}	
}
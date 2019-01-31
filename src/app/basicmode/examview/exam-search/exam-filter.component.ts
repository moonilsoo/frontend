import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { DashboardService } from '../../dashboard.service';
import { ExamService } from './exam.service';
import { StoreService } from '../../store/store.service';

import * as Model from '../../model/dashboard.model';

@Component({
 	selector: 'exam-filter',
	templateUrl: './exam-filter.component.html'
})

export class ExamFilterComponent implements OnInit {	
	dataSource: any;
	selectedRowsData: Model.ExamList;

	secCode: string;
	clientIdx: number = 0;
	totalCount: any;

    constructor(
		private _store: StoreService,
        private _service: ExamService,
        private _dashboard: DashboardService
    ) {
		this.secCode = this._service.secCode;
	}
	
    ngOnInit() {
        this._dashboard.examStore$.subscribe(res => {
			res['filter'].length ? this.dataSource = res['filter'] : this.dataSource = [];
			this.totalCount = res['filter'].length;
		});
	}

    onDeleteRow(data: Model.ExamList): void {
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
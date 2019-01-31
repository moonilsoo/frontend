import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { DashboardService } from '../../dashboard.service';
import { NursStateService } from './nurs-state.service';
import { StoreService } from '../../store/store.service';

import * as Model from '../../model/dashboard.model';

@Component({
 	selector: 'nurs-state-filter',
	templateUrl: './nurs-state-filter.component.html'
})

export class NursStateFilterComponent implements OnInit {
	dataSource: any;
	selectedRowsData: Model.NursState;

	secCode: string;
	clientIdx: number = 0;
	totalCount: any;

    constructor(
		private _store: StoreService,
        private _service: NursStateService,
        private _dashboard: DashboardService
    ) {
		this.secCode = this._service.secCode;
	}
	
    ngOnInit() {
        this._dashboard.nursStateStore$.subscribe(res => {
			res['filter'].length ? this.dataSource = res['filter'] : this.dataSource = [];
			this.totalCount = res['filter'].length;
		});
	}

    onDeleteRow(data: Model.NursState): void {
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
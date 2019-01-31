import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { DashboardFunc } from '../../dashboard.func';
import { PathSlipService } from './path-slip.service';
import { DashboardService } from '../../dashboard.service';
import { DashboardState } from 'app/basicmode/dashboard.state';

import * as Model from '../../model/dashboard.model';

declare const $: any;

@Component({
  selector: 'path-slip-server',
  templateUrl: './path-slip-server.component.html'
})

export class PathSlipServerComponent implements OnInit {

  	dataSource: Model.PathList[] = [];
	selectedRowsData: Model.PathList;
	totalCount: string;
	resultCount: string;
	allMode: string = 'allPages'; 	
	loading: boolean = true;

	secCode: string;
	clientIdx: number = 0;

	clickTimer: any;
	lastRowCLickedId: any;

	constructor(
		private _fb: FormBuilder,
		private _service: PathSlipService,
		private _func: DashboardFunc,
		private _state: DashboardState,
		private _dashboard: DashboardService
	) {
		this.secCode = this._service.secCode;
		this.onRowClick = this.onRowClick.bind(this);
	}
	ngOnInit() {
		this._dashboard.pathologyStore$.subscribe(res => {
			this.dataSource = res['server'];
			this.totalCount = res['server'].length.toLocaleString();	
			setTimeout(() => { this.loading = false; }, 300);
		});
		this._dashboard.activeTab$.subscribe(res => {
			this.clientIdx = res;
		});
		this._dashboard.addGrid$.subscribe(res => {
			if(res === true) {
				this.droppableGrid();
			}
		});
	}
	// 테이블 row 선택 이벤트
	onSelectionChanged(event) {
		this.selectedRowsData = event.selectedRowsData;
	}
	// 테이블 row 선택 이벤트
	addSelectData(data: Model.PathList[]) {
		return this._dashboard.addData(this.secCode, this.clientIdx, data);
	}
	// 테이블 더블클릭
	onRowClick(event: any) {
		var rows = event.component.getSelectedRowsData();
		if (this.clickTimer && this.lastRowCLickedId === event.rowIndex) {
			clearTimeout(this.clickTimer);
			this.clickTimer = null;
			this.lastRowCLickedId = event.rowIndex;

			return this.addSelectData([event.data]);
		} else {
			this.clickTimer = setTimeout(() => {

			}, 150);
		}
		this.lastRowCLickedId = event.rowIndex;
	}
	onContentReady(e) {
		e.component.option("loadPanel.enabled", false);
		const count = e.component.totalCount();

		this._func.tblDraggable();
		this.droppableGrid();
		
		count === this.totalCount ? this.resultCount = '0' : this.resultCount = count.toLocaleString();
		// if(count < this._state.maxRows && count > this._state.minRows) {
		// 	this.allMode = 'allPages';
		// } else {
		// 	this.allMode = 'page';
		// }
	}
	// 그리드 drop 후 데이터 추가 처리
	droppableGrid(): void {
		$('.gridSelect').droppable({
			tolerance: 'pointer',
			drop: ( event, ui ) => {
				ui.draggable.remove();
				let rows;
				if(this.selectedRowsData.length > this._state.maxAddRows) {
					rows = this.selectedRowsData.slice(0, this._state.maxAddRows);
				} else {
					rows = this.selectedRowsData;
				}
				return this._dashboard.addData(this.secCode, this.clientIdx, rows);
			}
		});
	}

	onToolbarPreparing(event) {
		event.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalCount'
		});
	}
}

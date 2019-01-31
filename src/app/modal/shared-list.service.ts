import { Injectable } from "@angular/core";
import { Http, Headers, URLSearchParams } from '@angular/http';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { AppState } from '../app.state';
import { HandleError } from './handle-error.component';

@Injectable()
export class SharedListService {

	appurl: string;
	headers = new Headers({
		"Accept": "text/plain;charset=UTF-8"
    });
    
	url: string = 'getSharedUsersList.json?sharedUsers=';

	constructor(
		private _http: Http,
		private _modal: NgbModal,
		private _app: AppState
	) {
		this.appurl = this._app.ajaxUrl;
	}
	
	// 의사 명단 가져오기
	list(param: any): Observable<any> {
		return this._http.get(`${this.appurl}${this.url}${param}`)
			.map(res => {
				const response = res.json();
				return response;
			})
			.catch((err, caught) => this.handleError(err, caught));
	}

	// ajax 에러시 예외 처리
	private handleError(error: Response | any, caught: any) {
		
		const headers = error.headers;
		let errorLogId = 'UNKNOWN';

		headers.forEach((value, key) => {
			if (key.toUpperCase() === 'ERRORLOGID') {
				errorLogId = value;
			}
		});
		
		if (errorLogId[0] === '000') {
			console.log('세션이 만료되었습니다.');
			window.location.replace('index.do');
		} else {
			const modalRef = this._modal.open(HandleError);
			modalRef.componentInstance.data = errorLogId;
		}

		console.error('An error occurred', error);
		return Observable.throw(error.message || error);
	}
}
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Category } from './category.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class CategoryService {

    private resourceUrl = SERVER_API_URL + 'api/categories';

    constructor(private http: Http) { }

    create(category: Category): Observable<Category> {
        const copy = this.convert(category);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(category: Category): Observable<Category> {
        const copy = this.convert(category);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    list(): Observable<string[]> {
        const url = this.resourceUrl + '/list';
        return this.http.get(url)
            .map((res: Response) => {
                return res.json();
            });
    }

    find(id: string): Observable<Category> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    findByName(name: string): Observable<Category> {
        return this.http.get(`${this.resourceUrl}/by-name/${name}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Category.
     */
    private convertItemFromServer(json: any): Category {
        const entity: Category = Object.assign(new Category(), json);
        return entity;
    }

    /**
     * Convert a Category to a JSON which can be sent to the server.
     */
    private convert(category: Category): Category {
        const copy: Category = Object.assign({}, category);
        return copy;
    }
}

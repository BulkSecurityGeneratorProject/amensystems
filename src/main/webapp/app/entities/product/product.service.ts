import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Product } from './product.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ProductService {

    private resourceUrl = SERVER_API_URL + 'api/products';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(product: Product): Observable<Product> {
        const copy = this.convert(product);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    getProductsGroupedByCategory(): Observable<any> {
        const url = this.resourceUrl + '/grouped-by-category';
        return this.http.get(url)
                    .map((res: Response) => {
                        return res.json();
                    });
    }

    update(product: Product): Observable<Product> {
        const copy = this.convert(product);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: string): Observable<Product> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    findByCategory(category: string): Observable<ResponseWrapper> {
        return this.http.get(`${this.resourceUrl}/by-category/${category}`)
            .map((res: Response) => this.convertResponse(res));
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
     * Convert a returned JSON object to Product.
     */
    private convertItemFromServer(json: any): Product {
        const entity: Product = Object.assign(new Product(), json);
        entity.createdDate = this.dateUtils
            .convertDateTimeFromServer(json.createdDate);
        entity.modifiedDate = this.dateUtils
            .convertDateTimeFromServer(json.modifiedDate);
        return entity;
    }

    /**
     * Convert a Product to a JSON which can be sent to the server.
     */
    private convert(product: Product): Product {
        const copy: Product = Object.assign({}, product);

        copy.createdDate = this.dateUtils.toDate(product.createdDate);

        copy.modifiedDate = this.dateUtils.toDate(product.modifiedDate);
        return copy;
    }
}

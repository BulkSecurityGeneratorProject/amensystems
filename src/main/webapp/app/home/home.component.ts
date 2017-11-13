import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Account, LoginModalService, Principal } from '../shared';
import { AmensystemSlideModule } from '../entities/slide/slide.module';
import {style, animate, trigger, transition} from '@angular/animations';

import { JhiEventManager, JhiParseLinks, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Slide } from '../entities/slide/slide.model';
import { SlideService } from '../entities/slide/slide.service';
import { ITEMS_PER_PAGE, ResponseWrapper } from '../shared';

import { Category } from '../entities/category/category.model';
import { CategoryService } from '../entities/category/category.service';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.css'
    ],
    providers: [NgbCarouselConfig],
    animations: [
        trigger('fade', [
            /***/
        ])
    ]
})

export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    public slides: Slide[];
    public categories: Category[];

    constructor(
        private categoryService: CategoryService,
        private slideService: SlideService,
        private principal: Principal,
        private jhiAlertService: JhiAlertService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private sliderConfig: NgbCarouselConfig
    ) {
       sliderConfig.interval = 5000;
       sliderConfig.wrap = true;
       sliderConfig.keyboard = true;
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.loadAll();
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    trackSlideId(index: number, item: Slide) {
        return item.id;
    }

    trackCategoryId(index: number, item: Category) {
        return item.id;
    }

    loadAll() {
        this.loadSlides();
        this.loadCategories();
    }

    private loadCategories(){
        this.categoryService.query({}).subscribe(
            (res: ResponseWrapper) => {
                this.categories = res.json;
                this.createCategories();
            }
        );
    }

    private createCategories(){
        console.log(this.categories);
    }

    private loadSlides() {
        this.slideService.query({}).subscribe(
            (res: ResponseWrapper) => {
                this.slides = res.json;
                this.createSlides();
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    private createSlides(){
        console.log(this.slides);
        if ( this.slides && this.slides.length < 0 ) {
            for ( let i = 1; i < 6; i++ ) {
                this.slides.push( {
                    id: i.toString(),
                    url: '/content/slides/shop/slide-' + i + '.JPG',
                    title: '',
                    description: ''
                } );
            }
        }
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController,provideHttpClientTesting} from '@angular/common/http/testing';
import {beforeEach,afterEach,describe,it,expect} from 'vitest';
import {HealthStore} from './health.store';
describe('HealthStore',()=>{
 let store:InstanceType<typeof HealthStore>;let http:HttpTestingController;
 beforeEach(()=>{TestBed.configureTestingModule({providers:[provideHttpClient(),provideHttpClientTesting(),HealthStore]});store=TestBed.inject(HealthStore);http=TestBed.inject(HttpTestingController);});
 afterEach(()=>http.verify());
 it('loads the verified environment',async()=>{const pending=store.refresh();expect(store.loading()).toBe(true);http.expectOne('/api/health').flush({status:'ok',service:'demo',stage:'testing'});await pending;expect(store.health()?.stage).toBe('testing');expect(store.loading()).toBe(false);});
 it('retries after failure',async()=>{const first=store.refresh();http.expectOne('/api/health').flush({},{status:503,statusText:'Unavailable'});await first;expect(store.error()).toBeTruthy();const retry=store.refresh();http.expectOne('/api/health').flush({status:'ok',service:'demo',stage:'development'});await retry;expect(store.error()).toBeNull();expect(store.health()?.status).toBe('ok');});
 it('rejects an unknown environment',async()=>{const pending=store.refresh();http.expectOne('/api/health').flush({status:'ok',service:'demo',stage:'wrong'});await pending;expect(store.health()).toBeNull();expect(store.error()).toBeTruthy();});
});

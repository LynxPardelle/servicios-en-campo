import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {patchState,signalStore,withMethods,withState} from '@ngrx/signals';
type Health={status:'ok';service:string;stage:string};
type State={loading:boolean;health:Health|null;error:string|null};
export const HealthStore=signalStore(
 withState<State>({loading:false,health:null,error:null}),
 withMethods((state,http=inject(HttpClient))=>({
  async refresh(){
   if(state.loading())return;
   patchState(state,{loading:true,error:null,health:null});
   try{
    const health=await firstValueFrom(http.get<Health>('/api/health'));
    if(health.status!=='ok'||!['development','testing','production'].includes(health.stage))throw new Error('Invalid health');
    patchState(state,{loading:false,health});
   }catch{patchState(state,{loading:false,error:'No pudimos conectar con el servicio. Inténtalo nuevamente.'});}
  }
 }))
);

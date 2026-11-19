import {Routes} from '@angular/router';
import {HealthStore} from './features/workspace/health.store';
export const routes:Routes=[{path:'',providers:[HealthStore],loadComponent:()=>import('./features/workspace/workspace').then(m=>m.Workspace)},{path:'**',redirectTo:''}];

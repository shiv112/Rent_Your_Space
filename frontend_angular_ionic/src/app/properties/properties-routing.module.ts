import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertiesDetailComponent } from './properties-detail/properties-detail.component';

import { PropertiesPage } from './properties.page';
import { PropertiesListComponent } from './properties-list/properties-list.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'properties',
  //   pathMatch: 'full',
  // },
  {
    path: '', component: PropertiesPage
  },
  {
    path: 'propertiespage', component: PropertiesPage
  }
  // {
  //   path: 'properties',
  //   component: PropertiesListComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertiesPageRoutingModule { }

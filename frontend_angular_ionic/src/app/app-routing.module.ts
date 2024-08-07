import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PropertiesPage } from './properties/properties.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'properties',
    pathMatch: 'full',
  },

  {
    path: 'properties',
    loadChildren: () =>
      import('./properties/properties.module').then(
        (m) => m.PropertiesPageModule
      ),
  },

  {
    path: 'user',
    loadChildren: () =>
      import('./user/user.module').then((m) => m.UserPageModule),
  },
  {
    path: 'propertiespage',
    component: PropertiesPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PropertiesPage } from './properties/properties.page';

// Defining the routes for the app
const routes: Routes = [
  {
    // Default route, redirects to 'properties' path
    path: '',
    redirectTo: 'properties',
    pathMatch: 'full',  // Ensures the redirect happens only when the path is empty
  },

  {
    // Lazy load 'properties' module
    path: 'properties',
    loadChildren: () =>
      import('./properties/properties.module').then(
        (m) => m.PropertiesPageModule  // Dynamically loads the PropertiesPageModule
      ),
  },

  {
    // Lazy load 'user' module
    path: 'user',
    loadChildren: () =>
      import('./user/user.module').then(
        (m) => m.UserPageModule  // Dynamically loads the UserPageModule
      ),
  },

  {
    // A specific route for the PropertiesPage component
    path: 'propertiespage',
    component: PropertiesPage,  // Directly loads the PropertiesPage component
  },
];

@NgModule({
  imports: [
    // Configuring the RouterModule with routes and enabling module preloading for faster navigation
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [
    RouterModule,  // Exporting RouterModule to make routes available throughout the app
  ],
})
export class AppRoutingModule {}

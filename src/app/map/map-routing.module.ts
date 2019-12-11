import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapPage} from './map.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: MapPage,
        children: [
            {
                path: 'discover',
                children: [
                    {
                        path: '',
                        loadChildren: './discover/discover.module#DiscoverPageModule'
                    }
                ]
            },
            {    path: 'favourite',
                children: [
                    // hard coded routes first
                    {
                        path: '',
                        loadChildren: './favourite/favourite.module#FavouritePageModule'
                    },
                    {
                        path: 'new/:placeId',
                        loadChildren: './favourite/new/new.module#NewPageModule'
                    },
                    {
                        path: ':placeId',
                        loadChildren: './favourite/edit/edit.module#EditPageModule'
                    },
                    {
                        path: 'edit/remove/:placeId',
                        loadChildren: './favourite/remove/remove.module#RemovePageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/map/tabs/discover',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/map/tabs/discover',
        pathMatch: 'full'
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MapRoutingModule {

}

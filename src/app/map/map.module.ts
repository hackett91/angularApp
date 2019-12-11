import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapPage } from './map.page';
import { MapRoutingModule} from './map-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapRoutingModule
  ],
  declarations: [MapPage]
})
export class MapPageModule {}

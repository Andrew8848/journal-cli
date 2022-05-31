import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {UserManagementComponent} from "./user-management/user-management.component";
import {JournalLogComponent} from "./journal-log/journal-log.component";

const routes: Routes = [
  {path: 'main', component: MainComponent},
  {path: 'userManagement', component: UserManagementComponent},
  {path: 'log', component: JournalLogComponent},
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

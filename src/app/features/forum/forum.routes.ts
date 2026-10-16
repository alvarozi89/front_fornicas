import { Routes } from '@angular/router';
import { ForumListComponent } from './pages/forum-list/forum-list';
import { ForumDetail } from './pages/forum-detail/forum-detail';

export const FORUM_ROUTES: Routes = [
  {
    path: '',
    component: ForumListComponent
  },
  {
    path: ':id',
    component: ForumDetail
  }
];

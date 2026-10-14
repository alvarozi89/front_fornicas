

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile';
import { ProfileDetailResponse, Profile } from '../../core/models/profile';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../core/services/comment';
import { RatingService } from '../../core/services/rating';
import { VisitorService } from '../../core/services/visitor';
import { AuthService } from '../../core/services/auth';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-profile-detail',
  standalone: true,
 imports: [CommonModule, JsonPipe, RouterLink,FormsModule],
  templateUrl: './profile-detail.html',
  styleUrl: './profile-detail.css'
})
export class ProfileDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly profileService = inject(ProfileService);
private readonly cdr = inject(ChangeDetectorRef);
private readonly commentService = inject(CommentService);
private readonly ratingService = inject(RatingService);
private readonly visitorService = inject(VisitorService);
private readonly authService = inject(AuthService);

currentUserId: number | null = null;
isProfileOwner = false;
showReviewModal = false;
selectedRating = 0;
hoveredRating = 0;
reviewNickname = '';
reviewContent = '';
isSubmittingReview = false;
reviewSuccessMessage = '';
reviewErrorMessage = '';
  profile: Profile | null = null;
  views = 0;
  currentPhotoIndex = 0;
  rating: ProfileDetailResponse['data']['rating'] | null = null;
  comments: ProfileDetailResponse['data']['comments'] = [];
  pendingComments: ProfileDetailResponse['data']['comments'] = [];
  commentsPerPage = 5;
  currentCommentsPage = 1;

  isLoading = true;
  errorMessage = '';

  selectedCommentId: number | null = null;
  selectedModerationStatus: 'APPROVED' | 'REJECTED' | null = null;
  showModerationModal = false;
  isModeratingReview = false;
  moderationErrorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id < 1) {
      this.errorMessage = 'El perfil solicitado no es válido.';
      this.isLoading = false;
      return;
    }



    this.profileService.getProfileById(id).subscribe({
      next: (response) => {
        console.log('Calificación recibida del backend:', response.data.rating);
        console.log('DETAIL NEXT EJECUTADO', response);
        this.profile = response.data.profile;
        console.log('Perfil recibido:', response.data.profile);
console.log('ID del propietario:', response.data.profile?.user_id);
      this.authService.getCurrentUser().subscribe({
  next: (userResponse) => {
    this.currentUserId = Number(userResponse.data.id);

    this.isProfileOwner =
      Number(this.profile?.user_id) === this.currentUserId;

    if (this.isProfileOwner && this.profile?.id) {
      this.commentService
        .getPendingByProfile(this.profile.id)
        .subscribe({
          next: (response) => {
            this.pendingComments = response.data ?? [];
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(
              'Error al cargar comentarios pendientes:',
              error
            );
            this.pendingComments = [];
            this.cdr.detectChanges();
          }
        });
    } else {
      this.pendingComments = [];
    }

    this.cdr.detectChanges();
  },
  error: () => {
    this.currentUserId = null;
    this.isProfileOwner = false;
    this.pendingComments = [];
    this.cdr.detectChanges();
  }
});
        this.views = response.data.views;
        this.rating = response.data.rating;
        this.comments = response.data.comments;
        console.log('Comentarios recibidos del backend:', response.data.comments);
        this.isLoading = false;
        this.cdr.detectChanges();


  console.log('Perfil asignado:', this.profile?.id);
  console.log('Estado de carga:', this.isLoading);
      },
      error: (error) => {
        console.log('DETAIL ERROR EJECUTADO', error);
        console.error('Error al cargar el perfil:', error);
        this.errorMessage = 'No fue posible cargar este perfil.';
        this.isLoading = false;
      }
    });
  }

  nextPhoto(): void {
    const photos = this.profile?.photos ?? [];

    if (photos.length > 0) {
      this.currentPhotoIndex =
        (this.currentPhotoIndex + 1) % photos.length;
    }
  }

  previousPhoto(): void {
    const photos = this.profile?.photos ?? [];

    if (photos.length > 0) {
      this.currentPhotoIndex =
        (this.currentPhotoIndex - 1 + photos.length) % photos.length;
    }
  }


get ratingStars(): number[] {
  return Array.from({ length: 5 }, (_, i) => i + 1);
}

getStarType(star: number): 'full' | 'half' | 'empty' {
  const average = this.rating?.average ?? 0;

  if (average >= star) {
    return 'full';
  }

  if (average >= star - 0.5) {
    return 'half';
  }

  return 'empty';
}


  getPhotoUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `${environment.apiUrlPhoto}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  openReviewModal(): void {
  this.showReviewModal = true;
  this.reviewSuccessMessage = '';
  this.reviewErrorMessage = '';
}

closeReviewModal(): void {
  if (this.isSubmittingReview) {
    return;
  }

  this.showReviewModal = false;
  this.reviewErrorMessage = '';
}

selectRating(value: number): void {
  if (value >= 1 && value <= 5) {
    this.selectedRating = value;
  }
}

resetReviewForm(): void {
  this.selectedRating = 0;
  this.hoveredRating = 0;
  this.reviewNickname = '';
  this.reviewContent = '';
}

submitReview(): void {
  this.reviewSuccessMessage = '';
  this.reviewErrorMessage = '';

  const nickname = this.reviewNickname.trim();
  const content = this.reviewContent.trim();

  if (!nickname) {
    this.reviewErrorMessage = 'El apodo es obligatorio.';
    return;
  }

  if (nickname.length > 100) {
    this.reviewErrorMessage = 'El apodo no puede superar los 100 caracteres.';
    return;
  }

  if (!content) {
    this.reviewErrorMessage = 'El comentario es obligatorio.';
    return;
  }

  if (content.length > 500) {
    this.reviewErrorMessage = 'El comentario no puede superar los 500 caracteres.';
    return;
  }

  if (this.selectedRating < 1 || this.selectedRating > 5) {
    this.reviewErrorMessage = 'Selecciona una calificación de 1 a 5 estrellas.';
    return;
  }

  if (!this.profile) {
    this.reviewErrorMessage = 'No se encontró el perfil.';
    return;
  }

  this.isSubmittingReview = true;

  const profileId = this.profile.id;
  const visitorToken = this.visitorService.getVisitorToken();

  this.ratingService.createRating(
    profileId,
    this.selectedRating,
    visitorToken
  ).subscribe({
    next: () => {
      this.commentService.createComment(
        profileId,
        nickname,
        content,
        visitorToken
      ).subscribe({
        next: () => {
          this.reviewSuccessMessage =
            'Tu calificación fue registrada y tu comentario quedó pendiente de moderación.';

          this.resetReviewForm();

          this.profileService.getProfileById(profileId).subscribe({
            next: (response) => {
              this.rating = response.data.rating;
              this.comments = response.data.comments;
              this.cdr.detectChanges();
            }
          });

          this.isSubmittingReview = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.reviewErrorMessage =
            error.error?.message ??
            'La calificación se registró, pero no se pudo enviar el comentario.';

          this.isSubmittingReview = false;
          this.cdr.detectChanges();
        }
      });
    },
    error: (error) => {
      this.reviewErrorMessage =
        error.error?.message ??
        'No se pudo registrar la calificación.';

      this.isSubmittingReview = false;
      this.cdr.detectChanges();
    }
  });
}

openModerationModal(
  commentId: number,
  status: 'APPROVED' | 'REJECTED'
): void {
  if (!this.isProfileOwner) {
    return;
  }

  this.selectedCommentId = commentId;
  this.selectedModerationStatus = status;
  this.moderationErrorMessage = '';
  this.showModerationModal = true;
}

closeModerationModal(): void {
  if (this.isModeratingReview) {
    return;
  }

  this.showModerationModal = false;
  this.selectedCommentId = null;
  this.selectedModerationStatus = null;
  this.moderationErrorMessage = '';
  this.pendingComments = this.pendingComments.filter(
  comment => comment.id !== this.selectedCommentId
);
}

confirmModeration(): void {
  if (
    !this.isProfileOwner ||
    this.selectedCommentId === null ||
    this.selectedModerationStatus === null ||
    this.isModeratingReview
  ) {
    return;
  }

  this.isModeratingReview = true;
  this.moderationErrorMessage = '';


this.commentService.moderateReview(
  this.selectedCommentId,
  this.selectedModerationStatus
).subscribe({
  next: () => {
    const moderatedCommentId = this.selectedCommentId;
    const profileId = this.profile?.id;

    this.showModerationModal = false;

    if (moderatedCommentId !== null) {
      this.pendingComments = this.pendingComments.filter(
        comment => comment.id !== moderatedCommentId
      );
    }

    this.selectedCommentId = null;
    this.selectedModerationStatus = null;
    this.moderationErrorMessage = '';

    if (profileId) {
      this.profileService.getProfileById(profileId).subscribe({
        next: (response) => {
          this.rating = response.data.rating;
          this.comments = response.data.comments;
          this.cdr.detectChanges();
        },
        error: () => {
          console.error(
            'La reseña se moderó, pero no se pudo actualizar la vista.'
          );
          this.cdr.detectChanges();
        }
      });
    }

    this.isModeratingReview = false;
    this.cdr.detectChanges();
  },
  error: (error) => {
    this.moderationErrorMessage =
      error.error?.message ?? 'No se pudo moderar la reseña.';

    this.isModeratingReview = false;
    this.cdr.detectChanges();
  }
});
}
get totalCommentsPages(): number {
  return Math.ceil(this.comments.length / this.commentsPerPage);
}

get paginatedComments(): ProfileDetailResponse['data']['comments'] {
  const start = (this.currentCommentsPage - 1) * this.commentsPerPage;

  return this.comments.slice(start, start + this.commentsPerPage);
}

changeCommentsPage(page: number): void {
  if (page < 1 || page > this.totalCommentsPages) {
    return;
  }

  this.currentCommentsPage = page;
}
}

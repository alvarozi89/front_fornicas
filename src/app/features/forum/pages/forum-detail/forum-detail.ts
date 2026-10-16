import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../../../core/services/forum';
import { ForumTopic, ForumComment } from '../../../../core/models/forum';

@Component({
  selector: 'app-forum-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './forum-detail.html',
  styleUrls: ['./forum-detail.css']
})
export class ForumDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly forumService = inject(ForumService);
  private readonly cdr = inject(ChangeDetectorRef);

  topicId!: number;
  topic: ForumTopic | null = null;
  comments: ForumComment[] = [];

  // 📄 Paginación para Comentarios
  pagedComments: ForumComment[] = [];
  commentsCurrentPage = 1;
  commentsLimit = 5;
  commentsTotalPages = 1;

  isLoading = true;
  isSubmittingComment = false;

  newComment: ForumComment = {
    nickname: '',
    content: ''
  };
  commentSuccessMessage: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.topicId = Number(idParam);
      this.loadTopicDetail();
    } else {
      this.router.navigate(['/forum']);
    }
  }

  loadTopicDetail(): void {
    this.isLoading = true;
    this.forumService.getTopicById(this.topicId).subscribe({
      next: (response: any) => {
        const root = response.data || response;
        this.topic = root.topic || root;
        this.comments = root.comments || (this.topic && (this.topic as any).comments) || [];

        // Calcular paginación del cliente para comentarios
        this.updateCommentsPagination();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el detalle del tema:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateCommentsPagination(): void {
    this.commentsTotalPages = Math.ceil(this.comments.length / this.commentsLimit) || 1;
    const startIndex = (this.commentsCurrentPage - 1) * this.commentsLimit;
    const endIndex = startIndex + this.commentsLimit;
    this.pagedComments = this.comments.slice(startIndex, endIndex);
      this.cdr.detectChanges();
  }

  changeCommentsPage(page: number): void {
    if (page >= 1 && page <= this.commentsTotalPages && page !== this.commentsCurrentPage) {
      this.commentsCurrentPage = page;
      this.updateCommentsPagination();
      this.cdr.detectChanges();
    }
  }



  onReportTopic(): void {
    const reason = prompt('Motivo del reporte para este tema:');
    if (!reason || !reason.trim()) return;

    this.forumService.reportTopic(this.topicId, reason.trim()).subscribe({
      next: () => alert('Tema reportado exitosamente. Gracias por colaborar.'),
      error: (err) => console.error('Error al reportar tema:', err)
    });
  }

  onReportComment(commentId?: number): void {
    if (!commentId) return;
    const reason = prompt('Motivo del reporte para este comentario:');
    if (!reason || !reason.trim()) return;

    this.forumService.reportComment(commentId, reason.trim()).subscribe({
      next: () => alert('Comentario reportado exitosamente.'),
      error: (err) => console.error('Error al reportar comentario:', err)
    });
  }
  onCreateComment(): void {
    if (!this.newComment.nickname?.trim() || !this.newComment.content?.trim()) {
      alert('Por favor completa tu apodo y el contenido del comentario.');
      return;

    }

    this.isSubmittingComment = true;
    this.commentSuccessMessage = null;
  this.cdr.detectChanges();
    this.forumService.createComment(this.topicId, this.newComment).subscribe({
      next: () => {
        this.isSubmittingComment = false;
        this.newComment = { nickname: '', content: '' };
        this.commentsCurrentPage = 1;
        this.cdr.detectChanges();
        // Mensaje de éxito visible
        this.commentSuccessMessage = '¡Tu comentario ha sido publicado con éxito!';
        setTimeout(() => {
          this.commentSuccessMessage = null;
          this.cdr.detectChanges();
        }, 4000);

        this.loadTopicDetail();
      },
      error: (err) => {
        console.error('Error al crear comentario:', err);
        this.isSubmittingComment = false;
        this.cdr.detectChanges();
      }
    });
  }
}

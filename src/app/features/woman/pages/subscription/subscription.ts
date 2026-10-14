import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SubscriptionService } from '../../../../core/services/subscription';
import { Subscription as UserSubscription } from '../../../../core/models/subscription';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css'
})
export class Subscription implements OnInit {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly cdr = inject(ChangeDetectorRef);

  subscription: UserSubscription | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadSubscription();
  }

  loadSubscription(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscriptionService.getActiveSubscription().subscribe({
      next: (response) => {
        this.subscription = response.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar la suscripción:', error);
        this.errorMessage = 'No fue posible consultar tu suscripción.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

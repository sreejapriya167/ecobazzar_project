import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../services/product';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seller-dashboard.html'
})
export class SellerDashboard implements OnInit, OnDestroy {

  private productSvc = inject(ProductService);
  private reportSvc = inject(ReportService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  products: any[] = [];
  loading = true;
  error: string | null = null;

  stats = { total: 0, certified: 0, requested: 0, orders: 0, revenue: 0 };

  /** Current badge from backend */
  badge: string | null = null;

  /** Path to hero images */
  readonly BADGE_ASSET = 'assets/hero/';

  /** Full badge list (Style B – Shield Eco Badges) */
  badges = [
    { id: 'New Seller',          filename: 'new-seller.png',       title: 'New Seller' },
    { id: 'Trusted Seller',      filename: 'trusted-seller.png',   title: 'Trusted Seller' },
    { id: 'Eco Champion',        filename: 'eco-champion.png',     title: 'Eco Champion' },
    { id: 'Carbon Hero',         filename: 'carbon-hero.png',      title: 'Carbon Hero' },
    { id: 'Top Rated Seller',    filename: 'top-rated-seller.png', title: 'Top Rated Seller' }
  ];

  /** Chart reference */
  @ViewChild('salesChart') salesChart!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  /** Helper → Get full badge object */
  get activeBadge() {
    return this.badges.find(b => b.id === this.badge) || this.badges[0];
  }

  /** Helper → Image path */
  badgeImg(badgeId: string): string {
  const b = this.badges.find(x => x.id === badgeId);
  return b ? `/hero/${b.filename}` : '';
}


  /** Load dashboard data */
  load() {
    this.loading = true;
    this.error = null;

    forkJoin([
      this.productSvc.getSellerProducts().pipe(catchError(() => of([]))),
      this.reportSvc.getSellerReport().pipe(catchError(() => of(null))),
      this.reportSvc.getSellerSales(14).pipe(catchError(() => of([])))
    ]).subscribe({
      next: ([productsRes, reportRes, salesRes]: any) => {
        this.products = productsRes || [];
        this.stats.total = this.products.length;
        this.stats.certified = this.products.filter((p: any) => p.ecoCertified).length;
        this.stats.requested = this.products.filter((p: any) => p.ecoRequested && !p.ecoCertified).length;
        this.stats.orders = Number(reportRes?.totalOrders ?? 0);
        this.stats.revenue = Number(reportRes?.totalRevenue ?? 0);

        /** 📌 Assign badge from backend */
        this.badge = reportRes?.ecoSellerBadge || reportRes?.badge || 'New Seller';

        this.loading = false;

        setTimeout(() => this.renderChart(salesRes || []), 0);
      },
      error: () => {
        this.error = 'Failed to load dashboard';
        this.loading = false;
      }
    });
  }

  /** Local YYYY-MM-DD formatter */
  private toLocalYMD(d: Date): string {
    return d.toLocaleDateString('en-CA');
  }

  /** Chart rendering */
  renderChart(rawData: any[]) {
    if (!this.salesChart) return;

    const ctx = this.salesChart.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart?.destroy();

    const revenueMap = new Map<string, number>();

    rawData.forEach(item => {
      const raw = item.day || item.date || '';
      const dateStr = raw.includes('T') ? raw.split('T')[0] : raw;
      if (dateStr) revenueMap.set(dateStr, Number(item.revenue || 0));
    });

    const today = new Date();
    const labels: string[] = [];
    const values: number[] = [];

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const key = this.toLocalYMD(d);
      const lbl = d.toLocaleDateString('en-US', { weekday: 'short' });

      labels.push(lbl);
      values.push(revenueMap.get(key) ?? 0);
    }

    const suggestedMax = Math.max(...values, 100) * 1.2;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: values.map(v => v > 0 ? '#10b981' : '#e5e7eb'),
          borderColor: '#10b981',
          borderWidth: 3,
          borderRadius: 12,
          borderSkipped: false,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax,
            ticks: { callback: v => '₹' + Number(v).toLocaleString() },
            grid: { color: '#f0fdf4' }
          },
          x: { grid: { display: false } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  goAdd() {
    this.router.navigate(['/seller/product']);
  }

  edit(product: any) {
    this.router.navigate(['/seller/product'], { state: { product } });
  }

  deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productSvc.delete(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.stats.total = this.products.length;
        this.toastr.success('Product deleted successfully');
        this.load();
      },
      error: () => this.toastr.error('Failed to delete product')
    });
  }
}

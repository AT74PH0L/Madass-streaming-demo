import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { AuthService } from '../auth/auth.service';
import { Dashboard } from './dto/dashboard.dto';

@Controller('dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthService,
  ) {}

  @Get('all')
  @Roles(Role.Admin)
  async getTotal() {
    const total = await this.dashboardService.countTotal();
    const recentMovies = await this.dashboardService.getRecentAddMovies();
    const mostWatched = await this.dashboardService.getMostWatched();
    const mostWatchedUser = await this.dashboardService.getMostWatchedUser();
    const mostReviewedMovie =
      await this.dashboardService.getMostReviewedMovie();
    const dashboard: Dashboard = {
      total: total,
      recentMovies: recentMovies,
      mostWatched: mostWatched,
      mostWatchedUser: mostWatchedUser,
      mostReviewedMovie: mostReviewedMovie,
    };
    return dashboard;
  }
}

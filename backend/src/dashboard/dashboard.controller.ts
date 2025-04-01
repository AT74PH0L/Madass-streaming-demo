import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { AuthService } from '../auth/auth.service';
import { DashboardAdmin } from './dto/dashboard-admin.dto';
import { DashboardCreator } from './dto/dashboard-creator.dto';
import { Request } from 'express';
import { DashboardProfile } from './dto/dashboard-profile.dto';

@Controller('dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthService,
  ) {}

  @Get('all')
  @Roles(Role.Admin)
  async getDashnoardAdmin() {
    const total = await this.dashboardService.countTotal();
    const recentMovies = await this.dashboardService.getRecentAddMovies();
    const mostWatched = await this.dashboardService.getMostWatched();
    const mostWatchedUser = await this.dashboardService.getMostWatchedUser();
    const mostReviewedMovie =
      await this.dashboardService.getMostReviewedMovie();
    const dashboard: DashboardAdmin = {
      total: total,
      recentMovies: recentMovies,
      mostWatched: mostWatched,
      mostWatchedUser: mostWatchedUser,
      mostReviewedMovie: mostReviewedMovie,
    };
    return dashboard;
  }

  @Get('creator')
  @Roles(Role.Creator, Role.Admin)
  async getDashboardCreator(@Req() req: Request) {
    const { access_token } = req.cookies;
    const token: string = access_token as string;
    const claim = await this.authService.verifyAccessToken(token);
    if (!claim) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    const userId = claim.sub;
    const total = await this.dashboardService.countTotalByMovieUserId(userId);
    const mostViewMovies =
      await this.dashboardService.getMostViewMoviesByMovieUserId(userId);
    const viewWithTimeSeries =
      await this.dashboardService.getViewWithTimeSeries(userId);

    const dashboard: DashboardCreator = {
      total: total,
      mostViewMovies: mostViewMovies,
      viewWithTimeSeries: viewWithTimeSeries,
    };
    return dashboard;
  }

  @Get('profile')
  @Roles(Role.User, Role.Creator, Role.Admin)
  async getDashboardProfile(@Req() req: Request) {
    const { access_token } = req.cookies;
    const token: string = access_token as string;
    const claim = await this.authService.verifyAccessToken(token);
    if (!claim) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    const userId = claim.sub;
    const total = await this.dashboardService.countTotalByUserId(userId);
    const mostWatchedMovie =
      await this.dashboardService.getMostViewMoviesByUserId(userId);
    const watchHistory =
      await this.dashboardService.getWatchHistoryByUserId(userId);

    const dashboard: DashboardProfile = {
      total: total,
      mostWatchedMovie: mostWatchedMovie,
      watchHistory: watchHistory,
    };
    return dashboard;
  }
}

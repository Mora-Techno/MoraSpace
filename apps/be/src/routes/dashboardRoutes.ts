import Elysia from 'elysia';
import DashboardController from '@/controllers/DashboardController';
import type { AppContext } from '@/contex';
import { requireRole, verifyToken } from '@/middlewares/auth';

class DashboardRouter {
  public dashboardRouter;

  constructor() {
    this.dashboardRouter = new Elysia({ prefix: '/dashboards', tags: ['Dashboards'] });
    this.routes();
  }

  private routes() {
    this.dashboardRouter.get('/owner', (c: AppContext) => DashboardController.ownerOverview(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['Owner']).beforeHandle],
      detail: { summary: 'Ringkasan dashboard owner', tags: ['Dashboards'] },
    });
  }
}

export default new DashboardRouter().dashboardRouter;

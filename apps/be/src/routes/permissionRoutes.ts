import Elysia from 'elysia';
import RoleController from '@/controllers/RoleController';
import { RoleParamsDto, UpdateRolePermissionsDto } from '@/dto/role.dto';
import type { AppContext } from '@/contex';
import { verifyToken } from '@/middlewares/auth';

class PermissionRouter {
  public permissionRouter;

  constructor() {
    this.permissionRouter = new Elysia({
      prefix: '/permissions',
      tags: ['Roles & Permissions'],
    });
    this.routes();
  }

  private routes() {
    this.permissionRouter.get('/', (c: AppContext) => RoleController.listMasterPermissions(c), {
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Master Permission',
        description: 'Mengambil daftar seluruh hak akses sistem yang tersedia.',
        tags: ['Roles & Permissions'],
      },
    });
    this.permissionRouter.get(
      '/:id/permissions',
      (c: AppContext) => RoleController.getRolePermissions(c),
      {
        params: RoleParamsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: 'Daftar permission role via /permissions',
          description:
            'Menampilkan semua hak akses sistem yang dipetakan pada peran (role ID) ini.',
          tags: ['Roles & Permissions'],
        },
      },
    );
    this.permissionRouter.put(
      '/:id/permissions',
      (c: AppContext) => RoleController.updateRolePermissions(c),
      {
        params: RoleParamsDto,
        body: UpdateRolePermissionsDto,
        beforeHandle: [verifyToken().beforeHandle],
        detail: {
          summary: 'Perbarui pemetaan permission via /permissions',
          description: 'Mengganti seluruh pemetaan hak akses pada peran (role ID) ini.',
          tags: ['Roles & Permissions'],
        },
      },
    );
  }
}

export default new PermissionRouter().permissionRouter;

import Elysia from 'elysia';
import ModuleController from '@/controllers/ModuleController';
import {
  CreateModuleDto,
  ModuleParamsDto,
  ModuleQueryDto,
  UpdateModuleDto,
} from '@/dto/module.dto';
import type { AppContext } from '@/contex';
import { verifyToken } from '@/middlewares/auth';

class ModuleRouter {
  public moduleRouter;

  constructor() {
    this.moduleRouter = new Elysia({ prefix: '/modules', tags: ['Modules'] });
    this.routes();
  }

  private routes() {
    this.moduleRouter.get('/', (c: AppContext) => ModuleController.list(c), {
      query: ModuleQueryDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Daftar modul',
        description: 'Menampilkan daftar modul (TASK, TODO, NOTE) untuk workspace saat ini.',
        tags: ['Modules'],
      },
    });

    this.moduleRouter.get('/:id', (c: AppContext) => ModuleController.getById(c), {
      params: ModuleParamsDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Detail modul',
        description: 'Menampilkan detail lengkap modul berdasarkan ID.',
        tags: ['Modules'],
      },
    });

    this.moduleRouter.post('/', (c: AppContext) => ModuleController.create(c), {
      body: CreateModuleDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Buat modul baru',
        description: 'Membuat modul baru. Dalam workspace perusahaan, hanya Owner yang diizinkan.',
        tags: ['Modules'],
      },
    });

    this.moduleRouter.patch('/:id', (c: AppContext) => ModuleController.update(c), {
      params: ModuleParamsDto,
      body: UpdateModuleDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Perbarui modul',
        description: 'Memperbarui nama, deskripsi, warna, atau ikon modul. Hanya Owner.',
        tags: ['Modules'],
      },
    });

    this.moduleRouter.delete('/:id', (c: AppContext) => ModuleController.delete(c), {
      params: ModuleParamsDto,
      beforeHandle: [verifyToken().beforeHandle],
      detail: {
        summary: 'Hapus modul',
        description: 'Menghapus modul dan item di dalamnya. Hanya Owner.',
        tags: ['Modules'],
      },
    });
  }
}

export default new ModuleRouter().moduleRouter;

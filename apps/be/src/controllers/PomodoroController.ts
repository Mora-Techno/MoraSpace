import PomodoroService from '@/service/PomodoroService';
import { HttpResponse } from '@/http';
import { getUser } from '@/utils/authTokens';
import { memberContextValidate } from '@/validation/auth.validate';
import type { AppContext } from '@/contex';
import type { PickStartPomodoro, PickStopPomodoro } from '@repo/types/pomodoro.types';

class PomodoroController {
  public async start(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const body = (c.body || {}) as PickStartPomodoro;
      const data = await PomodoroService.start(user.companyMemberId!, body.metadata);
      return HttpResponse(c).created(data, 'Sesi pomodoro dimulai');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async pause(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await PomodoroService.pause(user.companyMemberId!);
      return HttpResponse(c).ok(data, 'Sesi pomodoro diubah menjadi jeda (pause)');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gagal menjeda sesi';
      return HttpResponse(c).badRequest(msg);
    }
  }

  public async resume(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await PomodoroService.resume(user.companyMemberId!);
      return HttpResponse(c).ok(data, 'Sesi pomodoro dilanjutkan (resume)');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async stop(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const body = (c.body || {}) as PickStopPomodoro;
      const data = await PomodoroService.stop(user.companyMemberId!, body.sessionId, body.duration);
      return HttpResponse(c).ok(data, 'Sesi pomodoro dihentikan (stop)');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Gagal menghentikan sesi';
      return HttpResponse(c).badRequest(msg);
    }
  }

  public async getToday(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await PomodoroService.getToday(user.companyMemberId!);
      return HttpResponse(c).ok(data, undefined, 'Berhasil mengambil data fokus hari ini');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }

  public async getStatistics(c: AppContext) {
    try {
      const user = getUser(c);
      const authResponse = await memberContextValidate(user, c);
      if (authResponse) return authResponse;

      const data = await PomodoroService.getStatistics(user.companyMemberId!);
      return HttpResponse(c).ok(data, undefined, 'Berhasil mengambil statistik fokus');
    } catch (error) {
      return HttpResponse(c).internalError(error);
    }
  }
}

export default new PomodoroController();

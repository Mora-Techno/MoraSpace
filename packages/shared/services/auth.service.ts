import { AUTH_ENDPOINTS } from "../endpoints/auth.endpoints";
import type {
  AuthSessionResponse,
  PickLogin,
  PickRefreshToken,
  PickRegister,
  PickSendMagicLink,
  PickSendOtp,
  PickVerifyMagicLink,
  PickVerifyOtp,
  SafeAuthUser,
} from "../types/auth.types";
import type { TResponse } from "../types/response.types";
import { PostResponse, PublicPostResponse } from "./http";
import { toServiceResponse } from "./service-response";
class AuthService {
  public async Login(
    payload: PickLogin,
  ): Promise<TResponse<AuthSessionResponse>> {
    const res = await PublicPostResponse<AuthSessionResponse>(
      AUTH_ENDPOINTS.LOGIN,
      payload,
    );
    return toServiceResponse(res, {
      message: "Login berhasil",
      statusCode: 200,
    });
  }
  public async Register(
    payload: PickRegister,
  ): Promise<TResponse<SafeAuthUser>> {
    const res = await PublicPostResponse<SafeAuthUser>(
      AUTH_ENDPOINTS.REGISTER,
      payload,
    );
    return toServiceResponse(res, {
      message: "Register berhasil",
      statusCode: 201,
    });
  }
  public async Logout(): Promise<TResponse<null>> {
    const res = await PostResponse<null>(AUTH_ENDPOINTS.LOGOUT);
    return toServiceResponse(res, {
      message: "Logout berhasil",
      statusCode: 200,
    });
  }
  public async RefreshToken(
    payload: PickRefreshToken,
  ): Promise<TResponse<AuthSessionResponse>> {
    const res = await PublicPostResponse<AuthSessionResponse>(
      AUTH_ENDPOINTS.REFRESH,
      payload,
    );
    return toServiceResponse(res, {
      message: "Token refreshed",
      statusCode: 200,
    });
  }
  public async SendMagicLink(
    payload: PickSendMagicLink,
  ): Promise<TResponse<{ email: string }>> {
    const res = await PublicPostResponse<{ email: string }>(
      AUTH_ENDPOINTS.SEND_MAGIC_LINK,
      payload,
    );
    return toServiceResponse(res, {
      message: "Magic link berhasil dikirim",
      statusCode: 200,
    });
  }
  public async VerifyMagicLink(
    payload: PickVerifyMagicLink,
  ): Promise<TResponse<AuthSessionResponse>> {
    const res = await PublicPostResponse<AuthSessionResponse>(
      AUTH_ENDPOINTS.VERIFY_MAGIC_LINK,
      payload,
    );
    return toServiceResponse(res, {
      message: "Email berhasil diverifikasi",
      statusCode: 200,
    });
  }
  public async SendOtp(
    payload: PickSendOtp,
  ): Promise<TResponse<{ sentTo: string }>> {
    const res = await PublicPostResponse<{ sentTo: string }>(
      AUTH_ENDPOINTS.SEND_OTP,
      payload,
    );
    return toServiceResponse(res, {
      message: "OTP berhasil dikirim",
      statusCode: 200,
    });
  }
  public async VerifyOtp(
    payload: PickVerifyOtp,
  ): Promise<TResponse<AuthSessionResponse>> {
    const res = await PublicPostResponse<AuthSessionResponse>(
      AUTH_ENDPOINTS.VERIFY_OTP,
      payload,
    );
    return toServiceResponse(res, {
      message: "OTP berhasil diverifikasi",
      statusCode: 200,
    });
  }
}
export default new AuthService();

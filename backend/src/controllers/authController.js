const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/ApiResponse');
const { parseDurationMs } = require('../utils/token');
const env = require('../config/env');
const authService = require('../services/authService');

const REFRESH_COOKIE_NAME = 'refreshToken';

function setRefreshCookie(res, refreshToken) {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: parseDurationMs(env.jwt.refreshExpiresIn),
  });
}

const register = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  setRefreshCookie(res, refreshToken);
  sendSuccess(res, { statusCode: 201, message: 'Registered successfully', data: { user, accessToken } });
});

const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setRefreshCookie(res, refreshToken);
  sendSuccess(res, { message: 'Logged in successfully', data: { user, accessToken } });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie(REFRESH_COOKIE_NAME);
  sendSuccess(res, { message: 'Logged out successfully' });
});

const refresh = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.refresh(req.cookies[REFRESH_COOKIE_NAME]);
  setRefreshCookie(res, refreshToken);
  sendSuccess(res, { message: 'Token refreshed', data: { user, accessToken } });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetUrlBase = `${env.clientUrl}/reset-password`;
  await authService.forgotPassword(req.body.email, resetUrlBase);
  sendSuccess(res, { message: 'If an account with that email exists, a reset link has been sent' });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  sendSuccess(res, { message: 'Password has been reset successfully' });
});

const me = catchAsync(async (req, res) => {
  sendSuccess(res, { data: { user: req.user } });
});

const updateMe = catchAsync(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  sendSuccess(res, { message: 'Profile updated', data: { user } });
});

const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user._id, req.body.currentPassword, req.body.newPassword);
  sendSuccess(res, { message: 'Password changed successfully' });
});

module.exports = { register, login, logout, refresh, forgotPassword, resetPassword, me, updateMe, changePassword };

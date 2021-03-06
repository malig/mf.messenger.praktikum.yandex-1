// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach,
} from '@jest/globals';
import nock from 'nock';
import authController from '../auth';
import { ApiBaseUrl, CONST } from '../../lib/const';
import store from '../../lib/store';
import eventBus from '../../lib/event-bus';

eventBus.on(CONST.update, jest.fn);
const userId = 777;
const login = 'login';

jest.mock('../../lib/const', () => ({
  get ApiBaseUrl() {
    return 'http://localhost/api/v2';
  },
  get CONST() {
    return {
      undefined: 'undefined',
      string: 'string',
    };
  },
}));

describe('test authController module', () => {
  beforeEach(() => {
    store.state.currentUser.login = '';
    store.state.currentUser.id = 0;
  });

  test('must be defined', () => {
    expect(authController).toBeDefined();
  });

  test('must set store variable', async () => {
    nock(ApiBaseUrl)
      .get('/auth/user')
      .reply(200, { id: userId, login });
    expect(await authController.isUserLoggedIn()).toBeFalsy();

    expect(await authController.fillUserState()).toBeTruthy();
    expect(await authController.fillUserState()).toBeTruthy();

    expect(authController.isUserLoggedIn()).toBeTruthy();
    expect(store.state.currentUser.id).toEqual(userId);
    expect(store.state.currentUser.login).toEqual(login);
  });

  test('must return false if unauthorized', async () => {
    nock(ApiBaseUrl)
      .get('/auth/user')
      .reply(401);
    expect(await authController.isUserLoggedIn()).toBeFalsy();
    expect(await authController.fillUserState()).toBeFalsy();
  });

  test('must sign in and fill user state', async () => {
    nock(ApiBaseUrl)
      .get('/auth/user')
      .reply(200, { id: userId, login });

    nock(ApiBaseUrl)
      .post('/auth/signin')
      .reply(200, { id: userId, login });

    expect(await authController.isUserLoggedIn()).toBeFalsy();
    expect(await authController.signIn({})).toBeTruthy();
    expect(authController.isUserLoggedIn()).toBeTruthy();
    expect(store.state.currentUser.id).toEqual(userId);
    expect(store.state.currentUser.login).toEqual(login);
  });

  test('must throw error if not sign In', async () => {
    nock(ApiBaseUrl)
      .post('/auth/signin')
      .reply(401);

    expect(await authController.isUserLoggedIn()).toBeFalsy();
    await expect(authController.signIn({})).rejects.toThrow(Error);
  });

  test('must clear user state', async () => {
    store.state.currentUser.id = userId;
    store.state.currentUser.login = login;
    expect(authController.isUserLoggedIn()).toBeTruthy();

    authController.clearUserState();

    expect(store.state.currentUser.id).toEqual(0);
    expect(store.state.currentUser.login).toEqual('');
    expect(authController.isUserLoggedIn()).toBeFalsy();
  });

  test('must sign Up', async () => {
    const response = { id: userId };
    nock(ApiBaseUrl)
      .post('/auth/signup')
      .reply(200, response);

    expect(await authController.signUp({})).toEqual(JSON.stringify(response));
  });

  test('must throw error if not sign Up', async () => {
    nock(ApiBaseUrl)
      .post('/auth/signup')
      .reply(400);

    await expect(authController.signUp({})).rejects.toThrow(Error);
  });

  test('must log out', async () => {
    const response = 'Ok';
    nock(ApiBaseUrl)
      .post('/auth/logout')
      .reply(200, response);

    expect(await authController.logOut()).toEqual(response);
  });
});

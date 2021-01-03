import {
  expect, describe, test, beforeAll, afterAll, jest,
} from '@jest/globals';

import Router from '../router';
import sue from '../sue';
import eventBus from '../event-bus';
import auth from '../auth';
import mocks from './mock-utils';
import { CONST } from '../const';

const root = window.document.body;
const chatPage = sue({ name: 's-shat', authorisationRequired: true });
const profilePage = sue({ name: 's-profile', authorisationRequired: true });

const loginPage = sue({ name: 's-login' });

function fakeCallback():boolean {
  return true;
}

const fillUserStateBackup = auth.fillUserState;
const createRouter = () => {
  const router = new Router(root);
  router
    .use('/#/chat', chatPage)
    .use('/#/login', loginPage)
    .use('/#/profile', profilePage)
    .start();
  return router;
};

describe('test Router class', () => {
  beforeAll(() => {
    eventBus.on(CONST.hashchange, fakeCallback);
    eventBus.on(CONST.update, fakeCallback);
    auth.fillUserState = () => Promise.resolve(true);
  });

  afterAll(() => {
    eventBus.off(CONST.hashchange, fakeCallback);
    eventBus.off(CONST.update, fakeCallback);
    auth.fillUserState = fillUserStateBackup;
  });

  test('must be defined', () => {
    expect(Router).toBeDefined();
  });

  test('an authorized user immediately gets a chat page', async () => {
    const router = new Router(root);
    auth.isUserLoggedIn = () => true;

    await router
      .use('/#/chat', chatPage)
      .use('/#/login', loginPage)
      .start();

    expect(window.document.location.hash).toEqual('#/chat');
  });

  test('Unauthorized user immediately gets a login page', async () => {
    const router = new Router(root);
    auth.isUserLoggedIn = () => false;

    await router
      .use('/#/chat', chatPage)
      .use('/#/login', loginPage)
      .start();

    expect(window.document.location.hash).toEqual('#/login');
  });

  test('Unauthorized user navigates to a secure page but receives a login page', async () => {
    const router = createRouter();
    auth.isUserLoggedIn = () => false;
    await router.go('/#/chat');
    expect(window.document.location.hash).toEqual('#/login');
  });

  test('Authorized user navigates to login page but receives a chat page', async () => {
    const router = createRouter();
    auth.isUserLoggedIn = () => true;
    await router.go('/#/login');
    expect(window.document.location.hash).toEqual('#/chat');
  });

  test('user navigates to no such page but receives a error 404 page', async () => {
    const router = createRouter();
    await router.go('/no-such-page');
    expect(window.document.location.hash).toEqual('#/404');
  });

  test('router back() and forward()', async () => {
    const router = createRouter();
    auth.isUserLoggedIn = () => true;

    router.go('/#/chat');
    router.go('/#/profile');
    expect(window.document.location.hash).toEqual('#/profile');

    router.back();
    await mocks.sleep(500);
    expect(document.location.hash).toEqual('#/chat');

    router.forward();
    await mocks.sleep(500);
    expect(document.location.hash).toEqual('#/profile');
  });
});

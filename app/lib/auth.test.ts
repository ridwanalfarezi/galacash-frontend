import { beforeEach, describe, expect, it, spyOn } from 'bun:test';

import type { User } from '~/types/domain';

import { clearAuthState, redirectIfAuthenticated, requireAuth, requireRole } from './auth';
import { queryClient } from './query-client';
import { authService } from './services/auth.service';
import { useAuthStore } from './stores/auth.store';

const student = {
  id: 'student-1',
  nim: '1313624000',
  name: 'Student',
  role: 'user',
  classId: 'class-1',
} satisfies User;

const bendahara = {
  ...student,
  id: 'bendahara-1',
  role: 'bendahara',
} satisfies User;

beforeEach(() => {
  useAuthStore.getState().logout();
  queryClient.clear();
});

describe('route authentication helpers', () => {
  it('returns the cached user without requesting the profile again', async () => {
    useAuthStore.getState().setUser(student);
    const profileSpy = spyOn(authService, 'getCurrentUser');

    expect(await requireAuth()).toEqual({ user: student });
    expect(profileSpy).not.toHaveBeenCalled();

    profileSpy.mockRestore();
  });

  it('redirects a mismatched role to its own dashboard', async () => {
    useAuthStore.getState().setUser(bendahara);

    try {
      await requireRole('user');
      throw new Error('Expected requireRole to redirect');
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      expect((error as Response).headers.get('Location')).toBe('/bendahara/dashboard');
    }
  });

  it('redirects an authenticated student away from sign-in', async () => {
    useAuthStore.getState().setUser(student);

    try {
      await redirectIfAuthenticated();
      throw new Error('Expected redirectIfAuthenticated to redirect');
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      expect((error as Response).headers.get('Location')).toBe('/user/dashboard');
    }
  });

  it('clears both auth and remote query state', () => {
    useAuthStore.getState().setUser(student);
    queryClient.setQueryData(['private'], { secret: true });

    clearAuthState();

    expect(useAuthStore.getState().user).toBeNull();
    expect(queryClient.getQueryData(['private'])).toBeUndefined();
  });
});

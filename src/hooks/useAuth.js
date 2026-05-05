import { useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  signOut,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { app, db } from '../firebase';

const auth = getAuth(app);

// Map a username to a stable fake email for Firebase Auth
const toEmail = (username) => `${username.toLowerCase().trim()}@sentinel.node`;

export function useAuth() {
  const [user, setUser]       = useState(undefined); // undefined = loading
  const [deviceId, setDeviceId] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Fetch the linked deviceId from DB whenever user changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u ?? null);
      if (u) {
        try {
          const snap = await get(ref(db, `users/${u.uid}/deviceId`));
          setDeviceId(snap.exists() ? snap.val() : null);
        } catch {
          setDeviceId(null);
        }
      } else {
        setDeviceId(null);
      }
    });
    return unsub;
  }, []);

  const login = async (username, password) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, toEmail(username), password);
    } catch (e) {
      setAuthError(friendlyError(e.code));
      return false;
    }
    return true;
  };

  const signup = async (username, password, nodeId) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, toEmail(username), password);
      await updateProfile(cred.user, { displayName: username });
      // Store the linked device ID in Realtime DB
      await set(ref(db, `users/${cred.user.uid}/deviceId`), nodeId.trim());
      setDeviceId(nodeId.trim());
      setUser({ ...cred.user, displayName: username });
    } catch (e) {
      setAuthError(friendlyError(e.code));
      return false;
    }
    return true;
  };

  const logout = () => signOut(auth);

  const changePassword = async (newPassword) => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendlyError(e.code) };
    }
  };

  const changeDeviceId = async (newDeviceId) => {
    if (!auth.currentUser) return { ok: false, error: 'Not signed in.' };
    try {
      await set(ref(db, `users/${auth.currentUser.uid}/deviceId`), newDeviceId.trim());
      setDeviceId(newDeviceId.trim());
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'Failed to update device ID.' };
    }
  };

  return { user, deviceId, authError, login, signup, logout, changePassword, changeDeviceId };
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found': 'No account found with that username.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid username or password.',
    'auth/email-already-in-use': 'An account already exists for that username.',
    'auth/invalid-email': 'Invalid username format.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}

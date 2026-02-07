import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Force refresh token to ensure latest claims
                    const tokenResult = await user.getIdTokenResult(true);
                    if (tokenResult.claims.admin) {
                        user.role = 'admin';
                    }
                } catch (error) {
                    console.error("Error fetching user claims:", error);
                }
            }
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const refreshProfile = async () => {
        if (currentUser) {
            try {
                // Force refresh token to get latest claims
                const tokenResult = await currentUser.getIdTokenResult(true);
                const updatedUser = { ...currentUser };

                if (tokenResult.claims.admin) {
                    updatedUser.role = 'admin';
                } else {
                    delete updatedUser.role;
                }
                setCurrentUser(updatedUser);
            } catch (error) {
                console.error("Error refreshing token:", error);
            }
        }
    };

    const value = {
        currentUser,
        signup,
        login,
        logout,
        refreshProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

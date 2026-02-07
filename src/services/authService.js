import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export const signup = async (email, password, name) => {
    const userCredential =
        await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        role: "user",
        totalXP: 0,
        createdAt: serverTimestamp()
    });
};

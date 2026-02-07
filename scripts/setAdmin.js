import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

// usage: node scripts/setAdmin.js <email>

const args = process.argv.slice(2);
const email = args[0];

if (!email) {
    console.error('Please provide an email address.');
    console.error('Usage: node scripts/setAdmin.js <email>');
    process.exit(1);
}

// Load service account key
// You must download this from Firebase Console -> Project Settings -> Service Accounts
// and save it as "service-account.json" in the root of your project (or scripts folder).
let serviceAccount;
try {
    serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf8'));
} catch (error) {
    console.error('Error: Could not find or read "service-account.json".');
    console.error('Please download your Service Account Key from Firebase Console and save it in the project root.');
    process.exit(1);
}

initializeApp({
    credential: cert(serviceAccount)
});

const setAdminClaim = async (email) => {
    try {
        let user;
        try {
            user = await getAuth().getUserByEmail(email);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                console.log(`User ${email} not found. Creating new admin user...`);
                user = await getAuth().createUser({
                    email: email,
                    password: 'admin123', // Default password for bootstrap
                    emailVerified: true
                });
                console.log(`Created new user: ${email} with password: admin123`);
            } else {
                throw error;
            }
        }

        await getAuth().setCustomUserClaims(user.uid, { admin: true });
        console.log(`Success! User ${email} (UID: ${user.uid}) has been granted admin privileges.`);
        console.log('Ask the user to sign out and sign back in for the change to take effect.');
    } catch (error) {
        console.error('Error setting admin claim:', error);
        process.exit(1);
    }
};

setAdminClaim(email);

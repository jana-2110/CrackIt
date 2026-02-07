import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

// usage: node scripts/removeAdmin.js <email>

const args = process.argv.slice(2);
const email = args[0];

if (!email) {
    console.error('Please provide an email address.');
    console.error('Usage: node scripts/removeAdmin.js <email>');
    process.exit(1);
}

// Load service account key
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

const removeAdminClaim = async (email) => {
    try {
        const user = await getAuth().getUserByEmail(email);
        // Set admin to null to remove the claim
        await getAuth().setCustomUserClaims(user.uid, { admin: null });
        console.log(`Success! Admin privileges have been revoked for user ${email} (UID: ${user.uid}).`);
        console.log('Ask the user to sign out and sign back in for the change to take effect.');
    } catch (error) {
        console.error('Error removing admin claim:', error);
        process.exit(1);
    }
};

removeAdminClaim(email);

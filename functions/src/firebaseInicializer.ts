import * as admin from 'firebase-admin';
admin.initializeApp();

export { admin };
export const auth = admin.auth();
export const firestore = admin.firestore();

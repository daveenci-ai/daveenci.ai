import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google'
);

export const getAuthUrl = () => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
        hd: 'daveenci.com',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google'
    });
};

export const verifyGoogleToken = async (code: string) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Verify the id_token
    const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error('Invalid token payload');
    }

    // Strictly check the domain
    // Google's payload includes 'hd' (hosted domain) for Workspace accounts
    if (payload.hd !== 'daveenci.com' && !payload.email?.endsWith('@daveenci.com')) {
        throw new Error('Access restricted to daveenci.com domain');
    }

    return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
    };
};

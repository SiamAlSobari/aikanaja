function parseCorsOrigin(value: string): string | string[] {
	if (value.includes(',')) {
		return value
			.split(',')
			.map((o) => o.trim())
			.filter(Boolean);
	}
	return value;
}

export const config = {
	port: Number(process.env.PORT) || 3000,
	nodeEnv: process.env.NODE_ENV || 'development',
	databaseUrl: process.env.DATABASE_URL || 'file:../data/dev.db',
	jwt: {
		secret: process.env.JWT_SECRET || 'super-secret-key',
		expiresIn: '7d',
	},
	cors: {
		origin: parseCorsOrigin(process.env.CORS_ORIGIN || '*'),
	},
	frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
	google: {
		clientId: process.env.GOOGLE_CLIENT_ID || '',
		clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
		redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
	},
	cloudinary: {
		cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
		apiKey: process.env.CLOUDINARY_API_KEY || '',
		apiSecret: process.env.CLOUDINARY_API_SECRET || '',
	},
	ai: {
		groqKeys: ([1, 2, 3, 4] as const)
			.map((i) => process.env[`GROQ_AI_API_KEY${i}`])
			.filter((k): k is string => Boolean(k)),
		geminiKeys: ([1, 2, 3] as const)
			.map((i) => process.env[`GEMINI_API_KEY${i}`])
			.filter((k): k is string => Boolean(k)),
	},
} as const;

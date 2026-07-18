import { t } from 'elysia'

export const RegisterBody = t.Object({
  name: t.String(),
  email: t.String(),
  password: t.String({ minLength: 6 }),
})

export const LoginBody = t.Object({
  email: t.String(),
  password: t.String(),
})
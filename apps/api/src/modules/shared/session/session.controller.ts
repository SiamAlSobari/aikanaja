import Elysia, { t } from "elysia";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { prisma } from "../../../lib/prisma";

export const sessionController = new Elysia({ prefix: '/session' })
  .use(authMiddleware())

  // Get current user session
  .get('/', async ({ user }) => {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    if (!userData) {
      return { message: 'User not found', data: null }
    }

    return { data: userData }
  })

  // Upload avatar ke Cloudinary (server-side, secret tetap di server)
  .post(
    '/upload/avatar',
    async ({ body, user, set }) => {
      if (!body.file?.startsWith('data:image')) {
        set.status = 400
        return { message: 'File tidak valid', data: null }
      }
      try {
        const form = new FormData()
        form.append('file', body.file)
        form.append('api_key', process.env.CLOUDINARY_API_KEY!)
        form.append('api_secret', process.env.CLOUDINARY_API_SECRET!)
        form.append('folder', 'schemaflow/avatars')
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: form }
        )
        const data = await res.json()
        if (!res.ok) {
          set.status = 400
          return { message: data.error?.message || 'Upload gagal', data: null }
        }
        return { data: { url: data.secure_url } }
      } catch (err) {
        console.error('[Session.uploadAvatar]', err)
        set.status = 500
        return { message: 'Upload gagal', data: null }
      }
    },
    { body: t.Object({ file: t.String() }) }
  )

  // Update profile (name, avatar, bio)
  .patch(
    '/',
    async ({ body, user, set }) => {
      const { name, avatar, bio } = body
      if (name !== undefined && !name.trim()) {
        set.status = 400
        return { message: 'Nama tidak boleh kosong', data: null }
      }
      try {
        const updated = await prisma.user.update({
          where: { id: user.id },
          data: {
            ...(name !== undefined ? { name: name.trim() } : {}),
            ...(avatar !== undefined ? { avatar } : {}),
            ...(bio !== undefined ? { bio } : {}),
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            bio: true,
            createdAt: true,
          },
        })
        return { data: updated }
      } catch (err) {
        console.error('[Session.update]', err)
        set.status = 500
        return { message: 'Gagal menyimpan', data: null }
      }
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        avatar: t.Optional(t.String()),
        bio: t.Optional(t.String()),
      }),
    }
  )

  // Delete account (self) — cascade hapus semua data user
  .delete(
    '/',
    async ({ cookie, user, set }) => {
      try {
        await prisma.user.delete({ where: { id: user.id } })
        cookie.token.value = ''
        cookie.token.httpOnly = true
        cookie.token.sameSite = 'lax'
        cookie.token.maxAge = 0
        return { message: 'Account deleted' }
      } catch (err) {
        console.error('[Session.delete]', err)
        set.status = 500
        return { message: 'Gagal menghapus akun', data: null }
      }
    }
  )

import { t } from 'i18next'

const { z } = useZod()

export const schemaSigninForm = z.object({
  email: z.string().email(),
  password: z.string().min(12),
})

export const schemaSignupForm = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(12),
  confirmPassword: z.string().min(12),
})
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: t('form.auth.errors.confirmPassword'),
      })
    }
  })

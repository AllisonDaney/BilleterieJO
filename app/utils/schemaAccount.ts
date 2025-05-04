const { z } = useZod()

export const schemaSigninForm = z.object({
  email: z.string().email(),
  password: z.string().min(12),
})
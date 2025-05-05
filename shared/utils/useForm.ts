import type { z } from 'zod'

export type SchemaSigninForm = z.infer<typeof schemaSigninForm>
export type SchemaSignupForm = z.infer<typeof schemaSignupForm>

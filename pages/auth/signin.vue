<script setup lang="ts">
definePageMeta({
  layout: 'default-blank',
})

const { errorToast, successToast } = useCustomToast()

const authStore = useAuthStore()

const formState = reactive<SchemaSigninForm>({
  email: '',
  password: '',
})
const isLoadingForm = ref(false)

async function handleSubmit() {
  try {
    if (!schemaSignupForm.safeParse(formState)) {
      return
    }

    isLoadingForm.value = true

    const v = await $fetch('/api/auth/signin', {
      method: 'POST',
      body: formState,
    })

    const authToken = useCookie('auth.token')
    authToken.value = v.token

    authStore.setUser(v.user)

    successToast('Connexion réussie.')
    navigateTo('/')
  }
  catch (e: any) {
    errorToast(e.data.message ?? 'Une erreur inattendue est survenue.')
  }
  finally {
    isLoadingForm.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 w-lg">
    <NuxtLink to="/" class="mb-10">
      <NuxtImg
        src="/img/logo.svg"
        alt="Billeterie JO"
        height="40"
        class="h-[40px] transition-all ease-in-out duration-300"
      />
    </NuxtLink>
    <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
          Connexion à votre compte
        </h1>
        <UForm class="space-y-4 md:space-y-6" :schema="schemaSigninForm" :state="formState" @submit="handleSubmit">
          <UFormField name="email" label="Email" size="xl" required>
            <UInput v-model="formState.email" class="w-full" type="email" placeholder="name@company.com" />
          </UFormField>
          <UFormField name="password" label="Mot de passe" size="xl" required>
            <UInput v-model="formState.password" class="w-full" type="password" placeholder="••••••••" />
          </UFormField>
          <div class="flex items-center justify-end">
            <NuxtLink to="/auth/forgot-password" class="text-sm font-medium text-primary-600 hover:underline">
              Mot de passe oublié ?
            </NuxtLink>
          </div>
          <UButton type="submit" block size="xl" :loading="isLoadingForm">
            Se connecter
          </UButton>
          <p class="text-sm font-light text-gray-500">
            Vous n'avez pas encore de compte ? <NuxtLink to="/auth/signup" class="font-medium text-primary-600 hover:underline">
              Créez-en un
            </NuxtLink>
          </p>
        </UForm>
      </div>
    </div>
  </div>
</template>

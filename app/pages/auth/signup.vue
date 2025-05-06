<script setup lang="ts">
definePageMeta({
  layout: 'default-blank',
})

const { errorToast, successToast } = useCustomToast()

const formState = reactive<SchemaSignupForm>({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const isLoadingForm = ref(false)

async function handleSubmit() {
  try {
    if (!schemaSignupForm.safeParse(formState)) {
      return
    }

    isLoadingForm.value = true

    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: formState,
    })

    successToast('Inscription réussie.')
    navigateTo('/auth/signin')
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
          Créer un compte
        </h1>
        <UForm
          class="space-y-4 md:space-y-6" :schema="schemaSignupForm" :state="formState" @submit="handleSubmit"
        >
          <UFormField name="firstname" label="Prénom" size="xl" required>
            <UInput v-model="formState.firstname" class="w-full" placeholder="Prénom" />
          </UFormField>
          <UFormField name="lastname" label="Nom" size="xl" required>
            <UInput v-model="formState.lastname" class="w-full" placeholder="Nom" />
          </UFormField>
          <UFormField name="email" label="Email" size="xl" required>
            <UInput v-model="formState.email" class="w-full" type="email" placeholder="name@company.com" />
          </UFormField>
          <UFormField name="password" label="Mot de passe" size="xl" required>
            <UInput v-model="formState.password" class="w-full" type="password" placeholder="••••••••" />
          </UFormField>
          <UFormField name="confirmPassword" label="Confirmation du mot de passe" size="xl" required>
            <UInput v-model="formState.confirmPassword" class="w-full" type="password" placeholder="••••••••" />
          </UFormField>
          <UButton type="submit" block size="xl" :loading="isLoadingForm">
            Créer un compte
          </UButton>
          <p class="text-sm font-light text-gray-500">
            Vous avez déjà un compte ? <NuxtLink to="/auth/signin" class="font-medium text-primary-600 hover:underline">
              Connectez-vous
            </NuxtLink>
          </p>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  links: {
    label: string
    to: string
  }[]
  logoLinkTo: string
}

withDefaults(defineProps<Props>(), {})

const appStore = useAppStore()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
</script>

<template>
  <UDrawer v-model:open="appStore.isDrawerOpen" direction="right" :handle="false" :ui="{ content: 'w-full max-w-full sm:w-auto sm:max-w-auto' }">
    <div @click="appStore.toggleDrawer(true)">
      <slot name="trigger" />
    </div>

    <template #content>
      <div class="flex flex-col w-full m-6">
        <div class="flex items-center justify-between">
          <NuxtLink :to="logoLinkTo">
            <NuxtImg
              src="/img/logo.svg"
              alt="Billetterie JO"
              height="40"
              class="h-[40px] transition-all ease-in-out duration-300"
            />
          </NuxtLink>
          <UButton
            icon="lucide-x" color="neutral" variant="ghost"
            @click="appStore.toggleDrawer(false)"
          />
        </div>
        <div class="divide-y divide-gray-500/10 h-full flex flex-col">
          <div class="flex flex-col space-y-2 py-6 my-6  ">
            <NuxtLink v-for="link in links" :key="link.to" :to="link.to" active-class="text-primary-500 font-bold" class="px-4 py-2">
              {{ link.label }}
            </NuxtLink>
          </div>
          <div v-if="authStore.isLogged && user" class="flex flex-col justify-between h-full">
            <div class="flex items-center gap-4 mb-4">
              <UAvatar
                icon="i-lucide-image" size="md" :ui="{
                  root: 'bg-neutral-200',
                }"
              />
              <p>
                {{ user.firstname }} <span class="uppercase">{{ user.lastname }}</span>
              </p>
            </div>

            <UButton block icon="lucide-log-out" @click="authStore.logout()">
              Se déconnecter
            </UButton>
          </div>
          <UButton
            v-else
            to="/auth/signin"
            size="xl"
            block
            trailing-icon="lucide-arrow-right"
          >
            Se connecter
          </UButton>
        </div>
      </div>
    </template>
  </UDrawer>
</template>

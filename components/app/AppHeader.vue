<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()

const links = ref([
  {
    label: 'Présentation',
    to: '/',
    visible: ['user', undefined].includes(authStore.user?.role.slug),
  },
  {
    label: 'Billetterie',
    to: '/tickets',
    visible: ['user', undefined].includes(authStore.user?.role.slug),
  },
  {
    label: 'Administration utilisateurs',
    to: '/admin/users',
    visible: ['admin', 'employee'].includes(authStore.user?.role.slug ?? ''),
  },
  {
    label: 'Administration employés',
    to: '/admin/employees',
    visible: ['admin'].includes(authStore.user?.role.slug ?? ''),
  },
])
const items = ref<DropdownMenuItem[]>([
  {
    label: 'Déconnexion',
    icon: 'lucide-log-out',
    onSelect: () => authStore.logout(),
  },
])

const user = computed(() => authStore.user)
const visibleLinks = computed(() => links.value.filter(link => link.visible))
const logoLinkTo = computed(() => {
  if (['admin', 'employee'].includes(authStore.user?.role.slug ?? '')) {
    return '/admin/users'
  }
  return '/'
})
</script>

<template>
  <header class="container mx-auto z-50">
    <nav class="flex items-center justify-between p-5 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <NuxtLink :to="logoLinkTo">
          <NuxtImg
            src="/img/logo.svg"
            alt="Billetterie JO"
            height="40"
            class="h-[40px] transition-all ease-in-out duration-300"
          />
        </NuxtLink>
      </div>
      <div class="flex lg:hidden">
        <AppHeaderDrawer :links="visibleLinks" :logo-link-to="logoLinkTo">
          <template #trigger>
            <UButton
              icon="lucide-menu" color="neutral" variant="ghost" size="xl"
            />
          </template>
        </AppHeaderDrawer>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <NuxtLink v-for="link in visibleLinks" :key="link.to" :to="link.to" active-class="text-primary-500 font-bold" class="text-sm/6 font-semibold">
          {{ link.label }}
        </NuxtLink>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <UDropdownMenu
          v-if="authStore.isLogged && user" :items="items"
          :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 8,
          }"
          :ui="{
            content: 'w-48',
          }"
        >
          <div class="flex items-center gap-4 cursor-pointer">
            <UAvatar
              icon="i-lucide-image" size="md" :ui="{
                root: 'bg-neutral-200',
              }"
            />
            <p>
              {{ user.firstname }} <span class="uppercase">{{ user.lastname }}</span>
            </p>
          </div>
        </UDropdownMenu>

        <UButton
          v-else
          to="/auth/signin"
          size="xl"
          variant="ghost"
          class="text-sm/6 font-semibold"
          color="neutral"
          trailing-icon="lucide-arrow-right"
        >
          Se connecter
        </UButton>
      </div>
    </nav>
  </header>
</template>

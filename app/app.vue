<script setup lang="ts">
const { afterEach } = useRouter()

afterEach(() => {
  useAppStore().toggleDrawer(false)
})
</script>

<template>
  <UApp :toaster="{ position: 'top-right' }">
    <NuxtLoadingIndicator color="var(--ui-color-primary-500)" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

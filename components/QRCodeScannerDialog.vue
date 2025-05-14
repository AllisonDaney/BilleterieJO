<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import type { BarcodeFormat, DetectedBarcode } from 'vue-qrcode-reader'
import { QrcodeStream } from 'vue-qrcode-reader'

const constraints: MediaTrackConstraints = {
  facingMode: { ideal: 'environment' },
}
const { $fetchAuth } = useApp()
const breakpoints = useBreakpoints(breakpointsTailwind)

const formats: BarcodeFormat[] = ['qr_code']

const error = ref('')
const result = reactive<{
  message: string
  description: string
  error: boolean
}>({
  message: '',
  description: '',
  error: false,
})
const isReaderActive = ref(true) 
const isLoading = ref(false)
const smallerThanSm = breakpoints.smaller('sm')

function paintOutline(detectedCodes: any, ctx: any) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'red'

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}

function onError(err: Error) {
  error.value = `[${err.name}]: `

  if (err.name === 'NotAllowedError') {
    error.value += 'you need to grant camera access permission'
  }
  else if (err.name === 'NotFoundError') {
    error.value += 'no camera on this device'
  }
  else if (err.name === 'NotSupportedError') {
    error.value += 'secure context required (HTTPS, localhost)'
  }
  else if (err.name === 'NotReadableError') {
    error.value += 'is the camera already in use?'
  }
  else if (err.name === 'OverconstrainedError') {
    error.value += 'installed cameras are not suitable'
  }
  else if (err.name === 'StreamApiNotSupportedError') {
    error.value += 'Stream API is not supported in this browser'
  }
  else if (err.name === 'InsecureContextError') {
    error.value
      += 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
  }
  else {
    error.value += err.message
  }
}

async function onDetect(detectedCodes: DetectedBarcode[]) {
  const code = detectedCodes[0]?.rawValue
  if (code) {
    isLoading.value = true

    isReaderActive.value = false

    const token = code.split('token=')[1]

    const v = await $fetchAuth(`/api/tickets/verify?token=${token}`)

    result.message = v.message
    result.description = v.description
    result.error = v.error

    isLoading.value = false
  }
}

function onCameraReady() {
  error.value = ''
}

function resetScanner() {
  result.message = ''
  result.description = ''
  result.error = false
  isReaderActive.value = true
}
</script>

<template>
  <div class="h-full flex flex-col">
    <QrcodeStream
      v-if="isReaderActive"
      :constraints="constraints"
      :track="paintOutline"
      :formats="formats"
      @error="onError"
      @detect="onDetect"
      @camera-on="onCameraReady"
    />

    <div v-else-if="isLoading" class="h-full flex items-center justify-center">
      <UIcon name="lucide:loader-circle" class="animate-spin w-12 h-12" />
    </div>

    <div v-else class="flex flex-col h-full">
      <div class="flex items-center flex-col gap-4 justify-center my-auto">
        <UIcon :name="result.error ? 'lucide:x-circle' : 'lucide:check-circle'" class="w-24 h-24 text-green-500" :class="{ '!text-red-500': result.error }" />
        <h3 class="text-3xl font-bold text-center">
          {{ result.message }}
        </h3>
        <p class="text-gray-500 text-lg text-center">
          {{ result.description }}
        </p>
      </div>
      <div class="mt-auto sm:mt-6">
        <UButton @click="resetScanner" :block="smallerThanSm">
          Scanner un autre billet
        </UButton>
      </div>
    </div>
  </div>
</template>

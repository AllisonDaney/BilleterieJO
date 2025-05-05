export function useCustomToast() {
  const toast = useToast()

  const errorToast = (message: string) => {
    toast.add({
      title: message,
      color: 'error',
      icon: 'lucide-x-circle',
    })
  }

  const successToast = (message: string) => {
    toast.add({
      title: message,
      color: 'success',
      icon: 'lucide-check-circle',
    })
  }
  return { toast, errorToast, successToast }
}

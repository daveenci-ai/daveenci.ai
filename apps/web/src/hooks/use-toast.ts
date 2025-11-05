
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToastState = {
  toasts: ToasterToast[]
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastState: ToastState = {
  toasts: [],
}

const listeners: Array<(state: ToastState) => void> = []

function addToRemoveQueue(toastId: string, duration?: number) {
  const delay = duration || TOAST_REMOVE_DELAY
  setTimeout(() => {
    toastState.toasts = toastState.toasts.filter(
      ({ id }) => id !== toastId,
    )
    listeners.forEach((listener) => {
      listener(toastState)
    })
  }, delay)
}

export function toast(props: Omit<ToasterToast, "id">) {
  const id = genId()

  const update = (props: ToasterToast) =>
    (toastState.toasts = toastState.toasts.map((t) =>
      t.id === props.id ? { ...t, ...props } : t,
    ))
  const dismiss = () => (toastState.toasts = toastState.toasts.filter((t) => t.id !== id))

  toastState.toasts = [
    { id, ...props },
    ...toastState.toasts,
  ].slice(0, TOAST_LIMIT)

  // Pass duration to addToRemoveQueue
  addToRemoveQueue(id, (props as any).duration)

  listeners.forEach((listener) => {
    listener(toastState)
  })

  console.log('🍞 Toast added to state:', { id, title: props.title, toastCount: toastState.toasts.length })

  return {
    id,
    dismiss,
    update,
  }
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(toastState)

  React.useEffect(() => {
    const listener = (newState: ToastState) => {
      setState(newState)
    }

    listeners.push(listener)

    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        toastState.toasts = toastState.toasts.filter(
          ({ id }) => id !== toastId
        )
      } else {
        toastState.toasts = []
      }

      listeners.forEach((listener) => {
        listener(toastState)
      })
    },
  }
}

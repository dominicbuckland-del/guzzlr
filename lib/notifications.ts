export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function showLocalNotification(title: string, body: string, url: string = '/') {
  if ('serviceWorker' in navigator && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body,
        icon: '/icons/icon-192.png',
        data: url,
      })
    })
  }
}

// Pre-built notification templates
export const NOTIFICATIONS = {
  fillNow: (carModel: string, savings: string) => ({
    title: 'Fill Now',
    body: `Prices at cycle low. Fill your ${carModel} to save ~$${savings}`,
  }),
  spikeIncoming: () => ({
    title: 'Spike Incoming',
    body: 'Prices predicted to jump 15-20c/L tomorrow. Fill today.',
  }),
  cheapStation: (station: string, price: string) => ({
    title: 'Price Drop',
    body: `${station} just dropped to ${price} — cheapest within 10km`,
  }),
  streakReminder: (count: number) => ({
    title: 'Keep Your Streak',
    body: `Your streak is at ${count}! Fill below average to keep it going.`,
  }),
  achievementUnlocked: (name: string) => ({
    title: 'Achievement Unlocked!',
    body: `You earned: ${name}`,
  }),
}

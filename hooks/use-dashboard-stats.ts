import useSWR from 'swr'

interface DashboardStats {
  totalBlogs: {
    value: number
    change: string
    trend: number
  }
  publishedBlogs: {
    value: number
    change: string
    trend: number
  }
  testimonials: {
    value: number
    change: string
    trend: number
  }
  users: {
    value: number
    change: string
    trend: number
  }
  recentActivity: Array<{
    type: string
    name: string
    createdAt: string
    updatedAt: string
    status: string
  }>
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    '/api/admin/dashboard/stats',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true
    }
  )

  return {
    stats: data,
    isLoading,
    isError: error,
    refresh: mutate
  }
}
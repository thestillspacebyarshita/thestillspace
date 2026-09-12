import { useData } from "@/contexts/DataContext"
import { StatCardGrid, SummaryCard } from "@/components/dashboard/StatCardGrid"
import {
  QuickActions,
  RecentSessions,
  UpcomingFollowUps,
} from "@/components/dashboard/DashboardWidgets"
import { LoadingScreen } from "@/components/LoadingScreen"
import { ErrorState } from "@/components/ErrorState"
import { formatDate } from "@/lib/format"
import { effectiveFollowUpStatus } from "@/lib/followUps"

function currentMonthPrefix(): string {
  const now = new Date()
  return now.toISOString().slice(0, 7)
}

export function DashboardPage() {
  const { clients, sessions, followUps, loading, error, reload } = useData()

  if (loading) {
    return <LoadingScreen label="Loading dashboard…" />
  }

  if (error) {
    return <ErrorState message={error} onRetry={reload} />
  }

  const activeClients = clients.filter((c) => c.status === "ACTIVE").length
  const monthPrefix = currentMonthPrefix()
  const sessionsThisMonth = sessions.filter((s) => s.date.startsWith(monthPrefix)).length
  const upcomingFollowUps = followUps.filter((f) => effectiveFollowUpStatus(f.status, f.date) === "Upcoming").length
  const totalClients = clients.length

  const latestSessions = [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your practice. Last activity{" "}
          {latestSessions.length > 0 ? (
            <>
              recorded on <span className="font-medium">{formatDate(latestSessions[0].date)}</span>
            </>
          ) : (
            "— no recorded sessions yet"
          )}
          .
        </p>
      </div>

      <StatCardGrid>
        <SummaryCard label="Active Clients" value={activeClients} detail={`${totalClients} total`} />
        <SummaryCard label="Sessions This Month" value={sessionsThisMonth} />
        <SummaryCard label="Upcoming Follow-ups" value={upcomingFollowUps} />
        <SummaryCard label="Recent Sessions" value={latestSessions.length} detail="All time" />
      </StatCardGrid>

      <QuickActions />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentSessions />
        <UpcomingFollowUps />
      </div>
    </div>
  )
}
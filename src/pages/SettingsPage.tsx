import { useAuth } from "@/auth/AuthProvider"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

const APP_VERSION = "0.1.0"

function DisabledControl({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="mt-0.5 text-sm text-slate-500">{hint}</p>
      </div>
      <Button variant="secondary" size="sm" disabled>
        Coming later
      </Button>
    </div>
  )
}

export function SettingsPage() {
  const { user, isDemo } = useAuth()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage account and application preferences</p>
      </div>

      <Card>
        <CardHeader title="Account" />
        <CardBody>
          {user ? (
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="h-12 w-12 rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold text-slate-600">
                  {(user.displayName ?? user.email ?? "?")[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user.displayName ?? "Clinician"}
                </p>
                <p className="text-sm text-slate-500">{user.email ?? "—"}</p>
                {isDemo && (
                  <p className="mt-1 text-xs text-amber-700">
                    Running on a demo account (Firebase not configured).
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No account signed in.</p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Application" />
        <CardBody>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-800">Application name</p>
              <p className="text-sm text-slate-600">Clinical Notes</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-800">Version</p>
              <p className="text-sm text-slate-600">{APP_VERSION}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-800">Data source</p>
              <p className="text-sm text-slate-600">
                {isDemo ? "Mock (in-memory)" : "Firestore"}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Data"
          description="Backup, restore, and export controls are planned for a later phase."
        />
        <CardBody className="space-y-3">
          <DisabledControl
            label="Export data"
            hint="Export all clinical records to an archive file."
          />
          <DisabledControl
            label="Backup data"
            hint="Create a full backup of the practice data."
          />
          <DisabledControl
            label="Restore data"
            hint="Restore practice data from a previous backup."
          />
          <DisabledControl
            label="Import data"
            hint="Import clinical records from an export file."
          />
        </CardBody>
      </Card>
    </div>
  )
}
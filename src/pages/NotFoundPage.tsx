import { Link } from "react-router-dom"
import { EmptyState } from "@/components/EmptyState"
import { Button } from "@/components/ui/Button"

export function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <EmptyState
          title="Page not found"
          description="The page you're looking for doesn't exist or has moved."
          action={
            <Link to="/">
              <Button>Back to Dashboard</Button>
            </Link>
          }
        />
      </div>
    </div>
  )
}
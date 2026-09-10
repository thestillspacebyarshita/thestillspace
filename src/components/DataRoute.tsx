import { Outlet } from "react-router-dom"
import { DataProvider } from "@/contexts/DataContext"

export function DataRoute() {
  return (
    <DataProvider>
      <Outlet />
    </DataProvider>
  )
}
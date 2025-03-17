"use client"

// import { Search, Filter } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Filter } from "lucide-react"

interface UserFiltersProps {
//   searchQuery: string
//   onSearchChange: (query: string) => void
  selectedRole: string
  onRoleChange: (role: string) => void
}

export function UserFilters({ selectedRole, onRoleChange }: UserFiltersProps) {
  return (
    <>
      <Tabs defaultValue={selectedRole} className="w-full" onValueChange={onRoleChange}>
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="creator">Creators</TabsTrigger>
          <TabsTrigger value="user">Regular Users</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  )
}


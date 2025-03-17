import type { User } from "./type"
import { UserCard } from "./UserCard"

interface UserListProps {
  users: User[]
  onDeleteUser: (userId: string) => void
  onUpgradeUser: (userId: string, newRole: "admin" | "creator" | "user") => void
  onViewPosts: (user: User) => void
}

export function UserList({ users, onDeleteUser, onUpgradeUser, onViewPosts }: UserListProps) {
  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onDeleteUser={onDeleteUser}
          onUpgradeUser={onUpgradeUser}
          onViewPosts={user.role === "creator" ? onViewPosts : undefined}
        />
      ))}
    </div>
  )
}


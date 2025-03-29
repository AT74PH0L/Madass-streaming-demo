"use client";

import { useState, useEffect } from "react";
import type { Movie, User, UserRes } from "./type";
import { UserFilters } from "./UserFilters";
import { UserList } from "./UserList";
import { CreatorPostsModal } from "./CreatorPostsModal";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import NotificationToast from "../ui/NotificationToast";

interface adminProp {
  adminEmail: string;
}
export default function AdminPageDetial({ adminEmail }: adminProp) {
  // const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  // const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedCreator, setSelectedCreator] = useState<User | null>(null);
  const [creatorPosts] = useState<Movie[]>([]);
  const [isPostsModalOpen, setIsPostsModalOpen] = useState(false);

  // Filter users based on search query and selected role
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");
        const result: User[] = response.data
          .filter((user: UserRes) => user.email !== adminEmail)
          .map((user: UserRes) => ({
            id: user.id,
            name: user.displayName,
            email: user.email,
            role: user.role,
            avatar: user.picture,
          }));

        const filtered =
          selectedRole !== "all"
            ? result.filter((user) => user.role === selectedRole)
            : result;

        setFilteredUsers(filtered);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [adminEmail, selectedRole]);

  // Handle user ban
  const handleDeleteUser = async (userId: string) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      toast.success("Delete user successfully");
    } catch {
      toast.error("Error");
    }
  };

  // Handle user role change
  const handleUpgradeUser = async (
    userId: string,
    newRole: "admin" | "creator" | "user"
  ) => {
    try {
      await axiosInstance.patch(`/users/${userId}`, {
        role: newRole,
      });
      toast.success("Chang role successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  // View creator posts
  const handleViewCreatorPosts = (creator: User) => {
    setSelectedCreator(creator);
    setIsPostsModalOpen(true);
  };

  return (
    <div className="ml-10 mr-10">
      <UserFilters
        // searchQuery={searchQuery}
        // onSearchChange={setSearchQuery}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />

      <Tabs defaultValue="all" className="mt-6">
        <TabsContent value="all" className="mt-6">
          <UserList
            users={filteredUsers}
            onDeleteUser={handleDeleteUser}
            onUpgradeUser={handleUpgradeUser}
            onViewPosts={handleViewCreatorPosts}
          />
        </TabsContent>

        <TabsContent value="admin" className="mt-6">
          <UserList
            users={filteredUsers.filter((user) => user.role === "admin")}
            onDeleteUser={handleDeleteUser}
            onUpgradeUser={handleUpgradeUser}
            onViewPosts={handleViewCreatorPosts}
          />
        </TabsContent>

        <TabsContent value="creator" className="mt-6">
          <UserList
            users={filteredUsers.filter((user) => user.role === "creator")}
            onDeleteUser={handleDeleteUser}
            onUpgradeUser={handleUpgradeUser}
            onViewPosts={handleViewCreatorPosts}
          />
        </TabsContent>

        <TabsContent value="user" className="mt-6">
          <UserList
            users={filteredUsers.filter((user) => user.role === "user")}
            onDeleteUser={handleDeleteUser}
            onUpgradeUser={handleUpgradeUser}
            onViewPosts={handleViewCreatorPosts}
          />
        </TabsContent>
      </Tabs>

      <CreatorPostsModal
        isOpen={isPostsModalOpen}
        onOpenChange={setIsPostsModalOpen}
        creator={selectedCreator}
        posts={creatorPosts}
      />
      <NotificationToast />
    </div>
  );
}

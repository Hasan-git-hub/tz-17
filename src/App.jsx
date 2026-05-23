import { useState } from "react";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
} from "./features/UsersSlice";

import AddModal from "./modal/AddModal";
import EditModal from "./modal/EditModal";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const getEmailDomain = (email = "") => email.split("@")[1] || "No domain";

const App = () => {
  const { data, error, isLoading, isError, isFetching } = useGetUsersQuery();

  const [addUser, { isLoading: isAddingUser }] = useAddUserMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [editUser, { isLoading: isEditingUser }] = useEditUserMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionError, setActionError] = useState("");

  const users = data ?? [];
  const totalUsers = users.length;
  const usersWithEmail = users.filter((user) => user.email?.trim()).length;
  const uniqueDomains = new Set(
    users.map((user) => getEmailDomain(user.email)).filter(Boolean),
  ).size;
  const lastUser = users[users.length - 1];
  const isMutating = isAddingUser || isDeletingUser || isEditingUser;

  const statCards = [
    {
      label: "Total users",
      value: totalUsers,
      detail: "Ro'yxatda faol yozuvlar",
      accentClassName: "bg-white",
    },
    {
      label: "Ready emails",
      value: usersWithEmail,
      detail: "Email maydoni to'lgan foydalanuvchilar",
      accentClassName: "bg-zinc-50",
    },
    {
      label: "Domains",
      value: uniqueDomains,
      detail: "Email domenlar soni",
      accentClassName: "bg-neutral-100",
    },
    {
      label: "Latest record",
      value: lastUser?.name ?? "No users",
      detail: "Oxirgi ko'rinayotgan yozuv",
      accentClassName: "bg-stone-100",
    },
  ];

  const openAddModal = () => {
    setActionError("");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (user) => {
    setActionError("");
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = async (newUser) => {
    try {
      setActionError("");
      await addUser(newUser).unwrap();
      closeAddModal();
    } catch {
      setActionError("User qo'shishda xatolik yuz berdi.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      setActionError("");
      await deleteUser(id).unwrap();
    } catch {
      setActionError("User o'chirishda xatolik yuz berdi.");
    }
  };

  const handleEditUser = async (updatedUser) => {
    if (!selectedUser?.id) {
      return;
    }

    try {
      setActionError("");
      await editUser({ id: selectedUser.id, ...updatedUser }).unwrap();
      closeEditModal();
    } catch {
      setActionError("User tahrirlashda xatolik yuz berdi.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[28px] border border-zinc-200 bg-white p-8 text-center shadow-[0_18px_45px_rgba(24,24,27,0.08)]">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-zinc-900" />
          <h1 className="text-2xl font-black text-zinc-950">
            Loading users...
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Ma'lumotlar olinmoqda, bir oz kuting.
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[28px] border border-zinc-200 bg-white p-8 text-center shadow-[0_18px_45px_rgba(24,24,27,0.08)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-2xl text-white">
            !
          </div>
          <h1 className="text-2xl font-black text-zinc-950">Server error</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Xatolik: {error?.status || "so'rov bajarilmadi"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden body">
      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-6">
          
          <button
            onClick={openAddModal}
            className="inline-flex h-12 items-center justify-center rounded-2xl border-0 bg-orange-500 px-6 font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isMutating}
          >
            {isAddingUser ? "Adding..." : "Add New User"}
          </button>

          {isFetching && (
            <p className="text-sm font-medium text-zinc-500">
              Ma'lumotlar yangilanmoqda...
            </p>
          )}
        </section>

        {actionError && (
          <div className="rounded-[24px] border border-red-200 bg-red-50/90 px-5 py-4 text-sm font-medium text-red-600 shadow-sm">
            {actionError}
          </div>
        )}

        {users.length === 0 ? (
          <div className="mt-6 rounded-[28px] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center"></div>
        ) : (
          <ul className="mt-6 grid gap-4 lg:grid-cols-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="group flex h-full flex-col justify-between rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(24,24,27,0.10)]"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-lg font-bold text-white">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-zinc-950">
                        {user.name}
                      </h2>
                      <p className="text-sm text-zinc-500">
                        {getEmailDomain(user.email)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                        Name
                      </p>
                      <p className="mt-2 break-all text-sm font-medium text-zinc-700">
                        {user.name}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                        UserName
                      </p>
                      <p className="mt-2 break-all text-sm font-medium text-zinc-700">
                        {user.username}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                        Email
                      </p>
                      <p className="mt-2 break-all text-sm font-medium text-zinc-700">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-row-reverse items-center justify-center gap-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="h-11 w-full rounded-2xl border-0 bg-red-500 font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isMutating}
                  >
                    {isDeletingUser ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    className="h-11 w-full rounded-2xl border-0 bg-green-500 font-semibold text-white shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => openEditModal(user)}
                    disabled={isMutating}
                  >
                    {isEditingUser && selectedUser?.id === user.id
                      ? "Saving..."
                      : "Edit"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {isAddModalOpen && (
        <AddModal
          onAdd={handleAddUser}
          onClose={closeAddModal}
          isSubmitting={isAddingUser}
        />
      )}

      {isEditModalOpen && selectedUser && (
        <EditModal
          user={selectedUser}
          onEdit={handleEditUser}
          onClose={closeEditModal}
          isSubmitting={isEditingUser}
        />
      )}
    </div>
  );
};

export default App;

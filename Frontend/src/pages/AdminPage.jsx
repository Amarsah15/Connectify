import React, { useEffect, useState } from "react";
import { Shield, Ban, Trash2 } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuthStore } from "../store/authStore";
import { useModerationStore } from "../store/moderationStore";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { ConfirmModal } from "../components/ui/Modal";

const ROLE_LEVELS = {
  user: 1,
  moderator: 2,
  admin: 3,
};

const AdminPage = () => {
  const { authUser } = useAuthStore();
  const {
    users,
    isFetchingUsers,
    isUpdatingUser,
    getUsers,
    updateUserRole,
    toggleUserBan,
    deleteUser,
  } = useModerationStore();

  const [modalState, setModalState] = useState({ type: null, user: null });
  const [isActioning, setIsActioning] = useState(false);

  // Client-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(users.length / pageSize) || 1;

  // Safeguard page bounds when users are deleted/filtered
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [users.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

  const isAdmin = authUser?.role === "admin";
  const canOpenPanel = ["moderator", "admin"].includes(authUser?.role);

  useEffect(() => {
    if (canOpenPanel) {
      getUsers();
    }
  }, [canOpenPanel, getUsers]);

  if (!canOpenPanel) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-[var(--text-muted)]">
          You do not have access to this page.
        </p>
      </div>
    );
  }

  if (isFetchingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const canManageUser = (user) =>
    authUser?._id !== user._id &&
    ROLE_LEVELS[authUser?.role] > ROLE_LEVELS[user.role];

  const openModal = (type, user) => setModalState({ type, user });
  const closeModal = () => setModalState({ type: null, user: null });

  const handleBan = async () => {
    setIsActioning(true);
    try {
      await toggleUserBan(modalState.user._id);
    } finally {
      setIsActioning(false);
      closeModal();
    }
  };

  const handleDelete = async () => {
    setIsActioning(true);
    try {
      await deleteUser(modalState.user._id);
    } finally {
      setIsActioning(false);
      closeModal();
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center">
          <Shield className="text-brand-600 dark:text-brand-400" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Moderation
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Manage user access and community safety.
          </p>
        </div>
      </div>

      <Card padding="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-[var(--text-faint)] tracking-wider">
                  User
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-[var(--text-faint)] tracking-wider">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-[var(--text-faint)] tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-[var(--text-faint)] tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {paginatedUsers.map((user) => {
                const manageable = canManageUser(user);

                return (
                  <tr key={user._id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.profilePicture}
                          name={user.name}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-[var(--text)]">
                            {user.name}
                          </p>
                          <p className="text-sm text-[var(--text-muted)]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {isAdmin && manageable ? (
                        <select
                          value={user.role}
                          disabled={isUpdatingUser}
                          onChange={(e) =>
                            updateUserRole(user._id, e.target.value)
                          }
                          className="px-2 py-1.5 rounded-lg bg-[var(--surface-3)] border border-[var(--border)]
                            text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500
                            cursor-pointer max-w-[140px]"
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <Badge
                          color={
                            user.role === "admin"
                              ? "red"
                              : user.role === "moderator"
                              ? "yellow"
                              : "gray"
                          }
                        >
                          {user.role}
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        color={user.isBanned ? "red" : "green"}
                        dot
                      >
                        {user.isBanned ? "Banned" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        {manageable && (
                          <button
                            onClick={() => openModal("ban", user)}
                            disabled={isUpdatingUser}
                            className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--danger)]
                              hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer
                              disabled:opacity-50 disabled:cursor-not-allowed"
                            title={user.isBanned ? "Unban user" : "Ban user"}
                          >
                            <Ban size={16} />
                          </button>
                        )}
                        {isAdmin && manageable && (
                          <button
                            onClick={() => openModal("delete", user)}
                            disabled={isUpdatingUser}
                            className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--danger)]
                              hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer
                              disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination controls footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-4 bg-[var(--surface-2)]">
            <div className="text-sm text-[var(--text-muted)]">
              Showing <span className="font-semibold text-[var(--text)]">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-[var(--text)]">
                {Math.min(startIndex + pageSize, users.length)}
              </span>{" "}
              of <span className="font-semibold text-[var(--text)]">{users.length}</span> users
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Ban Modal */}
      <ConfirmModal
        isOpen={modalState.type === "ban"}
        onClose={closeModal}
        onConfirm={handleBan}
        title={modalState.user?.isBanned ? "Unban user" : "Ban user"}
        message={
          modalState.user?.isBanned
            ? `Are you sure you want to unban ${modalState.user?.name}?`
            : `Are you sure you want to ban ${modalState.user?.name}? They will not be able to access their account.`
        }
        confirmText={modalState.user?.isBanned ? "Unban" : "Ban user"}
        loading={isActioning}
      />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={modalState.type === "delete"}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Delete user"
        message={`Delete ${modalState.user?.name}? This also removes their posts and follow links. This action cannot be undone.`}
        confirmText="Delete user"
        loading={isActioning}
      />
    </main>
  );
};

export default AdminPage;

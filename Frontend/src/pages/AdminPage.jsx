import React, { useEffect } from "react";
import { Shield, Ban, Trash2 } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuthStore } from "../store/authStore";
import { useModerationStore } from "../store/moderationStore";

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

  const isAdmin = authUser?.role === "admin";
  const canOpenPanel = ["moderator", "admin"].includes(authUser?.role);

  useEffect(() => {
    if (canOpenPanel) {
      getUsers();
    }
  }, [canOpenPanel, getUsers]);

  if (!canOpenPanel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-gray-600">You do not have access to this page.</p>
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

  const handleBan = async (user) => {
    const action = user.isBanned ? "unban" : "ban";
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      return;
    }

    await toggleUserBan(user._id);
  };

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Delete ${user.name}? This also removes their posts and follow links.`
      )
    ) {
      return;
    }

    await deleteUser(user._id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-linkedin-blue" size={28} />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Moderation
            </h1>
            <p className="text-sm text-gray-600">
              Manage user access and community safety.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const manageable = canManageUser(user);

                return (
                  <tr key={user._id} className="align-middle">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.profilePicture ||
                            `https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`
                          }
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {isAdmin && manageable ? (
                        <select
                          value={user.role}
                          disabled={isUpdatingUser}
                          onChange={(event) =>
                            updateUserRole(user._id, event.target.value)
                          }
                          className="input-field max-w-40"
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className="capitalize text-gray-700">
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.isBanned
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        {manageable && (
                          <button
                            onClick={() => handleBan(user)}
                            disabled={isUpdatingUser}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                            title={user.isBanned ? "Unban user" : "Ban user"}
                          >
                            <Ban size={18} />
                          </button>
                        )}
                        {isAdmin && manageable && (
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={isUpdatingUser}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Delete user"
                          >
                            <Trash2 size={18} />
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
      </div>
    </div>
  );
};

export default AdminPage;

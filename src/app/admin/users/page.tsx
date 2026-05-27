import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminListPage } from "@/components/admin/templates/AdminListPage";
import DeleteUserButton from "@/components/admin/DeleteUserButton";
import { ColumnDef } from "@/components/admin/templates/AdminListPage";

async function getUsers(searchQuery?: string) {
  try {
    const where = searchQuery
      ? {
          username: { contains: searchQuery, mode: "insensitive" as const },
        }
      : undefined;

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.search || "";
  const users = await getUsers(searchQuery);

  const columns: ColumnDef<any>[] = [
    {
      key: "username",
      label: "Username",
      width: "flex-1",
    },
    {
      key: "createdAt",
      label: "Created",
      width: "w-32",
      render: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <AdminListPage
      title="Users"
      items={users}
      columns={columns}
      newUrl="/admin/users/new"
      newLabel="+ New User"
      searchPlaceholder="Search by username..."
      emptyStateMessage="No users found"
      renderActions={(user) => (
        <>
          <Link
            href={`/admin/users/${user.id}/edit`}
            className="text-nts-green hover:text-green-400 text-xs font-mono transition-colors"
          >
            Edit
          </Link>
          <DeleteUserButton userId={user.id} />
        </>
      )}
    />
  );
}

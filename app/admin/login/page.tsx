import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center p-6">
      <AdminLoginForm nextPath={next || "/admin"} />
    </main>
  );
}

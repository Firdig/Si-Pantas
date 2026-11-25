import type { ReactNode } from "react";
import { RoleHeader } from "@/components/layout/role-header";

/**
 * Kerangka area operator. Sidebar dan topbar lengkap menyusul sesuai desain;
 * sementara ini cukup header ringkas agar halaman tidak tampil polos.
 */
export default function OperatorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <RoleHeader label="Area Operator" />
      <main className="flex-1">{children}</main>
    </div>
  );
}

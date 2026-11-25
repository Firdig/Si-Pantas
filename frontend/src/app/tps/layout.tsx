import type { ReactNode } from "react";
import { RoleHeader } from "@/components/layout/role-header";

/**
 * Kerangka halaman TPS. TPS tidak login: aksesnya memakai token rahasia pada
 * tautan yang dikirim pengurus RW lewat WhatsApp.
 */
export default function TpsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <RoleHeader label="Tugas TPS" />
      <main className="flex-1">{children}</main>
    </div>
  );
}

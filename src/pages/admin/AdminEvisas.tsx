import { Globe } from "lucide-react";

const AdminEvisas = () => {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Globe size={22} /> eVisas / ESTA
      </h1>
      <div className="bg-[hsl(220,20%,12%)] border border-[hsl(220,20%,18%)] rounded-xl p-8 text-center">
        <Globe size={48} className="mx-auto mb-4 text-[hsl(220,10%,30%)]" />
        <h2 className="text-lg font-semibold text-[hsl(220,10%,70%)] mb-2">Coming Soon</h2>
        <p className="text-sm text-[hsl(220,10%,45%)] max-w-md mx-auto">
          eVisa and ESTA application management will be available here once the product is launched.
          This section will include application tracking, status workflows, and document management.
        </p>
      </div>
    </div>
  );
};

export default AdminEvisas;

"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";

const Ribbons = dynamic(() => import("@/components/ui/Ribbons"), {
  ssr: false,
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminDashboard = pathname?.startsWith("/admin") && pathname !== "/admin/login";

    return (
        <>
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Ribbons
                  colors={['#00cc68', '#7662fc', '#01f77e', '#5227FF', '#00ff82']}
                  baseSpring={0.02}
                  baseFriction={0.9}
                  baseThickness={25}
                  offsetFactor={0.06}
                  maxAge={600}
                  pointCount={60}
                  speedMultiplier={0.5}
                  enableFade={true}
                  enableShaderEffect={true}
                  effectAmplitude={1.5}
                  backgroundColor={[0, 0, 0, 0]} /* Transparent bg to let globals.css color show through */
                />
            </div>
            <div className="relative z-10 min-h-screen flex flex-col">
                {!isAdminDashboard && <Navbar />}
                {children}
            </div>
        </>
    );
}

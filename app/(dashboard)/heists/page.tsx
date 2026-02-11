"use client";

import { useHeists } from "@/lib/hooks";
import { Heist } from "@/types/firestore";
import HeistCard from "@/components/HeistCard";
import HeistCardSkeleton from "@/components/HeistCardSkeleton";

function HeistSection({
  title,
  heists,
  loading,
  sectionType,
}: {
  title: string;
  heists: Heist[];
  loading: boolean;
  sectionType: "active" | "assigned" | "expired";
}) {
  return (
    <div>
      <h2>{title}</h2>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <HeistCardSkeleton />
          <HeistCardSkeleton />
          <HeistCardSkeleton />
        </div>
      ) : heists.length === 0 ? (
        <p>No available heists.</p>
      ) : sectionType !== "expired" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {heists.map((heist) => (
            <HeistCard key={heist.id} heist={heist} variant={sectionType} />
          ))}
        </div>
      ) : (
        <ul>
          {heists.map((heist) => (
            <li key={heist.id}>{heist.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function HeistsPage() {
  const { heists: activeHeists, loading: activeLoading } = useHeists("active");
  const { heists: assignedHeists, loading: assignedLoading } = useHeists("assigned");
  const { heists: expiredHeists, loading: expiredLoading } = useHeists("expired");

  return (
    <div className="page-content">
      <div className="active-heists">
        <HeistSection title="Your Active Heists" heists={activeHeists} loading={activeLoading} sectionType="active" />
      </div>
      <div className="assigned-heists">
        <HeistSection title="Heists You've Assigned" heists={assignedHeists} loading={assignedLoading} sectionType="assigned" />
      </div>
      <div className="expired-heists">
        <HeistSection title="All Expired Heists" heists={expiredHeists} loading={expiredLoading} sectionType="expired" />
      </div>
    </div>
  );
}

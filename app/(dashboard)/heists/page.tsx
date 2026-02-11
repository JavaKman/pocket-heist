"use client";

import { useHeists } from "@/lib/hooks";
import Skeleton from "@/components/Skeleton";
import { Heist } from "@/types/firestore";

function HeistSection({
  title,
  heists,
  loading,
}: {
  title: string;
  heists: Heist[];
  loading: boolean;
}) {
  return (
    <div>
      <h2>{title}</h2>
      {loading ? (
        <div>
          <Skeleton variant="rectangular" height="60px" />
          <Skeleton variant="rectangular" height="60px" />
          <Skeleton variant="rectangular" height="60px" />
        </div>
      ) : heists.length === 0 ? (
        <p>No available heists.</p>
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
  const { heists: assignedHeists, loading: assignedLoading } =
    useHeists("assigned");
  const { heists: expiredHeists, loading: expiredLoading } =
    useHeists("expired");

  return (
    <div className="page-content">
      <div className="active-heists">
        <HeistSection
          title="Your Active Heists"
          heists={activeHeists}
          loading={activeLoading}
        />
      </div>
      <div className="assigned-heists">
        <HeistSection
          title="Heists You've Assigned"
          heists={assignedHeists}
          loading={assignedLoading}
        />
      </div>
      <div className="expired-heists">
        <HeistSection
          title="All Expired Heists"
          heists={expiredHeists}
          loading={expiredLoading}
        />
      </div>
    </div>
  );
}
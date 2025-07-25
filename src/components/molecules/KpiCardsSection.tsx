import React from "react";
import KpiCard from "@/components/atoms/KpiCard";
import { DashboardAnalyticsData } from "@/interfaces/dashboard";

interface KpiCardsSectionProps {
  kpiData: DashboardAnalyticsData["kpiData"];
  className?: string;
}

/**
 * KpiCardsSection Component
 * Displays a grid of KPI cards for the dashboard
 */
const KpiCardsSection: React.FC<KpiCardsSectionProps> = ({
  kpiData,
  className = "",
}) => {
  return (
    <section
      className={`w-full ${className}`}
      data-tour-id="dashboard-kpi-cards"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard {...kpiData.totalUrls} color="blue" />
        <KpiCard {...kpiData.totalClicks} color="green" />
        <KpiCard {...kpiData.averageCtr} color="purple" />
        <KpiCard {...kpiData.topPerformer} color="orange" />
      </div>
    </section>
  );
};

export default KpiCardsSection;

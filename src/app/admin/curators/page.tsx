"use client";
import CuratorsList from "@/components/curators/CuratorsList";
import { useCuratorController } from "@/components/entity/controllers/curator.controller";
import { Curator } from "@/components/entity/types/curator.interface";
import React from "react";

export default function Page() {
  const { curators, isCuratorsLoading } = useCuratorController();
  return (
    <div className="w-full">
      <CuratorsList isLoading={isCuratorsLoading} data={curators as Curator[]} />
    </div>
  );
}

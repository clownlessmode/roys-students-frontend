"use client";
import { useGroupController } from "@/components/entity/controllers/group.controller";
import { Group } from "@/components/entity/types/group.interface";
import GroupsList from "@/components/groups/GroupsList";
import React from "react";

export default function Page() {
  const { groups, isGroupsLoading } = useGroupController();
  return (
    <div className="w-full">
      <GroupsList isLoading={isGroupsLoading} data={groups as Group[]} />
    </div>
  );
}

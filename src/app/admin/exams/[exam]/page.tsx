"use client";

import MarkList from "@/components/mark/MarkList";
import { useMarkController } from "@/components/entity/controllers/mark.controller";
import { useParams } from "next/navigation";

const Page = (): JSX.Element => {
  const params = useParams();
  const { useGetMarksByExamId } = useMarkController();
  const { data: marks, isLoading } = useGetMarksByExamId(params.exam as string);

  return (
    <div className="w-full">
      <MarkList data={marks} isLoading={isLoading} />
    </div>
  );
};

export default Page;

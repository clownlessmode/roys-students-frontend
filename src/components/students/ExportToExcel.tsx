import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

interface ExportToExcelProps {
  data: unknown[];
  fileName: string;
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ data, fileName }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Генерация Excel файла
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Button variant={"outline"} onClick={exportToExcel}>
      Экспорт в Excel
    </Button>
  );
};

export default ExportToExcel;

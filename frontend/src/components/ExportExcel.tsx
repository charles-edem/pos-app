import * as XLSX from "xlsx";
import { CloudDownload } from "lucide-react";

interface ExportExcelProps {
    data: Record<string, unknown>[];
    fileName: string;
    sheetName?: string;
    disabled?: boolean;
}

export default function ExportExcel({
    data,
    fileName,
    sheetName = "Report",
    disabled = false,
}: ExportExcelProps) {
    function handleExport() {
        if (data.length === 0) {
            alert("There is no data to export.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            sheetName
        );

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }

    return (
        <button
            type="button"
            onClick={handleExport}
            disabled={disabled || data.length === 0}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <CloudDownload className="h-4 w-4" />
            Export
        </button>
    );
}

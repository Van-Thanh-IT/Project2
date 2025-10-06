
import { saveAs } from "file-saver";
import Papa from "papaparse";

const ExportCSV = (data, fileName = "export.csv") => {
  if (!data || data.length === 0) return;

  const csv = Papa.unparse(data); // chuyển JSON thành CSV
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, fileName);
};
export default ExportCSV;

// utils/pdf-worker.js
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";

GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.js";

export default GlobalWorkerOptions.workerSrc; // ✅ Add this export

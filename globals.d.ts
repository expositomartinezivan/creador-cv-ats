
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

declare global {
  interface Window {
    jspdf: {
        jsPDF: typeof jsPDF;
    };
    html2canvas: typeof html2canvas;
  }
}

// This empty export is needed to make the file a module.
export {};

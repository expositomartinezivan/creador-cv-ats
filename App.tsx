
import React, { useState, useRef, useEffect } from 'react';
import { ResumeData } from './types';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Header from './components/Header';

const initialData: ResumeData = {
  personalInfo: {
    name: 'Ana García',
    title: 'Desarrolladora de Software Junior',
    phone: '+34 612 345 678',
    email: 'ana.garcia@email.com',
    linkedin: 'linkedin.com/in/anagarcia-dev',
    location: 'Valencia, España',
  },
  summary: 'Recién graduada en Ingeniería Informática con una gran pasión por el desarrollo de aplicaciones web y la resolución de problemas complejos. Busco una oportunidad para aplicar mis conocimientos en React y Node.js, y contribuir al éxito de un equipo dinámico.',
  experience: [
    {
      id: 1,
      title: 'Desarrolladora en Prácticas',
      company: 'Innovatec Solutions',
      period: 'Jun 2023 - Sep 2023',
      description: 'Colaboré en el desarrollo de un panel de administración para un cliente del sector logístico. Implementé componentes de UI con React y participé en la corrección de más de 50 bugs. Me familiaricé con metodologías ágiles como Scrum.'
    }
  ],
  education: [
    {
      id: 1,
      degree: 'Grado en Ingeniería Informática',
      institution: 'Universitat Politècnica de València (UPV)',
      period: 'Sep 2019 - Jun 2023',
      description: 'Especialización en Ingeniería de Software. Proyecto de Fin de Grado sobre una aplicación de gestión de tareas con una calificación de 9.5/10.'
    }
  ],
  skills: 'JavaScript (ES6+), React, HTML5, CSS3, Node.js, Express, Git, Scrum, Inglés (Nivel C1)'
};

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScriptsAvailability = () => {
      if (window.jspdf && window.html2canvas) {
        setScriptsLoaded(true);
        clearInterval(scriptCheckInterval);
      }
    };
    const scriptCheckInterval = setInterval(checkScriptsAvailability, 100);
    return () => clearInterval(scriptCheckInterval);
  }, []);

  const downloadPDF = () => {
    if (!scriptsLoaded || !previewRef.current) {
      console.error("Attempted to download PDF before scripts were loaded or preview is not available.");
      return;
    }
    
    setIsGeneratingPdf(true);
    const input = previewRef.current;

    const html2canvas = window.html2canvas;
    const jsPDF = window.jspdf?.jsPDF;

    if (!html2canvas || !jsPDF) {
      console.error("Error: html2canvas or jspdf library not found.");
      setIsGeneratingPdf(false);
      return;
    }

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
      windowHeight: input.scrollHeight
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(`CV_${resumeData.personalInfo.name.replace(/ /g, '_')}_ATS.pdf`);
      setIsGeneratingPdf(false);
    }).catch(err => {
      console.error("Error during PDF generation:", err);
      setIsGeneratingPdf(false);
    });
  };

  return (
    <div className="min-h-screen font-sans">
      <Header 
        onDownload={downloadPDF}
        isGenerating={isGeneratingPdf}
        scriptsLoaded={scriptsLoaded}
      />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Editor data={resumeData} setData={setResumeData} />
          <Preview data={resumeData} previewRef={previewRef} />
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500">
        <p>Diseñado con ❤️ para superar los filtros ATS. © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;

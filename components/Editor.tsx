import React, { useState } from 'react';
import { User, FileText, Briefcase, GraduationCap, Sparkles, PlusCircle, Trash2, ChevronDown, Mail, Phone, Linkedin, MapPin } from 'lucide-react';
import { ResumeData } from '../types';
import AtsTooltip from './AtsTooltip';
import AiSuggestionButton from './AiSuggestionButton';

// Reusable Accordion Section Component
const AccordionSection = ({ title, icon, sectionKey, openSection, setOpenSection, children }: { title: string, icon: React.ReactNode, sectionKey: string, openSection: string | null, setOpenSection: React.Dispatch<React.SetStateAction<string | null>>, children: React.ReactNode}) => {
  const isOpen = openSection === sectionKey;
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 bg-white shadow-sm">
      <button
        onClick={() => setOpenSection(isOpen ? null : sectionKey)}
        className="w-full flex justify-between items-center p-4 hover:bg-gray-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-expanded={isOpen}
        aria-controls={`section-content-${sectionKey}`}
      >
        <span className="flex items-center text-lg font-semibold text-gray-800">{icon}{title}</span>
        <ChevronDown className={`h-6 w-6 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div id={`section-content-${sectionKey}`} className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
           <div className="p-6 border-t border-gray-200">
             {children}
           </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Field with Icon
const InputField = ({ icon, ...props }: {icon: React.ReactNode, [key: string]: any}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input {...props} className="p-2 pl-10 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
  </div>
);

interface EditorProps {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const Editor: React.FC<EditorProps> = ({ data, setData }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('personalInfo');

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const handleSectionChange = (section: 'summary' | 'skills', value: string) => {
    setData(prev => ({ ...prev, [section]: value }));
  };

  const handleNestedChange = (section: 'experience' | 'education', id: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [section]: prev[section].map((item: any) =>
        item.id === id ? { ...item, [name]: value } : item
      )
    }));
  };

  const addItem = (section: 'experience' | 'education') => {
    const newId = Date.now();
    const newItem = section === 'experience'
      ? { id: newId, title: '', company: '', period: '', description: '' }
      : { id: newId, degree: '', institution: '', period: '', description: '' };
    setData(prev => ({ ...prev, [section]: [...prev[section], newItem as any] }));
  };

  const deleteItem = (section: 'experience' | 'education', id: number) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].filter((item: any) => item.id !== id)
    }));
  };
  
  const handleAiSuggestion = (section: 'summary' | `experience-${number}`, suggestion: string) => {
    if (section === 'summary') {
      setData(prev => ({ ...prev, summary: suggestion }));
    } else if (section.startsWith('experience-')) {
      const id = parseInt(section.split('-')[1]);
      setData(prev => ({
        ...prev,
        experience: prev.experience.map(exp => exp.id === id ? { ...exp, description: suggestion } : exp)
      }));
    }
  };

  return (
    <div className="space-y-4">
      
      <AccordionSection title="Información Personal" icon={<User className="mr-3 text-blue-500" />} sectionKey="personalInfo" openSection={openSection} setOpenSection={setOpenSection}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField icon={<User size={16} className="text-gray-400" />} type="text" name="name" value={data.personalInfo.name} onChange={handlePersonalInfoChange} placeholder="Nombre Completo" />
          <InputField icon={<Briefcase size={16} className="text-gray-400" />} type="text" name="title" value={data.personalInfo.title} onChange={handlePersonalInfoChange} placeholder="Tu titular profesional" />
          <InputField icon={<Phone size={16} className="text-gray-400" />} type="tel" name="phone" value={data.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="Teléfono" />
          <InputField icon={<Mail size={16} className="text-gray-400" />} type="email" name="email" value={data.personalInfo.email} onChange={handlePersonalInfoChange} placeholder="Email" />
          <InputField icon={<Linkedin size={16} className="text-gray-400" />} type="text" name="linkedin" value={data.personalInfo.linkedin} onChange={handlePersonalInfoChange} placeholder="URL perfil de LinkedIn" />
          <InputField icon={<MapPin size={16} className="text-gray-400" />} type="text" name="location" value={data.personalInfo.location} onChange={handlePersonalInfoChange} placeholder="Ciudad, País" />
        </div>
      </AccordionSection>

      <AccordionSection title="Resumen Profesional" icon={<FileText className="mr-3 text-blue-500" />} sectionKey="summary" openSection={openSection} setOpenSection={setOpenSection}>
         <div className="flex items-start gap-2">
            <div className="relative w-full">
              <textarea name="summary" value={data.summary} onChange={(e) => handleSectionChange('summary', e.target.value)} placeholder="Un párrafo breve y potente sobre ti." rows={5} className="p-2 pr-10 border border-gray-300 rounded-md w-full flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
              <AiSuggestionButton
                baseText={data.summary}
                promptType="summary"
                onSuggestion={(suggestion) => handleAiSuggestion('summary', suggestion)}
                onLoadingChange={setIsAiLoading}
              />
            </div>
            <AtsTooltip text="Escribe 2-3 frases que resuman tu perfil y objetivo. Usa palabras clave de la oferta de empleo a la que aplicas." />
        </div>
      </AccordionSection>

      <AccordionSection title="Experiencia Laboral" icon={<Briefcase className="mr-3 text-blue-500" />} sectionKey="experience" openSection={openSection} setOpenSection={setOpenSection}>
        <div className="space-y-4">
        {data.experience.map((exp, index) => (
          <div key={exp.id} className="bg-gray-50/80 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-700">Puesto #{index + 1}</p>
              <button onClick={() => deleteItem('experience', exp.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"><Trash2 size={18} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
              <input type="text" name="title" value={exp.title} onChange={(e) => handleNestedChange('experience', exp.id, e)} placeholder="Cargo" className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input type="text" name="company" value={exp.company} onChange={(e) => handleNestedChange('experience', exp.id, e)} placeholder="Empresa" className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <input type="text" name="period" value={exp.period} onChange={(e) => handleNestedChange('experience', exp.id, e)} placeholder="Periodo (Ej: Ene 2020 - Presente)" className="p-2 border border-gray-300 rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <div className="flex items-start gap-2">
              <div className="relative w-full">
                <textarea name="description" value={exp.description} onChange={(e) => handleNestedChange('experience', exp.id, e)} placeholder="Describe tus logros y responsabilidades." rows={4} className="p-2 pr-10 border border-gray-300 rounded-md w-full flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                <AiSuggestionButton
                    baseText={exp.description}
                    promptType="experience"
                    onSuggestion={(suggestion) => handleAiSuggestion(`experience-${exp.id}`, suggestion)}
                    onLoadingChange={setIsAiLoading}
                  />
              </div>
              <AtsTooltip text="Cuantifica tus logros (ej: 'aumenté las ventas un 15%'). Usa viñetas o frases cortas." />
            </div>
          </div>
        ))}
        </div>
        <button onClick={() => addItem('experience')} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 mt-4 transition-colors">
          <PlusCircle size={20} className="mr-2" />Añadir Experiencia
        </button>
      </AccordionSection>

      <AccordionSection title="Educación" icon={<GraduationCap className="mr-3 text-blue-500" />} sectionKey="education" openSection={openSection} setOpenSection={setOpenSection}>
        <div className="space-y-4">
        {data.education.map((edu, index) => (
          <div key={edu.id} className="bg-gray-50/80 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-700">Formación #{index + 1}</p>
              <button onClick={() => deleteItem('education', edu.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"><Trash2 size={18} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
              <input type="text" name="degree" value={edu.degree} onChange={(e) => handleNestedChange('education', edu.id, e)} placeholder="Título o Grado" className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input type="text" name="institution" value={edu.institution} onChange={(e) => handleNestedChange('education', edu.id, e)} placeholder="Institución Educativa" className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <input type="text" name="period" value={edu.period} onChange={(e) => handleNestedChange('education', edu.id, e)} placeholder="Periodo (Ej: 2018 - 2022)" className="p-2 border border-gray-300 rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <textarea name="description" value={edu.description} onChange={(e) => handleNestedChange('education', edu.id, e)} placeholder="Menciones, proyectos destacados, etc." rows={2} className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
          </div>
        ))}
        </div>
        <button onClick={() => addItem('education')} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 mt-4 transition-colors">
          <PlusCircle size={20} className="mr-2" />Añadir Formación
        </button>
      </AccordionSection>
      
      <AccordionSection title="Habilidades" icon={<Sparkles className="mr-3 text-blue-500" />} sectionKey="skills" openSection={openSection} setOpenSection={setOpenSection}>
        <div className="flex items-start gap-2">
          <textarea name="skills" value={data.skills} onChange={(e) => handleSectionChange('skills', e.target.value)} placeholder="Enumera tus habilidades separadas por comas. Ej: React, Liderazgo, Inglés..." rows={3} className="p-2 border border-gray-300 rounded-md w-full flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
          <AtsTooltip text="Incluye tanto habilidades técnicas (Software, Idiomas) como blandas (Comunicación, Liderazgo)." />
        </div>
      </AccordionSection>
    </div>
  );
};

export default Editor;

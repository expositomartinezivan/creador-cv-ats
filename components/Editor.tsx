
import React, { useState } from 'react';
import { User, FileText, Briefcase, GraduationCap, Sparkles, PlusCircle, Trash2 } from 'lucide-react';
import { ResumeData, Experience, Education } from '../types';
import AtsTooltip from './AtsTooltip';
import AiSuggestionButton from './AiSuggestionButton';

interface EditorProps {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const Editor: React.FC<EditorProps> = ({ data, setData }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);

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
    setData(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const deleteItem = (section: 'experience' | 'education', id: number) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].filter((item: any) => item.id !== id)
    }));
  };
  
  const handleAiSuggestion = (section: 'summary' | `experience-${number}` | `education-${number}`, suggestion: string) => {
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
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
      
      {/* Información Personal */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4"><User className="mr-3 text-blue-500" />Información Personal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" name="name" value={data.personalInfo.name} onChange={handlePersonalInfoChange} placeholder="Nombre Completo" className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="text" name="title" value={data.personalInfo.title} onChange={handlePersonalInfoChange} placeholder="Tu titular profesional" className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="tel" name="phone" value={data.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="Teléfono" className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="email" name="email" value={data.personalInfo.email} onChange={handlePersonalInfoChange} placeholder="Email" className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="text" name="linkedin" value={data.personalInfo.linkedin} onChange={handlePersonalInfoChange} placeholder="URL perfil de LinkedIn" className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input type="text" name="location" value={data.personalInfo.location} onChange={handlePersonalInfoChange} placeholder="Ciudad, País" className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
      </section>

      {/* Resumen Profesional */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-2"><FileText className="mr-3 text-blue-500" />Resumen Profesional</h3>
        <div className="flex items-start">
          <textarea name="summary" value={data.summary} onChange={(e) => handleSectionChange('summary', e.target.value)} placeholder="Un párrafo breve y potente sobre ti." rows={5} className="p-2 border rounded-md w-full flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
          <AtsTooltip text="Escribe 2-3 frases que resuman tu perfil y objetivo. Usa palabras clave de la oferta de empleo a la que aplicas." />
        </div>
         <AiSuggestionButton
          baseText={data.summary}
          promptType="summary"
          onSuggestion={(suggestion) => handleAiSuggestion('summary', suggestion)}
          onLoadingChange={setIsAiLoading}
        />
      </section>

      {/* Experiencia Laboral */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4"><Briefcase className="mr-3 text-blue-500" />Experiencia Laboral</h3>
        <div className="space-y-4">
        {data.experience.map((exp, index) => (
          <div key={exp.id} className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-700">Puesto #{index + 1}</p>
              <button onClick={() => deleteItem('experience', exp.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
              <input type="text" name="title" value={exp.title} onChange={(e) => handleNestedChange('experience', exp.id, e)} placeholder="Cargo" className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input type="text" name="company" value={exp.company} onChange={(e) => handleNestedChange('experience', exp.id, e)} placeholder="Empresa" className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <input type="text" name="period" value={exp.period} onChange={(e) => handleNestedChange('experience', exp.id, e)} placeholder="Periodo (Ej: Ene 2020 - Presente)" className="p-2 border rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <div className="flex items-start">
              <textarea name="description" value={exp.description} onChange={(e) => handleNestedChange('experience', exp.id, e)} placeholder="Describe tus logros y responsabilidades." rows={4} className="p-2 border rounded-md w-full flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
              <AtsTooltip text="Cuantifica tus logros (ej: 'aumenté las ventas un 15%'). Usa viñetas o frases cortas." />
            </div>
             <AiSuggestionButton
                baseText={exp.description}
                promptType="experience"
                onSuggestion={(suggestion) => handleAiSuggestion(`experience-${exp.id}`, suggestion)}
                onLoadingChange={setIsAiLoading}
              />
          </div>
        ))}
        </div>
        <button onClick={() => addItem('experience')} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 mt-4">
          <PlusCircle size={20} className="mr-2" />Añadir Experiencia
        </button>
      </section>

      {/* Educación */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4"><GraduationCap className="mr-3 text-blue-500" />Educación</h3>
        <div className="space-y-4">
        {data.education.map((edu, index) => (
          <div key={edu.id} className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-700">Formación #{index + 1}</p>
              <button onClick={() => deleteItem('education', edu.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
              <input type="text" name="degree" value={edu.degree} onChange={(e) => handleNestedChange('education', edu.id, e)} placeholder="Título o Grado" className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input type="text" name="institution" value={edu.institution} onChange={(e) => handleNestedChange('education', edu.id, e)} placeholder="Institución Educativa" className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <input type="text" name="period" value={edu.period} onChange={(e) => handleNestedChange('education', edu.id, e)} placeholder="Periodo (Ej: 2018 - 2022)" className="p-2 border rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <textarea name="description" value={edu.description} onChange={(e) => handleNestedChange('education', edu.id, e)} placeholder="Menciones, proyectos destacados, etc." rows={2} className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
          </div>
        ))}
        </div>
        <button onClick={() => addItem('education')} className="flex items-center text-blue-600 font-semibold hover:text-blue-800 mt-4">
          <PlusCircle size={20} className="mr-2" />Añadir Formación
        </button>
      </section>
      
      {/* Habilidades */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-2"><Sparkles className="mr-3 text-blue-500" />Habilidades</h3>
        <div className="flex items-start">
          <textarea name="skills" value={data.skills} onChange={(e) => handleSectionChange('skills', e.target.value)} placeholder="Enumera tus habilidades separadas por comas. Ej: React, Liderazgo, Inglés..." rows={3} className="p-2 border rounded-md w-full flex-grow focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
          <AtsTooltip text="Incluye tanto habilidades técnicas (Software, Idiomas) como blandas (Comunicación, Liderazgo)." />
        </div>
      </section>
    </div>
  );
};

export default Editor;

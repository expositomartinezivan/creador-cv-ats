
import React from 'react';
import { Mail, Phone, Linkedin, MapPin } from 'lucide-react';
import { ResumeData } from '../types';

interface PreviewProps {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement>;
}

const Preview: React.FC<PreviewProps> = ({ data, previewRef }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <div className="bg-white rounded-xl shadow-lg lg:h-[calc(100vh-180px)] lg:overflow-y-auto">
      <div ref={previewRef} className="text-sm font-serif text-gray-800 bg-white p-8">
        {/* Encabezado del CV */}
        <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 tracking-wide">{personalInfo.name || "Nombre Apellido"}</h1>
          <p className="text-md mt-1 font-semibold text-blue-700">{personalInfo.title || "Tu Titular Profesional"}</p>
          <div className="flex justify-center items-center text-xs mt-3 text-gray-600 space-x-4 flex-wrap">
            {personalInfo.email && <span className="flex items-center my-1"><Mail size={12} className="mr-1.5" />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center my-1"><Phone size={12} className="mr-1.5" />{personalInfo.phone}</span>}
            {personalInfo.linkedin && <span className="flex items-center my-1"><Linkedin size={12} className="mr-1.5" />{personalInfo.linkedin}</span>}
            {personalInfo.location && <span className="flex items-center my-1"><MapPin size={12} className="mr-1.5" />{personalInfo.location}</span>}
          </div>
        </div>

        {/* Cuerpo del CV */}
        <div className="space-y-6">
          {/* Resumen */}
          {summary && (
            <div>
              <h2 className="text-lg font-bold text-blue-800 border-b border-gray-200 pb-1 mb-2">RESUMEN PROFESIONAL</h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          {/* Experiencia */}
          {experience.length > 0 && experience.some(exp => exp.title) && (
            <div>
              <h2 className="text-lg font-bold text-blue-800 border-b border-gray-200 pb-1 mb-3">EXPERIENCIA LABORAL</h2>
              <div className="space-y-4">
                {experience.map(exp => exp.title && (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-md">{exp.title}</h3>
                      <p className="text-xs font-medium text-gray-600">{exp.period}</p>
                    </div>
                    <p className="text-sm font-semibold italic text-gray-700">{exp.company}</p>
                    <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Educación */}
          {education.length > 0 && education.some(edu => edu.degree) && (
            <div>
              <h2 className="text-lg font-bold text-blue-800 border-b border-gray-200 pb-1 mb-3">EDUCACIÓN</h2>
              <div className="space-y-4">
                {education.map(edu => edu.degree && (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-md">{edu.degree}</h3>
                      <p className="text-xs font-medium text-gray-600">{edu.period}</p>
                    </div>
                    <p className="text-sm font-semibold italic text-gray-700">{edu.institution}</p>
                    <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Habilidades */}
          {skills && (
            <div>
              <h2 className="text-lg font-bold text-blue-800 border-b border-gray-200 pb-1 mb-2">HABILIDADES</h2>
              <p className="text-sm leading-relaxed">{skills}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;

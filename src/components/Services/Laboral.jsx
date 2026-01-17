import React from 'react';
import { FaBalanceScale, FaUserTie, FaBuilding, FaHandsHelping, FaBriefcase, FaChartLine } from 'react-icons/fa';
import ServiceLayout from './ServiceLayout';

const Laboral = () => {
  // Precios de servicios
  const servicios = [
    {
      id: 1,
      nombre: "Consulta Inicial Laboral",
      descripcion: "Evaluación de su caso laboral, análisis preliminar y orientación legal básica",
      precio: 40,
      duracion: "1 hora",
      destacado: false
    },
    {
      id: 2,
      nombre: "Defensa en Despidos",
      descripcion: "Representación legal especializada en casos de despido injustificado y reclamaciones laborales",
      precio: 400,
      duracion: "Por caso",
      destacado: true,
      caracteristicas: [
        "Análisis de la legalidad del despido",
        "Cálculo de indemnizaciones adeudadas",
        "Representación en juicios laborales",
        "Negociación de acuerdos extrajudiciales",
        "Seguimiento constante del caso"
      ]
    },
    {
      id: 3,
      nombre: "Asesoría Empresarial Laboral",
      descripcion: "Servicio integral mensual para empresas con asesoría en cumplimiento laboral",
      precio: 300,
      duracion: "Mensual",
      destacado: false,
      caracteristicas: [
        "Revisión de contratos laborales",
        "Asesoría en nómina y beneficios",
        "Capacitación en prevención de riesgos",
        "Auditorías de cumplimiento",
        "Soporte en inspecciones gubernamentales"
      ]
    },
    {
      id: 4,
      nombre: "Negociación Colectiva",
      descripcion: "Asesoría y representación en negociaciones colectivas y conflictos laborales",
      precio: 600,
      duracion: "Por proceso",
      destacado: true,
      caracteristicas: [
        "Estrategia de negociación colectiva",
        "Representación ante Ministerio de Trabajo",
        "Asesoría en elecciones sindicales",
        "Defensa en conflictos colectivos",
        "Mediación y arbitraje laboral"
      ]
    },
    {
      id: 5,
      nombre: "Guía Práctica: Derecho Laboral",
      descripcion: "E-book completo con guía práctica sobre derecho laboral ecuatoriano",
      precio: 25,
      duracion: "Compra única",
      destacado: false,
      caracteristicas: [
        "150+ páginas de contenido actualizado",
        "Modelos de contratos y documentos",
        "Casos prácticos y ejemplos reales",
        "Actualización gratuita por 1 año",
        "Envío inmediato por correo electrónico"
      ]
    },
    {
      id: 6,
      nombre: "Defensa en Seguridad Social",
      descripcion: "Representación en conflictos con el IESS y otros organismos de seguridad social",
      precio: 350,
      duracion: "Por caso",
      destacado: false,
      caracteristicas: [
        "Impugnación de multas del IESS",
        "Reclamaciones por invalidez y vejez",
        "Defensa en procesos de calificación",
        "Asesoría en aportes patronales",
        "Representación en auditorías"
      ]
    }
  ];

  // Casos de éxito
  const casosExito = [
    {
      titulo: "Indemnización millonaria por despido injustificado",
      descripcion: "Cliente obtuvo indemnización de $15,000 tras demostrar que fue despedido sin causa justificada",
      resultado: "Victoria completa - $15,000"
    },
    {
      titulo: "Sobreseimiento de proceso por acoso laboral",
      descripcion: "Empleado fue absuelto de cargos falsos de acoso laboral mediante defensa efectiva",
      resultado: "Absolución completa"
    },
    {
      titulo: "Reducción de multa del IESS en 70%",
      descripcion: "Empresa logró reducir multa del IESS de $50,000 a $15,000 mediante impugnación técnica",
      resultado: "Ahorro de $35,000"
    },
    {
      titulo: "Acuerdo extrajudicial en conflicto colectivo",
      descripcion: "Negociación exitosa que evitó huelga de 200 trabajadores y resolvió diferencias salariales",
      resultado: "Acuerdo favorable"
    }
  ];

  // Áreas de especialización
  const especialidades = [
    { 
      icon: <FaUserTie />, 
      title: "Despidos y Reinstalaciones", 
      description: "Defensa en despidos injustificados, reinstalaciones y reclamaciones de indemnizaciones" 
    },
    { 
      icon: <FaBuilding />, 
      title: "Relaciones Laborales Empresariales", 
      description: "Asesoría integral para empresas en cumplimiento de normativa laboral" 
    },
    { 
      icon: <FaHandsHelping />, 
      title: "Conflictos Colectivos", 
      description: "Negociación colectiva, huelgas y representación sindical" 
    },
    { 
      icon: <FaBriefcase />, 
      title: "Seguridad Social", 
      description: "Asesoría en IESS, jubilaciones, invalidez y otros beneficios de seguridad social" 
    },
    { 
      icon: <FaChartLine />, 
      title: "Capacitación y Prevención", 
      description: "Programas de capacitación para empleados y empleadores en prevención de conflictos laborales" 
    },
    { 
      icon: <FaBalanceScale />, 
      title: "Juicios Laborales", 
      description: "Representación en juicios ordinarios y sumarios ante Juntas de Calificación y Tribunales" 
    }
  ];

  return (
    <ServiceLayout
      title="Laboral"
      icon={<FaUserTie className="mr-2 text-yellow-400" />}
      description="Especialistas en derecho laboral para proteger los derechos de trabajadores y asesorar a empleadores. Más de 15 años de experiencia en conflictos laborales con soluciones efectivas y personalizadas."
      services={servicios}
      successCases={casosExito}
      specialties={especialidades}
      whatsappText="Hola Abg. Wilson, necesito asesoría en derecho laboral."
    />
  );
};

export default Laboral;
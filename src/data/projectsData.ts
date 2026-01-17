import { Task } from '../types';

export const initialTasks: Task[] = [
  { id: 1, title: 'Diseñar landing page v2', description: 'Crear un nuevo diseño en Figma basado en el nuevo branding.', status: 'todo', project: 'Website Redesign', assignee: { name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice' } },
  { id: 2, title: 'Desarrollar integración con Stripe', description: 'Implementar el flujo de pago para el plan Pro.', status: 'in_progress', project: 'Billing System', assignee: { name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob' } },
  { id: 3, title: 'Escribir posts para el blog de Q3', description: 'Redactar 3 artículos sobre automatización de marketing.', status: 'in_progress', project: 'Content Marketing', assignee: { name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie' } },
  { id: 4, title: 'Revisar métricas de la campaña anterior', description: 'Analizar los KPIs y preparar un reporte de resultados.', status: 'done', project: 'Marketing', assignee: { name: 'Diana', avatar: 'https://i.pravatar.cc/150?u=diana' } },
  { id: 5, title: 'Planificar sprint de Julio', description: 'Definir las tareas y prioridades para el próximo sprint.', status: 'todo', project: 'General', assignee: { name: 'Ethan', avatar: 'https://i.pravatar.cc/150?u=ethan' } },
  { id: 6, title: 'Resolver bug en el login', description: 'El login con Google falla en Safari. Investigar y corregir.', status: 'done', project: 'General', assignee: { name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice' } },
  { id: 7, title: 'Crear reglas de otorgamiento de créditos', description: 'Definir las reglas para el nuevo sistema de créditos.', status: 'in_progress', project: 'Credit System Launch', assignee: { name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob' } },
];
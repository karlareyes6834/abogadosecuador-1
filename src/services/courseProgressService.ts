/**
 * Servicio de Progreso de Cursos y Certificados
 * Gestiona el seguimiento del progreso del estudiante
 */

import { supabase } from '../config/supabase';

export interface CourseProgress {
  course_id: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
  last_accessed: string;
}

export interface Certificate {
  id: string;
  course_id: string;
  course_title?: string;
  certificate_url: string;
  issued_at: string;
}

const courseProgressService = {
  /**
   * Obtener progreso de un curso específico
   */
  async getCourseProgress(userId: string, courseId: string): Promise<{ data: CourseProgress | null; error: any }> {
    try {
      // Obtener total de lecciones
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId);

      if (lessonsError) throw lessonsError;

      const totalLessons = lessons?.length || 0;

      // Obtener lecciones completadas
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (progressError) throw progressError;

      const completedLessons = progress?.length || 0;
      const progressPercentage = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;

      return {
        data: {
          course_id: courseId,
          total_lessons: totalLessons,
          completed_lessons: completedLessons,
          progress_percentage: progressPercentage,
          last_accessed: new Date().toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error al obtener progreso del curso:', error);
      return { data: null, error };
    }
  },

  /**
   * Marcar lección como completada
   */
  async markLessonComplete(userId: string, courseId: string, lessonId: string) {
    try {
      // Verificar si ya está marcada como completada
      const { data: existing } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();

      if (existing) {
        return { success: true, alreadyCompleted: true, error: null };
      }

      // Marcar como completada
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          course_id: courseId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Verificar si el curso está completo
      const { data: progress } = await this.getCourseProgress(userId, courseId);
      
      if (progress && progress.progress_percentage === 100) {
        // Generar certificado si está al 100%
        await this.generateCertificate(userId, courseId);
      }

      return { success: true, alreadyCompleted: false, error: null };
    } catch (error) {
      console.error('Error al marcar lección completada:', error);
      return { success: false, alreadyCompleted: false, error };
    }
  },

  /**
   * Desmarcar lección (para re-hacer)
   */
  async unmarkLessonComplete(userId: string, lessonId: string) {
    try {
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', userId)
        .eq('lesson_id', lessonId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error al desmarcar lección:', error);
      return { success: false, error };
    }
  },

  /**
   * Obtener todos los cursos del usuario con su progreso
   */
  async getUserCoursesWithProgress(userId: string) {
    try {
      // Obtener cursos del usuario
      const { data: userCourses, error: coursesError } = await supabase
        .from('user_courses')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            thumbnail,
            duration_hours,
            level,
            category,
            certificate_available
          )
        `)
        .eq('user_id', userId)
        .eq('active', true);

      if (coursesError) throw coursesError;

      // Obtener progreso para cada curso
      const coursesWithProgress = await Promise.all(
        (userCourses || []).map(async (uc) => {
          const { data: progress } = await this.getCourseProgress(userId, uc.course_id);
          
          return {
            ...uc.courses,
            purchased_at: uc.purchased_at,
            progress: progress?.progress_percentage || 0,
            total_lessons: progress?.total_lessons || 0,
            completed_lessons: progress?.completed_lessons || 0
          };
        })
      );

      return { data: coursesWithProgress, error: null };
    } catch (error) {
      console.error('Error al obtener cursos con progreso:', error);
      return { data: [], error };
    }
  },

  /**
   * Generar certificado para curso completado
   */
  async generateCertificate(userId: string, courseId: string): Promise<{ data: Certificate | null; error: any }> {
    try {
      // Verificar que el curso esté 100% completado
      const { data: progress } = await this.getCourseProgress(userId, courseId);
      
      if (!progress || progress.progress_percentage < 100) {
        throw new Error('El curso no está completado al 100%');
      }

      // Verificar si ya existe certificado
      const { data: existing } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (existing) {
        return { data: existing, error: null };
      }

      // Obtener datos del curso
      const { data: course } = await supabase
        .from('courses')
        .select('title, certificate_available')
        .eq('id', courseId)
        .single();

      if (!course?.certificate_available) {
        throw new Error('Este curso no ofrece certificado');
      }

      // Generar URL del certificado (aquí integrarías con un servicio de generación de PDFs)
      const certificateUrl = `https://certificates.abogadowilson.com/${userId}/${courseId}/${Date.now()}.pdf`;

      // Crear registro de certificado
      const { data: certificate, error } = await supabase
        .from('certificates')
        .insert({
          user_id: userId,
          course_id: courseId,
          certificate_url: certificateUrl,
          issued_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Crear notificación
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'certificate_issued',
          title: '¡Certificado Disponible!',
          message: `Has completado el curso "${course.title}". Tu certificado está listo para descargar.`,
          action_url: `/dashboard/my-courses?cert=${certificate.id}`
        });

      return { 
        data: {
          ...certificate,
          course_title: course.title
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error al generar certificado:', error);
      return { data: null, error };
    }
  },

  /**
   * Obtener certificados del usuario
   */
  async getUserCertificates(userId: string) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (title, category, thumbnail)
        `)
        .eq('user_id', userId)
        .order('issued_at', { ascending: false });

      if (error) throw error;

      const certificates = (data || []).map(cert => ({
        id: cert.id,
        course_id: cert.course_id,
        course_title: cert.courses?.title,
        course_category: cert.courses?.category,
        course_thumbnail: cert.courses?.thumbnail,
        certificate_url: cert.certificate_url,
        issued_at: cert.issued_at
      }));

      return { data: certificates, error: null };
    } catch (error) {
      console.error('Error al obtener certificados:', error);
      return { data: [], error };
    }
  },

  /**
   * Obtener lecciones de un curso con estado de completado
   */
  async getCourseLessonsWithStatus(userId: string, courseId: string) {
    try {
      // Obtener secciones y lecciones
      const { data: sections, error: sectionsError } = await supabase
        .from('course_sections')
        .select(`
          *,
          lessons (*)
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (sectionsError) throw sectionsError;

      // Obtener progreso del usuario
      const { data: progress } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      const completedLessonIds = new Set(progress?.map(p => p.lesson_id) || []);

      // Marcar lecciones completadas
      const sectionsWithStatus = sections?.map(section => ({
        ...section,
        lessons: section.lessons
          .sort((a, b) => a.order_index - b.order_index)
          .map(lesson => ({
            ...lesson,
            completed: completedLessonIds.has(lesson.id)
          }))
      }));

      return { data: sectionsWithStatus, error: null };
    } catch (error) {
      console.error('Error al obtener lecciones con estado:', error);
      return { data: [], error };
    }
  },

  /**
   * Registrar tiempo de estudio
   */
  async trackStudyTime(userId: string, courseId: string, lessonId: string, minutes: number) {
    try {
      // Aquí podrías crear una tabla de analytics si quieres rastrear tiempo de estudio
      // Por ahora solo actualizamos la última vez que se accedió
      
      const { error } = await supabase
        .from('user_courses')
        .update({ 
          last_accessed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error al registrar tiempo de estudio:', error);
      return { success: false, error };
    }
  }
};

export default courseProgressService;

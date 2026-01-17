import React from 'react';
import { Helmet } from 'react-helmet-async';
import AppointmentBooking from '../components/Appointments/AppointmentBooking';

const AppointmentsPage = () => {
  return (
    <>
      <Helmet>
        <title>Agendar Cita - Abogado Wilson</title>
        <meta name="description" content="Agenda tu cita de consulta legal con nuestros expertos" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Agendar Cita de Consulta
            </h1>
            <p className="text-lg text-gray-600">
              Selecciona la fecha y hora que mejor se ajuste a tu disponibilidad
            </p>
          </div>

          <AppointmentBooking />
        </div>
      </div>
    </>
  );
};

export default AppointmentsPage;

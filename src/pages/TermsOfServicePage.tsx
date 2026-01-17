import React from 'react';
import Card from '../components/Card';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="py-12 lg:py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                 <Card className="prose dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-extrabold font-serif">Términos de Servicio</h1>
                    <p className="text-sm text-gray-500">Última actualización: 24 de Julio de 2024</p>

                    <h2>1. Acuerdo de los Términos</h2>
                    <p>Estos Términos de Servicio constituyen un acuerdo legalmente vinculante hecho entre usted, ya sea personalmente o en nombre de una entidad ("usted") y la plataforma del Abg. Wilson Alexander Ipiales ("nosotros", "nos" o "nuestro"), con respecto a su acceso y uso del sitio web.</p>
                    
                    <h2>2. Cuentas de Usuario</h2>
                    <p>Para utilizar ciertas funciones de la plataforma, es posible que deba registrarse para obtener una cuenta. Usted es responsable de mantener la confidencialidad de la contraseña de su cuenta y de todas las actividades que ocurran bajo su cuenta.</p>
                    
                    <h2>3. Propiedad Intelectual</h2>
                    <p>El Sitio y todo su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva nuestra y de nuestros licenciantes. El servicio está protegido por derechos de autor, marcas registradas y otras leyes.</p>
                    
                    <h2>4. Sistema de Créditos y Tokens</h2>
                    <p>La plataforma utiliza un sistema de "créditos" para funciones de IA y "tokens" para el centro de entretenimiento. Estos son intransferibles y no tienen valor monetario fuera de la plataforma. Nos reservamos el derecho de modificar las tasas de uso en cualquier momento.</p>

                    <h2>5. Terminación</h2>
                    <p>Podemos suspender o cancelar su cuenta de inmediato, sin previo aviso ni responsabilidad, por cualquier motivo, incluido, entre otros, si usted incumple los Términos.</p>

                 </Card>
            </div>
        </div>
    );
};

export default TermsOfServicePage;

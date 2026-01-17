import React from 'react';
import Card from '../components/Card';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="py-12 lg:py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="prose dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-extrabold font-serif">Política de Privacidad</h1>
                    <p className="text-sm text-gray-500">Última actualización: 24 de Julio de 2024</p>
                    
                    <h2>1. Introducción</h2>
                    <p>Bienvenido a la plataforma del Abg. Wilson Alexander Ipiales. Nos comprometemos a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos su información cuando visita nuestro sitio web.</p>

                    <h2>2. Recopilación de su Información</h2>
                    <p>Podemos recopilar información sobre usted de varias maneras. La información que podemos recopilar en el Sitio incluye:</p>
                    <ul>
                        <li><strong>Datos Personales:</strong> Información de identificación personal, como su nombre, dirección de correo electrónico y número de teléfono, que nos proporciona voluntariamente cuando se registra en el Sitio o elige participar en diversas actividades relacionadas con el Sitio.</li>
                        <li><strong>Datos Derivados:</strong> Información que nuestros servidores recopilan automáticamente cuando accede al Sitio, como su dirección IP, tipo de navegador, sistema operativo, etc.</li>
                    </ul>

                    <h2>3. Uso de su Información</h2>
                    <p>Tener información precisa sobre usted nos permite brindarle una experiencia fluida, eficiente y personalizada. Específicamente, podemos usar la información recopilada sobre usted a través del Sitio para:</p>
                    <ul>
                        <li>Crear y administrar su cuenta.</li>
                        <li>Enviarle un correo electrónico con respecto a su cuenta o pedido.</li>
                        <li>Habilitar la comunicación de usuario a usuario.</li>
                        <li>Procesar pagos y reembolsos.</li>
                    </ul>

                    <h2>4. Seguridad de su Información</h2>
                    <p>Utilizamos medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger su información personal. Si bien hemos tomado medidas razonables para asegurar la información personal que nos proporciona, tenga en cuenta que a pesar de nuestros esfuerzos, ninguna medida de seguridad es perfecta o impenetrable.</p>
                    
                    <h2>5. Contacto</h2>
                    <p>Si tiene preguntas o comentarios sobre esta Política de Privacidad, contáctenos en info@abgipiales.com.</p>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;

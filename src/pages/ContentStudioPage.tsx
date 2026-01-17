import React, { useState } from 'react';
import Card from '../components/Card';
import { SparklesIcon, TextIcon, ImageIcon, MicIcon, WandIcon, EmailIcon } from '../components/icons/InterfaceIcons';
import { useCredits } from '../context/CreditContext';
import { generateCreativeText, generateImageFromPrompt, generateEmail } from '../services/geminiService';

const AiToolCard = ({ icon, title, children }) => (
    <Card>
        <div className="flex items-center mb-4">
            <div className="p-2 bg-[var(--accent-color)]/10 rounded-lg mr-3">
                {icon}
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
        </div>
        {children}
    </Card>
);


const ContentStudioPage: React.FC = () => {
    const { credits, deductCredits } = useCredits();

    const [textPrompt, setTextPrompt] = useState('');
    const [textType, setTextType] = useState<'blog' | 'email' | 'ad'>('blog');
    const [generatedText, setGeneratedText] = useState('');
    const [isTextLoading, setIsTextLoading] = useState(false);

    const [imagePrompt, setImagePrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState('');
    const [imageError, setImageError] = useState('');
    const [isImageLoading, setIsImageLoading] = useState(false);

    const [voiceText, setVoiceText] = useState('');
    const [isVoiceLoading, setIsVoiceLoading] = useState(false);

    const [emailPrompt, setEmailPrompt] = useState('');
    const [emailAudience, setEmailAudience] = useState('Nuevos suscriptores');
    const [emailTone, setEmailTone] = useState('Profesional');
    const [generatedEmail, setGeneratedEmail] = useState<{ subject: string, body: string } | null>(null);
    const [isEmailLoading, setIsEmailLoading] = useState(false);

    const handleGenerateText = async () => {
        if (!textPrompt || isTextLoading || !deductCredits(10)) return;
        setIsTextLoading(true);
        setGeneratedText('');
        const result = await generateCreativeText(textPrompt, textType);
        setGeneratedText(result);
        setIsTextLoading(false);
    };

    const handleGenerateImage = async () => {
        if (!imagePrompt || isImageLoading || !deductCredits(50)) return;
        setIsImageLoading(true);
        setGeneratedImage('');
        setImageError('');
        const result = await generateImageFromPrompt(imagePrompt);
        if (result && !result.startsWith('Error de IA:') && !result.startsWith('Límite de Cuota Excedido:')) {
            setGeneratedImage(`data:image/jpeg;base64,${result}`);
        } else {
            setImageError(result);
        }
        setIsImageLoading(false);
    };

    const handleGenerateVoice = () => {
        if (!voiceText || isVoiceLoading || !deductCredits(5)) return;
        setIsVoiceLoading(true);
        const utterance = new SpeechSynthesisUtterance(voiceText);
        utterance.lang = 'es-ES';
        utterance.onend = () => setIsVoiceLoading(false);
        speechSynthesis.speak(utterance);
    };

     const handleGenerateEmail = async () => {
        if (!emailPrompt || isEmailLoading || credits < 15) return;
        setIsEmailLoading(true);
        setGeneratedEmail(null);
        if (deductCredits(15)) {
            const result = await generateEmail(emailPrompt, emailAudience, emailTone);
            if (result) {
                setGeneratedEmail(result);
            } else {
                setGeneratedEmail({ subject: "Error", body: "No se pudo generar el email. Inténtalo de nuevo." });
            }
        }
        setIsEmailLoading(false);
    };

    const getButtonText = (baseText, cost) => {
        if (credits < cost) return `Créditos insuficientes (${cost})`;
        return `${baseText} (${cost} créditos)`;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center">
                    <SparklesIcon className="h-8 w-8 mr-3 text-[var(--accent-color)]"/> Estudio de Contenido IA
                </h1>
                <p className="mt-1 text-[var(--muted-foreground)]">Genera texto, imágenes y voz para tus campañas, todo en un solo lugar.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AiToolCard icon={<TextIcon className="h-6 w-6 text-[var(--accent-color)]" />} title="Generador de Texto">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                             <select value={textType} onChange={(e) => setTextType(e.target.value as any)} className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)]">
                                <option value="blog">Entrada de Blog</option>
                                <option value="email">Email de Marketing</option>
                                <option value="ad">Texto para Anuncio</option>
                            </select>
                        </div>
                        <textarea 
                            value={textPrompt}
                            onChange={(e) => setTextPrompt(e.target.value)}
                            placeholder="Ej: Escribe un post sobre los beneficios de la automatización para PYMES..."
                            className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)]"
                            rows={3}
                        />
                        <button onClick={handleGenerateText} disabled={isTextLoading || credits < 10} className="w-full flex items-center justify-center p-2 rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 disabled:bg-gray-400">
                           {isTextLoading ? <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <WandIcon className="h-5 w-5 mr-2" />}
                           {isTextLoading ? "Generando..." : getButtonText('Generar Texto', 10)}
                        </button>
                        {generatedText && <Card className="!bg-[var(--background)]"><pre className="whitespace-pre-wrap font-sans text-sm">{generatedText}</pre></Card>}
                    </div>
                </AiToolCard>
                
                 <AiToolCard icon={<EmailIcon className="h-6 w-6 text-[var(--accent-color)]" />} title="Redactor de Emails IA">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Objetivo del Email</label>
                            <textarea 
                                value={emailPrompt}
                                onChange={(e) => setEmailPrompt(e.target.value)}
                                placeholder="Ej: Anunciar una oferta del 20% en todos los cursos..."
                                className="w-full mt-1 p-2 rounded-md bg-[var(--background)] border border-[var(--border)]"
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Audiencia</label>
                                <input 
                                    type="text"
                                    value={emailAudience}
                                    onChange={(e) => setEmailAudience(e.target.value)}
                                    placeholder="Ej: Clientes antiguos"
                                    className="w-full mt-1 p-2 rounded-md bg-[var(--background)] border border-[var(--border)]"
                                />
                            </div>
                             <div>
                                <label className="text-sm font-medium">Tono</label>
                                <select value={emailTone} onChange={(e) => setEmailTone(e.target.value)} className="w-full mt-1 p-2 rounded-md bg-[var(--background)] border border-[var(--border)]">
                                    <option>Profesional</option>
                                    <option>Amistoso</option>
                                    <option>Urgente</option>
                                    <option>Persuasivo</option>
                                </select>
                            </div>
                        </div>

                        <button onClick={handleGenerateEmail} disabled={isEmailLoading || credits < 15} className="w-full flex items-center justify-center p-2 rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 disabled:bg-gray-400">
                            {isEmailLoading ? <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <WandIcon className="h-5 w-5 mr-2" />}
                            {isEmailLoading ? "Generando..." : getButtonText('Generar Email', 15)}
                        </button>

                        { (isEmailLoading || generatedEmail) && 
                            <Card className="!bg-[var(--background)] !p-4">
                                {isEmailLoading ? (
                                    <div className="space-y-2 animate-pulse">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                                    </div>
                                ) : generatedEmail && (
                                    <div className="space-y-2">
                                        <div className="flex gap-2 items-baseline">
                                            <label className="font-semibold text-sm">Asunto:</label>
                                            <p className="text-sm">{generatedEmail.subject}</p>
                                        </div>
                                        <div className="border-t border-[var(--border)] pt-2">
                                             <pre className="whitespace-pre-wrap font-sans text-sm">{generatedEmail.body}</pre>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        }
                    </div>
                </AiToolCard>

                <AiToolCard icon={<ImageIcon className="h-6 w-6 text-[var(--accent-color)]" />} title="Generador de Imágenes">
                    <div className="space-y-4">
                        <input 
                            type="text"
                            value={imagePrompt}
                            onChange={(e) => setImagePrompt(e.target.value)}
                            placeholder="Ej: Un astronauta en un caballo en marte, fotorrealista"
                            className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)]"
                        />
                         <button onClick={handleGenerateImage} disabled={isImageLoading || credits < 50} className="w-full flex items-center justify-center p-2 rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 disabled:bg-gray-400">
                            {isImageLoading ? <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <WandIcon className="h-5 w-5 mr-2" />}
                            {isImageLoading ? "Generando..." : getButtonText('Generar Imagen', 50)}
                        </button>
                        <div className="w-full aspect-square bg-[var(--background)] rounded-lg flex items-center justify-center overflow-hidden p-4">
                            {isImageLoading && <div className="text-[var(--muted-foreground)]">Procesando...</div>}
                            {!isImageLoading && generatedImage && <img src={generatedImage} alt="Generated content" className="w-full h-full object-cover" />}
                            {!isImageLoading && imageError && <div className="text-red-500 text-sm text-center">{imageError}</div>}
                            {!isImageLoading && !generatedImage && !imageError && <div className="text-[var(--muted-foreground)]">La imagen aparecerá aquí</div>}
                        </div>
                    </div>
                </AiToolCard>

                 <AiToolCard icon={<MicIcon className="h-6 w-6 text-[var(--accent-color)]" />} title="Generador de Voz (TTS)">
                    <div className="space-y-4">
                        <textarea 
                            value={voiceText}
                            onChange={(e) => setVoiceText(e.target.value)}
                            placeholder="Escribe el texto que quieres convertir a voz..."
                            className="w-full p-2 rounded-md bg-[var(--background)] border border-[var(--border)]"
                            rows={4}
                        />
                         <button onClick={handleGenerateVoice} disabled={isVoiceLoading || credits < 5} className="w-full flex items-center justify-center p-2 rounded-md text-[var(--primary-foreground)] bg-[var(--primary)] hover:opacity-90 disabled:bg-gray-400">
                             {isVoiceLoading ? <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <WandIcon className="h-5 w-5 mr-2" />}
                             {isVoiceLoading ? "Generando..." : getButtonText('Generar Audio', 5)}
                        </button>
                         {/* Visual feedback could be added here */}
                    </div>
                </AiToolCard>
            </div>
        </div>
    );
};

export default ContentStudioPage;
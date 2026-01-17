import React, { useState } from 'react';
import { FaUpload, FaFileImport, FaCheckCircle, FaTimesCircle, FaDownload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import adminService from '../../services/adminService';

const CSVImporter = () => {
  const [importType, setImportType] = useState('products');
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResults(null);
    } else {
      toast.error('Por favor selecciona un archivo CSV válido');
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    return data;
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Por favor selecciona un archivo');
      return;
    }

    setImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const data = parseCSV(text);

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const row of data) {
          try {
            let result;

            if (importType === 'products') {
              result = await adminService.products.create({
                name: row.name || row.nombre,
                description: row.description || row.descripcion,
                short_description: row.short_description || row.descripcion_corta,
                price: parseFloat(row.price || row.precio || 0),
                category: row.category || row.categoria || 'general',
                type: row.type || row.tipo || 'digital',
                status: row.status || row.estado || 'active',
                thumbnail: row.thumbnail || row.imagen || '',
                featured: row.featured === 'true' || row.destacado === 'true' || false
              });
            } else if (importType === 'courses') {
              result = await adminService.courses.create({
                title: row.title || row.titulo,
                description: row.description || row.descripcion,
                short_description: row.short_description || row.descripcion_corta,
                price: parseFloat(row.price || row.precio || 0),
                category: row.category || row.categoria || 'general',
                level: row.level || row.nivel || 'beginner',
                duration: parseInt(row.duration || row.duracion || 0),
                thumbnail: row.thumbnail || row.imagen || '',
                instructor_name: row.instructor_name || row.instructor || 'Instructor',
                status: row.status || row.estado || 'active',
                featured: row.featured === 'true' || row.destacado === 'true' || false
              });
            } else if (importType === 'blog') {
              result = await adminService.blog.create({
                title: row.title || row.titulo,
                content: row.content || row.contenido || '',
                excerpt: row.excerpt || row.extracto || '',
                category: row.category || row.categoria || 'General',
                author_name: row.author_name || row.autor || 'Admin',
                thumbnail: row.thumbnail || row.imagen || '',
                status: row.status || row.estado || 'draft',
                featured: row.featured === 'true' || row.destacado === 'true' || false,
                tags: row.tags ? row.tags.split('|') : []
              });
            }

            if (result.success) {
              successCount++;
            } else {
              errorCount++;
              errors.push({ row: row.name || row.titulo || 'N/A', error: result.error });
            }
          } catch (error) {
            errorCount++;
            errors.push({ row: row.name || row.titulo || 'N/A', error: error.message });
          }
        }

        setResults({
          total: data.length,
          success: successCount,
          errors: errorCount,
          errorDetails: errors
        });

        if (successCount > 0) {
          toast.success(`${successCount} registros importados correctamente`);
        }
        if (errorCount > 0) {
          toast.error(`${errorCount} registros con errores`);
        }

      } catch (error) {
        toast.error('Error al procesar el archivo CSV');
        console.error(error);
      } finally {
        setImporting(false);
      }
    };

    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    let template = '';
    
    if (importType === 'products') {
      template = 'name,description,short_description,price,category,type,status,thumbnail,featured\n' +
                'Producto Ejemplo,Descripción completa del producto,Descripción corta,99.99,ebook,digital,active,https://ejemplo.com/imagen.jpg,false';
    } else if (importType === 'courses') {
      template = 'title,description,short_description,price,category,level,duration,thumbnail,instructor_name,status,featured\n' +
                'Curso Ejemplo,Descripción completa del curso,Descripción corta,199.99,derecho,beginner,120,https://ejemplo.com/imagen.jpg,Instructor,active,false';
    } else if (importType === 'blog') {
      template = 'title,content,excerpt,category,author_name,thumbnail,status,featured,tags\n' +
                'Título del Post,Contenido completo del artículo,Extracto breve,General,Admin,https://ejemplo.com/imagen.jpg,published,false,tag1|tag2|tag3';
    }

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantilla_${importType}.csv`;
    a.click();
    toast.success('Plantilla descargada');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Importación Masiva CSV</h2>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <FaDownload /> Descargar Plantilla
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Selector de tipo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Contenido
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setImportType('products')}
              className={`px-6 py-3 rounded-lg transition ${
                importType === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Productos/Servicios
            </button>
            <button
              onClick={() => setImportType('courses')}
              className={`px-6 py-3 rounded-lg transition ${
                importType === 'courses'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cursos
            </button>
            <button
              onClick={() => setImportType('blog')}
              className={`px-6 py-3 rounded-lg transition ${
                importType === 'blog'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Blog/Entradas
            </button>
          </div>
        </div>

        {/* Área de carga */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FaUpload className="text-5xl text-gray-400 mb-4 mx-auto" />
          <p className="text-gray-600 mb-4">
            Arrastra un archivo CSV aquí o haz clic para seleccionar
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
          >
            Seleccionar Archivo CSV
          </label>
          {file && (
            <p className="text-sm text-green-600 mt-3">
              <FaCheckCircle className="inline mr-2" />
              Archivo seleccionado: {file.name}
            </p>
          )}
        </div>

        {/* Botón de importar */}
        {file && (
          <div className="mt-6">
            <button
              onClick={handleImport}
              disabled={importing}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Importando...
                </>
              ) : (
                <>
                  <FaFileImport className="mr-2" />
                  Importar Datos
                </>
              )}
            </button>
          </div>
        )}

        {/* Resultados */}
        {results && (
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resultados de Importación</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-900">{results.total}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <p className="text-sm text-green-600 font-medium">Exitosos</p>
                <p className="text-2xl font-bold text-green-900">{results.success}</p>
              </div>
              <div className="bg-red-100 rounded-lg p-4 text-center">
                <p className="text-sm text-red-600 font-medium">Errores</p>
                <p className="text-2xl font-bold text-red-900">{results.errors}</p>
              </div>
            </div>

            {results.errorDetails.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Detalles de Errores:</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {results.errorDetails.map((error, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-200 rounded p-2 text-sm">
                      <p className="font-medium text-red-800">{error.row}</p>
                      <p className="text-red-600">{error.error}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instrucciones */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Formato del CSV:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• La primera fila debe contener los nombres de las columnas</li>
            <li>• Usa comas (,) como separador</li>
            <li>• Para tags múltiples en blog, usa pipe (|) como separador</li>
            <li>• Descarga la plantilla para ver el formato exacto</li>
            <li>• Los campos booleanos usan: true/false</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CSVImporter;

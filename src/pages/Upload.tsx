import React, { useState } from 'react';
import { Upload as UploadIcon, FileText, Image, File, X, CheckCircle, AlertCircle, User, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  status: 'uploading' | 'completed' | 'failed';
  progress: number;
}

interface UploadForm {
  patientId: string;
  reportType: 'lab' | 'scan' | 'prescription' | 'diagnosis' | 'other';
  title: string;
  description: string;
  files: File[];
}

const Upload: React.FC = () => {
  const { user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<UploadForm>({
    patientId: '',
    reportType: 'lab',
    title: '',
    description: '',
    files: []
  });

  // Mock patients data
  const patients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Mary Smith' },
    { id: '3', name: 'Robert Johnson' },
    { id: '4', name: 'Emily Davis' },
    { id: '5', name: 'Michael Wilson' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));

    // Simulate file upload
    validFiles.forEach(file => {
      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        status: 'uploading',
        progress: 0
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === uploadedFile.id) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            return {
              ...f,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading'
            };
          }
          return f;
        }));
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => prev.map(f => 
          f.id === uploadedFile.id ? { ...f, status: 'completed', progress: 100 } : f
        ));
      }, 3000);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index.toString() !== fileId)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    console.log('Uploading report:', formData);
    setShowSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        patientId: '',
        reportType: 'lab',
        title: '',
        description: '',
        files: []
      });
      setUploadedFiles([]);
    }, 3000);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-600" />;
    } else if (type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-600" />;
    } else {
      return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (showSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Successful!</h2>
          <p className="text-gray-600 mb-4">
            The medical report has been successfully uploaded and will be available to the patient and assigned doctor.
          </p>
          <p className="text-sm text-gray-500">
            You can continue uploading more reports or return to the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">Upload Medical Documents</h1>
        <p className="text-gray-600 mt-2">Upload medical reports, prescriptions, and other documents for patients</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Document Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Patient *
              </label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a patient...</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type *
              </label>
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="lab">Lab Results</option>
                <option value="scan">Medical Scan</option>
                <option value="prescription">Prescription</option>
                <option value="diagnosis">Diagnosis Report</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Blood Test Results - January 2024"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Brief description of the document contents..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Files</h2>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer inline-block"
            >
              Select Files
            </label>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Uploaded Files</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    {getFileIcon(file.type)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{Math.round(file.progress)}% uploaded</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === 'completed' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {file.status === 'failed' && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Ready to upload {uploadedFiles.filter(f => f.status === 'completed').length} file(s)
              </p>
            </div>
            <button
              type="submit"
              disabled={!formData.patientId || !formData.title || uploadedFiles.filter(f => f.status === 'completed').length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <UploadIcon className="h-5 w-5" />
              <span>Upload Documents</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Upload;
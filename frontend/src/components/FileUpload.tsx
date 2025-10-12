import { useState, useRef } from 'react';
import { Button, Alert, Spinner } from 'flowbite-react';
import { HiUpload, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { apiService } from '../services/api';
import { MAX_FILE_SIZE, ALLOWED_FILE_EXTENSIONS } from '../constants/validation';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

/**
 * FileUpload Component
 * Handles CSV file selection and upload to the backend
 */
export const FileUpload = ({ onUploadSuccess }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles file selection from input
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setSuccess(null);

    if (file) {
      // Validate file type
      const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );
      if (!hasValidExtension) {
        setError('Please select a CSV file');
        setSelectedFile(null);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)} limit`);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  /**
   * Handles file upload to backend
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.uploadCsv(selectedFile);
      setSuccess(`Successfully uploaded ${response.count} songs!`);
      setSelectedFile(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent component to refresh songs list
      setTimeout(() => {
        onUploadSuccess();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Triggers file input click
   */
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Song List
          </h2>
          <p className="text-gray-600">
            Select a CSV file containing your song collection
          </p>
        </div>

        {/* File Selection */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
            onClick={handleSelectFile}
          >
            <div className="flex flex-col items-center space-y-2">
              <HiUpload className="text-5xl text-gray-400" />
              <p className="text-lg font-medium text-gray-700">
                {selectedFile ? selectedFile.name : 'Click to select CSV file'}
              </p>
              <p className="text-sm text-gray-500">
                Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}
              </p>
            </div>
          </div>

          {selectedFile && (
            <div className="flex gap-3">
              <Button
                color="blue"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <HiUpload className="mr-2 h-5 w-5" />
                    Upload File
                  </>
                )}
              </Button>
              <Button
                color="gray"
                onClick={handleSelectFile}
                disabled={isUploading}
              >
                Choose Different File
              </Button>
            </div>
          )}
        </div>

        {/* Success Alert */}
        {success && (
          <Alert color="success" icon={HiCheckCircle}>
            <span className="font-medium">Success!</span> {success}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert color="failure" icon={HiExclamationCircle}>
            <span className="font-medium">Error!</span> {error}
          </Alert>
        )}
      </div>
    </div>
  );
};


import { useState, useRef } from 'react';
import { Spinner } from 'flowbite-react';
import { HiUpload, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { apiService } from '../services/api';
import { MAX_FILE_SIZE, ALLOWED_FILE_EXTENSIONS } from '../constants/validation';

/**
 * FileUpload Component
 * Handles CSV file selection and upload to the backend
 */
export const FileUpload = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
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
        setError(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
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

      // Notify parent component to refresh songs list immediately
      onUploadSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      
      // Clear selected file on error so user must select again
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Triggers file input click and clears messages
   */
  const handleSelectFile = () => {
    setError(null);
    setSuccess(null);
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

          <div 
            className={`w-full p-8 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
              selectedFile 
                ? 'border-blue-300 bg-blue-50 hover:border-blue-500 hover:bg-blue-100' 
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
            onClick={handleSelectFile}
          >
            <div className="flex flex-col items-center space-y-2">
              <HiUpload className={`text-5xl ${selectedFile ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-lg font-medium text-gray-700">
                {selectedFile ? selectedFile.name : 'Click to select CSV file'}
              </p>
              {selectedFile ? (
                <p className="text-xs text-blue-600 font-medium">
                  ✓ File selected · Click to change
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
                </p>
              )}
            </div>
          </div>

          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isUploading ? (
                <>
                  <Spinner size="sm" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <HiUpload className="h-5 w-5" />
                  <span>Upload File</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Alerts */}
        {success && <SuccessAlert message={success} />}
        {error && <ErrorAlert message={error} />}
      </div>
    </div>
  );
};




/**
 * Success Alert Component
 */
const SuccessAlert = ({ message }: { message: string }) => (
  <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
    <div className="flex items-start space-x-3">
      <HiCheckCircle className="text-green-600 text-2xl flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-bold text-green-800 mb-1">Success!</p>
        <p className="text-green-700">{message}</p>
      </div>
    </div>
  </div>
);

/**
 * Error Alert Component
 */
const ErrorAlert = ({ message }: { message: string }) => (
  <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg animate-shake">
    <div className="flex items-start space-x-3">
      <HiExclamationCircle className="text-red-600 text-2xl flex-shrink-0 mt-0.5 animate-pulse" />
      <div className="flex-1 break-words">
        <p className="font-bold text-red-800 mb-1">Upload Failed</p>
        <p className="text-red-700 text-sm">{message}</p>
        <p className="text-red-600 text-xs mt-2 font-medium">
          Please select a valid CSV file and try again.
        </p>
      </div>
    </div>
  </div>
);
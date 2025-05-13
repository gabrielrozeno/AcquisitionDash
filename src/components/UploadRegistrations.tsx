'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

export function UploadRegistrations() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    console.log('Button clicked');
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed');
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file:', file.name);
      const response = await fetch('/api/upload-registrations', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file');
      }

      toast.success(`Successfully uploaded ${data.count} records`);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload file. Please check the CSV format.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Upload from CSV</h3>
          <p className="text-sm text-muted-foreground">
            Upload your CSV file containing data from your ad campaigns
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="csv-upload"
          />
          <Button
            variant="outline"
            disabled={isUploading}
            className="cursor-pointer gap-2"
            onClick={handleButtonClick}
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload CSV'}
          </Button>
        </div>

        <div className="rounded-md bg-muted p-4 space-y-2">
          <h4 className="text-sm font-medium">CSV Format Requirements</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-2">
              <span className="font-medium">date:</span> DD/MM/YYYY format
            </li>
            <li className="flex items-center gap-2">
              <span className="font-medium">platform:</span> Name of the platform
            </li>
            <li className="flex items-center gap-2">
              <span className="font-medium">spend:</span> Decimal number (e.g., 1000.50)
            </li>
            <li className="flex items-center gap-2">
              <span className="font-medium">registrations:</span> Integer number
            </li>
            <li className="flex items-center gap-2">
              <span className="font-medium">ftds:</span> Integer number
            </li>
          </ul>
          <div className="mt-4 text-sm">
            <p className="font-medium">Example:</p>
            <code className="block mt-1 p-2 bg-background rounded text-xs">
              date,platform,spend,registrations,ftds
              01/01/2024,Platform A,1000.50,100,10
            </code>
          </div>
        </div>
      </div>
    </div>
  );
} 
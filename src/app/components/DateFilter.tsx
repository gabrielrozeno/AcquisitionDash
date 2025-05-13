'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateFilterProps {
  onFilterChange: (startDate: string, endDate: string) => void;
}

export default function DateFilter({ onFilterChange }: DateFilterProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Set default date range to last 30 days
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      onFilterChange(startDate, endDate);
    }
  }, [startDate, endDate, onFilterChange]);

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="startDate" className="mb-2 block">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex-1">
          <Label htmlFor="endDate" className="mb-2 block">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full"
          />
        </div>

        <Button 
          onClick={handleClear}
          variant="outline"
          className="w-full md:w-auto"
        >
          Clear Filter
        </Button>
      </div>
    </div>
  );
} 
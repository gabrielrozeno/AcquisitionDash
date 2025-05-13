'use client';

import AddNewEntryButton from "./AddNewEntryButton";

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">
        RVBET Ads Dashboard
      </h1>
      <div className="ml-4">
        <AddNewEntryButton />
      </div>
    </div>
  );
} 
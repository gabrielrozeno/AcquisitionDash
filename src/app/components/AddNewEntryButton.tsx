'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AddNewEntryButton() {
  return (
    <Link href="/add">
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add New Entry
      </Button>
    </Link>
  );
} 
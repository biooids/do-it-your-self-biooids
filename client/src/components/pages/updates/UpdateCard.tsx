// src/components/pages/updates/UpdateCard.tsx
"use client";

import Link from "next/link";
import { UpdateDto } from "@/lib/features/updates/updateTypes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function UpdateCard({ update }: { update: UpdateDto }) {
  return (
    <Link href={`/updates/${update.id}`} className="block h-full">
      <Card className="hover:border-primary transition-colors h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge variant="secondary">
              {update.category.replace("_", " ")}
            </Badge>
            {update.version && (
              <Badge variant="outline">v{update.version}</Badge>
            )}
          </div>
          <CardTitle className="pt-2">{update.title}</CardTitle>
          <CardDescription>
            Published on {format(new Date(update.publishedAt), "MMMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3">{update.content}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

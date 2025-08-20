import { cn } from "@/lib/utils";
import { Rocket } from "lucide-react";

function Gopro({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div>
      {" "}
      <div className="mt-auto flex flex-col gap-2 border-t p-2">
        {!isCollapsed && (
          <div className="rounded-lg border bg-accent/50 p-4 text-center mx-2">
            <div className="mb-2 flex justify-center">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Go Pro</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Unlock exclusive features.{" "}
              <span className="text-primary">coming soon...</span>
            </p>
          </div>
        )}
        <div
          className={cn(
            "flex p-2",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        ></div>
      </div>
    </div>
  );
}
export default Gopro;

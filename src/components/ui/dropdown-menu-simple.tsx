import * as React from "react";
import { cn } from "./utils";

// Simple DropdownMenu replacement - temporary to force clean rebuild
export function DropdownMenu({ children, ...props }: any) {
  return <div className="relative inline-block" {...props}>{children}</div>;
}

export function DropdownMenuTrigger({ children, asChild, ...props }: any) {
  return <div {...props}>{children}</div>;
}

export function DropdownMenuContent({ 
  children, 
  className,
  align = "start",
  sideOffset = 4,
  ...props 
}: any) {
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      style={{ marginTop: `${sideOffset}px` }}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ 
  children, 
  className,
  disabled,
  ...props 
}: any) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuCheckboxItem({ children, className, checked, ...props }: any) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {checked && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          ✓
        </span>
      )}
      {children}
    </div>
  );
}

export function DropdownMenuRadioItem({ children, className, ...props }: any) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className, inset, ...props }: any) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className, ...props }: any) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
}

export function DropdownMenuShortcut({ children, className, ...props }: any) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function DropdownMenuGroup({ children, ...props }: any) {
  return <div {...props}>{children}</div>;
}

export function DropdownMenuPortal({ children, ...props }: any) {
  return <>{children}</>;
}

export function DropdownMenuSub({ children, ...props }: any) {
  return <div {...props}>{children}</div>;
}

export function DropdownMenuSubContent({ children, className, ...props }: any) {
  return (
    <div
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSubTrigger({ children, className, inset, ...props }: any) {
  return (
    <div
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <span className="ml-auto">›</span>
    </div>
  );
}

export function DropdownMenuRadioGroup({ children, ...props }: any) {
  return <div {...props}>{children}</div>;
}

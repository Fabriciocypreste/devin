import * as React from "react";
import { cn } from "./utils";

// Simple Select replacement - temporary to force clean rebuild
export function Select({ children, value, onValueChange, ...props }: any) {
  return (
    <select 
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, className, ...props }: any) {
  return <div className={cn("hidden", className)} {...props}>{children}</div>;
}

export function SelectValue({ placeholder }: any) {
  return <option value="">{placeholder}</option>;
}

export function SelectContent({ children, ...props }: any) {
  return <>{children}</>;
}

export function SelectItem({ children, value, ...props }: any) {
  return <option value={value} {...props}>{children}</option>;
}

export function SelectGroup({ children, ...props }: any) {
  return <>{children}</>;
}

export function SelectLabel({ children, ...props }: any) {
  return <optgroup label={children} {...props} />;
}

export function SelectSeparator() {
  return null;
}

export function SelectScrollUpButton() {
  return null;
}

export function SelectScrollDownButton() {
  return null;
}

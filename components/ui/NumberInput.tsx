import { Input } from "./input";

const SEPERATOR = ",";
const DECIMAL = ".";
function ValidNumberChar(value: string): string {
  const cleaned = value.replace(/[^\d-+,.]/g, "");
  // only allow 1 DECIMAL
  // don't allow  consecutive SEPERATOR
  return cleaned;
}
export function NumberInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input"> & { onChange: (value: string) => void }) {
  return (
    <Input
      className={className}
      type={type}
      {...props}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const n = ValidNumberChar(e.target.value);
        props.onChange(n);
      }}
    />
  );
}

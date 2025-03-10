import Chip from "@mui/material/Chip";

type Props = {
  label: string;
  variant: "filled" | "outlined";
  bg_color?: string;
  fore_color?: string;
  show_radious?: boolean;
  minWidth?: string;
};

export default function LabelStatus({
  label,
  variant,
  bg_color,
  fore_color,
  show_radious = false,
  minWidth = "100px",
}: Props) {
  return (
    <Chip
      label={label}
      variant={variant}
      style={{
        backgroundColor: bg_color || "transparent",
        color: fore_color || "#212B36",
        minWidth: minWidth,
        borderRadius: show_radious ? "5px" : "none",
        fontWeight: "bold",
        borderStyle: "none",
      }}
    />
  );
}

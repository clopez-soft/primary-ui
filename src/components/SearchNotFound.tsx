import { Paper, PaperProps, Typography } from "@mui/material";

interface SearchNotFoundProps extends PaperProps {
  searchQuery?: string;
}

export default function SearchNotFound({
  searchQuery = "",
  ...other
}: SearchNotFoundProps) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        No encontrado
      </Typography>
      <Typography variant="body2" align="center">
        No se encontraron registros para la búsqueda &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Intente palabras completas o
        evite errores tipográficos
      </Typography>
    </Paper>
  );
}

export interface ApiResponse<T> {
    estado: {
      codigo: string;
      mensaje: string;
      descripcion: string;
    };
    data: T[];
  }
export interface ReqRoles{
    rolId?: number,
    nombre?: string,
    descripcion?: string,
    idColor?: number,
    empresaId?: number,
    estado?: boolean
}

export interface ReqCargos{
    cargoId?: number,
    nombre?: string,
    descripcion?: string,
    empresaId?: number,
    estado?: boolean
}

export interface ReqEmpresas{
    empresaId?: number,
    nombre?: string,
    estado?: boolean
}
export interface ReqPermisos{
    permisoId?: number,
    nombre?: string,
    descripcion?: string,
    rutaAngular?: string,
    estado?: boolean
}
export interface ReqUsuarios{
    usuarioId?: number,
    nombre?: string,
    tipoDocumento?: number,
    numDocumento?: string,
    correoElectronico?: string,
    contraseña?: string,
    telefono?: string,
    direccion?: string,
    fechaNacimiento?: Date,
    fechaCreacion?: Date,
    sexoId?: number,
    jefeId?: number,
    rolId?: number,
    cargoId?: number,
    empresaId?: number,
    usuarioIdOpcional?: number,
    estado?: boolean
}

export interface reqrolespermisos{
    rolpermisoid: number,
    rolid?: number,
    permisoid?: number
}

export interface reqlogin {
       usuario: string,
       pw: string
}


export interface reqObjetivos {
    id: string,
    idUsuario: number,
    titulo: string,
    descripcion: string,
    peso: string,
    fechainicio: Date,
    fechafin: Date,
    estado: boolean
}

export interface reqAccionesObjetivos
{
    id:number,
    idobjetivo:number,
    idusuario:number,
    descripcion:string,
    calificacion:number,
    evidencia: string,
    idestado:number,
    comentarios: string,
    fechaaccion: Date
}

export interface reqPreguntas
{
    id: number,
    idcompetencia: number;
    pregunta: string,
    estado: boolean,
   // fecha_inicio: Date,
    //fecha_fin: Date
}

export interface reqRespuestas
{
    id:number,
    idpregunta: number,
    descripcion: string,
    estado: boolean,
    peso: number
}

export interface reqRespuestasUser
{
    id: number,
    id_pregunta: number,
    id_respuesta: number,
    comentarios: string,
    id_usuario_califica: number,
    id_usuario_calificado: number,
}

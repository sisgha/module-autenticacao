export interface UsuarioInternoModel {
  id: string;

  // ...

  tipoEntidade: string;

  // ...

  dateCreated: Date;
  dateUpdated: Date;
  dateDeleted: Date | null;
}

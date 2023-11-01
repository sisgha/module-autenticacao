export interface IConfigSeedSuperUsuarioCredentials {
  email: string;
  password: string;
  matriculaSiape: string;
}

export interface IConfigSeedSuperUsuario {
  getSeedSuperUsuarioCredentials(): IConfigSeedSuperUsuarioCredentials;
}

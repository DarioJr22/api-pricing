export class CreatePessoaDto {
    nmPessoa: string;
    nrCpfCnpj: string;
    dsEndereco: string;
    dsEstado: string;
    dsCep: string;
    dsTelefones: string[];
    apiKey: any;
    user: string;
    password: string;
    email: string;
    cdRegimeTributario: number;  // ID do regime tributário relacionado
  }
  
export class CreateRegimeTributarioDto {
    /**
     * @description Descrição do regime tributário (ex: Simples Nacional, Lucro Presumido, Lucro Real)
     */
    dsRegimeTributario: string;
  
    /**
     * @description Objeto JSON que representa as alíquotas aplicáveis ao regime tributário.
     * Exemplo:
     * {
     *   "irpj": "15%",
     *   "csll": "9%",
     *   "pis": "1.65%",
     *   "cofins": "7.6%"
     * }
     */
    dsAliquotasAplicaveis?: Record<string, number>; // Usando um objeto JSON
  
    /**
     * @description Indica se há desoneração fiscal aplicável.
     * 1: Sim, 0: Não.
     */
    inAplicacaoDesoneracao: boolean;
  }
  
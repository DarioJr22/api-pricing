# Ordem de População das Tabelas

## 1. Regime Tributário - insert

### Simples Nacional

```json
{
  "dsRegimeTributario": "Simples Nacional",
  "dsAliquotasAplicaveis": {
    "irpj": 4,
    "csll": 4,
    "pis": 0.65,
    "cofins": 3,
    "iss": 2
  },
  "inAplicacaoDesoneracao": true
}
```

### Lucro Presumido

```json
{
  "dsRegimeTributario": "Lucro Presumido",
  "dsAliquotasAplicaveis": {
    "irpj": 15,
    "csll": 9,
    "pis": 0.65,
    "cofins": 3
  },
  "inAplicacaoDesoneracao": false
}
```

### Lucro Real

```json
{
  "dsRegimeTributario": "Lucro Real",
  "dsAliquotasAplicaveis": {
    "irpj": 15,
    "csll": 9,
    "pis": 1.65,
    "cofins": 7.6
  },
  "inAplicacaoDesoneracao": false
}
```

## 2. ERP

### Omie

```json
{
  "dsErp": "omie",
  "flIntegracaoAutomatica": 1,
  "urlApiIntegracao": "http://example.com"
}
```

### Tiny

```json
{
  "dsErp": "tiny",
  "flIntegracaoAutomatica": 1,
  "urlApiIntegracao": "http://example.com"
}
```

## 3. Pessoas

```json
{
  "nmPessoa": "Empresa XYZ",
  "nrCpfCnpj": "123456789012",
  "dsEndereco": "Rua ABC, 123",
  "dsEstado": "SP",
  "dsCep": "01234-567",
  "dsTelefones": ["11987654321", "11876543210"],
  "apiKey": { "token": "chaveApiExemplo" },
  "user": "usuario123",
  "password": "senha123",
  "email": "empresa@xyz.com",
  "cdRegimeTributario": 1,
  "cdErp": 1
}
```

-- Regime tributário
INSERT INTO precificacao_db.public.regime_tributario ("cdRegimeTributario", "dsRegimeTributario", "inAplicacaoDesoneracao", "dsAliquotasAplicaveis") VALUES
(1, 'Lucro Real', 0, '{"irpj":15,"csll":9,"pis":1.65,"cofins":7.6}'),
(2, 'Simples Nacional', 0, '{"irpj":4,"csll":4,"pis":0.65,"cofins":3,"iss":2}'),
(3, 'Lucro Presumido', 0, '{"irpj":15,"csll":9,"pis":0.65,"cofins":3}');
-- ERPs
INSERT INTO precificacao_db.public.erp ("dsErp", "flIntegracaoAutomatica", "urlApiIntegracao") VALUES
('Omie', 1, 'https://app.omie.com.br/api/'),
('Tiny', 1, 'https://api.tiny.com.br/api2/');
-- Impostos
INSERT INTO precificacao_db.public.imposto ("cdImposto" , "dsImposto", "tpImposto") VALUES
(1, 'ICMS', 'Estadual'),
(2, 'IPI', 'Federal'),
(3, 'PIS', 'Federal'),
(4, 'COFINS', 'Federal'),
(5, 'ISS', 'Municipal'),
(6, 'II', 'Federal'),
(7, 'FCP', 'Estadual'),
(8, 'ICMS-ST', 'Estadual');
-- Clientes iniciais 
INSERT INTO precificacao_db.public.pessoa (
  "nmPessoa", 
  "nrCpfCnpj", 
  "dsEndereco", 
  "dsEstado", 
  "dsCep", 
  "dsTelefones", 
  "apiKey", 
  "user", 
  "password", 
  "email", 
  "cdRegimeTributario", 
  "cdErp"
) 
VALUES (
  'Otávio Russo', 
  '30103180000106', 
  'Avenida Dos Inconfidentes, 196', 
  'MG', 
  '37830-222', 
  '["+553598098868", "+553599354942"]', 
  '  "token": {
                                "app_key":"2169725830272",
                                "app_secret":"da6f260f4147e6445cfe87888c775d22"
                        } ', 
  'otavio', 
  'senha123', 
  'otavio@tataimpressoras.com.br', 
  2, 
  1
);

INSERT INTO precificacao_db.public.pessoa (
  "nmPessoa", 
  "nrCpfCnpj", 
  "dsEndereco", 
  "dsEstado", 
  "dsCep", 
  "dsTelefones", 
  "apiKey", 
  "user", 
  "password", 
  "email", 
  "cdRegimeTributario", 
  "cdErp"
) 
VALUES (
  'RMP DISTRIBUIDORA', 
  '37153892000170', 
  'Jardim Paineiras, 31 ', 
  'SP', 
  '17402-386', 
  '[]', 
  ' "token": {"app_key":"9bafc090fd4b03863963b35b0e9a42d895887b38c711fb2ae6330d40cbdccf2f"} ', 
  'danilo', 
  'senha123', 
  'sac@rmpdistribuidora.com.br', 
  2, 
  2
);
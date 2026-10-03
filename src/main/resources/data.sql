-- Tipo telefone
INSERT IGNORE INTO tipo_telefone (descricao) VALUES
('Celular'),
('Fixo');

-- Genero
INSERT IGNORE INTO genero (descricao) VALUES
('Feminino'),
('Masculino'),
('Outro');

-- Tipo endereço
INSERT IGNORE INTO tipo_endereco (descricao) VALUES
('Cobrança'),
('Entrega'),
('Cobrança e Entrega');

-- Tipo residencia
INSERT IGNORE INTO tipo_residencia (descricao) VALUES
('Casa'),
('Apartamento'),
('Sobrado'),
('Casa geminada'),
('Kitnet'),
('Loft'),
('Cobertura'),
('Outro');

-- Tipo logradouro
INSERT IGNORE INTO tipo_logradouro (descricao) VALUES
('Rua'),
('Avenida'),
('Alameda'),
('Travessa'),
('Estrada'),
('Rodovia'),
('Beco'),
('Outro');

-- Bandeira
INSERT IGNORE INTO bandeira (descricao) VALUES
('Visa'),
('Mastercard'),
('Elo'),
('American Express'),
('Hipercard');

-- Estado
INSERT IGNORE INTO estado (sigla, nome) VALUES
('AC', 'Acre'),
('AL', 'Alagoas'),
('AP', 'Amapá'),
('AM', 'Amazonas'),
('BA', 'Bahia'),
('CE', 'Ceará'),
('DF', 'Distrito Federal'),
('ES', 'Espírito Santo'),
('GO', 'Goiás'),
('MA', 'Maranhão'),
('MT', 'Mato Grosso'),
('MS', 'Mato Grosso do Sul'),
('MG', 'Minas Gerais'),
('PA', 'Pará'),
('PB', 'Paraíba'),
('PR', 'Paraná'),
('PE', 'Pernambuco'),
('PI', 'Piauí'),
('RJ', 'Rio de Janeiro'),
('RN', 'Rio Grande do Norte'),
('RS', 'Rio Grande do Sul'),
('RO', 'Rondônia'),
('RR', 'Roraima'),
('SC', 'Santa Catarina'),
('SP', 'São Paulo'),
('SE', 'Sergipe'),
('TO', 'Tocantins');

-- Motivos para inativação
INSERT IGNORE INTO motivo_inativacao (descricao) VALUES
('Suspeita de fraude'),
('Uso indevido da plataforma'),
('Determinação administrativa'),
('Outro');

-- Motivos para ativação
INSERT IGNORE INTO motivo_ativacao (descricao) VALUES
('Revisão administrativa'),
('Suspeita de fraude descartada'),
('Regularização cadastral'),
('Outro');

-- Tipo de petisco
INSERT IGNORE INTO tipo_petisco (nome) VALUES
('Bifinhos'),
('Biscoitos e Snacks'),
('Molhos'),
('Petisco Cremoso'),
('Petisco Natural'),
('Ossos');


-- Tipo de ração
INSERT IGNORE INTO tipo_racao (nome) VALUES
('Seca'),
('Natural'),
('Úmida'),
('Medicamentosa');


-- Tamanho do grão
INSERT IGNORE INTO tamanho_grao (nome) VALUES
('Pequeno'),
('Médio'),
('Grande');


-- Forma de apresentação
INSERT IGNORE INTO forma_apresentacao (nome) VALUES
('Comprimidos'),
('Tabletes Mastigáveis'),
('Pó'),
('Líquido'),
('Cápsulas');


-- Espécie
INSERT IGNORE INTO especie (nome) VALUES
('Gato'),
('Cachorro');


-- Faixa etária
INSERT IGNORE INTO faixa_etaria (nome) VALUES
('Filhote'),
('Adulto'),
('Idoso');


-- Porte indicado
INSERT IGNORE INTO porte (nome) VALUES
('Pequeno'),
('Médio'),
('Grande');


-- Sabor
INSERT IGNORE INTO sabor (nome) VALUES
('Frango'),
('Carne'),
('Vegetais'),
('Peixe'),
('Cordeiro'),
('Peru'),
('Bacon'),
('Queijo'),
('Mix de Carnes'),
('Frutas'),
('Sem Sabor');

-- Tipo de cupom
INSERT IGNORE INTO tipo_cupom (nome) VALUES
('Promocional'),
('Troca');

-- Grupo de precificação
INSERT IGNORE INTO grupo_precificacao (nome, percentual) VALUES
('Básico', 20.00),
('Premium', 35.00),
('Super Premium', 50.00);

-- Status do pedido
INSERT IGNORE INTO status_pedido (descricao) VALUES
('Em processamento'),
('Aprovada'),
('Reprovada'),
('Em transporte'),
('Entregue');
INSERT IGNORE INTO tipo_telefone (descricao) VALUES
('Celular'),
('Fixo');

INSERT IGNORE INTO genero (descricao) VALUES
('Feminino'),
('Masculino'),
('Outro');

INSERT IGNORE INTO tipo_endereco (descricao) VALUES
('Cobrança'),
('Entrega'),
('Cobrança e Entrega');

INSERT IGNORE INTO tipo_residencia (descricao) VALUES
('Casa'),
('Apartamento'),
('Sobrado'),
('Casa geminada'),
('Kitnet'),
('Loft'),
('Cobertura'),
('Outro');

INSERT IGNORE INTO tipo_logradouro (descricao) VALUES
('Rua'),
('Avenida'),
('Alameda'),
('Travessa'),
('Estrada'),
('Rodovia'),
('Beco'),
('Outro');

INSERT IGNORE INTO bandeira (descricao) VALUES
('Visa'),
('Mastercard'),
('Elo'),
('American Express'),
('Hipercard');

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
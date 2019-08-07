INSERT INTO `accessrun`.`pessoa`
(`id`,`nome`,`data_cadastro`)
VALUES
(1,'Portaria e Recepção - Gocil Segurança e Serviços',sysdate());

INSERT INTO `accessrun`.`credenciado`
(`id`,`pessoa_id`,`data_credenciamento`)
VALUES
(1,1,sysdate());

INSERT INTO `accessrun`.`dispositivo_modelo`
(`id`,`descricao`,`preco`,`data_cadastro`)
VALUES
(1,'Terminal de Acesso', 3000.90,sysdate());

INSERT INTO `accessrun`.`dispositivo_modelo`
(`id`,`descricao`,`preco`,`data_cadastro`)
VALUES
(2,'Portaria Virtual', 10000.90,sysdate());

INSERT INTO `accessrun`.`dispositivo`
(`id`,`dispositivo_modelo_id`,`numero_serie`,`usuario_cadastro`,`data_cadastro`)
VALUES
(1,1,'#XPKDAD2000','',sysdate());

INSERT INTO `accessrun`.`dispositivo`
(`id`,`dispositivo_modelo_id`,`numero_serie`,`usuario_cadastro`,`data_cadastro`)
VALUES
(2,2,'#KYP2017','',sysdate());

INSERT INTO `accessrun`.`dispositivo_credenciado`
(`dispositivo_id`,`credenciado_id`,`data_inicial`)
VALUES
(1,1,'2016-12-01');

INSERT INTO `accessrun`.`dispositivo_credenciado`
(`dispositivo_id`,`credenciado_id`,`data_inicial`)
VALUES
(2,1,'2016-12-01');
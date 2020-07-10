-- Gerado por Oracle SQL Developer Data Modeler 19.4.0.350.1424
--   em:        2020-06-29 11:41:01 BRT
--   site:      Oracle Database 11g
--   tipo:      Oracle Database 11g

---Create table pedido transferencia------------------------------

CREATE TABLE xtf_pedido_item (
    id_pedido         INTEGER NOT NULL,
    cod_item          VARCHAR2(30),
    qt_produto        FLOAT,
	custo_produto     FLOAT,
    frete             FLOAT,
    custo_unitario    FLOAT,
    icms              FLOAT,
    piscofins         FLOAT,
    margem            FLOAT,
    preco_unitario    FLOAT,
    total             FLOAT
);

CREATE TABLE xtf_pedido (
    id_pedido  INTEGER NOT NULL,
    dt_pedido  DATE,
	emp_orig   VARCHAR2(3),
    emp_dest   VARCHAR2(3),
    frete      FLOAT,
    impostos   FLOAT,
    total      FLOAT,
    id_usu     VARCHAR2(20),
	observacao VARCHAR2(100)
);

ALTER TABLE xtf_pedido ADD CONSTRAINT xtf_pedido_pk PRIMARY KEY ( id_pedido );

ALTER TABLE xtf_pedido_item
    ADD CONSTRAINT xtf_pedido_item_fk FOREIGN KEY ( id_pedido )
        REFERENCES pedido ( id_pedido );

create table xtf_param_mb
(
ID_EMPRESA       NUMBER(38) ,
MARGEM           NUMBER  )

/

-----------------------------------------------------
-------------*********************************-------
----------Pacote inserir pedido orcamentário --------
/*
create or replace package xpkg_tf_pedido is
    
    procedure inserir_item_pedido (
     p_id_pedido number,p_cod_item varchar2,p_qt_produto float,p_custo_produto float,p_frete float,p_custo_unitario float,p_icms float,p_piscofins float,p_margem float,p_preco_unitario float,p_total float
    );

    procedure inserir_pedido (
     p_id_pedido number, p_emp_orig varchar2, p_emp_dest varchar2,p_frete float,p_imposto float,p_total float, p_id_usu varchar2, p_observacao varchar2
    );

end xpkg_tf_pedido;

create or replace package body xpkg_tf_pedido is

    procedure inserir_pedido (
     p_id_pedido number, p_emp_orig varchar2, p_emp_dest varchar2,p_frete float,p_imposto float,p_total float, p_id_usu varchar2, p_observacao varchar2
    ) as
    
    begin

        insert into xtf_pedido (ID_PEDIDO, DT_PEDIDO, EMP_ORIG, EMP_DEST, FRETE, IMPOSTOS, TOTAL, ID_USU,observacao)
           values(p_id_pedido, sysdate, p_emp_orig, p_emp_dest, p_frete, p_imposto, p_total, p_id_usu, p_observacao);

        commit;

    end inserir_pedido;

    procedure inserir_item_pedido (
     p_id_pedido number,p_cod_item varchar2, p_qt_produto float,p_custo_produto float,p_frete float,p_custo_unitario float,p_icms float,p_piscofins float,p_margem float,p_preco_unitario float,p_total float
    ) as

    begin

        insert into xtf_pedido_item (ID_PEDIDO, COD_ITEM, QT_PRODUTO, CUSTO_PRODUTO, FRETE, CUSTO_UNITARIO, ICMS, PISCOFINS, MARGEM, PRECO_UNITARIO, TOTAL)
        values(p_id_pedido, p_cod_item, p_qt_produto, p_custo_produto, p_frete, p_custo_unitario, p_icms, p_piscofins, p_margem, p_preco_unitario, p_total);

        commit;

    end inserir_item_pedido;

end xpkg_tf_pedido;
*/
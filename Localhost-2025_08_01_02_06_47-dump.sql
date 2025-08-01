--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE bodegas_sistema;
--
-- Name: bodegas_sistema; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE bodegas_sistema WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Chile.1252';


ALTER DATABASE bodegas_sistema OWNER TO postgres;

\connect bodegas_sistema

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bodega_encargado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bodega_encargado (
    id integer NOT NULL,
    bodega_id integer NOT NULL,
    encargado_id integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bodega_encargado OWNER TO postgres;

--
-- Name: bodega_encargado_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bodega_encargado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bodega_encargado_id_seq OWNER TO postgres;

--
-- Name: bodega_encargado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bodega_encargado_id_seq OWNED BY public.bodega_encargado.id;


--
-- Name: bodegas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bodegas (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    ubicacion character varying(200) NOT NULL,
    telefono character varying(15),
    email character varying(100),
    descripcion text,
    activa boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    dotacion integer DEFAULT 0,
    codigo character varying(5)
);


ALTER TABLE public.bodegas OWNER TO postgres;

--
-- Name: bodegas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bodegas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bodegas_id_seq OWNER TO postgres;

--
-- Name: bodegas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bodegas_id_seq OWNED BY public.bodegas.id;


--
-- Name: encargados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encargados (
    id integer NOT NULL,
    cedula character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    p_apellido character varying(100) NOT NULL,
    telefono character varying(15),
    email character varying(100),
    direccion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    s_apellido character varying(100)
);


ALTER TABLE public.encargados OWNER TO postgres;

--
-- Name: encargados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.encargados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.encargados_id_seq OWNER TO postgres;

--
-- Name: encargados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.encargados_id_seq OWNED BY public.encargados.id;


--
-- Name: bodega_encargado id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bodega_encargado ALTER COLUMN id SET DEFAULT nextval('public.bodega_encargado_id_seq'::regclass);


--
-- Name: bodegas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bodegas ALTER COLUMN id SET DEFAULT nextval('public.bodegas_id_seq'::regclass);


--
-- Name: encargados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encargados ALTER COLUMN id SET DEFAULT nextval('public.encargados_id_seq'::regclass);


--
-- Data for Name: bodega_encargado; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bodega_encargado (id, bodega_id, encargado_id, fecha_asignacion, activo, created_at, updated_at) VALUES (33, 5, 1, '2025-07-31 22:53:55.530326', true, '2025-07-31 22:53:55.530326', '2025-07-31 22:53:55.530326');
INSERT INTO public.bodega_encargado (id, bodega_id, encargado_id, fecha_asignacion, activo, created_at, updated_at) VALUES (34, 5, 2, '2025-07-31 22:53:55.530326', true, '2025-07-31 22:53:55.530326', '2025-07-31 22:53:55.530326');
INSERT INTO public.bodega_encargado (id, bodega_id, encargado_id, fecha_asignacion, activo, created_at, updated_at) VALUES (36, 5, 4, '2025-07-31 22:53:55.530326', true, '2025-07-31 22:53:55.530326', '2025-07-31 22:53:55.530326');


--
-- Data for Name: bodegas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bodegas (id, nombre, ubicacion, telefono, email, descripcion, activa, created_at, updated_at, dotacion, codigo) VALUES (5, 'Bodega Central', 'Playa ancha quinto los pinos', NULL, NULL, NULL, true, '2025-07-31 16:48:57.553466', '2025-07-31 16:48:57.553466', 100, 'BOD12');


--
-- Data for Name: encargados; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.encargados (id, cedula, nombre, p_apellido, telefono, email, direccion, created_at, updated_at, s_apellido) VALUES (1, '12345678', 'Juan', 'Pérez', '555-1001', 'juan.perez@empresa.com', 'Calle 1 #123', '2025-07-29 13:51:07.382449', '2025-07-29 13:51:07.382449', 'nuñez');
INSERT INTO public.encargados (id, cedula, nombre, p_apellido, telefono, email, direccion, created_at, updated_at, s_apellido) VALUES (4, '44332211', 'Ana', 'Martínez', '555-1004', 'ana.martinez@empresa.com', 'Calle 4 #012', '2025-07-29 13:51:07.382449', '2025-07-29 13:51:07.382449', 'Hernandez');
INSERT INTO public.encargados (id, cedula, nombre, p_apellido, telefono, email, direccion, created_at, updated_at, s_apellido) VALUES (2, '87654321', 'María', 'García', '555-1002', 'maria.garcia@empresa.com', 'Calle 2 #456', '2025-07-29 13:51:07.382449', '2025-07-29 13:51:07.382449', 'Cuadro');


--
-- Name: bodega_encargado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bodega_encargado_id_seq', 36, true);


--
-- Name: bodegas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bodegas_id_seq', 5, true);


--
-- Name: encargados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.encargados_id_seq', 4, true);


--
-- Name: bodega_encargado bodega_encargado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bodega_encargado
    ADD CONSTRAINT bodega_encargado_pkey PRIMARY KEY (id);


--
-- Name: bodegas bodegas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bodegas
    ADD CONSTRAINT bodegas_pkey PRIMARY KEY (id);


--
-- Name: encargados encargados_cedula_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encargados
    ADD CONSTRAINT encargados_cedula_key UNIQUE (cedula);


--
-- Name: encargados encargados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encargados
    ADD CONSTRAINT encargados_pkey PRIMARY KEY (id);


--
-- Name: idx_bodega_encargado_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_bodega_encargado_unique ON public.bodega_encargado USING btree (bodega_id, encargado_id) WHERE (activo = true);


--
-- Name: bodega_encargado bodega_encargado_bodega_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bodega_encargado
    ADD CONSTRAINT bodega_encargado_bodega_id_fkey FOREIGN KEY (bodega_id) REFERENCES public.bodegas(id) ON DELETE CASCADE;


--
-- Name: bodega_encargado bodega_encargado_encargado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bodega_encargado
    ADD CONSTRAINT bodega_encargado_encargado_id_fkey FOREIGN KEY (encargado_id) REFERENCES public.encargados(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


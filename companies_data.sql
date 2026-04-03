--
-- PostgreSQL database dump
--

\restrict kiXNoUiBWiJVfcAaEFgewtexajaBiTzJlN4MWSNDm5dEizMpUbRIJmNztucHN3x

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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

--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, code, contact_person, contact_phone, address, created_at, updated_at, service_start_date, service_end_date, payday_date, created_by, owner_id, industry, region, employee_scale, service_status, credit_no, legal_person) FROM stdin;
1816aed2-f492-442e-a8ae-680b1d18b047	十堰九头鸟企业管理服务有限公司	20260301001	李龙	15897752509	湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）	2026-03-01 04:27:31.973786+00	2026-03-09 15:08:53.206467+00	2026-03-01	2026-03-08	1	b8b94902-d3df-43f8-aca6-28f39bb6e57b	b8b94902-d3df-43f8-aca6-28f39bb6e57b	租赁和商务服务	\N	30-50人	已到期	91420302MA4917T017	李龙
2f7deb86-d845-47ae-8977-4e936aa698ce	深圳腾讯科技	20260301003	李龙	15897752509-1	广东省	2026-03-01 04:58:24.220577+00	2026-03-05 07:18:04.526991+00	2026-03-01	2026-03-31	1	b8b94902-d3df-43f8-aca6-28f39bb6e57b	b8b94902-d3df-43f8-aca6-28f39bb6e57b	其他	深圳市	30-50人	服务中	\N	\N
6dea42a0-dfb1-4366-a4b7-16fdbe755e78	湖北九头鸟企业服务有限公司	20260301002	木子	13227612509	湖北省	2026-03-01 04:46:54.927564+00	2026-03-05 07:18:04.526991+00	2026-03-01	2026-03-31	2	b8b94902-d3df-43f8-aca6-28f39bb6e57b	b8b94902-d3df-43f8-aca6-28f39bb6e57b	其他	武汉市	30-50人	服务中	\N	\N
a6992a13-4e3e-45d8-85aa-810e40dcd94c	湖北法睇企业服务	20260302016	木子	15897752500	湖北黄石	2026-03-02 11:04:15.086492+00	2026-03-05 07:18:04.526991+00	2026-03-02	2026-03-31	3	b8b94902-d3df-43f8-aca6-28f39bb6e57b	b8b94902-d3df-43f8-aca6-28f39bb6e57b	其他	武汉市	30-50人	服务中	\N	\N
e450bfbd-6f06-4e66-bba4-548767e949c1	北京京东	20260302001	小龙坎	110	北京	2026-03-02 09:08:16.014307+00	2026-03-05 07:18:04.526991+00	2026-03-02	2027-03-02	12	b8b94902-d3df-43f8-aca6-28f39bb6e57b	b8b94902-d3df-43f8-aca6-28f39bb6e57b	其他	北京市	30-50人	服务中	\N	\N
\.


--
-- PostgreSQL database dump complete
--

\unrestrict kiXNoUiBWiJVfcAaEFgewtexajaBiTzJlN4MWSNDm5dEizMpUbRIJmNztucHN3x


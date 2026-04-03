--
-- PostgreSQL database dump
--

\restrict hcP2DJpsnkBN2RYDzUijaMRKYrzLwfYi9YtFdrJQC4kmXGhNXv3q16YOeSMI9jx

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text NOT NULL,
    full_name text,
    phone text,
    role public.user_role DEFAULT 'employee'::public.user_role NOT NULL,
    company_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    manager_id uuid,
    role_id uuid,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: COLUMN profiles.manager_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.profiles.manager_id IS '直属上级用户ID';


--
-- Name: COLUMN profiles.role_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.profiles.role_id IS '用户角色ID，关联到roles表，用于自定义角色';


--
-- Name: COLUMN profiles.is_active; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.profiles.is_active IS '用户是否激活，false表示暂停';


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, username, full_name, phone, role, company_id, created_at, updated_at, manager_id, role_id, is_active) FROM stdin;
b8b94902-d3df-43f8-aca6-28f39bb6e57b	15897752509@jiutouniao.local	\N	\N	super_admin	\N	2026-03-17 10:55:37.733002+00	2026-03-17 10:55:37.733002+00	\N	\N	t
\.


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- Name: idx_profiles_manager_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_profiles_manager_id ON public.profiles USING btree (manager_id);


--
-- Name: idx_profiles_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_profiles_role_id ON public.profiles USING btree (role_id);


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: profiles fk_profiles_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT fk_profiles_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: profiles profiles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles 有user_view权限的用户可以查看所有用户; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "有user_view权限的用户可以查看所有用户" ON public.profiles FOR SELECT TO authenticated USING ((public.is_super_admin(public.uid()) OR public.has_permission(public.uid(), 'user_view'::text)));


--
-- Name: profiles 用户可以更新自己的资料（除角色外）; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新自己的资料（除角色外）" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((NOT (role IS DISTINCT FROM ( SELECT profiles_1.role
   FROM public.profiles profiles_1
  WHERE (profiles_1.id = auth.uid())))));


--
-- Name: profiles 超级管理员可以更新所有用户; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以更新所有用户" ON public.profiles FOR UPDATE TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- PostgreSQL database dump complete
--

\unrestrict hcP2DJpsnkBN2RYDzUijaMRKYrzLwfYi9YtFdrJQC4kmXGhNXv3q16YOeSMI9jx


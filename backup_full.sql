--
-- PostgreSQL database dump
--

\restrict Yq7EOkmn98nvGkMsBTAJSEul8c82oPYu8lh6bqrhKp0z0NidphhkJbqFoRSkMau

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
-- Name: _realtime; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA _realtime;


ALTER SCHEMA _realtime OWNER TO postgres;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_functions; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA supabase_functions;


ALTER SCHEMA supabase_functions OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: document_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.document_category AS ENUM (
    'onboarding',
    'employment',
    'resignation',
    'compensation',
    'certificate'
);


ALTER TYPE public.document_category OWNER TO postgres;

--
-- Name: employee_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.employee_status AS ENUM (
    'active',
    'on_leave',
    'vacation',
    'standby',
    'business_trip',
    'resigned'
);


ALTER TYPE public.employee_status OWNER TO postgres;

--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type AS ENUM (
    'contract_expiry',
    'document_signing',
    'employee_onboarding',
    'system'
);


ALTER TYPE public.notification_type OWNER TO postgres;

--
-- Name: operation_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.operation_type AS ENUM (
    'login',
    'logout',
    'company_create',
    'company_update',
    'company_delete',
    'company_transfer',
    'employee_create',
    'employee_update',
    'employee_delete',
    'employee_import',
    'template_create',
    'template_update',
    'template_delete',
    'signing_initiate',
    'signing_employee',
    'signing_company',
    'user_create',
    'user_update',
    'user_delete',
    'role_create',
    'role_update',
    'role_delete',
    'permission_assign',
    'config_update',
    'notification_send'
);


ALTER TYPE public.operation_type OWNER TO postgres;

--
-- Name: salary_signature_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.salary_signature_status AS ENUM (
    'pending',
    'sent',
    'signed',
    'rejected',
    'revoked'
);


ALTER TYPE public.salary_signature_status OWNER TO postgres;

--
-- Name: TYPE salary_signature_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TYPE public.salary_signature_status IS '薪酬签署状态: pending(待签署), sent(已发送), signed(已签署), rejected(已拒签), revoked(已撤回)';


--
-- Name: salary_signature_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.salary_signature_type AS ENUM (
    'salary_slip',
    'attendance_record'
);


ALTER TYPE public.salary_signature_type OWNER TO postgres;

--
-- Name: signing_mode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.signing_mode AS ENUM (
    'electronic',
    'offline'
);


ALTER TYPE public.signing_mode OWNER TO postgres;

--
-- Name: signing_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.signing_status AS ENUM (
    'pending',
    'employee_signed',
    'company_signed',
    'completed',
    'rejected',
    'withdrawn'
);


ALTER TYPE public.signing_status OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'super_admin',
    'manager',
    'employee'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

    REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

    GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: audit_trigger_function(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.audit_trigger_function() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  v_operation_type operation_type;
  v_operation_detail text;
  v_target_type text;
BEGIN
  -- 确定操作类型
  v_target_type := TG_TABLE_NAME;
  
  IF TG_OP = 'INSERT' THEN
    CASE TG_TABLE_NAME
      WHEN 'companies' THEN
        v_operation_type := 'company_create';
        v_operation_detail := format('创建公司: %s (编码: %s)', NEW.name, NEW.code);
      WHEN 'employees' THEN
        v_operation_type := 'employee_create';
        v_operation_detail := format('创建员工: %s (工号: %s)', NEW.name, NEW.employee_number);
      WHEN 'document_templates' THEN
        v_operation_type := 'template_create';
        v_operation_detail := format('创建文书模板: %s', NEW.name);
      WHEN 'signing_records' THEN
        v_operation_type := 'signing_initiate';
        v_operation_detail := format('发起签署记录: %s', NEW.id);
      WHEN 'roles' THEN
        v_operation_type := 'role_create';
        v_operation_detail := format('创建角色: %s', NEW.name);
      ELSE
        RETURN NEW;
    END CASE;
    
    PERFORM log_operation(v_operation_type, v_operation_detail, v_target_type, NEW.id);
    
  ELSIF TG_OP = 'UPDATE' THEN
    CASE TG_TABLE_NAME
      WHEN 'companies' THEN
        v_operation_type := 'company_update';
        v_operation_detail := format('更新公司: %s', NEW.name);
      WHEN 'employees' THEN
        v_operation_type := 'employee_update';
        v_operation_detail := format('更新员工: %s', NEW.name);
      WHEN 'document_templates' THEN
        v_operation_type := 'template_update';
        v_operation_detail := format('更新文书模板: %s', NEW.name);
      WHEN 'signing_records' THEN
        -- 检查是员工签署还是公司签署
        IF NEW.employee_signed_at IS NOT NULL AND OLD.employee_signed_at IS NULL THEN
          v_operation_type := 'signing_employee';
          v_operation_detail := format('员工签署: %s', NEW.id);
        ELSIF NEW.company_signed_at IS NOT NULL AND OLD.company_signed_at IS NULL THEN
          v_operation_type := 'signing_company';
          v_operation_detail := format('公司签署: %s', NEW.id);
        ELSE
          v_operation_type := 'signing_initiate';
          v_operation_detail := format('更新签署记录: %s', NEW.id);
        END IF;
      WHEN 'roles' THEN
        v_operation_type := 'role_update';
        v_operation_detail := format('更新角色: %s', NEW.name);
      ELSE
        RETURN NEW;
    END CASE;
    
    PERFORM log_operation(v_operation_type, v_operation_detail, v_target_type, NEW.id);
    
  ELSIF TG_OP = 'DELETE' THEN
    CASE TG_TABLE_NAME
      WHEN 'companies' THEN
        v_operation_type := 'company_delete';
        v_operation_detail := format('删除公司: %s', OLD.name);
      WHEN 'employees' THEN
        v_operation_type := 'employee_delete';
        v_operation_detail := format('删除员工: %s', OLD.name);
      WHEN 'document_templates' THEN
        v_operation_type := 'template_delete';
        v_operation_detail := format('删除文书模板: %s', OLD.name);
      WHEN 'roles' THEN
        v_operation_type := 'role_delete';
        v_operation_detail := format('删除角色: %s', OLD.name);
      ELSE
        RETURN OLD;
    END CASE;
    
    PERFORM log_operation(v_operation_type, v_operation_detail, v_target_type, OLD.id);
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;


ALTER FUNCTION public.audit_trigger_function() OWNER TO postgres;

--
-- Name: FUNCTION audit_trigger_function(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.audit_trigger_function() IS '审计触发器函数，自动记录数据变更日志';


--
-- Name: batch_generate_sign_tokens(uuid[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.batch_generate_sign_tokens(signature_ids uuid[]) RETURNS TABLE(id uuid, sign_token text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  UPDATE salary_signatures
  SET 
    sign_token = generate_sign_token(),
    sign_token_expires_at = NOW() + INTERVAL '30 days',
    status = 'sent',
    sent_at = NOW(),
    updated_at = NOW()
  WHERE salary_signatures.id = ANY(signature_ids)
  RETURNING salary_signatures.id, salary_signatures.sign_token;
END;
$$;


ALTER FUNCTION public.batch_generate_sign_tokens(signature_ids uuid[]) OWNER TO postgres;

--
-- Name: batch_update_sign_tokens(uuid[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.batch_update_sign_tokens(signature_ids uuid[]) RETURNS TABLE(id uuid, token text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  sig_id UUID;
  new_token TEXT;
BEGIN
  FOREACH sig_id IN ARRAY signature_ids
  LOOP
    -- 生成新token
    new_token := generate_sign_token();
    
    -- 更新签署记录
    UPDATE salary_signatures
    SET 
      sign_token = new_token,
      sign_token_expires_at = NOW() + INTERVAL '30 days',
      updated_at = NOW()
    WHERE salary_signatures.id = sig_id;
    
    -- 返回结果
    id := sig_id;
    token := new_token;
    RETURN NEXT;
  END LOOP;
END;
$$;


ALTER FUNCTION public.batch_update_sign_tokens(signature_ids uuid[]) OWNER TO postgres;

--
-- Name: can_access_company_data(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.can_access_company_data(user_id uuid, target_company_id uuid) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
DECLARE
  company_owner UUID;
BEGIN
  -- 超级管理员可以访问所有公司
  IF is_super_admin(user_id) THEN
    RETURN TRUE;
  END IF;
  
  -- 获取公司的当前所有者
  SELECT owner_id INTO company_owner FROM companies WHERE id = target_company_id;
  
  IF company_owner IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- 如果是所有者本人
  IF company_owner = user_id THEN
    RETURN TRUE;
  END IF;
  
  -- 如果所有者是当前用户的下级（递归）
  IF EXISTS(
    SELECT 1 FROM get_all_subordinate_ids(user_id) WHERE subordinate_id = company_owner
  ) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;


ALTER FUNCTION public.can_access_company_data(user_id uuid, target_company_id uuid) OWNER TO postgres;

--
-- Name: FUNCTION can_access_company_data(user_id uuid, target_company_id uuid); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.can_access_company_data(user_id uuid, target_company_id uuid) IS '判断用户是否可以访问某个公司的数据（创建者或其上级）';


--
-- Name: can_access_user_data(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.can_access_user_data(accessing_user_id uuid, target_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- 超级管理员可以访问所有数据
  IF is_super_admin(accessing_user_id) THEN
    RETURN true;
  END IF;
  
  -- 可以访问自己的数据
  IF accessing_user_id = target_user_id THEN
    RETURN true;
  END IF;
  
  -- 可以访问下级的数据
  IF target_user_id IN (SELECT subordinate_id FROM get_subordinates(accessing_user_id)) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;


ALTER FUNCTION public.can_access_user_data(accessing_user_id uuid, target_user_id uuid) OWNER TO postgres;

--
-- Name: FUNCTION can_access_user_data(accessing_user_id uuid, target_user_id uuid); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.can_access_user_data(accessing_user_id uuid, target_user_id uuid) IS '检查用户是否可以访问目标用户的数据（包括自己和下级）';


--
-- Name: can_view_user_data(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.can_view_user_data(viewer_id uuid, target_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  viewer_role TEXT;
BEGIN
  -- 获取查看者的角色
  SELECT role INTO viewer_role FROM profiles WHERE id = viewer_id;
  
  -- super_admin可以查看所有数据
  IF viewer_role = 'super_admin' THEN
    RETURN TRUE;
  END IF;
  
  -- 可以查看自己的数据
  IF viewer_id = target_id THEN
    RETURN TRUE;
  END IF;
  
  -- manager可以查看下级的数据
  IF viewer_role = 'manager' THEN
    RETURN EXISTS (
      SELECT 1 FROM get_subordinates(viewer_id) WHERE subordinate_id = target_id
    );
  END IF;
  
  -- 其他情况不允许查看
  RETURN FALSE;
END;
$$;


ALTER FUNCTION public.can_view_user_data(viewer_id uuid, target_id uuid) OWNER TO postgres;

--
-- Name: delete_user(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_user(user_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  result JSON;
BEGIN
  -- 检查用户是否存在
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
    RETURN json_build_object('success', false, 'error', '用户不存在');
  END IF;
  
  -- 检查是否是超级管理员
  IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND role = 'super_admin') THEN
    RETURN json_build_object('success', false, 'error', '不能删除超级管理员');
  END IF;
  
  -- 删除profiles记录
  DELETE FROM profiles WHERE id = user_id;
  
  -- 删除auth.users记录（需要service_role权限）
  DELETE FROM auth.users WHERE id = user_id;
  
  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;


ALTER FUNCTION public.delete_user(user_id uuid) OWNER TO postgres;

--
-- Name: generate_company_code(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_company_code() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  v_date_key TEXT;
  v_sequence INTEGER;
  v_code TEXT;
BEGIN
  -- 获取当前日期的key (YYYYMMDD格式)
  v_date_key := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  -- 使用SELECT FOR UPDATE锁定行，如果不存在则插入
  -- 这保证了并发安全
  INSERT INTO company_code_sequences (date_key, last_sequence)
  VALUES (v_date_key, 1)
  ON CONFLICT (date_key) 
  DO UPDATE SET 
    last_sequence = company_code_sequences.last_sequence + 1,
    updated_at = NOW()
  RETURNING last_sequence INTO v_sequence;
  
  -- 生成编码: 日期 + 3位序列号
  v_code := v_date_key || LPAD(v_sequence::TEXT, 3, '0');
  
  RETURN v_code;
END;
$$;


ALTER FUNCTION public.generate_company_code() OWNER TO postgres;

--
-- Name: FUNCTION generate_company_code(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.generate_company_code() IS '原子性生成公司编码，格式：YYYYMMDD + 3位序列号';


--
-- Name: generate_sign_token(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_sign_token() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- gen_random_bytes在extensions schema中，不需要指定schema
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;


ALTER FUNCTION public.generate_sign_token() OWNER TO postgres;

--
-- Name: get_accessible_users(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_accessible_users(user_id uuid) RETURNS TABLE(accessible_user_id uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  -- 自己
  SELECT user_id
  UNION
  -- 所有下级
  SELECT subordinate_id FROM get_subordinates(user_id);
END;
$$;


ALTER FUNCTION public.get_accessible_users(user_id uuid) OWNER TO postgres;

--
-- Name: FUNCTION get_accessible_users(user_id uuid); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.get_accessible_users(user_id uuid) IS '获取用户可以访问的所有用户ID列表（包括自己和下级）';


--
-- Name: get_all_subordinate_ids(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_all_subordinate_ids(user_id uuid) RETURNS TABLE(subordinate_id uuid)
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  WITH RECURSIVE subordinates AS (
    -- 基础情况：直接下级
    SELECT id FROM profiles WHERE manager_id = user_id
    UNION
    -- 递归情况：下级的下级
    SELECT p.id 
    FROM profiles p
    INNER JOIN subordinates s ON p.manager_id = s.id
  )
  SELECT id FROM subordinates;
$$;


ALTER FUNCTION public.get_all_subordinate_ids(user_id uuid) OWNER TO postgres;

--
-- Name: FUNCTION get_all_subordinate_ids(user_id uuid); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.get_all_subordinate_ids(user_id uuid) IS '递归获取用户的所有下级ID（包括下级的下级）';


--
-- Name: get_manager_chain(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_manager_chain(user_id uuid) RETURNS TABLE(manager_id uuid)
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  WITH RECURSIVE manager_chain AS (
    -- 基础情况：直接上级
    SELECT manager_id FROM profiles WHERE id = user_id AND manager_id IS NOT NULL
    UNION
    -- 递归情况：上级的上级
    SELECT p.manager_id 
    FROM profiles p
    INNER JOIN manager_chain mc ON p.id = mc.manager_id
    WHERE p.manager_id IS NOT NULL
  )
  SELECT manager_id FROM manager_chain;
$$;


ALTER FUNCTION public.get_manager_chain(user_id uuid) OWNER TO postgres;

--
-- Name: FUNCTION get_manager_chain(user_id uuid); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.get_manager_chain(user_id uuid) IS '递归获取用户的所有上级ID';


--
-- Name: get_subordinates(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_subordinates(user_id uuid) RETURNS TABLE(subordinate_id uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE subordinates AS (
    -- 基础查询：直接下级
    SELECT id FROM profiles WHERE manager_id = user_id
    UNION
    -- 递归查询：间接下级
    SELECT p.id FROM profiles p
    INNER JOIN subordinates s ON p.manager_id = s.id
  )
  SELECT id FROM subordinates;
END;
$$;


ALTER FUNCTION public.get_subordinates(user_id uuid) OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  user_count INTEGER;
  extracted_username TEXT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- 从email中提取用户名（去掉@miaoda.com）
  extracted_username := REPLACE(NEW.email, '@miaoda.com', '');
  
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    extracted_username,
    CASE WHEN user_count = 0 THEN 'super_admin'::user_role ELSE 'employee'::user_role END
  );
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: has_permission(uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.has_permission(user_id uuid, permission_code text) RETURNS boolean
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM profiles p
    LEFT JOIN role_permissions rp ON p.role_id = rp.role_id
    LEFT JOIN permissions perm ON rp.permission_id = perm.id
    WHERE p.id = user_id 
    AND perm.code = permission_code
  );
$$;


ALTER FUNCTION public.has_permission(user_id uuid, permission_code text) OWNER TO postgres;

--
-- Name: is_admin(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_admin(uid uuid) RETURNS boolean
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = uid AND role IN ('super_admin', 'manager')
  );
$$;


ALTER FUNCTION public.is_admin(uid uuid) OWNER TO postgres;

--
-- Name: is_super_admin(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_super_admin(uid uuid) RETURNS boolean
    LANGUAGE sql SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = uid AND role = 'super_admin'
  );
$$;


ALTER FUNCTION public.is_super_admin(uid uuid) OWNER TO postgres;

--
-- Name: log_operation(public.operation_type, text, text, uuid, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_operation(p_operation_type public.operation_type, p_operation_detail text, p_target_type text DEFAULT NULL::text, p_target_id uuid DEFAULT NULL::uuid, p_ip_address text DEFAULT NULL::text, p_user_agent text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'auth'
    AS $$
DECLARE
  v_log_id uuid;
  v_user_id uuid;
BEGIN
  -- 获取当前用户ID
  v_user_id := auth.uid();
  
  -- 如果用户未登录，跳过日志记录并返回NULL
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- 插入操作日志
  INSERT INTO operation_logs (
    user_id,
    operation_type,
    operation_detail,
    target_type,
    target_id,
    ip_address,
    user_agent
  ) VALUES (
    v_user_id,
    p_operation_type,
    p_operation_detail,
    p_target_type,
    p_target_id,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;


ALTER FUNCTION public.log_operation(p_operation_type public.operation_type, p_operation_detail text, p_target_type text, p_target_id uuid, p_ip_address text, p_user_agent text) OWNER TO postgres;

--
-- Name: FUNCTION log_operation(p_operation_type public.operation_type, p_operation_detail text, p_target_type text, p_target_id uuid, p_ip_address text, p_user_agent text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.log_operation(p_operation_type public.operation_type, p_operation_detail text, p_target_type text, p_target_id uuid, p_ip_address text, p_user_agent text) IS '记录操作日志';


--
-- Name: toggle_user_status(uuid, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.toggle_user_status(user_id uuid, new_status boolean) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  result JSON;
BEGIN
  -- 检查用户是否存在
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
    RETURN json_build_object('success', false, 'error', '用户不存在');
  END IF;
  
  -- 检查是否是超级管理员
  IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND role = 'super_admin') THEN
    RETURN json_build_object('success', false, 'error', '不能暂停超级管理员');
  END IF;
  
  -- 更新状态
  UPDATE profiles SET is_active = new_status WHERE id = user_id;
  
  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;


ALTER FUNCTION public.toggle_user_status(user_id uuid, new_status boolean) OWNER TO postgres;

--
-- Name: transfer_company(uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.transfer_company(p_company_id uuid, p_to_user_id uuid, p_reason text DEFAULT NULL::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'auth'
    AS $$
DECLARE
  v_from_user_id UUID;
  v_current_user_id UUID;
  v_can_transfer BOOLEAN;
BEGIN
  -- 获取当前用户ID
  v_current_user_id := auth.uid();
  
  -- 获取公司的当前所有者
  SELECT owner_id INTO v_from_user_id FROM companies WHERE id = p_company_id;
  
  IF v_from_user_id IS NULL THEN
    RAISE EXCEPTION '公司不存在';
  END IF;
  
  -- 检查权限：所有者本人、所有者的直接上级、超级管理员
  v_can_transfer := (
    v_from_user_id = v_current_user_id  -- 所有者本人
    OR is_super_admin(v_current_user_id)  -- 超级管理员
    OR EXISTS(  -- 所有者的直接上级
      SELECT 1 FROM profiles
      WHERE id = v_from_user_id AND manager_id = v_current_user_id
    )
  );
  
  IF NOT v_can_transfer THEN
    RAISE EXCEPTION '没有权限流转此公司';
  END IF;
  
  -- 检查目标用户是否存在
  IF NOT EXISTS(SELECT 1 FROM profiles WHERE id = p_to_user_id) THEN
    RAISE EXCEPTION '目标用户不存在';
  END IF;
  
  -- 更新公司所有者
  UPDATE companies 
  SET owner_id = p_to_user_id, updated_at = NOW()
  WHERE id = p_company_id;
  
  -- 记录流转历史
  INSERT INTO company_transfers (
    company_id, from_user_id, to_user_id, transferred_by, reason
  ) VALUES (
    p_company_id, v_from_user_id, p_to_user_id, v_current_user_id, p_reason
  );
  
  -- 记录操作日志
  PERFORM log_operation(
    'company_transfer'::operation_type,
    format('流转公司给用户: %s，原因: %s', p_to_user_id, COALESCE(p_reason, '无')),
    'company',
    p_company_id
  );
  
  RETURN TRUE;
END;
$$;


ALTER FUNCTION public.transfer_company(p_company_id uuid, p_to_user_id uuid, p_reason text) OWNER TO postgres;

--
-- Name: FUNCTION transfer_company(p_company_id uuid, p_to_user_id uuid, p_reason text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.transfer_company(p_company_id uuid, p_to_user_id uuid, p_reason text) IS '流转公司给其他用户';


--
-- Name: uid(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT auth.uid();
$$;


ALTER FUNCTION public.uid() OWNER TO postgres;

--
-- Name: update_sign_token(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_sign_token(signature_id uuid) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  new_token TEXT;
BEGIN
  -- 生成新token
  new_token := generate_sign_token();
  
  -- 更新签署记录
  UPDATE salary_signatures
  SET 
    sign_token = new_token,
    sign_token_expires_at = NOW() + INTERVAL '30 days',
    updated_at = NOW()
  WHERE id = signature_id;
  
  RETURN new_token;
END;
$$;


ALTER FUNCTION public.update_sign_token(signature_id uuid) OWNER TO postgres;

--
-- Name: update_signed_documents_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_signed_documents_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_signed_documents_updated_at() OWNER TO postgres;

--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at() OWNER TO postgres;

--
-- Name: update_user_password(uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_user_password(user_id uuid, new_password text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  result JSON;
BEGIN
  -- 检查当前用户是否是超级管理员
  IF NOT is_super_admin(uid()) THEN
    RETURN json_build_object(
      'success', false,
      'error', '只有超级管理员可以修改用户密码'
    );
  END IF;

  -- 检查密码长度
  IF LENGTH(new_password) < 6 THEN
    RETURN json_build_object(
      'success', false,
      'error', '密码长度至少6位'
    );
  END IF;

  -- 更新用户密码
  UPDATE auth.users
  SET 
    encrypted_password = crypt(new_password, gen_salt('bf')),
    updated_at = NOW()
  WHERE id = user_id;

  -- 检查是否更新成功
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', '用户不存在'
    );
  END IF;

  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;


ALTER FUNCTION public.update_user_password(user_id uuid, new_password text) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: http_request(); Type: FUNCTION; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE FUNCTION supabase_functions.http_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'supabase_functions'
    AS $$
  DECLARE
    request_id bigint;
    payload jsonb;
    url text := TG_ARGV[0]::text;
    method text := TG_ARGV[1]::text;
    headers jsonb DEFAULT '{}'::jsonb;
    params jsonb DEFAULT '{}'::jsonb;
    timeout_ms integer DEFAULT 1000;
  BEGIN
    IF url IS NULL OR url = 'null' THEN
      RAISE EXCEPTION 'url argument is missing';
    END IF;

    IF method IS NULL OR method = 'null' THEN
      RAISE EXCEPTION 'method argument is missing';
    END IF;

    IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
      headers = '{"Content-Type": "application/json"}'::jsonb;
    ELSE
      headers = TG_ARGV[2]::jsonb;
    END IF;

    IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
      params = '{}'::jsonb;
    ELSE
      params = TG_ARGV[3]::jsonb;
    END IF;

    IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
      timeout_ms = 1000;
    ELSE
      timeout_ms = TG_ARGV[4]::integer;
    END IF;

    CASE
      WHEN method = 'GET' THEN
        SELECT http_get INTO request_id FROM net.http_get(
          url,
          params,
          headers,
          timeout_ms
        );
      WHEN method = 'POST' THEN
        payload = jsonb_build_object(
          'old_record', OLD,
          'record', NEW,
          'type', TG_OP,
          'table', TG_TABLE_NAME,
          'schema', TG_TABLE_SCHEMA
        );

        SELECT http_post INTO request_id FROM net.http_post(
          url,
          payload,
          params,
          headers,
          timeout_ms
        );
      ELSE
        RAISE EXCEPTION 'method argument % is invalid', method;
    END CASE;

    INSERT INTO supabase_functions.hooks
      (hook_table_id, hook_name, request_id)
    VALUES
      (TG_RELID, TG_NAME, request_id);

    RETURN NEW;
  END
$$;


ALTER FUNCTION supabase_functions.http_request() OWNER TO supabase_functions_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: extensions; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.extensions (
    id uuid NOT NULL,
    type text,
    settings jsonb,
    tenant_external_id text,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


ALTER TABLE _realtime.extensions OWNER TO supabase_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE _realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: tenants; Type: TABLE; Schema: _realtime; Owner: supabase_admin
--

CREATE TABLE _realtime.tenants (
    id uuid NOT NULL,
    name text,
    external_id text,
    jwt_secret text,
    max_concurrent_users integer DEFAULT 200 NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    max_events_per_second integer DEFAULT 100 NOT NULL,
    postgres_cdc_default text DEFAULT 'postgres_cdc_rls'::text,
    max_bytes_per_second integer DEFAULT 100000 NOT NULL,
    max_channels_per_client integer DEFAULT 100 NOT NULL,
    max_joins_per_second integer DEFAULT 500 NOT NULL,
    suspend boolean DEFAULT false,
    jwt_jwks jsonb,
    notify_private_alpha boolean DEFAULT false,
    private_only boolean DEFAULT false NOT NULL,
    migrations_ran integer DEFAULT 0,
    broadcast_adapter character varying(255) DEFAULT 'gen_rpc'::character varying,
    max_presence_events_per_second integer DEFAULT 1000,
    max_payload_size_in_kb integer DEFAULT 3000,
    max_client_presence_events_per_window integer,
    client_presence_window_ms integer,
    presence_enabled boolean DEFAULT false NOT NULL,
    CONSTRAINT jwt_secret_or_jwt_jwks_required CHECK (((jwt_secret IS NOT NULL) OR (jwt_jwks IS NOT NULL)))
);


ALTER TABLE _realtime.tenants OWNER TO supabase_admin;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    month text NOT NULL,
    work_days numeric DEFAULT 0,
    absent_days numeric DEFAULT 0,
    late_times numeric DEFAULT 0,
    leave_days numeric DEFAULT 0,
    overtime_hours numeric DEFAULT 0,
    remarks text,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now(),
    pdf_url text
);


ALTER TABLE public.attendance_records OWNER TO postgres;

--
-- Name: COLUMN attendance_records.pdf_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.attendance_records.pdf_url IS '考勤确认表PDF文件URL';


--
-- Name: attendance_signatures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_signatures (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    company_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    attendance_record_id uuid NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    sent_at timestamp with time zone,
    signed_at timestamp with time zone,
    sign_token text,
    sign_token_expires_at timestamp with time zone,
    signature_data text,
    reject_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT attendance_signatures_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'signed'::text, 'rejected'::text])))
);


ALTER TABLE public.attendance_signatures OWNER TO postgres;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    contact_person text NOT NULL,
    contact_phone text NOT NULL,
    address text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    service_start_date date NOT NULL,
    service_end_date date NOT NULL,
    payday_date integer NOT NULL,
    created_by uuid,
    owner_id uuid NOT NULL,
    industry text DEFAULT '其他'::text,
    region text DEFAULT '湖北省'::text,
    employee_scale text DEFAULT '0-50人'::text,
    service_status text DEFAULT '服务中'::text,
    credit_no character varying(255),
    legal_person character varying(255),
    CONSTRAINT payday_date_range CHECK (((payday_date >= 1) AND (payday_date <= 31)))
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: COLUMN companies.service_start_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.companies.service_start_date IS '服务开始日期';


--
-- Name: COLUMN companies.service_end_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.companies.service_end_date IS '服务结束日期';


--
-- Name: COLUMN companies.payday_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.companies.payday_date IS '每月发薪日（1-31），如15表示每月15号发薪';


--
-- Name: COLUMN companies.created_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.companies.created_by IS '公司创建者ID';


--
-- Name: COLUMN companies.owner_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.companies.owner_id IS '公司当前所有者ID';


--
-- Name: COLUMN companies.industry; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.companies.industry IS '所属行业';


--
-- Name: COLUMN companies.region; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.companies.region IS '所在地域';


--
-- Name: COLUMN companies.employee_scale; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.companies.employee_scale IS '员工规模：0-50人、51-200人、201-500人、500人以上';


--
-- Name: COLUMN companies.service_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.companies.service_status IS '服务状态：服务中、已到期、已暂停';


--
-- Name: COLUMN companies.credit_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.companies.credit_no IS '统一社会信用代码';


--
-- Name: COLUMN companies.legal_person; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.companies.legal_person IS '法定代表人';


--
-- Name: company_code_sequences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_code_sequences (
    date_key text NOT NULL,
    last_sequence integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.company_code_sequences OWNER TO postgres;

--
-- Name: TABLE company_code_sequences; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.company_code_sequences IS '公司编码序列表，用于生成唯一的公司编码';


--
-- Name: company_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_transfers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    from_user_id uuid NOT NULL,
    to_user_id uuid NOT NULL,
    transferred_by uuid NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.company_transfers OWNER TO postgres;

--
-- Name: TABLE company_transfers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.company_transfers IS '公司流转历史记录表';


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
-- Name: company_transfer_history; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.company_transfer_history WITH (security_invoker='true') AS
 SELECT ct.id,
    ct.company_id,
    c.name AS company_name,
    c.code AS company_code,
    ct.from_user_id,
    pf.username AS from_username,
    pf.full_name AS from_full_name,
    ct.to_user_id,
    pt.username AS to_username,
    pt.full_name AS to_full_name,
    ct.transferred_by,
    pb.username AS transferred_by_username,
    pb.full_name AS transferred_by_full_name,
    ct.reason,
    ct.created_at
   FROM ((((public.company_transfers ct
     JOIN public.companies c ON ((ct.company_id = c.id)))
     LEFT JOIN public.profiles pf ON ((ct.from_user_id = pf.id)))
     LEFT JOIN public.profiles pt ON ((ct.to_user_id = pt.id)))
     LEFT JOIN public.profiles pb ON ((ct.transferred_by = pb.id)));


ALTER VIEW public.company_transfer_history OWNER TO postgres;

--
-- Name: document_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid,
    name text NOT NULL,
    category public.document_category NOT NULL,
    content text,
    requires_company_signature boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.document_templates OWNER TO postgres;

--
-- Name: COLUMN document_templates.company_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.document_templates.company_id IS '所属公司ID，NULL表示通用模板（所有公司可用）';


--
-- Name: employee_document_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_document_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    company_id uuid NOT NULL,
    document_type text NOT NULL,
    document_name text NOT NULL,
    template_category text,
    signed_at timestamp with time zone,
    signed_year integer,
    file_url text,
    signing_record_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.employee_document_records OWNER TO postgres;

--
-- Name: TABLE employee_document_records; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.employee_document_records IS '员工文书签署记录表';


--
-- Name: COLUMN employee_document_records.document_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_document_records.document_type IS '文书类型：劳动合同、保密协议、员工手册等';


--
-- Name: COLUMN employee_document_records.document_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_document_records.document_name IS '文书名称';


--
-- Name: COLUMN employee_document_records.template_category; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_document_records.template_category IS '文书模板大类：入职管理、在职管理、离职管理等';


--
-- Name: COLUMN employee_document_records.signed_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_document_records.signed_at IS '签署时间';


--
-- Name: COLUMN employee_document_records.signed_year; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_document_records.signed_year IS '签署年份（用于筛选）';


--
-- Name: COLUMN employee_document_records.signing_record_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employee_document_records.signing_record_id IS '关联的签署记录ID';


--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    name text NOT NULL,
    phone text,
    "position" text,
    department text,
    status public.employee_status DEFAULT 'active'::public.employee_status NOT NULL,
    hire_date date,
    contract_start_date date,
    contract_end_date date NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    address text,
    gender text NOT NULL,
    birth_date date NOT NULL,
    id_card_type text DEFAULT '身份证'::text NOT NULL,
    household_address text,
    insurance_start_date date,
    id_card_number text,
    contract_count integer DEFAULT 0,
    employee_number text
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: COLUMN employees.address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employees.address IS '员工住址';


--
-- Name: COLUMN employees.gender; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employees.gender IS '性别';


--
-- Name: COLUMN employees.birth_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employees.birth_date IS '出生年月日';


--
-- Name: COLUMN employees.id_card_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employees.id_card_type IS '身份证号码输入类型';


--
-- Name: COLUMN employees.household_address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employees.household_address IS '户籍地址';


--
-- Name: COLUMN employees.insurance_start_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employees.insurance_start_date IS '五险参保时间';


--
-- Name: COLUMN employees.id_card_number; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employees.id_card_number IS '身份证号码';


--
-- Name: COLUMN employees.contract_count; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.employees.contract_count IS '劳动合同签订次数';


--
-- Name: labor_contract_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.labor_contract_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    company_id uuid NOT NULL,
    contract_number integer NOT NULL,
    start_date date NOT NULL,
    end_date date,
    contract_type text DEFAULT '固定期限'::text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.labor_contract_history OWNER TO postgres;

--
-- Name: TABLE labor_contract_history; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.labor_contract_history IS '劳动合同历史记录表';


--
-- Name: COLUMN labor_contract_history.contract_number; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.labor_contract_history.contract_number IS '第几次合同';


--
-- Name: COLUMN labor_contract_history.start_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.labor_contract_history.start_date IS '合同开始日期';


--
-- Name: COLUMN labor_contract_history.end_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.labor_contract_history.end_date IS '合同结束日期（无固定期限时为空）';


--
-- Name: COLUMN labor_contract_history.contract_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.labor_contract_history.contract_type IS '合同类型：固定期限、无固定期限';


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    type public.notification_type NOT NULL,
    title text NOT NULL,
    content text,
    is_read boolean DEFAULT false,
    related_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: operation_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.operation_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    operation_type public.operation_type NOT NULL,
    operation_detail text NOT NULL,
    target_type text,
    target_id uuid,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.operation_logs OWNER TO postgres;

--
-- Name: TABLE operation_logs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.operation_logs IS '操作日志表';


--
-- Name: COLUMN operation_logs.user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.operation_logs.user_id IS '操作用户ID';


--
-- Name: COLUMN operation_logs.operation_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.operation_logs.operation_type IS '操作类型';


--
-- Name: COLUMN operation_logs.operation_detail; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.operation_logs.operation_detail IS '操作详情';


--
-- Name: COLUMN operation_logs.target_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.operation_logs.target_type IS '目标对象类型（如company、employee等）';


--
-- Name: COLUMN operation_logs.target_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.operation_logs.target_id IS '目标对象ID';


--
-- Name: COLUMN operation_logs.ip_address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.operation_logs.ip_address IS 'IP地址';


--
-- Name: COLUMN operation_logs.user_agent; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.operation_logs.user_agent IS '用户代理';


--
-- Name: COLUMN operation_logs.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.operation_logs.created_at IS '操作时间';


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: TABLE permissions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.permissions IS '系统权限表，存储所有可分配的权限项';


--
-- Name: COLUMN permissions.code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.permissions.code IS '权限代码，唯一标识';


--
-- Name: COLUMN permissions.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.permissions.name IS '权限名称，用于显示';


--
-- Name: COLUMN permissions.description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.permissions.description IS '权限描述，说明权限的作用';


--
-- Name: reminder_configs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reminder_configs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    contract_expiry_days integer DEFAULT 30,
    enable_sms boolean DEFAULT true,
    enable_in_app boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    renewal_notice_days integer DEFAULT 7,
    CONSTRAINT reminder_configs_renewal_notice_days_check CHECK (((renewal_notice_days >= 1) AND (renewal_notice_days <= 365)))
);


ALTER TABLE public.reminder_configs OWNER TO postgres;

--
-- Name: COLUMN reminder_configs.renewal_notice_days; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.reminder_configs.renewal_notice_days IS '续签通知提前天数，在合同到期前多少天发送续签通知';


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: TABLE role_permissions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.role_permissions IS '角色权限关联表，存储角色和权限的多对多关系';


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    company_id uuid,
    is_system_role boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: salary_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    salary_record_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    employee_name text NOT NULL,
    employee_number text,
    data jsonb NOT NULL,
    total_amount numeric(15,2) NOT NULL,
    is_sent boolean DEFAULT false,
    sent_at timestamp with time zone,
    is_viewed boolean DEFAULT false,
    viewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    pdf_url text
);


ALTER TABLE public.salary_items OWNER TO postgres;

--
-- Name: TABLE salary_items; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.salary_items IS '工资条明细表';


--
-- Name: COLUMN salary_items.pdf_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_items.pdf_url IS '工资条PDF文件URL';


--
-- Name: salary_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    template_id uuid,
    year integer NOT NULL,
    month integer NOT NULL,
    file_name text,
    file_url text,
    total_amount numeric(15,2),
    employee_count integer,
    status text DEFAULT 'pending'::text,
    uploaded_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    pdf_generated boolean DEFAULT false,
    pdf_generation_error text
);


ALTER TABLE public.salary_records OWNER TO postgres;

--
-- Name: TABLE salary_records; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.salary_records IS '工资记录表';


--
-- Name: COLUMN salary_records.pdf_generated; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_records.pdf_generated IS 'PDF是否已生成';


--
-- Name: COLUMN salary_records.pdf_generation_error; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_records.pdf_generation_error IS 'PDF生成错误信息';


--
-- Name: salary_signatures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_signatures (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    company_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    type public.salary_signature_type NOT NULL,
    reference_id uuid NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    status public.salary_signature_status DEFAULT 'pending'::public.salary_signature_status NOT NULL,
    sent_at timestamp with time zone,
    signed_at timestamp with time zone,
    signature_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    sign_token text,
    sign_token_expires_at timestamp with time zone,
    original_file_url text,
    signed_file_url text,
    signature_data text,
    reject_reason text
);


ALTER TABLE public.salary_signatures OWNER TO postgres;

--
-- Name: TABLE salary_signatures; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.salary_signatures IS '薪酬签署记录表';


--
-- Name: COLUMN salary_signatures.type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_signatures.type IS '签署类型：salary_slip工资条、attendance_record考勤确认表';


--
-- Name: COLUMN salary_signatures.reference_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_signatures.reference_id IS '关联的工资记录或考勤记录ID';


--
-- Name: COLUMN salary_signatures.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_signatures.status IS '签署状态：pending待签署、sent已发送、signed已签署、rejected已拒签';


--
-- Name: COLUMN salary_signatures.sign_token; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_signatures.sign_token IS '签署token，用于生成签署链接';


--
-- Name: COLUMN salary_signatures.sign_token_expires_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_signatures.sign_token_expires_at IS '签署token过期时间';


--
-- Name: COLUMN salary_signatures.original_file_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_signatures.original_file_url IS '原始文件URL（工资条或考勤表PDF）';


--
-- Name: COLUMN salary_signatures.signed_file_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_signatures.signed_file_url IS '签署后的文件URL';


--
-- Name: COLUMN salary_signatures.signature_data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_signatures.signature_data IS '签名数据（JSON格式，包含签名图片等）';


--
-- Name: COLUMN salary_signatures.reject_reason; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_signatures.reject_reason IS '拒签原因';


--
-- Name: salary_structure_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_structure_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid,
    name text NOT NULL,
    description text,
    fields jsonb NOT NULL,
    is_default boolean DEFAULT false,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    pdf_template_config jsonb DEFAULT '{"title": "工资条", "font_size": 10, "footer_text": "本工资条仅供个人查阅，请妥善保管", "show_period": true, "header_color": "#1e40af", "signature_label": "员工签名", "show_company_logo": true, "show_company_name": true, "show_signature_area": true}'::jsonb,
    is_universal boolean DEFAULT false
);


ALTER TABLE public.salary_structure_templates OWNER TO postgres;

--
-- Name: TABLE salary_structure_templates; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.salary_structure_templates IS '工资结构模板表，支持通用模板（company_id为NULL）和公司专属模板';


--
-- Name: COLUMN salary_structure_templates.company_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_structure_templates.company_id IS '所属公司ID，NULL表示通用模板，所有公司都可使用';


--
-- Name: COLUMN salary_structure_templates.fields; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_structure_templates.fields IS '工资结构字段定义JSON';


--
-- Name: COLUMN salary_structure_templates.pdf_template_config; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_structure_templates.pdf_template_config IS 'PDF模板配置（JSON格式）：标题、样式、布局等';


--
-- Name: COLUMN salary_structure_templates.is_universal; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.salary_structure_templates.is_universal IS '是否为通用模板，通用模板可被所有公司使用';


--
-- Name: signed_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signed_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    signing_record_id uuid NOT NULL,
    template_id uuid NOT NULL,
    template_name text NOT NULL,
    file_url text,
    file_size integer,
    signed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.signed_documents OWNER TO postgres;

--
-- Name: TABLE signed_documents; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.signed_documents IS '已签署文件表，存储每份具体的签署文件';


--
-- Name: COLUMN signed_documents.signing_record_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signed_documents.signing_record_id IS '关联的签署记录ID';


--
-- Name: COLUMN signed_documents.template_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signed_documents.template_id IS '文书模板ID';


--
-- Name: COLUMN signed_documents.template_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signed_documents.template_name IS '文书名称（冗余存储，便于查询）';


--
-- Name: COLUMN signed_documents.file_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signed_documents.file_url IS '已签署文件的URL';


--
-- Name: COLUMN signed_documents.file_size; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signed_documents.file_size IS '文件大小（字节）';


--
-- Name: COLUMN signed_documents.signed_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signed_documents.signed_at IS '签署完成时间';


--
-- Name: signing_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signing_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    template_ids uuid[] NOT NULL,
    status public.signing_status DEFAULT 'pending'::public.signing_status NOT NULL,
    employee_signed_at timestamp with time zone,
    company_signed_at timestamp with time zone,
    third_party_signing_id text,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    signed_file_url text,
    employee_form_data jsonb,
    company_form_data jsonb,
    signing_mode public.signing_mode DEFAULT 'electronic'::public.signing_mode,
    uploaded_at timestamp with time zone,
    uploaded_by text,
    third_party_contract_no text,
    third_party_contract_name text
);


ALTER TABLE public.signing_records OWNER TO postgres;

--
-- Name: COLUMN signing_records.signed_file_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signing_records.signed_file_url IS '已签署文件的URL，存储在Supabase Storage中';


--
-- Name: COLUMN signing_records.employee_form_data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signing_records.employee_form_data IS '员工表单数据（JSON格式）：姓名、身份证、手机、邮箱、部门、岗位、入职日期、合同期限等';


--
-- Name: COLUMN signing_records.company_form_data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signing_records.company_form_data IS '公司表单数据（JSON格式）：公司名称、统一信用代码、地址、联系人、联系电话、法定代表人等';


--
-- Name: COLUMN signing_records.signing_mode; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signing_records.signing_mode IS '签署模式：electronic=电子签，offline=线下签署';


--
-- Name: COLUMN signing_records.uploaded_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signing_records.uploaded_at IS '附件上传时间';


--
-- Name: COLUMN signing_records.uploaded_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.signing_records.uploaded_by IS '附件上传人ID';


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_03_20; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_20 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_20 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_21; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_21 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_21 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_22; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_22 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_22 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_23; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_23 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_23 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_24; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_24 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_24 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_25; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_25 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_25 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_26; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_26 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_26 OWNER TO supabase_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: iceberg_namespaces; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.iceberg_namespaces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_name text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    catalog_id uuid NOT NULL
);


ALTER TABLE storage.iceberg_namespaces OWNER TO supabase_storage_admin;

--
-- Name: iceberg_tables; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.iceberg_tables (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    namespace_id uuid NOT NULL,
    bucket_name text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    location text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    remote_table_id text,
    shard_key text,
    shard_id text,
    catalog_id uuid NOT NULL
);


ALTER TABLE storage.iceberg_tables OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: hooks; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.hooks (
    id bigint NOT NULL,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    request_id bigint
);


ALTER TABLE supabase_functions.hooks OWNER TO supabase_functions_admin;

--
-- Name: TABLE hooks; Type: COMMENT; Schema: supabase_functions; Owner: supabase_functions_admin
--

COMMENT ON TABLE supabase_functions.hooks IS 'Supabase Functions Hooks: Audit trail for triggered hooks.';


--
-- Name: hooks_id_seq; Type: SEQUENCE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE SEQUENCE supabase_functions.hooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE supabase_functions.hooks_id_seq OWNER TO supabase_functions_admin;

--
-- Name: hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER SEQUENCE supabase_functions.hooks_id_seq OWNED BY supabase_functions.hooks.id;


--
-- Name: migrations; Type: TABLE; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE TABLE supabase_functions.migrations (
    version text NOT NULL,
    inserted_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE supabase_functions.migrations OWNER TO supabase_functions_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: messages_2026_03_20; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_20 FOR VALUES FROM ('2026-03-20 00:00:00') TO ('2026-03-21 00:00:00');


--
-- Name: messages_2026_03_21; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_21 FOR VALUES FROM ('2026-03-21 00:00:00') TO ('2026-03-22 00:00:00');


--
-- Name: messages_2026_03_22; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_22 FOR VALUES FROM ('2026-03-22 00:00:00') TO ('2026-03-23 00:00:00');


--
-- Name: messages_2026_03_23; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_23 FOR VALUES FROM ('2026-03-23 00:00:00') TO ('2026-03-24 00:00:00');


--
-- Name: messages_2026_03_24; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_24 FOR VALUES FROM ('2026-03-24 00:00:00') TO ('2026-03-25 00:00:00');


--
-- Name: messages_2026_03_25; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_25 FOR VALUES FROM ('2026-03-25 00:00:00') TO ('2026-03-26 00:00:00');


--
-- Name: messages_2026_03_26; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_26 FOR VALUES FROM ('2026-03-26 00:00:00') TO ('2026-03-27 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: hooks id; Type: DEFAULT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks ALTER COLUMN id SET DEFAULT nextval('supabase_functions.hooks_id_seq'::regclass);


--
-- Data for Name: extensions; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.extensions (id, type, settings, tenant_external_id, inserted_at, updated_at) FROM stdin;
f5e4e72c-396b-4805-95b3-fbd98ebb7e8a	postgres_cdc_rls	{"region": "us-east-1", "db_host": "0A+yRLWVNpeKz0UAE52RgsKa28rIoNHbwpJuIDvrkJE=", "db_name": "sWBpZNdjggEPTQVlI52Zfw==", "db_port": "+enMDFi1J/3IrrquHHwUmA==", "db_user": "uxbEq/zz8DXVD53TOI1zmw==", "slot_name": "supabase_realtime_replication_slot", "db_password": "sWBpZNdjggEPTQVlI52Zfw==", "publication": "supabase_realtime", "ssl_enforced": false, "poll_interval_ms": 100, "poll_max_changes": 100, "poll_max_record_bytes": 1048576}	realtime-dev	2026-03-23 06:47:23	2026-03-23 06:47:23
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.schema_migrations (version, inserted_at) FROM stdin;
20210706140551	2026-03-17 09:53:29
20220329161857	2026-03-17 09:53:29
20220410212326	2026-03-17 09:53:29
20220506102948	2026-03-17 09:53:29
20220527210857	2026-03-17 09:53:29
20220815211129	2026-03-17 09:53:29
20220815215024	2026-03-17 09:53:29
20220818141501	2026-03-17 09:53:29
20221018173709	2026-03-17 09:53:29
20221102172703	2026-03-17 09:53:29
20221223010058	2026-03-17 09:53:29
20230110180046	2026-03-17 09:53:29
20230810220907	2026-03-17 09:53:29
20230810220924	2026-03-17 09:53:29
20231024094642	2026-03-17 09:53:29
20240306114423	2026-03-17 09:53:29
20240418082835	2026-03-17 09:53:29
20240625211759	2026-03-17 09:53:29
20240704172020	2026-03-17 09:53:29
20240902173232	2026-03-17 09:53:29
20241106103258	2026-03-17 09:53:29
20250424203323	2026-03-17 09:53:29
20250613072131	2026-03-17 09:53:29
20250711044927	2026-03-17 09:53:29
20250811121559	2026-03-17 09:53:29
20250926223044	2026-03-17 09:53:29
20251204170944	2026-03-17 09:53:29
20251218000543	2026-03-17 09:53:29
20260209232800	2026-03-17 09:53:29
20260304000000	2026-03-17 09:53:29
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.tenants (id, name, external_id, jwt_secret, max_concurrent_users, inserted_at, updated_at, max_events_per_second, postgres_cdc_default, max_bytes_per_second, max_channels_per_client, max_joins_per_second, suspend, jwt_jwks, notify_private_alpha, private_only, migrations_ran, broadcast_adapter, max_presence_events_per_second, max_payload_size_in_kb, max_client_presence_events_per_window, client_presence_window_ms, presence_enabled) FROM stdin;
33acb68b-7ede-4744-8214-224d537899b2	realtime-dev	realtime-dev	iNjicxc4+llvc9wovDvqymwfnj9teWMlyOIbJ8Fh6j2WNU8CIJ2ZgjR6MUIKqSmeDmvpsKLsZ9jgXJmQPpwL8w==	200	2026-03-23 06:47:23	2026-03-23 06:47:23	100	postgres_cdc_rls	100000	100	100	f	{"keys": [{"x": "M5Sjqn5zwC9Kl1zVfUUGvv9boQjCGd45G8sdopBExB4", "y": "P6IXMvA2WYXSHSOMTBH2jsw_9rrzGy89FjPf6oOsIxQ", "alg": "ES256", "crv": "P-256", "ext": true, "kid": "b81269f1-21d8-4f2e-b719-c2240a840d90", "kty": "EC", "use": "sig", "key_ops": ["verify"]}, {"k": "c3VwZXItc2VjcmV0LWp3dC10b2tlbi13aXRoLWF0LWxlYXN0LTMyLWNoYXJhY3RlcnMtbG9uZw", "kty": "oct"}]}	f	f	68	gen_rpc	1000	3000	\N	\N	f
\.


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	908b9754-91d1-4c3d-aac9-d7aa3a652c16	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"15897752509@jiutouniao.local","user_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","user_phone":""}}	2026-03-17 10:55:37.746445+00	
00000000-0000-0000-0000-000000000000	361c995b-4b2c-410b-a3c5-c7c03df1ba34	{"action":"login","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-17 11:01:11.758345+00	
00000000-0000-0000-0000-000000000000	c37b215d-bc78-4dec-8c78-3fc98c29fdcd	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-17 12:01:05.430189+00	
00000000-0000-0000-0000-000000000000	8d334db1-b1ac-427b-bc69-1948c48522d8	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-17 12:01:05.433919+00	
00000000-0000-0000-0000-000000000000	4bca9587-9912-475f-bacd-c8fd8a945a34	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-17 13:00:05.43641+00	
00000000-0000-0000-0000-000000000000	07df08b9-af5e-4199-8929-c8f85437da23	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-17 13:00:05.438261+00	
00000000-0000-0000-0000-000000000000	90a75dcc-e858-40a1-9ba0-4eb1fb71e75f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-17 13:59:05.486926+00	
00000000-0000-0000-0000-000000000000	17f5cf7c-66ca-4897-9be9-9a6666d7c108	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-17 13:59:05.489808+00	
00000000-0000-0000-0000-000000000000	62b8e7fd-c999-4c6a-b4c1-d8340eb759f0	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-17 14:22:26.612889+00	
00000000-0000-0000-0000-000000000000	4155a71d-198d-4bfb-a00d-77df448894e1	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-17 14:22:26.614197+00	
00000000-0000-0000-0000-000000000000	f18bcf90-c46b-4a8a-9342-1aa30ec9d8b1	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 05:44:30.038487+00	
00000000-0000-0000-0000-000000000000	8e788841-6a44-4da4-9336-45f859d609a8	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 05:44:30.062215+00	
00000000-0000-0000-0000-000000000000	601e6ff5-ab93-43d8-a2a0-16a578933c1e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 06:42:59.214556+00	
00000000-0000-0000-0000-000000000000	64684ef8-eefc-46ad-8df2-3e66736b4c30	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 06:42:59.21789+00	
00000000-0000-0000-0000-000000000000	53611e5f-b09b-4aaa-ad18-ce38ba1e7c83	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 07:41:55.260156+00	
00000000-0000-0000-0000-000000000000	12941055-90f4-4f71-a1ec-050fc29eb117	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 07:41:55.263686+00	
00000000-0000-0000-0000-000000000000	bde99340-5ac3-4bb6-b276-16fcc39dd285	{"action":"login","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-18 08:52:23.801582+00	
00000000-0000-0000-0000-000000000000	c192ca7f-a5fc-454a-9a17-4379b448d19b	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 11:16:57.046685+00	
00000000-0000-0000-0000-000000000000	d1597215-5980-4957-9f17-98d1a7886a9f	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 11:16:57.049681+00	
00000000-0000-0000-0000-000000000000	fdd1f1ef-9ccd-448a-a9d0-95579926e1c0	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 12:15:33.262962+00	
00000000-0000-0000-0000-000000000000	f8543f73-a36a-463c-84de-2a677ce8d555	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 12:15:33.265101+00	
00000000-0000-0000-0000-000000000000	bf8168c8-eeab-40dc-ae96-73a9b4c7a21c	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 13:14:33.253816+00	
00000000-0000-0000-0000-000000000000	11a3f59a-5e65-4319-b26c-17609b4ae80d	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 13:14:33.255021+00	
00000000-0000-0000-0000-000000000000	34f6b692-96a5-4b45-b5d1-1681470abdd7	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 14:13:33.28604+00	
00000000-0000-0000-0000-000000000000	a42efaf0-f2ae-4c5f-86d2-b2358b386191	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 14:13:33.287716+00	
00000000-0000-0000-0000-000000000000	f4206655-e19f-4123-b98e-6c645be9be90	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 14:23:56.576541+00	
00000000-0000-0000-0000-000000000000	2fcde097-70cd-486c-a1e3-1c522e82b2c0	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 14:23:56.578041+00	
00000000-0000-0000-0000-000000000000	2a13f4b7-674f-44eb-8c62-313d11d9559a	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 14:23:56.864652+00	
00000000-0000-0000-0000-000000000000	6981c0d2-8c1c-4672-b5c7-36c1710b9566	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 14:23:56.865431+00	
00000000-0000-0000-0000-000000000000	ed60e2af-0fab-4526-b968-60d051585828	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 14:23:57.467047+00	
00000000-0000-0000-0000-000000000000	5e72b997-7f53-4a9a-8c65-35c80aa734d2	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 14:23:57.46785+00	
00000000-0000-0000-0000-000000000000	2e3a56c3-76a6-4a70-a202-45ac32d135fc	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 14:23:58.067463+00	
00000000-0000-0000-0000-000000000000	5b9d16cf-9fd7-4fb2-ac61-8cb65726343c	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 14:23:58.068861+00	
00000000-0000-0000-0000-000000000000	00f2acc3-8531-46e3-ba98-324898306d83	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 16:24:21.238093+00	
00000000-0000-0000-0000-000000000000	7388f973-6b95-4a8b-a3f1-f693e0e954a3	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-18 16:24:21.238942+00	
00000000-0000-0000-0000-000000000000	29443205-c341-4ea9-80c8-5822f616f7d7	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 01:29:25.241304+00	
00000000-0000-0000-0000-000000000000	02f46e3e-59ec-40bc-9f3b-e7f280ff2fb1	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 01:29:25.242433+00	
00000000-0000-0000-0000-000000000000	de43a304-3f1a-49aa-b09e-67c6a573bc5a	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 02:28:26.085437+00	
00000000-0000-0000-0000-000000000000	8095674c-a7ba-41af-90fe-8b5868bcfaf2	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 02:28:26.087051+00	
00000000-0000-0000-0000-000000000000	dfbf9d68-eb3a-4d14-85d2-afa95b63e508	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 03:26:42.630828+00	
00000000-0000-0000-0000-000000000000	0d343bf8-0574-4a08-9153-fdb697759274	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 03:26:42.632775+00	
00000000-0000-0000-0000-000000000000	90665bbb-dbc9-4762-af3a-b066b7861893	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 04:25:26.19823+00	
00000000-0000-0000-0000-000000000000	3455c4ec-82dd-4da7-8860-7fc8d0909dbf	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 04:25:26.20157+00	
00000000-0000-0000-0000-000000000000	db1381b7-cab0-47eb-b368-226458509bf4	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 05:25:04.863881+00	
00000000-0000-0000-0000-000000000000	10e5ebc8-8f16-4957-92dd-b7767a34aea2	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 05:25:04.865188+00	
00000000-0000-0000-0000-000000000000	1796b321-2772-4fe0-ba7c-a375468d9592	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 06:24:26.09851+00	
00000000-0000-0000-0000-000000000000	c85d6e4e-beb9-42b9-a8e4-367f9f108dcd	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 06:24:26.100185+00	
00000000-0000-0000-0000-000000000000	7755eb37-ed0b-4453-9499-c18b587d3c29	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 07:23:26.115478+00	
00000000-0000-0000-0000-000000000000	352fcd6a-0140-4574-8183-ca33abd3aaa3	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 07:23:26.119473+00	
00000000-0000-0000-0000-000000000000	cbf1889c-dd67-4d34-bc09-c51288b047b0	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 09:15:04.004803+00	
00000000-0000-0000-0000-000000000000	f7e93067-2836-4c1d-b3d2-bfba6fa279a5	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 09:15:04.006764+00	
00000000-0000-0000-0000-000000000000	7e4a212b-142f-4206-91bf-9b245bd725f0	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:13.027622+00	
00000000-0000-0000-0000-000000000000	00482c4c-af19-4e8c-9305-6a6021cb67cd	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:13.03042+00	
00000000-0000-0000-0000-000000000000	36502ce5-4755-4ba2-a11c-cf278cd5bf0e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:13.181886+00	
00000000-0000-0000-0000-000000000000	995a17f3-6cc0-4092-bdb9-516e3eb1a1e6	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:13.182741+00	
00000000-0000-0000-0000-000000000000	b6f618c8-97e2-484d-b7c8-b87b0e82c2ff	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:13.515066+00	
00000000-0000-0000-0000-000000000000	865ec492-e72d-416a-987a-4a7eb6aa9e6c	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:13.516129+00	
00000000-0000-0000-0000-000000000000	69f4b875-c50f-4731-b25d-5ca35282ad67	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:13.623617+00	
00000000-0000-0000-0000-000000000000	00ceba0d-0976-482a-87c6-3e4409f224bb	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:13.624825+00	
00000000-0000-0000-0000-000000000000	e2366387-a96d-4135-be84-603bdc428325	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:13.790649+00	
00000000-0000-0000-0000-000000000000	d0799f7f-b763-471b-9792-4e64fb57678d	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:13.791588+00	
00000000-0000-0000-0000-000000000000	11157cfb-c750-407a-a744-70e79973d03a	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:14.104894+00	
00000000-0000-0000-0000-000000000000	f6b0a4ca-78a6-400b-aadd-130a7bdf5742	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:14.109111+00	
00000000-0000-0000-0000-000000000000	c4722cab-a53f-4369-9a87-1f7bb93e0bc5	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:14.352769+00	
00000000-0000-0000-0000-000000000000	3629ba70-95c5-4495-8bb6-235a01b0268e	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:14.355381+00	
00000000-0000-0000-0000-000000000000	83e6b9c2-ab63-42b1-82f1-32af4400d7f9	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:14.575286+00	
00000000-0000-0000-0000-000000000000	04fcdc70-6f8a-4ac2-ba4b-3e7e7a334f86	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:14.57733+00	
00000000-0000-0000-0000-000000000000	6d155e56-4655-4663-957d-8090e4d8b505	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:14.809775+00	
00000000-0000-0000-0000-000000000000	84d25ef0-2fa5-4bf8-b2e6-0b4c5514e397	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:14.810883+00	
00000000-0000-0000-0000-000000000000	2f6ad404-5f05-43d6-8e3d-2f58d9525d4c	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:14.977407+00	
00000000-0000-0000-0000-000000000000	c07065c4-c2d1-413b-acbb-3bd826dda8f6	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:14.978939+00	
00000000-0000-0000-0000-000000000000	034a6243-5f0b-4cf4-baeb-3624d94ac1ff	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:15.233112+00	
00000000-0000-0000-0000-000000000000	b842523b-0772-4e19-a5b1-274df56eee77	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:15.234826+00	
00000000-0000-0000-0000-000000000000	a86a03da-2b79-4e72-9459-bd4b358cdcb6	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:15.416899+00	
00000000-0000-0000-0000-000000000000	f84b21f3-a509-427d-968f-9378ea323ea8	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:15.418146+00	
00000000-0000-0000-0000-000000000000	4139b099-d937-47a5-89cf-26386556fea6	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:16.029665+00	
00000000-0000-0000-0000-000000000000	08893b65-132b-4f12-a73b-29001152ea2b	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:16.030991+00	
00000000-0000-0000-0000-000000000000	ef3475ec-26ba-4ae6-b453-cbfe6e25c902	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:16.168408+00	
00000000-0000-0000-0000-000000000000	4438ec31-a937-43d1-ad98-b06e72d06dd9	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 10:02:16.171043+00	
00000000-0000-0000-0000-000000000000	4114b18b-b378-4d9f-af77-c26a6f62f748	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 11:36:23.839766+00	
00000000-0000-0000-0000-000000000000	f4892caa-02b3-452e-a80e-698edad1d068	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 11:36:23.840951+00	
00000000-0000-0000-0000-000000000000	2c2e33be-4b91-4c75-91e3-6e3e3f66f0e3	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 12:35:20.104562+00	
00000000-0000-0000-0000-000000000000	e789497a-c604-4cd3-9e78-5c18cab030dc	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 12:35:20.107957+00	
00000000-0000-0000-0000-000000000000	8cf382c4-f6c9-4472-b93c-639504eb9ab6	{"action":"login","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-19 13:27:26.289285+00	
00000000-0000-0000-0000-000000000000	dda96a58-76d9-4e41-ae2e-9209c0e975f6	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 13:35:10.386276+00	
00000000-0000-0000-0000-000000000000	7a933039-031f-42b5-aeac-db45c65819f5	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 13:35:10.390004+00	
00000000-0000-0000-0000-000000000000	72f6d1e6-6e4f-4cab-ad19-5a647369d7f7	{"action":"login","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-19 13:35:12.801353+00	
00000000-0000-0000-0000-000000000000	2d12274e-e93a-4350-a78f-a2e2f34394e9	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 14:16:29.989122+00	
00000000-0000-0000-0000-000000000000	06c511d2-072a-4b0d-bd30-c9240bb2049a	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 14:16:29.991954+00	
00000000-0000-0000-0000-000000000000	6e4d84cc-49e6-4465-b7e5-b182f9bb8927	{"action":"login","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-19 14:16:31.848611+00	
00000000-0000-0000-0000-000000000000	74db99d4-0db9-4559-ad15-7bd3576839c1	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 14:33:48.321441+00	
00000000-0000-0000-0000-000000000000	0307662a-4372-4f22-9381-c72f5ebce6ba	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 14:33:48.323417+00	
00000000-0000-0000-0000-000000000000	214698cb-e1dc-482f-8ff2-a7b90940a4ec	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 15:37:03.433463+00	
00000000-0000-0000-0000-000000000000	267087be-0782-4a30-b16e-a1bd8911033a	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-19 15:37:03.439182+00	
00000000-0000-0000-0000-000000000000	3f05fd6f-e6b4-40ad-89db-38ab68f1e464	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 02:12:05.792453+00	
00000000-0000-0000-0000-000000000000	3be1c9e7-cebe-467d-b09d-3a7db2fbf165	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 02:12:05.79675+00	
00000000-0000-0000-0000-000000000000	da16a709-3462-43d3-bfa4-66e32020ac50	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 02:16:54.819332+00	
00000000-0000-0000-0000-000000000000	a9c6885d-efe2-421e-9533-216a3ac00b57	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 02:16:54.821468+00	
00000000-0000-0000-0000-000000000000	6c9085b8-c64d-4d11-94d3-e5868b8b8311	{"action":"login","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-20 02:16:56.396121+00	
00000000-0000-0000-0000-000000000000	a8c57cdf-73d5-4c03-8066-bbd615f3ecb6	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 03:15:33.287373+00	
00000000-0000-0000-0000-000000000000	ab58d8db-5f8a-4324-88f8-7a2c011ab306	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 03:15:33.289168+00	
00000000-0000-0000-0000-000000000000	3e537563-06fc-465a-9ef0-7c8296ab9b9a	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 03:40:57.032077+00	
00000000-0000-0000-0000-000000000000	e3819fb1-dbcd-4dd7-8c95-293b1529e547	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 03:40:57.033786+00	
00000000-0000-0000-0000-000000000000	7dfd0cd3-c440-4c81-bfea-6a83f5f93b47	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 04:39:30.392928+00	
00000000-0000-0000-0000-000000000000	2b625fb7-0dd3-4b28-af3a-bde2d104d8b9	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 04:39:30.402725+00	
00000000-0000-0000-0000-000000000000	2dc75786-181c-48ab-b9c2-dbf9b06b3341	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 05:38:33.283783+00	
00000000-0000-0000-0000-000000000000	b3bb4abe-5d78-431c-bee5-9d0a035ae74e	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 05:38:33.285729+00	
00000000-0000-0000-0000-000000000000	5f24cdd3-ff2b-473b-9fba-127564df5af9	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 06:37:33.313923+00	
00000000-0000-0000-0000-000000000000	b58b3321-a721-4d65-b4d8-fe0e7146eaff	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 06:37:33.316261+00	
00000000-0000-0000-0000-000000000000	766871be-8be5-49a1-8fd4-76d9c0ba80e2	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 07:36:27.277595+00	
00000000-0000-0000-0000-000000000000	e11ba9fd-fd8c-48cd-a2f2-0a52badf96b1	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 07:36:27.278832+00	
00000000-0000-0000-0000-000000000000	704796de-1ade-4529-a996-bfa38970766d	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 08:35:34.283299+00	
00000000-0000-0000-0000-000000000000	dd0d772a-fcf7-4fcb-bb24-f8fc337b5837	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 08:35:34.289134+00	
00000000-0000-0000-0000-000000000000	0b290afa-0cbd-44c9-bf83-14cc86624159	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 09:34:34.285537+00	
00000000-0000-0000-0000-000000000000	493be7dc-cb0f-43e0-bce9-b5bdef1074af	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 09:34:34.288347+00	
00000000-0000-0000-0000-000000000000	dbdb77b1-1284-4243-bee6-e60289af7b62	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 10:32:30.26115+00	
00000000-0000-0000-0000-000000000000	8242d124-fb59-44cd-b6b7-e140f3ccda5e	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 10:32:30.306829+00	
00000000-0000-0000-0000-000000000000	907a272f-252e-46d1-ab8e-39ca65b30e9e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 11:30:56.538566+00	
00000000-0000-0000-0000-000000000000	6c137458-fd79-4c8f-b4f8-f476d35f45ae	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 11:30:56.540379+00	
00000000-0000-0000-0000-000000000000	35b2c4fe-bf3d-48d8-bdf6-b8993058c185	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 12:29:27.48966+00	
00000000-0000-0000-0000-000000000000	906b07f2-3d6b-41dd-b935-b7f5655a270f	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 12:29:27.49293+00	
00000000-0000-0000-0000-000000000000	f874440c-f1f0-4cbd-a66f-21422671a578	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 13:27:42.072622+00	
00000000-0000-0000-0000-000000000000	0dae93aa-b5d6-4ed1-89d9-d6daf5a89bb7	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 13:27:42.074493+00	
00000000-0000-0000-0000-000000000000	e3562bea-4515-4276-a8f5-611ea1bed1c7	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 14:26:34.379976+00	
00000000-0000-0000-0000-000000000000	f3e48f03-8d33-4e5c-8dc2-6c95a668e344	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-20 14:26:34.388605+00	
00000000-0000-0000-0000-000000000000	735c18bb-1461-48cf-a8c7-116151cc1307	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 01:35:31.257815+00	
00000000-0000-0000-0000-000000000000	b3c200b5-d77b-49ae-a32f-5ddb9e9a1cb9	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 01:35:31.271749+00	
00000000-0000-0000-0000-000000000000	7f2b5a4e-2ff3-40ef-a1bd-190d0109b9c7	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 02:13:57.890293+00	
00000000-0000-0000-0000-000000000000	21a06f9b-1b7d-45e0-bb40-e949b81b4dc9	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 02:13:57.905036+00	
00000000-0000-0000-0000-000000000000	8f61c933-d720-4050-95e4-ab966caecfbb	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 02:13:58.340789+00	
00000000-0000-0000-0000-000000000000	b9454379-9244-493e-be91-105a6a813aa3	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 02:13:58.342586+00	
00000000-0000-0000-0000-000000000000	d970c390-f4b2-4b97-9434-8728320311d3	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 02:13:58.50644+00	
00000000-0000-0000-0000-000000000000	466ad1f2-e3d1-4fc0-a239-1f3bf17b07aa	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 02:13:58.507745+00	
00000000-0000-0000-0000-000000000000	b49aafcf-5889-4aae-be48-b11483f87944	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 02:13:58.696228+00	
00000000-0000-0000-0000-000000000000	258bcd83-4228-4ec5-a648-590af8cdd2bb	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 02:13:58.707687+00	
00000000-0000-0000-0000-000000000000	9e5180cf-afa0-415a-8ae9-eeca3abc8f93	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 02:13:58.991025+00	
00000000-0000-0000-0000-000000000000	d2fba920-038d-4c6c-9f5c-6902aec235ec	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 02:13:58.992467+00	
00000000-0000-0000-0000-000000000000	b2e97410-8cc9-4bc3-9412-cacb35c588ff	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 03:22:33.097263+00	
00000000-0000-0000-0000-000000000000	6542a637-263a-493e-acd3-ada6e14a74ff	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 03:22:33.099079+00	
00000000-0000-0000-0000-000000000000	eb272eb0-a1af-4cdf-9583-10fbdd90207e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 04:21:29.864645+00	
00000000-0000-0000-0000-000000000000	b1bb72b3-da5d-42a5-8c62-97f0173b493e	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 04:21:29.866412+00	
00000000-0000-0000-0000-000000000000	25f41940-d092-4b49-8a07-8a44077bd442	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 05:59:23.239732+00	
00000000-0000-0000-0000-000000000000	b19fbb1d-7d9f-4965-af2e-d0304b67f5c3	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 05:59:23.241465+00	
00000000-0000-0000-0000-000000000000	d224bd66-c722-408a-b58a-3ef9a22d1571	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 06:58:30.099797+00	
00000000-0000-0000-0000-000000000000	29f973c0-41be-4e6a-bdd3-904846b205c3	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 06:58:30.111836+00	
00000000-0000-0000-0000-000000000000	902736f2-cd05-483d-8974-2aa2db5cd088	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 09:44:09.118535+00	
00000000-0000-0000-0000-000000000000	26e9d650-632d-4fb8-8a4f-698bdf2e8a3b	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 09:44:09.120734+00	
00000000-0000-0000-0000-000000000000	b3357739-b6f5-46f0-9d49-84cffd1321b3	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 10:16:32.147958+00	
00000000-0000-0000-0000-000000000000	b217254c-35df-481d-9b35-a5a8740fb0ab	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 10:16:32.150444+00	
00000000-0000-0000-0000-000000000000	eb3e9bcd-09b8-49cd-a4ea-8655b1faa191	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 11:15:29.916738+00	
00000000-0000-0000-0000-000000000000	8e0c077f-f543-406d-b080-cd259e63f0cd	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 11:15:29.918408+00	
00000000-0000-0000-0000-000000000000	3e09dacf-eb36-4749-b3c2-f8c1a89bb2c1	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 12:14:29.884164+00	
00000000-0000-0000-0000-000000000000	041ee26c-370b-4b53-a0a1-4b1db67fa289	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 12:14:29.885526+00	
00000000-0000-0000-0000-000000000000	37c47879-020c-40c9-a95c-0df8d58fc4e5	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 13:13:29.886781+00	
00000000-0000-0000-0000-000000000000	828843cf-bc32-428b-970b-48664785c27b	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 13:13:29.888321+00	
00000000-0000-0000-0000-000000000000	b32d126a-79fd-4c16-959c-8314e95aa701	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 14:12:16.255444+00	
00000000-0000-0000-0000-000000000000	c80ed817-9f71-4453-a3a6-dfd67937fa2e	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 14:12:16.259562+00	
00000000-0000-0000-0000-000000000000	337b0621-ef10-4ac1-ac32-5bc4ec644f82	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 15:11:30.253827+00	
00000000-0000-0000-0000-000000000000	b75df294-4e94-44e9-a444-0dd155e15fbc	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 15:11:30.259228+00	
00000000-0000-0000-0000-000000000000	5d4ef35b-620b-4af8-bce7-cea3e547db9a	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 16:10:30.295476+00	
00000000-0000-0000-0000-000000000000	f2f24aa4-0f38-4882-bafb-e91178b90d7e	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-21 16:10:30.299321+00	
00000000-0000-0000-0000-000000000000	c63eaf63-1677-4a19-b7e4-9e6ff55f9649	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 00:00:26.898757+00	
00000000-0000-0000-0000-000000000000	71ba1ff2-0871-4716-abc1-3e9ec40f4ed1	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 00:00:26.900249+00	
00000000-0000-0000-0000-000000000000	78869320-2e51-4c17-af7e-0beb40a800b7	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 00:59:25.884679+00	
00000000-0000-0000-0000-000000000000	27d9aeb1-fd70-45ef-88ee-38d6720b563a	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 00:59:25.892116+00	
00000000-0000-0000-0000-000000000000	334ba65b-4bc8-43a3-9705-4c84be4ae6c3	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 01:58:25.737077+00	
00000000-0000-0000-0000-000000000000	87f80a7d-e197-42c1-9f01-31fbde846de1	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 01:58:25.745582+00	
00000000-0000-0000-0000-000000000000	421bdfad-ffa4-4156-ad39-2b0852cef7d7	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 02:56:25.902206+00	
00000000-0000-0000-0000-000000000000	1c09b091-a71d-4b34-b70d-7724587e9041	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 02:56:25.903625+00	
00000000-0000-0000-0000-000000000000	be7eebce-bb6f-4be4-80f2-836654b16bd4	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 03:55:21.706432+00	
00000000-0000-0000-0000-000000000000	7f8dd01e-1dd4-4d92-9124-1bc7f1d45e0f	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 03:55:21.709099+00	
00000000-0000-0000-0000-000000000000	afffc5ed-ec68-4eaa-809a-bc3d1685dd4f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 06:00:31.954288+00	
00000000-0000-0000-0000-000000000000	3b086a10-495d-437f-b308-23e110835703	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 06:00:31.956945+00	
00000000-0000-0000-0000-000000000000	fae22f05-ed47-4a9d-8047-6159bc1d3c8d	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 06:59:03.051722+00	
00000000-0000-0000-0000-000000000000	3a39f825-507c-4d08-80f5-525b60a4093a	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 06:59:03.054841+00	
00000000-0000-0000-0000-000000000000	84e826be-52d0-439a-b3ac-2098aece0594	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 07:57:44.690602+00	
00000000-0000-0000-0000-000000000000	dba91505-fb77-43a2-b1a8-11bae9c51182	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 07:57:44.692297+00	
00000000-0000-0000-0000-000000000000	529ea1c6-9a16-4a9c-a06f-6115c2998d02	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 08:56:25.708384+00	
00000000-0000-0000-0000-000000000000	0dee8fe8-9969-4f34-b741-41d5c642eb77	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 08:56:25.710125+00	
00000000-0000-0000-0000-000000000000	1c60e232-5a8a-400f-8595-31fc3af2ba3a	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 10:59:26.961426+00	
00000000-0000-0000-0000-000000000000	306d96d8-d144-4ff0-9541-e12c1e64a8a3	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 10:59:26.968763+00	
00000000-0000-0000-0000-000000000000	c2550f69-1f28-48ff-ab08-9442edca56b3	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 11:58:07.881838+00	
00000000-0000-0000-0000-000000000000	e1ed3089-badd-4762-99e5-1c80ad7ee0b8	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 11:58:07.883961+00	
00000000-0000-0000-0000-000000000000	da324962-1467-4903-9df6-cf2b7357fd11	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 13:19:10.908027+00	
00000000-0000-0000-0000-000000000000	29d4dc01-df00-4f4c-8e48-fa55c211d8a4	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 13:19:10.910071+00	
00000000-0000-0000-0000-000000000000	e4a71a97-4a2d-458e-987d-40ceccebc30d	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:18:25.907472+00	
00000000-0000-0000-0000-000000000000	6809948c-dcb3-45fc-b65b-a87f39e33725	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:18:25.909947+00	
00000000-0000-0000-0000-000000000000	3e12f778-9412-404c-b397-04dce772f8de	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:57.587501+00	
00000000-0000-0000-0000-000000000000	46a3aa55-b6d0-4529-b82b-8a7c15aa4ec1	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:57.589391+00	
00000000-0000-0000-0000-000000000000	466af79e-6765-459a-a2ff-4ed36255bdc1	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:58.312551+00	
00000000-0000-0000-0000-000000000000	02012bcb-5d47-48a7-baa3-cc17d37f8043	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:58.313561+00	
00000000-0000-0000-0000-000000000000	2da32082-6827-445d-a8c0-9ec12963baa4	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:58.724523+00	
00000000-0000-0000-0000-000000000000	d59d6297-8930-4843-ac88-5cb4b4ce39e4	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:58.727169+00	
00000000-0000-0000-0000-000000000000	44de4426-81aa-438f-9b07-f7bd59910097	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:59.136489+00	
00000000-0000-0000-0000-000000000000	9bcfbdea-03b8-4ac2-920c-29992e1ed5ed	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:59.137415+00	
00000000-0000-0000-0000-000000000000	dbc39a37-5dd9-4739-8767-c01d64b2a9b8	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:59.438134+00	
00000000-0000-0000-0000-000000000000	ac37fc8a-d8e6-4c46-9b83-cad01e1383a4	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:59.439856+00	
00000000-0000-0000-0000-000000000000	12292e68-166e-44c1-9910-2286d8f1ca9f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:59.576811+00	
00000000-0000-0000-0000-000000000000	48b5ceda-8655-40f8-875d-be88d994ec70	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:46:59.577874+00	
00000000-0000-0000-0000-000000000000	016902a5-eabc-4398-847a-2258d343ac82	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:47:00.002213+00	
00000000-0000-0000-0000-000000000000	d87e7500-3c68-435b-8509-ed64ec0c0fd7	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:47:00.003354+00	
00000000-0000-0000-0000-000000000000	d3670b20-20f2-426f-a31d-abba5cff6ce0	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:47:00.148893+00	
00000000-0000-0000-0000-000000000000	67efdb91-c7b4-4ef9-b6c9-6fbd6e546a90	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:47:00.149797+00	
00000000-0000-0000-0000-000000000000	7d5b3e48-a2a5-4d2a-875b-941067d339b9	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:47:00.384253+00	
00000000-0000-0000-0000-000000000000	4c3c537f-2fad-48e6-901b-9f17585094b6	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:47:00.385413+00	
00000000-0000-0000-0000-000000000000	046bd77b-1a2e-4ead-8f80-603eeb4cab03	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:47:00.568876+00	
00000000-0000-0000-0000-000000000000	7104c9cb-7f96-4c7d-8157-1633758cbf85	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-22 14:47:00.570334+00	
00000000-0000-0000-0000-000000000000	3e86640e-ea12-4c95-a41c-f51bd37cc539	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 00:51:21.854227+00	
00000000-0000-0000-0000-000000000000	3fd57b50-05e0-4acf-a1ca-594a1c5ad521	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 00:51:21.855823+00	
00000000-0000-0000-0000-000000000000	a5e5bf81-c77c-46fc-9111-69be919aaf3c	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 01:50:23.148384+00	
00000000-0000-0000-0000-000000000000	66849034-d8ac-4902-a796-d0df065a6567	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 01:50:23.151732+00	
00000000-0000-0000-0000-000000000000	7fe73d30-7194-44fa-ae01-0b752205b98c	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 02:49:23.23709+00	
00000000-0000-0000-0000-000000000000	0db5d719-d117-4484-a652-9928e6676896	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 02:49:23.243283+00	
00000000-0000-0000-0000-000000000000	df4557fc-cd5b-4021-87e8-df1c6a239418	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 03:48:23.135158+00	
00000000-0000-0000-0000-000000000000	2fcaf22c-dfe5-4586-9efc-07ec7687a3b7	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 03:48:23.136682+00	
00000000-0000-0000-0000-000000000000	5495f89f-d110-44de-873c-ab536f0df82f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 05:04:34.143142+00	
00000000-0000-0000-0000-000000000000	2df10218-3c1c-4183-8de4-17c8fbc06e68	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 05:04:34.144173+00	
00000000-0000-0000-0000-000000000000	d74b6eee-6093-43c6-bf54-28fe5a3449bb	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 06:03:23.079751+00	
00000000-0000-0000-0000-000000000000	e2097f1e-7ad3-493d-b154-70e86ebf7712	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 06:03:23.080588+00	
00000000-0000-0000-0000-000000000000	5225ba3c-f1a9-4540-9e88-52431ab5dbc8	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 07:02:23.091117+00	
00000000-0000-0000-0000-000000000000	a702d20c-59af-4dd6-8b56-45da35dcfa84	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 07:02:23.093883+00	
00000000-0000-0000-0000-000000000000	b0059d5c-f489-4a57-8248-386734657708	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 08:24:51.353228+00	
00000000-0000-0000-0000-000000000000	0257b213-4846-4fa9-b6c4-ce6a464892df	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 08:24:51.354349+00	
00000000-0000-0000-0000-000000000000	bdc4f5f2-40bb-4a7c-9487-71e82774d388	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 09:23:05.571142+00	
00000000-0000-0000-0000-000000000000	2d6607c2-0d85-4cee-a9db-6298f1e94714	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 09:23:05.573024+00	
00000000-0000-0000-0000-000000000000	11f1180b-e2fc-4b8c-91f9-eea02cf78fa6	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 10:00:37.371201+00	
00000000-0000-0000-0000-000000000000	acf019e1-60eb-492e-8fc3-0bbbc4ed5334	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 10:00:37.377967+00	
00000000-0000-0000-0000-000000000000	2f60e17b-2a69-436e-8e47-dc5dda0490b8	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 10:59:20.631956+00	
00000000-0000-0000-0000-000000000000	b4a6c2cc-fdc0-4922-9dfc-80194df1f575	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 10:59:20.634298+00	
00000000-0000-0000-0000-000000000000	0338d67b-5f6c-4f7b-9986-16d91496c916	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 11:34:23.166309+00	
00000000-0000-0000-0000-000000000000	cab28ea9-0178-4c70-b119-02a2554f5023	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 11:34:23.169014+00	
00000000-0000-0000-0000-000000000000	b9ed7af4-e112-41c8-a7a1-3476419cc8f1	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 13:29:05.484343+00	
00000000-0000-0000-0000-000000000000	c9af6bf5-fb36-4f28-a629-11922d448bb0	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 13:29:05.485674+00	
00000000-0000-0000-0000-000000000000	24c8b7cb-fa13-4d96-9c02-fb7067d9297f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:38.093447+00	
00000000-0000-0000-0000-000000000000	231b4ebb-bbe2-4c9f-b8a6-7b05d171f5ed	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:38.100725+00	
00000000-0000-0000-0000-000000000000	4256162d-c69b-4e10-b23a-cec695c6bdad	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:38.801035+00	
00000000-0000-0000-0000-000000000000	2986acdc-3954-4dae-b811-a37994a07be8	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:38.802168+00	
00000000-0000-0000-0000-000000000000	5cb370c4-8be9-4a48-8afb-9e08b19b128e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:39.386709+00	
00000000-0000-0000-0000-000000000000	83a9591e-5053-47aa-8c32-f52a705658cd	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:39.387669+00	
00000000-0000-0000-0000-000000000000	96af2190-a095-4a2d-9175-de91b2680fd3	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:39.845252+00	
00000000-0000-0000-0000-000000000000	23916f4a-68d5-403f-b06f-984bd54f22d0	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:39.846208+00	
00000000-0000-0000-0000-000000000000	b9463972-692a-4c35-ba29-21cf010c05b9	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:40.068754+00	
00000000-0000-0000-0000-000000000000	f7afa4f9-65e5-49aa-a416-fb70242f462e	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:40.069994+00	
00000000-0000-0000-0000-000000000000	043a89ce-4ec3-4143-9de9-4b4fbb2523f0	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:40.708827+00	
00000000-0000-0000-0000-000000000000	79755daf-5de0-498b-8797-dbdec1c42adc	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:40.709724+00	
00000000-0000-0000-0000-000000000000	04b64955-f928-4415-b960-94a035ebe67b	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:41.317854+00	
00000000-0000-0000-0000-000000000000	396c438b-fa3a-466e-afe8-6c1212c92c3a	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-23 14:23:41.319801+00	
00000000-0000-0000-0000-000000000000	494763c2-ecdb-41a6-ab1c-15d900cf9ac9	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 01:09:05.336151+00	
00000000-0000-0000-0000-000000000000	0ff81ddf-0d5a-4812-bbd5-11789c929fef	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 08:30:27.243491+00	
00000000-0000-0000-0000-000000000000	5d3c5a6d-bfe4-4a5b-ba37-cfe97d037cb1	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 08:30:27.246956+00	
00000000-0000-0000-0000-000000000000	2195728a-bc84-4368-be17-49b49f829e4d	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:29:01.535887+00	
00000000-0000-0000-0000-000000000000	afa07530-637a-4f75-9ac0-aa77c85fbef8	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:29:01.542767+00	
00000000-0000-0000-0000-000000000000	e3b20de5-f535-4819-8751-4b756422497c	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:28.901535+00	
00000000-0000-0000-0000-000000000000	46141cf4-4be4-45f0-8e2d-12d462e9df08	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:28.903405+00	
00000000-0000-0000-0000-000000000000	580b02cc-d5dc-4db3-853d-fa9d7770d1d5	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:29.07836+00	
00000000-0000-0000-0000-000000000000	7ff922df-f4ac-4a10-bf8e-639ad9ec2c20	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:29.07991+00	
00000000-0000-0000-0000-000000000000	484daf7d-88c8-44f2-93c2-c127ce5f4dcb	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:30.136055+00	
00000000-0000-0000-0000-000000000000	365f9652-31ec-4c93-aa6c-b0f44133cb53	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:30.137496+00	
00000000-0000-0000-0000-000000000000	40ca1b0d-0d4a-4a1e-b0d6-685bf6f05686	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:30.382842+00	
00000000-0000-0000-0000-000000000000	87efc1be-f1ea-45d2-81bc-21807027b83f	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:30.38437+00	
00000000-0000-0000-0000-000000000000	bb5945be-51a5-44c9-86ae-2d03eeb18e72	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:30.562436+00	
00000000-0000-0000-0000-000000000000	3e3efbe2-7f15-4b7d-bf67-865547474872	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:30.563661+00	
00000000-0000-0000-0000-000000000000	5eb541e3-4f88-48db-9e2e-41162b28ceb2	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:31.211095+00	
00000000-0000-0000-0000-000000000000	e7cfa990-b51d-4b18-8220-d9597e37b515	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:31.2122+00	
00000000-0000-0000-0000-000000000000	5b21746c-1534-4e74-b5be-fba75cb6dfc9	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:31.365902+00	
00000000-0000-0000-0000-000000000000	f1fe5632-7701-4d24-a27d-1dfa8d33fd1b	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:31.367348+00	
00000000-0000-0000-0000-000000000000	474ceca5-9ec9-4dbc-b79a-f22e63be1e9f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:31.531829+00	
00000000-0000-0000-0000-000000000000	338ab8c7-acfb-49f3-8f6b-9bee8184d118	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:31.533709+00	
00000000-0000-0000-0000-000000000000	b892474a-f229-49cc-a636-22c7287353ee	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:31.744804+00	
00000000-0000-0000-0000-000000000000	9dd86fd5-4cf3-48bf-84b3-0c336916a41a	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:31.746657+00	
00000000-0000-0000-0000-000000000000	ef971772-aab5-4b3c-8e1f-b23cd92eced4	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:31.906859+00	
00000000-0000-0000-0000-000000000000	bfd8c438-4fdf-4f4c-afe4-6f214ee2dd74	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:31.9094+00	
00000000-0000-0000-0000-000000000000	dd643c6d-99aa-4af0-87d7-418d1a67d361	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:32.061159+00	
00000000-0000-0000-0000-000000000000	f3f58df3-c1a2-460a-868e-a2555ae40379	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:32.062659+00	
00000000-0000-0000-0000-000000000000	d8983858-bdb9-48c1-9c55-25e604141c81	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:32.277325+00	
00000000-0000-0000-0000-000000000000	1233ee05-66b8-4ec7-a2ba-774421ae6d64	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:32.279074+00	
00000000-0000-0000-0000-000000000000	800b00f5-29e9-44ee-ab40-2b552ec4b57a	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:32.460393+00	
00000000-0000-0000-0000-000000000000	7eabc75c-c49a-483a-91e1-1d07b5830ce9	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 09:34:32.461589+00	
00000000-0000-0000-0000-000000000000	10d01494-3af4-4891-b463-39e40057ab0d	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 10:36:18.830343+00	
00000000-0000-0000-0000-000000000000	2d37d68d-c027-46af-a01a-f4a70f1b7d87	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 10:36:18.831429+00	
00000000-0000-0000-0000-000000000000	a14d6c3a-8d1b-4bbd-8296-5b0c71b124a7	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 11:35:01.35396+00	
00000000-0000-0000-0000-000000000000	2a312f81-60b1-42f7-9f1b-62a13fad6106	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 11:35:01.356037+00	
00000000-0000-0000-0000-000000000000	9b1eb815-1740-4b19-b1cf-5a84b89d88b9	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 12:34:01.36143+00	
00000000-0000-0000-0000-000000000000	a3882148-7627-4d37-8153-c51ae986457c	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-24 12:34:01.363655+00	
00000000-0000-0000-0000-000000000000	4ff2cc00-44d1-4599-ac85-fb053fd1430e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 00:52:27.238858+00	
00000000-0000-0000-0000-000000000000	407082ab-0f1f-41fd-a235-e1a66b8b04f4	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 00:52:27.240965+00	
00000000-0000-0000-0000-000000000000	77c86351-2554-4497-9644-e3aed2c3db6d	{"action":"login","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-25 01:27:59.365038+00	
00000000-0000-0000-0000-000000000000	2b3a3b67-5423-4406-8f94-f5910e1b0058	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 01:51:52.683371+00	
00000000-0000-0000-0000-000000000000	e7a9af95-ffd4-426b-b5f8-7e69b8bcec6b	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 01:51:52.686307+00	
00000000-0000-0000-0000-000000000000	1613c6f7-29a6-43a5-8764-3cab8bfc84ac	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 02:06:50.557697+00	
00000000-0000-0000-0000-000000000000	19ecc606-7b0d-4cfd-89bc-0f1b56356a3d	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 02:06:50.635927+00	
00000000-0000-0000-0000-000000000000	7bf8ceec-c627-4744-94a9-d3a4f6d2cabb	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 02:37:55.630962+00	
00000000-0000-0000-0000-000000000000	e6700b36-0923-47a1-afaa-898e0d9ae417	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 02:37:55.632172+00	
00000000-0000-0000-0000-000000000000	6883864e-ee4f-471e-b6ab-7a6bf35638da	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 02:37:55.640218+00	
00000000-0000-0000-0000-000000000000	047ef26c-5614-49d1-8cf0-9e8474867658	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 02:37:55.641205+00	
00000000-0000-0000-0000-000000000000	f0b40223-bba4-406f-883a-365ebcd34044	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 03:46:14.289598+00	
00000000-0000-0000-0000-000000000000	59cf120d-b378-4524-9d66-4e0965fce8fa	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 03:46:14.290815+00	
00000000-0000-0000-0000-000000000000	ebf3a512-ed87-4e86-9829-867c1eaed401	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 03:46:14.297081+00	
00000000-0000-0000-0000-000000000000	253ae34f-7225-4b89-afea-485f33e20871	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 03:46:14.298302+00	
00000000-0000-0000-0000-000000000000	1361087f-ba48-4b8d-bf86-2a53b4482f1a	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 04:44:52.700077+00	
00000000-0000-0000-0000-000000000000	c12a9b20-f4bf-43ee-a12d-337be275a145	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 04:44:52.702382+00	
00000000-0000-0000-0000-000000000000	ceb7f796-f5dc-4983-bb09-bf14c1685996	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 04:44:52.704632+00	
00000000-0000-0000-0000-000000000000	452a0354-3551-4b4b-82e8-b19e66fe34fe	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 04:44:52.705508+00	
00000000-0000-0000-0000-000000000000	469c808b-bc42-47d8-98c9-a4e4d9b16921	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:11.322817+00	
00000000-0000-0000-0000-000000000000	c5923873-06c8-43db-b7de-7eb953ef067b	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:11.325146+00	
00000000-0000-0000-0000-000000000000	b0af29e5-a6f7-47bd-8b35-a7bed8619a93	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:11.333469+00	
00000000-0000-0000-0000-000000000000	07678fa2-8a92-47cd-9895-a6320e65c598	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:11.338693+00	
00000000-0000-0000-0000-000000000000	8710e523-59cc-464e-a060-d9192ce6146e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:11.771645+00	
00000000-0000-0000-0000-000000000000	ea94b875-be53-40cb-91c7-345911f78cf7	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:11.772848+00	
00000000-0000-0000-0000-000000000000	057237e1-2c5b-4d04-9de2-de381fd7aebb	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:11.855684+00	
00000000-0000-0000-0000-000000000000	e1e94b81-b772-43c5-a484-8dacd01132b9	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:11.856947+00	
00000000-0000-0000-0000-000000000000	733eb41b-af4c-4eb9-9c14-e2be9f98a279	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.079401+00	
00000000-0000-0000-0000-000000000000	1e248a51-d2d6-4dc1-8876-b5e0220b5f25	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.080302+00	
00000000-0000-0000-0000-000000000000	a7ef8a69-f942-4ebc-9bc3-7ca78d9e29f9	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.082752+00	
00000000-0000-0000-0000-000000000000	960aed43-4ce7-4b3d-ae63-11cc4334b3e5	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.083786+00	
00000000-0000-0000-0000-000000000000	44bd9c9c-db51-4c93-ad46-d93a97cb6b85	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.525408+00	
00000000-0000-0000-0000-000000000000	1491fa1a-176f-49c2-8c7f-d826a68c0fad	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.526514+00	
00000000-0000-0000-0000-000000000000	99c3be27-3a72-45c2-ab62-05eec584499a	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.535069+00	
00000000-0000-0000-0000-000000000000	41f2f598-cce2-4e2a-8572-91e175beb0bd	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.536156+00	
00000000-0000-0000-0000-000000000000	f17c379e-d6f6-45a1-8060-684cc946eb9f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.742903+00	
00000000-0000-0000-0000-000000000000	d3f193ed-5aae-4169-8024-23f0b8cec18a	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.744325+00	
00000000-0000-0000-0000-000000000000	53cc2475-1748-46f0-b002-0061616e47dd	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.764266+00	
00000000-0000-0000-0000-000000000000	0623c151-99e2-4b04-b1b2-81adb58ca8f4	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.765181+00	
00000000-0000-0000-0000-000000000000	90fcd047-afb2-4c7a-ab04-7e0707b87d7e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:12.999088+00	
00000000-0000-0000-0000-000000000000	c0be6977-7ca8-4f4b-9928-0df8b7c36b62	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.000428+00	
00000000-0000-0000-0000-000000000000	2651a304-537b-4db5-98e1-2b92c90e9ddc	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.012782+00	
00000000-0000-0000-0000-000000000000	5040bc7a-689e-4a85-8a47-6c952a0912ec	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.014016+00	
00000000-0000-0000-0000-000000000000	ef165313-e19a-4397-b714-d7c9a8d6fe7e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.115092+00	
00000000-0000-0000-0000-000000000000	8a786556-2dd1-4c42-a1f2-82cb6bf0011c	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.116639+00	
00000000-0000-0000-0000-000000000000	d28e9a0a-1497-43cd-99ad-a1efb0e91f08	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.24671+00	
00000000-0000-0000-0000-000000000000	50b3219b-6387-4c1d-9f2c-1eecdc6b80b6	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.248709+00	
00000000-0000-0000-0000-000000000000	59ff9f8f-2a92-4ac5-b46c-dbb8d44911fc	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.326099+00	
00000000-0000-0000-0000-000000000000	4cdb68a6-83e4-4d8c-8130-07ab08eb36ae	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.32749+00	
00000000-0000-0000-0000-000000000000	bf54dfdc-3c1a-47d3-8a10-bb2011783780	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.363295+00	
00000000-0000-0000-0000-000000000000	a083a1f6-1b1c-42a9-9284-1e3c58f71d67	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.365111+00	
00000000-0000-0000-0000-000000000000	a3d1c455-9a30-4e39-8bfd-7d8ebca22472	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.444059+00	
00000000-0000-0000-0000-000000000000	1b23ba10-7cd6-4810-8445-df9cbf40040f	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.445147+00	
00000000-0000-0000-0000-000000000000	cfd08c81-56a4-4af1-bdab-7afb987b74cc	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.493659+00	
00000000-0000-0000-0000-000000000000	03b4dca8-0230-41c9-a997-3f076189eebf	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.496366+00	
00000000-0000-0000-0000-000000000000	7bc5bf38-4798-4cdc-85a3-0cf1b147e41f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.589554+00	
00000000-0000-0000-0000-000000000000	1628c8f9-db8f-401e-af7b-ef45b07a714f	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.590826+00	
00000000-0000-0000-0000-000000000000	6872bb78-8fe8-40fc-ae39-fc2e867f826e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.61375+00	
00000000-0000-0000-0000-000000000000	7b0409c0-d26a-4b8f-9b85-287c78a73a62	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.61509+00	
00000000-0000-0000-0000-000000000000	63c3e961-1708-4eb9-9809-f1eff47e6b21	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.710615+00	
00000000-0000-0000-0000-000000000000	417ba4df-2336-4e81-ad8f-da02eb9c1aa7	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.711822+00	
00000000-0000-0000-0000-000000000000	58238ead-1169-4456-b3e6-b1b56e8a98b4	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.735405+00	
00000000-0000-0000-0000-000000000000	47758d60-a98c-470f-8f9e-d14255a2b3ce	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.736789+00	
00000000-0000-0000-0000-000000000000	298a3dad-3c07-4ffd-b069-5c488156a547	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.834449+00	
00000000-0000-0000-0000-000000000000	1fc8cf0c-dc6f-4869-81dc-5197ef974450	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.836051+00	
00000000-0000-0000-0000-000000000000	f799c83d-1937-485a-84dd-84ca0d332668	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.86041+00	
00000000-0000-0000-0000-000000000000	f7a85253-2968-435a-91f7-96868a6c89ab	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:13.861849+00	
00000000-0000-0000-0000-000000000000	1ec7fd42-e27e-4c8e-aba5-d8f9ccae4cad	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.000869+00	
00000000-0000-0000-0000-000000000000	a5111ec8-f9e2-4546-af24-ef79cb93af64	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.003721+00	
00000000-0000-0000-0000-000000000000	813d6661-9b86-43e3-ba54-69f472634f10	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.031069+00	
00000000-0000-0000-0000-000000000000	1bcaf86b-a1e9-42f4-9ff5-5d8c907d62ca	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.032702+00	
00000000-0000-0000-0000-000000000000	90c8207f-6db1-4b25-aceb-c31e64ef6cfb	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.263617+00	
00000000-0000-0000-0000-000000000000	0db49164-cb0c-47cd-854d-e4ad8538d402	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.265737+00	
00000000-0000-0000-0000-000000000000	07b95083-8def-42e4-ae96-0a94f729e2b6	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.34691+00	
00000000-0000-0000-0000-000000000000	802a18dc-3b6e-417e-a8a1-98699e73ebbe	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.348695+00	
00000000-0000-0000-0000-000000000000	36899cfb-484d-47d2-8a52-e92008d87ddd	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.4389+00	
00000000-0000-0000-0000-000000000000	255a5690-ba40-45fb-88da-3e10bfef346f	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.441367+00	
00000000-0000-0000-0000-000000000000	3bc0957b-1295-418b-842e-6606a1a97146	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.517931+00	
00000000-0000-0000-0000-000000000000	435bfd8d-33d0-4d5f-a186-4eeb5513b74b	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.519507+00	
00000000-0000-0000-0000-000000000000	0ac6fe1a-d4fa-427a-9495-2e3cc413b39b	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.603122+00	
00000000-0000-0000-0000-000000000000	9685d72b-7dee-4842-877c-b461270d9956	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.604682+00	
00000000-0000-0000-0000-000000000000	ef428450-dda7-4a08-9cb8-e77c11ebf99a	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.64834+00	
00000000-0000-0000-0000-000000000000	200021db-a09b-460e-9acd-6085b2966429	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.649885+00	
00000000-0000-0000-0000-000000000000	73234be2-dd78-4fb1-a454-3ecd81b37d0d	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.744122+00	
00000000-0000-0000-0000-000000000000	bccebb8d-2068-489a-b907-9999bca29b47	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.745985+00	
00000000-0000-0000-0000-000000000000	93d84585-8872-46c2-b3eb-422d943b662f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.764852+00	
00000000-0000-0000-0000-000000000000	2287ca91-b9a2-46c1-a137-754d367c28ea	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 05:27:14.765963+00	
00000000-0000-0000-0000-000000000000	4e3ba2ee-3d18-4232-98ee-8c06f00b6738	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 08:33:52.03463+00	
00000000-0000-0000-0000-000000000000	dc03805f-6f05-48b6-a6c2-3266863b7210	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 08:33:52.036282+00	
00000000-0000-0000-0000-000000000000	506097a4-5507-476e-b63e-12d6a4d909de	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 08:33:52.143066+00	
00000000-0000-0000-0000-000000000000	be11d6e6-35db-42a7-b570-a5290046a00b	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 08:33:52.144889+00	
00000000-0000-0000-0000-000000000000	f1413f90-f094-4f1e-b415-4f1793bd477f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 09:32:48.61576+00	
00000000-0000-0000-0000-000000000000	43beadcc-e9ec-4ab5-83c1-2d0962a3d2de	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 09:32:48.619645+00	
00000000-0000-0000-0000-000000000000	0720f0ec-471e-4b41-968f-c8ac1450b2f9	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 09:32:50.498252+00	
00000000-0000-0000-0000-000000000000	74d58a73-1c80-4280-83d5-4987d0c18c91	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 09:32:50.499128+00	
00000000-0000-0000-0000-000000000000	3598fa8f-4c32-4ef7-baba-8575d324fc7e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 09:57:54.811937+00	
00000000-0000-0000-0000-000000000000	88cb6836-5549-4c3d-b5b9-b9b7feb1b102	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 09:57:54.815535+00	
00000000-0000-0000-0000-000000000000	35dd5b20-01ce-499e-b07b-a24f5c16ffac	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 09:57:54.852238+00	
00000000-0000-0000-0000-000000000000	ffd1b555-45a2-4cf0-9f3f-0ba529b95a00	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 09:57:54.853449+00	
00000000-0000-0000-0000-000000000000	ec59ad02-aa28-47f1-81ab-f02f60ad7220	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 10:56:37.952867+00	
00000000-0000-0000-0000-000000000000	ba24656a-2b55-4635-90e4-8924f998b938	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 10:56:37.955762+00	
00000000-0000-0000-0000-000000000000	446379f3-5b36-4a2c-ab3d-398c56d2313d	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 10:56:45.93988+00	
00000000-0000-0000-0000-000000000000	9af4666f-8cd8-4dea-852c-0385a803f1c7	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 10:56:45.940838+00	
00000000-0000-0000-0000-000000000000	17c0374f-fba1-4a49-abed-ca1b865d526e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 11:55:44.50629+00	
00000000-0000-0000-0000-000000000000	63121795-76fd-4246-81b5-a413e13ed6b1	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 11:55:44.506289+00	
00000000-0000-0000-0000-000000000000	63ce91e9-451d-4c83-9284-8e2676d1d014	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 11:55:44.508523+00	
00000000-0000-0000-0000-000000000000	c6181578-a235-40b5-aabd-3991f11270fc	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 11:55:44.508424+00	
00000000-0000-0000-0000-000000000000	94b9c7d8-2b79-4297-b334-2511fcf7b265	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 12:54:44.469781+00	
00000000-0000-0000-0000-000000000000	1168dec0-3087-40da-807d-e39485fb48be	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 12:54:44.469724+00	
00000000-0000-0000-0000-000000000000	f454d067-462f-4a71-ac47-ab0fe701e9ab	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 12:54:44.472873+00	
00000000-0000-0000-0000-000000000000	a00ab2d3-ad8a-4f72-a976-868d6559c640	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 12:54:44.472987+00	
00000000-0000-0000-0000-000000000000	4a3f06b7-ae55-48a6-8aad-809101a7b687	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 13:53:44.520363+00	
00000000-0000-0000-0000-000000000000	db116f51-4db7-4b0c-be8c-4c02f903d7a7	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 13:53:44.520337+00	
00000000-0000-0000-0000-000000000000	84d31fc4-f372-4cee-ba7f-041595511203	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 13:53:44.522724+00	
00000000-0000-0000-0000-000000000000	c9fdb7b0-46c0-4ac1-a031-d70acca0cb5b	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 13:53:44.522836+00	
00000000-0000-0000-0000-000000000000	83913323-3d41-4117-bf31-6d4394163c23	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 14:52:44.46914+00	
00000000-0000-0000-0000-000000000000	05f8d713-1808-4efd-8fae-9fa5c3318b5f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 14:52:44.469157+00	
00000000-0000-0000-0000-000000000000	e91333f0-c752-4e8d-a6e2-419edaf6c6ae	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 14:52:44.471515+00	
00000000-0000-0000-0000-000000000000	dd53b788-d725-4f1a-a2ae-fff7cc986f4b	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-25 14:52:44.471662+00	
00000000-0000-0000-0000-000000000000	5cb64efe-6f1a-4627-a8b1-bcb5549db868	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 00:52:52.54673+00	
00000000-0000-0000-0000-000000000000	5877b2de-38c0-44ed-a136-fda1756e7a82	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 00:52:52.559191+00	
00000000-0000-0000-0000-000000000000	b5fe4393-018e-4519-88a8-02a2c53fd9bb	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 00:52:52.806321+00	
00000000-0000-0000-0000-000000000000	dfa0fc2d-3a0e-4d7f-9ef9-4711639d7a48	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 00:52:52.811289+00	
00000000-0000-0000-0000-000000000000	7d64cb5a-9440-4114-9047-8f0ac85942a1	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 01:51:41.927417+00	
00000000-0000-0000-0000-000000000000	c331c6e8-0890-452b-a255-9911a9bf898e	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 01:51:41.928463+00	
00000000-0000-0000-0000-000000000000	016d22e8-fa51-4cbe-b087-14c9f46b6b0c	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 01:51:41.929338+00	
00000000-0000-0000-0000-000000000000	880536c4-c4d4-4ed7-a058-c3f8fd724017	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 01:51:41.930225+00	
00000000-0000-0000-0000-000000000000	2642faad-9817-47c0-820b-4b09b3eb6adf	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 02:50:12.943398+00	
00000000-0000-0000-0000-000000000000	0d23309a-67ed-4436-a581-40c654d38fdf	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 02:50:12.945754+00	
00000000-0000-0000-0000-000000000000	d5977dab-dd91-4dae-814d-f4a8eeea41df	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 02:50:41.902075+00	
00000000-0000-0000-0000-000000000000	eeb6b529-077f-4596-988c-8154c43e88b4	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 02:50:41.902927+00	
00000000-0000-0000-0000-000000000000	2884e037-1f7e-4150-a68f-f97d52d9906f	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 03:49:41.976289+00	
00000000-0000-0000-0000-000000000000	b5891012-c08b-45a9-87f3-86ee6351ad21	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 03:49:41.980453+00	
00000000-0000-0000-0000-000000000000	f02b5316-d664-445e-a5bf-43ebb0cddf0d	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 03:49:41.981293+00	
00000000-0000-0000-0000-000000000000	7fa94b2d-9f87-4f3d-9abd-55bac0a65a8a	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 03:49:41.981619+00	
00000000-0000-0000-0000-000000000000	a05fe8e0-a4c6-4cac-8ea7-05019c4cd55b	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 04:48:42.058241+00	
00000000-0000-0000-0000-000000000000	a73361c0-bda7-4529-b1e6-a714e4543526	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 04:48:42.059803+00	
00000000-0000-0000-0000-000000000000	b3177120-008d-4d8f-ac35-a35a53601b8c	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 04:48:42.061759+00	
00000000-0000-0000-0000-000000000000	9a0a77c1-2b71-4e5c-ad44-06467160bcb6	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 04:48:42.061961+00	
00000000-0000-0000-0000-000000000000	0279d9bf-1bc6-4f7a-a94b-3a13add51385	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 05:47:41.96976+00	
00000000-0000-0000-0000-000000000000	e0002eb8-1564-493a-81a8-a2b8c524fe37	{"action":"token_refreshed","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 05:47:41.977487+00	
00000000-0000-0000-0000-000000000000	acc96a97-4ebb-4387-be0b-6ceb3b9a29da	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 05:47:41.979463+00	
00000000-0000-0000-0000-000000000000	debcd903-2511-4222-bf28-a0cba7e9b3ea	{"action":"token_revoked","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"token"}	2026-03-26 05:47:41.979323+00	
00000000-0000-0000-0000-000000000000	87888efe-81b0-4472-80c0-42e7bef999f2	{"action":"logout","actor_id":"b8b94902-d3df-43f8-aca6-28f39bb6e57b","actor_username":"15897752509@jiutouniao.local","actor_via_sso":false,"log_type":"account"}	2026-03-26 06:37:46.763326+00	
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
b8b94902-d3df-43f8-aca6-28f39bb6e57b	b8b94902-d3df-43f8-aca6-28f39bb6e57b	{"sub": "b8b94902-d3df-43f8-aca6-28f39bb6e57b", "email": "15897752509@jiutouniao.local", "email_verified": false, "phone_verified": false}	email	2026-03-17 10:55:37.744066+00	2026-03-17 10:55:37.74414+00	2026-03-17 10:55:37.74414+00	cfacf5c5-f8ae-41fa-bf91-7c6d48d4856d
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	b8b94902-d3df-43f8-aca6-28f39bb6e57b	authenticated	authenticated	15897752509@jiutouniao.local	$2a$10$IG8dVyIzYM1ZJkJYCMXqHuBa.qlRI7XooYI3cs2nQ3cSPxd/feEry	2026-03-17 10:55:37.748238+00	\N		\N		\N			\N	2026-03-25 01:27:59.367328+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-03-17 10:55:37.735793+00	2026-03-26 05:47:41.984907+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_records (id, company_id, employee_id, month, work_days, absent_days, late_times, leave_days, overtime_hours, remarks, created_at, created_by, updated_at, pdf_url) FROM stdin;
\.


--
-- Data for Name: attendance_signatures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_signatures (id, company_id, employee_id, attendance_record_id, year, month, status, sent_at, signed_at, sign_token, sign_token_expires_at, signature_data, reject_reason, created_at, updated_at) FROM stdin;
\.


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
-- Data for Name: company_code_sequences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_code_sequences (date_key, last_sequence, created_at, updated_at) FROM stdin;
20260302	17	2026-03-02 10:02:23.820782+00	2026-03-02 14:36:21.672867+00
20260303	2	2026-03-03 01:44:32.175803+00	2026-03-03 03:12:56.128446+00
20260304	2	2026-03-03 23:58:57.097071+00	2026-03-04 01:22:42.047911+00
20260305	15	2026-03-05 02:22:17.209158+00	2026-03-05 14:53:15.205743+00
20260306	10	2026-03-06 01:15:47.548942+00	2026-03-06 08:00:08.176699+00
20260309	9	2026-03-09 05:08:05.215698+00	2026-03-09 11:11:49.853839+00
20260310	7	2026-03-10 00:10:47.2557+00	2026-03-10 04:13:30.29777+00
20260312	2	2026-03-12 02:42:45.661787+00	2026-03-12 02:44:07.44063+00
\.


--
-- Data for Name: company_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_transfers (id, company_id, from_user_id, to_user_id, transferred_by, reason, created_at) FROM stdin;
\.


--
-- Data for Name: document_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_templates (id, company_id, name, category, content, requires_company_signature, is_active, created_at, updated_at) FROM stdin;
368c1548-e975-4923-a854-b8b7f95222ad	\N	劳动合同	onboarding	\N	t	t	2026-03-17 09:53:45.57703+00	2026-03-17 09:53:45.57703+00
9f19ae44-cf5c-4e22-b429-a6415c3ee068	\N	保密协议	onboarding	\N	f	t	2026-03-17 09:53:45.57703+00	2026-03-17 09:53:45.57703+00
04198af3-33f8-4448-9a14-a7e3feecc802	\N	员工手册	onboarding	\N	f	t	2026-03-17 09:53:45.57703+00	2026-03-17 09:53:45.57703+00
c6619904-3a67-43cd-a044-d6c198e8ab65	\N	入职登记表	onboarding	\N	f	t	2026-03-17 09:53:45.57703+00	2026-03-17 09:53:45.57703+00
1375859c-2df5-46f1-b5cb-8dbd780acfdb	\N	求职登记表	onboarding	\N	f	t	2026-03-17 09:53:45.57703+00	2026-03-17 09:53:45.57703+00
9ee00a99-906c-4219-b896-7fecfa5a98cb	\N	承诺书	onboarding	\N	f	t	2026-03-17 09:53:45.57703+00	2026-03-17 09:53:45.57703+00
53de09f9-742e-4455-a409-c73126d35a20	\N	考勤确认	compensation	\N	f	t	2026-03-17 09:53:45.57703+00	2026-03-17 09:53:45.57703+00
8b7050ba-0214-4e52-8da3-68fac4d46180	\N	绩效考核确认	compensation	\N	f	t	2026-03-17 09:53:45.57703+00	2026-03-17 09:53:45.57703+00
6a4db303-b547-499e-af94-59f1866e6092	\N	工资条确认	compensation	\N	f	t	2026-03-17 09:53:45.57703+00	2026-03-17 09:53:45.57703+00
\.


--
-- Data for Name: employee_document_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_document_records (id, employee_id, company_id, document_type, document_name, template_category, signed_at, signed_year, file_url, signing_record_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, company_id, name, phone, "position", department, status, hire_date, contract_start_date, contract_end_date, created_at, updated_at, address, gender, birth_date, id_card_type, household_address, insurance_start_date, id_card_number, contract_count, employee_number) FROM stdin;
62dafbec-828b-4c1c-985a-07de065cb5be	1816aed2-f492-442e-a8ae-680b1d18b047	袁泽钢	13872112805	生产经理	生产	active	2023-08-01	2023-08-01	2026-08-01	2026-03-10 04:26:55.717512+00	2026-03-10 04:26:55.717512+00	湖北省鄂州市鄂城区沙窝乡黄山村	男	1980-08-09	身份证	\N	\N	420704198008101673	0	\N
a6399a0d-d4c5-4174-9403-49a7823be370	1816aed2-f492-442e-a8ae-680b1d18b047	柯娜	15871462085	会计	内业	active	2024-11-19	2024-11-19	2027-11-19	2026-03-10 04:26:55.399188+00	2026-03-10 04:26:55.399188+00	黄石市黄石港区天骄公馆	女	1995-07-09	身份证	\N	\N	420281199507102021	0	\N
c3d90d84-495d-47e4-abcc-9c331af16c51	1816aed2-f492-442e-a8ae-680b1d18b047	张志武	15997157918	维修	生产	active	2023-10-18	2023-10-18	2026-10-14	2026-03-10 04:26:56.168869+00	2026-03-10 04:26:56.168869+00	湖北省鄂州市鄂城区花湖镇永华村	男	1978-10-29	身份证	\N	\N	420700197810305614	0	\N
cb296b4b-9200-423d-98e7-af546c1b1d54	1816aed2-f492-442e-a8ae-680b1d18b047	杨占方	18237508016	电工	生产	active	2023-10-01	2023-10-01	2026-10-14	2026-03-10 04:26:56.017228+00	2026-03-10 04:26:56.017228+00	河南省汝州市王寨乡尹庄村2号院62号	男	1968-07-17	身份证	\N	\N	410482196807185537	0	\N
d0e44a6a-778e-437f-a298-6c2ff966edd8	1816aed2-f492-442e-a8ae-680b1d18b047	范细容	18934641071	厨师	后勤	active	2023-10-14	2023-10-14	2026-10-14	2026-03-10 04:26:55.866458+00	2026-03-10 04:26:55.866458+00	湖北省浠水县散花镇五一港村五组5-11号	女	1964-09-24	身份证	\N	\N	421125196409257346	0	\N
e16ccb20-2fb0-480b-b403-1bfc51b4b552	1816aed2-f492-442e-a8ae-680b1d18b047	程芳	13597612942	会计	内业	active	2024-06-12	2024-06-12	2027-06-12	2026-03-10 04:26:55.203347+00	2026-03-10 04:26:55.203347+00	黄石市黄石港区一品园2栋1单元301	女	1980-07-25	身份证	\N	\N	420202198007261229	0	\N
f995752c-f14d-4efc-b040-a52dfe9cb50c	1816aed2-f492-442e-a8ae-680b1d18b047	徐红姣	13597662458	销售总监	销售	active	2023-10-31	2023-10-31	2026-10-31	2026-03-10 00:49:42.868198+00	2026-03-10 01:28:40.392566+00	黄石市开发区荣昌小区D栋1单元501室	女	1976-12-24	身份证	\N	\N	420704197612250021	0	\N
b4cbb0b9-4494-4b12-a506-6bbed4e92f35	a6992a13-4e3e-45d8-85aa-810e40dcd94c	涂巧芸	15897798454	出纳	内业	active	2023-09-15	2023-09-15	2026-09-15	2026-03-10 04:26:55.563769+00	2026-03-22 11:32:15.082039+00	湖北省黄石市花湖大道金港明珠7栋	女	1984-12-11	身份证	\N	\N	420704198412125781	0	\N
5fd4139e-409e-464c-94f1-5345cbc94b7e	1816aed2-f492-442e-a8ae-680b1d18b047	test	15850526482	开发	技术	active	2025-11-06	2025-01-31	2028-07-07	2026-03-22 11:34:31.531882+00	2026-03-22 11:56:44.978277+00	江苏	男	2000-02-26	身份证	\N	\N	321023199104092415	1	\N
\.


--
-- Data for Name: labor_contract_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.labor_contract_history (id, employee_id, company_id, contract_number, start_date, end_date, contract_type, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, type, title, content, is_read, related_id, created_at) FROM stdin;
\.


--
-- Data for Name: operation_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.operation_logs (id, user_id, operation_type, operation_detail, target_type, target_id, ip_address, user_agent, created_at) FROM stdin;
277fe6c8-e946-4a51-a0fb-7731e22884fc	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 43ea6ac1-5efb-4fc2-9613-ae9ff2f17793	signing_records	43ea6ac1-5efb-4fc2-9613-ae9ff2f17793	\N	\N	2026-03-18 14:23:37.675591+00
eb09304f-c1b2-4c29-8a06-9a9752d87bdd	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_employee	员工签署: 43ea6ac1-5efb-4fc2-9613-ae9ff2f17793	signing_records	43ea6ac1-5efb-4fc2-9613-ae9ff2f17793	\N	\N	2026-03-19 01:36:12.655812+00
b68e6a53-7cde-44b5-b326-c6347f726956	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_company	公司签署: 43ea6ac1-5efb-4fc2-9613-ae9ff2f17793	signing_records	43ea6ac1-5efb-4fc2-9613-ae9ff2f17793	\N	\N	2026-03-19 01:36:20.040922+00
0883a9a1-1ec9-48a0-93d5-cac0810f767e	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 6eb631db-697c-4e7f-959a-dec8a2cdece6	signing_records	6eb631db-697c-4e7f-959a-dec8a2cdece6	\N	\N	2026-03-19 02:22:14.588678+00
d09e593a-ca20-4460-b6c2-d0ca618f452e	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: dda33703-6946-48ea-8418-345797789033	signing_records	dda33703-6946-48ea-8418-345797789033	\N	\N	2026-03-19 02:51:37.212421+00
330ab953-4f5c-4297-ab90-d5e317981b8c	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: b9839825-6083-4765-aea3-9e9e9afb97a2	signing_records	b9839825-6083-4765-aea3-9e9e9afb97a2	\N	\N	2026-03-19 03:33:34.092358+00
69238ba7-aa26-4028-9006-4aa9e023dc76	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 2b26090c-9609-47da-8018-e8a1947a5f94	signing_records	2b26090c-9609-47da-8018-e8a1947a5f94	\N	\N	2026-03-19 06:43:20.233037+00
8b6a9da8-56de-4ad7-97a8-82d1be757c1a	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: df7a67fc-d080-4144-ab30-9f8d36ae28a4	signing_records	df7a67fc-d080-4144-ab30-9f8d36ae28a4	\N	\N	2026-03-19 06:50:38.480343+00
6d0fb7f8-5c1f-456b-9bc8-8461b9a047fd	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 38271341-acb9-469b-be6f-5c1a2212e8a0	signing_records	38271341-acb9-469b-be6f-5c1a2212e8a0	\N	\N	2026-03-19 07:33:50.230636+00
e146ed4a-214a-4d18-89d9-19e2e74508c4	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 38271341-acb9-469b-be6f-5c1a2212e8a0	signing_records	38271341-acb9-469b-be6f-5c1a2212e8a0	\N	\N	2026-03-19 07:39:55.376021+00
8c8de298-5619-458e-aa15-c934d3548cc8	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 4a586746-d2ce-49a0-a90f-1393ee742abd	signing_records	4a586746-d2ce-49a0-a90f-1393ee742abd	\N	\N	2026-03-19 07:40:12.965999+00
7fa20c37-3e07-4012-85a4-206d5be6ad5d	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 6c1cf293-9141-4c0f-8624-404ce02ae377	signing_records	6c1cf293-9141-4c0f-8624-404ce02ae377	\N	\N	2026-03-19 07:41:59.46254+00
ac9ccf47-847c-477c-b873-73976b71148f	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 97fc3495-d27b-4f72-9c42-d42f80eb001b	signing_records	97fc3495-d27b-4f72-9c42-d42f80eb001b	\N	\N	2026-03-19 07:43:07.240106+00
bbef2c3c-6237-4ca2-a60b-6b105b15fe3d	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 97fc3495-d27b-4f72-9c42-d42f80eb001b	signing_records	97fc3495-d27b-4f72-9c42-d42f80eb001b	\N	\N	2026-03-19 07:49:05.723614+00
1493dfd8-618e-4d02-a1d1-b21581f2e364	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 6c1cf293-9141-4c0f-8624-404ce02ae377	signing_records	6c1cf293-9141-4c0f-8624-404ce02ae377	\N	\N	2026-03-19 07:49:10.595078+00
b9455e45-57fe-4cef-9b5b-d30663effcfb	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 9671deb4-e0bc-47f8-8e21-3e08a680271d	signing_records	9671deb4-e0bc-47f8-8e21-3e08a680271d	\N	\N	2026-03-19 07:49:31.934745+00
8bd5749a-4af2-4c13-b1c2-8817f4082c83	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: dee2cb9a-0420-4ae8-af85-17a780e08069	signing_records	dee2cb9a-0420-4ae8-af85-17a780e08069	\N	\N	2026-03-19 09:25:02.738962+00
8702d72d-246f-49b9-85ac-bec5bbb7d034	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: dee2cb9a-0420-4ae8-af85-17a780e08069	signing_records	dee2cb9a-0420-4ae8-af85-17a780e08069	\N	\N	2026-03-19 09:54:15.027718+00
ee842d52-d3ed-4f89-bc03-5e672a69d06c	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 9671deb4-e0bc-47f8-8e21-3e08a680271d	signing_records	9671deb4-e0bc-47f8-8e21-3e08a680271d	\N	\N	2026-03-19 09:54:18.036428+00
775a5fec-4a16-4e1d-bf56-d0aa12b5ae2a	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: df7a67fc-d080-4144-ab30-9f8d36ae28a4	signing_records	df7a67fc-d080-4144-ab30-9f8d36ae28a4	\N	\N	2026-03-19 09:54:20.821256+00
fc19e5a9-8140-42e2-a4dd-588ceb095f62	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 4a586746-d2ce-49a0-a90f-1393ee742abd	signing_records	4a586746-d2ce-49a0-a90f-1393ee742abd	\N	\N	2026-03-19 09:54:23.311731+00
363ebe7c-dddb-4077-a94c-4403f3a4c15e	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: f1ed5e4a-e1da-499c-80e3-4baa3d0a7cc9	signing_records	f1ed5e4a-e1da-499c-80e3-4baa3d0a7cc9	\N	\N	2026-03-19 09:54:39.191665+00
404cb98a-57d3-4171-ac2d-c1ce76e746c9	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 4c5d6355-a368-429a-944c-f543fdbbf7dd	signing_records	4c5d6355-a368-429a-944c-f543fdbbf7dd	\N	\N	2026-03-19 11:53:03.967672+00
202954c7-05d6-4e54-8268-a6b9570415f8	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 65994f31-59fa-4bcc-82d5-02713f3a1fdf	signing_records	65994f31-59fa-4bcc-82d5-02713f3a1fdf	\N	\N	2026-03-19 11:59:05.435549+00
5e545c2a-df31-4f06-9a34-e55cdcf4a87e	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 65994f31-59fa-4bcc-82d5-02713f3a1fdf	signing_records	65994f31-59fa-4bcc-82d5-02713f3a1fdf	\N	\N	2026-03-19 12:03:09.817138+00
8c6e580c-08ca-4a06-ab63-82a7c8ed3150	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 4c5d6355-a368-429a-944c-f543fdbbf7dd	signing_records	4c5d6355-a368-429a-944c-f543fdbbf7dd	\N	\N	2026-03-19 12:03:12.838305+00
9bdeac37-1db2-4b7d-965a-bbf1a0da594a	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: f1ed5e4a-e1da-499c-80e3-4baa3d0a7cc9	signing_records	f1ed5e4a-e1da-499c-80e3-4baa3d0a7cc9	\N	\N	2026-03-19 12:03:15.809728+00
fa95f49a-ae70-4b59-be93-a25b083a37c1	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 31f2b429-cc56-4f8f-b3d4-d95df510c58d	signing_records	31f2b429-cc56-4f8f-b3d4-d95df510c58d	\N	\N	2026-03-19 12:03:33.261199+00
3a822d07-b2cb-4d8e-a6e2-6dad0055717f	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 598f1b0a-17f7-457e-b3c2-bb7dd2d2bc0e	signing_records	598f1b0a-17f7-457e-b3c2-bb7dd2d2bc0e	\N	\N	2026-03-19 12:11:58.062949+00
68851105-383d-44de-93d7-4736869e2421	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: d1accf71-3bc2-4a91-ba17-4bccd5362cb9	signing_records	d1accf71-3bc2-4a91-ba17-4bccd5362cb9	\N	\N	2026-03-19 12:24:02.130202+00
c3d4418f-e52e-4a44-b454-7205d03543ad	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 94bdd6e0-23a4-436f-852a-b39321a27bee	signing_records	94bdd6e0-23a4-436f-852a-b39321a27bee	\N	\N	2026-03-19 12:24:58.746211+00
921ce60a-1b66-4d06-a7a4-cf31b5688773	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 58fa3977-5552-47ce-8bd2-92dc4605ef22	signing_records	58fa3977-5552-47ce-8bd2-92dc4605ef22	\N	\N	2026-03-19 12:28:42.04648+00
4b188420-42fc-404a-b0cc-01c9f05f7ebb	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 2ec12c17-4fe8-4c6a-8b80-0bfb4c5e5407	signing_records	2ec12c17-4fe8-4c6a-8b80-0bfb4c5e5407	\N	\N	2026-03-19 12:40:25.195148+00
2ba997b7-a3d4-4296-969a-4168a2ce8abe	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 6aeacc70-0490-4509-947a-0157057d40e8	signing_records	6aeacc70-0490-4509-947a-0157057d40e8	\N	\N	2026-03-19 12:43:48.25055+00
a5d9aa35-4926-4f26-af14-aecb1b2555fd	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: aee84c00-3e96-4cb5-9deb-0b71c9800fca	signing_records	aee84c00-3e96-4cb5-9deb-0b71c9800fca	\N	\N	2026-03-19 12:47:39.960364+00
581fd788-691c-42c2-a7bf-bdf665ef6a40	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: f5a7a8a2-d53a-4a8a-b40a-12c245870df0	signing_records	f5a7a8a2-d53a-4a8a-b40a-12c245870df0	\N	\N	2026-03-19 12:48:37.133123+00
b229ac52-bfde-4f28-a8b1-508068c2748e	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: f0eec738-88b2-4856-9120-1f5d7a481ace	signing_records	f0eec738-88b2-4856-9120-1f5d7a481ace	\N	\N	2026-03-19 12:49:03.597968+00
744ff934-7ee6-47e3-9cd2-7a6da9679b44	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: f0eec738-88b2-4856-9120-1f5d7a481ace	signing_records	f0eec738-88b2-4856-9120-1f5d7a481ace	\N	\N	2026-03-19 13:27:39.676317+00
7258ce56-7faf-4e3a-ad99-b5844be34f19	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: f5a7a8a2-d53a-4a8a-b40a-12c245870df0	signing_records	f5a7a8a2-d53a-4a8a-b40a-12c245870df0	\N	\N	2026-03-19 13:27:41.632648+00
bd9d458f-9a69-4fd8-8bc3-2960c95b1267	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: aee84c00-3e96-4cb5-9deb-0b71c9800fca	signing_records	aee84c00-3e96-4cb5-9deb-0b71c9800fca	\N	\N	2026-03-19 13:35:23.525158+00
57a10765-6852-4fbc-a640-309997d186fa	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 6aeacc70-0490-4509-947a-0157057d40e8	signing_records	6aeacc70-0490-4509-947a-0157057d40e8	\N	\N	2026-03-19 13:35:24.955253+00
3dbd0c7c-52d9-4d28-9d66-6064dc5da20b	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 2ec12c17-4fe8-4c6a-8b80-0bfb4c5e5407	signing_records	2ec12c17-4fe8-4c6a-8b80-0bfb4c5e5407	\N	\N	2026-03-19 13:35:25.853829+00
e8afa0e4-0ff5-4826-a9c0-2f1649ade279	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 58fa3977-5552-47ce-8bd2-92dc4605ef22	signing_records	58fa3977-5552-47ce-8bd2-92dc4605ef22	\N	\N	2026-03-19 13:35:26.606896+00
b7fcfda9-b4a8-4d4c-a1d7-5aefbdf1537b	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 94bdd6e0-23a4-436f-852a-b39321a27bee	signing_records	94bdd6e0-23a4-436f-852a-b39321a27bee	\N	\N	2026-03-19 13:35:27.304217+00
02efb9f3-5e69-4bfd-80d0-719e3f97ca10	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: d1accf71-3bc2-4a91-ba17-4bccd5362cb9	signing_records	d1accf71-3bc2-4a91-ba17-4bccd5362cb9	\N	\N	2026-03-19 13:35:30.389607+00
463c4534-ef2e-4914-8d37-7391e08ff627	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 598f1b0a-17f7-457e-b3c2-bb7dd2d2bc0e	signing_records	598f1b0a-17f7-457e-b3c2-bb7dd2d2bc0e	\N	\N	2026-03-19 13:35:31.235113+00
7638c633-3252-440e-a82e-895bc03f577c	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 31f2b429-cc56-4f8f-b3d4-d95df510c58d	signing_records	31f2b429-cc56-4f8f-b3d4-d95df510c58d	\N	\N	2026-03-19 13:35:32.036918+00
05452519-a156-4010-845a-e2b5fd9be4ae	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 2b26090c-9609-47da-8018-e8a1947a5f94	signing_records	2b26090c-9609-47da-8018-e8a1947a5f94	\N	\N	2026-03-19 13:35:32.846959+00
9e259f0f-5dc7-4923-88e3-a879f675137f	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 5855af29-14a3-462c-b072-819a2fb078bb	signing_records	5855af29-14a3-462c-b072-819a2fb078bb	\N	\N	2026-03-19 13:47:03.483526+00
0e456a97-cc6b-4ec3-8f7c-b78e8e658276	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 93aab3b9-b2c5-423a-837f-0fa5c1d048df	signing_records	93aab3b9-b2c5-423a-837f-0fa5c1d048df	\N	\N	2026-03-19 13:47:43.317333+00
344191db-cbf8-4744-a3ce-b200d7a0d982	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 93aab3b9-b2c5-423a-837f-0fa5c1d048df	signing_records	93aab3b9-b2c5-423a-837f-0fa5c1d048df	\N	\N	2026-03-19 13:49:03.442049+00
0e323c05-7262-4442-b587-ef3628d362a1	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 5855af29-14a3-462c-b072-819a2fb078bb	signing_records	5855af29-14a3-462c-b072-819a2fb078bb	\N	\N	2026-03-19 13:49:05.190226+00
de24f869-2a10-450c-98d8-d205491eb1e0	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: b9839825-6083-4765-aea3-9e9e9afb97a2	signing_records	b9839825-6083-4765-aea3-9e9e9afb97a2	\N	\N	2026-03-19 13:49:07.121312+00
1c871179-daf2-4d57-861c-d9179bfab198	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 2a0cae39-f02e-4117-b4b5-fe35b9f2fd99	signing_records	2a0cae39-f02e-4117-b4b5-fe35b9f2fd99	\N	\N	2026-03-19 13:49:51.632524+00
bbfa454a-5b3b-48fd-8edf-e42a76813497	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: e1aba863-72c9-4aae-98a5-b9fc53041a45	signing_records	e1aba863-72c9-4aae-98a5-b9fc53041a45	\N	\N	2026-03-19 13:52:24.247793+00
28171325-7010-4330-aabc-67e22fc766ef	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 61ba49d3-4850-4a1a-b535-4f57952b06b2	signing_records	61ba49d3-4850-4a1a-b535-4f57952b06b2	\N	\N	2026-03-19 13:54:31.20044+00
e0ab7d36-b412-4734-8f54-1364d852fe92	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 4b9a415b-6f87-40d3-8dde-dfdfcfb4ebe3	signing_records	4b9a415b-6f87-40d3-8dde-dfdfcfb4ebe3	\N	\N	2026-03-19 14:05:09.724525+00
8c77cba3-3966-4e49-9908-dd7bd7a25d00	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: f3004c22-b236-48f6-b15b-863e6771649e	signing_records	f3004c22-b236-48f6-b15b-863e6771649e	\N	\N	2026-03-19 14:05:32.603405+00
3571bb2d-6baf-48e7-a3aa-e73c1288ce77	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: f1061e0f-52fa-4c42-88e0-7e35afea2459	signing_records	f1061e0f-52fa-4c42-88e0-7e35afea2459	\N	\N	2026-03-19 14:09:10.826764+00
0559bf87-3a5f-4df1-80bc-ea1ed2b6c053	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: d3c76070-c298-4922-8cbe-7ff30ecdb6db	signing_records	d3c76070-c298-4922-8cbe-7ff30ecdb6db	\N	\N	2026-03-19 14:10:12.732339+00
1e439a5e-626d-4373-990a-b22a19b2c428	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: d3c76070-c298-4922-8cbe-7ff30ecdb6db	signing_records	d3c76070-c298-4922-8cbe-7ff30ecdb6db	\N	\N	2026-03-20 02:17:08.612567+00
db80f826-0a2e-4b94-8f1e-2dbee424d8dc	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: f1061e0f-52fa-4c42-88e0-7e35afea2459	signing_records	f1061e0f-52fa-4c42-88e0-7e35afea2459	\N	\N	2026-03-20 02:17:11.730728+00
d0b625cf-8334-418d-9ae6-f58cd20a8ff0	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: f1061e0f-52fa-4c42-88e0-7e35afea2459	signing_records	f1061e0f-52fa-4c42-88e0-7e35afea2459	\N	\N	2026-03-20 02:17:11.730759+00
4d66848e-7696-4b6d-b384-fe0102ef0be0	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: f3004c22-b236-48f6-b15b-863e6771649e	signing_records	f3004c22-b236-48f6-b15b-863e6771649e	\N	\N	2026-03-20 02:17:17.823188+00
2de272e4-9cb9-4937-9218-8fa2fc4c4111	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: f3004c22-b236-48f6-b15b-863e6771649e	signing_records	f3004c22-b236-48f6-b15b-863e6771649e	\N	\N	2026-03-20 02:17:17.823096+00
729400e2-3336-49f2-8be6-636ddd5ffa4b	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: f3004c22-b236-48f6-b15b-863e6771649e	signing_records	f3004c22-b236-48f6-b15b-863e6771649e	\N	\N	2026-03-20 02:17:21.230738+00
df62d198-ba42-4495-85cf-465aa399b72b	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: f3004c22-b236-48f6-b15b-863e6771649e	signing_records	f3004c22-b236-48f6-b15b-863e6771649e	\N	\N	2026-03-20 02:17:22.935004+00
92b60f89-ab40-436a-8f14-dbbbe25de2c2	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 4b9a415b-6f87-40d3-8dde-dfdfcfb4ebe3	signing_records	4b9a415b-6f87-40d3-8dde-dfdfcfb4ebe3	\N	\N	2026-03-20 02:17:27.540774+00
eff37265-5951-41d5-92de-147144ca74d8	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 4b9a415b-6f87-40d3-8dde-dfdfcfb4ebe3	signing_records	4b9a415b-6f87-40d3-8dde-dfdfcfb4ebe3	\N	\N	2026-03-20 02:17:28.501516+00
5c11aa3c-4663-4d0c-b4da-02793e8d6512	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 61ba49d3-4850-4a1a-b535-4f57952b06b2	signing_records	61ba49d3-4850-4a1a-b535-4f57952b06b2	\N	\N	2026-03-20 02:17:33.86428+00
01fb9210-7820-4e37-b16c-49bb3953cf0a	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: ba7a99f1-a54b-4dbb-af72-30489abddc8f	signing_records	ba7a99f1-a54b-4dbb-af72-30489abddc8f	\N	\N	2026-03-20 04:56:57.252362+00
b1403023-92ab-44c3-b01c-37ffeaca5d80	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 8dec002a-4e55-4b43-9451-72b13d33c50a	signing_records	8dec002a-4e55-4b43-9451-72b13d33c50a	\N	\N	2026-03-20 05:09:57.933725+00
ea349c46-3d73-499b-8085-9c8fd39b294c	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 7043a299-d837-4f90-9183-c2d9e8dd2ab5	signing_records	7043a299-d837-4f90-9183-c2d9e8dd2ab5	\N	\N	2026-03-20 05:10:34.424818+00
465130c0-ec27-4c61-8bdd-6a6043b966eb	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_employee	员工签署: 7043a299-d837-4f90-9183-c2d9e8dd2ab5	signing_records	7043a299-d837-4f90-9183-c2d9e8dd2ab5	\N	\N	2026-03-20 07:29:33.803726+00
5face808-5ff3-47d2-ae5e-12855dd532eb	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_company	公司签署: 7043a299-d837-4f90-9183-c2d9e8dd2ab5	signing_records	7043a299-d837-4f90-9183-c2d9e8dd2ab5	\N	\N	2026-03-20 07:29:41.943537+00
ded1f9fe-65f5-45c7-a362-89f584471311	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_employee	员工签署: 8dec002a-4e55-4b43-9451-72b13d33c50a	signing_records	8dec002a-4e55-4b43-9451-72b13d33c50a	\N	\N	2026-03-20 07:31:41.140876+00
dc2a4328-f63d-4185-8a47-b75df38b75c0	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 5acfbef9-5faa-4d31-85f1-0bc3bb267294	signing_records	5acfbef9-5faa-4d31-85f1-0bc3bb267294	\N	\N	2026-03-20 09:06:55.480136+00
d874f511-7414-485b-b953-72bf09eef237	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 6cef43e4-061d-4ac6-8242-6cf5fee58820	signing_records	6cef43e4-061d-4ac6-8242-6cf5fee58820	\N	\N	2026-03-20 09:47:26.060506+00
7fc78aaa-cb19-49b9-af98-f69589a8f7e3	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: ada71279-42c9-4adb-9d82-55b9f5536794	signing_records	ada71279-42c9-4adb-9d82-55b9f5536794	\N	\N	2026-03-20 09:55:46.721819+00
f99d2bd5-c2bf-4029-806d-19bbaa783414	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: b6f73db6-30b6-4bc5-a788-7db0f1b3a81a	signing_records	b6f73db6-30b6-4bc5-a788-7db0f1b3a81a	\N	\N	2026-03-20 10:56:56.211152+00
0ab493d4-ca09-41fe-8ef5-21b88dbfbd00	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 759148af-0d53-4c89-8008-3153ff004d3a	signing_records	759148af-0d53-4c89-8008-3153ff004d3a	\N	\N	2026-03-20 11:29:21.199786+00
ddf22dd3-8a74-4875-90f7-4cbfc5733b54	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_company	公司签署: ada71279-42c9-4adb-9d82-55b9f5536794	signing_records	ada71279-42c9-4adb-9d82-55b9f5536794	\N	\N	2026-03-20 11:48:27.879091+00
7308810b-b0cc-479b-a342-747b01dff862	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_employee	员工签署: ba7a99f1-a54b-4dbb-af72-30489abddc8f	signing_records	ba7a99f1-a54b-4dbb-af72-30489abddc8f	\N	\N	2026-03-20 12:05:04.467071+00
9ba75290-1ce4-412a-9bed-a87d470d56ba	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_company	公司签署: 6cef43e4-061d-4ac6-8242-6cf5fee58820	signing_records	6cef43e4-061d-4ac6-8242-6cf5fee58820	\N	\N	2026-03-20 12:07:09.724777+00
eb802557-c029-48b8-8c46-eaf683109352	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_company	公司签署: ba7a99f1-a54b-4dbb-af72-30489abddc8f	signing_records	ba7a99f1-a54b-4dbb-af72-30489abddc8f	\N	\N	2026-03-20 12:07:40.207668+00
a0e72cd3-6a14-4ef0-8960-276c26cc7d32	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 4bcfef3c-132c-4417-b10d-cd616c2bcbd7	signing_records	4bcfef3c-132c-4417-b10d-cd616c2bcbd7	\N	\N	2026-03-20 12:10:28.815412+00
cb0291e6-884e-454f-8715-b2594b87d3f3	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_employee	员工签署: 4bcfef3c-132c-4417-b10d-cd616c2bcbd7	signing_records	4bcfef3c-132c-4417-b10d-cd616c2bcbd7	\N	\N	2026-03-20 12:17:20.000457+00
4eab924c-d2a8-4cfa-959c-b8600db79bbc	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 24a6478a-8103-49db-9cbe-f19666849197	signing_records	24a6478a-8103-49db-9cbe-f19666849197	\N	\N	2026-03-20 12:37:08.130328+00
6cf76e6c-7a19-4e17-9915-b8eed5b6c7fd	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 7483f929-5b33-4c45-903c-b894bc3541aa	signing_records	7483f929-5b33-4c45-903c-b894bc3541aa	\N	\N	2026-03-20 12:49:41.988406+00
06a73036-d859-444d-a778-6091dc8c06f8	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_employee	员工签署: 7483f929-5b33-4c45-903c-b894bc3541aa	signing_records	7483f929-5b33-4c45-903c-b894bc3541aa	\N	\N	2026-03-20 12:51:23.517653+00
23d74fb8-5689-4759-a601-2432e04e5720	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: eb03fc01-6d3e-463f-895c-d811ea5ac196	signing_records	eb03fc01-6d3e-463f-895c-d811ea5ac196	\N	\N	2026-03-20 13:49:03.755921+00
c7a1d41a-afbb-4e5d-826c-954845db7033	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 17ce4e72-ec3f-471b-92b1-42409423b7ae	signing_records	17ce4e72-ec3f-471b-92b1-42409423b7ae	\N	\N	2026-03-20 14:05:36.684564+00
91303266-1a18-40e3-b804-225ad9ed5107	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_employee	员工签署: 17ce4e72-ec3f-471b-92b1-42409423b7ae	signing_records	17ce4e72-ec3f-471b-92b1-42409423b7ae	\N	\N	2026-03-20 14:05:59.55607+00
6673920b-a6fd-4143-9772-6b3ecce83769	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: d299b9c2-9965-4b9e-b5eb-165a64f0bf07	signing_records	d299b9c2-9965-4b9e-b5eb-165a64f0bf07	\N	\N	2026-03-20 14:44:05.736317+00
cef2d863-ec13-4532-8e45-359da3445308	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 0f4020bc-5170-404f-ab14-d195d108252e	signing_records	0f4020bc-5170-404f-ab14-d195d108252e	\N	\N	2026-03-20 14:51:54.225681+00
572f043b-54f6-4e7d-9fda-87ce33bafcb4	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 8d04e3f3-1a80-4cb5-96db-57624d0461f7	signing_records	8d04e3f3-1a80-4cb5-96db-57624d0461f7	\N	\N	2026-03-20 14:54:10.220231+00
d8e6a6ce-55b6-4860-81a6-f209d6cf17fa	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 9b73d988-ddf2-4deb-b3fb-13fae4f4c618	signing_records	9b73d988-ddf2-4deb-b3fb-13fae4f4c618	\N	\N	2026-03-20 14:57:11.470333+00
0abaee37-3c9d-4d4c-8628-3f1a15972bf6	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: eb03fc01-6d3e-463f-895c-d811ea5ac196	signing_records	eb03fc01-6d3e-463f-895c-d811ea5ac196	\N	\N	2026-03-21 13:37:10.370033+00
ad1505c4-0d57-4f97-b2f9-da6c12df4a2c	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 9b73d988-ddf2-4deb-b3fb-13fae4f4c618	signing_records	9b73d988-ddf2-4deb-b3fb-13fae4f4c618	\N	\N	2026-03-22 00:42:46.014205+00
02559629-299a-44ec-b09d-e7109cf4d7ab	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: a2c809e6-eeb1-4b01-a8b0-f3227efab7ac	signing_records	a2c809e6-eeb1-4b01-a8b0-f3227efab7ac	\N	\N	2026-03-22 00:43:05.024975+00
0d4de9b5-f499-4416-af6d-21758f6551b3	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 9c147a34-0e79-4367-ab90-c7c40ec088b0	signing_records	9c147a34-0e79-4367-ab90-c7c40ec088b0	\N	\N	2026-03-22 01:02:32.390224+00
3400859d-9bdf-44b9-9622-dbedb057b1bc	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: e20883a2-75a9-4d22-ac7d-5f7d70519075	signing_records	e20883a2-75a9-4d22-ac7d-5f7d70519075	\N	\N	2026-03-22 01:22:42.974445+00
1f04b756-dd10-4ef7-b715-619b051b1c2b	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: b2da6e38-a8c1-4bbb-bb51-8b76ec8089bf	signing_records	b2da6e38-a8c1-4bbb-bb51-8b76ec8089bf	\N	\N	2026-03-22 01:32:50.913721+00
05097710-b3c2-4a4e-9642-bf5542da7351	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 153790a9-f223-4b16-ac42-62bf89a18074	signing_records	153790a9-f223-4b16-ac42-62bf89a18074	\N	\N	2026-03-22 02:06:19.036706+00
5a1aaab3-465c-46e3-a51a-5cdbcfb58ee2	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: add4d5fb-773a-43f5-863c-cc33b36d10e0	signing_records	add4d5fb-773a-43f5-863c-cc33b36d10e0	\N	\N	2026-03-22 02:08:05.143796+00
f11156fd-27e3-4b32-b702-ada18488b7dd	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 5e58de8e-2938-4c84-83e5-8acb48709c73	signing_records	5e58de8e-2938-4c84-83e5-8acb48709c73	\N	\N	2026-03-22 06:53:39.911528+00
a48ae106-2d87-4dfb-b42c-02e58ea40dfb	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 5e58de8e-2938-4c84-83e5-8acb48709c73	signing_records	5e58de8e-2938-4c84-83e5-8acb48709c73	\N	\N	2026-03-22 09:42:39.146862+00
68621f2a-bf72-435a-a637-ebd07282806c	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: add4d5fb-773a-43f5-863c-cc33b36d10e0	signing_records	add4d5fb-773a-43f5-863c-cc33b36d10e0	\N	\N	2026-03-22 09:42:45.055733+00
ba16f1bf-3043-4c51-94d6-e099cc46b47d	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 153790a9-f223-4b16-ac42-62bf89a18074	signing_records	153790a9-f223-4b16-ac42-62bf89a18074	\N	\N	2026-03-22 09:42:49.21854+00
a173a5f1-08df-45b6-b4f5-a92bbfc64257	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: b2da6e38-a8c1-4bbb-bb51-8b76ec8089bf	signing_records	b2da6e38-a8c1-4bbb-bb51-8b76ec8089bf	\N	\N	2026-03-22 09:42:52.721494+00
8f37f121-6ad1-40e2-b5f4-bd1058c11845	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: e20883a2-75a9-4d22-ac7d-5f7d70519075	signing_records	e20883a2-75a9-4d22-ac7d-5f7d70519075	\N	\N	2026-03-22 09:42:58.746442+00
5ef9486e-a75b-4314-8c47-2ed022ee3dbf	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: 9c147a34-0e79-4367-ab90-c7c40ec088b0	signing_records	9c147a34-0e79-4367-ab90-c7c40ec088b0	\N	\N	2026-03-22 09:43:03.857925+00
c0805567-8bc4-4b61-b31e-6d29934c5a3f	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	更新签署记录: a2c809e6-eeb1-4b01-a8b0-f3227efab7ac	signing_records	a2c809e6-eeb1-4b01-a8b0-f3227efab7ac	\N	\N	2026-03-22 09:43:08.786827+00
f0d41d7b-5fc8-49e9-8d12-b531d2b2f54a	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 9d3cccf0-365b-4be3-9665-40b1ba5052af	signing_records	9d3cccf0-365b-4be3-9665-40b1ba5052af	\N	\N	2026-03-23 06:48:07.867766+00
b9182525-1d7d-4023-8bff-11ba60bcf565	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 768a1835-cd94-4299-8e65-d50de8c49c70	signing_records	768a1835-cd94-4299-8e65-d50de8c49c70	\N	\N	2026-03-23 09:27:40.530032+00
0148f9b8-460c-45c8-a585-7d37507b4ce0	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 2824e71e-93eb-4a3c-ab00-ae37f901c842	signing_records	2824e71e-93eb-4a3c-ab00-ae37f901c842	\N	\N	2026-03-23 13:54:00.609046+00
cae86b88-f360-4536-9c95-09bf26ae692a	b8b94902-d3df-43f8-aca6-28f39bb6e57b	signing_initiate	发起签署记录: 578560c7-e3bd-493e-895b-cb0b8bfcf837	signing_records	578560c7-e3bd-493e-895b-cb0b8bfcf837	\N	\N	2026-03-23 13:58:23.863729+00
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, code, name, description, created_at) FROM stdin;
da3273eb-0734-4df2-a878-793a9a25330e	company_manage	公司录入	管理公司信息	2026-03-17 09:53:44.717011+00
7a3f955e-4cac-4ff4-858a-b007b9379f2f	employee_manage	员工录入	管理员工信息	2026-03-17 09:53:44.717011+00
bca956ef-0b14-43e4-977e-857402cc1ba7	employee_status_manage	员工状态管理	修改员工状态	2026-03-17 09:53:44.717011+00
aadb0d21-4665-4221-a4f1-7025b68276db	document_initiate	文书发起	发起文书签署	2026-03-17 09:53:44.717011+00
507acb3f-b045-4fe5-8911-fd8d3e1c66e5	system_config	系统配置	系统配置管理	2026-03-17 09:53:44.717011+00
525fed62-cb01-4686-94f0-8e733008efe7	role_assign	角色分配	分配用户角色	2026-03-17 09:53:44.717011+00
5ef015f9-1fd1-41a5-8a55-a6d300d7cfd8	user_manage	用户管理	管理系统用户	2026-03-17 09:53:44.717011+00
eebe1fb5-b54b-4aa3-b79d-d7d5601b4013	template_manage	文书模板增加	管理文书模板	2026-03-17 09:53:44.717011+00
700c62b4-abab-42df-9f9b-df0931e088c9	document_manage	文书管理	管理文书记录	2026-03-17 09:53:44.717011+00
486ebb84-edd8-489f-b0ed-7331eb47bd35	company_view	公司查看	查看公司列表和详情	2026-03-17 09:53:46.002033+00
a0f18f71-5e82-4089-83e8-1491a0870444	company_create	公司新增	新增公司信息	2026-03-17 09:53:46.002033+00
52e80820-5b91-47ff-bd16-872b38795807	company_edit	公司编辑	编辑公司信息	2026-03-17 09:53:46.002033+00
e4664b6a-2221-4919-a352-eaf1842fc44b	company_delete	公司删除	删除公司记录	2026-03-17 09:53:46.002033+00
f9edacf6-0e1f-4053-8e17-93e7116a3242	company_export	公司导出	导出公司数据	2026-03-17 09:53:46.002033+00
d535eae7-c96e-42b1-a2b1-894f6472e9c8	employee_view	员工查看	查看员工列表和详情	2026-03-17 09:53:46.002033+00
d13ef9d5-b164-43c1-8264-b8d9d13f7e69	employee_create	员工新增	新增员工信息	2026-03-17 09:53:46.002033+00
af9270d4-d57a-4810-9856-d6b287250509	employee_edit	员工编辑	编辑员工信息	2026-03-17 09:53:46.002033+00
a3ba15ae-06a7-41a6-815f-b45b48948184	employee_delete	员工删除	删除员工记录	2026-03-17 09:53:46.002033+00
63515440-3125-4e0b-bc9b-7731773c68e7	employee_export	员工导出	导出员工数据	2026-03-17 09:53:46.002033+00
b0b69dee-78d5-4389-af61-5cb43da4adf9	employee_status_view	员工状态查看	查看员工状态	2026-03-17 09:53:46.002033+00
fde516d6-b946-4b79-af75-44174a8aa245	employee_status_edit	员工状态编辑	修改员工状态	2026-03-17 09:53:46.002033+00
37218e4e-0331-4438-8c4c-ca3748035ac0	template_view	模板查看	查看文书模板列表和详情	2026-03-17 09:53:46.002033+00
d68cbd01-e9ba-4186-8c61-b44fd172744e	template_create	模板新增	新增文书模板	2026-03-17 09:53:46.002033+00
7ff9c8d3-effe-42f1-8086-008e299d634a	template_edit	模板编辑	编辑文书模板	2026-03-17 09:53:46.002033+00
4a0a624d-7996-4f62-9260-3f56cb52d4b3	template_delete	模板删除	删除文书模板	2026-03-17 09:53:46.002033+00
069727ad-2ad2-4f9b-98f8-3f43c42ed719	template_enable	模板启用	启用或禁用文书模板	2026-03-17 09:53:46.002033+00
12269114-9bfc-4fa8-8f68-661370054562	signing_view	签署查看	查看签署记录和状态	2026-03-17 09:53:46.002033+00
057d4b01-fa3a-44e3-917f-dabeb17b96fd	signing_initiate	签署发起	发起文书签署流程	2026-03-17 09:53:46.002033+00
917ab3fd-0c94-4b75-9a87-03e5af8d04f5	signing_revoke	签署撤回	撤回已发起的签署	2026-03-17 09:53:46.002033+00
db75d125-da6a-47b9-8d6b-09b1a9555f97	signing_delete	签署删除	删除签署记录	2026-03-17 09:53:46.002033+00
07ef48f7-576f-443c-b54e-aa001f9edac8	signing_export	签署导出	导出签署数据	2026-03-17 09:53:46.002033+00
d2f40cf9-ff9a-41af-a4c5-35499f458639	signing_download	签署下载	下载已签署文件	2026-03-17 09:53:46.002033+00
24c2ca53-a493-48ac-ba25-4a57d1f45e7f	signing_statistics	签署统计	查看签署数据统计	2026-03-17 09:53:46.002033+00
8ab7b80c-8b25-447a-beb9-e46fb7d28f25	salary_structure_view	工资结构查看	查看工资结构模板	2026-03-17 09:53:46.002033+00
0b5bf82b-7eae-4201-b420-6e8c419c5fc2	salary_structure_create	工资结构新增	新增工资结构模板	2026-03-17 09:53:46.002033+00
9f7d8b31-2424-49ab-96f7-c3d07ef6ab96	salary_structure_edit	工资结构编辑	编辑工资结构模板	2026-03-17 09:53:46.002033+00
cf58f3b5-bfd6-491c-94cb-be4e1ce32276	salary_structure_delete	工资结构删除	删除工资结构模板	2026-03-17 09:53:46.002033+00
ad1b8a86-0d51-4ec6-aa17-b8773fd2a929	salary_record_view	工资记录查看	查看工资记录	2026-03-17 09:53:46.002033+00
eb32e3eb-50d1-4f11-8aee-ccfd479f1332	salary_record_upload	工资表上传	上传工资表文件	2026-03-17 09:53:46.002033+00
d8576678-3958-4715-9e23-2caa14a44214	salary_record_edit	工资记录编辑	编辑工资记录	2026-03-17 09:53:46.002033+00
71197dda-4b02-4be8-a472-083a34bf0a52	salary_record_delete	工资记录删除	删除工资记录	2026-03-17 09:53:46.002033+00
31d81cab-fd2f-4656-a8f3-1ece0d04ee64	salary_record_export	工资记录导出	导出工资数据	2026-03-17 09:53:46.002033+00
6b6abf47-d18a-4373-b7dd-958105bcfaa4	salary_signing_view	工资条签署查看	查看工资条签署状态	2026-03-17 09:53:46.002033+00
33d26f83-0dfd-4351-b443-781a0616d733	salary_signing_initiate	工资条签署发起	发起工资条签署	2026-03-17 09:53:46.002033+00
e65324f8-6502-419f-b723-87e3733257f1	salary_signing_revoke	工资条签署撤回	撤回工资条签署	2026-03-17 09:53:46.002033+00
dc5a9bd2-f0c0-430a-895a-187d564db9f2	salary_signing_delete	工资条签署删除	删除工资条签署记录	2026-03-17 09:53:46.002033+00
aee06633-e2f9-44e0-8e3a-4df81cbd242b	attendance_view	考勤查看	查看考勤记录	2026-03-17 09:53:46.002033+00
01b8097d-346c-4839-af1b-0fb39629d87d	attendance_upload	考勤上传	上传考勤表文件	2026-03-17 09:53:46.002033+00
6d8a9d7a-48a8-4f91-bfbf-5af7a3d7d126	attendance_edit	考勤编辑	编辑考勤记录	2026-03-17 09:53:46.002033+00
d9bcd7ec-78d2-44a8-960f-4c4b5eeac1a9	attendance_delete	考勤删除	删除考勤记录	2026-03-17 09:53:46.002033+00
24a840ce-3359-41b6-8a27-747613ca9057	attendance_export	考勤导出	导出考勤数据	2026-03-17 09:53:46.002033+00
6602f5ea-64e6-40bb-897f-5015ad9286c2	attendance_signing_view	考勤签署查看	查看考勤确认签署状态	2026-03-17 09:53:46.002033+00
c42e37d8-f5c6-4e9f-8f44-ef39c9cd328c	attendance_signing_initiate	考勤签署发起	发起考勤确认签署	2026-03-17 09:53:46.002033+00
653a2a9d-7b66-4b8b-9b34-4de2f3dcfbe7	attendance_signing_revoke	考勤签署撤回	撤回考勤确认签署	2026-03-17 09:53:46.002033+00
2ed680ee-acbc-42df-b1fc-8b3933e6b5ac	attendance_signing_delete	考勤签署删除	删除考勤签署记录	2026-03-17 09:53:46.002033+00
f99f29be-99ad-4d1b-92b7-ab331dc7cbb4	user_view	用户查看	查看用户列表和详情	2026-03-17 09:53:46.002033+00
c08105d5-820a-49e5-ab21-fd7e99845ab7	user_create	用户新增	新增系统用户	2026-03-17 09:53:46.002033+00
ce87bc13-11ed-4638-8522-c03ebca5ef6b	user_edit	用户编辑	编辑用户信息	2026-03-17 09:53:46.002033+00
7f50affd-01dc-4202-abee-a4283909a2dc	user_delete	用户删除	删除或停用用户	2026-03-17 09:53:46.002033+00
b0b36850-8f97-4162-9739-dabe88881b3c	user_role_assign	用户角色分配	为用户分配角色	2026-03-17 09:53:46.002033+00
4f24c54c-4e64-4239-8d94-27af596fef53	role_view	角色查看	查看角色列表和详情	2026-03-17 09:53:46.002033+00
43412fa0-c46e-49a9-b6ab-f9afad894b9b	role_create	角色新增	新增系统角色	2026-03-17 09:53:46.002033+00
82e9921e-372f-4c14-98df-76e776d1edf8	role_edit	角色编辑	编辑角色信息	2026-03-17 09:53:46.002033+00
a5403981-a803-4be9-ba48-a5a5383dece3	role_delete	角色删除	删除角色	2026-03-17 09:53:46.002033+00
e1cdb536-30ec-436c-acb4-5d391625ef57	role_permission_config	角色权限配置	配置角色的权限	2026-03-17 09:53:46.002033+00
f35cd205-96c0-462f-901c-2c6de3ae613f	system_config_view	系统配置查看	查看系统配置	2026-03-17 09:53:46.002033+00
7792b168-351f-41d5-9dbc-d60686402546	system_config_edit	系统配置编辑	编辑系统配置	2026-03-17 09:53:46.002033+00
d5ff9881-8118-4067-bdac-edc71f55f06c	esign_config_view	电子签配置查看	查看电子签API配置	2026-03-17 09:53:46.002033+00
c1e0c7d9-ae46-4527-8b8e-c217e922f1ac	esign_config_edit	电子签配置编辑	编辑电子签API配置	2026-03-17 09:53:46.002033+00
bc5becd5-e295-472d-9cde-cd5c2b15170e	reminder_config_view	提醒配置查看	查看提醒配置	2026-03-17 09:53:46.002033+00
ce9cf641-4964-4d67-89a8-3e04b8d51b3a	reminder_config_edit	提醒配置编辑	编辑提醒配置	2026-03-17 09:53:46.002033+00
206530b5-f791-42f6-b122-e587715e5d97	notification_view	通知查看	查看系统通知	2026-03-17 09:53:46.002033+00
47d95d3b-fe16-4ded-a7c7-d098b24f16fe	notification_send	通知发送	发送系统通知	2026-03-17 09:53:46.002033+00
69d5a722-a65b-41e6-bbd0-67b2befe80f2	notification_delete	通知删除	删除通知记录	2026-03-17 09:53:46.002033+00
0e7bcf0c-622f-4764-94dd-53c57e586c1e	dashboard_view	看板查看	查看数据看板	2026-03-17 09:53:44.717011+00
d2e512a5-6615-4979-a321-c0b1c7d9b4cc	statistics_view	统计查看	查看数据统计	2026-03-17 09:53:46.002033+00
df51db60-f883-46e9-b874-71e4da64b477	report_view	报表查看	查看各类报表	2026-03-17 09:53:46.002033+00
db8d0a57-d7da-450e-aaec-ae7999285ded	report_export	报表导出	导出报表数据	2026-03-17 09:53:46.002033+00
600d5204-e33e-4fd4-8634-1be61b0e7d54	audit_log_view	操作日志查看	查看系统操作日志	2026-03-17 09:53:45.508481+00
286fd781-f127-47b9-9d1c-728f374ba172	audit_log_export	操作日志导出	导出操作日志数据	2026-03-17 09:53:45.508481+00
e23b6b40-1868-43b8-b166-ac71dfae6373	ai_assistant_use	AI助手使用	使用AI助手功能	2026-03-17 09:53:45.508481+00
4c01cb6e-3425-496a-a076-48a2a3b81406	recruitment_query_view	招聘数据查看	查看招聘数据查询结果	2026-03-17 09:53:45.508481+00
660a3116-e3cd-4448-82bc-145a1fa115e1	recruitment_query_export	招聘数据导出	导出招聘数据	2026-03-17 09:53:45.508481+00
fbb45b77-4b39-41bb-b770-39091ebe7a60	identity_verification_manage	实名认证管理	管理实名认证	2026-03-17 09:53:45.508481+00
9ae83f85-28ac-49e0-8ce5-9de8109f8d93	identity_verification_view	实名认证查看	查看实名认证记录	2026-03-17 09:53:45.508481+00
106226bd-cc01-44f4-969e-c4da2efe8f23	subordinate_view	下属查看	查看下属员工	2026-03-17 09:53:46.002033+00
df5729aa-871e-4b54-ae91-659054e4fc4d	subordinate_manage	下属管理	管理下属员工	2026-03-17 09:53:44.717011+00
cde2dcc4-ba4f-483b-8223-f0c3b511aa88	signed_document_view	已签文书查看	查看已签署文书	2026-03-17 09:53:46.002033+00
15ae9484-e449-4e8f-8b16-60d29f0c51c8	signed_document_download	已签文书下载	下载已签署文书	2026-03-17 09:53:46.002033+00
f3d2fdd2-5b11-4141-a0cf-75d8f0fcd5e2	salary_archive_view	薪酬档案查看	查看薪酬档案	2026-03-17 09:53:46.002033+00
807f200c-c665-4667-bf08-473c07f8c4b6	salary_archive_download	薪酬档案下载	下载薪酬档案	2026-03-17 09:53:46.002033+00
1de8a664-d738-499d-943f-a061280a5b55	customer_view	客户查看	查看客户列表和详情	2026-03-17 09:53:46.01173+00
a22fcdb8-ef6b-4228-9e7b-c198a127e982	customer_create	客户新增	新增客户信息	2026-03-17 09:53:46.01173+00
2303ea43-7aaf-4823-9b90-24e865c1018e	customer_edit	客户编辑	编辑客户信息	2026-03-17 09:53:46.01173+00
caa44d61-29cc-4b2f-b72f-55c792a56191	customer_delete	客户删除	删除客户记录	2026-03-17 09:53:46.01173+00
0cbcd78a-2b80-4359-9b53-fd5076ba4a88	customer_export	客户导出	导出客户数据	2026-03-17 09:53:46.01173+00
ffd65bec-c889-4600-8cbb-b2d8e4744d6e	customer_seal_view	客户签章查看	查看客户签章使用数据	2026-03-17 09:53:46.01173+00
0c924f94-1667-410d-a484-8668e40e6618	company_transfer	公司流转	流转公司所有权	2026-03-17 09:53:46.01173+00
6dfa0633-a68e-4f42-84ec-c6ccf19bd2b6	company_transfer_history_view	公司流转历史查看	查看公司流转历史记录	2026-03-17 09:53:46.01173+00
33d72992-a319-4118-bec6-0b5852e7b89c	employee_import	员工批量导入	批量导入员工数据	2026-03-17 09:53:46.01173+00
d86af304-1f22-478b-83a3-5aa105b5446d	document_history_view	文书历史查看	查看员工文书签署历史记录	2026-03-17 09:53:46.01173+00
e409f3d0-e106-40e1-8527-5b4d8f804856	document_history_export	文书历史导出	导出文书历史数据	2026-03-17 09:53:46.01173+00
c0908d91-3925-4953-a7d1-f739dafb6832	batch_download	批量下载	批量下载记录数据	2026-03-17 09:53:46.01173+00
c8ee4754-ff5a-41e9-9887-f143026cd9bf	batch_revoke	批量撤回	批量撤回签署记录	2026-03-17 09:53:46.01173+00
8674e9ce-70f1-4c78-a589-be0246d315df	batch_delete	批量删除	批量删除记录	2026-03-17 09:53:46.01173+00
943861d5-110f-4935-812f-53cbb62c8652	salary_split	工资表拆分	将工资表拆分为工资条	2026-03-17 09:53:46.01173+00
1798fcbf-c4cf-470f-a11f-aafa1b105a32	sms_send	短信发送	发送签署短信通知	2026-03-17 09:53:46.01173+00
6f2087e1-a11f-4044-b84a-83fcd5fa12b2	sms_batch_send	批量短信发送	批量发送签署短信	2026-03-17 09:53:46.01173+00
8ebf1224-3286-4f0a-8efe-c101deee1109	salary_template_view	工资结构模板查看	查看工资结构模板	2026-03-17 09:53:46.01173+00
3d43dd3d-531d-4dd4-a651-1366b6c7e8a2	salary_template_create	工资结构模板新增	新增工资结构模板	2026-03-17 09:53:46.01173+00
774aaf1c-0b7f-431c-af9c-5d3785da0ea9	salary_template_edit	工资结构模板编辑	编辑工资结构模板	2026-03-17 09:53:46.01173+00
efd2c786-0956-4648-9ba2-a72b3ddcb707	salary_template_delete	工资结构模板删除	删除工资结构模板	2026-03-17 09:53:46.01173+00
482fa4f2-a7c3-47de-916a-b19d8a24e80d	salary_item_view	工资条查看	查看工资条列表	2026-03-17 09:53:46.01173+00
85c6fb0a-7acf-4d91-a84a-d583d9fbdf6c	salary_item_export	工资条导出	导出工资条数据	2026-03-17 09:53:46.01173+00
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, username, full_name, phone, role, company_id, created_at, updated_at, manager_id, role_id, is_active) FROM stdin;
b8b94902-d3df-43f8-aca6-28f39bb6e57b	15897752509@jiutouniao.local	\N	\N	super_admin	\N	2026-03-17 10:55:37.733002+00	2026-03-17 10:55:37.733002+00	\N	\N	t
\.


--
-- Data for Name: reminder_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reminder_configs (id, company_id, contract_expiry_days, enable_sms, enable_in_app, created_at, updated_at, renewal_notice_days) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
33333333-3333-3333-3333-333333333333	da3273eb-0734-4df2-a878-793a9a25330e
33333333-3333-3333-3333-333333333333	7a3f955e-4cac-4ff4-858a-b007b9379f2f
33333333-3333-3333-3333-333333333333	bca956ef-0b14-43e4-977e-857402cc1ba7
33333333-3333-3333-3333-333333333333	aadb0d21-4665-4221-a4f1-7025b68276db
33333333-3333-3333-3333-333333333333	525fed62-cb01-4686-94f0-8e733008efe7
33333333-3333-3333-3333-333333333333	5ef015f9-1fd1-41a5-8a55-a6d300d7cfd8
33333333-3333-3333-3333-333333333333	eebe1fb5-b54b-4aa3-b79d-d7d5601b4013
33333333-3333-3333-3333-333333333333	700c62b4-abab-42df-9f9b-df0931e088c9
33333333-3333-3333-3333-333333333333	0e7bcf0c-622f-4764-94dd-53c57e586c1e
33333333-3333-3333-3333-333333333333	df5729aa-871e-4b54-ae91-659054e4fc4d
33333333-3333-3333-3333-333333333333	e23b6b40-1868-43b8-b166-ac71dfae6373
33333333-3333-3333-3333-333333333333	4c01cb6e-3425-496a-a076-48a2a3b81406
33333333-3333-3333-3333-333333333333	660a3116-e3cd-4448-82bc-145a1fa115e1
33333333-3333-3333-3333-333333333333	fbb45b77-4b39-41bb-b770-39091ebe7a60
33333333-3333-3333-3333-333333333333	9ae83f85-28ac-49e0-8ce5-9de8109f8d93
33333333-3333-3333-3333-333333333333	600d5204-e33e-4fd4-8634-1be61b0e7d54
33333333-3333-3333-3333-333333333333	286fd781-f127-47b9-9d1c-728f374ba172
22222222-2222-2222-2222-222222222222	7a3f955e-4cac-4ff4-858a-b007b9379f2f
22222222-2222-2222-2222-222222222222	bca956ef-0b14-43e4-977e-857402cc1ba7
22222222-2222-2222-2222-222222222222	aadb0d21-4665-4221-a4f1-7025b68276db
22222222-2222-2222-2222-222222222222	700c62b4-abab-42df-9f9b-df0931e088c9
22222222-2222-2222-2222-222222222222	0e7bcf0c-622f-4764-94dd-53c57e586c1e
22222222-2222-2222-2222-222222222222	df5729aa-871e-4b54-ae91-659054e4fc4d
11111111-1111-1111-1111-111111111111	7a3f955e-4cac-4ff4-858a-b007b9379f2f
11111111-1111-1111-1111-111111111111	aadb0d21-4665-4221-a4f1-7025b68276db
11111111-1111-1111-1111-111111111111	0e7bcf0c-622f-4764-94dd-53c57e586c1e
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	da3273eb-0734-4df2-a878-793a9a25330e
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	7a3f955e-4cac-4ff4-858a-b007b9379f2f
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	bca956ef-0b14-43e4-977e-857402cc1ba7
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	aadb0d21-4665-4221-a4f1-7025b68276db
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	507acb3f-b045-4fe5-8911-fd8d3e1c66e5
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	525fed62-cb01-4686-94f0-8e733008efe7
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	5ef015f9-1fd1-41a5-8a55-a6d300d7cfd8
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	eebe1fb5-b54b-4aa3-b79d-d7d5601b4013
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	700c62b4-abab-42df-9f9b-df0931e088c9
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	486ebb84-edd8-489f-b0ed-7331eb47bd35
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	a0f18f71-5e82-4089-83e8-1491a0870444
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	52e80820-5b91-47ff-bd16-872b38795807
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	e4664b6a-2221-4919-a352-eaf1842fc44b
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	f9edacf6-0e1f-4053-8e17-93e7116a3242
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	d535eae7-c96e-42b1-a2b1-894f6472e9c8
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	d13ef9d5-b164-43c1-8264-b8d9d13f7e69
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	af9270d4-d57a-4810-9856-d6b287250509
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	a3ba15ae-06a7-41a6-815f-b45b48948184
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	63515440-3125-4e0b-bc9b-7731773c68e7
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	b0b69dee-78d5-4389-af61-5cb43da4adf9
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	fde516d6-b946-4b79-af75-44174a8aa245
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	37218e4e-0331-4438-8c4c-ca3748035ac0
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	d68cbd01-e9ba-4186-8c61-b44fd172744e
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	7ff9c8d3-effe-42f1-8086-008e299d634a
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	4a0a624d-7996-4f62-9260-3f56cb52d4b3
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	069727ad-2ad2-4f9b-98f8-3f43c42ed719
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	12269114-9bfc-4fa8-8f68-661370054562
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	057d4b01-fa3a-44e3-917f-dabeb17b96fd
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	917ab3fd-0c94-4b75-9a87-03e5af8d04f5
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	db75d125-da6a-47b9-8d6b-09b1a9555f97
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	07ef48f7-576f-443c-b54e-aa001f9edac8
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	d2f40cf9-ff9a-41af-a4c5-35499f458639
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	24c2ca53-a493-48ac-ba25-4a57d1f45e7f
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	8ab7b80c-8b25-447a-beb9-e46fb7d28f25
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	0b5bf82b-7eae-4201-b420-6e8c419c5fc2
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	9f7d8b31-2424-49ab-96f7-c3d07ef6ab96
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	cf58f3b5-bfd6-491c-94cb-be4e1ce32276
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	ad1b8a86-0d51-4ec6-aa17-b8773fd2a929
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	eb32e3eb-50d1-4f11-8aee-ccfd479f1332
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	d8576678-3958-4715-9e23-2caa14a44214
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	71197dda-4b02-4be8-a472-083a34bf0a52
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	31d81cab-fd2f-4656-a8f3-1ece0d04ee64
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	6b6abf47-d18a-4373-b7dd-958105bcfaa4
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	33d26f83-0dfd-4351-b443-781a0616d733
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	e65324f8-6502-419f-b723-87e3733257f1
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	dc5a9bd2-f0c0-430a-895a-187d564db9f2
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	aee06633-e2f9-44e0-8e3a-4df81cbd242b
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	01b8097d-346c-4839-af1b-0fb39629d87d
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	6d8a9d7a-48a8-4f91-bfbf-5af7a3d7d126
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	d9bcd7ec-78d2-44a8-960f-4c4b5eeac1a9
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	24a840ce-3359-41b6-8a27-747613ca9057
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	6602f5ea-64e6-40bb-897f-5015ad9286c2
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	c42e37d8-f5c6-4e9f-8f44-ef39c9cd328c
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	653a2a9d-7b66-4b8b-9b34-4de2f3dcfbe7
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	2ed680ee-acbc-42df-b1fc-8b3933e6b5ac
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	f99f29be-99ad-4d1b-92b7-ab331dc7cbb4
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	c08105d5-820a-49e5-ab21-fd7e99845ab7
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	ce87bc13-11ed-4638-8522-c03ebca5ef6b
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	7f50affd-01dc-4202-abee-a4283909a2dc
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	b0b36850-8f97-4162-9739-dabe88881b3c
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	4f24c54c-4e64-4239-8d94-27af596fef53
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	43412fa0-c46e-49a9-b6ab-f9afad894b9b
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	82e9921e-372f-4c14-98df-76e776d1edf8
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	a5403981-a803-4be9-ba48-a5a5383dece3
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	e1cdb536-30ec-436c-acb4-5d391625ef57
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	f35cd205-96c0-462f-901c-2c6de3ae613f
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	7792b168-351f-41d5-9dbc-d60686402546
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	d5ff9881-8118-4067-bdac-edc71f55f06c
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	c1e0c7d9-ae46-4527-8b8e-c217e922f1ac
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	bc5becd5-e295-472d-9cde-cd5c2b15170e
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	ce9cf641-4964-4d67-89a8-3e04b8d51b3a
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	206530b5-f791-42f6-b122-e587715e5d97
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	47d95d3b-fe16-4ded-a7c7-d098b24f16fe
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	69d5a722-a65b-41e6-bbd0-67b2befe80f2
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	0e7bcf0c-622f-4764-94dd-53c57e586c1e
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	d2e512a5-6615-4979-a321-c0b1c7d9b4cc
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	df51db60-f883-46e9-b874-71e4da64b477
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	db8d0a57-d7da-450e-aaec-ae7999285ded
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	600d5204-e33e-4fd4-8634-1be61b0e7d54
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	286fd781-f127-47b9-9d1c-728f374ba172
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	e23b6b40-1868-43b8-b166-ac71dfae6373
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	4c01cb6e-3425-496a-a076-48a2a3b81406
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	660a3116-e3cd-4448-82bc-145a1fa115e1
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	fbb45b77-4b39-41bb-b770-39091ebe7a60
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	9ae83f85-28ac-49e0-8ce5-9de8109f8d93
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	106226bd-cc01-44f4-969e-c4da2efe8f23
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	df5729aa-871e-4b54-ae91-659054e4fc4d
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	cde2dcc4-ba4f-483b-8223-f0c3b511aa88
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	15ae9484-e449-4e8f-8b16-60d29f0c51c8
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	f3d2fdd2-5b11-4141-a0cf-75d8f0fcd5e2
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	807f200c-c665-4667-bf08-473c07f8c4b6
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	1de8a664-d738-499d-943f-a061280a5b55
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	a22fcdb8-ef6b-4228-9e7b-c198a127e982
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	2303ea43-7aaf-4823-9b90-24e865c1018e
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	caa44d61-29cc-4b2f-b72f-55c792a56191
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	0cbcd78a-2b80-4359-9b53-fd5076ba4a88
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	ffd65bec-c889-4600-8cbb-b2d8e4744d6e
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	0c924f94-1667-410d-a484-8668e40e6618
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	6dfa0633-a68e-4f42-84ec-c6ccf19bd2b6
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	33d72992-a319-4118-bec6-0b5852e7b89c
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	d86af304-1f22-478b-83a3-5aa105b5446d
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	e409f3d0-e106-40e1-8527-5b4d8f804856
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	c0908d91-3925-4953-a7d1-f739dafb6832
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	c8ee4754-ff5a-41e9-9887-f143026cd9bf
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	8674e9ce-70f1-4c78-a589-be0246d315df
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	943861d5-110f-4935-812f-53cbb62c8652
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	1798fcbf-c4cf-470f-a11f-aafa1b105a32
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	6f2087e1-a11f-4044-b84a-83fcd5fa12b2
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	8ebf1224-3286-4f0a-8efe-c101deee1109
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	3d43dd3d-531d-4dd4-a651-1366b6c7e8a2
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	774aaf1c-0b7f-431c-af9c-5d3785da0ea9
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	efd2c786-0956-4648-9ba2-a72b3ddcb707
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	482fa4f2-a7c3-47de-916a-b19d8a24e80d
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	85c6fb0a-7acf-4d91-a84a-d583d9fbdf6c
df704348-fff9-4571-9950-401338e62d50	486ebb84-edd8-489f-b0ed-7331eb47bd35
df704348-fff9-4571-9950-401338e62d50	a0f18f71-5e82-4089-83e8-1491a0870444
df704348-fff9-4571-9950-401338e62d50	52e80820-5b91-47ff-bd16-872b38795807
df704348-fff9-4571-9950-401338e62d50	f9edacf6-0e1f-4053-8e17-93e7116a3242
df704348-fff9-4571-9950-401338e62d50	d535eae7-c96e-42b1-a2b1-894f6472e9c8
df704348-fff9-4571-9950-401338e62d50	d13ef9d5-b164-43c1-8264-b8d9d13f7e69
df704348-fff9-4571-9950-401338e62d50	af9270d4-d57a-4810-9856-d6b287250509
df704348-fff9-4571-9950-401338e62d50	a3ba15ae-06a7-41a6-815f-b45b48948184
df704348-fff9-4571-9950-401338e62d50	63515440-3125-4e0b-bc9b-7731773c68e7
df704348-fff9-4571-9950-401338e62d50	b0b69dee-78d5-4389-af61-5cb43da4adf9
df704348-fff9-4571-9950-401338e62d50	fde516d6-b946-4b79-af75-44174a8aa245
df704348-fff9-4571-9950-401338e62d50	37218e4e-0331-4438-8c4c-ca3748035ac0
df704348-fff9-4571-9950-401338e62d50	d68cbd01-e9ba-4186-8c61-b44fd172744e
df704348-fff9-4571-9950-401338e62d50	7ff9c8d3-effe-42f1-8086-008e299d634a
df704348-fff9-4571-9950-401338e62d50	069727ad-2ad2-4f9b-98f8-3f43c42ed719
df704348-fff9-4571-9950-401338e62d50	12269114-9bfc-4fa8-8f68-661370054562
df704348-fff9-4571-9950-401338e62d50	057d4b01-fa3a-44e3-917f-dabeb17b96fd
df704348-fff9-4571-9950-401338e62d50	917ab3fd-0c94-4b75-9a87-03e5af8d04f5
df704348-fff9-4571-9950-401338e62d50	db75d125-da6a-47b9-8d6b-09b1a9555f97
df704348-fff9-4571-9950-401338e62d50	07ef48f7-576f-443c-b54e-aa001f9edac8
df704348-fff9-4571-9950-401338e62d50	d2f40cf9-ff9a-41af-a4c5-35499f458639
df704348-fff9-4571-9950-401338e62d50	24c2ca53-a493-48ac-ba25-4a57d1f45e7f
df704348-fff9-4571-9950-401338e62d50	ad1b8a86-0d51-4ec6-aa17-b8773fd2a929
df704348-fff9-4571-9950-401338e62d50	eb32e3eb-50d1-4f11-8aee-ccfd479f1332
df704348-fff9-4571-9950-401338e62d50	d8576678-3958-4715-9e23-2caa14a44214
df704348-fff9-4571-9950-401338e62d50	71197dda-4b02-4be8-a472-083a34bf0a52
df704348-fff9-4571-9950-401338e62d50	31d81cab-fd2f-4656-a8f3-1ece0d04ee64
df704348-fff9-4571-9950-401338e62d50	6b6abf47-d18a-4373-b7dd-958105bcfaa4
df704348-fff9-4571-9950-401338e62d50	33d26f83-0dfd-4351-b443-781a0616d733
df704348-fff9-4571-9950-401338e62d50	e65324f8-6502-419f-b723-87e3733257f1
df704348-fff9-4571-9950-401338e62d50	dc5a9bd2-f0c0-430a-895a-187d564db9f2
df704348-fff9-4571-9950-401338e62d50	aee06633-e2f9-44e0-8e3a-4df81cbd242b
df704348-fff9-4571-9950-401338e62d50	01b8097d-346c-4839-af1b-0fb39629d87d
df704348-fff9-4571-9950-401338e62d50	6d8a9d7a-48a8-4f91-bfbf-5af7a3d7d126
df704348-fff9-4571-9950-401338e62d50	d9bcd7ec-78d2-44a8-960f-4c4b5eeac1a9
df704348-fff9-4571-9950-401338e62d50	24a840ce-3359-41b6-8a27-747613ca9057
df704348-fff9-4571-9950-401338e62d50	6602f5ea-64e6-40bb-897f-5015ad9286c2
df704348-fff9-4571-9950-401338e62d50	c42e37d8-f5c6-4e9f-8f44-ef39c9cd328c
df704348-fff9-4571-9950-401338e62d50	653a2a9d-7b66-4b8b-9b34-4de2f3dcfbe7
df704348-fff9-4571-9950-401338e62d50	2ed680ee-acbc-42df-b1fc-8b3933e6b5ac
df704348-fff9-4571-9950-401338e62d50	206530b5-f791-42f6-b122-e587715e5d97
df704348-fff9-4571-9950-401338e62d50	47d95d3b-fe16-4ded-a7c7-d098b24f16fe
df704348-fff9-4571-9950-401338e62d50	0e7bcf0c-622f-4764-94dd-53c57e586c1e
df704348-fff9-4571-9950-401338e62d50	d2e512a5-6615-4979-a321-c0b1c7d9b4cc
df704348-fff9-4571-9950-401338e62d50	df51db60-f883-46e9-b874-71e4da64b477
df704348-fff9-4571-9950-401338e62d50	db8d0a57-d7da-450e-aaec-ae7999285ded
df704348-fff9-4571-9950-401338e62d50	600d5204-e33e-4fd4-8634-1be61b0e7d54
df704348-fff9-4571-9950-401338e62d50	286fd781-f127-47b9-9d1c-728f374ba172
df704348-fff9-4571-9950-401338e62d50	e23b6b40-1868-43b8-b166-ac71dfae6373
df704348-fff9-4571-9950-401338e62d50	4c01cb6e-3425-496a-a076-48a2a3b81406
df704348-fff9-4571-9950-401338e62d50	660a3116-e3cd-4448-82bc-145a1fa115e1
df704348-fff9-4571-9950-401338e62d50	106226bd-cc01-44f4-969e-c4da2efe8f23
df704348-fff9-4571-9950-401338e62d50	df5729aa-871e-4b54-ae91-659054e4fc4d
df704348-fff9-4571-9950-401338e62d50	cde2dcc4-ba4f-483b-8223-f0c3b511aa88
df704348-fff9-4571-9950-401338e62d50	15ae9484-e449-4e8f-8b16-60d29f0c51c8
df704348-fff9-4571-9950-401338e62d50	f3d2fdd2-5b11-4141-a0cf-75d8f0fcd5e2
df704348-fff9-4571-9950-401338e62d50	807f200c-c665-4667-bf08-473c07f8c4b6
df704348-fff9-4571-9950-401338e62d50	1de8a664-d738-499d-943f-a061280a5b55
df704348-fff9-4571-9950-401338e62d50	a22fcdb8-ef6b-4228-9e7b-c198a127e982
df704348-fff9-4571-9950-401338e62d50	2303ea43-7aaf-4823-9b90-24e865c1018e
df704348-fff9-4571-9950-401338e62d50	0cbcd78a-2b80-4359-9b53-fd5076ba4a88
df704348-fff9-4571-9950-401338e62d50	ffd65bec-c889-4600-8cbb-b2d8e4744d6e
df704348-fff9-4571-9950-401338e62d50	6dfa0633-a68e-4f42-84ec-c6ccf19bd2b6
df704348-fff9-4571-9950-401338e62d50	33d72992-a319-4118-bec6-0b5852e7b89c
df704348-fff9-4571-9950-401338e62d50	d86af304-1f22-478b-83a3-5aa105b5446d
df704348-fff9-4571-9950-401338e62d50	e409f3d0-e106-40e1-8527-5b4d8f804856
df704348-fff9-4571-9950-401338e62d50	c0908d91-3925-4953-a7d1-f739dafb6832
df704348-fff9-4571-9950-401338e62d50	c8ee4754-ff5a-41e9-9887-f143026cd9bf
df704348-fff9-4571-9950-401338e62d50	8674e9ce-70f1-4c78-a589-be0246d315df
df704348-fff9-4571-9950-401338e62d50	943861d5-110f-4935-812f-53cbb62c8652
df704348-fff9-4571-9950-401338e62d50	1798fcbf-c4cf-470f-a11f-aafa1b105a32
df704348-fff9-4571-9950-401338e62d50	6f2087e1-a11f-4044-b84a-83fcd5fa12b2
df704348-fff9-4571-9950-401338e62d50	8ebf1224-3286-4f0a-8efe-c101deee1109
df704348-fff9-4571-9950-401338e62d50	3d43dd3d-531d-4dd4-a651-1366b6c7e8a2
df704348-fff9-4571-9950-401338e62d50	774aaf1c-0b7f-431c-af9c-5d3785da0ea9
df704348-fff9-4571-9950-401338e62d50	482fa4f2-a7c3-47de-916a-b19d8a24e80d
df704348-fff9-4571-9950-401338e62d50	85c6fb0a-7acf-4d91-a84a-d583d9fbdf6c
509101c6-51df-4219-a540-de8155d24b9d	206530b5-f791-42f6-b122-e587715e5d97
509101c6-51df-4219-a540-de8155d24b9d	0e7bcf0c-622f-4764-94dd-53c57e586c1e
509101c6-51df-4219-a540-de8155d24b9d	e23b6b40-1868-43b8-b166-ac71dfae6373
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, company_id, is_system_role, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	人事专员	负责基础员工管理	\N	f	2026-03-17 09:53:45.201152+00	2026-03-17 09:53:45.201152+00
22222222-2222-2222-2222-222222222222	人事主管	负责员工管理审批	\N	f	2026-03-17 09:53:45.201152+00	2026-03-17 09:53:45.201152+00
33333333-3333-3333-3333-333333333333	人事经理	负责全面员工管理	\N	f	2026-03-17 09:53:45.201152+00	2026-03-17 09:53:45.201152+00
78d9bf7d-9dcc-4d8f-86ac-d1c97a615699	超级管理员	系统最高权限角色，拥有所有功能权限	\N	t	2026-03-17 09:53:46.019014+00	2026-03-17 09:53:46.019014+00
df704348-fff9-4571-9950-401338e62d50	主管	业务主管角色，拥有大部分业务功能权限	\N	t	2026-03-17 09:53:46.019014+00	2026-03-17 09:53:46.019014+00
509101c6-51df-4219-a540-de8155d24b9d	员工	普通员工角色，只有基本查看权限	\N	t	2026-03-17 09:53:46.019014+00	2026-03-17 09:53:46.019014+00
\.


--
-- Data for Name: salary_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_items (id, salary_record_id, employee_id, employee_name, employee_number, data, total_amount, is_sent, sent_at, is_viewed, viewed_at, created_at, updated_at, pdf_url) FROM stdin;
\.


--
-- Data for Name: salary_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_records (id, company_id, template_id, year, month, file_name, file_url, total_amount, employee_count, status, uploaded_by, created_at, updated_at, pdf_generated, pdf_generation_error) FROM stdin;
\.


--
-- Data for Name: salary_signatures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_signatures (id, company_id, employee_id, type, reference_id, year, month, status, sent_at, signed_at, signature_url, created_at, updated_at, sign_token, sign_token_expires_at, original_file_url, signed_file_url, signature_data, reject_reason) FROM stdin;
\.


--
-- Data for Name: salary_structure_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_structure_templates (id, company_id, name, description, fields, is_default, created_by, created_at, updated_at, pdf_template_config, is_universal) FROM stdin;
7089bd01-e4f7-48f4-b14a-fe736a947978	\N	标准工资结构模板	适用于大多数企业的标准工资结构，包含基本工资、绩效奖金、各项补贴和扣除项	[{"code": "base_salary", "name": "基本工资", "type": "number", "required": true}, {"code": "position_salary", "name": "岗位工资", "type": "number", "required": false}, {"code": "performance_bonus", "name": "绩效奖金", "type": "number", "required": false}, {"code": "attendance_bonus", "name": "全勤奖", "type": "number", "required": false}, {"code": "overtime_pay", "name": "加班费", "type": "number", "required": false}, {"code": "transport_allowance", "name": "交通补贴", "type": "number", "required": false}, {"code": "meal_allowance", "name": "餐补", "type": "number", "required": false}, {"code": "communication_allowance", "name": "通讯补贴", "type": "number", "required": false}, {"code": "gross_salary", "name": "应发工资", "type": "number", "required": true}, {"code": "social_insurance_personal", "name": "社保个人部分", "type": "number", "required": false}, {"code": "housing_fund_personal", "name": "公积金个人部分", "type": "number", "required": false}, {"code": "personal_income_tax", "name": "个人所得税", "type": "number", "required": false}, {"code": "other_deductions", "name": "其他扣款", "type": "number", "required": false}, {"code": "net_salary", "name": "实发工资", "type": "number", "required": true}]	t	\N	2026-03-17 09:53:45.917087+00	2026-03-17 09:53:45.917087+00	{"title": "工资条", "font_size": 10, "footer_text": "本工资条仅供个人查阅，请妥善保管", "show_period": true, "header_color": "#1e40af", "signature_label": "员工签名", "show_company_logo": true, "show_company_name": true, "show_signature_area": true}	t
\.


--
-- Data for Name: signed_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.signed_documents (id, signing_record_id, template_id, template_name, file_url, file_size, signed_at, created_at, updated_at) FROM stdin;
ccb0460a-45ce-42ab-9dea-8c232123373c	43ea6ac1-5efb-4fc2-9613-ae9ff2f17793	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-18 14:23:37.71945+00	2026-03-18 14:23:37.71945+00
2ecbb824-7b1f-41f9-9279-3afa972bbd05	6eb631db-697c-4e7f-959a-dec8a2cdece6	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 02:22:14.63521+00	2026-03-19 02:22:14.63521+00
3887183a-1a99-4006-8e5a-8cf9b28d37dd	dda33703-6946-48ea-8418-345797789033	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 02:51:37.248385+00	2026-03-19 02:51:37.248385+00
5d73ef09-b9b5-4eff-8dda-4b36337cbaff	b9839825-6083-4765-aea3-9e9e9afb97a2	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 03:33:34.141907+00	2026-03-19 03:33:34.141907+00
1f654718-cd18-4fc2-bfcd-e7be9678b41f	2b26090c-9609-47da-8018-e8a1947a5f94	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 06:43:20.266157+00	2026-03-19 06:43:20.266157+00
25bf8950-a1e1-4074-9a6b-b9c5dbd85c10	df7a67fc-d080-4144-ab30-9f8d36ae28a4	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 06:50:38.517532+00	2026-03-19 06:50:38.517532+00
47486d9b-d1cc-45c9-839f-a2b2cd01d761	38271341-acb9-469b-be6f-5c1a2212e8a0	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 07:33:50.258313+00	2026-03-19 07:33:50.258313+00
8cba010a-84eb-466e-951e-b525b74b2c09	4a586746-d2ce-49a0-a90f-1393ee742abd	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 07:40:12.989221+00	2026-03-19 07:40:12.989221+00
2af6d580-da7d-45b0-a068-1065334a3a1a	6c1cf293-9141-4c0f-8624-404ce02ae377	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 07:41:59.492926+00	2026-03-19 07:41:59.492926+00
a8cef988-ac14-4934-a60f-c630975b414f	97fc3495-d27b-4f72-9c42-d42f80eb001b	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 07:43:07.284509+00	2026-03-19 07:43:07.284509+00
1757a9f8-3c42-4b61-bbf7-8348886aca93	9671deb4-e0bc-47f8-8e21-3e08a680271d	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 07:49:31.958274+00	2026-03-19 07:49:31.958274+00
eb5aa8c0-a5c0-4bfc-94bc-86183a36f258	dee2cb9a-0420-4ae8-af85-17a780e08069	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 09:25:02.769098+00	2026-03-19 09:25:02.769098+00
a398ce5a-0b08-4b8f-84d3-80e0f9e8901d	f1ed5e4a-e1da-499c-80e3-4baa3d0a7cc9	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 09:54:39.219205+00	2026-03-19 09:54:39.219205+00
eb36af5a-e28b-4dd3-89fc-a74a7f939a3d	4c5d6355-a368-429a-944c-f543fdbbf7dd	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 11:53:04.072668+00	2026-03-19 11:53:04.072668+00
d98603d4-815f-4b3d-8112-8b8bb2982c1f	65994f31-59fa-4bcc-82d5-02713f3a1fdf	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 11:59:05.473252+00	2026-03-19 11:59:05.473252+00
2e5bcb7d-08ff-48d2-b145-358e98aad53d	31f2b429-cc56-4f8f-b3d4-d95df510c58d	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 12:03:33.299085+00	2026-03-19 12:03:33.299085+00
43c1ede6-c014-418c-937b-b701c8b80771	598f1b0a-17f7-457e-b3c2-bb7dd2d2bc0e	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 12:11:58.094355+00	2026-03-19 12:11:58.094355+00
317b975f-9894-41b4-80f1-caf6daec8c9e	d1accf71-3bc2-4a91-ba17-4bccd5362cb9	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 12:24:02.15931+00	2026-03-19 12:24:02.15931+00
4d10e8d5-1562-404f-a02a-c1b1958fcf3a	94bdd6e0-23a4-436f-852a-b39321a27bee	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 12:24:58.784922+00	2026-03-19 12:24:58.784922+00
1d9c17c2-ef01-45fe-ab8a-94a74b9f2147	58fa3977-5552-47ce-8bd2-92dc4605ef22	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 12:28:42.110614+00	2026-03-19 12:28:42.110614+00
af782a49-d451-4186-848b-37cd834f24dc	2ec12c17-4fe8-4c6a-8b80-0bfb4c5e5407	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 12:40:25.317085+00	2026-03-19 12:40:25.317085+00
4e5deaf9-aa97-4ca3-9c7c-e5e9c5ce653e	6aeacc70-0490-4509-947a-0157057d40e8	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 12:43:48.276872+00	2026-03-19 12:43:48.276872+00
a469c54c-59df-49a5-9159-87da2655fb6e	aee84c00-3e96-4cb5-9deb-0b71c9800fca	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 12:47:39.98575+00	2026-03-19 12:47:39.98575+00
3a587118-c761-4e9e-8bc5-94742e4c4188	f5a7a8a2-d53a-4a8a-b40a-12c245870df0	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 12:48:37.161733+00	2026-03-19 12:48:37.161733+00
042eec92-4393-4038-8e08-35c96fbc71e9	f0eec738-88b2-4856-9120-1f5d7a481ace	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 12:49:03.624895+00	2026-03-19 12:49:03.624895+00
147f842b-e415-44b3-9bbd-ab5cb2aaae03	5855af29-14a3-462c-b072-819a2fb078bb	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 13:47:03.523147+00	2026-03-19 13:47:03.523147+00
4d71ba9d-fd99-47f7-b8ab-86981e2cd902	93aab3b9-b2c5-423a-837f-0fa5c1d048df	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 13:47:43.363136+00	2026-03-19 13:47:43.363136+00
8f712174-023d-4e93-a58b-562abc70d25f	2a0cae39-f02e-4117-b4b5-fe35b9f2fd99	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 13:49:51.658537+00	2026-03-19 13:49:51.658537+00
bc048fed-065d-454a-8f66-de6c0f6a4c04	e1aba863-72c9-4aae-98a5-b9fc53041a45	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 13:52:24.272884+00	2026-03-19 13:52:24.272884+00
82222528-970f-40c4-a242-b6a7d5ebee4d	61ba49d3-4850-4a1a-b535-4f57952b06b2	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 13:54:31.231912+00	2026-03-19 13:54:31.231912+00
a0b20189-6814-4683-b705-f55dde01cbd2	4b9a415b-6f87-40d3-8dde-dfdfcfb4ebe3	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 14:05:09.757785+00	2026-03-19 14:05:09.757785+00
4da40ff1-5c73-43d6-8b74-39ff655057af	f3004c22-b236-48f6-b15b-863e6771649e	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 14:05:32.641091+00	2026-03-19 14:05:32.641091+00
cbf38827-f696-4c3f-af26-fe507ad0d653	f1061e0f-52fa-4c42-88e0-7e35afea2459	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 14:09:10.863435+00	2026-03-19 14:09:10.863435+00
75a00dce-7fd5-438c-99b7-8d19eef701c3	d3c76070-c298-4922-8cbe-7ff30ecdb6db	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-19 14:10:12.768725+00	2026-03-19 14:10:12.768725+00
6c12f4a1-a5bc-460f-98a6-3ae9a454cafe	ba7a99f1-a54b-4dbb-af72-30489abddc8f	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-20 04:56:57.354729+00	2026-03-20 04:56:57.354729+00
6614680c-6a1a-458e-80f2-8af441feed98	8dec002a-4e55-4b43-9451-72b13d33c50a	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-20 05:09:57.991252+00	2026-03-20 05:09:57.991252+00
d2fbd60e-f30e-4284-8eba-6687ba9fa615	7043a299-d837-4f90-9183-c2d9e8dd2ab5	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-20 05:10:34.518058+00	2026-03-20 05:10:34.518058+00
17b81fcd-4eb6-4c50-86fb-cf4881b92e1d	5acfbef9-5faa-4d31-85f1-0bc3bb267294	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-20 09:06:55.508453+00	2026-03-20 09:06:55.508453+00
447645c2-94a1-4f36-8c86-23bd76c477f3	6cef43e4-061d-4ac6-8242-6cf5fee58820	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-20 09:47:26.112547+00	2026-03-20 09:47:26.112547+00
452820ac-f01c-46fa-92ec-7b544d920fa8	ada71279-42c9-4adb-9d82-55b9f5536794	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-20 09:55:46.789111+00	2026-03-20 09:55:46.789111+00
f6eef068-da76-4ce3-859e-ddc384075844	b6f73db6-30b6-4bc5-a788-7db0f1b3a81a	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-20 10:56:56.302599+00	2026-03-20 10:56:56.302599+00
d797f1f8-b535-474b-941d-58800ae8d1be	759148af-0d53-4c89-8008-3153ff004d3a	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-20 11:29:21.240473+00	2026-03-20 11:29:21.240473+00
b93965c7-0aaa-41c8-8a9e-8b5166bf5f65	4bcfef3c-132c-4417-b10d-cd616c2bcbd7	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-20 12:10:28.862669+00	2026-03-20 12:10:28.862669+00
f83b1194-6364-4cf6-b530-4f83c76ce239	24a6478a-8103-49db-9cbe-f19666849197	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-20 12:37:08.177441+00	2026-03-20 12:37:08.177441+00
48e6729a-1696-43ff-8949-3bf1abdc9a3a	7483f929-5b33-4c45-903c-b894bc3541aa	6a4db303-b547-499e-af94-59f1866e6092	工资条确认	\N	\N	\N	2026-03-20 12:49:42.015859+00	2026-03-20 12:49:42.015859+00
7f036a44-1552-4306-9acc-1775307b34e2	eb03fc01-6d3e-463f-895c-d811ea5ac196	368c1548-e975-4923-a854-b8b7f95222ad	劳动合同	\N	\N	\N	2026-03-20 13:49:03.801651+00	2026-03-20 13:49:03.801651+00
10c69aa0-718d-4577-bb41-9cbbfd29ef69	eb03fc01-6d3e-463f-895c-d811ea5ac196	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-20 13:49:03.801651+00	2026-03-20 13:49:03.801651+00
38cab4db-3f24-42f6-93fd-f1426b0dcf27	17ce4e72-ec3f-471b-92b1-42409423b7ae	c6619904-3a67-43cd-a044-d6c198e8ab65	入职登记表	\N	\N	\N	2026-03-20 14:05:36.754726+00	2026-03-20 14:05:36.754726+00
f88d4a59-501e-4aa1-951b-fe66e053f718	d299b9c2-9965-4b9e-b5eb-165a64f0bf07	04198af3-33f8-4448-9a14-a7e3feecc802	员工手册	\N	\N	\N	2026-03-20 14:44:05.793738+00	2026-03-20 14:44:05.793738+00
906e3564-23b8-4f16-8d05-a4f4eee8837a	0f4020bc-5170-404f-ab14-d195d108252e	368c1548-e975-4923-a854-b8b7f95222ad	劳动合同	\N	\N	\N	2026-03-20 14:51:54.277295+00	2026-03-20 14:51:54.277295+00
3714329a-acb8-47a6-b8fa-11c4f4a1aa2e	8d04e3f3-1a80-4cb5-96db-57624d0461f7	9ee00a99-906c-4219-b896-7fecfa5a98cb	承诺书	\N	\N	\N	2026-03-20 14:54:10.269223+00	2026-03-20 14:54:10.269223+00
ca26df45-962e-42dd-8883-98cf2f2ec900	9b73d988-ddf2-4deb-b3fb-13fae4f4c618	c6619904-3a67-43cd-a044-d6c198e8ab65	入职登记表	\N	\N	\N	2026-03-20 14:57:11.522122+00	2026-03-20 14:57:11.522122+00
36ee891d-3627-4c86-b697-ea6d2a722b45	a2c809e6-eeb1-4b01-a8b0-f3227efab7ac	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-22 00:43:05.078492+00	2026-03-22 00:43:05.078492+00
c6f788c4-68bc-4f6a-98fe-440db9156b45	9c147a34-0e79-4367-ab90-c7c40ec088b0	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-22 01:02:32.474572+00	2026-03-22 01:02:32.474572+00
f1927c60-959d-4099-a9df-7b5f5d4e79dd	e20883a2-75a9-4d22-ac7d-5f7d70519075	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-22 01:22:43.013381+00	2026-03-22 01:22:43.013381+00
1a20672d-a453-406c-9735-c1f42c979230	b2da6e38-a8c1-4bbb-bb51-8b76ec8089bf	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-22 01:32:50.982409+00	2026-03-22 01:32:50.982409+00
918289b9-1b1f-4bd0-820e-b670bbb8104a	153790a9-f223-4b16-ac42-62bf89a18074	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-22 02:06:19.074545+00	2026-03-22 02:06:19.074545+00
56561098-e2a2-49f6-941f-435cf8ea0122	add4d5fb-773a-43f5-863c-cc33b36d10e0	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-22 02:08:05.185986+00	2026-03-22 02:08:05.185986+00
3c66d659-86f4-4cd8-8ea7-fa7537835607	5e58de8e-2938-4c84-83e5-8acb48709c73	9f19ae44-cf5c-4e22-b429-a6415c3ee068	保密协议	\N	\N	\N	2026-03-22 06:53:39.972565+00	2026-03-22 06:53:39.972565+00
f7aa0fb1-243f-43a4-bab5-70da21d2637a	9d3cccf0-365b-4be3-9665-40b1ba5052af	c6619904-3a67-43cd-a044-d6c198e8ab65	入职登记表	\N	\N	\N	2026-03-23 06:48:07.901076+00	2026-03-23 06:48:07.901076+00
803dc613-db76-46b3-aca6-52946dc196ea	768a1835-cd94-4299-8e65-d50de8c49c70	c6619904-3a67-43cd-a044-d6c198e8ab65	入职登记表	\N	\N	\N	2026-03-23 09:27:40.588411+00	2026-03-23 09:27:40.588411+00
c9ef036d-6180-4fb5-acef-ceed0cbed447	2824e71e-93eb-4a3c-ab00-ae37f901c842	368c1548-e975-4923-a854-b8b7f95222ad	劳动合同	\N	\N	\N	2026-03-23 13:54:00.662619+00	2026-03-23 13:54:00.662619+00
d03fe134-7d1f-4ba7-99ad-54b96202b13d	578560c7-e3bd-493e-895b-cb0b8bfcf837	04198af3-33f8-4448-9a14-a7e3feecc802	员工手册	\N	\N	\N	2026-03-23 13:58:23.929126+00	2026-03-23 13:58:23.929126+00
\.


--
-- Data for Name: signing_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.signing_records (id, company_id, employee_id, template_ids, status, employee_signed_at, company_signed_at, third_party_signing_id, notes, created_by, created_at, updated_at, signed_file_url, employee_form_data, company_form_data, signing_mode, uploaded_at, uploaded_by, third_party_contract_no, third_party_contract_name) FROM stdin;
43ea6ac1-5efb-4fc2-9613-ae9ff2f17793	1816aed2-f492-442e-a8ae-680b1d18b047	b4cbb0b9-4494-4b12-a506-6bbed4e92f35	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	completed	2026-03-19 01:36:12.634+00	2026-03-19 01:36:20.028+00	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-18 14:23:37.675591+00	2026-03-19 01:36:20.040922+00	\N	{"id": "b4cbb0b9-4494-4b12-a506-6bbed4e92f35", "name": "涂巧芸", "email": "", "phone": "15897798454", "gender": "女", "address": "湖北省黄石市花湖大道金港明珠7栋", "id_card": "420704198412125781", "position": "出纳", "hire_date": "2023-09-15", "birth_date": "1984-12-11", "department": "内业", "id_card_type": "身份证", "contract_end_date": "2026-09-15", "contract_start_date": "2023-09-15", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260318_222337312	签署文书_涂巧芸_20260318.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260318
6eb631db-697c-4e7f-959a-dec8a2cdece6	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	pending	\N	\N	\N	qqqwqw	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 02:22:14.588678+00	2026-03-19 02:22:14.588678+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_102214070	签署文书_张志武_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
dda33703-6946-48ea-8418-345797789033	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	pending	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 02:51:37.212421+00	2026-03-19 02:51:37.212421+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_105136958	签署文书_杨占方_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
df7a67fc-d080-4144-ab30-9f8d36ae28a4	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 06:50:38.480343+00	2026-03-19 09:54:20.821256+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_145038258	签署文书_范细容_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
2b26090c-9609-47da-8018-e8a1947a5f94	1816aed2-f492-442e-a8ae-680b1d18b047	b4cbb0b9-4494-4b12-a506-6bbed4e92f35	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 06:43:20.233037+00	2026-03-19 13:35:32.846959+00	\N	{"id": "b4cbb0b9-4494-4b12-a506-6bbed4e92f35", "name": "涂巧芸", "email": "", "phone": "15897798454", "gender": "女", "address": "湖北省黄石市花湖大道金港明珠7栋", "id_card": "420704198412125781", "position": "出纳", "hire_date": "2023-09-15", "birth_date": "1984-12-11", "department": "内业", "id_card_type": "身份证", "contract_end_date": "2026-09-15", "contract_start_date": "2023-09-15", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_144319930	签署文书_涂巧芸_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
b9839825-6083-4765-aea3-9e9e9afb97a2	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 03:33:34.092358+00	2026-03-19 13:49:07.121312+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_113333785	签署文书_范细容_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
38271341-acb9-469b-be6f-5c1a2212e8a0	1816aed2-f492-442e-a8ae-680b1d18b047	62dafbec-828b-4c1c-985a-07de065cb5be	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 07:33:50.230636+00	2026-03-19 07:39:55.376021+00	\N	{"id": "62dafbec-828b-4c1c-985a-07de065cb5be", "name": "袁泽钢", "email": "", "phone": "13872112805", "gender": "男", "address": "湖北省鄂州市鄂城区沙窝乡黄山村", "id_card": "420704198008101673", "position": "生产经理", "hire_date": "2023-08-01", "birth_date": "1980-08-09", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-08-01", "contract_start_date": "2023-08-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_153350091	签署文书_袁泽钢_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
97fc3495-d27b-4f72-9c42-d42f80eb001b	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 07:43:07.240106+00	2026-03-19 07:49:05.723614+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_154307214	签署文书_张志武_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
6c1cf293-9141-4c0f-8624-404ce02ae377	1816aed2-f492-442e-a8ae-680b1d18b047	62dafbec-828b-4c1c-985a-07de065cb5be	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	sd	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 07:41:59.46254+00	2026-03-19 07:49:10.595078+00	\N	{"id": "62dafbec-828b-4c1c-985a-07de065cb5be", "name": "袁泽钢", "email": "", "phone": "13872112805", "gender": "男", "address": "湖北省鄂州市鄂城区沙窝乡黄山村", "id_card": "420704198008101673", "position": "生产经理", "hire_date": "2023-08-01", "birth_date": "1980-08-09", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-08-01", "contract_start_date": "2023-08-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_154159422	签署文书_袁泽钢_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
dee2cb9a-0420-4ae8-af85-17a780e08069	1816aed2-f492-442e-a8ae-680b1d18b047	62dafbec-828b-4c1c-985a-07de065cb5be	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 09:25:02.738962+00	2026-03-19 09:54:15.027718+00	\N	{"id": "62dafbec-828b-4c1c-985a-07de065cb5be", "name": "袁泽钢", "email": "", "phone": "13872112805", "gender": "男", "address": "湖北省鄂州市鄂城区沙窝乡黄山村", "id_card": "420704198008101673", "position": "生产经理", "hire_date": "2023-08-01", "birth_date": "1980-08-09", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-08-01", "contract_start_date": "2023-08-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_172502162	签署文书_袁泽钢_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
9671deb4-e0bc-47f8-8e21-3e08a680271d	1816aed2-f492-442e-a8ae-680b1d18b047	62dafbec-828b-4c1c-985a-07de065cb5be	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 07:49:31.934745+00	2026-03-19 09:54:18.036428+00	\N	{"id": "62dafbec-828b-4c1c-985a-07de065cb5be", "name": "袁泽钢", "email": "", "phone": "13872112805", "gender": "男", "address": "湖北省鄂州市鄂城区沙窝乡黄山村", "id_card": "420704198008101673", "position": "生产经理", "hire_date": "2023-08-01", "birth_date": "1980-08-09", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-08-01", "contract_start_date": "2023-08-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_154931639	签署文书_袁泽钢_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
4a586746-d2ce-49a0-a90f-1393ee742abd	1816aed2-f492-442e-a8ae-680b1d18b047	62dafbec-828b-4c1c-985a-07de065cb5be	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 07:40:12.965999+00	2026-03-19 09:54:23.311731+00	\N	{"id": "62dafbec-828b-4c1c-985a-07de065cb5be", "name": "袁泽钢", "email": "", "phone": "13872112805", "gender": "男", "address": "湖北省鄂州市鄂城区沙窝乡黄山村", "id_card": "420704198008101673", "position": "生产经理", "hire_date": "2023-08-01", "birth_date": "1980-08-09", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-08-01", "contract_start_date": "2023-08-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_154012871	签署文书_袁泽钢_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
65994f31-59fa-4bcc-82d5-02713f3a1fdf	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 11:59:05.435549+00	2026-03-19 12:03:09.817138+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_195905101	签署文书_范细容_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
4c5d6355-a368-429a-944c-f543fdbbf7dd	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 11:53:03.967672+00	2026-03-19 12:03:12.838305+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_195303517	签署文书_张志武_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
f1ed5e4a-e1da-499c-80e3-4baa3d0a7cc9	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 09:54:39.191665+00	2026-03-19 12:03:15.809728+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_175438879	签署文书_范细容_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
d1accf71-3bc2-4a91-ba17-4bccd5362cb9	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 12:24:02.130202+00	2026-03-19 13:35:30.389607+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_202401252	签署文书_杨占方_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
598f1b0a-17f7-457e-b3c2-bb7dd2d2bc0e	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 12:11:58.062949+00	2026-03-19 13:35:31.235113+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_201157782	签署文书_范细容_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
31f2b429-cc56-4f8f-b3d4-d95df510c58d	1816aed2-f492-442e-a8ae-680b1d18b047	a6399a0d-d4c5-4174-9403-49a7823be370	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 12:03:33.261199+00	2026-03-19 13:35:32.036918+00	\N	{"id": "a6399a0d-d4c5-4174-9403-49a7823be370", "name": "柯娜", "email": "", "phone": "15871462085", "gender": "女", "address": "黄石市黄石港区天骄公馆", "id_card": "420281199507102021", "position": "会计", "hire_date": "2024-11-19", "birth_date": "1995-07-09", "department": "内业", "id_card_type": "身份证", "contract_end_date": "2027-11-19", "contract_start_date": "2024-11-19", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_200332923	签署文书_柯娜_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
f0eec738-88b2-4856-9120-1f5d7a481ace	1816aed2-f492-442e-a8ae-680b1d18b047	62dafbec-828b-4c1c-985a-07de065cb5be	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 12:49:03.597968+00	2026-03-19 13:27:39.676317+00	\N	{"id": "62dafbec-828b-4c1c-985a-07de065cb5be", "name": "袁泽钢", "email": "", "phone": "13872112805", "gender": "男", "address": "湖北省鄂州市鄂城区沙窝乡黄山村", "id_card": "420704198008101673", "position": "生产经理", "hire_date": "2023-08-01", "birth_date": "1980-08-09", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-08-01", "contract_start_date": "2023-08-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_204903330	签署文书_袁泽钢_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
f5a7a8a2-d53a-4a8a-b40a-12c245870df0	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 12:48:37.133123+00	2026-03-19 13:27:41.632648+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_204837043	签署文书_杨占方_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
aee84c00-3e96-4cb5-9deb-0b71c9800fca	1816aed2-f492-442e-a8ae-680b1d18b047	62dafbec-828b-4c1c-985a-07de065cb5be	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 12:47:39.960364+00	2026-03-19 13:35:23.525158+00	\N	{"id": "62dafbec-828b-4c1c-985a-07de065cb5be", "name": "袁泽钢", "email": "", "phone": "13872112805", "gender": "男", "address": "湖北省鄂州市鄂城区沙窝乡黄山村", "id_card": "420704198008101673", "position": "生产经理", "hire_date": "2023-08-01", "birth_date": "1980-08-09", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-08-01", "contract_start_date": "2023-08-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_204739690	签署文书_袁泽钢_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
6aeacc70-0490-4509-947a-0157057d40e8	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 12:43:48.25055+00	2026-03-19 13:35:24.955253+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_204347979	签署文书_范细容_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
2ec12c17-4fe8-4c6a-8b80-0bfb4c5e5407	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 12:40:25.195148+00	2026-03-19 13:35:25.853829+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_204024890	签署文书_张志武_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
58fa3977-5552-47ce-8bd2-92dc4605ef22	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 12:28:42.04648+00	2026-03-19 13:35:26.606896+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_202841696	签署文书_范细容_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
94bdd6e0-23a4-436f-852a-b39321a27bee	1816aed2-f492-442e-a8ae-680b1d18b047	62dafbec-828b-4c1c-985a-07de065cb5be	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 12:24:58.746211+00	2026-03-19 13:35:27.304217+00	\N	{"id": "62dafbec-828b-4c1c-985a-07de065cb5be", "name": "袁泽钢", "email": "", "phone": "13872112805", "gender": "男", "address": "湖北省鄂州市鄂城区沙窝乡黄山村", "id_card": "420704198008101673", "position": "生产经理", "hire_date": "2023-08-01", "birth_date": "1980-08-09", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-08-01", "contract_start_date": "2023-08-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_202458653	签署文书_袁泽钢_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
93aab3b9-b2c5-423a-837f-0fa5c1d048df	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 13:47:43.317333+00	2026-03-19 13:49:03.442049+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_214743290	签署文书_张志武_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
5855af29-14a3-462c-b072-819a2fb078bb	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 13:47:03.483526+00	2026-03-19 13:49:05.190226+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_214703382	签署文书_杨占方_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
2a0cae39-f02e-4117-b4b5-fe35b9f2fd99	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	pending	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 13:49:51.632524+00	2026-03-19 13:49:51.632524+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_214951604	签署文书_张志武_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
e1aba863-72c9-4aae-98a5-b9fc53041a45	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	pending	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 13:52:24.247793+00	2026-03-19 13:52:24.247793+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_215224148	签署文书_范细容_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
4b9a415b-6f87-40d3-8dde-dfdfcfb4ebe3	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 14:05:09.724525+00	2026-03-20 02:17:28.501516+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_220509584	签署文书_张志武_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
61ba49d3-4850-4a1a-b535-4f57952b06b2	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 13:54:31.20044+00	2026-03-20 02:17:33.86428+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_215431159	签署文书_杨占方_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
d3c76070-c298-4922-8cbe-7ff30ecdb6db	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 14:10:12.732339+00	2026-03-20 02:17:08.612567+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_221012653	签署文书_张志武_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
f1061e0f-52fa-4c42-88e0-7e35afea2459	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 14:09:10.826764+00	2026-03-20 02:17:11.730759+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_220910449	签署文书_范细容_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
f3004c22-b236-48f6-b15b-863e6771649e	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-19 14:05:32.603405+00	2026-03-20 02:17:22.935004+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319_220532569	签署文书_范细容_20260319.html_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260319
7043a299-d837-4f90-9183-c2d9e8dd2ab5	1816aed2-f492-442e-a8ae-680b1d18b047	b4cbb0b9-4494-4b12-a506-6bbed4e92f35	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	completed	2026-03-20 07:29:33.783+00	2026-03-20 07:29:41.936+00	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 05:10:34.424818+00	2026-03-20 07:29:41.943537+00	\N	{"id": "b4cbb0b9-4494-4b12-a506-6bbed4e92f35", "name": "涂巧芸", "email": "", "phone": "15897798454", "gender": "女", "address": "湖北省黄石市花湖大道金港明珠7栋", "id_card": "420704198412125781", "position": "出纳", "hire_date": "2023-09-15", "birth_date": "1984-12-11", "department": "内业", "id_card_type": "身份证", "contract_end_date": "2026-09-15", "contract_start_date": "2023-09-15", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_131033742_b8b94902d3df43f8aca	签署文书_涂巧芸_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
ba7a99f1-a54b-4dbb-af72-30489abddc8f	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	completed	2026-03-20 12:05:04.45+00	2026-03-20 12:07:40.2+00	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 04:56:57.252362+00	2026-03-20 12:07:40.207668+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_125656328_b8b94902d3df43f8aca	签署文书_范细容_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
8dec002a-4e55-4b43-9451-72b13d33c50a	1816aed2-f492-442e-a8ae-680b1d18b047	b4cbb0b9-4494-4b12-a506-6bbed4e92f35	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	employee_signed	2026-03-20 07:31:41.129+00	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 05:09:57.933725+00	2026-03-20 12:08:05.073112+00	\N	{"id": "b4cbb0b9-4494-4b12-a506-6bbed4e92f35", "name": "涂巧芸", "email": "", "phone": "15897798454", "gender": "女", "address": "湖北省黄石市花湖大道金港明珠7栋", "id_card": "420704198412125781", "position": "出纳", "hire_date": "2023-09-15", "birth_date": "1984-12-11", "department": "内业", "id_card_type": "身份证", "contract_end_date": "2026-09-15", "contract_start_date": "2023-09-15", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_130956928_b8b94902d3df43f8aca	签署文书_涂巧芸_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
5acfbef9-5faa-4d31-85f1-0bc3bb267294	1816aed2-f492-442e-a8ae-680b1d18b047	62dafbec-828b-4c1c-985a-07de065cb5be	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	completed	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 09:06:55.480136+00	2026-03-20 09:12:34.438249+00	\N	{"id": "62dafbec-828b-4c1c-985a-07de065cb5be", "name": "袁泽钢", "email": "", "phone": "13872112805", "gender": "男", "address": "湖北省鄂州市鄂城区沙窝乡黄山村", "id_card": "420704198008101673", "position": "生产经理", "hire_date": "2023-08-01", "birth_date": "1980-08-09", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-08-01", "contract_start_date": "2023-08-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_170654539_b8b94902d3df43f8aca	签署文书_袁泽钢_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
4bcfef3c-132c-4417-b10d-cd616c2bcbd7	1816aed2-f492-442e-a8ae-680b1d18b047	e16ccb20-2fb0-480b-b403-1bfc51b4b552	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	employee_signed	2026-03-20 12:17:19.99+00	\N	\N	11212	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 12:10:28.815412+00	2026-03-20 12:17:20.000457+00	\N	{"id": "e16ccb20-2fb0-480b-b403-1bfc51b4b552", "name": "程芳", "email": "", "phone": "13597612942", "gender": "女", "address": "黄石市黄石港区一品园2栋1单元301", "id_card": "420202198007261229", "position": "会计", "hire_date": "2024-06-12", "birth_date": "1980-07-25", "department": "内业", "id_card_type": "身份证", "contract_end_date": "2027-06-12", "contract_start_date": "2024-06-12", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_201027820_b8b94902d3df43f8aca	签署文书_程芳_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
b6f73db6-30b6-4bc5-a788-7db0f1b3a81a	1816aed2-f492-442e-a8ae-680b1d18b047	e16ccb20-2fb0-480b-b403-1bfc51b4b552	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	rejected	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 10:56:56.211152+00	2026-03-20 11:26:11.83058+00	\N	{"id": "e16ccb20-2fb0-480b-b403-1bfc51b4b552", "name": "程芳", "email": "", "phone": "13597612942", "gender": "女", "address": "黄石市黄石港区一品园2栋1单元301", "id_card": "420202198007261229", "position": "会计", "hire_date": "2024-06-12", "birth_date": "1980-07-25", "department": "内业", "id_card_type": "身份证", "contract_end_date": "2027-06-12", "contract_start_date": "2024-06-12", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_185655189_b8b94902d3df43f8aca	签署文书_程芳_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
759148af-0d53-4c89-8008-3153ff004d3a	1816aed2-f492-442e-a8ae-680b1d18b047	a6399a0d-d4c5-4174-9403-49a7823be370	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	rejected	\N	\N	\N	qqqq	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 11:29:21.199786+00	2026-03-20 11:39:23.002731+00	\N	{"id": "a6399a0d-d4c5-4174-9403-49a7823be370", "name": "柯娜", "email": "", "phone": "15871462085", "gender": "女", "address": "黄石市黄石港区天骄公馆", "id_card": "420281199507102021", "position": "会计", "hire_date": "2024-11-19", "birth_date": "1995-07-09", "department": "内业", "id_card_type": "身份证", "contract_end_date": "2027-11-19", "contract_start_date": "2024-11-19", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_192920389_b8b94902d3df43f8aca	签署文书_柯娜_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
ada71279-42c9-4adb-9d82-55b9f5536794	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	completed	\N	2026-03-20 11:48:27.865+00	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 09:55:46.721819+00	2026-03-20 11:48:27.879091+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_175545900_b8b94902d3df43f8aca	签署文书_杨占方_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
6cef43e4-061d-4ac6-8242-6cf5fee58820	1816aed2-f492-442e-a8ae-680b1d18b047	f995752c-f14d-4efc-b040-a52dfe9cb50c	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	completed	\N	2026-03-20 12:07:09.715+00	\N	sds	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 09:47:26.060506+00	2026-03-20 12:07:09.724777+00	\N	{"id": "f995752c-f14d-4efc-b040-a52dfe9cb50c", "name": "徐红姣", "email": "", "phone": "13597662458", "gender": "女", "address": "黄石市开发区荣昌小区D栋1单元501室", "id_card": "420704197612250021", "position": "销售总监", "hire_date": "2023-10-31", "birth_date": "1976-12-24", "department": "销售", "id_card_type": "身份证", "contract_end_date": "2026-10-31", "contract_start_date": "2023-10-31", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_174725060_b8b94902d3df43f8aca	签署文书_徐红姣_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
24a6478a-8103-49db-9cbe-f19666849197	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	employee_signed	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 12:37:08.130328+00	2026-03-20 12:43:13.129593+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_203706579_b8b94902d3df43f8aca	签署文书_张志武_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
7483f929-5b33-4c45-903c-b894bc3541aa	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{6a4db303-b547-499e-af94-59f1866e6092}	employee_signed	2026-03-20 12:51:23.506+00	\N	\N	1222	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 12:49:41.988406+00	2026-03-20 12:51:23.517653+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_204940887_b8b94902d3df43f8aca	签署文书_张志武_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
17ce4e72-ec3f-471b-92b1-42409423b7ae	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{c6619904-3a67-43cd-a044-d6c198e8ab65}	completed	2026-03-20 14:05:59.54+00	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 14:05:36.684564+00	2026-03-20 14:05:59.55607+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_220535827_b8b94902d3df43f8aca	签署文书_杨占方_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
d299b9c2-9965-4b9e-b5eb-165a64f0bf07	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{04198af3-33f8-4448-9a14-a7e3feecc802}	completed	2026-03-20 14:50:05.945+00	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 14:44:05.736317+00	2026-03-20 14:50:05.970956+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_224404472_b8b94902d3df43f8aca	签署文书_范细容_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
0f4020bc-5170-404f-ab14-d195d108252e	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{368c1548-e975-4923-a854-b8b7f95222ad}	employee_signed	2026-03-20 14:53:00.618+00	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 14:51:54.225681+00	2026-03-20 14:53:00.626254+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_225153484_b8b94902d3df43f8aca	签署文书_范细容_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
eb03fc01-6d3e-463f-895c-d811ea5ac196	1816aed2-f492-442e-a8ae-680b1d18b047	f995752c-f14d-4efc-b040-a52dfe9cb50c	{368c1548-e975-4923-a854-b8b7f95222ad,9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 13:49:03.755921+00	2026-03-21 13:37:10.370033+00	\N	{"id": "f995752c-f14d-4efc-b040-a52dfe9cb50c", "name": "徐红姣", "email": "", "phone": "13597662458", "gender": "女", "address": "黄石市开发区荣昌小区D栋1单元501室", "id_card": "420704197612250021", "position": "销售总监", "hire_date": "2023-10-31", "birth_date": "1976-12-24", "department": "销售", "id_card_type": "身份证", "contract_end_date": "2026-10-31", "contract_start_date": "2023-10-31", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_214902586_b8b94902d3df43f8aca	签署文书_徐红姣_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
8d04e3f3-1a80-4cb5-96db-57624d0461f7	1816aed2-f492-442e-a8ae-680b1d18b047	a6399a0d-d4c5-4174-9403-49a7823be370	{9ee00a99-906c-4219-b896-7fecfa5a98cb}	completed	2026-03-20 14:55:31.254+00	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 14:54:10.220231+00	2026-03-20 14:55:31.279982+00	\N	{"id": "a6399a0d-d4c5-4174-9403-49a7823be370", "name": "柯娜", "email": "", "phone": "15871462085", "gender": "女", "address": "黄石市黄石港区天骄公馆", "id_card": "420281199507102021", "position": "会计", "hire_date": "2024-11-19", "birth_date": "1995-07-09", "department": "内业", "id_card_type": "身份证", "contract_end_date": "2027-11-19", "contract_start_date": "2024-11-19", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_225409572_b8b94902d3df43f8aca	签署文书_柯娜_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
9b73d988-ddf2-4deb-b3fb-13fae4f4c618	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{c6619904-3a67-43cd-a044-d6c198e8ab65}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-20 14:57:11.470333+00	2026-03-22 00:42:46.014205+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260320_225710660_b8b94902d3df43f8aca	签署文书_杨占方_20260320.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260320
b2da6e38-a8c1-4bbb-bb51-8b76ec8089bf	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-22 01:32:50.913721+00	2026-03-22 09:42:52.721494+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260322_093249656_b8b94902d3df43f8aca	签署文书_杨占方_20260322.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260322
e20883a2-75a9-4d22-ac7d-5f7d70519075	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-22 01:22:42.974445+00	2026-03-22 09:42:58.746442+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260322_092241868_b8b94902d3df43f8aca	签署文书_杨占方_20260322.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260322
9c147a34-0e79-4367-ab90-c7c40ec088b0	1816aed2-f492-442e-a8ae-680b1d18b047	d0e44a6a-778e-437f-a298-6c2ff966edd8	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-22 01:02:32.390224+00	2026-03-22 09:43:03.857925+00	\N	{"id": "d0e44a6a-778e-437f-a298-6c2ff966edd8", "name": "范细容", "email": "", "phone": "18934641071", "gender": "女", "address": "湖北省浠水县散花镇五一港村五组5-11号", "id_card": "421125196409257346", "position": "厨师", "hire_date": "2023-10-14", "birth_date": "1964-09-24", "department": "后勤", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-14", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260322_090231162_b8b94902d3df43f8aca	签署文书_范细容_20260322.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260322
a2c809e6-eeb1-4b01-a8b0-f3227efab7ac	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-22 00:43:05.024975+00	2026-03-22 09:43:08.786827+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260322_084303737_b8b94902d3df43f8aca	签署文书_杨占方_20260322.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260322
5e58de8e-2938-4c84-83e5-8acb48709c73	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-22 06:53:39.911528+00	2026-03-22 09:42:39.146862+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260322_145338465_b8b94902d3df43f8aca	签署文书_张志武_20260322.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260322
add4d5fb-773a-43f5-863c-cc33b36d10e0	1816aed2-f492-442e-a8ae-680b1d18b047	c3d90d84-495d-47e4-abcc-9c331af16c51	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-22 02:08:05.143796+00	2026-03-22 09:42:45.055733+00	\N	{"id": "c3d90d84-495d-47e4-abcc-9c331af16c51", "name": "张志武", "email": "", "phone": "15997157918", "gender": "男", "address": "湖北省鄂州市鄂城区花湖镇永华村", "id_card": "420700197810305614", "position": "维修", "hire_date": "2023-10-18", "birth_date": "1978-10-29", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-18", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260322_100804086_b8b94902d3df43f8aca	签署文书_张志武_20260322.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260322
153790a9-f223-4b16-ac42-62bf89a18074	1816aed2-f492-442e-a8ae-680b1d18b047	cb296b4b-9200-423d-98e7-af546c1b1d54	{9f19ae44-cf5c-4e22-b429-a6415c3ee068}	withdrawn	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-22 02:06:19.036706+00	2026-03-22 09:42:49.21854+00	\N	{"id": "cb296b4b-9200-423d-98e7-af546c1b1d54", "name": "杨占方", "email": "", "phone": "18237508016", "gender": "男", "address": "河南省汝州市王寨乡尹庄村2号院62号", "id_card": "410482196807185537", "position": "电工", "hire_date": "2023-10-01", "birth_date": "1968-07-17", "department": "生产", "id_card_type": "身份证", "contract_end_date": "2026-10-14", "contract_start_date": "2023-10-01", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260322_100618172_b8b94902d3df43f8aca	签署文书_杨占方_20260322.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260322
9d3cccf0-365b-4be3-9665-40b1ba5052af	1816aed2-f492-442e-a8ae-680b1d18b047	5fd4139e-409e-464c-94f1-5345cbc94b7e	{c6619904-3a67-43cd-a044-d6c198e8ab65}	pending	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-23 06:48:07.867766+00	2026-03-23 06:48:07.867766+00	\N	{"id": "5fd4139e-409e-464c-94f1-5345cbc94b7e", "name": "test", "email": "", "phone": "15850526482", "gender": "男", "address": "江苏", "id_card": "321023199104092415", "position": "开发", "hire_date": "2025-11-06", "birth_date": "2000-02-26", "department": "技术", "id_card_type": "身份证", "contract_end_date": "2028-07-07", "contract_start_date": "2025-01-31", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260323_144806607_b8b94902d3df43f8aca	签署文书_test_20260323.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260323
768a1835-cd94-4299-8e65-d50de8c49c70	1816aed2-f492-442e-a8ae-680b1d18b047	5fd4139e-409e-464c-94f1-5345cbc94b7e	{c6619904-3a67-43cd-a044-d6c198e8ab65}	completed	2026-03-23 09:31:47.704+00	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-23 09:27:40.530032+00	2026-03-23 09:31:47.735286+00	\N	{"id": "5fd4139e-409e-464c-94f1-5345cbc94b7e", "name": "test", "email": "", "phone": "15850526482", "gender": "男", "address": "江苏", "id_card": "321023199104092415", "position": "开发", "hire_date": "2025-11-06", "birth_date": "2000-02-26", "department": "技术", "id_card_type": "身份证", "contract_end_date": "2028-07-07", "contract_start_date": "2025-01-31", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260323_172739251_b8b94902d3df43f8aca	签署文书_test_20260323.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260323
2824e71e-93eb-4a3c-ab00-ae37f901c842	1816aed2-f492-442e-a8ae-680b1d18b047	5fd4139e-409e-464c-94f1-5345cbc94b7e	{368c1548-e975-4923-a854-b8b7f95222ad}	pending	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-23 13:54:00.609046+00	2026-03-23 13:54:00.609046+00	\N	{"id": "5fd4139e-409e-464c-94f1-5345cbc94b7e", "name": "test", "email": "", "phone": "15850526482", "gender": "男", "address": "江苏", "id_card": "321023199104092415", "position": "开发", "hire_date": "2025-11-06", "birth_date": "2000-02-26", "department": "技术", "id_card_type": "身份证", "contract_end_date": "2028-07-07", "contract_start_date": "2025-01-31", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260323_215358537_b8b94902d3df43f8aca	签署文书_test_20260323.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260323
578560c7-e3bd-493e-895b-cb0b8bfcf837	1816aed2-f492-442e-a8ae-680b1d18b047	5fd4139e-409e-464c-94f1-5345cbc94b7e	{04198af3-33f8-4448-9a14-a7e3feecc802}	pending	\N	\N	\N	\N	b8b94902-d3df-43f8-aca6-28f39bb6e57b	2026-03-23 13:58:23.863729+00	2026-03-23 13:58:23.863729+00	\N	{"id": "5fd4139e-409e-464c-94f1-5345cbc94b7e", "name": "test", "email": "", "phone": "15850526482", "gender": "男", "address": "江苏", "id_card": "321023199104092415", "position": "开发", "hire_date": "2025-11-06", "birth_date": "2000-02-26", "department": "技术", "id_card_type": "身份证", "contract_end_date": "2028-07-07", "contract_start_date": "2025-01-31", "insurance_start_date": ""}	{"code": "91420302MA4917T017", "name": "十堰九头鸟企业管理服务有限公司", "address": "湖北省十堰市茅箭区二堰街办朝阳南路2A号1幢1-9-1（自主申报）", "contact_phone": "15897752509", "contact_person": "李龙", "legal_representative": "李龙"}	electronic	\N	\N	U_20260323_215821955_b8b94902d3df43f8aca	签署文书_test_20260323.pdf_15897752509@jiutouniao.local_b8b94902-d3df-43f8-aca6-28f39bb6e57b_20260323
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_20; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_03_20 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_21; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_03_21 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_22; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_03_22 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_23; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_03_23 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_24; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_03_24 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_25; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_03_25 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2026_03_26; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.messages_2026_03_26 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-03-17 09:53:30
20211116045059	2026-03-17 09:53:30
20211116050929	2026-03-17 09:53:30
20211116051442	2026-03-17 09:53:30
20211116212300	2026-03-17 09:53:30
20211116213355	2026-03-17 09:53:30
20211116213934	2026-03-17 09:53:30
20211116214523	2026-03-17 09:53:30
20211122062447	2026-03-17 09:53:30
20211124070109	2026-03-17 09:53:30
20211202204204	2026-03-17 09:53:30
20211202204605	2026-03-17 09:53:30
20211210212804	2026-03-17 09:53:30
20211228014915	2026-03-17 09:53:30
20220107221237	2026-03-17 09:53:30
20220228202821	2026-03-17 09:53:30
20220312004840	2026-03-17 09:53:30
20220603231003	2026-03-17 09:53:30
20220603232444	2026-03-17 09:53:30
20220615214548	2026-03-17 09:53:30
20220712093339	2026-03-17 09:53:30
20220908172859	2026-03-17 09:53:30
20220916233421	2026-03-17 09:53:30
20230119133233	2026-03-17 09:53:30
20230128025114	2026-03-17 09:53:30
20230128025212	2026-03-17 09:53:30
20230227211149	2026-03-17 09:53:30
20230228184745	2026-03-17 09:53:31
20230308225145	2026-03-17 09:53:31
20230328144023	2026-03-17 09:53:31
20231018144023	2026-03-17 09:53:31
20231204144023	2026-03-17 09:53:31
20231204144024	2026-03-17 09:53:31
20231204144025	2026-03-17 09:53:31
20240108234812	2026-03-17 09:53:31
20240109165339	2026-03-17 09:53:31
20240227174441	2026-03-17 09:53:31
20240311171622	2026-03-17 09:53:31
20240321100241	2026-03-17 09:53:31
20240401105812	2026-03-17 09:53:31
20240418121054	2026-03-17 09:53:31
20240523004032	2026-03-17 09:53:31
20240618124746	2026-03-17 09:53:31
20240801235015	2026-03-17 09:53:31
20240805133720	2026-03-17 09:53:31
20240827160934	2026-03-17 09:53:31
20240919163303	2026-03-17 09:53:31
20240919163305	2026-03-17 09:53:31
20241019105805	2026-03-17 09:53:31
20241030150047	2026-03-17 09:53:31
20241108114728	2026-03-17 09:53:31
20241121104152	2026-03-17 09:53:31
20241130184212	2026-03-17 09:53:31
20241220035512	2026-03-17 09:53:31
20241220123912	2026-03-17 09:53:31
20241224161212	2026-03-17 09:53:31
20250107150512	2026-03-17 09:53:31
20250110162412	2026-03-17 09:53:31
20250123174212	2026-03-17 09:53:31
20250128220012	2026-03-17 09:53:31
20250506224012	2026-03-17 09:53:31
20250523164012	2026-03-17 09:53:31
20250714121412	2026-03-17 09:53:31
20250905041441	2026-03-17 09:53:31
20251103001201	2026-03-17 09:53:31
20251120212548	2026-03-17 09:53:31
20251120215549	2026-03-17 09:53:31
20260218120000	2026-03-17 09:53:31
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
document-templates	document-templates	\N	2026-03-17 09:53:44.834552+00	2026-03-17 09:53:44.834552+00	t	f	\N	\N	\N	STANDARD
signed-documents	signed-documents	\N	2026-03-17 09:53:45.478334+00	2026-03-17 09:53:45.478334+00	t	f	\N	\N	\N	STANDARD
signature-files	signature-files	\N	2026-03-17 09:53:45.790124+00	2026-03-17 09:53:45.790124+00	f	f	10485760	{application/pdf,image/png,image/jpeg}	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.iceberg_namespaces (id, bucket_name, name, created_at, updated_at, metadata, catalog_id) FROM stdin;
\.


--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.iceberg_tables (id, namespace_id, bucket_name, name, location, created_at, updated_at, remote_table_id, shard_key, shard_id, catalog_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-03-17 09:53:41.807171
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-03-17 09:53:41.819058
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-03-17 09:53:41.822422
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-03-17 09:53:41.834197
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-03-17 09:53:41.841599
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-03-17 09:53:41.845093
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-03-17 09:53:41.850313
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-03-17 09:53:41.855149
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-03-17 09:53:41.859037
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-03-17 09:53:41.862912
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-03-17 09:53:41.86751
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-03-17 09:53:41.871532
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-03-17 09:53:41.875597
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-03-17 09:53:41.879402
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-03-17 09:53:41.883548
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-03-17 09:53:41.895041
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-03-17 09:53:41.898777
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-03-17 09:53:41.901879
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-03-17 09:53:41.905186
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-03-17 09:53:41.908645
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-03-17 09:53:41.912444
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-03-17 09:53:41.918751
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-03-17 09:53:41.929018
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-03-17 09:53:41.936171
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-03-17 09:53:41.93986
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-03-17 09:53:41.943355
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-03-17 09:53:41.946962
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-03-17 09:53:41.950025
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-03-17 09:53:41.953113
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-03-17 09:53:41.956443
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-03-17 09:53:41.959434
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-03-17 09:53:41.962879
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-03-17 09:53:41.966618
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-03-17 09:53:41.96984
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-03-17 09:53:41.973361
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-03-17 09:53:41.976927
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-03-17 09:53:41.980008
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-03-17 09:53:41.983047
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-03-17 09:53:41.988556
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-03-17 09:53:41.999853
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-03-17 09:53:42.002728
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-03-17 09:53:42.005415
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-03-17 09:53:42.007884
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-03-17 09:53:42.010487
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-03-17 09:53:42.013295
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-03-17 09:53:42.017673
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-03-17 09:53:42.02593
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-03-17 09:53:42.030569
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-03-17 09:53:42.034427
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-03-17 09:53:42.053055
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-03-17 09:53:42.057441
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-03-17 09:53:42.118656
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-03-17 09:53:42.12125
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-03-17 09:53:42.127168
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-03-17 09:53:42.130171
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-03-17 09:53:42.133194
56	fix-optimized-search-function	cb58526ebc23048049fd5bf2fd148d18b04a2073	2026-03-17 09:53:42.137637
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.hooks (id, hook_table_id, hook_name, created_at, request_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.migrations (version, inserted_at) FROM stdin;
initial	2026-03-17 09:53:27.179304+00
20210809183423_update_grants	2026-03-17 09:53:27.179304+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
00001	{"-- 创建用户角色枚举\nCREATE TYPE user_role AS ENUM ('super_admin', 'manager', 'employee')","-- 创建员工状态枚举\nCREATE TYPE employee_status AS ENUM ('active', 'on_leave', 'vacation', 'standby', 'business_trip', 'resigned')","-- 创建文书分类枚举\nCREATE TYPE document_category AS ENUM (\n  'onboarding',      -- 入职管理\n  'employment',      -- 在职管理\n  'resignation',     -- 离职管理\n  'compensation',    -- 薪酬管理\n  'certificate'      -- 证明开具\n)","-- 创建签署状态枚举\nCREATE TYPE signing_status AS ENUM ('pending', 'employee_signed', 'company_signed', 'completed', 'rejected')","-- 创建通知类型枚举\nCREATE TYPE notification_type AS ENUM ('contract_expiry', 'document_signing', 'employee_onboarding', 'system')","-- 创建用户资料表\nCREATE TABLE profiles (\n  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,\n  username TEXT UNIQUE NOT NULL,\n  full_name TEXT,\n  phone TEXT,\n  role user_role NOT NULL DEFAULT 'employee',\n  company_id UUID,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 创建公司表\nCREATE TABLE companies (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL,\n  code TEXT UNIQUE NOT NULL,\n  contact_person TEXT,\n  contact_phone TEXT,\n  address TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 创建员工表\nCREATE TABLE employees (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  name TEXT NOT NULL,\n  employee_number TEXT NOT NULL,\n  phone TEXT,\n  email TEXT,\n  position TEXT,\n  department TEXT,\n  status employee_status NOT NULL DEFAULT 'active',\n  hire_date DATE,\n  contract_start_date DATE,\n  contract_end_date DATE,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW(),\n  UNIQUE(company_id, employee_number)\n)","-- 创建文书模板表\nCREATE TABLE document_templates (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  name TEXT NOT NULL,\n  category document_category NOT NULL,\n  content TEXT,\n  requires_company_signature BOOLEAN DEFAULT FALSE,\n  is_active BOOLEAN DEFAULT TRUE,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 创建签署记录表\nCREATE TABLE signing_records (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,\n  template_ids UUID[] NOT NULL,\n  status signing_status NOT NULL DEFAULT 'pending',\n  employee_signed_at TIMESTAMPTZ,\n  company_signed_at TIMESTAMPTZ,\n  third_party_signing_id TEXT,\n  notes TEXT,\n  created_by UUID REFERENCES profiles(id),\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 创建权限表\nCREATE TABLE permissions (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  code TEXT UNIQUE NOT NULL,\n  name TEXT NOT NULL,\n  description TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 创建角色表\nCREATE TABLE roles (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL,\n  description TEXT,\n  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,\n  is_system_role BOOLEAN DEFAULT FALSE,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 创建角色权限关联表\nCREATE TABLE role_permissions (\n  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,\n  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,\n  PRIMARY KEY (role_id, permission_id)\n)","-- 创建用户角色关联表\nCREATE TABLE user_roles (\n  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,\n  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,\n  PRIMARY KEY (user_id, role_id)\n)","-- 创建通知表\nCREATE TABLE notifications (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,\n  type notification_type NOT NULL,\n  title TEXT NOT NULL,\n  content TEXT,\n  is_read BOOLEAN DEFAULT FALSE,\n  related_id UUID,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 创建提醒配置表\nCREATE TABLE reminder_configs (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  contract_expiry_days INTEGER DEFAULT 30,\n  enable_sms BOOLEAN DEFAULT TRUE,\n  enable_in_app BOOLEAN DEFAULT TRUE,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 添加外键约束\nALTER TABLE profiles ADD CONSTRAINT fk_profiles_company \n  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL","-- 创建索引\nCREATE INDEX idx_employees_company ON employees(company_id)","CREATE INDEX idx_employees_status ON employees(status)","CREATE INDEX idx_employees_contract_end ON employees(contract_end_date)","CREATE INDEX idx_document_templates_company ON document_templates(company_id)","CREATE INDEX idx_document_templates_category ON document_templates(category)","CREATE INDEX idx_signing_records_company ON signing_records(company_id)","CREATE INDEX idx_signing_records_employee ON signing_records(employee_id)","CREATE INDEX idx_signing_records_status ON signing_records(status)","CREATE INDEX idx_notifications_user ON notifications(user_id)","CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read)","-- 插入系统权限\nINSERT INTO permissions (code, name, description) VALUES\n  ('company_manage', '公司录入', '管理公司信息'),\n  ('employee_manage', '员工录入', '管理员工信息'),\n  ('employee_status_manage', '员工状态管理', '修改员工状态'),\n  ('document_initiate', '文书发起', '发起文书签署'),\n  ('system_config', '系统配置', '系统配置管理'),\n  ('role_assign', '角色分配', '分配用户角色'),\n  ('user_manage', '用户管理', '管理系统用户'),\n  ('template_manage', '文书模板增加', '管理文书模板'),\n  ('document_manage', '文书管理', '管理文书记录'),\n  ('dashboard_view', '看板', '查看数据看板'),\n  ('subordinate_manage', '下属管理', '管理下属员工')","-- 创建辅助函数：检查是否为超级管理员\nCREATE OR REPLACE FUNCTION is_super_admin(uid UUID)\nRETURNS BOOLEAN\nLANGUAGE sql\nSECURITY DEFINER\nAS $$\n  SELECT EXISTS (\n    SELECT 1 FROM profiles\n    WHERE id = uid AND role = 'super_admin'\n  );\n$$","-- 创建辅助函数：检查是否为管理员（超级管理员或主管）\nCREATE OR REPLACE FUNCTION is_admin(uid UUID)\nRETURNS BOOLEAN\nLANGUAGE sql\nSECURITY DEFINER\nAS $$\n  SELECT EXISTS (\n    SELECT 1 FROM profiles\n    WHERE id = uid AND role IN ('super_admin', 'manager')\n  );\n$$","-- 创建触发器函数：新用户注册后同步到profiles\nCREATE OR REPLACE FUNCTION handle_new_user()\nRETURNS TRIGGER\nLANGUAGE plpgsql\nSECURITY DEFINER SET search_path = public\nAS $$\nDECLARE\n  user_count INTEGER;\n  extracted_username TEXT;\nBEGIN\n  SELECT COUNT(*) INTO user_count FROM profiles;\n  \n  -- 从email中提取用户名（去掉@miaoda.com）\n  extracted_username := REPLACE(NEW.email, '@miaoda.com', '');\n  \n  INSERT INTO public.profiles (id, username, role)\n  VALUES (\n    NEW.id,\n    extracted_username,\n    CASE WHEN user_count = 0 THEN 'super_admin'::user_role ELSE 'employee'::user_role END\n  );\n  \n  RETURN NEW;\nEND;\n$$","-- 创建触发器\nDROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users","CREATE TRIGGER on_auth_user_confirmed\n  AFTER UPDATE ON auth.users\n  FOR EACH ROW\n  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)\n  EXECUTE FUNCTION handle_new_user()","-- 创建更新时间触发器函数\nCREATE OR REPLACE FUNCTION update_updated_at()\nRETURNS TRIGGER\nLANGUAGE plpgsql\nAS $$\nBEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;\n$$","-- 为各表添加更新时间触发器\nCREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles\n  FOR EACH ROW EXECUTE FUNCTION update_updated_at()","CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies\n  FOR EACH ROW EXECUTE FUNCTION update_updated_at()","CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees\n  FOR EACH ROW EXECUTE FUNCTION update_updated_at()","CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON document_templates\n  FOR EACH ROW EXECUTE FUNCTION update_updated_at()","CREATE TRIGGER update_signing_records_updated_at BEFORE UPDATE ON signing_records\n  FOR EACH ROW EXECUTE FUNCTION update_updated_at()","CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles\n  FOR EACH ROW EXECUTE FUNCTION update_updated_at()","CREATE TRIGGER update_reminder_configs_updated_at BEFORE UPDATE ON reminder_configs\n  FOR EACH ROW EXECUTE FUNCTION update_updated_at()","-- 启用RLS\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY","ALTER TABLE companies ENABLE ROW LEVEL SECURITY","ALTER TABLE employees ENABLE ROW LEVEL SECURITY","ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY","ALTER TABLE signing_records ENABLE ROW LEVEL SECURITY","ALTER TABLE permissions ENABLE ROW LEVEL SECURITY","ALTER TABLE roles ENABLE ROW LEVEL SECURITY","ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY","ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY","ALTER TABLE notifications ENABLE ROW LEVEL SECURITY","ALTER TABLE reminder_configs ENABLE ROW LEVEL SECURITY","-- Profiles策略\nCREATE POLICY \\"超级管理员可以查看所有用户\\" ON profiles\n  FOR SELECT TO authenticated USING (is_super_admin(auth.uid()))","CREATE POLICY \\"用户可以查看自己的资料\\" ON profiles\n  FOR SELECT TO authenticated USING (auth.uid() = id)","CREATE POLICY \\"超级管理员可以更新所有用户\\" ON profiles\n  FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()))","CREATE POLICY \\"用户可以更新自己的资料（除角色外）\\" ON profiles\n  FOR UPDATE TO authenticated USING (auth.uid() = id)\n  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()))","-- Companies策略\nCREATE POLICY \\"管理员可以查看所有公司\\" ON companies\n  FOR SELECT TO authenticated USING (is_admin(auth.uid()))","CREATE POLICY \\"员工可以查看自己所属公司\\" ON companies\n  FOR SELECT TO authenticated USING (\n    id IN (SELECT company_id FROM profiles WHERE id = auth.uid())\n  )","CREATE POLICY \\"超级管理员可以管理公司\\" ON companies\n  FOR ALL TO authenticated USING (is_super_admin(auth.uid()))","-- Employees策略\nCREATE POLICY \\"管理员可以查看所有员工\\" ON employees\n  FOR SELECT TO authenticated USING (is_admin(auth.uid()))","CREATE POLICY \\"员工可以查看同公司员工\\" ON employees\n  FOR SELECT TO authenticated USING (\n    company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())\n  )","CREATE POLICY \\"管理员可以管理员工\\" ON employees\n  FOR ALL TO authenticated USING (is_admin(auth.uid()))","-- Document Templates策略\nCREATE POLICY \\"所有认证用户可以查看文书模板\\" ON document_templates\n  FOR SELECT TO authenticated USING (TRUE)","CREATE POLICY \\"管理员可以管理文书模板\\" ON document_templates\n  FOR ALL TO authenticated USING (is_admin(auth.uid()))","-- Signing Records策略\nCREATE POLICY \\"管理员可以查看所有签署记录\\" ON signing_records\n  FOR SELECT TO authenticated USING (is_admin(auth.uid()))","CREATE POLICY \\"员工可以查看相关签署记录\\" ON signing_records\n  FOR SELECT TO authenticated USING (\n    employee_id IN (SELECT id FROM employees WHERE company_id IN (\n      SELECT company_id FROM profiles WHERE id = auth.uid()\n    ))\n  )","CREATE POLICY \\"管理员可以管理签署记录\\" ON signing_records\n  FOR ALL TO authenticated USING (is_admin(auth.uid()))","-- Permissions策略\nCREATE POLICY \\"所有认证用户可以查看权限\\" ON permissions\n  FOR SELECT TO authenticated USING (TRUE)","CREATE POLICY \\"超级管理员可以管理权限\\" ON permissions\n  FOR ALL TO authenticated USING (is_super_admin(auth.uid()))","-- Roles策略\nCREATE POLICY \\"所有认证用户可以查看角色\\" ON roles\n  FOR SELECT TO authenticated USING (TRUE)","CREATE POLICY \\"超级管理员可以管理角色\\" ON roles\n  FOR ALL TO authenticated USING (is_super_admin(auth.uid()))","-- Role Permissions策略\nCREATE POLICY \\"所有认证用户可以查看角色权限\\" ON role_permissions\n  FOR SELECT TO authenticated USING (TRUE)","CREATE POLICY \\"超级管理员可以管理角色权限\\" ON role_permissions\n  FOR ALL TO authenticated USING (is_super_admin(auth.uid()))","-- User Roles策略\nCREATE POLICY \\"所有认证用户可以查看用户角色\\" ON user_roles\n  FOR SELECT TO authenticated USING (TRUE)","CREATE POLICY \\"超级管理员可以管理用户角色\\" ON user_roles\n  FOR ALL TO authenticated USING (is_super_admin(auth.uid()))","-- Notifications策略\nCREATE POLICY \\"用户可以查看自己的通知\\" ON notifications\n  FOR SELECT TO authenticated USING (user_id = auth.uid())","CREATE POLICY \\"用户可以更新自己的通知\\" ON notifications\n  FOR UPDATE TO authenticated USING (user_id = auth.uid())","CREATE POLICY \\"管理员可以创建通知\\" ON notifications\n  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()))","-- Reminder Configs策略\nCREATE POLICY \\"所有认证用户可以查看提醒配置\\" ON reminder_configs\n  FOR SELECT TO authenticated USING (TRUE)","CREATE POLICY \\"超级管理员可以管理提醒配置\\" ON reminder_configs\n  FOR ALL TO authenticated USING (is_super_admin(auth.uid()))"}	create_initial_schema
00002	{"-- 为公司表添加服务相关字段\nALTER TABLE companies \nADD COLUMN service_start_date DATE,\nADD COLUMN service_end_date DATE,\nADD COLUMN service_status BOOLEAN DEFAULT true","-- 添加注释\nCOMMENT ON COLUMN companies.service_start_date IS '服务开始日期'","COMMENT ON COLUMN companies.service_end_date IS '服务结束日期'","COMMENT ON COLUMN companies.service_status IS '服务状态：true=开启，false=关停'"}	add_company_service_fields
00003	{"-- 创建文书模板附件存储桶\nINSERT INTO storage.buckets (id, name, public)\nVALUES ('document-templates', 'document-templates', true)\nON CONFLICT (id) DO NOTHING","-- 设置存储桶策略：允许认证用户上传\nCREATE POLICY \\"允许认证用户上传文书模板附件\\"\nON storage.objects FOR INSERT\nTO authenticated\nWITH CHECK (bucket_id = 'document-templates')","-- 设置存储桶策略：允许所有人查看\nCREATE POLICY \\"允许所有人查看文书模板附件\\"\nON storage.objects FOR SELECT\nTO public\nUSING (bucket_id = 'document-templates')","-- 设置存储桶策略：允许认证用户删除自己上传的文件\nCREATE POLICY \\"允许认证用户删除文书模板附件\\"\nON storage.objects FOR DELETE\nTO authenticated\nUSING (bucket_id = 'document-templates')"}	create_document_templates_bucket
00004	{"-- 为公司表添加发薪日期字段\nALTER TABLE companies\nADD COLUMN payday_date DATE","COMMENT ON COLUMN companies.payday_date IS '发薪日期'"}	add_payday_date_to_companies
00005	{"-- 为profiles表添加上级字段\nALTER TABLE profiles ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL","-- 添加索引提升查询性能\nCREATE INDEX IF NOT EXISTS idx_profiles_manager_id ON profiles(manager_id)","-- 添加注释\nCOMMENT ON COLUMN profiles.manager_id IS '直属上级用户ID'","-- 创建递归查询函数：获取用户的所有下级（包括间接下级）\nCREATE OR REPLACE FUNCTION get_subordinates(user_id UUID)\nRETURNS TABLE (subordinate_id UUID) AS $$\nBEGIN\n  RETURN QUERY\n  WITH RECURSIVE subordinates AS (\n    -- 基础查询：直接下级\n    SELECT id FROM profiles WHERE manager_id = user_id\n    UNION\n    -- 递归查询：间接下级\n    SELECT p.id FROM profiles p\n    INNER JOIN subordinates s ON p.manager_id = s.id\n  )\n  SELECT id FROM subordinates;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- 创建函数：检查用户是否有权限查看目标用户的数据\nCREATE OR REPLACE FUNCTION can_view_user_data(viewer_id UUID, target_id UUID)\nRETURNS BOOLEAN AS $$\nDECLARE\n  viewer_role TEXT;\nBEGIN\n  -- 获取查看者的角色\n  SELECT role INTO viewer_role FROM profiles WHERE id = viewer_id;\n  \n  -- super_admin可以查看所有数据\n  IF viewer_role = 'super_admin' THEN\n    RETURN TRUE;\n  END IF;\n  \n  -- 可以查看自己的数据\n  IF viewer_id = target_id THEN\n    RETURN TRUE;\n  END IF;\n  \n  -- manager可以查看下级的数据\n  IF viewer_role = 'manager' THEN\n    RETURN EXISTS (\n      SELECT 1 FROM get_subordinates(viewer_id) WHERE subordinate_id = target_id\n    );\n  END IF;\n  \n  -- 其他情况不允许查看\n  RETURN FALSE;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER"}	add_user_hierarchy
00006	{"-- 为reminder_configs表添加续签通知提前天数字段\nALTER TABLE reminder_configs\nADD COLUMN renewal_notice_days INTEGER DEFAULT 7 CHECK (renewal_notice_days >= 1 AND renewal_notice_days <= 365)","COMMENT ON COLUMN reminder_configs.renewal_notice_days IS '续签通知提前天数，在合同到期前多少天发送续签通知'"}	add_renewal_notice_days
00007	{"-- 为signing_records表添加signed_file_url字段，用于存储已签署文件的URL\nALTER TABLE signing_records\nADD COLUMN signed_file_url TEXT","COMMENT ON COLUMN signing_records.signed_file_url IS '已签署文件的URL，存储在Supabase Storage中'"}	add_signed_file_url_to_signing_records
00008	{"-- 创建signed_documents表，存储每份签署文件的详细信息\nCREATE TABLE signed_documents (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  signing_record_id UUID NOT NULL REFERENCES signing_records(id) ON DELETE CASCADE,\n  template_id UUID NOT NULL REFERENCES document_templates(id) ON DELETE CASCADE,\n  template_name TEXT NOT NULL,\n  file_url TEXT,\n  file_size INTEGER,\n  signed_at TIMESTAMPTZ,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 添加注释\nCOMMENT ON TABLE signed_documents IS '已签署文件表，存储每份具体的签署文件'","COMMENT ON COLUMN signed_documents.signing_record_id IS '关联的签署记录ID'","COMMENT ON COLUMN signed_documents.template_id IS '文书模板ID'","COMMENT ON COLUMN signed_documents.template_name IS '文书名称（冗余存储，便于查询）'","COMMENT ON COLUMN signed_documents.file_url IS '已签署文件的URL'","COMMENT ON COLUMN signed_documents.file_size IS '文件大小（字节）'","COMMENT ON COLUMN signed_documents.signed_at IS '签署完成时间'","-- 创建索引\nCREATE INDEX idx_signed_documents_signing_record_id ON signed_documents(signing_record_id)","CREATE INDEX idx_signed_documents_template_id ON signed_documents(template_id)","CREATE INDEX idx_signed_documents_signed_at ON signed_documents(signed_at)","-- 创建更新时间触发器函数（如果不存在）\nCREATE OR REPLACE FUNCTION update_signed_documents_updated_at()\nRETURNS TRIGGER AS $$\nBEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql","-- 创建触发器\nCREATE TRIGGER update_signed_documents_updated_at\n  BEFORE UPDATE ON signed_documents\n  FOR EACH ROW\n  EXECUTE FUNCTION update_signed_documents_updated_at()","-- RLS策略\nALTER TABLE signed_documents ENABLE ROW LEVEL SECURITY","-- 认证用户可以查看所有已签署文件\nCREATE POLICY \\"authenticated_users_can_view_signed_documents\\"\n  ON signed_documents FOR SELECT\n  TO authenticated\n  USING (true)","-- 认证用户可以创建已签署文件记录\nCREATE POLICY \\"authenticated_users_can_create_signed_documents\\"\n  ON signed_documents FOR INSERT\n  TO authenticated\n  WITH CHECK (true)","-- 认证用户可以更新已签署文件记录\nCREATE POLICY \\"authenticated_users_can_update_signed_documents\\"\n  ON signed_documents FOR UPDATE\n  TO authenticated\n  USING (true)","-- 认证用户可以删除已签署文件记录\nCREATE POLICY \\"authenticated_users_can_delete_signed_documents\\"\n  ON signed_documents FOR DELETE\n  TO authenticated\n  USING (true)"}	create_signed_documents_table_fixed
00009	{"-- 添加role_id字段到profiles表，关联到roles表\nALTER TABLE profiles ADD COLUMN role_id UUID REFERENCES roles(id)","-- 添加索引\nCREATE INDEX idx_profiles_role_id ON profiles(role_id)","-- 添加注释\nCOMMENT ON COLUMN profiles.role_id IS '用户角色ID，关联到roles表，用于自定义角色'","-- 注意：保留原有的role字段用于向后兼容\n-- 未来可以逐步迁移到使用role_id"}	add_role_id_to_profiles
00010	{"-- 修改payday_date字段类型为integer，存储每月的发薪日（1-31）\nALTER TABLE companies DROP COLUMN payday_date","ALTER TABLE companies ADD COLUMN payday_date INTEGER","-- 添加约束：发薪日必须在1-31之间\nALTER TABLE companies ADD CONSTRAINT payday_date_range CHECK (payday_date >= 1 AND payday_date <= 31)","-- 添加注释\nCOMMENT ON COLUMN companies.payday_date IS '每月发薪日（1-31），如15表示每月15号发薪'"}	change_payday_date_to_day_of_month
00011	{"-- 添加is_active字段到profiles表\nALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL","-- 添加注释\nCOMMENT ON COLUMN profiles.is_active IS '用户是否激活，false表示暂停'","-- 创建删除用户的RPC函数\nCREATE OR REPLACE FUNCTION delete_user(user_id UUID)\nRETURNS JSON\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  result JSON;\nBEGIN\n  -- 检查用户是否存在\n  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN\n    RETURN json_build_object('success', false, 'error', '用户不存在');\n  END IF;\n  \n  -- 检查是否是超级管理员\n  IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND role = 'super_admin') THEN\n    RETURN json_build_object('success', false, 'error', '不能删除超级管理员');\n  END IF;\n  \n  -- 删除profiles记录\n  DELETE FROM profiles WHERE id = user_id;\n  \n  -- 删除auth.users记录（需要service_role权限）\n  DELETE FROM auth.users WHERE id = user_id;\n  \n  RETURN json_build_object('success', true);\nEXCEPTION\n  WHEN OTHERS THEN\n    RETURN json_build_object('success', false, 'error', SQLERRM);\nEND;\n$$","-- 创建切换用户状态的RPC函数\nCREATE OR REPLACE FUNCTION toggle_user_status(user_id UUID, new_status BOOLEAN)\nRETURNS JSON\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  result JSON;\nBEGIN\n  -- 检查用户是否存在\n  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN\n    RETURN json_build_object('success', false, 'error', '用户不存在');\n  END IF;\n  \n  -- 检查是否是超级管理员\n  IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND role = 'super_admin') THEN\n    RETURN json_build_object('success', false, 'error', '不能暂停超级管理员');\n  END IF;\n  \n  -- 更新状态\n  UPDATE profiles SET is_active = new_status WHERE id = user_id;\n  \n  RETURN json_build_object('success', true);\nEXCEPTION\n  WHEN OTHERS THEN\n    RETURN json_build_object('success', false, 'error', SQLERRM);\nEND;\n$$","-- 更新现有用户的is_active为true\nUPDATE profiles SET is_active = true WHERE is_active IS NULL"}	add_user_status_and_delete_functions
00012	{"-- 为manager角色添加公司管理权限\n\n-- 1. manager可以创建公司（INSERT）\nCREATE POLICY \\"主管可以创建公司\\"\nON companies\nFOR INSERT\nTO authenticated\nWITH CHECK (\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n)","-- 2. manager可以更新公司信息（UPDATE）\nCREATE POLICY \\"主管可以更新公司\\"\nON companies\nFOR UPDATE\nTO authenticated\nUSING (\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n)\nWITH CHECK (\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n)","-- 3. manager可以删除公司（DELETE）\nCREATE POLICY \\"主管可以删除公司\\"\nON companies\nFOR DELETE\nTO authenticated\nUSING (\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n)"}	add_manager_company_policies
00013	{"-- 创建权限检查函数\nCREATE OR REPLACE FUNCTION has_permission(user_id uuid, permission_code text)\nRETURNS boolean\nLANGUAGE sql\nSECURITY DEFINER\nAS $$\n  SELECT EXISTS (\n    SELECT 1 \n    FROM profiles p\n    LEFT JOIN role_permissions rp ON p.role_id = rp.role_id\n    LEFT JOIN permissions perm ON rp.permission_id = perm.id\n    WHERE p.id = user_id \n    AND perm.code = permission_code\n  );\n$$","-- 删除旧的主管策略\nDROP POLICY IF EXISTS \\"主管可以创建公司\\" ON companies","DROP POLICY IF EXISTS \\"主管可以更新公司\\" ON companies","DROP POLICY IF EXISTS \\"主管可以删除公司\\" ON companies","-- 创建新的基于权限的策略\nCREATE POLICY \\"有权限的用户可以创建公司\\"\nON companies\nFOR INSERT\nTO authenticated\nWITH CHECK (\n  -- 基础角色系统：manager可以创建\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n  OR\n  -- 自定义角色系统：有company_create权限的用户可以创建\n  has_permission(auth.uid(), 'company_create')\n)","CREATE POLICY \\"有权限的用户可以更新公司\\"\nON companies\nFOR UPDATE\nTO authenticated\nUSING (\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n  OR\n  has_permission(auth.uid(), 'company_edit')\n)\nWITH CHECK (\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n  OR\n  has_permission(auth.uid(), 'company_edit')\n)","CREATE POLICY \\"有权限的用户可以删除公司\\"\nON companies\nFOR DELETE\nTO authenticated\nUSING (\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n  OR\n  has_permission(auth.uid(), 'company_delete')\n)"}	add_permission_check_function_and_update_policies
00014	{"-- 1.1 创建 uid() 函数：获取当前用户ID\nCREATE OR REPLACE FUNCTION uid()\nRETURNS uuid\nLANGUAGE sql\nSTABLE\nAS $$\n  SELECT auth.uid();\n$$","GRANT EXECUTE ON FUNCTION uid() TO authenticated","-- 更新employees表的策略\nDROP POLICY IF EXISTS \\"管理员可以管理员工\\" ON employees","CREATE POLICY \\"有权限的用户可以管理员工\\"\nON employees\nFOR ALL\nTO authenticated\nUSING (\n  is_admin(uid())\n  OR\n  has_permission(auth.uid(), 'employee_manage')\n  OR\n  has_permission(auth.uid(), 'employee_view')\n  OR\n  has_permission(auth.uid(), 'employee_edit')\n  OR\n  has_permission(auth.uid(), 'employee_create')\n  OR\n  has_permission(auth.uid(), 'employee_delete')\n)","-- 更新document_templates表的策略\nDROP POLICY IF EXISTS \\"管理员可以管理文书模板\\" ON document_templates","CREATE POLICY \\"有权限的用户可以管理文书模板\\"\nON document_templates\nFOR ALL\nTO authenticated\nUSING (\n  is_admin(uid())\n  OR\n  has_permission(auth.uid(), 'template_manage')\n  OR\n  has_permission(auth.uid(), 'template_view')\n  OR\n  has_permission(auth.uid(), 'template_edit')\n  OR\n  has_permission(auth.uid(), 'template_create')\n  OR\n  has_permission(auth.uid(), 'template_delete')\n)","-- 更新signing_records表的策略\nDROP POLICY IF EXISTS \\"管理员可以管理签署记录\\" ON signing_records","CREATE POLICY \\"有权限的用户可以管理签署记录\\"\nON signing_records\nFOR ALL\nTO authenticated\nUSING (\n  is_admin(uid())\n  OR\n  has_permission(auth.uid(), 'document_manage')\n  OR\n  has_permission(auth.uid(), 'document_initiate')\n  OR\n  has_permission(auth.uid(), 'document_view')\n)"}	update_all_table_policies_with_permissions
00015	{"-- 修复所有RLS策略，将uid()改为auth.uid()\n\n-- 1. 修复companies表的策略\nDROP POLICY IF EXISTS \\"有权限的用户可以创建公司\\" ON companies","DROP POLICY IF EXISTS \\"有权限的用户可以更新公司\\" ON companies","DROP POLICY IF EXISTS \\"有权限的用户可以删除公司\\" ON companies","CREATE POLICY \\"有权限的用户可以创建公司\\"\nON companies\nFOR INSERT\nTO authenticated\nWITH CHECK (\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n  OR\n  has_permission(auth.uid(), 'company_create')\n)","CREATE POLICY \\"有权限的用户可以更新公司\\"\nON companies\nFOR UPDATE\nTO authenticated\nUSING (\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n  OR\n  has_permission(auth.uid(), 'company_edit')\n)\nWITH CHECK (\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n  OR\n  has_permission(auth.uid(), 'company_edit')\n)","CREATE POLICY \\"有权限的用户可以删除公司\\"\nON companies\nFOR DELETE\nTO authenticated\nUSING (\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE profiles.id = auth.uid()\n    AND profiles.role = 'manager'\n  )\n  OR\n  has_permission(auth.uid(), 'company_delete')\n)","-- 2. 修复employees表的策略\nDROP POLICY IF EXISTS \\"有权限的用户可以管理员工\\" ON employees","CREATE POLICY \\"有权限的用户可以管理员工\\"\nON employees\nFOR ALL\nTO authenticated\nUSING (\n  is_admin(auth.uid())\n  OR\n  has_permission(auth.uid(), 'employee_manage')\n  OR\n  has_permission(auth.uid(), 'employee_view')\n  OR\n  has_permission(auth.uid(), 'employee_edit')\n  OR\n  has_permission(auth.uid(), 'employee_create')\n  OR\n  has_permission(auth.uid(), 'employee_delete')\n)","-- 3. 修复document_templates表的策略\nDROP POLICY IF EXISTS \\"有权限的用户可以管理文书模板\\" ON document_templates","CREATE POLICY \\"有权限的用户可以管理文书模板\\"\nON document_templates\nFOR ALL\nTO authenticated\nUSING (\n  is_admin(auth.uid())\n  OR\n  has_permission(auth.uid(), 'template_manage')\n  OR\n  has_permission(auth.uid(), 'template_view')\n  OR\n  has_permission(auth.uid(), 'template_edit')\n  OR\n  has_permission(auth.uid(), 'template_create')\n  OR\n  has_permission(auth.uid(), 'template_delete')\n)","-- 4. 修复signing_records表的策略\nDROP POLICY IF EXISTS \\"有权限的用户可以管理签署记录\\" ON signing_records","CREATE POLICY \\"有权限的用户可以管理签署记录\\"\nON signing_records\nFOR ALL\nTO authenticated\nUSING (\n  is_admin(auth.uid())\n  OR\n  has_permission(auth.uid(), 'document_manage')\n  OR\n  has_permission(auth.uid(), 'document_initiate')\n  OR\n  has_permission(auth.uid(), 'document_view')\n)"}	fix_rls_policies_use_auth_uid
00016	{"-- 创建公司编码序列表\nCREATE TABLE IF NOT EXISTS company_code_sequences (\n  date_key TEXT PRIMARY KEY,  -- 格式: YYYYMMDD\n  last_sequence INTEGER NOT NULL DEFAULT 0,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 创建索引\nCREATE INDEX IF NOT EXISTS idx_company_code_sequences_date ON company_code_sequences(date_key)","-- 创建原子性生成公司编码的函数\nCREATE OR REPLACE FUNCTION generate_company_code()\nRETURNS TEXT\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  v_date_key TEXT;\n  v_sequence INTEGER;\n  v_code TEXT;\nBEGIN\n  -- 获取当前日期的key (YYYYMMDD格式)\n  v_date_key := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');\n  \n  -- 使用SELECT FOR UPDATE锁定行，如果不存在则插入\n  -- 这保证了并发安全\n  INSERT INTO company_code_sequences (date_key, last_sequence)\n  VALUES (v_date_key, 1)\n  ON CONFLICT (date_key) \n  DO UPDATE SET \n    last_sequence = company_code_sequences.last_sequence + 1,\n    updated_at = NOW()\n  RETURNING last_sequence INTO v_sequence;\n  \n  -- 生成编码: 日期 + 3位序列号\n  v_code := v_date_key || LPAD(v_sequence::TEXT, 3, '0');\n  \n  RETURN v_code;\nEND;\n$$","-- 添加注释\nCOMMENT ON TABLE company_code_sequences IS '公司编码序列表，用于生成唯一的公司编码'","COMMENT ON FUNCTION generate_company_code() IS '原子性生成公司编码，格式：YYYYMMDD + 3位序列号'","-- 为companies表的code字段添加唯一约束（如果还没有）\nDO $$ \nBEGIN\n  IF NOT EXISTS (\n    SELECT 1 FROM pg_constraint \n    WHERE conname = 'companies_code_unique'\n  ) THEN\n    ALTER TABLE companies ADD CONSTRAINT companies_code_unique UNIQUE (code);\n  END IF;\nEND $$"}	create_company_code_generator
00033	{"-- 删除旧的signed_documents表SELECT策略\nDROP POLICY IF EXISTS \\"用户可以查看所有已签署文档\\" ON signed_documents","DROP POLICY IF EXISTS \\"超级管理员可以查看所有已签署文档\\" ON signed_documents","-- 创建新的SELECT策略：通过signing_record关联到company\nCREATE POLICY \\"用户可以查看自己和下级负责的公司的已签署文档\\"\nON signed_documents\nFOR SELECT\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'signed_file_download') AND \n   signing_record_id IN (\n     SELECT id FROM signing_records \n     WHERE company_id IN (\n       SELECT id FROM companies \n       WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n     )\n   ))\n)","-- UPDATE策略\nDROP POLICY IF EXISTS \\"用户可以更新已签署文档\\" ON signed_documents","CREATE POLICY \\"用户可以更新自己和下级负责的公司的已签署文档\\"\nON signed_documents\nFOR UPDATE\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'document_manage') AND \n   signing_record_id IN (\n     SELECT id FROM signing_records \n     WHERE company_id IN (\n       SELECT id FROM companies \n       WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n     )\n   ))\n)","-- DELETE策略\nDROP POLICY IF EXISTS \\"用户可以删除已签署文档\\" ON signed_documents","CREATE POLICY \\"用户可以删除自己和下级负责的公司的已签署文档\\"\nON signed_documents\nFOR DELETE\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'document_manage') AND \n   signing_record_id IN (\n     SELECT id FROM signing_records \n     WHERE company_id IN (\n       SELECT id FROM companies \n       WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n     )\n   ))\n)","-- INSERT策略\nDROP POLICY IF EXISTS \\"用户可以创建已签署文档\\" ON signed_documents","CREATE POLICY \\"用户可以创建已签署文档\\"\nON signed_documents\nFOR INSERT\nTO authenticated\nWITH CHECK (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'document_manage') AND \n   signing_record_id IN (\n     SELECT id FROM signing_records \n     WHERE company_id IN (\n       SELECT id FROM companies \n       WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n     )\n   ))\n)"}	update_signed_documents_rls_for_subordinate_access
00017	{"-- 删除旧的SELECT策略，重新创建基于权限的策略\nDROP POLICY IF EXISTS \\"员工可以查看自己所属公司\\" ON companies","DROP POLICY IF EXISTS \\"管理员可以查看所有公司\\" ON companies","-- 创建新的SELECT策略：有company_view权限的用户可以查看所有公司\nCREATE POLICY \\"有权限的用户可以查看公司\\"\nON companies\nFOR SELECT\nUSING (\n  -- 超级管理员可以查看所有\n  is_super_admin(auth.uid())\n  OR\n  -- manager角色可以查看所有\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE id = auth.uid() AND role = 'manager'\n  )\n  OR\n  -- 有company_view权限的用户可以查看所有\n  has_permission(auth.uid(), 'company_view')\n  OR\n  -- 员工可以查看自己所属的公司\n  id IN (\n    SELECT company_id FROM profiles\n    WHERE id = auth.uid()\n  )\n)"}	add_permission_based_select_policy_for_companies
00018	{"-- 1. 先处理重复的联系电话，为重复的记录添加后缀\n-- 保留第一条记录，其他记录的电话号码添加后缀\nWITH ranked_companies AS (\n  SELECT \n    id,\n    contact_phone,\n    ROW_NUMBER() OVER (PARTITION BY contact_phone ORDER BY created_at) as rn\n  FROM companies\n  WHERE contact_phone IS NOT NULL AND contact_phone != ''\n)\nUPDATE companies c\nSET contact_phone = c.contact_phone || '-' || (rc.rn - 1)\nFROM ranked_companies rc\nWHERE c.id = rc.id AND rc.rn > 1","-- 2. 添加公司名称唯一约束\nDO $$ \nBEGIN\n  IF NOT EXISTS (\n    SELECT 1 FROM pg_constraint \n    WHERE conname = 'companies_name_unique'\n  ) THEN\n    ALTER TABLE companies ADD CONSTRAINT companies_name_unique UNIQUE (name);\n  END IF;\nEND $$","-- 3. 添加联系电话唯一约束\nDO $$ \nBEGIN\n  IF NOT EXISTS (\n    SELECT 1 FROM pg_constraint \n    WHERE conname = 'companies_contact_phone_unique'\n  ) THEN\n    ALTER TABLE companies ADD CONSTRAINT companies_contact_phone_unique UNIQUE (contact_phone);\n  END IF;\nEND $$","-- 4. 更新现有的NULL值为默认值\nUPDATE companies \nSET \n  contact_person = COALESCE(contact_person, '未填写'),\n  contact_phone = COALESCE(contact_phone, '未填写'),\n  address = COALESCE(address, '未填写'),\n  service_start_date = COALESCE(service_start_date, CURRENT_DATE),\n  service_end_date = COALESCE(service_end_date, CURRENT_DATE + INTERVAL '1 year'),\n  payday_date = COALESCE(payday_date, 1)\nWHERE \n  contact_person IS NULL \n  OR contact_phone IS NULL \n  OR address IS NULL \n  OR service_start_date IS NULL \n  OR service_end_date IS NULL\n  OR payday_date IS NULL","-- 5. 设置字段为NOT NULL\nALTER TABLE companies \nALTER COLUMN contact_person SET NOT NULL,\nALTER COLUMN contact_phone SET NOT NULL,\nALTER COLUMN address SET NOT NULL,\nALTER COLUMN service_start_date SET NOT NULL,\nALTER COLUMN service_end_date SET NOT NULL,\nALTER COLUMN payday_date SET NOT NULL","-- 6. 添加注释\nCOMMENT ON CONSTRAINT companies_name_unique ON companies IS '公司名称唯一约束'","COMMENT ON CONSTRAINT companies_contact_phone_unique ON companies IS '联系电话唯一约束'"}	add_unique_constraints_and_required_fields_v2
00019	{"-- ============================================\n-- 公司所有权和层级访问控制\n-- ============================================\n\n-- 1. 在companies表添加created_by字段\nALTER TABLE companies \nADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id)","-- 2. 为现有公司设置创建者（设为超级管理员）\nUPDATE companies \nSET created_by = (\n  SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1\n)\nWHERE created_by IS NULL","-- 3. 设置created_by为NOT NULL\nALTER TABLE companies \nALTER COLUMN created_by SET NOT NULL","-- 4. 添加索引\nCREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by)","-- 5. 创建递归函数：获取用户的所有上级ID\nCREATE OR REPLACE FUNCTION get_manager_chain(user_id UUID)\nRETURNS TABLE(manager_id UUID)\nLANGUAGE sql\nSECURITY DEFINER\nSTABLE\nAS $$\n  WITH RECURSIVE manager_chain AS (\n    -- 基础情况：直接上级\n    SELECT manager_id FROM profiles WHERE id = user_id AND manager_id IS NOT NULL\n    UNION\n    -- 递归情况：上级的上级\n    SELECT p.manager_id \n    FROM profiles p\n    INNER JOIN manager_chain mc ON p.id = mc.manager_id\n    WHERE p.manager_id IS NOT NULL\n  )\n  SELECT manager_id FROM manager_chain;\n$$","-- 6. 创建辅助函数：判断用户是否可以访问某个公司\nCREATE OR REPLACE FUNCTION can_access_company_data(user_id UUID, target_company_id UUID)\nRETURNS BOOLEAN\nLANGUAGE plpgsql\nSECURITY DEFINER\nSTABLE\nAS $$\nDECLARE\n  company_creator UUID;\nBEGIN\n  -- 超级管理员可以访问所有公司\n  IF is_super_admin(user_id) THEN\n    RETURN TRUE;\n  END IF;\n  \n  -- 获取公司的创建者\n  SELECT created_by INTO company_creator FROM companies WHERE id = target_company_id;\n  \n  IF company_creator IS NULL THEN\n    RETURN FALSE;\n  END IF;\n  \n  -- 如果是创建者本人\n  IF company_creator = user_id THEN\n    RETURN TRUE;\n  END IF;\n  \n  -- 如果是创建者的上级（在上级链中）\n  IF EXISTS(\n    SELECT 1 FROM get_manager_chain(company_creator) WHERE manager_id = user_id\n  ) THEN\n    RETURN TRUE;\n  END IF;\n  \n  RETURN FALSE;\nEND;\n$$","-- ============================================\n-- 更新 companies 表的 RLS 策略\n-- ============================================\n\n-- 删除旧的SELECT策略\nDROP POLICY IF EXISTS \\"有权限的用户可以查看公司\\" ON companies","-- 创建新的SELECT策略：基于所有权和层级关系\nCREATE POLICY \\"用户可以查看自己创建的公司和下属创建的公司\\"\nON companies\nFOR SELECT\nUSING (\n  -- 超级管理员可以查看所有\n  is_super_admin(auth.uid())\n  OR\n  -- 创建者可以查看\n  created_by = auth.uid()\n  OR\n  -- 创建者的上级可以查看（递归）\n  EXISTS(\n    SELECT 1 FROM get_manager_chain(created_by) WHERE manager_id = auth.uid()\n  )\n)","-- 更新INSERT策略\nDROP POLICY IF EXISTS \\"有权限的用户可以创建公司\\" ON companies","CREATE POLICY \\"用户可以创建公司\\"\nON companies\nFOR INSERT\nWITH CHECK (\n  -- 超级管理员可以创建\n  is_super_admin(auth.uid())\n  OR\n  -- 有company_create权限的用户可以创建\n  has_permission(auth.uid(), 'company_create')\n  OR\n  -- manager角色可以创建\n  EXISTS (\n    SELECT 1 FROM profiles\n    WHERE id = auth.uid() AND role = 'manager'\n  )\n)","-- 更新UPDATE策略\nDROP POLICY IF EXISTS \\"有权限的用户可以更新公司\\" ON companies","CREATE POLICY \\"用户可以更新自己创建的公司\\"\nON companies\nFOR UPDATE\nUSING (\n  -- 超级管理员可以更新所有\n  is_super_admin(auth.uid())\n  OR\n  -- 创建者可以更新\n  created_by = auth.uid()\n  OR\n  -- 创建者的直接上级可以更新\n  created_by IN (\n    SELECT id FROM profiles WHERE manager_id = auth.uid()\n  )\n)\nWITH CHECK (\n  -- 更新后仍然满足条件\n  is_super_admin(auth.uid())\n  OR\n  created_by = auth.uid()\n  OR\n  created_by IN (\n    SELECT id FROM profiles WHERE manager_id = auth.uid()\n  )\n)","-- 更新DELETE策略\nDROP POLICY IF EXISTS \\"有权限的用户可以删除公司\\" ON companies","CREATE POLICY \\"用户可以删除自己创建的公司\\"\nON companies\nFOR DELETE\nUSING (\n  -- 超级管理员可以删除所有\n  is_super_admin(auth.uid())\n  OR\n  -- 创建者可以删除\n  created_by = auth.uid()\n  OR\n  -- 有delete权限且是创建者的直接上级\n  (\n    has_permission(auth.uid(), 'company_delete')\n    AND created_by IN (\n      SELECT id FROM profiles WHERE manager_id = auth.uid()\n    )\n  )\n)","-- ============================================\n-- 更新 employees 表的 RLS 策略\n-- ============================================\n\n-- 删除旧的SELECT策略\nDROP POLICY IF EXISTS \\"用户可以查看自己公司的员工和下属\\" ON employees","-- 创建新的SELECT策略：基于公司所有权\nCREATE POLICY \\"用户可以查看有权访问的公司的员工\\"\nON employees\nFOR SELECT\nUSING (\n  -- 超级管理员可以查看所有\n  is_super_admin(auth.uid())\n  OR\n  -- 可以查看有权访问的公司的员工\n  can_access_company_data(auth.uid(), company_id)\n)","-- 更新INSERT策略\nDROP POLICY IF EXISTS \\"用户可以创建自己公司的员工\\" ON employees","DROP POLICY IF EXISTS \\"用户可以创建有权访问的公司的员工\\" ON employees","CREATE POLICY \\"用户可以创建有权访问的公司的员工\\"\nON employees\nFOR INSERT\nWITH CHECK (\n  -- 超级管理员可以创建\n  is_super_admin(auth.uid())\n  OR\n  -- 可以在有权访问的公司创建员工\n  (\n    has_permission(auth.uid(), 'employee_create')\n    AND can_access_company_data(auth.uid(), company_id)\n  )\n)","-- 更新UPDATE策略\nDROP POLICY IF EXISTS \\"用户可以更新自己公司的员工和下属\\" ON employees","DROP POLICY IF EXISTS \\"用户可以更新有权访问的公司的员工\\" ON employees","CREATE POLICY \\"用户可以更新有权访问的公司的员工\\"\nON employees\nFOR UPDATE\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'employee_edit')\n    AND can_access_company_data(auth.uid(), company_id)\n  )\n)\nWITH CHECK (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'employee_edit')\n    AND can_access_company_data(auth.uid(), company_id)\n  )\n)","-- 更新DELETE策略\nDROP POLICY IF EXISTS \\"用户可以删除自己公司的员工\\" ON employees","DROP POLICY IF EXISTS \\"用户可以删除有权访问的公司的员工\\" ON employees","CREATE POLICY \\"用户可以删除有权访问的公司的员工\\"\nON employees\nFOR DELETE\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'employee_delete')\n    AND can_access_company_data(auth.uid(), company_id)\n  )\n)","-- ============================================\n-- 更新 document_templates 表的 RLS 策略\n-- ============================================\n\n-- 删除旧策略\nDROP POLICY IF EXISTS \\"用户可以查看自己公司的文书模板\\" ON document_templates","DROP POLICY IF EXISTS \\"用户可以查看有权访问的公司的文书模板\\" ON document_templates","-- 创建新的SELECT策略\nCREATE POLICY \\"用户可以查看有权访问的公司的文书模板\\"\nON document_templates\nFOR SELECT\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  can_access_company_data(auth.uid(), company_id)\n)","-- 更新INSERT策略\nDROP POLICY IF EXISTS \\"用户可以创建自己公司的文书模板\\" ON document_templates","DROP POLICY IF EXISTS \\"用户可以创建有权访问的公司的文书模板\\" ON document_templates","CREATE POLICY \\"用户可以创建有权访问的公司的文书模板\\"\nON document_templates\nFOR INSERT\nWITH CHECK (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'template_create')\n    AND can_access_company_data(auth.uid(), company_id)\n  )\n)","-- 更新UPDATE策略\nDROP POLICY IF EXISTS \\"用户可以更新自己公司的文书模板\\" ON document_templates","DROP POLICY IF EXISTS \\"用户可以更新有权访问的公司的文书模板\\" ON document_templates","CREATE POLICY \\"用户可以更新有权访问的公司的文书模板\\"\nON document_templates\nFOR UPDATE\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'template_edit')\n    AND can_access_company_data(auth.uid(), company_id)\n  )\n)\nWITH CHECK (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'template_edit')\n    AND can_access_company_data(auth.uid(), company_id)\n  )\n)","-- 更新DELETE策略\nDROP POLICY IF EXISTS \\"用户可以删除自己公司的文书模板\\" ON document_templates","DROP POLICY IF EXISTS \\"用户可以删除有权访问的公司的文书模板\\" ON document_templates","CREATE POLICY \\"用户可以删除有权访问的公司的文书模板\\"\nON document_templates\nFOR DELETE\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'template_delete')\n    AND can_access_company_data(auth.uid(), company_id)\n  )\n)","-- ============================================\n-- 更新 signing_records 表的 RLS 策略\n-- ============================================\n\n-- 删除旧策略\nDROP POLICY IF EXISTS \\"用户可以查看自己公司的签署记录\\" ON signing_records","DROP POLICY IF EXISTS \\"用户可以查看有权访问的公司的签署记录\\" ON signing_records","-- 创建新的SELECT策略\nCREATE POLICY \\"用户可以查看有权访问的公司的签署记录\\"\nON signing_records\nFOR SELECT\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  -- 可以查看有权访问的公司的签署记录\n  can_access_company_data(auth.uid(), company_id)\n  OR\n  -- 创建者可以查看自己创建的签署记录\n  created_by = auth.uid()\n)","-- 更新INSERT策略\nDROP POLICY IF EXISTS \\"用户可以创建自己公司的签署记录\\" ON signing_records","DROP POLICY IF EXISTS \\"用户可以创建有权访问的公司的签署记录\\" ON signing_records","CREATE POLICY \\"用户可以创建有权访问的公司的签署记录\\"\nON signing_records\nFOR INSERT\nWITH CHECK (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'document_create')\n    AND can_access_company_data(auth.uid(), company_id)\n  )\n)","-- 更新UPDATE策略\nDROP POLICY IF EXISTS \\"用户可以更新自己公司的签署记录\\" ON signing_records","DROP POLICY IF EXISTS \\"用户可以更新有权访问的公司的签署记录\\" ON signing_records","CREATE POLICY \\"用户可以更新有权访问的公司的签署记录\\"\nON signing_records\nFOR UPDATE\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'document_edit')\n    AND can_access_company_data(auth.uid(), company_id)\n  )\n  OR\n  -- 创建者可以更新自己创建的签署记录\n  created_by = auth.uid()\n)\nWITH CHECK (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'document_edit')\n    AND can_access_company_data(auth.uid(), company_id)\n  )\n  OR\n  created_by = auth.uid()\n)","-- 添加注释\nCOMMENT ON COLUMN companies.created_by IS '公司创建者ID'","COMMENT ON FUNCTION get_manager_chain IS '递归获取用户的所有上级ID'","COMMENT ON FUNCTION can_access_company_data IS '判断用户是否可以访问某个公司的数据（创建者或其上级）'"}	add_company_ownership_and_hierarchy_access_v2
00020	{"-- ============================================\n-- 公司流转功能\n-- ============================================\n\n-- 1. 在companies表添加owner_id字段（当前所有者）\nALTER TABLE companies \nADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id)","-- 2. 为现有公司设置owner_id = created_by\nUPDATE companies \nSET owner_id = created_by\nWHERE owner_id IS NULL","-- 3. 设置owner_id为NOT NULL\nALTER TABLE companies \nALTER COLUMN owner_id SET NOT NULL","-- 4. 添加索引\nCREATE INDEX IF NOT EXISTS idx_companies_owner_id ON companies(owner_id)","-- 5. 创建公司流转历史表\nCREATE TABLE IF NOT EXISTS company_transfers (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  from_user_id UUID NOT NULL REFERENCES auth.users(id),\n  to_user_id UUID NOT NULL REFERENCES auth.users(id),\n  transferred_by UUID NOT NULL REFERENCES auth.users(id), -- 操作人\n  reason TEXT, -- 流转原因\n  created_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 6. 添加索引\nCREATE INDEX IF NOT EXISTS idx_company_transfers_company_id ON company_transfers(company_id)","CREATE INDEX IF NOT EXISTS idx_company_transfers_from_user ON company_transfers(from_user_id)","CREATE INDEX IF NOT EXISTS idx_company_transfers_to_user ON company_transfers(to_user_id)","-- 7. 更新can_access_company_data函数，基于owner_id而不是created_by\nCREATE OR REPLACE FUNCTION can_access_company_data(user_id UUID, target_company_id UUID)\nRETURNS BOOLEAN\nLANGUAGE plpgsql\nSECURITY DEFINER\nSTABLE\nAS $$\nDECLARE\n  company_owner UUID;\nBEGIN\n  -- 超级管理员可以访问所有公司\n  IF is_super_admin(user_id) THEN\n    RETURN TRUE;\n  END IF;\n  \n  -- 获取公司的当前所有者\n  SELECT owner_id INTO company_owner FROM companies WHERE id = target_company_id;\n  \n  IF company_owner IS NULL THEN\n    RETURN FALSE;\n  END IF;\n  \n  -- 如果是所有者本人\n  IF company_owner = user_id THEN\n    RETURN TRUE;\n  END IF;\n  \n  -- 如果是所有者的上级（在上级链中）\n  IF EXISTS(\n    SELECT 1 FROM get_manager_chain(company_owner) WHERE manager_id = user_id\n  ) THEN\n    RETURN TRUE;\n  END IF;\n  \n  RETURN FALSE;\nEND;\n$$","-- 8. 创建公司流转函数\nCREATE OR REPLACE FUNCTION transfer_company(\n  p_company_id UUID,\n  p_to_user_id UUID,\n  p_reason TEXT DEFAULT NULL\n)\nRETURNS BOOLEAN\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  v_from_user_id UUID;\n  v_current_user_id UUID;\n  v_can_transfer BOOLEAN;\nBEGIN\n  -- 获取当前用户ID\n  v_current_user_id := auth.uid();\n  \n  -- 获取公司的当前所有者\n  SELECT owner_id INTO v_from_user_id FROM companies WHERE id = p_company_id;\n  \n  IF v_from_user_id IS NULL THEN\n    RAISE EXCEPTION '公司不存在';\n  END IF;\n  \n  -- 检查权限：所有者本人、所有者的上级、超级管理员\n  v_can_transfer := (\n    v_from_user_id = v_current_user_id  -- 所有者本人\n    OR is_super_admin(v_current_user_id)  -- 超级管理员\n    OR EXISTS(  -- 所有者的上级\n      SELECT 1 FROM get_manager_chain(v_from_user_id) \n      WHERE manager_id = v_current_user_id\n    )\n  );\n  \n  IF NOT v_can_transfer THEN\n    RAISE EXCEPTION '没有权限流转此公司';\n  END IF;\n  \n  -- 检查目标用户是否存在\n  IF NOT EXISTS(SELECT 1 FROM profiles WHERE id = p_to_user_id) THEN\n    RAISE EXCEPTION '目标用户不存在';\n  END IF;\n  \n  -- 更新公司所有者\n  UPDATE companies \n  SET owner_id = p_to_user_id, updated_at = NOW()\n  WHERE id = p_company_id;\n  \n  -- 记录流转历史\n  INSERT INTO company_transfers (\n    company_id, from_user_id, to_user_id, transferred_by, reason\n  ) VALUES (\n    p_company_id, v_from_user_id, p_to_user_id, v_current_user_id, p_reason\n  );\n  \n  RETURN TRUE;\nEND;\n$$","-- 9. 更新companies表的RLS策略（基于owner_id）\nDROP POLICY IF EXISTS \\"用户可以查看自己创建的公司和下属创建的公司\\" ON companies","CREATE POLICY \\"用户可以查看自己拥有的公司和下属拥有的公司\\"\nON companies\nFOR SELECT\nUSING (\n  -- 超级管理员可以查看所有\n  is_super_admin(auth.uid())\n  OR\n  -- 所有者可以查看\n  owner_id = auth.uid()\n  OR\n  -- 所有者的上级可以查看（递归）\n  EXISTS(\n    SELECT 1 FROM get_manager_chain(owner_id) WHERE manager_id = auth.uid()\n  )\n)","-- 更新UPDATE策略\nDROP POLICY IF EXISTS \\"用户可以更新自己创建的公司\\" ON companies","CREATE POLICY \\"用户可以更新自己拥有的公司\\"\nON companies\nFOR UPDATE\nUSING (\n  -- 超级管理员可以更新所有\n  is_super_admin(auth.uid())\n  OR\n  -- 所有者可以更新\n  owner_id = auth.uid()\n  OR\n  -- 所有者的直接上级可以更新\n  owner_id IN (\n    SELECT id FROM profiles WHERE manager_id = auth.uid()\n  )\n)\nWITH CHECK (\n  -- 更新后仍然满足条件\n  is_super_admin(auth.uid())\n  OR\n  owner_id = auth.uid()\n  OR\n  owner_id IN (\n    SELECT id FROM profiles WHERE manager_id = auth.uid()\n  )\n)","-- 更新DELETE策略\nDROP POLICY IF EXISTS \\"用户可以删除自己创建的公司\\" ON companies","CREATE POLICY \\"用户可以删除自己拥有的公司\\"\nON companies\nFOR DELETE\nUSING (\n  -- 超级管理员可以删除所有\n  is_super_admin(auth.uid())\n  OR\n  -- 所有者可以删除\n  owner_id = auth.uid()\n  OR\n  -- 有delete权限且是所有者的直接上级\n  (\n    has_permission(auth.uid(), 'company_delete')\n    AND owner_id IN (\n      SELECT id FROM profiles WHERE manager_id = auth.uid()\n    )\n  )\n)","-- 10. 为company_transfers表创建RLS策略\nALTER TABLE company_transfers ENABLE ROW LEVEL SECURITY","-- 查看流转历史：公司的所有者和上级可以查看\nCREATE POLICY \\"用户可以查看相关公司的流转历史\\"\nON company_transfers\nFOR SELECT\nUSING (\n  -- 超级管理员可以查看所有\n  is_super_admin(auth.uid())\n  OR\n  -- 可以查看有权访问的公司的流转历史\n  company_id IN (\n    SELECT id FROM companies WHERE can_access_company_data(auth.uid(), id)\n  )\n  OR\n  -- 流转的参与者可以查看\n  from_user_id = auth.uid()\n  OR\n  to_user_id = auth.uid()\n)","-- 创建流转记录：通过transfer_company函数创建，不需要直接INSERT权限\nCREATE POLICY \\"禁止直接插入流转记录\\"\nON company_transfers\nFOR INSERT\nWITH CHECK (false)","-- 添加注释\nCOMMENT ON COLUMN companies.owner_id IS '公司当前所有者ID'","COMMENT ON TABLE company_transfers IS '公司流转历史记录表'","COMMENT ON FUNCTION transfer_company IS '公司流转函数，用于将公司从一个用户流转给另一个用户'","-- 11. 创建视图：公司流转历史（带用户信息）\nCREATE OR REPLACE VIEW company_transfer_history AS\nSELECT \n  ct.id,\n  ct.company_id,\n  c.name as company_name,\n  c.code as company_code,\n  ct.from_user_id,\n  pf.username as from_username,\n  pf.full_name as from_full_name,\n  ct.to_user_id,\n  pt.username as to_username,\n  pt.full_name as to_full_name,\n  ct.transferred_by,\n  pb.username as transferred_by_username,\n  pb.full_name as transferred_by_full_name,\n  ct.reason,\n  ct.created_at\nFROM company_transfers ct\nINNER JOIN companies c ON ct.company_id = c.id\nLEFT JOIN profiles pf ON ct.from_user_id = pf.id\nLEFT JOIN profiles pt ON ct.to_user_id = pt.id\nLEFT JOIN profiles pb ON ct.transferred_by = pb.id","-- 为视图添加RLS（继承company_transfers的策略）\nALTER VIEW company_transfer_history SET (security_invoker = true)"}	add_company_transfer_functionality
00021	{"-- ============================================\n-- 更新访问控制：用户只能查看自己和下级的数据\n-- ============================================\n\n-- 1. 创建递归函数：获取用户的所有下级ID（包括下级的下级）\nCREATE OR REPLACE FUNCTION get_all_subordinate_ids(user_id UUID)\nRETURNS TABLE(subordinate_id UUID)\nLANGUAGE sql\nSECURITY DEFINER\nSTABLE\nAS $$\n  WITH RECURSIVE subordinates AS (\n    -- 基础情况：直接下级\n    SELECT id FROM profiles WHERE manager_id = user_id\n    UNION\n    -- 递归情况：下级的下级\n    SELECT p.id \n    FROM profiles p\n    INNER JOIN subordinates s ON p.manager_id = s.id\n  )\n  SELECT id FROM subordinates;\n$$","-- 2. 更新can_access_company_data函数：用户可以访问自己和下级的公司\nCREATE OR REPLACE FUNCTION can_access_company_data(user_id UUID, target_company_id UUID)\nRETURNS BOOLEAN\nLANGUAGE plpgsql\nSECURITY DEFINER\nSTABLE\nAS $$\nDECLARE\n  company_owner UUID;\nBEGIN\n  -- 超级管理员可以访问所有公司\n  IF is_super_admin(user_id) THEN\n    RETURN TRUE;\n  END IF;\n  \n  -- 获取公司的当前所有者\n  SELECT owner_id INTO company_owner FROM companies WHERE id = target_company_id;\n  \n  IF company_owner IS NULL THEN\n    RETURN FALSE;\n  END IF;\n  \n  -- 如果是所有者本人\n  IF company_owner = user_id THEN\n    RETURN TRUE;\n  END IF;\n  \n  -- 如果所有者是当前用户的下级（递归）\n  IF EXISTS(\n    SELECT 1 FROM get_all_subordinate_ids(user_id) WHERE subordinate_id = company_owner\n  ) THEN\n    RETURN TRUE;\n  END IF;\n  \n  RETURN FALSE;\nEND;\n$$","-- 3. 更新companies表的SELECT策略\nDROP POLICY IF EXISTS \\"用户可以查看自己拥有的公司和下属拥有的公司\\" ON companies","CREATE POLICY \\"用户可以查看自己和下级拥有的公司\\"\nON companies\nFOR SELECT\nUSING (\n  -- 超级管理员可以查看所有\n  is_super_admin(auth.uid())\n  OR\n  -- 所有者是自己\n  owner_id = auth.uid()\n  OR\n  -- 所有者是自己的下级（递归）\n  owner_id IN (\n    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())\n  )\n)","-- 4. 更新companies表的UPDATE策略\nDROP POLICY IF EXISTS \\"用户可以更新自己拥有的公司\\" ON companies","CREATE POLICY \\"用户可以更新自己和下级拥有的公司\\"\nON companies\nFOR UPDATE\nUSING (\n  -- 超级管理员可以更新所有\n  is_super_admin(auth.uid())\n  OR\n  -- 所有者是自己\n  owner_id = auth.uid()\n  OR\n  -- 所有者是自己的直接下级（只允许直接下级，不递归）\n  owner_id IN (\n    SELECT id FROM profiles WHERE manager_id = auth.uid()\n  )\n)\nWITH CHECK (\n  -- 更新后仍然满足条件\n  is_super_admin(auth.uid())\n  OR\n  owner_id = auth.uid()\n  OR\n  owner_id IN (\n    SELECT id FROM profiles WHERE manager_id = auth.uid()\n  )\n)","-- 5. 更新companies表的DELETE策略\nDROP POLICY IF EXISTS \\"用户可以删除自己拥有的公司\\" ON companies","CREATE POLICY \\"用户可以删除自己拥有的公司\\"\nON companies\nFOR DELETE\nUSING (\n  -- 超级管理员可以删除所有\n  is_super_admin(auth.uid())\n  OR\n  -- 只有所有者本人可以删除\n  owner_id = auth.uid()\n)","-- 6. 更新transfer_company函数：只有所有者和直接上级可以流转\nCREATE OR REPLACE FUNCTION transfer_company(\n  p_company_id UUID,\n  p_to_user_id UUID,\n  p_reason TEXT DEFAULT NULL\n)\nRETURNS BOOLEAN\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  v_from_user_id UUID;\n  v_current_user_id UUID;\n  v_can_transfer BOOLEAN;\nBEGIN\n  -- 获取当前用户ID\n  v_current_user_id := auth.uid();\n  \n  -- 获取公司的当前所有者\n  SELECT owner_id INTO v_from_user_id FROM companies WHERE id = p_company_id;\n  \n  IF v_from_user_id IS NULL THEN\n    RAISE EXCEPTION '公司不存在';\n  END IF;\n  \n  -- 检查权限：所有者本人、所有者的直接上级、超级管理员\n  v_can_transfer := (\n    v_from_user_id = v_current_user_id  -- 所有者本人\n    OR is_super_admin(v_current_user_id)  -- 超级管理员\n    OR EXISTS(  -- 所有者的直接上级\n      SELECT 1 FROM profiles\n      WHERE id = v_from_user_id AND manager_id = v_current_user_id\n    )\n  );\n  \n  IF NOT v_can_transfer THEN\n    RAISE EXCEPTION '没有权限流转此公司';\n  END IF;\n  \n  -- 检查目标用户是否存在\n  IF NOT EXISTS(SELECT 1 FROM profiles WHERE id = p_to_user_id) THEN\n    RAISE EXCEPTION '目标用户不存在';\n  END IF;\n  \n  -- 更新公司所有者\n  UPDATE companies \n  SET owner_id = p_to_user_id, updated_at = NOW()\n  WHERE id = p_company_id;\n  \n  -- 记录流转历史\n  INSERT INTO company_transfers (\n    company_id, from_user_id, to_user_id, transferred_by, reason\n  ) VALUES (\n    p_company_id, v_from_user_id, p_to_user_id, v_current_user_id, p_reason\n  );\n  \n  RETURN TRUE;\nEND;\n$$","-- 添加注释\nCOMMENT ON FUNCTION get_all_subordinate_ids IS '递归获取用户的所有下级ID（包括下级的下级）'","COMMENT ON POLICY \\"用户可以查看自己和下级拥有的公司\\" ON companies IS '用户只能查看owner_id为自己或下级的公司'","COMMENT ON POLICY \\"用户可以更新自己和下级拥有的公司\\" ON companies IS '用户可以更新自己和直接下级拥有的公司'","COMMENT ON POLICY \\"用户可以删除自己拥有的公司\\" ON companies IS '只有所有者本人可以删除公司'"}	update_access_control_to_owner_and_subordinates
00022	{"-- ============================================\n-- 优化所有表的RLS策略，确保权限控制一致性\n-- ============================================\n\n-- ============================================\n-- 1. employees表：员工数据\n-- ============================================\n\n-- 删除冗余的SELECT策略\nDROP POLICY IF EXISTS \\"员工可以查看同公司员工\\" ON employees","DROP POLICY IF EXISTS \\"管理员可以查看所有员工\\" ON employees","DROP POLICY IF EXISTS \\"有权限的用户可以管理员工\\" ON employees","-- 保留并确认核心策略\n-- SELECT策略已存在：\\"用户可以查看有权访问的公司的员工\\"\n-- INSERT策略已存在：\\"用户可以创建有权访问的公司的员工\\"\n-- UPDATE策略已存在：\\"用户可以更新有权访问的公司的员工\\"\n-- DELETE策略已存在：\\"用户可以删除有权访问的公司的员工\\"\n\n-- ============================================\n-- 2. document_templates表：文书模板\n-- ============================================\n\n-- 删除冗余的SELECT策略\nDROP POLICY IF EXISTS \\"所有认证用户可以查看文书模板\\" ON document_templates","DROP POLICY IF EXISTS \\"有权限的用户可以管理文书模板\\" ON document_templates","-- 保留并确认核心策略\n-- SELECT策略已存在：\\"用户可以查看有权访问的公司的文书模板\\"\n-- INSERT策略已存在：\\"用户可以创建有权访问的公司的文书模板\\"\n-- UPDATE策略已存在：\\"用户可以更新有权访问的公司的文书模板\\"\n-- DELETE策略已存在：\\"用户可以删除有权访问的公司的文书模板\\"\n\n-- ============================================\n-- 3. signing_records表：签署记录\n-- ============================================\n\n-- 删除冗余的SELECT策略\nDROP POLICY IF EXISTS \\"员工可以查看相关签署记录\\" ON signing_records","DROP POLICY IF EXISTS \\"管理员可以查看所有签署记录\\" ON signing_records","DROP POLICY IF EXISTS \\"有权限的用户可以管理签署记录\\" ON signing_records","-- 保留并确认核心策略\n-- SELECT策略已存在：\\"用户可以查看有权访问的公司的签署记录\\"\n-- INSERT策略已存在：\\"用户可以创建有权访问的公司的签署记录\\"\n-- UPDATE策略已存在：\\"用户可以更新有权访问的公司的签署记录\\"\n\n-- 添加DELETE策略\nDROP POLICY IF EXISTS \\"用户可以删除有权访问的公司的签署记录\\" ON signing_records","CREATE POLICY \\"用户可以删除有权访问的公司的签署记录\\"\nON signing_records\nFOR DELETE\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  (has_permission(auth.uid(), 'document_delete') AND can_access_company_data(auth.uid(), company_id))\n  OR\n  created_by = auth.uid()\n)","-- ============================================\n-- 4. signed_documents表：已签署文书\n-- ============================================\n\n-- 检查是否存在RLS策略，如果没有则创建\nDROP POLICY IF EXISTS \\"用户可以查看有权访问的签署记录的已签署文书\\" ON signed_documents","DROP POLICY IF EXISTS \\"用户可以创建有权访问的签署记录的已签署文书\\" ON signed_documents","DROP POLICY IF EXISTS \\"用户可以更新有权访问的签署记录的已签署文书\\" ON signed_documents","DROP POLICY IF EXISTS \\"用户可以删除有权访问的签署记录的已签署文书\\" ON signed_documents","CREATE POLICY \\"用户可以查看有权访问的签署记录的已签署文书\\"\nON signed_documents\nFOR SELECT\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  EXISTS (\n    SELECT 1 FROM signing_records sr\n    WHERE sr.id = signed_documents.signing_record_id\n      AND can_access_company_data(auth.uid(), sr.company_id)\n  )\n)","CREATE POLICY \\"用户可以创建有权访问的签署记录的已签署文书\\"\nON signed_documents\nFOR INSERT\nWITH CHECK (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'document_create')\n    AND EXISTS (\n      SELECT 1 FROM signing_records sr\n      WHERE sr.id = signed_documents.signing_record_id\n        AND can_access_company_data(auth.uid(), sr.company_id)\n    )\n  )\n)","CREATE POLICY \\"用户可以更新有权访问的签署记录的已签署文书\\"\nON signed_documents\nFOR UPDATE\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'document_edit')\n    AND EXISTS (\n      SELECT 1 FROM signing_records sr\n      WHERE sr.id = signed_documents.signing_record_id\n        AND can_access_company_data(auth.uid(), sr.company_id)\n    )\n  )\n)\nWITH CHECK (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'document_edit')\n    AND EXISTS (\n      SELECT 1 FROM signing_records sr\n      WHERE sr.id = signed_documents.signing_record_id\n        AND can_access_company_data(auth.uid(), sr.company_id)\n    )\n  )\n)","CREATE POLICY \\"用户可以删除有权访问的签署记录的已签署文书\\"\nON signed_documents\nFOR DELETE\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  (\n    has_permission(auth.uid(), 'document_delete')\n    AND EXISTS (\n      SELECT 1 FROM signing_records sr\n      WHERE sr.id = signed_documents.signing_record_id\n        AND can_access_company_data(auth.uid(), sr.company_id)\n    )\n  )\n)","-- ============================================\n-- 5. notifications表：通知记录\n-- ============================================\n\n-- 通知记录的权限控制：用户可以查看自己的通知和下级的通知\nDROP POLICY IF EXISTS \\"用户可以查看自己和下级的通知\\" ON notifications","DROP POLICY IF EXISTS \\"用户可以创建通知\\" ON notifications","DROP POLICY IF EXISTS \\"用户可以更新自己和下级的通知\\" ON notifications","DROP POLICY IF EXISTS \\"用户可以删除自己和下级的通知\\" ON notifications","CREATE POLICY \\"用户可以查看自己和下级的通知\\"\nON notifications\nFOR SELECT\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  user_id = auth.uid()\n  OR\n  user_id IN (\n    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())\n  )\n)","CREATE POLICY \\"用户可以创建通知\\"\nON notifications\nFOR INSERT\nWITH CHECK (\n  is_super_admin(auth.uid())\n  OR\n  user_id = auth.uid()\n  OR\n  user_id IN (\n    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())\n  )\n)","CREATE POLICY \\"用户可以更新自己和下级的通知\\"\nON notifications\nFOR UPDATE\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  user_id = auth.uid()\n  OR\n  user_id IN (\n    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())\n  )\n)\nWITH CHECK (\n  is_super_admin(auth.uid())\n  OR\n  user_id = auth.uid()\n  OR\n  user_id IN (\n    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())\n  )\n)","CREATE POLICY \\"用户可以删除自己和下级的通知\\"\nON notifications\nFOR DELETE\nUSING (\n  is_super_admin(auth.uid())\n  OR\n  user_id = auth.uid()\n  OR\n  user_id IN (\n    SELECT subordinate_id FROM get_all_subordinate_ids(auth.uid())\n  )\n)","-- ============================================\n-- 6. reminder_configs表：提醒配置\n-- ============================================\n\n-- 提醒配置的权限控制：超级管理员可以管理\nDROP POLICY IF EXISTS \\"超级管理员可以查看所有提醒配置\\" ON reminder_configs","DROP POLICY IF EXISTS \\"超级管理员可以创建提醒配置\\" ON reminder_configs","DROP POLICY IF EXISTS \\"超级管理员可以更新提醒配置\\" ON reminder_configs","DROP POLICY IF EXISTS \\"超级管理员可以删除提醒配置\\" ON reminder_configs","CREATE POLICY \\"超级管理员可以查看所有提醒配置\\"\nON reminder_configs\nFOR SELECT\nUSING (is_super_admin(auth.uid()))","CREATE POLICY \\"超级管理员可以创建提醒配置\\"\nON reminder_configs\nFOR INSERT\nWITH CHECK (is_super_admin(auth.uid()))","CREATE POLICY \\"超级管理员可以更新提醒配置\\"\nON reminder_configs\nFOR UPDATE\nUSING (is_super_admin(auth.uid()))\nWITH CHECK (is_super_admin(auth.uid()))","CREATE POLICY \\"超级管理员可以删除提醒配置\\"\nON reminder_configs\nFOR DELETE\nUSING (is_super_admin(auth.uid()))","-- 添加注释\nCOMMENT ON POLICY \\"用户可以查看有权访问的公司的员工\\" ON employees IS '用户可以查看自己和下级拥有的公司的员工'","COMMENT ON POLICY \\"用户可以查看有权访问的公司的文书模板\\" ON document_templates IS '用户可以查看自己和下级拥有的公司的文书模板'","COMMENT ON POLICY \\"用户可以查看有权访问的公司的签署记录\\" ON signing_records IS '用户可以查看自己和下级拥有的公司的签署记录'","COMMENT ON POLICY \\"用户可以查看有权访问的签署记录的已签署文书\\" ON signed_documents IS '用户可以查看有权访问的签署记录的已签署文书'","COMMENT ON POLICY \\"用户可以查看自己和下级的通知\\" ON notifications IS '用户可以查看自己和下级的通知记录'"}	optimize_rls_policies_for_all_tables_v2
00023	{"-- ==========================================\n-- 1. 先插入缺失的角色（人事专员、人事主管、人事经理）\n-- ==========================================\n-- 人事专员 role_id = '11111111-1111-1111-1111-111111111111'\nINSERT INTO roles (id, name, description)\nVALUES ('11111111-1111-1111-1111-111111111111', '人事专员', '负责基础员工管理')\nON CONFLICT (id) DO NOTHING","-- 人事主管 role_id = '22222222-2222-2222-2222-222222222222'\nINSERT INTO roles (id, name, description)\nVALUES ('22222222-2222-2222-2222-222222222222', '人事主管', '负责员工管理审批')\nON CONFLICT (id) DO NOTHING","-- 人事经理 role_id = '33333333-3333-3333-3333-333333333333'\nINSERT INTO roles (id, name, description)\nVALUES ('33333333-3333-3333-3333-333333333333', '人事经理', '负责全面员工管理')\nON CONFLICT (id) DO NOTHING","-- 修复员工创建权限问题\n-- 为人事专员、人事主管、人事经理添加员工管理相关权限\n\n-- 人事专员权限（基础权限）\nINSERT INTO role_permissions (role_id, permission_id)\nSELECT \n  '11111111-1111-1111-1111-111111111111'::uuid,\n  id\nFROM permissions\nWHERE code IN (\n  'employee_view',      -- 员工查看\n  'employee_create',    -- 员工创建\n  'employee_edit',      -- 员工编辑\n  'employee_manage'     -- 员工录入\n)\nON CONFLICT DO NOTHING","-- 人事主管权限（增加删除和状态管理）\nINSERT INTO role_permissions (role_id, permission_id)\nSELECT \n  '22222222-2222-2222-2222-222222222222'::uuid,\n  id\nFROM permissions\nWHERE code IN (\n  'employee_view',              -- 员工查看\n  'employee_create',            -- 员工创建\n  'employee_edit',              -- 员工编辑\n  'employee_manage',            -- 员工录入\n  'employee_delete',            -- 员工删除\n  'employee_status_manage',     -- 员工状态管理\n  'employee_import'             -- 员工批量导入\n)\nON CONFLICT DO NOTHING","-- 人事经理权限（全部员工权限）\nINSERT INTO role_permissions (role_id, permission_id)\nSELECT \n  '33333333-3333-3333-3333-333333333333'::uuid,\n  id\nFROM permissions\nWHERE code IN (\n  'employee_view',              -- 员工查看\n  'employee_create',            -- 员工创建\n  'employee_edit',              -- 员工编辑\n  'employee_manage',            -- 员工录入\n  'employee_delete',            -- 员工删除\n  'employee_status_manage',     -- 员工状态管理\n  'employee_import'             -- 员工批量导入\n)\nON CONFLICT DO NOTHING","-- 为人事角色添加公司查看权限（员工创建需要选择公司）\nINSERT INTO role_permissions (role_id, permission_id)\nSELECT \n  role_id,\n  id\nFROM permissions, (\n  SELECT '11111111-1111-1111-1111-111111111111'::uuid as role_id\n  UNION ALL\n  SELECT '22222222-2222-2222-2222-222222222222'::uuid\n  UNION ALL\n  SELECT '33333333-3333-3333-3333-333333333333'::uuid\n) roles\nWHERE code = 'company_view'\nON CONFLICT DO NOTHING","-- 为人事角色添加文书相关权限\nINSERT INTO role_permissions (role_id, permission_id)\nSELECT \n  role_id,\n  id\nFROM permissions, (\n  SELECT '11111111-1111-1111-1111-111111111111'::uuid as role_id\n  UNION ALL\n  SELECT '22222222-2222-2222-2222-222222222222'::uuid\n  UNION ALL\n  SELECT '33333333-3333-3333-3333-333333333333'::uuid\n) roles\nWHERE code IN (\n  'document_view',      -- 文书查看\n  'document_initiate',  -- 文书发起\n  'template_view'       -- 文书模板查看\n)\nON CONFLICT DO NOTHING","-- 为人事主管和经理添加文书管理权限\nINSERT INTO role_permissions (role_id, permission_id)\nSELECT \n  role_id,\n  id\nFROM permissions, (\n  SELECT '22222222-2222-2222-2222-222222222222'::uuid as role_id\n  UNION ALL\n  SELECT '33333333-3333-3333-3333-333333333333'::uuid\n) roles\nWHERE code IN (\n  'document_manage',    -- 文书管理\n  'template_create',    -- 文书模板创建\n  'template_edit',      -- 文书模板编辑\n  'template_delete'     -- 文书模板删除\n)\nON CONFLICT DO NOTHING","-- 为所有人事角色添加看板和通知权限\nINSERT INTO role_permissions (role_id, permission_id)\nSELECT \n  role_id,\n  id\nFROM permissions, (\n  SELECT '11111111-1111-1111-1111-111111111111'::uuid as role_id\n  UNION ALL\n  SELECT '22222222-2222-2222-2222-222222222222'::uuid\n  UNION ALL\n  SELECT '33333333-3333-3333-3333-333333333333'::uuid\n) roles\nWHERE code IN (\n  'dashboard_view',         -- 看板\n  'notification_view',      -- 通知查看\n  'notification_manage'     -- 通知管理\n)\nON CONFLICT DO NOTHING"}	fix_employee_creation_permissions
00024	{"-- 删除员工表的邮箱字段\nALTER TABLE employees DROP COLUMN IF EXISTS email"}	remove_email_field_from_employees
00025	{"-- 将员工工号字段改为可空\n-- 因为工号是可选字段，用户可以不填写\nALTER TABLE employees ALTER COLUMN employee_number DROP NOT NULL"}	make_employee_number_nullable
00026	{"-- 修复signing_records表的RLS策略，使用正确的权限code\n-- 问题：策略使用了不存在的权限code（document_create, document_edit, document_delete）\n-- 解决：使用正确的权限code（document_initiate, document_manage）\n\n-- 1. 删除旧的INSERT策略\nDROP POLICY IF EXISTS \\"用户可以创建有权访问的公司的签署记录\\" ON signing_records","-- 2. 创建新的INSERT策略，使用正确的权限code\nCREATE POLICY \\"用户可以创建有权访问的公司的签署记录\\"\nON signing_records FOR INSERT\nTO public\nWITH CHECK (\n  is_super_admin(uid()) \n  OR (has_permission(uid(), 'document_initiate') AND can_access_company_data(uid(), company_id))\n)","-- 3. 删除旧的UPDATE策略\nDROP POLICY IF EXISTS \\"用户可以更新有权访问的公司的签署记录\\" ON signing_records","-- 4. 创建新的UPDATE策略，使用正确的权限code\nCREATE POLICY \\"用户可以更新有权访问的公司的签署记录\\"\nON signing_records FOR UPDATE\nTO public\nUSING (\n  is_super_admin(uid()) \n  OR (has_permission(uid(), 'document_manage') AND can_access_company_data(uid(), company_id))\n  OR (created_by = uid())\n)\nWITH CHECK (\n  is_super_admin(uid()) \n  OR (has_permission(uid(), 'document_manage') AND can_access_company_data(uid(), company_id))\n  OR (created_by = uid())\n)","-- 5. 删除旧的DELETE策略\nDROP POLICY IF EXISTS \\"用户可以删除有权访问的公司的签署记录\\" ON signing_records","-- 6. 创建新的DELETE策略，使用正确的权限code\nCREATE POLICY \\"用户可以删除有权访问的公司的签署记录\\"\nON signing_records FOR DELETE\nTO public\nUSING (\n  is_super_admin(uid()) \n  OR (has_permission(uid(), 'document_manage') AND can_access_company_data(uid(), company_id))\n  OR (created_by = uid())\n)"}	fix_signing_records_rls_permission_codes
00027	{"-- 为有user_view权限的用户添加查看所有用户的策略\nCREATE POLICY \\"有user_view权限的用户可以查看所有用户\\"\nON profiles\nFOR SELECT\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  has_permission(uid(), 'user_view')\n)","-- 删除旧的策略（因为新策略已经包含了超级管理员的权限）\nDROP POLICY IF EXISTS \\"超级管理员可以查看所有用户\\" ON profiles","DROP POLICY IF EXISTS \\"用户可以查看自己的资料\\" ON profiles"}	add_profiles_select_policy_for_user_view_permission
00028	{"-- 创建函数：检查用户是否可以访问某个用户的数据（包括自己和下级）\nCREATE OR REPLACE FUNCTION can_access_user_data(accessing_user_id uuid, target_user_id uuid)\nRETURNS boolean\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nBEGIN\n  -- 超级管理员可以访问所有数据\n  IF is_super_admin(accessing_user_id) THEN\n    RETURN true;\n  END IF;\n  \n  -- 可以访问自己的数据\n  IF accessing_user_id = target_user_id THEN\n    RETURN true;\n  END IF;\n  \n  -- 可以访问下级的数据\n  IF target_user_id IN (SELECT subordinate_id FROM get_subordinates(accessing_user_id)) THEN\n    RETURN true;\n  END IF;\n  \n  RETURN false;\nEND;\n$$","-- 创建函数：获取用户可以访问的所有用户ID（包括自己和下级）\nCREATE OR REPLACE FUNCTION get_accessible_users(user_id uuid)\nRETURNS TABLE(accessible_user_id uuid)\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nBEGIN\n  RETURN QUERY\n  -- 自己\n  SELECT user_id\n  UNION\n  -- 所有下级\n  SELECT subordinate_id FROM get_subordinates(user_id);\nEND;\n$$","-- 注释\nCOMMENT ON FUNCTION can_access_user_data IS '检查用户是否可以访问目标用户的数据（包括自己和下级）'","COMMENT ON FUNCTION get_accessible_users IS '获取用户可以访问的所有用户ID列表（包括自己和下级）'"}	add_data_access_functions_for_subordinates
00029	{"-- 删除旧的companies表SELECT策略\nDROP POLICY IF EXISTS \\"用户可以查看自己负责的公司\\" ON companies","DROP POLICY IF EXISTS \\"超级管理员可以查看所有公司\\" ON companies","DROP POLICY IF EXISTS \\"有company_view权限的用户可以查看所有公司\\" ON companies","-- 创建新的SELECT策略：可以查看自己和下级负责的公司\nCREATE POLICY \\"用户可以查看自己和下级负责的公司\\"\nON companies\nFOR SELECT\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'company_view') AND \n   owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid())))\n)","-- 删除旧的UPDATE策略\nDROP POLICY IF EXISTS \\"用户可以更新自己负责的公司\\" ON companies","DROP POLICY IF EXISTS \\"超级管理员可以更新所有公司\\" ON companies","-- 创建新的UPDATE策略：可以更新自己和下级负责的公司\nCREATE POLICY \\"用户可以更新自己和下级负责的公司\\"\nON companies\nFOR UPDATE\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'company_edit') AND \n   owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid())))\n)","-- 删除旧的DELETE策略\nDROP POLICY IF EXISTS \\"超级管理员可以删除公司\\" ON companies","-- 创建新的DELETE策略：超级管理员或有权限的用户可以删除自己和下级负责的公司\nCREATE POLICY \\"用户可以删除自己和下级负责的公司\\"\nON companies\nFOR DELETE\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'company_delete') AND \n   owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid())))\n)","-- INSERT策略保持不变\nDROP POLICY IF EXISTS \\"用户可以创建公司\\" ON companies","CREATE POLICY \\"用户可以创建公司\\"\nON companies\nFOR INSERT\nTO authenticated\nWITH CHECK (\n  is_super_admin(uid()) OR\n  has_permission(uid(), 'company_create')\n)"}	update_companies_rls_for_subordinate_access_fixed
00030	{"-- 删除旧的employees表SELECT策略\nDROP POLICY IF EXISTS \\"用户可以查看所有员工\\" ON employees","DROP POLICY IF EXISTS \\"超级管理员可以查看所有员工\\" ON employees","-- 创建新的SELECT策略：可以查看自己和下级负责的公司的员工\nCREATE POLICY \\"用户可以查看自己和下级负责的公司的员工\\"\nON employees\nFOR SELECT\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'employee_view') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)","-- 删除旧的UPDATE策略\nDROP POLICY IF EXISTS \\"用户可以更新员工\\" ON employees","DROP POLICY IF EXISTS \\"超级管理员可以更新所有员工\\" ON employees","-- 创建新的UPDATE策略\nCREATE POLICY \\"用户可以更新自己和下级负责的公司的员工\\"\nON employees\nFOR UPDATE\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'employee_edit') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)","-- 删除旧的DELETE策略\nDROP POLICY IF EXISTS \\"超级管理员可以删除员工\\" ON employees","-- 创建新的DELETE策略\nCREATE POLICY \\"用户可以删除自己和下级负责的公司的员工\\"\nON employees\nFOR DELETE\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'employee_delete') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)","-- INSERT策略\nDROP POLICY IF EXISTS \\"用户可以创建员工\\" ON employees","CREATE POLICY \\"用户可以创建员工\\"\nON employees\nFOR INSERT\nTO authenticated\nWITH CHECK (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'employee_create') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)"}	update_employees_rls_for_subordinate_access
00031	{"-- 删除旧的document_templates表SELECT策略\nDROP POLICY IF EXISTS \\"用户可以查看所有文书模板\\" ON document_templates","DROP POLICY IF EXISTS \\"超级管理员可以查看所有文书模板\\" ON document_templates","-- 创建新的SELECT策略\nCREATE POLICY \\"用户可以查看自己和下级负责的公司的文书模板\\"\nON document_templates\nFOR SELECT\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'template_view') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)","-- UPDATE策略\nDROP POLICY IF EXISTS \\"用户可以更新文书模板\\" ON document_templates","CREATE POLICY \\"用户可以更新自己和下级负责的公司的文书模板\\"\nON document_templates\nFOR UPDATE\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'template_edit') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)","-- DELETE策略\nDROP POLICY IF EXISTS \\"用户可以删除文书模板\\" ON document_templates","CREATE POLICY \\"用户可以删除自己和下级负责的公司的文书模板\\"\nON document_templates\nFOR DELETE\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'template_delete') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)","-- INSERT策略\nDROP POLICY IF EXISTS \\"用户可以创建文书模板\\" ON document_templates","CREATE POLICY \\"用户可以创建文书模板\\"\nON document_templates\nFOR INSERT\nTO authenticated\nWITH CHECK (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'template_create') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)"}	update_document_templates_rls_for_subordinate_access
00032	{"-- 删除旧的signing_records表SELECT策略\nDROP POLICY IF EXISTS \\"用户可以查看所有签署记录\\" ON signing_records","DROP POLICY IF EXISTS \\"超级管理员可以查看所有签署记录\\" ON signing_records","-- 创建新的SELECT策略\nCREATE POLICY \\"用户可以查看自己和下级负责的公司的签署记录\\"\nON signing_records\nFOR SELECT\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'document_view') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)","-- UPDATE策略\nDROP POLICY IF EXISTS \\"用户可以更新签署记录\\" ON signing_records","CREATE POLICY \\"用户可以更新自己和下级负责的公司的签署记录\\"\nON signing_records\nFOR UPDATE\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'document_manage') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)","-- DELETE策略\nDROP POLICY IF EXISTS \\"用户可以删除签署记录\\" ON signing_records","CREATE POLICY \\"用户可以删除自己和下级负责的公司的签署记录\\"\nON signing_records\nFOR DELETE\nTO authenticated\nUSING (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'document_manage') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)","-- INSERT策略\nDROP POLICY IF EXISTS \\"用户可以创建签署记录\\" ON signing_records","CREATE POLICY \\"用户可以创建签署记录\\"\nON signing_records\nFOR INSERT\nTO authenticated\nWITH CHECK (\n  is_super_admin(uid()) OR\n  (has_permission(uid(), 'document_initiate') AND \n   company_id IN (\n     SELECT id FROM companies \n     WHERE owner_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n   ))\n)"}	update_signing_records_rls_for_subordinate_access
00034	{"-- 创建操作类型枚举\nCREATE TYPE operation_type AS ENUM (\n  'login',              -- 登录\n  'logout',             -- 登出\n  'company_create',     -- 创建公司\n  'company_update',     -- 更新公司\n  'company_delete',     -- 删除公司\n  'company_transfer',   -- 流转公司\n  'employee_create',    -- 创建员工\n  'employee_update',    -- 更新员工\n  'employee_delete',    -- 删除员工\n  'employee_import',    -- 导入员工\n  'template_create',    -- 创建文书模板\n  'template_update',    -- 更新文书模板\n  'template_delete',    -- 删除文书模板\n  'signing_initiate',   -- 发起签署\n  'signing_employee',   -- 员工签署\n  'signing_company',    -- 公司签署\n  'user_create',        -- 创建用户\n  'user_update',        -- 更新用户\n  'user_delete',        -- 删除用户\n  'role_create',        -- 创建角色\n  'role_update',        -- 更新角色\n  'role_delete',        -- 删除角色\n  'permission_assign',  -- 分配权限\n  'config_update',      -- 更新配置\n  'notification_send'   -- 发送通知\n)","-- 创建操作日志表\nCREATE TABLE operation_logs (\n  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,\n  operation_type operation_type NOT NULL,\n  operation_detail text NOT NULL,\n  target_type text,\n  target_id uuid,\n  ip_address text,\n  user_agent text,\n  created_at timestamptz DEFAULT now()\n)","-- 创建索引\nCREATE INDEX idx_operation_logs_user_id ON operation_logs(user_id)","CREATE INDEX idx_operation_logs_operation_type ON operation_logs(operation_type)","CREATE INDEX idx_operation_logs_created_at ON operation_logs(created_at DESC)","CREATE INDEX idx_operation_logs_target ON operation_logs(target_type, target_id)","-- 添加注释\nCOMMENT ON TABLE operation_logs IS '操作日志表'","COMMENT ON COLUMN operation_logs.user_id IS '操作用户ID'","COMMENT ON COLUMN operation_logs.operation_type IS '操作类型'","COMMENT ON COLUMN operation_logs.operation_detail IS '操作详情'","COMMENT ON COLUMN operation_logs.target_type IS '目标对象类型（如company、employee等）'","COMMENT ON COLUMN operation_logs.target_id IS '目标对象ID'","COMMENT ON COLUMN operation_logs.ip_address IS 'IP地址'","COMMENT ON COLUMN operation_logs.user_agent IS '用户代理'","COMMENT ON COLUMN operation_logs.created_at IS '操作时间'","-- RLS策略\nALTER TABLE operation_logs ENABLE ROW LEVEL SECURITY","-- 超级管理员可以查看所有日志\nCREATE POLICY \\"超级管理员可以查看所有操作日志\\"\nON operation_logs\nFOR SELECT\nTO authenticated\nUSING (is_super_admin(uid()))","-- 用户可以查看自己和下级的操作日志\nCREATE POLICY \\"用户可以查看自己和下级的操作日志\\"\nON operation_logs\nFOR SELECT\nTO authenticated\nUSING (\n  has_permission(uid(), 'system_config_view') AND\n  user_id IN (SELECT accessible_user_id FROM get_accessible_users(uid()))\n)","-- 所有认证用户都可以插入日志（系统自动记录）\nCREATE POLICY \\"认证用户可以创建操作日志\\"\nON operation_logs\nFOR INSERT\nTO authenticated\nWITH CHECK (user_id = uid())"}	create_operation_logs_table
00035	{"-- 创建记录操作日志的函数\nCREATE OR REPLACE FUNCTION log_operation(\n  p_operation_type operation_type,\n  p_operation_detail text,\n  p_target_type text DEFAULT NULL,\n  p_target_id uuid DEFAULT NULL,\n  p_ip_address text DEFAULT NULL,\n  p_user_agent text DEFAULT NULL\n)\nRETURNS uuid\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  v_log_id uuid;\nBEGIN\n  INSERT INTO operation_logs (\n    user_id,\n    operation_type,\n    operation_detail,\n    target_type,\n    target_id,\n    ip_address,\n    user_agent\n  ) VALUES (\n    uid(),\n    p_operation_type,\n    p_operation_detail,\n    p_target_type,\n    p_target_id,\n    p_ip_address,\n    p_user_agent\n  )\n  RETURNING id INTO v_log_id;\n  \n  RETURN v_log_id;\nEND;\n$$","COMMENT ON FUNCTION log_operation IS '记录操作日志'"}	create_log_operation_function
00036	{"-- 创建通用的审计触发器函数\nCREATE OR REPLACE FUNCTION audit_trigger_function()\nRETURNS TRIGGER\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  v_operation_type operation_type;\n  v_operation_detail text;\n  v_target_type text;\nBEGIN\n  -- 确定操作类型\n  v_target_type := TG_TABLE_NAME;\n  \n  IF TG_OP = 'INSERT' THEN\n    CASE TG_TABLE_NAME\n      WHEN 'companies' THEN\n        v_operation_type := 'company_create';\n        v_operation_detail := format('创建公司: %s (编码: %s)', NEW.name, NEW.code);\n      WHEN 'employees' THEN\n        v_operation_type := 'employee_create';\n        v_operation_detail := format('创建员工: %s (工号: %s)', NEW.name, NEW.employee_number);\n      WHEN 'document_templates' THEN\n        v_operation_type := 'template_create';\n        v_operation_detail := format('创建文书模板: %s', NEW.name);\n      WHEN 'signing_records' THEN\n        v_operation_type := 'signing_initiate';\n        v_operation_detail := format('发起签署记录: %s', NEW.id);\n      WHEN 'roles' THEN\n        v_operation_type := 'role_create';\n        v_operation_detail := format('创建角色: %s', NEW.name);\n      ELSE\n        RETURN NEW;\n    END CASE;\n    \n    PERFORM log_operation(v_operation_type, v_operation_detail, v_target_type, NEW.id);\n    \n  ELSIF TG_OP = 'UPDATE' THEN\n    CASE TG_TABLE_NAME\n      WHEN 'companies' THEN\n        v_operation_type := 'company_update';\n        v_operation_detail := format('更新公司: %s', NEW.name);\n      WHEN 'employees' THEN\n        v_operation_type := 'employee_update';\n        v_operation_detail := format('更新员工: %s', NEW.name);\n      WHEN 'document_templates' THEN\n        v_operation_type := 'template_update';\n        v_operation_detail := format('更新文书模板: %s', NEW.name);\n      WHEN 'signing_records' THEN\n        -- 检查是员工签署还是公司签署\n        IF NEW.employee_signed_at IS NOT NULL AND OLD.employee_signed_at IS NULL THEN\n          v_operation_type := 'signing_employee';\n          v_operation_detail := format('员工签署: %s', NEW.id);\n        ELSIF NEW.company_signed_at IS NOT NULL AND OLD.company_signed_at IS NULL THEN\n          v_operation_type := 'signing_company';\n          v_operation_detail := format('公司签署: %s', NEW.id);\n        ELSE\n          v_operation_type := 'signing_initiate';\n          v_operation_detail := format('更新签署记录: %s', NEW.id);\n        END IF;\n      WHEN 'roles' THEN\n        v_operation_type := 'role_update';\n        v_operation_detail := format('更新角色: %s', NEW.name);\n      ELSE\n        RETURN NEW;\n    END CASE;\n    \n    PERFORM log_operation(v_operation_type, v_operation_detail, v_target_type, NEW.id);\n    \n  ELSIF TG_OP = 'DELETE' THEN\n    CASE TG_TABLE_NAME\n      WHEN 'companies' THEN\n        v_operation_type := 'company_delete';\n        v_operation_detail := format('删除公司: %s', OLD.name);\n      WHEN 'employees' THEN\n        v_operation_type := 'employee_delete';\n        v_operation_detail := format('删除员工: %s', OLD.name);\n      WHEN 'document_templates' THEN\n        v_operation_type := 'template_delete';\n        v_operation_detail := format('删除文书模板: %s', OLD.name);\n      WHEN 'roles' THEN\n        v_operation_type := 'role_delete';\n        v_operation_detail := format('删除角色: %s', OLD.name);\n      ELSE\n        RETURN OLD;\n    END CASE;\n    \n    PERFORM log_operation(v_operation_type, v_operation_detail, v_target_type, OLD.id);\n  END IF;\n  \n  IF TG_OP = 'DELETE' THEN\n    RETURN OLD;\n  ELSE\n    RETURN NEW;\n  END IF;\nEND;\n$$","-- 为companies表创建触发器\nCREATE TRIGGER companies_audit_trigger\nAFTER INSERT OR UPDATE OR DELETE ON companies\nFOR EACH ROW\nEXECUTE FUNCTION audit_trigger_function()","-- 为employees表创建触发器\nCREATE TRIGGER employees_audit_trigger\nAFTER INSERT OR UPDATE OR DELETE ON employees\nFOR EACH ROW\nEXECUTE FUNCTION audit_trigger_function()","-- 为document_templates表创建触发器\nCREATE TRIGGER document_templates_audit_trigger\nAFTER INSERT OR UPDATE OR DELETE ON document_templates\nFOR EACH ROW\nEXECUTE FUNCTION audit_trigger_function()","-- 为signing_records表创建触发器\nCREATE TRIGGER signing_records_audit_trigger\nAFTER INSERT OR UPDATE OR DELETE ON signing_records\nFOR EACH ROW\nEXECUTE FUNCTION audit_trigger_function()","-- 为roles表创建触发器\nCREATE TRIGGER roles_audit_trigger\nAFTER INSERT OR UPDATE OR DELETE ON roles\nFOR EACH ROW\nEXECUTE FUNCTION audit_trigger_function()","COMMENT ON FUNCTION audit_trigger_function IS '审计触发器函数，自动记录数据变更日志'"}	create_audit_triggers_for_main_tables
00037	{"-- 删除旧的transfer_company函数\nDROP FUNCTION IF EXISTS transfer_company(uuid, uuid, text)","-- 重新创建transfer_company函数，确保正确引用auth.uid()\nCREATE OR REPLACE FUNCTION transfer_company(\n  p_company_id UUID,\n  p_to_user_id UUID,\n  p_reason TEXT DEFAULT NULL\n)\nRETURNS BOOLEAN\nLANGUAGE plpgsql\nSECURITY DEFINER\nSET search_path = public, auth\nAS $$\nDECLARE\n  v_from_user_id UUID;\n  v_current_user_id UUID;\n  v_can_transfer BOOLEAN;\nBEGIN\n  -- 获取当前用户ID\n  v_current_user_id := auth.uid();\n  \n  -- 获取公司的当前所有者\n  SELECT owner_id INTO v_from_user_id FROM companies WHERE id = p_company_id;\n  \n  IF v_from_user_id IS NULL THEN\n    RAISE EXCEPTION '公司不存在';\n  END IF;\n  \n  -- 检查权限：所有者本人、所有者的直接上级、超级管理员\n  v_can_transfer := (\n    v_from_user_id = v_current_user_id  -- 所有者本人\n    OR is_super_admin(v_current_user_id)  -- 超级管理员\n    OR EXISTS(  -- 所有者的直接上级\n      SELECT 1 FROM profiles\n      WHERE id = v_from_user_id AND manager_id = v_current_user_id\n    )\n  );\n  \n  IF NOT v_can_transfer THEN\n    RAISE EXCEPTION '没有权限流转此公司';\n  END IF;\n  \n  -- 检查目标用户是否存在\n  IF NOT EXISTS(SELECT 1 FROM profiles WHERE id = p_to_user_id) THEN\n    RAISE EXCEPTION '目标用户不存在';\n  END IF;\n  \n  -- 更新公司所有者\n  UPDATE companies \n  SET owner_id = p_to_user_id, updated_at = NOW()\n  WHERE id = p_company_id;\n  \n  -- 记录流转历史\n  INSERT INTO company_transfers (\n    company_id, from_user_id, to_user_id, transferred_by, reason\n  ) VALUES (\n    p_company_id, v_from_user_id, p_to_user_id, v_current_user_id, p_reason\n  );\n  \n  -- 记录操作日志\n  PERFORM log_operation(\n    'company_transfer'::operation_type,\n    format('流转公司给用户: %s，原因: %s', p_to_user_id, COALESCE(p_reason, '无')),\n    'company',\n    p_company_id\n  );\n  \n  RETURN TRUE;\nEND;\n$$","COMMENT ON FUNCTION transfer_company IS '流转公司给其他用户'"}	fix_transfer_company_uid_function
00038	{"-- 删除旧的log_operation函数\nDROP FUNCTION IF EXISTS log_operation(operation_type, text, text, uuid, text, text)","-- 重新创建log_operation函数，添加search_path\nCREATE OR REPLACE FUNCTION log_operation(\n  p_operation_type operation_type,\n  p_operation_detail text,\n  p_target_type text DEFAULT NULL,\n  p_target_id uuid DEFAULT NULL,\n  p_ip_address text DEFAULT NULL,\n  p_user_agent text DEFAULT NULL\n)\nRETURNS uuid\nLANGUAGE plpgsql\nSECURITY DEFINER\nSET search_path = public, auth\nAS $$\nDECLARE\n  v_log_id uuid;\nBEGIN\n  INSERT INTO operation_logs (\n    user_id,\n    operation_type,\n    operation_detail,\n    target_type,\n    target_id,\n    ip_address,\n    user_agent\n  ) VALUES (\n    auth.uid(),  -- 使用auth.uid()更明确\n    p_operation_type,\n    p_operation_detail,\n    p_target_type,\n    p_target_id,\n    p_ip_address,\n    p_user_agent\n  )\n  RETURNING id INTO v_log_id;\n  \n  RETURN v_log_id;\nEND;\n$$","COMMENT ON FUNCTION log_operation IS '记录操作日志'"}	fix_log_operation_search_path
00039	{"-- 为signing_records表添加表单数据字段\nALTER TABLE signing_records\nADD COLUMN IF NOT EXISTS employee_form_data JSONB DEFAULT NULL,\nADD COLUMN IF NOT EXISTS company_form_data JSONB DEFAULT NULL","COMMENT ON COLUMN signing_records.employee_form_data IS '员工表单数据（JSON格式）：姓名、身份证、手机、邮箱、部门、岗位、入职日期、合同期限等'","COMMENT ON COLUMN signing_records.company_form_data IS '公司表单数据（JSON格式）：公司名称、统一信用代码、地址、联系人、联系电话、法定代表人等'"}	add_signing_form_data_fields
00040	{"-- 创建签署模式枚举类型\nDO $$ BEGIN\n  CREATE TYPE signing_mode AS ENUM ('electronic', 'offline');\nEXCEPTION\n  WHEN duplicate_object THEN null;\nEND $$","-- 为signing_records表添加签署模式和上传相关字段\nALTER TABLE signing_records\nADD COLUMN IF NOT EXISTS signing_mode signing_mode DEFAULT 'electronic',\nADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ DEFAULT NULL,\nADD COLUMN IF NOT EXISTS uploaded_by TEXT DEFAULT NULL","COMMENT ON COLUMN signing_records.signing_mode IS '签署模式：electronic=电子签，offline=线下签署'","COMMENT ON COLUMN signing_records.uploaded_at IS '附件上传时间'","COMMENT ON COLUMN signing_records.uploaded_by IS '附件上传人ID'","-- 创建索引\nCREATE INDEX IF NOT EXISTS idx_signing_records_mode ON signing_records(signing_mode)","CREATE INDEX IF NOT EXISTS idx_signing_records_uploaded_at ON signing_records(uploaded_at)"}	add_signing_mode_and_upload_fields
00041	{"-- 创建已签署文档存储桶\nINSERT INTO storage.buckets (id, name, public)\nVALUES ('signed-documents', 'signed-documents', true)\nON CONFLICT (id) DO NOTHING","-- 删除旧策略（如果存在）\nDROP POLICY IF EXISTS \\"允许认证用户上传已签署文档\\" ON storage.objects","DROP POLICY IF EXISTS \\"允许所有人查看已签署文档\\" ON storage.objects","DROP POLICY IF EXISTS \\"允许认证用户删除自己上传的文档\\" ON storage.objects","-- 设置存储策略：允许认证用户上传\nCREATE POLICY \\"允许认证用户上传已签署文档\\"\nON storage.objects FOR INSERT\nTO authenticated\nWITH CHECK (bucket_id = 'signed-documents')","-- 设置存储策略：允许所有人查看已签署文档\nCREATE POLICY \\"允许所有人查看已签署文档\\"\nON storage.objects FOR SELECT\nTO public\nUSING (bucket_id = 'signed-documents')","-- 设置存储策略：允许认证用户删除自己上传的文档\nCREATE POLICY \\"允许认证用户删除自己上传的文档\\"\nON storage.objects FOR DELETE\nTO authenticated\nUSING (bucket_id = 'signed-documents' AND owner::text = auth.uid()::text)"}	create_signed_documents_bucket_v3
00042	{"-- 为employees表添加address字段\nALTER TABLE employees ADD COLUMN IF NOT EXISTS address TEXT","-- 添加注释\nCOMMENT ON COLUMN employees.address IS '员工住址'"}	add_address_to_employees
00043	{"-- 添加缺失的权限\n\n-- AI助手权限\nINSERT INTO permissions (code, name, description) VALUES\n('ai_assistant_use', 'AI助手使用', '使用AI助手功能')\nON CONFLICT (code) DO NOTHING","-- 招聘数据查询权限\nINSERT INTO permissions (code, name, description) VALUES\n('recruitment_query_view', '招聘数据查看', '查看招聘数据查询结果'),\n('recruitment_query_export', '招聘数据导出', '导出招聘数据')\nON CONFLICT (code) DO NOTHING","-- 实名认证权限\nINSERT INTO permissions (code, name, description) VALUES\n('identity_verification_manage', '实名认证管理', '管理实名认证'),\n('identity_verification_view', '实名认证查看', '查看实名认证记录')\nON CONFLICT (code) DO NOTHING","-- 操作日志权限\nINSERT INTO permissions (code, name, description) VALUES\n('audit_log_view', '操作日志查看', '查看系统操作日志'),\n('audit_log_export', '操作日志导出', '导出操作日志数据')\nON CONFLICT (code) DO NOTHING"}	add_missing_permissions
00044	{"-- 为预设角色配置权限\n\n-- 1. 人事经理：拥有除系统配置外的所有权限\nDO $$\nDECLARE\n  hr_manager_role_id UUID;\nBEGIN\n  -- 获取人事经理角色ID\n  SELECT id INTO hr_manager_role_id FROM roles WHERE name = '人事经理' LIMIT 1;\n  \n  IF hr_manager_role_id IS NOT NULL THEN\n    -- 删除现有权限\n    DELETE FROM role_permissions WHERE role_id = hr_manager_role_id;\n    \n    -- 添加权限（除了系统配置相关）\n    INSERT INTO role_permissions (role_id, permission_id)\n    SELECT hr_manager_role_id, id FROM permissions \n    WHERE code NOT IN (\n      'system_config', 'system_config_edit', 'system_config_view',\n      'esign_config', 'reminder_config',\n      'role_create', 'role_delete', 'role_edit'\n    );\n  END IF;\nEND $$","-- 2. 人事主管：拥有员工管理、文书管理、下属管理权限\nDO $$\nDECLARE\n  hr_supervisor_role_id UUID;\nBEGIN\n  SELECT id INTO hr_supervisor_role_id FROM roles WHERE name = '人事主管' LIMIT 1;\n  \n  IF hr_supervisor_role_id IS NOT NULL THEN\n    DELETE FROM role_permissions WHERE role_id = hr_supervisor_role_id;\n    \n    INSERT INTO role_permissions (role_id, permission_id)\n    SELECT hr_supervisor_role_id, id FROM permissions \n    WHERE code IN (\n      -- 员工管理\n      'employee_view', 'employee_create', 'employee_edit', 'employee_delete',\n      'employee_manage', 'employee_status_manage', 'employee_import',\n      -- 文书管理\n      'template_view', 'document_view', 'document_initiate', 'document_manage',\n      'signing_status_view', 'signed_file_download',\n      -- 下属管理\n      'subordinate_manage',\n      -- 通知\n      'notification_view', 'notification_send',\n      -- 看板\n      'dashboard_view',\n      -- 数据统计\n      'statistics_view', 'report_export'\n    );\n  END IF;\nEND $$","-- 3. 人事专员：拥有基础的员工和文书查看、操作权限\nDO $$\nDECLARE\n  hr_specialist_role_id UUID;\nBEGIN\n  SELECT id INTO hr_specialist_role_id FROM roles WHERE name = '人事专员' LIMIT 1;\n  \n  IF hr_specialist_role_id IS NOT NULL THEN\n    DELETE FROM role_permissions WHERE role_id = hr_specialist_role_id;\n    \n    INSERT INTO role_permissions (role_id, permission_id)\n    SELECT hr_specialist_role_id, id FROM permissions \n    WHERE code IN (\n      -- 员工管理（查看和创建）\n      'employee_view', 'employee_create', 'employee_manage',\n      -- 文书管理（查看和发起）\n      'template_view', 'document_view', 'document_initiate',\n      'signing_status_view', 'signed_file_download',\n      -- 通知\n      'notification_view',\n      -- 看板\n      'dashboard_view'\n    );\n  END IF;\nEND $$","-- 4. 系统管理员：拥有所有系统配置和管理权限\nDO $$\nDECLARE\n  sys_admin_role_id UUID;\nBEGIN\n  SELECT id INTO sys_admin_role_id FROM roles WHERE name = '系统管理员' LIMIT 1;\n  \n  IF sys_admin_role_id IS NOT NULL THEN\n    DELETE FROM role_permissions WHERE role_id = sys_admin_role_id;\n    \n    INSERT INTO role_permissions (role_id, permission_id)\n    SELECT sys_admin_role_id, id FROM permissions \n    WHERE code IN (\n      -- 系统配置\n      'system_config', 'system_config_edit', 'system_config_view',\n      'esign_config', 'reminder_config',\n      -- 角色权限\n      'role_view', 'role_create', 'role_edit', 'role_delete',\n      'role_permission_manage', 'role_assign',\n      -- 用户管理\n      'user_view', 'user_create', 'user_edit', 'user_delete', 'user_manage',\n      -- 公司管理\n      'company_view', 'company_create', 'company_edit', 'company_delete',\n      'company_manage', 'company_service_status_manage',\n      -- 操作日志\n      'audit_log_view', 'audit_log_export',\n      -- 通知管理\n      'notification_view', 'notification_send', 'notification_manage',\n      -- 看板\n      'dashboard_view',\n      -- 数据统计\n      'statistics_view', 'report_export'\n    );\n  END IF;\nEND $$","-- 5. 财务专员：拥有查看权限和报表导出\nDO $$\nDECLARE\n  finance_role_id UUID;\nBEGIN\n  SELECT id INTO finance_role_id FROM roles WHERE name = '财务专员' LIMIT 1;\n  \n  IF finance_role_id IS NOT NULL THEN\n    DELETE FROM role_permissions WHERE role_id = finance_role_id;\n    \n    INSERT INTO role_permissions (role_id, permission_id)\n    SELECT finance_role_id, id FROM permissions \n    WHERE code IN (\n      -- 查看权限\n      'employee_view', 'company_view',\n      'document_view', 'signing_status_view',\n      -- 数据统计\n      'dashboard_view', 'statistics_view', 'report_export',\n      -- 通知\n      'notification_view'\n    );\n  END IF;\nEND $$"}	configure_preset_role_permissions
00045	{"-- 创建工资结构模板表\nCREATE TABLE IF NOT EXISTS salary_structure_templates (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  name TEXT NOT NULL,\n  description TEXT,\n  fields JSONB NOT NULL, -- 工资结构字段定义，例如：[{\\"name\\": \\"基本工资\\", \\"code\\": \\"base_salary\\", \\"type\\": \\"number\\"}, ...]\n  is_default BOOLEAN DEFAULT false, -- 是否为默认模板\n  created_by UUID REFERENCES auth.users(id),\n  created_at TIMESTAMPTZ DEFAULT now(),\n  updated_at TIMESTAMPTZ DEFAULT now()\n)","COMMENT ON TABLE salary_structure_templates IS '工资结构模板表'","COMMENT ON COLUMN salary_structure_templates.fields IS '工资结构字段定义JSON'","-- 创建工资记录表（每月的工资表）\nCREATE TABLE IF NOT EXISTS salary_records (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  template_id UUID REFERENCES salary_structure_templates(id) ON DELETE SET NULL,\n  year INTEGER NOT NULL, -- 年份\n  month INTEGER NOT NULL, -- 月份\n  file_name TEXT, -- 上传的文件名\n  file_url TEXT, -- 上传的文件URL\n  total_amount DECIMAL(15, 2), -- 总金额\n  employee_count INTEGER, -- 员工数量\n  status TEXT DEFAULT 'pending', -- 状态：pending（待处理）、processed（已处理）、sent（已发送）\n  uploaded_by UUID REFERENCES auth.users(id),\n  created_at TIMESTAMPTZ DEFAULT now(),\n  updated_at TIMESTAMPTZ DEFAULT now(),\n  UNIQUE(company_id, year, month)\n)","COMMENT ON TABLE salary_records IS '工资记录表'","-- 创建工资条明细表\nCREATE TABLE IF NOT EXISTS salary_items (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  salary_record_id UUID NOT NULL REFERENCES salary_records(id) ON DELETE CASCADE,\n  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,\n  employee_name TEXT NOT NULL,\n  employee_number TEXT, -- 身份证号码\n  data JSONB NOT NULL, -- 工资明细数据，例如：{\\"base_salary\\": 5000, \\"bonus\\": 1000, ...}\n  total_amount DECIMAL(15, 2) NOT NULL, -- 实发工资\n  is_sent BOOLEAN DEFAULT false, -- 是否已发送给员工\n  sent_at TIMESTAMPTZ, -- 发送时间\n  is_viewed BOOLEAN DEFAULT false, -- 员工是否已查看\n  viewed_at TIMESTAMPTZ, -- 查看时间\n  created_at TIMESTAMPTZ DEFAULT now(),\n  updated_at TIMESTAMPTZ DEFAULT now()\n)","COMMENT ON TABLE salary_items IS '工资条明细表'","-- 创建索引\nCREATE INDEX IF NOT EXISTS idx_salary_structure_templates_company ON salary_structure_templates(company_id)","CREATE INDEX IF NOT EXISTS idx_salary_records_company ON salary_records(company_id)","CREATE INDEX IF NOT EXISTS idx_salary_records_year_month ON salary_records(year, month)","CREATE INDEX IF NOT EXISTS idx_salary_items_record ON salary_items(salary_record_id)","CREATE INDEX IF NOT EXISTS idx_salary_items_employee ON salary_items(employee_id)","-- 添加RLS策略\nALTER TABLE salary_structure_templates ENABLE ROW LEVEL SECURITY","ALTER TABLE salary_records ENABLE ROW LEVEL SECURITY","ALTER TABLE salary_items ENABLE ROW LEVEL SECURITY","-- 工资结构模板策略\nCREATE POLICY \\"用户可以查看所属公司的工资结构模板\\" ON salary_structure_templates\n  FOR SELECT USING (\n    company_id IN (\n      SELECT company_id FROM auth.users WHERE id = auth.uid()\n    )\n  )","CREATE POLICY \\"用户可以创建工资结构模板\\" ON salary_structure_templates\n  FOR INSERT WITH CHECK (\n    company_id IN (\n      SELECT company_id FROM auth.users WHERE id = auth.uid()\n    )\n  )","CREATE POLICY \\"用户可以更新工资结构模板\\" ON salary_structure_templates\n  FOR UPDATE USING (\n    company_id IN (\n      SELECT company_id FROM auth.users WHERE id = auth.uid()\n    )\n  )","CREATE POLICY \\"用户可以删除工资结构模板\\" ON salary_structure_templates\n  FOR DELETE USING (\n    company_id IN (\n      SELECT company_id FROM auth.users WHERE id = auth.uid()\n    )\n  )","-- 工资记录策略\nCREATE POLICY \\"用户可以查看所属公司的工资记录\\" ON salary_records\n  FOR SELECT USING (\n    company_id IN (\n      SELECT company_id FROM auth.users WHERE id = auth.uid()\n    )\n  )","CREATE POLICY \\"用户可以创建工资记录\\" ON salary_records\n  FOR INSERT WITH CHECK (\n    company_id IN (\n      SELECT company_id FROM auth.users WHERE id = auth.uid()\n    )\n  )","CREATE POLICY \\"用户可以更新工资记录\\" ON salary_records\n  FOR UPDATE USING (\n    company_id IN (\n      SELECT company_id FROM auth.users WHERE id = auth.uid()\n    )\n  )","CREATE POLICY \\"用户可以删除工资记录\\" ON salary_records\n  FOR DELETE USING (\n    company_id IN (\n      SELECT company_id FROM auth.users WHERE id = auth.uid()\n    )\n  )","-- 工资条明细策略\nCREATE POLICY \\"用户可以查看所属公司的工资条\\" ON salary_items\n  FOR SELECT USING (\n    salary_record_id IN (\n      SELECT id FROM salary_records WHERE company_id IN (\n        SELECT company_id FROM auth.users WHERE id = auth.uid()\n      )\n    )\n    OR employee_id IN (\n      SELECT id FROM employees WHERE id IN (\n        SELECT employee_id FROM auth.users WHERE id = auth.uid()\n      )\n    )\n  )","CREATE POLICY \\"用户可以创建工资条\\" ON salary_items\n  FOR INSERT WITH CHECK (\n    salary_record_id IN (\n      SELECT id FROM salary_records WHERE company_id IN (\n        SELECT company_id FROM auth.users WHERE id = auth.uid()\n      )\n    )\n  )","CREATE POLICY \\"用户可以更新工资条\\" ON salary_items\n  FOR UPDATE USING (\n    salary_record_id IN (\n      SELECT id FROM salary_records WHERE company_id IN (\n        SELECT company_id FROM auth.users WHERE id = auth.uid()\n      )\n    )\n  )"}	create_salary_management_tables
00046	{"-- 添加员工额外字段\nALTER TABLE employees\nADD COLUMN IF NOT EXISTS gender TEXT,\nADD COLUMN IF NOT EXISTS birth_date DATE,\nADD COLUMN IF NOT EXISTS id_card_type TEXT DEFAULT '身份证',\nADD COLUMN IF NOT EXISTS household_address TEXT,\nADD COLUMN IF NOT EXISTS insurance_start_date DATE","-- 添加注释\nCOMMENT ON COLUMN employees.gender IS '性别'","COMMENT ON COLUMN employees.birth_date IS '出生年月日'","COMMENT ON COLUMN employees.id_card_type IS '身份证号码输入类型'","COMMENT ON COLUMN employees.household_address IS '户籍地址'","COMMENT ON COLUMN employees.insurance_start_date IS '五险参保时间'"}	add_employee_additional_fields
00047	{"-- 临时禁用触发器\nALTER TABLE employees DISABLE TRIGGER employees_audit_trigger","-- 为现有空值设置默认值\nUPDATE employees SET gender = '未知' WHERE gender IS NULL OR gender = ''","UPDATE employees SET birth_date = '1990-01-01' WHERE birth_date IS NULL","UPDATE employees SET id_card_type = '身份证' WHERE id_card_type IS NULL OR id_card_type = ''","UPDATE employees SET household_address = '待补充' WHERE household_address IS NULL OR household_address = ''","UPDATE employees SET insurance_start_date = COALESCE(hire_date, '2020-01-01') WHERE insurance_start_date IS NULL","UPDATE employees SET contract_end_date = COALESCE(DATE(contract_start_date) + INTERVAL '3 years', '2025-12-31') WHERE contract_end_date IS NULL","-- 重新启用触发器\nALTER TABLE employees ENABLE TRIGGER employees_audit_trigger","-- 设置字段为NOT NULL\nALTER TABLE employees\nALTER COLUMN gender SET NOT NULL,\nALTER COLUMN birth_date SET NOT NULL,\nALTER COLUMN id_card_type SET NOT NULL,\nALTER COLUMN household_address SET NOT NULL,\nALTER COLUMN insurance_start_date SET NOT NULL,\nALTER COLUMN contract_end_date SET NOT NULL"}	set_employee_fields_required_v2
00048	{"-- 禁用触发器\nALTER TABLE companies DISABLE TRIGGER companies_audit_trigger","-- 添加新字段\nALTER TABLE companies\nADD COLUMN IF NOT EXISTS industry TEXT DEFAULT '其他',\nADD COLUMN IF NOT EXISTS region TEXT DEFAULT '湖北省',\nADD COLUMN IF NOT EXISTS employee_scale TEXT DEFAULT '0-50人'","-- 修改service_status字段类型\n-- 先添加新的TEXT类型字段\nALTER TABLE companies ADD COLUMN IF NOT EXISTS service_status_text TEXT","-- 将boolean值转换为文本\nUPDATE companies SET service_status_text = CASE \n  WHEN service_status = true THEN '服务中'\n  WHEN service_status = false THEN '已到期'\n  ELSE '服务中'\nEND","-- 删除旧字段\nALTER TABLE companies DROP COLUMN service_status","-- 重命名新字段\nALTER TABLE companies RENAME COLUMN service_status_text TO service_status","-- 设置默认值\nALTER TABLE companies ALTER COLUMN service_status SET DEFAULT '服务中'","-- 启用触发器\nALTER TABLE companies ENABLE TRIGGER companies_audit_trigger","-- 添加注释\nCOMMENT ON COLUMN companies.service_status IS '服务状态：服务中、已到期、已暂停'","COMMENT ON COLUMN companies.industry IS '所属行业'","COMMENT ON COLUMN companies.region IS '所在地域'","COMMENT ON COLUMN companies.employee_scale IS '员工规模：0-50人、51-200人、201-500人、500人以上'"}	add_customer_fields_v2
00049	{"-- 允许document_templates表的company_id为NULL，以支持通用模板\nALTER TABLE document_templates \nALTER COLUMN company_id DROP NOT NULL","-- 添加注释说明\nCOMMENT ON COLUMN document_templates.company_id IS '所属公司ID，NULL表示通用模板（所有公司可用）'","-- 临时禁用审计触发器\nALTER TABLE document_templates DISABLE TRIGGER document_templates_audit_trigger","-- 创建一些通用模板示例（只在不存在时创建）\nDO $$\nBEGIN\n  -- 检查是否已有通用模板\n  IF NOT EXISTS (SELECT 1 FROM document_templates WHERE company_id IS NULL LIMIT 1) THEN\n    INSERT INTO document_templates (company_id, name, category, requires_company_signature, is_active)\n    VALUES \n      (NULL, '劳动合同', 'onboarding', true, true),\n      (NULL, '保密协议', 'onboarding', false, true),\n      (NULL, '员工手册', 'onboarding', false, true),\n      (NULL, '入职登记表', 'onboarding', false, true),\n      (NULL, '求职登记表', 'onboarding', false, true),\n      (NULL, '承诺书', 'onboarding', false, true),\n      (NULL, '考勤确认', 'compensation', false, true),\n      (NULL, '绩效考核确认', 'compensation', false, true),\n      (NULL, '工资条确认', 'compensation', false, true);\n  END IF;\nEND $$","-- 重新启用审计触发器\nALTER TABLE document_templates ENABLE TRIGGER document_templates_audit_trigger"}	add_universal_templates_support_v2
00050	{"-- 修复log_operation函数，当用户未登录时跳过日志记录\nCREATE OR REPLACE FUNCTION public.log_operation(\n  p_operation_type operation_type,\n  p_operation_detail text,\n  p_target_type text DEFAULT NULL,\n  p_target_id uuid DEFAULT NULL,\n  p_ip_address text DEFAULT NULL,\n  p_user_agent text DEFAULT NULL\n)\nRETURNS uuid\nLANGUAGE plpgsql\nSECURITY DEFINER\nSET search_path TO 'public', 'auth'\nAS $function$\nDECLARE\n  v_log_id uuid;\n  v_user_id uuid;\nBEGIN\n  -- 获取当前用户ID\n  v_user_id := auth.uid();\n  \n  -- 如果用户未登录，跳过日志记录并返回NULL\n  IF v_user_id IS NULL THEN\n    RETURN NULL;\n  END IF;\n  \n  -- 插入操作日志\n  INSERT INTO operation_logs (\n    user_id,\n    operation_type,\n    operation_detail,\n    target_type,\n    target_id,\n    ip_address,\n    user_agent\n  ) VALUES (\n    v_user_id,\n    p_operation_type,\n    p_operation_detail,\n    p_target_type,\n    p_target_id,\n    p_ip_address,\n    p_user_agent\n  )\n  RETURNING id INTO v_log_id;\n  \n  RETURN v_log_id;\nEND;\n$function$"}	fix_log_operation_null_user
00051	{"-- 删除旧的错误策略\nDROP POLICY IF EXISTS \\"用户可以查看所属公司的工资结构模板\\" ON salary_structure_templates","DROP POLICY IF EXISTS \\"用户可以创建工资结构模板\\" ON salary_structure_templates","DROP POLICY IF EXISTS \\"用户可以更新工资结构模板\\" ON salary_structure_templates","DROP POLICY IF EXISTS \\"用户可以删除工资结构模板\\" ON salary_structure_templates","-- 创建正确的RLS策略\n-- 1. 查看策略：用户可以查看所属公司的工资结构模板\nCREATE POLICY \\"用户可以查看所属公司的工资结构模板\\"\nON salary_structure_templates\nFOR SELECT\nTO public\nUSING (\n  company_id IN (\n    SELECT company_id \n    FROM auth.users \n    WHERE id = auth.uid()\n  )\n)","-- 2. 插入策略：用户可以创建所属公司的工资结构模板\nCREATE POLICY \\"用户可以创建工资结构模板\\"\nON salary_structure_templates\nFOR INSERT\nTO public\nWITH CHECK (\n  company_id IN (\n    SELECT company_id \n    FROM auth.users \n    WHERE id = auth.uid()\n  )\n)","-- 3. 更新策略：用户可以更新所属公司的工资结构模板\nCREATE POLICY \\"用户可以更新工资结构模板\\"\nON salary_structure_templates\nFOR UPDATE\nTO public\nUSING (\n  company_id IN (\n    SELECT company_id \n    FROM auth.users \n    WHERE id = auth.uid()\n  )\n)","-- 4. 删除策略：用户可以删除所属公司的工资结构模板\nCREATE POLICY \\"用户可以删除工资结构模板\\"\nON salary_structure_templates\nFOR DELETE\nTO public\nUSING (\n  company_id IN (\n    SELECT company_id \n    FROM auth.users \n    WHERE id = auth.uid()\n  )\n)"}	fix_salary_structure_templates_rls_policies
00052	{"-- 删除所有旧策略\nDROP POLICY IF EXISTS \\"用户可以查看所属公司的工资结构模板\\" ON salary_structure_templates","DROP POLICY IF EXISTS \\"用户可以创建工资结构模板\\" ON salary_structure_templates","DROP POLICY IF EXISTS \\"用户可以更新工资结构模板\\" ON salary_structure_templates","DROP POLICY IF EXISTS \\"用户可以删除工资结构模板\\" ON salary_structure_templates","DROP POLICY IF EXISTS \\"salary_templates_select_policy\\" ON salary_structure_templates","DROP POLICY IF EXISTS \\"salary_templates_insert_policy\\" ON salary_structure_templates","DROP POLICY IF EXISTS \\"salary_templates_update_policy\\" ON salary_structure_templates","DROP POLICY IF EXISTS \\"salary_templates_delete_policy\\" ON salary_structure_templates","-- 创建正确的RLS策略（使用profiles表）\n-- 1. 查看策略：用户可以查看所属公司的工资结构模板\nCREATE POLICY \\"用户可以查看所属公司的工资结构模板\\"\nON salary_structure_templates\nFOR SELECT\nTO public\nUSING (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)","-- 2. 插入策略：用户可以创建所属公司的工资结构模板\nCREATE POLICY \\"用户可以创建工资结构模板\\"\nON salary_structure_templates\nFOR INSERT\nTO public\nWITH CHECK (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)","-- 3. 更新策略：用户可以更新所属公司的工资结构模板\nCREATE POLICY \\"用户可以更新工资结构模板\\"\nON salary_structure_templates\nFOR UPDATE\nTO public\nUSING (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)","-- 4. 删除策略：用户可以删除所属公司的工资结构模板\nCREATE POLICY \\"用户可以删除工资结构模板\\"\nON salary_structure_templates\nFOR DELETE\nTO public\nUSING (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)"}	fix_salary_structure_rls_use_profiles
00053	{"-- 修复salary_records表的RLS策略\nDROP POLICY IF EXISTS \\"用户可以查看所属公司的工资记录\\" ON salary_records","DROP POLICY IF EXISTS \\"用户可以创建工资记录\\" ON salary_records","DROP POLICY IF EXISTS \\"用户可以更新工资记录\\" ON salary_records","DROP POLICY IF EXISTS \\"用户可以删除工资记录\\" ON salary_records","CREATE POLICY \\"用户可以查看所属公司的工资记录\\"\nON salary_records\nFOR SELECT\nTO public\nUSING (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)","CREATE POLICY \\"用户可以创建工资记录\\"\nON salary_records\nFOR INSERT\nTO public\nWITH CHECK (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)","CREATE POLICY \\"用户可以更新工资记录\\"\nON salary_records\nFOR UPDATE\nTO public\nUSING (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)","CREATE POLICY \\"用户可以删除工资记录\\"\nON salary_records\nFOR DELETE\nTO public\nUSING (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)","-- 修复salary_items表的RLS策略（如果存在）\nDROP POLICY IF EXISTS \\"用户可以查看工资明细\\" ON salary_items","DROP POLICY IF EXISTS \\"用户可以创建工资明细\\" ON salary_items","DROP POLICY IF EXISTS \\"用户可以更新工资明细\\" ON salary_items","DROP POLICY IF EXISTS \\"用户可以删除工资明细\\" ON salary_items","-- 为salary_items创建新策略（通过salary_records关联）\nCREATE POLICY \\"用户可以查看工资明细\\"\nON salary_items\nFOR SELECT\nTO public\nUSING (\n  salary_record_id IN (\n    SELECT sr.id \n    FROM salary_records sr\n    INNER JOIN profiles p ON sr.company_id = p.company_id\n    WHERE p.id = auth.uid()\n  )\n)","CREATE POLICY \\"用户可以创建工资明细\\"\nON salary_items\nFOR INSERT\nTO public\nWITH CHECK (\n  salary_record_id IN (\n    SELECT sr.id \n    FROM salary_records sr\n    INNER JOIN profiles p ON sr.company_id = p.company_id\n    WHERE p.id = auth.uid()\n  )\n)","CREATE POLICY \\"用户可以更新工资明细\\"\nON salary_items\nFOR UPDATE\nTO public\nUSING (\n  salary_record_id IN (\n    SELECT sr.id \n    FROM salary_records sr\n    INNER JOIN profiles p ON sr.company_id = p.company_id\n    WHERE p.id = auth.uid()\n  )\n)","CREATE POLICY \\"用户可以删除工资明细\\"\nON salary_items\nFOR DELETE\nTO public\nUSING (\n  salary_record_id IN (\n    SELECT sr.id \n    FROM salary_records sr\n    INNER JOIN profiles p ON sr.company_id = p.company_id\n    WHERE p.id = auth.uid()\n  )\n)"}	fix_all_salary_tables_rls_policies
00054	{"-- 删除salary_items表的旧策略\nDROP POLICY IF EXISTS \\"用户可以查看所属公司的工资条\\" ON salary_items","DROP POLICY IF EXISTS \\"用户可以创建工资条\\" ON salary_items","DROP POLICY IF EXISTS \\"用户可以更新工资条\\" ON salary_items","DROP POLICY IF EXISTS \\"用户可以删除工资条\\" ON salary_items"}	cleanup_old_salary_items_policies
00055	{"-- 创建考勤记录表\nCREATE TABLE IF NOT EXISTS attendance_records (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,\n  month TEXT NOT NULL, -- 考勤月份 YYYY-MM\n  work_days NUMERIC DEFAULT 0, -- 出勤天数\n  absent_days NUMERIC DEFAULT 0, -- 缺勤天数\n  late_times NUMERIC DEFAULT 0, -- 迟到次数\n  leave_days NUMERIC DEFAULT 0, -- 请假天数\n  overtime_hours NUMERIC DEFAULT 0, -- 加班小时数\n  remarks TEXT, -- 备注\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  created_by UUID REFERENCES profiles(id),\n  updated_at TIMESTAMPTZ DEFAULT NOW(),\n  UNIQUE(company_id, employee_id, month) -- 同一公司同一员工同一月份只能有一条记录\n)","-- 创建索引\nCREATE INDEX IF NOT EXISTS idx_attendance_records_company ON attendance_records(company_id)","CREATE INDEX IF NOT EXISTS idx_attendance_records_employee ON attendance_records(employee_id)","CREATE INDEX IF NOT EXISTS idx_attendance_records_month ON attendance_records(month)","-- 创建更新时间触发器\nCREATE TRIGGER update_attendance_records_updated_at\n  BEFORE UPDATE ON attendance_records\n  FOR EACH ROW\n  EXECUTE FUNCTION update_updated_at()","-- 启用RLS\nALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY","-- 创建RLS策略\nCREATE POLICY \\"用户可以查看所属公司的考勤记录\\"\nON attendance_records\nFOR SELECT\nTO public\nUSING (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)","CREATE POLICY \\"用户可以创建所属公司的考勤记录\\"\nON attendance_records\nFOR INSERT\nTO public\nWITH CHECK (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)","CREATE POLICY \\"用户可以更新所属公司的考勤记录\\"\nON attendance_records\nFOR UPDATE\nTO public\nUSING (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)","CREATE POLICY \\"用户可以删除所属公司的考勤记录\\"\nON attendance_records\nFOR DELETE\nTO public\nUSING (\n  company_id IN (\n    SELECT p.company_id \n    FROM profiles p\n    WHERE p.id = auth.uid()\n  )\n)","-- 添加审计触发器\nCREATE TRIGGER attendance_records_audit_trigger\n  AFTER INSERT OR UPDATE OR DELETE ON attendance_records\n  FOR EACH ROW\n  EXECUTE FUNCTION audit_trigger_function()"}	create_attendance_records_table
00056	{"-- 删除旧的INSERT策略\nDROP POLICY IF EXISTS \\"用户可以创建文书模板\\" ON document_templates","DROP POLICY IF EXISTS \\"用户可以创建有权访问的公司的文书模板\\" ON document_templates","-- 创建新的INSERT策略，允许创建通用模板（company_id为null）\nCREATE POLICY \\"用户可以创建文书模板\\"\nON document_templates\nFOR INSERT\nTO authenticated\nWITH CHECK (\n  is_super_admin(uid()) \n  OR (\n    has_permission(uid(), 'template_create') \n    AND (\n      -- 允许创建通用模板（company_id为null）\n      company_id IS NULL\n      OR\n      -- 或者创建所属公司的模板\n      company_id IN (\n        SELECT companies.id\n        FROM companies\n        WHERE companies.owner_id IN (\n          SELECT accessible_user_id\n          FROM get_accessible_users(uid())\n        )\n      )\n    )\n  )\n)","CREATE POLICY \\"用户可以创建有权访问的公司的文书模板\\"\nON document_templates\nFOR INSERT\nTO public\nWITH CHECK (\n  is_super_admin(uid()) \n  OR (\n    has_permission(uid(), 'template_create') \n    AND (\n      -- 允许创建通用模板（company_id为null）\n      company_id IS NULL\n      OR\n      -- 或者创建有权访问的公司的模板\n      can_access_company_data(uid(), company_id)\n    )\n  )\n)","-- 同样修复SELECT策略，允许查看通用模板\nDROP POLICY IF EXISTS \\"用户可以查看有权访问的公司的文书模板\\" ON document_templates","DROP POLICY IF EXISTS \\"用户可以查看自己和下级负责的公司的文书模板\\" ON document_templates","CREATE POLICY \\"用户可以查看有权访问的公司的文书模板\\"\nON document_templates\nFOR SELECT\nTO public\nUSING (\n  is_super_admin(uid()) \n  OR company_id IS NULL  -- 所有人都可以查看通用模板\n  OR can_access_company_data(uid(), company_id)\n)","CREATE POLICY \\"用户可以查看自己和下级负责的公司的文书模板\\"\nON document_templates\nFOR SELECT\nTO authenticated\nUSING (\n  is_super_admin(uid()) \n  OR company_id IS NULL  -- 所有人都可以查看通用模板\n  OR (\n    has_permission(uid(), 'template_view') \n    AND company_id IN (\n      SELECT companies.id\n      FROM companies\n      WHERE companies.owner_id IN (\n        SELECT accessible_user_id\n        FROM get_accessible_users(uid())\n      )\n    )\n  )\n)","-- 修复UPDATE策略，允许更新通用模板\nDROP POLICY IF EXISTS \\"用户可以更新有权访问的公司的文书模板\\" ON document_templates","DROP POLICY IF EXISTS \\"用户可以更新自己和下级负责的公司的文书模板\\" ON document_templates","CREATE POLICY \\"用户可以更新有权访问的公司的文书模板\\"\nON document_templates\nFOR UPDATE\nTO public\nUSING (\n  is_super_admin(uid()) \n  OR (\n    has_permission(uid(), 'template_edit') \n    AND (\n      company_id IS NULL  -- 允许更新通用模板\n      OR can_access_company_data(uid(), company_id)\n    )\n  )\n)\nWITH CHECK (\n  is_super_admin(uid()) \n  OR (\n    has_permission(uid(), 'template_edit') \n    AND (\n      company_id IS NULL  -- 允许更新为通用模板\n      OR can_access_company_data(uid(), company_id)\n    )\n  )\n)","CREATE POLICY \\"用户可以更新自己和下级负责的公司的文书模板\\"\nON document_templates\nFOR UPDATE\nTO authenticated\nUSING (\n  is_super_admin(uid()) \n  OR (\n    has_permission(uid(), 'template_edit') \n    AND (\n      company_id IS NULL  -- 允许更新通用模板\n      OR company_id IN (\n        SELECT companies.id\n        FROM companies\n        WHERE companies.owner_id IN (\n          SELECT accessible_user_id\n          FROM get_accessible_users(uid())\n        )\n      )\n    )\n  )\n)","-- 修复DELETE策略，允许删除通用模板\nDROP POLICY IF EXISTS \\"用户可以删除有权访问的公司的文书模板\\" ON document_templates","DROP POLICY IF EXISTS \\"用户可以删除自己和下级负责的公司的文书模板\\" ON document_templates","CREATE POLICY \\"用户可以删除有权访问的公司的文书模板\\"\nON document_templates\nFOR DELETE\nTO public\nUSING (\n  is_super_admin(uid()) \n  OR (\n    has_permission(uid(), 'template_delete') \n    AND (\n      company_id IS NULL  -- 允许删除通用模板\n      OR can_access_company_data(uid(), company_id)\n    )\n  )\n)","CREATE POLICY \\"用户可以删除自己和下级负责的公司的文书模板\\"\nON document_templates\nFOR DELETE\nTO authenticated\nUSING (\n  is_super_admin(uid()) \n  OR (\n    has_permission(uid(), 'template_delete') \n    AND (\n      company_id IS NULL  -- 允许删除通用模板\n      OR company_id IN (\n        SELECT companies.id\n        FROM companies\n        WHERE companies.owner_id IN (\n          SELECT accessible_user_id\n          FROM get_accessible_users(uid())\n        )\n      )\n    )\n  )\n)"}	fix_document_templates_insert_policy_for_universal_templates
00057	{"-- 添加withdrawn（撤回）状态到signing_status枚举\nALTER TYPE signing_status ADD VALUE IF NOT EXISTS 'withdrawn'"}	add_withdrawn_status_to_signing_status_enum
00058	{"-- 删除旧的RLS策略\nDROP POLICY IF EXISTS \\"用户可以创建所属公司的考勤记录\\" ON attendance_records","DROP POLICY IF EXISTS \\"用户可以查看所属公司的考勤记录\\" ON attendance_records","DROP POLICY IF EXISTS \\"用户可以更新所属公司的考勤记录\\" ON attendance_records","DROP POLICY IF EXISTS \\"用户可以删除所属公司的考勤记录\\" ON attendance_records","-- 创建新的INSERT策略\nCREATE POLICY \\"用户可以创建考勤记录\\"\nON attendance_records\nFOR INSERT\nTO public\nWITH CHECK (\n  is_super_admin(uid()) \n  OR can_access_company_data(uid(), company_id)\n)","-- 创建新的SELECT策略\nCREATE POLICY \\"用户可以查看考勤记录\\"\nON attendance_records\nFOR SELECT\nTO public\nUSING (\n  is_super_admin(uid()) \n  OR can_access_company_data(uid(), company_id)\n)","-- 创建新的UPDATE策略\nCREATE POLICY \\"用户可以更新考勤记录\\"\nON attendance_records\nFOR UPDATE\nTO public\nUSING (\n  is_super_admin(uid()) \n  OR can_access_company_data(uid(), company_id)\n)\nWITH CHECK (\n  is_super_admin(uid()) \n  OR can_access_company_data(uid(), company_id)\n)","-- 创建新的DELETE策略\nCREATE POLICY \\"用户可以删除考勤记录\\"\nON attendance_records\nFOR DELETE\nTO public\nUSING (\n  is_super_admin(uid()) \n  OR can_access_company_data(uid(), company_id)\n)"}	fix_attendance_records_rls_policies
00059	{"-- 创建修改用户密码的函数\nCREATE OR REPLACE FUNCTION update_user_password(\n  user_id UUID,\n  new_password TEXT\n)\nRETURNS JSON\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  result JSON;\nBEGIN\n  -- 检查当前用户是否是超级管理员\n  IF NOT is_super_admin(uid()) THEN\n    RETURN json_build_object(\n      'success', false,\n      'error', '只有超级管理员可以修改用户密码'\n    );\n  END IF;\n\n  -- 检查密码长度\n  IF LENGTH(new_password) < 6 THEN\n    RETURN json_build_object(\n      'success', false,\n      'error', '密码长度至少6位'\n    );\n  END IF;\n\n  -- 更新用户密码\n  UPDATE auth.users\n  SET \n    encrypted_password = crypt(new_password, gen_salt('bf')),\n    updated_at = NOW()\n  WHERE id = user_id;\n\n  -- 检查是否更新成功\n  IF NOT FOUND THEN\n    RETURN json_build_object(\n      'success', false,\n      'error', '用户不存在'\n    );\n  END IF;\n\n  RETURN json_build_object('success', true);\nEXCEPTION\n  WHEN OTHERS THEN\n    RETURN json_build_object(\n      'success', false,\n      'error', SQLERRM\n    );\nEND;\n$$"}	create_update_user_password_function
00060	{"-- 添加身份证号码字段到employees表\nALTER TABLE employees\nADD COLUMN IF NOT EXISTS id_card_number TEXT","-- 添加注释\nCOMMENT ON COLUMN employees.id_card_number IS '身份证号码'"}	add_id_card_number_to_employees
00061	{"-- 步骤1: 将employee_number中的身份证号码迁移到id_card_number字段\n-- 只迁移看起来像身份证号的数据（15位或18位数字）\nUPDATE employees\nSET id_card_number = employee_number\nWHERE id_card_number IS NULL\n  AND employee_number IS NOT NULL\n  AND (LENGTH(employee_number) = 15 OR LENGTH(employee_number) = 18)\n  AND employee_number ~ '^[0-9]+$'","-- 步骤2: 使用临时表生成新的员工编号\nWITH numbered_employees AS (\n  SELECT \n    id,\n    company_id,\n    'EMP' || LPAD(ROW_NUMBER() OVER (PARTITION BY company_id ORDER BY created_at)::TEXT, 4, '0') as new_number\n  FROM employees\n  WHERE id_card_number IS NOT NULL\n    AND employee_number ~ '^[0-9]+$'\n    AND (LENGTH(employee_number) = 15 OR LENGTH(employee_number) = 18)\n)\nUPDATE employees e\nSET employee_number = ne.new_number\nFROM numbered_employees ne\nWHERE e.id = ne.id"}	migrate_employee_number_to_id_card_number_v2
00062	{"-- 确保 uuid-ossp 扩展存在（提供 uuid_generate_v4 函数）\nCREATE EXTENSION IF NOT EXISTS \\"uuid-ossp\\"","-- 创建薪酬签署类型枚举\nCREATE TYPE salary_signature_type AS ENUM ('salary_slip', 'attendance_record')","-- 创建薪酬签署状态枚举\nCREATE TYPE salary_signature_status AS ENUM ('pending', 'sent', 'signed', 'rejected')","-- 创建薪酬签署表\nCREATE TABLE salary_signatures (\n  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,\n  type salary_signature_type NOT NULL,\n  reference_id UUID NOT NULL,\n  year INTEGER NOT NULL,\n  month INTEGER NOT NULL,\n  status salary_signature_status NOT NULL DEFAULT 'pending',\n  sent_at TIMESTAMP WITH TIME ZONE,\n  signed_at TIMESTAMP WITH TIME ZONE,\n  signature_url TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n)","-- 添加索引\nCREATE INDEX idx_salary_signatures_company ON salary_signatures(company_id)","CREATE INDEX idx_salary_signatures_employee ON salary_signatures(employee_id)","CREATE INDEX idx_salary_signatures_status ON salary_signatures(status)","CREATE INDEX idx_salary_signatures_year_month ON salary_signatures(year, month)","-- 添加注释\nCOMMENT ON TABLE salary_signatures IS '薪酬签署记录表'","COMMENT ON COLUMN salary_signatures.type IS '签署类型：salary_slip工资条、attendance_record考勤确认表'","COMMENT ON COLUMN salary_signatures.reference_id IS '关联的工资记录或考勤记录ID'","COMMENT ON COLUMN salary_signatures.status IS '签署状态：pending待签署、sent已发送、signed已签署、rejected已拒签'","-- 启用RLS\nALTER TABLE salary_signatures ENABLE ROW LEVEL SECURITY","-- RLS策略：超级管理员和有权限的用户可以查看\nCREATE POLICY \\"salary_signatures_select_policy\\" ON salary_signatures\n  FOR SELECT\n  USING (\n    is_super_admin(uid()) OR \n    can_access_company_data(uid(), company_id)\n  )","-- RLS策略：超级管理员和有权限的用户可以插入\nCREATE POLICY \\"salary_signatures_insert_policy\\" ON salary_signatures\n  FOR INSERT\n  WITH CHECK (\n    is_super_admin(uid()) OR \n    can_access_company_data(uid(), company_id)\n  )","-- RLS策略：超级管理员和有权限的用户可以更新\nCREATE POLICY \\"salary_signatures_update_policy\\" ON salary_signatures\n  FOR UPDATE\n  USING (\n    is_super_admin(uid()) OR \n    can_access_company_data(uid(), company_id)\n  )","-- RLS策略：超级管理员可以删除\nCREATE POLICY \\"salary_signatures_delete_policy\\" ON salary_signatures\n  FOR DELETE\n  USING (is_super_admin(uid()))"}	create_salary_signatures_table
00063	{"-- 为薪酬签署表添加签署token和文件字段\nALTER TABLE salary_signatures\nADD COLUMN IF NOT EXISTS sign_token TEXT UNIQUE,\nADD COLUMN IF NOT EXISTS sign_token_expires_at TIMESTAMP WITH TIME ZONE,\nADD COLUMN IF NOT EXISTS original_file_url TEXT,\nADD COLUMN IF NOT EXISTS signed_file_url TEXT,\nADD COLUMN IF NOT EXISTS signature_data TEXT,\nADD COLUMN IF NOT EXISTS reject_reason TEXT","-- 添加索引\nCREATE INDEX IF NOT EXISTS idx_salary_signatures_sign_token ON salary_signatures(sign_token)","-- 添加注释\nCOMMENT ON COLUMN salary_signatures.sign_token IS '签署token，用于生成签署链接'","COMMENT ON COLUMN salary_signatures.sign_token_expires_at IS '签署token过期时间'","COMMENT ON COLUMN salary_signatures.original_file_url IS '原始文件URL（工资条或考勤表PDF）'","COMMENT ON COLUMN salary_signatures.signed_file_url IS '签署后的文件URL'","COMMENT ON COLUMN salary_signatures.signature_data IS '签名数据（JSON格式，包含签名图片等）'","COMMENT ON COLUMN salary_signatures.reject_reason IS '拒签原因'","-- 创建生成签署token的函数\nCREATE OR REPLACE FUNCTION generate_sign_token()\nRETURNS TEXT AS $$\nBEGIN\n  RETURN encode(gen_random_bytes(32), 'hex');\nEND;\n$$ LANGUAGE plpgsql","-- 创建更新签署token的函数\nCREATE OR REPLACE FUNCTION update_sign_token(signature_id UUID)\nRETURNS TEXT AS $$\nDECLARE\n  new_token TEXT;\nBEGIN\n  new_token := generate_sign_token();\n  \n  UPDATE salary_signatures\n  SET \n    sign_token = new_token,\n    sign_token_expires_at = NOW() + INTERVAL '30 days',\n    updated_at = NOW()\n  WHERE id = signature_id;\n  \n  RETURN new_token;\nEND;\n$$ LANGUAGE plpgsql","-- 创建批量生成签署token的函数\nCREATE OR REPLACE FUNCTION batch_generate_sign_tokens(signature_ids UUID[])\nRETURNS TABLE(id UUID, sign_token TEXT) AS $$\nBEGIN\n  RETURN QUERY\n  UPDATE salary_signatures\n  SET \n    sign_token = generate_sign_token(),\n    sign_token_expires_at = NOW() + INTERVAL '30 days',\n    status = 'sent',\n    sent_at = NOW(),\n    updated_at = NOW()\n  WHERE salary_signatures.id = ANY(signature_ids)\n  RETURNING salary_signatures.id, salary_signatures.sign_token;\nEND;\n$$ LANGUAGE plpgsql","-- 创建公开访问签署记录的RLS策略（通过token）\nCREATE POLICY \\"salary_signatures_public_access_by_token\\" ON salary_signatures\n  FOR SELECT\n  USING (\n    sign_token IS NOT NULL AND \n    sign_token_expires_at > NOW()\n  )"}	add_signature_token_and_files
00064	{"-- 创建签署文件存储桶（通过insert语句）\nINSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)\nVALUES (\n  'signature-files',\n  'signature-files',\n  false,\n  10485760, -- 10MB\n  ARRAY['application/pdf', 'image/png', 'image/jpeg']\n)\nON CONFLICT (id) DO NOTHING","-- 设置存储桶的RLS策略\n-- 1. 允许认证用户上传文件\nCREATE POLICY \\"signature_files_insert_policy\\" ON storage.objects\n  FOR INSERT\n  TO authenticated\n  WITH CHECK (bucket_id = 'signature-files')","-- 2. 允许认证用户查看自己公司的文件\nCREATE POLICY \\"signature_files_select_policy\\" ON storage.objects\n  FOR SELECT\n  TO authenticated\n  USING (bucket_id = 'signature-files')","-- 3. 允许认证用户更新自己公司的文件\nCREATE POLICY \\"signature_files_update_policy\\" ON storage.objects\n  FOR UPDATE\n  TO authenticated\n  USING (bucket_id = 'signature-files')","-- 4. 允许认证用户删除自己公司的文件\nCREATE POLICY \\"signature_files_delete_policy\\" ON storage.objects\n  FOR DELETE\n  TO authenticated\n  USING (bucket_id = 'signature-files')"}	create_signature_files_bucket
00065	{"-- 为工资结构模板添加PDF模板配置\nALTER TABLE salary_structure_templates\nADD COLUMN IF NOT EXISTS pdf_template_config JSONB DEFAULT '{\n  \\"title\\": \\"工资条\\",\n  \\"show_company_logo\\": true,\n  \\"show_company_name\\": true,\n  \\"show_period\\": true,\n  \\"header_color\\": \\"#1e40af\\",\n  \\"font_size\\": 10,\n  \\"show_signature_area\\": true,\n  \\"signature_label\\": \\"员工签名\\",\n  \\"footer_text\\": \\"本工资条仅供个人查阅，请妥善保管\\"\n}'::jsonb","-- 添加注释\nCOMMENT ON COLUMN salary_structure_templates.pdf_template_config IS 'PDF模板配置（JSON格式）：标题、样式、布局等'","-- 为工资记录表添加PDF生成状态\nALTER TABLE salary_records\nADD COLUMN IF NOT EXISTS pdf_generated BOOLEAN DEFAULT false,\nADD COLUMN IF NOT EXISTS pdf_generation_error TEXT","COMMENT ON COLUMN salary_records.pdf_generated IS 'PDF是否已生成'","COMMENT ON COLUMN salary_records.pdf_generation_error IS 'PDF生成错误信息'","-- 为工资条明细表添加PDF文件URL\nALTER TABLE salary_items\nADD COLUMN IF NOT EXISTS pdf_url TEXT","COMMENT ON COLUMN salary_items.pdf_url IS '工资条PDF文件URL'","-- 创建索引\nCREATE INDEX IF NOT EXISTS idx_salary_items_pdf_url ON salary_items(pdf_url) WHERE pdf_url IS NOT NULL"}	add_salary_template_pdf_config
00066	{"-- 为考勤记录表添加PDF文件URL\nALTER TABLE attendance_records\nADD COLUMN IF NOT EXISTS pdf_url TEXT","COMMENT ON COLUMN attendance_records.pdf_url IS '考勤确认表PDF文件URL'","-- 创建索引\nCREATE INDEX IF NOT EXISTS idx_attendance_records_pdf_url ON attendance_records(pdf_url) WHERE pdf_url IS NOT NULL"}	add_attendance_record_pdf_url
00067	{"-- 删除旧的INSERT策略\nDROP POLICY IF EXISTS \\"用户可以创建工资记录\\" ON salary_records","-- 创建新的INSERT策略：允许有\\"工资表管理\\"权限的用户创建工资记录\nCREATE POLICY \\"用户可以创建工资记录\\"\nON salary_records\nFOR INSERT\nTO public\nWITH CHECK (\n  has_permission(uid(), '工资表管理')\n)","-- 同时更新UPDATE和DELETE策略，使用权限检查\nDROP POLICY IF EXISTS \\"用户可以更新工资记录\\" ON salary_records","CREATE POLICY \\"用户可以更新工资记录\\"\nON salary_records\nFOR UPDATE\nTO public\nUSING (\n  has_permission(uid(), '工资表管理')\n)","DROP POLICY IF EXISTS \\"用户可以删除工资记录\\" ON salary_records","CREATE POLICY \\"用户可以删除工资记录\\"\nON salary_records\nFOR DELETE\nTO public\nUSING (\n  has_permission(uid(), '工资表管理')\n)","-- SELECT策略保持不变（用户只能查看所属公司的工资记录）\n-- 但也添加一个基于权限的查看策略\nDROP POLICY IF EXISTS \\"用户可以查看所属公司的工资记录\\" ON salary_records","CREATE POLICY \\"用户可以查看所属公司的工资记录\\"\nON salary_records\nFOR SELECT\nTO public\nUSING (\n  -- 有权限的用户可以查看所有公司的工资记录\n  has_permission(uid(), '工资表管理')\n  OR\n  -- 或者查看自己所属公司的工资记录\n  company_id IN (SELECT p.company_id FROM profiles p WHERE p.id = uid())\n)"}	fix_salary_records_insert_policy
00068	{"-- 删除旧的策略\nDROP POLICY IF EXISTS \\"用户可以创建工资明细\\" ON salary_items","DROP POLICY IF EXISTS \\"用户可以更新工资明细\\" ON salary_items","DROP POLICY IF EXISTS \\"用户可以删除工资明细\\" ON salary_items","DROP POLICY IF EXISTS \\"用户可以查看工资明细\\" ON salary_items","-- 创建新的INSERT策略：允许有\\"工资表管理\\"权限的用户创建工资明细\nCREATE POLICY \\"用户可以创建工资明细\\"\nON salary_items\nFOR INSERT\nTO public\nWITH CHECK (\n  has_permission(uid(), '工资表管理')\n)","-- 创建新的UPDATE策略\nCREATE POLICY \\"用户可以更新工资明细\\"\nON salary_items\nFOR UPDATE\nTO public\nUSING (\n  has_permission(uid(), '工资表管理')\n)","-- 创建新的DELETE策略\nCREATE POLICY \\"用户可以删除工资明细\\"\nON salary_items\nFOR DELETE\nTO public\nUSING (\n  has_permission(uid(), '工资表管理')\n)","-- 创建新的SELECT策略\nCREATE POLICY \\"用户可以查看工资明细\\"\nON salary_items\nFOR SELECT\nTO public\nUSING (\n  -- 有权限的用户可以查看所有工资明细\n  has_permission(uid(), '工资表管理')\n  OR\n  -- 或者员工可以查看自己的工资明细\n  employee_id = uid()\n)"}	fix_salary_items_policies
00069	{"-- 更新salary_signatures的INSERT策略\nDROP POLICY IF EXISTS \\"salary_signatures_insert_policy\\" ON salary_signatures","CREATE POLICY \\"salary_signatures_insert_policy\\"\nON salary_signatures\nFOR INSERT\nTO public\nWITH CHECK (\n  -- 超级管理员可以创建\n  is_super_admin(uid())\n  OR\n  -- 有权限的用户可以创建\n  has_permission(uid(), '工资表管理')\n  OR\n  has_permission(uid(), '薪酬签署')\n  OR\n  -- 可以访问该公司数据的用户可以创建\n  can_access_company_data(uid(), company_id)\n)"}	fix_salary_signatures_insert_policy
00070	{"-- 修复salary_records的策略，使用正确的权限code\nDROP POLICY IF EXISTS \\"用户可以创建工资记录\\" ON salary_records","CREATE POLICY \\"用户可以创建工资记录\\"\nON salary_records\nFOR INSERT\nTO public\nWITH CHECK (\n  has_permission(uid(), 'salary_record_manage')\n  OR has_permission(uid(), 'salary_record_upload')\n)","DROP POLICY IF EXISTS \\"用户可以更新工资记录\\" ON salary_records","CREATE POLICY \\"用户可以更新工资记录\\"\nON salary_records\nFOR UPDATE\nTO public\nUSING (\n  has_permission(uid(), 'salary_record_manage')\n)","DROP POLICY IF EXISTS \\"用户可以删除工资记录\\" ON salary_records","CREATE POLICY \\"用户可以删除工资记录\\"\nON salary_records\nFOR DELETE\nTO public\nUSING (\n  has_permission(uid(), 'salary_record_manage')\n)","DROP POLICY IF EXISTS \\"用户可以查看所属公司的工资记录\\" ON salary_records","CREATE POLICY \\"用户可以查看所属公司的工资记录\\"\nON salary_records\nFOR SELECT\nTO public\nUSING (\n  has_permission(uid(), 'salary_record_manage')\n  OR has_permission(uid(), 'salary_record_view')\n  OR company_id IN (SELECT p.company_id FROM profiles p WHERE p.id = uid())\n)","-- 修复salary_items的策略\nDROP POLICY IF EXISTS \\"用户可以创建工资明细\\" ON salary_items","CREATE POLICY \\"用户可以创建工资明细\\"\nON salary_items\nFOR INSERT\nTO public\nWITH CHECK (\n  has_permission(uid(), 'salary_record_manage')\n  OR has_permission(uid(), 'salary_slip_generate')\n)","DROP POLICY IF EXISTS \\"用户可以更新工资明细\\" ON salary_items","CREATE POLICY \\"用户可以更新工资明细\\"\nON salary_items\nFOR UPDATE\nTO public\nUSING (\n  has_permission(uid(), 'salary_record_manage')\n)","DROP POLICY IF EXISTS \\"用户可以删除工资明细\\" ON salary_items","CREATE POLICY \\"用户可以删除工资明细\\"\nON salary_items\nFOR DELETE\nTO public\nUSING (\n  has_permission(uid(), 'salary_record_manage')\n)","DROP POLICY IF EXISTS \\"用户可以查看工资明细\\" ON salary_items","CREATE POLICY \\"用户可以查看工资明细\\"\nON salary_items\nFOR SELECT\nTO public\nUSING (\n  has_permission(uid(), 'salary_record_manage')\n  OR has_permission(uid(), 'salary_record_view')\n  OR employee_id = uid()\n)","-- 修复salary_signatures的策略\nDROP POLICY IF EXISTS \\"salary_signatures_insert_policy\\" ON salary_signatures","CREATE POLICY \\"salary_signatures_insert_policy\\"\nON salary_signatures\nFOR INSERT\nTO public\nWITH CHECK (\n  is_super_admin(uid())\n  OR has_permission(uid(), 'salary_record_manage')\n  OR has_permission(uid(), 'salary_slip_send')\n  OR can_access_company_data(uid(), company_id)\n)"}	fix_salary_policies_with_correct_permission_code
00071	{"-- 删除旧函数\nDROP FUNCTION IF EXISTS public.generate_sign_token()","DROP FUNCTION IF EXISTS public.update_sign_token(uuid)","DROP FUNCTION IF EXISTS public.batch_update_sign_tokens(uuid[])","-- 重新创建generate_sign_token函数，确保使用正确的schema\nCREATE OR REPLACE FUNCTION public.generate_sign_token()\nRETURNS TEXT\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nBEGIN\n  -- 使用pgcrypto扩展的gen_random_bytes函数\n  RETURN encode(public.gen_random_bytes(32), 'hex');\nEND;\n$$","-- 重新创建update_sign_token函数\nCREATE OR REPLACE FUNCTION public.update_sign_token(signature_id UUID)\nRETURNS TEXT\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  new_token TEXT;\nBEGIN\n  -- 生成新token\n  new_token := public.generate_sign_token();\n  \n  -- 更新签署记录\n  UPDATE salary_signatures\n  SET \n    sign_token = new_token,\n    sign_token_expires_at = NOW() + INTERVAL '30 days',\n    updated_at = NOW()\n  WHERE id = signature_id;\n  \n  RETURN new_token;\nEND;\n$$","-- 重新创建batch_update_sign_tokens函数\nCREATE OR REPLACE FUNCTION public.batch_update_sign_tokens(signature_ids UUID[])\nRETURNS TABLE(id UUID, token TEXT)\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  sig_id UUID;\n  new_token TEXT;\nBEGIN\n  FOREACH sig_id IN ARRAY signature_ids\n  LOOP\n    -- 生成新token\n    new_token := public.generate_sign_token();\n    \n    -- 更新签署记录\n    UPDATE salary_signatures\n    SET \n      sign_token = new_token,\n      sign_token_expires_at = NOW() + INTERVAL '30 days',\n      updated_at = NOW()\n    WHERE salary_signatures.id = sig_id;\n    \n    -- 返回结果\n    id := sig_id;\n    token := new_token;\n    RETURN NEXT;\n  END LOOP;\nEND;\n$$"}	fix_generate_sign_token_function
00072	{"-- 删除旧函数\nDROP FUNCTION IF EXISTS public.generate_sign_token()","DROP FUNCTION IF EXISTS public.update_sign_token(uuid)","DROP FUNCTION IF EXISTS public.batch_update_sign_tokens(uuid[])","-- 重新创建generate_sign_token函数，使用正确的schema引用\nCREATE OR REPLACE FUNCTION public.generate_sign_token()\nRETURNS TEXT\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nBEGIN\n  -- gen_random_bytes在extensions schema中，不需要指定schema\n  RETURN encode(gen_random_bytes(32), 'hex');\nEND;\n$$","-- 重新创建update_sign_token函数\nCREATE OR REPLACE FUNCTION public.update_sign_token(signature_id UUID)\nRETURNS TEXT\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  new_token TEXT;\nBEGIN\n  -- 生成新token\n  new_token := generate_sign_token();\n  \n  -- 更新签署记录\n  UPDATE salary_signatures\n  SET \n    sign_token = new_token,\n    sign_token_expires_at = NOW() + INTERVAL '30 days',\n    updated_at = NOW()\n  WHERE id = signature_id;\n  \n  RETURN new_token;\nEND;\n$$","-- 重新创建batch_update_sign_tokens函数\nCREATE OR REPLACE FUNCTION public.batch_update_sign_tokens(signature_ids UUID[])\nRETURNS TABLE(id UUID, token TEXT)\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  sig_id UUID;\n  new_token TEXT;\nBEGIN\n  FOREACH sig_id IN ARRAY signature_ids\n  LOOP\n    -- 生成新token\n    new_token := generate_sign_token();\n    \n    -- 更新签署记录\n    UPDATE salary_signatures\n    SET \n      sign_token = new_token,\n      sign_token_expires_at = NOW() + INTERVAL '30 days',\n      updated_at = NOW()\n    WHERE salary_signatures.id = sig_id;\n    \n    -- 返回结果\n    id := sig_id;\n    token := new_token;\n    RETURN NEXT;\n  END LOOP;\nEND;\n$$"}	fix_generate_sign_token_use_pg_catalog
00073	{"-- 创建考勤签署记录表\nCREATE TABLE IF NOT EXISTS attendance_signatures (\n  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,\n  attendance_record_id UUID NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,\n  year INTEGER NOT NULL,\n  month INTEGER NOT NULL,\n  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'rejected')),\n  sent_at TIMESTAMPTZ,\n  signed_at TIMESTAMPTZ,\n  sign_token TEXT,\n  sign_token_expires_at TIMESTAMPTZ,\n  signature_data TEXT,\n  reject_reason TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- 创建索引\nCREATE INDEX IF NOT EXISTS idx_attendance_signatures_company ON attendance_signatures(company_id)","CREATE INDEX IF NOT EXISTS idx_attendance_signatures_employee ON attendance_signatures(employee_id)","CREATE INDEX IF NOT EXISTS idx_attendance_signatures_status ON attendance_signatures(status)","CREATE INDEX IF NOT EXISTS idx_attendance_signatures_year_month ON attendance_signatures(year, month)","-- 启用RLS\nALTER TABLE attendance_signatures ENABLE ROW LEVEL SECURITY","-- RLS策略：查看权限\nCREATE POLICY \\"attendance_signatures_select\\" ON attendance_signatures\n  FOR SELECT\n  USING (\n    has_permission(uid(), 'attendance_sign_view')\n    OR has_permission(uid(), 'attendance_sign_send')\n    OR has_permission(uid(), 'attendance_sign_manage')\n  )","-- RLS策略：插入权限\nCREATE POLICY \\"attendance_signatures_insert\\" ON attendance_signatures\n  FOR INSERT\n  WITH CHECK (\n    has_permission(uid(), 'attendance_sign_send')\n    OR has_permission(uid(), 'attendance_sign_manage')\n  )","-- RLS策略：更新权限\nCREATE POLICY \\"attendance_signatures_update\\" ON attendance_signatures\n  FOR UPDATE\n  USING (\n    has_permission(uid(), 'attendance_sign_manage')\n    OR has_permission(uid(), 'attendance_sign_send')\n  )","-- RLS策略：删除权限\nCREATE POLICY \\"attendance_signatures_delete\\" ON attendance_signatures\n  FOR DELETE\n  USING (\n    has_permission(uid(), 'attendance_sign_manage')\n  )"}	create_attendance_signatures_table_v2
00074	{"-- 将employees表的household_address字段改为可空\nALTER TABLE employees ALTER COLUMN household_address DROP NOT NULL"}	make_household_address_nullable
00075	{"-- 将employees表的insurance_start_date字段改为可空\nALTER TABLE employees ALTER COLUMN insurance_start_date DROP NOT NULL"}	make_insurance_start_date_nullable
00076	{"-- 修改salary_structure_templates表，允许company_id为NULL以支持通用模板\nALTER TABLE salary_structure_templates ALTER COLUMN company_id DROP NOT NULL","-- 添加注释说明\nCOMMENT ON COLUMN salary_structure_templates.company_id IS '所属公司ID，NULL表示通用模板，所有公司都可使用'","-- 添加is_universal字段，明确标识通用模板\nALTER TABLE salary_structure_templates ADD COLUMN IF NOT EXISTS is_universal BOOLEAN DEFAULT false","COMMENT ON COLUMN salary_structure_templates.is_universal IS '是否为通用模板，通用模板可被所有公司使用'","-- 更新现有的NULL company_id记录为通用模板\nUPDATE salary_structure_templates SET is_universal = true WHERE company_id IS NULL","-- 创建索引以提高查询性能\nCREATE INDEX IF NOT EXISTS idx_salary_structure_templates_is_universal ON salary_structure_templates(is_universal) WHERE is_universal = true"}	add_universal_salary_templates
00077	{"-- 插入一个默认的通用工资结构模板\nINSERT INTO salary_structure_templates (\n  company_id,\n  name,\n  description,\n  fields,\n  is_default,\n  is_universal,\n  created_at,\n  updated_at\n) VALUES (\n  NULL, -- 通用模板，不属于任何公司\n  '标准工资结构模板',\n  '适用于大多数企业的标准工资结构，包含基本工资、绩效奖金、各项补贴和扣除项',\n  '[\n    {\\"name\\": \\"基本工资\\", \\"code\\": \\"base_salary\\", \\"type\\": \\"number\\", \\"required\\": true},\n    {\\"name\\": \\"岗位工资\\", \\"code\\": \\"position_salary\\", \\"type\\": \\"number\\", \\"required\\": false},\n    {\\"name\\": \\"绩效奖金\\", \\"code\\": \\"performance_bonus\\", \\"type\\": \\"number\\", \\"required\\": false},\n    {\\"name\\": \\"全勤奖\\", \\"code\\": \\"attendance_bonus\\", \\"type\\": \\"number\\", \\"required\\": false},\n    {\\"name\\": \\"加班费\\", \\"code\\": \\"overtime_pay\\", \\"type\\": \\"number\\", \\"required\\": false},\n    {\\"name\\": \\"交通补贴\\", \\"code\\": \\"transport_allowance\\", \\"type\\": \\"number\\", \\"required\\": false},\n    {\\"name\\": \\"餐补\\", \\"code\\": \\"meal_allowance\\", \\"type\\": \\"number\\", \\"required\\": false},\n    {\\"name\\": \\"通讯补贴\\", \\"code\\": \\"communication_allowance\\", \\"type\\": \\"number\\", \\"required\\": false},\n    {\\"name\\": \\"应发工资\\", \\"code\\": \\"gross_salary\\", \\"type\\": \\"number\\", \\"required\\": true},\n    {\\"name\\": \\"社保个人部分\\", \\"code\\": \\"social_insurance_personal\\", \\"type\\": \\"number\\", \\"required\\": false},\n    {\\"name\\": \\"公积金个人部分\\", \\"code\\": \\"housing_fund_personal\\", \\"type\\": \\"number\\", \\"required\\": false},\n    {\\"name\\": \\"个人所得税\\", \\"code\\": \\"personal_income_tax\\", \\"type\\": \\"number\\", \\"required\\": false},\n    {\\"name\\": \\"其他扣款\\", \\"code\\": \\"other_deductions\\", \\"type\\": \\"number\\", \\"required\\": false},\n    {\\"name\\": \\"实发工资\\", \\"code\\": \\"net_salary\\", \\"type\\": \\"number\\", \\"required\\": true}\n  ]'::jsonb,\n  true, -- 设为默认模板\n  true, -- 设为通用模板\n  now(),\n  now()\n) ON CONFLICT DO NOTHING","-- 如果已存在则不插入\n\n-- 添加注释\nCOMMENT ON TABLE salary_structure_templates IS '工资结构模板表，支持通用模板（company_id为NULL）和公司专属模板'"}	insert_default_universal_salary_template
00078	{"-- 修改工资结构模板的RLS策略，允许查看通用模板\n\n-- 删除旧的SELECT策略\nDROP POLICY IF EXISTS \\"用户可以查看工资结构模板\\" ON salary_structure_templates","-- 创建新的SELECT策略，允许查看通用模板和有权限的公司模板\nCREATE POLICY \\"用户可以查看工资结构模板\\" ON salary_structure_templates\n  FOR SELECT\n  USING (\n    is_super_admin(auth.uid()) \n    OR is_universal = true  -- 所有用户都可以查看通用模板\n    OR can_access_company_data(auth.uid(), company_id)\n  )","-- 修改INSERT策略，允许创建通用模板\nDROP POLICY IF EXISTS \\"用户可以创建工资结构模板\\" ON salary_structure_templates","CREATE POLICY \\"用户可以创建工资结构模板\\" ON salary_structure_templates\n  FOR INSERT\n  WITH CHECK (\n    is_super_admin(auth.uid()) \n    OR (is_universal = true AND is_super_admin(auth.uid()))  -- 只有超级管理员可以创建通用模板\n    OR can_access_company_data(auth.uid(), company_id)\n  )","-- 修改UPDATE策略，允许更新通用模板\nDROP POLICY IF EXISTS \\"用户可以更新工资结构模板\\" ON salary_structure_templates","CREATE POLICY \\"用户可以更新工资结构模板\\" ON salary_structure_templates\n  FOR UPDATE\n  USING (\n    is_super_admin(auth.uid()) \n    OR is_universal = true  -- 所有用户都可以编辑通用模板\n    OR can_access_company_data(auth.uid(), company_id)\n  )\n  WITH CHECK (\n    is_super_admin(auth.uid()) \n    OR is_universal = true  -- 所有用户都可以编辑通用模板\n    OR can_access_company_data(auth.uid(), company_id)\n  )","-- 修改DELETE策略，只有超级管理员可以删除通用模板\nDROP POLICY IF EXISTS \\"用户可以删除工资结构模板\\" ON salary_structure_templates","CREATE POLICY \\"用户可以删除工资结构模板\\" ON salary_structure_templates\n  FOR DELETE\n  USING (\n    is_super_admin(auth.uid()) \n    OR (NOT is_universal AND can_access_company_data(auth.uid(), company_id))  -- 普通用户只能删除公司模板\n  )","COMMENT ON POLICY \\"用户可以查看工资结构模板\\" ON salary_structure_templates IS '允许用户查看通用模板和有权限的公司模板'","COMMENT ON POLICY \\"用户可以创建工资结构模板\\" ON salary_structure_templates IS '允许超级管理员创建通用模板，普通用户创建公司模板'","COMMENT ON POLICY \\"用户可以更新工资结构模板\\" ON salary_structure_templates IS '允许所有用户编辑通用模板和有权限的公司模板'","COMMENT ON POLICY \\"用户可以删除工资结构模板\\" ON salary_structure_templates IS '只允许超级管理员删除通用模板，普通用户可删除公司模板'"}	fix_salary_template_rls_for_universal
00079	{"-- 在companies表中添加统一社会信用代码和法定代表人字段\n\n-- 添加统一社会信用代码字段\nALTER TABLE companies \nADD COLUMN IF NOT EXISTS credit_no VARCHAR(255)","-- 添加法定代表人字段\nALTER TABLE companies \nADD COLUMN IF NOT EXISTS legal_person VARCHAR(255)","-- 添加字段注释\nCOMMENT ON COLUMN companies.credit_no IS '统一社会信用代码'","COMMENT ON COLUMN companies.legal_person IS '法定代表人'","-- 创建索引以提高查询性能\nCREATE INDEX IF NOT EXISTS idx_companies_credit_no ON companies(credit_no)"}	add_company_credit_and_legal_person
00080	{"-- 为员工表添加唯一约束，防止身份证号码和手机号码重复\n\n-- 步骤1: 处理重复的手机号码（为重复的记录添加后缀）\nWITH duplicates AS (\n  SELECT id, phone, \n         ROW_NUMBER() OVER (PARTITION BY phone ORDER BY created_at) as rn\n  FROM employees\n  WHERE phone IS NOT NULL\n)\nUPDATE employees e\nSET phone = d.phone || '_dup_' || d.rn\nFROM duplicates d\nWHERE e.id = d.id AND d.rn > 1","-- 步骤2: 处理重复的身份证号码（为重复的记录添加后缀）\nWITH duplicates AS (\n  SELECT id, id_card_number, \n         ROW_NUMBER() OVER (PARTITION BY id_card_number ORDER BY created_at) as rn\n  FROM employees\n  WHERE id_card_number IS NOT NULL\n)\nUPDATE employees e\nSET id_card_number = d.id_card_number || '_dup_' || d.rn\nFROM duplicates d\nWHERE e.id = d.id AND d.rn > 1","-- 步骤3: 添加身份证号码唯一约束\nALTER TABLE employees \nADD CONSTRAINT unique_id_card_number UNIQUE (id_card_number)","-- 步骤4: 添加手机号码唯一约束\nALTER TABLE employees \nADD CONSTRAINT unique_phone UNIQUE (phone)","-- 添加注释\nCOMMENT ON CONSTRAINT unique_id_card_number ON employees IS '身份证号码唯一约束'","COMMENT ON CONSTRAINT unique_phone ON employees IS '手机号码唯一约束'"}	add_unique_constraints_to_employees
00081	{"-- 为薪酬签署状态枚举添加已撤回状态\nALTER TYPE salary_signature_status ADD VALUE IF NOT EXISTS 'revoked'","-- 添加注释\nCOMMENT ON TYPE salary_signature_status IS '薪酬签署状态: pending(待签署), sent(已发送), signed(已签署), rejected(已拒签), revoked(已撤回)'"}	add_revoked_status_to_salary_signatures
00082	{"-- 1. 修改employees表，增加劳动合同签订次数字段\nALTER TABLE employees \nADD COLUMN IF NOT EXISTS contract_count INTEGER DEFAULT 0","COMMENT ON COLUMN employees.contract_count IS '劳动合同签订次数'","-- 2. 创建劳动合同历史记录表\nCREATE TABLE IF NOT EXISTS labor_contract_history (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  contract_number INTEGER NOT NULL,\n  start_date DATE NOT NULL,\n  end_date DATE,\n  contract_type TEXT NOT NULL DEFAULT '固定期限',\n  notes TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n)","COMMENT ON TABLE labor_contract_history IS '劳动合同历史记录表'","COMMENT ON COLUMN labor_contract_history.contract_number IS '第几次合同'","COMMENT ON COLUMN labor_contract_history.start_date IS '合同开始日期'","COMMENT ON COLUMN labor_contract_history.end_date IS '合同结束日期（无固定期限时为空）'","COMMENT ON COLUMN labor_contract_history.contract_type IS '合同类型：固定期限、无固定期限'","-- 创建索引\nCREATE INDEX IF NOT EXISTS idx_labor_contract_history_employee ON labor_contract_history(employee_id)","CREATE INDEX IF NOT EXISTS idx_labor_contract_history_company ON labor_contract_history(company_id)","-- 3. 创建员工文书签署记录表\nCREATE TABLE IF NOT EXISTS employee_document_records (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,\n  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n  document_type TEXT NOT NULL,\n  document_name TEXT NOT NULL,\n  template_category TEXT,\n  signed_at TIMESTAMPTZ,\n  signed_year INTEGER,\n  file_url TEXT,\n  signing_record_id UUID REFERENCES signing_records(id) ON DELETE SET NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n)","COMMENT ON TABLE employee_document_records IS '员工文书签署记录表'","COMMENT ON COLUMN employee_document_records.document_type IS '文书类型：劳动合同、保密协议、员工手册等'","COMMENT ON COLUMN employee_document_records.document_name IS '文书名称'","COMMENT ON COLUMN employee_document_records.template_category IS '文书模板大类：入职管理、在职管理、离职管理等'","COMMENT ON COLUMN employee_document_records.signed_at IS '签署时间'","COMMENT ON COLUMN employee_document_records.signed_year IS '签署年份（用于筛选）'","COMMENT ON COLUMN employee_document_records.signing_record_id IS '关联的签署记录ID'","-- 创建索引\nCREATE INDEX IF NOT EXISTS idx_employee_document_records_employee ON employee_document_records(employee_id)","CREATE INDEX IF NOT EXISTS idx_employee_document_records_company ON employee_document_records(company_id)","CREATE INDEX IF NOT EXISTS idx_employee_document_records_type ON employee_document_records(document_type)","CREATE INDEX IF NOT EXISTS idx_employee_document_records_year ON employee_document_records(signed_year)","-- 4. 启用RLS\nALTER TABLE labor_contract_history ENABLE ROW LEVEL SECURITY","ALTER TABLE employee_document_records ENABLE ROW LEVEL SECURITY","-- 5. 创建RLS策略\n-- labor_contract_history表策略\nCREATE POLICY \\"允许认证用户查看劳动合同历史\\" ON labor_contract_history\n  FOR SELECT TO authenticated USING (true)","CREATE POLICY \\"允许认证用户插入劳动合同历史\\" ON labor_contract_history\n  FOR INSERT TO authenticated WITH CHECK (true)","CREATE POLICY \\"允许认证用户更新劳动合同历史\\" ON labor_contract_history\n  FOR UPDATE TO authenticated USING (true)","CREATE POLICY \\"允许认证用户删除劳动合同历史\\" ON labor_contract_history\n  FOR DELETE TO authenticated USING (true)","-- employee_document_records表策略\nCREATE POLICY \\"允许认证用户查看员工文书记录\\" ON employee_document_records\n  FOR SELECT TO authenticated USING (true)","CREATE POLICY \\"允许认证用户插入员工文书记录\\" ON employee_document_records\n  FOR INSERT TO authenticated WITH CHECK (true)","CREATE POLICY \\"允许认证用户更新员工文书记录\\" ON employee_document_records\n  FOR UPDATE TO authenticated USING (true)","CREATE POLICY \\"允许认证用户删除员工文书记录\\" ON employee_document_records\n  FOR DELETE TO authenticated USING (true)"}	add_labor_contract_management
00083	{"-- 删除员工表中的工号字段\nALTER TABLE employees DROP COLUMN IF EXISTS employee_number","-- 删除工号的唯一约束（如果存在）\n-- 注意：约束可能已经随着列的删除而自动删除，这里是为了确保\nDO $$ \nBEGIN\n  IF EXISTS (\n    SELECT 1 FROM pg_constraint \n    WHERE conname = 'employees_employee_number_key'\n  ) THEN\n    ALTER TABLE employees DROP CONSTRAINT employees_employee_number_key;\n  END IF;\nEND $$"}	remove_employee_number_field
00084	{"-- 添加完整详细的系统权限\n-- 本迁移文件为九头鸟人事托管签署系统添加所有功能模块的详细权限\n\n-- ==================== 1. 公司管理权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('company_view', '公司查看', '查看公司列表和详情'),\n('company_create', '公司新增', '新增公司信息'),\n('company_edit', '公司编辑', '编辑公司信息'),\n('company_delete', '公司删除', '删除公司记录'),\n('company_export', '公司导出', '导出公司数据')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 2. 员工管理权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('employee_view', '员工查看', '查看员工列表和详情'),\n('employee_create', '员工新增', '新增员工信息'),\n('employee_edit', '员工编辑', '编辑员工信息'),\n('employee_delete', '员工删除', '删除员工记录'),\n('employee_export', '员工导出', '导出员工数据'),\n('employee_status_view', '员工状态查看', '查看员工状态'),\n('employee_status_edit', '员工状态编辑', '修改员工状态')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 3. 文书模板权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('template_view', '模板查看', '查看文书模板列表和详情'),\n('template_create', '模板新增', '新增文书模板'),\n('template_edit', '模板编辑', '编辑文书模板'),\n('template_delete', '模板删除', '删除文书模板'),\n('template_enable', '模板启用', '启用或禁用文书模板')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 4. 文书签署权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('signing_view', '签署查看', '查看签署记录和状态'),\n('signing_initiate', '签署发起', '发起文书签署流程'),\n('signing_revoke', '签署撤回', '撤回已发起的签署'),\n('signing_delete', '签署删除', '删除签署记录'),\n('signing_export', '签署导出', '导出签署数据'),\n('signing_download', '签署下载', '下载已签署文件'),\n('signing_statistics', '签署统计', '查看签署数据统计')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 5. 薪资管理权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('salary_structure_view', '工资结构查看', '查看工资结构模板'),\n('salary_structure_create', '工资结构新增', '新增工资结构模板'),\n('salary_structure_edit', '工资结构编辑', '编辑工资结构模板'),\n('salary_structure_delete', '工资结构删除', '删除工资结构模板'),\n('salary_record_view', '工资记录查看', '查看工资记录'),\n('salary_record_upload', '工资表上传', '上传工资表文件'),\n('salary_record_edit', '工资记录编辑', '编辑工资记录'),\n('salary_record_delete', '工资记录删除', '删除工资记录'),\n('salary_record_export', '工资记录导出', '导出工资数据'),\n('salary_signing_view', '工资条签署查看', '查看工资条签署状态'),\n('salary_signing_initiate', '工资条签署发起', '发起工资条签署'),\n('salary_signing_revoke', '工资条签署撤回', '撤回工资条签署'),\n('salary_signing_delete', '工资条签署删除', '删除工资条签署记录')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 6. 考勤管理权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('attendance_view', '考勤查看', '查看考勤记录'),\n('attendance_upload', '考勤上传', '上传考勤表文件'),\n('attendance_edit', '考勤编辑', '编辑考勤记录'),\n('attendance_delete', '考勤删除', '删除考勤记录'),\n('attendance_export', '考勤导出', '导出考勤数据'),\n('attendance_signing_view', '考勤签署查看', '查看考勤确认签署状态'),\n('attendance_signing_initiate', '考勤签署发起', '发起考勤确认签署'),\n('attendance_signing_revoke', '考勤签署撤回', '撤回考勤确认签署'),\n('attendance_signing_delete', '考勤签署删除', '删除考勤签署记录')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 7. 用户管理权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('user_view', '用户查看', '查看用户列表和详情'),\n('user_create', '用户新增', '新增系统用户'),\n('user_edit', '用户编辑', '编辑用户信息'),\n('user_delete', '用户删除', '删除或停用用户'),\n('user_role_assign', '用户角色分配', '为用户分配角色')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 8. 角色权限管理 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('role_view', '角色查看', '查看角色列表和详情'),\n('role_create', '角色新增', '新增系统角色'),\n('role_edit', '角色编辑', '编辑角色信息'),\n('role_delete', '角色删除', '删除角色'),\n('role_permission_config', '角色权限配置', '配置角色的权限')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 9. 系统配置权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('system_config_view', '系统配置查看', '查看系统配置'),\n('system_config_edit', '系统配置编辑', '编辑系统配置'),\n('esign_config_view', '电子签配置查看', '查看电子签API配置'),\n('esign_config_edit', '电子签配置编辑', '编辑电子签API配置'),\n('reminder_config_view', '提醒配置查看', '查看提醒配置'),\n('reminder_config_edit', '提醒配置编辑', '编辑提醒配置')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 10. 通知管理权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('notification_view', '通知查看', '查看系统通知'),\n('notification_send', '通知发送', '发送系统通知'),\n('notification_delete', '通知删除', '删除通知记录')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 11. 数据统计权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('dashboard_view', '看板查看', '查看数据看板'),\n('statistics_view', '统计查看', '查看数据统计'),\n('report_view', '报表查看', '查看各类报表'),\n('report_export', '报表导出', '导出报表数据')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 12. 操作日志权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('audit_log_view', '操作日志查看', '查看系统操作日志'),\n('audit_log_export', '操作日志导出', '导出操作日志数据')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 13. 工具箱权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('ai_assistant_use', 'AI助手使用', '使用AI助手功能'),\n('recruitment_query_view', '招聘数据查看', '查看招聘数据查询结果'),\n('recruitment_query_export', '招聘数据导出', '导出招聘数据'),\n('identity_verification_manage', '实名认证管理', '管理实名认证'),\n('identity_verification_view', '实名认证查看', '查看实名认证记录')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 14. 其他权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('subordinate_view', '下属查看', '查看下属员工'),\n('subordinate_manage', '下属管理', '管理下属员工')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 15. 档案下载权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('signed_document_view', '已签文书查看', '查看已签署文书'),\n('signed_document_download', '已签文书下载', '下载已签署文书'),\n('salary_archive_view', '薪酬档案查看', '查看薪酬档案'),\n('salary_archive_download', '薪酬档案下载', '下载薪酬档案')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- 添加注释说明\nCOMMENT ON TABLE permissions IS '系统权限表，存储所有可分配的权限项'","COMMENT ON COLUMN permissions.code IS '权限代码，唯一标识'","COMMENT ON COLUMN permissions.name IS '权限名称，用于显示'","COMMENT ON COLUMN permissions.description IS '权限描述，说明权限的作用'"}	add_complete_detailed_permissions
00085	{"-- 补充完整的系统权限配置\n-- 根据九头鸟人事托管签署系统的实际功能补充缺失的权限\n\n-- ==================== 补充客户管理权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('customer_view', '客户查看', '查看客户列表和详情'),\n('customer_create', '客户新增', '新增客户信息'),\n('customer_edit', '客户编辑', '编辑客户信息'),\n('customer_delete', '客户删除', '删除客户记录'),\n('customer_export', '客户导出', '导出客户数据'),\n('customer_seal_view', '客户签章查看', '查看客户签章使用数据')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 补充公司流转权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('company_transfer', '公司流转', '流转公司所有权'),\n('company_transfer_history_view', '公司流转历史查看', '查看公司流转历史记录')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 补充员工导入权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('employee_import', '员工批量导入', '批量导入员工数据')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 补充文书历史记录权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('document_history_view', '文书历史查看', '查看员工文书签署历史记录'),\n('document_history_export', '文书历史导出', '导出文书历史数据')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 补充批量操作权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('batch_download', '批量下载', '批量下载记录数据'),\n('batch_revoke', '批量撤回', '批量撤回签署记录'),\n('batch_delete', '批量删除', '批量删除记录')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 补充工资表拆分权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('salary_split', '工资表拆分', '将工资表拆分为工资条')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 补充短信发送权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('sms_send', '短信发送', '发送签署短信通知'),\n('sms_batch_send', '批量短信发送', '批量发送签署短信')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 补充工资结构模板权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('salary_template_view', '工资结构模板查看', '查看工资结构模板'),\n('salary_template_create', '工资结构模板新增', '新增工资结构模板'),\n('salary_template_edit', '工资结构模板编辑', '编辑工资结构模板'),\n('salary_template_delete', '工资结构模板删除', '删除工资结构模板')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description","-- ==================== 补充工资条管理权限 ====================\nINSERT INTO permissions (code, name, description) VALUES\n('salary_item_view', '工资条查看', '查看工资条列表'),\n('salary_item_export', '工资条导出', '导出工资条数据')\nON CONFLICT (code) DO UPDATE SET\n  name = EXCLUDED.name,\n  description = EXCLUDED.description"}	supplement_complete_permissions
00086	{"-- 配置预设角色的完整权限\n-- 为超级管理员、主管、员工三个预设角色配置详细权限\n-- 给系统角色创建唯一索引（name + is_system_role）\nCREATE UNIQUE INDEX IF NOT EXISTS idx_roles_name_system_role ON roles(name, is_system_role)\nWHERE is_system_role = true","-- ==================== 0. 创建预设角色（如果不存在） ====================\nINSERT INTO roles (name, description, is_system_role) VALUES\n('超级管理员', '系统最高权限角色，拥有所有功能权限', true),\n('主管', '业务主管角色，拥有大部分业务功能权限', true),\n('员工', '普通员工角色，只有基本查看权限', true)\nON CONFLICT (name, is_system_role) WHERE is_system_role = true DO UPDATE SET\n  description = EXCLUDED.description","-- ==================== 1. 超级管理员角色权限配置 ====================\n-- 超级管理员拥有所有权限\n\n-- 先删除超级管理员的旧权限配置\nDELETE FROM role_permissions WHERE role_id = (SELECT id FROM roles WHERE name = '超级管理员' AND is_system_role = true)","-- 为超级管理员分配所有权限\nINSERT INTO role_permissions (role_id, permission_id)\nSELECT \n  (SELECT id FROM roles WHERE name = '超级管理员' AND is_system_role = true),\n  id\nFROM permissions\nON CONFLICT DO NOTHING","-- ==================== 2. 主管角色权限配置 ====================\n-- 主管拥有大部分业务权限，但不包括系统配置和用户角色管理\n\n-- 先删除主管的旧权限配置\nDELETE FROM role_permissions WHERE role_id = (SELECT id FROM roles WHERE name = '主管' AND is_system_role = true)","-- 为主管分配权限\nINSERT INTO role_permissions (role_id, permission_id)\nSELECT \n  (SELECT id FROM roles WHERE name = '主管' AND is_system_role = true),\n  id\nFROM permissions\nWHERE code IN (\n  -- 看板\n  'dashboard_view',\n  'statistics_view',\n  'report_view',\n  'report_export',\n  \n  -- 客户管理\n  'customer_view',\n  'customer_create',\n  'customer_edit',\n  'customer_export',\n  'customer_seal_view',\n  \n  -- 公司管理\n  'company_view',\n  'company_create',\n  'company_edit',\n  'company_export',\n  'company_transfer_history_view',\n  \n  -- 员工管理\n  'employee_view',\n  'employee_create',\n  'employee_edit',\n  'employee_delete',\n  'employee_export',\n  'employee_import',\n  'employee_status_view',\n  'employee_status_edit',\n  \n  -- 文书模板\n  'template_view',\n  'template_create',\n  'template_edit',\n  'template_enable',\n  \n  -- 文书签署\n  'signing_view',\n  'signing_initiate',\n  'signing_revoke',\n  'signing_delete',\n  'signing_export',\n  'signing_download',\n  'signing_statistics',\n  \n  -- 文书档案\n  'signed_document_view',\n  'signed_document_download',\n  'document_history_view',\n  'document_history_export',\n  \n  -- 工资结构\n  'salary_template_view',\n  'salary_template_create',\n  'salary_template_edit',\n  \n  -- 工资表管理\n  'salary_record_view',\n  'salary_record_upload',\n  'salary_record_edit',\n  'salary_record_delete',\n  'salary_record_export',\n  'salary_split',\n  \n  -- 工资条管理\n  'salary_item_view',\n  'salary_item_export',\n  \n  -- 薪酬签署\n  'salary_signing_view',\n  'salary_signing_initiate',\n  'salary_signing_revoke',\n  'salary_signing_delete',\n  \n  -- 薪酬档案\n  'salary_archive_view',\n  'salary_archive_download',\n  \n  -- 考勤管理\n  'attendance_view',\n  'attendance_upload',\n  'attendance_edit',\n  'attendance_delete',\n  'attendance_export',\n  'attendance_signing_view',\n  'attendance_signing_initiate',\n  'attendance_signing_revoke',\n  'attendance_signing_delete',\n  \n  -- 批量操作\n  'batch_download',\n  'batch_revoke',\n  'batch_delete',\n  \n  -- 短信通知\n  'sms_send',\n  'sms_batch_send',\n  \n  -- 通知中心\n  'notification_view',\n  'notification_send',\n  \n  -- 操作日志\n  'audit_log_view',\n  'audit_log_export',\n  \n  -- 工具箱\n  'ai_assistant_use',\n  'recruitment_query_view',\n  'recruitment_query_export',\n  \n  -- 下属管理\n  'subordinate_view',\n  'subordinate_manage'\n)\nON CONFLICT DO NOTHING","-- ==================== 3. 员工角色权限配置 ====================\n-- 员工只有基本的查看权限\n\n-- 先删除员工的旧权限配置\nDELETE FROM role_permissions WHERE role_id = (SELECT id FROM roles WHERE name = '员工' AND is_system_role = true)","-- 为员工分配权限\nINSERT INTO role_permissions (role_id, permission_id)\nSELECT \n  (SELECT id FROM roles WHERE name = '员工' AND is_system_role = true),\n  id\nFROM permissions\nWHERE code IN (\n  -- 看板\n  'dashboard_view',\n  \n  -- 通知中心\n  'notification_view',\n  \n  -- 工具箱\n  'ai_assistant_use'\n)\nON CONFLICT DO NOTHING","-- 添加注释\nCOMMENT ON TABLE role_permissions IS '角色权限关联表，存储角色和权限的多对多关系'"}	configure_preset_role_complete_permissions
00087	{"-- 创建预设角色并配置权限\n\n-- 创建预设角色（如果不存在）\nDO $$\nDECLARE\n  v_super_admin_id uuid;\n  v_manager_id uuid;\n  v_employee_id uuid;\nBEGIN\n  -- 创建或获取超级管理员角色\n  INSERT INTO roles (name, description, is_system_role)\n  VALUES ('超级管理员', '系统最高权限角色，拥有所有功能权限', true)\n  ON CONFLICT DO NOTHING\n  RETURNING id INTO v_super_admin_id;\n  \n  IF v_super_admin_id IS NULL THEN\n    SELECT id INTO v_super_admin_id FROM roles WHERE name = '超级管理员' AND is_system_role = true;\n  END IF;\n  \n  -- 创建或获取主管角色\n  INSERT INTO roles (name, description, is_system_role)\n  VALUES ('主管', '业务主管角色，拥有大部分业务功能权限', true)\n  ON CONFLICT DO NOTHING\n  RETURNING id INTO v_manager_id;\n  \n  IF v_manager_id IS NULL THEN\n    SELECT id INTO v_manager_id FROM roles WHERE name = '主管' AND is_system_role = true;\n  END IF;\n  \n  -- 创建或获取员工角色\n  INSERT INTO roles (name, description, is_system_role)\n  VALUES ('员工', '普通员工角色，只有基本查看权限', true)\n  ON CONFLICT DO NOTHING\n  RETURNING id INTO v_employee_id;\n  \n  IF v_employee_id IS NULL THEN\n    SELECT id INTO v_employee_id FROM roles WHERE name = '员工' AND is_system_role = true;\n  END IF;\n  \n  -- 删除旧的权限配置\n  DELETE FROM role_permissions WHERE role_id IN (v_super_admin_id, v_manager_id, v_employee_id);\n  \n  -- 为超级管理员分配所有权限\n  INSERT INTO role_permissions (role_id, permission_id)\n  SELECT v_super_admin_id, id FROM permissions;\n  \n  -- 为主管分配权限\n  INSERT INTO role_permissions (role_id, permission_id)\n  SELECT v_manager_id, id FROM permissions\n  WHERE code IN (\n    'dashboard_view', 'statistics_view', 'report_view', 'report_export',\n    'customer_view', 'customer_create', 'customer_edit', 'customer_export', 'customer_seal_view',\n    'company_view', 'company_create', 'company_edit', 'company_export', 'company_transfer_history_view',\n    'employee_view', 'employee_create', 'employee_edit', 'employee_delete', 'employee_export', 'employee_import', 'employee_status_view', 'employee_status_edit',\n    'template_view', 'template_create', 'template_edit', 'template_enable',\n    'signing_view', 'signing_initiate', 'signing_revoke', 'signing_delete', 'signing_export', 'signing_download', 'signing_statistics',\n    'signed_document_view', 'signed_document_download', 'document_history_view', 'document_history_export',\n    'salary_template_view', 'salary_template_create', 'salary_template_edit',\n    'salary_record_view', 'salary_record_upload', 'salary_record_edit', 'salary_record_delete', 'salary_record_export', 'salary_split',\n    'salary_item_view', 'salary_item_export',\n    'salary_signing_view', 'salary_signing_initiate', 'salary_signing_revoke', 'salary_signing_delete',\n    'salary_archive_view', 'salary_archive_download',\n    'attendance_view', 'attendance_upload', 'attendance_edit', 'attendance_delete', 'attendance_export',\n    'attendance_signing_view', 'attendance_signing_initiate', 'attendance_signing_revoke', 'attendance_signing_delete',\n    'batch_download', 'batch_revoke', 'batch_delete',\n    'sms_send', 'sms_batch_send',\n    'notification_view', 'notification_send',\n    'audit_log_view', 'audit_log_export',\n    'ai_assistant_use', 'recruitment_query_view', 'recruitment_query_export',\n    'subordinate_view', 'subordinate_manage'\n  );\n  \n  -- 为员工分配权限\n  INSERT INTO role_permissions (role_id, permission_id)\n  SELECT v_employee_id, id FROM permissions\n  WHERE code IN ('dashboard_view', 'notification_view', 'ai_assistant_use');\n  \nEND $$"}	create_preset_roles_and_permissions
00088	{"-- 修复薪酬签署删除策略\n-- 改为基于权限检查，允许拥有删除权限的用户删除\n\n-- 删除旧的删除策略\nDROP POLICY IF EXISTS salary_signatures_delete_policy ON salary_signatures","-- 创建新的删除策略，基于权限检查\nCREATE POLICY salary_signatures_delete_policy ON salary_signatures\n  FOR DELETE\n  USING (\n    is_super_admin(auth.uid()) \n    OR has_permission(auth.uid(), 'salary_signing_delete')\n  )"}	fix_salary_signatures_delete_policy
00089	{"-- 修复考勤签署删除策略\n-- 改为基于权限检查，允许拥有删除权限的用户删除\n\n-- 删除旧的删除策略\nDROP POLICY IF EXISTS attendance_signatures_delete_policy ON attendance_signatures","-- 创建新的删除策略，基于权限检查\nCREATE POLICY attendance_signatures_delete_policy ON attendance_signatures\n  FOR DELETE\n  USING (\n    is_super_admin(auth.uid()) \n    OR has_permission(auth.uid(), 'attendance_signing_delete')\n  )"}	fix_attendance_signatures_delete_policy
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 248, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 1, false);


--
-- Name: extensions extensions_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: attendance_records attendance_records_company_id_employee_id_month_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_company_id_employee_id_month_key UNIQUE (company_id, employee_id, month);


--
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- Name: attendance_signatures attendance_signatures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_signatures
    ADD CONSTRAINT attendance_signatures_pkey PRIMARY KEY (id);


--
-- Name: companies companies_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_code_key UNIQUE (code);


--
-- Name: companies companies_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_code_unique UNIQUE (code);


--
-- Name: companies companies_contact_phone_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_contact_phone_unique UNIQUE (contact_phone);


--
-- Name: CONSTRAINT companies_contact_phone_unique ON companies; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON CONSTRAINT companies_contact_phone_unique ON public.companies IS '联系电话唯一约束';


--
-- Name: companies companies_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_name_unique UNIQUE (name);


--
-- Name: CONSTRAINT companies_name_unique ON companies; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON CONSTRAINT companies_name_unique ON public.companies IS '公司名称唯一约束';


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: company_code_sequences company_code_sequences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_code_sequences
    ADD CONSTRAINT company_code_sequences_pkey PRIMARY KEY (date_key);


--
-- Name: company_transfers company_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_transfers
    ADD CONSTRAINT company_transfers_pkey PRIMARY KEY (id);


--
-- Name: document_templates document_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_templates
    ADD CONSTRAINT document_templates_pkey PRIMARY KEY (id);


--
-- Name: employee_document_records employee_document_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_document_records
    ADD CONSTRAINT employee_document_records_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: labor_contract_history labor_contract_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labor_contract_history
    ADD CONSTRAINT labor_contract_history_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: operation_logs operation_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operation_logs
    ADD CONSTRAINT operation_logs_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


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
-- Name: reminder_configs reminder_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminder_configs
    ADD CONSTRAINT reminder_configs_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: salary_items salary_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_items
    ADD CONSTRAINT salary_items_pkey PRIMARY KEY (id);


--
-- Name: salary_records salary_records_company_id_year_month_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_records
    ADD CONSTRAINT salary_records_company_id_year_month_key UNIQUE (company_id, year, month);


--
-- Name: salary_records salary_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_records
    ADD CONSTRAINT salary_records_pkey PRIMARY KEY (id);


--
-- Name: salary_signatures salary_signatures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_signatures
    ADD CONSTRAINT salary_signatures_pkey PRIMARY KEY (id);


--
-- Name: salary_signatures salary_signatures_sign_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_signatures
    ADD CONSTRAINT salary_signatures_sign_token_key UNIQUE (sign_token);


--
-- Name: salary_structure_templates salary_structure_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_structure_templates
    ADD CONSTRAINT salary_structure_templates_pkey PRIMARY KEY (id);


--
-- Name: signed_documents signed_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signed_documents
    ADD CONSTRAINT signed_documents_pkey PRIMARY KEY (id);


--
-- Name: signing_records signing_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signing_records
    ADD CONSTRAINT signing_records_pkey PRIMARY KEY (id);


--
-- Name: employees unique_id_card_number; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT unique_id_card_number UNIQUE (id_card_number);


--
-- Name: CONSTRAINT unique_id_card_number ON employees; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON CONSTRAINT unique_id_card_number ON public.employees IS '身份证号码唯一约束';


--
-- Name: employees unique_phone; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT unique_phone UNIQUE (phone);


--
-- Name: CONSTRAINT unique_phone ON employees; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON CONSTRAINT unique_phone ON public.employees IS '手机号码唯一约束';


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_20 messages_2026_03_20_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_20
    ADD CONSTRAINT messages_2026_03_20_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_21 messages_2026_03_21_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_21
    ADD CONSTRAINT messages_2026_03_21_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_22 messages_2026_03_22_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_22
    ADD CONSTRAINT messages_2026_03_22_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_23 messages_2026_03_23_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_23
    ADD CONSTRAINT messages_2026_03_23_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_24 messages_2026_03_24_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_24
    ADD CONSTRAINT messages_2026_03_24_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_25 messages_2026_03_25_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_25
    ADD CONSTRAINT messages_2026_03_25_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_26 messages_2026_03_26_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_26
    ADD CONSTRAINT messages_2026_03_26_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: iceberg_namespaces iceberg_namespaces_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.iceberg_namespaces
    ADD CONSTRAINT iceberg_namespaces_pkey PRIMARY KEY (id);


--
-- Name: iceberg_tables iceberg_tables_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.iceberg_tables
    ADD CONSTRAINT iceberg_tables_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: hooks hooks_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.hooks
    ADD CONSTRAINT hooks_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: supabase_functions_admin
--

ALTER TABLE ONLY supabase_functions.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: extensions_tenant_external_id_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE INDEX extensions_tenant_external_id_index ON _realtime.extensions USING btree (tenant_external_id);


--
-- Name: extensions_tenant_external_id_type_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX extensions_tenant_external_id_type_index ON _realtime.extensions USING btree (tenant_external_id, type);


--
-- Name: tenants_external_id_index; Type: INDEX; Schema: _realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX tenants_external_id_index ON _realtime.tenants USING btree (external_id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_attendance_records_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_records_company ON public.attendance_records USING btree (company_id);


--
-- Name: idx_attendance_records_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_records_employee ON public.attendance_records USING btree (employee_id);


--
-- Name: idx_attendance_records_month; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_records_month ON public.attendance_records USING btree (month);


--
-- Name: idx_attendance_records_pdf_url; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_records_pdf_url ON public.attendance_records USING btree (pdf_url) WHERE (pdf_url IS NOT NULL);


--
-- Name: idx_attendance_signatures_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_signatures_company ON public.attendance_signatures USING btree (company_id);


--
-- Name: idx_attendance_signatures_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_signatures_employee ON public.attendance_signatures USING btree (employee_id);


--
-- Name: idx_attendance_signatures_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_signatures_status ON public.attendance_signatures USING btree (status);


--
-- Name: idx_attendance_signatures_year_month; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_signatures_year_month ON public.attendance_signatures USING btree (year, month);


--
-- Name: idx_companies_created_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_companies_created_by ON public.companies USING btree (created_by);


--
-- Name: idx_companies_credit_no; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_companies_credit_no ON public.companies USING btree (credit_no);


--
-- Name: idx_companies_owner_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_companies_owner_id ON public.companies USING btree (owner_id);


--
-- Name: idx_company_code_sequences_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_company_code_sequences_date ON public.company_code_sequences USING btree (date_key);


--
-- Name: idx_company_transfers_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_company_transfers_company_id ON public.company_transfers USING btree (company_id);


--
-- Name: idx_company_transfers_from_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_company_transfers_from_user ON public.company_transfers USING btree (from_user_id);


--
-- Name: idx_company_transfers_to_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_company_transfers_to_user ON public.company_transfers USING btree (to_user_id);


--
-- Name: idx_document_templates_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_templates_category ON public.document_templates USING btree (category);


--
-- Name: idx_document_templates_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_templates_company ON public.document_templates USING btree (company_id);


--
-- Name: idx_employee_document_records_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_document_records_company ON public.employee_document_records USING btree (company_id);


--
-- Name: idx_employee_document_records_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_document_records_employee ON public.employee_document_records USING btree (employee_id);


--
-- Name: idx_employee_document_records_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_document_records_type ON public.employee_document_records USING btree (document_type);


--
-- Name: idx_employee_document_records_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_document_records_year ON public.employee_document_records USING btree (signed_year);


--
-- Name: idx_employees_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_company ON public.employees USING btree (company_id);


--
-- Name: idx_employees_contract_end; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_contract_end ON public.employees USING btree (contract_end_date);


--
-- Name: idx_employees_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_status ON public.employees USING btree (status);


--
-- Name: idx_labor_contract_history_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_labor_contract_history_company ON public.labor_contract_history USING btree (company_id);


--
-- Name: idx_labor_contract_history_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_labor_contract_history_employee ON public.labor_contract_history USING btree (employee_id);


--
-- Name: idx_notifications_unread; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_unread ON public.notifications USING btree (user_id, is_read);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_operation_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_operation_logs_created_at ON public.operation_logs USING btree (created_at DESC);


--
-- Name: idx_operation_logs_operation_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_operation_logs_operation_type ON public.operation_logs USING btree (operation_type);


--
-- Name: idx_operation_logs_target; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_operation_logs_target ON public.operation_logs USING btree (target_type, target_id);


--
-- Name: idx_operation_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_operation_logs_user_id ON public.operation_logs USING btree (user_id);


--
-- Name: idx_profiles_manager_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_profiles_manager_id ON public.profiles USING btree (manager_id);


--
-- Name: idx_profiles_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_profiles_role_id ON public.profiles USING btree (role_id);


--
-- Name: idx_roles_name_system_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_roles_name_system_role ON public.roles USING btree (name, is_system_role) WHERE (is_system_role = true);


--
-- Name: idx_salary_items_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_items_employee ON public.salary_items USING btree (employee_id);


--
-- Name: idx_salary_items_pdf_url; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_items_pdf_url ON public.salary_items USING btree (pdf_url) WHERE (pdf_url IS NOT NULL);


--
-- Name: idx_salary_items_record; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_items_record ON public.salary_items USING btree (salary_record_id);


--
-- Name: idx_salary_records_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_records_company ON public.salary_records USING btree (company_id);


--
-- Name: idx_salary_records_year_month; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_records_year_month ON public.salary_records USING btree (year, month);


--
-- Name: idx_salary_signatures_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_signatures_company ON public.salary_signatures USING btree (company_id);


--
-- Name: idx_salary_signatures_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_signatures_employee ON public.salary_signatures USING btree (employee_id);


--
-- Name: idx_salary_signatures_sign_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_signatures_sign_token ON public.salary_signatures USING btree (sign_token);


--
-- Name: idx_salary_signatures_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_signatures_status ON public.salary_signatures USING btree (status);


--
-- Name: idx_salary_signatures_year_month; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_signatures_year_month ON public.salary_signatures USING btree (year, month);


--
-- Name: idx_salary_structure_templates_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_structure_templates_company ON public.salary_structure_templates USING btree (company_id);


--
-- Name: idx_salary_structure_templates_is_universal; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_salary_structure_templates_is_universal ON public.salary_structure_templates USING btree (is_universal) WHERE (is_universal = true);


--
-- Name: idx_signed_documents_signed_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_signed_documents_signed_at ON public.signed_documents USING btree (signed_at);


--
-- Name: idx_signed_documents_signing_record_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_signed_documents_signing_record_id ON public.signed_documents USING btree (signing_record_id);


--
-- Name: idx_signed_documents_template_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_signed_documents_template_id ON public.signed_documents USING btree (template_id);


--
-- Name: idx_signing_records_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_signing_records_company ON public.signing_records USING btree (company_id);


--
-- Name: idx_signing_records_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_signing_records_employee ON public.signing_records USING btree (employee_id);


--
-- Name: idx_signing_records_mode; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_signing_records_mode ON public.signing_records USING btree (signing_mode);


--
-- Name: idx_signing_records_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_signing_records_status ON public.signing_records USING btree (status);


--
-- Name: idx_signing_records_uploaded_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_signing_records_uploaded_at ON public.signing_records USING btree (uploaded_at);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_20_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_20_inserted_at_topic_idx ON realtime.messages_2026_03_20 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_21_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_21_inserted_at_topic_idx ON realtime.messages_2026_03_21 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_22_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_22_inserted_at_topic_idx ON realtime.messages_2026_03_22 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_23_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_23_inserted_at_topic_idx ON realtime.messages_2026_03_23 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_24_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_24_inserted_at_topic_idx ON realtime.messages_2026_03_24 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_25_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_25_inserted_at_topic_idx ON realtime.messages_2026_03_25 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_26_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_26_inserted_at_topic_idx ON realtime.messages_2026_03_26 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_iceberg_namespaces_bucket_id; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_iceberg_namespaces_bucket_id ON storage.iceberg_namespaces USING btree (catalog_id, name);


--
-- Name: idx_iceberg_tables_location; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_iceberg_tables_location ON storage.iceberg_tables USING btree (location);


--
-- Name: idx_iceberg_tables_namespace_id; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_iceberg_tables_namespace_id ON storage.iceberg_tables USING btree (catalog_id, namespace_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: supabase_functions_hooks_h_table_id_h_name_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);


--
-- Name: supabase_functions_hooks_request_id_idx; Type: INDEX; Schema: supabase_functions; Owner: supabase_functions_admin
--

CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);


--
-- Name: messages_2026_03_20_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_20_inserted_at_topic_idx;


--
-- Name: messages_2026_03_20_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_20_pkey;


--
-- Name: messages_2026_03_21_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_21_inserted_at_topic_idx;


--
-- Name: messages_2026_03_21_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_21_pkey;


--
-- Name: messages_2026_03_22_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_22_inserted_at_topic_idx;


--
-- Name: messages_2026_03_22_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_22_pkey;


--
-- Name: messages_2026_03_23_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_23_inserted_at_topic_idx;


--
-- Name: messages_2026_03_23_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_23_pkey;


--
-- Name: messages_2026_03_24_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_24_inserted_at_topic_idx;


--
-- Name: messages_2026_03_24_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_24_pkey;


--
-- Name: messages_2026_03_25_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_25_inserted_at_topic_idx;


--
-- Name: messages_2026_03_25_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_25_pkey;


--
-- Name: messages_2026_03_26_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_26_inserted_at_topic_idx;


--
-- Name: messages_2026_03_26_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_26_pkey;


--
-- Name: users on_auth_user_confirmed; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_confirmed AFTER UPDATE ON auth.users FOR EACH ROW WHEN (((old.confirmed_at IS NULL) AND (new.confirmed_at IS NOT NULL))) EXECUTE FUNCTION public.handle_new_user();


--
-- Name: attendance_records attendance_records_audit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER attendance_records_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.attendance_records FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();


--
-- Name: companies companies_audit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER companies_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();


--
-- Name: document_templates document_templates_audit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER document_templates_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.document_templates FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();


--
-- Name: employees employees_audit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER employees_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();


--
-- Name: roles roles_audit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER roles_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();


--
-- Name: signing_records signing_records_audit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER signing_records_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.signing_records FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();


--
-- Name: attendance_records update_attendance_records_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON public.attendance_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: companies update_companies_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: document_templates update_document_templates_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON public.document_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: employees update_employees_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: reminder_configs update_reminder_configs_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_reminder_configs_updated_at BEFORE UPDATE ON public.reminder_configs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: roles update_roles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: signed_documents update_signed_documents_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_signed_documents_updated_at BEFORE UPDATE ON public.signed_documents FOR EACH ROW EXECUTE FUNCTION public.update_signed_documents_updated_at();


--
-- Name: signing_records update_signing_records_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_signing_records_updated_at BEFORE UPDATE ON public.signing_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: extensions extensions_tenant_external_id_fkey; Type: FK CONSTRAINT; Schema: _realtime; Owner: supabase_admin
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_tenant_external_id_fkey FOREIGN KEY (tenant_external_id) REFERENCES _realtime.tenants(external_id) ON DELETE CASCADE;


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: attendance_records attendance_records_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: attendance_records attendance_records_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: attendance_records attendance_records_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: attendance_signatures attendance_signatures_attendance_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_signatures
    ADD CONSTRAINT attendance_signatures_attendance_record_id_fkey FOREIGN KEY (attendance_record_id) REFERENCES public.attendance_records(id) ON DELETE CASCADE;


--
-- Name: attendance_signatures attendance_signatures_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_signatures
    ADD CONSTRAINT attendance_signatures_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: attendance_signatures attendance_signatures_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_signatures
    ADD CONSTRAINT attendance_signatures_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: companies companies_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: companies companies_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id);


--
-- Name: company_transfers company_transfers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_transfers
    ADD CONSTRAINT company_transfers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: company_transfers company_transfers_from_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_transfers
    ADD CONSTRAINT company_transfers_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES auth.users(id);


--
-- Name: company_transfers company_transfers_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_transfers
    ADD CONSTRAINT company_transfers_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES auth.users(id);


--
-- Name: company_transfers company_transfers_transferred_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_transfers
    ADD CONSTRAINT company_transfers_transferred_by_fkey FOREIGN KEY (transferred_by) REFERENCES auth.users(id);


--
-- Name: document_templates document_templates_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_templates
    ADD CONSTRAINT document_templates_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: employee_document_records employee_document_records_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_document_records
    ADD CONSTRAINT employee_document_records_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: employee_document_records employee_document_records_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_document_records
    ADD CONSTRAINT employee_document_records_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: employee_document_records employee_document_records_signing_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_document_records
    ADD CONSTRAINT employee_document_records_signing_record_id_fkey FOREIGN KEY (signing_record_id) REFERENCES public.signing_records(id) ON DELETE SET NULL;


--
-- Name: employees employees_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: profiles fk_profiles_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT fk_profiles_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;


--
-- Name: labor_contract_history labor_contract_history_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labor_contract_history
    ADD CONSTRAINT labor_contract_history_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: labor_contract_history labor_contract_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labor_contract_history
    ADD CONSTRAINT labor_contract_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: operation_logs operation_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operation_logs
    ADD CONSTRAINT operation_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


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
-- Name: reminder_configs reminder_configs_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminder_configs
    ADD CONSTRAINT reminder_configs_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: roles roles_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: salary_items salary_items_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_items
    ADD CONSTRAINT salary_items_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: salary_items salary_items_salary_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_items
    ADD CONSTRAINT salary_items_salary_record_id_fkey FOREIGN KEY (salary_record_id) REFERENCES public.salary_records(id) ON DELETE CASCADE;


--
-- Name: salary_records salary_records_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_records
    ADD CONSTRAINT salary_records_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: salary_records salary_records_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_records
    ADD CONSTRAINT salary_records_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.salary_structure_templates(id) ON DELETE SET NULL;


--
-- Name: salary_records salary_records_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_records
    ADD CONSTRAINT salary_records_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id);


--
-- Name: salary_signatures salary_signatures_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_signatures
    ADD CONSTRAINT salary_signatures_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: salary_signatures salary_signatures_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_signatures
    ADD CONSTRAINT salary_signatures_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: salary_structure_templates salary_structure_templates_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_structure_templates
    ADD CONSTRAINT salary_structure_templates_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: salary_structure_templates salary_structure_templates_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_structure_templates
    ADD CONSTRAINT salary_structure_templates_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: signed_documents signed_documents_signing_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signed_documents
    ADD CONSTRAINT signed_documents_signing_record_id_fkey FOREIGN KEY (signing_record_id) REFERENCES public.signing_records(id) ON DELETE CASCADE;


--
-- Name: signed_documents signed_documents_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signed_documents
    ADD CONSTRAINT signed_documents_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.document_templates(id) ON DELETE CASCADE;


--
-- Name: signing_records signing_records_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signing_records
    ADD CONSTRAINT signing_records_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: signing_records signing_records_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signing_records
    ADD CONSTRAINT signing_records_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: signing_records signing_records_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signing_records
    ADD CONSTRAINT signing_records_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: iceberg_namespaces iceberg_namespaces_catalog_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.iceberg_namespaces
    ADD CONSTRAINT iceberg_namespaces_catalog_id_fkey FOREIGN KEY (catalog_id) REFERENCES storage.buckets_analytics(id) ON DELETE CASCADE;


--
-- Name: iceberg_tables iceberg_tables_catalog_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.iceberg_tables
    ADD CONSTRAINT iceberg_tables_catalog_id_fkey FOREIGN KEY (catalog_id) REFERENCES storage.buckets_analytics(id) ON DELETE CASCADE;


--
-- Name: iceberg_tables iceberg_tables_namespace_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.iceberg_tables
    ADD CONSTRAINT iceberg_tables_namespace_id_fkey FOREIGN KEY (namespace_id) REFERENCES storage.iceberg_namespaces(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: attendance_records; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

--
-- Name: attendance_signatures; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.attendance_signatures ENABLE ROW LEVEL SECURITY;

--
-- Name: attendance_signatures attendance_signatures_delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY attendance_signatures_delete ON public.attendance_signatures FOR DELETE USING (public.has_permission(public.uid(), 'attendance_sign_manage'::text));


--
-- Name: attendance_signatures attendance_signatures_delete_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY attendance_signatures_delete_policy ON public.attendance_signatures FOR DELETE USING ((public.is_super_admin(auth.uid()) OR public.has_permission(auth.uid(), 'attendance_signing_delete'::text)));


--
-- Name: attendance_signatures attendance_signatures_insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY attendance_signatures_insert ON public.attendance_signatures FOR INSERT WITH CHECK ((public.has_permission(public.uid(), 'attendance_sign_send'::text) OR public.has_permission(public.uid(), 'attendance_sign_manage'::text)));


--
-- Name: attendance_signatures attendance_signatures_select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY attendance_signatures_select ON public.attendance_signatures FOR SELECT USING ((public.has_permission(public.uid(), 'attendance_sign_view'::text) OR public.has_permission(public.uid(), 'attendance_sign_send'::text) OR public.has_permission(public.uid(), 'attendance_sign_manage'::text)));


--
-- Name: attendance_signatures attendance_signatures_update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY attendance_signatures_update ON public.attendance_signatures FOR UPDATE USING ((public.has_permission(public.uid(), 'attendance_sign_manage'::text) OR public.has_permission(public.uid(), 'attendance_sign_send'::text)));


--
-- Name: signed_documents authenticated_users_can_create_signed_documents; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_create_signed_documents ON public.signed_documents FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: signed_documents authenticated_users_can_delete_signed_documents; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_delete_signed_documents ON public.signed_documents FOR DELETE TO authenticated USING (true);


--
-- Name: signed_documents authenticated_users_can_update_signed_documents; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_update_signed_documents ON public.signed_documents FOR UPDATE TO authenticated USING (true);


--
-- Name: signed_documents authenticated_users_can_view_signed_documents; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authenticated_users_can_view_signed_documents ON public.signed_documents FOR SELECT TO authenticated USING (true);


--
-- Name: companies; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

--
-- Name: company_transfers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.company_transfers ENABLE ROW LEVEL SECURITY;

--
-- Name: document_templates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: employee_document_records; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.employee_document_records ENABLE ROW LEVEL SECURITY;

--
-- Name: employees; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

--
-- Name: labor_contract_history; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.labor_contract_history ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: operation_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.operation_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: permissions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: reminder_configs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.reminder_configs ENABLE ROW LEVEL SECURITY;

--
-- Name: role_permissions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

--
-- Name: roles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

--
-- Name: salary_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.salary_items ENABLE ROW LEVEL SECURITY;

--
-- Name: salary_records; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.salary_records ENABLE ROW LEVEL SECURITY;

--
-- Name: salary_signatures; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.salary_signatures ENABLE ROW LEVEL SECURITY;

--
-- Name: salary_signatures salary_signatures_delete_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY salary_signatures_delete_policy ON public.salary_signatures FOR DELETE USING ((public.is_super_admin(auth.uid()) OR public.has_permission(auth.uid(), 'salary_signing_delete'::text)));


--
-- Name: salary_signatures salary_signatures_insert_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY salary_signatures_insert_policy ON public.salary_signatures FOR INSERT WITH CHECK ((public.is_super_admin(public.uid()) OR public.has_permission(public.uid(), 'salary_record_manage'::text) OR public.has_permission(public.uid(), 'salary_slip_send'::text) OR public.can_access_company_data(public.uid(), company_id)));


--
-- Name: salary_signatures salary_signatures_public_access_by_token; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY salary_signatures_public_access_by_token ON public.salary_signatures FOR SELECT USING (((sign_token IS NOT NULL) AND (sign_token_expires_at > now())));


--
-- Name: salary_signatures salary_signatures_select_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY salary_signatures_select_policy ON public.salary_signatures FOR SELECT USING ((public.is_super_admin(public.uid()) OR public.can_access_company_data(public.uid(), company_id)));


--
-- Name: salary_signatures salary_signatures_update_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY salary_signatures_update_policy ON public.salary_signatures FOR UPDATE USING ((public.is_super_admin(public.uid()) OR public.can_access_company_data(public.uid(), company_id)));


--
-- Name: salary_structure_templates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.salary_structure_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: signed_documents; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.signed_documents ENABLE ROW LEVEL SECURITY;

--
-- Name: signing_records; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.signing_records ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: labor_contract_history 允许认证用户删除劳动合同历史; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "允许认证用户删除劳动合同历史" ON public.labor_contract_history FOR DELETE TO authenticated USING (true);


--
-- Name: employee_document_records 允许认证用户删除员工文书记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "允许认证用户删除员工文书记录" ON public.employee_document_records FOR DELETE TO authenticated USING (true);


--
-- Name: labor_contract_history 允许认证用户插入劳动合同历史; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "允许认证用户插入劳动合同历史" ON public.labor_contract_history FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: employee_document_records 允许认证用户插入员工文书记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "允许认证用户插入员工文书记录" ON public.employee_document_records FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: labor_contract_history 允许认证用户更新劳动合同历史; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "允许认证用户更新劳动合同历史" ON public.labor_contract_history FOR UPDATE TO authenticated USING (true);


--
-- Name: employee_document_records 允许认证用户更新员工文书记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "允许认证用户更新员工文书记录" ON public.employee_document_records FOR UPDATE TO authenticated USING (true);


--
-- Name: labor_contract_history 允许认证用户查看劳动合同历史; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "允许认证用户查看劳动合同历史" ON public.labor_contract_history FOR SELECT TO authenticated USING (true);


--
-- Name: employee_document_records 允许认证用户查看员工文书记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "允许认证用户查看员工文书记录" ON public.employee_document_records FOR SELECT TO authenticated USING (true);


--
-- Name: reminder_configs 所有认证用户可以查看提醒配置; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "所有认证用户可以查看提醒配置" ON public.reminder_configs FOR SELECT TO authenticated USING (true);


--
-- Name: permissions 所有认证用户可以查看权限; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "所有认证用户可以查看权限" ON public.permissions FOR SELECT TO authenticated USING (true);


--
-- Name: user_roles 所有认证用户可以查看用户角色; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "所有认证用户可以查看用户角色" ON public.user_roles FOR SELECT TO authenticated USING (true);


--
-- Name: roles 所有认证用户可以查看角色; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "所有认证用户可以查看角色" ON public.roles FOR SELECT TO authenticated USING (true);


--
-- Name: role_permissions 所有认证用户可以查看角色权限; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "所有认证用户可以查看角色权限" ON public.role_permissions FOR SELECT TO authenticated USING (true);


--
-- Name: profiles 有user_view权限的用户可以查看所有用户; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "有user_view权限的用户可以查看所有用户" ON public.profiles FOR SELECT TO authenticated USING ((public.is_super_admin(public.uid()) OR public.has_permission(public.uid(), 'user_view'::text)));


--
-- Name: companies 用户可以创建公司; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建公司" ON public.companies FOR INSERT TO authenticated WITH CHECK ((public.is_super_admin(public.uid()) OR public.has_permission(public.uid(), 'company_create'::text)));


--
-- Name: employees 用户可以创建员工; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建员工" ON public.employees FOR INSERT TO authenticated WITH CHECK ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'employee_create'::text) AND (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))));


--
-- Name: salary_items 用户可以创建工资明细; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建工资明细" ON public.salary_items FOR INSERT WITH CHECK ((public.has_permission(public.uid(), 'salary_record_manage'::text) OR public.has_permission(public.uid(), 'salary_slip_generate'::text)));


--
-- Name: salary_structure_templates 用户可以创建工资结构模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建工资结构模板" ON public.salary_structure_templates FOR INSERT WITH CHECK ((public.is_super_admin(auth.uid()) OR ((is_universal = true) AND public.is_super_admin(auth.uid())) OR public.can_access_company_data(auth.uid(), company_id)));


--
-- Name: POLICY "用户可以创建工资结构模板" ON salary_structure_templates; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "用户可以创建工资结构模板" ON public.salary_structure_templates IS '允许超级管理员创建通用模板，普通用户创建公司模板';


--
-- Name: salary_records 用户可以创建工资记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建工资记录" ON public.salary_records FOR INSERT WITH CHECK ((public.has_permission(public.uid(), 'salary_record_manage'::text) OR public.has_permission(public.uid(), 'salary_record_upload'::text)));


--
-- Name: signed_documents 用户可以创建已签署文档; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建已签署文档" ON public.signed_documents FOR INSERT TO authenticated WITH CHECK ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'document_manage'::text) AND (signing_record_id IN ( SELECT signing_records.id
   FROM public.signing_records
  WHERE (signing_records.company_id IN ( SELECT companies.id
           FROM public.companies
          WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
                   FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))))));


--
-- Name: document_templates 用户可以创建文书模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建文书模板" ON public.document_templates FOR INSERT TO authenticated WITH CHECK ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'template_create'::text) AND ((company_id IS NULL) OR (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id)))))))));


--
-- Name: employees 用户可以创建有权访问的公司的员工; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建有权访问的公司的员工" ON public.employees FOR INSERT WITH CHECK ((public.is_super_admin(auth.uid()) OR (public.has_permission(auth.uid(), 'employee_create'::text) AND public.can_access_company_data(auth.uid(), company_id))));


--
-- Name: document_templates 用户可以创建有权访问的公司的文书模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建有权访问的公司的文书模板" ON public.document_templates FOR INSERT WITH CHECK ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'template_create'::text) AND ((company_id IS NULL) OR public.can_access_company_data(public.uid(), company_id)))));


--
-- Name: signing_records 用户可以创建有权访问的公司的签署记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建有权访问的公司的签署记录" ON public.signing_records FOR INSERT WITH CHECK ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'document_initiate'::text) AND public.can_access_company_data(public.uid(), company_id))));


--
-- Name: signed_documents 用户可以创建有权访问的签署记录的已签署文书; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建有权访问的签署记录的已签署文书" ON public.signed_documents FOR INSERT WITH CHECK ((public.is_super_admin(auth.uid()) OR (public.has_permission(auth.uid(), 'document_create'::text) AND (EXISTS ( SELECT 1
   FROM public.signing_records sr
  WHERE ((sr.id = signed_documents.signing_record_id) AND public.can_access_company_data(auth.uid(), sr.company_id)))))));


--
-- Name: signing_records 用户可以创建签署记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建签署记录" ON public.signing_records FOR INSERT TO authenticated WITH CHECK ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'document_initiate'::text) AND (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))));


--
-- Name: attendance_records 用户可以创建考勤记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建考勤记录" ON public.attendance_records FOR INSERT WITH CHECK ((public.is_super_admin(public.uid()) OR public.can_access_company_data(public.uid(), company_id)));


--
-- Name: notifications 用户可以创建通知; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以创建通知" ON public.notifications FOR INSERT WITH CHECK ((public.is_super_admin(auth.uid()) OR (user_id = auth.uid()) OR (user_id IN ( SELECT get_all_subordinate_ids.subordinate_id
   FROM public.get_all_subordinate_ids(auth.uid()) get_all_subordinate_ids(subordinate_id)))));


--
-- Name: salary_items 用户可以删除工资明细; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除工资明细" ON public.salary_items FOR DELETE USING (public.has_permission(public.uid(), 'salary_record_manage'::text));


--
-- Name: salary_structure_templates 用户可以删除工资结构模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除工资结构模板" ON public.salary_structure_templates FOR DELETE USING ((public.is_super_admin(auth.uid()) OR ((NOT is_universal) AND public.can_access_company_data(auth.uid(), company_id))));


--
-- Name: POLICY "用户可以删除工资结构模板" ON salary_structure_templates; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "用户可以删除工资结构模板" ON public.salary_structure_templates IS '只允许超级管理员删除通用模板，普通用户可删除公司模板';


--
-- Name: salary_records 用户可以删除工资记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除工资记录" ON public.salary_records FOR DELETE USING (public.has_permission(public.uid(), 'salary_record_manage'::text));


--
-- Name: employees 用户可以删除有权访问的公司的员工; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除有权访问的公司的员工" ON public.employees FOR DELETE USING ((public.is_super_admin(auth.uid()) OR (public.has_permission(auth.uid(), 'employee_delete'::text) AND public.can_access_company_data(auth.uid(), company_id))));


--
-- Name: document_templates 用户可以删除有权访问的公司的文书模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除有权访问的公司的文书模板" ON public.document_templates FOR DELETE USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'template_delete'::text) AND ((company_id IS NULL) OR public.can_access_company_data(public.uid(), company_id)))));


--
-- Name: signing_records 用户可以删除有权访问的公司的签署记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除有权访问的公司的签署记录" ON public.signing_records FOR DELETE USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'document_manage'::text) AND public.can_access_company_data(public.uid(), company_id)) OR (created_by = public.uid())));


--
-- Name: signed_documents 用户可以删除有权访问的签署记录的已签署文书; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除有权访问的签署记录的已签署文书" ON public.signed_documents FOR DELETE USING ((public.is_super_admin(auth.uid()) OR (public.has_permission(auth.uid(), 'document_delete'::text) AND (EXISTS ( SELECT 1
   FROM public.signing_records sr
  WHERE ((sr.id = signed_documents.signing_record_id) AND public.can_access_company_data(auth.uid(), sr.company_id)))))));


--
-- Name: attendance_records 用户可以删除考勤记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除考勤记录" ON public.attendance_records FOR DELETE USING ((public.is_super_admin(public.uid()) OR public.can_access_company_data(public.uid(), company_id)));


--
-- Name: notifications 用户可以删除自己和下级的通知; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除自己和下级的通知" ON public.notifications FOR DELETE USING ((public.is_super_admin(auth.uid()) OR (user_id = auth.uid()) OR (user_id IN ( SELECT get_all_subordinate_ids.subordinate_id
   FROM public.get_all_subordinate_ids(auth.uid()) get_all_subordinate_ids(subordinate_id)))));


--
-- Name: companies 用户可以删除自己和下级负责的公司; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除自己和下级负责的公司" ON public.companies FOR DELETE TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'company_delete'::text) AND (owner_id IN ( SELECT get_accessible_users.accessible_user_id
   FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))));


--
-- Name: employees 用户可以删除自己和下级负责的公司的员工; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除自己和下级负责的公司的员工" ON public.employees FOR DELETE TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'employee_delete'::text) AND (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))));


--
-- Name: signed_documents 用户可以删除自己和下级负责的公司的已签署文; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除自己和下级负责的公司的已签署文" ON public.signed_documents FOR DELETE TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'document_manage'::text) AND (signing_record_id IN ( SELECT signing_records.id
   FROM public.signing_records
  WHERE (signing_records.company_id IN ( SELECT companies.id
           FROM public.companies
          WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
                   FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))))));


--
-- Name: document_templates 用户可以删除自己和下级负责的公司的文书模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除自己和下级负责的公司的文书模板" ON public.document_templates FOR DELETE TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'template_delete'::text) AND ((company_id IS NULL) OR (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id)))))))));


--
-- Name: signing_records 用户可以删除自己和下级负责的公司的签署记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除自己和下级负责的公司的签署记录" ON public.signing_records FOR DELETE TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'document_manage'::text) AND (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))));


--
-- Name: companies 用户可以删除自己拥有的公司; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以删除自己拥有的公司" ON public.companies FOR DELETE USING ((public.is_super_admin(auth.uid()) OR (owner_id = auth.uid())));


--
-- Name: POLICY "用户可以删除自己拥有的公司" ON companies; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "用户可以删除自己拥有的公司" ON public.companies IS '只有所有者本人可以删除公司';


--
-- Name: salary_items 用户可以更新工资明细; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新工资明细" ON public.salary_items FOR UPDATE USING (public.has_permission(public.uid(), 'salary_record_manage'::text));


--
-- Name: salary_structure_templates 用户可以更新工资结构模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新工资结构模板" ON public.salary_structure_templates FOR UPDATE USING ((public.is_super_admin(auth.uid()) OR (is_universal = true) OR public.can_access_company_data(auth.uid(), company_id))) WITH CHECK ((public.is_super_admin(auth.uid()) OR (is_universal = true) OR public.can_access_company_data(auth.uid(), company_id)));


--
-- Name: POLICY "用户可以更新工资结构模板" ON salary_structure_templates; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "用户可以更新工资结构模板" ON public.salary_structure_templates IS '允许所有用户编辑通用模板和有权限的公司模板';


--
-- Name: salary_records 用户可以更新工资记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新工资记录" ON public.salary_records FOR UPDATE USING (public.has_permission(public.uid(), 'salary_record_manage'::text));


--
-- Name: employees 用户可以更新有权访问的公司的员工; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新有权访问的公司的员工" ON public.employees FOR UPDATE USING ((public.is_super_admin(auth.uid()) OR (public.has_permission(auth.uid(), 'employee_edit'::text) AND public.can_access_company_data(auth.uid(), company_id)))) WITH CHECK ((public.is_super_admin(auth.uid()) OR (public.has_permission(auth.uid(), 'employee_edit'::text) AND public.can_access_company_data(auth.uid(), company_id))));


--
-- Name: document_templates 用户可以更新有权访问的公司的文书模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新有权访问的公司的文书模板" ON public.document_templates FOR UPDATE USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'template_edit'::text) AND ((company_id IS NULL) OR public.can_access_company_data(public.uid(), company_id))))) WITH CHECK ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'template_edit'::text) AND ((company_id IS NULL) OR public.can_access_company_data(public.uid(), company_id)))));


--
-- Name: signing_records 用户可以更新有权访问的公司的签署记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新有权访问的公司的签署记录" ON public.signing_records FOR UPDATE USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'document_manage'::text) AND public.can_access_company_data(public.uid(), company_id)) OR (created_by = public.uid()))) WITH CHECK ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'document_manage'::text) AND public.can_access_company_data(public.uid(), company_id)) OR (created_by = public.uid())));


--
-- Name: signed_documents 用户可以更新有权访问的签署记录的已签署文书; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新有权访问的签署记录的已签署文书" ON public.signed_documents FOR UPDATE USING ((public.is_super_admin(auth.uid()) OR (public.has_permission(auth.uid(), 'document_edit'::text) AND (EXISTS ( SELECT 1
   FROM public.signing_records sr
  WHERE ((sr.id = signed_documents.signing_record_id) AND public.can_access_company_data(auth.uid(), sr.company_id))))))) WITH CHECK ((public.is_super_admin(auth.uid()) OR (public.has_permission(auth.uid(), 'document_edit'::text) AND (EXISTS ( SELECT 1
   FROM public.signing_records sr
  WHERE ((sr.id = signed_documents.signing_record_id) AND public.can_access_company_data(auth.uid(), sr.company_id)))))));


--
-- Name: attendance_records 用户可以更新考勤记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新考勤记录" ON public.attendance_records FOR UPDATE USING ((public.is_super_admin(public.uid()) OR public.can_access_company_data(public.uid(), company_id))) WITH CHECK ((public.is_super_admin(public.uid()) OR public.can_access_company_data(public.uid(), company_id)));


--
-- Name: companies 用户可以更新自己和下级拥有的公司; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新自己和下级拥有的公司" ON public.companies FOR UPDATE USING ((public.is_super_admin(auth.uid()) OR (owner_id = auth.uid()) OR (owner_id IN ( SELECT profiles.id
   FROM public.profiles
  WHERE (profiles.manager_id = auth.uid()))))) WITH CHECK ((public.is_super_admin(auth.uid()) OR (owner_id = auth.uid()) OR (owner_id IN ( SELECT profiles.id
   FROM public.profiles
  WHERE (profiles.manager_id = auth.uid())))));


--
-- Name: POLICY "用户可以更新自己和下级拥有的公司" ON companies; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "用户可以更新自己和下级拥有的公司" ON public.companies IS '用户可以更新自己和直接下级拥有的公司';


--
-- Name: notifications 用户可以更新自己和下级的通知; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新自己和下级的通知" ON public.notifications FOR UPDATE USING ((public.is_super_admin(auth.uid()) OR (user_id = auth.uid()) OR (user_id IN ( SELECT get_all_subordinate_ids.subordinate_id
   FROM public.get_all_subordinate_ids(auth.uid()) get_all_subordinate_ids(subordinate_id))))) WITH CHECK ((public.is_super_admin(auth.uid()) OR (user_id = auth.uid()) OR (user_id IN ( SELECT get_all_subordinate_ids.subordinate_id
   FROM public.get_all_subordinate_ids(auth.uid()) get_all_subordinate_ids(subordinate_id)))));


--
-- Name: companies 用户可以更新自己和下级负责的公司; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新自己和下级负责的公司" ON public.companies FOR UPDATE TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'company_edit'::text) AND (owner_id IN ( SELECT get_accessible_users.accessible_user_id
   FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))));


--
-- Name: employees 用户可以更新自己和下级负责的公司的员工; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新自己和下级负责的公司的员工" ON public.employees FOR UPDATE TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'employee_edit'::text) AND (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))));


--
-- Name: signed_documents 用户可以更新自己和下级负责的公司的已签署文; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新自己和下级负责的公司的已签署文" ON public.signed_documents FOR UPDATE TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'document_manage'::text) AND (signing_record_id IN ( SELECT signing_records.id
   FROM public.signing_records
  WHERE (signing_records.company_id IN ( SELECT companies.id
           FROM public.companies
          WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
                   FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))))));


--
-- Name: document_templates 用户可以更新自己和下级负责的公司的文书模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新自己和下级负责的公司的文书模板" ON public.document_templates FOR UPDATE TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'template_edit'::text) AND ((company_id IS NULL) OR (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id)))))))));


--
-- Name: signing_records 用户可以更新自己和下级负责的公司的签署记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新自己和下级负责的公司的签署记录" ON public.signing_records FOR UPDATE TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'document_manage'::text) AND (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))));


--
-- Name: profiles 用户可以更新自己的资料（除角色外）; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新自己的资料（除角色外）" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((NOT (role IS DISTINCT FROM ( SELECT profiles_1.role
   FROM public.profiles profiles_1
  WHERE (profiles_1.id = auth.uid())))));


--
-- Name: notifications 用户可以更新自己的通知; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以更新自己的通知" ON public.notifications FOR UPDATE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: salary_items 用户可以查看工资明细; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看工资明细" ON public.salary_items FOR SELECT USING ((public.has_permission(public.uid(), 'salary_record_manage'::text) OR public.has_permission(public.uid(), 'salary_record_view'::text) OR (employee_id = public.uid())));


--
-- Name: salary_structure_templates 用户可以查看工资结构模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看工资结构模板" ON public.salary_structure_templates FOR SELECT USING ((public.is_super_admin(auth.uid()) OR (is_universal = true) OR public.can_access_company_data(auth.uid(), company_id)));


--
-- Name: POLICY "用户可以查看工资结构模板" ON salary_structure_templates; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "用户可以查看工资结构模板" ON public.salary_structure_templates IS '允许用户查看通用模板和有权限的公司模板';


--
-- Name: salary_structure_templates 用户可以查看所属公司的工资结构模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看所属公司的工资结构模板" ON public.salary_structure_templates FOR SELECT USING ((company_id IN ( SELECT p.company_id
   FROM public.profiles p
  WHERE (p.id = auth.uid()))));


--
-- Name: salary_records 用户可以查看所属公司的工资记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看所属公司的工资记录" ON public.salary_records FOR SELECT USING ((public.has_permission(public.uid(), 'salary_record_manage'::text) OR public.has_permission(public.uid(), 'salary_record_view'::text) OR (company_id IN ( SELECT p.company_id
   FROM public.profiles p
  WHERE (p.id = public.uid())))));


--
-- Name: employees 用户可以查看有权访问的公司的员工; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看有权访问的公司的员工" ON public.employees FOR SELECT USING ((public.is_super_admin(auth.uid()) OR public.can_access_company_data(auth.uid(), company_id)));


--
-- Name: POLICY "用户可以查看有权访问的公司的员工" ON employees; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "用户可以查看有权访问的公司的员工" ON public.employees IS '用户可以查看自己和下级拥有的公司的员工';


--
-- Name: document_templates 用户可以查看有权访问的公司的文书模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看有权访问的公司的文书模板" ON public.document_templates FOR SELECT USING ((public.is_super_admin(public.uid()) OR (company_id IS NULL) OR public.can_access_company_data(public.uid(), company_id)));


--
-- Name: signing_records 用户可以查看有权访问的公司的签署记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看有权访问的公司的签署记录" ON public.signing_records FOR SELECT USING ((public.is_super_admin(auth.uid()) OR public.can_access_company_data(auth.uid(), company_id) OR (created_by = auth.uid())));


--
-- Name: POLICY "用户可以查看有权访问的公司的签署记录" ON signing_records; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "用户可以查看有权访问的公司的签署记录" ON public.signing_records IS '用户可以查看自己和下级拥有的公司的签署记录';


--
-- Name: signed_documents 用户可以查看有权访问的签署记录的已签署文书; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看有权访问的签署记录的已签署文书" ON public.signed_documents FOR SELECT USING ((public.is_super_admin(auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.signing_records sr
  WHERE ((sr.id = signed_documents.signing_record_id) AND public.can_access_company_data(auth.uid(), sr.company_id))))));


--
-- Name: POLICY "用户可以查看有权访问的签署记录的已签署文书" ON signed_documents; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "用户可以查看有权访问的签署记录的已签署文书" ON public.signed_documents IS '用户可以查看有权访问的签署记录的已签署文书';


--
-- Name: company_transfers 用户可以查看相关公司的流转历史; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看相关公司的流转历史" ON public.company_transfers FOR SELECT USING ((public.is_super_admin(auth.uid()) OR (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE public.can_access_company_data(auth.uid(), companies.id))) OR (from_user_id = auth.uid()) OR (to_user_id = auth.uid())));


--
-- Name: attendance_records 用户可以查看考勤记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看考勤记录" ON public.attendance_records FOR SELECT USING ((public.is_super_admin(public.uid()) OR public.can_access_company_data(public.uid(), company_id)));


--
-- Name: companies 用户可以查看自己和下级拥有的公司; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看自己和下级拥有的公司" ON public.companies FOR SELECT USING ((public.is_super_admin(auth.uid()) OR (owner_id = auth.uid()) OR (owner_id IN ( SELECT get_all_subordinate_ids.subordinate_id
   FROM public.get_all_subordinate_ids(auth.uid()) get_all_subordinate_ids(subordinate_id)))));


--
-- Name: POLICY "用户可以查看自己和下级拥有的公司" ON companies; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "用户可以查看自己和下级拥有的公司" ON public.companies IS '用户只能查看owner_id为自己或下级的公司';


--
-- Name: operation_logs 用户可以查看自己和下级的操作日志; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看自己和下级的操作日志" ON public.operation_logs FOR SELECT TO authenticated USING ((public.has_permission(public.uid(), 'system_config_view'::text) AND (user_id IN ( SELECT get_accessible_users.accessible_user_id
   FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id)))));


--
-- Name: notifications 用户可以查看自己和下级的通知; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看自己和下级的通知" ON public.notifications FOR SELECT USING ((public.is_super_admin(auth.uid()) OR (user_id = auth.uid()) OR (user_id IN ( SELECT get_all_subordinate_ids.subordinate_id
   FROM public.get_all_subordinate_ids(auth.uid()) get_all_subordinate_ids(subordinate_id)))));


--
-- Name: POLICY "用户可以查看自己和下级的通知" ON notifications; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "用户可以查看自己和下级的通知" ON public.notifications IS '用户可以查看自己和下级的通知记录';


--
-- Name: companies 用户可以查看自己和下级负责的公司; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看自己和下级负责的公司" ON public.companies FOR SELECT TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'company_view'::text) AND (owner_id IN ( SELECT get_accessible_users.accessible_user_id
   FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))));


--
-- Name: employees 用户可以查看自己和下级负责的公司的员工; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看自己和下级负责的公司的员工" ON public.employees FOR SELECT TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'employee_view'::text) AND (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))));


--
-- Name: signed_documents 用户可以查看自己和下级负责的公司的已签署文; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看自己和下级负责的公司的已签署文" ON public.signed_documents FOR SELECT TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'signed_file_download'::text) AND (signing_record_id IN ( SELECT signing_records.id
   FROM public.signing_records
  WHERE (signing_records.company_id IN ( SELECT companies.id
           FROM public.companies
          WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
                   FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))))));


--
-- Name: document_templates 用户可以查看自己和下级负责的公司的文书模板; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看自己和下级负责的公司的文书模板" ON public.document_templates FOR SELECT TO authenticated USING ((public.is_super_admin(public.uid()) OR (company_id IS NULL) OR (public.has_permission(public.uid(), 'template_view'::text) AND (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))));


--
-- Name: signing_records 用户可以查看自己和下级负责的公司的签署记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看自己和下级负责的公司的签署记录" ON public.signing_records FOR SELECT TO authenticated USING ((public.is_super_admin(public.uid()) OR (public.has_permission(public.uid(), 'document_view'::text) AND (company_id IN ( SELECT companies.id
   FROM public.companies
  WHERE (companies.owner_id IN ( SELECT get_accessible_users.accessible_user_id
           FROM public.get_accessible_users(public.uid()) get_accessible_users(accessible_user_id))))))));


--
-- Name: notifications 用户可以查看自己的通知; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "用户可以查看自己的通知" ON public.notifications FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: company_transfers 禁止直接插入流转记录; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "禁止直接插入流转记录" ON public.company_transfers FOR INSERT WITH CHECK (false);


--
-- Name: notifications 管理员可以创建通知; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "管理员可以创建通知" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));


--
-- Name: operation_logs 认证用户可以创建操作日志; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "认证用户可以创建操作日志" ON public.operation_logs FOR INSERT TO authenticated WITH CHECK ((user_id = public.uid()));


--
-- Name: reminder_configs 超级管理员可以创建提醒配置; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以创建提醒配置" ON public.reminder_configs FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));


--
-- Name: reminder_configs 超级管理员可以删除提醒配置; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以删除提醒配置" ON public.reminder_configs FOR DELETE USING (public.is_super_admin(auth.uid()));


--
-- Name: profiles 超级管理员可以更新所有用户; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以更新所有用户" ON public.profiles FOR UPDATE TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: reminder_configs 超级管理员可以更新提醒配置; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以更新提醒配置" ON public.reminder_configs FOR UPDATE USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));


--
-- Name: reminder_configs 超级管理员可以查看所有提醒配置; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以查看所有提醒配置" ON public.reminder_configs FOR SELECT USING (public.is_super_admin(auth.uid()));


--
-- Name: operation_logs 超级管理员可以查看所有操作日志; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以查看所有操作日志" ON public.operation_logs FOR SELECT TO authenticated USING (public.is_super_admin(public.uid()));


--
-- Name: companies 超级管理员可以管理公司; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以管理公司" ON public.companies TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: reminder_configs 超级管理员可以管理提醒配置; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以管理提醒配置" ON public.reminder_configs TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: permissions 超级管理员可以管理权限; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以管理权限" ON public.permissions TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: user_roles 超级管理员可以管理用户角色; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以管理用户角色" ON public.user_roles TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: roles 超级管理员可以管理角色; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以管理角色" ON public.roles TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: role_permissions 超级管理员可以管理角色权限; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "超级管理员可以管理角色权限" ON public.role_permissions TO authenticated USING (public.is_super_admin(auth.uid()));


--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: iceberg_namespaces; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.iceberg_namespaces ENABLE ROW LEVEL SECURITY;

--
-- Name: iceberg_tables; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.iceberg_tables ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: objects signature_files_delete_policy; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY signature_files_delete_policy ON storage.objects FOR DELETE TO authenticated USING ((bucket_id = 'signature-files'::text));


--
-- Name: objects signature_files_insert_policy; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY signature_files_insert_policy ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'signature-files'::text));


--
-- Name: objects signature_files_select_policy; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY signature_files_select_policy ON storage.objects FOR SELECT TO authenticated USING ((bucket_id = 'signature-files'::text));


--
-- Name: objects signature_files_update_policy; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY signature_files_update_policy ON storage.objects FOR UPDATE TO authenticated USING ((bucket_id = 'signature-files'::text));


--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: objects 允许所有人查看已签署文档; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "允许所有人查看已签署文档" ON storage.objects FOR SELECT USING ((bucket_id = 'signed-documents'::text));


--
-- Name: objects 允许所有人查看文书模板附件; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "允许所有人查看文书模板附件" ON storage.objects FOR SELECT USING ((bucket_id = 'document-templates'::text));


--
-- Name: objects 允许认证用户上传已签署文档; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "允许认证用户上传已签署文档" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'signed-documents'::text));


--
-- Name: objects 允许认证用户上传文书模板附件; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "允许认证用户上传文书模板附件" ON storage.objects FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'document-templates'::text));


--
-- Name: objects 允许认证用户删除文书模板附件; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "允许认证用户删除文书模板附件" ON storage.objects FOR DELETE TO authenticated USING ((bucket_id = 'document-templates'::text));


--
-- Name: objects 允许认证用户删除自己上传的文档; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "允许认证用户删除自己上传的文档" ON storage.objects FOR DELETE TO authenticated USING (((bucket_id = 'signed-documents'::text) AND ((owner)::text = (auth.uid())::text)));


--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA net; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA net TO supabase_functions_admin;
GRANT USAGE ON SCHEMA net TO postgres;
GRANT USAGE ON SCHEMA net TO anon;
GRANT USAGE ON SCHEMA net TO authenticated;
GRANT USAGE ON SCHEMA net TO service_role;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA supabase_functions; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA supabase_functions TO postgres;
GRANT USAGE ON SCHEMA supabase_functions TO anon;
GRANT USAGE ON SCHEMA supabase_functions TO authenticated;
GRANT USAGE ON SCHEMA supabase_functions TO service_role;
GRANT ALL ON SCHEMA supabase_functions TO supabase_functions_admin;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer); Type: ACL; Schema: net; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO postgres;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO anon;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO authenticated;
GRANT ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO service_role;


--
-- Name: FUNCTION http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer); Type: ACL; Schema: net; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO postgres;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO anon;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO authenticated;
GRANT ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION audit_trigger_function(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.audit_trigger_function() TO anon;
GRANT ALL ON FUNCTION public.audit_trigger_function() TO authenticated;
GRANT ALL ON FUNCTION public.audit_trigger_function() TO service_role;


--
-- Name: FUNCTION batch_generate_sign_tokens(signature_ids uuid[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.batch_generate_sign_tokens(signature_ids uuid[]) TO anon;
GRANT ALL ON FUNCTION public.batch_generate_sign_tokens(signature_ids uuid[]) TO authenticated;
GRANT ALL ON FUNCTION public.batch_generate_sign_tokens(signature_ids uuid[]) TO service_role;


--
-- Name: FUNCTION batch_update_sign_tokens(signature_ids uuid[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.batch_update_sign_tokens(signature_ids uuid[]) TO anon;
GRANT ALL ON FUNCTION public.batch_update_sign_tokens(signature_ids uuid[]) TO authenticated;
GRANT ALL ON FUNCTION public.batch_update_sign_tokens(signature_ids uuid[]) TO service_role;


--
-- Name: FUNCTION can_access_company_data(user_id uuid, target_company_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.can_access_company_data(user_id uuid, target_company_id uuid) TO anon;
GRANT ALL ON FUNCTION public.can_access_company_data(user_id uuid, target_company_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.can_access_company_data(user_id uuid, target_company_id uuid) TO service_role;


--
-- Name: FUNCTION can_access_user_data(accessing_user_id uuid, target_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.can_access_user_data(accessing_user_id uuid, target_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.can_access_user_data(accessing_user_id uuid, target_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.can_access_user_data(accessing_user_id uuid, target_user_id uuid) TO service_role;


--
-- Name: FUNCTION can_view_user_data(viewer_id uuid, target_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.can_view_user_data(viewer_id uuid, target_id uuid) TO anon;
GRANT ALL ON FUNCTION public.can_view_user_data(viewer_id uuid, target_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.can_view_user_data(viewer_id uuid, target_id uuid) TO service_role;


--
-- Name: FUNCTION delete_user(user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_user(user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.delete_user(user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.delete_user(user_id uuid) TO service_role;


--
-- Name: FUNCTION generate_company_code(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_company_code() TO anon;
GRANT ALL ON FUNCTION public.generate_company_code() TO authenticated;
GRANT ALL ON FUNCTION public.generate_company_code() TO service_role;


--
-- Name: FUNCTION generate_sign_token(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_sign_token() TO anon;
GRANT ALL ON FUNCTION public.generate_sign_token() TO authenticated;
GRANT ALL ON FUNCTION public.generate_sign_token() TO service_role;


--
-- Name: FUNCTION get_accessible_users(user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_accessible_users(user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_accessible_users(user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_accessible_users(user_id uuid) TO service_role;


--
-- Name: FUNCTION get_all_subordinate_ids(user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_all_subordinate_ids(user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_all_subordinate_ids(user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_all_subordinate_ids(user_id uuid) TO service_role;


--
-- Name: FUNCTION get_manager_chain(user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_manager_chain(user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_manager_chain(user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_manager_chain(user_id uuid) TO service_role;


--
-- Name: FUNCTION get_subordinates(user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_subordinates(user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_subordinates(user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_subordinates(user_id uuid) TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION has_permission(user_id uuid, permission_code text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.has_permission(user_id uuid, permission_code text) TO anon;
GRANT ALL ON FUNCTION public.has_permission(user_id uuid, permission_code text) TO authenticated;
GRANT ALL ON FUNCTION public.has_permission(user_id uuid, permission_code text) TO service_role;


--
-- Name: FUNCTION is_admin(uid uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_admin(uid uuid) TO anon;
GRANT ALL ON FUNCTION public.is_admin(uid uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_admin(uid uuid) TO service_role;


--
-- Name: FUNCTION is_super_admin(uid uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_super_admin(uid uuid) TO anon;
GRANT ALL ON FUNCTION public.is_super_admin(uid uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_super_admin(uid uuid) TO service_role;


--
-- Name: FUNCTION log_operation(p_operation_type public.operation_type, p_operation_detail text, p_target_type text, p_target_id uuid, p_ip_address text, p_user_agent text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.log_operation(p_operation_type public.operation_type, p_operation_detail text, p_target_type text, p_target_id uuid, p_ip_address text, p_user_agent text) TO anon;
GRANT ALL ON FUNCTION public.log_operation(p_operation_type public.operation_type, p_operation_detail text, p_target_type text, p_target_id uuid, p_ip_address text, p_user_agent text) TO authenticated;
GRANT ALL ON FUNCTION public.log_operation(p_operation_type public.operation_type, p_operation_detail text, p_target_type text, p_target_id uuid, p_ip_address text, p_user_agent text) TO service_role;


--
-- Name: FUNCTION toggle_user_status(user_id uuid, new_status boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.toggle_user_status(user_id uuid, new_status boolean) TO anon;
GRANT ALL ON FUNCTION public.toggle_user_status(user_id uuid, new_status boolean) TO authenticated;
GRANT ALL ON FUNCTION public.toggle_user_status(user_id uuid, new_status boolean) TO service_role;


--
-- Name: FUNCTION transfer_company(p_company_id uuid, p_to_user_id uuid, p_reason text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.transfer_company(p_company_id uuid, p_to_user_id uuid, p_reason text) TO anon;
GRANT ALL ON FUNCTION public.transfer_company(p_company_id uuid, p_to_user_id uuid, p_reason text) TO authenticated;
GRANT ALL ON FUNCTION public.transfer_company(p_company_id uuid, p_to_user_id uuid, p_reason text) TO service_role;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.uid() TO anon;
GRANT ALL ON FUNCTION public.uid() TO authenticated;
GRANT ALL ON FUNCTION public.uid() TO service_role;


--
-- Name: FUNCTION update_sign_token(signature_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_sign_token(signature_id uuid) TO anon;
GRANT ALL ON FUNCTION public.update_sign_token(signature_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.update_sign_token(signature_id uuid) TO service_role;


--
-- Name: FUNCTION update_signed_documents_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_signed_documents_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_signed_documents_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_signed_documents_updated_at() TO service_role;


--
-- Name: FUNCTION update_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at() TO service_role;


--
-- Name: FUNCTION update_user_password(user_id uuid, new_password text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_user_password(user_id uuid, new_password text) TO anon;
GRANT ALL ON FUNCTION public.update_user_password(user_id uuid, new_password text) TO authenticated;
GRANT ALL ON FUNCTION public.update_user_password(user_id uuid, new_password text) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION http_request(); Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

REVOKE ALL ON FUNCTION supabase_functions.http_request() FROM PUBLIC;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO postgres;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO anon;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO authenticated;
GRANT ALL ON FUNCTION supabase_functions.http_request() TO service_role;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;


--
-- Name: TABLE attendance_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.attendance_records TO anon;
GRANT ALL ON TABLE public.attendance_records TO authenticated;
GRANT ALL ON TABLE public.attendance_records TO service_role;


--
-- Name: TABLE attendance_signatures; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.attendance_signatures TO anon;
GRANT ALL ON TABLE public.attendance_signatures TO authenticated;
GRANT ALL ON TABLE public.attendance_signatures TO service_role;


--
-- Name: TABLE companies; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.companies TO anon;
GRANT ALL ON TABLE public.companies TO authenticated;
GRANT ALL ON TABLE public.companies TO service_role;


--
-- Name: TABLE company_code_sequences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.company_code_sequences TO anon;
GRANT ALL ON TABLE public.company_code_sequences TO authenticated;
GRANT ALL ON TABLE public.company_code_sequences TO service_role;


--
-- Name: TABLE company_transfers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.company_transfers TO anon;
GRANT ALL ON TABLE public.company_transfers TO authenticated;
GRANT ALL ON TABLE public.company_transfers TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE company_transfer_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.company_transfer_history TO anon;
GRANT ALL ON TABLE public.company_transfer_history TO authenticated;
GRANT ALL ON TABLE public.company_transfer_history TO service_role;


--
-- Name: TABLE document_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.document_templates TO anon;
GRANT ALL ON TABLE public.document_templates TO authenticated;
GRANT ALL ON TABLE public.document_templates TO service_role;


--
-- Name: TABLE employee_document_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.employee_document_records TO anon;
GRANT ALL ON TABLE public.employee_document_records TO authenticated;
GRANT ALL ON TABLE public.employee_document_records TO service_role;


--
-- Name: TABLE employees; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.employees TO anon;
GRANT ALL ON TABLE public.employees TO authenticated;
GRANT ALL ON TABLE public.employees TO service_role;


--
-- Name: TABLE labor_contract_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.labor_contract_history TO anon;
GRANT ALL ON TABLE public.labor_contract_history TO authenticated;
GRANT ALL ON TABLE public.labor_contract_history TO service_role;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;


--
-- Name: TABLE operation_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.operation_logs TO anon;
GRANT ALL ON TABLE public.operation_logs TO authenticated;
GRANT ALL ON TABLE public.operation_logs TO service_role;


--
-- Name: TABLE permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.permissions TO anon;
GRANT ALL ON TABLE public.permissions TO authenticated;
GRANT ALL ON TABLE public.permissions TO service_role;


--
-- Name: TABLE reminder_configs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reminder_configs TO anon;
GRANT ALL ON TABLE public.reminder_configs TO authenticated;
GRANT ALL ON TABLE public.reminder_configs TO service_role;


--
-- Name: TABLE role_permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.role_permissions TO anon;
GRANT ALL ON TABLE public.role_permissions TO authenticated;
GRANT ALL ON TABLE public.role_permissions TO service_role;


--
-- Name: TABLE roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.roles TO anon;
GRANT ALL ON TABLE public.roles TO authenticated;
GRANT ALL ON TABLE public.roles TO service_role;


--
-- Name: TABLE salary_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.salary_items TO anon;
GRANT ALL ON TABLE public.salary_items TO authenticated;
GRANT ALL ON TABLE public.salary_items TO service_role;


--
-- Name: TABLE salary_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.salary_records TO anon;
GRANT ALL ON TABLE public.salary_records TO authenticated;
GRANT ALL ON TABLE public.salary_records TO service_role;


--
-- Name: TABLE salary_signatures; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.salary_signatures TO anon;
GRANT ALL ON TABLE public.salary_signatures TO authenticated;
GRANT ALL ON TABLE public.salary_signatures TO service_role;


--
-- Name: TABLE salary_structure_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.salary_structure_templates TO anon;
GRANT ALL ON TABLE public.salary_structure_templates TO authenticated;
GRANT ALL ON TABLE public.salary_structure_templates TO service_role;


--
-- Name: TABLE signed_documents; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.signed_documents TO anon;
GRANT ALL ON TABLE public.signed_documents TO authenticated;
GRANT ALL ON TABLE public.signed_documents TO service_role;


--
-- Name: TABLE signing_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.signing_records TO anon;
GRANT ALL ON TABLE public.signing_records TO authenticated;
GRANT ALL ON TABLE public.signing_records TO service_role;


--
-- Name: TABLE user_roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_roles TO anon;
GRANT ALL ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE messages_2026_03_20; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_20 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_20 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_21; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_21 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_21 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_22; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_22 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_22 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_23; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_23 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_23 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_24; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_24 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_24 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_25; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_25 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_25 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_26; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_26 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_26 TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE iceberg_namespaces; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.iceberg_namespaces TO service_role;
GRANT SELECT ON TABLE storage.iceberg_namespaces TO authenticated;
GRANT SELECT ON TABLE storage.iceberg_namespaces TO anon;


--
-- Name: TABLE iceberg_tables; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.iceberg_tables TO service_role;
GRANT SELECT ON TABLE storage.iceberg_tables TO authenticated;
GRANT SELECT ON TABLE storage.iceberg_tables TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE hooks; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.hooks TO postgres;
GRANT ALL ON TABLE supabase_functions.hooks TO anon;
GRANT ALL ON TABLE supabase_functions.hooks TO authenticated;
GRANT ALL ON TABLE supabase_functions.hooks TO service_role;


--
-- Name: SEQUENCE hooks_id_seq; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO postgres;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO anon;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO authenticated;
GRANT ALL ON SEQUENCE supabase_functions.hooks_id_seq TO service_role;


--
-- Name: TABLE migrations; Type: ACL; Schema: supabase_functions; Owner: supabase_functions_admin
--

GRANT ALL ON TABLE supabase_functions.migrations TO postgres;
GRANT ALL ON TABLE supabase_functions.migrations TO anon;
GRANT ALL ON TABLE supabase_functions.migrations TO authenticated;
GRANT ALL ON TABLE supabase_functions.migrations TO service_role;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: supabase_functions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA supabase_functions GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict Yq7EOkmn98nvGkMsBTAJSEul8c82oPYu8lh6bqrhKp0z0NidphhkJbqFoRSkMau


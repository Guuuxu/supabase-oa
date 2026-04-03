-- 为 signing_records 增加第三方合同编号/名称（如爱签 contractNo/contractName）
ALTER TABLE signing_records
ADD COLUMN IF NOT EXISTS third_party_contract_no TEXT,
ADD COLUMN IF NOT EXISTS third_party_contract_name TEXT;

COMMENT ON COLUMN signing_records.third_party_contract_no IS '第三方合同编号（如爱签 contractNo）';
COMMENT ON COLUMN signing_records.third_party_contract_name IS '第三方合同名称（如爱签 contractName）';


-- 为reminder_configs表添加续签通知提前天数字段
ALTER TABLE reminder_configs
ADD COLUMN renewal_notice_days INTEGER DEFAULT 7 CHECK (renewal_notice_days >= 1 AND renewal_notice_days <= 365);

COMMENT ON COLUMN reminder_configs.renewal_notice_days IS '续签通知提前天数，在合同到期前多少天发送续签通知';

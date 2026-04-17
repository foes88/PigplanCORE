-- ============================================================================
-- PigOS — Global DB Schema v2.0 (기획서 v2.3 반영)
-- ============================================================================
-- 변경 요약 (v1.0 → v2.0):
--   1. country_configs → market_defaults + region_defaults 2단계 분리
--   2. kpi_snapshots 컬럼 구조 → default_metric_values 속성 테이블
--      (scope_type, metric_code, default_value/benchmark_avg/top25/target_value)
--   3. JSONB KPI 권장 → scope_kpi_recommendations 테이블
--      (is_base / is_addon / addon_code / display_priority)
--   4. regulation_notes TEXT → compliance_profiles boolean 플래그 테이블
--   5. market_prices → market_price_reference (설정값/시장가격 분리)
--   6. 우선순위: farm → region → market → system (DISTINCT ON 쿼리)
--
-- 기준 문서:
--   - PigOS_PlanUpdate_v2.3.md (2026-04-15)
--   - db-schema-review-v1.md (2026-03-31 검증 리포트)
--
-- 작성: 2026-04-15
-- ============================================================================


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │  A. 설정 계층 (Configuration Layer)                                      │
-- │  우선순위: farm_config > region_defaults > market_defaults > system      │
-- └──────────────────────────────────────────────────────────────────────────┘

-- A-1. 권역 메타
CREATE TABLE market_defaults (
    market_code             VARCHAR(10) PRIMARY KEY,    -- NA / EU / SEA / NEA / SA
    market_name             VARCHAR(50) NOT NULL,
    weight_unit             VARCHAR(5) NOT NULL,        -- kg / lb
    currency_code           CHAR(3) NOT NULL,           -- USD / EUR / KRW...
    pricing_unit            VARCHAR(20),                -- USD/lb, KRW/kg (표시용)
    compliance_profile_code VARCHAR(50),                -- → compliance_profiles
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO market_defaults VALUES
    ('NA',  '북미',       'lb', 'USD', 'USD/lb', 'US_STANDARD',  NOW(), NOW()),
    ('EU',  '유럽',       'kg', 'EUR', 'EUR/kg', 'EU_STANDARD',  NOW(), NOW()),
    ('SEA', '동남아',     'kg', 'USD', 'USD/kg', 'SEA_STANDARD', NOW(), NOW()),
    ('NEA', '동북아',     'kg', 'KRW', 'KRW/kg', 'KR_STANDARD',  NOW(), NOW()),
    ('SA',  '남미',       'kg', 'USD', 'USD/kg', 'SEA_STANDARD', NOW(), NOW());


-- A-2. 국가(지역) 메타
CREATE TABLE region_defaults (
    region_code             VARCHAR(10) PRIMARY KEY,    -- KR / US / TH / VN / DE...
    region_name             VARCHAR(50) NOT NULL,
    market_code             VARCHAR(10) NOT NULL REFERENCES market_defaults(market_code),
    weight_unit             VARCHAR(5),                 -- 국가별 override
    currency_code           CHAR(3),
    pricing_unit            VARCHAR(20),
    compliance_profile_code VARCHAR(50),                -- → compliance_profiles
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO region_defaults VALUES
    ('KR', '한국',     'NEA', 'kg', 'KRW', 'KRW/kg', 'KR_STANDARD',  NOW(), NOW()),
    ('US', '미국',     'NA',  'lb', 'USD', 'USD/lb', 'US_STANDARD',  NOW(), NOW()),
    ('TH', '태국',     'SEA', 'kg', 'USD', 'USD/kg', 'SEA_STANDARD', NOW(), NOW()),
    ('VN', '베트남',   'SEA', 'kg', 'USD', 'USD/kg', 'SEA_STANDARD', NOW(), NOW()),
    ('DE', '독일',     'EU',  'kg', 'EUR', 'EUR/kg', 'EU_STANDARD',  NOW(), NOW()),
    ('DK', '덴마크',   'EU',  'kg', 'EUR', 'EUR/kg', 'EU_STANDARD',  NOW(), NOW()),
    ('NL', '네덜란드', 'EU',  'kg', 'EUR', 'EUR/kg', 'EU_STANDARD',  NOW(), NOW()),
    ('ES', '스페인',   'EU',  'kg', 'EUR', 'EUR/kg', 'EU_STANDARD',  NOW(), NOW()),
    ('BR', '브라질',   'SA',  'kg', 'USD', 'USD/kg', 'SEA_STANDARD', NOW(), NOW()),
    ('PH', '필리핀',   'SEA', 'kg', 'USD', 'USD/kg', 'SEA_STANDARD', NOW(), NOW()),
    ('CN', '중국',     'NEA', 'kg', 'USD', 'USD/kg', 'KR_STANDARD',  NOW(), NOW());


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │  B. KPI 기본값·벤치마크 (default_metric_values)                          │
-- │  KPI를 컬럼이 아닌 행으로 정규화. 4개 값 분리.                            │
-- └──────────────────────────────────────────────────────────────────────────┘

CREATE TABLE default_metric_values (
    id               BIGSERIAL PRIMARY KEY,
    scope_type       VARCHAR(20) NOT NULL
        CHECK (scope_type IN ('system','market','region','farm')),
    scope_code       VARCHAR(20) NOT NULL,           -- SYSTEM / NA / KR / FARM_001
    metric_code      VARCHAR(50) NOT NULL,           -- PSY / MSY / NPD / FCR / MORTALITY
    default_value    DECIMAL(10,2),                  -- 신규 농장 자동 입력값
    benchmark_avg    DECIMAL(10,2),                  -- 국가/권역 평균
    benchmark_top25  DECIMAL(10,2),                  -- 상위 25%
    target_value     DECIMAL(10,2),                  -- 제품 권장 목표
    unit_code        VARCHAR(20),                    -- %, days, kg, ratio
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (scope_type, scope_code, metric_code)
);
CREATE INDEX idx_dmv_lookup ON default_metric_values(metric_code, scope_type, scope_code);

-- 시스템 기본값
INSERT INTO default_metric_values
  (scope_type, scope_code, metric_code,
   default_value, benchmark_avg, benchmark_top25, target_value, unit_code) VALUES
  ('system','SYSTEM','PSY',       22.0, 24.3, 27.0, 28.0, 'piglets/sow/year'),
  ('system','SYSTEM','MSY',       20.0, 22.0, 25.0, 26.0, 'piglets/sow/year'),
  ('system','SYSTEM','NPD',       35.0, 30.0, 22.0, 20.0, 'days'),
  ('system','SYSTEM','FCR',        2.8,  2.6,  2.4,  2.3, 'ratio'),
  ('system','SYSTEM','MORTALITY',  5.0,  4.0,  2.5,  2.0, '%');

-- 북미
INSERT INTO default_metric_values
  (scope_type, scope_code, metric_code,
   default_value, benchmark_avg, benchmark_top25, target_value, unit_code) VALUES
  ('market','NA','PSY', 24.0, 26.5, 29.0, 30.0, 'piglets/sow/year'),
  ('market','NA','NPD', 28.0, 24.0, 18.0, 16.0, 'days'),
  ('market','NA','FCR',  2.6,  2.5,  2.3,  2.2, 'ratio');

-- EU (항생제 필수)
INSERT INTO default_metric_values
  (scope_type, scope_code, metric_code,
   default_value, benchmark_avg, benchmark_top25, target_value, unit_code) VALUES
  ('market','EU','PSY',            26.0, 28.5, 31.0, 32.0, 'piglets/sow/year'),
  ('market','EU','ANTIBIOTIC_USE',  0.5,  0.3,  0.1,  0.05,'treatments/year'),
  ('market','EU','WELFARE_SCORE',   3.0,  3.5,  4.2,  4.5, 'score');

-- 한국
INSERT INTO default_metric_values
  (scope_type, scope_code, metric_code,
   default_value, benchmark_avg, benchmark_top25, target_value, unit_code) VALUES
  ('region','KR','PSY', 22.0, 24.3, 27.0, 28.0, 'piglets/sow/year'),
  ('region','KR','MSY', 20.0, 22.1, 25.0, 26.0, 'piglets/sow/year'),
  ('region','KR','NPD', 35.0, 31.0, 22.0, 20.0, 'days');


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │  C. KPI 노출·추천·과금 (scope_kpi_recommendations)                        │
-- │  무료/유료·표시 순서·Addon 연결을 테이블로 관리 (JSONB 대체)               │
-- └──────────────────────────────────────────────────────────────────────────┘

CREATE TABLE scope_kpi_recommendations (
    id               BIGSERIAL PRIMARY KEY,
    scope_type       VARCHAR(20) NOT NULL
        CHECK (scope_type IN ('system','market','region')),
    scope_code       VARCHAR(20) NOT NULL,
    kpi_code         VARCHAR(50) NOT NULL,
    display_priority INT NOT NULL DEFAULT 100,       -- 낮을수록 먼저 노출
    is_base          BOOLEAN NOT NULL DEFAULT FALSE, -- 베이직(무료) 포함
    is_addon         BOOLEAN NOT NULL DEFAULT FALSE, -- 유료 Addon
    addon_code       VARCHAR(50),                    -- ADDON_FCR / ADDON_COST 등
    is_visible       BOOLEAN NOT NULL DEFAULT TRUE,  -- 대시보드 기본 노출
    farm_type        VARCHAR(20),                    -- 일관/번식/비육 (NULL=전체)
    min_sow_count    INT,                            -- 최소 모돈 수 조건
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (NOT (is_base = TRUE AND is_addon = TRUE)),
    UNIQUE (scope_type, scope_code, kpi_code, farm_type, min_sow_count)
);
CREATE INDEX idx_skr_lookup ON scope_kpi_recommendations(scope_type, scope_code, display_priority);

-- 한국 KPI 세팅
INSERT INTO scope_kpi_recommendations
  (scope_type, scope_code, kpi_code, display_priority, is_base, is_addon, addon_code,
   is_visible, farm_type, min_sow_count) VALUES
  ('region','KR','PSY',  1, TRUE,  FALSE, NULL,        TRUE,  NULL, NULL),
  ('region','KR','MSY',  2, TRUE,  FALSE, NULL,        TRUE,  NULL, NULL),
  ('region','KR','NPD',  3, TRUE,  FALSE, NULL,        TRUE,  NULL, NULL),
  ('region','KR','FCR',  4, FALSE, TRUE,  'ADDON_FCR', FALSE, NULL, 100);

-- 북미 (FCR이 Base)
INSERT INTO scope_kpi_recommendations
  (scope_type, scope_code, kpi_code, display_priority, is_base, is_addon, addon_code,
   is_visible, farm_type, min_sow_count) VALUES
  ('market','NA','PSY',  1, TRUE,  FALSE, NULL,         TRUE,  NULL, NULL),
  ('market','NA','NPD',  2, TRUE,  FALSE, NULL,         TRUE,  NULL, NULL),
  ('market','NA','FCR',  3, TRUE,  FALSE, NULL,         TRUE,  NULL, NULL),
  ('market','NA','COST', 4, FALSE, TRUE,  'ADDON_COST', FALSE, NULL, 500);

-- EU (항생제 추적 Base)
INSERT INTO scope_kpi_recommendations
  (scope_type, scope_code, kpi_code, display_priority, is_base, is_addon, addon_code,
   is_visible, farm_type, min_sow_count) VALUES
  ('market','EU','PSY',             1, TRUE,  FALSE, NULL,            TRUE,  NULL, NULL),
  ('market','EU','ANTIBIOTIC_USE',  2, TRUE,  FALSE, NULL,            TRUE,  NULL, NULL),
  ('market','EU','WELFARE_SCORE',   3, FALSE, TRUE,  'ADDON_WELFARE', FALSE, NULL, NULL);


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │  D. 규제·컴플라이언스 (compliance_profiles)                              │
-- │  Boolean 플래그로 기능 조건 분기 (regulation_notes TEXT 대체)             │
-- └──────────────────────────────────────────────────────────────────────────┘

CREATE TABLE compliance_profiles (
    profile_code                  VARCHAR(50) PRIMARY KEY,
    profile_name                  VARCHAR(100) NOT NULL,
    requires_traceability         BOOLEAN NOT NULL DEFAULT FALSE,
    requires_welfare_metrics      BOOLEAN NOT NULL DEFAULT FALSE,
    requires_antibiotic_tracking  BOOLEAN NOT NULL DEFAULT FALSE,
    requires_env_reporting        BOOLEAN NOT NULL DEFAULT FALSE,
    min_wean_period               INT,                   -- 최소 이유일령 (일)
    max_antibiotic_treatments     DECIMAL(5,2),          -- 연간 처치 상한
    notes                         TEXT,
    created_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO compliance_profiles
  (profile_code, profile_name,
   requires_traceability, requires_welfare_metrics,
   requires_antibiotic_tracking, requires_env_reporting,
   min_wean_period, max_antibiotic_treatments, notes) VALUES
  ('KR_STANDARD', '한국 표준',
   FALSE, FALSE, FALSE, FALSE, 21, NULL, '국내 일반 기준'),
  ('EU_STANDARD', 'EU 표준',
   TRUE,  TRUE,  TRUE,  TRUE,  28, 1.0,  'EU 동물복지·항생제 규정'),
  ('US_STANDARD', '미국 표준',
   FALSE, FALSE, FALSE, FALSE, 21, NULL, 'USDA 기본 기준'),
  ('SEA_STANDARD','동남아 표준',
   FALSE, FALSE, FALSE, FALSE, 25, NULL, 'ASF 대응 가이드 포함');


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │  E. 시장 가격 (market_price_reference)                                   │
-- │  설정값과 분리된 시장 변동 가격 (외부 소스 연동)                           │
-- └──────────────────────────────────────────────────────────────────────────┘

CREATE TABLE market_price_reference (
    id              BIGSERIAL PRIMARY KEY,
    region_code     VARCHAR(10) REFERENCES region_defaults(region_code),
    market_code     VARCHAR(10) REFERENCES market_defaults(market_code),
    price_type      VARCHAR(30) NOT NULL,       -- LIVE_HOG / PORK_CUTOUT / LEAN_HOG_FUTURES
    price_value     DECIMAL(12,4) NOT NULL,
    currency_code   CHAR(3) NOT NULL,
    weight_unit     VARCHAR(5) NOT NULL,
    price_date      DATE NOT NULL,
    source          VARCHAR(100),               -- USDA / CME / EKAPEPIA / MAFRA
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (region_code IS NOT NULL OR market_code IS NOT NULL)
);
CREATE INDEX idx_mpr_region_date ON market_price_reference(region_code, price_date DESC);
CREATE INDEX idx_mpr_market_date ON market_price_reference(market_code, price_date DESC);

INSERT INTO market_price_reference
  (region_code, market_code, price_type, price_value, currency_code, weight_unit,
   price_date, source) VALUES
  ('KR', 'NEA', 'LIVE_HOG',          5200,   'KRW', 'kg', '2026-04-17', 'MAFRA'),
  ('US', 'NA',  'LEAN_HOG_FUTURES',     0.89,'USD', 'lb', '2026-04-17', 'CME'),
  (NULL, 'EU',  'PORK_CUTOUT',          1.85,'EUR', 'kg', '2026-04-17', 'EC_DASHBOARD');


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │  F. 우선순위 조회 View — effective KPI 기준값                             │
-- │  farm → region → market → system 순으로 DISTINCT ON                      │
-- └──────────────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION effective_metric_values(
    p_farm_code   VARCHAR,
    p_region_code VARCHAR,
    p_market_code VARCHAR
)
RETURNS TABLE (
    metric_code      VARCHAR,
    default_value    DECIMAL,
    benchmark_avg    DECIMAL,
    benchmark_top25  DECIMAL,
    target_value     DECIMAL,
    unit_code        VARCHAR,
    scope_type       VARCHAR
) AS $$
    SELECT DISTINCT ON (metric_code)
      metric_code, default_value, benchmark_avg,
      benchmark_top25, target_value, unit_code, scope_type
    FROM default_metric_values
    WHERE (scope_type = 'farm'   AND scope_code = p_farm_code)
       OR (scope_type = 'region' AND scope_code = p_region_code)
       OR (scope_type = 'market' AND scope_code = p_market_code)
       OR (scope_type = 'system' AND scope_code = 'SYSTEM')
    ORDER BY
      metric_code,
      CASE scope_type
        WHEN 'farm'   THEN 1
        WHEN 'region' THEN 2
        WHEN 'market' THEN 3
        WHEN 'system' THEN 4
      END;
$$ LANGUAGE SQL STABLE;


-- ┌──────────────────────────────────────────────────────────────────────────┐
-- │  G. 트리거: updated_at 자동 갱신                                          │
-- └──────────────────────────────────────────────────────────────────────────┘

CREATE TRIGGER trg_market_defaults_updated
    BEFORE UPDATE ON market_defaults
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_region_defaults_updated
    BEFORE UPDATE ON region_defaults
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_dmv_updated
    BEFORE UPDATE ON default_metric_values
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_compliance_profiles_updated
    BEFORE UPDATE ON compliance_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ============================================================================
-- v2.0 SCHEMA SUMMARY (신규/변경 테이블만)
-- ============================================================================
-- A. Config Layer      : market_defaults, region_defaults                 (신규)
-- B. Metric Values     : default_metric_values                            (신규)
-- C. KPI Routing       : scope_kpi_recommendations                        (신규)
-- D. Compliance        : compliance_profiles                              (신규)
-- E. Market Price      : market_price_reference                           (신규, market_prices 대체)
-- F. View              : effective_metric_values()                        (신규)
--
-- 제거/대체:
--   - country_configs      → market_defaults + region_defaults
--   - kpi_snapshots (컬럼) → default_metric_values (행 정규화)
--                            kpi_snapshots 자체는 실측 스냅샷 저장용으로 유지
--   - compliance_reports   → compliance_profiles (+ 기존 JSONB report_data 보존)
--   - market_prices        → market_price_reference
-- ============================================================================

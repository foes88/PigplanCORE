# Schema v1 → v2 마이그레이션 가이드

> 2026-04-15 | 기획서 v2.3 반영
> 대상: [db-schema-v1.sql](2026-03-19_db-schema-v1.sql) → [db-schema-v2.sql](2026-04-15_db-schema-v2.sql)

---

## 0. 마이그레이션 원칙

1. **기존 데이터 무손실**: v1 테이블은 DROP하지 않고 `_legacy` 접미사로 유지 후 단계적 제거
2. **단계 적용**: 신규 테이블 생성 → 데이터 이관 → 애플리케이션 전환 → v1 제거
3. **MVP 이전 적용**: 5월 DB 검증 단계에서 완료 (7월 출시 전)
4. **롤백 가능**: 각 단계는 독립 트랜잭션, 중단점 명확화

---

## 1. 변경 범위 요약

| # | 영역 | v1 (현재) | v2 (신규) | 유형 |
|---|------|-----------|----------|------|
| 1 | 설정 계층 | `country_configs` (국가 단위) | `market_defaults` + `region_defaults` | 분리 |
| 2 | KPI 기준값 | `kpi_snapshots` 컬럼 | `default_metric_values` 행 | 정규화 |
| 3 | KPI 권장 | (없음 / JSONB 산재) | `scope_kpi_recommendations` | 신규 |
| 4 | 규제 관리 | `compliance_reports` (JSONB) | `compliance_profiles` (boolean) | 재설계 |
| 5 | 시장 가격 | `market_prices` | `market_price_reference` | 대체 |

---

## 2. 단계별 실행 계획

### Phase M1 — 신규 테이블 생성 (4월 3주차)

`db-schema-v2.sql` 전체 실행. 기존 테이블은 건드리지 않음.

```sql
\i docs/specs/2026-04-15_db-schema-v2.sql
```

**검증:**
```sql
SELECT COUNT(*) FROM market_defaults;          -- 5
SELECT COUNT(*) FROM region_defaults;          -- 11
SELECT COUNT(*) FROM default_metric_values;    -- 14+
SELECT COUNT(*) FROM scope_kpi_recommendations;-- 10+
SELECT COUNT(*) FROM compliance_profiles;      -- 4
SELECT COUNT(*) FROM market_price_reference;   -- 3
```

---

### Phase M2 — country_configs → market/region (4월 4주차)

**변환 매핑:**

| v1 country | → v2 region_code | → v2 market_code |
|------------|------------------|------------------|
| KR | KR | NEA |
| DK, DE, NL, ES | 동일 | EU |
| US | US | NA |
| BR | BR | SA |
| VN, TH, PH | 동일 | SEA |
| CN | CN | NEA |

**데이터 이관 스크립트:**
```sql
-- 이미 INSERT된 region_defaults와 충돌 시 UPSERT
INSERT INTO region_defaults (region_code, region_name, market_code, weight_unit,
                             currency_code, compliance_profile_code, created_at, updated_at)
SELECT
    country,
    country_name,
    CASE country
        WHEN 'KR' THEN 'NEA' WHEN 'CN' THEN 'NEA'
        WHEN 'US' THEN 'NA'
        WHEN 'BR' THEN 'SA'
        WHEN 'DK' THEN 'EU' WHEN 'DE' THEN 'EU'
        WHEN 'NL' THEN 'EU' WHEN 'ES' THEN 'EU'
        WHEN 'VN' THEN 'SEA' WHEN 'TH' THEN 'SEA' WHEN 'PH' THEN 'SEA'
    END,
    weight_unit,
    currency,
    CASE
        WHEN has_antibiotic_report AND has_welfare_cert THEN 'EU_STANDARD'
        WHEN country = 'US' THEN 'US_STANDARD'
        WHEN country IN ('VN','TH','PH','BR') THEN 'SEA_STANDARD'
        ELSE 'KR_STANDARD'
    END,
    NOW(), NOW()
FROM country_configs
ON CONFLICT (region_code) DO UPDATE SET
    compliance_profile_code = EXCLUDED.compliance_profile_code,
    updated_at = NOW();
```

**Compliance 플래그 이관:**
```sql
-- country_configs의 boolean 플래그를 compliance_profiles에 통합
UPDATE compliance_profiles SET
    requires_antibiotic_tracking = TRUE,
    requires_welfare_metrics     = TRUE,
    requires_env_reporting       = TRUE
WHERE profile_code = 'EU_STANDARD';
-- (이미 기본 INSERT 시 반영됨. country_configs에 추가 플래그 있으면 별도 UPDATE)
```

**`farms.country` 참조 경로 변경:**

현재: `farms.country (CHAR(2))` → `country_configs.country`
변경: `farms.country` → `region_defaults.region_code` (값 동일, 참조 대상만 변경)

```sql
ALTER TABLE farms
    ADD CONSTRAINT fk_farms_region
    FOREIGN KEY (country) REFERENCES region_defaults(region_code);
```

> 주의: 기존 데이터 중 `region_defaults`에 없는 country 코드가 있으면 FK 생성 실패. 먼저 누락 region을 INSERT해야 함.

**v1 `country_configs` 처리:**
- 즉시 DROP 금지. `country_configs_legacy`로 rename 후 Phase M5에서 제거.

```sql
ALTER TABLE country_configs RENAME TO country_configs_legacy;
```

---

### Phase M3 — kpi_snapshots 컬럼 → default_metric_values (5월 1주차)

**주의: `kpi_snapshots` 자체는 유지.** 이유: 농장별 실측 스냅샷은 여전히 행 단위로 저장 필요.
변경 대상은 **벤치마크/기준값** 부분뿐.

**삭제 대상 (컬럼):**
- `kpi_snapshots`에 **기준값/벤치마크가 포함된 경우 없음** (v1은 실측만 저장) → 이관 불필요
- `benchmarks` 테이블이 벤치마크 보관 → 여기를 `default_metric_values`로 이관

**benchmarks → default_metric_values 이관:**
```sql
-- benchmarks의 *_avg, *_top10 값을 default_metric_values 행으로 변환
INSERT INTO default_metric_values
    (scope_type, scope_code, metric_code,
     benchmark_avg, benchmark_top25, unit_code)
SELECT 'region', country, 'PSY', psy_avg, psy_top10, 'piglets/sow/year'
FROM benchmarks
WHERE psy_avg IS NOT NULL
ON CONFLICT (scope_type, scope_code, metric_code) DO UPDATE SET
    benchmark_avg   = EXCLUDED.benchmark_avg,
    benchmark_top25 = EXCLUDED.benchmark_top25,
    updated_at      = NOW();

INSERT INTO default_metric_values
    (scope_type, scope_code, metric_code, benchmark_avg, benchmark_top25, unit_code)
SELECT 'region', country, 'FCR', fcr_avg, fcr_top10, 'ratio'
FROM benchmarks WHERE fcr_avg IS NOT NULL
ON CONFLICT (scope_type, scope_code, metric_code) DO UPDATE SET
    benchmark_avg = EXCLUDED.benchmark_avg, updated_at = NOW();

INSERT INTO default_metric_values
    (scope_type, scope_code, metric_code, benchmark_avg, unit_code)
SELECT 'region', country, 'NPD', npd_avg, 'days'
FROM benchmarks WHERE npd_avg IS NOT NULL
ON CONFLICT (scope_type, scope_code, metric_code) DO UPDATE SET
    benchmark_avg = EXCLUDED.benchmark_avg, updated_at = NOW();
```

**벤치마크 API 엔드포인트 전환:**
- `/api/benchmarks/{country}` → `effective_metric_values(farm_code, region_code, market_code)` 호출

**`benchmarks` 테이블 처리:**
```sql
ALTER TABLE benchmarks RENAME TO benchmarks_legacy;
```

---

### Phase M4 — compliance_reports + regulation_notes → compliance_profiles (5월 1주차)

**원칙:**
- `compliance_reports` (실제 제출 보고서 기록) → **유지**. 보고서 파일은 계속 필요.
- `country_configs`의 `has_*` 플래그 → `compliance_profiles`로 흡수 (이미 Phase M2에서 처리).
- `regulation_notes` TEXT 컬럼이 **어디에든 있으면** `compliance_profiles.notes`로 이관.

**확인 쿼리:**
```sql
SELECT column_name, table_name
FROM information_schema.columns
WHERE column_name LIKE '%regulation%' OR column_name LIKE '%compliance%';
```

**FK 연결:**
```sql
ALTER TABLE region_defaults
    ADD CONSTRAINT fk_region_compliance
    FOREIGN KEY (compliance_profile_code)
    REFERENCES compliance_profiles(profile_code);

ALTER TABLE market_defaults
    ADD CONSTRAINT fk_market_compliance
    FOREIGN KEY (compliance_profile_code)
    REFERENCES compliance_profiles(profile_code);
```

---

### Phase M5 — market_prices → market_price_reference (5월 2주차)

**이관:**
```sql
INSERT INTO market_price_reference
    (region_code, market_code, price_type, price_value,
     currency_code, weight_unit, price_date, source)
SELECT
    country,
    (SELECT market_code FROM region_defaults WHERE region_code = mp.country),
    'LIVE_HOG',
    live_pig_price,
    SPLIT_PART(price_unit, '_', 1),       -- KRW_KG → KRW
    LOWER(SPLIT_PART(price_unit, '_', 2)),-- KRW_KG → kg
    price_date,
    source
FROM market_prices mp
WHERE live_pig_price IS NOT NULL;

INSERT INTO market_price_reference
    (region_code, market_code, price_type, price_value,
     currency_code, weight_unit, price_date, source)
SELECT
    country,
    (SELECT market_code FROM region_defaults WHERE region_code = mp.country),
    'PORK_CUTOUT',
    carcass_price,
    SPLIT_PART(price_unit, '_', 1),
    LOWER(SPLIT_PART(price_unit, '_', 2)),
    price_date,
    source
FROM market_prices mp
WHERE carcass_price IS NOT NULL;

-- corn_price / soybean_meal_price는 price_type = 'FEED_CORN' / 'FEED_SOY'로
-- (또는 별도 feed_price_reference 테이블 분리 고려)
```

**Legacy 처리:**
```sql
ALTER TABLE market_prices RENAME TO market_prices_legacy;
```

---

### Phase M6 — Legacy 제거 (6월 코드리뷰 기간)

MVP 출시 후 2주 안정화 확인 → v1 테이블 완전 제거.

```sql
DROP TABLE country_configs_legacy;
DROP TABLE benchmarks_legacy;
DROP TABLE market_prices_legacy;
```

---

## 3. 애플리케이션 코드 영향

### 3-1. KPI 조회 로직

**Before (v1):**
```python
benchmark = db.query(Benchmark).filter_by(country='KR').first()
farm_psy_target = benchmark.psy_top10
```

**After (v2):**
```python
metrics = db.execute(
    "SELECT * FROM effective_metric_values(%s, %s, %s)",
    (farm.code, farm.region_code, farm.market_code)
).fetchall()
psy = next(m for m in metrics if m.metric_code == 'PSY')
farm_psy_target = psy.target_value
```

### 3-2. 대시보드 KPI 노출

**Before:** 하드코딩된 KPI 리스트 (PSY, NPD, FCR...)

**After:**
```python
visible_kpis = db.execute("""
    SELECT DISTINCT ON (kpi_code) kpi_code, is_base, is_addon, addon_code
    FROM scope_kpi_recommendations
    WHERE (scope_type = 'region' AND scope_code = %s)
       OR (scope_type = 'market' AND scope_code = %s)
       OR (scope_type = 'system' AND scope_code = 'SYSTEM')
    ORDER BY kpi_code, CASE scope_type
        WHEN 'region' THEN 1 WHEN 'market' THEN 2 WHEN 'system' THEN 3
    END, display_priority
""", (region_code, market_code)).fetchall()
```

### 3-3. 규제 분기 로직

**Before:** `country_configs.has_antibiotic_report` 하드 플래그

**After:**
```python
profile = get_compliance_profile(farm.region_code)
if profile.requires_antibiotic_tracking:
    force_show_kpi('ANTIBIOTIC_USE')
if farm.wean_period < profile.min_wean_period:
    raise ValidationError(f"최소 이유일령 {profile.min_wean_period}일")
```

---

## 4. 테스트 체크리스트

- [ ] Phase M1 전체 테이블 INSERT 검증
- [ ] Phase M2: `farms.country` → `region_defaults.region_code` FK 제약 통과
- [ ] Phase M3: 기존 `benchmarks` 데이터가 `default_metric_values`에 100% 이관됨
- [ ] Phase M4: 모든 region/market이 유효한 `compliance_profile_code` 보유
- [ ] Phase M5: `market_prices` → `market_price_reference` 행 수 일치
- [ ] `effective_metric_values()` View: farm/region/market/system 우선순위 정확도
- [ ] 온보딩 플로우 E2E: IP 감지 → region pre-select → base KPI 자동 추천
- [ ] EU 농장 가입 시 `ANTIBIOTIC_USE` 강제 노출 확인
- [ ] 북미 가입 시 `FCR`이 Base로 표시 확인 (한국은 Addon)

---

## 5. 롤백 절차

각 Phase는 독립 트랜잭션. 실패 시:

| Phase | 롤백 방법 |
|-------|-----------|
| M1 | `DROP TABLE` 신규 5개 + view |
| M2 | `ALTER TABLE country_configs_legacy RENAME TO country_configs`, FK 제거 |
| M3 | `benchmarks_legacy` 복원, DMV에서 `scope_type='region'` 삭제 |
| M4 | compliance_profile_code FK 제거 |
| M5 | `market_prices_legacy` 복원 |
| M6 | (되돌릴 수 없음 — 백업에서 복원만) |

---

## 6. 미결정 항목 (진행 전 확인 필요)

- [ ] **CN의 market_code**: NEA vs 독립 권역? (일단 NEA로 배치)
- [ ] **feed_price 분리**: `market_price_reference`에 통합 vs 별도 `feed_price_reference`?
- [ ] **farms.market_code 컬럼 추가 여부**: region_defaults 조인으로 해결 vs 중복 저장
- [ ] **scope_type='farm' DMV**: 개별 농장 목표값 설정 UI 제공 시점

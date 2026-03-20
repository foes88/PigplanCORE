window.MOCK_DATA = {

  farm: {
    id: 'farm-001',
    farm_code: 'FARM-KR-001',
    name: '안성 1농장',
    country: 'KR',
    unit_system: 'METRIC',
    active_sow_count: 680,
    org: { name: '한양그룹' }
  },

  dashboard: {
    active_sows: 680,
    gestating: 218,
    lactating: 85,
    open_npd: 42,
    nursery: 480,
    finisher: 340,
    due_today: {
      breeding: 12,
      preg_check: 8,
      farrowing: 5,
      weaning: 3,
      shipment: 1,
      health_alerts: 2
    }
  },

  pipeline: [
    { stage: 'breeding', icon: '💉', label: 'Breeding', count: 12, sub: 'scheduled', tag: 'Today 12', tagColor: 'blue' },
    { stage: 'preg_check', icon: '🔍', label: 'Preg Check', count: 8, sub: 'this week', tag: '4 overdue', tagColor: 'accent' },
    { stage: 'gestation', icon: '🤰', label: 'Gestation', count: 218, sub: 'in progress', tag: 'On track', tagColor: 'success', active: true },
    { stage: 'farrowing', icon: '🐖', label: 'Farrowing', count: 5, sub: 'due soon', tag: '1 overdue', tagColor: 'danger' },
    { stage: 'lactation', icon: '🍼', label: 'Lactation', count: 85, sub: 'nursing', tag: 'Avg D14', tagColor: 'success' },
    { stage: 'weaning', icon: '🌱', label: 'Weaning', count: 3, sub: 'this week', tag: 'D21', tagColor: 'blue' }
  ],

  sows: [
    {
      id: 'sow-001',
      ear_tag: 'A-001',
      parity: 5,
      breed: 'LY',
      status: 'GESTATING',
      entry_date: '2022-03-10',
      building: '임신사A',
      last_event: { type: 'PREGNANCY_CHECK_POSITIVE', date: '2026-01-15' },
      next_expected: { type: 'FARROWING', date: '2026-04-02' },
      npd_days: 0
    },
    {
      id: 'sow-002',
      ear_tag: 'A-002',
      parity: 3,
      breed: 'LD',
      status: 'GESTATING',
      entry_date: '2023-08-22',
      building: '임신사A',
      last_event: { type: 'PREGNANCY_CHECK_POSITIVE', date: '2026-01-20' },
      next_expected: { type: 'FARROWING', date: '2026-04-08' },
      npd_days: 0
    },
    {
      id: 'sow-003',
      ear_tag: 'A-003',
      parity: 2,
      breed: 'LW',
      status: 'GESTATING',
      entry_date: '2024-01-14',
      building: '임신사B',
      last_event: { type: 'PREGNANCY_CHECK_POSITIVE', date: '2026-02-03' },
      next_expected: { type: 'FARROWING', date: '2026-04-18' },
      npd_days: 0
    },
    {
      id: 'sow-004',
      ear_tag: 'A-004',
      parity: 6,
      breed: 'LY',
      status: 'GESTATING',
      entry_date: '2021-11-05',
      building: '임신사A',
      last_event: { type: 'PREGNANCY_CHECK_POSITIVE', date: '2026-01-08' },
      next_expected: { type: 'FARROWING', date: '2026-03-25' },
      npd_days: 0
    },
    {
      id: 'sow-005',
      ear_tag: 'A-005',
      parity: 1,
      breed: 'LD',
      status: 'GESTATING',
      entry_date: '2025-04-18',
      building: '임신사B',
      last_event: { type: 'PREGNANCY_CHECK_POSITIVE', date: '2026-02-10' },
      next_expected: { type: 'FARROWING', date: '2026-04-25' },
      npd_days: 0
    },
    {
      id: 'sow-006',
      ear_tag: 'A-006',
      parity: 4,
      breed: 'LY',
      status: 'GESTATING',
      entry_date: '2022-09-30',
      building: '임신사A',
      last_event: { type: 'PREGNANCY_CHECK_POSITIVE', date: '2026-01-28' },
      next_expected: { type: 'FARROWING', date: '2026-04-12' },
      npd_days: 0
    },
    {
      id: 'sow-007',
      ear_tag: 'A-007',
      parity: 2,
      breed: 'LW',
      status: 'GESTATING',
      entry_date: '2024-05-11',
      building: '임신사B',
      last_event: { type: 'PREGNANCY_CHECK_POSITIVE', date: '2026-02-18' },
      next_expected: { type: 'FARROWING', date: '2026-05-03' },
      npd_days: 0
    },
    {
      id: 'sow-008',
      ear_tag: 'A-008',
      parity: 7,
      breed: 'LY',
      status: 'GESTATING',
      entry_date: '2021-06-20',
      building: '임신사A',
      last_event: { type: 'PREGNANCY_CHECK_POSITIVE', date: '2026-01-05' },
      next_expected: { type: 'FARROWING', date: '2026-03-22' },
      npd_days: 0
    },
    {
      id: 'sow-009',
      ear_tag: 'A-009',
      parity: 3,
      breed: 'LD',
      status: 'GESTATING',
      entry_date: '2023-12-01',
      building: '임신사B',
      last_event: { type: 'PREGNANCY_CHECK_POSITIVE', date: '2026-02-14' },
      next_expected: { type: 'FARROWING', date: '2026-04-28' },
      npd_days: 0
    },
    {
      id: 'sow-010',
      ear_tag: 'A-010',
      parity: 4,
      breed: 'LY',
      status: 'GESTATING',
      entry_date: '2022-07-19',
      building: '임신사A',
      last_event: { type: 'PREGNANCY_CHECK_POSITIVE', date: '2026-01-12' },
      next_expected: { type: 'FARROWING', date: '2026-03-28' },
      npd_days: 0
    },
    {
      id: 'sow-011',
      ear_tag: 'A-011',
      parity: 2,
      breed: 'LW',
      status: 'LACTATING',
      entry_date: '2024-02-28',
      building: '분만사B',
      last_event: { type: 'FARROWING', date: '2026-03-05' },
      next_expected: { type: 'WEANING', date: '2026-03-26' },
      npd_days: 0
    },
    {
      id: 'sow-012',
      ear_tag: 'A-012',
      parity: 5,
      breed: 'LY',
      status: 'LACTATING',
      entry_date: '2022-01-15',
      building: '분만사B',
      last_event: { type: 'FARROWING', date: '2026-03-01' },
      next_expected: { type: 'WEANING', date: '2026-03-22' },
      npd_days: 0
    },
    {
      id: 'sow-013',
      ear_tag: 'A-013',
      parity: 3,
      breed: 'LD',
      status: 'LACTATING',
      entry_date: '2023-10-09',
      building: '분만사B',
      last_event: { type: 'FARROWING', date: '2026-02-28' },
      next_expected: { type: 'WEANING', date: '2026-03-21' },
      npd_days: 0
    },
    {
      id: 'sow-014',
      ear_tag: 'A-014',
      parity: 1,
      breed: 'LW',
      status: 'LACTATING',
      entry_date: '2025-06-03',
      building: '분만사B',
      last_event: { type: 'FARROWING', date: '2026-03-10' },
      next_expected: { type: 'WEANING', date: '2026-03-31' },
      npd_days: 0
    },
    {
      id: 'sow-015',
      ear_tag: 'A-015',
      parity: 4,
      breed: 'LY',
      status: 'WEANED',
      entry_date: '2022-12-20',
      building: '대기사C',
      last_event: { type: 'WEANING', date: '2026-03-14' },
      next_expected: { type: 'HEAT_DETECTION', date: '2026-03-19' },
      npd_days: 5
    },
    {
      id: 'sow-016',
      ear_tag: 'A-016',
      parity: 6,
      breed: 'LD',
      status: 'WEANED',
      entry_date: '2021-08-11',
      building: '대기사C',
      last_event: { type: 'WEANING', date: '2026-03-12' },
      next_expected: { type: 'HEAT_DETECTION', date: '2026-03-17' },
      npd_days: 7
    },
    {
      id: 'sow-017',
      ear_tag: 'A-017',
      parity: 2,
      breed: 'LW',
      status: 'DRY',
      entry_date: '2024-04-25',
      building: '대기사C',
      last_event: { type: 'WEANING', date: '2026-03-08' },
      next_expected: { type: 'BREEDING', date: '2026-03-20' },
      npd_days: 11
    },
    {
      id: 'sow-018',
      ear_tag: 'A-018',
      parity: 1,
      breed: 'LY',
      status: 'ACTIVE',
      entry_date: '2025-09-14',
      building: '교배사D',
      last_event: { type: 'MATING', date: '2026-03-17' },
      next_expected: { type: 'PREGNANCY_CHECK', date: '2026-04-14' },
      npd_days: 0
    },
    {
      id: 'sow-019',
      ear_tag: 'A-019',
      parity: 3,
      breed: 'LD',
      status: 'ACTIVE',
      entry_date: '2023-07-02',
      building: '교배사D',
      last_event: { type: 'MATING', date: '2026-03-16' },
      next_expected: { type: 'PREGNANCY_CHECK', date: '2026-04-13' },
      npd_days: 0
    },
    {
      id: 'sow-020',
      ear_tag: 'A-020',
      parity: 0,
      breed: 'LY',
      status: 'ACTIVE',
      entry_date: '2026-01-10',
      building: '육성사E',
      last_event: { type: 'ENTRY', date: '2026-01-10' },
      next_expected: { type: 'FIRST_BREEDING', date: '2026-03-25' },
      npd_days: 0
    },
    {
      id: 'sow-042',
      ear_tag: 'A-042',
      parity: 3,
      breed: 'LY',
      status: 'GESTATING',
      entry_date: '2023-06-15',
      building: '임신사A',
      last_event: { type: 'PREGNANCY_CHECK_POSITIVE', date: '2025-12-23' },
      next_expected: { type: 'FARROWING', date: '2026-03-15' },
      npd_days: 0
    }
  ],

  tasks: [
    {
      id: 'task-001',
      title: '#A-042 분만 지연 확인',
      subtitle: '임신 115일 - 즉시 확인 필요',
      time: '08:00',
      priority: 'urgent',
      done: false
    },
    {
      id: 'task-002',
      title: '오전 교배 스케줄 (12두)',
      subtitle: '교배사D - A-018, A-019 외 10두',
      time: '09:00',
      priority: 'high',
      done: false
    },
    {
      id: 'task-003',
      title: '임신 감정 (8두)',
      subtitle: '임신사A/B - 초음파 검사',
      time: '10:30',
      priority: 'medium',
      done: false
    },
    {
      id: 'task-004',
      title: '분만사B 환경 점검',
      subtitle: '온도/환기 센서 확인 및 소독',
      time: '11:00',
      priority: 'medium',
      done: false
    },
    {
      id: 'task-005',
      title: '이유 예정 모돈 이동 (3두)',
      subtitle: '분만사B → 대기사C',
      time: '14:00',
      priority: 'medium',
      done: false
    },
    {
      id: 'task-006',
      title: '오전 사료 급이 완료',
      subtitle: '전 축사 1차 급이',
      time: '06:30',
      priority: 'high',
      done: true
    },
    {
      id: 'task-007',
      title: '출하돈 상차 완료',
      subtitle: '비육사 → 도축장 (42두)',
      time: '07:00',
      priority: 'high',
      done: true
    }
  ],

  farrowing_due: [
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      parity: 3,
      gestation_day: 115,
      barn: '임신사A',
      due_date: '2026-03-15',
      status: 'OVERDUE',
      born_alive: null,
      stillborn: null
    },
    {
      sow_id: 'sow-067',
      ear_tag: 'A-067',
      parity: 2,
      gestation_day: 113,
      barn: '임신사B',
      due_date: '2026-03-20',
      status: 'DUE_SOON',
      born_alive: null,
      stillborn: null
    },
    {
      sow_id: 'sow-089',
      ear_tag: 'A-089',
      parity: 4,
      gestation_day: 110,
      barn: '임신사A',
      due_date: '2026-03-23',
      status: 'UPCOMING',
      born_alive: null,
      stillborn: null
    },
    {
      sow_id: 'sow-018b',
      ear_tag: 'B-018',
      parity: 5,
      gestation_day: 114,
      barn: '분만사B',
      due_date: '2026-03-19',
      status: 'COMPLETED',
      born_alive: 12,
      stillborn: 1
    }
  ],

  alerts: [
    {
      id: 'alert-001',
      type: 'FARROWING_OVERDUE',
      severity: 'CRITICAL',
      title: '#A-042 분만 지연',
      message: '모돈 A-042 (3산차)가 임신 115일로 예정일(D114)을 초과했습니다. 즉시 수의사 확인이 필요합니다.',
      created_at: '2026-03-19T06:00:00+09:00',
      read_at: null
    },
    {
      id: 'alert-002',
      type: 'TEMPERATURE_ABNORMAL',
      severity: 'CRITICAL',
      title: '분만사B 온도 이상',
      message: '분만사B 3번 구역 온도가 32.5°C로 상한선(30°C)을 초과했습니다. 환기 시스템을 확인하세요.',
      created_at: '2026-03-19T05:30:00+09:00',
      read_at: null
    },
    {
      id: 'alert-003',
      type: 'FEED_INTAKE_LOW',
      severity: 'WARNING',
      title: '사료 섭취량 저하 감지',
      message: '임신사A 2열 모돈 5두의 사료 섭취량이 전일 대비 30% 이상 감소했습니다.',
      created_at: '2026-03-19T07:15:00+09:00',
      read_at: null
    },
    {
      id: 'alert-004',
      type: 'PREGNANCY_CHECK_OVERDUE',
      severity: 'WARNING',
      title: '임신감정 미실시 (4두)',
      message: '교배 후 28일 경과된 모돈 4두의 임신감정이 아직 실시되지 않았습니다. A-031, A-044, A-058, A-072.',
      created_at: '2026-03-18T17:00:00+09:00',
      read_at: null
    },
    {
      id: 'alert-005',
      type: 'MORTALITY_SPIKE',
      severity: 'WARNING',
      title: '포유자돈 폐사 증가',
      message: '분만사B에서 지난 48시간 동안 포유자돈 폐사가 7두 발생했습니다. 평균(3두/48h) 대비 133% 증가.',
      created_at: '2026-03-18T14:30:00+09:00',
      read_at: '2026-03-18T15:10:00+09:00'
    },
    {
      id: 'alert-006',
      type: 'VACCINE_SCHEDULE',
      severity: 'INFO',
      title: '백신 접종 예정 알림',
      message: '내일(3/20) 육성사E 후보돈 15두 대상 PCV2 백신 2차 접종이 예정되어 있습니다.',
      created_at: '2026-03-19T08:00:00+09:00',
      read_at: null
    },
    {
      id: 'alert-007',
      type: 'INVENTORY_LOW',
      severity: 'INFO',
      title: '사료 재고 부족 예상',
      message: '현재 사료 재고(임신돈 사료)가 5일분 남았습니다. 발주를 권장합니다.',
      created_at: '2026-03-18T09:00:00+09:00',
      read_at: '2026-03-18T10:20:00+09:00'
    },
    {
      id: 'alert-008',
      type: 'SYSTEM_UPDATE',
      severity: 'INFO',
      title: '시스템 업데이트 완료',
      message: 'PigPlan v2.4.1 업데이트가 완료되었습니다. 새로운 AI 분만 예측 기능이 추가되었습니다.',
      created_at: '2026-03-17T22:00:00+09:00',
      read_at: '2026-03-18T06:05:00+09:00'
    }
  ],

  ai_insights: [
    {
      id: 'insight-001',
      type: 'warning',
      title: '사료 효율 최적화 기회',
      description: '임신사A의 최근 30일 사료 섭취 데이터 분석 결과, 임신 중기(D45-D80) 모돈의 사료 급이량이 권장량 대비 8% 초과하고 있습니다. 체형 점수(BCS) 3.8로 과비 경향이 있습니다.',
      recommendation: '임신 중기 급이량을 2.4kg/일에서 2.2kg/일로 조정하면 월 사료비 약 180만원 절감 및 분만 시 난산율 감소가 예상됩니다.',
      actions: [
        { label: '급이 프로그램 조정', action: 'adjust_feed_program' },
        { label: '상세 분석 보기', action: 'view_feed_analysis' },
        { label: '무시', action: 'dismiss' }
      ]
    },
    {
      id: 'insight-002',
      type: 'prediction',
      title: '다음 주 분만 예측',
      description: 'AI 모델 분석 결과, 3/20~3/26 기간 중 총 14두의 분만이 예측됩니다. 3/22(토)에 5두가 집중되어 분만사 관리 인력 추가 배치가 필요합니다.',
      recommendation: '3/22 분만 집중일에 야간 당직 인력을 1명에서 2명으로 증원하고, 분만사B 5~8번 스톨을 사전 준비하시기 바랍니다.',
      actions: [
        { label: '근무표 조정', action: 'adjust_schedule' },
        { label: '분만 예측 상세', action: 'view_farrowing_forecast' },
        { label: '스톨 배정 확인', action: 'view_stall_assignment' }
      ]
    },
    {
      id: 'insight-003',
      type: 'positive',
      title: 'PSY 목표 달성 궤도',
      description: '최근 6개월 PSY 추이가 꾸준히 상승하여 현재 24.3에 도달했습니다. 이는 전국 평균(21.9) 대비 11% 높으며, 연초 목표(25.0) 달성을 위해 월 0.12 포인트의 추가 개선이 필요합니다.',
      recommendation: '현재 개선 추세(월 +0.15)를 유지하면 2026년 6월까지 PSY 25.0 목표 달성이 가능합니다. 이유 전 폐사율(14.2%→13.0%) 개선에 집중하면 가속화할 수 있습니다.',
      actions: [
        { label: 'PSY 상세 분석', action: 'view_psy_analysis' },
        { label: '폐사율 개선 계획', action: 'view_mortality_plan' },
        { label: '벤치마크 비교', action: 'view_benchmark' }
      ]
    }
  ],

  kpi: {
    current: { psy: 24.3, npd: 38, farrowing_rate: 82.4, pre_weaning_mort: 14.2, sow_mort: 8.2, fcr: 2.68, msy: 22.1 },
    benchmark: { psy: 21.9, npd: 40, farrowing_rate: 80, fcr: 3.26, pre_weaning_mort: 15, sow_mort: 14.5 },
    top10: { psy: 32.5, npd: 30, farrowing_rate: 92, fcr: 2.6 },
    percentile: { psy: 65, npd: 58, farrowing_rate: 55, fcr: 72 }
  },

  kpi_trend: [
    { period: '2025-04', psy: 22.8, npd: 42, farrowing_rate: 79.1, sow_mortality: 9.5, fcr: 2.82 },
    { period: '2025-05', psy: 22.9, npd: 41, farrowing_rate: 79.8, sow_mortality: 9.1, fcr: 2.80 },
    { period: '2025-06', psy: 23.1, npd: 41, farrowing_rate: 80.2, sow_mortality: 9.3, fcr: 2.78 },
    { period: '2025-07', psy: 23.0, npd: 40, farrowing_rate: 79.5, sow_mortality: 8.9, fcr: 2.77 },
    { period: '2025-08', psy: 23.2, npd: 40, farrowing_rate: 80.5, sow_mortality: 8.7, fcr: 2.75 },
    { period: '2025-09', psy: 23.4, npd: 39, farrowing_rate: 81.0, sow_mortality: 8.8, fcr: 2.74 },
    { period: '2025-10', psy: 23.5, npd: 39, farrowing_rate: 81.2, sow_mortality: 8.5, fcr: 2.73 },
    { period: '2025-11', psy: 23.7, npd: 39, farrowing_rate: 81.5, sow_mortality: 8.4, fcr: 2.71 },
    { period: '2025-12', psy: 23.8, npd: 38, farrowing_rate: 81.8, sow_mortality: 8.6, fcr: 2.70 },
    { period: '2026-01', psy: 24.0, npd: 38, farrowing_rate: 82.0, sow_mortality: 8.3, fcr: 2.69 },
    { period: '2026-02', psy: 24.1, npd: 38, farrowing_rate: 82.2, sow_mortality: 8.1, fcr: 2.68 },
    { period: '2026-03', psy: 24.3, npd: 38, farrowing_rate: 82.4, sow_mortality: 8.2, fcr: 2.68 }
  ],

  sow_timeline: [
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'ENTRY',
      parity: 0,
      date: '2023-06-15',
      notes: '후보돈 입식 (LY, 체중 105kg)',
      details: { weight: 105, breed: 'LY', source: '종돈장' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'HEAT_DETECTION',
      parity: 1,
      date: '2024-06-18',
      notes: '1산차 발정 확인',
      details: { method: 'BOAR_EXPOSURE', intensity: 'STRONG' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'MATING',
      parity: 1,
      date: '2024-06-20',
      notes: '1산차 1차 교배',
      details: { boar_id: 'BOAR-D12', method: 'AI', technician: '김진수' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'MATING',
      parity: 1,
      date: '2024-06-21',
      notes: '1산차 2차 교배',
      details: { boar_id: 'BOAR-D12', method: 'AI', technician: '김진수' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'PREGNANCY_CHECK',
      parity: 1,
      date: '2024-07-18',
      notes: '임신 감정 양성 (D28 초음파)',
      details: { method: 'ULTRASOUND', result: 'POSITIVE', day: 28 }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'MOVED',
      parity: 1,
      date: '2024-10-05',
      notes: '분만사 이동',
      details: { from: '임신사A', to: '분만사B', stall: 'B-12' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'FARROWING',
      parity: 1,
      date: '2024-10-12',
      notes: '1산차 분만 (D114)',
      details: { gestation_day: 114, born_alive: 11, stillborn: 2, mummified: 0, total_born: 13, birth_weight_avg: 1.35, duration_hours: 4.2, assisted: false }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'CROSS_FOSTER',
      parity: 1,
      date: '2024-10-13',
      notes: '자돈 균등화 (1두 전출)',
      details: { transferred_out: 1, transferred_in: 0, nursing_count: 10 }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'WEANING',
      parity: 1,
      date: '2024-11-02',
      notes: '1산차 이유 (21일령)',
      details: { weaned_count: 10, lactation_days: 21, litter_weight_avg: 6.2, sow_weight_loss: 18 }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'HEAT_DETECTION',
      parity: 2,
      date: '2025-03-07',
      notes: '2산차 발정 확인',
      details: { method: 'BOAR_EXPOSURE', intensity: 'STRONG' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'MATING',
      parity: 2,
      date: '2025-03-10',
      notes: '2산차 1차 교배',
      details: { boar_id: 'BOAR-D15', method: 'AI', technician: '박영호' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'MATING',
      parity: 2,
      date: '2025-03-11',
      notes: '2산차 2차 교배',
      details: { boar_id: 'BOAR-D15', method: 'AI', technician: '박영호' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'PREGNANCY_CHECK',
      parity: 2,
      date: '2025-04-07',
      notes: '임신 감정 양성 (D28 초음파)',
      details: { method: 'ULTRASOUND', result: 'POSITIVE', day: 28 }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'MOVED',
      parity: 2,
      date: '2025-06-25',
      notes: '분만사 이동',
      details: { from: '임신사A', to: '분만사B', stall: 'B-08' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'FARROWING',
      parity: 2,
      date: '2025-07-02',
      notes: '2산차 분만 (D114)',
      details: { gestation_day: 114, born_alive: 13, stillborn: 1, mummified: 0, total_born: 14, birth_weight_avg: 1.42, duration_hours: 3.5, assisted: false }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'WEANING',
      parity: 2,
      date: '2025-07-23',
      notes: '2산차 이유 (21일령)',
      details: { weaned_count: 12, lactation_days: 21, litter_weight_avg: 6.5, sow_weight_loss: 15 }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'HEAT_DETECTION',
      parity: 3,
      date: '2025-11-20',
      notes: '3산차 발정 확인',
      details: { method: 'BOAR_EXPOSURE', intensity: 'MODERATE' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'MATING',
      parity: 3,
      date: '2025-11-25',
      notes: '3산차 1차 교배',
      details: { boar_id: 'BOAR-D18', method: 'AI', technician: '김진수' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'MATING',
      parity: 3,
      date: '2025-11-26',
      notes: '3산차 2차 교배',
      details: { boar_id: 'BOAR-D18', method: 'AI', technician: '김진수' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'PREGNANCY_CHECK',
      parity: 3,
      date: '2025-12-23',
      notes: '임신 감정 양성 (D28 초음파)',
      details: { method: 'ULTRASOUND', result: 'POSITIVE', day: 28 }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'MOVED',
      parity: 3,
      date: '2026-03-08',
      notes: '분만사 이동',
      details: { from: '임신사A', to: '분만사B', stall: 'B-05' }
    },
    {
      sow_id: 'sow-042',
      ear_tag: 'A-042',
      event: 'GESTATION_CHECK',
      parity: 3,
      date: '2026-03-19',
      notes: '임신 D115 - 분만 지연 (예정일 D114 초과)',
      details: { gestation_day: 115, status: 'OVERDUE', expected_farrowing: '2026-03-15', building: '분만사B' }
    }
  ]
};

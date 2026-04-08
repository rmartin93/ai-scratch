// C:\inetpub\wwwroot\ICSS-Express\src\types\Adjustments.ts
// Corrected to match SQL proc params exactly
// Each type only contains the fields its proc actually accepts (no null junk)

export type DirectAdjBody = {
    activity_type: "Direct";
    adjustment_hdr_id: number;
    category: string;
    type_of_adjustment: string;
    dtl_description: string;
    amount: string;
    point_of_contact: string;
    reverse_in_claim: string;
    file_location: string;
    sector: string;
    fiscal_year: string;
    wbs_rate_segment: string;
    company_code: string;
    costing_sheet_wbs: string;
    overhead_key_wbs: string;
    profit_center: string;
    wbs_element: string;
    project_definition: string;
    pch_l06: string;
    partner_wbs_element: string;
    partner_profit_center: string;
    partner_cost_center: string;
    gl_account: string;
    gl_account_text: string;
    sch_h_grp: string;
    sort_order: string;
    labor_oh: string;
    other: string;
    icom: string;
    burden_type: string;
    segment: string;
};

export type IndirectAdjBody = {
    activity_type: "Indirect";
    adjustment_hdr_id: number;
    category: string;
    type_of_adjustment: string;
    dtl_description: string;
    amount: string;
    point_of_contact: string;
    reverse_in_claim: string;
    file_location: string;
    fiscal_year: string;
    cost_center: string;
    cost_center_level_06: string;
    company_code: string;
    cost_center_rate_segment: string;
    partner_cost_center: string;
    partner_profit_center: string;
    partner_wbs_element: string;
    cost_center_relevant_costs: string;
    gl_account: string;
    gl_account_text: string;
    rollup: string;
    pool_reference: string;
    pool_name: string;
    segment: string;
    schedule: string;
    sort: string;
    receivers_segment: string;
    receivers_schedule: string;
    receivers_pool_reference: string;
    receivers_pool_name: string;
};

export type SkfAdjBody = {
    activity_type: "SKF";
    adjustment_hdr_id: number;
    category: string;
    type_of_adjustment: string;
    dtl_description: string;
    amount: string;
    point_of_contact: string;
    reverse_in_claim: string;
    file_location: string;
    skf: string;
    long_name: string;
    wbs_element_external_id: string;
    cost_center: string;
    segment: string;
    schedule: string;
    pool_name: string;
    pool_reference: string;
    receivers_segment: string;
    receivers_schedule: string;
    receivers_pool_name: string;
    receivers_pool_reference: string;
    gl_account: string;
    gl_account_text: string;
    cost_center_relevant_costs: string;
};

export type AdjBody = DirectAdjBody | IndirectAdjBody | SkfAdjBody;

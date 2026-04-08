// C:\inetpub\wwwroot\ICSS-2025\src\types\Adjustments.ts
// Corrected to match SQL proc params exactly

import { z, type FieldErrors } from "zod"; // adjust import path as needed

/* ---------- Common fields (always required) ---------- */
const baseSchema = z.object({
    adjustment_hdr_id: z.number(),
    activity_type: z.enum(["Direct", "Indirect", "SKF"]),
    category: z.string().min(1, "Category is required"),
    type_of_adjustment: z.string().min(1, "Adjustment type is required"),
    dtl_description: z.string().min(1, "Description is required"),
    amount: z.string().min(1, "Amount is required"),
    point_of_contact: z.string().min(1, "Point of contact is required"),
    reverse_in_claim: z.string().optional(),
    file_location: z.string().min(1, "File location is required"),
});

/* ---------- Direct-custom fields ---------- */
const directSchema = baseSchema.extend({
    activity_type: z.literal("Direct"),
    sector: z.string().min(1, "Sector is required"),
    fiscal_year: z.string().min(1, "Fiscal year is required"),
    wbs_rate_segment: z.string().min(1, "WBS rate segment is required"),
    company_code: z.string().min(1, "Company code is required"),
    costing_sheet_wbs: z.string().min(1, "Costing sheet WBS is required"),
    overhead_key_wbs: z.string().min(1, "Overhead key WBS is required"),
    profit_center: z.string().min(1, "Profit center is required"),
    wbs_element: z.string().min(1, "WBS element is required"),
    project_definition: z.string().min(1, "Project definition is required"),
    pch_l06: z.string().min(1, "PCH L06 is required"),
    partner_wbs_element: z.string().min(1, "Partner WBS element is required"),
    partner_profit_center: z.string().min(1, "Partner profit center is required"),
    partner_cost_center: z.string().min(1, "Partner cost center is required"),
    gl_account: z.string().min(1, "GL account is required"),
    gl_account_text: z.string().min(1, "GL account text is required"),
    sch_h_grp: z.string().min(1, "SCH H GRP is required"),
    sort_order: z.string().min(1, "Sort order is required"),
    labor_oh: z.string().min(1, "Labor OH is required"),
    other: z.string().min(1, "Other is required"),
    icom: z.string().min(1, "ICOM is required"),
    burden_type: z.string().min(1, "Burden type is required"),
    segment: z.string().min(1, "Segment is required"),
});

/* ---------- Indirect-custom fields ---------- */
const indirectSchema = baseSchema.extend({
    activity_type: z.literal("Indirect"),
    fiscal_year: z.string().min(1, "Fiscal year is required"),
    cost_center: z.string().min(1, "Cost center is required"),
    cost_center_level_06: z.string().min(1, "Cost-center level 06 is required"),
    company_code: z.string().min(1, "Company code is required"),
    cost_center_rate_segment: z
        .string()
        .min(1, "Cost-center rate segment is required"),
    partner_cost_center: z.string().min(1, "Partner cost center is required"),
    partner_profit_center: z.string().min(1, "Partner profit center is required"),
    partner_wbs_element: z.string().min(1, "Partner WBS element is required"),
    cost_center_relevant_costs: z
        .string()
        .min(1, "Relevant costs are required"),
    gl_account: z.string().min(1, "GL account is required"),
    gl_account_text: z.string().min(1, "GL account text is required"),
    rollup: z.string().min(1, "Rollup is required"),
    pool_reference: z.string().min(1, "Pool reference is required"),
    pool_name: z.string().min(1, "Pool name is required"),
    segment: z.string().min(1, "Segment is required"),
    schedule: z.string().min(1, "Schedule is required"),
    sort: z.string().min(1, "Sort is required"),
    receivers_segment: z.string().min(1, "Receivers segment is required"),
    receivers_schedule: z.string().min(1, "Receivers schedule is required"),
    receivers_pool_reference: z
        .string()
        .min(1, "Receivers pool reference is required"),
    receivers_pool_name: z.string().min(1, "Receivers pool name is required"),
});

/* ---------- SKF-custom fields ---------- */
const skfSchema = baseSchema.extend({
    activity_type: z.literal("SKF"),
    skf: z.string().min(1, "SKF is required"),
    long_name: z.string().min(1, "Long name is required"),
    wbs_element_external_id: z
        .string()
        .min(1, "WBS element external id is required"),
    cost_center: z.string().min(1, "Cost center is required"),
    segment: z.string().min(1, "Segment is required"),
    schedule: z.string().min(1, "Schedule is required"),
    pool_name: z.string().min(1, "Pool name is required"),
    pool_reference: z.string().min(1, "Pool reference is required"),
    receivers_segment: z.string().min(1, "Receivers segment is required"),
    receivers_schedule: z.string().min(1, "Receivers schedule is required"),
    receivers_pool_name: z.string().min(1, "Receivers pool name is required"),
    receivers_pool_reference: z
        .string()
        .min(1, "Receivers pool reference is required"),
    gl_account: z.string().min(1, "GL account is required"),
    gl_account_text: z.string().min(1, "GL account text is required"),
    cost_center_relevant_costs: z
        .string()
        .min(1, "Relevant costs are required"),
});

/* ---------- Discriminated union ---------- */
export const finalFormCustomSchema = z.discriminatedUnion("activity_type", [
    directSchema,
    indirectSchema,
    skfSchema,
]);

export type FinalFormCustomValues = z.infer<typeof finalFormCustomSchema>;

export type DirectFormErrors = FieldErrors<z.infer<typeof directSchema>>;
export type IndirectFormErrors = FieldErrors<z.infer<typeof indirectSchema>>;
export type SKFFormErrors = FieldErrors<z.infer<typeof skfSchema>>;

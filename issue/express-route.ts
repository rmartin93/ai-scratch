// C:\inetpub\wwwroot\ICSS-Express\src\routes\adjustment.ts
// Corrected route - only the post handler portion
// All .input() calls now match their SQL proc params exactly

function isDirect(body: AdjBody): body is DirectAdjBody {
    return body.activity_type === "Direct";
}
function isIndirect(body: AdjBody): body is IndirectAdjBody {
    return body.activity_type === "Indirect";
}
function isSkf(body: AdjBody): body is SkfAdjBody {
    return body.activity_type === "SKF";
}

router.post(
    "/dtl-insert-custom",
    catchAsync(async (req, res) => {
        const user_id = formatUserString(
            (req.headers["x-iisnode-logon_user"] as string) ?? "",
        );
        const pool = await getPool();
        const body = req.body as AdjBody;
        const proc =
            req.body.activity_type === "Direct"
                ? "[dbo].[adjustment_dtl_direct_custom_insert]"
                : req.body.activity_type === "Indirect"
                  ? "[dbo].[adjustment_dtl_indirect_custom_insert]"
                  : "[dbo].[adjustment_dtl_skf_custom_insert]";

        // Common fields
        const request = pool
            .request()
            .input("user_id", sql.VarChar, user_id)
            .input("adjustment_hdr_id", sql.Int, body.adjustment_hdr_id)
            .input("category", sql.VarChar, body.category)
            .input("type_of_adjustment", sql.VarChar, body.type_of_adjustment)
            .input("dtl_description", sql.VarChar, body.dtl_description)
            .input("amount", sql.VarChar, body.amount)
            .input("point_of_contact", sql.VarChar, body.point_of_contact)
            .input("reverse_in_claim", sql.VarChar, body.reverse_in_claim)
            .input("file_location", sql.VarChar, body.file_location);

        if (isDirect(body)) {
            request
                .input("sector", sql.VarChar, body.sector)
                .input("fiscal_year", sql.VarChar, body.fiscal_year)
                .input("wbs_rate_segment", sql.VarChar, body.wbs_rate_segment)
                .input("company_code", sql.VarChar, body.company_code)
                .input("costing_sheet_wbs", sql.VarChar, body.costing_sheet_wbs)
                .input("overhead_key_wbs", sql.VarChar, body.overhead_key_wbs)
                .input("profit_center", sql.VarChar, body.profit_center)
                .input("wbs_element", sql.VarChar, body.wbs_element)
                .input(
                    "project_definition",
                    sql.VarChar,
                    body.project_definition,
                )
                .input("pch_l06", sql.VarChar, body.pch_l06)
                .input(
                    "partner_wbs_element",
                    sql.VarChar,
                    body.partner_wbs_element,
                )
                .input(
                    "partner_profit_center",
                    sql.VarChar,
                    body.partner_profit_center,
                )
                .input(
                    "partner_cost_center",
                    sql.VarChar,
                    body.partner_cost_center,
                )
                .input("gl_account", sql.VarChar, body.gl_account)
                .input("gl_account_text", sql.VarChar, body.gl_account_text)
                .input("sch_h_grp", sql.VarChar, body.sch_h_grp)
                .input("sort_order", sql.VarChar, body.sort_order)
                .input("labor_oh", sql.VarChar, body.labor_oh)
                .input("other", sql.VarChar, body.other)
                .input("icom", sql.VarChar, body.icom)
                .input("burden_type", sql.VarChar, body.burden_type)
                .input("segment", sql.VarChar, body.segment);
        }

        if (isIndirect(body)) {
            request
                .input("fiscal_year", sql.VarChar, body.fiscal_year)
                .input("cost_center", sql.VarChar, body.cost_center)
                .input(
                    "cost_center_level_06",
                    sql.VarChar,
                    body.cost_center_level_06,
                )
                .input("company_code", sql.VarChar, body.company_code)
                .input(
                    "cost_center_rate_segment",
                    sql.VarChar,
                    body.cost_center_rate_segment,
                )
                .input(
                    "partner_cost_center",
                    sql.VarChar,
                    body.partner_cost_center,
                )
                .input(
                    "partner_profit_center",
                    sql.VarChar,
                    body.partner_profit_center,
                )
                .input(
                    "partner_wbs_element",
                    sql.VarChar,
                    body.partner_wbs_element,
                )
                .input(
                    "cost_center_relevant_costs",
                    sql.VarChar,
                    body.cost_center_relevant_costs,
                )
                .input("gl_account", sql.VarChar, body.gl_account)
                .input("gl_account_text", sql.VarChar, body.gl_account_text)
                .input("rollup", sql.VarChar, body.rollup)
                .input("pool_reference", sql.VarChar, body.pool_reference)
                .input("pool_name", sql.VarChar, body.pool_name)
                .input("segment", sql.VarChar, body.segment)
                .input("schedule", sql.VarChar, body.schedule)
                .input("sort", sql.VarChar, body.sort)
                .input(
                    "receivers_segment",
                    sql.VarChar,
                    body.receivers_segment,
                )
                .input(
                    "receivers_schedule",
                    sql.VarChar,
                    body.receivers_schedule,
                )
                .input(
                    "receivers_pool_reference",
                    sql.VarChar,
                    body.receivers_pool_reference,
                )
                .input(
                    "receivers_pool_name",
                    sql.VarChar,
                    body.receivers_pool_name,
                );
        }

        if (isSkf(body)) {
            request
                .input("skf", sql.VarChar, body.skf)
                .input("long_name", sql.VarChar, body.long_name)
                .input(
                    "wbs_element_external_id",
                    sql.VarChar,
                    body.wbs_element_external_id,
                )
                .input("cost_center", sql.VarChar, body.cost_center)
                .input("segment", sql.VarChar, body.segment)
                .input("schedule", sql.VarChar, body.schedule)
                .input("pool_name", sql.VarChar, body.pool_name)
                .input("pool_reference", sql.VarChar, body.pool_reference)
                .input(
                    "receivers_segment",
                    sql.VarChar,
                    body.receivers_segment,
                )
                .input(
                    "receivers_schedule",
                    sql.VarChar,
                    body.receivers_schedule,
                )
                .input(
                    "receivers_pool_name",
                    sql.VarChar,
                    body.receivers_pool_name,
                )
                .input(
                    "receivers_pool_reference",
                    sql.VarChar,
                    body.receivers_pool_reference,
                )
                .input("gl_account", sql.VarChar, body.gl_account)
                .input("gl_account_text", sql.VarChar, body.gl_account_text)
                .input(
                    "cost_center_relevant_costs",
                    sql.VarChar,
                    body.cost_center_relevant_costs,
                );
        }

        await request.execute(proc);
        res.send({ success: true });
    }),
);
